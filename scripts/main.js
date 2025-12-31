<<<<<<< HEAD
const games = [
  { title: "Rock Paper Scissors", path: "games/rps/rps.html" },
  { title: "Guess The Number", path: "games/guess/index.html" },
  { title: "Typing Speed Test", path: "games/typing/index.html" },
  { title: "Whack A Mole", path: "games/whack/index.html" },
  { title: "Memory Match", path: "games/memory/index.html" },
];

const gameList = document.getElementById("game-list");

games.forEach(game => {
  const div = document.createElement("div");
  div.className = "game-card";
  div.innerText = game.title;
  div.onclick = () => window.location.href = game.path;
  gameList.appendChild(div);
=======
document.addEventListener('DOMContentLoaded', () => {
    // Basic interaction logging
    console.log('Game Portfolio Loaded');

    // Highlight active nav link based on current path
    const path = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-links a');

    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        // Handle root path
        if (path.endsWith('/') && (href === './index.html' || href === 'index.html')) {
             // link.classList.add('active'); // Optional: home usually doesn't need highlight if logo is there
        } else if (href && path.includes(href.replace('./', ''))) {
            link.classList.add('active');
        }
    });
>>>>>>> 4e5d86b70dd63816e93ea035063dee342e6e8685
});
