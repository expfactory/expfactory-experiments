/* ************************************ */
/* Define helper functions */
/* ************************************ */
function getDisplayElement() {
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
    check_percent = checks_passed / attention_check_trials.length
  }
  return check_percent
}

function addID() {
  jsPsych.data.addDataToLastTrial({
    'exp_id': 'local_global'
  })
}

var randomDraw = function(lst) {
  var index = Math.floor(Math.random() * (lst.length))
  return lst[index]
}

var makeTrialList = function(len, stim, data) {
  //choice array: numeric key codes for the numbers 1-4
  var choice_array = [49, 50, 51, 52]
    // 1 is a switch trial: ensure half the trials are switch trials
  var switch_trials = jsPsych.randomization.repeat([0, 1], len / 2)
    //create test array
  output_list = []
    //randomize first trial
  var trial_index = jsPsych.randomization.shuffle(['global', 'local'])[0]
  if (trial_index == 'global') {
    tmpi = Math.floor(Math.random() * (stim.length / 2))
  } else {
    tmpi = Math.floor(Math.random() * (stim.length / 2)) + stim.length / 2
  }
  var tmp_obj = {}
  tmp_obj.stimulus = stim[tmpi]
  var tmp_data = $.extend({}, data[tmpi])
  tmp_data.switch = 0
  tmp_data.correct_response = choice_array[task_shapes.indexOf(data[tmpi][trial_index + '_shape'])]
  tmp_obj.data = tmp_data
  output_list.push(tmp_obj)
    /* randomly sample from either the global or local stimulus lists (first and half part of the stim/data arrays)
	On stay trials randomly select an additional stimulus from that array. On switch trials choose from the other list. */
  for (i = 1; i < switch_trials.length; i++) {
    tmp_obj = {}
    if (switch_trials[i] == 1) {
      if (trial_index == 'global') {
        trial_index = 'local'
      } else {
        trial_index = 'global'
      }
    }
    if (trial_index == 'global') {
      tmpi = Math.floor(Math.random() * (stim.length / 2))
    } else {
      tmpi = Math.floor(Math.random() * (stim.length / 2)) + stim.length / 2
    }
    tmp_obj.stimulus = stim[tmpi]
    tmp_data = $.extend({}, data[tmpi])
    tmp_data.switch = switch_trials[i]
    tmp_data.correct_response = choice_array[task_shapes.indexOf(data[tmpi][trial_index +
      '_shape'
    ])]
    tmp_obj.data = tmp_data
    output_list.push(tmp_obj)
  }
  return output_list
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
var attention_check_thresh = 0.65
var sumInstructTime = 0 //ms
var instructTimeThresh = 0 ///in seconds

// task specific variables
var task_colors = jsPsych.randomization.shuffle(['blue', 'black'])
var task_shapes = ['circle', 'X', 'triangle', 'square']
var path = '/static/experiments/local_global/images/'
prefix = '<div class = centerbox><img src = "'
postfix = '"</img></div>'
stim = []
data = []
for (c = 0; c < task_colors.length; c++) {
  if (c === 0) {
    condition = 'global'
  } else {
    condition = 'local'
  }
  for (g = 0; g < task_shapes.length; g++) {
    for (l = 0; l < task_shapes.length; l++) {
      stim.push(prefix + path + task_colors[c] + '_' + task_shapes[g] + 'of' + task_shapes[l] +
        's.png' + postfix)
      data.push({
        condition: condition,
        global_shape: task_shapes[g],
        local_shape: task_shapes[l]
      })
    }
  }
}

//Set up experiment stimulus order
var practice_trials = makeTrialList(36, stim, data)
for (i = 0; i < practice_trials.length; i++) {
  practice_trials[i].key_answer = practice_trials[i].data.correct_response
}
var test_trials = makeTrialList(96, stim, data)



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

/* define static blocks */
var welcome_block = {
  type: 'poldrack-text',
  data: {
    trial_id: "welcome"
  },
  timing_response: 180000,
  text: '<div class = centerbox><p class = center-block-text>Welcome to the experiment. Press <strong>enter</strong> to begin.</p></div>',
  cont_key: [13],
  timing_post_trial: 0
};

var end_block = {
  type: 'poldrack-text',
  data: {
    trial_id: "end"
  },
  timing_response: 180000,
  text: '<div class = centerbox><p class = center-block-text>Thanks for completing this task!</p><p class = center-block-text>Press <strong>enter</strong> to continue.</p></div>',
  cont_key: [13],
  timing_post_trial: 0
};

var feedback_instruct_text =
  'Starting with instructions.  Press <strong> Enter </strong> to continue.'
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
var instruction_trials = []
var instructions_block = {
  type: 'poldrack-instructions',
  data: {
    trial_id: "instruction"
  },
  pages: [
    '<div class = centerbox><p class = block-text>In this experiment you will see blue or black shapes made up of smaller shapes, like the image below. All of the smaller shapes will always be the same shape. Both the large shape and the smaller shapes can either be a circle, X, triangle or square.</p><div class = instructionImgBox><img src = "static/experiments/local_global/images/blue_squareofcircles.png" height = 200 width = 200></img></div></div>',
    '<div class = centerbox><p class = block-text>Your task is to respond based on how many lines either the large or small shapes have, depending on the color. If the shape is ' +
    task_colors[0] + ' respond based on how many lines the large shape has. If the shape is ' +
    task_colors[1] +
    ' respond based on how many lines the small shape has.</p><p class = block-text>Use the number keys to respond 1 for a circle, 2 for an X, 3 for a triangle and 4 for a square.</p></div>',
    '<div class = centerbox><p class = block-text>For instance, for the shape below you would press 3 because it is ' +
    task_colors[1] +
    ' which means you should respond based on the smaller shapes. If the shape was instead ' +
    task_colors[0] +
    ' you would press 2.</p><div class = instructionImgBox><img src = "static/experiments/local_global/images/' +
    task_colors[1] + '_Xoftriangles.png" height = 200 width = 200></img></div></div>'
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
  timing_response: 180000,
  data: {
    trial_id: "practice_intro"
  },
  text: '<div class = centerbox><p class = center-block-text>We will start with some practice. Press <strong>enter</strong> to begin.</p></div>',
  cont_key: [13],
  timing_post_trial: 1000
};

var start_test_block = {
  type: 'poldrack-text',
  timing_response: 180000,
  data: {
    trial_id: "test_intro"
  },
  text: '<div class = centerbox><p class = center-block-text>We will now start the test. Press <strong>enter</strong> to begin.</p></div>',
  cont_key: [13],
  timing_post_trial: 1000
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
  correct_text: '<div class = centerbox><div class = center-text>Correct</div></div>',
  incorrect_text: '<div class = centerbox><div class = center-text>Incorrect</div></div>',
  timeout_message: '<div class = centerbox><div class = center-text>Response faster!</div></div>',
  choices: [49, 50, 51, 52],
  timing_feedback_duration: 1000,
  show_stim_with_feedback: false,
  timing_post_trial: 500
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
  choices: [49, 50, 51, 52],
  timing_post_trial: 500
};

/* create experiment definition array */
var local_global_experiment = [];
local_global_experiment.push(welcome_block);
local_global_experiment.push(instruction_node);
local_global_experiment.push(start_practice_block);
local_global_experiment.push(practice_block);
local_global_experiment.push(start_test_block);
local_global_experiment.push(test_block);
local_global_experiment.push(attention_node)
local_global_experiment.push(end_block);