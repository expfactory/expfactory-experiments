
/* ************************************ */
/* Define helper functions */
/* ************************************ */
var post_trial_gap = function() {
  gap = Math.floor( Math.random() * 2000 ) + 1000
  return gap;
}

/* Append gap and current trial to data and then recalculate for next trial*/
var appendData = function() {
	jsPsych.data.addDataToLastTrial({ITI: gap, trial_num: current_trial})
	current_trial = current_trial + 1
}

/* ************************************ */
/* Define experimental variables */
/* ************************************ */
var practice_len = 5
var experiment_len = 50
var gap = 0
var current_trial = 0
stim = '<div class = shapebox><div id = cross></div></div>'



/* ************************************ */
/* Set up jsPsych blocks */
/* ************************************ */
/* define static blocks */
var welcome_block = {
  type: 'text',
  text: '<div class = centerbox><p class = block-text>Welcome to the simple RT experiment. Press <strong>enter</strong> to begin.</p></div>',
  cont_key: [13],
  timing_post_trial: 0
};

var end_block = {
  type: 'text',
  text: '<div class = centerbox><p class = center-block-text>Thanks for completing this task!</p><p class = center-block-text>Press <strong>enter</strong> to continue.</p></div>',
  cont_key: [13],
  timing_post_trial: 0
};

var instructions_block = {
  type: 'instructions',
  pages: ['<div class = centerbox><p class = block-text>In this experiment, we are testing how fast you can respond. On each trial press the spacebar as quickly as possible <strong>after</strong> you see the large "X".</p></div>'],
  allow_keys: false,
  show_clickable_nav: true,
  timing_post_trial: 1000
};

var start_practice_block = {
  type: 'text',
  text: '<div class = centerbox><p class = center-block-text>We will start 5 practice trials. Press <strong>enter</strong> to begin.</p></div>',
  cont_key: [13],
  timing_post_trial: 1000
};

var start_test_block = {
  type: 'text',
  text: '<div class = centerbox><p class = block-text>We will now start the test. Respond to the "X" as quickly as possible by pressing the spacebar. Press <strong>enter</strong> to begin.</p></div>',
  cont_key: [13],
  timing_post_trial: 1000
};

var reset_block = {
	type: 'call-function',
	func: function() {
		current_trial = 0
	},
	timing_post_trial: 0
}

/* define practice block */
var practice_block = {
  type: 'single-stim',
  stimulus: stim,
  is_html: true,
  data: {exp_id: "simple_rt", trial_id: "practice"},
  choices: [32],
  timing_post_trial: post_trial_gap,
  on_finish: appendData
};

/* define test block */
var test_block = {
  type: 'single-stim',
  stimulus: stim,
  is_html: true,
  data: {exp_id: "simple_rt", trial_id: "test"},
  choices: [32],
  timing_post_trial: post_trial_gap,
  on_finish: appendData
};

/* create experiment definition array */
var simple_rt_experiment = [];
simple_rt_experiment.push(welcome_block);
simple_rt_experiment.push(instructions_block);
simple_rt_experiment.push(start_practice_block);
for (var i = 0; i < practice_len; i++) {
	simple_rt_experiment.push(practice_block);
}
simple_rt_experiment.push(reset_block)
simple_rt_experiment.push(start_test_block);
for (var i = 0; i < experiment_len; i++) {
	simple_rt_experiment.push(test_block);
}
simple_rt_experiment.push(end_block);
