/* ************************************ */
/* Define helper functions */
/* ************************************ */
var randomDraw = function(lst) {
    var index = Math.floor(Math.random()*(lst.length))
    return lst[index]
}

var getDelay = function() {
  if (Math.random() < .5) {
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
  if (data.rt < delay) {
    var token = token_0
  } else {
    var token = token_30
    total_money += .30
  }
  return token + '<div class = soldBox><div class = center-text><font color="red">SOLD!</font></div></div>'
}

/* ************************************ */
/* Define experimental variables */
/* ************************************ */
var token_0 = '<div class = wtw_token><div class = token_text>0&cent;</div></div>'
var token_30 = '<div class = "wtw_token" style="background: blue; z-index: -1"><div class = token_text>30&cent;</div></div>'
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
  type: 'text',
  text: '<div class = centerbox><p class = block-text>Welcome to the experiment. Press <strong>enter</strong> to begin.</p></div>',
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
  pages: ['<div class = centerbox><p class = block-text>In this experiment a coin worth 0&cent; will appear on the screen. After a time it will become a 30&cent; coin. At any point you can collect the coin by pressing the spacebar and moving on to another trial.</p><p class = block-text>Your job is to get as much money as possible in 10 minutes. We will start with a few practice trials which will start after you end instructions.</p></div>'],
  allow_keys: false,
  show_clickable_nav: true,
  //timing_post_trial: 1000
};


var start_test_block = {
  type: 'text',
  text: '<div class = centerbox><p class = center-block-text>We will now start the main experiment. Press <strong>enter</strong> to begin.</p></div>',
  cont_key: [13],
  timing_post_trial: 1000
};

var practice_block = {
  type: 'single-stim',
  //stimuli: token_0,
  stimulus: token_0,
  is_html: true,
  choices: [32],
  timing_stim: getPracticeDelay,
  timing_response: 100000,
  response_ends_trial: true,
  data: {'exp_id': 'wtw', 'trial_id': 'practice'},
  timing_post_trial: 0,
  prompt: token_30 + progress_bar, 
  on_finish: function(data) {
    jsPsych.data.addDataToLastTrial({'delay': delay})
  }
};

/* define test block */
var test_block = {
  type: 'single-stim',
  //stimuli: token_0,
  stimulus: token_0,
  is_html: true,
  choices: [32],
  timing_stim: getDelay,
  timing_response: 100000,
  response_ends_trial: true,
  data: {'exp_id': 'wtw', 'trial_id': 'test'},
  timing_post_trial: 0,
  prompt: token_30 + progress_bar, 
  on_finish: function(data) {
    jsPsych.data.addDataToLastTrial({'delay': delay})
  }
};

var feedback_block = {
  type: 'single-stim',
  stimuli: getFB,
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
  chunk_type: 'while',
  timeline: [test_block, feedback_block],
  continue_function: function() {
    var elapsed = (new Date() - block_start_time)/60000
    console.log(elapsed)
    if (elapsed > 10) {
      return false
    } else {
      return true
    }
  }
}


/* create experiment definition array */
var wtw_experiment = [];
wtw_experiment.push(welcome_block);
wtw_experiment.push(instructions_block);
for (var i = 0; i < practice_delays.length; i++) {
  wtw_experiment.push(practice_block)
  wtw_experiment.push(feedback_block)
}
wtw_experiment.push(start_test_block);
wtw_experiment.push(test_chunk)
wtw_experiment.push(end_block);
