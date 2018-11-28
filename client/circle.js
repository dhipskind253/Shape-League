//class for any circle on screen (Player Circles and food)
class Circle {
    constructor(x, y, r) {
        this.pos = createVector(x, y);
        this.r = r;
        this.health = 0;
    }
    
    update() {
      var mouse = createVector(mouseX - width/2, mouseY - height/2);
      
      //checks to see if its - and + in order for speed to work properly
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
  
      //gets magnitude and sets it so movement is based on magnitude
      var magnitude = sqrt(m);
      mouse.setMag(magnitude * 1/3);
      this.pos.add(mouse);
    }
  
    eat(food) {
      var dist = p5.Vector.dist(this.pos, food.pos);
      
      //if it goes half way into the other blob then eat it and add health
      if (dist < this.r + food.r/2) {
        /*var newArea = PI * food.r * food.r  + PI * this.r * this.r;
        this.r = sqrt(newArea / PI);*/
  
        //updates objects health if food is eaten
        if(food.r == 15){
          this.health = this.health + 25;
        } else {
          this.health = this.health + 5;
        }
        return true;
      }
      return false;
    }

    constrain(){
      circle.pos.x = constrain(circle.pos.x, -width*4, width*4);
      circle.pos.y = constrain(circle.pos.y, -height*4, height*4);
    }
  
    showCircle() {
        fill(200,123,33);
        ellipse(this.pos.x, this.pos.y, this.r * 2, this.r * 2);
    }
    showFood(){
      fill(255);
      ellipse(this.pos.x, this.pos.y, this.r * 2, this.r * 2);
    }
  
    showHealth(){
      fill(100,255,0);
      ellipse(this.pos.x, this.pos.y, this.r * 2, this.r * 2);
    }
  }
