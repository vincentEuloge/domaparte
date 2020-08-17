import fetch from 'node-fetch';
import { config } from 'dotenv';

config();

const TEMPERATURES_API_URL = process.env.TEMPERATURES_API_URL || '';

export async function get(req, res, next) {
    try{
        const response = await fetch(TEMPERATURES_API_URL);
        const json = await response.json();

        const options = {year: "numeric", month: "numeric", day: "numeric",
           hour: "numeric", minute: "numeric", second: "numeric", timeZone: 'Europe/Paris'};
        const dateFormat = new Intl.DateTimeFormat("default", options);

        const result = json
            .values
            .map(([date,,,,,, value]) => {
                return {value, date: dateFormat.format(new Date(date))}
            })

        res.writeHead(200, {
            'Content-Type': 'application/json'
        });
    
        res.end(JSON.stringify(result));
    }catch(err){
        console.log(err)
    }
    
}