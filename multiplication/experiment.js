/* ************************************ */
/* Define helper functions */
/* ************************************ */
function getDisplayElement() {
  $('<div class = display_stage_background></div>').appendTo('body')
  return $('<div class = display_stage></div>').appendTo('body')
}

var get_response_time = function() {
  return response_time;
}

var randomDraw = function(lst) {
  var index = Math.floor(Math.random() * (lst.length))
  return lst[index]
}

var getStim = function() {
  response = 0
  var num1 = Math.floor(Math.random() * 99) + 1
  var num2 = Math.floor(Math.random() * 99) + 1
  answer = num1 * num2
  var text = '<div class = centerbox><form style="font-size: 24px">' + num1 + ' * ' + num2 +
    ' =  <input type ="text" id ="mathtext" style="font-size: 24px"></form><br></br><button class = "default_button submitButton" id = submit_button onclick = submit()>Submit Answer</button></div>'
  return text
}
var submit = function() {
  response = $('input:text').val()
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
var answer = 0
var response = 0
var response_time = 180000
var lstep = 5000
var sstep = 1000
var n_large_steps = 50
var n_small_steps = 50
var p = 0.5 // The probability of a correct response for the staircase
var fatigue_time = 45

/* ************************************ */
/* Set up jsPsych blocks */
/* ************************************ */
/* define static blocks */
var welcome_block = {
  type: 'poldrack-text',
  timing_response: 180000,
  data: {
    exp_id: 'multiplication',
    trial_id: "welcome"
  },
  text: '<div class = centerbox><p class = center-block-text>Welcome to the experiment. Press <strong>enter</strong> to begin.</p></div>',
  cont_key: [13],
  timing_post_trial: 0
};

var feedback_instruct_text =
  'Starting with instructions.  Press <strong> Enter </strong> to continue.'
var feedback_instruct_block = {
  type: 'poldrack-text',
  cont_key: [13],
  data: {
    exp_id: 'multiplication',
    trial_id: "instruction"
  },
  text: getInstructFeedback,
  timing_post_trial: 0,
  timing_response: 6000
};
/// This ensures that the subject does not read through the instructions too quickly.  If they do it too quickly, then we will go over the loop again.
var instruction_trials = []
var instructions_block = {
  type: 'poldrack-instructions',
  data: {
    exp_id: 'multiplication',
    trial_id: "instruction"
  },
  pages: [
    '<div class = centerbox><p class = block-text>In this experiment we are interested in how people multiply numbers. Every trial in this experiment will require you to multiply two 2-digit numbers (e.g. 37 * 86) together and enter the answer.</p><p class = block-text>While doing the multiplication you are free to use paper and pencil or do them in your head, but be consistent and do not use a calculator or your computer. That means if you decide to use paper and pencil, please use paper and pencil for the entire experiment.</p><p class = block-text>Finally, this experiment is long! To figure out how people multiple we need you to multiply many numbers and it is important that you stay engaged! The whole experiment will take about an hour.</p></div>'
  ],
  allow_keys: false,
  show_clickable_nav: true,
  timing_post_trial: 1000,
  on_finish: function() {
    setTimeout(function() {
      $("#mathtext").focus()
    }, 1010)
  }
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
    exp_id: 'multiplication',
    trial_id: "end"
  },
  text: '<div class = centerbox><p class = center-block-text>Thanks for completing this task!</p><p class = center-block-text>Press <strong>enter</strong> to continue.</p></div>',
  cont_key: [13],
  timing_post_trial: 0
};

//Define staircase blocks
var largeStep_block = {
  type: 'single-stim-button',
  stimulus: getStim,
  data: {
    exp_id: 'multiplication',
    trial_id: "stim",
    exp_stage: "test"
  },
  button_class: 'submitButton',
  timing_stim: get_response_time,
  timing_response: get_response_time,
  response_ends_trial: false,
  on_finish: function() {
    jsPsych.data.addDataToLastTrial({
        response: response,
        answer: answer,
        response_time: response_time
      })
      // staircase
    if (response == answer) {
      response_time -= lstep * (1 - p)
    } else {
      response_time += lstep * p
    }
    setTimeout(function() {
      $("#mathtext").focus()
    }, 1010)
  }
}

var smallStep_block = {
  type: 'single-stim-button',
  stimulus: getStim,
  button_class: 'submitButton',
  data: {
    exp_id: 'multiplication',
    trial_id: "stim",
    exp_stage: "test"
  },
  timing_stim: get_response_time,
  timing_response: get_response_time,
  response_ends_trial: false,
  on_finish: function() {
    jsPsych.data.addDataToLastTrial({
        response: response,
        answer: answer,
        response_time: response_time
      })
      // staircase
    if (response == answer) {
      response_time -= sstep * (1 - p)
    } else {
      response_time += sstep * p
    }
    setTimeout(function() {
      $("#mathtext").focus()
    }, 1010)
  }
}

//45 minutes of math
var fatigue_block = {
  type: 'single-stim-button',
  stimulus: getStim,
  button_class: 'submitButton',
  data: {
    exp_id: 'multiplication',
    trial_id: "stim",
    exp_stage: "test"
  },
  timing_stim: get_response_time,
  timing_response: get_response_time,
  response_ends_trial: false,
  on_finish: function() {
    jsPsych.data.addDataToLastTrial({
      response: response,
      answer: answer,
      response_time: response_time
    })
    setTimeout(function() {
      $("#mathtext").focus()
    }, 1010)
  }
}



/* create experiment definition array */
var multiplication_experiment = []
multiplication_experiment.push(welcome_block)
multiplication_experiment.push(instruction_node)
for (var i = 0; i < n_large_steps; i++) {
  multiplication_experiment.push(largeStep_block)
}
for (var i = 0; i < n_small_steps; i++) {
  multiplication_experiment.push(smallStep_block)
}
for (var i = 0; i < Math.floor(180000 * fatigue_time / response_time); i++) {
  multiplication_experiment.push(fatigue_block)
}