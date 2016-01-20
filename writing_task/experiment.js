
/* ************************************ */
/* Define helper functions */
/* ************************************ */

/* ************************************ */
/* Define experimental variables */
/* ************************************ */
var start_time = new Date();
var timelimit = 10

/* ************************************ */
/* Set up jsPsych blocks */
/* ************************************ */
/* define static blocks */
var welcome_block = {
  type: 'text',
  text: '<div class = centerbox><p class = center-block-text>Welcome to the experiment. Press <strong>enter</strong> to begin.</p></div>',
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
  type: 'poldrack-instructions',
  pages: ['<div class = centerbox><p class = block-text>In this task we want you to write. On the next page write for ' + timelimit + 'minutes in response to the prompt "What happened last week?".</p><p class = block-text> It is important that you write for the entire time and stay on task. After you end the instructions you will start.</p></div>'],
  allow_keys: false,
  show_clickable_nav: true,
  timing_post_trial: 1000
};

/* define test block */
var test_block = {
  type: 'writing',
  text_class: 'writing_class',
  is_html: true,
  data: {exp_id: "writing_task", trial_id: "test"},
  timing_post_trial: 0
};

var loop_node = {
    timeline: [test_block],
    loop_function: function(){
      var elapsed = (new Date() - start_time)/60000
        if(elapsed < timelimit){
            return true;
        } else {
            return false;
        }
    }
}

/* create experiment definition array */
var writing_task_experiment = [];
writing_task_experiment.push(welcome_block);
writing_task_experiment.push(instructions_block);
writing_task_experiment.push(loop_node);
writing_task_experiment.push(end_block);
