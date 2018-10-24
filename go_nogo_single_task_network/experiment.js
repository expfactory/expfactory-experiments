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

function assessPerformance() {
	/* Function to calculate the "credit_var", which is a boolean used to
	credit individual experiments in expfactory. */
	var experiment_data = jsPsych.data.getTrialsOfType('poldrack-single-stim')
	var missed_count = 0
	var trial_count = 0
	var rt_array = []
	var rt = 0
		//record choices participants made
	var choice_counts = {}
	choice_counts[-1] = 0
	choice_counts[32] = 0
	for (var i = 0; i < experiment_data.length; i++) {
		if (experiment_data[i].possible_responses != 'none') {
			trial_count += 1
			rt = experiment_data[i].rt
			key = experiment_data[i].key_press
			choice_counts[key] += 1
			if (rt == -1) {
				missed_count += 1
			} else {
				rt_array.push(rt)
			}
		}
	}
	//calculate average rt
	var avg_rt = -1
	if (rt_array.length !== 0) {
		avg_rt = math.median(rt_array)
	} 
	credit_var = (avg_rt > 200)
	jsPsych.data.addDataToLastTrial({"credit_var": credit_var})
}

var get_response_time = function() {
  gap = 750 + Math.floor(Math.random() * 500) + 250
  return gap;
}

/* Append gap and current trial to data and then recalculate for next trial*/
var appendData = function(data) {
  var correct = false
  if (data.key_press == data.correct_response) {
    correct = true
  }
  jsPsych.data.addDataToLastTrial({
    trial_num: current_trial,
    correct: correct
  })
  current_trial = current_trial + 1
}

var practice_index = 0
var getFeedback = function() {
  if (practice_trials[practice_index].key_answer == -1) {
    practice_index += 1
    return '<div class = centerbox><div class = center-text>Correct!</div></div>' + prompt_text_list
  } else {
    practice_index += 1
    return '<div class = centerbox><div class = center-text>Incorrect</div></p></div>'  + prompt_text_list
  }
}

var getBlockFeedback = function() {
	return '<div class = bigbox><div class = picture_box><p class = block-text><font color="white">' + feedback_text + '</font></p></div></div>'
}


var getInstructFeedback = function() {
  return '<div class = centerbox><p class = center-block-text>' + feedback_instruct_text +
    '</p></div>'
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

var practice_thresh = 3 // 3 blocks of 15 trials
var accuracy_thresh = 0.80
var missed_thresh = 0.10

// task specific variables
var num_go_stim = 4 //per one no-go stim
var correct_responses = [
  ['go', 32],
  ['nogo', -1]
]

var stims = jsPsych.randomization.shuffle([["orange", "stim1"],["blue","stim2"]])
var gap = 0
var current_trial = 0
var practice_stimuli = [{
  stimulus: '<div class = centerbox><div  id = ' + stims[0][1] + '></div></div>',
  data: {
    correct_response: correct_responses[0][1],
    condition: correct_responses[0][0],
    trial_id: 'practice'
  },
  key_answer: correct_responses[0][1]
}, {
  stimulus: '<div class = centerbox><div id = ' + stims[1][1] + '></div></div>',
  data: {
    correct_response: correct_responses[1][1],
    condition: correct_responses[1][0],
    trial_id: 'practice'
  },
  key_answer: correct_responses[1][1]
}];


//set up block stim. test_stim_responses indexed by [block][stim][type]
var test_stimuli_block = [{
  stimulus: '<div class = centerbox><div id = ' + stims[1][1] + '></div></div>',
  data: {
    correct_response: correct_responses[1][1],
    condition: correct_responses[1][0],
    trial_id: 'test_block'
  }
}];

for (var i = 0; i < num_go_stim; i++) {
  test_stimuli_block.push({
    stimulus: '<div class = centerbox><div  id = ' + stims[0][1] + '></div></div>',
    data: {
      correct_response: correct_responses[0][1],
      condition: correct_responses[0][0],
      trial_id: 'test_block'
    }
  })
}

var practice_trials = jsPsych.randomization.repeat(practice_stimuli, 10); 
var test_trials = jsPsych.randomization.repeat(test_stimuli_block, 70);   



var numTrialsPerBlock = 70
var numTestBlocks = test_trials.length / numTrialsPerBlock


var prompt_text_list = '<ul list-text>'+
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
   timing_response: 360000,
   columns: [60,60]
};

/* define static blocks */
var feedback_instruct_text =
  'Welcome to the experiment. This task will take around 10 minutes. Press <i>enter</i> to begin.'
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
    '<div class = centerbox><p class = block-text>In this experiment blue and orange squares will appear on the screen. You will be told to respond to one of the colored squares by pressing the spacebar. You should only respond to this color and withhold any response to the other color.</p><p class = block-text>If you see the <font color="' + stims[0][0] + '">' + stims[0][0] + '</font> square you should <i> respond by pressing the spacebar as quickly as possible</i>. If you see the <font color="' + stims[1][0] + '">' + stims[1][0] + '</font> square you should <i> not respond</i>.</p><p class = block-text>We will begin with practice. You will get feedback telling you if you were correct.</p></div>'
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
    exp_id: 'go_nogo'
  },
  text: '<div class = centerbox><p class = center-block-text>Thanks for completing this task!</p><p class = center-block-text>Press <i>enter</i> to continue.</p></div>',
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
  text: '<div class = centerbox><p class = block-text>Practice is over, we will now begin the experiment. You will no longer get feedback about your responses.</p><p class = block-text>Remember, if you see the <font color="' + stims[0][0] + '">' + stims[0][0] + '</font> square you should <i> respond by pressing the spacebar as quickly as possible</i>. If you see the <font color="' + stims[1][0] + '">' + stims[1][0] + '</font> square you should <i> not respond</i>. Press <i>enter</i> to begin.</p></div>',
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
	'Welcome to the experiment. This experiment will take less than 30 minutes. Press <i>enter</i> to begin.'
var feedback_block = {
	type: 'poldrack-single-stim',
	data: {
		exp_id: "n_back_single_task_network",
		trial_id: "practice-no-stop-feedback"
	},
	choices: [13],
	stimulus: getBlockFeedback,
	timing_post_trial: 0,
	is_html: true,
	timing_response: 180000,
	response_ends_trial: true, 

};

/* define practice block */
var practice_block = {
  type: 'poldrack-categorize',
  timeline: practice_trials,
  is_html: true,
  data: {
    trial_id: "stim",
    exp_stage: "practice"
  },
  correct_text: '<div class = centerbox><div class = center-text>Correct!</div></div>',
  incorrect_text: '<div class = centerbox><div class = center-text>Incorrect</div></div>',
  timeout_message: getFeedback,
  choices: [32],
  timing_response: 2000,
  timing_stim: 1000,
  timing_feedback_duration: 500,
  show_stim_with_feedback: false,
  timing_post_trial: 0,
  on_finish: appendData
}

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
for (var i = 0; i < practice_trials.length; i ++){

	var practice_block = {
	  type: 'poldrack-categorize',
	  stimulus: practice_trials[i].stimulus,
	  is_html: true,
	  data: practice_trials[i].data,
	  key_answer: practice_trials[i].data.correct_response,
	  correct_text: '<div class = centerbox><div class = center-text>Correct!</div></div>',
	  incorrect_text: '<div class = centerbox><div class = center-text>Incorrect</div></div>',
	  timeout_message: getFeedback,
	  choices: [32],
	  timing_response: 2000,
	  timing_stim: 1000,
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
		practice_index = 0
		practice_trials = jsPsych.randomization.repeat(practice_stimuli, 5); 
		test_trials = jsPsych.randomization.repeat(test_stimuli_block, 35);   
	
		var sum_rt = 0
		var sum_responses = 0
		var correct = 0
		var total_trials = 0
	
		for (var i = 0; i < data.length; i++){
			if ((data[i].trial_id == "practice") && (data[i].condition == "go")){
				total_trials+=1
				if (data[i].rt != -1){
					sum_rt += data[i].rt
					sum_responses += 1
					if (data[i].key_press == data[i].correct_response){
						correct += 1
		
					}
				}
		
			}
	
		}
	
		var accuracy = correct / total_trials
		var missed_responses = (total_trials - sum_responses) / total_trials
		var ave_rt = sum_rt / sum_responses
	
		feedback_text = "<br>Please take this time to read your feedback and to take a short break! Press enter to continue"
		feedback_text += "</p><p class = block-text><i>Average reaction time:  " + Math.round(ave_rt) + " ms. 	Accuracy: " + Math.round(accuracy * 100)+ "%</i>"

		if (accuracy > accuracy_thresh){
			feedback_text +=
					'</p><p class = block-text>Done with this practice. Press Enter to continue.' 
			return false
	
		} else if (accuracy < accuracy_thresh){
			feedback_text +=
					'</p><p class = block-text>Your accuracy is too low.  Remember: <br>' + prompt_text_list
					
			if (missed_responses > missed_thresh){
				feedback_text +=
						'</p><p class = block-text>You have not been responding to some trials.  Please respond on every trial that requires a response.'
			}
		
			if (practiceCount == practice_thresh){
				feedback_text +=
					'</p><p class = block-text>Done with this practice.' 
					
					return false
			}
			
			feedback_text +=
				'</p><p class = block-text>Redoing this practice. Press Enter to continue.' 
			
			return true
		
		}
	
	}
	
}
/* define test block */
var test_block = {
  type: 'poldrack-single-stim',
  timeline: test_trials,
  data: {
    trial_id: "stim",
    exp_stage: "test"
  },
  is_html: true,
  choices: [32],
  timing_stim: 1000,
  timing_response: 2000,
  timing_post_trial: 0,
  on_finish: appendData
};

var testTrials = []
testTrials.push(feedback_block)
testTrials.push(attention_node)
for (var i = 0; i < numTrialsPerBlock; i ++){
	
	var test_block = {
		type: 'poldrack-single-stim',
		stimulus: test_trials.pop().stimulus,
		is_html: true,
		choices: [32],
		data: test_trials.pop().data,
		timing_post_trial: 0,
		timing_stim: 1000,
		timing_response: 2000,
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
		test_index = 0
	
		var sum_rt = 0
		var sum_responses = 0
		var correct = 0
		var total_trials = 0
	
		for (var i = 0; i < data.length; i++){
			if ((data[i].trial_id == "test_block") && (data[i].condition == "go")){
				total_trials+=1
				if (data[i].rt != -1){
					sum_rt += data[i].rt
					sum_responses += 1
					if (data[i].key_press == data[i].correct_response){
						correct += 1
		
					}
				}
		
			}
	
		}
	
		var accuracy = correct / total_trials
		var missed_responses = (total_trials - sum_responses) / total_trials
		var ave_rt = sum_rt / sum_responses
	
		feedback_text = "<br>Please take this time to read your feedback and to take a short break! Press enter to continue"
		feedback_text += "</p><p class = block-text><i>Average reaction time:  " + Math.round(ave_rt) + " ms. 	Accuracy: " + Math.round(accuracy * 100)+ "%</i>"
		feedback_text += "</p><p class = block-text>You have completed " +testCount+ " out of " +numTestBlocks+ " blocks of trials."

		if (testCount > numTestBlocks){
			feedback_text +=
					'</p><p class = block-text>Done with this test. Press Enter to continue.' 
			return false
	
		} else {
			if (accuracy < accuracy_thresh){
			feedback_text +=
					'</p><p class = block-text>Your accuracy is too low.  Remember: <br>' + prompt_text_list
					
			}
			
			if (missed_responses > missed_thresh){
				feedback_text +=
						'</p><p class = block-text>You have not been responding to some trials.  Please respond on every trial that requires a response.'
			}
		
			
			feedback_text +=
				'</p><p class = block-text>Press Enter to continue.' 
			
			return true
		
		}
	
	}
	
}

/* create experiment definition array */
var go_nogo_single_task_network_experiment = [];

//go_nogo_single_task_network_experiment.push(instruction_node);
//go_nogo_single_task_network_experiment.push(practice_block);

go_nogo_single_task_network_experiment.push(practiceNode)
go_nogo_single_task_network_experiment.push(feedback_block)

go_nogo_single_task_network_experiment.push(start_test_block);
go_nogo_single_task_network_experiment.push(testNode);

go_nogo_single_task_network_experiment.push(post_task_block)
go_nogo_single_task_network_experiment.push(end_block)