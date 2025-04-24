// Servidor Express simplificado para el chat de ZetAI
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

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
    // Opcional: Registrar headers para más detalles
    // console.log('--> Headers Recibidos:', JSON.stringify(req.headers, null, 2)); 
  }
  next(); // Pasa al siguiente middleware o ruta
});
// ***********************************

// Ruta principal para verificar que el servidor está funcionando
app.get('/', function(request, response) {
  response.send('¡El servidor para ZetAI está funcionando correctamente!');
});

// Endpoint para el chat
console.log("--- Definiendo ruta POST /tu-endpoint ---"); // Log para ver si se define
app.post('/tu-endpoint', function(request, response) {
  console.log("!!! DENTRO DEL MANEJADOR POST /tu-endpoint !!!"); // Log para ver si entra aquí
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