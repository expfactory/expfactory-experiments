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
		num_cards_chosen: currID,
		num_loss_cards: lossProb,
		gain_amount: gainAmt,
		loss_amount: lossAmt,
		round_points: roundPoints,
		whichRound: whichRound
	})

}

var getButtons = function(buttonType){
var buttons = ""
if(buttonType == 2){
	buttons = "<div class = allbuttons>"
		for (i = 1; i < 33; i++) {
		buttons += "<button type = 'button' class  = select-button2 id = " + i + " onclick = chooseButton(this.id)>"+i+"</button>" 
		}
	return buttons
} else {
	buttons = "<div class = allbuttons>"
		for (i = 1; i < 33; i++) {
		buttons += "<button type = 'button' class  = select-button2 id = " + i + " onclick = chooseButton1(this.id)>"+i+"</button>" 
		}
	return buttons
}
}

var getBoard = function(board_type) {
	var board = ''
	if (board_type == 2) {
		board = "<div class = cardbox>"
		for (i = 1; i < 33; i++) {
		board += "<div class = square><input type='image' class = card_image id = " + i +
			" src='/static/experiments/columbia_cold_test/images/beforeChosen.png'></div>"
		}
		
	} else {
		board = "<div class = cardbox2>"
		for (i = 1; i < 33; i++) {
		board += "<div class = square><input class = card_image type='image' id = " + i +
			" src='/static/experiments/columbia_cold_test/images/beforeChosen.png'></div>"
		}
	}
	board += "</div>"
	
	return board
}

var getText = function() {
	return '<div class = centerbox><p class = block-text>These are your prizes from three randomly picked trials:  ' +
		'<ul list-text><li>' + prize1 + '</li><li>' + prize2 + '</li><li>' + prize3 + '</li></ul>' +
		'</p></div>'
}

var turnOneCard = function(whichCard){
document.getElementById(""+whichCard+"").src =
		'/static/experiments/columbia_cold_test/images/chosen.png';
}

var instructFunction = function() {

	document.getElementById("1").src =
		'/static/experiments/columbia_cold_test/images/chosen.png';
	document.getElementById("17").src =
		'/static/experiments/columbia_cold_test/images/chosen.png';
	document.getElementById("18").src =
		'/static/experiments/columbia_cold_test/images/chosen.png';
	document.getElementById("15").src =
		'/static/experiments/columbia_cold_test/images/chosen.png';
	document.getElementById("27").src =
		'/static/experiments/columbia_cold_test/images/chosen.png';
	document.getElementById("31").src =
		'/static/experiments/columbia_cold_test/images/chosen.png';
	document.getElementById("8").src =
		'/static/experiments/columbia_cold_test/images/chosen.png';
	document.getElementById("instruct1").innerHTML =
		'<strong>Example 1: </strong>In the example below, you see 32 unknown cards. The display shows you that 1 of these cards is a loss card. It also tells you that turning over each gain card is worth 10 points to you, and that turning over the loss card will cost you 750 points. Let us suppose you decided to turn over 7 cards and then decided to stop. Please click the "See Result" button to see what happens: <font color = "red">Luckily, none of the seven cards you turned over happened to be the loss card, so your score for this round was 70. Please click the next button.</font>'
	document.getElementById("current_round").innerHTML = 'Current Round:  70'
	
}

var instructFunction2 = function() {
	document.getElementById("1").src =
		'/static/experiments/columbia_cold_test/images/chosen.png';
	document.getElementById("4").src =
		'/static/experiments/columbia_cold_test/images/chosen.png';
	document.getElementById("30").src =
		'/static/experiments/columbia_cold_test/images/chosen.png';
	document.getElementById("13").src = '/static/experiments/columbia_cold_test/images/loss.png';
	document.getElementById("instruct2").innerHTML =
		'<strong>Example 2: </strong>In the example below, you see 32 unknown cards. The display shows you that 3 of these cards is a loss card. It also tells you that turning over each gain card is worth 30 points to you, and that turning over the loss card will cost you 250 points. Let us suppose you decided to turn over 10 cards and then decided to stop. Please click the "See Result" button to see what happens: <font color = "red">This time, the fourth card you turned over was a loss card. As you saw, the round will immediately end when you turn over the loss card. You had earned 90 points for the 3 gain cards, and then 250 points were subtracted for the loss card, so your score for this round was -160. After the loss points were subtracted from your Round Total, the computer also showed you the cards that you had not yet turned over. Please click the next button.</font>'
	document.getElementById("current_round").innerHTML = 'Current Round:  -160'
	setTimeout(instructTurnCards, 1500)


}


tempArray=[3,5,6,7,9,10,11,12,19,14,15,16,17,18,20,21,22,23,24,25,26,27,28,29,31,32]
var instructTurnCards = function() {
	document.getElementById("8").src = '/static/experiments/columbia_cold_test/images/loss.png';
	document.getElementById("2").src = '/static/experiments/columbia_cold_test/images/loss.png';
	
	for(i=0;i<tempArray.length;i++){
	document.getElementById(""+tempArray[i]+"").src =
		'/static/experiments/columbia_cold_test/images/chosen.png';
	}
}

var appendPayoutData = function(){
	jsPsych.data.addDataToLastTrial({reward: [prize1, prize2, prize3]})
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
	alert('You chose ' + currID +' cards. When you click on ok, the next round starts. Please note that the loss amount, the gain amount, and the number of loss cards might have changed.')
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
		'/static/experiments/columbia_cold_test/images/chosen.png';
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
	gameState = appendTextAfter(gameState, 'Number of Loss Cards: ', lossProb)
	gameState = appendTextAfter(gameState, 'Gain Amount: ', gainAmt)
	return gameState
}




/* ************************************ */
/* Define experimental variables */
/* ************************************ */
// generic task variables
var sumInstructTime = 0 //ms
var instructTimeThresh = 0 ///in seconds

// task specific variables
var e = ""
var i = ""
var numRounds = 27
var whichRound = 0
var roundPoints = 0
var totPoints = 0
var roundOver = 0
var roundPointsArray = []


var practiceSetup =
	"<div class = practiceText><div class = block-text2 id = instruct1><strong>Practice 1: </strong> In the version of the card game you are about to play, you will not turn the cards over one by one.  Rather, you will simply choose the total number of cards you would like to turn over (from 0 to 32) and then continue to the next round.  If turning over any cards seems too risky to you can click the zero button, in which case your score for this round will automatically be zero.  This is a practice round, and it looks just like the game you will play.  Please select the number of cards you would like to turn over, given the number of loss cards and the amount that you can gain or lose if you turn over a gain or loss card, as shown below.  Please note: The computer will tell you how well you did after all 27 game rounds are over!</div></div>" +
	"<div class = cct-box2>"+
	"<div class = titleBigBox>   <div class = titleboxLeft><div class = center-text id = game_round>Game Round: 1</div></div>   <div class = titleboxLeft1><div class = center-text id = loss_amount>Loss Amount: 250</div></div>    <div class = titleboxMiddle1><div class = center-text id = gain_amount>Gain Amount: 30</div></div>    <div class = titlebox><div class = center-text>How many cards do you want to take? </div></div>     <div class = titleboxRight1><div class = center-text id = num_loss_cards>Number of Loss Cards: 1</div></div>   <div class = titleboxRight><div class = center-text id = current_round>Current Round Total: </div></div>"+
	"<div class = buttonbox><button type='button' class = select-button id = button1 onclick = turnCards()>No Card</button><button type='button' class = select-button id = button2 onclick = turnCards()>STOP/Turn Over</button><button type='button' class = select-button id = button3  onclick = collect()>Next Round</button></div>"+
	getButtons()+
	"</div>"+
	getBoard()
	


var practiceSetup2 =
 	"<div class = practiceText><div class = block-text2 id = instruct2><strong>Practice 2: </strong> The computer will record your Point Total for each round and will show you those totals after you finish all 24 rounds of the game.  This is the second practice round. Please again select as many cards as you would like to, give the number of loss cards and the amounts that you can win or lose if you turn over a gain or loss card, as shown below.</div></div>"+
	"<div class = cct-box2>"+
	"<div class = titleBigBox>   <div class = titleboxLeft><div class = center-text id = game_round>Game Round: 2</div></div>   <div class = titleboxLeft1><div class = center-text id = loss_amount>Loss Amount: 750</div></div>    <div class = titleboxMiddle1><div class = center-text id = gain_amount>Gain Amount: 10</div></div>    <div class = titlebox><div class = center-text>How many cards do you want to take? </div></div>     <div class = titleboxRight1><div class = center-text id = num_loss_cards>Number of Loss Cards: 3</div></div>   <div class = titleboxRight><div class = center-text id = current_round>Current Round Total: </div></div>"+
	"<div class = buttonbox><button type='button' class = select-button id = button1 onclick = turnCards()>No Card</button><button type='button' class = select-button id = button2 onclick = turnCards()>STOP/Turn Over</button><button type='button' class = select-button id = button3  onclick = collect()>Next Round</button></div>"+
	getButtons()+
	"</div>"+
	getBoard()	
	
	
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
	"<div class = cct-box2>"+
	"<div class = titleBigBox>   <div class = titleboxLeft><div class = center-text id = game_round>Game Round: </div></div>   <div class = titleboxLeft1><div class = center-text id = loss_amount>Loss Amount: </div></div>    <div class = titleboxMiddle1><div class = center-text id = gain_amount>Gain Amount: </div></div>    <div class = titlebox><div class = center-text>How many cards do you want to take? </div></div>     <div class = titleboxRight1><div class = center-text id = num_loss_cards>Number of Loss Cards: </div></div>   <div class = titleboxRight><div class = center-text id = current_round>Current Round Total: </div></div>"+
	"<div class = buttonbox><button type='button' class = select-button id = button1 onclick = turnCards()>No Card</button><button type='button' class = select-button id = button2 onclick = turnCards()>STOP/Turn Over</button><button type='button' class = select-button id = button3  onclick = collect()>Next Round</button></div>"+
	getButtons(2)+
	"</div>"+
	getBoard()



/* ************************************ */
/* Set up jsPsych blocks */
/* ************************************ */
/* define static blocks */
var feedback_instruct_text =
	'Welcome to the experiment. Press <strong>enter</strong> to begin.'
var feedback_instruct_block = {
	type: 'poldrack-text',
	cont_key: [13],
	data: {
		exp_id: "columbia_cold_test",
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
  data: {exp_id: "columbia_cold_test", trial: 'instructions'},
  pages: [
	'<div class = centerbox><p class = block-text><strong>Introduction and Explanation</strong>'+
	'<p>-You are now going to participate in a card game.  In this game, you will turn over cards to win or lose points which are worth money.</p>'+
	'<p>-In each game round, you will see 32 cards on the computer screen, face down. You will decide how many of these cards to turn over. Each card is either a gain card or a loss card (there are no neutral cards). You will know how many gain cards and loss cards are in the deck of 32, and how many points you will gain or lose if you turn over a gain or loss card. What you do not know is which of the 32 cards that you see face-down are gain cards and which are loss cards. </p>'+
	'<p>-You indicate the number of cards (from 0 to 32) you want to turn over by clicking on a small button. Then, cards are randomly chosen to be turned over, one at a time. For each gain card turned over, points are added to your round total and another card is turned over. This continues until a loss card is uncovered or until the number of cards you chose to turn over is reached. The first time a loss card is turned over, the loss points will be subtracted from your current point total and the round is over – even if you indicated that more cards should be turned over. The accumulated total will be your number of points for that round, and you go on to the next round. Each new round starts with a score of 0 points; that means you play each round independently of the other rounds.</p>'+
	'<p>-You will play a total of 27 rounds, three of which will be randomly selected at the end of the session, and you will be paid out for those in real money. Each point is worth 1 cent.</p>',
	
    '<div class = centerbox><p class = block-text><strong>Unknown Cards:</strong>'+
    '<p> This is what unknown cards looks like.  Turn it over by clicking on it.</p>'+
    "<p><input type='image' id = '133' src='/static/experiments/columbia_cold_test/images/beforeChosen.png' onclick = instructButton(this.id)>"+
	'</p></div>',
	
	'<div class = centerbox><p class = block-text>'+
	'<p><strong>The Gain Card:</strong></p>'+
	'<p>For every gain card you turn over, your score increases by either 10, 20, or 30 points in different rounds.</p>'+
	"<p><input type='image' src='/static/experiments/columbia_cold_test/images/chosen.png'>"+
	'<p><strong>The Loss Card:</strong></p>'+
	"<p><input type='image' src='/static/experiments/columbia_cold_test/images/loss.png'></p>"+
	'<p>For every loss card you turn over, your score decreases by either 250,500, or 750 points in different rounds. Furthermore, the round immediately ends (you cannot turn over any more cards). There will be either 1,2, or 3 loss cards in any given round.</p>'+
	'<p>The number of loss cards and the value of points that can be won or lost by turning over a gain or loss card are fixed in each round. This information will always be on display so you know what kind of round you are in.</p>'+
	'</p></div>',
	
	"<div class = practiceText><div class = block-text2 id = instruct1><strong>Example 1: </strong>In the example below, you see 32 unknown cards. The display shows you that 1 of these cards is a loss card. It also tells you that turning over each gain card is worth 10 points to you, and that turning over the loss card will cost you 750 points. Let us suppose you decided to turn over 7 cards and then decided to stop. Please click the 'See Result' button to see what happens:</div></div>"+
	"<div class = cct-box>"+
	"<div class = titleBigBox>   <div class = titleboxLeft><div class = center-text>Game Round: 1</div></div>   <div class = titleboxLeft1><div class = center-text>Loss Amount: 250</div></div>    <div class = titleboxMiddle1><div class = center-text>Gain Amount: 30</div></div>    <div class = titlebox><div class = center-text>How many cards do you want to take? </div></div>     <div class = titleboxRight1><div class = center-text>Number of Loss Cards: 1</div></div>   <div class = titleboxRight><div class = center-text id = current_round>Current Round Total: </div></div>"+
	"<div class = buttonbox><button type='button' class = select-button id = button1 onclick = noCard()>No Card</button><button type='button' class = select-button id = button2 onclick = endRound()>STOP/Turn Over</button><button type='button' class = select-button id = button3  onclick = collect()>Next Round</button></div>"+
	"<div class = buttonbox2><button type='button' class = instructButton onclick= instructFunction()>See Result</button></div></div>"+
	getBoard(2),
	
	"<div class = practiceText><div class = block-text2 id = instruct2><strong>Example 2: </strong>In the example below, you see 32 unknown cards. The display shows you that 3 of these cards is a loss card. It also tells you that turning over each gain card is worth 30 points to you, and that turning over the loss card will cost you 250 points. Let us suppose you decided to turn over 10 cards and then decided to stop. Please click the 'See Result' button to see what happens:</div></div>"+
	"<div class = cct-box>"+
	"<div class = titleBigBox>   <div class = titleboxLeft><div class = center-text>Game Round: 1</div></div>   <div class = titleboxLeft1><div class = center-text>Loss Amount: 250</div></div>    <div class = titleboxMiddle1><div class = center-text>Gain Amount: 30</div></div>    <div class = titlebox><div class = center-text>How many cards do you want to take? </div></div>     <div class = titleboxRight1><div class = center-text>Number of Loss Cards: 1</div></div>   <div class = titleboxRight><div class = center-text id = current_round>Current Round Total: </div></div>"+
	"<div class = buttonbox><button type='button' class = select-button id = button1 onclick = noCard()>No Card</button><button type='button' class = select-button id = button2 onclick = endRound()>STOP/Turn Over</button><button type='button' class = select-button id = button3  onclick = collect()>Next Round</button></div>"+
	"<div class = buttonbox2><button type='button' class = instructButton onclick= instructFunction2()>See Result</button></div></div>"+
	getBoard(2),
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
		exp_id: "columbia_cold_test",
		trial_id: 'stim',
		exp_stage: 'practice'
	},
	choices: [37],
	timing_post_trial: 0,
	response_ends_trial: true,
};

var practice_block2 = {
	type: 'poldrack-single-stim',
	stimulus: practiceSetup2,
	data: {
		exp_id: "columbia_cold_test",
		trial_id: 'stim',
		exp_stage: 'practice'
	},
	is_html: true,
	choices: [37],
	timing_post_trial: 0,
	response_ends_trial: true,
};


var test_block = {
	type: 'poldrack-single-stim',
	stimulus: getRound,
	is_html: true,
	data: {
		exp_id: "columbia_cold_test",
		trial_id: 'stim',
		exp_stage: 'test'
	},
	choices: [37],
	timing_post_trial: 0,
	on_finish: appendTestData,
	response_ends_trial: true,
};

var end_instructions = {
	type: 'poldrack-single-stim',
	stimulus: '<div class = centerbox><p class = center-block-text><strong>End of Instructions </strong></p><p class = center-block-text>Press <strong>enter</strong> when you are ready to play the game.</p></div>',
	is_html: true,
	data: {
		exp_id: "columbia_cold_test",
		trial_id: 'end_instructions'
	},
	choices: [13],
	timing_post_trial: 0,
	response_ends_trial: true,
};

var end_block = {
	type: 'poldrack-text',
	data: {
		exp_id: "columbia_cold_test",
		trial_id: 'end'
	},
	text: '<div class = centerbox><p class = center-block-text>Finished with this task.</p><p class = center-block-text>Press <strong>enter</strong> to continue.</p></div>',
	cont_key: [13],
	timing_post_trial: 0
};



var start_practice_block = {
	type: 'poldrack-text',
	data: {
		exp_id: "columbia_cold_test",
		trial_id: 'practice_intro'
	},
	text: '<div class = centerbox><p class = center-block-text>Hello<strong>enter</strong> to begin.</p></div>',
	cont_key: [13],
	timing_post_trial: 1000
};

var start_test_block = {
	type: 'poldrack-text',
	data: {
		exp_id: "columbia_cold_test",
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
		exp_id: "columbia_cold_test",
		trial_id: 'reward'
	},
	cont_key: [13],
	timing_post_trial: 1000,
	on_finish: appendPayoutData,
};



var payoutTrial = {
	type: 'call-function',
	data: {
		exp_id: "columbia_cold_test",
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
var columbia_cold_test_experiment = [];
columbia_cold_test_experiment.push(instruction_node);
columbia_cold_test_experiment.push(practice_block);
columbia_cold_test_experiment.push(practice_block2);
columbia_cold_test_experiment.push(end_instructions)
for (b = 0; b < numRounds; b++) {
	columbia_cold_test_experiment.push(test_block);
}
columbia_cold_test_experiment.push(payoutTrial);
columbia_cold_test_experiment.push(payout_text);
columbia_cold_test_experiment.push(end_block);
