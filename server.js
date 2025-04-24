// Servidor Express simplificado para el chat de ZetAI
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const https = require('https'); // Módulo nativo de Node.js
const app = express();

// URL del webhook de n8n
const N8N_WEBHOOK_URL = 'https://n8npro.johnteamzai.com/webhook/Entrada_datos';

// Configuración de middleware
app.use(cors({
  origin: '*',
  methods: ['POST', 'GET', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Configuración para procesar datos en diferentes formatos
app.use(bodyParser.json()); // Para JSON
app.use(bodyParser.urlencoded({ extended: true })); // Para formularios HTML

// *** Middleware de Registro Adicional ***
app.use((req, res, next) => {
  console.log(`--> Petición entrante: ${req.method} ${req.path}`);
  if (req.path === '/tu-endpoint' && req.method === 'POST') {
    console.log('--> Intento de llegar al manejador POST /tu-endpoint');
  }
  if (req.path === '/proxy-chat' && req.method === 'POST') {
    console.log('--> Intento de llegar al manejador proxy para n8n');
  }
  next(); // Pasa al siguiente middleware o ruta
});
// ***********************************

// Ruta principal para verificar que el servidor está funcionando
app.get('/', function(request, response) {
  response.send('¡El servidor para ZetAI está funcionando correctamente!');
});

// *** ENDPOINT PROXY PARA N8N (USANDO HTTPS NATIVO) ***
console.log("--- Definiendo ruta proxy POST /proxy-chat ---");
app.post('/proxy-chat', function(request, response) {
  console.log("!!! DENTRO DEL MANEJADOR PROXY PARA N8N !!!");
  console.log("Proxy: Datos recibidos:", request.body);
  
  // Si no hay mensaje, responder con error
  if (!request.body || !request.body.message) {
    return response.status(400).json({
      message: "No se recibió un mensaje válido",
      status: "error",
      timestamp: new Date().toISOString()
    });
  }
  
  try {
    // Parsear la URL para obtener host y path
    const urlParts = new URL(N8N_WEBHOOK_URL);
    
    // Preparar los datos para enviar a n8n
    const postData = JSON.stringify(request.body);
    
    // Opciones para la petición HTTPS
    const options = {
      hostname: urlParts.hostname,
      port: 443, // HTTPS
      path: urlParts.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      },
      timeout: 10000 // 10 segundos de timeout
    };
    
    console.log("Proxy: Configurando petición a:", urlParts.hostname, urlParts.pathname);
    
    // Crear la petición a n8n
    const proxyReq = https.request(options, (proxyRes) => {
      console.log(`Proxy: Respuesta recibida con status: ${proxyRes.statusCode}`);
      
      // Si hubo un error en n8n
      if (proxyRes.statusCode !== 200) {
        console.error("Proxy: Error en la respuesta de n8n:", proxyRes.statusCode);
        
        // Respuesta de fallback en caso de error
        return response.status(500).json({
          message: "¡Hola! Estoy teniendo problemas para procesar tu mensaje en este momento. ¿Podrías intentarlo de nuevo?",
          status: "error",
          timestamp: new Date().toISOString()
        });
      }
      
      // Recoger los datos de la respuesta
      let rawData = '';
      proxyRes.on('data', (chunk) => { rawData += chunk; });
      
      // Cuando la respuesta está completa
      proxyRes.on('end', () => {
        try {
          // Intentar parsear la respuesta como JSON
          const parsedData = JSON.parse(rawData);
          console.log("Proxy: Datos recibidos de n8n:", parsedData);
          
          // Enviar la respuesta al cliente
          response.json(parsedData);
        } catch (e) {
          console.error("Proxy: Error al parsear JSON de respuesta:", e.message);
          
          // Si no se puede parsear, enviar respuesta de error
          response.status(500).json({
            message: "Error al procesar la respuesta del chat",
            status: "error",
            timestamp: new Date().toISOString()
          });
        }
      });
    });
    
    // Manejar errores de la petición
    proxyReq.on('error', (e) => {
      console.error("Proxy: Error de conexión a n8n:", e.message);
      
      // Respuesta de fallback en caso de error de conexión
      response.status(200).json({
        message: `¡Hola! Soy ZetAI (respuesta desde Glitch). Recibí tu mensaje: "${request.body.message}" pero tuve problemas para procesarlo.`,
        status: "success",
        timestamp: new Date().toISOString()
      });
    });
    
    // Manejar timeout
    proxyReq.on('timeout', () => {
      console.error("Proxy: Timeout en la conexión a n8n");
      proxyReq.destroy();
      
      // Respuesta de fallback en caso de timeout
      response.status(200).json({
        message: `¡Hola! Soy ZetAI asistente virtual. En este momento estoy tardando más de lo normal en responder. Tu mensaje fue: "${request.body.message}"`,
        status: "success",
        timestamp: new Date().toISOString()
      });
    });
    
    // Enviar los datos a n8n
    proxyReq.write(postData);
    proxyReq.end();
    
  } catch (error) {
    console.error("Proxy: Error en el manejo del proxy:", error.message);
    
    // Respuesta de fallback en caso de error general
    response.status(200).json({
      message: `¡Hola! Soy ZetAI respondiendo desde Glitch. Recibí tu mensaje: "${request.body.message}" pero tuve un problema técnico.`,
      status: "success",
      timestamp: new Date().toISOString()
    });
  }
});

// Endpoint para pruebas simples (sin n8n)
app.post('/tu-endpoint', function(request, response) {
  console.log("!!! DENTRO DEL MANEJADOR POST /tu-endpoint !!!");
  console.log("Recibí mensaje de chat. Body:", request.body);
  
  // Extraer el mensaje
  let mensaje = "Sin mensaje";
  if (request.body && request.body.message) {
    mensaje = request.body.message;
  }
  
  // Simular una respuesta de ZetAI
  response.json({
    message: `¡Hola! Soy ZetAI respondiendo desde Glitch. Recibí tu mensaje: "${mensaje}"`,
    status: "success",
    timestamp: new Date().toISOString()
  });
});

// Endpoint para el formulario
app.post('/formulario-endpoint', function(request, response) {
  console.log("Recibí datos de formulario:", request.body);
  
  // Respuesta para el formulario
  response.json({
    message: "Formulario recibido correctamente",
    status: "success"
  });
});

// Puerto donde escucha el servidor
const listener = app.listen(process.env.PORT, function() {
  console.log('Servidor ZetAI funcionando en el puerto ' + listener.address().port);
}); 