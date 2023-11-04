let circles = [];  //Circle Array
let backgroundCircles = [];
let rotateSpeed = 0.005; //Circle Rotate Speed
let startTime;

function setup() {
  createCanvas(500, 500);
  colorMode(HSB);
  background(200, 150, 60);
  startTime = millis();

  var protection = 0;

  while (backgroundCircles.length < 100) {

    let overlapping = false;

    var circle = {
      x: random(width),
      y: random(height),
      r: random(10, 30),
      color: color(255)
    };


    for (let j = 0; j < backgroundCircles.length; j++) {
      var other = backgroundCircles[j];
      var d = dist(circle.x, circle.y, other.x, other.y);
      if (d < circle.r + other.r) {
        overlapping = true;
        break;
      }
    }

    if (!overlapping) {
      backgroundCircles.push(circle);
    }

    protection++;
    if (protection > 500) {
      break;
    }
  }

  let maxRadius = new Circle(0, 0, 50, 16, 3).getBoundaryRadius(); // Get the radius of MaxCircle
  let rows = 10;
  let cols = 10;

  // Use rows and cols as End conditions
  for (let rowIndex = 0, y = maxRadius; rowIndex < rows; y += maxRadius * 1.9, rowIndex++) {
    let startX = rowIndex % 2 == 0 ? maxRadius : maxRadius + maxRadius;
    for (let colIndex = 0, x = startX; colIndex < cols; x += maxRadius * 2.1, colIndex++) {
      circles.push(new Circle(x, y, 50, 16, 3));
    }
  }

}

function draw() {

  //Draw the background circles
  for (let i = 0; i < backgroundCircles.length; i++) {
    fill(backgroundCircles[i].color);
    noStroke();
    circle(backgroundCircles[i].x, backgroundCircles[i].y, backgroundCircles[i].r);
  }

  translate(-200, -100);//move the origin point for rotation
  rotate(50);//rotate the canvas

  //call the class to draw the circles
  for (let circle of circles) {
    circle.update();
    circle.display();
  }

}

//Convert mouse click position
function convertToScreenCoords(x, y, translateX, translateY, angle) {
  // rtotate
  let rotatedX = cos(angle) * x - sin(angle) * y;
  let rotatedY = sin(angle) * x + cos(angle) * y;

  // move
  let screenX = rotatedX - translateX;
  let screenY = rotatedY - translateY;

  return {
      x: screenX,
      y: screenY
  };
}

//Convert mouse click event
function mousePressed() {
  for (let i = 0; i < circles.length; i++) {
      let screenCoords = convertToScreenCoords(circles[i].x, circles[i].y, 200, 100, 50);
      if (dist(screenCoords.x, screenCoords.y, mouseX, mouseY) < circles[i].getBoundaryRadius()) {
          circles[i].shrinking = true;
          break;
      }
  }
}



class Circle {
  constructor(x, y, r, count, gap) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.count = count; // Number of concentric circles
    this.gap = gap; // Spacing between concentric circles
    this.shrinking = false; //DownSize
    this.growing = false; //UpSize
    this.rotateDirection = random() > 0.5 ? 1 : -1; //Random rotate direction

    // Generating random colours
    this.colorA = color(random(360), 100, 100);
    this.colorB = color(random(360), 150, 100);
    this.colorC = color(random(360), 150, 100);
    this.colorD = color(random(360), 100, 100);
    this.colorF = color(random(360), 100, 100);
    this.colorE = color(random(360), 50, 100);
  }

  getBoundaryRadius() {
    let smallCircleRadius = 1.5;
    return this.r + this.gap * 2 + 5 * this.gap * smallCircleRadius + smallCircleRadius;
  }

  isInside(mx, my) {
    let d = dist(mx, my, this.x, this.y);
    return d < this.getBoundaryRadius();
  }

  reset() {
    this.r = 0;
    this.colorA = color(random(255), random(255), random(255));
    this.colorB = color(random(255), random(255), random(255));
    this.colorC = color(random(255), random(255), random(255));
    this.colorD = color(random(255), random(255), random(255));
    this.colorF = color(random(255), random(255), random(255));
    this.colorE = color(random(255), random(255), random(255));
  }


  update() {
    if (this.shrinking) {
        this.r -= 2;  // DownSize Speed
        if (this.r <= 0) {
            this.shrinking = false;
            this.growing = true;
            this.reset();  // Reset Circle Properties
        }
    } else if (this.growing) {
        this.r += 1;  // UpSize Speed
        if (this.r >= 50) {  // Target radius size
            this.growing = false;
            this.r = 50;
        }
    }
  }



  display() {
    let smallCircleRadius = 1.5;
    let smallcircleNumber = 36;
    let boundaryRadius = this.r + this.gap * 2 + 5 * this.gap * smallCircleRadius + smallCircleRadius;
    

    // calculate dynamicrotateSpeed
    let elapsed = (millis() - startTime) / 1000; //Get the seconds that passed
    let speedFactor = sin(TWO_PI * elapsed / 120); //Change period is 120s
    let dynamicRotateSpeed = map(speedFactor, -1, 1, 0.002, 0.01); //Speed change from 0.002 to 0.01

    // Drawing boundary circles, largest circle
    fill(this.colorE);
    ellipse(this.x, this.y, boundaryRadius * 2);
    //concentric circles
    for (let i = 0; i < this.count; i++) {
      let radius = this.r - i * this.gap;
      if (i === this.count - 1) {  // The min radius circle
        fill(255);
      } else if (i <= this.count / 2) {  // i between 0~9
        if (i % 2 === 1) {  // Odd
          fill(this.colorA);  // Random color A
        } else {  // Even
          fill(this.colorB);  // Random color B
        }
      } else if (i >= this.count / 2 + 1 && i < this.count - 1) {  // i between 9 and this.count-2
        if (i % 2 === 1) {  // Odd
          fill(this.colorC);  // Random color C
        } else {  // Even
          fill(this.colorD);  // Random color D
        }
      }
      noStroke();
      ellipse(this.x, this.y, radius * 2);
    }

    
    //Small Circle
    for (let j = 0; j < 5; j++) {
      // this.gap * 2: This is for the distance from the outermost concentric circle to the first set of smaller circles. This is multiplied by 2 because you need two such gaps from the outermost edge of the concentric circles to the edge of the first set of small circles.
      let outerRadius = this.r + this.gap * 2 + j * this.gap * smallCircleRadius;
      fill(this.colorF); // Setting the fill colour for a small circle
      for (let i = 0; i < (smallcircleNumber + j * 3); i++) {
        let angle = TWO_PI / (smallcircleNumber + j * 3) * i + frameCount * dynamicRotateSpeed * this.rotateDirection; //Make the angle tied to the frame and keep rotating
        let smallCircleX = this.x + outerRadius * cos(angle);
        let smallCircleY = this.y + outerRadius * sin(angle);
        ellipse(smallCircleX, smallCircleY, smallCircleRadius * 2);
      }
    }
  }
}