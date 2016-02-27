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
		'exp_id': 'attention_network_task'
	})
}

function assessPerformance() {
	/* Function to calculate the "credit_var", which is a boolean used to
	credit individual experiments in expfactory. 
	 */
	var experiment_data = jsPsych.data.getTrialsOfType('poldrack-single-stim')
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
	//calculate average rt
	var sum = 0
	for (var j = 0; j < rt_array.length; j++) {
		sum += rt_array[j]
	}
	var avg_rt = sum / rt_array.length
		//calculate whether response distribution is okay
	var responses_ok = true
	Object.keys(choice_counts).forEach(function(key, index) {
		if (choice_counts[key] > trial_count * 0.85) {
			responses_ok = false
		}
	})
	credit_var = (avg_rt > 200) && responses_ok
}

var getInstructFeedback = function() {
	return '<div class = centerbox><p class = center-block-text>' + feedback_instruct_text +
		'</p></div>'
}

var post_trial_gap = function() {
	var curr_trial = jsPsych.progress().current_trial_global
	return 3500 - jsPsych.data.getData()[curr_trial - 1].rt - jsPsych.data.getData()[curr_trial - 4].duration
}

var get_RT = function() {
	var curr_trial = jsPsych.progress().current_trial_global
	return jsPsych.data.getData()[curr_trial].rt
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
var credit_var = true

// task specific variables
/* set up stim: location (2) * cue (4) * direction (2) * condition (3) */
var locations = ['up', 'down']
var cues = ['nocue', 'center', 'double', 'spatial']
var current_trial = 0
var exp_stage = 'practice'
var test_stimuli = []
var choices = [37, 39]

for (l = 0; l < locations.length; l++) {
	var loc = locations[l]
	for (ci = 0; ci < cues.length; ci++) {
		var c = cues[ci]
		stims = [{
			image: '<div class = centerbox><div class = ANT_text>+</div></div><div class = ANT_' + loc +
				'><div class = ANT_text> &mdash; &mdash; &larr; &mdash; &mdash;</div></div></div>',
			data: {
				correct_response: 37,
				flanker_middle_direction: 'left',
				flanker_type: 'neutral',
				flanker_location: loc,
				cue: c
			}
		}, {
			image: '<div class = centerbox><div class = ANT_text>+</div></div><div class = ANT_' + loc +
				'><div class = ANT_text> &larr; &larr; &larr; &larr; &larr; </div></div></div>',
			data: {
				correct_response: 37,
				flanker_middle_direction: 'left',
				flanker_type: 'congruent',
				flanker_location: loc,
				cue: c
			}
		}, {
			image: '<div class = centerbox><div class = ANT_text>+</div></div><div class = ANT_' + loc +
				'><div class = ANT_text> &rarr; &rarr; &larr; &rarr; &rarr; </div></div></div>',
			data: {
				correct_response: 37,
				flanker_middle_direction: 'left',
				flanker_type: 'incongruent',
				flanker_location: loc,
				cue: c
			}
		}, {
			image: '<div class = centerbox><div class = ANT_text>+</div></div><div class = ANT_' + loc +
				'><div class = ANT_text> &mdash; &mdash; &rarr; &mdash; &mdash; </div></div></div>',
			data: {
				correct_response: 39,
				flanker_middle_direction: 'right',
				flanker_type: 'neutral',
				flanker_location: loc,
				cue: c
			}
		}, {
			image: '<div class = centerbox><div class = ANT_text>+</div></div><div class = ANT_' + loc +
				'><div class = ANT_text> &rarr; &rarr; &rarr; &rarr; &rarr; </div></div></div>',
			data: {
				correct_response: 39,
				flanker_middle_direction: 'right',
				flanker_type: 'congruent',
				flanker_location: loc,
				cue: c
			}
		}, {
			image: '<div class = centerbox><div class = ANT_text>+</div></div><div class = ANT_' + loc +
				'><div class = ANT_text> &larr; &larr; &rarr; &larr; &larr; </div></div></div>',
			data: {
				correct_response: 39,
				flanker_middle_direction: 'right',
				flanker_type: 'incongruent',
				flanker_location: loc,
				cue: c
			}
		}]
		for (i = 0; i < stims.length; i++) {
			test_stimuli.push(stims[i])
		}
	}
}

/* set up 24 practice trials. Included all nocue up trials, center cue up trials, double cue down trials, and 6 spatial trials (3 up, 3 down) */
var practice_block = jsPsych.randomization.repeat(test_stimuli.slice(0, 12).concat(test_stimuli.slice(
	18, 21)).concat(test_stimuli.slice(36, 45)), 1, true);

/* set up repeats for three test blocks */
var block1_trials = jsPsych.randomization.repeat($.extend(true, [], test_stimuli), 1, true);
var block2_trials = jsPsych.randomization.repeat($.extend(true, [], test_stimuli), 1, true);
var block3_trials = jsPsych.randomization.repeat($.extend(true, [], test_stimuli), 1, true);
var blocks = [block1_trials, block2_trials, block3_trials]


/* ************************************ */
/* Set up jsPsych blocks */
/* ************************************ */
// Set up attention check node
var attention_check_block = {
	type: 'attention-check',
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
var practice_intro_block = {
	type: 'poldrack-text',
	text: '<div class = centerbox><p class = center-block-text>We will start with some practice. Press <strong>enter</strong> to begin.</p></div>',
	cont_key: [13],
	data: {
		trial_id: "intro",
		exp_stage: "practice"
	},
	timing_response: 180000,
	timing_post_trial: 1000
};

var test_intro_block = {
	type: 'poldrack-text',
	text: '<div class = centerbox><p class = center-block-text>We will now start the test.  Press <strong>enter</strong> to begin.</p></div>',
	cont_key: [13],
	data: {
		trial_id: "intro",
		exp_stage: "test"
	},
	timing_response: 180000,
	timing_post_trial: 1000,
	on_finish: function() {
		exp_stage = 'test'
	}
};

var end_block = {
	type: 'poldrack-text',
	text: '<div class = centerbox><p class = center-block-text>Thanks for completing this task!</p><p class = center-block-text>Press <strong>enter</strong> to continue.</p></div>',
	cont_key: [13],
	data: {
		trial_id: "end"
	},
	timing_response: 180000,
	timing_post_trial: 0,
	on_finish: assessPerformance
};

var feedback_instruct_text =
	'Welcome to the experiment. Press <strong>enter</strong> to begin.'
var feedback_instruct_block = {
	type: 'poldrack-text',
	cont_key: [13],
	text: getInstructFeedback,
	data: {
		trial_id: "instructions"
	},
	timing_post_trial: 0,
	timing_response: 180000
};
/// This ensures that the subject does not read through the instructions too quickly.  If they do it too quickly, then we will go over the loop again.
var instructions_block = {
	type: 'poldrack-instructions',
	pages: [
		'<div class = centerbox><p class = block-text>In this experiment you will see groups of five arrows and dashes pointing left or right (e.g &larr; &larr; &larr; &larr; &larr;, or &mdash; &mdash; &rarr; &mdash; &mdash;) presented randomly at the top or bottom of the screen.</p><p class = block-text>Your job is to indicate which way the central arrow is pointing by pressing the corresponding arrow key.</p></p></p></div>',
		'<div class = centerbox><p class = block-text>Before the arrows and dashes come up, an * will occasionally come up somewhere on the screen.</p><p class = block-text>Irrespective of whether or where the * appears, it is important that you respond as quickly and accurately as possible by pressing the arrow key corresponding to the direction of the center arrow.</p></div>'
	],
	allow_keys: false,
	data: {
		trial_id: "instructions"
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

var rest_block = {
	type: 'poldrack-text',
	text: '<div class = centerbox><p class = block-text>Take a break! Press any key to continue.</p></div>',
	timing_response: 180000,
	data: {
		trial_id: "rest block"
	},
	timing_post_trial: 1000
};

var fixation = {
	type: 'poldrack-single-stim',
	stimulus: '<div class = centerbox><div class = ANT_text>+</div></div>',
	is_html: true,
	choices: 'none',
	data: {
		trial_id: 'fixation',
		duration: 400
	},
	timing_post_trial: 0,
	timing_stim: 400,
	timing_response: 400,
	on_finish: function() {
		jsPsych.data.addDataToLastTrial({
			exp_stage: exp_stage
		})
	}
}

var no_cue = {
	type: 'poldrack-single-stim',
	stimulus: '<div class = centerbox><div class = ANT_text>+</div></div>',
	is_html: true,
	choices: 'none',
	data: {
		trial_id: 'nocue',
		duration: 100
	},
	timing_post_trial: 0,
	timing_stim: 100,
	timing_response: 100,
	on_finish: function() {
		jsPsych.data.addDataToLastTrial({
			exp_stage: exp_stage
		})
	}
}

var center_cue = {
	type: 'poldrack-single-stim',
	stimulus: '<div class = centerbox><div class = ANT_centercue_text>*</div></div>',
	is_html: true,
	choices: 'none',
	data: {
		trial_id: 'centercue',
		duration: 100
	},
	timing_post_trial: 0,
	timing_stim: 100,
	timing_response: 100,
	on_finish: function() {
		jsPsych.data.addDataToLastTrial({
			exp_stage: exp_stage
		})
	}

}

var double_cue = {
	type: 'poldrack-single-stim',
	stimulus: '<div class = centerbox><div class = ANT_text>+</div></div><div class = ANT_down><div class = ANT_text>*</div></div><div class = ANT_up><div class = ANT_text>*</div><div></div>',
	is_html: true,
	choices: 'none',
	data: {
		trial_id: 'doublecue',
		duration: 100
	},
	timing_post_trial: 0,
	timing_stim: 100,
	timing_response: 100,
	on_finish: function() {
		jsPsych.data.addDataToLastTrial({
			exp_stage: exp_stage
		})
	}
}

/* set up ANT experiment */
var attention_network_task_experiment = [];
attention_network_task_experiment.push(instruction_node);
attention_network_task_experiment.push(practice_intro_block);

/* set up ANT practice */
var trial_num = 0
var block = practice_block
for (i = 0; i < block.data.length; i++) {
	var trial_num = trial_num + 1
	var first_fixation_gap = Math.floor(Math.random() * 1200) + 400;
	var first_fixation = {
		type: 'poldrack-single-stim',
		stimulus: '<div class = centerbox><div class = ANT_text>+</div></div>',
		is_html: true,
		choices: 'none',
		data: {

			trial_id: 'fixation',
			exp_stage: 'practice',
			duration: 100
		},
		timing_post_trial: 0,
		timing_stim: first_fixation_gap,
		timing_response: first_fixation_gap
	}
	attention_network_task_experiment.push(first_fixation)

	if (block.data[i].cue == 'nocue') {
		attention_network_task_experiment.push(no_cue)
	} else if (block.data[i].cue == 'center') {
		attention_network_task_experiment.push(center_cue)
	} else if (block.data[i].cue == 'double') {
		attention_network_task_experiment.push(double_cue)
	} else {
		var spatial_cue = {
			type: 'poldrack-single-stim',
			stimulus: '<div class = centerbox><div class = ANT_' + block.data[i].location +
				'><div class = ANT_text>*</p></div></div>',
			is_html: true,
			choices: 'none',
			data: {

				trial_id: 'spatialcue',
				exp_stage: 'practice',
				duration: 100
			},
			timing_post_trial: 0,
			timing_stim: 100,
			timing_response: 100
		}
		attention_network_task_experiment.push(spatial_cue)
	}
	attention_network_task_experiment.push(fixation)

	block.data[i].trial_num = trial_num
	var attention_network_task_practice_trial = {
		type: 'poldrack-categorize',
		stimulus: block.image[i],
		is_html: true,
		key_answer: block.data[i].correct_response,
		correct_text: '<div class = centerbox><div style="color:green"; class = center-text>Correct!</div></div>',
		incorrect_text: '<div class = centerbox><div style="color:red"; class = center-text>Incorrect</div></div>',
		timeout_message: '<div class = centerbox><div class = center-text>Respond faster!</div></div>',
		choices: choices,
		data: block.data[i],
		timing_response: 1700,
		timing_stim: 1700,
		timing_feedback_duration: 1000,
		show_stim_with_feedback: false,
		timing_post_trial: 0,
		on_finish: function() {
			jsPsych.data.addDataToLastTrial({
				exp_stage: exp_stage
			})
		}

	}
	attention_network_task_experiment.push(attention_network_task_practice_trial)

	var last_fixation = {
		type: 'poldrack-single-stim',
		stimulus: '<div class = centerbox><div class = ANT_text>+</div></div>',
		is_html: true,
		choices: 'none',
		data: {

			trial_id: 'fixation',
			exp_stage: 'practice',
			duration: 100
		},
		timing_post_trial: 0,
		timing_stim: post_trial_gap,
		timing_response: post_trial_gap,
	}
	attention_network_task_experiment.push(last_fixation)
}
attention_network_task_experiment.push(rest_block)
attention_network_task_experiment.push(test_intro_block);


/* Set up ANT main task */
var trial_num = 0
for (b = 0; b < blocks.length; b++) {
	var block = blocks[b]
	for (i = 0; i < block.data.length; i++) {
		var trial_num = trial_num + 1
		var first_fixation_gap = Math.floor(Math.random() * 1200) + 400;
		var first_fixation = {
			type: 'poldrack-single-stim',
			stimulus: '<div class = centerbox><div class = ANT_text>+</div></div>',
			is_html: true,
			choices: 'none',
			data: {

				trial_id: "fixation",
				exp_stage: 'test',
				duration: first_fixation_gap
			},
			timing_post_trial: 0,
			timing_stim: first_fixation_gap,
			timing_response: first_fixation_gap
		}
		attention_network_task_experiment.push(first_fixation)

		if (block.data[i].cue == 'nocue') {
			attention_network_task_experiment.push(no_cue)
		} else if (block.data[i].cue == 'center') {
			attention_network_task_experiment.push(center_cue)
		} else if (block.data[i].cue == 'double') {
			attention_network_task_experiment.push(double_cue)
		} else {
			var spatial_cue = {
				type: 'poldrack-single-stim',
				stimulus: '<div class = centerbox><div class = ANT_' + block.data[i].location +
					'><div class = ANT_text>*</p></div></div>',
				is_html: true,
				choices: 'none',
				data: {

					trial_id: "spatialcue",
					exp_stage: 'test',
					duration: 100
				},
				timing_post_trial: 0,
				timing_stim: 100,
				timing_response: 100
			}
			attention_network_task_experiment.push(spatial_cue)
		}
		attention_network_task_experiment.push(fixation)

		block.data[i].trial_num = trial_num
		var ANT_trial = {
			type: 'poldrack-single-stim',
			stimulus: block.image[i],
			is_html: true,
			choices: choices,
			data: block.data[i],
			timing_response: 1700,
			timing_stim: 1700,
			timing_post_trial: 0,
			on_finish: function() {
				jsPsych.data.addDataToLastTrial({
					exp_stage: exp_stage
				})
			}
		}
		attention_network_task_experiment.push(ANT_trial)

		var last_fixation = {
			type: 'poldrack-single-stim',
			stimulus: '<div class = centerbox><div class = ANT_text>+</div></div>',
			is_html: true,
			choices: 'none',
			data: {

				trial_id: "fixation",
				exp_stage: 'test'
			},
			timing_post_trial: 0,
			timing_stim: post_trial_gap,
			timing_response: post_trial_gap,
		}
		attention_network_task_experiment.push(last_fixation)
	}
	attention_network_task_experiment.push(attention_node)
	attention_network_task_experiment.push(rest_block)
}
attention_network_task_experiment.push(end_block)