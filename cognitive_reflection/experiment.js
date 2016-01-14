/* ************************************ */
/* Define helper functions */
/* ************************************ */

/* ************************************ */
/* Define experimental variables */
/* ************************************ */

/* ************************************ */
/* Set up jsPsych blocks */
/* ************************************ */

/* define static blocks */

var welcome_block = {
  type: 'text',
  text: '<div class = centerbox><p class = block-text>Welcome to the experiment. In this experiment you will answer three questions. Press <strong>enter</strong> to begin.</p></div>',
  cont_key: [13]
};


var experiment_block = {
    type: 'survey-text',
    questions: [['A bat and a ball cost $1.10 in total. The bat costs $1.00 more than the ball. How much does the ball cost?'], 
               ['If it takes 5 machines 5 minutes to make 5 widgets, how long would it take 100 machines to make 100 widgets?'],
               ['In a lake, there is a patch of lily pads. Every day, the patch doubles in size. If it takes 48 days for the patch to cover the entire lake, how long would it take for the patch to cover half of the lake?']],
    data: {'exp_id': 'cognitive reflection'}

};


var end_block = {
  type: 'text',
  text: '<div class = centerbox><p class = center-block-text>Congratulations for completing this task!</p><p class = center-block-text>Press <strong>enter</strong> to continue.</p></div>',
  cont_key: [13]
};


//Set up experiment
var cognitive_reflection_experiment = []
cognitive_reflection_experiment.push(welcome_block);
cognitive_reflection_experiment.push(experiment_block);
cognitive_reflection_experiment.push(end_block)
