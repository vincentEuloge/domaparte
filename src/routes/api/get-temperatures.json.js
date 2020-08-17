import fetch from 'node-fetch';
import { config } from 'dotenv';

config();

const TEMPERATURES_API_URL = process.env.TEMPERATURES_API_URL || '';

export async function get(req, res, next) {
    console.log("ask info")
    try{
        const response = await fetch(TEMPERATURES_API_URL);
        const json = await response.json();
        const result = json
            .values
            .filter(([sensorName]) => sensorName === "capteur inutilisé")
            .map(([, value, date]) => ({value, date: date.substr(0,19)}));

        res.writeHead(200, {
            'Content-Type': 'application/json'
        });
    
        res.end(JSON.stringify(result));
    }catch(err){

    }
    
}