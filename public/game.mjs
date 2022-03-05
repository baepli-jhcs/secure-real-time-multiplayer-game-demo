import Player from "./Player.mjs";
import Collectible from "./Collectible.mjs";
import dimensions from "./dimensions.mjs";

const socket = io();
const canvas = document.getElementById("game-window");
canvas.style.background = "black";
const context = canvas.getContext("2d");

let player;
let collectible;
let players = [];
let playerDirections = [];
let ranking = "";

socket.on("player", (newPlayer) => {
  player = new Player({
    x: newPlayer.x,
    y: newPlayer.y,
    score: newPlayer.score,
    id: newPlayer.id,
  });
  console.log(player);
});

socket.on("collectible", (collect) => {
  collectible = new Collectible({
    x: collect.x,
    y: collect.y,
    value: collect.value,
    id: collect.id,
  });
});

socket.on("players", (fPlayers) => {
  players = Object.values(fPlayers);
  console.log(fPlayers);
  players = players.filter((pl) => pl.id !== player.id);
  ranking = player.calculateRank(players);
});
socket.on("update score", (score) => {
  console.log(score);
  player.score = score;
  ranking = player.calculateRank(players);
});

const keyPress = (e) => {
  switch (e.keyCode) {
    case 87:
    case 119:
      if (playerDirections.indexOf("up") !== -1) break;
      playerDirections.push("up");
      break;
    case 83:
    case 115:
      if (playerDirections.indexOf("down") !== -1) break;
      playerDirections.push("down");
      break;
    case 65:
    case 97:
      if (playerDirections.indexOf("left") !== -1) break;
      playerDirections.push("left");
      break;
    case 68:
    case 100:
      if (playerDirections.indexOf("right") !== -1) break;
      playerDirections.push("right");
      break;
  }
};
const keyUp = (e) => {
  switch (e.keyCode) {
    case 87:
      playerDirections = playerDirections.filter((element) => element != "up");
      break;
    case 83:
      playerDirections = playerDirections.filter(
        (element) => element != "down"
      );
      break;
    case 65:
      playerDirections = playerDirections.filter(
        (element) => element != "left"
      );
      break;
    case 68:
      playerDirections = playerDirections.filter(
        (element) => element != "right"
      );
      break;
  }
};
document.body.addEventListener("keypress", keyPress);
document.body.addEventListener("keyup", keyUp);

const loop = () => {
  context.clearRect(0, 0, canvas.width, canvas.height);
  if (!player) {
    return requestAnimationFrame(loop);
  }
  if (playerDirections !== []) {
    playerDirections.forEach((dir) => {
      player.movePlayer(dir);
      socket.emit("update player", player);
    });
  }
  context.font = "30px Comic Sans MS";
  context.fillStyle = "lightblue";
  context.textAlign = "center";
  context.fillText(ranking, dimensions.width / 2, 60);
  context.beginPath();
  context.lineWidth = 5;
  context.moveTo(0, dimensions.top);
  context.lineTo(dimensions.width, dimensions.top);
  context.strokeStyle = "lightblue";
  context.stroke();
  drawPlayers(players, context);
  player.draw(context);
  collectible.draw(context);
  requestAnimationFrame(loop);
};

const drawPlayers = (players, ctx) => {
  players.forEach((player) => {
    ctx.beginPath();
    ctx.arc(player.x, player.y, player.radius - 5, 0, 2 * Math.PI, false);
    ctx.fillStyle = "red";
    ctx.fill();
    ctx.lineWidth = 5;
    ctx.strokeStyle = "#003300";
    ctx.stroke;
  });
};

window.requestAnimationFrame(loop);
