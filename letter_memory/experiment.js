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

var randomDraw = function(lst) {
	var index = Math.floor(Math.random() * (lst.length))
	return lst[index]
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
var attention_check_thresh = 0.65
var sumInstructTime = 0 //ms
var instructTimeThresh = 0 ///in seconds

// task specific variables
var letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'

var practice_block_num = 2
var practice_blocks = []
var practice_seq_lengths = [5, 7]
var pathSource = '<div class = centerbox><div class = center-text>'

for (var b = 0; b < practice_block_num; b++) {
	var num_trials = practice_seq_lengths[b]
	var block_trials = []
	for (var i = 0; i < num_trials; i++) {
		var stim = randomDraw(letters)
		var tmp_obj = {
			stimulus: '<div class = centerbox><div class = center-text>' + stim +
				'</div></div>',
			data: {
				trial_id: 'stim',
				exp_stage: 'practice',
				sequence_length: num_trials,
				stimulus: stim
			}
		}
		block_trials.push(tmp_obj)
	}
	practice_blocks.push(block_trials)
}

var block_num = 12
var blocks = []
for (var b = 0; b < block_num; b++) {
	var num_trials = randomDraw([5, 7, 9, 11])
	var block_trials = []
	for (var i = 0; i < num_trials; i++) {
		var testStim = randomDraw(letters)
		var tmp_obj = {
			stimulus: '<div class = centerbox><div class = center-text>' + testStim +
				'</div></div>',
			data: {
				trial_id: 'stim',
				exp_stage: 'test',
				sequence_length: num_trials,
				stimulus: testStim
			}
		}
		block_trials.push(tmp_obj)
	}
	blocks.push(block_trials)
}

/* ************************************ */
/* Set up jsPsych blocks */
/* ************************************ */
// Set up attention check node
var attention_check_block = {
	type: 'attention-check',
	data: {
		trial_id: 'attention_check'
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
	data: {
		trial_id: 'instruction'
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
		trial_id: 'instruction'
	},
	pages: [
		'<div class = centerbox><p class = block-text>In this experiment you will see a sequence of letters presented one at a time. Your job is to remember the last four letters presented and report them at the end of the sequence.</p><p class = block-text>For instance, if the sequence F...J...K...N...F...L is presented, you would report KNFL.</p><p class = block-text>The sequences vary in length so it is important that you keep track of each letter. To ensure this, while doing the task repeat the last four letters (or less if less than four letters had been shown) out loud or to yourself while the letters are being presented.</p></div>',
		'<div class = centerbox><p class = block-text>We will start with two practice sequences. Following will be 12 test blocks.</p></div>'
	],
	allow_keys: false,
	show_clickable_nav: true,
	timing_post_trial: 01000
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
		exp_id: 'letter_memory'
	},
	timing_response: 180000,
	text: '<div class = centerbox><p class = center-block-text>Thanks for completing this task!</p><p class = center-block-text>Press <strong>enter</strong> to begin.</p></div>',
	cont_key: [13],
	timing_post_trial: 0
};

var start_practice_block = {
	type: 'poldrack-text',
	data: {
		trial_id: 'practice_intro'
	},
	timing_response: 180000,
	text: '<div class = centerbox><p class = center-block-text>Starting a practice block.</p><p class = center-block-text>Press <strong>enter</strong> to begin.</p></div>',
	cont_key: [13],
	timing_post_trial: 1000
};

var start_test_block = {
	type: 'poldrack-text',
	data: {
		trial_id: 'test_intro'
	},
	timing_response: 180000,
	text: '<div class = centerbox><p class = center-block-text>Starting a test block.</p><p class = center-block-text>Press <strong>enter</strong> to begin.</p></div>',
	cont_key: [13],
	timing_post_trial: 1000
};


//Set up experiment
var letter_memory_experiment = []
letter_memory_experiment.push(instruction_node);

// set up practice
for (var b = 0; b < practice_block_num; b++) { 
	block = practice_blocks[b]
	letter_memory_experiment.push(start_practice_block)
	var letter_seq_block = {
		type: 'poldrack-single-stim',
		is_html: true,
		timeline: practice_blocks[b],
		choices: 'none',
		timing_stim: 2000,
		timing_response: 2000,
		timing_post_trial: 0,
	};
	letter_memory_experiment.push(letter_seq_block)

	var response_block = {
		type: 'survey-text',
		questions: [
			['<p class = center-block-text>What were the last four letters in the last sequence?</p>']
		],
		data: {
			trial_id: 'response',
			exp_stage: 'practice',
			condition: blocks[b].length
		}
	}
	letter_memory_experiment.push(response_block)
}


// set up test
for (var b = 0; b < block_num; b++) { 
	block = blocks[b]
	letter_memory_experiment.push(start_test_block)
	var letter_seq_block = {
		type: 'poldrack-single-stim',
		is_html: true,
		timeline: blocks[b],
		choices: 'none',
		timing_stim: 2000,
		timing_response: 2000,
		timing_post_trial: 0,
	};
	letter_memory_experiment.push(letter_seq_block)

	var response_block = {
		type: 'survey-text',
		questions: [
			['<p class = center-block-text>What were the last four letters in the last sequence?</p>']
		],
		data: {
			trial_id: 'response',
			exp_stage: 'test',
			condition: blocks[b].length
		}
	}
	letter_memory_experiment.push(response_block)
	if ($.inArray(b, [2, 4, 11]) != -1) {
		letter_memory_experiment.push(attention_node)
	}
}

letter_memory_experiment.push(post_task_block)
letter_memory_experiment.push(end_block)
