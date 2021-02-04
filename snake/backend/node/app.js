const https = require('https');
const fs = require('fs');
const url = require('url');
const { parse } = require('querystring');

/*
const mysql = require("mysql");

const dbConnection = mysql.createConnection({
    host: "",
    user: "",
    database: "",
    password: ""
})
*/

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

    switch (request.method) {
        case "POST":
            let body = "";
            request.on("data", chunk => {
                body += chunk.toString();
            })
            request.on("end", () => {
                let params = parse(body);
                let username = params.username;
                let score = params.score;
                let mapSize = params.mapSize;
                pushToDb(username, score, mapSize);
                response.end(JSON.stringify(getTopFromDb(mapSize)));
            })
            break;
        default:
            break;
    }
    response.end("");
}).listen(8000);

function pushToDb(username, score, mapSize) {
    if (![12, 18, 24, 32].includes(mapSize)) {
        return;
    }
    return;
}

function getTopFromDb(mapSize) {
    return [
        {'username' : "a", 'score' : 10},
        {'username' : "b", 'score' : 9},
        {'username' : "c", 'score' : 8},
        {'username' : "d", 'score' : 7},
        {'username' : "e", 'score' : 6},
        {'username' : "f", 'score' : 5},
        {'username' : "g", 'score' : 4},
        {'username' : "h", 'score' : 3},
        {'username' : "i", 'score' : 2},
        {'username' : "j", 'score' : 1},
    ];
}