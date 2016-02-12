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
    'exp_id': 'hierarchical_rule'
  })
}

var randomDraw = function(lst) {
  var index = Math.floor(Math.random() * (lst.length))
  return lst[index]
}

var getFixLength = function() {
  return 250 + Math.random() * 500
}
var getFeedback = function() {
  var last_trial = jsPsych.data.getLastTrialData()
  if (last_trial.key_press == -1) {
    return '<div class = centerbox><div class = "white-text center-text">Respond faster!</div></div>'
  } else if (last_trial.key_press == last_trial.correct_response) {
    correct += 1
    return '<div class = centerbox><div class = "white-text center-text">Correct</div></div>'
  } else {
    return '<div class = centerbox><div class = "white-text center-text">Incorrect</div></div>'
  }
}

var getHierarchicalStim = function() {
  return hierarchical_stims.stimulus.shift()
}


var getHierarchicalData = function() {
  return hierarchical_stims.data.shift()
}


var getFlatStim = function() {
  return flat_stims.stimulus.shift()
}


var getFlatData = function() {
  return flat_stims.data.shift()
}

var getInstructFeedback = function() {
  return '<div class = centerbox><p class = "white-text center-block-text">' +
    feedback_instruct_text + '</p></div>'
}

/* ************************************ */
/* Define experimental variables */
/* ************************************ */
// generic task variables
var run_attention_checks = true
var attention_check_thresh = 0.45
var sumInstructTime = 0 //ms
var instructTimeThresh = 0 ///in seconds

// task specific variables
var exp_len = 200 //number of trials per rule-set
var flat_first = 0 //  Math.floor(Math.random())
var path_source = '/static/experiments/hierarchical_rule/images/'
var stim_prefix = '<div class = centerbox><div class = stimBox><img class = hierarchicalStim src ='
var border_prefix = '<img class = hierarchicalBorder src ='
var prompt_prefix = '<img class = hierarchicalPrompt src ='
var postfix = ' </img></div></div>'
var choices = [74, 75, 76]
var correct = 0 // tracks correct trials

//generate stims
//1=red, 2=blue, 3=green, 4=yellow BORDER COLORS
//1=vertical, 2=slant, 3=horizontal ORIENTATION OF STIMS
flat_stims = []
hierarchical_stims = []
colors = jsPsych.randomization.shuffle([1, 2, 3, 4]) //border colors
stims = jsPsych.randomization.shuffle([1, 2, 3, 4, 5, 6])
orientations = [1, 2, 3]
color_data = ['red','blue','green','yellow']
orientation_data = ['vertical','slant','horizontal']
random_correct = jsPsych.randomization.repeat(choices, 6) // correct responses for random stim
for (var c = 0; c < colors.length; c++) {
  for (var s = 0; s < stims.length / 2; s++) {
    for (var o = 0; o < orientations.length; o++) {
      if (c < colors.length / 2) {
        flat_stims.push({
          stimulus: stim_prefix + path_source + stims[s] + orientations[o] + '.bmp </img>' +
            border_prefix + path_source + colors[c] + '_border.png' + postfix,
          data: {
            stim: stims[s],
            orientation: orientation_data[orientations[o]-1],
            border: color_data[colors[c]-1],
            exp_stage: "test",
            correct_response: random_correct.pop()
          }
        })
      } else {
        if (c == 2) {
          correct_response = choices[s - 1]
        } else if (c == 3) {
          correct_response = choices[o - 1]
        }
        hierarchical_stims.push({
          stimulus: stim_prefix + path_source + stims[s + (stims.length / 2)] + orientations[o] +
            '.bmp </img>' + border_prefix + path_source + colors[c] + '_border.png' + postfix,
          data: {
            stim: stims[s + (stims.length / 2)],
            orientation: orientation_data[orientations[o]-1],
            exp_stage: "test",
            border: color_data[colors[c]-1],
            correct_response: correct_response
          }
        })
      }
    }
  }
}
// flat_stims = jsPsych.randomization.repeat(flat_stims,20,true)
// hierarchical_stims = jsPsych.randomization.repeat(hierarchical_stims,20,true)
// Change structure of object array to work with new structure
flat_stims = jsPsych.randomization.repeat(flat_stims, 20, true)
hierarchical_stims = jsPsych.randomization.repeat(hierarchical_stims, 20, true)

instructions_grid = '<div class = gridBox>'
for (var c = 0; c < colors.length / 2; c++) {
  for (var s = 0; s < stims.length / 2; s++) {
    for (var o = 0; o < orientations.length; o++) {
      instructions_grid +=
        '<div class = imgGridBox><img class = gridImage src = ' + path_source + stims[s] +
        orientations[o] + '.bmp </img>'
      instructions_grid +=
        '<img class = gridBorder src = ' + path_source + colors[c] + '_border.png </img></div>'
    }
  }
}
instructions_grid += '</div>'


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
  timing_response: 180000,
  data: {
    trial_id: "welcome"
  },
  text: '<div class = centerbox><p class = "white-text center-block-text">Welcome to the experiment. Press <strong>enter</strong> to begin.</p></div>',
  cont_key: [13],
  timing_post_trial: 0
}

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
    '<div class = centerbox><p class = "white-text block-text">In this experiment stimuli will come up one at a time. You should respond to them by pressing the J, K or L keys, after which you will receive feedback about whether you were right or not. If you were correct you will get points which contribute to your bonus payment.</p><p class = "white-text block-text">Your job is to get as many trials correct as possible! On the next page are the stimuli you will be responding to.</p></div>',
    instructions_grid,
    '<div class = centerbox><p class = "white-text block-text">Make sure you are familiar with the stimuli on the last page. Remember, respond to the stimuli by pressing J, K, or L. You will get a bonus based on your performance so try your best!</p><p class = "white-text block-text">This experiment will take about 30 minutes. There will be a break half way through. Good luck!</p></div>'
  ],
  allow_keys: false,
  show_clickable_nav: true
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

var end_block = {
  type: 'poldrack-text',
  timing_response: 180000,
  data: {
    trial_id: "end"
  },
  text: '<div class = centerbox><p class = "white-text center-block-text">Thanks for completing this task!</p><p class = "white-text center-block-text">Press <strong>enter</strong> to begin.</p></div>',
  cont_key: [13],
  timing_post_trial: 0
};


var start_test_block = {
  type: 'poldrack-text',
  data: {
    trial_id: "test_intro"
  },
  timing_response: 180000,
  text: '<div class = centerbox><p class = "white-text center-block-text">We will now start the test.</p><p class = "white-text center-block-text">Press <strong>enter</strong> to begin.</p></div>',
  cont_key: [13],
  timing_post_trial: 1000
};

var fixation_block = {
  type: 'poldrack-single-stim',
  stimulus: prompt_prefix + path_source + 'FIX.png' + ' style:"z-index: -1"' + postfix,
  is_html: true,
  choices: 'none',
  data: {
    trial_id: "fixation",
    exp_stage: "test"
  },
  response_ends_trial: false,
  timing_post_trial: 0,
  timing_stim: -1,
  timing_response: getFixLength
}

var feedback_block = {
  type: 'poldrack-single-stim',
  stimulus: getFeedback,
  is_html: true,
  choices: 'none',
  data: {
    trial_id: "feedback",
    exp_stage: "test"
  },
  response_ends_trial: false,
  timing_post_trial: 0,
  timing_stim: 1000,
  timing_response: 1000
}


var flat_stim_block = {
  type: 'poldrack-single-stim',
  stimulus: getFlatStim,
  data: getFlatData,
  is_html: true,
  choices: choices,
  response_ends_trial: false,
  timing_stim: 1000,
  timing_response: 3000,
  prompt: prompt_prefix + path_source + 'FIX_GREEN.png' + ' style:"z-index: -1"' + postfix,
  timing_post_trial: 0,
  on_finish: function() {
    jsPsych.data.addDataToLastTrial({
      trial_id: "flat_stim",
      exp_stage: "test"
    })
  }
}

var hierarchical_stim_block = {
  type: 'poldrack-single-stim',
  stimulus: getHierarchicalStim,
  data: getHierarchicalData,
  is_html: true,
  choices: choices,
  response_ends_trial: false,
  timing_stim: 1000,
  timing_response: 3000,
  prompt: prompt_prefix + path_source + 'FIX_GREEN.png' + ' style:"z-index: -1"' + postfix,
  timing_post_trial: 0,
  on_finish: function() {
    jsPsych.data.addDataToLastTrial({
      trial_id: "hierarchical_stim",
      exp_stage: "test"
    })
  }
}

// loop nodes instead of creating a huge array with three blocks for all trials
var flat_loop_node = {
  timeline: [fixation_block, flat_stim_block, feedback_block],
  loop_function: function(data) {
    if (flat_stims.stimulus.length > 0) {
      return true;
    } else {
      return false;
    }
  }
}

var hierarchical_loop_node = {
  timeline: [fixation_block, hierarchical_stim_block, feedback_block],
  loop_function: function(data) {
    if (hierarchical_stims.stimulus.length > 0) {
      return true;
    } else {
      return false;
    }
  }
}

//Set up experiment
var hierarchical_rule_experiment = []
hierarchical_rule_experiment.push(welcome_block);
hierarchical_rule_experiment.push(instruction_node);
hierarchical_rule_experiment.push(start_test_block);
// setup exp w loop nodes after pushing the practice etc. blocks
if (flat_first == 1) {
  hierarchical_rule_experiment.push(flat_loop_node, attention_node, start_test_block,
    hierarchical_loop_node, attention_node);
} else {
  hierarchical_rule_experiment.push(hierarchical_loop_node, attention_node, start_test_block,
    flat_loop_node, attention_node);
}

hierarchical_rule_experiment.push(end_block)