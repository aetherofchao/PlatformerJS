
// players avatar
var Player;
var traps = [];
var bullets = [];
var platforms  = [];

function startGame() {

    //  iniciation of the game 
    //          --> events can be addet manualy 

    Board.start();
    // this is THE player
    Player = new Spirit(700, 200, 35, 35, "red");
    Player.V_y = -1;   // nice litle push into the word (it just looks bit pritier)
    Player.V_x = 0; // spirits have a speed in default (its easier for now)
    Player.g = true;

    // trap prototipes
    // 		-->	can be destroid by bullets
    //		--> kill player
    traps.push(new Spirit(Board.canvas.width, 0, 30, (Board.canvas.height/2) -90, "blue"));
    traps.push(new Spirit(Board.canvas.width, (Board.canvas.height/2) + 90 , 30, Board.canvas.height -Board.canvas.height/2 -90, "blue"));

    traps.push(new Spirit(0, 0, 30, (Board.canvas.height/2) -90, "blue"));
    traps.push(new Spirit(0, (Board.canvas.height/2) + 90 , 30, Board.canvas.height -Board.canvas.height/2 -90, "blue"));

    // platform

    platforms.push(new Spirit(650,350,200,20, "pink"));
}

var Board = {
    canvas  : document.createElement("canvas"),
    start   : function() {
        this.canvas.height = 650;
        this.canvas.width = 1200;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.interval = setInterval(reRender, 2);

        window.addEventListener('keydown', function (e) {
            Board.keys = (Board.keys || []);
            Board.keys[e.keyCode] = true;
        })
        window.addEventListener('keyup', function (e) {
            Board.keys[e.keyCode] = false; 
        })
    },

    clear   : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    } 
}

function Spirit(x, y, width, height, colour) {
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.V_x = 0;
    this.V_y = 0;
    this.A_x = 0;
    this.A_y = 0.1;
    this.g = false;
    this.update = function () {
        this.x += this.V_x;
        this.y += this.V_y;
        this.V_x += this.A_x;
        if(this.g){this.V_y += this.A_y;}

        if (this.y + this.height > Board.canvas.height){
            this.y = Board.canvas.height - this.height; this.V_y *= -0.3;}
        if (this.y < 0)
            {this.y = 0; this.V_y *= -0.3;}
        if (this.x + this.width  > Board.canvas.width)
            {this.x = Board.canvas.width - this.width; this.V_x *= -0.9;}
        if (this.x < 0)
            {this.x = 0; this.V_x *= -0.9;}

        ctx = Board.context;     
        ctx.fillStyle = colour;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
    this.colision = function(spirit) {
        if (((this.x - spirit.x < spirit.width) &&
            (spirit.x - this.x < this.width)) &&
            ((this.y - spirit.y < spirit.height) &&
            (spirit.y - this.y < this.height))){

        	// spirit hiten a ground
			// then dont move 
			if(this.y > spirit.height - ( this.height + 20)){
	            this.y = spirit.height - this.height ;
	            this.V_y = 0;
	        }
            return true;
        }
    }
    this.shoot = function(){
        // shoot a bullet
        let bulletR = new Spirit(this.x + (this.width) + 2, this.y + (this.height/2) - 2, 4, 4,"black");
        let bulletL = new Spirit(this.x - 2, this.y + (this.height/2) - 2, 4, 4,"black");
        bulletR.V_x = 5;
		bulletL.V_x = -50;        
        bullets.unshift(bulletR);
        bullets.unshift(bulletL);
    }
    this.jump = function () {
        this.V_y = -5;
        this.A_y = 0.1;
    }
    this.drop = function () {
        // drop 
        //      --> upon hiting ground this stops falling
        if (this.y > Board.canvas.height - ( this.height + 20)){
            this.y = Board.canvas.height - this.height ;
            this.A_y = 0.1
            this.V_x = 0;
        }
        else {this.A_y = 0.5;}
    }
}





function movePlayer() {
	// 	this are the controls
    //		up
    if (Board.keys && Board.keys[38]) {
        Player.jump();
        Board.keys[38] = false;
    }
    // 		down
    if (Board.keys && Board.keys[40]) {
        Player.drop();
        Board.keys[40] = false;
	}
	// 		left
    if (Board.keys && Board.keys[37]) {
     	if (Player.V_x> -2){Player.V_x -= 0.03;}
    }
    // 		right
    if (Board.keys && Board.keys[39]){
        if (Player.V_x < 2){Player.V_x += 0.03;}
    }
    // 		space-bar (shoot)
    if (Board.keys && Board.keys[32]) {
        Player.shoot();
        Board.keys[32] = false;
    }
}

function reRender() {

	// not that it would matter but this way should
	// be more responsive sice they register before the actual rendering

	movePlayer(); 

	// reder the enviroment
    //
    Board.clear();
    Player.update();
    traps.forEach(function(obsticle, index, object){
        bullets.forEach(function(bull, index_b, object_b){
            if (bull.colision(obsticle)){
                traps.splice(index, 1);
                bullets.splice(index_b, 1)
            }
        })
        if (obsticle.colision(Player)) {
            
            alert("game over");
        }
        obsticle.update();
    })
    bullets.forEach(function(b){
    	bullets.splice(4,1);
        b.update();
    })
    platforms.forEach( function(platform, index) {
    	platform.update();
    });
}