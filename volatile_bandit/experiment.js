//Source: http://www.nature.com/neuro/journal/v10/n9/pdf/nn1954.pdf

/* ************************************ */
/* Define helper functions */
/* ************************************ */

var text_insert = function(text, index, insert_value) {
	text = text.slice(0, index) + insert_value + text.slice(index);
	return text
}

var getRespondStim = function() {
	var curr_trial = jsPsych.progress().current_trial_global
	var curr_data = jsPsych.data.getData()[curr_trial-1]
	var stim = curr_data.stimulus.slice(0,-6)
	var response = curr_data.key_press

	if (response == 37) {
		insert_in = stim.search('stim_left')
		stim = text_insert(stim, insert_in, 'selected ')
	} else if (response == 39) {
		insert_in = stim.search('stim_right')
		stim = text_insert(stim, insert_in, 'selected ')
	}
	return stim
}

var getFBStim = function() {
	var curr_trial = jsPsych.progress().current_trial_global
	var curr_data = jsPsych.data.getData()[curr_trial-2]
	var stim = curr_data.stimulus.slice(0,-6)
	var correct_stim = curr_data.correct_stim
	var response = curr_data.key_press
	var correct_response = curr_data.correct_response
	
	// update response bar if they responded correctly
	if (response == correct_response) {
		if (correct_stim == 'stim1') {
			progress_value += curr_data.stim1_value*0.022
		} else {
			progress_value += curr_data.stim2_value*0.022
		}
	}
	
	if (correct_stim == 'stim1') {
		fb_stim = ordered_stims[0]
	} else {
		fb_stim = ordered_stims[1]
	}
	insert_in = stim.search('fb_holder') 
	stim = stim.slice(0,insert_in) + fb_stim + stim.slice(insert_in+9)
	return stim
}

getFBBar = function() {
 return '<progress class = feedback_bar value = "' + progress_value + '" max = "100"></progress><div class = goal_1></div><div class = goal_2></div>'
}

/* ************************************ */
/* Define experimental variables */
/* ************************************ */

var stage1_trials = 120
var stage2_trials = 170
var progress_value = 0 //set starting value
var ordered_stims = jsPsych.randomization.shuffle(['blue_stim','green_stim'])
//value of 0 means stim1 wins (0 indexed)
var static_winners = jsPsych.randomization.repeat([0,0,0,1],stage1_trials/4)
/* set up the volatile winners. Trials from each 'block' of winners add up to 170 trials.
*/
var volatile_blocks = jsPsych.randomization.repeat([30,30,30,40,40],1)
var volatile_winners = []
var block_index = [] //used to keep track of switches. Index indicates which stim wins more
if (Math.random() < 0.5) {
	volatile_proportions = [0,0,0,1,1]
} else {
	volatile_proportions = [0,0,1,1,1]
}
for (var b = 0; b < volatile_blocks.length; b++) {
	if (volatile_proportions == [0,0,1,1,1]) {
		volatile_proportions = [0,0,0,1,1]
		trial_index = 1
	} else {
		volatile_proportions = [0,0,1,1,1]
		trial_index = 2
	}
	volatile_winners = volatile_winners.concat(jsPsych.randomization.repeat(volatile_proportions,volatile_blocks[b]/5,false))
	for (var i = 0; i< volatile_blocks[b]; i++) {
		block_index.push(trial_index)
	}
}


/* ************************************ */
/* Set up jsPsych blocks */
/* ************************************ */
/* define static blocks */
var welcome_block = {
  type: 'text',
  text: '<div class = centerbox><p class = center-block-text>Welcome to the experiment. Press <strong>enter</strong> to begin.</p></div>',
  cont_key: [13],
  timing_post_trial: 0
};

var instructions_block = {
  type: 'poldrack-instructions',
  pages: [
	'<div class = centerbox><p class = block-text>In this task you will job is to earn points by selecting one of two shapes using the arrow keys. On the next page you will see an example trial.</p></div>',
	'<div class = centerbox><div class = stim_center id = fb_holder></div><div class = "stim_left" id = blue_stim><div class = center-text>59</div></div><div class = "stim_right" id = green_stim><div class = center-text>41</div></div></div><progress class = feedback_bar value = 42 max = "100"></progress><div class = goal_1></div><div class = goal_2></div>',
	'<div class = centerbox><p class = block-text>As you could see, each shape is associated with a certain value (between 0-100). The value of both shapes will always equal 100. So if the blue shape has a value of 30, the green shape will have a value of 70.</p><p class = block-text>When you select a shape, if you chose correctly (explained on the next slide), you will get the number of points listed on the shape.</p><p class = block-text>At the bottom of the screen is a red bar that tracks how many points you have earned. If the bar passes the grey line you will get a bonus. If it passes the yellow line you will get an even larger bonus.</p></div>',
	'<div class = centerbox><p class = block-text>The correct color shape on each trial is probabilistic, like a coin flip. The chance of of the correct color being blue or green can change during the experiment, but depends only on the recent outcome history. So if green has been correct most often for the last few trials, it is likely to be correct in the future.</p><p class = block-text>Regardless of which color you choose, the correct color for that trial will be shown after you make your response. If you selected that color, you will get the associated points. Each color shape can show up on either side of the screen, but the side does not affect how likely that shape is to win.</p><p class = block-text>To summarize, on each trial you will select either the blue or green shape. If you are correct, you will get the points listed on that shape added to your total. Your job is to get as many points as possible.</p></div>'	
	],
  allow_keys: false,
  show_clickable_nav: true,
  timing_post_trial: 1000
};

var end_block = {
  type: 'text',
  text: '<div class = centerbox><p class = center-block-text>Thanks for completing this task!</p><p class = center-block-text>Press <strong>enter</strong> to continue.</p></div>',
  cont_key: [13],
  timing_post_trial: 0
};

var start_test_block = {
  type: 'text',
  text: '<div class = centerbox><p class = center-block-text>Starting test. Press <strong>enter</strong> to begin.</p></div>',
  cont_key: [13],
  timing_post_trial: 1000
};

//Set up experiment
volatile_bandit_experiment = []
volatile_bandit_experiment.push(welcome_block)
volatile_bandit_experiment.push(instructions_block)
volatile_bandit_experiment.push(start_test_block)
/*
First set up the static condition. In this condition, one stim is correct 80% of the time.
Stim1 has a value that randomly changes from trial to trial from 0-100 while stim2 has a value
of 100-stim1. On each trial, if the stimulus that is chosen is also correct, then the progress bar
advances proportionally to that stimulus's value.
*/
for (var i = 0; i < stage1_trials; i++) {
	var stim1_value = Math.floor(Math.random()*101)
	var stim1_reward = '<div class = center-text>' + stim1_value + '</div>'
	var stim2_reward = '<div class = center-text>' + (100 - stim1_value) + '</div>'
	if (Math.random() < 0.5) {
		stim1= '<div class = "stim_left" id = "' + ordered_stims[0] + '">' + stim1_reward + '</div>'
		stim2 = '<div class = "stim_right" id = "' + ordered_stims[1] + '">' + stim2_reward + '</div>'
		correct_response = [37,39][static_winners[i]]
	} else {
		stim1 = '<div class = "stim_right" id = "' + ordered_stims[0] + '">' + stim1_reward + '</div>'
		stim2 = '<div class = "stim_left" id = "' + ordered_stims[1] + '">' + stim2_reward + '</div>'
		correct_response = [39,37][static_winners[i]]
	}
	var stim = '<div class = centerbox><div class = stim_center id = fb_holder></div>' + stim1 + stim2 + '</div>'
	var correct_stim = 'stim' + (static_winners[i]+1)
	
	var test_block = {
	  type: 'poldrack-single-stim',
	  stimulus: stim,
	  is_html: true,
	  choices: [37,39],
	  data: {correct_response: correct_response, correct_stim: correct_stim, stim1_value: stim1_value, stim2_value: 100-stim1_value, trial_id: 'stim_response', condition: 'stable', exp_id: 'volatile_bandit'},
	  timing_stim: 1500,
	  timing_response: 1500,
	  timing_post_trial: 0,
	  prompt: getFBBar
	};

	var responded_block = {
	  type: 'poldrack-single-stim',
	  stimulus: getRespondStim,
	  is_html: true,
	  choices: 'none',
	  data: {correct_response: correct_response, correct_stim: correct_stim, stim1_value: stim1_value, stim2_value: 100-stim1_value, trial_id: 'show_response', condition: 'stable', exp_id: 'volatile_bandit'},
	  timing_stim: 1500,
	  timing_response: 1500,
	  timing_post_trial: 0,
	  prompt: getFBBar
	};

	var feedback_block = {
	  type: 'poldrack-single-stim',
	  stimulus: getFBStim,
	  is_html: true,
	  choices: 'none',
	  data: {correct_response: correct_response, correct_stim: correct_stim, stim1_value: stim1_value, stim2_value: 100-stim1_value, trial_id: 'FB', condition: 'stable', exp_id: 'volatile_bandit'},
	  timing_stim: 1500,
	  timing_response: 1500,
	  timing_post_trial: 0,
	  prompt: getFBBar
	};
	volatile_bandit_experiment.push(test_block)
	volatile_bandit_experiment.push(responded_block)
	volatile_bandit_experiment.push(feedback_block)
}

/*
Following the static condition is a volatile condition where the higher probability stimulus changes
every 30 to 40 trials. When a stimulus is the 'higher probability' stimulus, it is rewarded 80% of the time. 
*/
for (var i = 0; i < stage2_trials; i++) {
	var stim1_value = Math.floor(Math.random()*101)
	var stim1_reward = '<div class = center-text>' + stim1_value + '</div>'
	var stim2_reward = '<div class = center-text>' + (100 - stim1_value) + '</div>'
	if (Math.random() < 0.5) {
		stim1= '<div class = "stim_left" id = "' + ordered_stims[0] + '">' + stim1_reward + '</div>'
		stim2 = '<div class = "stim_right" id = "' + ordered_stims[1] + '">' + stim2_reward + '</div>'
		correct_response = [37,39][volatile_winners[i]]
	} else {
		stim1 = '<div class = "stim_right" id = "' + ordered_stims[0] + '">' + stim1_reward + '</div>'
		stim2 = '<div class = "stim_left" id = "' + ordered_stims[1] + '">' + stim2_reward + '</div>'
		correct_response = [39,37][volatile_winners[i]]
	}
	var stim = '<div class = centerbox><div class = stim_center id = fb_holder></div>' + stim1 + stim2 + '</div>'
	var correct_stim = 'stim' + (volatile_winners[i]+1)
	
	var test_block = {
	  type: 'poldrack-single-stim',
	  stimulus: stim,
	  is_html: true,
	  choices: [37,39],
	  data: {correct_response: correct_response, correct_stim: correct_stim, stim1_value: stim1_value, stim2_value: 100-stim1_value, trial_id: 'stim_response', condition: 'volatile', exp_id: 'volatile_bandit', block: 'block_' + block_index[i]},
	  timing_stim: 1500,
	  timing_response: 1500,
	  timing_post_trial: 0,
	  prompt: getFBBar
	};

	var responded_block = {
	  type: 'poldrack-single-stim',
	  stimulus: getRespondStim,
	  is_html: true,
	  choices: 'none',
	  data: {correct_response: correct_response, correct_stim: correct_stim, stim1_value: stim1_value, stim2_value: 100-stim1_value, trial_id: 'show_response', condition: 'volatile', exp_id: 'volatile_bandit', block: 'block_' + block_index[i]},
	  timing_stim: 1500,
	  timing_response: 1500,
	  timing_post_trial: 0,
	  prompt: getFBBar
	};

	var feedback_block = {
	  type: 'poldrack-single-stim',
	  stimulus: getFBStim,
	  is_html: true,
	  choices: 'none',
	  data: {correct_response: correct_response, correct_stim: correct_stim, stim1_value: stim1_value, stim2_value: 100-stim1_value, trial_id: 'FB', condition: 'volatile', exp_id: 'volatile_bandit', block: 'block_' + block_index[i]},
	  timing_stim: 1500,
	  timing_response: 1500,
	  timing_post_trial: 0,
	  prompt: getFBBar
	};
	volatile_bandit_experiment.push(test_block)
	volatile_bandit_experiment.push(responded_block)
	volatile_bandit_experiment.push(feedback_block)
}
volatile_bandit_experiment.push(end_block)
