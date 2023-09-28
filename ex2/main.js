paper.setup('myCanvas');
var canvasWidth = 800;
var canvasHeight = 600;

var square = new paper.Path.Rectangle({
    point: [25, 25], 
    size: [50, 50],
    fillColor: 'blue' 
});

var roundCount = 0; 
var isAtTopLeft = false;
var direction = 'up'; 
var isRoundCompleted = true; 
var countText;

function updateRoundText() {
    if (countText) {
        countText.remove(); 
    }
    countText = new paper.PointText({
        content: 'Round: ' + (roundCount + 1), 
        point: paper.view.center,
        justification: 'center',
        fontSize: 24,
        fillColor: 'black'
    });
}


updateRoundText();

function moveSquare() {
    var speed = 5;

    if (square.position.x === 25 && square.position.y === 25) {
        isAtTopLeft = true;
    } else {
        isAtTopLeft = false;
    }

    switch (direction) {
        case 'up':
            if (square.position.y - speed >= 25) {
                square.position.y -= speed;
            } else {
                square.position.y = 25;
                direction = 'left';
                square.fillColor = "blue";
            }
            break;
        case 'left':
            if (square.position.x - speed >= 25) {
                square.position.x -= speed;
            } else {
                square.fillColor = "blue";
                square.position.x = 25;
                direction = 'down';
                if (!isRoundCompleted) {
                    isRoundCompleted = true;
                    setTimeout(() => {
                        direction = 'left'; 
                        square.fillColor = getRandomColor();
                        setTimeout(() => {
                            isRoundCompleted = false;
                            roundCount++;
                            updateRoundText();
                        }, 2000); 
                    }, 2000); 
                }
                square.fillColor = getRandomColor();
            }
            break;
        case 'down':
            if (square.position.y + speed <= canvasHeight - 25) {
                square.position.y += speed;
            } else {
                square.position.y = canvasHeight - 25;
                direction = 'right';
                square.fillColor = getRandomColor();
            }
            break;
        case 'right':
            if (square.position.x + speed <= canvasWidth - 25) {
                square.position.x += speed;
            } else {
                square.position.x = canvasWidth - 25;
                direction = 'up';
                square.fillColor = getRandomColor();
            }
            break;
    }

    paper.view.draw();

    requestAnimationFrame(moveSquare);
}

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

moveSquare();
