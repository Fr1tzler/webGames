const https = require('https');
const fs = require('fs');
const url = require('url');
const { parse } = require('querystring');
const mysql = require("mysql");

const dbConnection = mysql.createConnection({
    host: "",
    user: "",
    database: "",
    password: ""
})

const options = {
  key: fs.readFileSync('/etc/letsencrypt/live/fritzler.ru/privkey.pem'),
  cert: fs.readFileSync('/etc/letsencrypt/live/fritzler.ru/cert.pem')
};

https.createServer(options, (request, response) => {
    response.writeHead(200, {
        'Content-Type': 'text/plain',
        'Access-Control-Allow-Origin' : '*',
        'Access-Control-Allow-Methods': 'GET,POST'
    });

    if (request.method == "GET") {
        let mapSize = url.parse(request.url, true).query.mapSize;
        let result = getTopGames(mapSize);
        if (result[0]) {
            response.write(result[1]);
        }
    }
    else if (request.method == "POST") {
        let body = "";
        request.on('data', chunk => {
            body += chunk.toString();
        });
        request.on('end', () => {
            let params = parse(body);
            let mapSize = params.mapSize;
            let username = params.username;
            let score = params.score;
            let result = pushScore(mapSize, username, score);
            if (result) {
                response.write("ok");
            }
        });
    }
    response.end();
}).listen(8000);

function pushScore(mapSize, username, score) {
    if (![12, 18, 24, 32].includes(mapSize)) {
        return false;
    }

}

function getTopGames(mapSize) {
    if (![12, 18, 24, 32].includes(mapSize)) {
        return [false, undefined];
    }
    return [true, "nobody, bro"];
}