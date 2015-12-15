
/* ************************************ */
/* Define helper functions */
/* ************************************ */


/* ************************************ */
/* Define experimental variables */
/* ************************************ */
var experiment_len = 1
var gap = 0
var current_trial = 0
stim = '<div class = shapebox><div id = cross></div></div>'



/* ************************************ */
/* Set up jsPsych blocks */
/* ************************************ */
/* define static blocks */

var end_block = {
  type: 'text',
  text: '<div class = centerbox><p class = center-block-text>Finished with this task.</p><p class = center-block-text>Press <strong>enter</strong> to continue.</p></div>',
  cont_key: 13,
  timing_post_trial: 0
};

/* define test block */
var test_block = {
  type: 'single-stim',
  stimuli: stim,
  is_html: true,
  data: {exp_id: "test_task", trial_id: "test"},
  choices: [32],
  timing_post_trial: 100,
  repetitions: experiment_len
};

/* create experiment definition array */
var test_task_experiment = [];
test_task_experiment.push(test_block);
test_task_experiment.push(end_block);
