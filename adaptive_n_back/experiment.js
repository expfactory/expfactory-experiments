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

function assessPerformance() {
	var experiment_data = jsPsych.data.getTrialsOfType('poldrack-single-stim')
	var missed_count = 0
	var rt_array = []
	var rt = 0
	for (var i = 0; i < experiment_data.length; i++)
		rt = experiment_data[i].rt
		if (typeof rt !== 'undefined') {
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
	var avg_rt = sum/rt_array.length
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
var record_acc = function(data) {
	var target_lower = data.target.toLowerCase()
	var key = data.key_press
	if (curr_stim == target_lower && key == 32) {
		correct = 'correct'
		block_acc += 1
	} else if (curr_stim != target_lower && key == -1) {
		correct = 'correct'
		block_acc += 1
	} else {
		correct = 'incorrect'
	}
	jsPsych.data.addDataToLastTrial({
		correct: correct,
		stim: curr_stim
	})
	current_trial = current_trial + 1
};

var update_delay = function() {
	var acc = block_acc/num_trials
	if (delay >= 2) {
		if (acc > acc_thresh) {
			delay += 1
		} else if (acc < (1 - acc_thresh)) {
			delay -= 1
		}
	} else if (delay == 1) {
		if (acc > acc_thresh) {
			delay += 1
		} 
	}
	block_acc = 0
};

var update_target = function() {
	if (stims.length >= delay) {
		target = stims.slice(-delay)[0]
	} else {
		target = ""
	}
};

var getStim = function() {
	curr_stim = randomDraw(letters)
	stims.push(curr_stim)
	return '<div class = "centerbox"><div class = "center-text">' + curr_stim + '</div></div>'
}

var getData = function() {
	return {
		trial_id: "stim",
		exp_stage: "test",
		load: delay,
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
var run_attention_checks = false
var attention_check_thresh = 0.65
var sumInstructTime = 0 //ms
var instructTimeThresh = 0 ///in seconds

// task specific variables
var letters = 'bBdDgGtTvV'
var num_blocks = 20 // number of adaptive blocks
var num_trials = 25 // per block  
var control_before = Math.round(Math.random()) //0 control comes before test, 1, after
var block_acc = 0 // record block accuracy to determine next blocks delay
var delay = 2 // starting delay
var acc_thresh = 0.8 // percent correct above which the delay is increased (or decreased if percent correct is under 1-acc_thresh
var current_trial = 0
var target = ""
var curr_stim = ''
var stims = [] //hold stims per block
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
var feedback_instruct_text =
	'Welcome to the experiment. Press <strong>enter</strong> to begin.'
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
	timing_post_trial: 0, 
	on_finish: assessPerformance
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
	timing_post_trial: 2000
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
	timing_post_trial: 2000
};

//Define control (0-back) block
var control_trials = []
for (var i = 0; i < num_trials; i++) {
	var control_block = {
		type: 'poldrack-single-stim',
		is_html: true,
		stimulus: getStim,
		data: {
			trial_id: "stim",
			exp_stage: "control",
			load: 0,
			target: 't',
			trial_num: current_trial
		},
		choices: [32],
		timing_stim: 500,
		timing_response: 2000,
		timing_post_trial: 0,
		on_finish: function(data) {
			record_acc(data)
		}
	};
	control_trials.push(control_block)
}

//Set up experiment
var adaptive_n_back_experiment = []
adaptive_n_back_experiment.push(instruction_node);

if (control_before === 0) {
	adaptive_n_back_experiment.push(start_control_block)
	adaptive_n_back_experiment = adaptive_n_back_experiment.concat(control_trials)
}

for (var b = 0; b < num_blocks; b++) {
	var start_delay_block = {
		type: 'poldrack-text',
		data: {
			exp_id: "adaptive_n_back",
			trial_id: "delay_text"
		},
		text: getText,
		cont_key: [13],
		on_finish: function() {
			stims = []
		}
	};
	adaptive_n_back_experiment.push(start_delay_block)
	adaptive_n_back_experiment.push(start_test_block)
	for (var i = 0; i < num_trials; i++) {
		adaptive_n_back_experiment.push(update_target_block)
		var test_block = {
			type: 'poldrack-single-stim',
			is_html: true,
			stimulus: getStim,
			data: getData,
			choices: [32],
			timing_stim: 500,
			timing_response: 2000,
			timing_post_trial: 0,
			on_finish: function(data) {
				record_acc(data)
			}
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