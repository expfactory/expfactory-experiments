/* ************************************ */
/* Define helper functions */
/* ************************************ */
function assessPerformance() {
  var experiment_data = jsPsych.data.getTrialsOfType('poldrack-single-stim')
  var missed_count = 0
  var rt_array = []
  var rt = 0
  for (var i = 0; i < experiment_data.length; i++)
    rt = experiment_data[i].rt
    if (typeof rt !== 'undefined') {
      if (rt == -1) {
        missed_count += 1
      } else {
        rt_array.push(rt)
      }
    }
  //calculate average rt
  var sum = 0
  for (var j = 0; j < rt_array.length; j++) {
    sum += rt_array[j]
  }
  var avg_rt = sum/rt_array.length
  credit_var = (avg_rt > 100)
}

var get_trial_time = function() {
  function randomExponential(rate, randomUniform) {
    // http://en.wikipedia.org/wiki/Exponential_distribution#Generating_exponential_variates
    rate = rate || 1;

    // Allow to pass a random uniform value or function
    // Default to Math.random()
    var U = randomUniform;
    if (typeof randomUniform === 'function') U = randomUniform();
    if (!U) U = Math.random();

    return -Math.log(U) / rate;
  }
  gap = randomExponential(1)*1000
  if (gap > 4000) {
    gap = 4000
  }
  return gap + 2000;
}

/* Append gap and current trial to data and then recalculate for next trial*/
var appendData = function() {
  jsPsych.data.addDataToLastTrial({
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
var sumInstructTime = 0 //ms
var instructTimeThresh = 0 ///in seconds

// task specific variables
var practice_len = 5
var experiment_len = 50
var gap = 0
var current_trial = 0
var stim = '<div class = shapebox><div id = cross></div></div>'



/* ************************************ */
/* Set up jsPsych blocks */
/* ************************************ */
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
var end_block = {
  type: 'poldrack-text',
  data: {
    trial_id: "end",
    exp_id: 'simple_reaction_time'
  },
  timing_response: 180000,
  text: '<div class = centerbox><p class = center-block-text>Thanks for completing this task!</p><p class = center-block-text>Press <strong>enter</strong> to continue.</p></div>',
  cont_key: [13],
  timing_post_trial: 0,
  on_finish: assessPerformance
};

var feedback_instruct_text =
  'Welcome to the experiment. This experiment will take about 3 minutes. Press <strong>enter</strong> to begin.'
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
    '<div class = centerbox><p class = block-text>In this experiment, we are testing how fast you can respond. On each trial press the spacebar as quickly as possible <strong>after</strong> you see the large "X".</p></div>'
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



var start_practice_block = {
  type: 'poldrack-text',
  data: {
    trial_id: "practice_intro"
  },
  timing_response: 180000,
  text: '<div class = centerbox><p class = center-block-text>We will start 5 practice trials. Press <strong>enter</strong> to begin.</p></div>',
  cont_key: [13],
  timing_post_trial: 1000
};

var start_test_block = {
  type: 'poldrack-text',
  data: {
    trial_id: "test_intro"
  },
  timing_response: 180000,
  text: '<div class = centerbox><p class = block-text>We will now start the test. Respond to the "X" as quickly as possible by pressing the spacebar. Press <strong>enter</strong> to begin.</p></div>',
  cont_key: [13],
  timing_post_trial: 1000
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

/* define practice block */
var practice_block = {
  type: 'poldrack-single-stim',
  stimulus: stim,
  timing_stim: 2000,
  timing_response: get_trial_time,
  response_ends_trial: false,
  is_html: true,
  data: {
    trial_id: "stim",
    exp_stage: "practice"
  },
  choices: [32],
  on_finish: appendData,
};

/* define test block */
var test_block = {
  type: 'poldrack-single-stim',
  stimulus: stim,
  timing_stim: 2000,
  timing_response: get_trial_time,
  response_ends_trial: false,
  is_html: true,
  data: {
    trial_id: "stim",
    exp_stage: "test"
  },
  choices: [32],
  on_finish: appendData,
};

/* create experiment definition array */
var simple_reaction_time_experiment = [];
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
simple_reaction_time_experiment.push(post_task_block)
simple_reaction_time_experiment.push(end_block);