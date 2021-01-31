let tileWidth = 0;
let tileHeight = 0;

function main() {
    //resizeAll();
}

function resizeAll() {
    resizeField();
}

function resizeField() {
    let field = document.getElementsByClassName("field")[0];
    let windowWidth = window.innerWidth;
    let windowHeight = window.innerHeight;
    if (windowHeight < windowWidth) {
        field.style.top = windowHeight * 0.05 + "px";
        field.style.height = windowHeight * 0.9 + "px";
        field.style.width = windowHeight * 0.9 * 2 / Math.sqrt(3) + "px";
    } else {
        alert("mobile is not ready now!")
    }
}

function resizeTiles() {

}

document.addEventListener("DOMContentLoaded", main);
//window.addEventListener("resize", resizeAll);
