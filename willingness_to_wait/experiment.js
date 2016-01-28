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

var randomDraw = function(lst) {
    var index = Math.floor(Math.random()*(lst.length))
    return lst[index]
}

var getDelay = function() {
  if (Math.random() < 0.5) {
    delay = 90000
  } else {
    delay = randomDraw([5000, 10000, 15000, 20000])
  }
  return delay
}

var getPracticeDelay = function() {
  delay = practice_delays.shift()
  return delay
}

var getFB = function() {
  var data = jsPsych.data.getLastTrialData() 
  var token;
  if (data.rt < delay) {
    token = token_zero
  } else {
    token = token_thirty
    total_money += 0.30
  }
  return token + '<div class = soldBox><div class = center-text><font color="red">SOLD!</font></div></div>'
}

/* ************************************ */
/* Define experimental variables */
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

// generic task variables
var run_attention_checks = true
var attention_check_thresh = 0.65

// task specific variables
var token_zero = '<div class = wtw_token><div class = token_text>0&cent;</div></div>'
var token_thirty = '<div class = "wtw_token" style="background: blue; z-index: -1"><div class = token_text>30&cent;</div></div>'
var progress_bar = '<div class = wtw_progressBox><div class="meter"> <span style="width: 100%"></span></div></div>'
var delay = 0
var practice_delays = [10000, 50000, 5000]
var block_start_time = new Date();
var total_money = 0 //in dollars
/* ************************************ */
/* Set up jsPsych blocks */
/* ************************************ */
/* define static blocks */
var welcome_block = {
  type: 'poldrack-text',
  text: '<div class = centerbox><p class = center-block-text>Welcome to the experiment. Press <strong>enter</strong> to begin.</p></div>',
  cont_key: [13],
  timing_response: 60000,
  timing_post_trial: 0
};

var end_block = {
  type: 'poldrack-text',
  text: '<div class = centerbox><p class = center-block-text>Thanks for completing this task!</p><p class = center-block-text>Press <strong>enter</strong> to continue.</p></div>',
  cont_key: [13],
  timing_response: 60000,
  timing_post_trial: 0
};

var instructions_block = {
  type: 'poldrack-instructions',
  pages: ['<div class = centerbox><p class = block-text>In this experiment a coin worth 0&cent; will appear on the screen. After a time it will become a 30&cent; coin. At any point you can collect the coin by pressing the spacebar and moving on to another trial.</p><p class = block-text>Your job is to get as much money as possible in 10 minutes. We will start with a few practice trials which will start after you end instructions.</p></div>'],
  allow_keys: false,
  show_clickable_nav: true,
  timing_post_trial: 1000
};


var start_test_block = {
  type: 'poldrack-text',
  text: '<div class = centerbox><p class = center-block-text>We will now start the main experiment. Press <strong>enter</strong> to begin.</p></div>',
  cont_key: [13],
  timing_response: 60000,
  timing_post_trial: 1000
};

var practice_block = {
  type: 'poldrack-single-stim',
  stimulus: token_zero,
  is_html: true,
  choices: [32],
  timing_stim: getPracticeDelay,
  timing_response: 100000,
  response_ends_trial: true,
  data: {'exp_id': 'wtw', 'trial_id': 'practice'},
  timing_post_trial: 0,
  prompt: token_thirty + progress_bar, 
  on_finish: function(data) {
    jsPsych.data.addDataToLastTrial({'delay': delay})
  }
};

/* define test block */
var test_block = {
  type: 'poldrack-single-stim',
  stimulus: token_zero,
  is_html: true,
  choices: [32],
  timing_stim: getDelay,
  timing_response: 100000,
  response_ends_trial: true,
  data: {'exp_id': 'wtw', 'trial_id': 'test'},
  timing_post_trial: 0,
  prompt: token_thirty + progress_bar, 
  on_finish: function(data) {
    jsPsych.data.addDataToLastTrial({'delay': delay})
  }
};

var feedback_block = {
  type: 'poldrack-single-stim',
  stimulus: getFB,
  is_html: true,
  choices: 'none',
  timing_stim: 1000,
  timing_response: 1000,
  data: {'exp_id': 'wtw', 'trial_id': 'feedback'},
  timing_post_trial: 1000,
  on_finish: function(data) {
    jsPsych.data.addDataToLastTrial({'delay': delay})
  }
};

var test_chunk = {
  timeline: [test_block, feedback_block],
  loop_function: function() {
    var elapsed = (new Date() - block_start_time)/60000
    if (elapsed > 10) {
      return false
    } else {
      return true
    }
  }
}


/* create experiment definition array */
var willingness_to_wait_experiment = [];
willingness_to_wait_experiment.push(welcome_block);
willingness_to_wait_experiment.push(instructions_block);
for (var i = 0; i < practice_delays.length; i++) {
  willingness_to_wait_experiment.push(practice_block)
  willingness_to_wait_experiment.push(feedback_block)
}
willingness_to_wait_experiment.push(start_test_block);
willingness_to_wait_experiment.push(test_chunk)
willingness_to_wait_experiment.push(end_block);
