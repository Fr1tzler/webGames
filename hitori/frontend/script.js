let mapSize = 12;
let map = generateMapModel();
let gameEnd = true;
let gamePaused = false;

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
    generateTilesOnField();
    resizeEverything();
    showGameStartScreen();
}

function newGame() {
    document.getElementById("field").innerHTML = "";
    map = generateMapModel();
    gameEnd = false;
    generateTilesOnField();
    updateTileColor();
    resizeEverything();
    mainloop();
}

function generateMapModel() {
    let map = []
    return map;
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
        controlButtons[i].style.width = `${buttonSize}px`;
        controlButtons[i].style.height = `${buttonSize}px`;
        controlButtons[i].style.margin = `${buttonMargin}px`;
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

// other functions

function isMobileDevice() {
    return navigator.maxTouchPoints != 0;
}

function getRandomInt(upperBound) {
    return Math.floor(Math.random() * upperBound);
}