/* ************************************ */
/* Helper Functions                     */
/* ************************************ */
var getInstructFeedback = function() {
	return '<div class = centerbox><p class = center-block-text>' + feedback_instruct_text +
		'</p></div>'
}

function assessPerformance() {
	var experiment_data = jsPsych.data.getTrialsOfType('single-stim-button')
	var missed_count = 0
	var trial_count = 0
	var rt_array = []
	var rt = 0
	for (var i = 0; i < experiment_data.length; i++) {
		rt = experiment_data[i].rt
		trial_count += 1
		if (rt == -1) {
			missed_count += 1
		} else {
			rt_array.push(rt)
		}
	}
	//calculate average rt
	var sum = 0
	for (var j = 0; j < rt_array.length; j++) {
		sum += rt_array[j]
	}
	var avg_rt = sum / rt_array.length
	credit_var = (avg_rt > 200)
}

function deleteText(input, search_term) {
	index = input.indexOf(search_term)
	indexAfter = input.indexOf(search_term) + search_term.length
	return input.slice(0, index) + input.slice(indexAfter)
}


function appendTextAfter(input, search_term, new_text) {
	var index = input.indexOf(search_term) + search_term.length
	return input.slice(0, index) + new_text + input.slice(index)
}

function appendTextAfter2(input, search_term, new_text, deleted_text) {
	var index = input.indexOf(search_term) + search_term.length
	var indexAfter = index + deleted_text.length
	return input.slice(0, index) + new_text + input.slice(indexAfter)
}

var getBoard = function(board_type) {
	var board = ''
	if (board_type == 2) {
		board = "<div class = cardbox>"
		for (i = 1; i < 33; i++) {
			board += "<div class = square><input type='image' id = " + i +
				" class = 'card_image' src='/static/experiments/columbia_card_task_hot/images/beforeChosen.png' onclick = instructCard(this.id)></div>"
		}

	} else {
		board = "<div class = cardbox>"
		for (i = 1; i < 33; i++) {
			board += "<div class = square><input type='image' id = " + i +
				" class = 'card_image select-button' src='/static/experiments/columbia_card_task_hot/images/beforeChosen.png' onclick = chooseCard(this.id)></div>"
		}
	}
	board += "</div>"
	return board
}


var getText = function() {
	return '<div class = centerbox><p class = block-text>These are the points used for your bonus from three randomly picked trials:  ' +
		'<ul list-text><li>' + prize1 + '</li><li>' + prize2 + '</li><li>' + prize3 + '</li></ul>' +
		'</p></div>'
}

var appendPayoutData = function(){
	jsPsych.data.addDataToLastTrial({reward: [prize1, prize2, prize3]})
}

var chooseCard = function(clicked_id) {
	currID = parseInt(clicked_id)
	whichClickInRound = whichClickInRound + 1
	temp = whichLossCards.indexOf(currID, 0)
	if (clickedGainCards.indexOf(currID, 0) == -1 && clickedLossCards.indexOf(currID, 0) == -1) {
		if (temp != -1) { // if you click on a loss card
			clickedLossCards.push(clicked_id)
			index = unclickedCards.indexOf(currID, 0)
			unclickedCards.splice(index, 1)
			roundPoints = roundPoints - lossAmt
			lossClicked = true
			roundOver = 2
			document.getElementById('current_round').innerHTML = 'Current Round Points: ' + roundPoints;
			document.getElementById(clicked_id).src =
				'/static/experiments/columbia_card_task_hot/images/loss.png';

			document.getElementById("NoCardButton").disabled = true;
			document.getElementById("turnButton").disabled = true;
			for (i = 1; i < 33; i++) {
				document.getElementById('' + i + '').disabled = true;
			}
			CCT_timeouts.push(setTimeout(function() {
				turnCards()
			}, 2000))
	

		} else if (temp == -1) { // if you click on a gain card

			clickedGainCards.push(clicked_id) //as a string
			index = unclickedCards.indexOf(currID, 0)
			unclickedCards.splice(index, 1)
			roundPoints = roundPoints + gainAmt
		}
	}
}

var getRound = function() {
	if (roundOver === 0) { //this is for the start of a round
		whichClickInRound = 0
		unclickedCards = cardArray
		cardArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23,
			24, 25, 26, 27, 28, 29, 30, 31, 32
		]
		clickedGainCards = [] //num
		clickedLossCards = [] //num
		roundParams = shuffledParamsArray.pop()
		numLossCards = roundParams[0]
		gainAmt = roundParams[1]
		lossAmt = roundParams[2]
		shuffledCardArray = jsPsych.randomization.repeat(cardArray, 1)

		whichLossCards = [] //this determines which are loss cards at the beginning of each round
		for (i = 0; i < numLossCards; i++) {
			whichLossCards.push(shuffledCardArray.pop())
		}
		whichGainCards = shuffledCardArray
		gameState = gameSetup
		gameState = appendTextAfter(gameState, 'Game Round: ', whichRound)
		gameState = appendTextAfter(gameState, 'Loss Amount: ', lossAmt)
		gameState = appendTextAfter2(gameState, 'Current Round Points: ', roundPoints, '0')
		gameState = appendTextAfter(gameState, 'Number of Loss Cards: ', numLossCards)
		gameState = appendTextAfter(gameState, 'Gain Amount: ', gainAmt)
		gameState = appendTextAfter(gameState, "endRound()", " disabled")
		roundOver = 1
		return gameState
	} else if (roundOver == 1) { //this is for during the round
		gameState = gameSetup
		gameState = appendTextAfter(gameState, 'Game Round: ', whichRound)
		gameState = appendTextAfter(gameState, 'Loss Amount: ', lossAmt)
		gameState = appendTextAfter2(gameState, 'Current Round Points: ', roundPoints, '0')
		gameState = appendTextAfter(gameState, 'Number of Loss Cards: ', numLossCards)
		gameState = appendTextAfter(gameState, 'Gain Amount: ', gainAmt)
		gameState = appendTextAfter(gameState, "noCard()", " disabled")
		gameState = appendTextAfter2(gameState, "class = 'CCT-btn "," ' disabled", "select-button' onclick = noCard()")
		clickedGainCards.sort(function(a, b) {
			return a - b
		})
		for (i = 0; i < clickedGainCards.length; i++) {
			gameState = appendTextAfter2(gameState, "id = " + "" + clickedGainCards[i] + ""," class = 'card_image' src='/static/experiments/columbia_card_task_hot/images/chosen.png'", " class = 'card_image select-button' src='/static/experiments/columbia_card_task_hot/images/beforeChosen.png' onclick = chooseCard(this.id)")
		}
		return gameState
	} else if (roundOver == 2) { //this is for end the round
		roundOver = 3
		gameState = gameSetup
		gameState = appendTextAfter(gameState, 'Game Round: ', whichRound)
		gameState = appendTextAfter(gameState, 'Loss Amount: ', lossAmt)
		gameState = appendTextAfter2(gameState, 'Current Round Points: ', roundPoints, '0')
		gameState = appendTextAfter(gameState, 'Number of Loss Cards: ', numLossCards)
		gameState = appendTextAfter(gameState, 'Gain Amount: ', gainAmt)
		gameState = appendTextAfter2(gameState, "id = collectButton class = 'CCT-btn", " select-button' onclick = collect()", "' disabled")
		gameState = appendTextAfter(gameState, "endRound()", " disabled")
		gameState = appendTextAfter(gameState, "noCard()", " disabled")
		

		clickedGainCards.sort(function(a, b) {
			return a - b
		})
		for (i = 0; i < whichGainCards.length; i++) {
			gameState = appendTextAfter2(gameState, "id = " + "" + whichGainCards[i] + ""," class = 'card_image' src='/static/experiments/columbia_card_task_hot/images/chosen.png'", " class = 'card_image select-button' src='/static/experiments/columbia_card_task_hot/images/beforeChosen.png' onclick = chooseCard(this.id)")
		}
		for (i = 0; i < whichLossCards.length; i++) {
			gameState = appendTextAfter2(gameState, "id = " + "" + whichLossCards[i] + ""," class = 'card_image' src='/static/experiments/columbia_card_task_hot/images/loss.png'", " class = 'card_image select-button' src='/static/experiments/columbia_card_task_hot/images/beforeChosen.png' onclick = chooseCard(this.id)")
		}
		return gameState
	}
}

var turnCards = function() {
	/*These two commands are only for practice. In the rest of the experiment the whole
	board is redrawn, so disabling buttons is taken care of by the getRound function
	*/
	$('#collectButton').prop('disabled', false)
	$('#NoCardButton').prop('disabled', true)
	for (i = 0; i < 33; i++) {
		if (whichGainCards.indexOf(i) != -1) {
			document.getElementById('' + i + '').src =
				'/static/experiments/columbia_card_task_hot/images/chosen.png';
		} else if (whichLossCards.indexOf(i) != -1) {
			document.getElementById('' + i + '').src =
				'/static/experiments/columbia_card_task_hot/images/loss.png';
		}
	}
}

var turnOneCard = function(whichCard, win) {
	if (win === 'loss') {
		document.getElementById("" + whichCard + "").src =
			'/static/experiments/columbia_card_task_hot/images/loss.png';
	} else {
		document.getElementById("" + whichCard + "").src =
			'/static/experiments/columbia_card_task_hot/images/chosen.png';
	}
}

function doSetTimeout(card_i, delay, points, win) {
	CCT_timeouts.push(setTimeout(function() {
		turnOneCard(card_i, win);
		document.getElementById("current_round").innerHTML = 'Current Round Points: ' + points
	}, delay));
}

var noCard = function() {
	currID = 'noCardButton'
	roundOver=2
	whichClickInRound = whichClickInRound + 1
	for (i = 0; i < 33; i++) {
		if (whichGainCards.indexOf(i) != -1) {
			document.getElementById('' + i + '').src =
				'/static/experiments/columbia_card_task_hot/images/chosen.png';
		} else if (whichLossCards.indexOf(i) != -1) {
			document.getElementById('' + i + '').src =
				'/static/experiments/columbia_card_task_hot/images/loss.png';
		}
	}
}

var endRound = function() {
	/*These two commands are only for practice. In the rest of the experiment the whole
	board is redrawn, so disabling buttons is taken care of by the getRound function
	*/
	$('#collectButton').prop('disabled',false)
	$('#turnButton').prop('disabled',true)

	currID = 'endRoundButton'
	roundOver=2
	whichClickInRound = whichClickInRound + 1
	for (i = 0; i < 33; i++) {
		if (whichGainCards.indexOf(i) != -1) {
			document.getElementById('' + i + '').src =
				'/static/experiments/columbia_card_task_hot/images/chosen.png';
		} else if (whichLossCards.indexOf(i) != -1) {
			document.getElementById('' + i + '').src =
				'/static/experiments/columbia_card_task_hot/images/loss.png';
		}
	}
}


var collect = function() {
	for (var i = 0; i < CCT_timeouts.length; i++) {
			clearTimeout(CCT_timeouts[i]);
		}
	currID = 'collectButton'
	whichClickInRound = whichClickInRound + 1
}

var appendTestData = function() {
	jsPsych.data.addDataToLastTrial({
		which_round: whichRound,
		whichButtonWasClicked: currID,
		num_click_in_round: whichClickInRound,
		num_loss_cards: numLossCards,
		gain_amount: gainAmt,
		loss_amount: lossAmt,
		round_points: roundPoints,
		clicked_on_loss_card: lossClicked
	})

}

var getPractice1 = function() {
	unclickedCards = cardArray
	cardArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23,
		24, 25, 26, 27, 28, 29, 30, 31, 32
	]
	clickedGainCards = [] //num
	clickedLossCards = [] //num
	numLossCards = 1
	gainAmt = 30
	lossAmt = 250

	shuffledCardArray = jsPsych.randomization.repeat(cardArray, 1)
	whichLossCards = [] //this determines which are loss cards at the beginning of each round
	for (i = 0; i < numLossCards; i++) {
		whichLossCards.push(shuffledCardArray.pop())
	}
	whichGainCards = shuffledCardArray
	gameState = practiceSetup
	return gameState
}

var getPractice2 = function() {
	unclickedCards = cardArray
	cardArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23,
		24, 25, 26, 27, 28, 29, 30, 31, 32
	]
	clickedGainCards = [] //num
	clickedLossCards = [] //num
	numLossCards = 3
	gainAmt = 10
	lossAmt = 750

	shuffledCardArray = jsPsych.randomization.repeat(cardArray, 1)
	whichLossCards = [] //this determines which are loss cards at the beginning of each round
	for (i = 0; i < numLossCards; i++) {
		whichLossCards.push(shuffledCardArray.pop())
	}
	whichGainCards = shuffledCardArray
	gameState = practiceSetup2
	return gameState
}

var instructCard = function(clicked_id) {
	currID = parseInt(clicked_id)
	document.getElementById("NoCardButton").disabled = true;
	document.getElementById("turnButton").disabled = false;
	appendTextAfter(gameState, 'turnButton', ' onclick = turnCards()')
	if (whichLossCards.indexOf(currID) == -1) {
		instructPoints = instructPoints + gainAmt
		document.getElementById('current_round').innerHTML = 'Current Round Points: ' + instructPoints;
		document.getElementById(clicked_id).disabled = true;

		document.getElementById(clicked_id).src =
			'/static/experiments/columbia_card_task_hot/images/chosen.png';
	} else if (whichLossCards.indexOf(currID) != -1) {
		instructPoints = instructPoints - lossAmt
		document.getElementById(clicked_id).disabled = true;
		document.getElementById('current_round').innerHTML = 'Current Round Points: ' + instructPoints;
		document.getElementById(clicked_id).src =
			'/static/experiments/columbia_card_task_hot/images/loss.png';
		CCT_timeouts.push(setTimeout(function() {turnCards()}, 2000))
	}
}

var instructFunction = function() {
	$('#jspsych-instructions-next').click(function() {
		for (var i = 0; i < CCT_timeouts.length; i++) {
			clearTimeout(CCT_timeouts[i]);
		}
	})

	$('#jspsych-instructions-back').click(function() {
		for (var i = 0; i < CCT_timeouts.length; i++) {
			clearTimeout(CCT_timeouts[i]);
		}
	})

	var cards_to_turn = [1, 17, 18, 15, 27, 31, 8]
	var total_points = 0
	var points_per_card = 10
	var delay = 0
	for (var i = 0; i < cards_to_turn.length; i++) {
		var card_i = cards_to_turn[i]
		delay += 250
		total_points += points_per_card
		doSetTimeout(card_i, delay, total_points, 'win')
	}
	CCT_timeouts.push(setTimeout(function() {
		document.getElementById("instruct1").innerHTML =
		'<strong>Example 1: </strong>In the example below, you see 32 unknown cards. The display shows you that 1 of these cards is a loss card. It also tells you that turning over each gain card is worth 10 points to you, and that turning over the loss card will cost you 750 points. Let us suppose you decided to turn over 7 cards and then decided to stop. Please click the "See Result" button to see what happens: <font color = "red">Luckily, none of the seven cards you turned over happened to be the loss card, so your score for this round was 70. Please click the next button.</font>'
		}, delay))
}

var instructFunction2 = function() {
	var tempArray = [3, 5, 6, 7, 9, 10, 11, 12, 19, 14, 15, 16, 17, 18, 20, 21, 22, 23, 24, 25, 26,
		27, 28, 29, 31, 32
	]
	var instructTurnCards = function() {
		document.getElementById("8").src = '/static/experiments/columbia_card_task_hot/images/loss.png';
		document.getElementById("2").src = '/static/experiments/columbia_card_task_hot/images/loss.png';

		for (i = 0; i < tempArray.length; i++) {
			document.getElementById("" + tempArray[i] + "").src =
				'/static/experiments/columbia_card_task_hot/images/chosen.png';
		}
	}

	$('#jspsych-instructions-next').click(function() {
		for (var i = 0; i < CCT_timeouts.length; i++) {
			clearTimeout(CCT_timeouts[i]);
		}
	})

	$('#jspsych-instructions-back').click(function() {
		for (var i = 0; i < CCT_timeouts.length; i++) {
			clearTimeout(CCT_timeouts[i]);
		}
	})
	var cards_to_turn = [1, 4, 30]
	var total_points = 0
	var points_per_card = 30
	var delay = 0
	for (var i = 0; i < cards_to_turn.length; i++) {
		var card_i = cards_to_turn[i]
		delay += 250
		total_points += points_per_card
		doSetTimeout(card_i, delay, total_points, 'win')
	}
	delay += 250
	total_points -= 250
	doSetTimeout(13, delay, total_points, 'loss')
	CCT_timeouts.push(setTimeout(function() {
		document.getElementById("instruct2").innerHTML =
			'<strong>Example 2: </strong>In the example below, you see 32 unknown cards. The display shows you that 3 of these cards is a loss card. It also tells you that turning over each gain card is worth 30 points to you, and that turning over the loss card will cost you 250 points. Let us suppose you decided to turn over 10 cards and then decided to stop. Please click the "See Result" button to see what happens: <font color = "red">This time, the fourth card you turned over was a loss card. As you saw, the round will immediately end when you turn over the loss card. You had earned 90 points for the 3 gain cards, and then 250 points were subtracted for the loss card, so your score for this round was -160. After the loss points were subtracted from your Round Total, the computer also showed you the cards that you had not yet turned over. Please click the next button.</font>'
	}, delay))
	CCT_timeouts.push(setTimeout(instructTurnCards, delay + 1000))
}




var instructButton = function(clicked_id) {
	currID = parseInt(clicked_id)
	document.getElementById(clicked_id).src =
		'/static/experiments/columbia_card_task_hot/images/chosen.png';
}

/* ************************************ */
/* Experimental Variables               */
/* ************************************ */
// generic task variables
var sumInstructTime = 0 //ms
var instructTimeThresh = 0 ///in seconds
var credit_var = true
var performance_var = 0

// task specific variables
var currID = ""
var numLossCards = ""
var gainAmt = ""
var lossAmt = ""
var CCT_timeouts = []
var numRounds =  4
var lossClicked = false
var whichClickInRound = 0
var whichRound = 1
var roundPoints = 0
var totalPoints = 0
var roundOver = 0
var currTrial = 0
var instructPoints = 0
var clickedGainCards = []
var clickedLossCards = []
var roundPointsArray = [] 
var prize1 = 0
var prize2 = 0
var prize3 = 0
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
	"<div class = cct-box>"+
	"<div class = titleBigBox>   <div class = titleboxLeft><div class = center-text id = game_round>Game Round: </div></div>   <div class = titleboxLeft1><div class = center-text id = loss_amount>Loss Amount: </div></div>    <div class = titleboxMiddle1><div class = center-text id = gain_amount>Gain Amount: </div></div>    <div class = titlebox><div class = center-text>How many cards do you want to take? </div></div>     <div class = titleboxRight1><div class = center-text id = num_loss_cards>Number of Loss Cards: </div></div>   <div class = titleboxRight><div class = center-text id = current_round>Current Round Points: 0</div></div>"+
	"<div class = buttonbox><button type='button' id = NoCardButton class = 'CCT-btn select-button' onclick = noCard()>No Card</button><button type='button' id = turnButton class = 'CCT-btn select-button' onclick = endRound()>STOP/Turn Over</button><button type='button' id = collectButton class = 'CCT-btn' disabled>Next Round</button></div></div>"+
	getBoard()

var practiceSetup =
	"<div class = practiceText><div class = block-text2 id = instruct1><strong>Practice 1: </strong> As you click on cards, you can see your Round Total change in the box in the upper right.  If you turn over a few cards and then want to stop and go to the next round, click the <strong>Stop/Turn Over</strong> button and then <strong>Next Round</strong>.  If turning over cards seems too risky, you can click the <strong>No Card</strong> button, in which case your score for the round will automatically be zero.  This is a practice round, that looks just like the game you will play.  Please select the number of cards you would turn over, given the number of loss cards and the amounts of the gain and loss cards shown below.</div></div>"+
	"<div class = cct-box2>"+
	"<div class = titleBigBox>   <div class = titleboxLeft><div class = center-text id = game_round>Game Round: 1</div></div>   <div class = titleboxLeft1><div class = center-text id = loss_amount>Loss Amount: 250</div></div>    <div class = titleboxMiddle1><div class = center-text id = gain_amount>Gain Amount: 30</div></div>    <div class = titlebox><div class = center-text>How many cards do you want to take? </div></div>     <div class = titleboxRight1><div class = center-text id = num_loss_cards>Number of Loss Cards: 1</div></div>   <div class = titleboxRight><div class = center-text id = current_round>Current Round Points: 0</div></div>"+
	"<div class = buttonbox><button type='button' class = CCT-btn id = NoCardButton onclick = turnCards()>No Card</button><button type='button' class = CCT-btn id = turnButton onclick = turnCards() disabled>STOP/Turn Over</button><button type='button' class = 'CCT-btn select-button' id = collectButton  onclick = collect() disabled>Next Round</button></div></div>"+
	getBoard(2)

var practiceSetup2 =
	"<div class = practiceText><div class = block-text2 id = instruct2><strong>Practice 2: </strong> The computer will record your Point Total for each round and will show you those totals after you finish all 27 rounds of the game.  This is the second practice round. Please again turn over as many cards as you would like to, given the number of loss cards and the amounts that you can win or lose if you turn over a gain or loss card, as shown below.</div></div>"+
	"<div class = cct-box2>"+
	"<div class = titleBigBox>   <div class = titleboxLeft><div class = center-text id = game_round>Game Round: 2</div></div>   <div class = titleboxLeft1><div class = center-text id = loss_amount>Loss Amount: 750</div></div>    <div class = titleboxMiddle1><div class = center-text gain_amount>Gain Amount: 10</div></div>    <div class = titlebox><div class = center-text>How many cards do you want to take? </div></div>     <div class = titleboxRight1><div class = center-text id = num_loss_cards>Number of Loss Cards: 3</div></div>   <div class = titleboxRight><div class = center-text id = current_round>Current Round Points: 0</div></div>"+
	"<div class = buttonbox><button type='button' class = CCT-btn id = NoCardButton onclick = turnCards()>No Card</button><button type='button' class = CCT-btn id = turnButton onclick = turnCards() disabled>STOP/Turn Over</button><button type='button' class = 'CCT-btn select-button' id = collectButton  onclick = collect() disabled>Next Round</button></div></div>"+
	getBoard(2)


/* ************************************ */
/* Set up jsPsych blocks */
/* ************************************ */
//Set up post task questionnaire
var post_task_block = {
   type: 'survey-text',
   data: {
       trial_id: "post task questions"
   },
   questions: ['<p class = center-block-text style = "font-size: 20px">Please summarize what you were asked to do in this task.</p>',
              '<p class = center-block-text style = "font-size: 20px">Do you have any comments about this task?</p>'],
   rows: [15, 15],
   columns: [60,60]
};

/* define static blocks */

var feedback_instruct_text =
	"Welcome to the experiment. This task will take around 25 minutes. Press <strong>enter</strong> to begin."
var feedback_instruct_block = {
	type: 'poldrack-text',
	cont_key: [13],
	data: {
		trial_id: 'instruction'
	},
	text: getInstructFeedback,
	timing_post_trial: 0,
	timing_response: 180000
};
/// This ensures that the subject does not read through the instructions too quickly.  If they do it too quickly, then we will go over the loop again.
var instructions_block = {
  type: 'poldrack-instructions',
  data: {trial_id: 'instruction'},
  pages: [
	'<div class = centerbox><p class = block-text><strong>Introduction and Explanation</strong>'+
	'<p>-You are now going to participate in a card game.  In this game, you will turn over cards to win or lose points which are worth money.</p>'+
	'<p>-In each game round, you will see 32 cards on the computer screen, face down. You will decide how many of these cards to turn over. Each card is either a gain card or a loss card (there are no neutral cards). You will know how many gain cards and loss cards are in the deck of 32, and how many points you will gain or lose if you turn over a gain or loss card. What you do not know is which of the 32 cards that you see face-down are gain cards and which are loss cards. </p>'+
	'<p>-You indicate the number of cards (from 0 to 32) you want to turn over by clicking on a small button. Then, cards are randomly chosen to be turned over, one at a time. For each gain card turned over, points are added to your round total and another card is turned over. This continues until a loss card is uncovered or until the number of cards you chose to turn over is reached. The first time a loss card is turned over, the loss points will be subtracted from your current point total and the round is over – even if you indicated that more cards should be turned over. The accumulated total will be your number of points for that round, and you go on to the next round. Each new round starts with a score of 0 points; that means you play each round independently of the other rounds.</p>'+
	'<p>-You will play a total of 27 rounds, three of which will be randomly selected at the end of the session, and you will be paid out for those in real money. Each point is worth 1 cent.</p>',
	
    '<div class = centerbox><p class = block-text><strong>Unknown Cards:</strong>'+
    '<p> This is what unknown cards looks like.  Turn it over by clicking on it.</p>'+
    "<p><input type='image' id = '133' src='/static/experiments/columbia_card_task_hot/images/beforeChosen.png' onclick = instructButton(this.id)>"+
	'</p></div>',
	
	'<div class = centerbox><p class = block-text>'+
	'<p><strong>The Gain Card:</strong></p>'+
	'<p>For every gain card you turn over, your score increases by either 10, 20, or 30 points in different rounds.</p>'+
	"<p><input type='image' src='/static/experiments/columbia_card_task_hot/images/chosen.png'>"+
	'<p><strong>The Loss Card:</strong></p>'+
	"<p><input type='image' src='/static/experiments/columbia_card_task_hot/images/loss.png'></p>"+
	'<p>For every loss card you turn over, your score decreases by either 250, 500, or 750 points in different rounds. Furthermore, the round immediately ends (you cannot turn over any more cards). There will be either 1,2, or 3 loss cards in any given round.</p>'+
	'<p>The number of loss cards and the value of points that can be won or lost by turning over a gain or loss card are fixed in each round. This information will always be on display so you know what kind of round you are in.</p>'+
	'</p></div>',
	
	"<div class = practiceText><div class = block-text2 id = instruct1><strong>Example 1: </strong>In the example below, you see 32 unknown cards. The display shows you that 1 of these cards is a loss card. It also tells you that turning over each gain card is worth 10 points to you, and that turning over the loss card will cost you 750 points. Let us suppose you decided to turn over 7 cards and then decided to stop. Please click the 'See Result' button to see what happens:</div></div>"+
	"<div class = cct-box2>"+
	"<div class = titleBigBox>   <div class = titleboxLeft><div class = center-text>Game Round: 1</div></div>   <div class = titleboxLeft1><div class = center-text>Loss Amount: 750</div></div>    <div class = titleboxMiddle1><div class = center-text>Gain Amount: 10</div></div>    <div class = titlebox><div class = center-text>How many cards do you want to take? </div></div>     <div class = titleboxRight1><div class = center-text>Number of Loss Cards: 1</div></div>   <div class = titleboxRight><div class = center-text id = current_round>Current Round Points: 0</div></div>"+
	"<div class = buttonbox><button type='button' class = 'CCT-btn select-button' id = NoCardButton disabled>No Card</button><button type='button' class = 'CCT-btn select-button' class = 'CCT-btn select-button' id = turnButton disabled>STOP/Turn Over</button><button type='button' class = 'CCT-btn select-button' id = collectButton  disabled>Next Round</button></div>"+
	"<div class = buttonbox2><button type='button' class = CCT-btn id = instructButton onclick= instructFunction()>See Result</button></div></div>"+
	getBoard(2),
	
	"<div class = practiceText><div class = block-text2 id = instruct2><strong>Example 2: </strong>In the example below, you see 32 unknown cards. The display shows you that 3 of these cards is a loss card. It also tells you that turning over each gain card is worth 30 points to you, and that turning over the loss card will cost you 250 points. Let us suppose you decided to turn over 10 cards and then decided to stop. Please click the 'See Result' button to see what happens:</div></div>"+
	"<div class = cct-box2>"+
	"<div class = titleBigBox>   <div class = titleboxLeft><div class = center-text>Game Round: 1</div></div>   <div class = titleboxLeft1><div class = center-text>Loss Amount: 250</div></div>    <div class = titleboxMiddle1><div class = center-text>Gain Amount: 30</div></div>    <div class = titlebox><div class = center-text>How many cards do you want to take? </div></div>     <div class = titleboxRight1><div class = center-text>Number of Loss Cards: 3</div></div>   <div class = titleboxRight><div class = center-text id = current_round>Current Round Points: 0</div></div>"+
	"<div class = buttonbox><button type='button' class = 'CCT-btn select-button' id = NoCardButton disabled>No Card</button><button type='button' class = 'CCT-btn select-button' class = 'CCT-btn select-button' id = turnButton disabled>STOP/Turn Over</button><button type='button' class = 'CCT-btn select-button' id = collectButton  disabled>Next Round</button></div>"+
	"<div class = buttonbox2><button type='button' class = CCT-btn id = instructButton onclick= instructFunction2()>See Result</button></div></div>"+
	getBoard(2),
	"<div class = centerbox><p class = block-text>After you end the instructions you will complete two practice rounds before proceeding. Please make sure you understand the examples on the last two pages before ending the instructions.</p></div>"
  ],
  allow_keys: false,
  show_clickable_nav: true,
  timing_post_trial: 1000
};

var instruction_node = {
	timeline: [feedback_instruct_block, instructions_block],
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





var end_block = {
	type: 'poldrack-text',
	data: {
		trial_id: 'end',
		exp_id: 'columbia_card_task_hot'
	},
	text: '<div class = centerbox><p class = center-block-text>Finished with this task.</p><p class = center-block-text>Press <strong>enter</strong> to continue.</p></div>',
	cont_key: [13],
	timing_post_trial: 0
};

var start_test_block = {
	type: 'poldrack-text',
	data: {
		trial_id: 'test_intro'
	},
	text: '<div class = centerbox><p class = center-block-text>We will now start the test. Press <strong>enter</strong> to begin.</p></div>',
	cont_key: [13],
	timing_post_trial: 1000,
	on_finish: function(){
	whichClickInRound = 0
	}
};


var practice_block1 = {
	type: 'single-stim-button',
	button_class: 'select-button',
	stimulus: getPractice1,
	is_html: true,
	data: {
		trial_id: 'stim',
		exp_stage: 'practice'
	},
	timing_post_trial: 0,
	response_ends_trial: true,
	on_finish: function() {
		jsPsych.data.addDataToLastTrial({
			num_loss_cards: numLossCards,
			gain_amount: gainAmt,
			loss_amount: lossAmt,
			instruct_points: instructPoints,
		})
		instructPoints = 0
	}
};

var practice_block2 = {
	type: 'single-stim-button',
	button_class: 'select-button',
	stimulus: getPractice2,
	is_html: true,
	data: {
		trial_id: 'stim',
		exp_stage: 'practice'
	},
	timing_post_trial: 0,
	response_ends_trial: true,
	on_finish: function() {
		jsPsych.data.addDataToLastTrial({
			num_loss_cards: numLossCards,
			gain_amount: gainAmt,
			loss_amount: lossAmt,
			instruct_points: instructPoints,
		})
		instructPoints = 0
	}
};

var test_block = {
	type: 'single-stim-button',
	button_class: 'select-button',
	stimulus: getRound,
	is_html: true,
	data: {
		trial_id: 'stim',
		exp_stage: 'test'
	},
	timing_post_trial: 0,
	on_finish: appendTestData,
	response_ends_trial: true,
};


var test_node = {
	timeline: [test_block],
	loop_function: function(data) {
		if (currID == 'collectButton') {
			roundPointsArray.push(roundPoints)
			roundOver = 0
			roundPoints = 0
			whichClickInRound = 0
			currTrial = 0
			whichRound = whichRound + 1
			lossClicked = false
			return false
		} else {
			return true
		}
	}
}

var payout_text = {
	type: 'poldrack-text',
	text: getText,
	data: {
		trial_id: 'reward'
	},
	cont_key: [13],
	timing_post_trial: 1000,
	on_finish: appendPayoutData,
};

var payoutTrial = {
	type: 'call-function',
	data: {
		trial_id: 'calculate reward'
	},
	func: function() {
		randomRoundPointsArray = jsPsych.randomization.repeat(roundPointsArray, 1)
		prize1 = randomRoundPointsArray.pop()
		prize2 = randomRoundPointsArray.pop()
		prize3 = randomRoundPointsArray.pop()
		performance_var = prize1 + prize2 + prize3
	}
};

/* create experiment definition array */
var columbia_card_task_hot_experiment = [];
//columbia_card_task_hot_experiment.push(test_img_block);

columbia_card_task_hot_experiment.push(instruction_node);
columbia_card_task_hot_experiment.push(practice_block1);
columbia_card_task_hot_experiment.push(practice_block2);

columbia_card_task_hot_experiment.push(start_test_block);
for (i = 0; i < numRounds; i++) {
	columbia_card_task_hot_experiment.push(test_node);
}
columbia_card_task_hot_experiment.push(payoutTrial);
columbia_card_task_hot_experiment.push(payout_text);
columbia_card_task_hot_experiment.push(post_task_block)
columbia_card_task_hot_experiment.push(end_block);