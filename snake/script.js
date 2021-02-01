const fruitTile = "f";
const snakeTile = "s";
const emptyTile = "e";
let mapWidth = 12;
let mapHeight = 12;
let snake = [[0, 0], [0, 1], [0, 2]];
let direction = "right";
let map = generateMap();
let gameEnd = false;
let viewTimer;
let modelTimer;
let deltaTime;
let gamePaused = false;


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
    let snakeHeadY = snake[snake.length - 1][0];
    let snakeHeadX = snake[snake.length - 1][1];
    switch (direction) {
        case "right":
            snakeHeadX += 1;
            break;
        case "left":
            snakeHeadX -= 1;
            break;
        case "up":
            snakeHeadY -= 1;
            break;
        case "down":
            snakeHeadY += 1;
            break;
    }
    
    snakeHeadX = (snakeHeadX + mapWidth) % mapWidth;
    snakeHeadY = (snakeHeadY + mapHeight) % mapHeight;
    switch (map[snakeHeadY][snakeHeadX]) {
        case fruitTile:
            map[snakeHeadY][snakeHeadX] = snakeTile;
            snake.push([snakeHeadY, snakeHeadX]);
            map = setNextFruit(map);
            document.getElementById("score").innerText = "score: " + snake.length.toString();
            break;
        case snakeTile:
            gameEnd = true;
            alert("FAIL");
            break;
        case emptyTile:
            map[snakeHeadY][snakeHeadX] = snakeTile;
            snake.push([snakeHeadY, snakeHeadX]);
            let snakeEnd = snake.shift();
            map[snakeEnd[0]][snakeEnd[1]] = emptyTile;
            break;
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
    deltaTime = 100;
    generateTiles();
    resizeMap()
    update();
}

function update() {
    if (gamePaused) {
        viewTimer = setTimeout(update, 50);
        return;
    }
    nextState();
    drawMap();
    if (!gameEnd) {
        deltaTime = 100 * (mapWidth * mapHeight - snake.length) / (mapWidth * mapHeight);
        viewTimer = setTimeout(update, deltaTime);
    }
}

function drawMap() {
    for (let y = 0; y < mapHeight; y++) {
        for (let x = 0; x < mapWidth; x++) {
            let color = "grey";
            switch (map[y][x]) {
                case fruitTile:
                    color = "white";
                    break;
                case snakeTile:
                    color = "white";
                    break;
                case emptyTile:
                    break;
                default:
                    break;
            }
            document.getElementById("tile_" + y.toString() + "_" + x.toString()).style.backgroundColor = color;
        }
    }
}

function resizeMap() {
    let squareSize = Math.min(window.innerHeight, window.innerWidth) * 0.9;
    document.getElementById("field").style.height = squareSize + "px";
    document.getElementById("field").style.width = squareSize + "px";
    for (let rowId = 0; rowId < mapHeight; rowId++) {
        document.getElementById("rowContainer_" + rowId.toString()).style.width = Math.floor(squareSize) + "px";
        document.getElementById("rowContainer_" + rowId.toString()).style.height = Math.floor(squareSize / mapHeight) + "px";
        document.getElementById("row_" + rowId.toString()).style.width = Math.floor(squareSize) + "px";
        document.getElementById("row_" + rowId.toString()).style.height = Math.floor(squareSize / mapHeight) + "px";
        for (let columnId = 0; columnId < mapWidth; columnId++) {
            tileId = "tile_" + rowId.toString() + "_" + columnId.toString();
            tile = document.getElementById(tileId);
            tile.style.width = Math.floor(squareSize / mapWidth * 0.8) + "px";
            tile.style.height = Math.floor(squareSize / mapHeight * 0.8) + "px";
            tile.style.marginLeft = Math.floor(squareSize / mapWidth * 0.1) + "px";
            tile.style.marginRight = Math.floor(squareSize / mapWidth * 0.1) + "px";
            tile.style.marginTop = Math.floor(squareSize / mapHeight * 0.1) + "px";
            tile.style.marginBottom = Math.floor(squareSize / mapHeight * 0.1) + "px";
            
        }
    }   
}

function generateTiles() {
    for (let rowId = 0; rowId < map.length; rowId++) {
        let rowContainer = document.createElement("div");
        rowContainer.className = "rowContainer";
        rowContainer.id = "rowContainer_" + rowId.toString();
        document.getElementById("field").appendChild(rowContainer);

        let row = document.createElement("div");
        row.className = "row";
        row.id = "row_" + rowId.toString();
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
window.addEventListener("resize", resizeMap);
document.addEventListener("keydown", function (event) {
    switch (event.code) {
        case "ArrowDown":
            if (direction == "up")
                break;
            direction = "down";
            break;
        case "ArrowUp":
            if (direction == "down")
                break;
            direction = "up";
            break;
        case "ArrowLeft":
            if (direction == "right")
                break;
            direction = "left";
            break;
        case "ArrowRight":
            if (direction == "left")
                break;
            direction = "right";
            break;    
        case "KeyP":
            pauseClicked();
            break;
        default:
            break;
        }
});

function pauseClicked() {
    gamePaused = !gamePaused;
    if (gamePaused) {
        document.getElementById("pause").style.opacity = 1;
    } else {
        document.getElementById("pause").style.opacity = 0;    
    }
}

