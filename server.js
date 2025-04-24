// Servidor ultra minimalista con función de proxy a n8n
const http = require('http');
const https = require('https');
const url = require('url');

// URL de destino para el webhook de n8n - ACTUALIZADA
// La URL debe coincidir exactamente con la URL registrada en n8n
const N8N_WEBHOOK_URL = 'https://n8npro.johnteamzai.com/webhook-test/b3d86a61-b8c5-4f70-a2ce-50ff2c062f74';

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
  
  // Determinar si el origen está permitido
  const allowedOrigin = ALLOWED_ORIGINS.includes(origin) ? origin : '*';
  
  // Evitar que se envíen múltiples respuestas a una misma petición
  let responseSent = false;
  
  // Función para enviar respuesta de forma segura
  const sendResponse = (statusCode, contentType, data) => {
    if (!responseSent) {
      responseSent = true;
      res.writeHead(statusCode, {
        'Content-Type': contentType,
        'Access-Control-Allow-Origin': allowedOrigin,
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Accept, Authorization, X-Requested-With',
        'Access-Control-Max-Age': '86400' // 24 horas en segundos
      });
      res.end(data);
    }
  };
  
  // Configurar cabeceras CORS para todo
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
  
  // Endpoint para mensajes simulados (para pruebas sin n8n)
  if (req.url === '/mensaje-simulado' && req.method === 'POST') {
    let body = '';
    
    req.on('data', chunk => {
      body += chunk.toString();
    });
    
    req.on('end', () => {
      try {
        const data = JSON.parse(body);
        const mensaje = data.message || 'sin mensaje';
        
        // Simular respuesta personalizada para pruebas
        sendResponse(200, 'application/json', JSON.stringify({
          message: `¡Hola! Soy ZetAI. He recibido tu mensaje: "${mensaje}". ¿En qué puedo ayudarte hoy?`,
          status: 'success',
          timestamp: new Date().toISOString()
        }));
      } catch (e) {
        sendResponse(400, 'application/json', JSON.stringify({
          message: 'Error en el formato de la solicitud',
          error: e.message,
          status: 'error',
          timestamp: new Date().toISOString()
        }));
      }
    });
    
    return;
  }
  
  // Proxy para n8n
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
        sendResponse(400, 'application/json', JSON.stringify({
          message: 'Error en el formato de la solicitud',
          error: e.message,
          status: 'error',
          timestamp: new Date().toISOString()
        }));
        return;
      }
      
      // Intentar enviar a n8n
      const parsedUrl = url.parse(N8N_WEBHOOK_URL);
      console.log(`[${new Date().toISOString()}] Intentando conectar a: ${parsedUrl.hostname}${parsedUrl.path}`);
      
      const options = {
        hostname: parsedUrl.hostname,
        port: 443,
        path: parsedUrl.path,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(body)
        },
        timeout: 8000 // 8 segundos de timeout
      };
      
      const proxyReq = https.request(options, proxyRes => {
        let proxyData = '';
        
        proxyRes.on('data', chunk => {
          proxyData += chunk;
        });
        
        proxyRes.on('end', () => {
          console.log(`[${new Date().toISOString()}] Respuesta de n8n (${proxyRes.statusCode}): ${proxyData.substring(0, 200)}${proxyData.length > 200 ? '...' : ''}`);
          
          if (proxyData) {
            try {
              // Verificar si es JSON válido
              JSON.parse(proxyData);
              sendResponse(200, 'application/json', proxyData);
            } catch (e) {
              console.error(`[${new Date().toISOString()}] La respuesta de n8n no es JSON válido: ${e.message}`);
              
              // Si no es JSON válido, envolverlo
              sendResponse(200, 'application/json', JSON.stringify({
                message: proxyData,
                status: 'success',
                timestamp: new Date().toISOString()
              }));
            }
          } else {
            console.warn(`[${new Date().toISOString()}] No se recibieron datos de n8n`);
            sendResponse(200, 'application/json', JSON.stringify({
              message: 'No se recibió respuesta de ZetAI',
              status: 'error',
              timestamp: new Date().toISOString()
            }));
          }
        });
      });
      
      proxyReq.on('error', err => {
        console.error(`[${new Date().toISOString()}] Error al conectar con n8n: ${err.message}`);
        
        // Si hay un error en la conexión, enviar un mensaje claro al usuario
        sendResponse(200, 'application/json', JSON.stringify({
          message: `Error al conectar con n8n: ${err.message}. Por favor, verifica la configuración de n8n.`,
          status: 'error',
          timestamp: new Date().toISOString()
        }));
      });
      
      proxyReq.on('timeout', () => {
        console.error(`[${new Date().toISOString()}] Timeout al conectar con n8n`);
        proxyReq.destroy();
        
        // Si hay timeout, enviar un mensaje claro al usuario
        sendResponse(200, 'application/json', JSON.stringify({
          message: 'La conexión con n8n ha excedido el tiempo de espera. Por favor, verifica que n8n esté funcionando correctamente.',
          status: 'error',
          timestamp: new Date().toISOString()
        }));
      });
      
      // Enviar datos a n8n
      console.log(`[${new Date().toISOString()}] Enviando datos a n8n: ${body}`);
      proxyReq.write(body);
      proxyReq.end();
    });
    
    return;
  }
  
  // Cualquier otra ruta - 404
  sendResponse(404, 'text/plain', 'Not Found');
});

// Puerto
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`[${new Date().toISOString()}] Servidor iniciado en puerto ${PORT}`);
});