import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3000; //---> elige un puerto de la variable de entrono global o el 3000

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//<--- CORS ERAseg proxy server ---->//
app.post('/api/interoperabilidad/GetEPSPersonaMSS', async (req, res) => {
    try {
        const regHeaders = new Headers();
        regHeaders.append('Content-Type', 'application/json');
        const regraw = JSON.stringify(req.body);
        const regrequestOptions = { method: 'POST', headers: regHeaders, body: regraw, redirect: 'follow' }
        const response = await fetch('https://paiwebservices.paiweb.gov.co:8081/api/interoperabilidad/GetEPSPersonaMSS', regrequestOptions );
        const result = await response.json();
        res.send(result);
    } catch (e) {
        console.error(e);
        res.status(500).send('error in the proxy server');
    };
});


//<---- Execute the listen port for the server ---->//
app.listen(PORT, () => {
    console.log(`Proxy server running on http://localhost:${PORT}`)
})
