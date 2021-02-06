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
    let dvX = Math.sin(this.rotation) * 0.2;
    let dvY = Math.cos(this.rotation) * 0.2;
    this.speed[0] -= dvX;
    this.speed[1] -= dvY;
    console.log(dvX, dvY);
    this.fuelRemaining -= 0.1;
}

Spacemodule.prototype.rotate = function(toLeft) {
    let rotSign = toLeft ? 1 : -1;
    this.rotation += rotSign * 0.1;
    console.log(this.rotation);
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
    context.fillRect(0, 905, 1920, 5);

}

function updateModel() {
    spacemodule.speed[1] += 0.05;
    spacemodule.update();
    if (spacemodule.position[1] > 900) {
        spacemodule.position[1] = 900;
        spacemodule.speed[1] = 0;
    }
}

document.addEventListener("keydown", function (event) {
    switch (event.code) {
        case "ArrowUp":
            spacemodule.throttle();
            break;
        case "ArrowLeft":
            spacemodule.rotate(true);
            break;
        case "ArrowRight":
            spacemodule.rotate(false);
            break;
        default:
            break;
    }
});
