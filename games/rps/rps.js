document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const playerLabel = document.getElementById('player-label');
    const usernameInput = document.getElementById('username');
    const saveUserBtn = document.getElementById('save-user-btn');
    const playerScoreEl = document.getElementById('player-score');
    const computerScoreEl = document.getElementById('computer-score');
    const highScoreEl = document.getElementById('high-score');
    const resultMessageEl = document.getElementById('result-message');
    const resultDetailsEl = document.getElementById('result-details');
    const choiceBtns = document.querySelectorAll('.choice-btn');
    const resetBtn = document.getElementById('reset-btn');

    // Game State
    let playerScore = 0;
    let computerScore = 0;
    let currentStreak = 0; // Tracking consecutive wins for High Score? Or just total wins?
                           // Requirement says "Tambah skor, Simpan skor tertinggi".
                           // Usually for RPS, high score is either max wins in a session or streak.
                           // I will track "Total Wins" as the score to be saved for simplicity and persistence.
                           // Actually, "Score Real-time" usually implies current session.
                           // "High Score" implies best session score.
                           // Let's stick to: Score = Current Session Wins. High Score = Max Wins in a session ever.

    // Config
    const CHOICES = ['rock', 'paper', 'scissors'];
    const ICONS = { rock: '✊', paper: '✋', scissors: '✌️' };
    const GAME_ID = 'rps';

    // Initialize
    init();

    function init() {
        // Load Username
        const savedName = window.StorageManager.getUsername();
        if (savedName) {
            usernameInput.value = savedName;
            playerLabel.textContent = savedName;
        }

        // Load High Score
        updateHighScoreDisplay();

        // Event Listeners
        saveUserBtn.addEventListener('click', () => {
            const name = usernameInput.value.trim() || 'Player';
            window.StorageManager.setUsername(name);
            playerLabel.textContent = name;
            alert(`Nama tersimpan: ${name}`);
        });

        choiceBtns.forEach(btn => {
            btn.addEventListener('click', () => playRound(btn.dataset.choice));
        });

        resetBtn.addEventListener('click', resetGame);
    }

    function updateHighScoreDisplay() {
        const highScore = window.StorageManager.getHighScore(GAME_ID) || 0;
        highScoreEl.textContent = highScore;
    }

    function getComputerChoice() {
        const randomIndex = Math.floor(Math.random() * CHOICES.length);
        return CHOICES[randomIndex];
    }

    function determineWinner(player, computer) {
        if (player === computer) return 'draw';

        if (
            (player === 'rock' && computer === 'scissors') ||
            (player === 'paper' && computer === 'rock') ||
            (player === 'scissors' && computer === 'paper')
        ) {
            return 'player';
        }

        return 'computer';
    }

    function playRound(playerChoice) {
        // Disable buttons temporarily
        choiceBtns.forEach(btn => btn.disabled = true);

        const computerChoice = getComputerChoice();
        const winner = determineWinner(playerChoice, computerChoice);

        // Animation simulation (optional, can be expanded)
        resultMessageEl.textContent = "Computer memilih...";
        resultDetailsEl.textContent = "";

        setTimeout(() => {
            // Update UI with result
            const playerIcon = ICONS[playerChoice];
            const computerIcon = ICONS[computerChoice];

            resultDetailsEl.innerHTML = `Anda: ${playerIcon} vs Komputer: ${computerIcon}`;

            if (winner === 'player') {
                playerScore++;
                playerScoreEl.textContent = playerScore;
                resultMessageEl.textContent = "Anda Menang! 🎉";
                resultMessageEl.style.color = "var(--success)";

                // Check and Save High Score
                const isNewRecord = window.StorageManager.saveScore(GAME_ID, playerScore);
                if (isNewRecord) {
                    updateHighScoreDisplay();
                    // Optional: Celebrate new record
                }
            } else if (winner === 'computer') {
                computerScore++;
                computerScoreEl.textContent = computerScore;
                resultMessageEl.textContent = "Anda Kalah! 😢";
                resultMessageEl.style.color = "var(--danger)";
                // Reset score on loss? Usually RPS is just accumulation until reset.
                // But if it's "High Score" based on session, maybe we keep it accumulating.
                // Requirement: "Simpan skor tertinggi".
                // If I just accumulate forever, high score is just total plays.
                // Let's assume standard arcade rules: Game Over isn't really a thing here unless we add lives.
                // So Score = Wins in this session. High Score = Best Session Wins.
            } else {
                resultMessageEl.textContent = "Seri! 😐";
                resultMessageEl.style.color = "var(--text-secondary)";
            }

            // Re-enable buttons
            choiceBtns.forEach(btn => btn.disabled = false);

        }, 500); // 500ms delay for "thinking"
    }

    function resetGame() {
        playerScore = 0;
        computerScore = 0;
        playerScoreEl.textContent = '0';
        computerScoreEl.textContent = '0';
        resultMessageEl.textContent = "Mulai permainan baru";
        resultMessageEl.style.color = "var(--text-primary)";
        resultDetailsEl.textContent = "";
    }
});
