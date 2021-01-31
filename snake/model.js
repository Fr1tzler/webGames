const fruitTile = "f";
const snakeTile = "s";
const emptyTile = "e";
let mapWidth;
let mapHeight;
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
    let snakeHead = snake.slice(snake.length - 1, snake.length);
    switch (direction) {
        case "right":
            break;
        case "left":
            break;
        case "up":
            break;
        case "down":
            break;
    }
    switch (map[snakeHead[0]][snakeHead[1]]) {
        case fruitTile:
            snake.push(snakeHead)
            snakeLength++;
            break;
        case snakeTile:
            gameEnd = true;
            alert("FAIL");
            break;
        case emptyTile:
            snake.push(snakeHead)
            snake.shift()
            break;
    }
}