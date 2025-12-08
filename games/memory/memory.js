document.addEventListener('DOMContentLoaded', () => {
    // 1. Elements
    const gameBoard = document.getElementById('game-board');
    const timerDisplay = document.getElementById('timer');
    const movesDisplay = document.getElementById('moves');
    const bestTimeDisplay = document.getElementById('best-time');
    const startBtn = document.getElementById('start-btn');
    const usernameInput = document.getElementById('username');
    const saveUserBtn = document.getElementById('save-user-btn');

    // 2. Game Variables
    const cardIcons = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼'];
    let cards = []; // Will hold pairs
    let flippedCards = [];
    let matchedPairs = 0;
    let moves = 0;
    let timer = 0;
    let timerInterval = null;
    let isGameActive = false;
    let isLocked = false; // To prevent clicking more than 2 cards

    // 3. Storage Integration
    const GAME_KEY = 'memory';

    // Load username
    const savedName = StorageManager.getUsername();
    if (savedName) {
        usernameInput.value = savedName;
    }

    // Load High Score (Best Time)
    function loadBestTime() {
        const bestTime = StorageManager.getHighScore(GAME_KEY);
        if (bestTime && bestTime > 0) {
            bestTimeDisplay.textContent = `${bestTime}s`;
            return parseInt(bestTime);
        } else {
            bestTimeDisplay.textContent = '-';
            return Infinity;
        }
    }

    let currentBestTime = loadBestTime();

    // 4. Game Logic Functions

    function initGame() {
        // Reset state
        clearInterval(timerInterval);
        timer = 0;
        moves = 0;
        matchedPairs = 0;
        flippedCards = [];
        isLocked = false;
        isGameActive = true;

        timerDisplay.textContent = '0s';
        movesDisplay.textContent = '0';
        gameBoard.innerHTML = '';
        startBtn.textContent = 'Restart Game';

        // Prepare cards
        cards = [...cardIcons, ...cardIcons];
        shuffleArray(cards);

        // Render cards
        cards.forEach((icon, index) => {
            const card = document.createElement('div');
            card.classList.add('card');
            card.dataset.index = index;
            card.dataset.icon = icon;

            const frontFace = document.createElement('div');
            frontFace.classList.add('card-face', 'card-front');
            frontFace.textContent = '?';

            const backFace = document.createElement('div');
            backFace.classList.add('card-face', 'card-back');
            backFace.textContent = icon;

            card.appendChild(frontFace);
            card.appendChild(backFace);

            card.addEventListener('click', () => handleCardClick(card));

            gameBoard.appendChild(card);
        });

        // Start Timer
        timerInterval = setInterval(() => {
            timer++;
            timerDisplay.textContent = `${timer}s`;
        }, 1000);
    }

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    function handleCardClick(card) {
        if (!isGameActive || isLocked) return;
        if (card.classList.contains('flipped')) return;

        flipCard(card);
        flippedCards.push(card);

        if (flippedCards.length === 2) {
            moves++;
            movesDisplay.textContent = moves;
            checkMatch();
        }
    }

    function flipCard(card) {
        card.classList.add('flipped');
    }

    function unflipCard(card) {
        card.classList.remove('flipped');
    }

    function checkMatch() {
        isLocked = true;
        const [card1, card2] = flippedCards;
        const match = card1.dataset.icon === card2.dataset.icon;

        if (match) {
            disableCards();
        } else {
            setTimeout(() => {
                unflipCards();
            }, 1000);
        }
    }

    function disableCards() {
        flippedCards.forEach(card => {
            card.classList.add('matched');
        });
        flippedCards = [];
        matchedPairs++;
        isLocked = false;

        if (matchedPairs === cardIcons.length) {
            endGame();
        }
    }

    function unflipCards() {
        flippedCards.forEach(card => unflipCard(card));
        flippedCards = [];
        isLocked = false;
    }

    function endGame() {
        clearInterval(timerInterval);
        isGameActive = false;

        // Save Score (Lower time is better -> false)
        const isNewRecord = StorageManager.saveScore(GAME_KEY, timer, false);

        if (isNewRecord) {
            currentBestTime = timer;
            bestTimeDisplay.textContent = `${currentBestTime}s`;
            alert(`Selamat! Rekor Baru: ${currentBestTime} detik!`);
        } else {
            alert(`Permainan Selesai! Waktu kamu: ${timer} detik.`);
        }
    }

    // 5. Event Listeners
    startBtn.addEventListener('click', initGame);

    saveUserBtn.addEventListener('click', () => {
        const name = usernameInput.value.trim();
        if (name) {
            StorageManager.setUsername(name);
            alert('Nama tersimpan!');
        }
    });

});
