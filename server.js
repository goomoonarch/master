const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

const apiProxy = createProxyMiddleware({
  target: 'https://paiwebservices.paiweb.gov.co:8081',
  changeOrigin: true,
  pathRewrite: {
    '^/api': '/api/interoperabilidad',
  },
  logLevel: 'debug',
});

app.use('/api', apiProxy);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
