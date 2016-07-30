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

var getInstructFeedback = function() {
  return '<div class = centerbox><p class = center-block-text>' + feedback_instruct_text +
    '</p></div>'
}

var post_trial_gap = function() {
  gap = Math.floor(Math.random() * 500) + 500
  return gap;
}

var getTestTrials = function() {
  return test_trials.pop()
}

/* Append gap and current trial to data and then recalculate for next trial*/
var appendData = function() {
  jsPsych.data.addDataToLastTrial({
    trial_num: current_trial
  })
  current_trial = current_trial + 1
}

/* ************************************ */
/* Define experimental variables */
/* ************************************ */
// generic task variables
var run_attention_checks = false
var attention_check_thresh = 0.65
var sumInstructTime = 0 //ms
var instructTimeThresh = 0 ///in seconds
var credit_var = true

// task specific variables
var num_blocks = 3
var block_len = 50
var practice_len = 20
var gap = 0
var current_trial = 0
  //set stim/response mapping
var correct_responses = jsPsych.randomization.shuffle([
    ['"M"', 77],
    ['"Z"', 90]
  ])

var choices = [correct_responses[0][1], correct_responses[1][1]]

//set up block stim. correct_responses indexed by [block][stim][type]
var practice_stimuli = [{
  stimulus: '<div class = centerbox><div  id = "stim1"></div></div>',
  data: {
    stim_id: 1,
    trial_id: 'stim',
    exp_stage: 'practice'
  },
  key_answer: correct_responses[0][1]
}, {
  stimulus: '<div class = centerbox><div id = "stim2"></div></div>',
  data: {
    stim_id: 2,
    trial_id: 'stim',
    exp_stage: 'practice'
  },
  key_answer: correct_responses[1][1]
}];

var test_stimuli_block = [{
  stimulus: '<div class = centerbox><div  id = "stim1"></div></div>',
  data: {
    stim_id: 1,
    trial_id: 'stim',
    exp_stage: 'test',
    correct_response: correct_responses[0][1]
  }
}, {
  stimulus: '<div class = centerbox><div id = "stim2"></div></div>',
  data: {
    stim_id: 2,
    trial_id: 'stim',
    exp_stage: 'test',
    correct_response: correct_responses[1][1]
  }
}];


var practice_trials = jsPsych.randomization.repeat(practice_stimuli, practice_len/2);
var test_trials = []
for (var b = 0; b < num_blocks; b++) {
  test_trials.push(jsPsych.randomization.repeat(test_stimuli_block, block_len/2));
}

/* ************************************ */
/* Set up jsPsych blocks */
/* ************************************ */
// Set up attention check node
var attention_check_block = {
  type: 'attention-check',
  data: {
    trial_id: 'attention_check'
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
  'Welcome to the experiment. This task will take about 8 minutes. Press <strong>enter</strong> to begin.'
var feedback_instruct_block = {
  type: 'poldrack-text',
  cont_key: [13],
  data: {
    trial_id: 'instruction'
  },
  text: getInstructFeedback,
  timing_post_trial: 0,
  timing_response: 180000
};
/// This ensures that the subject does not read through the instructions too quickly.  If they do it too quickly, then we will go over the loop again.
var instructions_block = {
  type: 'poldrack-instructions',
  pages: [
    '<div class = centerbox><p class = block-text>In this experiment blue and orange squares will appear on the screen. You will be told to respond to one of the colored squares by pressing the "M" key and to the other by pressing the "Z" key. </p>' +
    '<p class = block-text>We will begin with practice. If you see the <font color="orange">orange</font> square you should press the <strong>' +
    correct_responses[0][0] +
    '</strong> key. If you see the <font color="blue">blue</font> square you should press the <strong>' +
    correct_responses[1][0] +
    '</strong> key.</p><p class = block-text>You should respond as quickly and accurately as possible. You will get feedback telling you if you were correct. </p></div>'
  ],
  allow_keys: false,
  data: {
    trial_id: 'instruction'
  },
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
  timing_response: 180000,
  data: {
    trial_id: 'end',
    exp_id: 'choice_reaction_time'
  },
  text: '<div class = centerbox><p class = center-block-text>Thanks for completing this task!</p><p class = center-block-text>Press <strong>enter</strong> to continue.</p></div>',
  cont_key: [13],
  timing_post_trial: 0,
  on_finish: assessPerformance
};

var rest_block = {
  type: 'poldrack-text',
  data: {
    trial_id: "rest"
  },
  timing_response: 180000,
  text: '<div class = centerbox><p class = center-block-text>Take a break! Press <strong>enter</strong> to continue.</p></div>',
  cont_key: [13],
  timing_post_trial: 1000
};

var reset_block = {
  type: 'call-function',
  data: {
    trial_id: 'reset trial'
  },
  func: function() {
    current_trial = 0
  },
  timing_post_trial: 0
}

var start_practice_block = {
  type: 'poldrack-text',
  timing_response: 60000,
  data: {exp_id: 'choice_reaction_time', trial_id: 'practice_intro'},
  text: '<div class = centerbox><p class = block-text>We will begin with practice. If you see the <font color="orange">orange</font> square you should press the <strong>' + correct_responses[0][0] + '</strong> key. If you see the <font color="blue">blue</font> square you should press the <strong>' + correct_responses[1][0] + '</strong> key.</p><p class = block-text>You will receive feedback telling you if you were correct. Press <strong>enter</strong> to begin.</p></div>',
  cont_key: [13],
  timing_post_trial: 1000
};

var start_test_block = {
  type: 'poldrack-text',
  timing_response: 60000,
  data: {exp_id: 'choice_reaction_time', trial_id: 'test_intro'},
  text: '<div class = centerbox><p class = block-text>We will now begin the test. You will no longer receive feedback about your responses.</p><p class = block-text>If you see the <font color="orange">orange</font> square you should press the <strong>' + correct_responses[0][0] + '</strong> key. If you see the <font color="blue">blue</font> square you should press the <strong>' + correct_responses[1][0] + '</strong> key. There will be two breaks. Press <strong>enter</strong> to begin.</p></div>',
  cont_key: [13],
  timing_post_trial: 1000
};


/* define practice block */
var practice_block = {
  type: 'poldrack-categorize',
  timeline: practice_trials,
  is_html: true,
  data: {
    trial_id: 'stim',
    exp_stage: 'practice'
  },
  correct_text: '<div class = centerbox><div style="color:green"; class = center-text>Correct!</div></div>',
  incorrect_text: '<div class = centerbox><div style="color:red"; class = center-text>Incorrect</div></div>',
  timeout_message: '<div class = centerbox><div class = center-text>Respond Faster!</div></div>',
  choices: choices,
  timing_response: 2000,
  timing_stim: 2000,
  timing_feedback_duration: 1000,
  show_stim_with_feedback: false,
  timing_post_trial: post_trial_gap,
  on_finish: appendData
}

/* define test block */

var test_blocks = []
for (var b = 0; b < num_blocks; b++) {
	var test_block = {
	  type: 'poldrack-single-stim',
	  timeline: test_trials[b],
	  is_html: true,
	  data: {
	    trial_id: 'stim',
	    exp_stage: 'test'
	  },
	  choices: choices,
	  timing_response: 2000,
	  timing_post_trial: post_trial_gap,
	  on_finish: function(data) {
	    appendData()
	    correct = false
	    if (data.key_press === data.correct_response) {
	      correct = true
	    }
	    jsPsych.data.addDataToLastTrial({correct: correct})
	  }
	};
	test_blocks.push(test_block)
}

/* create experiment definition array */
var choice_reaction_time_experiment = [];
choice_reaction_time_experiment.push(instruction_node);
choice_reaction_time_experiment.push(practice_block);
choice_reaction_time_experiment.push(reset_block)

choice_reaction_time_experiment.push(start_test_block);
for (var b = 0; b < num_blocks; b++) {
  choice_reaction_time_experiment.push(test_blocks[b]);
  choice_reaction_time_experiment.push(rest_block);
}
choice_reaction_time_experiment.push(attention_node)
choice_reaction_time_experiment.push(post_task_block)
choice_reaction_time_experiment.push(end_block)