/* ************************************ */
/* Define helper functions */
/* ************************************ */
function getDisplayElement() {
  $('<div class = display_stage_background></div>').appendTo('body')
  return $('<div class = display_stage></div>').appendTo('body')
}

function fillArray(value, len) {
  if (len === 0) return [];
  var a = [value];
  while (a.length * 2 <= len) a = a.concat(a);
  if (a.length < len) a = a.concat(a.slice(0, len - a.length));
  return a;
}

var getInstructFeedback = function() {
  return '<div class = centerbox><p class = center-block-text>' + feedback_instruct_text +
    '</p></div>'
}

var getPracticeInstruct = function() {
  return '<div class = centerbox><p class = center-block-text>' + practice_feedback_text +
    '</p></div>'
}

/* ************************************ */
/* Define experimental variables */
/* ************************************ */
var run_attention_checks = true
var attention_check_thresh = 0.65
var sumInstructTime = 0 //ms
var instructTimeThresh = 0 ///in seconds

var path = '/static/experiments/ravens/images/'
var prefix = '<div><img src = "'
var bottom_id = '" id="bottom_img'
var postfix = '"</img></div>'
var top_img = ['top_1.jpg', 'top_2.jpg', 'top_3.jpg', 'top_4.jpg', 'top_5.jpg', 'top_6.jpg',
  'top_7.jpg', 'top_8.jpg', 'top_9.jpg', 'top_10.jpg', 'top_11.jpg', 'top_12.jpg', 'top_13.jpg',
  'top_14.jpg', 'top_15.jpg', 'top_16.jpg', 'top_17.jpg', 'top_18.jpg'
]
var bottom_img = ['bottom_1.jpg', 'bottom_2.jpg', 'bottom_3.jpg', 'bottom_4.jpg', 'bottom_5.jpg',
  'bottom_6.jpg', 'bottom_7.jpg', 'bottom_8.jpg', 'bottom_9.jpg', 'bottom_10.jpg',
  'bottom_11.jpg', 'bottom_12.jpg', 'bottom_13.jpg', 'bottom_14.jpg', 'bottom_15.jpg',
  'bottom_16.jpg', 'bottom_17.jpg', 'bottom_18.jpg'
]
var practice_tries = 0
var practice_thresh = 5

var all_pages = []

for (var i = 0; i < top_img.length; i++) {
  var page = []
  page.push(prefix + path + top_img[i] + postfix + prefix + path + bottom_img[i] + bottom_id +
    postfix)
  all_pages.push(page)
}

var opts = ["A", "B", "C", "D", "E", "F", "G", "H"]

var all_options = fillArray([opts], 18)

var scale_q1 = {
  "A": 0,
  "B": 1,
  "C": 0,
  "D": 0,
  "E": 0,
  "F": 0,
  "G": 0,
  "H": 0
}
var scale_q2 = {
  "A": 0,
  "B": 0,
  "C": 0,
  "D": 0,
  "E": 1,
  "F": 0,
  "G": 0,
  "H": 0
}
var scale_q3 = {
  "A": 0,
  "B": 0,
  "C": 0,
  "D": 0,
  "E": 0,
  "F": 0,
  "G": 1,
  "H": 0
}
var scale_q4 = {
  "A": 0,
  "B": 1,
  "C": 0,
  "D": 0,
  "E": 0,
  "F": 0,
  "G": 0,
  "H": 0
}
var scale_q5 = {
  "A": 0,
  "B": 0,
  "C": 1,
  "D": 0,
  "E": 0,
  "F": 0,
  "G": 0,
  "H": 0
}
var scale_q6 = {
  "A": 0,
  "B": 1,
  "C": 0,
  "D": 0,
  "E": 0,
  "F": 0,
  "G": 0,
  "H": 0
}
var scale_q7 = {
  "A": 0,
  "B": 0,
  "C": 0,
  "D": 0,
  "E": 1,
  "F": 0,
  "G": 0,
  "H": 0
}
var scale_q8 = {
  "A": 0,
  "B": 1,
  "C": 0,
  "D": 0,
  "E": 0,
  "F": 0,
  "G": 0,
  "H": 0
}
var scale_q9 = {
  "A": 0,
  "B": 1,
  "C": 0,
  "D": 0,
  "E": 0,
  "F": 0,
  "G": 0,
  "H": 0
}
var scale_q10 = {
  "A": 0,
  "B": 0,
  "C": 0,
  "D": 0,
  "E": 1,
  "F": 0,
  "G": 0,
  "H": 0
}
var scale_q11 = {
  "A": 1,
  "B": 0,
  "C": 0,
  "D": 0,
  "E": 0,
  "F": 0,
  "G": 0,
  "H": 0
}
var scale_q12 = {
  "A": 0,
  "B": 0,
  "C": 0,
  "D": 0,
  "E": 1,
  "F": 0,
  "G": 0,
  "H": 0
}
var scale_q13 = {
  "A": 1,
  "B": 0,
  "C": 0,
  "D": 0,
  "E": 0,
  "F": 0,
  "G": 0,
  "H": 0
}
var scale_q14 = {
  "A": 0,
  "B": 0,
  "C": 1,
  "D": 0,
  "E": 0,
  "F": 0,
  "G": 0,
  "H": 0
}
var scale_q15 = {
  "A": 0,
  "B": 1,
  "C": 0,
  "D": 0,
  "E": 0,
  "F": 0,
  "G": 0,
  "H": 0
}
var scale_q16 = {
  "A": 0,
  "B": 0,
  "C": 0,
  "D": 0,
  "E": 1,
  "F": 0,
  "G": 0,
  "H": 0
}
var scale_q17 = {
  "A": 0,
  "B": 0,
  "C": 0,
  "D": 0,
  "E": 0,
  "F": 1,
  "G": 0,
  "H": 0
}
var scale_q18 = {
  "A": 0,
  "B": 0,
  "C": 0,
  "D": 1,
  "E": 0,
  "F": 0,
  "G": 0,
  "H": 0
}

var score_scale = [
  [scale_q1],
  [scale_q2],
  [scale_q3],
  [scale_q4],
  [scale_q5],
  [scale_q6],
  [scale_q7],
  [scale_q8],
  [scale_q9],
  [scale_q10],
  [scale_q11],
  [scale_q12],
  [scale_q13],
  [scale_q14],
  [scale_q15],
  [scale_q16],
  [scale_q17],
  [scale_q18]
]
/* ************************************ */
/* Set up jsPsych blocks */
/* ************************************ */

/* define static blocks */

var feedback_instruct_text =
  'Welcome to this survey.<br><br> Press <strong>enter</strong> to begin.'
var feedback_instruct_block = {
  type: 'poldrack-text',
  cont_key: [13],
  text: getInstructFeedback,
  timing_post_trial: 0,
  timing_response: 180000,
  data: {
    exp_id: "ravens"
  }
};
/// This ensures that the subject does not read through the instructions too quickly.  If they do it too quickly, then we will go over the loop again.
var instructions_block = {
  type: 'poldrack-instructions',
  pages: [
    '<div class = centerbox><p class = block-text>This is a test of observation and clear thinking with 18 problems. The top part of each problem is a pattern with one part cut out of it. Your task is to look at the pattern, think of what the missing part must look like to complete the pattern correctly, both along the rows and the columns, and then find the right piece out of the eight shown. Only one of the answer choices is perfectly correct.<br><br>The following page will have an example trial.</p></div>',
    '<div class = centerbox><p class = block-text><strong>Look at the top part (the pattern) of this sample problem.</strong> Notice that going across the rows, the number of horizontal lines is equal. Going down the columns, the number of squares is equal.<div class="sample_img"><img src = "/static/experiments/ravens/images/practice/sample_matrix_top.jpg"</img></div><p class= "block-text"><strong>Look at the solution of this sample problem.</strong> The best completion of the missing cell is the alternative "E" which is selected below.</p><div class="sample_img"><img src = "/static/experiments/ravens/images/practice/sample_matrix_bottom.jpg" id="bottom_img"</img></div><div class="sample_img"><img src = "/static/experiments/ravens/images/practice/Opt_E_selected.png"</img></div></p></div>',
    '<div class = centerbox><p class = center-block-text>You will now complete two practice trials with feedback. The test trials will not include feedback.</p></div>'
  ],
  allow_keys: false,
  show_clickable_nav: true,
  timing_post_trial: 1000,
  data: {
    exp_id: "ravens"
  }
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



var practice_feedback_text =
  'Starting with first example trial.  Press <strong> Enter </strong> to continue.'
var practice_feedback_block = {
  type: 'poldrack-text',
  cont_key: [13],
  text: getPracticeInstruct,
  timing_post_trial: 0,
  timing_response: 180000,
  data: {
    exp_id: "ravens",
    exp_stage: 'practice',
    trial_id: 'feedback'
  }
};

var practice_trials_1 = []
var practice_block_1 = {
  type: "poldrack-survey-multi-choice",
  exp_id: "ravens",
  horizontal: true,
  preamble: '',
  pages: [
    [
      '<div><img src = "/static/experiments/ravens/images/practice/practice_top_1.jpg"</img></div><div><img src = "/static/experiments/ravens/images/practice/practice_bottom_1.jpg" id="bottom_img"</img></div>'
    ]
  ],
  options: [
    [
      ["A", "B", "C", "D", "E", "F", "G", "H"]
    ]
  ],
  scale: [
    [{
      "A": 0,
      "B": 0,
      "C": 1,
      "D": 0,
      "E": 0,
      "F": 0,
      "G": 0,
      "H": 0
    }]
  ],
  show_clickable_nav: true,
  allow_backward: true,
  required: [
    [
      [true]
    ]
  ],
};


var practice_node_1 = {
  timeline: [practice_feedback_block, practice_block_1],
  /* This function defines stopping criteria */
  loop_function: function(data) {
    practice_tries += 1
    //here it should check if the answer to the question is correct
    for (var i = 0; i < data.length; i++) {
      if ((data[i].trial_type == 'poldrack-survey-multi-choice') && (data[i].score_response !=
          1)) {
        practice_feedback_text = 'That is incorrect. Please press <strong>Enter</strong> to try again.'
        return true
      } else if ((data[i].trial_type == 'poldrack-survey-multi-choice') && (data[i].score_response ==
          1)) {
        practice_tries = 0
        practice_feedback_text = 'That is correct. Please press <strong>Enter</strong> to continue.'
        return false
      } else if (practice_tries > practice_thresh) {
        practice_tries = 0
        practice_feedback_text = "That is incorrect, but we'll move on. Please press <strong>Enter</strong> to continue."
        return false
      }
    }
  }
}

var practice_trials_2 = []
var practice_block_2 = {
  type: "poldrack-survey-multi-choice",
  exp_id: "ravens",
  horizontal: true,
  preamble: '',
  pages: [
    [
      '<div><img src = "/static/experiments/ravens/images/practice/practice_top_2.jpg"</img></div><div><img src = "/static/experiments/ravens/images/practice/practice_bottom_2.jpg" id="bottom_img"</img></div>'
    ]
  ],
  options: [
    [
      ["A", "B", "C", "D", "E", "F", "G", "H"]
    ]
  ],
  scale: [
    [{
      "A": 0,
      "B": 0,
      "C": 0,
      "D": 0,
      "E": 0,
      "F": 1,
      "G": 0,
      "H": 0
    }]
  ],
  show_clickable_nav: true,
  allow_backward: true,
  required: [
    [
      [true]
    ]
  ],
};


var practice_node_2 = {
  timeline: [practice_feedback_block, practice_block_2],
  /* This function defines stopping criteria */
  loop_function: function(data) {
    practice_tries += 1
    //here it should check if the answer to the question is correct
    for (var i = 0; i < data.length; i++) {
      if ((data[i].trial_type == 'poldrack-survey-multi-choice') && (data[i].score_response !=
          1)) {
        practice_feedback_text = 'That is incorrect. Please press <strong>Enter</strong> to try again.'
        return true
      } else if ((data[i].trial_type == 'poldrack-survey-multi-choice') && (data[i].score_response ==
          1)) {
        practice_feedback_text = 'That is correct. Please press <strong>Enter</strong> to continue.'
        practice_tries = 0
        return false
      } else if (practice_tries > practice_thresh) {
        practice_feedback_text = "That is incorrect, but we'll move on. Please press <strong>Enter</strong> to continue."
        practice_tries = 0
        return false
      }
    }
  }
}

var start_test_block = {
  type: 'poldrack-text',
  cont_key: [13],
  text: '<div class = centerbox><p class = center-block-text>You are now ready to begin the test trials.<br><br>Press <strong> Enter </strong> to continue.</p></div>',
  timing_post_trial: 0,
  timing_response: 180000,
  data: {
    exp_id: "ravens"
  }
};

var survey_block = {
  type: "poldrack-survey-multi-choice",
  exp_id: "ravens",
  horizontal: true,
  preamble: '',
  pages: all_pages,
  options: all_options,
  scale: score_scale,
  show_clickable_nav: true,
  allow_backward: true,
  required: fillArray([true], 18),
};

var end_block = {
  type: 'text',
  text: '<div class = centerbox><p class = center-block-text>Congratulations for completing this task!</p><p class = center-block-text>Press <strong>enter</strong> to continue.</p></div>',
  cont_key: [13],
  data: {
    exp_id: "ravens"
  }
};


//Set up experiment
var ravens_experiment = []
ravens_experiment.push(instruction_node);
ravens_experiment.push(practice_node_1);
ravens_experiment.push(practice_feedback_block)
ravens_experiment.push(practice_node_2);
ravens_experiment.push(practice_feedback_block)
ravens_experiment.push(start_test_block);
ravens_experiment.push(survey_block);
ravens_experiment.push(end_block);