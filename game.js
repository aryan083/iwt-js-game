const canvas=document.getElementById('canvas1');
const ctx=canvas.getContext('2d');
canvas.width=800;
canvas.height=500;
gameover=false;
let score =0;
let gameframe=0;
ctx.font='50px Georgia';
let gamespeed=1;
const bubblepop1 = document.createElement('audio');
bubblepop1.src='./assets/Plop.ogg';

const bubblepop2 = document.createElement('audio');
bubblepop2.src='./assets/bubbles-single2.wav';
//Mouse capture mouse movement
let canvasPosition = canvas.getBoundingClientRect();
const mouse = {
    x:canvas.width/2,
    y:canvas.height/2,
    click:false
};

canvas.addEventListener('mousedown',function(event){
    mouse.click=true;
    const canvasPosition = canvas.getBoundingClientRect(); 
    mouse.x=event.x - canvasPosition.left;
    mouse.y=event.y - canvasPosition.top;
    mouse.click=true;
});

canvas.addEventListener('mouseup',function(){
    mouse.click=false;
});

const playerLeft=new Image();
playerLeft.src='./assets/fish1.png';
const playerRight=new Image();
playerRight.src='./assets/fish2.png';

class Player {
    constructor(){
        this.x=canvas.width/2;
        this.y=canvas.height/2;
        this.radius = 50;
        this.angle = 0;
        this.frameX = 0;
        this.frameY = 0;
        this.frame = 0;
        this.spritewidth=498;
        this.spriteheight=327;
        this.animationSpeed = 0.15; // Adjust animation speed as needed
        this.spriteRows = 3; // Number of rows in sprite sheet
        this.spriteColumns = 4; // Number of columns in sprite sheet
    }

    update(){
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y; 
        let theta = Math.atan2(dy, dx);
        this.angle = theta;

        // Player control
        if (mouse.x !== this.x) {
            this.x -= dx / 30;
        }
        if (mouse.y !== this.y) {
            this.y -= dy / 30;
        }
    }

    draw() {
        // Your existing drawing code remains the same
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);

        if (this.x >= mouse.x) {
            ctx.drawImage(playerLeft, this.frameX * this.spritewidth,
                this.frameY * this.spriteheight, this.spritewidth, this.spriteheight,
                0 - 60, 0 - 45, this.spritewidth / 4, this.spriteheight / 4);
        } else {
            ctx.drawImage(playerRight, this.frameX * this.spritewidth,
                this.frameY * this.spriteheight, this.spritewidth, this.spriteheight,
                0 - 60, 0 - 45, this.spritewidth / 4, this.spriteheight / 4);
        }

        ctx.restore();

        // Update frame index for animation
        this.frame += this.animationSpeed;
        if (this.frame >= this.spriteColumns) {
            this.frame = 0;
        }
        this.frameX = Math.floor(this.frame % this.spriteColumns);
        this.frameY = Math.floor(this.frame / this.spriteColumns);
    }

    // Add mouse control methods
    onMouseDown(event) {
        mouse.click = true;
        const canvasPosition = canvas.getBoundingClientRect();
        mouse.x = event.x - canvasPosition.left;
        mouse.y = event.y - canvasPosition.top;
        mouse.click = true;
    }

    onMouseUp() {
        mouse.click = false;
    }
}


let player = new Player();

const bubbleArray=[];
const bubbleImage = new Image();
bubbleImage.src='./assets/bubble1.png';

class Bubble {
    constructor(){
        this.x=Math.random()*canvas.width;
        this.y=canvas.height + 100;
        this.radius=50;
        this.speed=Math.random()*5+1;
        this.distance;
        this.counted=false;
        this.sound=Math.random() <= 0.5 ?'sound1' : 'sound2';
}
    update()
    {
        this.y-=this.speed;
        const dx = this.x - player.x;
        const dy = this.y - player.y;
        this.distance=Math.sqrt(dx*dx+dy*dy);
    }
    draw()
    {   
        ctx.drawImage(bubbleImage,this.x-65,this.y-65,this.radius*2.6,this.radius*2.6);
    }

}

function handleBubbles(){
    if(gameframe % 50 == 0){
        bubbleArray.push(new Bubble());
    }
    
    for(let i=0;i<bubbleArray.length;i++)
    {
        bubbleArray[i].update();
        bubbleArray[i].draw();
    
        if(bubbleArray[i].y<0-bubbleArray[i].radius*2)
        {
            bubbleArray.splice(i,1);
            i--;
        }

        else if(bubbleArray[i].distance < bubbleArray[i].radius + player.radius)
        {
                if(!bubbleArray[i].counted)
                {
                    if(bubbleArray[i].sound=='sound1')
                    {
                        bubblepop1.play();
                    }
                    else
                    {
                        bubblepop2.play();
                    }
                    score++;
                    bubbleArray[i].counted=true;
                    bubbleArray.splice(i,1);
                    i--;
                }
            }
        }
    }

// Inside the animate function, call the animate method of each bubble if it's counted
function animate() {
    ctx.clearRect(0,0,canvas.width,canvas.height);
    handleBackground();
    player.update();
    player.draw();
    ctx.fillStyle='black';
    ctx.fillText('score: '+score,10,50);
    gameframe++;
    if (!gameover) requestAnimationFrame(animate);
    handleBubbles();
    handleEnemies();
    // Check if any counted bubbles need animation
    for (let i = 0; i < bubbleArray.length; i++) {
        if (bubbleArray[i].counted) {
            bubbleArray[i].animate();
        }
    }
}


//backgound
const background = new Image();
background.src='assets/background.png';

const BG = {
    x1:0,
    x2:canvas.width,
    y:0,
    width:canvas.width,
    height:canvas.height
}

function handleBackground(){
    BG.x1-=gamespeed;
    if(BG.x1<-BG.width) {BG.x1=BG.width;}
    BG.x2-=gamespeed;
    if(BG.x2<-BG.width) {BG.x2=BG.width;}
    ctx.drawImage(background,BG.x1,BG.y,BG.width,BG.height);
    ctx.drawImage(background,BG.x2,BG.y,BG.width,BG.height);
    // Draw underwater plants
    ctx.drawImage(underwaterPlantImage, 40, canvas.height - 150, 150, 150);
    ctx.drawImage(underwaterPlantImage, 300, canvas.height - 100, 120, 120);
    ctx.drawImage(underwaterPlantImage2, 500, canvas.height - 150, 150, 150);
    
    }



const enemyImage = new Image();
enemyImage.src='./assets/enemy1.png';
let enemyInterval = setInterval(spawnEnemy, 2000);

class Enemy {
    constructor(){
        this.x=canvas.width;
        this.y=Math.random()*(canvas.height-150)+90;
        this.radius=60;
        this.speed=Math.random()*2+2;
        this.frame=0;
        this.frameX=0;
        this.spritewidth=418;
        this.spriteheight=397;
    }
    draw(){
        ctx.drawImage(enemyImage,this.frameX*this.spritewidth,
            0,this.spritewidth,this.spriteheight,
            this.x-60,this.y-70,this.spritewidth/3,this.spriteheight/3);
    }

    update(){
        this.x-=this.speed;
        if(this.x<0-this.radius*2)
        {
            this.x=canvas.width+200;
            this.y=Math.random()*(canvas.height-150)+90;
            this.speed=Math.random()*2+2;
            
        }
        if(gameframe %5==0){
            this.frame++;
            if(this.frame>=12) this.frame=0;
            if(this.frame==3 || this.frame ==7 || this.frame==11){
                this.frameX=0;
            }
            else {
                this.frameX++;
            }
            if(this.frame<3) this.frameY=0;
            else if(this.frame<7) this.frameY=1;
            else if(this.frame<11) this.frame=0;
            else this.frameY=0
        }
    
        //collision with player
        const dx = this.x - player.x;
        const dy = this.y - player.y;
        const distance = Math.sqrt(dx*dx+dy*dy);
        if(distance<this.radius+player.radius){
            handleGameOver();
        }
    }
}

function handleGameOver(){
    clearInterval(enemyInterval);
    ctx.fillStyle ='red';
    ctx.fillText('Game Over your score is: ' + score,canvas.width/2-400,canvas.height/2);
    gameover=true;
    restartButton.style.display = 'block';
}

function spawnEnemy() {
    if (!gameover) {
        enemies.push(new Enemy());
    }
}

let enemies = [];

function handleEnemies(){
    for (let i = 0; i < enemies.length; i++) {
        enemies[i].update();
        enemies[i].draw();
    }
}

// Restart the game when the restart button is clicked after game over
restartButton.addEventListener('click', function () {
    if (gameover) {
        // Reset game state
        score = 0;
        gameframe = 0;
        bubbleArray.length = 0;
        enemies.length = 0;
        player = new Player(); // Reset the player object
        gameover = false;
        restartButton.style.display = 'none';
        enemyInterval = setInterval(spawnEnemy, 2000); // Restart spawning enemies
        animate();
    }
});

//Animation loop
function animate(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    handleBackground();
    player.update();
    player.draw();
    ctx.fillStyle='black';
    ctx.fillText('score: '+score,10,50);
    gameframe++;
    // console.log(gameframe);
    if(!gameover) requestAnimationFrame(animate);
    handleBubbles();
    handleEnemies();
}
animate();

window.addEventListener('resize',function(){
    canvasPosition = canvas.getBoundingClientRect();
});

function goToMenu() {
    window.location.href = "index.html";
}