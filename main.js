const http = require('http');
const {BRIDGE_IP, HUE_KEY} = require("./domaparte.conf.json");


http.get(`http://${BRIDGE_IP}/api/${HUE_KEY}/sensors`, (resp) => {
  let data = '';

  // A chunk of data has been recieved.
  resp.on('data', (chunk) => {
    data += chunk;
  });

  // The whole response has been received. Print out the result.
  resp.on('end', () => {
    const result = Object.values(JSON.parse(data));

    const temperatureSensor = result
      .filter(({type}) => type === "ZLLTemperature")
      .map(({uniqueid, state: {temperature}}) => ({uniqueid, temperature}));

    const namedtemperatureSensor = temperatureSensor
      .map(({uniqueid, temperature}) => {
        sensorName = result
          .find(({uniqueid: presenceUniqueId, type}) => 
            presenceUniqueId && type === "ZLLPresence" && presenceUniqueId.includes(uniqueid.slice(0,-1))
          ).name;
        
          return {uniqueid, temperature, name: sensorName}
      });

    console.log(namedtemperatureSensor)
  });

}).on("error", (err) => {
  console.log("Error: " + err.message);
});

const express = require('express')
const app = express()
let port = process.env.PORT;
if (port == null || port == "") {
  port = 8000;
}

app.get('/', function (req, res) {
  res.send('Hello World!')
})

app.listen(port, function () {
  console.log(`Example app listening on port ${port}`)
})