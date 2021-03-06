const fruitTile = "f";
const snakeTile = "s";
const emptyTile = "e";
let mapSize = 12;
let snake = [[0, 0], [0, 1], [0, 2]];
let direction = "right";
let directionQueue = [];
let fruitPosition = [0, 0];
let map = generateMapModel();
let gameEnd = true;
let timer;
const deltaTimeBaseScalable = 150;
const deltaTimeBaseStatic = 50;
let deltaTime;
let gamePaused = false;
let lastAdded = "";
let username = localStorage.getItem("name");


// view functions

function getSnakeTileColor(snakeLength, distanceFromSnakeEnd) {
    let min = Math.floor((2 * 128 + 255) / 3);
    let max = 255;
    let component = Math.floor((max - min) * (distanceFromSnakeEnd + 1) / snakeLength + min);
    return `rgb(${component}, ${component}, ${component})`;
}

function setButtonBlockVisibility(setOn) {
    let nextOpacity = 0;
    let nextVisibility = "hiiden";
    if (setOn) {
        nextOpacity = 1;
        nextVisibility = "visible";
    }
    document.getElementById("btnBlock").opacity = 0;
    document.getElementById("btnBlock").visibility = "hidden";
    let controlButtons = document.getElementsByClassName("controlButton");
    for (let i = 0; i < controlButtons.length; i++) {
        let button = controlButtons[i];
        button.style.opacity = nextOpacity;
        button.style.visibility = nextVisibility;
    }
}

function showGameEndScreen() {
    if (isMobileDevice()) {
        setButtonBlockVisibility(false);
    }
    document.getElementById("gameEnd").style.opacity = 1;
    document.getElementById("gameEnd").style.visibility = "visible";
}

function hideGameEndScreen() {
    document.getElementById("gameEnd").style.opacity = 0;
    document.getElementById("gameEnd").style.visibility = "hidden";
}

function showGameStartScreen() {
    document.getElementById("gameStart").style.opacity = 1;
    document.getElementById("gameStart").style.visibility = "visible";
}

function hideGameStartScreen() {
    updateUsername();
    if (isMobileDevice()) {
        setButtonBlockVisibility(true);
    }
    document.getElementById("gameStart").style.opacity = 0;
    document.getElementById("gameStart").style.visibility = "hidden";
}

function generateTilesOfField() {
    for (let rowId = 0; rowId < mapSize; rowId++) {
        let rowContainer = document.createElement("div");
        rowContainer.className = "rowContainer";
        rowContainer.id = `rowContainer_${rowId}`;
        document.getElementById("field").appendChild(rowContainer);

        let row = document.createElement("div");
        row.className = "row";
        row.id = `row_${rowId}`;
        rowContainer.appendChild(row);
        for (let columnId = 0; columnId < mapSize; columnId++) {
            let tile = document.createElement("div");
            tile.className = "tile";
            tile.id = `tile_${rowId}_${columnId}`;
            row.appendChild(tile);
        }
    }
}

function updateSizeButtonsColor(activeSize) {
    let sizes = [12, 18, 24, 32];
    for (let i = 0; i < sizes.length; i++) {
        document.getElementById(`size${sizes[i]}`).style.backgroundColor = "rgb(108, 108, 108)";
    }
    document.getElementById(`size${activeSize}`).style.backgroundColor = "grey";
}

function updateTileColor() {
    let colorMap = []
    for (let y = 0; y < mapSize; y++) {
        colorMap.push([]);
        for (let x = 0; x < mapSize; x++) {
            colorMap[y].push("grey");
        }
    }
    for (let i = 0; i < mapSize; i++) {
        colorMap[i][fruitPosition[1]] = "rgb(108, 108, 108)";
        colorMap[fruitPosition[0]][i] = "rgb(108, 108, 108)";
    }
    colorMap[fruitPosition[0]][fruitPosition[1]] = "orange";
    document.getElementById(`tile_${fruitPosition[0]}_${fruitPosition[1]}`).style.backgroundColor = "orange";
    for (let i = 0; i < snake.length; i++) {
        colorMap[snake[i][0]][snake[i][1]] = getSnakeTileColor(snake.length, i);
    }
    for (let y = 0; y < mapSize; y++) {
        for (let x = 0; x < mapSize; x++) {
            document.getElementById(`tile_${y}_${x}`).style.backgroundColor = colorMap[y][x];
        }
    }
}

// user input handling functions

document.addEventListener("keydown", function (event) {
    switch (event.code) {
        case "ArrowDown":
            if (event.repeat) {
                return;
            }
            setDirectionDown();
            break;
        case "ArrowUp":
            if (event.repeat) {
                return;
            }
            setDirectionUp();
            break;
        case "ArrowLeft":
            if (event.repeat) {
                return;
            }
            setDirectionLeft();
            break;
        case "ArrowRight":
            if (event.repeat) {
                return;
            }
            setDirectionRight();
            break;
        case "KeyP":
            if (event.repeat) {
                return;
            }
            pauseClickHandler();
            break;
        default:
            break;
    }
});

function initSizeButtons() {
    document.getElementById("size12").addEventListener("click", function () {
        mapSize = 12;
        updateSizeButtonsColor(12);
    });
    document.getElementById("size18").addEventListener("click", function () {
        mapSize = 18;
        updateSizeButtonsColor(18);
    });
    document.getElementById("size24").addEventListener("click", function () {
        mapSize = 24;
        updateSizeButtonsColor(24);
    });
    document.getElementById("size32").addEventListener("click", function () {
        mapSize = 32;
        updateSizeButtonsColor(32);
    });
    updateSizeButtonsColor(12);
}

function enableControls() {
    document.getElementById("btnUp").addEventListener("click", setDirectionUp);
    document.getElementById("btnDown").addEventListener("click", setDirectionDown);
    document.getElementById("btnLeft").addEventListener("click", setDirectionLeft);
    document.getElementById("btnRight").addEventListener("click", setDirectionRight);
}

function setDirectionUp() {
    if (directionQueue[0] == "up" || direction == "down" || lastAdded == "down" || gamePaused) {
        return;
    }
    if (directionQueue.length > 2) {
        directionQueue.pop()
    }
    lastAdded = "up"
    directionQueue.unshift("up");
}

function setDirectionDown() {
    if (directionQueue[0] == "down" || direction == "up" || lastAdded == "up" || gamePaused) {
        return;
    }
    if (directionQueue.length > 2) {
        directionQueue.pop()
    }
    lastAdded = "down"
    directionQueue.unshift("down");
}

function setDirectionLeft() {
    if (directionQueue[0] == "left" || direction == "right" || lastAdded == "right" || gamePaused) {
        return;
    }
    if (directionQueue.length > 2) {
        directionQueue.pop()
    }
    lastAdded = "left"
    directionQueue.unshift("left");
}

function setDirectionRight() {
    if (directionQueue[0] == "right" || direction == "left" || lastAdded == "left" || gamePaused) {
        return;
    }
    if (directionQueue.length > 2) {
        directionQueue.pop()
    }
    lastAdded = "right"
    directionQueue.unshift("right");
}

function pauseClickHandler() {
    if (gameEnd) {
        return;
    }
    gamePaused = !gamePaused;
    let pause = document.getElementById("pause");
    if (gamePaused) {
        pause.style.opacity = 1;
        pause.style.visibility = "visible";
    } else {
        pause.style.opacity = 0;
        pause.style.visibility = "hidden";
    }
}

// mainloop and model functions

document.addEventListener("DOMContentLoaded", init);

function init() {
    initSizeButtons();
    document.getElementById("startNewGame").addEventListener("click", () => {
        hideGameStartScreen();
        newGame();
    });
    if (!isMobileDevice()) {
        document.getElementById("btnBlock").style.visibility = "hidden";
        document.getElementById("pauseButton").style.visibility = "hidden";
    } else {
        document.getElementById("pauseButton").addEventListener("click", pauseClickHandler);
    }
    document.getElementById("toGameStartMenu").addEventListener("click", () => {
        hideGameEndScreen();
        showGameStartScreen();
    })

    enableControls();
    setButtonBlockVisibility(false);
    generateTilesOfField();
    resizeEverything();
    updateTileColor();
    showGameStartScreen();
}

function mainloop() {
    if (gameEnd) {
        return;
    }
    if (gamePaused) {
        timer = setTimeout(mainloop, 50);
        return;
    }
    updateState();
    updateTileColor();
    deltaTime = deltaTimeBaseScalable * (Math.pow(mapSize, 2) - snake.length) / Math.pow(mapSize, 2) + deltaTimeBaseStatic;
    timer = setTimeout(mainloop, deltaTime);
}

function newGame() {
    document.getElementById("field").innerHTML = "";
    direction = "right";
    directionQueue = [];
    snake = [[0, 0], [0, 1], [0, 2]];
    deltaTime = deltaTimeBaseScalable + deltaTimeBaseStatic;
    map = generateMapModel();
    document.getElementById("score").innerText = `score ${snake.length}`;
    gameEnd = false;
    generateTilesOfField();
    updateTileColor();
    resizeEverything();
    mainloop();
}

function updateLeaderbords(leaderboards) {
    let table = document.getElementById("leadersTable");
    table.innerHTML = "";
    let topRow = document.createElement("tr");
    topRow.innerHTML = '<td class="leaderName">Player</td><td class="leaderScore">Score</td>';
    table.appendChild(topRow);
    for (let i = 0; i < leaderboards.length; i++) {
        let row = document.createElement("tr");
        row.innerHTML = `<td class="leaderName">${leaderboards[i].username}</td><td class="leaderScore">${leaderboards[i].score}</td>`;
        table.appendChild(row);
    }
}

function generateMapModel() {
    let map = []
    for (let y = 0; y < mapSize; y++) {
        map.push([]);
        for (let x = 0; x < mapSize; x++) {
            map[y].push(emptyTile);
        }
    }
    for (var snakeTileId = 0; snakeTileId < snake.length; snakeTileId++) {
        map[snake[snakeTileId][0]][snake[snakeTileId][1]] = snakeTile
    }
    setNextFruitOnMap(map);

    return map;
}

function updateState() {
    let snakeHeadY = snake[snake.length - 1][0];
    let snakeHeadX = snake[snake.length - 1][1];
    if (directionQueue.length != 0) {
        direction = directionQueue.pop();
    }
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
    snakeHeadX = (snakeHeadX + mapSize) % mapSize;
    snakeHeadY = (snakeHeadY + mapSize) % mapSize;
    switch (map[snakeHeadY][snakeHeadX]) {
        case fruitTile:
            map[snakeHeadY][snakeHeadX] = snakeTile;
            snake.push([snakeHeadY, snakeHeadX]);
            map = setNextFruitOnMap(map);
            document.getElementById("score").innerText = `score: ${snake.length}`;
            break;
        case snakeTile:
            gameEnd = true;
            requestLeaderboards();
            showGameEndScreen();
            break;
        case emptyTile:
            map[snakeHeadY][snakeHeadX] = snakeTile;
            snake.push([snakeHeadY, snakeHeadX]);
            let snakeEnd = snake.shift();
            map[snakeEnd[0]][snakeEnd[1]] = emptyTile;
            break;
    }
}

function setNextFruitOnMap(map) {
    while (true) {
        let fruitY = getRandomInt(mapSize);
        let fruitX = getRandomInt(mapSize);
        fruitPosition[0] = fruitY;
        fruitPosition[1] = fruitX;
        if (map[fruitY][fruitX] == emptyTile) {
            map[fruitY][fruitX] = fruitTile;
            break;
        }
    }
    return map;
}

// server request functions

function requestLeaderboards() {
    let data = {
        username: username,
        score: snake.length,
        mapSize: mapSize
    }
    let response = "";
    fetch("https://fritzler.ru:8000?mapSize=12", {
        method: "POST",
        body: JSON.stringify(data),
    })
        .then(response => {
            return response.json();
        })
        .then(result => {
            updateLeaderbords(result);
        });
}

function updateUsername() {
    username = document.getElementById("usernameField").value;
    localStorage["name"] = username;
}

// window resize functions

window.addEventListener("resize", resizeEverything);

function resizeEverything() {
    resizeMap();
    resizeControls();
    if (window.innerHeight > window.innerWidth) {
        resizeLeaderboards();
        relocateScore();
    }
}

function resizeControls() {
    let maxXSize = 0;
    let maxYSize = 0;
    let buttonBlockXPosition = 0;
    let buttonBlockYPosition = 0;
    if (window.innerWidth > window.innerHeight) {
        maxXSize = Math.floor((window.innerWidth - window.innerHeight) / 2);
        maxYSize = Math.floor(window.innerHeight);
        buttonBlockYPosition = Math.floor(maxYSize / 2);
    } else {
        maxXSize = Math.floor(window.innerWidth);
        maxYSize = Math.floor(window.innerHeight - window.innerWidth);
        buttonBlockYPosition = window.innerHeight - Math.floor(maxYSize / 2);
    }
    buttonBlockXPosition = Math.floor(maxXSize / 2);

    let controlBlockSize = Math.floor(Math.min(maxXSize, maxYSize) / Math.sqrt(2));
    let buttonSize = Math.floor(controlBlockSize * 0.8 / 2);
    let buttonMargin = Math.floor(controlBlockSize * 0.1 / 2);
    let buttonBlock = document.getElementById("btnBlock");
    buttonBlock.style.top = `${buttonBlockYPosition}px`;
    buttonBlock.style.left = `${buttonBlockXPosition}px`;
    buttonBlock.style.height = `${controlBlockSize}px`;
    buttonBlock.style.width = `${controlBlockSize}px`;

    let controlButtons = document.getElementsByClassName("controlButton");
    for (let i = 0; i < controlButtons.length; i++) {
        let button = controlButtons[i];
        button.style.width = `${buttonSize}px`;
        button.style.height = `${buttonSize}px`;
        button.style.margin = `${buttonMargin}px`;
    }
    
    let pauseButtonSize = Math.floor(Math.min(window.innerWidth, window.innerHeight) / 10);
    let offset = Math.floor(pauseButtonSize / 3);
    document.getElementById("pauseButton").width = `${pauseButtonSize}px`;
    document.getElementById("pauseButton").height = `${pauseButtonSize}px`;
    document.getElementById("pauseButton").style.width = `${pauseButtonSize}px`;
    document.getElementById("pauseButton").style.height = `${pauseButtonSize}px`;
    document.getElementById("pauseButton").style.top = `${offset}px`;
    document.getElementById("pauseButton").style.right = `${offset}px`;
}

function resizeMap() {
    let squareSize = Math.min(window.innerHeight, window.innerWidth) * 0.9;
    document.getElementById("field").style.height = `${squareSize}px`;
    document.getElementById("field").style.width = `${squareSize}px`;
    for (let rowId = 0; rowId < mapSize; rowId++) {
        document.getElementById(`rowContainer_${rowId}`).style.width = Math.floor(squareSize) + "px";
        document.getElementById(`rowContainer_${rowId}`).style.height = `${Math.floor(squareSize / mapSize)}px`;
        document.getElementById(`row_${rowId}`).style.width = `${Math.floor(squareSize)}px`;
        document.getElementById(`row_${rowId}`).style.height = `${Math.floor(squareSize / mapSize)}px`;
        for (let columnId = 0; columnId < mapSize; columnId++) {
            tile = document.getElementById(`tile_${rowId}_${columnId}`);
            tile.style.width = `${Math.floor(squareSize / mapSize * 0.9)}px`;
            tile.style.height = `${Math.floor(squareSize / mapSize * 0.9)}px`;
            tile.style.margin = `${Math.floor(squareSize / mapSize * 0.05)}px`;
        }
    }
    document.getElementById("field").style.top = `${Math.floor(squareSize * 0.05)}px`;
}

function resizeLeaderboards() {
    document.getElementById("leaderboardsContainer").style.width = "80vw";
}

function relocateScore() {
    document.getElementById("score").style.top = `${window.innerWidth}px`;
}

// other functions

function isMobileDevice() {
    return navigator.maxTouchPoints != 0;
}

function getRandomInt(upperBound) {
    return Math.floor(Math.random() * upperBound);
}