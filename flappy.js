const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

/* Images */
const background_day = new Image();
background_day.src = "./assets/images/background-day.png";

const background_night = new Image();
background_night.src = "./assets/images/background-night.png";

const yellowbird_downflap = new Image();
yellowbird_downflap.src = "./assets/images/yellowbird-downflap.png";

const yellowbird_midflap = new Image();
yellowbird_midflap.src = "./assets/images/yellowbird-midflap.png";

const yellowbird_upflap = new Image();
yellowbird_upflap.src = "./assets/images/yellowbird-upflap.png";

const redbird_upflap = new Image();
redbird_upflap.src = "./assets/images/redbird-upflap.png";

const redbird_midflap = new Image();
redbird_midflap.src = "./assets/images/redbird-midflap.png";

const redbird_downflap = new Image();
redbird_downflap.src = "./assets/images/redbird-downflap.png";

const bluebird_midflap = new Image();
bluebird_midflap.src = "./assets/images/bluebird-upflap.png";

const bluebird_downflap = new Image();
bluebird_downflap.src = "./assets/images/bluebird-downflap.png";

const bluebird_upflap = new Image();
bluebird_upflap.src = "./assets/images/bluebird-upflap.png";

const pipe_green_up = new Image();
pipe_green_up.src = "./assets/images/pipe-green-up.png";

const pipe_green_down = new Image();
pipe_green_down.src = "./assets/images/pipe-green-down.png";

const pipe_red_up = new Image();
pipe_red_up.src = "./assets/images/pipe-red-up.png";

const pipe_red_down = new Image();
pipe_red_down.src = "./assets/images/pipe-red-down.png";

/* Settings */
let isPlaying = false;
const gravity = .4;
const speed = 4;
const birdSize = [34, 24];
const jump = -11;
const leftSpaceBird = (canvas.width / 10);
let isDay = true;
let birdColor = "yellow";
let pipeColor = "green";

/* Pipe settings */
const pipeWidth = 52;
const pipeGap = 270;
const pipeLocation = () => (Math.random() * ((canvas.height - (pipeGap + pipeWidth)) - pipeWidth)) + pipeWidth;

let index = 0;
let backgroundPosition = 0;
let bestScore = 0;
let currentScore = 0;
let pipe;
let flight;
let flyHeight = (canvas.height / 2) - (birdSize[1] / 2);

const startGame = () => {
    currentScore = 0;
    flight = jump;
    flyHeight = (canvas.height / 2) - (birdSize[1] / 2);

    pipes = Array(3).fill().map((a, i) => [canvas.width + (i * (pipeGap + pipeWidth)), pipeLocation()])
}

/* Animate the canvas */
const render = () => {
    if (isDay)
        drawBackground(background_day);
    else
        drawBackground(background_night);
    if (isPlaying) {
        if (index < 8)
            drawBirdUp(leftSpaceBird);
        else if (index < 16)
            drawBirdMid(leftSpaceBird);
        else
            drawBirdDown(leftSpaceBird);
        flight += gravity;
        flyHeight = Math.min(flyHeight + flight, canvas.height - birdSize[1]);


        spawnPipes();

    } else {
        if (index < 8)
            drawBirdUp(canvas.width / 2 - 20);
        else if (index < 16)
            drawBirdMid(canvas.width / 2 - 20);
        else
            drawBirdDown(canvas.width / 2 - 20);

        displayStartInformation();
    }

    backgroundPosition++;
    index++;
    index %= 24;

    document.getElementById('bestScore').innerHTML = "Best : " + bestScore;
    document.getElementById('currentScore').innerHTML = "Current : " + currentScore;


    window.requestAnimationFrame(render);
}

/* Draw birds */
function drawBirdUp(dx) {
    switch (birdColor) {
        case "yellow":
            ctx.drawImage(yellowbird_upflap, 0, 0, ...birdSize, dx, flyHeight, ...birdSize);
            break;
        case "red":
            ctx.drawImage(redbird_upflap, 0, 0, ...birdSize, dx, flyHeight, ...birdSize);
            break;
        case "blue":
            ctx.drawImage(bluebird_upflap, 0, 0, ...birdSize, dx, flyHeight, ...birdSize);
    }
}

/* Draw birds */
function drawBirdMid(dx) {
    switch (birdColor) {
        case "yellow":
            ctx.drawImage(yellowbird_midflap, 0, 0, ...birdSize, dx, flyHeight, ...birdSize);
            break;
        case "red":
            ctx.drawImage(redbird_midflap, 0, 0, ...birdSize, dx, flyHeight, ...birdSize);
            break;
        case "blue":
            ctx.drawImage(bluebird_midflap, 0, 0, ...birdSize, dx, flyHeight, ...birdSize);
    }
}

/* Draw birds */
function drawBirdDown(dx) {
    switch (birdColor) {
        case "yellow":
            ctx.drawImage(yellowbird_downflap, 0, 0, ...birdSize, dx, flyHeight, ...birdSize);
            break;
        case "red":
            ctx.drawImage(redbird_downflap, 0, 0, ...birdSize, dx, flyHeight, ...birdSize);
            break;
        case "blue":
            ctx.drawImage(bluebird_downflap, 0, 0, ...birdSize, dx, flyHeight, ...birdSize);
    }
}

function spawnPipes() {
    pipes.map(pipe => {
        pipe[0] -= speed;
        switch (pipeColor) {
            case "green":
                ctx.drawImage(pipe_green_down, 0, 320 - pipe[1], pipeWidth, pipe[1], pipe[0], 0, pipeWidth, pipe[1]);
                ctx.drawImage(pipe_green_up, 0, 0, pipeWidth, canvas.height - pipe[1] + pipeGap, pipe[0], pipe[1] + pipeGap, pipeWidth, canvas.height - pipe[1] + pipeGap);
                break;
            case "red":
                ctx.drawImage(pipe_red_down, 0, 320 - pipe[1], pipeWidth, pipe[1], pipe[0], 0, pipeWidth, pipe[1]);
                ctx.drawImage(pipe_red_up, 0, 0, pipeWidth, canvas.height - pipe[1] + pipeGap, pipe[0], pipe[1] + pipeGap, pipeWidth, canvas.height - pipe[1] + pipeGap);
                break;
        }

        if (pipe[0] <= -pipeWidth) {
            currentScore++;
            bestScore = Math.max(bestScore, currentScore);

            pipes = [...pipes.slice(1), [pipes[pipes.length - 1][0] + pipeGap + pipeWidth, pipeLocation()]];
        }

        if ([pipe[0] <= leftSpaceBird + birdSize[0], pipe[0] + pipeWidth >= leftSpaceBird, pipe[1] > flyHeight || pipe[1] + pipeGap < flyHeight + birdSize[1]].every(elem => elem)) {
            isPlaying = false;
            startGame();
        }
    });
}

function displayStartInformation() {
    /* Display start information */
    ctx.fillText("Best score : " + bestScore, 60, 140);
    ctx.font = "italic 26px VT323";
    ctx.fillText("Click to play", 75, 360);
    ctx.font = "normal 32px VT323";
}

function drawBackground(image) {
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height, -((backgroundPosition * (speed / 2)) % canvas.width) + canvas.width, 0, canvas.width, canvas.height);
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height, -((backgroundPosition * (speed / 2)) % canvas.width), 0, canvas.width, canvas.height);
}

startGame();
background_day.onload = render;
canvas.addEventListener("click", () => {
    isPlaying = true
    flight = jump;
});

document.getElementById("dayOrNight").addEventListener("click", () => {
    isDay = !isDay;
});

document.getElementById("yellowBird").addEventListener("click", () => {
    birdColor = "yellow";
});

document.getElementById("redBird").addEventListener("click", () => {
    birdColor = "red";
});

document.getElementById("blueBird").addEventListener("click", () => {
    birdColor = "blue";
});

document.getElementById("greenPipe").addEventListener("click", () => {
    pipeColor = "green";
});

document.getElementById("redPipe").addEventListener("click", () => {
    pipeColor = "red";
});