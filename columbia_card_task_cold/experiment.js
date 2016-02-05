/* ************************************ */
/* Define helper functions */
/* ************************************ */

function getDisplayElement() {
	$('<div class = display_stage_background></div>').appendTo('body')
	return $('<div class = display_stage></div>').appendTo('body')
}

var getInstructFeedback = function() {
	return '<div class = centerbox><p class = center-block-text>' + feedback_instruct_text +
		'</p></div>'
}

var appendTestData = function() {
	jsPsych.data.addDataToLastTrial({
		responses: currID,
		num_loss_cards: lossProb,
		gain_amount: gainAmt,
		loss_amount: lossAmt,
		round_points: roundPoints
	})

}

var getText = function() {
	return
		'<div class = centerbox><p class = block-text>These are your prizes from three randomly picked trials:  ' +
		'<ul list-text><li>' + prize1 + '</li><li>' + prize2 + '</li><li>' + prize3 + '</li></ul>' +
		'</p></div>'
}



var chooseButton = function(clicked_id) {
	currID = parseInt(clicked_id)
	for (x = 0; x < currID; x++) {
		temp = shuffledCardArray2.pop()
		randomChosenCards.push(temp)
	}
	firstLoss = 0
	for (z = 0; z < randomChosenCards.length; z++) {
		index = whichLossCards.indexOf(randomChosenCards[z])
		if (index == -1) {
			roundPoints = roundPoints + gainAmt
		} else if (index != -1) {
			if (firstLoss === 0) {
				roundPoints = roundPoints - lossAmt
				firstLoss = 1
			} else if (firstLoss == 1) {
				roundPoints = roundPoints
			}

		}
	}
	roundPointsArray.push(roundPoints)
	alert('You chose ' + currID +
		' cards. When you click on ok, the next round starts. Please note that the loss amount, the gain amount, and the number of loss cards might have changed.'
	)
	e = jQuery.Event("keydown");
	e.which = 37; // # Some key code value
	e.keyCode = 37
	$(document).trigger(e);
	e = jQuery.Event("keyup");
	e.which = 37; // # Some key code value
	e.keyCode = 37
	$(document).trigger(e)
}

var chooseButton1 = function(clicked_id) {
	currID = parseInt(clicked_id)
	alert('You chose ' + currID +
		' cards. When you click on ok, the next round starts. Please note that the loss amount, the gain amount, and the number of loss cards might have changed.'
	)
	e = jQuery.Event("keydown");
	e.which = 37; // # Some key code value
	e.keyCode = 37
	$(document).trigger(e);
	e = jQuery.Event("keyup");
	e.which = 37; // # Some key code value
	e.keyCode = 37
	$(document).trigger(e)
}

var instructButton = function(clicked_id) {
	currID = parseInt(clicked_id)
	document.getElementById(clicked_id).src =
		'/static/experiments/columbia_card_task_cold/images/chosen.png';
}

// appends text to be presented in the game
function appendTextAfter(input, search_term, new_text) {
	var index = input.indexOf(search_term) + search_term.length
	return input.slice(0, index) + new_text + input.slice(index)
}



// this function sets up the round params (loss amount, gain amount, which ones are loss cards, initializes the array for cards to be clicked, )
var getRound = function() {
	roundPoints = 0
	cardArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23,
		24, 25, 26, 27, 28, 29, 30, 31, 32
	]
	shuffledCardArray = jsPsych.randomization.repeat(cardArray, 1)
	shuffledCardArray2 = jsPsych.randomization.repeat(cardArray, 1)
	whichRound = whichRound + 1
	randomChosenCards = []
	roundParams = shuffledParamsArray.pop()
	lossProb = roundParams[0]
	gainAmt = roundParams[1]
	lossAmt = roundParams[2]
	whichLossCards = []
	for (i = 0; i < lossProb; i++) {
		whichLossCards.push(shuffledCardArray.pop())
	}
	gameState = gameSetup
	gameState = appendTextAfter(gameState, 'Game Round: ', whichRound)
	gameState = appendTextAfter(gameState, 'Loss Amount: ', lossAmt)
	gameState = appendTextAfter(gameState, 'Current Round: ', 0) //make a function to find cumulative score for this round
	gameState = appendTextAfter(gameState, '# of Loss Cards: ', lossProb)
	gameState = appendTextAfter(gameState, 'Gain Amount: ', gainAmt)
	return gameState
}


var instructFunction = function() {
	document.getElementById("c1").src =
		'/static/experiments/columbia_card_task_cold/images/chosen.png';
	document.getElementById("c17").src =
		'/static/experiments/columbia_card_task_cold/images/chosen.png';
	document.getElementById("c18").src =
		'/static/experiments/columbia_card_task_cold/images/chosen.png';
	document.getElementById("c15").src =
		'/static/experiments/columbia_card_task_cold/images/chosen.png';
	document.getElementById("c27").src =
		'/static/experiments/columbia_card_task_cold/images/chosen.png';
	document.getElementById("c31").src =
		'/static/experiments/columbia_card_task_cold/images/chosen.png';
	document.getElementById("c8").src =
		'/static/experiments/columbia_card_task_cold/images/chosen.png';
	document.getElementById("instruct1").innerHTML =
		'<strong>Example 1: </strong>In the example below, you see 32 unknown cards. The display shows you that 1 of these cards is a loss card. It also tells you that turning over each gain card is worth 10 points to you, and that turning over the loss card will cost you 750 points. Let us suppose you decided to turn over 7 cards and then decided to stop. Please click the "See Result" button to see what happens: <font color = "red">Luckily, none of the seven cards you turned over happened to be the loss card, so your score for this round was 70. Please click the next button.</font>'

}

var instructFunction2 = function() {
	document.getElementById("c1").src =
		'/static/experiments/columbia_card_task_cold/images/chosen.png';
	document.getElementById("c4").src =
		'/static/experiments/columbia_card_task_cold/images/chosen.png';
	document.getElementById("c30").src =
		'/static/experiments/columbia_card_task_cold/images/chosen.png';
	document.getElementById("c13").src =
		'/static/experiments/columbia_card_task_cold/images/loss.png';
	document.getElementById("instruct2").innerHTML =
		'<strong>Example 1: </strong>In the example below, you see 32 unknown cards. The display shows you that 3 of these cards is a loss card. It also tells you that turning over each gain card is worth 30 points to you, and that turning over the loss card will cost you 250 points. Let us suppose you decided to turn over 10 cards and then decided to stop. Please click the "See Result" button to see what happens: <font color = "red">This time, the fourth card you turned over was a loss card. As you saw, the round will immediately end when you turn over the loss card. You had earned 90 points for the 3 gain cards, and then 250 points were subtracted for the loss card, so your score for this round was -160. After the loss points were subtracted from your Round Total, the computer also showed you the cards that you had not yet turned over. Please click the next button.</font>'

	setTimeout(instructTurnCard, 1500)
}

var instructTurnCard = function() {
	document.getElementById("c8").src = '/static/experiments/columbia_card_task_cold/images/loss.png';
	document.getElementById("c2").src = '/static/experiments/columbia_card_task_cold/images/loss.png';
	document.getElementById("c3").src =
		'/static/experiments/columbia_card_task_cold/images/chosen.png';
	document.getElementById("c5").src =
		'/static/experiments/columbia_card_task_cold/images/chosen.png';
	document.getElementById("c6").src =
		'/static/experiments/columbia_card_task_cold/images/chosen.png';
	document.getElementById("c7").src =
		'/static/experiments/columbia_card_task_cold/images/chosen.png';
	document.getElementById("c9").src =
		'/static/experiments/columbia_card_task_cold/images/chosen.png';
	document.getElementById("c10").src =
		'/static/experiments/columbia_card_task_cold/images/chosen.png';
	document.getElementById("c11").src =
		'/static/experiments/columbia_card_task_cold/images/chosen.png';
	document.getElementById("c12").src =
		'/static/experiments/columbia_card_task_cold/images/chosen.png';
	document.getElementById("c19").src =
		'/static/experiments/columbia_card_task_cold/images/chosen.png';
	document.getElementById("c14").src =
		'/static/experiments/columbia_card_task_cold/images/chosen.png';
	document.getElementById("c15").src =
		'/static/experiments/columbia_card_task_cold/images/chosen.png';
	document.getElementById("c16").src =
		'/static/experiments/columbia_card_task_cold/images/chosen.png';
	document.getElementById("c17").src =
		'/static/experiments/columbia_card_task_cold/images/chosen.png';
	document.getElementById("c18").src =
		'/static/experiments/columbia_card_task_cold/images/chosen.png';
	document.getElementById("c20").src =
		'/static/experiments/columbia_card_task_cold/images/chosen.png';
	document.getElementById("c21").src =
		'/static/experiments/columbia_card_task_cold/images/chosen.png';
	document.getElementById("c22").src =
		'/static/experiments/columbia_card_task_cold/images/chosen.png';
	document.getElementById("c23").src =
		'/static/experiments/columbia_card_task_cold/images/chosen.png';
	document.getElementById("c24").src =
		'/static/experiments/columbia_card_task_cold/images/chosen.png';
	document.getElementById("c25").src =
		'/static/experiments/columbia_card_task_cold/images/chosen.png';
	document.getElementById("c26").src =
		'/static/experiments/columbia_card_task_cold/images/chosen.png';
	document.getElementById("c27").src =
		'/static/experiments/columbia_card_task_cold/images/chosen.png';
	document.getElementById("c28").src =
		'/static/experiments/columbia_card_task_cold/images/chosen.png';
	document.getElementById("c29").src =
		'/static/experiments/columbia_card_task_cold/images/chosen.png';
	document.getElementById("c31").src =
		'/static/experiments/columbia_card_task_cold/images/chosen.png';
	document.getElementById("c32").src =
		'/static/experiments/columbia_card_task_cold/images/chosen.png';
}

/* ************************************ */
/* Define experimental variables */
/* ************************************ */
// generic task variables
var sumInstructTime = 0 //ms
var instructTimeThresh = 5 ///in seconds

// task specific variables
var e = ""
var numRounds = 27
var whichRound = 0
var roundPoints = 0
var totPoints = 0
var roundOver = 0
var roundPointsArray = []
var practiceSetup =
	'<div class = centerbox-CCT3><p class = block-text><div id = instruct1><strong>Practice 1: </strong> In the version of the card game you are about to play, you will not turn the cards over one by one.  Rather, you will simply choose the total number of cards you would like to turn over (from 0 to 32) and then continue to the next round.  If turning over any cards seems too risky to you can click the zero button, in which case your score for this round will automatically be zero.' +
	'<br><br> This is a practice round, and it looks just like the game you will play.  Please select the number of cards you would like to turn over, given the number of loss cards and the amount that you can gain or lose if you turn over a gain or loss card, as shown below.  Please note: The computer will tell you how well you did after all 27 game rounds are over!</div>' +
	"<div class = instructBox><div><strong>How many cards do you want to take?</strong></div></div>" +
	"<div class = instructBoxRight><div>Current Round:  0</div></div>" +
	"<div class = instructBoxLeft><div>Game Round: 1</div></div>" +
	"<div class = instructBoxLeft1><div>Loss Amount: 750</div></div>" +
	"<div class = instructBoxRight1><div># of Loss Cards: 1</div></div>" +
	"<div class = instructBoxMiddle1><div>Gain Amount: 10</div></div>" +

	"<div class = buttonbox3><button type='button' class = select-button2 id = 1 onclick = chooseButton(this.id)>1</button>" +
	"<button type='button' class = select-button2 id = 2 onclick = chooseButton1(this.id)>2</button>" +
	"<button type='button' class = select-button2 id = 3 onclick = chooseButton1(this.id)>3</button>" +
	"<button type='button' class = select-button2 id = 4 onclick = chooseButton1(this.id)>4</button>" +
	"<button type='button' class = select-button2 id = 5 onclick = chooseButton1(this.id)>5</button>" +
	"<button type='button' class = select-button2 id = 6 onclick = chooseButton1(this.id)>6</button>" +
	"<button type='button' class = select-button2 id = 7 onclick = chooseButton1(this.id)>7</button>" +
	"<button type='button' class = select-button2 id = 8 onclick = chooseButton1(this.id)>8</button>" +
	"<button type='button' class = select-button2 id = 9 onclick = chooseButton1(this.id)>9</button>" +
	"<button type='button' class = select-button2 id = 10  onclick = chooseButton1(this.id)>10</button>" +
	"<button type='button' class = select-button2 id = 11  onclick = chooseButton1(this.id)>11</button>" +
	"<button type='button' class = select-button2 id = 12  onclick = chooseButton1(this.id)>12</button>" +
	"<button type='button' class = select-button2 id = 13  onclick = chooseButton1(this.id)>13</button>" +
	"<button type='button' class = select-button2 id = 14  onclick = chooseButton1(this.id)>14</button>" +
	"<button type='button' class = select-button2 id = 15  onclick = chooseButton1(this.id)>15</button>" +
	"<button type='button' class = select-button2 id = 16  onclick = chooseButton1(this.id)>16</button>" +
	"<button type='button' class = select-button2 id = 17  onclick = chooseButton1(this.id)>17</button>" +
	"<button type='button' class = select-button2 id = 18  onclick = chooseButton1(this.id)>18</button>" +
	"<button type='button' class = select-button2 id = 19  onclick = chooseButton1(this.id)>19</button>" +
	"<button type='button' class = select-button2 id = 20  onclick = chooseButton1(this.id)>20</button>" +
	"<button type='button' class = select-button2 id = 21  onclick = chooseButton1(this.id)>21</button>" +
	"<button type='button' class = select-button2 id = 22  onclick = chooseButton1(this.id)>22</button>" +
	"<button type='button' class = select-button2 id = 23  onclick = chooseButton1(this.id)>23</button>" +
	"<button type='button' class = select-button2 id = 24  onclick = chooseButton1(this.id)>24</button>" +
	"<button type='button' class = select-button2 id = 25  onclick = chooseButton1(this.id)>25</button>" +
	"<button type='button' class = select-button2 id = 26  onclick = chooseButton1(this.id)>26</button>" +
	"<button type='button' class = select-button2 id = 27  onclick = chooseButton1(this.id)>27</button>" +
	"<button type='button' class = select-button2 id = 28  onclick = chooseButton1(this.id)>28</button>" +
	"<button type='button' class = select-button2 id = 29  onclick = chooseButton1(this.id)>29</button>" +
	"<button type='button' class = select-button2 id = 30  onclick = chooseButton1(this.id)>30</button>" +
	"<button type='button' class = select-button2 id = 31  onclick = chooseButton1(this.id)>31</button>" +
	"<button type='button' class = select-button2 id = 32  onclick = chooseButton1(this.id)>32</button></div>" +

	"<div class = numbox3><div class = square2><input type='image' id = 'c1' src='/static/experiments/columbia_card_task_cold/images/beforeChosen.png'></div>" +
	"<div class = square2><input type='image' id = 'c5' src='/static/experiments/columbia_card_task_cold/images/beforeChosen.png'></div>" +
	"<div class = square2><input type='image' id = 'c9' src='/static/experiments/columbia_card_task_cold/images/beforeChosen.png'></div>" +
	"<div class = square2><input type='image' id = 'c13' src='/static/experiments/columbia_card_task_cold/images/beforeChosen.png'></div>" +
	"<div class = square2><input type='image' id = 'c17' src='/static/experiments/columbia_card_task_cold/images/beforeChosen.png'></div>" +
	"<div class = square2><input type='image' id = 'c21' src='/static/experiments/columbia_card_task_cold/images/beforeChosen.png'></div>" +
	"<div class = square2><input type='image' id = 'c25' src='/static/experiments/columbia_card_task_cold/images/beforeChosen.png'></div>" +
	"<div class = square2><input type='image' id = 'c29' src='/static/experiments/columbia_card_task_cold/images/beforeChosen.png'></div>" +

	"<div class = square2><input type='image' id = 'c2' src='/static/experiments/columbia_card_task_cold/images/beforeChosen.png'></div>" +
	"<div class = square2><input type='image' id = 'c6' src='/static/experiments/columbia_card_task_cold/images/beforeChosen.png'></div>" +
	"<div class = square2><input type='image' id = 'c10' src='/static/experiments/columbia_card_task_cold/images/beforeChosen.png'></div>" +
	"<div class = square2><input type='image' id = 'c14' src='/static/experiments/columbia_card_task_cold/images/beforeChosen.png'></div>" +
	"<div class = square2><input type='image' id = 'c18' src='/static/experiments/columbia_card_task_cold/images/beforeChosen.png'></div>" +
	"<div class = square2><input type='image' id = 'c22' src='/static/experiments/columbia_card_task_cold/images/beforeChosen.png'></div>" +
	"<div class = square2><input type='image' id = 'c26' src='/static/experiments/columbia_card_task_cold/images/beforeChosen.png'></div>" +
	"<div class = square2><input type='image' id = 'c30' src='/static/experiments/columbia_card_task_cold/images/beforeChosen.png'></div>" +

	"<div class = square2><input type='image' id = 'c3' src='/static/experiments/columbia_card_task_cold/images/beforeChosen.png'></div>" +
	"<div class = square2><input type='image' id = 'c7' src='/static/experiments/columbia_card_task_cold/images/beforeChosen.png'></div>" +
	"<div class = square2><input type='image' id = 'c11' src='/static/experiments/columbia_card_task_cold/images/beforeChosen.png'></div>" +
	"<div class = square2><input type='image' id = 'c15' src='/static/experiments/columbia_card_task_cold/images/beforeChosen.png'></div>" +
	"<div class = square2><input type='image' id = 'c19' src='/static/experiments/columbia_card_task_cold/images/beforeChosen.png'></div>" +
	"<div class = square2><input type='image' id = 'c23' src='/static/experiments/columbia_card_task_cold/images/beforeChosen.png'></div>" +
	"<div class = square2><input type='image' id = 'c27' src='/static/experiments/columbia_card_task_cold/images/beforeChosen.png'></div>" +
	"<div class = square2><input type='image' id = 'c31' src='/static/experiments/columbia_card_task_cold/images/beforeChosen.png'></div>" +

	"<div class = square2><input type='image' id = 'c4' src='/static/experiments/columbia_card_task_cold/images/beforeChosen.png'></div>" +
	"<div class = square2><input type='image' id = 'c8' src='/static/experiments/columbia_card_task_cold/images/beforeChosen.png'></div>" +
	"<div class = square2><input type='image' id = 'c12' src='/static/experiments/columbia_card_task_cold/images/beforeChosen.png'></div>" +
	"<div class = square2><input type='image' id = 'c16' src='/static/experiments/columbia_card_task_cold/images/beforeChosen.png'></div>" +
	"<div class = square2><input type='image' id = 'c20' src='/static/experiments/columbia_card_task_cold/images/beforeChosen.png'></div>" +
	"<div class = square2><input type='image' id = 'c24' src='/static/experiments/columbia_card_task_cold/images/beforeChosen.png'></div>" +
	"<div class = square2><input type='image' id = 'c28' src='/static/experiments/columbia_card_task_cold/images/beforeChosen.png'></div>" +
	"<div class = square2><input type='image' id = 'c32' src='/static/experiments/columbia_card_task_cold/images/beforeChosen.png'></div></div>" +
	'</p></div>'


var practiceSetup2 =
	'<div class = centerbox-CCT3><p class = block-text><div id = instruct1><strong>Practice 2: </strong> The computer will record your Point Total for each round and will show you those totals after you finish all 24 rounds of the game.' +
	'<br><br> This is the second practice round. Please again select as many cards as you would like to, give the number of loss cards and the amounts that you can win or lose if you turn over a gain or loss card, as shown below.</div>' +
	"<div class = instructBox><div><strong>How many cards do you want to take?</strong></div></div>" +
	"<div class = instructBoxRight><div>Current Round:  0</div></div>" +
	"<div class = instructBoxLeft><div>Game Round: 1</div></div>" +
	"<div class = instructBoxLeft1><div>Loss Amount: 750</div></div>" +
	"<div class = instructBoxRight1><div># of Loss Cards: 1</div></div>" +
	"<div class = instructBoxMiddle1><div>Gain Amount: 10</div></div>" +

	"<div class = buttonbox3><button type='button' class = select-button2 id = 1 onclick = chooseButton(this.id)>1</button>" +
	"<button type='button' class = select-button2 id = 2 onclick = chooseButton1(this.id)>2</button>" +
	"<button type='button' class = select-button2 id = 3 onclick = chooseButton1(this.id)>3</button>" +
	"<button type='button' class = select-button2 id = 4 onclick = chooseButton1(this.id)>4</button>" +
	"<button type='button' class = select-button2 id = 5 onclick = chooseButton1(this.id)>5</button>" +
	"<button type='button' class = select-button2 id = 6 onclick = chooseButton1(this.id)>6</button>" +
	"<button type='button' class = select-button2 id = 7 onclick = chooseButton1(this.id)>7</button>" +
	"<button type='button' class = select-button2 id = 8 onclick = chooseButton1(this.id)>8</button>" +
	"<button type='button' class = select-button2 id = 9 onclick = chooseButton1(this.id)>9</button>" +
	"<button type='button' class = select-button2 id = 10  onclick = chooseButton1(this.id)>10</button>" +
	"<button type='button' class = select-button2 id = 11  onclick = chooseButton1(this.id)>11</button>" +
	"<button type='button' class = select-button2 id = 12  onclick = chooseButton1(this.id)>12</button>" +
	"<button type='button' class = select-button2 id = 13  onclick = chooseButton1(this.id)>13</button>" +
	"<button type='button' class = select-button2 id = 14  onclick = chooseButton1(this.id)>14</button>" +
	"<button type='button' class = select-button2 id = 15  onclick = chooseButton1(this.id)>15</button>" +
	"<button type='button' class = select-button2 id = 16  onclick = chooseButton1(this.id)>16</button>" +
	"<button type='button' class = select-button2 id = 17  onclick = chooseButton1(this.id)>17</button>" +
	"<button type='button' class = select-button2 id = 18  onclick = chooseButton1(this.id)>18</button>" +
	"<button type='button' class = select-button2 id = 19  onclick = chooseButton1(this.id)>19</button>" +
	"<button type='button' class = select-button2 id = 20  onclick = chooseButton1(this.id)>20</button>" +
	"<button type='button' class = select-button2 id = 21  onclick = chooseButton1(this.id)>21</button>" +
	"<button type='button' class = select-button2 id = 22  onclick = chooseButton1(this.id)>22</button>" +
	"<button type='button' class = select-button2 id = 23  onclick = chooseButton1(this.id)>23</button>" +
	"<button type='button' class = select-button2 id = 24  onclick = chooseButton1(this.id)>24</button>" +
	"<button type='button' class = select-button2 id = 25  onclick = chooseButton1(this.id)>25</button>" +
	"<button type='button' class = select-button2 id = 26  onclick = chooseButton1(this.id)>26</button>" +
	"<button type='button' class = select-button2 id = 27  onclick = chooseButton1(this.id)>27</button>" +
	"<button type='button' class = select-button2 id = 28  onclick = chooseButton1(this.id)>28</button>" +
	"<button type='button' class = select-button2 id = 29  onclick = chooseButton1(this.id)>29</button>" +
	"<button type='button' class = select-button2 id = 30  onclick = chooseButton1(this.id)>30</button>" +
	"<button type='button' class = select-button2 id = 31  onclick = chooseButton1(this.id)>31</button>" +
	"<button type='button' class = select-button2 id = 32  onclick = chooseButton1(this.id)>32</button></div>" +

	"<div class = numbox3><div class = square2><input type='image' id = 'c1' src='/static/experiments/columbia_card_task_cold/images/beforeChosen.png'></div>" +
	"<div class = square2><input type='image' id = 'c5' src='/static/experiments/columbia_card_task_cold/images/beforeChosen.png'></div>" +
	"<div class = square2><input type='image' id = 'c9' src='/static/experiments/columbia_card_task_cold/images/beforeChosen.png'></div>" +
	"<div class = square2><input type='image' id = 'c13' src='/static/experiments/columbia_card_task_cold/images/beforeChosen.png'></div>" +
	"<div class = square2><input type='image' id = 'c17' src='/static/experiments/columbia_card_task_cold/images/beforeChosen.png'></div>" +
	"<div class = square2><input type='image' id = 'c21' src='/static/experiments/columbia_card_task_cold/images/beforeChosen.png'></div>" +
	"<div class = square2><input type='image' id = 'c25' src='/static/experiments/columbia_card_task_cold/images/beforeChosen.png'></div>" +
	"<div class = square2><input type='image' id = 'c29' src='/static/experiments/columbia_card_task_cold/images/beforeChosen.png'></div>" +

	"<div class = square2><input type='image' id = 'c2' src='/static/experiments/columbia_card_task_cold/images/beforeChosen.png'></div>" +
	"<div class = square2><input type='image' id = 'c6' src='/static/experiments/columbia_card_task_cold/images/beforeChosen.png'></div>" +
	"<div class = square2><input type='image' id = 'c10' src='/static/experiments/columbia_card_task_cold/images/beforeChosen.png'></div>" +
	"<div class = square2><input type='image' id = 'c14' src='/static/experiments/columbia_card_task_cold/images/beforeChosen.png'></div>" +
	"<div class = square2><input type='image' id = 'c18' src='/static/experiments/columbia_card_task_cold/images/beforeChosen.png'></div>" +
	"<div class = square2><input type='image' id = 'c22' src='/static/experiments/columbia_card_task_cold/images/beforeChosen.png'></div>" +
	"<div class = square2><input type='image' id = 'c26' src='/static/experiments/columbia_card_task_cold/images/beforeChosen.png'></div>" +
	"<div class = square2><input type='image' id = 'c30' src='/static/experiments/columbia_card_task_cold/images/beforeChosen.png'></div>" +

	"<div class = square2><input type='image' id = 'c3' src='/static/experiments/columbia_card_task_cold/images/beforeChosen.png'></div>" +
	"<div class = square2><input type='image' id = 'c7' src='/static/experiments/columbia_card_task_cold/images/beforeChosen.png'></div>" +
	"<div class = square2><input type='image' id = 'c11' src='/static/experiments/columbia_card_task_cold/images/beforeChosen.png'></div>" +
	"<div class = square2><input type='image' id = 'c15' src='/static/experiments/columbia_card_task_cold/images/beforeChosen.png'></div>" +
	"<div class = square2><input type='image' id = 'c19' src='/static/experiments/columbia_card_task_cold/images/beforeChosen.png'></div>" +
	"<div class = square2><input type='image' id = 'c23' src='/static/experiments/columbia_card_task_cold/images/beforeChosen.png'></div>" +
	"<div class = square2><input type='image' id = 'c27' src='/static/experiments/columbia_card_task_cold/images/beforeChosen.png'></div>" +
	"<div class = square2><input type='image' id = 'c31' src='/static/experiments/columbia_card_task_cold/images/beforeChosen.png'></div>" +

	"<div class = square2><input type='image' id = 'c4' src='/static/experiments/columbia_card_task_cold/images/beforeChosen.png'></div>" +
	"<div class = square2><input type='image' id = 'c8' src='/static/experiments/columbia_card_task_cold/images/beforeChosen.png'></div>" +
	"<div class = square2><input type='image' id = 'c12' src='/static/experiments/columbia_card_task_cold/images/beforeChosen.png'></div>" +
	"<div class = square2><input type='image' id = 'c16' src='/static/experiments/columbia_card_task_cold/images/beforeChosen.png'></div>" +
	"<div class = square2><input type='image' id = 'c20' src='/static/experiments/columbia_card_task_cold/images/beforeChosen.png'></div>" +
	"<div class = square2><input type='image' id = 'c24' src='/static/experiments/columbia_card_task_cold/images/beforeChosen.png'></div>" +
	"<div class = square2><input type='image' id = 'c28' src='/static/experiments/columbia_card_task_cold/images/beforeChosen.png'></div>" +
	"<div class = square2><input type='image' id = 'c32' src='/static/experiments/columbia_card_task_cold/images/beforeChosen.png'></div></div>" +
	'</p></div>'

// this params array is organized such that the 0 index = the number of loss cards in round, the 1 index = the gain amount of each happy card, and the 2nd index = the loss amount when you turn over a sad face
var paramsArray = [
	[1, 10, 250],
	[1, 10, 500],
	[1, 10, 750],
	[1, 20, 250],
	[1, 20, 500],
	[1, 20, 750],
	[1, 30, 250],
	[1, 30, 500],
	[1, 30, 750],
	[2, 10, 250],
	[2, 10, 500],
	[2, 10, 750],
	[2, 20, 250],
	[2, 20, 500],
	[2, 20, 750],
	[2, 30, 250],
	[2, 30, 500],
	[2, 30, 750],
	[3, 10, 250],
	[3, 10, 500],
	[3, 10, 750],
	[3, 20, 250],
	[3, 20, 500],
	[3, 20, 750],
	[3, 30, 250],
	[3, 30, 500],
	[3, 30, 750]
]
var cardArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23,
	24, 25, 26, 27, 28, 29, 30, 31, 32
]
var shuffledCardArray = jsPsych.randomization.repeat(cardArray, 1)
var shuffledParamsArray = jsPsych.randomization.repeat(paramsArray, 1)



var gameSetup =
	"<div class = titlebox><div class = center-text><strong>How many cards do you want to take?</strong></div></div>" +
	"<div class = titleboxRight><div id = current_round class = center-text>Current Round:  </div></div>" +
	"<div class = titleboxLeft><div id = game_round class = center-text>Game Round: </div></div>" +
	"<div class = titleboxLeft1><div id= loss_amount class = center-text>Loss Amount: </div></div>" +
	"<div class = titleboxRight1><div id = num_loss_cards class = center-text># of Loss Cards: </div></div>" +
	"<div class = titleboxMiddle1><div id = gain_amount class = center-text>Gain Amount: </div></div>" +

	"<div class = buttonbox2><button type='button' class = select-button2 id = 1 onclick = chooseButton(this.id)>1</button>" +
	"<button type='button' class = select-button2 id = 2 onclick = chooseButton(this.id)>2</button>" +
	"<button type='button' class = select-button2 id = 3 onclick = chooseButton(this.id)>3</button>" +
	"<button type='button' class = select-button2 id = 4 onclick = chooseButton(this.id)>4</button>" +
	"<button type='button' class = select-button2 id = 5 onclick = chooseButton(this.id)>5</button>" +
	"<button type='button' class = select-button2 id = 6 onclick = chooseButton(this.id)>6</button>" +
	"<button type='button' class = select-button2 id = 7 onclick = chooseButton(this.id)>7</button>" +
	"<button type='button' class = select-button2 id = 8 onclick = chooseButton(this.id)>8</button>" +
	"<button type='button' class = select-button2 id = 9 onclick = chooseButton(this.id)>9</button>" +
	"<button type='button' class = select-button2 id = 10  onclick = chooseButton(this.id)>10</button>" +
	"<button type='button' class = select-button2 id = 11  onclick = chooseButton(this.id)>11</button>" +
	"<button type='button' class = select-button2 id = 12  onclick = chooseButton(this.id)>12</button>" +
	"<button type='button' class = select-button2 id = 13  onclick = chooseButton(this.id)>13</button>" +
	"<button type='button' class = select-button2 id = 14  onclick = chooseButton(this.id)>14</button>" +
	"<button type='button' class = select-button2 id = 15  onclick = chooseButton(this.id)>15</button>" +
	"<button type='button' class = select-button2 id = 16  onclick = chooseButton(this.id)>16</button>" +
	"<button type='button' class = select-button2 id = 17  onclick = chooseButton(this.id)>17</button>" +
	"<button type='button' class = select-button2 id = 18  onclick = chooseButton(this.id)>18</button>" +
	"<button type='button' class = select-button2 id = 19  onclick = chooseButton(this.id)>19</button>" +
	"<button type='button' class = select-button2 id = 20  onclick = chooseButton(this.id)>20</button>" +
	"<button type='button' class = select-button2 id = 21  onclick = chooseButton(this.id)>21</button>" +
	"<button type='button' class = select-button2 id = 22  onclick = chooseButton(this.id)>22</button>" +
	"<button type='button' class = select-button2 id = 23  onclick = chooseButton(this.id)>23</button>" +
	"<button type='button' class = select-button2 id = 24  onclick = chooseButton(this.id)>24</button>" +
	"<button type='button' class = select-button2 id = 25  onclick = chooseButton(this.id)>25</button>" +
	"<button type='button' class = select-button2 id = 26  onclick = chooseButton(this.id)>26</button>" +
	"<button type='button' class = select-button2 id = 27  onclick = chooseButton(this.id)>27</button>" +
	"<button type='button' class = select-button2 id = 28  onclick = chooseButton(this.id)>28</button>" +
	"<button type='button' class = select-button2 id = 29  onclick = chooseButton(this.id)>29</button>" +
	"<button type='button' class = select-button2 id = 30  onclick = chooseButton(this.id)>30</button>" +
	"<button type='button' class = select-button2 id = 31  onclick = chooseButton(this.id)>31</button>" +
	"<button type='button' class = select-button2 id = 32  onclick = chooseButton(this.id)>32</button></div>" +



	"<div class = numbox><div class = square><input type='image' id = 'c1' src='/static/experiments/columbia_card_task_cold/images/beforeChosen.png'></div>" +
	"<div class = square><input type='image' id = 'c5' src='/static/experiments/columbia_card_task_cold/images/beforeChosen.png'></div>" +
	"<div class = square><input type='image' id = 'c9' src='/static/experiments/columbia_card_task_cold/images/beforeChosen.png'></div>" +
	"<div class = square><input type='image' id = 'c13' src='/static/experiments/columbia_card_task_cold/images/beforeChosen.png'></div>" +
	"<div class = square><input type='image' id = 'c17' src='/static/experiments/columbia_card_task_cold/images/beforeChosen.png'></div>" +
	"<div class = square><input type='image' id = 'c21' src='/static/experiments/columbia_card_task_cold/images/beforeChosen.png'></div>" +
	"<div class = square><input type='image' id = 'c25' src='/static/experiments/columbia_card_task_cold/images/beforeChosen.png'></div>" +
	"<div class = square><input type='image' id = 'c29' src='/static/experiments/columbia_card_task_cold/images/beforeChosen.png'></div>" +

	"<div class = square><input type='image' id = 'c2' src='/static/experiments/columbia_card_task_cold/images/beforeChosen.png'></div>" +
	"<div class = square><input type='image' id = 'c6' src='/static/experiments/columbia_card_task_cold/images/beforeChosen.png'></div>" +
	"<div class = square><input type='image' id = 'c10' src='/static/experiments/columbia_card_task_cold/images/beforeChosen.png'></div>" +
	"<div class = square><input type='image' id = 'c14' src='/static/experiments/columbia_card_task_cold/images/beforeChosen.png'></div>" +
	"<div class = square><input type='image' id = 'c18' src='/static/experiments/columbia_card_task_cold/images/beforeChosen.png'></div>" +
	"<div class = square><input type='image' id = 'c22' src='/static/experiments/columbia_card_task_cold/images/beforeChosen.png'></div>" +
	"<div class = square><input type='image' id = 'c26' src='/static/experiments/columbia_card_task_cold/images/beforeChosen.png'></div>" +
	"<div class = square><input type='image' id = 'c30' src='/static/experiments/columbia_card_task_cold/images/beforeChosen.png'></div>" +

	"<div class = square><input type='image' id = 'c3' src='/static/experiments/columbia_card_task_cold/images/beforeChosen.png'></div>" +
	"<div class = square><input type='image' id = 'c7' src='/static/experiments/columbia_card_task_cold/images/beforeChosen.png'></div>" +
	"<div class = square><input type='image' id = 'c11' src='/static/experiments/columbia_card_task_cold/images/beforeChosen.png'></div>" +
	"<div class = square><input type='image' id = 'c15' src='/static/experiments/columbia_card_task_cold/images/beforeChosen.png'></div>" +
	"<div class = square><input type='image' id = 'c19' src='/static/experiments/columbia_card_task_cold/images/beforeChosen.png'></div>" +
	"<div class = square><input type='image' id = 'c23' src='/static/experiments/columbia_card_task_cold/images/beforeChosen.png'></div>" +
	"<div class = square><input type='image' id = 'c27' src='/static/experiments/columbia_card_task_cold/images/beforeChosen.png'></div>" +
	"<div class = square><input type='image' id = 'c31' src='/static/experiments/columbia_card_task_cold/images/beforeChosen.png'></div>" +

	"<div class = square><input type='image' id = 'c4' src='/static/experiments/columbia_card_task_cold/images/beforeChosen.png'></div>" +
	"<div class = square><input type='image' id = 'c8' src='/static/experiments/columbia_card_task_cold/images/beforeChosen.png'></div>" +
	"<div class = square><input type='image' id = 'c12' src='/static/experiments/columbia_card_task_cold/images/beforeChosen.png'></div>" +
	"<div class = square><input type='image' id = 'c16' src='/static/experiments/columbia_card_task_cold/images/beforeChosen.png'></div>" +
	"<div class = square><input type='image' id = 'c20' src='/static/experiments/columbia_card_task_cold/images/beforeChosen.png'></div>" +
	"<div class = square><input type='image' id = 'c24' src='/static/experiments/columbia_card_task_cold/images/beforeChosen.png'></div>" +
	"<div class = square><input type='image' id = 'c28' src='/static/experiments/columbia_card_task_cold/images/beforeChosen.png'></div>" +
	"<div class = square><input type='image' id = 'c32' src='/static/experiments/columbia_card_task_cold/images/beforeChosen.png'></div></div>"


/* ************************************ */
/* Set up jsPsych blocks */
/* ************************************ */
/* define static blocks */
var welcome_block = {
	type: 'poldrack-text',
	data: {
		exp_id: "columbia_card_task_cold",
		trial_id: 'welcome'
	},
	text: "<div class = titlebox><div class = center-text><strong>Welcome to the Columbia Card Task--Cold Version</strong></div></div>",
	cont_key: [13],
	timing_post_trial: 0
};

var feedback_instruct_text =
	'Starting with instructions.  Press <strong> Enter </strong> to continue.'
var feedback_instruct_block = {
	type: 'poldrack-text',
	cont_key: [13],
	data: {
		exp_id: "columbia_card_task_cold",
		trial_id: 'instruction'
	},
	text: getInstructFeedback,
	timing_post_trial: 0,
	timing_response: 180000
};
/// This ensures that the subject does not read through the instructions too quickly.  If they do it too quickly, then we will go over the loop again.
var instruction_trials = []
var instructions_block = {
	type: 'poldrack-instructions',
	data: {
		exp_id: "columbia_card_task_cold",
		trial_id: 'instruction'
	},
	pages: [
		'<div class = centerbox><p class = block-text><strong>Introduction and Explanation</strong>' +
		'<p>-You are now going to participate in a card game.  in this game, you will turn over cards to win or lose points which are worth money.</p>' +
		'<p>-In each game round, you will see 32 cards on the computer screen, face down. You will decide how many of these cards to turn over. Each card is either a gain card or a loss card (there are no neutral cards). You will know how many gain cards and loss cards are in the deck of 32, and how many points you will gain or lose if you turn over a gain or loss card. What you do not know is which of the 32 cards that you see face-down are gain cards and which are loss cards. </p>' +
		'<p>-You indicate the number of cards (from 0 to 32) you want to turn over by clicking on a small button. Then, cards are randomly chosen to be turned over, one at a time. For each gain card turned over, points are added to your round total and another card is turned over. This continues until a loss card is uncovered or until the number of cards you chose to turn over is reached. The first time a loss card is turned over, the loss points will be subtracted from your current point total and the round is over – even if you indicated that more cards should be turned over. The accumulated total will be your number of points for that round, and you go on to the next round. Each new round starts with a score of 0 points; that means you play each round independently of the other rounds.</p>' +
		'<p>-You will play a total of 27 rounds, three of which will be randomly selected at the end of the session, and you will be paid out for those in real money. Each point is worth 1 cent.</p>' +
		'<p>-This game is for real money and requires some concentration. Please minimize distractions in your environment and close any other programs running in the background. </p></p></div>',

		'<div class = centerbox><p class = block-text><strong>Unknown Cards:</strong>' +
		'<p> This is what unknown cards looks like.  Turn it over by clicking on it.</p>' +
		"<p><input type='image' id = '133' src='/static/experiments/columbia_card_task_cold/images/beforeChosen.png' onclick = instructButton(this.id)>" +
		'<p> An unknown card.  Click on it to turn it over!</p>' +
		'</p></div>',

		'<div class = centerbox><p class = block-text>' +
		'<p><strong>The Gain Card:</strong></p>' +
		'<p>For every gain card you turn over, your score increases by either 10, 20, or 30 points in different rounds.</p>' +
		"<p><input type='image' src='/static/experiments/columbia_card_task_cold/images/chosen.png'>" +
		'<p><strong>The Loss Card:</strong></p>' +
		"<p><input type='image' src='/static/experiments/columbia_card_task_cold/images/loss.png'></p>" +
		'<p>For every loss card you turn over, your score decreases by either 250,500, or 750 points in different rounds. Furthermore, the round immediately ends (you cannot turn over any more cards). There will be either 1,2, or 3 loss cards in any given round.</p>' +
		'<p>The number of loss cards and the value of points that can be won or lost by turning over a gain or loss card are fixed in each round. This information will always be on display so you know what kind of round you are in.</p>' +
		'</p></div>',

		"<button type='button' class = instructButton onclick= instructFunction()>See Result</button>" +
		'<div class = centerbox-CCT><p class = block-text><div id = instruct1><strong>Example 1: </strong>In the example below, you see 32 unknown cards. The display shows you that 1 of these cards is a loss card. It also tells you that turning over each gain card is worth 10 points to you, and that turning over the loss card will cost you 750 points. Let us suppose you decided to turn over 7 cards and then decided to stop. Please click the "See Result" button to see what happens: </div>' +
		"<div class = instructBox><div><strong>How many cards do you want to take?</strong></div></div>" +
		"<div class = instructBoxRight><div>Current Round:  0</div></div>" +
		"<div class = instructBoxLeft><div>Game Round: 1</div></div>" +
		"<div class = instructBoxLeft1><div>Loss Amount: 750</div></div>" +
		"<div class = instructBoxRight1><div># of Loss Cards: 1</div></div>" +
		"<div class = instructBoxMiddle1><div>Gain Amount: 10</div></div>" +


		"<div class = numbox2><div class = square2><input type='image' id = 'c1' src='/static/experiments/columbia_card_task_cold/images/beforeChosen.png'></div>" +
		"<div class = square2><input type='image' id = 'c5' src='/static/experiments/columbia_card_task_cold/images/beforeChosen.png'></div>" +
		"<div class = square2><input type='image' id = 'c9' src='/static/experiments/columbia_card_task_cold/images/beforeChosen.png'></div>" +
		"<div class = square2><input type='image' id = 'c13' src='/static/experiments/columbia_card_task_cold/images/beforeChosen.png'></div>" +
		"<div class = square2><input type='image' id = 'c17' src='/static/experiments/columbia_card_task_cold/images/beforeChosen.png'></div>" +
		"<div class = square2><input type='image' id = 'c21' src='/static/experiments/columbia_card_task_cold/images/beforeChosen.png'></div>" +
		"<div class = square2><input type='image' id = 'c25' src='/static/experiments/columbia_card_task_cold/images/beforeChosen.png'></div>" +
		"<div class = square2><input type='image' id = 'c29' src='/static/experiments/columbia_card_task_cold/images/beforeChosen.png'></div>" +

		"<div class = square2><input type='image' id = 'c2' src='/static/experiments/columbia_card_task_cold/images/beforeChosen.png'></div>" +
		"<div class = square2><input type='image' id = 'c6' src='/static/experiments/columbia_card_task_cold/images/beforeChosen.png'></div>" +
		"<div class = square2><input type='image' id = 'c10' src='/static/experiments/columbia_card_task_cold/images/beforeChosen.png'></div>" +
		"<div class = square2><input type='image' id = 'c14' src='/static/experiments/columbia_card_task_cold/images/beforeChosen.png'></div>" +
		"<div class = square2><input type='image' id = 'c18' src='/static/experiments/columbia_card_task_cold/images/beforeChosen.png'></div>" +
		"<div class = square2><input type='image' id = 'c22' src='/static/experiments/columbia_card_task_cold/images/beforeChosen.png'></div>" +
		"<div class = square2><input type='image' id = 'c26' src='/static/experiments/columbia_card_task_cold/images/beforeChosen.png'></div>" +
		"<div class = square2><input type='image' id = 'c30' src='/static/experiments/columbia_card_task_cold/images/beforeChosen.png'></div>" +

		"<div class = square2><input type='image' id = 'c3' src='/static/experiments/columbia_card_task_cold/images/beforeChosen.png'></div>" +
		"<div class = square2><input type='image' id = 'c7' src='/static/experiments/columbia_card_task_cold/images/beforeChosen.png'></div>" +
		"<div class = square2><input type='image' id = 'c11' src='/static/experiments/columbia_card_task_cold/images/beforeChosen.png'></div>" +
		"<div class = square2><input type='image' id = 'c15' src='/static/experiments/columbia_card_task_cold/images/beforeChosen.png'></div>" +
		"<div class = square2><input type='image' id = 'c19' src='/static/experiments/columbia_card_task_cold/images/beforeChosen.png'></div>" +
		"<div class = square2><input type='image' id = 'c23' src='/static/experiments/columbia_card_task_cold/images/beforeChosen.png'></div>" +
		"<div class = square2><input type='image' id = 'c27' src='/static/experiments/columbia_card_task_cold/images/beforeChosen.png'></div>" +
		"<div class = square2><input type='image' id = 'c31' src='/static/experiments/columbia_card_task_cold/images/beforeChosen.png'></div>" +

		"<div class = square2><input type='image' id = 'c4' src='/static/experiments/columbia_card_task_cold/images/beforeChosen.png'></div>" +
		"<div class = square2><input type='image' id = 'c8' src='/static/experiments/columbia_card_task_cold/images/beforeChosen.png'></div>" +
		"<div class = square2><input type='image' id = 'c12' src='/static/experiments/columbia_card_task_cold/images/beforeChosen.png'></div>" +
		"<div class = square2><input type='image' id = 'c16' src='/static/experiments/columbia_card_task_cold/images/beforeChosen.png'></div>" +
		"<div class = square2><input type='image' id = 'c20' src='/static/experiments/columbia_card_task_cold/images/beforeChosen.png'></div>" +
		"<div class = square2><input type='image' id = 'c24' src='/static/experiments/columbia_card_task_cold/images/beforeChosen.png'></div>" +
		"<div class = square2><input type='image' id = 'c28' src='/static/experiments/columbia_card_task_cold/images/beforeChosen.png'></div>" +
		"<div class = square2><input type='image' id = 'c32' src='/static/experiments/columbia_card_task_cold/images/beforeChosen.png'></div></div>" +
		'</p></div>',

		"<button type='button' class = instructButton onclick= instructFunction2()>See Result</button>" +
		'<div class = centerbox-CCT><p class = block-text><div id = instruct2><strong>Example 2: </strong>In the example below, you see 32 unknown cards. The display shows you that 3 of these cards is a loss card. It also tells you that turning over each gain card is worth 30 points to you, and that turning over the loss card will cost you 250 points. Let us suppose you decided to turn over 10 cards and then decided to stop. Please click the "See Result" button to see what happens: </div>' +
		"<div class = instructBox><div><strong>How many cards do you want to take?</strong></div></div>" +
		"<div class = instructBoxRight><div>Current Round:  0</div></div>" +
		"<div class = instructBoxLeft><div>Game Round: 1</div></div>" +
		"<div class = instructBoxLeft1><div>Loss Amount: 250</div></div>" +
		"<div class = instructBoxRight1><div># of Loss Cards: 3</div></div>" +
		"<div class = instructBoxMiddle1><div>Gain Amount: 30</div></div>" +


		"<div class = numbox2><div class = square2><input type='image' id = 'c1' src='/static/experiments/columbia_card_task_cold/images/beforeChosen.png'></div>" +
		"<div class = square2><input type='image' id = 'c5' src='/static/experiments/columbia_card_task_cold/images/beforeChosen.png'></div>" +
		"<div class = square2><input type='image' id = 'c9' src='/static/experiments/columbia_card_task_cold/images/beforeChosen.png'></div>" +
		"<div class = square2><input type='image' id = 'c13' src='/static/experiments/columbia_card_task_cold/images/beforeChosen.png'></div>" +
		"<div class = square2><input type='image' id = 'c17' src='/static/experiments/columbia_card_task_cold/images/beforeChosen.png'></div>" +
		"<div class = square2><input type='image' id = 'c21' src='/static/experiments/columbia_card_task_cold/images/beforeChosen.png'></div>" +
		"<div class = square2><input type='image' id = 'c25' src='/static/experiments/columbia_card_task_cold/images/beforeChosen.png'></div>" +
		"<div class = square2><input type='image' id = 'c29' src='/static/experiments/columbia_card_task_cold/images/beforeChosen.png'></div>" +

		"<div class = square2><input type='image' id = 'c2' src='/static/experiments/columbia_card_task_cold/images/beforeChosen.png'></div>" +
		"<div class = square2><input type='image' id = 'c6' src='/static/experiments/columbia_card_task_cold/images/beforeChosen.png'></div>" +
		"<div class = square2><input type='image' id = 'c10' src='/static/experiments/columbia_card_task_cold/images/beforeChosen.png'></div>" +
		"<div class = square2><input type='image' id = 'c14' src='/static/experiments/columbia_card_task_cold/images/beforeChosen.png'></div>" +
		"<div class = square2><input type='image' id = 'c18' src='/static/experiments/columbia_card_task_cold/images/beforeChosen.png'></div>" +
		"<div class = square2><input type='image' id = 'c22' src='/static/experiments/columbia_card_task_cold/images/beforeChosen.png'></div>" +
		"<div class = square2><input type='image' id = 'c26' src='/static/experiments/columbia_card_task_cold/images/beforeChosen.png'></div>" +
		"<div class = square2><input type='image' id = 'c30' src='/static/experiments/columbia_card_task_cold/images/beforeChosen.png'></div>" +

		"<div class = square2><input type='image' id = 'c3' src='/static/experiments/columbia_card_task_cold/images/beforeChosen.png'></div>" +
		"<div class = square2><input type='image' id = 'c7' src='/static/experiments/columbia_card_task_cold/images/beforeChosen.png'></div>" +
		"<div class = square2><input type='image' id = 'c11' src='/static/experiments/columbia_card_task_cold/images/beforeChosen.png'></div>" +
		"<div class = square2><input type='image' id = 'c15' src='/static/experiments/columbia_card_task_cold/images/beforeChosen.png'></div>" +
		"<div class = square2><input type='image' id = 'c19' src='/static/experiments/columbia_card_task_cold/images/beforeChosen.png'></div>" +
		"<div class = square2><input type='image' id = 'c23' src='/static/experiments/columbia_card_task_cold/images/beforeChosen.png'></div>" +
		"<div class = square2><input type='image' id = 'c27' src='/static/experiments/columbia_card_task_cold/images/beforeChosen.png'></div>" +
		"<div class = square2><input type='image' id = 'c31' src='/static/experiments/columbia_card_task_cold/images/beforeChosen.png'></div>" +

		"<div class = square2><input type='image' id = 'c4' src='/static/experiments/columbia_card_task_cold/images/beforeChosen.png'></div>" +
		"<div class = square2><input type='image' id = 'c8' src='/static/experiments/columbia_card_task_cold/images/beforeChosen.png'></div>" +
		"<div class = square2><input type='image' id = 'c12' src='/static/experiments/columbia_card_task_cold/images/beforeChosen.png'></div>" +
		"<div class = square2><input type='image' id = 'c16' src='/static/experiments/columbia_card_task_cold/images/beforeChosen.png'></div>" +
		"<div class = square2><input type='image' id = 'c20' src='/static/experiments/columbia_card_task_cold/images/beforeChosen.png'></div>" +
		"<div class = square2><input type='image' id = 'c24' src='/static/experiments/columbia_card_task_cold/images/beforeChosen.png'></div>" +
		"<div class = square2><input type='image' id = 'c28' src='/static/experiments/columbia_card_task_cold/images/beforeChosen.png'></div>" +
		"<div class = square2><input type='image' id = 'c32' src='/static/experiments/columbia_card_task_cold/images/beforeChosen.png'></div></div>" +
		'</p></div>',

	],
	allow_keys: false,
	show_clickable_nav: true,
	timing_post_trial: 1000
};
instruction_trials.push(feedback_instruct_block)
instruction_trials.push(instructions_block)

var instruction_node = {
	timeline: instruction_trials,
	/* This function defines stopping criteria */
	loop_function: function(data) {
		for (i = 0; i < data.length; i++) {
			if ((data[i].trial_type == 'poldrack-instructions') && (data[i].rt != -1)) {
				rt = data[i].rt
				sumInstructTime = sumInstructTime + rt
			}
		}
		if (sumInstructTime <= instructTimeThresh * 1000) {
			feedback_instruct_text =
				'Read through instructions too quickly.  Please take your time and make sure you understand the instructions.  Press <strong>enter</strong> to continue.'
			return true
		} else if (sumInstructTime > instructTimeThresh * 1000) {
			feedback_instruct_text = 'Done with instructions. Press <strong>enter</strong> to continue.'
			return false
		}
	}
}


var practice_block = {
	type: 'poldrack-single-stim',
	stimulus: practiceSetup,
	is_html: true,
	data: {
		exp_id: "columbia_card_task_cold",
		trial_id: 'stim',
		exp_stage: 'practice'
	},
	choices: [37],
	timing_post_trial: 0
};

var practice_block2 = {
	type: 'poldrack-single-stim',
	stimulus: practiceSetup2,
	data: {
		exp_id: "columbia_card_task_cold",
		trial_id: 'stim',
		exp_stage: 'practice'
	},
	is_html: true,
	choices: [37],
	timing_post_trial: 0
};


var test_block = {
	type: 'poldrack-single-stim',
	stimulus: getRound,
	is_html: true,
	data: {
		exp_id: "columbia_card_task_cold",
		trial_id: 'stim',
		exp_stage: 'test'
	},
	choices: [37],
	timing_post_trial: 0,
	on_finish: appendTestData,
};

var end_instructions = {
	type: 'poldrack-single-stim',
	stimulus: '<div class = centerbox><p class = center-block-text><strong>End of Instructions </strong></p><p class = center-block-text>Press <strong>enter</strong> when you are ready to play the game.</p></div>',
	is_html: true,
	data: {
		exp_id: "columbia_card_task_cold",
		trial_id: 'end_instructions'
	},
	choices: [13],
	timing_post_trial: 0
};

var end_block = {
	type: 'poldrack-text',
	data: {
		exp_id: "columbia_card_task_cold",
		trial_id: 'end'
	},
	text: '<div class = centerbox><p class = center-block-text>Finished with this task.</p><p class = center-block-text>Press <strong>enter</strong> to continue.</p></div>',
	cont_key: [13],
	timing_post_trial: 0
};



var start_practice_block = {
	type: 'poldrack-text',
	data: {
		exp_id: "columbia_card_task_cold",
		trial_id: 'practice_intro'
	},
	text: '<div class = centerbox><p class = center-block-text>Hello<strong>enter</strong> to begin.</p></div>',
	cont_key: [13],
	timing_post_trial: 1000
};

var start_test_block = {
	type: 'poldrack-text',
	data: {
		exp_id: "columbia_card_task_cold",
		trial_id: 'test_intro'
	},
	text: '<div class = centerbox><p class = block-text>We will now start the test. Respond to the "X" as quickly as possible by pressing the spacebar. Press <strong>enter</strong> to begin.</p></div>',
	cont_key: [13],
	timing_post_trial: 1000
};

var payout_text = {
	type: 'poldrack-text',
	text: getText,
	data: {
		exp_id: "columbia_card_task_cold",
		trial_id: 'reward'
	},
	cont_key: [13],
	timing_post_trial: 1000
};



var payoutTrial = {
	type: 'call-function',
	data: {
		exp_id: "columbia_card_task_cold",
		trial_id: 'calculate reward'
	},
	func: function() {
		randomRoundPointsArray = jsPsych.randomization.repeat(roundPointsArray, 1)
		prize1 = randomRoundPointsArray.pop()
		prize2 = randomRoundPointsArray.pop()
		prize3 = randomRoundPointsArray.pop()
	}
};



/* create experiment definition array */
var columbia_card_task_cold_experiment = [];
columbia_card_task_cold_experiment.push(instruction_node);
columbia_card_task_cold_experiment.push(practice_block);
columbia_card_task_cold_experiment.push(practice_block2);
columbia_card_task_cold_experiment.push(end_instructions)
for (b = 0; b < numRounds; b++) {
	columbia_card_task_cold_experiment.push(test_block);
}
columbia_card_task_cold_experiment.push(payoutTrial);
columbia_card_task_cold_experiment.push(payout_text);
columbia_card_task_cold_experiment.push(end_block);