class Bullet {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.pos = createVector(this.x, this.y);
      this.r = 15;
    }

    move(){
        var mx = mouseX - width/2;
        var my = mouseY - height/2;

        var m;
        if(mx > 0 && my < 0){
            m = mx - my;
        } else if(mx < 0 && my > 0){
            m = my - mx;
        } else {
            m = mx + my;
        }
        
        if(m < 0){
            m = m * -1;
        }
        var magnitude = sqrt(m);
        
        //gets magnitude and sets it so movement is based on magnitude
        this.y = this.y + (my / magnitude) * 8;
        this.x = this.x + (mx / magnitude) * 8;
            
         
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