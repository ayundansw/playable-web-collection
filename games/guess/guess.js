document.addEventListener('DOMContentLoaded', () => {
    // 1. Elements
    const guessInput = document.getElementById('guess-input');
    const guessBtn = document.getElementById('guess-btn');
    const hintDisplay = document.getElementById('hint-display');
    const attemptsDisplay = document.getElementById('attempts-left');
    const bestRecordDisplay = document.getElementById('best-record');
    const historyList = document.getElementById('guess-history');
    const restartBtn = document.getElementById('restart-btn');
    const usernameInput = document.getElementById('username');
    const saveUserBtn = document.getElementById('save-user-btn');

    // 2. Game Variables
    const MAX_ATTEMPTS = 10;
    let targetNumber;
    let attemptsLeft;
    let attemptsTaken;
    let isGameActive = true;

    // 3. Storage Integration
    const GAME_KEY = 'guess_number';

    const savedName = StorageManager.getUsername();
    if (savedName) usernameInput.value = savedName;

    function loadBestRecord() {
        // High Score here is "Fewest attempts to win"
        // Lower is better.
        const record = StorageManager.getHighScore(GAME_KEY);
        if (record && record > 0) {
            bestRecordDisplay.textContent = record;
            return parseInt(record);
        } else {
            bestRecordDisplay.textContent = '-';
            return Infinity;
        }
    }

    let currentBestRecord = loadBestRecord();

    // 4. Logic Functions

    function initGame() {
        targetNumber = Math.floor(Math.random() * 100) + 1;
        attemptsLeft = MAX_ATTEMPTS;
        attemptsTaken = 0;
        isGameActive = true;

        // Reset UI
        attemptsDisplay.textContent = attemptsLeft;
        hintDisplay.textContent = "Mulai tebak!";
        hintDisplay.className = "hint-box";
        guessInput.value = "";
        guessInput.disabled = false;
        guessBtn.disabled = false;
        historyList.innerHTML = "";
        restartBtn.style.display = "none";

        console.log(`Psst... jawabannya ${targetNumber}`);
    }

    function checkGuess() {
        if (!isGameActive) return;

        const userGuess = parseInt(guessInput.value);

        if (isNaN(userGuess) || userGuess < 1 || userGuess > 100) {
            hintDisplay.textContent = "Masukkan angka 1-100!";
            return;
        }

        attemptsTaken++;
        attemptsLeft--;
        attemptsDisplay.textContent = attemptsLeft;

        // Add to history
        const historyItem = document.createElement('span');
        historyItem.classList.add('history-item');
        historyItem.textContent = userGuess;
        historyList.appendChild(historyItem);

        if (userGuess === targetNumber) {
            handleWin();
        } else if (attemptsLeft === 0) {
            handleLoss();
        } else {
            if (userGuess < targetNumber) {
                hintDisplay.textContent = "Terlalu Rendah!";
                hintDisplay.className = "hint-box low";
            } else {
                hintDisplay.textContent = "Terlalu Tinggi!";
                hintDisplay.className = "hint-box high";
            }
        }

        guessInput.value = "";
        guessInput.focus();
    }

    function handleWin() {
        isGameActive = false;
        hintDisplay.textContent = `BENAR! Angkanya adalah ${targetNumber}.`;
        hintDisplay.className = "hint-box correct";
        guessInput.disabled = true;
        guessBtn.disabled = true;
        restartBtn.style.display = "inline-block";

        // Save Best Record (Lower is better -> false)
        const isNewRecord = StorageManager.saveScore(GAME_KEY, attemptsTaken, false);

        if (isNewRecord) {
            currentBestRecord = attemptsTaken;
            bestRecordDisplay.textContent = attemptsTaken;
            alert(`Hebat! Kamu menebak dalam ${attemptsTaken} langkah. Ini rekor baru!`);
        } else {
            alert(`Selamat! Kamu berhasil menebak dalam ${attemptsTaken} langkah.`);
        }
    }

    function handleLoss() {
        isGameActive = false;
        hintDisplay.textContent = `Game Over! Angkanya adalah ${targetNumber}.`;
        hintDisplay.className = "hint-box"; // neutral or error
        guessInput.disabled = true;
        guessBtn.disabled = true;
        restartBtn.style.display = "inline-block";
    }

    // 5. Event Listeners
    guessBtn.addEventListener('click', checkGuess);

    guessInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') checkGuess();
    });

    restartBtn.addEventListener('click', initGame);

    saveUserBtn.addEventListener('click', () => {
        const name = usernameInput.value.trim();
        if (name) {
            StorageManager.setUsername(name);
            alert('Nama tersimpan!');
        }
    });

    // Start game on load
    initGame();
});
