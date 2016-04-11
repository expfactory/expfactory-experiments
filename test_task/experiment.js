/* ************************************ */
/* Define helper functions */
/* ************************************ */
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
    check_percent = checks_passed / attention_check_trials.length
  }
  return check_percent
}

/* ************************************ */
/* Define experimental variables */
/* ************************************ */
// generic task variables
var run_attention_checks = false
var attention_check_thresh = 0.65

// task specific variables
var experiment_len = 3
var gap = 0
var current_trial = 0
var stim = '<div class = "shapebox"><div id = "cross"></div></div>'


/* ************************************ */
/* Set up jsPsych blocks */
/* ************************************ */

// Set up attention check node
var attention_check_block = {
  type: 'attention-check',
  timing_response: 180000,
  response_ends_trial: true,
  timing_post_trial: 200
}

var attention_node = {
  timeline: [attention_check_block],
  conditional_function: function() {
    return run_attention_checks
  }
}

//Set up post task questionnaire
var post_task_block = {
   type: 'survey-text',
   data: {
       trial_id: "post task questions"
   },
   questions: ['<p class = center-block-text style = "font-size: 20px">Please summarize what you were asked to do in this task.</p>',
              '<p class = center-block-text style = "font-size: 20px">Do you have any comments about this task?</p>'],
   rows: [15, 15],
   columns: [60,60]
};

/* define static blocks */
var end_block = {
  type: 'poldrack-text',
  timing_response: 180000,
  text: '<div class = centerbox><p class = center-block-text>Thanks for completing this task!</p><p class = center-block-text>Press <strong>enter</strong> to continue.</p></div>',
  cont_key: [13],
  timing_post_trial: 0
}

/* define test block */
var test_block = {
  type: 'poldrack-single-stim',
  stimulus: stim,
  is_html: true,
  data: {
    trial_id: "test"
  },
  choices: [32],
  timing_response: 2000,
  timing_post_trial: 100
}

/* create experiment definition array */
var test_task_experiment = [];
for (var i = 0; i < experiment_len; i++) {
  test_task_experiment.push(test_block);
}
test_task_experiment.push(attention_node)
test_task_experiment.push(post_task_block)
test_task_experiment.push(end_block);