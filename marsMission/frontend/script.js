class Spacemodule {
    constructor() {
        this.position = [960, 540];
        this.rotation = 0;
        this.speed = [0, 0];
        this.fuelRemaining = 100;
    }
}

Spacemodule.prototype.update = function() {
    this.position[0] += this.speed[0];
    this.position[1] += this.speed[1];
}

Spacemodule.prototype.throttle = function() {
    if (this.fuelRemaining <= 0) {
        return;
    }
    console.log(this.speed, this.fuelRemaining);
    this.speed[1] -= 0.1;
    this.fuelRemaining -= 0.1;
}

let canvas;
let context;
const deltaTime = 50;
let spacemodule;

document.addEventListener("DOMContentLoaded", init);


class Ground {
    constructor() {
        this.points = [[0, 0], [100, 0]]
    }
}

function init() {
    canvas = document.getElementById("mainScreen");
    context = canvas.getContext("2d");
    spacemodule = new Spacemodule();
    mainloop();
}

function mainloop() {
    updateModel();
    draw();
    timer = setTimeout(mainloop, deltaTime);
}

function draw() {
    context.clearRect(0, 0, 1920, 1080);
    context.fillRect(spacemodule.position[0] - 5, spacemodule.position[1] - 5, 10, 10);
}

function updateModel() {
    spacemodule.speed[1] += 0.05;
    spacemodule.update();
}

document.addEventListener("keydown", function (event) {
    switch (event.code) {
        case "ArrowUp":
            spacemodule.throttle();
            break;
        default:
            break;
    }
});
