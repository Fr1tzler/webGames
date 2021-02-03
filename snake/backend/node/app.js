const http = require("http");
const url = require("url");
const mysql = require("mysql");

const possibleFieldSizes = [12, 18, 24, 32];


http.createServer((request, response) => {
    response.end("response");
}).listen(3000);


function writeToDatabase(fieldSize, username, score) {
    if (!possibleFieldSizes.includes(fieldSize)) {
        return;
    }

}

function getTopTen(fieldSize) {
    return;
}


function getUserPosition(fieldSize) {
    return;
}