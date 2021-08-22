//Canvas settings
var cvs = document.getElementById("acanvas");
var painter = cvs.getContext("2d");

//Game settings:
var GameSpeed = 10;
var Score = 0;
var interval = setInterval(draw, GameSpeed);

//Responsive
var RightPressed = false;
var LeftPressed = false;
var UpPressed = false;
var DownPressed = false;

//Status
var BallCombo = true;
var PaddleMaxed = null;
var brickbrokencount = 0;
var ballInDeadZone = false;
var counting = 0;

//Paddle Settings:
var padLen = 80;
var padHei = 20;
var xpad = cvs.width/2 - padLen/2;
var ypad = cvs.height - padHei*2;
var paddleColorsList = ["#001242", "#607196", "#BABFD1"];
var paddleLevel = 1;
var paddleSpeed = 4;

//Ball Settings:
var ballRadius = 10;
var xball = RandomFromTo(200, 400);
var yball = RandomFromTo(300, 400);
var mxball = InitialBallDirection();
var myball = -2;
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


console.log("Initial text x:" + (xpad-padHei));
console.log("Initial text y:" + (ypad-padHei));
console.log("Initial xpad:" + xpad);


//Adding Bricks
var bricks = [];
for(let c = 0; c < brickCollumn; c++){
    bricks[c] = [];
    for(let r = 0; r < brickRow; r++){
        bricks[c][r] = {x: 0, y: 0, hp: 1 /*Hit Points of the Brick -> 0 means disappear*/};
    }
}

//Others
function RandomFromTo(min, max){
    return Math.floor(Math.random()*(max-min)) + min;
}

function InitialBallDirection(){//Ball will start going left or right in the beginning.
    let a = Math.round(Math.random());
    if (a == 0){//Ball turn Right
        return 2;
    }else if (a == 1){//Ball turn Right
        return -2;
    }
}

//Drawing things

    function drawBall() {
        //Draw Ball
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
            }else if (yball <= ballRadius) {//Roof
                myball = -myball;
            }else if (yball >= cvs.height - ballRadius + 1){//Hitting the Floor
                myball = -myball;}
            //Losing when missed the ball(Stored in Storing.js)
            else if (yball >= cvs.height - ballRadius + 1){
                alert("You've missed the ball. Let's do it again! \nYour total score is: " + Score + ". That's impressive =)))");
                document.location.reload();
                clearInterval(interval);
            }
            //Ball fallen into dead zone
            else if (yball >= ypad + padHei/2){
                ballInDeadZone = true;
            }
            else{
                ballInDeadZone = false;
            }
    }
    function drawPad() {
        painter.beginPath();
        painter.rect(xpad, ypad, padLen, padHei);
        painter.fillStyle = paddleColorsList[paddleLevel - 1];
        painter.fill();
        painter.closePath();

        //Moving the Paddle
        if(RightPressed){
            xpad += paddleSpeed;
        }else if(LeftPressed){
            xpad -= paddleSpeed;
        }else if(UpPressed){
            ypad -= paddleSpeed;
        }else if(DownPressed){
            ypad += paddleSpeed;
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

    function drawScore(){
        painter.font = "30px FS Nokio Regular";
        painter.fillStyle = "#F96338";
        painter.fillText("Score: "+ Score, 20, 30);
    }  
    function drawDeadZone(){
        painter.beginPath();
        painter.fillStyle = "#F9633866";
        if (ballInDeadZone == true){
            painter.fillStyle = "#E94F37";
        }
        painter.rect(0, ypad + padHei/2, cvs.width, cvs.height-ypad);
        painter.fill();
        painter.closePath();
        if (ballInDeadZone == true){
            painter.fillText("Ah, you're dead.", xpad-padHei, ypad-padHei);
        }
        
    }


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
            }
            
            if ((paddleLevel == paddleColorsList.length) && (ballLevel == ballColorsList.length)){
                Score += 250;
                PaddleMaxed = true;
                document.getElementById("padstat").innerHTML = "Paddle Level Max(4)";
            }

            if (brickbrokencount == brickRow * brickCollumn){
                alert("You've won! Hoorayyyyyy!\nYour total score is: " + Score + ". Please send the score to me.");
                document.location.reload();
                clearInterval(interval);
            }

            document.getElementById("ballstat").innerHTML = ballLevel + "/" + ballColorsList.length;
            document.getElementById("padstat").innerHTML = paddleLevel + "/" + paddleColorsList.length;
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
    function BnBCollision(){
        //function to shorten the shits below
        function BrickHit(){
            brik.hp--;
            Score += 10;
            document.getElementById("brickstat").innerHTML = "Last hit Brick's Hitpoints(left):" + brik.hp;
            if (brik.hp == 0){
                brickbrokencount++;
            }
        }
        for(var c = 0; c < brickCollumn; c++){
            for(var r = 0; r < brickRow; r++){
                var brik = bricks[c][r];
                if (brik.hp >= 1){
                    //Top
                    if ((xball >= brik.x) && (xball - ballRadius <= brik.x + brickLen) && (yball + ballRadius >= brik.y) && (yball <= brik.y)){
                        myball = -Math.abs(myball);
                        BrickHit();}
                    //Bottom
                    else if ((xball >= brik.x) && (xball - ballRadius <= brik.x + brickLen) && (yball - ballRadius <= brik.y + brickHei) && (yball >= brik.y + brickHei)){
                        myball = Math.abs(myball);
                        BrickHit();}
                    //Left
                    else if ((yball >= brik.y) && (yball <= brik.y + brickHei) && (xball + ballRadius >= brik.x) && (xball <= brik.x)){
                        mxball = -Math.abs(mxball);
                        BrickHit();}
                    //Right
                    else if ((yball >= brik.y) && (yball <= brik.y + brickHei) && (xball - ballRadius <= brik.x + brickLen) && (xball >= brik.x + brickLen)){
                        mxball = Math.abs(mxball);
                        BrickHit();}

                }    
            }
        }
    }
    
    function ScoreScored(){
        return true;
    }
 
    
//A function to draw almost everything(Just to be clean)


document.addEventListener("keydown", KeyPressedHandler, false);
document.addEventListener("keyup", KeyReleasedHandler, false);
document.addEventListener("mousemove", MouseMovingHandler, false);

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

function MouseMovingHandler(m) {
    //Method 1
    var relativeX = m.clientX - cvs.offsetLeft;
    
    if((relativeX > 0) && (relativeX < cvs.width)){
        xpad =  relativeX - padLen/2;
    }
    console.log("clientX: " + m.clientX);
    console.log("cvs.offsetLeft: " + cvs.offsetLeft);
}

function draw(){
    painter.clearRect(0, 0, cvs.width, cvs.height);
    drawScore();
    ScoreScored()
    BnBCollision();
    BnPCollision();
    drawDeadZone();
    drawBall();
    drawPad();
    drawBricks();
    document.getElementById("score").innerHTML = Score;
}
//Meh