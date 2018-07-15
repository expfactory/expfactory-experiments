/* ************************************ */
/* Define helper functions */
/* ************************************ */
function assessPerformance() {
	var experiment_data = jsPsych.data.getTrialsOfType('poldrack-categorize')
	var missed_count = 0
	var trial_count = 0
	var rt_array = []
	var rt = 0
		//record choices participants made
	var choice_counts = {}
	choice_counts[-1] = 0
	for (var k = 0; k < choices.length; k++) {
		choice_counts[choices[k]] = 0
	}
	for (var i = 0; i < experiment_data.length; i++) {
		if (experiment_data[i].possible_responses != 'none') {
			trial_count += 1
			rt = experiment_data[i].rt
			key = experiment_data[i].key_press
			choice_counts[key] += 1
			if (rt == -1) {
				missed_count += 1
			} else {
				rt_array.push(rt)
			}
		}
	}
	//calculate average rt
	var avg_rt = -1
	if (rt_array.length !== 0) {
		avg_rt = math.median(rt_array)
	} 
	//calculate whether response distribution is okay
	var responses_ok = true
	Object.keys(choice_counts).forEach(function(key, index) {
		if (choice_counts[key] > trial_count * 0.85) {
			responses_ok = false
		}
	})
	var missed_percent = missed_count/trial_count
	credit_var = (missed_percent < 0.4 && avg_rt > 200 && responses_ok)
	jsPsych.data.addDataToLastTrial({"credit_var": credit_var})
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

var getInstructFeedback = function() {
	return '<div class = centerbox><p class = center-block-text>' + feedback_instruct_text +
		'</p></div>'
}

/* ************************************ */
/* Define experimental variables */
/* ************************************ */
// generic task variables
var run_attention_checks = false
var attention_check_thresh = 0.45
var sumInstructTime = 0 //ms
var instructTimeThresh = 0 ///in seconds
var credit_var = 0

// task specific variables
var congruent_stim = [{
	stimulus: '<div class = centerbox><div class = stroop-stim style = "color:red">RED</div></div>',
	data: {
		trial_id: 'stim',
		condition: 'congruent',
		stim_color: 'red',
		stim_word: 'red',
		correct_response: 82
	},
	key_answer: 82
}, {
	stimulus: '<div class = centerbox><div class = stroop-stim style = "color:blue">BLUE</div></div>',
	data: {
		trial_id: 'stim',
		condition: 'congruent',
		stim_color: 'blue',
		stim_word: 'blue',
		correct_response: 66
	},
	key_answer: 66
}, {
	stimulus: '<div class = centerbox><div class = stroop-stim style = "color:green">GREEN</div></div>',
	data: {
		trial_id: 'stim',
		condition: 'congruent',
		stim_color: 'green',
		stim_word: 'green',
		correct_response: 71
	},
	key_answer: 71
}];

var incongruent_stim = [{
	stimulus: '<div class = centerbox><div class = stroop-stim style = "color:red">BLUE</div></div>',
	data: {
		trial_id: 'stim',
		condition: 'incongruent',
		stim_color: 'red',
		stim_word: 'blue',
		correct_response: 82
	},
	key_answer: 82
}, {
	stimulus: '<div class = centerbox><div class = stroop-stim style = "color:red">GREEN</div></div>',
	data: {
		trial_id: 'stim',
		condition: 'incongruent',
		stim_color: 'red',
		stim_word: 'green',
		correct_response: 82
	},
	key_answer: 82
}, {
	stimulus: '<div class = centerbox><div class = stroop-stim style = "color:blue">RED</div></div>',
	data: {
		trial_id: 'stim',
		condition: 'incongruent',
		stim_color: 'blue',
		stim_word: 'red',
		correct_response: 66
	},
	key_answer: 66
}, {
	stimulus: '<div class = centerbox><div class = stroop-stim style = "color:blue">GREEN</div></div>',
	data: {
		trial_id: 'stim',
		condition: 'incongruent',
		stim_color: 'blue',
		stim_word: 'green',
		correct_response: 66
	},
	key_answer: 66
}, {
	stimulus: '<div class = centerbox><div class = stroop-stim style = "color:green">RED</div></div>',
	data: {
		trial_id: 'stim',
		condition: 'incongruent',
		stim_color: 'green',
		stim_word: 'red',
		correct_response: 71
	},
	key_answer: 71
}, {
	stimulus: '<div class = centerbox><div class = stroop-stim style = "color:green">BLUE</div></div>',
	data: {
		trial_id: 'stim',
		condition: 'incongruent',
		stim_color: 'green',
		stim_word: 'blue',
		correct_response: 71
	},
	key_answer: 71
}];
var stims = [].concat(congruent_stim, congruent_stim, incongruent_stim)
var practice_len = 24
var practice_stims = jsPsych.randomization.repeat(stims, practice_len / 12, true)
var exp_len = 96
var test_stims = jsPsych.randomization.repeat(stims, exp_len / 12, true)
var choices = [66, 71, 82]
var exp_stage = 'practice'

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
var response_keys =
	'<ul list-text><li><span class = "large" style = "color:red">WORD</span>: "R key"</li><li><span class = "large" style = "color:blue">WORD</span>: "B key"</li><li><span class = "large" style = "color:green">WORD</span>: "G key"</li></ul>'


var feedback_instruct_text =
	'Welcome to the experiment. This experiment will take about 8 minutes. Press <strong>enter</strong> to begin.'
var feedback_instruct_block = {
	type: 'poldrack-text',
	data: {
		trial_id: "instruction"
	},
	cont_key: [13],
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
		'<div class = centerbox><p class = block-text>In this experiment you will see "color" words (RED, BLUE, GREEN) appear one at a time. The "ink" of the words also will be colored. For example, you may see: <span class = "large" style = "color:blue">RED</span>, <span class = "large" style = "color:blue">BLUE</span> or <span class = "large" style = "color:red">BLUE</span>.</p><p class = block-text>Your task is to press the button corresponding to the <strong> ink color </strong> of the word. It is important that you respond as quickly and accurately as possible. The response keys are as follows:</p>' +
		response_keys + '</div>'
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
		trial_id: "end",
    	exp_id: 'stroop'
	},
	timing_response: 180000,
	text: '<div class = centerbox><p class = center-block-text>Thanks for completing this task!</p><p class = center-block-text>Press <strong>enter</strong> to continue.</p></div>',
	cont_key: [13],
	timing_post_trial: 0,
	on_finish: assessPerformance
};

var start_practice_block = {
	type: 'poldrack-text',
	data: {
		trial_id: "practice_intro"
	},
	timing_response: 180000,
	text: '<div class = centerbox><p class = block-text>We will start with a few practice trials. Remember, press the key corresponding to the <strong>ink</strong> color of the word: "r" for words colored red, "b" for words colored blue, and "g" for words colored green.</p><p class = block-text>Press <strong>enter</strong> to begin practice.</p></div>',
	cont_key: [13],
	timing_post_trial: 1000
};

var start_test_block = {
	type: 'poldrack-text',
	data: {
		trial_id: "test_intro"
	},
	timing_response: 180000,
	text: '<div class = centerbox><p class = center-block-text>We will now start the test. Respond exactly like you did during practice.</p><p class = center-block-text>Press <strong>enter</strong> to begin the test.</p></div>',
	cont_key: [13],
	timing_post_trial: 1000,
	on_finish: function() {
		exp_stage = 'test'
	}
};

var fixation_block = {
	type: 'poldrack-single-stim',
	stimulus: '<div class = centerbox><div class = fixation>+</div></div>',
	is_html: true,
	choices: 'none',
	data: {
		trial_id: "fixation"
	},
	timing_post_trial: 500,
	timing_stim: 500,
	timing_response: 500,
	on_finish: function() {
		jsPsych.data.addDataToLastTrial({'exp_stage': exp_stage})
	},
}

/* create experiment definition array */
stroop_experiment = []
stroop_experiment.push(instruction_node)
stroop_experiment.push(start_practice_block)
	/* define test trials */
for (i = 0; i < practice_len; i++) {
	stroop_experiment.push(fixation_block)
	var practice_block = {
		type: 'poldrack-categorize',
		stimulus: practice_stims.stimulus[i],
		data: practice_stims.data[i],
		key_answer: practice_stims.key_answer[i],
		is_html: true,
		correct_text: '<div class = fb_box><div class = center-text><font size = 20>Correct!</font></div></div>',
		incorrect_text: '<div class = fb_box><div class = center-text><font size = 20>Incorrect</font></div></div>',
		timeout_message: '<div class = fb_box><div class = center-text><font size = 20>Respond Faster!</font></div></div>',
		choices: choices,
		timing_response: 1500,
		timing_stim: -1,
		timing_feedback_duration: 500,
		show_stim_with_feedback: true,
		timing_post_trial: 250,
		on_finish: function() {
			jsPsych.data.addDataToLastTrial({
				trial_id: 'stim',
				exp_stage: 'practice'
			})
		}
	}
	stroop_experiment.push(practice_block)
}
stroop_experiment.push(attention_node)


stroop_experiment.push(start_test_block)
	/* define test trials */
for (i = 0; i < exp_len; i++) {
	stroop_experiment.push(fixation_block)
	var test_block = {
		type: 'poldrack-categorize',
		stimulus: test_stims.stimulus[i],
		data: test_stims.data[i],
		key_answer: test_stims.key_answer[i],
		is_html: true,
		correct_text: '<div class = fb_box><div class = center-text><font size = 20>Correct!</font></div></div>',
		incorrect_text: '<div class = fb_box><div class = center-text><font size = 20>Incorrect</font></div></div>',
		timeout_message: '<div class = fb_box><div class = center-text><font size = 20>Respond Faster!</font></div></div>',
		choices: choices,
		timing_response: 1500,
		timing_stim: -1,
		timing_feedback_duration: 500,
		show_stim_with_feedback: true,
		timing_post_trial: 250,
		on_finish: function() {
			jsPsych.data.addDataToLastTrial({
				trial_id: 'stim',
				exp_stage: 'test'
			})
		}
	}
	stroop_experiment.push(test_block)
}
stroop_experiment.push(attention_node)
stroop_experiment.push(post_task_block)
stroop_experiment.push(end_block)