let arr = [];
let score = 0;
let level = 1;
let time = 30;
let baseTime = 30;
let timer;

let completedLevels = new Set(JSON.parse(localStorage.getItem("levels")) || []);
let scores = JSON.parse(localStorage.getItem("scores")) || [];

// 🎵 MUSIC
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
let musicOn = false;
let melodyIndex = 0;
let melodyTimer;
const melody = [262, 294, 330, 349, 392, 440, 392, 330];

function playNote(freq, dur = 0.3) {
    let o = audioCtx.createOscillator();
    let g = audioCtx.createGain();
    o.connect(g); g.connect(audioCtx.destination);
    o.frequency.value = freq;
    o.start();
    g.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + dur);
    setTimeout(() => o.stop(), dur * 1000);
}

function toggleMusic() {
    if (!musicOn) {
        melodyTimer = setInterval(() => {
            playNote(melody[melodyIndex % melody.length]);
            melodyIndex++;
        }, 400);
        musicOn = true;
    } else {
        clearInterval(melodyTimer);
        musicOn = false;
    }
}

// 🎮 START
function startGame() {
    clearInterval(timer);

    time = baseTime;

    arr = Array.from({ length: 3 + level * 3 }, () =>
        Math.floor(Math.random() * 100)
    );

    document.getElementById("levelsPage").style.display = "none";
    document.getElementById("game").style.display = "flex";
    document.getElementById("message").innerText = "";

    render();
    updateHUD();
    displayLeaderboard();

    timer = setInterval(() => {
        time--;
        updateHUD();
        if (time <= 0) loseGame();
    }, 1000);
}

// 🔁 SWAP
function swap(i) {
    if (i >= arr.length - 1) return;

    let rect = document.getElementById("game").children[i].getBoundingClientRect();

    if (arr[i] > arr[i + 1]) {
        [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
        score += 10;
        createParticles(rect.left, rect.top);
        playNote(500, 0.1);
    } else {
        score -= 5;
        playNote(150, 0.2);
    }

    render();
    updateHUD();

    if (isSorted()) winLevel();
}

// ✅ SORT CHECK
function isSorted() {
    return arr.every((v, i) => i === 0 || arr[i - 1] <= v);
}

// 🎉 WIN
function winLevel() {
    clearInterval(timer);

    completedLevels.add(level);
    localStorage.setItem("levels", JSON.stringify([...completedLevels]));

    score += time * 5;

    document.getElementById("message").innerText = "🎉 WELL DONE!";

    baseTime += 5;

    if (level < 100) {
        level++;
        setTimeout(startGame, 1200);
    } else {
        saveScore(score);
    }
}

// ❌ LOSE
function loseGame() {
    clearInterval(timer);
    document.getElementById("message").innerText = "❌ YOU LOSE!";
    saveScore(score);
}

// 🏆 LEADERBOARD
function saveScore(s) {
    if (s <= 0) return;

    scores.push(s);
    scores.sort((a, b) => b - a);
    scores = scores.slice(0, 5);

    localStorage.setItem("scores", JSON.stringify(scores));
    displayLeaderboard();
}

function displayLeaderboard() {
    let list = document.getElementById("leaderboard");
    list.innerHTML = "";

    scores.forEach(s => {
        let li = document.createElement("li");
        li.innerText = s;
        list.appendChild(li);
    });
}

// 🎨 RENDER
function render() {
    let game = document.getElementById("game");
    game.innerHTML = "";

    let sorted = [...arr].sort((a, b) => a - b);

    arr.forEach((num, i) => {
        let b = document.createElement("div");
        b.className = "bubble";
        b.innerText = num;

        if (num === sorted[i]) b.classList.add("sorted");

        b.onclick = () => swap(i);
        game.appendChild(b);
    });
}

// ✨ PARTICLES
function createParticles(x, y) {
    for (let i = 0; i < 6; i++) {
        let p = document.createElement("div");
        p.className = "particle";
        p.style.left = x + "px";
        p.style.top = y + "px";
        document.body.appendChild(p);
        setTimeout(() => p.remove(), 600);
    }
}

// 📊 HUD
function updateHUD() {
    document.getElementById("score").innerText = score;
    document.getElementById("level").innerText = level;
    document.getElementById("time").innerText = time;
}

// 💡 HINT
function showHint() {
    let bubbles = document.getElementById("game").children;

    for (let i = 0; i < arr.length - 1; i++) {
        if (arr[i] > arr[i + 1]) {
            bubbles[i].style.outline = "3px solid yellow";
            bubbles[i + 1].style.outline = "3px solid yellow";
            return;
        }
    }
}

// 📚 LEVELS TOGGLE (FIXED)
function toggleLevels() {
    let page = document.getElementById("levelsPage");
    let game = document.getElementById("game");

    if (page.style.display === "block") {
        page.style.display = "none";
        game.style.display = "flex";
        return;
    }

    game.style.display = "none";
    page.style.display = "block";

    page.innerHTML = `
        <h2>Levels</h2>
        <button onclick="toggleLevels()">❌ Close</button>
        <div id="levelsGrid"></div>
    `;

    let grid = document.getElementById("levelsGrid");

    for (let i = 1; i <= 100; i++) {
        let box = document.createElement("div");
        box.className = "level-box";
        box.innerText = i;

        if (completedLevels.has(i)) {
            box.classList.add("completed");
        }

        grid.appendChild(box);
    }
}
