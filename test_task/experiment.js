
/* ************************************ */
/* Define helper functions */
/* ************************************ */
function getDisplayElement () {
  $('<div class = display_stage_background></div>').appendTo('body')
  return $('<div class = display_stage></div>').appendTo('body')
}

function addID() {
  jsPsych.data.addDataToLastTrial({'exp_id': 'test_task'})
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

function calcAvgRT() {
  jsPsych.data.getData()
}


/* ************************************ */
/* Define experimental variables */
/* ************************************ */
// generic task variables
var run_attention_checks = true
var attention_check_thresh = 0.65

// task specific variables
var experiment_len = 3
var gap = 0
var current_trial = 0
var stim = '<div class = "shapebox"><div id = "cross"></div></div>'
var rts = []
var performance_var = 0 // Holds the Average RT
var credit_var = true // If true, credit the participant

/* ************************************ */
/* Set up jsPsych blocks */
/* ************************************ */
/* define static blocks */

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

var end_block = {
  type: 'poldrack-text',
  timing_response: 60000,
  text: '<div class = centerbox><p class = center-block-text>Thanks for completing this task!</p><p class = center-block-text>Press <strong>enter</strong> to continue.</p></div>',
  cont_key: [13],
  timing_post_trial: 0,
  on_finish: function() {
    // If using attentional checks, calculate the percent successful
    var check_percent = evalAttentionChecks()
    // calculate average rt
    var total = 0;
    for(var i = 0; i < rts.length; i++) {
      total += rts[i];
    }
    performance_var = total / rts.length
    // If criteria passed, give credit
    credit_var = false
    if (performance_var > 100 && check_percent > attention_check_thresh) {
      credit_var = true
    }
  }
};

/* define test block */
var test_block = {
  type: 'poldrack-single-stim',
  stimulus: stim,
  is_html: true,
  data: {exp_id: "test_task", trial_id: "test"},
  choices: [32],
  timing_post_trial: 100,
  on_finish: function(data) {
    rts.push(data.rt)
  }
}

/* create experiment definition array */
var test_task_experiment = [];
for (var i = 0; i < experiment_len; i++) {
  test_task_experiment.push(test_block);
}
test_task_experiment.push(attention_node)
test_task_experiment.push(end_block);
