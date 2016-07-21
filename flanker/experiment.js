/* ************************************ */
/* Define helper functions */
/* ************************************ */
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

var changeData = function() {
		data = jsPsych.data.getTrialsOfType('text')
		practiceDataCount = 0
		testDataCount = 0
		for (i = 0; i < data.length; i++) {
			if (data[i].trial_id == 'practice_intro') {
				practiceDataCount = practiceDataCount + 1
			} else if (data[i].trial_id == 'test_intro') {
				testDataCount = testDataCount + 1
			}
		}
		if (practiceDataCount >= 1 && testDataCount === 0) {
			//temp_id = data[i].trial_id
			jsPsych.data.addDataToLastTrial({
				exp_stage: "practice"
			})
		} else if (practiceDataCount >= 1 && testDataCount >= 1) {
			//temp_id = data[i].trial_id
			jsPsych.data.addDataToLastTrial({
				exp_stage: "test"
			})
		}
	}
	/* ************************************ */
	/* Define experimental variables */
	/* ************************************ */
	// generic task variables
var run_attention_checks = false
var attention_check_thresh = 0.45
var sumInstructTime = 0 //ms
var instructTimeThresh = 0 ///in seconds

// task specific variables
var correct_responses = jsPsych.randomization.repeat([
	["left arrow", 37],
	["right arrow", 39]
], 1)
var test_stimuli = [{
	image: '<div class = centerbox><div class = flanker-text>ffhff</div></div>',
	data: {
		correct_response: 72,
		condition: 'incompatible',
		trial_id: 'stim'
	}
}, {
	image: '<div class = centerbox><div class = flanker-text>hhfhh</div></div>',
	data: {
		correct_response: 70,
		condition: 'incompatible',
		trial_id: 'stim'
	}
}, {
	image: '<div class = centerbox><div class = flanker-text>hhhhh</div></div>',
	data: {
		correct_response: 72,
		condition: 'compatible',
		trial_id: 'stim'
	}
}, {
	image: '<div class = centerbox><div class = flanker-text>fffff</div></div>',
	data: {
		correct_response: 70,
		condition: 'compatible',
		trial_id: 'stim'
	}
}];

practice_len = 12 //5
exp_len = 100 //5
var practice_trials = jsPsych.randomization.repeat(test_stimuli, practice_len / 4, true);
var test_trials = jsPsych.randomization.repeat(test_stimuli, exp_len / 4, true);

var practice_response_array = [];
for (i = 0; i < practice_trials.data.length; i++) {
	practice_response_array.push(practice_trials.data[i].correct_response)
}

var test_response_array = [];
for (i = 0; i < test_trials.data.length; i++) {
	test_response_array.push(test_trials.data[i].correct_response)
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
	pages: [
		"<div class = centerbox><p class = block-text>In this experiment you will see five letters on the string composed of f's and h's. For instance, you might see 'fffff' or 'hhfhh'. Your task is to respond by pressing the key corresponding to the <strong>middle</strong> letter. So if you see 'ffhff' you would press the 'h' key.</p><p class = block-text>After each respond you will get feedback about whether you were correct or not. We will start with a short practice set.</p></div>"
	],
	allow_keys: false,
	data: {
		trial_id: "instruction"
	},
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
	timing_response: 180000,
	data: {
		trial_id: "end",
		exp_id: 'flanker'
	},
	text: '<div class = centerbox><p class = center-block-text>Thanks for completing this task!</p><p class = center-block-text>Press <strong>enter</strong> to continue.</p></div>',
	cont_key: [13],
	timing_post_trial: 0
};

var start_test_block = {
	type: 'poldrack-text',
	data: {
		trial_id: "test_intro"
	},
	timing_response: 180000,
	text: '<div class = centerbox><p class = center-block-text>Done with practice. Starting test.</p><p class = center-block-text>Press <strong>enter</strong> to begin.</p></div>',
	cont_key: [13],
	timing_post_trial: 1000
};

var fixation_block = {
	type: 'poldrack-single-stim',
	stimulus: '<div class = centerbox><div class = fixation>+</div></div>',
	is_html: true,
	data: {
		trial_id: "fixation"
	},
	choices: 'none',
	timing_stim: 500,
	timing_response: 500,
	timing_post_trial: 0,
	on_finish: changeData,
};

//Set up experiment
flanker_experiment = []
flanker_experiment.push(instruction_node);
for (i = 0; i < practice_len; i++) {
	flanker_experiment.push(fixation_block)
	var practice_block = {
		type: 'poldrack-categorize',
		stimulus: practice_trials.image[i],
		is_html: true,
		key_answer: practice_response_array[i],
		correct_text: '<div class = centerbox><div style="color:green"; class = center-text>Correct!</div></div>',
		incorrect_text: '<div class = centerbox><div style="color:red"; class = center-text>Incorrect</div></div>',
		timeout_message: '<div class = centerbox><div class = flanker-text>Respond faster</div></div>',
		choices: [70, 72],
		data: practice_trials.data[i],
		timing_feedback_duration: 1000,
		show_stim_with_feedback: false,
		timing_response: 1500,
		timing_post_trial: 500,
		on_finish: function() {
			jsPsych.data.addDataToLastTrial({
				exp_stage: "practice"
			})
		}
	}
	flanker_experiment.push(practice_block)
}
flanker_experiment.push(attention_node)
flanker_experiment.push(start_test_block)

/* define test block */
for (i = 0; i < exp_len; i++) {
	flanker_experiment.push(fixation_block)
	var test_block = {
		type: 'poldrack-categorize',
		stimulus: test_trials.image[i],
		is_html: true,
		key_answer: test_response_array[i],
		correct_text: '<div class = centerbox><div style="color:green"; class = center-text>Correct!</div></div>',
		incorrect_text: '<div class = centerbox><div style="color:red"; class = center-text>Incorrect</div></div>',
		timeout_message: '<div class = centerbox><div class = flanker-text>Respond faster!</div></div>',
		choices: [70, 72],
		data: test_trials.data[i],
		timing_feedback_duration: 1000,
		timing_response: 1500,
		show_stim_with_feedback: false,
		timing_post_trial: 500,
		on_finish: function() {
			jsPsych.data.addDataToLastTrial({
				exp_stage: "test"
			})
		}
	}
	flanker_experiment.push(test_block)
}
flanker_experiment.push(attention_node)
flanker_experiment.push(post_task_block)
flanker_experiment.push(end_block)