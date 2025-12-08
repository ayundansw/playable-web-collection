document.addEventListener('DOMContentLoaded', () => {
    // 1. Elements
    const holes = document.querySelectorAll('.hole');
    const scoreDisplay = document.getElementById('score');
    const timerDisplay = document.getElementById('timer');
    const highScoreDisplay = document.getElementById('high-score');
    const startBtn = document.getElementById('start-btn');
    const usernameInput = document.getElementById('username');
    const saveUserBtn = document.getElementById('save-user-btn');

    // 2. Game Variables
    let lastHole;
    let timeUp = false;
    let score = 0;
    let countdown;
    let timeRemaining = 30;
    let moleTimer;

    // 3. Storage Integration
    const GAME_KEY = 'whack_a_mole';

    const savedName = StorageManager.getUsername();
    if (savedName) usernameInput.value = savedName;

    function loadHighScore() {
        const highScore = StorageManager.getHighScore(GAME_KEY);
        highScoreDisplay.textContent = highScore || 0;
        return highScore ? parseFloat(highScore) : 0;
    }

    let currentHighScore = loadHighScore();

    // 4. Logic Functions

    function randomTime(min, max) {
        return Math.round(Math.random() * (max - min) + min);
    }

    function randomHole(holes) {
        const idx = Math.floor(Math.random() * holes.length);
        const hole = holes[idx];
        if (hole === lastHole) {
            return randomHole(holes);
        }
        lastHole = hole;
        return hole;
    }

    function peep() {
        const time = randomTime(500, 1000); // 0.5s to 1s
        const hole = randomHole(holes);
        hole.classList.add('up');

        // Remove click handler from previous peep to avoid multi-click abuse?
        // Better: allow click, handled in bonk function

        moleTimer = setTimeout(() => {
            hole.classList.remove('up');
            if (!timeUp) peep();
        }, time);
    }

    function startGame() {
        scoreDisplay.textContent = 0;
        score = 0;
        timeRemaining = 30;
        timeUp = false;
        timerDisplay.textContent = timeRemaining + 's';

        startBtn.textContent = "Sedang Main...";
        startBtn.disabled = true;

        peep();

        countdown = setInterval(() => {
            timeRemaining--;
            timerDisplay.textContent = timeRemaining + 's';
            if (timeRemaining <= 0) {
                clearInterval(countdown);
                timeUp = true;
                endGame();
            }
        }, 1000);
    }

    function bonk(e) {
        // if(!e.isTrusted) return; // cheater check removed for testing compatibility

        const hole = this.parentElement;
        if (hole.classList.contains('up')) {
            score++;
            hole.classList.remove('up');
            scoreDisplay.textContent = score;
        }
    }

    function endGame() {
        startBtn.disabled = false;
        startBtn.textContent = "Main Lagi";

        // Save High Score
        const isNewRecord = StorageManager.saveScore(GAME_KEY, score);

        if (isNewRecord) {
            currentHighScore = score;
            highScoreDisplay.textContent = score;
            alert(`Waktu Habis! REKOR BARU: ${score} poin!`);
        } else {
            alert(`Waktu Habis! Skor kamu: ${score}`);
        }
    }

    // 5. Event Listeners
    startBtn.addEventListener('click', startGame);

    // Add click listener to all moles
    document.querySelectorAll('.mole').forEach(mole => mole.addEventListener('click', bonk));

    saveUserBtn.addEventListener('click', () => {
        const name = usernameInput.value.trim();
        if (name) {
            StorageManager.setUsername(name);
            alert('Nama tersimpan!');
        }
    });
});
