let circles = [];  //储存Circle的数组 
let backgroundCircles = [];

function setup() {
  createCanvas(500, 500);
  colorMode(HSB);
  background(200, 150, 60);

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

  let maxRadius = new Circle(0, 0, 50, 16, 3).getBoundaryRadius(); // 获取图形的最大半径
  let rows = 10;
  let cols = 10;

  // 使用rows和cols作为循环的结束条件
  for (let rowIndex = 0, y = maxRadius; rowIndex < rows; y += maxRadius * 1.9, rowIndex++) {
    // 确定奇数行和偶数行的起始x坐标
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

//转换鼠标点击位置
function convertToScreenCoords(x, y, translateX, translateY, angle) {
  // 旋转
  let rotatedX = cos(angle) * x - sin(angle) * y;
  let rotatedY = sin(angle) * x + cos(angle) * y;

  // 平移
  let screenX = rotatedX - translateX;
  let screenY = rotatedY - translateY;

  return {
      x: screenX,
      y: screenY
  };
}

//检测鼠标点击事件
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
    this.count = count; // 同心圆的数量
    this.gap = gap; // 同心圆之间的间距
    this.shrinking = false; //缩小
    this.growing = false; //放大

    // 在构造函数中生成随机颜色
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
    this.r = 0; // 重新开始增长的初始半径
    this.colorA = color(random(255), random(255), random(255));
    this.colorB = color(random(255), random(255), random(255));
    this.colorC = color(random(255), random(255), random(255));
    this.colorD = color(random(255), random(255), random(255));
    this.colorF = color(random(255), random(255), random(255));
    this.colorE = color(random(255), random(255), random(255));
  }


  update() {
    if (this.shrinking) {
        this.r -= 2;  // 缩小的速度
        if (this.r <= 0) {
            this.shrinking = false;
            this.growing = true;
            this.reset();  // 重置圆的属性
        }
    } else if (this.growing) {
        this.r += 1;  // 增长的速度
        if (this.r >= 50) {  // 原始半径大小
            this.growing = false;
            this.r = 50;
        }
    }
  }



  display() {
    let smallCircleRadius = 1.5;
    let smallcircleNumber = 36;
    let boundaryRadius = this.r + this.gap * 2 + 5 * this.gap * smallCircleRadius + smallCircleRadius;

    // 绘制边界圆，最大的圆
    fill(this.colorE); // 设置填充颜色为白色
    ellipse(this.x, this.y, boundaryRadius * 2);
    //同心圆
    for (let i = 0; i < this.count; i++) {
      let radius = this.r - i * this.gap;
      if (i === this.count - 1) {  // 最小半径的圆
        fill(255);  // 白色
      } else if (i <= this.count / 2) {  // i在0-9之间
        if (i % 2 === 1) {  // 奇数
          fill(this.colorA);  // 随机颜色A
        } else {  // 偶数
          fill(this.colorB);  // 随机颜色B
        }
      } else if (i >= this.count / 2 + 1 && i < this.count - 1) {  // i在11-this.count-2之间
        if (i % 2 === 1) {  // 奇数
          fill(this.colorC);  // 随机颜色C
        } else {  // 偶数
          fill(this.colorD);  // 随机颜色D
        }
      }
      noStroke();
      ellipse(this.x, this.y, radius * 2);
    }
    //小圆
    for (let j = 0; j < 5; j++) {
      // this.gap * 2: 这是为了从最外层的同心圆到第一组小圆圈的距离。这里乘以2是因为你从同心圆的最外边到第一组小圆圈的边缘需要两个这样的间隙。
      // j * this.gap * smallCircleRadius:这部分代表了从第一组小圆圈到当前小圆圈组的距离。每一组小圆圈之间的距离是 3 * this.gap。j 是一个循环变量，表示当前是第几组小圆圈（从0开始）。所以 j * this.gap * 3 就是从第一组小圆圈到当前小圆圈组的总距离。
      let outerRadius = this.r + this.gap * 2 + j * this.gap * smallCircleRadius;
      fill(this.colorF); // 为小圆设置填充颜色
      for (let i = 0; i < (smallcircleNumber + j * 3); i++) {//j*3是为了增加小圆数量
        let angle = TWO_PI / (smallcircleNumber + j * 3) * i;
        let smallCircleX = this.x + outerRadius * cos(angle);
        let smallCircleY = this.y + outerRadius * sin(angle);

        ellipse(smallCircleX, smallCircleY, smallCircleRadius * 2);
      }
    }
  }
}