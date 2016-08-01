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

var getInstructFeedback = function() {
  return '<div class = centerbox><p class = center-block-text>' + feedback_instruct_text +
    '</p></div>'
}

var randomDraw = function(lst) {
  var index = Math.floor(Math.random() * (lst.length))
  return lst[index]
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
  var missed_percent = missed_count/trial_count
  credit_var = (missed_percent < 0.4 && avg_rt > 200)
  var bonus = randomDraw(bonus_list)
  jsPsych.data.addDataToLastTrial({"credit_var": credit_var,
                  "performance_var": JSON.stringify(bonus)})
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
var choices = [81, 80]
var bonus_list = [] //keeps track of choices for bonus
//hard coded options in the amounts and order specified in Kirby and Marakovic (1996)
var options = {
  small_amt: [54, 55, 19, 31, 14, 47, 15, 25, 78, 40, 11, 67, 34, 27, 69, 49, 80, 24, 33, 28, 34,
    25, 41, 54, 54, 22, 20
  ],
  large_amt: [55, 75, 25, 85, 25, 50, 35, 60, 80, 55, 30, 75, 35, 50, 85, 60, 85, 35, 80, 30, 50,
    30, 75, 60, 80, 25, 55
  ],
  later_del: [117, 61, 53, 7, 19, 160, 13, 14, 192, 62, 7, 119, 186, 21, 91, 89, 157, 29, 14, 179,
    30, 80, 20, 111, 30, 136, 7
  ]
}

var stim_html = []

//loop through each option to create html
for (var i = 0; i < options.small_amt.length; i++) {
  stim_html[i] =
    "<div class = centerbox id='container'><p class = center-block-text>Please select the option that you would prefer pressing <strong>'q'</strong> for left <strong>'p'</strong> for right:</p><div class='table'><div class='row'><div id = 'option'><center><font color='green'>$" +
    options.small_amt[i] +
    "<br>today</font></center></div><div id = 'option'><center><font color='green'>$" + options.large_amt[
      i] + "<br>" + options.later_del[i] + " days</font></center></div></div></div></div>"
}

data_prop = []

for (var i = 0; i < options.small_amt.length; i++) {
  data_prop.push({
    small_amount: options.small_amt[i],
    large_amount: options.large_amt[i],
    later_delay: options.later_del[i]
  });
}

trials = []

//used new features to include the stimulus properties in recorded data
for (var i = 0; i < stim_html.length; i++) { 
  trials.push({
    stimulus: stim_html[i],
    data: data_prop[i]
  });
}

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
  'Welcome to the experiment. This experiment will take about 5 minutes. Press <strong>enter</strong> to begin.'
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
    '<div class = centerbox><p class = block-text>In this experiment you will be presented with two amounts of money to choose between. One of the amounts will be available now and the other will be available in the future. Your job is to indicate which option you would prefer by pressing <strong>"q"</strong> for the left option and <strong>"p"</strong> for the right option.</p><p class = block-text>You should indicate your <strong>true</strong> preference because at the end of the experiment a random trial will be chosen and you will receive a bonus payment proportional to the option you selected at the time point you chose.</p></div>',
  ],
  allow_keys: false,
  show_clickable_nav: true
};

var instruction_node = {
  timeline: [feedback_instruct_block, instructions_block],
  /* This function defines stopping criteria */
  loop_function: function(data) {
    for (var i = 0; i < data.length; i++) {
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

var start_practice_block = {
  type: 'poldrack-text',
  timing_response: 180000,
  data: {
    trial_id: "practice_intro"
  },
  text: '<div class = centerbox><p class = center-block-text>Here is a sample trial. Your choice for this trial will not be included in your bonus payment.</p><p class = center-block-text>Press <strong>enter</strong> to begin.</p></div>',
  cont_key: [13],
  //timing_post_trial: 1000
};

var practice_block = {
  type: 'poldrack-single-stim',
  data: {
    trial_id: "stim",
    exp_stage: "practice"
  },
  stimulus: "<div class = centerbox id='container'><p class = center-block-text>Please select the option that you would prefer pressing <strong>'q'</strong> for left <strong>'p'</strong> for right:</p><div class='table'><div class='row'><div id = 'option'><center><font color='green'>$20<br>today</font></center></div><div id = 'option'><center><font color='green'>$25<br>5 days</font></center></div></div></div></div>",
  is_html: true,
  choices: choices,
  response_ends_trial: true, 
};

var start_test_block = {
  type: 'poldrack-text',
  data: {
    trial_id: "test_intro"
  },
  timing_response: 180000,
  text: '<div class = centerbox><p class = center-block-text>You are now ready to begin the survey.</p><p class = center-block-text>Remember to indicate your <strong>true</strong> preferences.</p><p class = center-block-text>Press <strong>enter</strong> to begin.</p></div>',
  cont_key: [13],
  //timing_post_trial: 1000
};

var test_block = {
  type: 'poldrack-single-stim',
  data: {
    trial_id: "stim",
    exp_stage: "test"
  },
  timeline: trials,
  is_html: true,
  choices: choices,
  response_ends_trial: true,
  //used new feature to include choice info in recorded data
  on_finish: function(data) {
    var choice = false;
    if (data.key_press == 80) {
      choice = 'larger_later';
      bonus_list.push({'amount': data.large_amount, 'delay': data.later_delay})
    } else if (data.key_press == 81) {
      choice = 'smaller_sooner';
      bonus_list.push({'amount': data.small_amount, 'delay': 0})
    }
    jsPsych.data.addDataToLastTrial({
      choice: choice
    });
  }
};

var end_block = {
  type: 'poldrack-text',
  data: {
    trial_id: "end",
    exp_id: 'kirby'
  },
  timing_response: 180000,
  text: '<div class = centerbox><p class = center-block-text>Thanks for completing this task!</p><p class = center-block-text>Press <strong>enter</strong> to continue.</p></div>',
  cont_key: [13],
  timing_post_trial: 0,
  on_finish: assessPerformance
};


//Set up experiment
var kirby_experiment = []
kirby_experiment.push(instruction_node);
kirby_experiment.push(start_practice_block);
kirby_experiment.push(practice_block);
kirby_experiment.push(attention_node);
kirby_experiment.push(start_test_block);
kirby_experiment.push(test_block);
kirby_experiment.push(attention_node);
kirby_experiment.push(post_task_block)
kirby_experiment.push(end_block);