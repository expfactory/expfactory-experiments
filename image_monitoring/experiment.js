/* ************************************ */
/* Define helper functions */
/* ************************************ */
function getDisplayElement() {
	$('<div class = display_stage_background></div>').appendTo('body')
	return $('<div class = display_stage></div>').appendTo('body')
}

function evalAttentionChecks() {
	var check_percent = 1
	if (run_attention_checks) {
		var attention_check_trials = jsPsych.data.getTrialsOfType('attention-check')
		var checks_passed = 0
		for (var i = 0; i < attention_check_trials.length; i++) {
			if (attention_check_trials[i].correct === true) {
				checks_passed += 1
			}
		}
		check_percent = checks_passed / attention_check_trials.length
	}
	return check_percent
}

function addID() {
	jsPsych.data.addDataToLastTrial({
		'exp_id': 'image_monitoring'
	})
}

var randomDraw = function(lst) {
	var index = Math.floor(Math.random() * (lst.length))
	return lst[index]
}

var get_correct_key = function() {
	return correct_key
}

var update_count = function() {
	var stim = practice_trials[practice_count].data.trial_id
	if (stim == 'red') {
		red_count += 1
	} else if (stim == 'green') {
		green_count += 1
	} else if (stim == 'blue') {
		blue_count += 1
	}

	if (stim == 'red' && red_count == 4) {
		correct_key = 32
		red_count = 0
	} else if (stim == 'green' && green_count == 4) {
		correct_key = 32
		green_count = 0
	} else if (stim == 'blue' && blue_count == 4) {
		correct_key = 32
		blue_count = 0
	} else {
		correct_key = 'none'
	}
	practice_count += 1
}

var reset_count = function() {
	var curr_trial = jsPsych.progress().current_trial_global
	var stim = jsPsych.data.getData()[curr_trial].trial_id
	var key = jsPsych.data.getData()[curr_trial].key_press
	if (stim == 'red' && key != -1) {
		red_count = 0
	} else if (stim == 'green' && key != -1) {
		green_count = 0
	} else if (stim == 'blue' && key != -1) {
		blue_count = 0
	} else {
		return 'none'
	}
}

var getInstructFeedback = function() {
		return '<div class = centerbox><p class = center-block-text>' + feedback_instruct_text +
			'</p></div>'
	}
	/* ************************************ */
	/* Define experimental variables */
	/* ************************************ */
	// generic task variables
var run_attention_checks = true
var attention_check_thresh = 0.65
var sumInstructTime = 0 //ms
var instructTimeThresh = 5 ///in seconds

// task specific variables
var red_count = 0
var green_count = 0
var blue_count = 0
var correct_key = 'none'
var practice_count = 0

practice_stims = [{
	stimulus: '<div class = centerbox><div class = shape id = stim1></div></div>',
	data: {
		exp_id: 'image_monitoring',
		trial_id: 'red',
		condition: 'practice'
	}
}, {
	stimulus: '<div class = centerbox><div class = shape id = stim2></div></div>',
	data: {
		exp_id: 'image_monitoring',
		trial_id: 'green',
		condition: 'practice'
	}
}, {
	stimulus: '<div class = centerbox><div class = shape id = stim3></div></div>',
	data: {
		exp_id: 'image_monitoring',
		trial_id: 'blue',
		condition: 'practice'
	}
}]

stims = [{
	stimulus: '<div class = centerbox><div class = shape id = stim1></div></div>',
	data: {
		exp_id: 'image_monitoring',
		trial_id: 'red',
		condition: 'test'
	}
}, {
	stimulus: '<div class = centerbox><div class = shape id = stim2></div></div>',
	data: {
		exp_id: 'image_monitoring',
		trial_id: 'green',
		condition: 'test'
	}
}, {
	stimulus: '<div class = centerbox><div class = shape id = stim3></div></div>',
	data: {
		exp_id: 'image_monitoring',
		trial_id: 'blue',
		condition: 'test'
	}
}]

last_shape = randomDraw(practice_stims)
practice_trials = jsPsych.randomization.repeat(practice_stims, 8);
practice_trials.push(last_shape)

block_num = 4
blocks = []
for (b = 0; b < block_num; b++) {
	block_trials = jsPsych.randomization.repeat(stims, 8);
	last_shape = randomDraw(stims)
	block_trials.push(last_shape)
	blocks.push(block_trials)
}

/* ************************************ */
/* Set up jsPsych blocks */
/* ************************************ */
// Set up attention check node
var attention_check_block = {
	type: 'attention-check',
	data: {
		exp_id: "image_monitoring",
		trial_id: "attention_check"
	},
	timing_response: 30000,
	response_ends_trial: true,
	timing_post_trial: 200
}

var attention_node = {
	timeline: [attention_check_block],
	conditional_function: function() {
		return run_attention_checks
	}
}

/* define static blocks */
var welcome_block = {
	type: 'poldrack-text',
	timing_response: 60000,
	data: {
		exp_id: "image_monitoring",
		trial_id: "welcome"
	},
	text: '<div class = centerbox><p class = center-block-text>Welcome to the experiment. Press <strong>enter</strong> to begin.</p></div>',
	cont_key: [13],
	timing_post_trial: 0
};

var feedback_instruct_text =
	'Starting with instructions.  Press <strong> Enter </strong> to continue.'
var feedback_instruct_block = {
	type: 'poldrack-text',
	cont_key: [13],
	data: {
		exp_id: "image_monitoring",
		trial_id: "instruction"
	},
	text: getInstructFeedback,
	timing_post_trial: 0,
	timing_response: 60000
};
/// This ensures that the subject does not read through the instructions too quickly.  If they do it too quickly, then we will go over the loop again.
var instruction_trials = []
var instructions_block = {
	type: 'poldrack-instructions',
	data: {
		exp_id: "image_monitoring",
		trial_id: "instruction"
	},
	pages: [
		'<div class = centerbox><p class = block-text>In this experiment you will see shapes in a sequence, one after the other. You will see one of three shapes on each trial: a red square, a green square, or a blue square.</p></div>',
		'<div class = centerbox><p class = block-text>Your job is to keep each track of the number of times each shape repeats and respond when you see any shape repeat four times by pressing the spacebar. For instance, if you see "red, red, blue, green, red, blue, green, <strong>red</strong>" you should respond on the last (fourth) red shape.</p><p class = block-text>If the sequence of shapes continued with "red, green, blue, <strong>green</strong>" you would respond again, as the green shape had repeated four times, and so on.</p></div>',
		"<div class = centerbox><p class = block-text>After you respond by pressing the spacebar, you should 'reset' that shape's count. So in the previous examples, once you press the spacebar in response to the red shapes, you should start counting the red shapes again from 0.</p><p class = block-text>Even if you believe you pressed the spacebar at the wrong time (if you thought only 3 red shapes had passed instead of 4), you <strong>still should reset your count</strong>. So if you count 3 red shapes and inappropriately responded, begin counting red shapes from 0 again.</p></div>",
		'<div class = centerbox><p class = block-text>To summarize, you will keep track of three different shapes: blue, green and red. When you count 4 of any shape, press the spacebar. After you respond to a shape (regardless of if you were correct or not), mentally reset that shapes count, while leaving the count for the other shapes intact.</p></div>'
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

var end_block = {
	type: 'poldrack-text',
	timing_response: 60000,
	data: {
		exp_id: "image_monitoring",
		trial_id: "end"
	},
	text: '<div class = centerbox><p class = center-block-text>Thanks for completing this task!</p><p class = center-block-text>Press <strong>enter</strong> to continue.</p></div>',
	cont_key: [13],
	timing_post_trial: 0
};

var start_practice_block = {
	type: 'poldrack-text',
	timing_response: 60000,
	data: {
		exp_id: "image_monitoring",
		trial_id: "practice_intro"
	},
	text: '<div class = centerbox><p class = block-text>We will start with some practice followed by ' +
		block_num +
		' test blocks. During practice you will get feedback about whether your responses are correct or not, which you will not get during the rest of the experiment. Press <strong>enter</strong> to begin.</p></div>',
	cont_key: [13],
	timing_post_trial: 1000
};

var start_test_block = {
	type: 'poldrack-text',
	timing_response: 60000,
	data: {
		exp_id: "image_monitoring",
		trial_id: "test_intro"
	},
	text: '<div class = centerbox><p class = block-text>Starting a test block. Remember to respond after a shape repeats four times and "reset" your count after you press the spacebar, <strong>regardless of whether or not you were correct</strong>.</p><p class = block-text>Press <strong>enter</strong> to begin.</p></div>',
	cont_key: [13],
	timing_post_trial: 1000
};

var update_function = {
	type: 'call-function',
	data: {
		exp_id: "image_monitoring",
		trial_id: "reset_post_trial_gap"
	},
	func: update_count,
	timing_post_trial: 0
}

//Set up experiment
var image_monitoring_experiment = []
image_monitoring_experiment.push(welcome_block);
image_monitoring_experiment.push(instruction_node);
image_monitoring_experiment.push(start_practice_block);

// set up practice
for (i = 0; i < practice_trials.length; i++) {
	var practice_shape_block = {
		type: 'poldrack-categorize',
		is_html: true,
		timeline: practice_trials,
		key_answer: get_correct_key,
		data: {
			exp_id: "image_monitoring",
			trial_id: "stim",
			exp_stage: "practice"
		},
		correct_text: '<div class = centerbox><div class = center-text>Correct</div></div>',
		incorrect_text: '<div class = centerbox><div class = center-text>Incorrect</div></div>',
		timeout_message: ' ',
		choices: [32],
		timing_stim: 500,
		timing_response: 2000,
		timing_feedback_duration: 1000,
		show_stim_with_feedback: false,
		timing_post_trial: 500,
		on_trial_start: update_count,
		on_finish: reset_count
	};
	image_monitoring_experiment.push(update_function)
	image_monitoring_experiment.push(practice_shape_block)
}

// set up test
for (b = 0; b < block_num; b++) {
	block = blocks[b]
	image_monitoring_experiment.push(start_test_block)
	var test_shape_block = {
		type: 'poldrack-single-stim',
		is_html: true,
		data: {
			exp_id: "image_monitoring",
			trial_id: "stim",
			exp_stage: "test"
		},
		timeline: block,
		choices: [32],
		timing_stim: 500,
		timing_response: 2500,
		response_ends_trial: false,
		timing_post_trial: 0
	};
	image_monitoring_experiment.push(test_shape_block)
	if ($.inArray(b, [0, 2, 3]) != -1) {
		image_monitoring_experiment.push(attention_node)
	}
}

image_monitoring_experiment.push(end_block)