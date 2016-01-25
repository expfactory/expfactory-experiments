
/* ************************************ */
/* Define helper functions */
/* ************************************ */
function getDisplayElement () {
    $('<div class = display_stage_background></div>').appendTo('body')
    return $('<div class = display_stage></div>').appendTo('body')
}

var arraysEqual = function(arr1, arr2) {
    if(arr1.length !== arr2.length)
        return false;
    for(var i = arr1.length; i--;) {
        if(arr1[i] !== arr2[i])
            return false;
    }
    return true;
}

var setStims = function() {
  curr_seq = []
  stim_array = [first_grid]
  time_array = [500]
  for (var i=0; i< num_spaces; i++) {
    var num = Math.floor(Math.random()*25)+1
    stim_grid = '<div class = numbox>'
    for (var j = 1; j<26; j++) {
      if (j == num) {
        stim_grid += '<button id = button_' + j + ' class = "square red" onclick = "recordClick(this)"><div class = content></div></button>'
      } else {
        stim_grid += '<button id = button_' + j + ' class = "square" onclick = "recordClick(this)"><div class = content></div></button>'
      }
    }
    stim_grid += '</div>'
    curr_seq.push(num)
    stim_array.push(stim_grid)
    time_array.push(stim_time)
  }
  total_time = num_spaces * (stim_time)
}

var getTestText = function() {
 return  '<div class = centerbox><div class = center-text>' + num_spaces + ' Squares</p></div>'
}

var getStims = function() {
  return stim_array
}

var getTimeArray = function() {
  return time_array
}

var getTotalTime = function() {
  return total_time
}

var getFeedback = function() {
  return '<div class = centerbox><div class = center-text>' + feedback + '</div></div>'
}

var recordClick = function(elm) {
  response.push(Number($(elm).attr('id').slice(7)))
}

var clearResponse = function() {
  response = []
}

/* ************************************ */
/* Define experimental variables */
/* ************************************ */
var num_spaces = 3
var num_trials = 10
var curr_seq = []
var stim_time = 1000
var time_array = []
var total_time = 0
var errors = 0
var error_lim = 3
var response = []
var enter_grid = ''
var first_grid = '<div class = numbox>'
for (var i = 1; i < 26; i++) {
  first_grid += '<button id = button_' + i + ' class = "square" onclick = "recordClick(this)"><div class = content></div></button>'
}
var response_grid = '<div class = numbox>'
for (var i = 1; i < 26; i++) {
  response_grid += '<button id = button_' + i + ' class = "square" onclick = "recordClick(this)"><div class = content></div></button>'
}
response_grid += '<button class = clear_button id = "ClearButton" onclick = "clearResponse()">Clear</button>' +
                '<button class = submit_button id = "SubmitButton">Submit Answer</button></div>'
setStims()
var stim_array = getStims()

/* ************************************ */
/* Set up jsPsych blocks */
/* ************************************ */
/* define static blocks */
var welcome_block = {
  type: 'poldrack-text',
  timing_response: 60000,
  text: '<div class = centerbox><p class = center-block-text>Welcome to the experiment. Press <strong>enter</strong> to begin.</p></div>',
  cont_key: [13],
  timing_post_trial: 0
};

var instructions_block = {
  type: 'poldrack-instructions',
  pages: [
  '<div class = centerbox><p class = block-text>In this test you will see a grid of squares that will flash red one at a time. You have to remember the order that the squares flashed red. At the end of each trial, enter the sequence into the grid as you saw it presented to you.</p><p class = block-text></p><p class = block-text>If you correctly remember the whole sequence, the next sequence will be one "square" longer. If you make a mistake then the next sequence will be one "square" shorter.</p><p class = block-text>After three errors, the test will end. Trials will start after you end instructions. </p></div>'
  ],
  allow_keys: false,
  show_clickable_nav: true,
  timing_post_trial: 1000
};

var end_block = {
  type: 'poldrack-text',
  timing_response: 60000,
  text: '<div class = centerbox><p class = center-block-text>Finished with this task.</p><p class = center-block-text>Press <strong>enter</strong> to continue.</p></div>',
  cont_key: [13],
  timing_post_trial: 0
};


var start_test_block = {
  type: 'poldrack-single-stim',
  is_html: true,
  stimulus: getTestText,
  choices: 'none',
  timing_stim: 1000,
  timing_response: 1000,
  response_ends_trial: false,
  timing_post_trial: 1000
};

var start_reverse_block = {
  type: 'poldrack-text',
  timing_response: 60000,
  text: '<div class = centerbox><p class = block-text>In these next trials, instead of reporting back the sequence you just saw, report the <strong>reverse</strong> of that sequence. So the last item should be first in your response, the second to last should be the second in your response, etc...</p><p class = block-text>Press <strong>enter</strong> to begin.</p></div>',
  cont_key: [13]
}

/* define test block */
var test_block = {
  type: 'poldrack-multi-stim-multi-response',
  stimuli: getStims,
  is_html: true,
  timing_stim: getTimeArray,
  choices: [['none']],
  data: {exp_id: "spatial_span", trial_id: "test"},
  timing_response: getTotalTime,
  timing_post_trial: 0,
  on_finish: function() {
    jsPsych.data.addDataToLastTrial({"sequence": curr_seq, "num_spaces": num_spaces})
  }
}


var forward_response_block = {
  type: 'poldrack-single-stim-button',
  stimulus: response_grid,
  button_class: 'submit_button',
  data: {exp_id: "spatial_span", trial_id: "response"},
  on_finish: function() {
  	jsPsych.data.addDataToLastTrial({"response": response, "sequence": curr_seq, "num_spaces": num_spaces, "condition": "forward", feedback: fb})
      var fb = 0
      // staircase
      if (arraysEqual(response,curr_seq)) {
        num_spaces += 1
        feedback = 'Correct!'
        stims = setStims()
        fb = 1
      } else {
        if (num_spaces > 1) {
          num_spaces -= 1
        }
        errors += 1
        feedback = 'Incorrect!'
        stims = setStims()
      }
    jsPsych.data.addDataToLastTrial({feedback: fb})
    response = []
  },
  timing_post_trial: 500
}

var reverse_response_block = {
  type: 'poldrack-single-stim-button',
  stimulus: response_grid,
  button_class: 'submit_button',
  data: {exp_id: "spatial_span", trial_id: "response"},
  on_finish: function() {
  	jsPsych.data.addDataToLastTrial({"response": response, "sequence": curr_seq, "num_spaces": num_spaces, "condition": "reverse", feedback: fb})
      var fb = 0
      // staircase
      if (arraysEqual(response.reverse(),curr_seq)) {
        num_spaces += 1
        feedback = 'Correct!'
        stims = setStims()
        fb = 1
      } else {
        if (num_spaces > 1) {
          num_spaces -= 1
        }
        errors += 1
        feedback = 'Incorrect!'
        stims = setStims()
      }
      jsPsych.data.addDataToLastTrial({feedback: fb})
      response = []
  },
  timing_post_trial: 500
}

var feedback_block = {
    type: 'poldrack-single-stim',
    stimulus: getFeedback,
    data: {exp_id: "spatial_span", trial_id: "feedback"},
    is_html: true,
    choices: 'none', 
    timing_stim: 1000,
    timing_response: 1000,
    response_ends_trial: true
}

var forward_node = {
  timeline: [start_test_block, test_block, forward_response_block, feedback_block],
  loop_function: function(data) {
    if (errors < error_lim) {
      return true
    } else {
      errors = 0
      num_spaces = 3
      stims = setStims()
      return false
    }
  }
}

var reverse_node = {
  timeline: [start_test_block, test_block, reverse_response_block, feedback_block],
  loop_function: function(data) {
    if (errors < error_lim) {return true}
    else {return false}
  }
}

/* create experiment definition array */
var spatial_span_experiment = [];
spatial_span_experiment.push(welcome_block);
spatial_span_experiment.push(instructions_block);
spatial_span_experiment.push(forward_node)
spatial_span_experiment.push(start_reverse_block)
spatial_span_experiment.push(reverse_node)
spatial_span_experiment.push(end_block)
