/* ************************************ */
/* Define helper functions */
/* ************************************ */
function getDisplayElement () {
    $('<div class = display_stage_background></div>').appendTo('body')
    return $('<div class = display_stage></div>').appendTo('body')
}

var randomDraw = function(lst) {
    var index = Math.floor(Math.random()*(lst.length))
    return lst[index]
}

/* ************************************ */
/* Define experimental variables */
/* ************************************ */

var letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'

var practice_block_num = 2
var practice_blocks = []
var practice_seq_lengths = [5,7]

for (var b = 0; b<practice_block_num; b++) {
	var num_trials = practice_seq_lengths[b]
	var block_trials = []
	for (var i=0; i<num_trials; i++) {
		var tmp_obj = {stimulus: '<div class = centerbox><div class = center-text>' + randomDraw(letters) + '</div></div>',
		data: {exp_id: 'letter_memory', trial_id: 'practice', condition: 'seq_len_' + num_trials}}
		block_trials.push(tmp_obj)
	}
	practice_blocks.push(block_trials)
}

var block_num = 12
var blocks = []
for (var b=0; b<block_num; b++){
	var num_trials = randomDraw([5,7,9,11])
	var block_trials = []
	for (var i=0; i<num_trials; i++) {
		var tmp_obj = {stimulus: '<div class = centerbox><div class = center-text>' + randomDraw(letters) + '</div></div>',
		data: {exp_id: 'letter_memory', trial_id: 'test', condition: 'seq_len_' + num_trials}}
		block_trials.push(tmp_obj)
	}
	blocks.push(block_trials)
}

/* ************************************ */
/* Set up jsPsych blocks */
/* ************************************ */
/* define static blocks */
var welcome_block = {
  type: 'poldrack-text',
  timing_response: 60000,
  text: '<div class = centerbox><p class = center-block-text>Welcome to the experiment. Press <strong>enter</strong> to begin.</p></div>',
  cont_key: [13],
  timing_post_trial: 0
};

var instructions_block = {
  type: 'poldrack-instructions',
  pages: [
    '<div class = centerbox><p class = block-text>In this experiment you will see a sequence of letters presented one at a time. Your job is to remember the last four letters presented and report them at the end of the sequence.</p><p class = block-text>For instance, if the sequence F...J...K...N...F...L is presented, you would report KNFL.</p><p class = block-text>The sequences vary in length so it is important that you keep track of each letter. To ensure this, while doing the task repeat the last four letters (or less if less than four letters had been shown) out loud or to yourself while the letters are being presented.</p></div>',
	'<div class = centerbox><p class = block-text>We will start with two practice sequences. Following will be 12 test blocks.</p></div>'
  ],
  allow_keys: false,
  show_clickable_nav: true,
  timing_post_trial: 01000
};

var end_block = {
  type: 'poldrack-text',
  timing_response: 60000,
  text: '<div class = centerbox><p class = center-block-text>Thanks for completing this task!</p><p class = center-block-text>Press <strong>enter</strong> to begin.</p></div>',
  cont_key: [13],
  timing_post_trial: 0
};

var start_practice_block = {
  type: 'poldrack-text',
  timing_response: 60000,
  text: '<div class = centerbox><p class = center-block-text>Starting a practice block.</p><p class = center-block-text>Press <strong>enter</strong> to begin.</p></div>',
  cont_key: [13],
  timing_post_trial: 1000
};

var start_test_block = {
  type: 'poldrack-text',
  timing_response: 60000,
  text: '<div class = centerbox><p class = center-block-text>Starting a test block.</p><p class = center-block-text>Press <strong>enter</strong> to begin.</p></div>',
  cont_key: [13],
  timing_post_trial: 1000
};


//Set up experiment
var letter_memory_experiment = []
letter_memory_experiment.push(welcome_block);
letter_memory_experiment.push(instructions_block);

// set up practice
for (var b=0; b<practice_block_num; b++) {
	block = practice_blocks[b]
	letter_memory_experiment.push(start_practice_block)
	var letter_seq_block = {
	  type: 'poldrack-single-stim',
	  is_html: true,
	  timeline: practice_blocks[b],
	  choices: 'none',
	  timing_stim: 2000,
	  timing_response: 2000,
	  timing_post_trial: 0
	};
	letter_memory_experiment.push(letter_seq_block)
	
	var response_block = {
		type: 'survey-text',
		questions: [['What were the last four letters in the last sequence?']],
		data: {exp_id: 'letter_memory', trial_id: 'practice', condition: blocks[b].length}
	}
	letter_memory_experiment.push(response_block)
}


// set up test
for (var b=0; b<block_num; b++) {
	block = blocks[b]
	letter_memory_experiment.push(start_test_block)
	var letter_seq_block = {
	  type: 'poldrack-single-stim',
	  is_html: true,
	  timeline: blocks[b],
	  choices: 'none',
	  timing_stim: 2000,
	  timing_response: 2000,
	  timing_post_trial: 0
	};
	letter_memory_experiment.push(letter_seq_block)
	
	var response_block = {
		type: 'survey-text',
		questions: [['What were the last four letters in the last sequence?']],
		data: {exp_id: 'letter_memory', trial_id: 'practice', condition: blocks[b].length}
	}
	letter_memory_experiment.push(response_block)
}

letter_memory_experiment.push(end_block)
