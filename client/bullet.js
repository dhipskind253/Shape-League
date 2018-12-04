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
        var m;
        if(this.mx > 0 && this.my < 0){
            m = this.mx - this.my;
        } else if(this.mx < 0 && this.my > 0){
            m = this.my - this.mx;
        } else {
            m = this.mx + this.my;
        }
        
        if(m < 0){
            m = m * -1;
        }
        var magnitude = sqrt(m);
        
        //gets magnitude and sets it so movement is based on magnitude
        this.y = this.y + (this.my / magnitude) * 2;
        this.x = this.x + (this.mx / magnitude) * 2;
    }
  
    hit(enemy) {
      var dist = p5.Vector.dist(this.pos, enemy.pos);
      
      //if it goes half way into the other blob then detract health
      if (dist < this.r + enemy.r) {
        enemy.health -= this.health
        return true;
      }
      return false;
    }
  
    showBullet() {
      fill(255);
      ellipse(this.x, this.y, this.r, this.r);
    }
    
}