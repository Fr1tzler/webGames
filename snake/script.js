const fruitTile = "f";
const snakeTile = "s";
const emptyTile = "e";
let mapWidth = 12;
let mapHeight = 12;
let snake = [[0, 0], [0, 1], [0, 2]];
let direction = "right";
let map = generateMap();
let gameEnd = false;


function generateMap() {
    let map = []
    for (let y = 0; y < mapHeight; y++) {
        map.push([]);
        for (let x = 0; x < mapWidth; x++) {
            map[y].push(emptyTile);
        }
    }
    for (var snakePieceId = 0; snakePieceId < snake.length; snakePieceId++) {
        map[snake[snakePieceId][0]][snake[snakePieceId][1]] = snakeTile
    }
    setNextFruit(map);

    return map;
}

function nextState() {
    let snakeHead = snake.slice(snake.length - 1, snake.length);
    switch (direction) {
        case "right":
            snakeHead[0] += 1;
            break;
        case "left":
            snakeHead[0] -= 1;
            break;
        case "up":
            snakeHead[1] -= 1;
            break;
        case "down":
            snakeHead[1] += 1;
            break;
    }

    snakeHead[0] = (snakeHead[0] + mapWidth) % mapWidth;
    snakeHead[1] = (snakeHead[1] + mapHeight) % mapHeight;
    
    switch (map[snakeHead[0]][snakeHead[1]]) {
        case fruitTile:
            snake.push(snakeHead)
            map[snakeHead[0]][snakeHead[1]] = snakeTile;
            map = setNextFruit(map);
            break;
        case snakeTile:
            gameEnd = true;
            alert("FAIL");
            break;
        case emptyTile:
            map[snakeHead[0]][snakeHead[1]] = snakeTile;
            snake.push(snakeHead)
            snake.shift()
            break;
    }
    if (!gameEnd) {
    }
}

// possible infinite loop
function setNextFruit(map) {
    while (true) {
        let fruitY = getRandomInt(mapHeight);
        let fruitX = getRandomInt(mapWidth);
        if (map[fruitY][fruitX] == emptyTile) {
            map[fruitY][fruitX] = fruitTile;
            break;
        }
    }
    return map;
}

function getRandomInt(upperBound) {
    return Math.floor(Math.random() * upperBound);
}

function main() {
    for (let rowId = 0; rowId < map.length; rowId++) {
        let rowContainer = document.createElement("div");
        rowContainer.className = "rowContainer";
        rowContainer.id = "rowContainer" + rowId.toString();
        document.getElementById("field").appendChild(rowContainer);

        let row = document.createElement("div");
        row.className = "row";
        row.id = "row" + rowId.toString();
        rowContainer.appendChild(row);
        for(let columnId = 0; columnId < map[rowId].length; columnId++) {
            let tile = document.createElement("div");
            tile.className = "tile";
            tile.id = "tile_" + rowId.toString() + "_" + columnId.toString();
            row.appendChild(tile);
        }
    }
}

document.addEventListener("DOMContentLoaded", main);