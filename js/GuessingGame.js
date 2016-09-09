function generateWinningNumber() {
  return Math.floor(Math.random() * 100) + 1;
}

function shuffle(array) {
  var m = array.length, t, i;

  // While there remain elements to shuffle…
  while (m) {

    // Pick a remaining element…
    i = Math.floor(Math.random() * m--);

    // And swap it with the current element.
    t = array[m];
    array[m] = array[i];
    array[i] = t;
  }

  return array;
}

function Game() {
	this.playersGuess = null;
	this.pastGuesses = [];
	this.winningNumber = generateWinningNumber();
} 

Game.prototype.difference = function() {
	return Math.abs(this.playersGuess - this.winningNumber);
}

Game.prototype.isLower = function() {
	return this.playersGuess < this.winningNumber;
}

Game.prototype.playersGuessSubmission = function(n) {
	if(n >= 1 && n <= 100) {
		this.playersGuess = n;
		return this.checkGuess();
	} else {
		throw "That is an invalid guess.";
	}
}

Game.prototype.checkGuess = function() {
	if(this.playersGuess === this.winningNumber){
		return "You Win!";
	}
	if(this.pastGuesses.indexOf(this.playersGuess) >= 0) {
		return "You have already guessed that number.";
	}
	if(this.playersGuess !== this.winningNumber) {
		this.pastGuesses.push(this.playersGuess);
	}
	if(this.pastGuesses.length === 5) {
		return "You Lose.";
	}
	if(this.difference() < 10) {
		return "You're burning up!";
	}
	if(this.difference() < 25) {
		return "You're lukewarm.";
	}
	if(this.difference() < 50) {
		return "You're a bit chilly."
	}
	if(this.difference() < 100) {
		return "You're ice cold!";
	}
}

function newGame() {
	return new Game();

}

Game.prototype.provideHint = function() {
	var hintArray = [];
	hintArray.push(this.winningNumber);
	hintArray.push(generateWinningNumber());
	hintArray.push(generateWinningNumber());
	shuffle(hintArray);
	return hintArray;
}

jQuery(document).ready(function(){
	var game = new Game();
	$('.disableGameOver').prop('disabled', false);

	function submitGuess() {
		var guess = $("#input-player").val();
		$('#input-player').val("");
		$('h1').text(game.playersGuessSubmission(parseInt(guess,10)));
		$('h3').text(game.isLower() ? "Guess higher!" : "Guess lower!");
		for (var i = 0; i < game.pastGuesses.length; i++) {
			$('ul').children().eq(i).text(game.pastGuesses[i]);
		}
		if(game.playersGuess === game.winningNumber || game.pastGuesses.length === 5) {
			$('h3').text("Click 'Reset' button to restart game");
			$('.disableGameOver').prop('disabled', true);
		}
	}

	$('#submit').on('click', submitGuess);
	$('#input-player').keypress(function(event){
		if (event.which === 13)
			return submitGuess();
	});
	$('#reset').on('click', function(){
		game = new Game();
		$('h1').text('Play the Guessing Game!');
    	$('h3').text('Guess a number between 1-100!')
    	$('.guess').text('-');
		$('.disableGameOver').prop('disabled', false);
	});
	$('#hint').on('click', function(){
		$('h1').text("Winning number is: " + game.provideHint());
	})
});

