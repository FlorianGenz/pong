import {Component, ElementRef, HostListener, OnInit, ViewChild} from '@angular/core';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})

export class GameComponent implements OnInit {

  @ViewChild("canvas", {static: true}) myCanvas!: ElementRef;

  @HostListener('document:keypress', ['$event'])
  startGame(event: KeyboardEvent) {
    if (!this.started) {
      let canvas = this.myCanvas.nativeElement;
      let ctx = canvas.getContext("2d");
      //this.draw(ctx)
      setInterval(() => {
        this.draw(ctx)
      }, 1000 / 142)
      this.started = true;
    } else if (event.keyCode === 32) {
      this.pauseGame();
    }
  }


  @HostListener('document:keydown', ['$event'])
  handlePress(event: KeyboardEvent) {
    if (this.started) {
      if (event.keyCode === 38) {
        this.playerUp = true;
      }
      if (event.keyCode === 40) {
        this.playerDown = true;
      }
    } else if (event.keyCode === 38 || event.keyCode === 40) {
      this.startGame(event);
    }
  }

  @HostListener('document:keyup', ['$event'])
  handleUp(event: KeyboardEvent) {
    if (this.started) {
      if (event.keyCode === 38) {
        this.playerUp = false;
      }
      if (event.keyCode === 40) {
        this.playerDown = false;
      }
    } else if (event.keyCode === 38 || event.keyCode === 40) {
      this.startGame(event);
    }
  }

  playerUp = false;
  playerDown = false;

  robotDy = 2.2;
  ballMin = 1.5;
  ballMax = 2.5;

  ballRadius = 8;
  ball = {x: 500 - this.ballRadius, y: 250 - this.ballRadius, dx: 2, dy: 2};
  recWidth = 10;
  recHeight = 100;
  rightRec = {x: 950 - this.recWidth, y: 250 - this.recHeight / 2, dy: this.robotDy};
  leftRec = {x: 50, y: 250 - this.recHeight / 2, dy: 2};
  stats = {pPoints: 0, rPoints: 0, round: 0};
  currentValues = {ball_dx: 0, ball_dy: 0, leftRec_dy: 0, rightRec_dy: 0}

  animationReq = 0;
  started = false;
  paused = false;


  ngOnInit(): void {

    this.ball.dy = this.getRandomNumber(-0.2, 0.2);
    if (Math.round(Math.random()) == 0) {
      this.ball.dx = -this.getRandomNumber(this.ballMin, this.ballMax);
    } else {
      this.ball.dx = this.getRandomNumber(this.ballMin, this.ballMax);
    }


    let canvas = this.myCanvas.nativeElement;
    let ctx = canvas.getContext("2d")
    this.drawStartScreen(ctx)
    this.changeLevel(1);
  }

  drawStartScreen(ctx: CanvasRenderingContext2D) {
    ctx.clearRect(0, 0, 1000, 500);
    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.font = "20px 'Press Start 2P'";
    ctx.textAlign = "center"
    ctx.fillText("press any key to start", 500, 240);

    ctx.textAlign = "left"
    ctx.font = "13px 'Press Start 2P'";
    ctx.fillText("move up", 490, 350);
    ctx.fillText("move down", 490, 400);
    ctx.fillText("pause game", 490, 450);

    let keyUpImg = new Image();
    keyUpImg.src = "/assets/arrowkeyUp.png";
    keyUpImg.onload = () => {
      ctx.drawImage(keyUpImg, 420, 327);
    }
    let keyDownImg = new Image();
    keyDownImg.src = "/assets/arrowkeyDown.png";
    keyDownImg.onload = () => {
      ctx.drawImage(keyDownImg, 420, 377);
    }
    let spaceImg = new Image();
    spaceImg.src = "/assets/spaceKey.png";
    spaceImg.onload = () => {
      ctx.drawImage(spaceImg, 400, 427);
    }

    ctx.fillStyle = "#B9B9B9";

    ctx.font = "20px 'Press Start 2P'";
    ctx.fillText(this.stats.pPoints.toString(), 230, 40);
    ctx.fillText(this.stats.rPoints.toString(), 730, 40);

    ctx.fillRect(this.leftRec.x, this.leftRec.y, this.recWidth, this.recHeight);
    ctx.fillRect(this.rightRec.x, this.rightRec.y, this.recWidth, this.recHeight);
    for (let i = 0; i <= 500; i += 30) {
      if (i <= 200 || i >= 250 && i <= 320 || i >= 460) {
        ctx.fillRect(499, i, 3, 15);
      }
    }
  }

  drawPauseScreen(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = "white";
    ctx.font = "20px 'Press Start 2P'";
    ctx.textAlign = "center"
    ctx.fillText("game paused", 500, 240);
    ctx.fillStyle = "#B9B9B9";
    for (let i = 0; i <= 500; i += 30) {
      if (i <= 200 || i >= 250) {
        ctx.fillRect(499, i, 3, 15);
      }
    }
  }

  draw(ctx: CanvasRenderingContext2D) {

    ctx.clearRect(0, 0, 1000, 500);


    if (this.paused) {
      this.drawPauseScreen(ctx);
    } else {
      ctx.fillStyle = "white";
      for (let i = 0; i <= 500; i += 30) {
        ctx.fillRect(499, i, 3, 15);
      }
    }

    //points
    ctx.textAlign = "center";
    ctx.font = "20px 'Press Start 2P'";
    ctx.fillText(this.stats.pPoints.toString(), 250, 40);
    ctx.fillText(this.stats.rPoints.toString(), 750, 40);
    ctx.textAlign = "left";

    //draw ball
    ctx.beginPath();
    ctx.arc(this.ball.x, this.ball.y, this.ballRadius, 0, 2 * Math.PI);
    ctx.fill();
    ctx.closePath();

    //draw player-side
    ctx.fillRect(this.leftRec.x, this.leftRec.y, this.recWidth, this.recHeight);
    if (this.playerUp && this.leftRec.y > 0) {
      this.leftRec.y -= this.leftRec.dy;
    }
    if (this.playerDown && this.leftRec.y + this.recHeight < 500) {
      this.leftRec.y += this.leftRec.dy;
    }

    //draw robot-side
    ctx.fillRect(this.rightRec.x, this.rightRec.y, this.recWidth, this.recHeight);
    if (this.ball.y + this.ballRadius < this.rightRec.y + this.recHeight / 2 && this.rightRec.y > 0) {
      this.rightRec.y += -this.rightRec.dy;
    } else if (this.rightRec.y + this.recHeight < 500) {
      this.rightRec.y += this.rightRec.dy;
    }

    this.handleBall();
    //requestAnimationFrame(() => this.draw(ctx))
  }

  handleBall() {
    //ball hit by robot
    if (this.ball.x >= this.rightRec.x && this.ball.x <= this.rightRec.x + this.recWidth &&
      (this.ball.y >= this.rightRec.y && this.ball.y <= this.rightRec.y + this.recHeight) && this.ball.dx > 0) {
      this.ball.dx += 0.1
      this.ball.dx = -this.ball.dx;
      if (this.ball.dy < 0) {
        this.ball.dy = this.getRandomNumber(1.5, 2.5);
      } else {
        this.ball.dy = -this.getRandomNumber(1.5, 2.5);
      }
    }

    //ball hit by player
    if(this.ball.x <= this.leftRec.x + this.recWidth && this.ball.x >= this.leftRec.x &&
      (this.ball.y >= this.leftRec.y && this.ball.y <= this.leftRec.y + this.recHeight) && this.ball.dx < 0){
      this.ball.dx += 0.1
      this.ball.dx = -this.ball.dx;
      if (this.ball.dy < 0) {
        this.ball.dy = this.getRandomNumber(1.5, 2.5);
      } else {
        this.ball.dy = -this.getRandomNumber(1.5, 2.5);
      }
    }

    //ball out
    if (this.ball.x + this.ballRadius > 1000 || this.ball.x - this.ballRadius < 0) {
      if (this.ball.x + this.ballRadius > 1000) {
        this.stats.pPoints++;
        this.changeBackgroundColor(true);
      } else {
        this.stats.rPoints++;
        this.changeBackgroundColor(false);
      }
      this.resetGame();
    }

    //ball hit top/bottom border
    if (this.ball.y + this.ballRadius >= 500 || this.ball.y - this.ballRadius < 0) {
      this.ball.dy = -this.ball.dy;
    }

    this.ball.x += this.ball.dx;
    this.ball.y += this.ball.dy;
  }

  pauseGame() {
    if (!this.paused) {
      this.currentValues.ball_dx = this.ball.dx;
      this.currentValues.ball_dy = this.ball.dy;
      this.currentValues.leftRec_dy = this.leftRec.dy;
      this.currentValues.rightRec_dy = this.rightRec.dy;
      this.ball.dx = 0;
      this.ball.dy = 0;
      this.leftRec.dy = 0;
      this.rightRec.dy = 0;
      this.paused = true;
    } else {
      this.ball.dx = this.currentValues.ball_dx;
      this.ball.dy = this.currentValues.ball_dy;
      this.leftRec.dy = this.currentValues.leftRec_dy;
      this.rightRec.dy = this.currentValues.rightRec_dy;
      this.paused = false;
    }
  }

  resetGame() {
    this.rightRec = {x: 950, y: 250 - this.recHeight / 2, dy: this.robotDy};
    this.leftRec = {x: 50, y: 250 - this.recHeight / 2, dy: 2};
    this.ball = {
      x: 500 - this.ballRadius,
      y: 250 - this.ballRadius,
      dx: 0,
      dy: this.getRandomNumber(-0.2, 0.2)
    };
    if (Math.round(Math.random()) == 0) {
      this.ball.dx = -this.getRandomNumber(this.ballMin, this.ballMax);
    } else {
      this.ball.dx = this.getRandomNumber(this.ballMin, this.ballMax);
    }
  }

  changeLevel(level: number) {
    for (let i = 1; i <= 3; i++) {
      document.getElementById("level" + i)?.removeAttribute("disabled");
    }
    document.getElementById("level" + level)?.setAttribute("disabled", "true");
    switch (level) {
      case 2:
        this.robotDy = 2.4;
        this.ballMin = 2;
        this.ballMax = 3;
        break;
      case 3:
        this.robotDy = 2.8;
        this.ballMin = 3;
        this.ballMax = 4;
        break;
      default:
        this.robotDy = 2.2;
        this.ballMin = 1.5;
        this.ballMax = 2.5;
        break;
    }
    this.resetGame();
    if (this.paused) {
      this.pauseGame();
    }
  }

  changeBackgroundColor(win: boolean) {
    let canvas = document.getElementById("canvas")
    if (canvas) {
      if (!win) {
        canvas.style.backgroundPosition = "0%"
      } else {
        canvas.style.backgroundPosition = "100%"
      }
      this.wait(150).then(r => canvas!.style.backgroundPosition = "50%");
    }
  }

  getRandomNumber(min: number, max: number) {
    let randomNumber = (Math.random() * (max - min + 1) + min) * -1;
    return randomNumber;
  }

  wait(timeout: number) {
    return new Promise(resolve => {
      setTimeout(resolve, timeout);
    });
  }
}
