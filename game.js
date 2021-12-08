//Adding Bricks
var bricks = [];
for(let c = 0; c < brickCollumn; c++){
    bricks[c] = [];
    hitpoints = RandomFromMinToMax(1, brickColorsList.length);
    for(let r = 0; r < brickRow; r++){
        bricks[c][r] = {x: 0, y: 0, hp: hitpoints /*Hit Points of the Brick -> 0 means disappear*/};
    }
}

function drawBall() {
    //Draw Ball
    painter.beginPath();
    painter.arc(ballX, ballY, ballRadius, 0, Math.PI*2, false);
    painter.fillStyle = ballColorsList[ballLevel-1];
    painter.fill();
    painter.closePath();
    
    //Moving the Ball
    ballX += ballHorizontalMovement;
    ballY += ballVerticalMovement;
    
    //Ball's moving logic
        //Collide with wall
        if ((ballX >= cvs.width - ballRadius)||(ballX <= ballRadius)){//Sides
            ballHorizontalMovement = -ballHorizontalMovement;
        }else if (ballY <= ballRadius) {//Roof
            ballVerticalMovement = -ballVerticalMovement;
        }// else if (ballY >= cvs.height - ballRadius + 1){//Hitting the Floor
        //     ballVerticalMovement = -ballVerticalMovement;}
        //Losing when missed the ball(Stored in Storing.js)
        else if (ballY >= cvs.height - ballRadius + 1){
            losing();
            document.location.reload();
            clearInterval(interval);
        }
        //Ball fallen into dead zone
        else if (ballY >= paddleY + padHeight/2){ballInDeadZone = true;}
        else{ballInDeadZone = false;}
}

function drawPad() {
    painter.beginPath();
    painter.rect(paddleX, paddleY, padLength, padHeight);
    painter.fillStyle = paddleColorsList[paddleLevel - 1];
    painter.fill();
    painter.closePath();

    //Moving the Paddle
    if(RightPressed){
        paddleX += paddleSpeed;}
    else if(LeftPressed){
        paddleX -= paddleSpeed;}
    else if(UpPressed){
        paddleY -= paddleSpeed;}
    else if(DownPressed){
        paddleY += paddleSpeed;}

    //Paddle's moving Logic (Collide with Wall)
    if(paddleX + padLength >= cvs.width){
        paddleX = cvs.width - padLength;} 
    else if(paddleX <= 0){
        paddleX = 0;} 
    else if(paddleY + padHeight>= cvs.height){
        paddleY = cvs.height - padHeight;} 
    else if(paddleY <= 0){
        paddleY = 0;}
}

function drawBricks() {
    for(let c = 0; c < brickCollumn; c++){
        for(let r = 0; r < brickRow; r++){
            if(bricks[c][r].hp > 0){
                var xbrick = (c*(brickLen + brickPadding)) + brickPadding;
                var ybrick = (r*(brickHei + brickPadding)) + brickOffsetTop;
                bricks[c][r].x = xbrick;
                bricks[c][r].y = ybrick;
                hitpointleft = bricks[c][r].hp;
                painter.beginPath();
                painter.rect(xbrick, ybrick, brickLen, brickHei);
                painter.fillStyle = brickColorsList[hitpointleft-1];
                painter.fill();
                painter.closePath();
            }
        }
    }
}

function drawScore(){
    painter.font = "30px FS Nokio Regular";
    painter.fillStyle = "#F96338";
    painter.fillText("Score: "+ totalScore, 20, 30);
}  
function drawDeadZone(){
    painter.beginPath();
    painter.fillStyle = "#F9633866";
    if (ballInDeadZone == true){
        painter.fillStyle = "#E94F37";
        painter.fillText("Ah, you're dead.", paddleX-padHeight, paddleY-padHeight);
    }
    painter.rect(0, paddleY + padHeight/2, cvs.width, cvs.height-paddleY);
    painter.fill();
    painter.closePath();
}

function BnPCollision(){
    //TOP
    if ((ballX >= paddleX) && (ballX - ballRadius <= paddleX + padLength) && (ballY + ballRadius >= paddleY) && (ballY <= paddleY )){
        ballVerticalMovement = -Math.abs(ballVerticalMovement);

        ballLevel++;

        if (paddleLevelMaxed){
            paddleLevel = 1;
            paddleLevelMaxed = false;
        }
        if (ballLevel > ballColorsList.length){
            ballLevel = 1;
            paddleLevel++;
        }
        if ((paddleLevel == paddleColorsList.length) && (ballLevel == ballColorsList.length)){
            totalScore += 250;
            paddleLevelMaxed = true;
            document.getElementById("padstat").innerHTML = "Paddle Level Max(4)";
        }
        if (brickbrokencount == brickRow * brickCollumn){
            alert("You've won! Hoorayyyyyy!\nYour total score is: " + totalScore + ". Please send the score to me.");
            document.location.reload();
            clearInterval(interval);
        }
        document.getElementById("ballstat").innerHTML = ballLevel + "/" + ballColorsList.length;
        document.getElementById("padstat").innerHTML = paddleLevel + "/" + paddleColorsList.length;
    }
    // Bottom
    else if ((ballX >= paddleX) && (ballX - ballRadius <= paddleX + padLength) && (ballY - ballRadius <= paddleY + padHeight) && (ballY >= paddleY + padHeight)){
        ballVerticalMovement = Math.abs(ballVerticalMovement);}
    //Left
    else if ((ballY >= paddleY) && (ballY <= paddleY + padHeight) && (ballX + ballRadius >= paddleX) && (ballX <= paddleX)){
        ballHorizontalMovement = -Math.abs(ballHorizontalMovement);}
    //Right
    else if ((ballY >= paddleY) && (ballY <= paddleY + padHeight) && (ballX - ballRadius <= paddleX + padLength) && (ballX >= paddleX + padLength)){
        ballHorizontalMovement = Math.abs(ballHorizontalMovement);}
}

function BnBCollision(){
    //function to shorten the shits below
    function BrickHit(){
        brik.hp--;
        totalScore += 10;
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
                if ((ballX >= brik.x) && (ballX - ballRadius <= brik.x + brickLen) && (ballY + ballRadius >= brik.y) && (ballY <= brik.y)){
                    ballVerticalMovement = -Math.abs(ballVerticalMovement);
                    BrickHit();}
                //Bottom
                else if ((ballX >= brik.x) && (ballX - ballRadius <= brik.x + brickLen) && (ballY - ballRadius <= brik.y + brickHei) && (ballY >= brik.y + brickHei)){
                    ballVerticalMovement = Math.abs(ballVerticalMovement);
                    BrickHit();}
                //Left
                else if ((ballY >= brik.y) && (ballY <= brik.y + brickHei) && (ballX + ballRadius >= brik.x) && (ballX <= brik.x)){
                    ballHorizontalMovement = -Math.abs(ballHorizontalMovement);
                    BrickHit();}
                //Right
                else if ((ballY >= brik.y) && (ballY <= brik.y + brickHei) && (ballX - ballRadius <= brik.x + brickLen) && (ballX >= brik.x + brickLen)){
                    ballHorizontalMovement = Math.abs(ballHorizontalMovement);
                    BrickHit();}

            }    
        }
    }
}

function losing() {
    var comforting = '';
    if ((totalScore >= 10) && (totalScore < 50)){
        comforting = "\nUnlucky, it's must be your first time playing this game. Let's try that again!"}    
    else if((totalScore >= 50) && (totalScore < 200)){
            comforting = "\nAw... missed. You did a good job anyway. Let's try that again!"}    
    else if((totalScore >= 200) && (totalScore < 600)){
        comforting = "\nWhat a pity! You've came this far. Might consider give it another try, will ya?"}
    else if((totalScore >= 600) && (totalScore < 900)){
        comforting = "\nOh no!!! You've missed. Just a couple more bricks and you'll win... Let's get 'em next time!"}
    else if(totalScore >= 900){
        comforting = "\nOh ho ho! Almost break the record, so careles... Wanna reach the maximum score again? Bang the retry button!"}
    alert("Your total score is: " + totalScore + comforting);  
}

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
        paddleX =  relativeX - padLength/2;
    }
}

function GameRunning() {
    painter.clearRect(0, 0, cvs.width, cvs.height);
    drawScore();
    drawDeadZone();
    BnBCollision();
    BnPCollision();
    drawBall();
    drawPad();
    drawBricks();
}

/*
function Bảo đã đói chưa(){
    if (Bảo đói rồi){
        Bảo ăn cơm}
    
    else if (Bảo chưa đói nhưng muốn ăn bánh){
        Bảo ăn bánh}
    else if (Bảo chưa đói nhưng muốn ăn kẹo){
        Bảo ăn kẹo}
    else if (Bảo chưa đói nhưng muốn ăn kem){
        Bảo ăn kem}

    else{
        Bảo không đói}
    
    Bảo đi ngủ
}
*/

/* START THE GAME
    Check if GameRunning == true
        false -> return
        true
            interval = setIntervall(RunTheGame())
    
    RunTheGame()
        IMPORTANT!!
        .clearRect(0, 0, cvs.width, cvs.height); Clear the previous frame
        Paddle();
            Status
                Moving
                    Navigation key pressed/ released
                    OR Mouse control
                        take mouse position
                        add paddle position by paddlespeed every frame until middle of the paddle = mouse position
                Check Level
            Appearance
                According to level
            Logic
                Collide with Wall(not going through walls)
        Ball();
            Status
                Speed
                Check Level
            Appearance
                According to level
            Logic
                Collide with Wall(not going through walls)
                touched the bottom -> gamerunning = false and popup losing modal
        Bricks();
            Status
                Check Level
            Appearance
                According to level
            Logic
                Collide with Wall(not going through walls)
        Collision();
            Ball and Paddle Collision()
                Change direction on colliding
                Change status
            Ball and Brick Collision()
                Change direction on colliding
                Change Status
                Add score
                Combo?
        Score();
            display total score

        EXTRA
            Dead zone
            display scored score
            combo multiplying

*/
