/* ************************************ */
/* Define helper functions */
/* ************************************ */

function assessPerformance() {
  var experiment_data = jsPsych.data.getTrialsOfType('poldrack-single-stim')
  var missed_count = 0
  var trial_count = 0
  var rt_array = []
  var rt = 0
  for (var i = 0; i < experiment_data.length; i++) {
    if (experiment_data[i].possible_responses != 'none') {
      rt = experiment_data[i].rt
      trial_count += 1
      if (rt == -1) {
        missed_count += 1
      } else {
        rt_array.push(rt)
      }
    }
  }
  //calculate average rt
  var sum = 0
  for (var j = 0; j < rt_array.length; j++) {
    sum += rt_array[j]
  }
  var avg_rt = sum / rt_array.length || -1
	var missed_percent = missed_count/trial_count
	credit_var = (missed_percent < 0.4 && avg_rt > 200)
	if (credit_var === true) {
		performance_var = total_money
	} else {
		performance_var = 0
	}
  jsPsych.data.addDataToLastTrial({"credit_var": credit_var, "performance_var": performance_var})
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

var randomDraw = function(lst) {
  var index = Math.floor(Math.random() * (lst.length))
  return lst[index]
}

var getDelay = function() {
  if (Math.random() < 0.5) {
    delay = 90000
  } else {
    delay = randomDraw([5000, 10000, 15000, 20000])
  }
  return delay
}

var getPracticeDelay = function() {
  delay = practice_delays.shift()
  return delay
}

var getFB = function() {
  var data = jsPsych.data.getLastTrialData()
  var token;
  if (data.rt < delay) {
    token = token_zero
  } else {
    token = token_thirty
    if (exp_stage == 'test') {
      total_money += 0.30
    }
  }
  return token +
    '<div class = soldBox><div class = center-text><font color="red">SOLD!</font></div></div>'
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
var attention_check_thresh = 1
var sumInstructTime = 0 //ms
var instructTimeThresh = 0 ///in seconds
var credit_var = true

// task specific variables
var token_zero = '<div class = wtw_token><div class = token_text>0&cent;</div></div>'
var token_thirty =
  '<div class = "wtw_token" style="background: blue; z-index: -1"><div class = token_text>30&cent;</div></div>'
var progress_bar =
  '<div class = wtw_progressBox><div class="meter"> <span style="width: 100%"></span></div></div>'
var delay = 0
var practice_delays = [10000, 50000, 5000]
var block_start_time = 0;
var total_money = 0 //in dollars
var time_limit = 10
var exp_stage = 'practice'
var credit_var = true
var performance_var = 0

/* ************************************ */
/* Set up jsPsych blocks */
/* ************************************ */
// Set up attention check node
var attention_check_block = {
  type: 'attention-check',
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
var welcome_block = {
  type: 'poldrack-text',
  data: {
    trial_id: 'welcome'
  },
  text: '<div class = centerbox><p class = center-block-text>Welcome to the experiment. This task will take about 11 minutes. Press <strong>enter</strong> to begin.</p></div>',
  cont_key: [13],
  timing_response: 180000,
  timing_post_trial: 0
};

var end_block = {
  type: 'poldrack-text',
  data: {
    trial_id: 'end',
    exp_id: 'willingness_to_wait'
  },
  text: '<div class = centerbox><p class = center-block-text>Thanks for completing this task!</p><p class = center-block-text>Press <strong>enter</strong> to continue.</p></div>',
  cont_key: [13],
  timing_response: 180000,
  timing_post_trial: 0,
  on_finish: assessPerformance
};


var feedback_instruct_text =
  'Welcome to the experiment. Press <strong>enter</strong> to begin.'
var feedback_instruct_block = {
  type: 'poldrack-text',
  data: {
    trial_id: 'instruction'
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
    trial_id: 'instruction'
  },
  pages: [
    '<div class = centerbox><p class = block-text>In this experiment a coin worth 0&cent; will appear on the screen. After a time it will become a 30&cent; coin. At any point you can collect the coin by pressing the spacebar and moving on to another trial.</p><p class = block-text>Your job is to get as much money as possible in 10 minutes. We will start with a few practice trials which will start after you end instructions.</p></div>'
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

var start_test_block = {
  type: 'poldrack-text',
  data: {
    trial_id: 'test_intro'
  },
  text: '<div class = centerbox><p class = center-block-text>We will now start the main experiment. Press <strong>enter</strong> to begin.</p></div>',
  cont_key: [13],
  timing_response: 180000,
  timing_post_trial: 1000,
  on_finish: function() {
    exp_stage = 'test'
    block_start_time = new Date();
  }
};

var start_practice_block = {
  type: 'poldrack-text',
  data: {
    trial_id: 'practice_intro'
  },
  text: '<div class = centerbox><p class = center-block-text>We will begin with some practice. Press <strong>enter</strong> to begin.</p></div>',
  cont_key: [13],
  timing_response: 180000,
  timing_post_trial: 1000
};

var practice_block = {
  type: 'poldrack-single-stim',
  stimulus: token_zero,
  is_html: true,
  choices: [32],
  timing_stim: getPracticeDelay,
  timing_response: 100000,
  response_ends_trial: true,
  data: {
    trial_id: 'stim',
    exp_stage: 'practice'
  },
  timing_post_trial: 0,
  prompt: token_thirty + progress_bar,
  on_finish: function(data) {
    jsPsych.data.addDataToLastTrial({
      'delay': delay
    })
  }
};

/* define test block */
var test_block = {
  type: 'poldrack-single-stim',
  stimulus: token_zero,
  is_html: true,
  choices: [32],
  timing_stim: getDelay,
  timing_response: 100000,
  response_ends_trial: true,
  data: {
    trial_id: 'stim',
    exp_stage: 'test'
  },
  timing_post_trial: 0,
  prompt: token_thirty + progress_bar,
  on_finish: function(data) {
    jsPsych.data.addDataToLastTrial({
      'delay': delay
    })
  }
};

var feedback_block = {
  type: 'poldrack-single-stim',
  stimulus: getFB,
  is_html: true,
  choices: 'none',
  timing_stim: 1000,
  timing_response: 1000,
  data: {
    trial_id: 'feedback'
  },
  timing_post_trial: 1000,
  on_finish: function(data) {
    jsPsych.data.addDataToLastTrial({
      'delay': delay,
      exp_stage: exp_stage
    })
  }
};

var test_node = {
  timeline: [test_block, feedback_block],
  loop_function: function() {
    var elapsed = (new Date() - block_start_time) / 60000
    if (elapsed > time_limit) {
      return false
    } else {
      return true
    }
  }
}


/* create experiment definition array */
var willingness_to_wait_experiment = [];
willingness_to_wait_experiment.push(welcome_block);
willingness_to_wait_experiment.push(instruction_node);
willingness_to_wait_experiment.push(start_practice_block);

for (var i = 0; i < practice_delays.length; i++) {
  willingness_to_wait_experiment.push(practice_block)
  willingness_to_wait_experiment.push(feedback_block)
}
willingness_to_wait_experiment.push(start_test_block);
willingness_to_wait_experiment.push(test_node)
willingness_to_wait_experiment.push(attention_node)
willingness_to_wait_experiment.push(post_task_block)
willingness_to_wait_experiment.push(end_block);