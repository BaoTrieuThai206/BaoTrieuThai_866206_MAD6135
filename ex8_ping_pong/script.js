// Initialize canvas
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

ctx.beginPath();
ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
ctx.fill();
ctx.closePath();

var restartBtn = document.getElementById("restart-btn");
var animationId;
var gameRunning = true;
var gameStarted = false;
var spacePressed = false; 

var round = 1; 
var leftRoundScore = 0; 
var rightRoundScore = 0; 
var maxRounds = 5;
var scoresPerRound = 7;


function startGame(){
    gameStarted = true;
    loop();
}

document.addEventListener("keydown", function () {
    if (!gameStarted) {
        startGame();
    }
});

document.addEventListener("keydown", function (event) {
    if (event.key === " " && !gameStarted) { 
        startGame();
    } else if (event.key === " ") {
        spacePressed = !spacePressed; 
    }
  });

restartBtn.addEventListener("click", function() {
    document.location.reload();
});

addEventListener("load", (event) => {
    draw();
});


// Define ball properties
var ballRadius = 10;
var ballX = canvas.width / 2;
var ballY = canvas.height / 2;
var ballSpeedX = 2;
var ballSpeedY = 2;

// Define paddle properties
var paddleHeight = 130;
var paddleWidth = 10;
var leftPaddleY = canvas.height / 2 - paddleHeight / 2;
var rightPaddleY = canvas.height / 2 - paddleHeight / 2;
var paddleSpeed = 10;

// Define score properties
var leftPlayerScore = 0;
var rightPlayerScore = 0;
var maxScore = 1;

// Listen for keyboard events
document.addEventListener("keydown", keyDownHandler);
document.addEventListener("keyup", keyUpHandler);

// Handle key press
var upPressed = false;
var downPressed = false;
let wPressed = false;
let sPressed = false;

function keyDownHandler(e) {
    if (e.key === "ArrowUp") {
        upPressed = true;
    } else if (e.key === "ArrowDown") {
        downPressed = true;
    } else if (e.key === "w") {
        wPressed = true;
    } else if (e.key === "s") {
        sPressed = true;
    }
}

// Handle key release
function keyUpHandler(e) {
    if (e.key === "ArrowUp") {
        upPressed = false;
    } else if (e.key === "ArrowDown") {
        downPressed = false;
    } else if (e.key === "w") {
        wPressed = false;
    } else if (e.key === "s") {
        sPressed = false;
    }
}

// Update game state
function update() {
    if (spacePressed) {
        return; 
    }
    // Move paddles
    if (upPressed && rightPaddleY > 0) {
        rightPaddleY -= paddleSpeed;
    } else if (downPressed && rightPaddleY + paddleHeight < canvas.height) {
        rightPaddleY += paddleSpeed;
    }

    // Move right paddle based on "w" and "s" keys
    if (wPressed && leftPaddleY > 0) {
        leftPaddleY -= paddleSpeed;
    } else if (sPressed && leftPaddleY + paddleHeight < canvas.height) {
        leftPaddleY += paddleSpeed;
    }

    // Move ball
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    // Check if ball collides with top or bottom of canvas
    if (ballY - ballRadius < 0 || ballY + ballRadius > canvas.height) {
        ballSpeedY = -ballSpeedY;
    }

    // Check if ball collides with left paddle
    if (
        ballX - ballRadius < paddleWidth &&
        ballY > leftPaddleY &&
        ballY < leftPaddleY + paddleHeight
    ) {
        ballSpeedX = -ballSpeedX;
    }

    // Check if ball collides with right paddle
    if (
        ballX + ballRadius > canvas.width - paddleWidth &&
        ballY > rightPaddleY &&
        ballY < rightPaddleY + paddleHeight
    ) {
        ballSpeedX = -ballSpeedX;
    }

    // Check if ball goes out of bounds on left or right side of canvas
    if (ballX < 0) {
        rightPlayerScore++;
        reset();
    } else if (ballX > canvas.width) {
        leftPlayerScore++;
        reset();
    }

    if(leftPlayerScore >= 6 && leftPlayerScore === rightPlayerScore &&  scoresPerRound === leftPlayerScore + 1){
        scoresPerRound += 2;
    }
    
    if (leftPlayerScore >= scoresPerRound) {
        if (leftRoundScore === maxRounds) {
            playerWin("Left player", round);
            gameRunning = false;
        } else {
            // Reset for the next round
            reset();
            leftRoundScore++;
            round++;
        }
    } else if (rightPlayerScore >= scoresPerRound) {
        if (rightRoundScore === maxRounds) {
            playerWin("Right player", round);
            gameRunning = false;
        } else {
            // Reset for the next round
            reset();
            rightRoundScore++;
            round++;
        }
    }
    
}

function playerWin(player) {
    var message = "Congratulations! " + player + " won round " +round+ "!";
    $('#message').text(message); 
    $('#message-modal').modal('show'); 
    reset();
}

function reset() {
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
    ballSpeedX = -ballSpeedX;
    ballSpeedY = Math.random() * 10 - 5;
}

function draw() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  
    // Draw line in the center
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.setLineDash([4, 2]);
    ctx.strokeStyle = "#FFF";
    ctx.stroke();
    ctx.closePath();
  
    // Draw ball in red
    ctx.fillStyle = "#c21526";
    ctx.fillRect(ballX - ballRadius, ballY - ballRadius, 2 * ballRadius, 2 * ballRadius);
  
    // Draw left paddle in white
    ctx.fillStyle = "#FFF";
    ctx.fillRect(0, leftPaddleY, paddleWidth, paddleHeight);
  
    // Draw right paddle in white
    ctx.fillRect(canvas.width - paddleWidth, rightPaddleY, paddleWidth, paddleHeight);
  
    // Draw scores in white
    ctx.font = "35px Arial";
    ctx.fillText(leftPlayerScore, 365, 40);
    ctx.fillText(rightPlayerScore, canvas.width - 380, 40);
  
    // Draw round wins
    ctx.font = "20px Arial";
    ctx.fillStyle = "#FFF";
    ctx.fillText("WIN " + leftRoundScore, 35, 40);
    ctx.fillText("LOSS " + rightRoundScore, 20, 60);

    ctx.fillText("WIN " + rightRoundScore, canvas.width - 75, 40);
    ctx.fillText("LOSS " + leftRoundScore, canvas.width - 90, 60);

    // Draw round number at the bottom center
    ctx.font = "25px Arial";
    ctx.fillStyle = "#FFF";
    ctx.fillText("Round " + round + " / " + maxRounds, canvas.width / 2 - 60, canvas.height - 40);

    ctx.font = "15px Arial Italic";
    ctx.fillStyle = "#b2acdb";
    ctx.fillText("Press SPACE to START/PAUSE game", canvas.width / 2 - 100, canvas.height - 20);

    ctx.font = "15px Arial Italic";
    ctx.fillStyle = "#b2acdb";
    ctx.fillText("W to move UP, S to move DOWN", 20, canvas.height - 20);

    ctx.font = "15px Arial Italic";
    ctx.fillStyle = "#b2acdb";
    ctx.fillText("↑ to move UP, ↓ to move DOWN", 580, canvas.height - 20);


} 

function loop() {
  update();
  draw();
  animationId = requestAnimationFrame(loop);
}

$('#message-modal-close').on('click', function() {
  round++;
  gameRunning = true;
  startGame();
});