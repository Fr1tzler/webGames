const https = require('https');
const fs = require('fs');
const url = require('url');
const { parse } = require('querystring');
const mysql = require("mysql");

const dbConnection = mysql.createConnection({
    host: "localhost",
    user: "snake",
    database: "SnakeRecords",
    password: process.argv[2]
})

dbConnection.connect(err => {
    if (err) {
        console.log(err);
        return err;
    }
    else {
        console.log("Database connected.");
    }
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

    switch (request.method) {
        case "POST":
            let body = "";
            request.on("data", chunk => {
                body += chunk.toString();
            })
            request.on("end", () => {
                let requestParams = parse(body);
                let username = requestParams.username;
                let score = requestParams.score;
                let mapSize = requestParams.mapSize;
                pushToDb(username, score, mapSize);
                response.end(JSON.stringify(getTopFromDb(mapSize)));
            })
            break;
        default:
            response.end("ok, maan");
            break;
    }
}).listen(8000);

function pushToDb(username, score, mapSize) {
    if (![12, 18, 24, 32].includes(mapSize)) {
        return;
    }
    let dbQuery = `INSERT records${mapSize}x${mapSize}(playerName, score) VALUES("${username}", ${score});`;
    dbConnection.query(dbQuery, (errors, queryResult, fields) => {
        console.log(errors);
    });
    return;
}

function getTopFromDb(mapSize) {
    let dbQuery = `SELECT playerName, score FROM records${mapSize}x${mapSize} ORDER BY score DESC;`;
    let result = [];
    dbConnection.query(dbQuery, (errors, queryResult, fields) => {
        console.log(errors);
        for (let i = 0; i < Math.min(10, queryResult.length); i++) {
            let username = queryResult[i]["playerName"];
            let score = queryResult[i]["score"];
            result.push({
                'username' : username, 
                "score" : score
            });
        }
    });
    return result;
}