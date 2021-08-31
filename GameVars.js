//Canvas settings
const cvs = document.getElementById("cvs");
const painter = cvs.getContext("2d");

//Game settings:
var totalScore = 0;
var GameSpeed = 10;
var interval = null;

//Responsive
var RightPressed = false;
var LeftPressed = false;
var UpPressed = false;
var DownPressed = false;

//Status
var brickbrokencount = 0;
var ballInDeadZone = false;
var paddleLevelMaxed = false;
var counting = 0;

//Paddle Settings:
var padLength = cvs.width*0.15;
var padHeight = 20;
var paddleX = cvs.width/2 - padLength/2;
var paddleY = cvs.height - padHeight*2;
var paddleColorsList = ["#272C33", "#38586C", "#708BA8"];
var paddleLevel = 1;
var paddleSpeed = 4;

//Ball Settings:
var ballRadius = 10;
var ballX = RandomFromMinToMax(200, 400);
var ballY = RandomFromMinToMax(300, 400);
var ballSpeed = 2;
var ballHorizontalMovement = InitialBallDirection();
var ballVerticalMovement = -Math.abs(ballSpeed);
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
var brickColorsList = ["#078300", "#00D83B", "#38E859", "#75EB7B", "#9DFF92"];


//Others
function RandomFromMinToMax(min, max){
    return Math.floor(Math.random()*(max-min)) + min;
}

//Decide whether the ball will go left or right at the beginning.
function InitialBallDirection(){
    let a = Math.round(Math.random());
    if (a == 0){//Ball turn Right
        return ballSpeed;
    }else if (a == 1){//Ball turn Right
        return -ballSpeed;
    }
}
