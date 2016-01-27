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
};

//Calculates whether the last trial was correct and records the accuracy in data object
var record_acc = function() {
	var global_trial = jsPsych.progress().current_trial_global
	var stim_tmp = jsPsych.data.getData()[global_trial].stim.toLowerCase()
	var target_tmp = jsPsych.data.getData()[global_trial].target.toLowerCase()
	var key = jsPsych.data.getData()[global_trial].key_press
	if (stim_tmp == target_tmp && key == 32) {
		jsPsych.data.addDataToLastTrial({correct: 'correct'})
		block_acc +=1
	} else if (stim_tmp != target_tmp && key == -1) {
		jsPsych.data.addDataToLastTrial({correct: 'correct'})
		block_acc +=1
	} else {
		jsPsych.data.addDataToLastTrial({correct: 'incorrect'})
	}
	current_trial = current_trial + 1
};

var update_delay = function() {
	if (delay>=2){
		if (block_acc/num_trials > acc_thresh) {
			delay = delay+1
		} else if(block_acc/num_trials < (1-acc_thresh)) {
			delay = delay-1
		}
	} else if (delay==1){
		if	(block_acc/num_trials > acc_thresh) {
			delay = delay+1
		}else {
			delay =1
		}	
	}			
	block_acc = 0
};

var update_target = function() {
	if (current_trial%num_trials >= delay) {
		target = stims[current_trial-delay] 
	} else{
		target = ""
	}
};

var getData = function() {
	return {exp_id: "adaptive_n_back", load: delay, stim: stims[current_trial], target: target, trial_num: current_trial}
}

var getText = function() {
    return '<div class = "centerbox"><p class = "block-text">In these next blocks, you should respond when the current letter matches the letter that appeared ' + delay + ' trials before.</p><p class = center-block-text>Press <strong>enter</strong> to begin.</p></div>'
}


/* ************************************ */
/* Define experimental variables */
/* ************************************ */

var letters = 'bBdDgGtTvV'
var num_blocks = 20
var num_trials = 25 // per block
var control_before = Math.round(Math.random()) //0 control comes before test, 1, after
var block_acc = 0 // record block accuracy to determine next blocks delay
var delay = 2 // starting delay
var acc_thresh = 0.8 // percent correct above which the delay is increased (or decreased if percent correct is under 1-acc_thresh
var current_trial = 0
var target = ""
var stims = []
var gap = 0

/* ************************************ */
/* Set up jsPsych blocks */
/* ************************************ */
/* define static blocks */
var welcome_block = {
  type: 'poldrack-text',
  text: '<div class = "centerbox"><p class = "center-block-text">Welcome to the experiment. Press <strong>enter</strong> to begin.</p></div>',
  cont_key: [13],
  timing_response: 60000,
  timing_post_trial: 0
};

var instructions_block = {
  type: 'poldrack-instructions',
  pages: ['<div class = "centerbox"><p class = "block-text">In this experiment you will see a sequence of letters presented one at a time. Your job is to respond by pressing the spacebar when the letter matches the same letter that occured some number of trials before (the number of trials is called the "delay"). The letters will be both lower and upper case. You should ignore the case (so "t" matches "T")</p><p class = block-text>The specific delay you should pay attention to will differ between blocks of trials, and you will be told the delay before starting a trial block.</p><p class = block-text>For instance, if the delay is 2, you are supposed to respond when the current letter matches the letter that occured 2 trials ago. If you saw the sequence: g...G...v...T...b...t, you would respond only on the last "t".</p></div>'],
  allow_keys: false,
  show_clickable_nav: true,
  timing_post_trial: 1000
};

var update_delay_block = {
	type: 'call-function',
	func: update_delay,
    timing_post_trial: 0
}

var update_target_block = {
	type: 'call-function',
	func: update_target,
    timing_post_trial: 0
}

var end_block = {
  type: 'poldrack-text',
  text: '<div class = "centerbox"><p class = "center-block-text">Thanks for completing this task!</p><p class = center-block-text>Press <strong>enter</strong> to begin.</p></div>',
  cont_key: [13],
  timing_response: 60000,
  timing_post_trial: 0
};

var start_practice_block = {
  type: 'poldrack-text',
  text: '<div class = "centerbox"><p class = "center-block-text">Starting a practice block.</p><p class = "center-block-text">Press <strong>enter</strong> to begin.</p></div>',
  cont_key: [13],
  timing_response: 60000,
  timing_post_trial: 1000
};

var start_test_block = {
  type: 'poldrack-text',
  text: '<div class = "centerbox"><p class = "center-block-text">Starting a test block.</p><p class = "center-block-text">Press <strong>enter</strong> to begin.</p></div>',
  cont_key: [13],
  timing_response: 60000,
  timing_post_trial: 1000
};

var start_control_block = {
  type: 'poldrack-text',
  text: '<div class = "centerbox"><p class = "block-text">In this block you do not have to match letters to previous letters. Instead, press the spacebar everytime you see a "t" or "T".</p><p class = "center-block-text">Press <strong>enter</strong> to begin.</p></div>',
  cont_key: [13],
  timing_response: 60000,
  timing_post_trial: 1000
};

//Define control (0-back) block
var control_trials = []
for (var i=0; i<num_trials; i++) {
	var stim = randomDraw(letters)
	var control_block = {
	  type: 'poldrack-single-stim',
	  is_html: true,
	  stimulus: '<div class = "centerbox"><div class = "center-text">' + stim + '</div></div>',
	  data: {exp_id: "adaptive_n_back", load: 0, stim: stim, target: 't', trial_num: current_trial},
	  choices: [32],
	  timing_stim: 500,
	  timing_response: 2000,
	  response_ends_trial: false,
	  timing_post_trial: 0,
	  on_finish: record_acc
	};
	control_trials.push(control_block)
	current_trial = current_trial + 1
}

//Set up experiment
var adaptive_n_back_experiment = []
adaptive_n_back_experiment.push(welcome_block);
adaptive_n_back_experiment.push(instructions_block);

if (control_before === 0) {
	adaptive_n_back_experiment.push(start_control_block)
	adaptive_n_back_experiment = adaptive_n_back_experiment.concat(control_trials)
}
stims = []
for (var b = 0; b < num_blocks; b++) {
	current_trial = 0
	var start_delay_block = {
	  type: 'poldrack-text',
	  text: getText(),
	  cont_key: [13]
	};
	adaptive_n_back_experiment.push(start_delay_block)
	adaptive_n_back_experiment.push(start_test_block)
	for (var i=0; i<num_trials; i++) {
		var stim = randomDraw(letters)
		stims.push(stim)
		adaptive_n_back_experiment.push(update_target_block)
		var test_block = {
		  type: 'poldrack-single-stim',
		  is_html: true,
		  stimulus: '<div class = "centerbox"><div class = "center-text">' + stim + '</div></div>',
		  data: getData(),
		  choices: [32],
		  timing_stim: 500,
		  timing_response: 2000,
		  response_ends_trial: false,
		  timing_post_trial: 0,
		  on_finish: record_acc
		};
		adaptive_n_back_experiment.push(test_block)
	}
	adaptive_n_back_experiment.push(update_delay_block)
}



if (control_before == 1) {
	adaptive_n_back_experiment.push(start_control_block)
	adaptive_n_back_experiment = adaptive_n_back_experiment.concat(control_trials)
}
//Set up control
adaptive_n_back_experiment.push(end_block)
