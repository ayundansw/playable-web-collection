document.addEventListener('DOMContentLoaded', () => {
    // 1. Elements
    const textDisplay = document.getElementById('text-display');
    const inputField = document.getElementById('input-field');
    const timerDisplay = document.getElementById('timer');
    const wpmDisplay = document.getElementById('wpm');
    const accuracyDisplay = document.getElementById('accuracy');
    const highScoreDisplay = document.getElementById('high-score');
    const startBtn = document.getElementById('start-btn');
    const usernameInput = document.getElementById('username');
    const saveUserBtn = document.getElementById('save-user-btn');

    // 2. Game Variables
    const paragraphs = [
        "Teknologi berkembang sangat pesat dalam beberapa dekade terakhir, mengubah cara kita hidup, bekerja, dan berinteraksi satu sama lain. Internet menghubungkan miliaran orang di seluruh dunia.",
        "Pemrograman adalah seni memberikan instruksi kepada komputer untuk melakukan tugas tertentu. Dibutuhkan logika, kreativitas, dan kesabaran untuk memecahkan masalah yang kompleks.",
        "Hutan hujan tropis sering disebut sebagai paru-paru dunia karena menghasilkan oksigen yang sangat penting bagi kehidupan di bumi. Kita harus menjaga kelestariannya.",
        "Kopi adalah minuman yang sangat populer di seluruh dunia. Banyak orang memulai hari mereka dengan secangkir kopi panas untuk meningkatkan energi dan konsentrasi.",
        "Bermain game bukan hanya sekadar hiburan, tetapi juga dapat melatih refleks, strategi, dan kerja sama tim. Industri game kini menjadi salah satu yang terbesar di dunia hiburan."
    ];

    let timer = 30;
    let timerInterval = null;
    let isGameActive = false;
    let charIndex = 0;
    let mistakes = 0;
    let currentText = "";

    // 3. Storage Integration
    const GAME_KEY = 'typing_test';

    const savedName = StorageManager.getUsername();
    if (savedName) usernameInput.value = savedName;

    function loadHighScore() {
        const highScore = StorageManager.getHighScore(GAME_KEY);
        highScoreDisplay.textContent = highScore || 0;
        return highScore ? parseFloat(highScore) : 0;
    }

    let currentHighScore = loadHighScore();

    // 4. Logic Functions

    function initGame() {
        loadParagraph();
        clearInterval(timerInterval);
        timer = 30;
        charIndex = 0;
        mistakes = 0;
        isGameActive = true;

        timerDisplay.textContent = timer + "s";
        wpmDisplay.textContent = 0;
        accuracyDisplay.textContent = "100%";

        inputField.value = "";
        inputField.disabled = false;
        inputField.focus();

        startBtn.textContent = "Restart Tes";

        startTimer();
    }

    function loadParagraph() {
        const randomIndex = Math.floor(Math.random() * paragraphs.length);
        currentText = paragraphs[randomIndex];
        textDisplay.innerHTML = "";

        currentText.split("").forEach(char => {
            const span = document.createElement("span");
            span.innerText = char;
            textDisplay.appendChild(span);
        });

        // Highlight first char
        textDisplay.querySelectorAll("span")[0].classList.add("current");
    }

    function startTimer() {
        timerInterval = setInterval(() => {
            if (timer > 0) {
                timer--;
                timerDisplay.textContent = timer + "s";

                // Calculate real-time WPM
                const timeElapsed = 30 - timer;
                if (timeElapsed > 0) {
                    const wpm = Math.round(((charIndex - mistakes) / 5) / (timeElapsed / 60));
                    wpmDisplay.textContent = wpm > 0 ? wpm : 0;
                }
            } else {
                endGame();
            }
        }, 1000);
    }

    function handleTyping() {
        if (!isGameActive) return;

        const typedChar = inputField.value.split("")[charIndex];
        const charSpans = textDisplay.querySelectorAll("span");

        if (typedChar == null) {
            // Backspace handling
            if (charIndex > 0) {
                charIndex--;
                charSpans[charIndex].classList.remove("correct", "incorrect");
                charSpans.forEach(span => span.classList.remove("current"));
                charSpans[charIndex].classList.add("current");
            }
        } else {
            // Check character
            if (charSpans[charIndex].innerText === typedChar) {
                charSpans[charIndex].classList.add("correct");
            } else {
                mistakes++;
                charSpans[charIndex].classList.add("incorrect");
            }

            charIndex++;

            // Move current highlight
            charSpans.forEach(span => span.classList.remove("current"));
            if (charIndex < charSpans.length) {
                charSpans[charIndex].classList.add("current");
            } else {
                // Text finished before time
                endGame();
            }
        }

        // Calculate Accuracy
        const accuracy = Math.round(((charIndex - mistakes) / charIndex) * 100);
        accuracyDisplay.textContent = (isNaN(accuracy) ? 100 : accuracy) + "%";
    }

    function endGame() {
        clearInterval(timerInterval);
        isGameActive = false;
        inputField.disabled = true;

        const timeSpent = 30 - timer;
        // WPM Calculation: (Correct Chars / 5) / (Time in mins)
        // If finished early, use timeSpent. If timeout, use 30.
        const timeCalc = timeSpent === 0 ? 30 : timeSpent;

        const wpm = Math.round(((charIndex - mistakes) / 5) / (timeCalc / 60));
        const finalWPM = wpm < 0 ? 0 : wpm;

        wpmDisplay.textContent = finalWPM;

        // Save High Score (Higher is better -> default true)
        const isNewRecord = StorageManager.saveScore(GAME_KEY, finalWPM);

        let message = `Waktu Habis!\nWPM: ${finalWPM}\nAkurasi: ${accuracyDisplay.textContent}`;
        if (isNewRecord) {
            currentHighScore = finalWPM;
            highScoreDisplay.textContent = finalWPM;
            message = `Luar Biasa! Rekor WPM Baru: ${finalWPM}!\nAkurasi: ${accuracyDisplay.textContent}`;
        }

        // Small delay to allow UI update before alert
        setTimeout(() => alert(message), 100);
    }

    // 5. Event Listeners
    startBtn.addEventListener('click', initGame);
    inputField.addEventListener('input', handleTyping);

    // Prevent copy-paste
    inputField.addEventListener('paste', (e) => e.preventDefault());

    saveUserBtn.addEventListener('click', () => {
        const name = usernameInput.value.trim();
        if (name) {
            StorageManager.setUsername(name);
            alert('Nama tersimpan!');
        }
    });
});
