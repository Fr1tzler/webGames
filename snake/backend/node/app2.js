const http = require("http");
const url = require("url");
const { parse } = require("querystring"); 

http.createServer((request, response) =>{
    switch (request.method) {
        case "GET":
            let mapSize = url(request.url).query.mapSize;
            response.end.parse(JSON.stringify(getTopGames(mapSize)));
            break;
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
                writeToDb(username, score, mapSize);
                response.end("ok");
            })
            break;
        default:
            break;
    }
}).listen(3000);

function getTopGames(mapSize) {
    return [
        {'username' : "a", 'score' : 4},
        {'username' : "b", 'score' : 5},
        {'username' : "c", 'score' : 6},
    ];
}

function writeToDb(username, score, mapSize) {
    if (![12, 18, 24, 32].includes(mapSize)) {
        return;
    }
    return;
}
