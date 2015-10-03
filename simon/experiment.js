
/* ************************************ */
/* Define helper functions */
/* ************************************ */
var post_trial_gap = function() {
  return Math.floor( Math.random() * 500 ) + 500;
}

/* ************************************ */
/* Define experimental variables */
/* ************************************ */
var correct_responses = jsPsych.randomization.repeat([["left arrow",37],["right arrow",39]],1)
var test_stimuli = [
  {
	image: '<div class = centerbox><div class = simon_left id = "stim1"></div></div>',
	data: { correct_response: correct_responses[0][1], condition: 'left', exp_id: 'simon'}
  },
  {
	image:  '<div class = centerbox><div class = simon_right id = "stim1"></div></div>',
	data: { correct_response: correct_responses[0][1], condition:  'left', exp_id: 'simon'}
  },
  {
	image: '<div class = simon_leftbox><div class = simon_left id = "stim2"></div></div>',
	data: { correct_response: correct_responses[1][1], condition: 'right', exp_id: 'simon'}
  },
  {
	image:  '<div class = simon_rightbox><div class = simon_right id = "stim2"></div></div>',
	data: { correct_response: correct_responses[1][1], condition:  'right', exp_id: 'simon'}
  }
];

var practice_trials = jsPsych.randomization.repeat(test_stimuli, 2, true);
var test_trials = jsPsych.randomization.repeat(test_stimuli, 25, true);

var response_array = [];
for (i = 0; i < practice_trials.data.length; i++) {
	response_array.push(practice_trials.data[i]['correct_response'])
}

/* ************************************ */
/* Set up jsPsych blocks */
/* ************************************ */
/* define static blocks */
var welcome_block = {
  type: 'text',
  text: '<div class = centerbox><p class = block-text>Welcome to the simon experiment. Press <strong>enter</strong> to begin.</p></div>',
  cont_key: 13
};

var instructions_block = {
  type: 'instructions',
  pages: [
	'<div class = centerbox><p class = block-text>If you see red, press the ' + correct_responses[0][0] + '.</p><p class = block-text>Use the <strong>right arrow key</strong> to advance through the instructions. You can go back using the <strong>left arrow key</strong>.</p></div>',
	'<div class = centerbox><p class = block-text>If you see blue, press the ' + correct_responses[1][0] + '.</p><p class = block-text>Use the <strong>right arrow key</strong> to advance through the instructions. You can go back using the <strong>left arrow key</strong>.</p></div>'
	]
};

var end_block = {
  type: 'text',
  text: '<div class = centerbox><p class = center-block-text>Finished with this task.</p><p class = center-block-text>Press <strong>enter</strong> to continue.</p></div>',
  cont_key: 13
};

var start_test_block = {
  type: 'text',
  text: '<div class = centerbox><p class = center-block-text>Starting test. Press <strong>enter</strong> to begin.</p></div>',
  cont_key: 13
};

/* define practice block */
var practice_block = {
  type: 'categorize',
  stimuli: practice_trials.image,
  is_html: true,
  key_answer: response_array,
  correct_text: '<div class = centerbox><div class = center-text>Correct</div></div>',
  incorrect_text: '<div class = centerbox><div class = center-text>Incorrect</div></div>',
  timeout_message: '<div class = centerbox><div class = center-text>Response faster!</div></div>',
  choices: [37,39],
  data: practice_trials.data,
  timing_response: 1500, 
  timing_stim: 1500,
  timing_feedback_duration: 1000,
  show_stim_with_feedback: false,
  timing_post_trial: post_trial_gap,
}

/* define test block */
var test_block = {
  type: 'single-stim',
  stimuli: test_trials.image,
  is_html: true,
  choices: [37,39],
  data: test_trials.data,
  timing_response: 1500,
  timing_post_trial: post_trial_gap
};

/* create experiment definition array */
var simon_experiment = [];
simon_experiment.push(welcome_block);
simon_experiment.push(instructions_block);
simon_experiment.push(practice_block);
simon_experiment.push(start_test_block);
simon_experiment.push(test_block);
simon_experiment.push(end_block)

