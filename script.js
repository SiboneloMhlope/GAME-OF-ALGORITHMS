let array = [];
let selected = [];
let moves = 0;
let maxMoves = 20;

const container = document.getElementById("array");
const movesText = document.getElementById("moves");
const statusText = document.getElementById("status");

const swapSound = document.getElementById("swapSound");
const winSound = document.getElementById("winSound");
const loseSound = document.getElementById("loseSound");

// Generate random array
function generateArray() {
    array = [];
    moves = 0;
    selected = [];
    statusText.textContent = "";

    for (let i = 0; i < 8; i++) {
        array.push(Math.floor(Math.random() * 100) + 10);
    }

    renderBars();
    updateUI();
}

// Render bars
function renderBars() {
    container.innerHTML = "";

    array.forEach((value, index) => {
        const bar = document.createElement("div");
        bar.classList.add("bar");
        bar.style.height = value + "px";

        bar.onclick = () => selectBar(index);

        container.appendChild(bar);
    });
}

// Select bars to swap
function selectBar(index) {
    selected.push(index);

    highlightSelection();

    if (selected.length === 2) {
        setTimeout(() => {
            swap(selected[0], selected[1]);
            selected = [];
        }, 300);
    }
}

// Highlight selected bars
function highlightSelection() {
    const bars = document.querySelectorAll(".bar");

    bars.forEach(bar => bar.classList.remove("comparing"));

    selected.forEach(i => {
        bars[i].classList.add("comparing");
    });
}

// Swap logic
function swap(i, j) {
    if (moves >= maxMoves) return;

    const bars = document.querySelectorAll(".bar");

    bars[i].classList.add("swapping");
    bars[j].classList.add("swapping");

    // Swap values
    let temp = array[i];
    array[i] = array[j];
    array[j] = temp;

    swapSound.currentTime = 0;
    swapSound.play();

    moves++;
    updateUI();

    setTimeout(() => {
        renderBars();
        checkWin();
        checkLose();
    }, 300);
}

// Update UI
function updateUI() {
    movesText.textContent = "Moves: " + moves;
}

// Check if sorted
function isSorted(arr) {
    for (let i = 0; i < arr.length - 1; i++) {
        if (arr[i] > arr[i + 1]) return false;
    }
    return true;
}

// Win condition
function checkWin() {
    if (isSorted(array)) {
        winSound.play();
        statusText.textContent = "🎉 You Win!";
        markSorted();
    }
}

// Lose condition
function checkLose() {
    if (moves >= maxMoves && !isSorted(array)) {
        loseSound.play();
        statusText.textContent = "❌ You Lose!";
    }
}

// Color all sorted
function markSorted() {
    const bars = document.querySelectorAll(".bar");
    bars.forEach(bar => bar.classList.add("sorted"));
}

// Start game
generateArray();