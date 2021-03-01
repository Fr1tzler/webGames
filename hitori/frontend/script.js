let mapSize = 12;
let map = generateMapModel();
let gameEnd = true;

// view functions

function showGameEndScreen() {
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
    document.getElementById("gameStart").style.opacity = 0;
    document.getElementById("gameStart").style.visibility = "hidden";
}

function generateTilesOnField() {
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

// user input handling functions

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

// mainloop and model functions

document.addEventListener("DOMContentLoaded", init);

function init() {
    initSizeButtons();
    document.getElementById("startNewGame").addEventListener("click", () => {
        hideGameStartScreen();
        newGame();
    });
    document.getElementById("toGameStartMenu").addEventListener("click", () => {
        hideGameEndScreen();
        showGameStartScreen();
    })
    generateTilesOnField();
    resizeMap();
    showGameStartScreen();
}

function newGame() {
    document.getElementById("field").innerHTML = "";
    map = generateMapModel();
    gameEnd = false;
    generateTilesOnField();
    resizeMap();
}

function generateMapModel() {
    let map = [];
    for (let x = 0; x < mapSize; x++) {
        map.push([]);
        for (let y = 0; y < mapSize; y++)
            map[x].push(0);
    }
    return map;
}

function setBlackTiles(map) {
    // do nothing
    return map;
}

// window resize functions

window.addEventListener("resize", resizeMap);

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

// other functions

function isMobileDevice() {
    return navigator.maxTouchPoints != 0;
}

function getRandomInt(upperBound) {
    return Math.floor(Math.random() * upperBound);
}