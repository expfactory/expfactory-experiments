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
		'exp_id': 'adaptive_n_back'
	})
}

var getInstructFeedback = function() {
	return '<div class = centerbox><p class = center-block-text>' + feedback_instruct_text +
		'</p></div>'
}

var randomDraw = function(lst) {
	var index = Math.floor(Math.random() * (lst.length))
	return lst[index]
};

//Calculates whether the last trial was correct and records the accuracy in data object
var record_acc = function() {
	var global_trial = jsPsych.progress().current_trial_global
	var stim_tmp = jsPsych.data.getData()[global_trial].stim.toLowerCase()
	var target_tmp = jsPsych.data.getData()[global_trial].target.toLowerCase()
	var key = jsPsych.data.getData()[global_trial].key_press
	if (stim_tmp == target_tmp && key == 32) {
		jsPsych.data.addDataToLastTrial({
			correct: 'correct'
		})
		block_acc += 1
	} else if (stim_tmp != target_tmp && key == -1) {
		jsPsych.data.addDataToLastTrial({
			correct: 'correct'
		})
		block_acc += 1
	} else {
		jsPsych.data.addDataToLastTrial({
			correct: 'incorrect'
		})
	}
	current_trial = current_trial + 1
};

var update_delay = function() {
	if (delay >= 2) {
		if (block_acc / num_trials > acc_thresh) {
			delay = delay + 1
		} else if (block_acc / num_trials < (1 - acc_thresh)) {
			delay = delay - 1
		}
	} else if (delay == 1) {
		if (block_acc / num_trials > acc_thresh) {
			delay = delay + 1
		} else {
			delay = 1
		}
	}
	block_acc = 0
};

var update_target = function() {
	if (current_trial % num_trials >= delay) {
		target = stims[current_trial - delay]
	} else {
		target = ""
	}
};

var getData = function() {
	return {
		exp_id: "adaptive_n_back",
		trial_id: "stim",
		exp_stage: "test",
		load: delay,
		stim: stims[current_trial],
		target: target,
		trial_num: current_trial
	}
}

var getText = function() {
	return '<div class = "centerbox"><p class = "block-text">In these next blocks, you should respond when the current letter matches the letter that appeared ' +
		delay +
		' trials before.</p><p class = center-block-text>Press <strong>enter</strong> to begin.</p></div>'
}

/* ************************************ */
/* Define experimental variables */
/* ************************************ */
// generic task variables
var run_attention_checks = true
var attention_check_thresh = 0.65
var sumInstructTime = 0 //ms
var instructTimeThresh = 1 ///in seconds

// task specific variables
var letters = 'bBdDgGtTvV'
var num_blocks = 20
var num_trials = 25 // per block  
var control_before = Math.round(Math.random()) //0 control comes before test, 1, after
var block_acc = 0 // record block accuracy to determine next blocks delay
var delay = 2 // starting delay
var acc_thresh = 0.8 // percent correct above which the delay is increased (or decreased if percent correct is under 1-acc_thresh
var current_trial = 0
var target = ""
var stims = []
var gap = 0

/* ************************************ */
/* Set up jsPsych blocks */
/* ************************************ */
// Set up attention check node
var attention_check_block = {
	type: 'attention-check',
	data: {
		exp_id: "adaptive_n_back",
		trial_id: "attention"
	},
	timing_response: 180000,
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
	text: '<div class = "centerbox"><p class = "center-block-text">Welcome to the experiment. Press <strong>enter</strong> to begin.</p></div>',
	cont_key: [13],
	data: {
		exp_id: "adaptive_n_back",
		trial_id: "welcome"
	},
	timing_response: 180000,
	timing_post_trial: 0
};

var feedback_instruct_text =
	'Starting with instructions.  Press <strong> Enter </strong> to continue.'
var feedback_instruct_block = {
	type: 'poldrack-text',
	cont_key: [13],
	data: {
		exp_id: "adaptive_n_back",
		trial_id: "instructions"
	},
	text: getInstructFeedback,
	timing_post_trial: 0,
	timing_response: 180000
};
/// This ensures that the subject does not read through the instructions too quickly.  If they do it too quickly, then we will go over the loop again.
var instruction_trials = []
var instructions_block = {
	type: 'poldrack-instructions',
	pages: [
		'<div class = "centerbox"><p class = "block-text">In this experiment you will see a sequence of letters presented one at a time. Your job is to respond by pressing the spacebar when the letter matches the same letter that occured some number of trials before (the number of trials is called the "delay"). The letters will be both lower and upper case. You should ignore the case (so "t" matches "T")</p><p class = block-text>The specific delay you should pay attention to will differ between blocks of trials, and you will be told the delay before starting a trial block.</p><p class = block-text>For instance, if the delay is 2, you are supposed to respond when the current letter matches the letter that occured 2 trials ago. If you saw the sequence: g...G...v...T...b...t, you would respond only on the last "t".</p></div>'
	],
	data: {
		exp_id: "adaptive_n_back",
		trial_id: "instructions"
	},
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

var update_delay_block = {
	type: 'call-function',
	func: update_delay,
	data: {
		exp_id: "adaptive_n_back",
		trial_id: "update_delay"
	},
	timing_post_trial: 0
}

var update_target_block = {
	type: 'call-function',
	func: update_target,
	data: {
		exp_id: "adaptive_n_back",
		trial_id: "update_target"
	},
	timing_post_trial: 0
}

var end_block = {
	type: 'poldrack-text',
	text: '<div class = "centerbox"><p class = "center-block-text">Thanks for completing this task!</p><p class = center-block-text>Press <strong>enter</strong> to begin.</p></div>',
	cont_key: [13],
	data: {
		trial_id: "text"
	},
	timing_response: 180000,
	timing_post_trial: 0
};

var start_practice_block = {
	type: 'poldrack-text',
	text: '<div class = "centerbox"><p class = "center-block-text">Starting a practice block.</p><p class = "center-block-text">Press <strong>enter</strong> to begin.</p></div>',
	cont_key: [13],
	data: {
		exp_id: "adaptive_n_back",
		trial_id: "text"
	},
	timing_response: 180000,
	timing_post_trial: 1000
};

var start_test_block = {
	type: 'poldrack-text',
	text: '<div class = "centerbox"><p class = "center-block-text">Starting a test block.</p><p class = "center-block-text">Press <strong>enter</strong> to begin.</p></div>',
	cont_key: [13],
	data: {
		exp_id: "adaptive_n_back",
		trial_id: "text"
	},
	timing_response: 180000,
	timing_post_trial: 1000
};

var start_control_block = {
	type: 'poldrack-text',
	text: '<div class = "centerbox"><p class = "block-text">In this block you do not have to match letters to previous letters. Instead, press the spacebar everytime you see a "t" or "T".</p><p class = "center-block-text">Press <strong>enter</strong> to begin.</p></div>',
	cont_key: [13],
	data: {
		exp_id: "adaptive_n_back",
		trial_id: "text"
	},
	timing_response: 180000,
	timing_post_trial: 1000
};

//Define control (0-back) block
var control_trials = []
for (var i = 0; i < num_trials; i++) {
	var stim = randomDraw(letters)
	var control_block = {
		type: 'poldrack-single-stim',
		is_html: true,
		stimulus: '<div class = "centerbox"><div class = "center-text">' + stim + '</div></div>',
		data: {
			exp_id: "adaptive_n_back",
			trial_id: "stim",
			exp_stage: "test",
			load: 0,
			stim: stim,
			target: 't',
			trial_num: current_trial
		},
		choices: [32],
		timing_stim: 500,
		timing_response: 2000,
		response_ends_trial: false,
		timing_post_trial: 0,
		on_finish: record_acc
	};
	control_trials.push(control_block)
	current_trial = current_trial + 1
}

//Set up experiment
var adaptive_n_back_experiment = []
adaptive_n_back_experiment.push(welcome_block);
adaptive_n_back_experiment.push(instruction_node);

if (control_before === 0) {
	adaptive_n_back_experiment.push(start_control_block)
	adaptive_n_back_experiment = adaptive_n_back_experiment.concat(control_trials)
}
stims = []
for (var b = 0; b < num_blocks; b++) {
	current_trial = 0
	var start_delay_block = {
		type: 'poldrack-text',
		data: {
			exp_id: "adaptive_n_back",
			trial_id: "delay_text"
		},
		text: getText(),
		cont_key: [13]
	};
	adaptive_n_back_experiment.push(start_delay_block)
	adaptive_n_back_experiment.push(start_test_block)
	for (var i = 0; i < num_trials; i++) {
		var stim = randomDraw(letters)
		stims.push(stim)
		adaptive_n_back_experiment.push(update_target_block)
		var test_block = {
			type: 'poldrack-single-stim',
			is_html: true,
			stimulus: '<div class = "centerbox"><div class = "center-text">' + stim + '</div></div>',
			data: getData(),
			choices: [32],
			timing_stim: 500,
			timing_response: 2000,
			response_ends_trial: false,
			timing_post_trial: 0,
			on_finish: record_acc
		};
		adaptive_n_back_experiment.push(test_block)
	}
	if ($.inArray(b, [4, 7, 15]) != -1) {
		adaptive_n_back_experiment.push(attention_node)
	}
	adaptive_n_back_experiment.push(update_delay_block)
}



if (control_before == 1) {
	adaptive_n_back_experiment.push(start_control_block)
	adaptive_n_back_experiment = adaptive_n_back_experiment.concat(control_trials)
}
//Set up control
adaptive_n_back_experiment.push(end_block)