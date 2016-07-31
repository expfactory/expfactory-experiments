/* ************************************ */
/* Define helper functions */
/* ************************************ */


var getInstructFeedback = function() {
	return '<div class = centerbox><p class = center-block-text>' + feedback_instruct_text +
		'</p></div>'
}

function assessPerformance() {
	/* Function to calculate the "credit_var", which is a boolean used to
	credit individual experiments in expfactory. */
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
	if (credit_var === true) {
	  performance_var = total_score
	} else {
	  performance_var = 0
	}
	jsPsych.data.addDataToLastTrial({"credit_var": credit_var, "performance_var": performance_var})
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

//Polar method for generating random samples from a norma distribution.
//Source: http://blog.yjl.im/2010/09/simulating-normal-random-variable-using.html
function normal_random(mean, variance) {
	if (mean === undefined)
		mean = 0.0;
	if (variance === undefined)
		variance = 1.0;
	var V1, V2, S;
	do {
		var U1 = Math.random();
		var U2 = Math.random();
		V1 = 2 * U1 - 1;
		V2 = 2 * U2 - 1;
		S = V1 * V1 + V2 * V2;
	} while (S > 1);

	X = Math.sqrt(-2 * Math.log(S) / S) * V1;
	//Y = Math.sqrt(-2 * Math.log(S) / S) * V2;
	X = mean + Math.sqrt(variance) * X;
	//Y = mean + Math.sqrt(variance) * Y ;
	return X;
}

var get_condition = function() {
	return condition
}

var get_current_trial = function() {
	return current_trial
}

var initialize_FB_matrix = function() {
	return [Math.random() * 0.5 + 0.25, Math.random() * 0.5 + 0.25, Math.random() * 0.5 + 0.25, Math.random() * 0.5 + 0.25]
}

//Change phase from practice to test
var change_phase = function() {
	if (curr_images == practice_images) {
		curr_images = test_images
		curr_colors = test_colors
		curr_fs_stims = test_fs_stims
		curr_ss_stims = test_ss_stim
		exp_stage = 'test'
	} else {
		curr_images = practice_images
		curr_colors = practice_colors
		curr_fs_stims = practice_fs_stims
		curr_ss_stim = practice_ss_stim
		exp_stage = 'practice'
	}
	total_score = 0
	current_trial = -1 //reset count
}


/*
Generate first stage stims. Takes in an array of images and colors (which change between practice anad test)
*/
var get_fs_stim = function(images, colors) {
	var fs_stim = [{
		stimulus: "<div class = decision-left style='background:" + colors[0] + "; '>" +
			"<img class = 'decision-stim' src= '" + images[0] + "'></img></div>" +
			"<div class = decision-right style='background:" + colors[0] + "; '>" +
			"<img class = 'decision-stim' src= '" + images[1] + "'></img></div>",
		stim_order: [0, 1]
	}, {
		stimulus: "<div class = decision-left style='background:" + colors[0] + "; '>" +
			"<img class = 'decision-stim' src= '" + images[1] + "'></img></div>" +
			"<div class = decision-right style='background:" + colors[0] + "; '>" +
			"<img class = 'decision-stim' src= '" + images[0] + "'></img></div>",
		stim_order: [1, 0]
	}]
	return fs_stim
}

/*
Generate second stage stims. Takes in an array of images and colors (which change between practice and test)
*/
var get_ss_stim = function(images, colors) {
	var ss_stim_array = [
		["<div class = decision-left style='background:" + colors[1] + "; '>" +
			"<img class = 'decision-stim' src= '" + images[2] + "'></img></div>" +
			"<div class = decision-right style='background:" + colors[1] + "; '>" +
			"<img class = 'decision-stim' src= '" + images[3] + "'></img></div>",
			"<div class = decision-left style='background:" + colors[1] + "; '>" +
			"<img class = 'decision-stim' src= '" + images[3] + "'></img></div>" +
			"<div class = decision-right style='background:" + colors[1] + "; '>" +
			"<img class = 'decision-stim' src= '" + images[2] + "'></img></div>"
		],
		["<div class = decision-left style='background:" + colors[2] + "; '>" +
			"<img class = 'decision-stim' src= '" + images[4] + "'></img></div>" +
			"<div class = decision-right style='background:" + colors[2] + "; '>" +
			"<img class = 'decision-stim' src= '" + images[5] + "'></img></div>",
			"<div class = decision-left style='background:" + colors[2] + "; '>" +
			"<img class = 'decision-stim' src= '" + images[5] + "'></img></div>" +
			"<div class = decision-right style='background:" + colors[2] + "; '>" +
			"<img class = 'decision-stim' src= '" + images[4] + "'></img></div>"
		]
	]

	var ss_stim = {
		stimulus: [ss_stim_array[0][0], ss_stim_array[0][1], ss_stim_array[1][0], ss_stim_array[1][1]],
		stim_order: [[2, 3], [3, 2], [4, 5], [5, 4]]
	}
	return ss_stim
}


/*
The following methods all support the user-dependent presentation of stimulus including animations, multiple stages
and FB. The "get_selected" functions also append data to the preceeding trials
*/

/* Selects the next first stage from a predefined, randomized list of first stages and increases the trial count*/
var choose_first_stage = function() {
	current_trial = current_trial + 1
	stim_ids = curr_fs_stims.stim_order[current_trial]
	return curr_fs_stims.stimulus[current_trial]
}

/*
After a stimulus is selected, an animation proceeds whereby the selected stimulus moves to the top of the screen while
the other stimulus fades. This function accomplishes this by creating a new html object to display composed of the old stim
with appropriate handles to start the relevant animations.

Also updates the global variables choice, first_selected and first_notselected, which are used in the next function
*/
var get_first_selected = function() {
	var first_stage_trial = jsPsych.data.getLastTrialData()
	var choice = choices.indexOf(first_stage_trial.key_press)
	if (choice != -1) {
		first_selected = stim_ids[choice]
		var first_notselected = stim_ids[1 - choice]
		jsPsych.data.addDataToLastTrial({
			stim_selected: first_selected
		})
		return "<div class = 'selected " + stim_side[choice] + "' style='background:" + curr_colors[0] +
			"; '>" +
			"<img class = 'decision-stim' src= '" + curr_images[first_selected] + "'></div>" +
			"<div class = '" + stim_side[1 - choice] + " fade' style='background:" + curr_colors[0] +
			"; '>" +
			"<img class = 'decision-stim  fade' src= '" + curr_images[first_notselected] + "'></div>"
	} else {
		first_selected = -1
		jsPsych.data.addDataToLastTrial({
			stim_selected: first_selected
		})
	}
}

/*
The second stage is probabilistically chosen based on the first stage choice. Each of the first stage stimulus is primarily associated
with one of two second stages, but the transition is ultimately probabilistic.

This function checks to see if there was any first stage response. If not, set the global variable FB_on to off and display a reminder
If an choice was taken, display the chosen stimulus at the top of the screen and select a second stage (choosing the one associated with the
choice 70% of the time). Randomly select a presentation order for the two stimulus associated with the second stage
*/
var choose_second_stage = function() {
	if (first_selected == -1) {
		FB_on = 0;
		return "<div class = centerbox><div class = center-text>" +
			"Please respond faster!</div></div>"
	} else {
		FB_on = 1;
		stage = first_selected
		transition = 'frequent'
		if (Math.random() < 0.3) {
			stage = 1 - stage
			transition = 'infrequent'
		}
		var stage_index = stage * 2
		var stim_index = stage_index + Math.round(Math.random())
		stim_ids = curr_ss_stims.stim_order[stim_index]
		return "<div class = 'decision-top faded' style='background:" + curr_colors[0] + "; '>" +
			"<img class = 'decision-stim' src= '" + curr_images[first_selected] + "'></div>" +
			curr_ss_stims.stimulus[stim_index]
	}
}

/*
Animates second stage choice, similarly to get_first_selected
*/
var get_second_selected = function() {
	var second_stage_trial = jsPsych.data.getLastTrialData()
	var choice = choices.indexOf(second_stage_trial.key_press)
	if (choice != -1) {
		second_selected = stim_ids[choice]
		var second_notselected = stim_ids[1 - choice]
		jsPsych.data.addDataToLastTrial({
			stim_selected: second_selected
		})
		return "<div class = '" + stim_side[choice] + " selected' style='background:" + curr_colors[
				stage + 1] + "; '>" +
			"<img class = 'decision-stim' src= '" + curr_images[second_selected] + "'></div>" +
			"<div class = 'fade " + stim_side[1 - choice] + "' style='background:" + curr_colors[stage + 1] +
			"; '>" +
			"<img class = 'decision-stim' src= '" + curr_images[second_notselected] + "'></div>"
	} else {
		second_selected = -1
		jsPsych.data.addDataToLastTrial({
			stim_selected: second_selected
		})
	}
	
}

/*
After each trial the FB_matrix is updated such that each of the 4 reward probabilities changes by a random amount
parametrized a Gaussian. Reward probabilities are bound by 25% and 75%
*/
var update_FB = function() {
	for (i = 0; i < FB_matrix.length; i++) {
		var curr_value = FB_matrix[i]
		var step = normal_random(0, 0.025 * 0.025)
		if (curr_value + step < 0.75 && curr_value + step > 0.25) {
			FB_matrix[i] = curr_value + step
		} else {
			FB_matrix[i] = curr_value - step
		}
	}
}

/*
If no choice was taken during the second stage display a reminder.
Otherwise, check the FB_matrix which determines the reward probabilities for each stimulus (there are 4 final stimulus associated with rewards:
2 for each of the 2 second stages). Flip a coin using the relevant probability and give FB.

After FB, the FB_atrix is updated.
*/
var get_feedback = function() {
	if (second_selected == -1) {
		return "<div class = centerbox><div class = center-text>" +
			"Please respond faster!</div></div>"
	} else if (Math.random() < FB_matrix[second_selected - 2]) {
		update_FB();
		FB = 1
		total_score += 1
		return "<div class = 'decision-top faded' style='background:" + curr_colors[stage + 1] + "; '>" +
			"<img class = 'decision-stim' src= '" + curr_images[second_selected] + "'></div>" +
			"<div><img  class = decision-fb src = '/static/experiments/two_stage_decision/images/gold_coin.png'></img></div>"
	} else {
		update_FB();
		FB = 0
		return "<div class = 'decision-top faded' style='background:" + curr_colors[stage + 1] + "; '>" +
			"<img class = 'decision-stim' src= '" + curr_images[second_selected] + "'></div>" +
			"<div style = text-align:center><p class = decision-fb style = 'color:red;font-size:60px'>0</p></div>"
	}
}

var update_FB_data = function() {
	jsPsych.data.addDataToLastTrial({
		feedback: FB,
		trial_num: current_trial,
		FB_probs: FB_matrix.slice(0)
	})
	return ""
}

/* ************************************ */
/* Define experimental variables */
/* ************************************ */
// generic task variables
var run_attention_checks = false
var attention_check_thresh = 0.62
var sumInstructTime = 0 //ms
var instructTimeThresh = 0 ///in seconds
var credit_var = true
var performance_var = 0

// task specific variables
var total_score = 0 //track performance
var practice_trials_num = 50
var test_trials_num = 200
var stim_ids = [] //Tracks the ids of the last chosen stims. 
var current_trial = -1
var first_selected = -1 //Tracks the ID of the selected fs stimulus
var second_selected = -1 //Tracks the ID of the selected fs stimulus
var FB_on = 1 //tracks whether FB should be displayed on this trial
var FB = -1 //tracks FB value
var stage = 0 //stage is used to track which second stage was shown, 0 or 1
var transition = ''
var FB_matrix = initialize_FB_matrix() //tracks the reward probabilities for the four final stimulus
var exp_stage = 'practice'

// Actions for left and right
var choices = [37, 39]
var stim_side = ['decision-left', 'decision-right']
var stim_move = ['selected-left', 'selected-right']

// Set up colors
var test_colors = jsPsych.randomization.shuffle(['#98bf21', '#FF9966', '#C2C2FF'])
var practice_colors = jsPsych.randomization.shuffle(['#F1B8D4', '#CCFF99', '#E0C2FF'])
var curr_colors = practice_colors

//The first two stims are first-stage stims.
//The next four are second-stage
var test_images = jsPsych.randomization.repeat(
	["/static/experiments/two_stage_decision/images/11.png",
		"/static/experiments/two_stage_decision/images/12.png",
		"/static/experiments/two_stage_decision/images/13.png",
		"/static/experiments/two_stage_decision/images/14.png",
		"/static/experiments/two_stage_decision/images/15.png",
		"/static/experiments/two_stage_decision/images/16.png",
	], 1)

var practice_images = jsPsych.randomization.repeat(
	["/static/experiments/two_stage_decision/images/80.png",
		"/static/experiments/two_stage_decision/images/81.png",
		"/static/experiments/two_stage_decision/images/82.png",
		"/static/experiments/two_stage_decision/images/83.png",
		"/static/experiments/two_stage_decision/images/84.png",
		"/static/experiments/two_stage_decision/images/85.png",
	], 1)

//Preload images
jsPsych.pluginAPI.preloadImages(practice_images)
jsPsych.pluginAPI.preloadImages(test_images)

var curr_images = practice_images

var test_fs_stim = get_fs_stim(test_images, test_colors)
var practice_fs_stim = get_fs_stim(practice_images, practice_colors)

var test_ss_stim = get_ss_stim(test_images, test_colors)
var practice_ss_stim = get_ss_stim(practice_images, practice_colors)

var test_fs_stims = jsPsych.randomization.repeat(test_fs_stim, test_trials_num, true);
var practice_fs_stims = jsPsych.randomization.repeat(practice_fs_stim, practice_trials_num, true);


var curr_fs_stims = practice_fs_stims
var curr_ss_stims = practice_ss_stim


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
var attention_check_block = {
	type: 'attention-check',
	data: {
		trial_id: 'attention_check'
	},
	timing_response: 180000,
	response_ends_trial: true,
	timing_post_trial: 200
}


var feedback_instruct_text =
	'Welcome to the experiment. This task will take about 25 minutes. Press <strong>enter</strong> to begin.'
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
		"<div class = centerbox><p class = block-text>In this task, you need to make decisions in two stages to get a reward. In each stage, two abstract shapes will come up on the screen overlaid on colored backgrounds. You choose one by pressing either the left or right arrow keys.</p><p class = block-text>Below is an example 'stage' with two shapes on colored backgrounds.</p><div class = decision-left style='background:" +
		curr_colors[0] + "; '><img class = 'decision-stim' src= '" + curr_images[0] +
		"'></img></div><div class = decision-right style='background:" + curr_colors[0] +
		"; '><img class = 'decision-stim' src= '" + curr_images[1] + "'></img></div></div>",
		'<div class = centerbox><p class = block-text>Both the first and second stages will look something like that. After you make your first-stage choice, you will move to one of two second-stages (referred to as 2a and 2b). Each second stage has its own background color and has two different abstract shapes.</p><p class = block-text>In total, the task has three "stages": a first stage which can lead to either stage 2a or stage 2b, each with their own background color and shapes.</p></div>',
		'<div class = centerbox><p class = block-text>Each first-stage choice is primarily associated with one of the two second-stages. This means that each first-stage choice is more likely to bring you to one of the two second-stages than the other.</p><p class = block-text>For instance, one first-stage shape may bring you to 2a most of the time, and seldom bring you to 2b, while the other shape does the reverse.</p><p class = block-text>After moving to one of the two second-stages, you respond by again pressing an arrow key.</p><p class = block-text>After you end these instructions you will see an example trial.</p></div>'
	],
	allow_keys: false,
	show_clickable_nav: true,
	timing_post_trial: 1000
}

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

var second_instructions_block = {
	type: 'poldrack-instructions',
	data: {
		trial_id: 'instruction'
	},
	pages: [
		'<div class = centerbox><p class = block-text>As you saw, you get feedback after your second-stage choice: either a gold coin or a red "0". The gold coins determine your bonus pay, so try to get as many as possible!</p><p class = block-text>As mentioned, there are four second-stage shapes: two shapes in 2a and two shapes in 2b. These four shapes each have a different chance of paying a gold coin. You want to learn which shape is the best so you can get as many coins as possible.</p></div>',
		'<div class = centerbox><p class = block-text>The chance of getting a coin from each second-stage shape changes over the experiment, so the best choice early on may not be the best choice later.</p><p class = block-text>In contrast, the chance of going to one of the second-stages after choosing one of the first-stage choices is fixed throughout the experiment. If you find over time that one first-stage shape brings you to 2a most of the time, it will stay that way for the whole experiment.</p></div>',
		'<div class = centerbox><p class = block-text>After you end instructions we will start with some practice.</p><p class = block-text>After practice we will show you the instructions again, but please make sure you understand them as well as you can now.</p></div>'
	],
	allow_keys: false,
	show_clickable_nav: true,
	timing_post_trial: 1000
}

var end_block = {
	type: 'poldrack-text',
	data: {
		trial_id: 'end',
    	exp_id: 'two_stage_decision'
	},
	text: '<div class = centerbox><p class = center-block-text>Thanks for completing this task!</p><p class = center-block-text>Press <strong>enter</strong> to continue.</p></div>',
	cont_key: [13],
	timing_response: 180000,
	timing_post_trial: 0,
	on_finish: assessPerformance
};

var wait_block = {
	type: 'poldrack-text',
	data: {
		trial_id: 'wait'
	},
	text: '<div class = centerbox><p class = center-block-text>Take a break!</p><p class = center-block-text>Press <strong>enter</strong> to continue.</p></div>',
	cont_key: [13],
	timing_response: 120000,
	timing_post_trial: 1000
};

var start_practice_block = {
	type: 'poldrack-text',
	data: {
		trial_id: 'practice_intro'
	},
	text: '<div class = centerbox><p class = center-block-text>Starting practice. Press <strong>enter</strong> to begin.</p></div>',
	cont_key: [13],
	timing_response: 180000,
	timing_post_trial: 1000
};

var start_test_block = {
	type: 'poldrack-text',
	data: {
		trial_id: 'test_intro'
	},
	text: "<div class = centerbox><p class = block-text>Finished with practice. We will now start the test with new shapes and stages.</p><p class = block-text>Just like in the practice, each first-stage choice is primarily associated with one second-stage and each second-stage shape has a different chance of earning a point. Each second-stage shape's chance of earning a gold coin changes over the expeirment, so the best shape early on may not be the best shape later. In contrast, once you learn which stage a first-stage choice brings you to most of the time, it will stay the same for the whole experiment.</p><p class = block-text>Your task is to earn as many gold coins as possible. Press <strong>enter</strong> to begin.</p></div>",
	cont_key: [13],
	timing_response: 180000,
	timing_post_trial: 1000
};

var intertrial_wait_update_FB = {
	type: "poldrack-single-stim",
	data: {
		trial_id: 'wait_update_FB'
	},
	stimulus: update_FB_data, //dummy stimulus. Returns "" but updates previous trial
	is_html: true,
	timing_post_trial: 0,
	timing_stim: 1000,
	timing_response: 1000
}

var intertrial_wait = {
	type: "poldrack-single-stim",
	data: {
		trial_id: 'wait'
	},
	stimulus: " ", //dummy stimulus. Returns "" but updates previous trial
	is_html: true,
	timing_post_trial: 0,
	timing_stim: 1000,
	timing_response: 1000
}

var change_phase_block = {
	type: 'call-function',
	data: {
		trial_id: 'change_phase'
	},
	func: change_phase,
	timing_post_trial: 0
}

//experiment blocks
var first_stage = {
	type: "poldrack-single-stim",
	stimulus: choose_first_stage,
	is_html: true,
	choices: choices,
	timing_stim: 2000,
	timing_response: 2000,
	show_response: true,
	timing_post_trial: 0,
	response_ends_trial: true,
	data: {
		trial_id: 'first_stage'
	},
	on_finish: function() {
		jsPsych.data.addDataToLastTrial({
			exp_stage: exp_stage,
			trial_num: current_trial,
			stim_order: stim_ids,
			stage: 0
		})
	}
}

var first_stage_selected = {
	type: "poldrack-single-stim",
	data: {
		trial_id: 'first_stage_selected'
	},
	stimulus: get_first_selected,
	choices: 'none',
	is_html: true,
	timing_post_trial: 0,
	timing_response: 1000,
	on_finish: function() {
		jsPsych.data.addDataToLastTrial({
			exp_stage: exp_stage
		})
	}
}

var second_stage = {
	type: "poldrack-single-stim",
	data: {
		trial_id: 'second_stage'
	},
	stimulus: choose_second_stage,
	is_html: true,
	choices: choices,
	timing_stim: 2000,
	timing_response: 2000,
	response_ends_trial: true,
	timing_post_trial: 0,
	on_finish: function() {
		jsPsych.data.addDataToLastTrial({
			exp_stage: exp_stage,
			trial_num: current_trial,
			stim_order: stim_ids,
			stage: stage + 1,
			stage_transition: transition
		})
	}
}

var second_stage_selected = {
	type: "poldrack-single-stim",
	data: {
		trial_id: 'second_stage_selected'
	},
	stimulus: get_second_selected,
	choices: 'none',
	is_html: true,
	timing_post_trial: 0,
	timing_response: 1000,
	on_finish: function() {
		jsPsych.data.addDataToLastTrial({
			exp_stage: exp_stage
		})
	}
}

var FB_stage = {
	type: "poldrack-single-stim",
	data: {
		trial_id: 'feedback_stage'
	},
	stimulus: get_feedback,
	is_html: true,
	choices: 'none',
	timing_response: 500,
	continue_after_response: false,
	timing_post_trial: 0,
	on_finish: function() {
		jsPsych.data.addDataToLastTrial({
			exp_stage: exp_stage
		})
	}
}

var FB_node = {
	timeline: [second_stage_selected, FB_stage, intertrial_wait_update_FB],
	conditional_function: function() {
		return FB_on == 1
	}
}

var noFB_node = {
	timeline: [intertrial_wait],
	conditional_function: function() {
		return FB_on === 0
	}
}

var two_stage_decision_experiment = []
two_stage_decision_experiment.push(instruction_node);
//example trial
two_stage_decision_experiment.push(first_stage)
two_stage_decision_experiment.push(first_stage_selected)
two_stage_decision_experiment.push(second_stage)
two_stage_decision_experiment.push(FB_node)
two_stage_decision_experiment.push(noFB_node)
//continue instructions
two_stage_decision_experiment.push(second_instructions_block);
two_stage_decision_experiment.push(start_practice_block);
two_stage_decision_experiment.push(attention_node)
for (var i = 0; i < practice_trials_num; i++) {
	two_stage_decision_experiment.push(first_stage)
	two_stage_decision_experiment.push(first_stage_selected)
	two_stage_decision_experiment.push(second_stage)
	two_stage_decision_experiment.push(FB_node)
	two_stage_decision_experiment.push(noFB_node)
}
two_stage_decision_experiment.push(attention_node)
two_stage_decision_experiment.push(change_phase_block)
two_stage_decision_experiment.push(start_test_block)
for (var i = 0; i < test_trials_num / 2; i++) {
	two_stage_decision_experiment.push(first_stage)
	two_stage_decision_experiment.push(first_stage_selected)
	two_stage_decision_experiment.push(second_stage)
	two_stage_decision_experiment.push(FB_node)
	two_stage_decision_experiment.push(noFB_node)
}
two_stage_decision_experiment.push(attention_node)
two_stage_decision_experiment.push(wait_block)
for (var i = 0; i < test_trials_num / 2; i++) {
	two_stage_decision_experiment.push(attention_node)
	two_stage_decision_experiment.push(first_stage)
	two_stage_decision_experiment.push(first_stage_selected)
	two_stage_decision_experiment.push(second_stage)
	two_stage_decision_experiment.push(FB_node)
	two_stage_decision_experiment.push(noFB_node)
}
two_stage_decision_experiment.push(attention_node)
two_stage_decision_experiment.push(post_task_block)
two_stage_decision_experiment.push(end_block)