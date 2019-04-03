// platformer2.0.js

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

    platforms.push(new Spirit(650,350,200,2, "pink"));
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

// engine

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
    
}