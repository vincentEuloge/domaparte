require('dotenv').config()
const fetch = require('node-fetch');

const TEMPERATURES_API_URL = process.env.TEMPERATURES_API_URL || '';

async function getTemp(){
    const response = await fetch(TEMPERATURES_API_URL);
    const json = await response.json();
    return json
        .values
        .filter(([sensorName]) => sensorName === "capteur inutilisé")
        .map(([, temperature]) => temperature)
}



const express = require('express')
const app = express()
let port = process.env.PORT;
if (port == null || port == "") {
  port = 8000;
}

app.get('/', async function (req, res) {
    res.send(await getTemp());
})

app.listen(port, function () {
  console.log(`Example app listening on port ${port}`)
})