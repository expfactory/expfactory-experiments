// Reference: http://www.sciencedirect.com/science/article/pii/S001002859990734X
//Condition indicates block task (add, subtract, alternate)

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

/* ************************************ */
/* Define experimental variables */
/* ************************************ */
// generic task variables
var run_attention_checks = true
var attention_check_thresh = 0.65

// task specific variables
var numbers =  [];
for (var i = 10; i <= 99; i++) {
    numbers.push(i.toString());
}
var numbers = jsPsych.randomization.repeat(numbers,1,false)
var add_list = numbers.slice(0,30)
var minus_list = numbers.slice(30,60)
var alternate_list = numbers.slice(60,90)

/* ************************************ */
/* Set up jsPsych blocks */
/* ************************************ */
// Set up attention check node
var attention_check_block = {
  type: 'attention-check',
  timing_response: 30000,
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
var welcome_block = {
  type: 'poldrack-text',
  timing_response: 60000,
  text: '<div class = centerbox><p class = center-block-text>Welcome to the experiment. Press <strong>enter</strong> to begin.</p></div>',
  cont_key: [13],
  timing_post_trial: 0
};

var end_block = {
  type: 'poldrack-text',
  timing_response: 60000,
  text: '<div class = centerbox><p class = center-block-text>Thanks for completing this task!</p><p class = center-block-text>Press <strong>enter</strong> to continue.</p></div>',
  cont_key: [13],
  timing_post_trial: 0
};

var intro_block = {
  type: 'poldrack-instructions',
  pages: ['<div class = centerbox><p class = block-text>In this experiment you will be adding and subtracting numbers. It is important that you respond as quickly and accurately as possible. To familiarize you with the test, on the next screen will be a list of numbers. For each number, copy the number into the blank as quickly and accurately as possible. Use the "tab" key to move from question to question. If possible, use your numpad to make entering numbers easier.</p></div>'],
  allow_keys: false,
  show_clickable_nav: true,
  timing_post_trial: 1000
};

var start_add_block = {
  type: 'poldrack-text',
  timing_response: 60000,
  text: '<div class = centerbox><p class = block-text>On the following screen you will see a list of numbers. <strong>Add 3</strong> to them and enter the value in the box below the number. Complete the list as quickly and accurately as possible. Press any key to begin.</p></div>',
  timing_post_trial: 1000
};

var start_minus_block = {
  type: 'poldrack-text',
  timing_response: 60000,
  text: '<div class = centerbox><p class = block-text>On the following screen you will see a list of numbers. <strong>Subtract 3</strong> from them and enter the value in the box below the number. Complete the list as quickly and accurately as possible. Press any key to begin.</p></div>',
  timing_post_trial: 1000
};

var start_alternate_block = {
  type: 'poldrack-text',
  timing_response: 60000,
  text: '<div class = centerbox><p class = block-text>On the following screen you will see a list of numbers. <strong>Alternate between adding and subtracting 3</strong> to the numbers and enter the value in the box below the number.</p><p class = block-text>For instance, if the numbers were 27, [13], 40, your responses should be 30 (27+3), 10 ([13]-3), 43 (40+3). Complete the list as quickly and accurately as possible. Press any key to begin.</p></div>',
  timing_post_trial: 1000
};

var practice_block = {
    type: 'survey-text',
    questions: ["57","20","17","87","11","43","16","26","66","14","19","75"]
};

var add_block = {
    type: 'survey-text',
    questions: [add_list],
    data: {'exp_id': 'plus_minus', 'condition': 'add', 'trial_id': 'test'}
};

var minus_block = {
    type: 'survey-text',
    questions: [add_list],
    data: {'exp_id': 'plus_minus', 'condition': 'subtract', 'trial_id': 'test'}
};

var alternate_block = {
    type: 'survey-text',
    questions: [alternate_list],
    data: {'exp_id': 'plus_minus', 'condition': 'alternate', 'trial_id': 'test'}
};

var posttask_questionnaire = {
    type: 'survey-text',
    questions: ['Did you use a numpad?'],
    data: {'exp_id': 'plus_minus', 'trial_id': 'post-task questionnaire'}
};


/* create experiment definition array */
var plus_minus_experiment = [];
plus_minus_experiment.push(welcome_block);
plus_minus_experiment.push(intro_block)
plus_minus_experiment.push(practice_block)
plus_minus_experiment.push(start_add_block)
plus_minus_experiment.push(add_block)
plus_minus_experiment.push(start_minus_block)
plus_minus_experiment.push(minus_block)
plus_minus_experiment.push(start_alternate_block)
plus_minus_experiment.push(alternate_block)
plus_minus_experiment.push(end_block)
