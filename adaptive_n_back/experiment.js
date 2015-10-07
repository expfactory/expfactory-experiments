/*
reference: http://www.sciencedirect.com/science/article/pii/S1053811905001424
Cognitive control and brain resources in major depression: An fMRI study using the n-back task Harvey at al. 2005
This task differs in that the subject only has to respond on target trials, rather than indicating whether the current trial is 
a match or not

refernce for adaptive n-back, though not explictely used: http://www.pnas.org/content/105/19/6829.full
*/

/* 
Condition records the n for that block of trials
/*

/* ************************************ */
/* Define helper functions */
/* ************************************ */
var post_trial_gap = function() {
  return Math.floor( Math.random() * 500 ) + 500;
}

var randomDraw = function(lst) {
    var index = Math.floor(Math.random()*(lst.length))
    return lst[index]
}

var record_acc = function() {
	var global_trial = jsPsych.progress().current_trial_global
	var stim = jsPsych.data.getData()[global_trial].stim.toLowerCase()
	var target = jsPsych.data.getData()[global_trial].target.toLowerCase()
	var key = jsPsych.data.getData()[global_trial].key_press
	if (stim == target && key != 32) {
		jsPsych.data.addDataToLastTrial({correct: 'incorrect'})
	} else if (stim != target && key == 32) {
		jsPsych.data.addDataToLastTrial({correct: 'incorrect'})
	} else {
		jsPsych.data.addDataToLastTrial({correct: 'correct'})
		block_acc +=1
	}
}

var update_delay = function() {
	if (block_acc/num_trials > acc_thresh) {
		delay += 1
	} else if (block_acc/num_trials < (1-acc_thresh)) {
		delay -= 1
	}
	block_acc = 0
}

/* ************************************ */
/* Define experimental variables */
/* ************************************ */

var letters = 'bBdDgGtTvV'
var num_blocks = 20
var num_trials = 20
var control_before = Math.round(Math.random()) //0 control comes before test, 1, after
var block_acc = 0 // record block accuracy to determine next blocks delay
var delay = 2 // starting delay
var acc_thresh = .8 // percent correct above which the delay is increased (or decreased if percent correct is under 1-acc_thresh

/* ************************************ */
/* Set up jsPsych blocks */
/* ************************************ */
/* define static blocks */

var welcome_block = {
	
  type: 'text',
  text: '<div class = centerbox><p class = block-text>Welcome to the n-back task experiment. Press <strong>enter</strong> to begin.</p></div>',
  cont_key: 13
};

var instructions_block = {
  type: 'instructions',
  pages: [
    '<div class = centerbox><p class = block-text>In this experiment you will see a sequence of letters presented one at a time. Your job is to respond by pressing the spacebar when the letter matches the same letter that occured either 1, 2 or 3 trials before. The letters will be both lower and upper case. You should ignore the case (so "t" matches "T")</p><p class = block-text>The specific delay you should pay attention to will differ between blocks of trials, and you will be told the delay before starting a trial block.</p><p class = block-text>For instance, if the delay is 2, you are supposed to respond when the current letter matches the letter that occured 2 trials ago. If you saw the sequence: g...G...v...T...b...t, you would respond only on the last "t".</p><p class = block-text>Press <strong>enter</strong> to continue.</p></div>',
  ],
  key_forward: 13,
  allow_backwards: false
};

var update_delay_block = {
	type: 'call-function',
	func: update_delay
}

var end_block = {
  type: 'text',
  text: '<div class = centerbox><p class = center-block-text>Finished with this task.</p><p class = center-block-text>Press <strong>enter</strong> to begin.</p></div>',
  cont_key: 13
};

var start_practice_block = {
  type: 'text',
  text: '<div class = centerbox><p class = center-block-text>Starting a practice block.</p><p class = center-block-text>Press <strong>enter</strong> to begin.</p></div>',
  cont_key: 13
};

var start_test_block = {
  type: 'text',
  text: '<div class = centerbox><p class = center-block-text>Starting a test block.</p><p class = center-block-text>Press <strong>enter</strong> to begin.</p></div>',
  cont_key: 13
};

var start_control_block = {
  type: 'text',
  text: '<div class = centerbox><p class = block-text>In this block you do not have to match letters to previous letters. Instead, press the spacebar everytime you see a "t" or "T".</p><p class = center-block-text>Press <strong>enter</strong> to begin.</p></div>',
  cont_key: 13
};

//Define control (0-back) block
var control_trials = []
for (var i=0; i<num_trials; i++) {
	var stim = randomDraw(letters)
	var control_block = {
	  type: 'single-stim',
	  is_html: true,
	  stimuli: '<div class = centerbox><div class = center-text>' + stim + '</div></div>',
	  data: {exp_id: "n-back", condition: "n: 0", stim: stim, target: 't'},
	  choices: [32],
	  timing_stim: 500,
	  timing_response: 2000,
	  response_ends_trial: false,
	  timing_post_trial: 0,
	  on_finish: record_acc
	};
	control_trials.push(control_block)
}

//Set up experiment
var adaptive_n_back_experiment = []
adaptive_n_back_experiment.push(welcome_block);
adaptive_n_back_experiment.push(instructions_block);

if (control_before == 0) {
	adaptive_n_back_experiment.push(start_control_block)
	adaptive_n_back_experiment = adaptive_n_back_experiment.concat(control_trials)
}

for (var b = 0; b < num_blocks; b++) {
	var start_delay_block = {
	  type: 'text',
	  text: '<div class = centerbox><p class = block-text>In these next blocks, you should respond when the current letter matches the letter that appeared ' + delay + ' trials before.</p><p class = center-block-text>Press <strong>enter</strong> to begin.</p></div>',
	  cont_key: 13
	};
	adaptive_n_back_experiment.push(start_delay_block)
	adaptive_n_back_experiment.push(start_test_block)
	var target = ''
	var stims = []
	for (var i=0; i<num_trials; i++) {
		var stim = randomDraw(letters)
		stims.push(stim)
		var test_block = {
		  type: 'single-stim',
		  is_html: true,
		  stimuli: '<div class = centerbox><div class = center-text>' + stim + '</div></div>',
		  data: {exp_id: "n-back", condition: "n: " + delay, stim: stim, target: target},
		  choices: [32],
		  timing_stim: 500,
		  timing_response: 2000,
		  response_ends_trial: false,
		  timing_post_trial: 0,
		  on_finish: record_acc
		};
		if (i>=delay) {
			target = stims[i-delay+1]
		}
		adaptive_n_back_experiment.push(test_block)
	}
	adaptive_n_back_experiment.push(update_delay_block)
}

if (control_before == 1) {
	adaptive_n_back_experiment.push(start_control_block)
	adaptive_n_back_experiment = adaptive_n_back_experiment.concat(control_trials)
}
//Set up control

adaptive_n_back_experiment.push(end_block)


