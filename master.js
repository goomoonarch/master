import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import codes from './codes.json' assert { type: 'json' };

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000; //---> elige un puerto de la variable de entrono global o el 3000
const allowedOrigins = [`http://localhost:${PORT}`, 'http://localhost:5174', 'https://goomoonarch.github.io'];

app.use(cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Upgrade-Insecure-Requests']
  }));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

//<--- CORS ERAseg proxy server ---->//
app.post('/api/interoperabilidad/GetEPSPersonaMSS', async (req, res) => {
    try {
        const regHeaders = new Headers();
        regHeaders.append('Content-Type', 'application/json');
        const regraw = JSON.stringify(req.body);
        const regrequestOptions = { method: 'POST', headers: regHeaders, body: regraw, redirect: 'follow' }
        const response = await fetch('https://paiwebservices.paiweb.gov.co:8081/api/interoperabilidad/GetEPSPersonaMSS', regrequestOptions, { timeout: 8000 } );
        const result = await response.json();
        res.status(200).send(result);
    } catch (e) {
        console.error(e);
        res.status(500).send(e, 'error in the CORS proxy server');
    };
});

//<---- Nueva EPS Eraseg Autienthicator proxy ---->//
app.get('/nuevaeps/proxy/*', async(req, res) => {
    try {
        const tid = req.query.tipoDocumento;
        const number = req.query.numeroDocumento;
        const tidCode = codes[tid];
        const targetURL = `https://herramientas.nuevaeps.com.co/${req.params[0]}?t=V_AFILIADO_POS&z_AFI_TID_CODIGO=%3D&x_AFI_TID_CODIGO=${tidCode}&z_AFI_IDENTIFIC=%3D&x_AFI_IDENTIFIC=${number}&z_REGIMEN=LIKE&x_REGIMEN=&Submit=Buscar+%28*%29`;
        const nuevaHeaders = new Headers();
        nuevaHeaders.append('Cookie', 'ofvirtual[AutoLogin]=autologin; ofvirtual[Checksum]=-1731695152; ofvirtual[Password]=PW7vIpBD_LPjuizQ_kYATQ..; ofvirtual[Username]=usk-ZMxsCCDo-0-q6ViuCQ..; __cf_bm=7RqI3A888KVYWJdshHEbpyi7KuA8YoR10sLcb4NSFAs-1710552692-1.0.1.1-I0FCj3aoZA8L_NwatzmenbBszia.YetedvJzU6Lfalpya60w6GsYapZqQZiVMRZtJ.s_Kg_yPqReMAYGv31Hmw; PHPSESSID=ljervd7mjgh27ndc37cpb96945'
          );
          const nueavarequestOptions = {
            method: 'GET',
            headers: nuevaHeaders,
            redirect: 'follow',
          };
        const response = await fetch(targetURL, nueavarequestOptions);
        const result = await response.text();
        res.status(200).send(result);
    } catch (e) {
        console.error(e);
        res.status(500).send('error in the NuevaEPS proxy auth');
    }
})

//<---- Execute the listen port for the server ---->//
app.listen(PORT, () => {
    console.log(`Proxy server running on port:${PORT}`);
})
