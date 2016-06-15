/* ************************************ */
/* Define helper functions */
/* ************************************ */
var getInstructFeedback = function() {
	return '<div class = centerbox><p class = center-block-text>' + feedback_instruct_text +
		'</p></div>'
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
	var color_clicked = ''
	var correct = false
	if (color1_index.indexOf(currID, 0) != -1) {
		color_clicked = colors[0]
		trial_id = 'stim'
		correct = NaN
	} else if (color2_index.indexOf(currID, 0) != -1) {
		color_clicked = colors[1]
		trial_id = 'stim'
		correct = NaN
	} else if (currID == 26) {
		color_clicked = largeColors[0]
		trial_id = 'choice'
		if (color_clicked === colors[0]) {
			correct = true
		}
	} else if (currID == 27) {
		color_clicked = largeColors[1]
		trial_id = 'choice'
		if (color_clicked === colors[0])  {
			correct = true
		}
	}
	jsPsych.data.addDataToLastTrial({
		exp_stage: exp_stage,
		color_clicked: color_clicked,
		which_click_in_round: numClicks,
		correct_response: colors[0],
		trial_num: current_trial,
		correct: correct,
		trial_id: trial_id
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
		reward: reward,
		trial_num: current_trial
	})
	current_trial += 1
}

var appendRewardDataFW = function() {
	jsPsych.data.addDataToLastTrial({
		reward: reward,
		trial_num: current_trial
	})
	current_trial += 1
}


var getRound = function() {
	gameState = getBoard(colors, 'test')
	return gameState
}


var chooseCard = function(clicked_id) {
	numClicks = numClicks + 1
	currID = parseInt(clicked_id)
	clickedCards.push(currID)
}

var makeChoice = function(clicked_id) {
	roundOver = 1
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
	var numbersArray = jsPsych.randomization.repeat(numbers, 1)
	var num_majority = Math.floor(Math.random()*5) + 13
	color1_index = numbersArray.slice(0,num_majority)
	color2_index = numbersArray.slice(num_majority)
	largeColors = jsPsych.randomization.shuffle([colors[0],colors[1]])
	trial_start_time = new Date()
}

var getRewardFW = function() {
	global_trial = jsPsych.progress().current_trial_global
	lastAnswer = jsPsych.data.getDataByTrialIndex(global_trial - 1).color_clicked
	correctAnswer = jsPsych.data.getDataByTrialIndex(global_trial - 1).correct_response
	clickedCards = numbers //set all cards as 'clicked'
	if (lastAnswer == correctAnswer) {
		totFWPoints += 100
		reward = 100
		return getBoard(colors,'test') + '<div class = rewardbox><div class = reward-text>Correct! You have won 100 points!</div></div>'
	} else if (lastAnswer != correctAnswer) {
		totFWPoints -= 100
		reward = -100
		return getBoard(colors,'test') + '<div class = rewardbox><div class = reward-text>Wrong! You have lost 100 points!</div></div>'
	}
}


var getRewardDW = function() {
	global_trial = jsPsych.progress().current_trial_global
	lastAnswer = jsPsych.data.getDataByTrialIndex(global_trial - 1).color_clicked
	correctAnswer = jsPsych.data.getDataByTrialIndex(global_trial - 1).correct_response
	clicks = clickedCards.length
	clickedCards = numbers //set all cards as 'clicked'
	if (lastAnswer == correctAnswer) {
		lossPoints = clicks * 10
		DWPoints = DWPoints - lossPoints
		reward = DWPoints
		totDWPoints +=  DWPoints
		return getBoard(colors,'test') + '<div class = rewardbox><div class = reward-text>Correct! You have won ' + DWPoints +
			' points!</div></div>'
	} else if (lastAnswer != correctAnswer) {
		totDWPoints -= 100
		reward = -100
		return getBoard(colors,'test') + '<div class = rewardbox><div class = reward-text>Wrong! You have lost 100 points!</div></div>'
	}
}

var instructionFunction = function(clicked_id) {
	var whichSmallColor1 = colors[0] + '_' + shapes[0]
	var whichSmallColor2 = colors[1] + '_' + shapes[0]
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
	if (largeColors[['26','27'].indexOf(clicked_id)]==colors[0]) {
		reward = 100
	} else if (clicked_id == 27) {
		reward = -100
	}
}

var getRewardPractice = function() {
	var text = ''
	var correct = false
	var color_clicked = colors[1]
	if (reward === 100) {
		correct = true
		color_clicked = colors[0]
		text = getBoard(colors, 'instruction') + '<div class = rewardbox><div class = reward-text>Correct! You have won 100 points!</div></div></div>'
	} else  {
		 text = getBoard(colors, 'instruction') + '<div class = rewardbox><div class = reward-text>Incorrect! You have lost 100 points.</div></div></div>'
	}
	jsPsych.data.addDataToLastTrial({
		correct: correct,
		color_clicked: color_clicked
	})
	return text
}

var getDWPoints = function() {
	return "<div class = centerbox><p class = center-text>Total Points: " + totDWPoints + "</p></div>"
}

var getFWPoints = function() {
	return "<div class = centerbox><p class = center-text>Total Points: " + totFWPoints + "</p></div>"
}
var get_post_gap = function() {
	return Math.max(1000,(17-total_trial_time)*1000)
}

/* ************************************ */
/* Define experimental variables */
/* ************************************ */
// generic task variables
var sumInstructTime = 0 //ms
var instructTimeThresh = 0 ///in seconds

// task specific variables
var exp_stage = ''
var num_trials = 10
var reward = 0 //reward value
var totFWPoints = 0
var totDWPoints = 0
var DWPoints = 250
var FWPoints = 0
var roundOver = 0
var numClicks = 0
var current_trial = 0
var trial_start_time = 0 // variable to track beginning of trial time
var total_trial_time = 0 // Variable to track total trial time
var numCardReward = []
var colors = jsPsych.randomization.repeat(['green', 'red', 'blue', 'teal', 'yellow', 'orange',
	'purple', 'brown'
], 1)
var largeColors = []
var shapes = ['small_square', 'large_square']
var numbers = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25]
var clickedCards = []
//preload images
images = []
var path = '/static/experiments/information_sampling_task/images/'
for (var c = 0; c<colors.length; c++) {
	images.push(path + colors[c] + '_small_square.png')
	images.push(path + colors[c] + '_large_square.png')
}
jsPsych.pluginAPI.preloadImages(images)
resetRound()
instructionsSetup = getBoard(colors, 'instruction')

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
var end_block = {
	type: 'poldrack-text',
	data: {
		trial_id: "end",
		exp_id: 'information_sampling_task'
	},
	text: '<div class = centerbox><p class = center-block-text>Finished with this task.</p><p class = center-block-text>Press <strong>enter</strong> to continue.</p></div>',
	cont_key: [13],
	timing_post_trial: 0
};

var feedback_instruct_text =
	'Welcome to the experiment. This experiment should take around 12 minutes. Press <strong>enter</strong> to begin.'
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
		'<div class = centerbox><p class = block-text>You can open the boxes at your own rate and you can open as many smaller grey squares as you want before making your choice.</p><p class = block-text>It is entirely up to you how many boxes you open before you make your decision.</p><p class = block-text>When you have made your decision, you should touch that larger color square at the bottom of the screen.After you end instructions you will complete a practice trial.</p></div>',
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
	text: '<div class = centerbox><p class = block-text>Each trial will look like that. There will be two conditions that affect how your reward will be counted.</p><p class = block-text>In the <strong>Decreasing Win </strong>condition, you will start out at 250 points.  Every box opened until you make your choice deducts 10 points from this total.  So for example, if you open 7 boxes before you make a correct choice, your score for that round would be 180.  An incorrect decision loses 100 points regardless of how many boxes opened.</p><p class = block-text>In the <strong>Fixed Win </strong> condition, you will start out at 0 points.  A correct decision will lead to a gain of 100 points, regardless of the number of boxes opened.  Similarly, an incorrect decision will lead to a loss of 100 points. <br><br> In both conditions try to win as many points as possible. Press <strong>enter</strong> to continue.</p></div>',
	cont_key: [13],
	timing_post_trial: 1000,
};

var DW_intro_block = {
	type: 'poldrack-text',
	data: {
		trial_id: "DW_intro"
	},
	text: '<div class = centerbox><p class = block-text>You are beginning rounds under the <strong>Decreasing Win</strong> condition.</p><p class = block-text>Remember, you will start out with 250 points.  Every box opened until you make a correct choice deducts 10 points from this total, after which the remaining will be how much you have gained for the round.  An incorrect decision loses 100 points regardless of number of boxes opened.  Try to win as many points as you can. <br><br>Press <strong>enter</strong> to continue.</div>',
	cont_key: [13],
	timing_post_trial: 0,
	on_finish: function() {
		exp_stage = 'Decreasing Win'
		current_trial = 0
		trial_start_time = new Date()
	}
};

var FW_intro_block = {
	type: 'poldrack-text',
	data: {
		trial_id: "FW_intro"
	},
	text: '<div class = centerbox><p class = block-text>You are beginning rounds under the <strong>Fixed Win</strong> condition.</p><p class = block-text>Remember, you will start out with 0 points.  If you make a correct choice, you will gain 100 points.  An incorrect decision loses 100 points regardless of number of boxes opened. Try to win as many points as you can.<br><br>Press <strong>enter</strong> to continue.</div>',
	cont_key: [13],
	timing_post_trial: 0,
	on_finish: function() {
		exp_stage = 'Fixed Win'
		current_trial = 0
		trial_start_time = new Date()
	}
};

var rewardFW_block = {
	type: 'poldrack-single-stim',
	stimulus: getRewardFW,
	is_html: true,
	data: {
		trial_id: "reward",
		exp_stage: "Fixed Win"
	},
	choices: 'none',
	timing_response: 2000,
	timing_post_trial: 0,
	on_finish: appendRewardDataFW,
	response_ends_trial: true,
};

var rewardDW_block = {
	type: 'poldrack-single-stim',
	stimulus: getRewardDW,
	is_html: true,
	data: {
		trial_id: "reward",
		exp_stage: "Decreasing Win"
	},
	choices: 'none',
	timing_response: 2000,
	timing_post_trial: 0,
	on_finish: appendRewardDataDW,
	response_ends_trial: true,
};

var practiceRewardBlock = {
	type: 'poldrack-single-stim',
	stimulus: getRewardPractice,
	is_html: true,
	data: {
		trial_id: "reward",
		exp_stage: "practice"
	},
	choices: 'none',
	timing_response: 2000,
	timing_post_trial: 1000,
	response_ends_trial: true,
	on_finish: function() {
		clickedCards = []
	}
};

var scoreDW_block = {
	type: 'poldrack-single-stim',
	stimulus: getDWPoints,
	is_html: true,
	data: {
		trial_id: "total_points",
		exp_stage: "Decreasing Win"
	},
	choices: 'none',
	timing_response: get_post_gap,
}

var scoreFW_block = {
	type: 'poldrack-single-stim',
	stimulus: getFWPoints,
	is_html: true,
	data: {
		trial_id: "total_points",
		exp_stage: "Fixed Win"
	},
	choices: 'none',
	timing_response: get_post_gap,
}


var practice_block = {
	type: 'single-stim-button',
	button_class: 'select-button',
	stimulus: instructionsSetup,
	data: {
		trial_id: "choice",
		exp_stage: "practice",
		correct_respose: colors[0]
	},
	timing_post_trial: 0,
	response_ends_trial: true
};

var test_block = {
	type: 'single-stim-button',
	button_class: 'select-button',
	stimulus: getRound,
	timing_post_trial: 0,
	on_finish: appendTestData,
	response_ends_trial: true,
};

var test_node = {
	timeline: [test_block],
	loop_function: function(data) {
		if (roundOver === 1) {
			total_trial_time = (new Date() - trial_start_time)/1000
			return false
		} else if (roundOver === 0) {
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

if (Math.random() < 0.5) { // do the FW first, then DW
	information_sampling_task_experiment.push(FW_intro_block);
	for (var i = 0; i < num_trials; i++) {
		information_sampling_task_experiment.push(test_node);
		information_sampling_task_experiment.push(rewardFW_block);
		information_sampling_task_experiment.push(scoreFW_block);
		information_sampling_task_experiment.push(reset_block);
	}
	information_sampling_task_experiment.push(DW_intro_block);
	for (var i = 0; i < num_trials; i++) {
		information_sampling_task_experiment.push(test_node);
		information_sampling_task_experiment.push(rewardDW_block);
		information_sampling_task_experiment.push(scoreDW_block);
		information_sampling_task_experiment.push(reset_block);
	}

} else  { ////do DW first then FW
	information_sampling_task_experiment.push(DW_intro_block);
	for (var i = 0; i < num_trials; i++) {
		information_sampling_task_experiment.push(test_node);
		information_sampling_task_experiment.push(rewardDW_block);
		information_sampling_task_experiment.push(scoreDW_block);
		information_sampling_task_experiment.push(reset_block);
	}
	information_sampling_task_experiment.push(FW_intro_block);
	for (var i = 0; i < num_trials; i++) {
		information_sampling_task_experiment.push(test_node);
		information_sampling_task_experiment.push(rewardFW_block);
		information_sampling_task_experiment.push(scoreFW_block);
		information_sampling_task_experiment.push(reset_block);
	}
}
information_sampling_task_experiment.push(post_task_block)
information_sampling_task_experiment.push(end_block);