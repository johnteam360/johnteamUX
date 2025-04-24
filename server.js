// Servidor minimalista para el chat
const express = require('express');
const app = express();

// Configuración básica para aceptar JSON y CORS
app.use(express.json());
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// Ruta principal para comprobar que el servidor funciona
app.get('/', function(req, res) {
  res.send('Servidor ZetAI funcionando correctamente');
});

// Endpoint simple para el chat (respuesta directa)
app.post('/tu-endpoint', function(req, res) {
  console.log('Mensaje recibido:', req.body);
  
  // Respuesta simple
  res.json({
    message: `¡Hola! Soy ZetAI. Recibí tu mensaje: "${req.body.message || 'sin mensaje'}"`,
    status: "success",
    timestamp: new Date().toISOString()
  });
});

// Puerto
const listener = app.listen(process.env.PORT, function() {
  console.log('Servidor funcionando en puerto ' + listener.address().port);
}); 