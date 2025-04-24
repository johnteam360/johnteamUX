// Servidor ultra minimalista con función de proxy a n8n
const http = require('http');
const https = require('https');
const url = require('url');

// URL de destino para el webhook de n8n
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
      
      // En la versión de prueba, enviamos una respuesta inmediata simulada
      // hasta que n8n esté funcionando correctamente
      console.log(`[${new Date().toISOString()}] Enviando respuesta simulada (hasta que n8n esté configurado)`);
      
      const userMessage = parsedBody.message || '';
      
      // Crear respuesta basada en el mensaje recibido
      let respuesta;
      if (userMessage.toLowerCase().includes('hola') || userMessage.toLowerCase().includes('hi')) {
        respuesta = "¡Hola! Soy ZetAI, tu asistente de automatización. ¿En qué puedo ayudarte hoy?";
      } else if (userMessage.toLowerCase().includes('gracias') || userMessage.toLowerCase().includes('thanks')) {
        respuesta = "¡De nada! Estoy aquí para ayudarte con tus necesidades de automatización.";
      } else if (userMessage.toLowerCase().includes('ayuda') || userMessage.toLowerCase().includes('help')) {
        respuesta = "Puedo ayudarte a automatizar procesos como: envío de emails, notificaciones, gestión de leads, y más. ¿Qué te gustaría automatizar?";
      } else if (userMessage.toLowerCase().includes('precio') || userMessage.toLowerCase().includes('cost')) {
        respuesta = "Ofrecemos planes flexibles adaptados a tus necesidades. Puedes contactarnos para obtener más información sobre precios.";
      } else {
        respuesta = `He recibido tu mensaje: "${userMessage}". Para conocer cómo puedo ayudarte con automatización, háblame sobre tu negocio o los procesos que quieres mejorar.`;
      }
      
      sendResponse(200, 'application/json', JSON.stringify({
        message: respuesta,
        status: 'success',
        timestamp: new Date().toISOString()
      }));
      
      // Comentado el envío a n8n hasta resolver los problemas de conexión
      /*
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
        timeout: 5000 // 5 segundos de timeout
      };
      
      const proxyReq = https.request(options, proxyRes => {
        let proxyData = '';
        
        proxyRes.on('data', chunk => {
          proxyData += chunk;
        });
        
        proxyRes.on('end', () => {
          console.log(`[${new Date().toISOString()}] Respuesta de n8n: ${proxyRes.statusCode}`);
          
          if (proxyData) {
            try {
              // Verificar si es JSON válido
              JSON.parse(proxyData);
              sendResponse(200, 'application/json', proxyData);
            } catch (e) {
              // Si no es JSON válido, envolverlo
              sendResponse(200, 'application/json', JSON.stringify({
                message: proxyData,
                status: 'success',
                timestamp: new Date().toISOString()
              }));
            }
          } else {
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
        sendResponse(200, 'application/json', JSON.stringify({
          message: `En este momento no puedo procesar tu solicitud. Error: ${err.message}`,
          status: 'error',
          timestamp: new Date().toISOString()
        }));
      });
      
      proxyReq.on('timeout', () => {
        console.error(`[${new Date().toISOString()}] Timeout al conectar con n8n`);
        proxyReq.destroy();
        sendResponse(200, 'application/json', JSON.stringify({
          message: 'Lo siento, el servicio está tardando demasiado en responder. Inténtalo de nuevo más tarde.',
          status: 'error',
          timestamp: new Date().toISOString()
        }));
      });
      
      proxyReq.write(body);
      proxyReq.end();
      */
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