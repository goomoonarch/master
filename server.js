const express = require('express');
const proxy = require('express-http-proxy');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
    origin: 'https://goomoonarch.github.io',
    methods: ['GET', 'POST', 'DELETE', 'PUT', 'PATCH', 'OPTIONS', 'HEAD'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

app.use('/api', proxy('https://paiwebservices.paiweb.gov.co:8081', {
    proxyReqPathResolver: function(req) {
        return '/api/interoperabilidad/GetEPSPersonaMSS' + req.url;
    },
    proxyReqOptDecorator: function(proxyReqOpts, srcReq) {
        proxyReqOpts.headers['Origin'] = 'https://paiwebservices.paiweb.gov.co:8081';
        proxyReqOpts.headers['Host'] = 'paiwebservices.paiweb.gov.co:8081';
        proxyReqOpts.headers['User-Agent'] = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36';
        return proxyReqOpts;
    }
}));

app.listen(PORT, () => {
    console.log(`Proxy server running on port ${PORT}`);
});
