const fruitTile = "f";
const snakeTile = "s";
const emptyTile = "e";
let mapWidth = 12;
let mapHeight = 12;
let snake = [[0, 0], [0, 1], [0, 2]];
let direction = "right";
let map;
let snakeLength = 3;
let gameEnd = false;

function generateEmptyMap() {
    let map = []
    for (let y = 0; y < mapHeight; y++) {
        map.push([]);
        for (let x = 0; x < mapWidth; x++) {
            map[y].push(emptyTile);
        }
    }
    return map;
}

function nextState() {
    let snakeHead = snake.slice(snakeLength - 1, snakeLength);
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
            snakeLength++;
            map[snakeHead[0]][snakeHead[1]] = snakeTile;
            setNextFruit();
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
function setNextFruit() {
    while (true) {
        let fruitY = getRandomInt(mapHeight);
        let fruitX = getRandomInt(mapWidth);
        if (map[fruitY][fruitX] == emptyTile) {
            map[fruitY][fruitX] = fruitTile;
            break;
        }
    }
}

function getRandomInt(upperBound) {
    return Math.floor(Math.random() * upperBound);
}