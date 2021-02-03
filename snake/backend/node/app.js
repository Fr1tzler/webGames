const https = require('https');
const fs = require('fs');

const options = {
  key: fs.readFileSync('/etc/letsencrypt/live/fritzler.ru/privkey.pem'),
  cert: fs.readFileSync('/etc/letsencrypt/live/fritzler.ru/cert.pem')
};

https.createServer(options, (request, response) => {
    response.writeHead(200, {
    'Content-Type': 'text/plain',
    'Access-Control-Allow-Origin' : '*',
    'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE'
});
    response.end("response");
}).listen(8000);