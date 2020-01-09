/* ************************************ */
/* Define helper functions */
/* ************************************ */
function addID() {
  jsPsych.data.addDataToLastTrial({exp_id: 'go_nogo_single_task_network'})
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
    check_percent = checks_passed / attention_check_trials.length
  }
  return check_percent
}

function assessPerformance() {
	/* Function to calculate the "credit_var", which is a boolean used to
	credit individual experiments in expfactory. */
	var experiment_data = jsPsych.data.getTrialsOfType('poldrack-single-stim')
	var missed_count = 0
	var trial_count = 0
	var rt_array = []
	var rt = 0
	var correct = 0
		//record choices participants made
	var choice_counts = {}
	choice_counts[-1] = 0
	choice_counts[32] = 0
	
	for (var i = 0; i < experiment_data.length; i++) {
		if (experiment_data[i].trial_id == 'test_trial') {
			trial_count += 1
			key = experiment_data[i].key_press
			choice_counts[key] += 1
			if (experiment_data[i].go_nogo_condition == 'go'){
				if (experiment_data[i].key_press == experiment_data[i].correct_response){
					correct += 1
				}
				if (experiment_data[i].key_press == -1){
					missed_count += 1
				}
				if (experiment_data[i].key_press != -1){
					rt = experiment_data[i].rt
					rt_array.push(rt)
				}
			} else if (experiment_data[i].go_nogo_condition == 'nogo'){
				if (experiment_data[i].key_press == -1){
					correct += 1
				} else if (experiment_data[i].key_press != -1){
					rt = experiment_data[i].rt
					rt_array.push(rt)
				}
			}
		}	
	}
	
	//calculate average rt
	var avg_rt = -1
	if (rt_array.length !== 0) {
		avg_rt = math.median(rt_array) // ???median???
	} 
	//calculate whether response distribution is okay
	var responses_ok = true
	Object.keys(choice_counts).forEach(function(key, index) {
		if (choice_counts[key] > trial_count * 0.95) {
			responses_ok = false
		}
	})
	var missed_percent = missed_count/trial_count
	var accuracy = correct / trial_count
	credit_var = (missed_percent < 0.25 && avg_rt > 200 && accuracy > 0.60)
	jsPsych.data.addDataToLastTrial({final_credit_var: credit_var,
									 final_missed_percent: missed_percent,
									 final_avg_rt: avg_rt,
									 final_responses_ok: responses_ok,
									 final_accuracy: accuracy})
}

var get_response_time = function() {
  gap = 750 + Math.floor(Math.random() * 500) + 250
  return gap;
}

/* Append gap and current trial to data and then recalculate for next trial*/
var appendData = function(data) {
	var curr_trial = jsPsych.progress().current_trial_global
  
	if (jsPsych.data.getDataByTrialIndex(curr_trial).key_press == correct_response){
		jsPsych.data.addDataToLastTrial({
			correct_trial: 1,
		})

	} else if (jsPsych.data.getDataByTrialIndex(curr_trial).key_press != correct_response){
		jsPsych.data.addDataToLastTrial({
			correct_trial: 0,
		})
	}
	
	jsPsych.data.addDataToLastTrial({
		current_trial: current_trial,
	})
	
	current_trial +=1
}

var getFeedback = function() {
  if (stim.key_answer == -1) {
    return '<div class = centerbox><div class = center-text>Correct!</div></div>' + prompt_text_list
  } else {
    return '<div class = centerbox><div class = center-text>The shape was outlined</div></p></div>'  + prompt_text_list
  }
}

var getBlockFeedback = function() {
	return '<div class = bigbox><div class = picture_box><p class = block-text><font color="white">' + feedback_text + '</font></p></div></div>'
}


var getInstructFeedback = function() {
  return '<div class = centerbox><p class = center-block-text>' + feedback_instruct_text +
    '</p></div>'
}

var getStim = function(){
	stim = block_stims.pop()
	correct_response = stim.data.correct_response
	return stim.stimulus
}

var getData = function(){
	stim_data = stim.data
	return stim_data
}

var getCorrectResponse = function(){
	return stim_data.correct_response
}


/* ************************************ */
/* Define experimental variables */
/* ************************************ */
// generic task variables
var run_attention_checks = true
var attention_check_thresh = 0.45
var sumInstructTime = 0 //ms
var instructTimeThresh = 0 ///in seconds
var credit_var = 0


// task specific variables
var num_go_stim = 6 //per one no-go stim
var correct_responses = [
  ['go', 32],
  ['nogo', -1]
]

//var stims = jsPsych.randomization.shuffle([["orange", "stim1"],["blue","stim2"]])
var stims = [["solid", "stim1"],["outlined","stim2"]] //solid and outlined squares used as stimuli for this task are not png files as in some others, but they are defined in style.css
var gap = 0
var current_trial = 0
var practice_stimuli = [{ //To change go:nogo ratio, add or remove one or more sub-dictionaries within practice_stimuli and test_stimuli_block
  stimulus: '<div class = bigbox><div class = centerbox><div class = gng_number><div class = cue-text><div id = ' + stims[1][1] + '></div></div></div></div></div>',
  data: {
    correct_response: correct_responses[1][1],
    go_nogo_condition: correct_responses[1][0],
    trial_id: 'practice_trial'
  },
  key_answer: correct_responses[1][1]
}, {
	  stimulus: '<div class = bigbox><div class = centerbox><div class = gng_number><div class = cue-text><div  id = ' + stims[0][1] + '></div></div></div></div></div>',
	  data: {
	    correct_response: correct_responses[0][1],
	    go_nogo_condition: correct_responses[0][0],
	    trial_id: 'practice_trial'
	  },
	  key_answer: correct_responses[0][1]
}, {
	  stimulus: '<div class = bigbox><div class = centerbox><div class = gng_number><div class = cue-text><div  id = ' + stims[0][1] + '></div></div></div></div></div>',
	  data: {
	    correct_response: correct_responses[0][1],
	    go_nogo_condition: correct_responses[0][0],
	    trial_id: 'practice_trial'
	  },
	  key_answer: correct_responses[0][1]
}, {
	  stimulus: '<div class = bigbox><div class = centerbox><div class = gng_number><div class = cue-text><div  id = ' + stims[0][1] + '></div></div></div></div></div>',
	  data: {
	    correct_response: correct_responses[0][1],
	    go_nogo_condition: correct_responses[0][0],
	    trial_id: 'practice_trial'
	  },
	  key_answer: correct_responses[0][1]
}, {
	  stimulus: '<div class = bigbox><div class = centerbox><div class = gng_number><div class = cue-text><div  id = ' + stims[0][1] + '></div></div></div></div></div>',
	  data: {
	    correct_response: correct_responses[0][1],
	    go_nogo_condition: correct_responses[0][0],
	    trial_id: 'practice_trial'
	  },
	  key_answer: correct_responses[0][1]
}, {
	  stimulus: '<div class = bigbox><div class = centerbox><div class = gng_number><div class = cue-text><div  id = ' + stims[0][1] + '></div></div></div></div></div>',
	  data: {
	    correct_response: correct_responses[0][1],
	    go_nogo_condition: correct_responses[0][0],
	    trial_id: 'practice_trial'
	  },
	  key_answer: correct_responses[0][1]
}, {
	  stimulus: '<div class = bigbox><div class = centerbox><div class = gng_number><div class = cue-text><div  id = ' + stims[0][1] + '></div></div></div></div></div>',
	  data: {
	    correct_response: correct_responses[0][1],
	    go_nogo_condition: correct_responses[0][0],
	    trial_id: 'practice_trial'
	  },
	  key_answer: correct_responses[0][1]
}
];


//set up block stim. test_stim_responses indexed by [block][stim][type]
var test_stimuli_block = [{
  stimulus: '<div class = bigbox><div class = centerbox><div class = gng_number><div class = cue-text><div id = ' + stims[1][1] + '></div></div></div></div></div>',
  data: {
    correct_response: correct_responses[1][1],
    go_nogo_condition: correct_responses[1][0],
    trial_id: 'test_trial'
  }
},{
    stimulus: '<div class = bigbox><div class = centerbox><div class = gng_number><div class = cue-text><div  id = ' + stims[0][1] + '></div></div></div></div></div>',
    data: {
      correct_response: correct_responses[0][1],
      go_nogo_condition: correct_responses[0][0],
      trial_id: 'test_trial'
    }
},{
    stimulus: '<div class = bigbox><div class = centerbox><div class = gng_number><div class = cue-text><div  id = ' + stims[0][1] + '></div></div></div></div></div>',
    data: {
      correct_response: correct_responses[0][1],
      go_nogo_condition: correct_responses[0][0],
      trial_id: 'test_trial'
    }
},{
    stimulus: '<div class = bigbox><div class = centerbox><div class = gng_number><div class = cue-text><div  id = ' + stims[0][1] + '></div></div></div></div></div>',
    data: {
      correct_response: correct_responses[0][1],
      go_nogo_condition: correct_responses[0][0],
      trial_id: 'test_trial'
    }
},{
    stimulus: '<div class = bigbox><div class = centerbox><div class = gng_number><div class = cue-text><div  id = ' + stims[0][1] + '></div></div></div></div></div>',
    data: {
      correct_response: correct_responses[0][1],
      go_nogo_condition: correct_responses[0][0],
      trial_id: 'test_trial'
    }
},{
    stimulus: '<div class = bigbox><div class = centerbox><div class = gng_number><div class = cue-text><div  id = ' + stims[0][1] + '></div></div></div></div></div>',
    data: {
      correct_response: correct_responses[0][1],
      go_nogo_condition: correct_responses[0][0],
      trial_id: 'test_trial'
    }
},{
    stimulus: '<div class = bigbox><div class = centerbox><div class = gng_number><div class = cue-text><div  id = ' + stims[0][1] + '></div></div></div></div></div>',
    data: {
      correct_response: correct_responses[0][1],
      go_nogo_condition: correct_responses[0][0],
      trial_id: 'test_trial'
    }
}];


var accuracy_thresh = 0.75
var rt_thresh = 1000
var missed_thresh = 0.10

var practice_len = 28
var practice_thresh = 3

var exp_len = 245 //multiple of numTrialsPerBlock
var numTrialsPerBlock = 49 // multiple of 7 (6go:1nogo)
var numTestBlocks = exp_len / numTrialsPerBlock

var block_stims = jsPsych.randomization.repeat(practice_stimuli, practice_len / practice_stimuli.length); 




var prompt_text_list = '<ul style="text-align:left;">'+
						'<li>'+stims[0][0]+' square: Respond</li>' +
						'<li>'+stims[1][0]+' square: Do not respond</li>' +
					  '</ul>'

/* ************************************ */
/* Set up jsPsych blocks */
/* ************************************ */
// Set up attention check node
var attention_check_block = {
  type: 'attention-check',
  data: {
    trial_id: "attention_check"
  },
  timing_response: 180000,
  response_ends_trial: true,
  timing_post_trial: 200
}

var attention_node = {
  timeline: [attention_check_block],
  go_nogo_conditional_function: function() {
    return run_attention_checks
  }
}


//Set up post task questionnaire
var post_task_block = {
   type: 'survey-text',
   data: {
       exp_id: "go_nogo_single_task_network",
       trial_id: "post task questions"
   },
   questions: ['<p class = center-block-text style = "font-size: 20px">Please summarize what you were asked to do in this task.</p>',
              '<p class = center-block-text style = "font-size: 20px">Do you have any comments about this task?</p>'],
   rows: [15, 15],
   timing_response: 360000,
   columns: [60,60]
};

/* define static blocks */
var feedback_instruct_text =
  'Welcome to the experiment. This experiment will take around 15 minutes. Press <i>enter</i> to begin.'
var feedback_instruct_block = {
  type: 'poldrack-text',
  cont_key: [13],
  data: {
    trial_id: "instruction"
  },
  text: getInstructFeedback,
  timing_post_trial: 0,
  timing_response: 180000
};
/// This ensures that the subject does not read through the instructions too quickly.  If they do it too quickly, then we will go over the loop again.
var instructions_block = {
  type: 'poldrack-instructions',
  data: {
    trial_id: "instruction"
  },
  pages: [
    '<div class = centerbox>'+
	    '<p class = block-text>In this experiment, ' + stims[0][0] + ' and ' + stims[1][0] + ' squares will appear on the screen. '+
	    'If you see the ' + stims[0][0] + ' square you should <i> respond by pressing the spacebar as quickly as possible</i>. '+
	    'If you see the ' + stims[1][0] + ' square you should <i> not respond</i>.</p>'+
	    '<p class = block-text>We will begin with practice. You will receive feedback telling you if you were correct.</p>'+
	    '<p class = block-text>To avoid technical issues, please keep the experiment tab (on Chrome or Firefox) <i>active and in full-screen mode</i> for the whole duration of each task.</p>'+
	'</div>'
  ],
  allow_keys: false,
  show_clickable_nav: true,
  timing_post_trial: 1000
};

var instruction_node = {
  timeline: [feedback_instruct_block, instructions_block],
  /* This function defines stopping criteria */
  loop_function: function(data) {
    for (i = 0; i < data.length; i++) {
      if ((data[i].trial_type == 'poldrack-instructions') && (data[i].rt != -1)) {
        rt = data[i].rt
        sumInstructTime = sumInstructTime + rt
      }
    }
    if (sumInstructTime <= instructTimeThresh * 1000) {
      feedback_instruct_text =
        'Read through instructions too quickly.  Please take your time and make sure you understand the instructions.  Press <i>enter</i> to continue.'
      return true
    } else if (sumInstructTime > instructTimeThresh * 1000) {
      feedback_instruct_text =
        'Done with instructions. Press <i>enter</i> to continue.'
      return false
    }
  }
}

var end_block = {
  type: 'poldrack-text',
  timing_response: 180000,
  data: {
    trial_id: "end",
  },
  text: '<div class = centerbox><p class = center-block-text>Thanks for completing this task!</p>'+
  '<p class = center-block-text>Press <i>enter</i> to continue.</p></div>',
  cont_key: [13],
  timing_post_trial: 0,
  on_finish: function(){
		assessPerformance()
		evalAttentionChecks()
    }
};

var start_test_block = {
  type: 'poldrack-text',
  timing_response: 180000,
  data: {
    trial_id: "test_intro"
  },
  text: '<div class = centerbox><p class = block-text>Practice is over, we will now begin the experiment. You will no longer receive feedback about your responses.</p>'+
  '<p class = block-text>Remember, if you see the ' + stims[0][0] + ' square you should <i> respond by pressing the spacebar as quickly as possible</i>. '+
  'If you see the ' + stims[1][0] + ' square you should <i> not respond</i>. Press <i>enter</i> to begin.</p></div>',
  cont_key: [13],
  timing_post_trial: 1000,
  on_finish: function(){
  feedback_text = 
	'Starting a test block.  Press enter to continue.'
  
  }
};

var reset_block = {
  type: 'call-function',
  data: {
    trial_id: "reset_trial"
  },
  func: function() {
    current_trial = 0
  },
  timing_post_trial: 0
}

var feedback_text = 
	'Welcome to the experiment. This experiment will take around 15 minutes. Press <i>enter</i> to begin.'
var feedback_block = {
	type: 'poldrack-single-stim',
	data: {
		trial_id: "practice-no-stop-feedback"
	},
	choices: [13],
	stimulus: getBlockFeedback,
	timing_post_trial: 0,
	is_html: true,
	timing_response: 180000,
	response_ends_trial: true, 

};

var fixation_block = {
	type: 'poldrack-single-stim',
	stimulus: '<div class = centerbox><div class = fixation>+</div></div>',
	is_html: true,
	choices: 'none',
	data: {
		trial_id: "fixation",
	},
	timing_post_trial: 0,
	timing_stim: 500,
	timing_response: 500
};

var prompt_fixation_block = {
	type: 'poldrack-single-stim',
	stimulus: '<div class = centerbox><div class = fixation>+</div></div>',
	is_html: true,
	choices: 'none',
	data: {
		trial_id: "prompt_fixation",
	},
	timing_post_trial: 0,
	timing_stim: 500,
	timing_response: 500,
	prompt: prompt_text_list
};

var practiceTrials = []
practiceTrials.push(feedback_block)
practiceTrials.push(instructions_block)
for (var i = 0; i < practice_len; i ++){

	var practice_block = {
	  type: 'poldrack-categorize',
	  stimulus: getStim,
	  is_html: true,
	  data: getData,
	  key_answer: getCorrectResponse,
	  correct_text: '<div class = centerbox><div class = center-text>Correct!</div></div>',
	  incorrect_text: '<div class = centerbox><div class = center-text>The shape was outlined</div></div>',
	  timeout_message: getFeedback,
	  choices: [32],
	  timing_response: 2000, //2000
	  timing_stim: 1000, //1000
	  timing_feedback_duration: 500,
	  show_stim_with_feedback: false,
	  timing_post_trial: 0,
	  on_finish: appendData,
	  prompt: prompt_text_list
	}
	
	practiceTrials.push(prompt_fixation_block)
	practiceTrials.push(practice_block)
}

var practiceCount = 0
var practiceNode = {
	timeline: practiceTrials,
	loop_function: function(data){
		practiceCount += 1
		current_trial = 0
		block_stims = jsPsych.randomization.repeat(practice_stimuli, practice_len / practice_stimuli.length); 
	
		var sum_rt = 0
		var sum_responses = 0
		var correct = 0
		var total_trials = 0
		
		var total_go_trials = 0
		var missed_response = 0
	
		for (var i = 0; i < data.length; i++){
			if (data[i].trial_id == "practice_trial"){
				total_trials+=1
				if (data[i].rt != -1){
					sum_rt += data[i].rt
					sum_responses += 1
				}
				if (data[i].key_press == data[i].correct_response){
					correct += 1
	
				}
				
				if (data[i].go_nogo_condition == 'go'){
					total_go_trials += 1
					if (data[i].rt == -1){
						missed_response += 1
					}
				}
				
			}
		}
	
		var accuracy = correct / total_trials
		var missed_responses = missed_response / total_go_trials
		var ave_rt = sum_rt / sum_responses
	
		feedback_text = "<br>Please take this time to read your feedback and to take a short break! Press enter to continue"

		if (accuracy > accuracy_thresh){
			feedback_text +=
					'</p><p class = block-text>Done with this practice. Press Enter to continue.' 
			block_stims = jsPsych.randomization.repeat(test_stimuli_block, numTrialsPerBlock / test_stimuli_block.length);
			return false
	
		} else if (accuracy < accuracy_thresh){
			feedback_text +=
					'</p><p class = block-text>We are going to try practice again to see if you can achieve higher accuracy.  Remember: <br>' + prompt_text_list
					
			if (missed_responses > missed_thresh){
				feedback_text +=
						'</p><p class = block-text>You have not been responding to some trials.  Please respond on every trial that requires a response.'
			}

	      	if (ave_rt > rt_thresh){
	        	feedback_text += 
	            	'</p><p class = block-text>You have been responding too slowly.'
	      	}
		
			if (practiceCount == practice_thresh){
				feedback_text +=
					'</p><p class = block-text>Done with this practice.' 
					block_stims = jsPsych.randomization.repeat(test_stimuli_block, numTrialsPerBlock / test_stimuli_block.length);
					return false
			}
			
			feedback_text +=
				'</p><p class = block-text>Redoing this practice. Press Enter to continue.' 
			
			return true
		
		}
	
	}
	
}


var testTrials = []
testTrials.push(feedback_block)
testTrials.push(attention_node)
for (var i = 0; i < numTrialsPerBlock; i ++){
	
	var test_block = {
		type: 'poldrack-single-stim',
		stimulus: getStim,
		is_html: true,
		choices: [32],
		data: getData,
		timing_post_trial: 0,
		timing_stim: 1000, //1000
		timing_response: 2000, //2000
		on_finish: appendData
	};
	testTrials.push(fixation_block)
	testTrials.push(test_block)
}



var testCount = 0
var testNode = {
	timeline: testTrials,
	loop_function: function(data){
		testCount += 1
		current_trial = 0
	
		var sum_rt = 0
		var sum_responses = 0
		var correct = 0
		var total_trials = 0
		var total_go_trials = 0
		var missed_response = 0
		
	
		for (var i = 0; i < data.length; i++){
			if (data[i].trial_id == "test_trial"){
				total_trials+=1
				if (data[i].rt != -1){
					sum_rt += data[i].rt
					sum_responses += 1
				}
				if (data[i].key_press == data[i].correct_response){
					correct += 1
	
				}
				
				if (data[i].go_nogo_condition == 'go'){
					total_go_trials += 1
					if (data[i].rt == -1){
						missed_response += 1
					}
				}
			}
		}
		var accuracy = correct / total_trials
		var missed_responses = missed_response / total_go_trials
		var ave_rt = sum_rt / sum_responses
	
		feedback_text = "<br>Please take this time to read your feedback and to take a short break! Press enter to continue"
		feedback_text += "</p><p class = block-text>You have completed " +testCount+ " out of " +numTestBlocks+ " blocks of trials."

		if (testCount >= numTestBlocks){
			
			feedback_text +=
					'</p><p class = block-text>Done with this test. Press Enter to continue.<br> '+
					'If you have been completing tasks continuously for an hour or more, please take a 15-minute break before starting again.' 
			return false
	
		} else {
			if (accuracy < accuracy_thresh){
			feedback_text +=
					'</p><p class = block-text>Your accuracy is too low.  Remember: <br>' + prompt_text_list
					
			}

	      	if (ave_rt > rt_thresh) {
	        	feedback_text += 
	            	'</p><p class = block-text>You have been responding too slowly.'
	      	}
			
			if (missed_responses > missed_thresh){
				feedback_text +=
						'</p><p class = block-text>You have not been responding to some trials.  Please respond on every trial that requires a response.'
			}
		
			
			feedback_text +=
				'</p><p class = block-text>Press Enter to continue.' 
			block_stims = jsPsych.randomization.repeat(test_stimuli_block, numTrialsPerBlock / test_stimuli_block.length);
			return true
		
		}
	
	}
	
}


/* create experiment definition array */
var go_nogo_single_task_network_experiment = [];

go_nogo_single_task_network_experiment.push(practiceNode)
go_nogo_single_task_network_experiment.push(feedback_block)

go_nogo_single_task_network_experiment.push(start_test_block);
go_nogo_single_task_network_experiment.push(testNode);
go_nogo_single_task_network_experiment.push(feedback_block)

go_nogo_single_task_network_experiment.push(post_task_block)
go_nogo_single_task_network_experiment.push(end_block)