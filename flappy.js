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
bluebird_midflap.src = "./assets/images/bluebird-midflap.png";

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

const settings = new Image();
settings.src = "./assets/images/settings.png";

const validate = new Image();
validate.src = "./assets/images/validate.png";

const day_night = new Image();
day_night.src = "./assets/images/DayNightSettings.png";

/* Settings */
const gravity = .5;
const speed = 7;
const birdSize = [34, 24];
const jump = -11;
const leftSpaceBird = (canvas.width / 10);
let isPlaying = false;
let gameStatus = 0;
let isDay = true;
let birdColor = "yellow";
let pipeColor = "green";

/* Pipe Settings */
const pipeWidth = 52;
const pipeGap = 270;
const pipeLocation = () => (Math.random() * ((canvas.height - (pipeGap + pipeWidth)) - pipeWidth)) + pipeWidth;

/* Parameters Location Settings */
let parametersRect = { x: 0, y: 0, w: 60, h: 50 };
let parametersMenuRect = { x: 0, y: 0, w: canvas.width, h: canvas.height };

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

    pipes = Array(2).fill().map((a, i) => [(canvas.width + (i * (pipeGap + pipeWidth))) * 1.2, pipeLocation()])
}

/* Animate the canvas */
function render() {
    requestAnimationFrame(render);
    now = Date.now();
    elapsed = now - then;
    if (elapsed > fpsInterval) {
        then = now - (elapsed % fpsInterval);
        ctx.fillStyle = "#000000";
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
            ctx.fillStyle = "#000000f0";
            if (gameStatus == 0) {
                ctx.drawImage(settings, canvas.width - settings.width, 0, settings.width, settings.height);
            }
            if (gameStatus == 1) {
                ctx.fillRect(parametersMenuRect.x, parametersMenuRect.y, parametersMenuRect.w, parametersMenuRect.h);
                ctx.drawImage(validate, canvas.width - validate.width, 0, validate.width, validate.height);
                switch (birdColor) {
                    case "yellow":
                        ctx.drawImage(yellowbird_upflap, canvas.width / 3 - 65, canvas.height / 4 - birdSize[1], birdSize[0], birdSize[1]);
                        ctx.drawImage(redbird_upflap, 2 * canvas.width / 3 - 65, canvas.height / 4, birdSize[0], birdSize[1]);
                        ctx.drawImage(bluebird_upflap, 3 * canvas.width / 3 - 65, canvas.height / 4, birdSize[0], birdSize[1]);
                        break;
                    case "red":
                        ctx.drawImage(yellowbird_upflap, canvas.width / 3 - 65, canvas.height / 4, birdSize[0], birdSize[1]);
                        ctx.drawImage(redbird_upflap, 2 * canvas.width / 3 - 65, canvas.height / 4 - birdSize[1], birdSize[0], birdSize[1]);
                        ctx.drawImage(bluebird_upflap, 3 * canvas.width / 3 - 65, canvas.height / 4, birdSize[0], birdSize[1]);
                        break;
                    case "blue":
                        ctx.drawImage(yellowbird_upflap, canvas.width / 3 - 65, canvas.height / 4, birdSize[0], birdSize[1]);
                        ctx.drawImage(redbird_upflap, 2 * canvas.width / 3 - 65, canvas.height / 4, birdSize[0], birdSize[1]);
                        ctx.drawImage(bluebird_upflap, 3 * canvas.width / 3 - 65, canvas.height / 4 - birdSize[1], birdSize[0], birdSize[1]);
                }
                ctx.drawImage(day_night, 2 * canvas.width / 3 - 75, canvas.height / 2.4, day_night.width, day_night.height);
                ctx.font = "normal 32px VT323";
                ctx.fillStyle = "white";
                if (isDay) {
                    ctx.fillText("Day Theme", 85, 300);
                } else {
                    ctx.fillText("Night Theme", 75, 300);
                }
                switch (pipeColor) {
                    case "green":
                        ctx.drawImage(pipe_green_up, 0, 0, pipeWidth, canvas.height - 150, canvas.width / 4, canvas.height - 150, pipeWidth, canvas.height / 3);
                        ctx.drawImage(pipe_red_up, 0, 0, pipeWidth, canvas.height - 110, canvas.width / 4 * 3 - pipeWidth, canvas.height - 110, pipeWidth, canvas.height / 3);
                        break;
                    case "red":
                        ctx.drawImage(pipe_green_up, 0, 0, pipeWidth, canvas.height - 110, canvas.width / 4, canvas.height - 110, pipeWidth, canvas.height / 3);
                        ctx.drawImage(pipe_red_up, 0, 0, pipeWidth, canvas.height - 150, canvas.width / 4 * 3 - pipeWidth, canvas.height - 150, pipeWidth, canvas.height / 3);
                }
                now = Date.now();
            }
        }
    }

    /* Change bird sprite and background position */
    backgroundPosition++;
    index++;
    index %= 24;

    document.getElementById('bestScore').innerHTML = "Best : " + bestScore;
    document.getElementById('currentScore').innerHTML = "Current : " + currentScore;
}

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
            gameStatus = 0;
            startGame();
        }
    });
}

function displayStartInformation() {
    /* Display start information */
    ctx.fillStyle = "black";
    ctx.fillText("Best score : " + bestScore, 60, 140);
    ctx.font = "italic 26px VT323";
    ctx.fillText("Click to play", 75, 360);
    ctx.font = "normal 32px VT323";

    /* Reset the Background Position */
    backgroundPosition = 0;
}

function drawBackground(image) {
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height, -((backgroundPosition * (speed / 2)) % canvas.width) + canvas.width, 0, canvas.width, canvas.height);
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height, -((backgroundPosition * (speed / 2)) % canvas.width), 0, canvas.width, canvas.height);
}


canvas.addEventListener("click", function(e) {
    isParameters = openParameters(e.offsetX, e.offsetY);
    switch (isParameters) {
        case 0:
            displayStartInformation();
            break;
        case 1:
            openParametersMenu();
            break;
        case 2:
            isPlaying = true
            flight = jump;
            break;
    }
});

function openParameters(x, y) {
    if (!isPlaying) {
        isOnSettings(x, y);
        isOnBirds(x, y);
        isOnTheme(x, y);
        isOnPipes(x, y);
    }
    return gameStatus;
}

function openParametersMenu() {
    ctx.fillRect(parametersMenuRect.x, parametersMenuRect.y, parametersMenuRect.w, parametersMenuRect.h);
}

function isOnSettings(x, y) {
    let left = canvas.width - settings.width;
    let right = canvas.width
    let top = 0;
    let bottom = settings.height;
    if (right >= x && left <= x && bottom >= y && top <= y)
        gameStatus = (gameStatus + 1) % 2;
    else
        gameStatus = (gameStatus + 1) % 2 + 1;
}

function isOnBirds(x, y) {
    let left = (canvas.width / 3) - 65;
    let right = canvas.width / 3 - 65 + birdSize[0];
    let top = canvas.height / 4;
    let bottom = (canvas.height / 4) + birdSize[1];
    if (right >= x && left <= x && bottom >= y && top <= y)
        birdColor = "yellow";
    left = (2 * canvas.width / 3) - 65;
    right = (2 * canvas.width / 3) - 65 + birdSize[0];
    top = canvas.height / 4;
    bottom = (canvas.height / 4) + birdSize[1];
    if (right >= x && left <= x && bottom >= y && top <= y)
        birdColor = "red";
    left = (3 * canvas.width / 3) - 65;
    right = (3 * canvas.width / 3) - 65 + birdSize[0];
    top = canvas.height / 4;
    bottom = (canvas.height / 4) + birdSize[1];
    if (right >= x && left <= x && bottom >= y && top <= y)
        birdColor = "blue";
}

function isOnTheme(x, y) {
    let left = 2 * canvas.width / 3 - 75;
    let right = 2 * canvas.width / 3 - 75 + day_night.width;
    let top = canvas.height / 2.4;
    let bottom = canvas.height / 2.4 + day_night.height;
    if (right >= x && left <= x && bottom >= y && top <= y)
        isDay = !isDay;
}

function isOnPipes(x, y) {
    let left = canvas.width / 4;
    let right = (canvas.width / 4) + pipeWidth;
    let top = canvas.height - 110;
    let bottom = canvas.height;
    if (right >= x && left <= x && bottom >= y && top <= y)
        pipeColor = "green";
    left = (3 * canvas.width) / 4 - pipeWidth;
    right = (3 * canvas.width / 4);
    top = canvas.height - 110;
    bottom = canvas.height;
    if (right >= x && left <= x && bottom >= y && top <= y)
        pipeColor = "red";
}

let fpsInterval, fps, startTime, now, then, elapsed;

function startAnimating(fps) {
    fpsInterval = 1000 / fps;
    then = Date.now();
    startTime = then;
    render();
}

startGame();
background_day.onload = startAnimating(60);