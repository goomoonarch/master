const express = require('express');
const proxy = require('express-http-proxy');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Configura CORS para permitir solicitudes desde cualquier dominio con varios métodos
app.use(cors({
    origin: 'https://goomoonarch.github.io', // Permite todas las origin
    methods: ['GET', 'POST', 'DELETE', 'PUT', 'PATCH', 'OPTIONS', 'HEAD'],
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

// Middleware para modificar las respuestas del proxy
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }
    next();
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto:${PORT}`);
});
