require('dotenv').config()
const express = require('express');
const cors = require('cors');
const axios = require('axios');


const app = express();
const PORT = process.env.PORT || 3050;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.status(200).send('Hola carevrg!');
})

app.post('/api/interoperabilidad/GetEPSPersonaMSS', (req, res) => {
    axios.post('https://paiwebservices.paiweb.gov.co:8081/api/interoperabilidad/GetEPSPersonaMSS', req.body)
        .then(response => {
            res.send(response.data);
        })
        .catch(error => {
            console.error('Error en la solicitud:', error.response ? error.response.data : error.message);
            res.status(500).send('Error en el servidor proxy.');
        });        
});

app.listen(PORT, () => {
    console.log(`Proxy server runing on port: ${PORT}`);
});