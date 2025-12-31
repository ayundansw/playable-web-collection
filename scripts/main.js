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
});
