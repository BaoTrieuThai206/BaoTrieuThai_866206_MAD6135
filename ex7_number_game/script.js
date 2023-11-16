const gridSize = 4;
const numberLeng = 16;
let numberClick = 0; 
const isStarting = false; 
var elapsedSeconds = 0; 

const numberGrid = document.getElementById("number-grid");
const startButton = document.getElementById("start-button");

let gridState = [];
let timerInterval;
let startTime;

function startGame(isStarting){
    if(isStarting){
        document.getElementById("game-rule").style.display = 'none';
        document.getElementById("game-info").style.display = 'block';
        document.getElementById("start-button").textContent = 'Start Again';
        initializeGrid();
    } else {
        document.getElementById("game-rule").style.display = 'block';
        document.getElementById("game-info").style.display = 'none';
    }
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function initializeGrid() {
    numberGrid.innerHTML = "";
    
    updateClickCounter(0);
    document.getElementById("timer").textContent = `Time: 0 seconds`;


    gridState = [];
    const numbers = Array.from({ length: numberLeng }, (_, i) => i);
    shuffleArray(numbers);

    for (let i = 0; i < gridSize; i++) {
        const row = document.createElement("div");
        row.classList.add("grid-row");
        for (let j = 0; j < gridSize; j++) {
            const index = i * gridSize + j;
            const tile = document.createElement("div");
            tile.classList.add("grid-tile");
            tile.textContent = numbers[index] === 0 ? "" : numbers[index];
            tile.addEventListener("click", () => clickTile(i, j));
            row.appendChild(tile);
            gridState.push({ tile, row: i, col: j });
        }
        numberGrid.appendChild(row);
    }

    clearInterval(timerInterval);
    startTime = new Date().getTime();
    timerInterval = setInterval(updateTimer, 1000);
}

function clickTile(row, col) {
    const tileIndex = row * gridSize + col;
    const tile = gridState[tileIndex];
    const blankTile = gridState.find((item) => item.tile.textContent === "");

    if (isAdjacent(tile, blankTile)) {
        numberClick++;
        updateClickCounter(numberClick);
        [tile.tile.textContent, blankTile.tile.textContent] = [blankTile.tile.textContent, tile.tile.textContent];
        if(isGameComplete()){
            isStarting = false;
            alert(`You won! With ${numberClick} in ${elapsedSeconds} seconds`);
        }
    }
}

function isAdjacent(tile1, tile2) {
    const rowDiff = Math.abs(tile1.row - tile2.row);
    const colDiff = Math.abs(tile1.col - tile2.col);
    return (rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1);
}

function updateTimer() {
    const currentTime = new Date().getTime();
    elapsedSeconds = Math.floor((currentTime - startTime) / 1000);
    document.getElementById("timer").textContent = `Time: ${elapsedSeconds} seconds`;
}

function updateClickCounter(times) {
    document.getElementById("click-counter").textContent = `Clicks: ${times}`;
}

function isGameComplete() {
    const winningOrder = Array.from({ length: gridSize * gridSize - 1 }, (_, i) => i + 1);
    for (let i = 0; i < winningOrder.length; i++) {
        if (parseInt(gridState[i].tile.textContent) !== winningOrder[i]) {
            return false;
        }
    }
    return gridState[gridState.length - 1].tile.textContent === ""; 
}


startGame(isStarting);
startButton.addEventListener("click", startGame);
