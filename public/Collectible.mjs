class Collectible {
  constructor({ x, y, value = 1, id }) {
    this.x = x;
    this.y = y;
    this.value = value;
    this.id = id;
    this.radius = 10;
  }
  draw(ctx) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
    ctx.fillStyle = "blue";
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = "#003300";
    ctx.stroke;
  }
}

/*
  Note: Attempt to export this for use
  in server.js
*/
try {
  module.exports = Collectible;
} catch (e) {}

export default Collectible;
