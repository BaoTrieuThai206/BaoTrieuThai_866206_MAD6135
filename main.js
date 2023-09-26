$(document).ready(function() {
    'use strict';
    console.log('main.js loaded');
    paper.install(window);
    paper.setup(document.getElementById('mainCanvas'));

    let maxWithCanvas = 800,
        maxHeightCanvas = 600,
        minRadius = 10,
        maxRadius = 30;
    var circleCount = 0;
    var circleText = 0;

    var circleCounts = [30, 20, 10];
    var currentCircleCountIndex = 0;

    paper.view.viewSize = new Size(maxWithCanvas, maxHeightCanvas);
    var canvasElement = document.getElementById('mainCanvas');
    canvasElement.style.backgroundColor = '#e3dcdc';
    var countElement = document.getElementById("count");
    var gameOver = document.getElementById("gameOver");

    function setRandomColorForCircle() {
        var colors = ['black', 'red', 'blue', 'green', 'yellow', 'brown',
                    'orange', 'pink', 'teal', 'maroon', 'navy', 'lime',
                    'violet', 'olive', 'cyan', 'magenta', 'indigo',
                    'purple', 'gold', 'silver', 'gray', 'darkred', 'darkblue',
                    'darkgreen', 'darkorange', 'darkcyan', 'darkviolet', 'darkmagenta',
                    ];
        var index = Math.floor(Math.random() * colors.length);
        return colors[index];
    }
    function createRandomCircle() {
        if (circleCount < circleCounts[currentCircleCountIndex]) {
            var x = Math.random() * (maxWithCanvas - 2 * maxRadius) + maxRadius; 
            var y = Math.random() * (maxHeightCanvas - 2 * maxRadius) + maxRadius; 
            var radius = Math.random() * (maxRadius - minRadius) + minRadius; 
            var circle = new Shape.Circle(x, y, radius);
            var circleFillColor = setRandomColorForCircle();
            circle.fillColor = circleFillColor;

            circleCount++;
            circleText++;
            var text = new PointText({
                point: circle.position,
                content: circleText.toString(),
                justification: 'center',
                fontSize: radius * 0.8,
                fillColor: circleFillColor === 'yellow' ? 'black' : 'white'
            });
            showLablelCounting();
        } else {
            if (currentCircleCountIndex < circleCounts.length - 1) {
                currentCircleCountIndex++;
                circleCount = 0;
            } else {
                showGameOver();
            }
        }
    }

    function showLablelCounting() {
        if (countElement) {
            countElement.textContent = "Total: " + circleText + ' circles';
        }
    }

    function showGameOver() {
        if (gameOver) {
            gameOver.textContent = "Game Over";
        }
    }

    var timer = setInterval(function() {
        createRandomCircle();
    }, 500);

    setTimeout(function() {
        clearInterval(timer);
    }, 35000);

    paper.view.draw();
});
