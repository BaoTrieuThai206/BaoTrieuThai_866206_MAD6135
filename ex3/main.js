const circleCanvas = document.getElementById('circleCanvas');
const ctx = circleCanvas.getContext('2d');

const centerX = circleCanvas.width / 2,
    centerY = circleCanvas.height / 2,
    minRadius = 25,
    maxRadius = 200;

let currentRadius = minRadius;
let isExpanding = true;
let fillColor = getRandomColor();

function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function drawCircle() {
    ctx.clearRect(0, 0, circleCanvas.width, circleCanvas.height);
    ctx.beginPath();
    ctx.arc(centerX, centerY, currentRadius, 0, Math.PI * 2);
    ctx.fillStyle = fillColor;
    ctx.fill();
    ctx.closePath();
}

function pulsateCircle() {
    if (isExpanding) {
        currentRadius += 1;
        if (currentRadius >= maxRadius) {
            isExpanding = false;
        }
    } else {
        currentRadius -= 1;
        if (currentRadius <= minRadius) {
            isExpanding = true;
        }
    }

    drawCircle();
}

setInterval(pulsateCircle, 5000 / (maxRadius - minRadius));
setInterval(() => {
    fillColor = getRandomColor();
    drawCircle();
}, 1000);

drawCircle();