paper.setup('gameCanvas');

const canvasWidth = 600;
const canvasHeight = 800;

const levelText = new paper.PointText({
    point: new paper.Point(canvasWidth - 10, canvasHeight - 10),
    fillColor: 'black',
    fontSize: 20,
    justification: 'right'
});
levelText.content = "Level 1";

const livesText = new paper.PointText({
    point: new paper.Point(10, 30),
    fillColor: 'black',
    fontSize: 20,
    justification: 'left'
});
livesText.content = "Lives: 3";

const scoreText = new paper.PointText({
    point: new paper.Point(canvasWidth - 10, 30),
    fillColor: 'black',
    fontSize: 20,
    justification: 'right'
});
scoreText.content = "Score: 0";

const topScoresText = new paper.PointText({
    point: new paper.Point(10, canvasHeight - 130),
    fillColor: 'black',
    fontSize: 20,
    justification: 'left'
});
topScoresText.content = "Top Scores:";

const inputField = document.createElement("input");
inputField.type = "text";
inputField.className = "word-input";
inputField.style.position = "absolute";
inputField.style.bottom = "20";
inputField.style.right = "0";
inputField.autofocus = true;
document.body.appendChild(inputField);

const wordsLevel1 = [
    "cat", "dog", "bat", "sun", "sky", "pen", "box", "cup", "map", "hat",
    "red", "run", "car", "top", "fix"
];

const wordsLevel2 = [
    "lamp", "tree", "star", "moon", "fire", "fish", "book", "door", "bell", "rose",
    "ship", "king", "bird", "frog", "fish"
];

const wordsLevel3 = [
    "apple", "banana", "grape", "juice", "lemon", "piano", "house", "phone", "glove", "shirt",
    "plant", "table", "chair", "music", "glass"
];

const wordsLevel4 = [
    "animal", "border", "eleven", "custom", "damage", "choose", "church", "client", "driver", "bridge",
    "anyone", "career", "cancer", "cancel", "castle",
    "sizzle", "fossil", "jacket", "guitar", "thanks",
    "unveil", "unique", "pickle", "fabric", "flinch",
    "honest", "impair", "notice", "puzzle", "temper",
    "virgin", "waffle", "zipper",
    "carpet", "decent", "expert", "flavor", "golden",
    "hunger", "impact", "jungle", "killer", "laptop",
    "master", "nozzle", "pencil", "quaint", "racing",
    "scream", "tackle", "urgent", "vessel", "wonder",
    "zebra", "bricks", "chalks", "dinner", "effort",
    "famous", "gentle", "heroes", "insect", "jigsaw",
    "kettle", "lizard", "magnet", "noodle", "office",
    "puzzle", "quartz", "rocket", "safety", "thirst",
    "unique", "voyage", "whisky", "xyloid", "yellow",
];

let currentLevel = 1;
let score = 0;
let lives = 3;
let previousWord = null;
let isDroppingWord = false;
let correctCounting = 0;
let correctNeedToNextLevel = 2;
let randomWord = '';
let wordsArray = wordsLevel1;
let dropSpeed = 4;
let isGameOver = false;
let finalScores = [];


function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

const wordDisplay = new paper.PointText({
    point: new paper.Point(paper.view.center.x, 50),
    fillColor: getRandomColor(),
    fontSize: 45,
    justification: 'center'
});

function getRandomWord(wordArray) {
    let randomIndex;
    let randomWord;

    do {
        randomIndex = Math.floor(Math.random() * wordArray.length);
        randomWord = wordArray[randomIndex];
    } while (randomWord === previousWord);

    previousWord = randomWord;
    return randomWord;
}

function dropNextWord() {
    if (!isDroppingWord) {
        isDroppingWord = true;
        randomWord = getRandomWord(wordsArray);

        wordDisplay.content = randomWord;

        dropWord(randomWord);
    }
}

function dropWord(word) {
    let textPosition = new paper.Point(paper.view.center.x, 0);
    wordDisplay.position = textPosition;

    function animate() {
        if (isGameOver) {
            return; 
        }
        textPosition.y += dropSpeed;
        wordDisplay.position = textPosition;

        if (textPosition.y < canvasHeight) {
            requestAnimationFrame(animate);
        } else {
            isDroppingWord = false;
            dropNextWord();
        }
    }

    animate();
}

function checkInput(e) {
    if (isGameOver) {
        return;
    }

    if (e.key === 'Enter') {
        const inputText = document.querySelector(".word-input").value.trim();
        const wordLength = inputText.length;

        if (inputText.toLowerCase() === randomWord.toLowerCase()) {
            updateScore(wordLength);
            correctCounting++;
            if (correctCounting === correctNeedToNextLevel) {
                currentLevel++;
                levelText.content = "Level " + (currentLevel <= 4 ? currentLevel : 4);
                correctCounting = 0;
                updateWord(currentLevel);
            }

            document.querySelector(".word-input").value = "";
            dropNextWord();
        } else {
            lives--;
            livesText.content = "Lives: " + lives; 

            if (lives <= 0) {
                isGameOver = true;
                gameOver();
            }
        }

        scoreText.content = "Score: " + score; 

        console.log("correctNeedToNextLevel: " + correctNeedToNextLevel);
        console.log("currentLevel: " + currentLevel);
        console.log("currentLevel: " + currentLevel);
        console.log("dropSpeed: " + dropSpeed);
    }
}


function updateWord(currentLevel) {
    if (currentLevel === 1) {
        wordsArray = wordsLevel1;
        dropSpeed = 1;
    } else if (currentLevel === 2) {
        wordsArray = wordsLevel2;
        dropSpeed = 2;
    } else if (currentLevel === 3) {
        wordsArray = wordsLevel3;
        dropSpeed = 3;
    } else{
        wordsArray = wordsLevel4;
        dropSpeed = 4;
    }
}

function updateScore(wordLength) {
    if (wordLength === 3) {
        score += 3;
    } else if (wordLength === 4) {
        score += 4;
    } else if (wordLength === 5) {
        score += 5;
    } else if (wordLength === 6) {
        score += 6;
    }
    scoreText.content = "Score: " + score;
}

function gameOver() {
    if (localStorage.getItem("finalScores")) {
        finalScores = JSON.parse(localStorage.getItem("finalScores")) || [];
    }
    
    finalScores.push(score);
    finalScores.sort((a, b) => b - a);

    const topScores = finalScores.slice(0, 5);
    localStorage.setItem("finalScores", JSON.stringify(topScores));
    showTopScores();

    const centerX = canvasWidth / 2;
    const centerY = canvasHeight / 2;
    const squareWidth = 600;
    const squareHeight = 300;

    const square = new paper.Path.Rectangle({
        point: new paper.Point(centerX - squareWidth / 2, centerY - squareHeight / 2),
        size: new paper.Size(squareWidth, squareHeight),
        fillColor: 'grey'
    });

    const gameOverText = new paper.PointText({
        point: new paper.Point(centerX, centerY - 10),
        content: "GAME OVER",
        fillColor: 'white',
        fontSize: 24,
        justification: 'center'
    });

    const finalScoreText = new paper.PointText({
        point: new paper.Point(centerX, centerY + 20),
        content: "Final Score: " + score,
        fillColor: 'white',
        fontSize: 18,
        justification: 'center'
    });

}

function showTopScores() {
    topScores = JSON.parse(localStorage.getItem("finalScores")) || [];
    topScoresText.content = "Top Scores:\n";
    if (topScores.length === 0) {
        for (let i = 0; i < 5; i++) {
            topScoresText.content += `${i + 1}. ...\n`;
        }
    } else {
        for (let i = 0; i < 5; i++) {
            topScoresText.content += `${i + 1}. ${topScores[i] ? topScores[i] : '...'}\n`;
        }
    }
}


function startGame() {
    if (!isGameOver) {
        wordsArray = wordsLevel1;
        dropSpeed = 1;
        dropNextWord();
    }
}

showTopScores();
startGame();
document.querySelector(".word-input").addEventListener("keydown", checkInput);
