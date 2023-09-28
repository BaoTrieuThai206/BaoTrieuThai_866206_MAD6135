const canvas = document.getElementById('animationCanvas');
const ctx = canvas.getContext('2d');

let x = Math.random() * (canvas.width - 50);
let y = Math.random() * (canvas.height - 50);

let speedX = 2, 
    speedY = 2;

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "blue";
    ctx.fillRect(x, y, 50, 50);

    x += speedX;
    y += speedY;

    if (x > canvas.width - 50 || x < 0) {
        speedX *= -1;
    }

    if (y > canvas.height - 50 || y < 0) {
        speedY *= -1;
    }

    requestAnimationFrame(draw);
}

draw();