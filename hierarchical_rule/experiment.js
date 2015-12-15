/* ************************************ */
/* Define helper functions */
/* ************************************ */
var randomDraw = function(lst) {
    var index = Math.floor(Math.random()*(lst.length))
    return lst[index]
}

/* ************************************ */
/* Define experimental variables */
/* ************************************ */


/* ************************************ */
/* Set up jsPsych blocks */
/* ************************************ */
/* define static blocks */

var welcome_block = {
	
  type: 'text',
  text: '<div class = centerbox><p class = block-text>Welcome to the experiment. Press <strong>enter</strong> to begin.</p></div>',
  cont_key: 13
};


var instructions_block = {
  type: 'instructions',
  pages: [
    '<div class = centerbox><p class = block-text>In this experiment you will see a sequence of letters presented one at a time. Your job is to remember the last four letters presented and report them at the end of the sequence.</p><p class = block-text>For instance, if the sequence F...J...K...N...F...L is presented, you would report KNFL.</p><p class = block-text>The sequences vary in length so it is important that you keep track of each letter. To ensure this, while doing the task repeat the last four letters (or less if less than four letters had been shown) out loud or to yourself while the letters are being presented.</p></div>',
	'<div class = centerbox><p class = block-text>We will start with two practice sequences. Following will be 12 test blocks.</p></div>'
  ],
  allow_keys: false,
  show_clickable_nav: true,
  timing_post_trial: 01000
};

var end_block = {
  type: 'text',
  text: '<div class = centerbox><p class = center-block-text>Finished with this task.</p><p class = center-block-text>Press <strong>enter</strong> to begin.</p></div>',
  cont_key: 13,
  timing_post_trial: 0
};

var start_practice_block = {
  type: 'text',
  text: '<div class = centerbox><p class = center-block-text>Starting a practice block.</p><p class = center-block-text>Press <strong>enter</strong> to begin.</p></div>',
  cont_key: 13,
  timing_post_trial: 1000
};

var start_test_block = {
  type: 'text',
  text: '<div class = centerbox><p class = center-block-text>Starting a test block.</p><p class = center-block-text>Press <strong>enter</strong> to begin.</p></div>',
  cont_key: 13,
  timing_post_trial: 1000
};


//Set up experiment
var hierarchical_rule_experiment = []
hierarchical_rule_experiment.push(welcome_block);
hierarchical_rule_experiment.push(instructions_block);


hierarchical_rule_experiment.push(end_block)
