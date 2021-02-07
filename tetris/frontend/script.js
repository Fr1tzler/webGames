const emptyTile = "e";
const usedTile = "u";
let mapHeight = 20;
let mapWidth = 12;
let score = 0;
let map = generateMapModel();
let gameEnd = true;
let timer;
const deltaTimeBase = 200;
let deltaTime;
let gamePaused = false;
let username = localStorage.getItem("name");

// view functions

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
    for (let rowId = 0; rowId < mapHeight; rowId++) {
        let rowContainer = document.createElement("div");
        rowContainer.className = "rowContainer";
        rowContainer.id = `rowContainer_${rowId}`;
        document.getElementById("field").appendChild(rowContainer);

        let row = document.createElement("div");
        row.className = "row";
        row.id = `row_${rowId}`;
        rowContainer.appendChild(row);
        for (let columnId = 0; columnId < mapWidth; columnId++) {
            let tile = document.createElement("div");
            tile.className = "tile";
            tile.id = `tile_${rowId}_${columnId}`;
            row.appendChild(tile);
        }
    }
}

function shiftTileColor() {
    for (let rowId = mapHeight - 1; rowId > 0; rowId--) {
        for (let columnId = 0; columnId < mapWidth; columnId++) {
            document.getElementById(`tile_${rowId}_${columnId}`).style.backgroundColor = document.getElementById(`tile_${rowId - 1}_${columnId}`).style.backgroundColor;
        }
    }
    for (let columnId = 0; columnId < mapWidth; columnId++) {
        document.getElementById(`tile_0_${columnId}`).style.backgroundColor = "grey";
    }
}

// user input handling functions

// fix
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

// fix
function enableControls() {
    document.getElementById("btnUp").addEventListener("click", setDirectionUp);
    document.getElementById("btnDown").addEventListener("click", setDirectionDown);
    document.getElementById("btnLeft").addEventListener("click", setDirectionLeft);
    document.getElementById("btnRight").addEventListener("click", setDirectionRight);
}

// fix
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

// fix
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

// fix
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

// fix
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

// fix
function init() {
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
    shiftTileColor();
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
    shiftTileColor();
    deltaTime = deltaTimeBase / Math.log10(score / 10);
    timer = setTimeout(mainloop, deltaTime);
}

function newGame() {
    document.getElementById("field").innerHTML = "";
    deltaTime = deltaTimeBase;
    map = generateMapModel();
    document.getElementById("score").innerText = `score ${score}`;
    gameEnd = false;
    generateTilesOfField();
    shiftTileColor();
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
    for (let y = 0; y < mapHeight; y++) {
        map.push([]);
        for (let x = 0; x < mapWidth; x++) {
            map[y].push(emptyTile);
        }
    }
    return map;
}

// fix
function updateState() {
    
}

// server request functions

// fix
function requestLeaderboards() {
    let data = {
        username: username,
        score: score,
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
    console.log(maxXSize);
    console.log(maxYSize);
    console.log(buttonBlockXPosition);
    console.log(buttonBlockYPosition);

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

// fix
function resizeMap() {
    let squareSize = Math.min(window.innerHeight, window.innerWidth) * 0.9;
    let rowWidth = Math.ceil(squareSize / mapHeight * mapWidth);
    document.getElementById("field").style.height = `${squareSize}px`;
    document.getElementById("field").style.width = `${rowWidth}px`;
    for (let rowId = 0; rowId < mapHeight; rowId++) {
        document.getElementById(`rowContainer_${rowId}`).style.width = `${rowWidth}px`;
        document.getElementById(`rowContainer_${rowId}`).style.height = `${Math.floor(squareSize / mapHeight)}px`;
        document.getElementById(`row_${rowId}`).style.width = `${Math.floor(squareSize)}px`;
        document.getElementById(`row_${rowId}`).style.height = `${Math.floor(squareSize / mapHeight)}px`;
        for (let columnId = 0; columnId < mapWidth; columnId++) {
            tile = document.getElementById(`tile_${rowId}_${columnId}`);
            tile.style.width = `${Math.floor(squareSize / mapHeight * 0.9)}px`;
            tile.style.height = `${Math.floor(squareSize / mapHeight * 0.9)}px`;
            tile.style.margin = `${Math.floor(squareSize / mapHeight * 0.05)}px`;
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