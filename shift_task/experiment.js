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

var randomDraw = function(lst) {
  var index = Math.floor(Math.random() * (lst.length))
  return lst[index]
}

var getData = function() {
  return {
    shift_type: recorded_shift_type,
    rewarded_feature: rewarded_feature,
    rewarded_dim: rewarded_dim,
    trials_since_switch: switch_count,
    total_points: total_points,
    trial_num: current_trial
  }
}

var getAlert = function() {
  return '<div class = alertbox><div class = alert-text>The relevant feature is <strong>' +
    rewarded_feature + '</strong>!</div></div>'
}
var getStim = function() {
  var colors = jsPsych.randomization.shuffle(stim_att.color)
  var shapes = jsPsych.randomization.shuffle(stim_att.shape)
  var patterns = jsPsych.randomization.shuffle(stim_att.pattern)
  stim_htmls = []
  stims = []
  for (var i = 0; i < 3; i++) {
    stim_htmls.push(path_source + colors[i] + '_' + shapes[i] + '_' + patterns[i] + '.png')
    stims.push({
      color: colors[i],
      shape: shapes[i],
      pattern: patterns[i]
    })
  }
  return '<div class = shift_left><img class = shift_stim src = ' + stim_htmls[0] +
    ' </img></div>' +
    '<div class = shift_middle><img class = shift_stim src = ' + stim_htmls[1] +
    '  </img></div>' +
    '<div class = shift_right><img class = shift_stim src = ' + stim_htmls[2] +
    '  </img></div>'
}

var getFeedback = function() {
  var last_trial = jsPsych.data.getLastTrialData()
  var choice = choices.indexOf(last_trial.key_press)
  var image;
  var feedback_text;
  if (choice != -1) {
    image = '<div class = shift_' + position_array[choice] + '><img class = shift_stim src = ' +
      stim_htmls[choice] + ' </img></div>'
    feedback_text = 'You won 0 points.'
    if (image.indexOf(rewarded_feature) != -1 && Math.random() > 0.2) {
      feedback_text = 'You won 1 point!'
    } else if (image.indexOf(rewarded_feature) == -1 && Math.random() <= 0.2) {
      feedback_text = 'You won 1 point!'
    }
  } else {
    image = last_trial.stimulus
    feedback_text = 'Respond faster!'
  }
  var FB = -1
  if (feedback_text.indexOf('won 1 point') != -1) {
    FB = 1
  } else if (feedback_text.indexOf('won 0 point') != -1) {
    FB = 0
  }
  jsPsych.data.addDataToLastTrial({
    'feedback': FB
  })
  return image + '<div class = shift_feedback_box><p class = center-text>' + feedback_text +
    '</p></div>'
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
var choices = [37, 40, 39]
var current_trial = 0
var exp_len = 410
var practice_len = 65
var total_points = 0 //tracks points earned during test
var position_array = ['left', 'middle', 'right']
var recorded_shift_type = 'stay'

// stim variables
var stim_att = {
  color: ['red', 'blue', 'green'],
  shape: ['circle', 'square', 'triangle'],
  pattern: ['dots', 'lines', 'waves']
}
var stim_htmls = [] //array of stim html
var stims = [] //array of stim objects
var dims = ['color', 'shape', 'pattern']
var features = stim_att.color.concat(stim_att.shape).concat(stim_att.pattern)
var path_source = '/static/experiments/shift_task/images/'
var rewarded_dim = randomDraw(dims)
var rewarded_feature = randomDraw(stim_att[rewarded_dim])

//preload images
var images = []
for (var c = 0; c < 3; c++) {
  var color = stim_att.color[c]
  for (var s = 0; s < 3; s++) {
    var shape = stim_att.shape[s]
    for (var p = 0; p < 3; p++) {
      var pattern = stim_att.pattern[p]
      images.push(path_source + color + '_' + shape + '_' + pattern + '.png')
    }
  }
}
jsPsych.pluginAPI.preloadImages(images)

// variables to track feature switch
var last_dim = ''
var last_feature = ''
var switch_count = 0 //when switch_count equals switch_bound the feature switches
var switch_bounds = jsPsych.randomization.repeat([16, 17, 18, 19, 20, 21, 22, 23, 24, 25], 2)
var num_switches = switch_bounds.length
  /* controls how often the shift is extra-dimensional (across dims) vs intra (across features within a dim) */
var shift_types = jsPsych.randomization.repeat(['extra', 'extra', 'intra', 'reversal'],
  num_switches / 4)
//Makes sure reversal isn't first
while (shift_types[0] == 'reversal') {
  var ran_i = Math.floor(Math.random() * (num_switches - 1)) + 1
  var tmp = shift_types[ran_i]
  shift_types[ran_i] = shift_types[0]
  shift_types[0] = tmp
}
// Add on practice switches/shifts
switch_bounds.unshift(25, 24, 16)
shift_types.unshift('extra', 'intra', 'extra')

// set first shift_type/switch_bound
var shift_type = shift_types.shift()
var switch_bound = switch_bounds.shift() //set first switch_bound

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
var end_block = {
  type: 'poldrack-text',
  timing_response: 180000,
  data: {
    trial_id: "end",
    exp_id: 'shift_task'
  },
  text: '<div class = centerbox><p class = center-block-text>Finished with this task.</p><p class = center-block-text>Press <strong>enter</strong> to continue.</p></div>',
  cont_key: [13],
  timing_post_trial: 0,
  on_finish: assessPerformance
};

var feedback_instruct_text =
  'Welcome to the experiment. This task will take about 22 minutes. Press <strong>enter</strong> to begin.'
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
    getStim() +
    '<div class = instructionbox><p class = block-text>On each trial of this experiment three patterned objects will be presented. They will differ in their color, shape and internal pattern.</p><p class = block-text>For instance, the objects may look something like this:</p></div><div class = navBox></div>',
    '<div class = centerbox><p class = block-text>On each trial you select one of the objects to get points using the arrow keys (left, down and right keys for the left, middle and right objects, respectively). The object you choose determines the chance of getting a point.</p><p class = block-text>The objects differ in three dimensions: their color (red, blue, green), shape (square, circle, triangle) and pattern (lines, dots, waves). Only one dimension (color, shape or pattern) is relevant for determining the probability of winning a point at any time.</p><p class = block-text>One feature of that dimension will result in rewards more often than the others. For instance, if the relevant dimension is "color", "blue" objects may result in earning a point more often than "green" or "red" objects.</p><p class = block-text>Importantly, all rewards are probabilistic. This means that even the best object will sometimes not result in any points and bad objects can sometimes give points.</div>',
    '<div class = centerbox><p class = block-text>The relevant dimension and feature can change between trials. One trial "color" may be the relevant dimension with "red" the relevant feature, while on the next trial "pattern" is the relevant dimension with "waves" the relevant feature.</p><p class = block-text>During an initial practice session these changes will be explicitly signaled and you will be told what the relevant feature is. During the main task, however, there will be no explicit instructions - you will have to figure out the relevant feature yourself.</p><p class = block-text>Your objective is to get as many point as possible! The trials go by quickly so you must respond quickly. There will be a number of breaks throughout the task. We will start with a practice session after you end instructions.</p></div>'
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
  text: '<div class = centerbox><p class = shift-center-text>We will now start practice. Press <strong>enter</strong> to begin.</p></div>',
  cont_key: [13],
  timing_post_trial: 1000
};

var start_test_block = {
  type: 'poldrack-text',
  data: {
    trial_id: "test_intro"
  },
  timing_response: 180000,
  text: '<div class = centerbox><p class = shift-center-text>We will now start the test. You will no longer be told what the relevant feature is or when it switches. Press <strong>enter</strong> to begin.</p></div>',
  cont_key: [13],
  timing_post_trial: 1000
};

var rest_block = {
  type: 'poldrack-text',
  data: {
    trial_id: "rest"
  },
  timing_response: 180000,
  text: '<div class = centerbox><p class = shift-center-text>Take a break! Press <strong>enter</strong> to continue.</p></div>',
  cont_key: [13],
  timing_post_trial: 1000
};

var reset_block = {
  type: 'call-function',
  data: {
    trial_id: "reset_trial_count"
  },
  func: function() {
    current_trial = 0
    switch_count = 0
    rewarded_dim = randomDraw(dims)
    rewarded_feature = randomDraw(stim_att[rewarded_dim])
  },
  timing_post_trial: 0
}

//Create node to alert subject that shift happens during practice
var alert_block = {
  type: 'poldrack-single-stim',
  data: {
    trial_id: "alert"
  },
  stimulus: getAlert,
  is_html: true,
  choices: 'none',
  timing_stim: 5000,
  timing_response: 5000,
  timing_post_trial: 1000
};

var alert_node = {
    timeline: [alert_block],
    conditional_function: function() {
      if (switch_count === 0) {
        return true
      } else {
        return false
      }
    }
  }
  /* define test block */
var practice_stim_block = {
  type: 'poldrack-single-stim',
  stimulus: getStim,
  is_html: true,
  data: getData,
  choices: choices,
  timing_stim: 1000,
  timing_response: 1000,
  timing_post_trial: 0,
  response_ends_trial: true,
  on_finish: function(data) {
    var choice = choices.indexOf(data.key_press)
    var choice_stim = -1
    var correct = false
    if (choice != -1) {
      choice_stim = JSON.stringify(stims[choice])
      if (stims[choice][rewarded_dim] == rewarded_feature) {
        correct = true
      }
    }
    
    jsPsych.data.addDataToLastTrial({
      trial_id: "stim",
      exp_stage: "practice",
      stims: JSON.stringify(stims),
      choice_stim: choice_stim,
      choice_position: position_array[choice] || -1,
      correct: correct
    })
  }
};

var stim_block = {
  type: 'poldrack-single-stim',
  stimulus: getStim,
  is_html: true,
  data: getData,
  choices: choices,
  timing_stim: 1000,
  timing_response: 1000,
  timing_post_trial: 0,
  response_ends_trial: true,
  on_finish: function(data) {
    var choice = choices.indexOf(data.key_press)
    var choice_stim = -1
    var correct = false
    if (choice != -1) {
      choice_stim = JSON.stringify(stims[choice])
      if (stims[choice][rewarded_dim] == rewarded_feature) {
        correct = true
      }
    }
    jsPsych.data.addDataToLastTrial({
      trial_id: "stim",
      exp_stage: "test",
      stims: JSON.stringify(stims),
      choice_stim: choice_stim,
      choice_position: position_array[choice] || -1,
      correct: correct
    })
  }
};

var practice_feedback_block = {
  type: 'poldrack-single-stim',
  stimulus: getFeedback,
  is_html: true,
  data: getData,
  choices: 'none',
  timing_stim: 1000,
  timing_response: 1000,
  timing_post_trial: 500,
  on_finish: function(data) {
    var FB = -1
    if (data.stimulus.indexOf('won 1 point') != -1) {
      FB = 1
      total_points += 1
    } else if (data.stimulus.indexOf('won 0 point') != -1) {
      FB = 0
    }
    jsPsych.data.addDataToLastTrial({
      trial_id: "feedback",
      exp_stage: "practice",
      'feedback': FB
    })
    switch_count += 1
    if (switch_count == switch_bound) {
      switch_count = 0
      recorded_shift_type = shift_type
      if (shift_type == 'extra') {
        last_dim = rewarded_dim
        last_feature = rewarded_feature
        rewarded_dim = randomDraw(dims.filter(function(x) {
          return x != rewarded_dim
        }))
        rewarded_feature = randomDraw(stim_att[rewarded_dim])
      } else if (shift_type == 'intra') {
        var dim_features = stim_att[rewarded_dim]
        last_feature = rewarded_feature
        rewarded_feature = randomDraw(dim_features.filter(function(x) {
          return x != rewarded_feature
        }))
      } else if (shift_type == 'reversal') {
        rewarded_dim = last_dim
        rewarded_feature = last_feature
      }
      switch_bound = switch_bounds.shift()
      shift_type = shift_types.shift()
    } else {
      recorded_shift_type = 'stay'
    }
    current_trial += 1
  }
};

var feedback_block = {
  type: 'poldrack-single-stim',
  stimulus: getFeedback,
  is_html: true,
  data: getData,
  choices: 'none',
  timing_stim: 1000,
  timing_response: 1000,
  timing_post_trial: 500,
  on_finish: function(data) {
    var FB = -1
    if (data.stimulus.indexOf('won 1 point') != -1) {
      FB = 1
      total_points += 1
    } else if (data.stimulus.indexOf('won 0 point') != -1) {
      FB = 0
    }
    jsPsych.data.addDataToLastTrial({
      trial_id: "feedback",
      exp_stage: "test",
      'feedback': FB
    })
    switch_count += 1
    if (switch_count == switch_bound) {
      switch_count = 0
      recorded_shift_type = shift_type
      if (shift_type == 'extra') {
        last_dim = rewarded_dim
        last_feature = rewarded_feature
        rewarded_dim = randomDraw(dims.filter(function(x) {
          return x != rewarded_dim
        }))
        rewarded_feature = randomDraw(stim_att[rewarded_dim])
      } else if (shift_type == 'intra') {
        var dim_features = stim_att[rewarded_dim]
        last_feature = rewarded_feature
        rewarded_feature = randomDraw(dim_features.filter(function(x) {
          return x != rewarded_feature
        }))
      } else if (shift_type == 'reversal') {
        rewarded_dim = last_dim
        rewarded_feature = last_feature
      }
      switch_bound = switch_bounds.shift()
      shift_type = shift_types.shift()
    } else {
      recorded_shift_type = 'stay'
    }
    current_trial += 1
  }
};

/* create experiment definition array */
var shift_task_experiment = [];
shift_task_experiment.push(instruction_node);
for (var i = 0; i < practice_len; i++) {
  shift_task_experiment.push(alert_node)
  shift_task_experiment.push(practice_stim_block);
  shift_task_experiment.push(practice_feedback_block);
}
shift_task_experiment.push(reset_block);
shift_task_experiment.push(start_test_block);
for (var i = 0; i < exp_len; i++) {
  shift_task_experiment.push(stim_block);
  shift_task_experiment.push(feedback_block);
  if (i % (Math.floor(exp_len / 4)) === 0 && i !== 0) {
    shift_task_experiment.push(attention_node)
    shift_task_experiment.push(rest_block)
  }
}
shift_task_experiment.push(post_task_block)
shift_task_experiment.push(end_block);