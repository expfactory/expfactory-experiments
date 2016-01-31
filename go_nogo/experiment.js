
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

function addID() {
  jsPsych.data.addDataToLastTrial({'exp_id': 'go_nogo'})
}

var post_trial_gap = function() {
  gap = Math.floor( Math.random() * 500 ) + 500
  return gap;
}

/* Append gap and current trial to data and then recalculate for next trial*/
var appendData = function() {
	jsPsych.data.addDataToLastTrial({ITT: gap, trial_num: current_trial})
	current_trial = current_trial + 1
}

var practice_index = 0
var getFeedback = function() {
	if (practice_trials[practice_index].key_answer == -1) {
		practice_index += 1
		return  '<div class = centerbox><div class = center-text><font size = 20>Correct</font></p></div>'
	} else {
		practice_index +=1
		return  '<div class = centerbox><div class = center-text><font size = 20>Incorrect</font></p></div>'
	}
}

var getInstructFeedback = function() {
	return '<div class = centerbox><p class = center-block-text>' + feedback_instruct_text + '</p></div>'
}

/* ************************************ */
/* Define experimental variables */
/* ************************************ */
// generic task variables
var run_attention_checks = true
var attention_check_thresh = 0.45
var sumInstructTime = 0    //ms
var instructTimeThresh = 5   ///in seconds

// task specific variables
var correct_responses = jsPsych.randomization.repeat([['go',32, 'respond'],['nogo',-1, 'not respond']],1)
var gap = 0
var current_trial = 0
var practice_stimuli = [
  {
	stimulus: '<div class = centerbox><div  id = "stim1"></div></div>',
	data: { correct_response: correct_responses[0][1], condition: correct_responses[0][0], trial_id: 'practice', exp_id: 'go_nogo'},
	key_answer: correct_responses[0][1]
  },
  {
	stimulus:  '<div class = centerbox><div id = "stim2"></div></div>',
	data: { correct_response: correct_responses[1][1], condition:  correct_responses[1][0], trial_id: 'practice', exp_id: 'go_nogo'},
	key_answer: correct_responses[1][1]
  }
];

//set one of the stims to 'go' for block 1 and the other to 'go' for block 2
test_stim_responses = jsPsych.randomization.repeat([[['go',32, 'respond'],['nogo',-1, 'not respond']],[['nogo',-1, 'not respond'],['go',32, 'respond']]],1)
//set up block stim. test_stim_responses indexed by [block][stim][type]
var test_stimuli_block = [
  {
	stimulus: '<div class = centerbox><div  id = "stim1"></div></div>',
	data: { correct_response: test_stim_responses[0][0][1], condition: test_stim_responses[0][0][0], trial_id: 'test_block', exp_id: 'go_nogo'}
  },
  {
	stimulus:  '<div class = centerbox><div id = "stim2"></div></div>',
	data: { correct_response: test_stim_responses[0][1][1], condition:  test_stim_responses[0][1][0], trial_id: 'test_block', exp_id: 'go_nogo'}
  }
];



var practice_trials = jsPsych.randomization.repeat(practice_stimuli, 10); 
var test_trials = jsPsych.randomization.repeat(test_stimuli_block, 50);   


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
  data: {exp_id: "go_nogo", trial_id: "welcome"},
  text: '<div class = centerbox><p class = center-block-text>Welcome to the experiment. Press <strong>enter</strong> to begin.</p></div>',
  cont_key: [13],
  timing_post_trial: 0
};

var feedback_instruct_text = 'Starting with instructions.  Press <strong> Enter </strong> to continue.'
var feedback_instruct_block = {
  type: 'poldrack-text',
  cont_key: [13],
  data: {exp_id: "go_nogo", trial_id: "instruction"},
  text: getInstructFeedback,
  timing_post_trial: 0,
  timing_response: 60000
};
/// This ensures that the subject does not read through the instructions too quickly.  If they do it too quickly, then we will go over the loop again.
var instruction_trials = []	 
var instructions_block = {
  type: 'poldrack-instructions',
  data: {exp_id: "go_nogo", trial_id: "instruction"},
  pages: ['<div class = centerbox><p class = block-text>In this experiment blue and orange squares will appear on the screen. You will be told to respond to one of the colored squares by pressing the space bar. You should only respond to this color and withhold any response to the other color.</p></div>'],
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

var end_block = {
  type: 'poldrack-text',
  timing_response: 60000,
  data: {exp_id: "go_nogo", trial_id: "end"},
  text: '<div class = centerbox><p class = center-block-text>Thanks for completing this task!</p><p class = center-block-text>Press <strong>enter</strong> to continue.</p></div>',
  cont_key: [13],
  timing_post_trial: 0
};

var start_practice_block = {
  type: 'poldrack-text',
  timing_response: 60000,
  data: {exp_id: "go_nogo", trial_id: "practice_intro"},
  text: '<div class = centerbox><p class = block-text>We will begin with practice. If you see the <font color="orange">orange</font> square you should <strong>' + correct_responses[0][2] + '</strong>. If you see the <font color="blue">blue</font> square you should <strong>' + correct_responses[1][2] + '</strong>.</p><p class = block-text>You will get feedback telling you if you were correct.</p></div>',
  timing_post_trial: 1000
};

var start_test_block = {
  type: 'poldrack-text',
  timing_response: 60000,
  data: {exp_id: "go_nogo", trial_id: "test_intro"},
  text: '<div class = centerbox><p class = block-text>We will now begin the first test block. You will no longer get feedback about your responses.</p><p class = block-text>If you see the <font color="orange">orange</font> square you should <strong>' + test_stim_responses[0][0][2] + '</strong>. If you see the <font color="blue">blue</font> square you should <strong>' + test_stim_responses[0][1][2] + '</strong>. Press <strong>enter</strong> to begin.</p></div>',
  cont_key: [13],
  timing_post_trial: 1000
};

var reset_block = {
	type: 'call-function',
	data: {exp_id: "go_nogo", trial_id: "reset_trial"},
	func: function() {
		current_trial = 0
	},
	timing_post_trial: 0
}


/* define practice block */
var practice_block = {
  type: 'poldrack-categorize',
  timeline: practice_trials,
  is_html: true,
  data: {exp_id: "go_nogo", trial_id: "stim", exp_stage: "practice"},
  correct_text: '<div class = centerbox><div class = center-text><font size = 20>Correct</font></div></div>',
  incorrect_text: '<div class = centerbox><div class = center-text><font size = 20>Incorrect</font></div></div>',
  timeout_message: getFeedback,
  choices: [32],
  timing_response: 2000, 
  timing_stim: 2000,
  timing_feedback_duration: 1000,
  show_stim_with_feedback: false,
  timing_post_trial: post_trial_gap,
  on_finish: appendData
}

/* define test block */
var test_block = {
  type: 'poldrack-single-stim',
  timeline: test_trials,
  data: {exp_id: "go_nogo", trial_id: "stim", exp_stage: "test"},
  is_html: true,
  choices: [32],
  timing_response: 2000,
  timing_post_trial: post_trial_gap,
  on_finish: appendData
};



/* create experiment definition array */
var go_nogo_experiment = [];
go_nogo_experiment.push(welcome_block);
go_nogo_experiment.push(instruction_node);
go_nogo_experiment.push(start_practice_block)
go_nogo_experiment.push(practice_block);
go_nogo_experiment.push(attention_node)
go_nogo_experiment.push(reset_block)
go_nogo_experiment.push(start_test_block);
go_nogo_experiment.push(test_block);
go_nogo_experiment.push(attention_node)
go_nogo_experiment.push(end_block)
