require("dotenv").config();
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const expect = require("chai");
const cors = require("cors");
const helmet = require("helmet");
const socket = require("socket.io");
const crypto = require("crypto");

const fccTestingRoutes = require("./routes/fcctesting.js");
const runner = require("./test-runner.js");

app.use(helmet.hidePoweredBy({ setTo: "PHP 7.4.3" }));
app.use(helmet.noSniff());
app.use(helmet.xssFilter());
app.use(helmet.noCache());

app.use("/public", express.static(process.cwd() + "/public"));
app.use("/assets", express.static(process.cwd() + "/assets"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//For FCC testing purposes and enables user to connect from outside the hosting platform
app.use(cors({ origin: "*" }));

// Index page (static HTML)
app.route("/").get(function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

//For FCC testing purposes
fccTestingRoutes(app);

// 404 Not Found Middleware
app.use(function (req, res, next) {
  res.status(404).type("text").send("Not Found");
});

const portNum = process.env.PORT || 3000;

// Set up server and tests
const server = app.listen(portNum, () => {
  console.log(`Listening on port ${portNum}`);
  if (process.env.NODE_ENV === "test") {
    console.log("Running Tests...");
    setTimeout(function () {
      try {
        runner.run();
      } catch (error) {
        console.log("Tests are not valid:");
        console.error(error);
      }
    }, 1500);
  }
});
const Collectible = require("./public/Collectible.mjs");
const { default: Player } = require("./public/Player.mjs");
const { default: dimensions } = require("./public/dimensions.mjs");
const io = socket(server);

const random = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

let players = {};
io.on("connection", (socket) => {
  console.log("hi");
  let player = new Player({
    x: random(20, dimensions.width - 20),
    y: random(25 + dimensions.top, dimensions.height - 25),
    id: crypto.randomBytes(8).toString("hex"),
  });
  let collectible = generateCollectible(player);
  socket.emit("player", player);
  socket.emit("collectible", collectible);
  players[player.id] = player;
  io.sockets.emit("players", players);
  socket.on("update player", (updatedPlayer) => {
    player = new Player({
      x: updatedPlayer.x,
      y: updatedPlayer.y,
      score: updatedPlayer.score,
      id: updatedPlayer.id,
    });
    if (player.collision(collectible)) {
      player.score++;
      collectible = generateCollectible(player);
      socket.emit("update score", player.score);
      socket.emit("collectible", collectible);
    }
    players[player.id] = player;
    io.sockets.emit("players", players);
  });
  socket.on("disconnect", () => {
    //logic for deleting player from list
    delete players[player.id];
  });
});

const generateCollectible = (player) => {
  let collectible = new Collectible({
    x: random(20, dimensions.width - 20),
    y: random(25 + dimensions.top, dimensions.height - 25),
    id: player.id,
  });
  return collectible;
};

module.exports = app; // For testing
