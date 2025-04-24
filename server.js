// Servidor ultra minimalista usando solo HTTP nativo
const http = require('http');

const server = http.createServer((req, res) => {
  // Configurar cabeceras CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Manejar solicitud OPTIONS (preflight)
  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }
  
  // Ruta principal
  if (req.url === '/' && req.method === 'GET') {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('Servidor ZetAI funcionando correctamente');
    return;
  }
  
  // Ruta para el endpoint de chat
  if (req.url === '/tu-endpoint' && req.method === 'POST') {
    let body = '';
    
    // Recoger datos del body
    req.on('data', chunk => {
      body += chunk.toString();
    });
    
    // Procesar cuando se complete
    req.on('end', () => {
      console.log('Mensaje recibido:', body);
      
      let mensaje = 'sin mensaje';
      try {
        const data = JSON.parse(body);
        mensaje = data.message || mensaje;
      } catch (e) {
        console.error('Error parseando JSON:', e);
      }
      
      // Respuesta
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
  console.log(`Servidor funcionando en puerto ${PORT}`);
}); 