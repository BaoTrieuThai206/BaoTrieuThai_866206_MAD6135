const tileImages = ['image1.png', 'image2.png', 'image3.png', 'image4.png', 'image5.png', 'image6.png', 'image7.png', 'image8.png'];

const tilePairs = tileImages.concat(tileImages);
const totalPairs = tileImages.length;

let clickCount = 0;
let timer = 0;
let isTiming = false;

const gameBoard = document.querySelector('.game-board');
const clickCountDisplay = document.querySelector('#click-count');
const timerDisplay = document.querySelector('#timer');

tilePairs.sort(() => Math.random() - 0.5);

tilePairs.forEach((image, index) => {
    const tile = document.createElement('div');
    tile.classList.add('tile');

    const tileInner = document.createElement('div');
    tileInner.classList.add('tile-inner');

    const front = document.createElement('div');
    front.classList.add('front');

    const back = document.createElement('div');
    back.classList.add('back');

    const img = document.createElement('img');
    img.src = 'img/' + image;
    img.alt = 'Image ' + (index + 1);

    back.appendChild(img);
    tileInner.appendChild(front);
    tileInner.appendChild(back);
    tile.appendChild(tileInner);

    tile.dataset.image = image;

    tile.addEventListener('click', () => {
        if (isTiming) return;

        tileInner.style.transform = 'rotateY(180deg)';
        tileInner.classList.add("opened");

        const flippedTiles = document.querySelectorAll('.tile-inner.opened');
        if (flippedTiles.length === 2) {
            const [firstTile, secondTile] = flippedTiles;

            if (firstTile.parentElement.dataset.image !== secondTile.parentElement.dataset.image) {
                isTiming = true;
                setTimeout(() => {
                    firstTile.style.transform = 'rotateY(0deg)';
                    secondTile.style.transform = 'rotateY(0deg)';
                    isTiming = false;
                }, 3000);
            } else {
                firstTile.classList.add("done");
                secondTile.classList.add("done");
            }

            firstTile.classList.remove('opened');
            secondTile.classList.remove('opened');
            clickCount++;
            clickCountDisplay.textContent = clickCount;

            const doneTiles = document.querySelectorAll('.tile-inner.done');
            if (doneTiles.length === totalPairs * 2) {
                clearInterval(gameTimer);
                alert("You Win!");
                saveScore(timer, clickCount);
                displayTopScores();
            }
        }
    });

    gameBoard.appendChild(tile);
});

function saveScore(time, clicks) {
    const scores = JSON.parse(localStorage.getItem('gameScores')) || [];
    const newScore = { time, clicks };
    scores.push(newScore);
    scores.sort((a, b) => {
        if (a.time !== b.time) {
            return a.time - b.time;
        } else {
            return a.clicks - b.clicks;
        }
    });
    if (scores.length > 5) {
        scores.pop();
    }
    localStorage.setItem('gameScores', JSON.stringify(scores));
}

function displayTopScores() {
    const scores = JSON.parse(localStorage.getItem('gameScores')) || [];
    const scoreList = document.getElementById('game-score-list');
    const ul = document.createElement('ul');

    for (let i = 0; i < scores.length; i++) {
        const score = scores[i];
        const li = document.createElement('li');
        li.textContent = `${i + 1}. ${score.time} seconds & ${score.clicks} clicks`;
        ul.appendChild(li);
    }

    scoreList.innerHTML = ''; 
    scoreList.appendChild(ul);
}

const gameTimer = setInterval(() => {
    if (document.querySelectorAll('.tile-inner.opened').length === totalPairs * 2) {
        clearInterval(gameTimer);
    } else {
        timer++;
        timerDisplay.textContent = timer + ' seconds';
    }
}, 1000);

displayTopScores();

function resetGame(){
    const tiles = document.querySelectorAll('.tile');
    for (const tile of tiles) {
        tile.innerHTML = '';
    }
    clickCount = 0;
    timer = 0;
    isTiming = false;
    clickCountDisplay.textContent = '0';
    timerDisplay.textContent = '0 seconds';
}

