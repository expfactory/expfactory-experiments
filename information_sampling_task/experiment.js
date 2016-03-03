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

function addID() {
  jsPsych.data.addDataToLastTrial({
    'exp_id': 'information_sampling_task'
  })
}

function appendTextAfter(input, search_term, new_text) {
	var index = input.indexOf(search_term) + search_term.length
	return input.slice(0, index) + new_text + input.slice(index)
}

function appendTextAfter2(input, search_term, new_text) {
	var index = input.indexOf(search_term) + search_term.length
	return input.slice(0, index) + new_text + input.slice(index +
		"'/static/experiments/information_sampling_task/images/grey_small_square.png' onclick = chooseCard(this.id)".length + 5)
}

var appendTestData = function() {
	var clicked_on = ''
	if (color1_index.indexOf(currID, 0) != -1) {
		clicked_on = colors[0]

	} else if (color2_index.indexOf(currID, 0) != -1) {
		clicked_on = colors[1]
	} else if (currID == 26) {
		clicked_on = largeColors[0]
	} else if (currID == 27) {
		clicked_on = largeColors[1]
	}
	jsPsych.data.addDataToLastTrial({
		exp_stage: exp_stage,
		clicked_on: clicked_on,
		box_id: currID,
		which_click_in_round: numClicks,
		correct_response: colors[0]
	})
}

var getBoard = function(colors, board_type) {
	var whichSmallColor1 = colors[0] + '_' + shapes[0]
	var whichSmallColor2 = colors[1] + '_' + shapes[0]

	var whichLargeColor1 = largeColors[0] + '_' + shapes[1]
	var whichLargeColor2 = largeColors[1] + '_' + shapes[1]
	var board = "<div class = bigbox><div class = numbox>"
	var click_function = ''
	var click_class = ''
	for (var i = 1; i < 26; i++) {
		if (board_type == 'instruction') {
			click_function = 'instructionFunction'
			click_class = 'small_square'
		} else {
			click_function = 'chooseCard'
			click_class = 'select-button small_square'
		}
		if (clickedCards.indexOf(i) != -1) {
			if (color1_index.indexOf(i) != -1) {
				board +=
					"<div class = square><input type='image' class = 'small_square' id = '" +
					i +
					"' src='/static/experiments/information_sampling_task/images/" + whichSmallColor1 +
					".png'></div>"
			} else if (color2_index.indexOf(i) != -1) {
				board +=
					"<div class = square><input type='image' class = 'small_square' id = '" +
					i +
					"' src='/static/experiments/information_sampling_task/images/" + whichSmallColor2 +
					".png'></div>"
			}
		} else {
			board += "<div class = square><input type='image' class = '" + click_class + "'id = '" +
				i +
				"' src='/static/experiments/information_sampling_task/images/grey_small_square.png' onclick = " +
				click_function + "(this.id)></div>"
		}
	}
	board += "</div><div class = smallbox>"
	if (board_type == 'instruction') {
		board +=
			"<div class = bottomLeft><input type='image' class = 'select-button big_square' id = '26' src='/static/experiments/information_sampling_task/images/" +
			whichLargeColor1 + ".png' onclick = makeInstructChoice(this.id)></div>" +
			"<div class = bottomRight><input type='image' class = 'select-button big_square' id = '27' src='/static/experiments/information_sampling_task/images/" +
			whichLargeColor2 + ".png' onclick = makeInstructChoice(this.id)></div></div></div></div>"
	} else {
		board +=
			"<div class = bottomLeft><input type='image' class = 'select-button big_square' id = '26' src='/static/experiments/information_sampling_task/images/" +
			whichLargeColor1 + ".png' onclick = makeChoice(this.id)></div>" +
			"<div class = bottomRight><input type='image' class = 'select-button big_square' id = '27' src='/static/experiments/information_sampling_task/images/" +
			whichLargeColor2 + ".png' onclick = makeChoice(this.id)></div></div></div></div>"
	}
	return board
}

var appendRewardDataDW = function() {
	jsPsych.data.addDataToLastTrial({
		reward: reward
	})
}

var appendRewardDataFW = function() {
	jsPsych.data.addDataToLastTrial({
		reward: reward
	})
}


var getRound = function() {
	gameState = getBoard(colors, 'test')
	return gameState
}


var chooseCard = function(clicked_id) {
	roundOver = 1
	numClicks = numClicks + 1
	currID = parseInt(clicked_id)
	clickedCards.push(currID)
}

var makeChoice = function(clicked_id) {
	roundOver = 2
	numClicks = numClicks + 1
	currID = parseInt(clicked_id)
}


var resetRound = function() {
	DWPoints = 250
	FWPoints = 0
	roundOver = 0
	numCardReward = []
	numClicks = 0
	clickedCards = []
	colors = jsPsych.randomization.shuffle(['green', 'red', 'blue', 'teal', 'yellow', 'orange',
		'purple', 'brown'
	]).slice(0,2)
	numbersArray = jsPsych.randomization.repeat(numbers, 1)
	color1_index = numbersArray.slice(0,13)
	color2_index = numbersArray.slice(13)
	largeColors = jsPsych.randomization.shuffle([colors[0],colors[1]])
}

var getRewardFW = function() {
	global_trial = jsPsych.progress().current_trial_global
	lastAnswer = jsPsych.data.getDataByTrialIndex(global_trial - 1).clicked_on
	correctAnswer = jsPsych.data.getDataByTrialIndex(global_trial - 1).correct_response
	clickedCards = numbers //set all cards as 'clicked'
	if (lastAnswer == correctAnswer) {
		totFWPoints = totFWPoints + 100
		reward = 100
		return getBoard(colors,'test') + '<div class = rewardbox><div class = reward-text>Correct! You have won 100 points!</div><p class = reward-text>Press <strong>enter</strong> to continue.</p></div>'
	} else if (lastAnswer != correctAnswer) {
		totFWPoints = totFWPoints - 100
		reward = -100
		return getBoard(colors,'test') + '<div class = rewardbox><div class = reward-text>Wrong! You have lost 100 points!</div><p class = reward-text>Press <strong>enter</strong> to continue.</p></div>'
	}
}


var getRewardDW = function() {
	global_trial = jsPsych.progress().current_trial_global
	lastAnswer = jsPsych.data.getDataByTrialIndex(global_trial - 1).clicked_on
	correctAnswer = jsPsych.data.getDataByTrialIndex(global_trial - 1).correct_response
	clicks = clickedCards.length
	clickedCards = numbers //set all cards as 'clicked'
	if (lastAnswer == correctAnswer) {
		lossPoints = clicks * 10
		DWPoints = DWPoints - lossPoints
		reward = DWPoints
		totDWPoints = totDWPoints + DWPoints
		return getBoard(colors,'test') + '<div class = rewardbox><div class = reward-text>Correct! You have won ' + DWPoints +
			' points!</div><p class = reward-text>Press <strong>enter</strong> to continue.</p></div>'
	} else if (lastAnswer != correctAnswer) {
		totDWPoints = totDWPoints - DWPoints
		reward = DWPoints - 100
		return getBoard(colors,'test') + '<div class = rewardbox><div class = reward-text>Wrong! You have lost 100 points!</div><p class = reward-text>Press <strong>enter</strong> to continue.</p></div>'
	}
}

var instructionFunction = function(clicked_id) {
	currID = parseInt(clicked_id)
	if (color1_index.indexOf(currID) != -1) {
		document.getElementById(clicked_id).src =
			'/static/experiments/information_sampling_task/images/' + whichSmallColor1 + '.png';
	} else {
		document.getElementById(clicked_id).src =
			'/static/experiments/information_sampling_task/images/' + whichSmallColor2 + '.png';

	}
}

var makeInstructChoice = function(clicked_id) {
	clickedCards = numbers //set all cards as 'clicked'
	if (clicked_id == 26) {
		reward = 100
	} else if (clicked_id == 27) {
		reward = -100
	}
}

var getReward = function() {
	if (reward === 100) {
		return getBoard(colors, 'instruction') + '<div class = rewardbox><div class = reward-text>Correct! You have won 100 points!</div><p class = reward-text>Press <strong>enter</strong> to continue.</div></div>'
	} else if (reward === -100) {
		 return getBoard(colors, 'instruction') + '<div class = rewardbox><div class = reward-text>Incorrect! You have lost 100 points! </div><p class = reward-text>Press <strong>enter</strong> to continue.</p></div>'
	}
}


/* ************************************ */
/* Define experimental variables */
/* ************************************ */
// generic task variables
var sumInstructTime = 0 //ms
var instructTimeThresh = 0 ///in seconds

// task specific variables
var exp_stage = ''
var reward = 0 //reward value
var totFWPoints = 0
var totDWPoints = 0
var DWPoints = 250
var FWPoints = 0
var roundOver = 0
var numClicks = 0
var numCardReward = []
var colors = jsPsych.randomization.repeat(['green', 'red', 'blue', 'teal', 'yellow', 'orange',
	'purple', 'brown'
], 1)
var largeColors = []
var shapes = ['small_square', 'large_square']
var numbers = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25]
var numbersArray = jsPsych.randomization.repeat(numbers, 1)
var clickedCards = []

resetRound()
instructionsSetup = getBoard(colors, 'instruction')

/* ************************************ */
/* Set up jsPsych blocks */
/* ************************************ */
/* define static blocks */
var end_block = {
	type: 'poldrack-text',
	data: {
		trial_id: "end"
	},
	text: '<div class = centerbox><p class = center-block-text>Finished with this task.</p><p class = center-block-text>Press <strong>enter</strong> to continue.</p></div>',
	cont_key: [13],
	timing_post_trial: 0
};

var feedback_instruct_text =
	'Welcome to the experiment. Press <strong>enter</strong> to begin.'
var feedback_instruct_block = {
	type: 'poldrack-text',
	cont_key: [13],
	data: {
		trial_id: "instruction"
	},
	text: getInstructFeedback,
	timing_post_trial: 0,
	timing_response: 180000
};
/// This ensures that the subject does not read through the instructions too quickly.  If they do it too quickly, then we will go over the loop again.
var instructions_block = {
	type: 'poldrack-instructions',
	data: {
		trial_id: "instruction"
	},
	pages: [
		'<div class = centerbox><p class = block-text>In this experiment, you will see small  squares arranged in a 5 by 5 matrix. Initially all the squares will be greyed out, but when you click on a box it will reveal itself to be one of two colors corresponding to two larger squares at the bottom of the screen.<p class = block-text>Your task is to decide which color you think is in the majority.</p></div>',
		'<div class = centerbox><p class = block-text>You can open the boxes at your own rate and you can open as many smaller grey squares as you want before making your choice.</p><p class = block-text>It is entirely up to you how many boxes you open before you make your decision.</p><p class = block-text>When you have made your decision, you should touch that larger color square at the bottom of the screen. After you end instructions you will complete a practice trial.</p></div>',
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

var start_test_block = {
	type: 'poldrack-text',
	data: {
		trial_id: "test_intro"
	},
	text: '<div class = centerbox><p class = block-text>Each trial will look like that. There will be two conditions that affect how your reward will be counted.</p><p class = block-text>In the <strong>DW </strong>condition, you will start out at 250 points.  Every box opened until you make your choice deducts 10 points from this total.  So for example, if you open 7 boxes before you make a correct choice, your score for that round would be 180.  An incorrect decision loses 100 points regardless of how many boxes opened.</p><p class = block-text>In the <strong>FW</strong> condition, you will start out at 0 points.  A correct decision will lead to a gain of 100 points, regardless of the number of boxes opened.  Similarly, an incorrect decision will lead to a loss of 100 points. <br><br>Press <strong>enter</strong> to continue.</p></div>',
	cont_key: [13],
	timing_post_trial: 1000,
};

var DW_intro_block = {
	type: 'poldrack-text',
	data: {
		trial_id: "DW_intro"
	},
	text: '<div class = centerbox><p class = block-text>You are beginning rounds under the <strong>DW</strong> condition.</p><p class = block-text>Remember, you will start out with 250 points.  Every box opened until you make a correct choice deducts 10 points from this total, after which the remaining will be how much you have gained for the round.  An incorrect decision loses 100 points regardless of number of boxes opened.<br><br>Press <strong>enter</strong> to continue.</div>',
	cont_key: [13],
	timing_post_trial: 0,
	on_finish: function() {
		exp_stage = 'DW'
	}

};

var FW_intro_block = {
	type: 'poldrack-text',
	data: {
		trial_id: "FW_intro"
	},
	text: '<div class = centerbox><p class = block-text>You are beginning rounds under the <strong>FW</strong> condition.</p><p class = block-text>Remember, you will start out with 0 points.  If you make a correct choice, you will gain 100 points.  An incorrect decision loses 100 points regardless of number of boxes opened.<br><br>Press <strong>enter</strong> to continue.</div>',
	cont_key: [13],
	timing_post_trial: 0,
	on_finish: function() {
		exp_stage = 'FW'
	}
};



var rewardFW_block = {
	type: 'poldrack-single-stim',
	stimulus: getRewardFW,
	is_html: true,
	data: {
		trial_id: "reward",
		exp_stage: "FW"
	},
	choices: [13],
	timing_post_trial: 1000,
	on_finish: appendRewardDataFW,
	response_ends_trial: true,
};

var rewardDW_block = {
	type: 'poldrack-single-stim',
	stimulus: getRewardDW,
	is_html: true,
	data: {
		trial_id: "reward",
		exp_stage: "DW"
	},
	choices: [13],
	timing_post_trial: 1000,
	on_finish: appendRewardDataDW,
	response_ends_trial: true,
};



var practiceRewardBlock = {
	type: 'poldrack-single-stim',
	stimulus: getReward,
	is_html: true,
	data: {
		trial_id: "reward",
		exp_stage: "practice"
	},
	choices: [13],
	timing_post_trial: 1000,
	response_ends_trial: true,
	on_finish: function() {
		clickedCards = []
	}
};

var practice_block = {
	type: 'single-stim-button',
	button_class: 'select-button',
	stimulus: instructionsSetup,
	data: {
		trial_id: "stim",
		exp_stage: "practice"
	},
	timing_post_trial: 0,
	response_ends_trial: true,
};

var test_block = {
	type: 'single-stim-button',
	button_class: 'select-button',
	stimulus: getRound,
	data: {
		trial_id: "stim",
		exp_stage: "test"
	},
	timing_post_trial: 0,
	on_finish: appendTestData,
	response_ends_trial: true,
};

var test_node = {
	timeline: [test_block],
	loop_function: function(data) {
		if (roundOver == 2) {
			return false
		} else if (roundOver == 1 || roundOver === 0) {
			return true
		}
	}
}



var reset_block = {
	type: 'call-function',
	data: {
		trial_id: "reset_round"
	},
	func: resetRound,
	timing_post_trial: 0
}


/* create experiment definition array */
var information_sampling_task_experiment = [];
information_sampling_task_experiment.push(instruction_node);
information_sampling_task_experiment.push(practice_block);
information_sampling_task_experiment.push(practiceRewardBlock);
information_sampling_task_experiment.push(start_test_block);

if (Math.random() < .5) { // do the FW first, then DW
	information_sampling_task_experiment.push(FW_intro_block);
	for (var i = 0; i < 10; i++) {
		information_sampling_task_experiment.push(test_node);
		information_sampling_task_experiment.push(rewardFW_block);
		information_sampling_task_experiment.push(reset_block);
	}
	information_sampling_task_experiment.push(DW_intro_block);
	for (var i = 0; i < 10; i++) {
		information_sampling_task_experiment.push(test_node);
		information_sampling_task_experiment.push(rewardDW_block);
		information_sampling_task_experiment.push(reset_block);
	}

} else  { ////do DW first then FW
	information_sampling_task_experiment.push(DW_intro_block);
	for (var i = 0; i < 10; i++) {
		information_sampling_task_experiment.push(test_node);
		information_sampling_task_experiment.push(rewardDW_block);
		information_sampling_task_experiment.push(reset_block);
	}
	information_sampling_task_experiment.push(FW_intro_block);
	for (var i = 0; i < 10; i++) {
		information_sampling_task_experiment.push(test_node);
		information_sampling_task_experiment.push(rewardFW_block);
		information_sampling_task_experiment.push(reset_block);
	}
}
information_sampling_task_experiment.push(end_block);