document.addEventListener('DOMContentLoaded', () => {
    // 1. Elements
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    const scoreDisplay = document.getElementById('score');
    const highScoreDisplay = document.getElementById('high-score');
    const startBtn = document.getElementById('start-btn');
    const overlay = document.getElementById('game-overlay');
    const overlayTitle = document.getElementById('overlay-title');
    const usernameInput = document.getElementById('username');
    const saveUserBtn = document.getElementById('save-user-btn');
    const leftBtn = document.getElementById('left-btn');
    const rightBtn = document.getElementById('right-btn');

    // 2. Game Variables
    let animationId;
    let isGameRunning = false;
    let score = 0; // Time in seconds/frames
    let startTime = 0;

    // Player
    const player = {
        x: canvas.width / 2 - 15,
        y: canvas.height - 40,
        width: 30,
        height: 30,
        speed: 5,
        dx: 0,
        color: '#8b5cf6' // Primary Purple
    };

    // Obstacles
    let obstacles = [];
    let obstacleSpeed = 3;
    let spawnRate = 60; // Frames
    let frameCount = 0;

    // 3. Storage Integration
    const GAME_KEY = 'mini_dodge';

    const savedName = StorageManager.getUsername();
    if (savedName) usernameInput.value = savedName;

    function loadHighScore() {
        const highScore = StorageManager.getHighScore(GAME_KEY);
        // High Score is survival time (seconds)
        if (highScore) {
            highScoreDisplay.textContent = parseFloat(highScore).toFixed(1) + 's';
            return parseFloat(highScore);
        }
        return 0;
    }

    let currentHighScore = loadHighScore();

    // 4. Game Logic

    function initGame() {
        isGameRunning = true;
        score = 0;
        obstacles = [];
        frameCount = 0;
        obstacleSpeed = 3;
        spawnRate = 60;
        player.x = canvas.width / 2 - player.width / 2;
        player.dx = 0;

        overlay.style.display = 'none';
        startTime = Date.now();

        loop();
    }

    function spawnObstacle() {
        const width = Math.random() * 40 + 20; // 20-60px
        const x = Math.random() * (canvas.width - width);
        obstacles.push({
            x: x,
            y: -30,
            width: width,
            height: 20,
            color: '#ef4444' // Red
        });
    }

    function update() {
        // Player movement
        player.x += player.dx;

        // Boundaries
        if (player.x < 0) player.x = 0;
        if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;

        // Obstacles
        frameCount++;
        if (frameCount % spawnRate === 0) {
            spawnObstacle();
        }

        // Increase difficulty
        if (frameCount % 600 === 0) { // Every ~10 seconds
            obstacleSpeed += 0.5;
            if (spawnRate > 20) spawnRate -= 5;
        }

        // Update obstacles & Collision
        for (let i = 0; i < obstacles.length; i++) {
            const obs = obstacles[i];
            obs.y += obstacleSpeed;

            // Collision Detection (AABB)
            if (
                player.x < obs.x + obs.width &&
                player.x + player.width > obs.x &&
                player.y < obs.y + obs.height &&
                player.y + player.height > obs.y
            ) {
                gameOver();
                return;
            }

            // Remove off-screen obstacles
            if (obs.y > canvas.height) {
                obstacles.splice(i, 1);
                i--;
            }
        }

        // Update Score
        const elapsed = (Date.now() - startTime) / 1000;
        score = elapsed;
        scoreDisplay.textContent = score.toFixed(1) + 's';
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Player
        ctx.fillStyle = player.color;
        ctx.fillRect(player.x, player.y, player.width, player.height);

        // Obstacles
        obstacles.forEach(obs => {
            ctx.fillStyle = obs.color;
            ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
        });
    }

    function loop() {
        if (!isGameRunning) return;
        update();
        draw();
        animationId = requestAnimationFrame(loop);
    }

    function gameOver() {
        isGameRunning = false;
        cancelAnimationFrame(animationId);

        // Save Score
        const isNewRecord = StorageManager.saveScore(GAME_KEY, score);

        overlayTitle.textContent = isNewRecord ?
            `REKOR BARU! ${score.toFixed(1)}s` :
            `Game Over! ${score.toFixed(1)}s`;

        startBtn.textContent = "Main Lagi";
        overlay.style.display = 'flex';

        if (isNewRecord) {
            currentHighScore = score;
            highScoreDisplay.textContent = score.toFixed(1) + 's';
        }
    }

    // 5. Input Handling

    function keyDown(e) {
        if (e.key === 'ArrowRight' || e.key === 'd') {
            player.dx = player.speed;
        } else if (e.key === 'ArrowLeft' || e.key === 'a') {
            player.dx = -player.speed;
        }
    }

    function keyUp(e) {
        if (
            (e.key === 'ArrowRight' || e.key === 'd') ||
            (e.key === 'ArrowLeft' || e.key === 'a')
        ) {
            player.dx = 0;
        }
    }

    document.addEventListener('keydown', keyDown);
    document.addEventListener('keyup', keyUp);

    startBtn.addEventListener('click', initGame);

    // Mobile Controls
    leftBtn.addEventListener('touchstart', (e) => { e.preventDefault(); player.dx = -player.speed; });
    leftBtn.addEventListener('touchend', (e) => { e.preventDefault(); player.dx = 0; });
    leftBtn.addEventListener('mousedown', () => { player.dx = -player.speed; });
    leftBtn.addEventListener('mouseup', () => { player.dx = 0; });

    rightBtn.addEventListener('touchstart', (e) => { e.preventDefault(); player.dx = player.speed; });
    rightBtn.addEventListener('touchend', (e) => { e.preventDefault(); player.dx = 0; });
    rightBtn.addEventListener('mousedown', () => { player.dx = player.speed; });
    rightBtn.addEventListener('mouseup', () => { player.dx = 0; });

    saveUserBtn.addEventListener('click', () => {
        const name = usernameInput.value.trim();
        if (name) {
            StorageManager.setUsername(name);
            alert('Nama tersimpan!');
        }
    });

});
