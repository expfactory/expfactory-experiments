
/* ************************************ */
/* Define helper functions */
/* ************************************ */

var randomDraw = function(lst) {
    var index = Math.floor(Math.random()*(lst.length))
    return lst[index]
}


var setStims = function() {
  curr_seq = ''
  stim_array = []
  time_array = []
  for (var i=0; i< num_digits; i++) {
    var num = randomDraw([0, 1, 2, 3, 4, 5, 6, 7, 8, 9])
    curr_seq += num.toString()
    stim_array.push('<div class = centerbox><div class = digit-span-text>' + num.toString() + '</div></div>')
    time_array.push(stim_time)
  }
  total_time = num_digits * (stim_time + gap_time)
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

var submit = function() {
  response = $('input:text').val()
  $("#SubmitButton").attr('disabled', true);
  var e = jQuery.Event("keydown");
    e.which = 36; // # Some key code value
    e.keyCode = 36
    $(document).trigger(e);
  var e = jQuery.Event("keyup");
    e.which = 36; // # Some key code value
    e.keyCode = 36
    $(document).trigger(e);
}

/* ************************************ */
/* Define experimental variables */
/* ************************************ */
var num_digits = 6
var num_trials = 10
var curr_seq = ''
var stim_time = 800
var gap_time = 200
var time_array = []
var total_time = 0
var errors = 0
var error_lim = 3
setStims()
var stim_array = getStims()

/* ************************************ */
/* Set up jsPsych blocks */
/* ************************************ */
/* define static blocks */
var welcome_block = {
  type: 'text',
  text: '<div class = centerbox><p class = block-text>Welcome to the digit span experiment. Press <strong>enter</strong> to begin.</p></div>',
  cont_key: 13,
  timing_post_trial: 0
};

var instructions_block = {
  type: 'instructions',
  pages: [
  '<div class = centerbox><p class = block-text>In this test you will have to try to remember a sequence of numbers that will appear on the screen one after the other.</p><p class = block-text>At the end of each trial, type all of the numbers into the keyboard in the sequence in which they occurred.</p><p class = block-text></p><p class = block-text>If you correctly remember all of the numbers then the next list of numbers will be one number longer.</p><p class = block-text>If you make a mistake then the next list of numbers will be one number shorter.</p><p class = block-text>After three errors, the test will end.</p></div>'
  ],
  allow_keys: false,
  show_clickable_nav: true,
  timing_post_trial: 1000
};

var end_block = {
  type: 'text',
  text: '<div class = centerbox><p class = center-block-text>Finished with this task.</p><p class = center-block-text>Press <strong>enter</strong> to continue.</p></div>',
  cont_key: 13,
  timing_post_trial: 0
};


var start_test_block = {
  type: 'text',
  text: '<div class = centerbox><p class = center-block-text>Starting a trial. Press <strong>enter</strong> to begin.</p></div>',
  cont_key: 13,
  timing_post_trial: 1000,
};


/* define test block */
var test_block = {
  type: 'multi-stim-multi-response',
  stimuli: getStims,
  is_html: true,
  timing_stim: getTimeArray,
  timing_gap: gap_time,
  choices: [['none']],
  data: {exp_id: "digit_span", trial_id: "test"},
  timing_response: getTotalTime,
  timing_post_trial: 0,
  on_finish: function() {
    jsPsych.data.addDataToLastTrial({"sequence": curr_seq, "num_digits": num_digits})
    setTimeout(function() {
        $("#input").focus()
    },10)
  }
}

var response_block = {
    type: 'single-stim',
    stimuli: '<div class = centerbox><form style="font-size: 24px">Enter Sequence: <br></br><input type ="text" id ="input" style="font-size: 24px"></form><br></br><button type="button" id = "SubmitButton" onclick = submit()>Submit Answer</button></div>',
    is_html: true,
    choices: 36, 
    response_ends_trial: true,
    data: {exp_id: "digit_span", trial_id: "response"},
    on_finish: function() {
      response = response.split(',').join('')
      response = response.split(' ').join('')
      var fb = 0
      // staircase
      if (response == curr_seq) {
        num_digits += 1
        feedback = 'Correct!'
        stims = setStims()
        fb = 1
      } else {
        num_digits -= 1
        errors += 1
        feedback = 'Incorrect!'
        stims = setStims()
      }
      jsPsych.data.addDataToLastTrial({"response": response, "sequence": curr_seq, "num_digits": num_digits, feedback: fb})
    }
}

var feedback_block = {
    type: 'single-stim',
    stimuli: getFeedback,
    data: {exp_id: "digit_span", trial_id: "feedback"},
    is_html: true,
    choices: 'none', 
    timing_stim: 1000,
    timing_response: 1000,
    response_ends_trial: true
}

var test_chunk = {
  chunk_type: 'while',
  timeline: [start_test_block, test_block, response_block, feedback_block],
  continue_function: function(data) {
    if (errors < error_lim) {return true}
    else {return false}
  }

}
/* create experiment definition array */
var digit_span_experiment = [];
digit_span_experiment.push(welcome_block);
digit_span_experiment.push(instructions_block);
digit_span_experiment.push(test_chunk)
digit_span_experiment.push(end_block)
