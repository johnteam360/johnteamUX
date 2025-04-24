// Servidor Express simplificado para el chat de ZetAI
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fetch = require('node-fetch'); // Para hacer peticiones HTTP
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

// Endpoint para el chat (versión original)
console.log("--- Definiendo ruta POST /tu-endpoint ---");
app.post('/tu-endpoint', function(request, response) {
  console.log("!!! DENTRO DEL MANEJADOR POST /tu-endpoint !!!");
  // Registrar los datos recibidos (para debugging)
  console.log("Recibí mensaje de chat. Body:", request.body);
  console.log("Headers:", request.headers);
  
  // Extraer el mensaje (podría venir en diferentes formatos)
  let mensaje = "Sin mensaje";
  if (request.body && request.body.message) { // Verifica si existe body y message
    mensaje = request.body.message;
  }
  
  // Simular una respuesta de ZetAI
  response.json({
    message: `¡Hola! Soy ZetAI respondiendo desde Glitch. Recibí tu mensaje: "${mensaje}"`,
    status: "success",
    timestamp: new Date().toISOString()
  });
});

// *** NUEVO ENDPOINT: PROXY PARA N8N ***
console.log("--- Definiendo ruta proxy POST /proxy-chat ---");
app.post('/proxy-chat', async function(request, response) {
  console.log("!!! DENTRO DEL MANEJADOR PROXY PARA N8N !!!");
  
  try {
    // Registrar los datos recibidos para debug
    console.log("Proxy: Recibí mensaje para reenviar a n8n. Body:", request.body);
    
    // Enviar la petición a n8n
    console.log("Proxy: Reenviando petición a:", N8N_WEBHOOK_URL);
    const n8nResponse = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(request.body)
    });
    
    // Verificar si la respuesta es correcta
    if (!n8nResponse.ok) {
      console.error("Proxy: Error al comunicarse con n8n:", n8nResponse.status, n8nResponse.statusText);
      return response.status(500).json({
        message: "Error al comunicarse con el sistema de chat",
        status: "error",
        timestamp: new Date().toISOString()
      });
    }
    
    // Procesar la respuesta de n8n
    const n8nData = await n8nResponse.json();
    console.log("Proxy: Respuesta recibida de n8n:", n8nData);
    
    // Devolver la respuesta al cliente
    response.json(n8nData);
  } catch (error) {
    console.error("Proxy: Error en la comunicación:", error.message);
    response.status(500).json({
      message: "Error en la comunicación con el sistema de chat: " + error.message,
      status: "error",
      timestamp: new Date().toISOString()
    });
  }
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