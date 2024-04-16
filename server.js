const express = require('express');
const proxy = require('express-http-proxy');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT;

// Configura CORS para permitir solicitudes desde tu dominio
app.use(cors({
    origin: 'https://goomoonarch.github.io', // Permite solicitudes solo desde este dominio
    methods: ['POST'], // Métodos permitidos
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

// Configura el proxy para redirigir las solicitudes a la API objetivo
app.use('/api', proxy('https://paiwebservices.paiweb.gov.co:8081', {
  proxyReqPathResolver: function(req) {
    return '/api/interoperabilidad/GetEPSPersonaMSS' + req.url;
  },
  proxyReqOptDecorator: function(proxyReqOpts, srcReq) {
    // Configura o modifica las cabeceras necesarias para la API remota aquí
    proxyReqOpts.headers['Origin'] = 'https://paiwebservices.paiweb.gov.co:8081';
    return proxyReqOpts;
  }
}));

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto:${PORT}`);
});

