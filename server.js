// Servidor ultra minimalista con función de proxy a n8n
const http = require('http');
const https = require('https');
const url = require('url');

// URL de destino para el webhook de n8n
const N8N_WEBHOOK_URL = 'https://n8npro.johnteamzai.com/webhook/Entrada_datos';

const server = http.createServer((req, res) => {
  // Configurar cabeceras CORS para todo
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  console.log(`${new Date().toISOString()} - Recibida petición: ${req.method} ${req.url}`);
  
  // Manejar preflight OPTIONS
  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }
  
  // Ruta principal
  if (req.url === '/' && req.method === 'GET') {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('Servidor ZetAI funcionando como proxy a n8n');
    return;
  }
  
  // Endpoint de prueba para verificar funcionamiento básico
  if (req.url === '/test' && req.method === 'GET') {
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.end(JSON.stringify({
      message: 'Servidor funcionando correctamente',
      timestamp: new Date().toISOString()
    }));
    return;
  }
  
  // Proxy para n8n
  if (req.url === '/proxy-n8n' && req.method === 'POST') {
    console.log(`${new Date().toISOString()} - Solicitud recibida para reenviar a n8n`);
    let body = '';
    
    // Recoger datos
    req.on('data', chunk => {
      body += chunk.toString();
    });
    
    // Procesar cuando complete
    req.on('end', () => {
      console.log(`${new Date().toISOString()} - Datos a enviar a n8n:`, body);
      
      try {
        // Validar que el cuerpo sea JSON válido
        JSON.parse(body);
      } catch (e) {
        console.error(`${new Date().toISOString()} - ERROR: JSON inválido:`, e.message);
        res.writeHead(400, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({
          message: `Error: JSON inválido - ${e.message}`,
          status: 'error',
          timestamp: new Date().toISOString()
        }));
        return;
      }
      
      // Parsear la URL del webhook n8n
      const parsedUrl = url.parse(N8N_WEBHOOK_URL);
      console.log(`${new Date().toISOString()} - Intentando conectar a: ${parsedUrl.hostname}${parsedUrl.path}`);
      
      // Configurar opciones para la solicitud a n8n
      const options = {
        hostname: parsedUrl.hostname,
        port: 443,
        path: parsedUrl.path,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(body)
        }
      };
      
      // Crear solicitud a n8n
      const proxyReq = https.request(options, proxyRes => {
        console.log(`${new Date().toISOString()} - Respuesta de n8n: ${proxyRes.statusCode}`);
        let proxyData = '';
        
        // Recoger datos de n8n
        proxyRes.on('data', chunk => {
          proxyData += chunk;
        });
        
        // Cuando la respuesta de n8n está completa
        proxyRes.on('end', () => {
          console.log(`${new Date().toISOString()} - Datos recibidos de n8n:`, proxyData);
          
          // Enviar respuesta al cliente
          res.writeHead(proxyRes.statusCode, {'Content-Type': 'application/json'});
          
          // Si hay datos válidos de n8n, los enviamos, si no, enviamos respuesta de respaldo
          if (proxyData) {
            try {
              // Intentar analizar como JSON para validar
              const jsonData = JSON.parse(proxyData);
              res.end(proxyData);
            } catch (e) {
              console.error(`${new Date().toISOString()} - ERROR: Respuesta de n8n no es JSON válido:`, e.message);
              res.end(JSON.stringify({
                message: 'Error al procesar la respuesta de ZetAI',
                original: proxyData,
                status: 'error',
                timestamp: new Date().toISOString()
              }));
            }
          } else {
            res.end(JSON.stringify({
              message: 'No se recibió respuesta de ZetAI',
              status: 'error',
              timestamp: new Date().toISOString()
            }));
          }
        });
      });
      
      // Manejar errores en la solicitud a n8n
      proxyReq.on('error', err => {
        console.error(`${new Date().toISOString()} - ERROR al comunicarse con n8n:`, err.message);
        res.writeHead(500, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({
          message: `Error comunicándose con ZetAI: ${err.message}`,
          status: 'error',
          timestamp: new Date().toISOString()
        }));
      });
      
      // Configurar timeout
      proxyReq.setTimeout(10000, () => {
        console.error(`${new Date().toISOString()} - ERROR: Timeout al conectar con n8n`);
        proxyReq.destroy();
        res.writeHead(504, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({
          message: 'Timeout al conectar con ZetAI',
          status: 'error',
          timestamp: new Date().toISOString()
        }));
      });
      
      // Enviar datos a n8n
      proxyReq.write(body);
      proxyReq.end();
      
      console.log(`${new Date().toISOString()} - Petición enviada a n8n, esperando respuesta...`);
    });
    
    return;
  }
  
  // Endpoint de respaldo simple para pruebas
  if (req.url === '/tu-endpoint' && req.method === 'POST') {
    let body = '';
    
    req.on('data', chunk => {
      body += chunk.toString();
    });
    
    req.on('end', () => {
      console.log(`${new Date().toISOString()} - Mensaje recibido en /tu-endpoint:`, body);
      
      let mensaje = 'sin mensaje';
      try {
        const data = JSON.parse(body);
        mensaje = data.message || mensaje;
      } catch (e) {
        console.error(`${new Date().toISOString()} - Error parseando JSON:`, e);
      }
      
      // Simular una respuesta como la que daría n8n
      res.writeHead(200, {'Content-Type': 'application/json'});
      res.end(JSON.stringify({
        message: `¡Hola! Soy ZetAI. Recibí tu mensaje: "${mensaje}"`,
        status: 'success',
        timestamp: new Date().toISOString()
      }));
    });
    
    return;
  }
  
  // Ruta no encontrada
  res.writeHead(404, {'Content-Type': 'text/plain'});
  res.end('Not Found');
});

// Puerto
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`${new Date().toISOString()} - Servidor funcionando en puerto ${PORT}`);
}); 