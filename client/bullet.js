class Bullet {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.mx = mouseX - width/2;
      this.my = mouseY - height/2;
      this.pos = createVector(x,y);
      this.r = 15;
    }

    move(){
        var vel = createVector(this.mx, this.my);
        vel.setMag(15);
        this.pos.add(vel);
        this.x = this.pos.x;
        this.y = this.pos.y;
    }
  
    hit(enemy) {
      var enemyPos = createVector(enemy.x, enemy.y);
      var dist = p5.Vector.dist(this.pos, enemyPos);
      
      //if it hits the enemy blob then return true
      if (dist < this.r + enemy.r) {
        return true;
      }
      return false;
    }
  
    showBullet() {
      fill(255);
      ellipse(this.x, this.y, this.r, this.r);
    }
    
}