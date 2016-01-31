/* ************************************ */
/* Define helper functions */
/* ************************************ */
function getDisplayElement () {
    $('<div class = display_stage_background></div>').appendTo('body')
    return $('<div class = display_stage></div>').appendTo('body')
}

function addID() {
  jsPsych.data.addDataToLastTrial({'exp_id': 'stim_selective_stop_signal'})
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
}

var getPracticeFeedback = function() {
	return '<div class = centerbox><p class = block-text>' + practice_feedback_text + '</p></div>'
}

/* After each test block let the subject know their average RT and accuracy. If they succeed or fail on too many stop signal trials, give them a reminder */
var getTestFeedback = function() {
	var data = test_block_data
	var sum_rt = 0;
	var sum_correct = 0;
	var go_length = 0;
	var stop_length = 0;
	var num_responses = 0;
	var successful_stops = 0;
	for(var i=0; i < data.length; i++){
		if (data[i].SS_trial_type != 'stop') {
			go_length += 1
			if (data[i].rt != -1) {
				num_responses += 1
				sum_rt += data[i].rt;
				if (data[i].key_press == data[i].correct_response) { sum_correct += 1 }
			}
		} else {
			stop_length +=1
			if (data[i].rt == -1) {
				successful_stops +=1
			}
		}
	}
	var average_rt = sum_rt / num_responses;
	var average_correct = sum_correct / go_length;
	var missed_responses = (go_length - num_responses) / go_length
	var stop_percent = successful_stops/stop_length
	test_feedback_text = "Average reaction time:  " + Math.round(average_rt) + " ms. Accuracy: " + Math.round(average_correct*100) + "%"
	if (average_rt > RT_thresh) {
        test_feedback_text += '</p><p class = block-text>Remember, try to response as quickly and accurately as possible when no stop signal occurs.'
    }
    if (missed_responses >= missed_response_thresh) {
        test_feedback_text += '</p><p class = block-text>Remember to respond to each shape unless you see the blue stop signal.'
    }
    if (average_correct < accuracy_thresh) {
        test_feedback_text += '</p><p class = block-text>Remember, the correct keys are as follows: ' + prompt_text
    }
	if (stop_percent >= accuracy_thresh) {
		test_feedback_text += '</p><p class = block-text> Remember to respond as quickly as possible on each trial.'
	} else if (stop_percent <= (1-accuracy_thresh)) {
		test_feedback_text += '</p><p class = block-text> Remember to try to withold your response if you see the blue stop signal.'
	}
	test_feedback_text += '</p><p class = block-text> Press <strong>enter</strong> to start the next block.'
	return '<div class = centerbox><p class = block-text>' + test_feedback_text + '</p></div>'
}

/* Staircase procedure. After each successful stop, make the stop signal delay longer (making stopping harder) */
var updateSSD = function(data) {
	jsPsych.data.addDataToLastTrial({'SSD': SSD})
	if (data.SS_trial_type == 'stop') {
		if (data.rt == -1 && SSD<850) {
			SSD = SSD + 50
		} else if (data.rt != -1 && SSD > 0) { 
			SSD = SSD - 50
		}
	}
}

var getSSD = function() {
	return SSD
}

var resetSSD = function() {
	SSD = 250
}

/* These methods allow NoSSPractice and SSPractice to be randomized for each iteration
of the "while" loop */
var getNoSSPracticeStim = function() {
	practice_trial_data = NoSS_practice_list.data.pop()
	practice_trial_data.condition = "NoSS_practice"
	return NoSS_practice_list.stimulus.pop()
}

var getNoSSPracticeData = function() {
	return practice_trial_data
}

var getSSPracticeStim = function() {
	practice_stop_trial = practice_stop_trials.pop()
	practice_trial_data = practice_list.data.pop()
	practice_trial_data.condition = "practice_" + practice_stop_trial
	return practice_list.stimulus.pop()
}

var getSSPracticeData = function() {
	return practice_trial_data
}

var getSSPractice_trial_type = function() {
	if (practice_stop_trial == 'ignore') {
		return 'stop'
	} else {
		return practice_stop_trial
	}
}

var getSSPractice_stop_signal = function() {
	if (practice_stop_trial == 'ignore') {
		return ignore_signal
	} else {
		return stop_signal
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
var attention_check_thresh = 0.65
var sumInstructTime = 0    //ms
var instructTimeThresh = 7   ///in seconds

// task specific variables
/* Stop signal delay in ms */
var SSD = 250
var stop_signal = '<div class = stopbox><div class = centered-shape id = stop-signal></div><div class = centered-shape id = stop-signal-inner></div></div>'
var ignore_signal = '<div class = stopbox><div class = centered-shape id = ignore-signal></div><div class = centered-shape id = ignore-signal-inner></div></div>'
var possible_responses = [["M key",77],["Z key",90]]
var correct_responses = jsPsych.randomization.shuffle([possible_responses[0],possible_responses[0],possible_responses[1],possible_responses[1]])
var prompt_text = '<ul list-text><li>Square:  ' + correct_responses[0][0] + '</li><li>Circle:  ' + correct_responses[1][0] + ' </li><li>Triangle:  ' + correct_responses[2][0] + ' </li><li>Diamond:  ' + correct_responses[3][0] + ' </li></ul>'
var RT_thresh = 1000
var missed_response_thresh = 0.05
var accuracy_thresh = 0.75
var stop_thresh = 1
var test_block_data = [] // records the data in the current block to calculate feedback

var stimulus = [
	{stimulus: '<div class = shapebox><img class = square></img></div>',
	data: {correct_response: correct_responses[0][1], exp_id: "stim_selective_stop_signal"}
	},
	{stimulus: '<div class = shapebox><img class = circle></img></div>',
	data: {correct_response: correct_responses[1][1], exp_id: "stim_selective_stop_signal"}
	},
	{stimulus: '<div class = shapebox><img class = triangle></img></div>',
	data: {correct_response: correct_responses[2][1], exp_id: "stim_selective_stop_signal"}
	},
	{stimulus: '<div class = shapebox><img class = diamond></img></div>',
	data: {correct_response: correct_responses[3][1], exp_id: "stim_selective_stop_signal"}
	}
]

var NoSSpractice_block_len = 12
var practice_block_len = 20
var practice_trial_data = '' //global variable to track randomized practice trial data
var NoSS_practice_list = jsPsych.randomization.repeat(stimulus,NoSSpractice_block_len/4,true)
var practice_list = jsPsych.randomization.repeat(stimulus,practice_block_len/4,true)
var practice_stop_trials = jsPsych.randomization.repeat(['stop','stop','ignore','ignore','go','go','go','go','go','go'],practice_block_len/10)

//number of blocks
var test_block_len = 60
var numblocks = 5
var blocks = []
for (i = 0; i< numblocks; i++) {
	blocks.push(jsPsych.randomization.repeat(stimulus,test_block_len/4, true))
}

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
  text: '<div class = centerbox><p class = block-text>Welcome to the stop signal experiment. Press <strong>enter</strong> to begin.</p></div>',
  cont_key: [13],
  timing_post_trial: 0
};

var end_block = {
  type: 'poldrack-text',
  timing_response: 60000,
  text: '<div class = centerbox><p class = center-block-text>Thanks for completing this task!</p><p class = center-block-text>Press <strong>enter</strong> to continue.</p></div>',
  cont_key: [13],
  timing_post_trial: 0
};

var feedback_instruct_text = 'Starting with instructions.  Press <strong> Enter </strong> to continue.'
var feedback_instruct_block = {
  type: 'poldrack-text',
  cont_key: [13],
  text: getInstructFeedback,
  timing_post_trial: 0,
  timing_response: 60000
};
/// This ensures that the subject does not read through the instructions too quickly.  If they do it too quickly, then we will go over the loop again.
var instruction_trials = []
var instructions_block = {
  type: 'poldrack-instructions',
  pages: [
	'<div class = centerbox><p class = block-text>In this task you will see black shapes appear on the screen one at a time. You will respond to them by pressing the "Z" and "M" keys.</p></div>',
	'<div class = centerbox><p class = block-text>Only one key is correct for each shape. The correct keys are as follows:' + prompt_text + '<p class = block-text>These instructions will remain on the screen during practice, but will be removed during the test phase.</p></div>',
	'<div class = centerbox><p class = block-text>You should respond as quickly and accurately as possible to each shape.</p></div>',
	],
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

var fixation_block = {
  type: 'poldrack-single-stim',
  stimulus: '<div class = centerbox><div class = fixation>+</div></div>',
  is_html: true,
  choices: 'none',
  data: {exp_id: "stim_selective_stop_signal", "trial_id": "fixation"},
  timing_post_trial: 0,
  timing_stim: 500,
  timing_response: 500
}

/* prompt blocks are used during practice to show the instructions */

var prompt_fixation_block = {
  type: 'poldrack-single-stim',
  stimulus: '<div class = shapebox><div class = fixation>+</div></div>',
  is_html: true,
  choices: 'none',
  data: {exp_id: "stim_selective_stop_signal", "trial_id": "fixation"},
  timing_post_trial: 0,
  timing_stim: 500,
  timing_response: 500,
  prompt: prompt_text
}

/* Initialize 'feedback text' and set up feedback blocks */
var practice_feedback_text = 'We will now start with a practice session. In this practice  concentrate on responding quickly and accurately to each shape. Press <strong>enter</strong> to continue.'
var practice_feedback_block = {
  type: 'poldrack-text',
  timing_response: 60000,
  cont_key: [13],
  text: getPracticeFeedback
};

var test_feedback_block = {
  type: 'poldrack-text',
  timing_response: 120000,
  cont_key: [13],
  text: getTestFeedback
};

/* reset SSD block */
var reset_block = {
    type: 'call-function',
    func: function() {
    	test_block_data = []
    	resetSSD()
    },
    timing_post_trial: 0
}



/* ************************************ */
/* Set up experiment */
/* ************************************ */

var stim_selective_stop_signal_experiment = []
stim_selective_stop_signal_experiment.push(welcome_block);
stim_selective_stop_signal_experiment.push(instruction_node);

/* Practice block w/o SS */
NoSS_practice_trials = []
NoSS_practice_trials.push(practice_feedback_block)
for (i = 0; i < NoSSpractice_block_len; i++) {
	NoSS_practice_trials.push(prompt_fixation_block)
	var stim_block = {
	  type: 'poldrack-single-stim',
	  stimulus: getNoSSPracticeStim,
	  data: getNoSSPracticeData,
	  is_html: true,
	  choices: [possible_responses[0][1], possible_responses[1][1]],
	  timing_post_trial: 0,
	  timing_stim: 850,
	  timing_response: 1850,
	  response_ends_trial: false,
	  prompt: prompt_text,
	  on_finish: function() {
	  	jsPsych.data.addDataToLastTrial({'trial_id': 'NoSS_practice_stim'})
	  }
	}
	NoSS_practice_trials.push(stim_block)
}

var NoSS_practice_node = {
    timeline: NoSS_practice_trials,
	loop_function: function(data){
        var sum_rt = 0;
        var sum_correct = 0;
        var go_length = 0;
		var num_responses = 0;
        for(var i=0; i < data.length; i++){
			if (data[i].condition == "NoSS_practice") {
				if (data[i].rt != -1) {
					num_responses += 1
					sum_rt += data[i].rt;
					if (data[i].key_press == data[i].correct_response) { sum_correct += 1 }
				} 
				go_length += 1
			}
        }
        var average_rt = sum_rt / num_responses;
        var average_correct = sum_correct / go_length;
		var missed_responses = (go_length - num_responses) / go_length
        practice_feedback_text = "Average reaction time:  " + Math.round(average_rt) + " ms. Accuracy: " + Math.round(average_correct*100) + "%"
        if(average_rt < RT_thresh && average_correct > accuracy_thresh && missed_responses < missed_response_thresh){
            // end the loop
			practice_feedback_text += '</p><p class = block-text>For the rest of the experiment, on some proportion of trials a blue or orange "signal" will appear around the shape after a short delay. If the signal is blue it is a "stop signal". On these trials you should <strong>not respond</strong> in any way.</p><p class = block-text>If the signal is orange you should respond like you normally would. It is equally important that you both respond quickly and accurately to the shapes when there is no blue stop signal <strong>and</strong> successfully stop your response on trials where there is a blue stop signal.'
            return false;
        } else {
        	//rerandomize stim order
        	NoSS_practice_list = jsPsych.randomization.repeat(stimulus,3,true)
            // keep going until they are faster!
			practice_feedback_text += '</p><p class = block-text>We will try another practice block. '
            if (average_rt > RT_thresh) {
                practice_feedback_text += '</p><p class = block-text>Remember, try to response as quickly and accurately as possible.'
            }
			if (missed_responses >= missed_response_thresh) {
			    practice_feedback_text += '</p><p class = block-text>Remember to respond to each shape.'
			}
			if (average_correct <= accuracy_thresh) {
                practice_feedback_text += '</p><p class = block-text>Remember, the correct keys are as follows: ' + prompt_text
            }
            return true;
        }
    }
}

/* Practice block with SS */

var practice_trials = []
practice_trials.push(practice_feedback_block)
for (i = 0; i < practice_block_len; i++) {
	practice_trials.push(prompt_fixation_block)
    var stop_signal_block = {
	  type: 'stop-signal',
	  stimulus: getSSPracticeStim,
	  SS_stimulus: getSSPractice_stop_signal,
	  SS_trial_type: getSSPractice_trial_type,
	  data: getSSPracticeData,
	  is_html: true,
	  choices: [possible_responses[0][1], possible_responses[1][1]],
	  timing_stim: 850,
	  timing_response: 1850,
	  response_ends_trial: false,
	  prompt: prompt_text,
	  SSD: SSD,
	  timing_SS: 250,
	  timing_post_trial: 0,
	  on_finish: function(data) {
	  	jsPsych.data.addDataToLastTrial({'trial_id': 'practice_stim'})
	  }  
    }
	practice_trials.push(stop_signal_block)
} 


/* Practice node continues repeating until the subject reaches certain criteria */
var practice_node = {
    timeline: practice_trials,
	/* This function defines stopping criteria */
    loop_function: function(data){
        var sum_rt = 0;
        var sum_correct = 0;
        var go_length = 0;
		var num_responses = 0;
		var stop_length = 0
		var successful_stops = 0
        for(var i=0; i < data.length; i++){
            if (data[i].condition == "practice_go" || data[i].condition == "practice_ignore") {
				if (data[i].rt != -1) {
					num_responses += 1
					sum_rt += data[i].rt;
					if (data[i].key_press == data[i].correct_response) { sum_correct += 1 }
				} 
				go_length += 1
            } else if (data[i].SS_trial_type == "practice_stop"){
				stop_length +=1
				if (data[i].rt == -1) {
					successful_stops +=1
				}
			}
        }
        var average_rt = sum_rt / num_responses;
        var average_correct = sum_correct / go_length;
		var missed_responses = (go_length - num_responses) / go_length
		var stop_percent = successful_stops/stop_length
        practice_feedback_text = "Average reaction time:  " + Math.round(average_rt) + " ms. Accuracy: " + Math.round(average_correct*100) + "%"
        if(average_rt < RT_thresh && average_correct > accuracy_thresh && missed_responses < missed_response_thresh && successful_stops < stop_thresh){
            // end the loop
			practice_feedback_text += '</p><p class = block-text>Done with practice. We will now begin the ' + numblocks + ' test blocks. There will be a break after each block. Press <strong>enter</strong> to continue.'
            return false;
        } else {
        	//rerandomize stim and stop_trial order
        	practice_list = jsPsych.randomization.repeat(stimulus,5,true)
        	practice_stop_trials = jsPsych.randomization.repeat(['stop','stop','stop','go','go','go','go','go','go','go'],practice_list.data.length/10,false)
            // keep going until they are faster!
			practice_feedback_text += '</p><p class = block-text>We will try another practice block. '
            if (average_rt > RT_thresh) {
                practice_feedback_text += '</p><p class = block-text>Remember, try to response as quickly and accurately as possible when no stop signal occurs.'
            }
			if (missed_responses >= missed_response_thresh) {
			    practice_feedback_text += '</p><p class = block-text>Remember to respond to each shape unless you see the blue stop signal.'
			}
			if (average_correct <= accuracy_thresh) {
                practice_feedback_text += '</p><p class = block-text>Remember, the correct keys are as follows: ' + prompt_text
            }
            if (successful_stops < stop_thresh) {
		        practice_feedback_text += '</p><p class = block-text> Remember to try to withhold your response when you see a stop signal.'
		    }
            return true;
        }
    }
}

stim_selective_stop_signal_experiment.push(NoSS_practice_node)
stim_selective_stop_signal_experiment.push(practice_node)
stim_selective_stop_signal_experiment.push(practice_feedback_block) 

/* Test blocks */
// Loop through the multiple blocks within each condition
for (b = 0; b< numblocks; b++) {
	stop_signal_exp_block = []
	var block = blocks[b]
	var stop_trials = jsPsych.randomization.repeat(['stop','ignore','go','go','go'],test_block_len/5)
	// Loop through each trial within the block
	for (i = 0; i < test_block_len; i++) {
		stop_signal_exp_block.push(fixation_block)
		//Label each trial as an ignore, stop or go trial
		var stim_data = $.extend({},block.data[i])
		stim_data.condition = 'test_' + stop_trials[i]
		if (stop_trials[i] == 'ignore') {
			var stop_trial = 'stop'
			var stop_stim = ignore_signal
		} else {
			var stop_stim = stop_signal
			var stop_trial = stop_trials[i]
		}
		var stop_signal_block = {
		  type: 'stop-signal',
		  stimulus: block.stimulus[i],
		  SS_stimulus: stop_signal,
		  SS_trial_type: stop_trial,
		  data: stimdata,
		  is_html: true,
		  choices: [possible_responses[0][1], possible_responses[1][1]],
		  timing_stim: 850,
		  timing_response: 1850,
		  response_ends_trial: false,
		  SSD: getSSD,
		  timing_SS: 500,
		  timing_post_trial: 0,
		  on_finish: function(data) {
		  	updateSSD(data)
		  	jsPsych.data.addDataToLastTrial({'trial_id': 'test_stim'})
		  	test_block_data.push(data)
		  }
		}
		stop_signal_exp_block.push(stop_signal_block)
	}

	stim_selective_stop_signal_experiment = stim_selective_stop_signal_experiment.concat(stop_signal_exp_block)
	if ($.inArray(b,[0,1,4]) != -1) {
		motor_selective_stop_signal.push(attention_node)
	}
	stim_selective_stop_signal_experiment.push(test_feedback_block)
}
stim_selective_stop_signal_experiment.push(end_block)
