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

// Ruta principal para verificar que el servidor está funcionando
app.get('/', function(request, response) {
  response.send('¡El servidor para ZetAI está funcionando correctamente!');
});

// Endpoint para el chat
app.post('/tu-endpoint', function(request, response) {
  // Registrar los datos recibidos (para debugging)
  console.log("Recibí mensaje de chat. Body:", request.body);
  console.log("Headers:", request.headers);
  
  // Extraer el mensaje (podría venir en diferentes formatos)
  let mensaje = "Sin mensaje";
  if (request.body) {
    mensaje = request.body.message || request.body.mensaje || mensaje;
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