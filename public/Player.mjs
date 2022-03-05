import dimensions from "./dimensions.mjs";
class Player {
  constructor({ x, y, score = 0, id }) {
    this.x = x;
    this.y = y;
    this.score = score;
    this.id = id;
    this.speed = 5;
    this.radius = 20;
  }

  movePlayer(dir, speed = this.speed) {
    switch (dir) {
      case "up":
        this.y -= speed;
        this.y = Math.max(this.radius + dimensions.top + 5, this.y);
        break;
      case "down":
        this.y += speed;
        this.y = Math.min(dimensions.height - this.radius, this.y);
        break;
      case "left":
        this.x -= speed;
        this.x = Math.max(this.radius, this.x);
        break;
      case "right":
        this.x += speed;
        this.x = Math.min(dimensions.width - this.radius, this.x);
        break;
    }
  }

  collision(item) {
    let combinedRadius = item.radius + this.radius;
    if (
      Math.abs(this.x - item.x) < combinedRadius &&
      Math.abs(this.y - item.y) < combinedRadius
    )
      return true;
    return false;
  }

  calculateRank(arr) {
    let rank = 0;
    arr.forEach((player) => {
      if (this.score <= player.score) rank++;
    });
    return `Rank: ${rank + 1} / ${arr.length + 1}`;
  }
  draw(ctx) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
    ctx.fillStyle = "green";
    ctx.fill();
    ctx.lineWidth = 5;
    ctx.strokeStyle = "#003300";
    ctx.stroke;
  }
}

export default Player;
