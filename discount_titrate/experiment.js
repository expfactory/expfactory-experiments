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
		'exp_id': 'discount_titrate'
	})
}

var getInstructFeedback = function() {
	return '<div class = centerbox><p class = center-block-text>' + feedback_instruct_text +
		'</p></div>'
}

// Function to generate random numbers from normal distribution
// Adapted from https://github.com/robbrit/randgen/blob/master/lib/randgen.js
function rnorm(mean, stdev) {
	var u1, u2, v1, v2, s;
	if (mean === undefined) {
		mean = 0.0;
	}
	if (stdev === undefined) {
		stdev = 1.0;
	}
	if (rnorm.v2 === null) {
		do {
			u1 = Math.random();
			u2 = Math.random();

			v1 = 2 * u1 - 1;
			v2 = 2 * u2 - 1;
			s = v1 * v1 + v2 * v2;
		} while (s === 0 || s >= 1);

		rnorm.v2 = v2 * Math.sqrt(-2 * Math.log(s) / s);
		return stdev * v1 * Math.sqrt(-2 * Math.log(s) / s) + mean;
	}

	v2 = rnorm.v2;
	rnorm.v2 = null;
	return stdev * v2 + mean;
}

rnorm.v2 = null;

//Funciton to repeat items in an array desired number of times
function fillArray(value, len) {
	var arr = [];
	for (var i = 0; i < len; i++) {
		for (var j = 0; j < value.length; j++) {
			arr.push(value[j]);
		}
	}
	return arr;
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
//First generate smaller amounts (mean = 20, sd = 10, clipped at 5 and 40)
var small_amts = [];
for (i = 0; i < 36; i++) {
	small_amts[i] = Math.round(rnorm(20, 10) * 100) / 100

	if (small_amts[i] < 5) {
		small_amts[i] = 5;
	}
	if (small_amts[i] > 40) {
		small_amts[i] = 40;
	}
}

//Based on smaller amounts generate larger amounts (1, 5, 10, 15, 20, 25, 30, 50, 75% higher)
var rel_dif = fillArray([1.01, 1.05, 1.10, 1.15, 1.20, 1.25, 1.30, 1.50, 1.75], 4)

var larger_amts = [];
for (i = 0; i < 36; i++) {
	larger_amts[i] = Math.round(small_amts[i] * rel_dif[i] * 100) / 100;
}

//Generate sooner delays (today or in 2 weeks - 18 each)
var sooner_dels = fillArray(["today"], 18).concat(fillArray(["2 weeks"], 18));

//Finally determine later delays (interval 2 or 4 weeks so half of the now trials: 2 weeks, half of now: 4 weeks, half of not now: 4 weeks, half of not now: 6 weeks)
var later_dels = fillArray(["2 weeks"], 9).concat(fillArray(["4 weeks"], 18)).concat(fillArray([
	"6 weeks"
], 9));

//Put all options in same object
var options = {
	small_amt: small_amts,
	sooner_del: sooner_dels,
	larger_amt: larger_amts,
	later_del: later_dels
}

var trials = [];

//loop through each option to create html
for (var i = 0; i < options.small_amt.length; i++) {
	trials.push({
		stimulus: "<div class = centerbox id='container'><p class = center-block-text>Please select the option that you would prefer pressing <strong>'q'</strong> for left <strong>'p'</strong> for right:</p><div class='table'><div class='row'><div id = 'option'><center><font color='green'>$" +
			options.small_amt[i] + "<br>" + options.sooner_del[i] +
			"</font></center></div><div id = 'option'><center><font color='green'>$" + options.larger_amt[
				i] +
			"<br>" + options.later_del[i] + "</font></center></div></div></div></div>",
		data: {
			smaller_amount: options.small_amt[i],
			larger_amount: options.larger_amt[i],
			sooner_delay: options.sooner_del[i],
			later_delay: options.later_del[i],
			trial_id: "stim",
			exp_stage: "test"
		}
	})
}

/* ************************************ */
/* Set up jsPsych blocks */
/* ************************************ */
// Set up attention check node
var attention_check_block = {
	type: 'attention-check',
	data: {
		trial_id: "attention_check"
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
	data: {
		trial_id: "instructions"
	},
	cont_key: [13],
	text: getInstructFeedback,
	timing_post_trial: 0,
	timing_response: 180000
};
/// This ensures that the subject does not read through the instructions too quickly.  If they do it too quickly, then we will go over the loop again.
var instruction_trials = []
var instructions_block = {
	type: 'poldrack-instructions',
	data: {
		trial_id: "instructions"
	},
	pages: [
		'<div class = centerbox><p class = block-text>In this experiment you will be presented with two amounts of money to choose between. These amounts will be available at different time points. Your job is to indicate which option you would prefer by pressing <strong>"q"</strong> for the left option and <strong>"p"</strong> for the right option.</p><p class = block-text>You should indicate your <strong>true</strong> preference because at the end of the experiment a random trial will be chosen and you will receive a bonus payment proportional to the option you selected at the time point you chose.</p></div>',
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
		for (var i = 0; i < data.length; i++) {
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
			feedback_instruct_text =
				'Done with instructions. Press <strong>enter</strong> to continue.'
			return false
		}
	}
}

var start_practice_block = {
	type: 'poldrack-text',
	timing_response: 180000,
	data: {
		trial_id: "practice_intro"
	},
	text: '<div class = centerbox><p class = center-block-text>Here is a sample trial. Your choice for this trial will not be included in your bonus payment.</p><p class = center-block-text>Press <strong>enter</strong> to begin.</p></div>',
	cont_key: [13],
	timing_post_trial: 1000
};

var practice_block = {
	type: 'poldrack-single-stim',
	data: {
		trial_id: "stim",
		exp_stage: "practice",
		smaller_amount: '20.58',
		sooner_delay: 'today',
		larger_amount: '25.93',
		later_delay: '2 weeks'
	},
	stimulus: [
		"<div class = centerbox id='container'><p class = center-block-text>Please select the option that you would prefer pressing <strong>'q'</strong> for left <strong>'p'</strong> for right:</p><div class='table'><div class='row'><div id = 'option'><center><font color='green'>$20.58<br>today</font></center></div><div id = 'option'><center><font color='green'>$25.93<br>2 weeks</font></center></div></div></div></div>"
	],
	is_html: true,
	choices: [80, 81],
	response_ends_trial: true,
	on_finish: function(data) {
		whichKey = data.key_press
		if (whichKey == 81) {
			chosen_amount = data.smaller_amount
			chosen_delay = data.sooner_delay
		} else if (whichKey == 80) {
			chosen_amount = data.larger_amount
			chosen_delay = data.later_delay
		}

		jsPsych.data.addDataToLastTrial({
			chosen_amount: chosen_amount,
			chosen_delay: chosen_delay,
		})
	}
};

var start_test_block = {
	type: 'poldrack-text',
	data: {
		trial_id: "test_intro"
	},
	timing_response: 180000,
	text: '<div class = centerbox><p class = center-block-text>You are now ready to begin the survey.</p><p class = center-block-text>Remember to indicate your <strong>true</strong> preferences.</p><p class = center-block-text>Press <strong>enter</strong> to begin.</p></div>',
	cont_key: [13],
	timing_post_trial: 1000
};

var test_block = {
	type: 'poldrack-single-stim',
	timeline: trials,
	is_html: true,
	choices: [80, 81],
	randomize_order: true,
	response_ends_trial: true,
	on_finish: function(data) {
		whichKey = data.key_press
		if (whichKey == 81) {
			chosen_amount = data.smaller_amount
			chosen_delay = data.sooner_delay
		} else if (whichKey == 80) {
			chosen_amount = data.larger_amount
			chosen_delay = data.later_delay
		}

		jsPsych.data.addDataToLastTrial({
			chosen_amount: chosen_amount,
			chosen_delay: chosen_delay,
		})
	}
};

var end_block = {
	type: 'poldrack-text',
	timing_response: 180000,
	data: {
		trial_id: "end"
	},
	text: '<div class = centerbox><p class = center-block-text>Thanks for completing this task!</p><p class = center-block-text>Press <strong>enter</strong> to continue.</p></div>',
	cont_key: [13],
	timing_post_trial: 0
};


//Set up experiment
var discount_titrate_experiment = []
discount_titrate_experiment.push(instruction_node);
discount_titrate_experiment.push(start_practice_block);
discount_titrate_experiment.push(practice_block);
discount_titrate_experiment.push(start_test_block);
for (i = 0; i < trials.length; i++) {
	discount_titrate_experiment.push(test_block);
}
discount_titrate_experiment.push(attention_node)
discount_titrate_experiment.push(end_block)