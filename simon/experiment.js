
/* ************************************ */
/* Define helper functions */
/* ************************************ */
function getDisplayElement () {
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
    check_percent = checks_passed/attention_check_trials.length
  } 
  return check_percent
}

var post_trial_gap = function() {
  gap = Math.floor( Math.random() * 2000 ) + 1000
  return gap;
}

/* Append gap and current trial to data and then recalculate for next trial*/
var appendData = function() {
	jsPsych.data.addDataToLastTrial({trial_num: current_trial})
	current_trial = current_trial + 1
}

/* ************************************ */
/* Define experimental variables */
/* ************************************ */
var correct_responses = jsPsych.randomization.repeat([["left arrow",37],["right arrow",39]],1)
var current_trial = 0
var gap = Math.floor( Math.random() * 2000 ) + 1000
var test_stimuli = [
  {
	stimulus: '<div class = centerbox><div class = simon_left id = "stim1"></div></div>',
	data: { correct_response: correct_responses[0][1], condition: 'left', exp_id: 'simon'},
	key_answer: correct_responses[0][1]
  },
  {
	stimulus:  '<div class = centerbox><div class = simon_right id = "stim1"></div></div>',
	data: { correct_response: correct_responses[0][1], condition:  'right', exp_id: 'simon'},
	key_answer: correct_responses[0][1]
  },
  {
	stimulus: '<div class = simon_leftbox><div class = simon_left id = "stim2"></div></div>',
	data: { correct_response: correct_responses[1][1], condition: 'left', exp_id: 'simon'},
	key_answer: correct_responses[1][1]
  },
  {
	stimulus:  '<div class = simon_rightbox><div class = simon_right id = "stim2"></div></div>',
	data: { correct_response: correct_responses[1][1], condition:  'right', exp_id: 'simon'},
	key_answer: correct_responses[1][1]
  }
];

var practice_trials = jsPsych.randomization.repeat(test_stimuli, 2);
var test_trials = jsPsych.randomization.repeat(test_stimuli, 25);


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
	'<div class = centerbox><p class = block-text>On each trial of this experiment a red or blue box will appear. If you see a red box, press the ' + correct_responses[0][0] + '. If you see a blue box, press the ' + correct_responses[1][0] + '.</p><p class = block-text>We will start with practice where you will get feedback about whether you responded correctly. We will begin after you end the instructions.</p></div>',
	],
  allow_keys: false,
  show_clickable_nav: true,
  timing_post_trial: 1000
};

var end_block = {
  type: 'poldrack-text',
  timing_response: 60000,
  text: '<div class = centerbox><p class = center-block-text>Thanks for completing this task!</p><p class = center-block-text>Press <strong>enter</strong> to continue.</p></div>',
  cont_key: [13],
  timing_post_trial: 0
};

var start_test_block = {
  type: 'poldrack-text',
  timing_response: 60000,
  text: '<div class = centerbox><p class = center-block-text>Starting test. You will no longer get feedback after your responses. Press <strong>enter</strong> to begin.</p></div>',
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
  type: 'poldrack-categorize',
  timeline: practice_trials,
  is_html: true,
  correct_text: '<div class = centerbox><div class = center-text>Correct</div></div>',
  incorrect_text: '<div class = centerbox><div class = center-text>Incorrect</div></div>',
  timeout_message: '<div class = centerbox><div class = center-text>Response faster!</div></div>',
  choices: [37,39],
  timing_response: 1500, 
  timing_stim: 1500,
  timing_feedback_duration: 1000,
  show_stim_with_feedback: false,
  timing_post_trial: post_trial_gap,
  on_finish: appendData
}

/* define test block */
var test_block = {
  type: 'poldrack-single-stim',
  timeline: test_trials,
  is_html: true,
  choices: [37,39],
  timing_response: 1500,
  timing_post_trial: post_trial_gap,
  on_finish: appendData
};

/* create experiment definition array */
var simon_experiment = [];
simon_experiment.push(welcome_block);
simon_experiment.push(instructions_block);
simon_experiment.push(practice_block);
simon_experiment.push(reset_block)
simon_experiment.push(start_test_block);
simon_experiment.push(test_block);
simon_experiment.push(end_block)
