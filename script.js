let Board;
let You = 'O';
let Computer = 'X';
const winOptions = [
	[0, 1, 2],
	[3, 4, 5],
	[6, 7, 8],
	[0, 3, 6],
	[1, 4, 7],
	[2, 5, 8],
	[0, 4, 8],
	[6, 4, 2]
]

const cells = document.querySelectorAll('.cell');
startGame();
function choose(symbol){
    You = symbol;
    Computer = symbol==='O' ? 'X' :'O';
    Board = Array.from(Array(9).keys());
    for (let i = 0; i < cells.length; i++)
    {
      cells[i].addEventListener('click', turnClick, false);
    }
    if (Computer === 'X') {
      turn(bestSpot(),Computer);
    }
    document.querySelector('.choose').style.display = "none";
  }

function startGame() 
{
	document.querySelector(".endgame").style.display = "none";
    document.querySelector('.endgame .text').innerText ="";
    document.querySelector('.choose').style.display = "block";
	for (let i = 0; i < cells.length; i++) {
		cells[i].innerText = '';
		cells[i].style.removeProperty('background-color');
	
	}
}

function turnClick(square) {
	if (typeof Board[square.target.id] == 'number') {
		turn(square.target.id, You)
		if (!checkWin(Board, You) && !checkTie())  
      turn(bestSpot(), Computer);
	}
}

function turn(squareId, player) {
	Board[squareId] = player;
	document.getElementById(squareId).innerText = player;
	let gameWon = checkWin(Board, player)
    if (gameWon) gameOver(gameWon);
    checkTie();
}

function checkWin(board, player) {
	let plays = board.reduce((a, e, i) => 
		(e === player) ? a.concat(i) : a, []);
	let gameWon = null;
	for (let [index, win] of winOptions.entries()) {
		if (win.every(elem => plays.indexOf(elem) > -1)) {
			gameWon = {index: index, player: player};
			break;
		}
	}
	return gameWon;
}

function gameOver(gameWon) {
	for (let index of winOptions[gameWon.index]) {
		document.getElementById(index).style.backgroundColor =
			gameWon.player == You ? "blue" : "red";
	}
	for (var i = 0; i < cells.length; i++) {
		cells[i].removeEventListener('click', turnClick, false);
	}
	declareWinner(gameWon.player == You ? "You win!" : "You lose.");
}

function declareWinner(who) {
	document.querySelector(".endgame").style.display = "block";
	document.querySelector(".endgame .text").innerText = who;
}

function emptySquares() {
    return Board.filter((elm, i) => i===elm);
  }
    
  function bestSpot(){
    return minimax(Board, Computer).index;
  }

function checkTie() {
	if (emptySquares().length == 0) {
		for (var i = 0; i < cells.length; i++) {
			cells[i].style.backgroundColor = "yellow";
			cells[i].removeEventListener('click', turnClick, false);
		}
		declareWinner("Game Tie!")
		return true;
	}
	return false;
}
function minimax(newBoard, player) {
    var availSpots = emptySquares(newBoard);
    
    if (checkWin(newBoard, You)) {
      return {score: -10};
    } else if (checkWin(newBoard, Computer)) {
      return {score: 10};
    } else if (availSpots.length === 0) {
      return {score: 0};
    }
    
    var moves = [];
    for (let i = 0; i < availSpots.length; i ++) {
      var move = {};
      move.index = newBoard[availSpots[i]];
      newBoard[availSpots[i]] = player;
      
      if (player === Computer)
        move.score = minimax(newBoard, You).score;
      else
         move.score =  minimax(newBoard, Computer).score;
      newBoard[availSpots[i]] = move.index;
      if ((player === Computer && move.score === 10) || (player === You && move.score === -10))
        return move;
      else 
        moves.push(move);
    }
    
    let bestMove, bestScore;
    if (player === Computer) {
      bestScore = -1000;
      for(let i = 0; i < moves.length; i++) {
        if (moves[i].score > bestScore) {
          bestScore = moves[i].score;
          bestMove = i;
        }
      }
    } else {
        bestScore = 1000;
        for(let i = 0; i < moves.length; i++) {
        if (moves[i].score < bestScore) {
          bestScore = moves[i].score;
          bestMove = i;
        }
      }
    }
    
    return moves[bestMove];
  }