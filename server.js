// Servidor ultra minimalista con función de proxy a n8n
const http = require('http');
const https = require('https');
const url = require('url');

// URL de destino para el webhook de n8n - RESTAURADA A LA ORIGINAL
const N8N_WEBHOOK_URL = 'https://n8npro.johnteamzai.com/webhook/Entrada_datos';

// Lista de dominios permitidos
const ALLOWED_ORIGINS = [
  'https://johnteamzai.com',
  'https://www.johnteamzai.com',
  'http://johnteamzai.com',
  'http://www.johnteamzai.com',
  'http://localhost:3000',
  'http://127.0.0.1:3000'
];

// Crear servidor HTTP
const server = http.createServer((req, res) => {
  // Registrar cada petición
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  
  // Obtener el origen de la solicitud
  const origin = req.headers.origin || '';
  
  // Determinar si el origen está permitido - SIEMPRE PERMITIR PARA DEPURACIÓN
  const allowedOrigin = '*'; // Permitir todos los orígenes para depuración
  
  // Función para enviar respuesta con CORS amplio para depuración
  const sendResponse = (statusCode, contentType, data) => {
    res.writeHead(statusCode, {
      'Content-Type': contentType,
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT, DELETE',
      'Access-Control-Allow-Headers': '*',
      'Access-Control-Max-Age': '86400'
    });
    res.end(data);
  };
  
  // Manejar preflight OPTIONS de forma permisiva
  if (req.method === 'OPTIONS') {
    sendResponse(204, 'text/plain', '');
    return;
  }
  
  // Ruta principal - Página de inicio
  if ((req.url === '/' || req.url === '/index.html') && req.method === 'GET') {
    sendResponse(200, 'text/html', `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Servidor ZetAI</title>
        <style>
          body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
          h1 { color: #4a69bd; }
          .status { padding: 10px; background-color: #dff9fb; border-radius: 4px; }
        </style>
      </head>
      <body>
        <h1>Servidor ZetAI</h1>
        <div class="status">
          <p>✅ Servidor ZetAI funcionando correctamente</p>
          <p>Este servidor actúa como proxy para las comunicaciones entre la web y n8n.</p>
          <p>Hora del servidor: ${new Date().toLocaleString()}</p>
          <p>URL de webhook configurada: ${N8N_WEBHOOK_URL}</p>
        </div>
      </body>
      </html>
    `);
    return;
  }
  
  // Endpoint de prueba/status
  if (req.url === '/status' && req.method === 'GET') {
    sendResponse(200, 'application/json', JSON.stringify({
      status: 'ok',
      message: 'Servidor ZetAI funcionando correctamente',
      webhook_url: N8N_WEBHOOK_URL,
      timestamp: new Date().toISOString()
    }));
    return;
  }
  
  // Proxy para n8n - simplificado y con mejor manejo de errores
  if ((req.url === '/proxy-n8n' || req.url === '/tu-endpoint') && req.method === 'POST') {
    console.log(`[${new Date().toISOString()}] Solicitud recibida para reenviar a n8n`);
    
    let body = '';
    
    req.on('data', chunk => {
      body += chunk.toString();
    });
    
    req.on('end', () => {
      // Parsear body como JSON
      let parsedBody;
      try {
        parsedBody = JSON.parse(body);
        console.log(`[${new Date().toISOString()}] Mensaje recibido: ${parsedBody.message}`);
      } catch (e) {
        console.error(`[${new Date().toISOString()}] Error parseando JSON: ${e.message}`);
        sendResponse(200, 'application/json', JSON.stringify({
          message: 'Error en el formato de la solicitud',
          error: e.message,
          status: 'error'
        }));
        return;
      }
      
      // Reenviar a n8n directamente
      console.log(`[${new Date().toISOString()}] Reenviando a: ${N8N_WEBHOOK_URL}`);
      
      // Hacemos una solicitud fetch directa usando https para mejor control de errores
      const parsedUrl = url.parse(N8N_WEBHOOK_URL);
      
      // Preparamos los datos para n8n
      const postData = JSON.stringify({
        message: parsedBody.message,
        interaction: parsedBody.interaction || 'chat',
        timestamp: new Date().toISOString(),
        source: parsedBody.source || 'chat_widget',
        userAgent: req.headers['user-agent'] || 'unknown'
      });
      
      const options = {
        hostname: parsedUrl.hostname,
        port: 443,
        path: parsedUrl.path,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(postData),
          'User-Agent': 'ZetAI-Proxy/1.0',
          'Accept': 'application/json'
        },
        timeout: 10000
      };
      
      // Crear la solicitud a n8n
      const proxyReq = https.request(options, (proxyRes) => {
        let responseData = '';
        
        // Recopilar los datos de respuesta
        proxyRes.on('data', (chunk) => {
          responseData += chunk;
        });
        
        // Cuando la respuesta esté completa
        proxyRes.on('end', () => {
          console.log(`[${new Date().toISOString()}] Respuesta de n8n: ${proxyRes.statusCode}`);
          
          if (responseData) {
            console.log(`[${new Date().toISOString()}] Datos recibidos de n8n: ${responseData}`);
            
            // Intentar analizar como JSON
            try {
              const jsonResponse = JSON.parse(responseData);
              // Enviar la respuesta tal cual
              sendResponse(200, 'application/json', responseData);
            } catch (err) {
              // Si no es JSON, envolver en un objeto JSON
              sendResponse(200, 'application/json', JSON.stringify({
                message: responseData,
                status: 'success'
              }));
            }
          } else {
            // Si no hay datos, enviar un mensaje de error
            sendResponse(200, 'application/json', JSON.stringify({
              message: 'La IA está ocupada. Por favor, inténtalo de nuevo en unos momentos.',
              status: 'error'
            }));
          }
        });
      });
      
      // Manejar errores en la solicitud
      proxyReq.on('error', (err) => {
        console.error(`[${new Date().toISOString()}] Error en la solicitud a n8n: ${err.message}`);
        sendResponse(200, 'application/json', JSON.stringify({
          message: 'Error en la comunicación con la IA. Por favor, inténtalo de nuevo más tarde.',
          status: 'error',
          error: err.message
        }));
      });
      
      // Timeout
      proxyReq.on('timeout', () => {
        console.error(`[${new Date().toISOString()}] Timeout en la solicitud a n8n`);
        proxyReq.destroy();
        sendResponse(200, 'application/json', JSON.stringify({
          message: 'La IA está tardando demasiado en responder. Por favor, inténtalo de nuevo más tarde.',
          status: 'error',
          error: 'timeout'
        }));
      });
      
      // Enviar los datos
      proxyReq.write(postData);
      proxyReq.end();
    });
    
    return;
  }
  
  // Para cualquier otra ruta
  sendResponse(404, 'text/plain', 'Not found');
});

// Puerto
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`[${new Date().toISOString()}] Servidor iniciado en puerto ${PORT}`);
});