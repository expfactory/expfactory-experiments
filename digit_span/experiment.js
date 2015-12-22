
/* ************************************ */
/* Define helper functions */
/* ************************************ */

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
  stim_array = []
  time_array = []
  for (var i=0; i< num_digits; i++) {
    var num = Math.floor(Math.random()*9)+1
    curr_seq.push(num)
    stim_array.push('<div class = centerbox><div class = digit-span-text>' + num.toString() + '</div></div>')
    time_array.push(stim_time)
  }
  total_time = num_digits * (stim_time + gap_time)
}

var getTestText = function() {
 return  '<div class = centerbox><div class = center-text>' + num_digits + ' Digits</p></div>'
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
  response.push(Number($(elm).text()))
}

var clearResponse = function() {
  response = []
}

/* ************************************ */
/* Define experimental variables */
/* ************************************ */
var num_digits = 5
var num_trials = 10
var curr_seq = []
var stim_time = 800
var gap_time = 200
var time_array = []
var total_time = 0
var errors = 0
var error_lim = 3
var response = []
setStims()
var stim_array = getStims()

var response_grid = 
    '<div class = numbox>' +
    '<button id = button_1 class = "square num-button" onclick = "recordClick(this)"><div class = content><div class = numbers>1</div></div></button>' +
    '<button id = button_2 class = "square num-button" onclick = "recordClick(this)"><div class = content><div class = numbers>2</div></div></button>' +
    '<button id = button_3 class = "square num-button" onclick = "recordClick(this)"><div class = content><div class = numbers>3</div></div></button>' +
    '<button id = button_4 class = "square num-button" onclick = "recordClick(this)"><div class = content><div class = numbers>4</div></div></button>' +
    '<button id = button_5 class = "square num-button" onclick = "recordClick(this)"><div class = content><div class = numbers>5</div></div></button>' +
    '<button id = button_6 class = "square num-button" onclick = "recordClick(this)"><div class = content><div class = numbers>6</div></div></button>' +
    '<button id = button_7 class = "square num-button" onclick = "recordClick(this)"><div class = content><div class = numbers>7</div></div></button>' +
    '<button id = button_8 class = "square num-button" onclick = "recordClick(this)"><div class = content><div class = numbers>8</div></div></button>' +
    '<button id = button_9 class = "square num-button" onclick = "recordClick(this)"><div class = content><div class = numbers>9</div></div></button>' +
    '<button class = clear_button id = "ClearButton" onclick = "clearResponse">Clear</button>' +
    '<button class = submit_button id = "SubmitButton">Submit Answer</button></div>'

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
  '<div class = centerbox><p class = block-text>In this test you will have to try to remember a sequence of numbers that will appear on the screen one after the other. At the end of each trial, enter all the numbers into the presented numpad in the sequence in which they occurred.</p><p class = block-text></p><p class = block-text>If you correctly remember all of the numbers then the next list of numbers will be one number longer. If you make a mistake then the next list of numbers will be one number shorter.</p><p class = block-text>After three errors, the test will end. Trials will start after you end instructions.</p></div>'
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
  type: 'single-stim',
  is_html: true,
  stimuli: getTestText,
  choices: 'none',
  timing_stim: 1000,
  timing_response: 1000,
  response_ends_trial: false,
  timing_post_trial: 1000
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
  }
}


var response_block = {
  type: 'single-stim-button',
  stimuli: response_grid,
  button_class: 'submit_button',
  on_finish: function() {
      var fb = 0
      // staircase
      if (arraysEqual(response,curr_seq)) {
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
    response = []
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
