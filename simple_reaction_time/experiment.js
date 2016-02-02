
/* ************************************ */
/* Define helper functions */
/* ************************************ */
function getDisplayElement() {
    $('<div class = display_stage_background></div>').appendTo('body')
    return $('<div class = display_stage></div>').appendTo('body')
}

function addID() {
  jsPsych.data.addDataToLastTrial({'exp_id': 'simple_reaction_time'})
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

var getInstructFeedback = function() {
	return '<div class = centerbox><p class = center-block-text>' + feedback_instruct_text + '</p></div>'
}

/* ************************************ */
/* Define experimental variables */
/* ************************************ */
// generic task variables
var sumInstructTime = 0    //ms
var instructTimeThresh = 5   ///in seconds

// task specific variables
var practice_len = 5
var experiment_len = 50
var gap = 0
var current_trial = 0
stim = '<div class = shapebox><div id = cross></div></div>'



/* ************************************ */
/* Set up jsPsych blocks */
/* ************************************ */
/* define static blocks */
var welcome_block = {
  type: 'poldrack-text',
  data: {exp_id: "simple_reaction_time", trial_id: "welcome"},
  timing_response: 60000,
  text: '<div class = centerbox><p class = center-block-text>Welcome to the experiment. Press <strong>enter</strong> to begin.</p></div>',
  cont_key: [13],
  timing_post_trial: 0
};

var end_block = {
  type: 'poldrack-text',
  data: {exp_id: "simple_reaction_time", trial_id: "end"},
  timing_response: 60000,
  text: '<div class = centerbox><p class = center-block-text>Thanks for completing this task!</p><p class = center-block-text>Press <strong>enter</strong> to continue.</p></div>',
  cont_key: [13],
  timing_post_trial: 0
};

var feedback_instruct_text = 'Starting with instructions.  Press <strong> Enter </strong> to continue.'
var feedback_instruct_block = {
  type: 'poldrack-text',
  data: {exp_id: "simple_reaction_time", trial_id: "instruction"},
  cont_key: [13],
  text: getInstructFeedback,
  timing_post_trial: 0,
  timing_response: 60000
};
/// This ensures that the subject does not read through the instructions too quickly.  If they do it too quickly, then we will go over the loop again.
var instruction_trials = []
var instructions_block = {
  type: 'poldrack-instructions',
  data: {exp_id: "simple_reaction_time", trial_id: "instruction"},
  pages: ['<div class = centerbox><p class = block-text>In this experiment, we are testing how fast you can respond. On each trial press the spacebar as quickly as possible <strong>after</strong> you see the large "X".</p></div>'],
  allow_keys: false,
  show_clickable_nav: true,
  timing_post_trial: 1000
};
instruction_trials.push(feedback_instruct_block)
instruction_trials.push(instructions_block)

var instruction_node = {
    timeline: instruction_trials,
	/* This function defines stopping criteria */
    loop_function: function(data){
		for(i=0;i<data.length;i++){
			if((data[i].trial_type=='poldrack-instructions') && (data[i].rt!=-1)){
				rt=data[i].rt
				sumInstructTime=sumInstructTime+rt
			}
		}
		if(sumInstructTime<=instructTimeThresh*1000){
			feedback_instruct_text = 'Read through instructions too quickly.  Please take your time and make sure you understand the instructions.  Press <strong>enter</strong> to continue.'
			return true
		} else if(sumInstructTime>instructTimeThresh*1000){
			feedback_instruct_text = 'Done with instructions. Press <strong>enter</strong> to continue.'
			return false
		}
    }
}



    
var start_practice_block = {
  type: 'poldrack-text',
  data: {exp_id: "simple_reaction_time", trial_id: "practice_intro"},
  timing_response: 60000,
  text: '<div class = centerbox><p class = center-block-text>We will start 5 practice trials. Press <strong>enter</strong> to begin.</p></div>',
  cont_key: [13],
  timing_post_trial: 1000
};

var start_test_block = {
  type: 'poldrack-text',
  data: {exp_id: "simple_reaction_time", trial_id: "test_intro"},
  timing_response: 60000,
  text: '<div class = centerbox><p class = block-text>We will now start the test. Respond to the "X" as quickly as possible by pressing the spacebar. Press <strong>enter</strong> to begin.</p></div>',
  cont_key: [13],
  timing_post_trial: 1000
};

var reset_block = {
	type: 'call-function',
	data: {exp_id: "simple_reaction_time", trial_id: "reset_trial"},
	func: function() {
		current_trial = 0
	},
	timing_post_trial: 0
}

/* define practice block */
var practice_block = {
  type: 'poldrack-single-stim',
  stimulus: stim,
  is_html: true,
  data: {exp_id: "simple_reaction_time", trial_id: "stim", exp_stage: "practice"},
  choices: [32],
  timing_post_trial: post_trial_gap,
  on_finish: appendData
};

/* define test block */
var test_block = {
  type: 'poldrack-single-stim',
  stimulus: stim,
  timing_stim: 1000,
  timing_response: 1000,
  response_ends_trial: false,
  is_html: true,
  data: {exp_id: "simple_reaction_time", trial_id: "stim", exp_stage: "test"},
  choices: [32],
  timing_post_trial: post_trial_gap,
  on_finish: appendData
};

/* create experiment definition array */
var simple_reaction_time_experiment = [];
simple_reaction_time_experiment.push(welcome_block);
simple_reaction_time_experiment.push(instruction_node);

simple_reaction_time_experiment.push(start_practice_block);
for (var i = 0; i < practice_len; i++) {
	simple_reaction_time_experiment.push(practice_block);
}
simple_reaction_time_experiment.push(reset_block)
simple_reaction_time_experiment.push(start_test_block);
for (var i = 0; i < experiment_len; i++) {
	simple_reaction_time_experiment.push(test_block);
}
simple_reaction_time_experiment.push(end_block);
