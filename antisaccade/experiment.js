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
  var index = Math.round(Math.random() * (lst.length - 1))
  return lst[index]
}

var getFixationLength = function() {
  return Math.floor(Math.random() * 9) * 250 + 1500
}


/* ************************************ */
/* Define experimental variables */
/* ************************************ */
// generic task variables
var run_attention_checks = false
var attention_check_thresh = 0.45
var sumInstructTime = 0 //ms
var instructTimeThresh = 0 ///in seconds

// task specific variables
var exp_stage = 'practice'
var correct_responses = jsPsych.randomization.repeat([
  ["left arrow", 37],
  ["left arrow", 37],
  ["right arrow", 39],
  ["right arrow", 39]
], 1)
var prompt_text = '<ul list-text><li>Square:  ' + correct_responses[0][0] + '</li><li>Circle:  ' +
  correct_responses[1][0] + ' </li><li>Triangle:  ' + correct_responses[2][0] +
  ' </li><li>Diamond:  ' + correct_responses[3][0] + ' </li></ul>'

var path = '/static/experiments/antisaccade/images/'
var cue_img = path + 'square.png'
var mask_img = path + 'mask.png'
var left_arrow = path + 'left_arrow.png'
var right_arrow = path + 'right_arrow.png'
var up_arrow = path + 'up_arrow.png'
var cues = [{
    image: '<div class = centerbox><div class = stim_left><img src = ' + cue_img + '></img></div></div>',
    data: {
      trial_id: "cue",
      cue_placement: "left"
    }
  }, {
    image: '<div class = centerbox><div class = stim_right><img src = ' + cue_img + '></img></div></div>',
    data: {
      trial_id: "cue",
      cue_placement: "right"
    }
  }
]

var masks = [{
  image: '<div class = centerbox><div class = stim_left><img src = ' + mask_img + '></img></div></div>',
  data: {
    trial_id: "mask",
    mask_placement: "left"
  }
}, {
  image: '<div class = centerbox><div class = stim_right><img src = ' + mask_img + '></img></div></div>',
  data: {
    trial_id: "mask",
    mask_placement: "right"
  }
}]


practice_len = 22
exp_len = 90
  //0 = right, 1 = left
practice_cue_sides = jsPsych.randomization.repeat([0, 1], practice_len / 2, false)
test_cue_sides = jsPsych.randomization.repeat([0, 1], exp_len / 2, false)

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
  data: {
    trial_id: "end",
    exp_id: 'antisaccade'
  },
  text: '<div class = centerbox><p class = center-block-text>Thanks for completing this task!</p><p class = center-block-text>Press <strong>enter</strong> to continue.</p></div>',
  cont_key: [13],
  timing_response: 180000,
  timing_post_trial: 0
};

var feedback_instruct_text =
  'Welcome to the experiment. Press <strong>enter</strong> to begin.'
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
    '<div class = centerbox><p class = block-text>In this task you will have to identify which way an arrow is pointing. In each trial a cross will appear on the screen, after which a black square will be presented on one side of the screen (left or right).</p><p class = block-text>Following the square an arrow will be presented on the other side of the screen and then quickly covered up by a grey mask. You should respond by identifying which way the arrow was pointed (left, right, or up) using the arrow keys.</p></div>'
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

var begin_practice_block = {
  type: 'poldrack-text',
  text: '<div class = centerbox><p class = block-text>We will start with some practice. Remember, use the arrow keys (left, right, and up) to indicate which direction the arrow is pointing.</p><p class = block-text>Press <strong>enter</strong> to begin.</p></div>',
  cont_key: [13],
  data: {
    trial_id: "practice_intro"
  },
  timing_response: 180000,
  timing_post_trial: 1000
};

var begin_test_block = {
  type: 'poldrack-text',
  text: '<div class = centerbox><p class = block-text>We will now start the main experiment. Remember, use the arrow keys (left, right, and up) to indicate which direction the arrow is pointing.</p><p class = block-text>Press <strong>enter</strong> to begin.</p></div>',
  cont_key: [13],
  data: {
    trial_id: "test_intro"
  },
  timing_response: 180000,
  timing_post_trial: 1000,
  on_finish: function() {
    exp_stage = 'test'
  }
};


var fixation_block = {
  type: 'poldrack-single-stim',
  stimulus: '<div class = centerbox><div class = fixation>+</div></div>',
  is_html: true,
  choices: 'none',
  data: {
    "trial_id": "fixation"
  },
  timing_post_trial: 0,
  timing_stim: getFixationLength(),
  timing_response: 500,
  on_finish: function() {
    jsPsych.data.addDataToLastTrial({
      exp_stage: exp_stage
    })
  },
}



/* ************************************ */
/* Set up experiment */
/* ************************************ */

var antisaccade_experiment = []
antisaccade_experiment.push(instruction_node);

//Set up practice
antisaccade_experiment.push(begin_practice_block)
for (i = 0; i < practice_len; i++) {
  antisaccade_experiment.push(fixation_block)
  target_direction = randomDraw([
    [left_arrow, 'left', 37],
    [right_arrow, 'right', 39],
    [up_arrow, 'up', 38]
  ])
  if (practice_cue_sides[i] === 0) {
    cue = cues[0]
    target = {
      image: '<div class = centerbox><div class = stim_right><img src = ' + target_direction[0] + '></img></div></div>',
      data: {
        trial_id: "target",
        correct_response: target_direction[2],
        arrow_direction: target_direction[1],
        arrow_placement: 'right'
      }
    }
    mask = masks[1]
  } else {
    cue = cues[1]
    target = {
      image: '<div class = centerbox><div class = stim_left><img src = ' + target_direction[0] + '></img></div></div>',
      data: {
        trial_id: "target",
        correct_response: target_direction[2],
        arrow_direction: target_direction[1],
        arrow_placement: 'left'
      }
    }
    mask = masks[0]
  }
  var cue_block = {
    type: 'poldrack-single-stim',
    stimulus: cue.image,
    is_html: true,
    choices: [37, 38, 39],
    data: cue.data,
    timing_post_trial: 0,
    timing_stim: 225,
    timing_response: 225,
    response_ends_trial: false,
    on_finish: function() {
      jsPsych.data.addDataToLastTrial({
        exp_stage: exp_stage
      })
    },
  }

  var target_block = {
    type: 'poldrack-single-stim',
    stimulus: target.image,
    is_html: true,
    choices: [37, 38, 39],
    data: target.data,
    timing_post_trial: 0,
    timing_stim: 150,
    timing_response: 150,
    response_ends_trial: false,
    on_finish: function() {
      jsPsych.data.addDataToLastTrial({
        exp_stage: exp_stage
      })
    },

  }

  var mask_block = {
    type: 'poldrack-single-stim',
    stimulus: mask.image,
    is_html: true,
    choices: [37, 38, 39],
    data: mask.data,
    timing_post_trial: 0,
    timing_stim: 1000,
    timing_response: 1000,
    response_ends_trial: false,
    on_finish: function() {
      jsPsych.data.addDataToLastTrial({
        exp_stage: exp_stage
      })
    },
  }
  antisaccade_experiment.push(cue_block)
  antisaccade_experiment.push(target_block)
  antisaccade_experiment.push(mask_block)
}
antisaccade_experiment.push(attention_node)

//Set up test
antisaccade_experiment.push(begin_test_block)
for (i = 0; i < exp_len; i++) {
  antisaccade_experiment.push(fixation_block)
  target_direction = randomDraw([
    [left_arrow, 'left', 37],
    [right_arrow, 'right', 39],
    [up_arrow, 'up', 38]
  ])
  if (test_cue_sides[i] === 0) {
    cue = cues[0]
    target = {
      image: '<div class = centerbox><div class = stim_right><img src = ' + target_direction[0] + '></img></div></div>',
      data: {
        trial_id: "target",
        correct_response: target_direction[2],
        arrow_direction: target_direction[1],
        arrow_placement: 'right'
      }
    }
    mask = masks[1]
  } else {
    cue = cues[1]
    target = {
      image: '<div class = centerbox><div class = stim_left><img src = ' + target_direction[0] + '></img></div></div>',
      data: {
        trial_id: "target",
        correct_response: target_direction[2],
        arrow_direction: target_direction[1],
        arrow_placement: 'left'
      }
    }
    mask = masks[0]
  }
  var cue_block = {
    type: 'poldrack-single-stim',
    stimulus: cue.image,
    is_html: true,
    choices: [37, 38, 39],
    data: cue.data,
    timing_post_trial: 0,
    timing_stim: 225,
    timing_response: 225,
    response_ends_trial: false,
    on_finish: function() {
      jsPsych.data.addDataToLastTrial({
        exp_stage: exp_stage
      })
    },

  }

  var target_block = {
    type: 'poldrack-single-stim',
    stimulus: target.image,
    is_html: true,
    choices: [37, 38, 39],
    data: target.data,
    timing_post_trial: 0,
    timing_stim: 150,
    timing_response: 150,
    response_ends_trial: false,
    on_finish: function() {
      jsPsych.data.addDataToLastTrial({
        exp_stage: exp_stage
      })
    },
  }

  var mask_block = {
    type: 'poldrack-single-stim',
    stimulus: mask.image,
    is_html: true,
    choices: [37, 38, 39],
    data: mask.data,
    timing_post_trial: 0,
    timing_stim: 1000,
    timing_response: 1000,
    response_ends_trial: false,
    on_finish: function() {
      jsPsych.data.addDataToLastTrial({
        exp_stage: exp_stage
      })
    },
  }
  antisaccade_experiment.push(cue_block)
  antisaccade_experiment.push(target_block)
  antisaccade_experiment.push(mask_block)
}
antisaccade_experiment.push(attention_node)
antisaccade_experiment.push(post_task_block)
antisaccade_experiment.push(end_block)