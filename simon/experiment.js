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
	var experiment_data = jsPsych.data.getTrialsOfType('poldrack-single-stim')
	experiment_data = experiment_data.concat(jsPsych.data.getTrialsOfType('poldrack-categorize'))
	var missed_count = 0
	var trial_count = 0
	var rt_array = []
	var rt = 0
		//record choices participants made
	var choice_counts = {}
	choice_counts[-1] = 0
	for (var k = 0; k < choices.length; k++) {
		choice_counts[choices[k]] = 0
	}
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
		//calculate whether response distribution is okay
	var responses_ok = true
	Object.keys(choice_counts).forEach(function(key, index) {
		if (choice_counts[key] > trial_count * 0.85) {
			responses_ok = false
		}
	})
	var missed_percent = missed_count/trial_count
	credit_var = (missed_percent < 0.4 && avg_rt > 200 && responses_ok)
	jsPsych.data.addDataToLastTrial({"credit_var": credit_var})
}

var post_trial_gap = function() {
  gap = Math.floor(Math.random() * 500) + 500
  return gap;
}

/* Append gap and current trial to data and then recalculate for next trial*/
var appendData = function() {
  jsPsych.data.addDataToLastTrial({
    trial_num: current_trial
  })
  current_trial = current_trial + 1
}

var appendTestData = function(data) {
  correct = false
  if (data.key_press == data.correct_response) {
  	correct = true
  }
  jsPsych.data.addDataToLastTrial({
  	correct: correct,
    trial_num: current_trial
  })
  current_trial = current_trial + 1
}

var getInstructFeedback = function() {
    return '<div class = centerbox><p class = center-block-text>' + feedback_instruct_text +
      '</p></div>'
  }
  /* ************************************ */
  /* Define experimental variables */
  /* ************************************ */
  // generic task variables
var run_attention_checks = false
var attention_check_thresh = 0.45
var sumInstructTime = 0 //ms
var instructTimeThresh = 0 ///in seconds
var credit_var = true

// task specific variables
var correct_responses = jsPsych.randomization.shuffle([["left arrow", 37],["right arrow", 39]])
var choices = [37, 39]
var current_trial = 0
var gap = Math.floor(Math.random() * 2000) + 1000
var test_stimuli = [{
  stimulus: '<div class = centerbox><div class = simon_left id = stim1></div></div>',
  data: {
    correct_response: correct_responses[0][1],
    stim_side: 'left',
    stim_color: 'red', 
    condition: correct_responses[0][1] == 37 ? 'congruent' : 'incongruent'
  },
  key_answer: correct_responses[0][1]
}, {
  stimulus: '<div class = centerbox><div class = simon_right id = stim1></div></div>',
  data: {
    correct_response: correct_responses[0][1],
    stim_side: 'right',
    stim_color: 'red', 
    condition: correct_responses[0][1] == 37 ? 'incongruent' : 'congruent'
  },
  key_answer: correct_responses[0][1]
}, {
  stimulus: '<div class = centerbox><div class = simon_left id = stim2></div></div>',
  data: {
    correct_response: correct_responses[1][1],
    stim_side: 'left',
    stim_color: 'blue', 
    condition: correct_responses[0][1] == 37 ? 'incongruent' : 'congruent'
  },
  key_answer: correct_responses[1][1]
}, {
  stimulus: '<div class = centerbox><div class = simon_right id = stim2></div></div>',
  data: {
    correct_response: correct_responses[1][1],
    stim_side: 'right',
    stim_color: 'blue', 
    condition: correct_responses[0][1] == 37 ? 'congruent' : 'incongruent'
  },
  key_answer: correct_responses[1][1]
}];

var practice_trials = jsPsych.randomization.repeat(test_stimuli, 5);
var test_trials = jsPsych.randomization.repeat(test_stimuli, 25);


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
   columns: [60,60]
};

/* define static blocks */
var feedback_instruct_text =
  'Welcome to the experiment. This experiment will take about 8 minutes. Press <strong>enter</strong> to begin.'
var feedback_instruct_block = {
  type: 'poldrack-text',
  data: {
    trial_id: "instruction"
  },
  cont_key: [13],
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
    '<div class = centerbox><p class = block-text>On each trial of this experiment a red or blue box will appear. If you see a <font color="red">red</font> box, press the ' +
    correct_responses[0][0] + '. If you see a <font color="blue">blue</font> box, press the ' + correct_responses[1][0] + '.</p><p class = block-text>We will start with practice where you will get feedback about whether you responded correctly. We will begin after you end the instructions.</p></div>',
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
        'Read through instructions too quickly.  Please take your time and make sure you understand the instructions.  Press <strong>enter</strong> to continue.'
      return true
    } else if (sumInstructTime > instructTimeThresh * 1000) {
      feedback_instruct_text =
        'Done with instructions. Press <strong>enter</strong> to continue.'
      return false
    }
  }
}

var end_block = {
  type: 'poldrack-text',
  data: {
    trial_id: "end",
    exp_id: 'simon'
  },
  timing_response: 180000,
  text: '<div class = centerbox><p class = center-block-text>Thanks for completing this task!</p><p class = center-block-text>Press <strong>enter</strong> to continue.</p></div>',
  cont_key: [13],
  timing_post_trial: 0,
  on_finish: assessPerformance
};

var start_test_block = {
  type: 'poldrack-text',
  timing_response: 180000,
  data: {
    trial_id: "test_intro"
  },
  text: '<div class = centerbox><p class = center-block-text>Starting test. You will no longer get feedback after your responses. Remember, if you see a <font color="red">red</font> box, press the ' + correct_responses[0][0] + '. If you see a <font color="blue">blue</font> box, press the ' + correct_responses[1][0] + '.</p><p class = center-block-text>Press <strong>enter</strong> to begin.</p></div>',
  cont_key: [13],
  timing_post_trial: 1000,
  on_finish: function() {
    current_trial = 0
  }
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
  correct_text: '<div class = centerbox><div style="color:green"; class = center-text>Correct!</div></div>',
  incorrect_text: '<div class = centerbox><div style="color:red"; class = center-text>Incorrect</div></div>',
  timeout_message: '<div class = centerbox><div class = center-text>Respond faster!</div></div>',
  choices: choices,
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
  data: {
    trial_id: "stim",
    exp_stage: "test"
  },
  is_html: true,
  choices: choices,
  timing_response: 2000,
  timing_post_trial: post_trial_gap,
  on_finish: function(data){
  	appendTestData(data)
  }
};

/* create experiment definition array */
var simon_experiment = [];
simon_experiment.push(instruction_node);
simon_experiment.push(practice_block);
simon_experiment.push(attention_node)
simon_experiment.push(start_test_block);
simon_experiment.push(test_block);
simon_experiment.push(attention_node)
simon_experiment.push(post_task_block)
simon_experiment.push(end_block)