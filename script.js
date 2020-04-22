var tiles = Array.from(Array(9).keys());
var ctx = Array(9);
var disabled = Array(9);
for(var i=0; i<tiles.length; i++) disabled[i] = false;
var isOver = false;
var content = Array.from(Array(9).keys());
var huPlayer = "x";
var aiPlayer = "o";
const winPatterns = [
[0,1,2], [3,4,5], [6,7,8],
[0,3,6], [1,4,7], [2,5,8],
[0,4,8], [2,4,6]];

// set up 
var mainDiv = document.createElement("DIV");
document.body.appendChild(mainDiv);
mainDiv.id ="container";

for (var i=0; i<tiles.length; i++){
	
	if (i % 3 == 0){
		linebreak = document.createElement("br");
		mainDiv.appendChild(linebreak);
	}

	tiles[i] = document.createElement("CANVAS");
	mainDiv.appendChild(tiles[i]);
	tiles[i].id = i; 
	tiles[i].width = tiles[i].height = 100;
	ctx[i] = tiles[i].getContext('2d');

}

function handleElement(k){
	document.getElementById(k).onclick = function(){
		onclick_handler(k);
	};
}

for(var j=0;j<9;j++) handleElement(j);

var replayBtn = document.createElement("BUTTON");
mainDiv.appendChild(replayBtn);
replayBtn.id ="replayBtn";
replayBtn.innerHTML = "Restart";




document.getElementById("replayBtn").onclick = function(){
	replayBtn.style.display = "none";
	for(var i=0; i<9; i++){
		disabled[i] = false;
		content[i] = i;
		ctx[i].clearRect(0,0,100,100);
		ctx[i].fillStyle = "#EC9A29";
		ctx[i].fillRect(0,0,100,100);
		document.getElementById(i).style.boxShadow = "20px 20px 100px #FBFEF9";
	}
};


// --------------------------------
// human move and ai response
function onclick_handler(x){
	
	if(!disabled[x]) {
		disabled[x] = true;
		content[x] = "x";
		
		tiles[x].style.Transform = "rotateX(180deg)";
		tiles[x].style.webkitTransform = "rotateX(180deg)";
		tiles[x].style.msTransform = "rotateX(180deg)";
		tiles[x].style.mozTransform = "rotateX(180deg)";
		tiles[x].style.oTransform = "rotateX(180deg)";
		setTimeout(function(){ 
		draw_X(x);	
		},190);

		let gameWon = winning(content, huPlayer);
		if(gameWon) gameOver(gameWon);
		if(!checkTie() && !winning(content, huPlayer)) {
			setTimeout(function(){ 
			computer_move(bestMove());	
			
		},200);
		}

	}
	
};


//drawing functions
function draw_O(x){
	ctx[x].strokeStyle = "#FBFEF9";
	ctx[x].lineWidth = 4;
	ctx[x].beginPath();
	ctx[x].arc(50,50,35,0, 2*Math.PI);
	ctx[x].stroke();
};
function draw_X(x){
	ctx[x].strokeStyle = "#FBFEF9";
	ctx[x].lineWidth = 4;
	ctx[x].moveTo(20,20);
	ctx[x].lineTo(80,80);
	ctx[x].stroke();
	ctx[x].moveTo(80,20);
	ctx[x].lineTo(20,80);
	ctx[x].stroke();
};

// end game checking
function winning(board, player){
let plays = board.reduce((a,e,i)=>
	(e===player)? a.concat(i): a,[]);
let gameWon = null;
for(let [index,win] of winPatterns.entries()){
	if(win.every(elem => plays.indexOf(elem) > -1)){
		gameWon = {index: index, player: player};
		break;
	}else{
		gameWon = false;
	}
}
return gameWon;
};

function checkTie(){
	var availSpots = emptyTiles(content);
	return (availSpots.length == 0);
};
// ending the game
function randomMsg(winner){
	var msgArr = ["WELL DONE", "What a genius!", "Woohooo you won", "Lost again, huh?", "Pathetic.","You lose.", "Game over, loser"];
	if(winner == huPlayer){
		var index = Math.floor(Math.random()*2);
	}else{
		index = Math.floor(Math.random() * 4) + 3;
		console.log(index);
	}
	
	return msgArr[index];
}

function gameOver(gameWon){

	var msg = randomMsg(gameWon.player);
	alert(msg);

	for(var i=0; i<9; i++){
		disabled[i] = true;
	}

	var wonPattern = winPatterns[gameWon.index]; // returns an array of the tiles.
	for(var i=0; i<3; i++){
		var current = wonPattern[i];
		var currentCanvas = document.getElementById(wonPattern[i]);
		currentCanvas.style.backgroundColor = "#FFBA5C";
	}
	document.getElementById("replayBtn").style.display = "block";



};


// ai algorithms and ai move
function bestMove() {
	return minimax(content, aiPlayer).index;
};

function minimax(nboard, player){
	var availSpots = emptyTiles(nboard);
	if(winning(nboard,player)){
		return {score:-10};
	}else if(winning(nboard,aiPlayer)){
		return {score: 10};
	} else if (availSpots.length === 0){
		return {score:0};
	}

	var moves = [];
	for(var i=0; i<availSpots.length;i++){
		var move = {score:null};
		move.index = nboard[availSpots[i]];
		nboard[availSpots[i]] = player; 
		if(player == aiPlayer){
			var result = minimax(nboard, huPlayer);
			move.score = result.score;
		} else {
			var result = minimax(nboard, aiPlayer);
			move.score = result.score;
		}
		nboard[availSpots[i]] = move.index;
		moves.push(move);
	}
	
	var bestMove;
	if (player === aiPlayer){
		var bestScore = -10000;
		for(var i=0; i<moves.length; i++){
		if(moves[i].score > bestScore){
			bestScore = moves[i].score;
			bestMove = i;
		}
		}
	} else {
		var bestScore = 10000;
		for(var i=0; i<moves.length; i++){
		if(moves[i].score < bestScore){
			bestScore = moves[i].score;
			bestMove = i;
		}
		}

	}

return moves[bestMove];
};


function computer_move(move){
	if(!disabled[move]) {
		disabled[move] = true;
		content[move] = "o";
		
		tiles[move].style.Transform = "rotateX(180deg)";
		tiles[move].style.webkitTransform = "rotateX(180deg)";
		tiles[move].style.msTransform = "rotateX(180deg)";
		tiles[move].style.mozTransform = "rotateX(180deg)";
		tiles[move].style.oTransform = "rotateX(180deg)";
		setTimeout(function(){ 
		draw_O(move);
		},200);
		let gameWon = winning(content,aiPlayer);
		if (gameWon) setTimeout(gameOver(gameWon),100);


	}
};

//returns a list of all available spaces
function emptyTiles(board){
	return board.filter(s => s != "o" && s != "x");
};

