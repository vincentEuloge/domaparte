import fetch from 'node-fetch';
import { config } from 'dotenv';

import { getDateFormatedParts, getDiffBetweenDates } from '../../helpers/dateHelpers';


config();

const TEMPERATURES_API_URL = process.env.TEMPERATURES_API_URL || '';
const TEMPERATURES_SAMPLING_TIME_MS = 600_000; // 10minutes
const WAITING_TIME_BETWEEN_TWO_API_CALL_MS = 2000; // 2seconds

async function getTemperaturesData(nbRetry){
    try{
        const response = await fetch(TEMPERATURES_API_URL);
        const json = await response.json();

        const currentDate = new Date();
        const lastDataDate = new Date(json.values.slice(-1)[0][0]);

        // the temperatures api don't refresh data if we don' call it, it's a lazy api
        // so we recall api (because the first call wake up and re-calculate data)
        // if the last receive data date is older than TEMPERATURES_SAMPLING_TIME_MS
        if (nbRetry > 0 && getDiffBetweenDates(currentDate, lastDataDate) > TEMPERATURES_SAMPLING_TIME_MS){
            // we wait WAITING_TIME_BETWEEN_TWO_API_CALL_MS seconds
            // to let data clips refresh, and yes, it's totally arbitrairy
            await new Promise((resolve) => setTimeout(resolve, WAITING_TIME_BETWEEN_TWO_API_CALL_MS));
            return getTemperaturesData(nbRetry - 1);
        }

        return json;
    }catch(err){
        return {
            values: []
        };
    }
}

export async function get(req, res, next) {
    try{
        const data = await getTemperaturesData(2)

        const result = data
            .values
            .map(([date,,kitchenTemp,,entranceTemp,, outsideTemp,, couloirTemp]) => {

                // The date have to be normalize (we want paris timezoned date)
                const {day, month, year, hour, minute, second} = getDateFormatedParts(new Date(date));

                return {
                    outsideTemp,
                    entranceTemp,
                    kitchenTemp,
                    couloirTemp,
                    date: `${year}-${month}-${day} ${hour}:${minute}:${second}`
                }
            })

        res.writeHead(200, {
            'Content-Type': 'application/json'
        });
    
        res.end(JSON.stringify(result));
    }catch(err){
        console.log(err)
    }
    
}