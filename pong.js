 + "/" + paddleColorsList.length//Canvas settings
var cvs = document.getElementById("acanvas");
var painter = cvs.getContext("2d");

//Game settings:
var GameSpeed = 15;
var Score = 0;

//Status and shits:
var RightPressed = false;
var LeftPressed = false;
var UpPressed = false;
var DownPressed = false;

var BallInAir = true;
var PaddleMaxed = null;
var brickbrokencount = 0;


//Paddle Settings:
var padLen = 75;
var padHei = 20;
var xpad = 275;
var ypad = 440;
var paddleColorsList = ["#001242", "#607196", "#BABFD1", "#C6D2D2"];
var paddleLevel = 1;

//Ball Settings:
var ballRadius = 10;
var xball = 400
var yball = 300
var mxball = -3;
var myball = -3;
var ballColorsList = ["#FAC897", "#FA9579", "#F58944", "#F95038"];
var ballLevel = 1;

//Bricks Settings:
var brickRow = 4;
var brickCollumn = 6;
var brickLen = 80;
var brickHei = 25;
var brickOffsetTop = 40;
var brickOffsetLeft = 30;//offset from walls
var brickPadding = 15;//Keep the bricks from touching each other
var brickColors = [];
//Adding Bricks
var bricks = [];
for(let c = 0; c < brickCollumn; c++){
    bricks[c] = [];
    for(let r = 0; r < brickRow; r++){
        bricks[c][r] = {x: 0, y: 0, hp: 1 /*Hit Points of the Brick -> 0 means disappear*/};
    }
}

    

//Drawing things
    //Draw paddle:
    function drawPad() {
        painter.beginPath();
        painter.rect(xpad, ypad, padLen, padHei);
        painter.fillStyle = paddleColorsList[paddleLevel - 1];
        painter.fill();
        painter.closePath();

        //Moving the Paddle
        if(RightPressed){
            xpad += 6;
        }else if(LeftPressed){
            xpad -= 6;
        }else if(UpPressed){
            ypad -= 6;
        }else if(DownPressed){
            ypad += 6;
        }

        //Paddle's moving Logic (Collide with Wall)
        if(xpad + padLen >= cvs.width){
            xpad = cvs.width - padLen;
        } 
        else if(xpad <= 0){
            xpad = 0;
        } 
        else if(ypad >= cvs.height-padHei){
            ypad = cvs.height - padHei;
        } 
        else if(ypad <= 0){
            ypad = 0;
        }
    }

    //Draw ball:
    function drawBall() {

        painter.beginPath();
        painter.arc(xball, yball, ballRadius, 0, Math.PI*2, false);
        painter.fillStyle = ballColorsList[ballLevel-1];
        painter.fill();
        painter.closePath();
        
        //Moving the Ball
        xball += mxball;
        yball += myball;
        
        //Ball's moving logic
            //Collide with wall
            if ((xball >= cvs.width - ballRadius)||(xball <= ballRadius)){//Sides
                mxball = -mxball;
            }    else if (yball <= ballRadius) {//Roof
                    myball = -myball;
            }    /*else if (yball >= cvs.height - ballRadius + 1){//Floor
                myball = -myball;}*/
            //Losing when missed the ball(Stored in Storing.js)
                else if (yball >= cvs.height - ballRadius + 1){
                alert("You've missed the ball. Let's do it again! \nYour total score is: " + Score + ". That's impressive =)))");
                document.location.reload();
                clearInterval(interval);
            }
    }

    //Draw bricks:
    function drawBricks() {
        for(let c = 0; c < brickCollumn; c++){
            for(let r = 0; r < brickRow; r++){
                if(bricks[c][r].hp > 0){
                    var xbrick = (c*(brickLen + brickPadding)) + brickOffsetLeft;
                    var ybrick = (r*(brickHei + brickPadding)) + brickOffsetTop;
                    bricks[c][r].x = xbrick;
                    bricks[c][r].y = ybrick;
                    painter.beginPath();
                    painter.rect(xbrick, ybrick, brickLen, brickHei);
                    painter.fillStyle = "#56E39F";
                    painter.fill();
                    painter.closePath();
                }
            }
        }
    }

    console.log("BallList lenght: " + ballColorsList.length)
    console.log("PaddleList Length: " + paddleColorsList.length)
    console.log("Total bricks: " + (brickCollumn*brickCollumn))
    //Ball collide with Paddle
    function BnPCollision(){
        //TOP
        if ((xball >= xpad) && (xball - ballRadius <= xpad + padLen) && (yball + ballRadius >= ypad) && (yball <= ypad )){
            myball = -Math.abs(myball);

            ballLevel++;

            if (PaddleMaxed){
                paddleLevel = 1;
                PaddleMaxed = false;
            }

            if (ballLevel > ballColorsList.length){
                ballLevel = 1;
                paddleLevel++;

                if (paddleLevel == paddleColorsList.length){
                    Score += 250;
                    PaddleMaxed = true;
                    document.getElementById("padstat").innerHTML = "Paddle Level Max(4)";
                }
            }

            console.log("Ball Level(after hit): " + ballLevel);
            console.log("Paddle Level(after hit): " + paddleLevel);
            console.log("Paddle Maxed: " + PaddleMaxed);
            console.log("Brick(s) left: " + ((brickCollumn*brickCollumn) - brickbrokencount))
            console.log("                                       ");
            
            if (brickbrokencount == brickRow * brickCollumn){
                alert("You've won! Hoorayyyyyy!\nYour total score is: " + Score + ". Please send the score to me.");
                document.location.reload();
                clearInterval(interval);
            }

            document.getElementById("ballstat").innerHTML = "Ball Level: " + ballLevel + "/" + ballColorsList.length;
            document.getElementById("padstat").innerHTML = "Paddle Level: " + paddleLevel + "/" + ballColorsList.length;

        }
        // Bottom
        else if ((xball >= xpad) && (xball - ballRadius <= xpad + padLen) && (yball - ballRadius <= ypad + padHei) && (yball >= ypad + padHei)){
            myball = Math.abs(myball);}
        //Left
        else if ((yball >= ypad) && (yball <= ypad + padHei) && (xball + ballRadius >= xpad) && (xball <= xpad)){
            mxball = -Math.abs(mxball);}
        //Right
        else if ((yball >= ypad) && (yball <= ypad + padHei) && (xball - ballRadius <= xpad + padLen) && (xball >= xpad + padLen)){
            mxball = Math.abs(mxball);}
    }

    //Ball collide with Bricks
    function BricksCollision(){
        for(var c = 0; c < brickCollumn; c++){
            for(var r = 0; r < brickRow; r++){
                var brik = bricks[c][r];
                if (brik.hp >= 1){
                    //Top
                    if ((xball >= brik.x) && (xball - ballRadius <= brik.x + brickLen) && (yball + ballRadius >= brik.y) && (yball <= brik.y)){
                        myball = -Math.abs(myball);
                        brik.hp--;
                        Score += 10;
                        document.getElementById("brickstat").innerHTML = "Last hit Brick's Hitpoints(left):" + brik.hp;
                        brickbrokencount++;
                        }
                    //Bottom
                    else if ((xball >= brik.x) && (xball - ballRadius <= brik.x + brickLen) && (yball - ballRadius <= brik.y + brickHei) && (yball >= brik.y + brickHei)){
                        myball = Math.abs(myball);
                        brik.hp--;
                        Score += 10;
                        document.getElementById("brickstat").innerHTML = "Last hit Brick's Hitpoints(left):" + brik.hp;
                        brickbrokencount++;
                        }
                    //Left
                    else if ((yball >= brik.y) && (yball <= brik.y + brickHei) && (xball + ballRadius >= brik.x) && (xball <= brik.x)){
                        mxball = -Math.abs(mxball);
                        brik.hp--;
                        Score += 10;
                        document.getElementById("brickstat").innerHTML = "Last hit Brick's Hitpoints(left):" + brik.hp;
                        brickbrokencount++;
                    }
                    //Right
                    else if ((yball >= brik.y) && (yball <= brik.y + brickHei) && (xball - ballRadius <= brik.x + brickLen) && (xball >= brik.x + brickLen)){
                        mxball = Math.abs(mxball);
                        brik.hp--;
                        Score += 10;
                        document.getElementById("brickstat").innerHTML = "Last hit Brick's Hitpoints(left):" + brik.hp;
                        brickbrokencount++;
                    }

                }    
            }
        }
    }

    function drawScore(){
        painter.font = "30px FS Nokio Regular";
        painter.fillStyle = "#F96338";
        painter.fillText("Score: "+ Score, 20, 20);
    }
    
    

//A function to draw almost everything(Just to be clean)
function draw(){
    painter.clearRect(0, 0, cvs.width, cvs.height);
    drawScore();
    BricksCollision();
    BnPCollision();
    drawBall();
    drawPad();
    drawBricks();
    document.getElementById("score").innerHTML = "Score: " + Score;
}

document.addEventListener("keydown", KeyPressedHandler, false);
document.addEventListener("keyup", KeyReleasedHandler, false);

function KeyPressedHandler(k) {
    if (k.key == "ArrowRight" || k.key == "d"){
        RightPressed = true;
    }
    else if (k.key == "ArrowLeft" || k.key == "a"){
        LeftPressed = true;
    }
    else if (k.key == "ArrowUp" || k.key == "w"){
        UpPressed = true;
    }
    else if (k.key == "ArrowDown" || k.key == "s"){
        DownPressed = true;
    }

}

function KeyReleasedHandler(k) {
    if (k.key == "ArrowRight" || k.key == "d"){
        RightPressed = false;
    }
    else if (k.key == "ArrowLeft" || k.key == "a"){
        LeftPressed = false;
    }
    else if (k.key == "ArrowUp" || k.key == "w"){
        UpPressed = false;
    }
    else if (k.key == "ArrowDown" || k.key == "s"){
        DownPressed = false;
    }
}



var interval = setInterval(draw, GameSpeed);
//Execute the "draw" function every 10 miliseconds
