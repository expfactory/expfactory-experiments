/* ************************************ */
/* Define helper functions */
/* ************************************ */
function getDisplayElement () {
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
/* ************************************ */
/* Define experimental variables */
/* ************************************ */

/* ************************************ */
/* Set up jsPsych blocks */
/* ************************************ */

/* define static blocks */
var welcome_block = {
  type: 'text',
  text: '<div class = centerbox><p class = center-block-text>Welcome to the experiment. Press <strong>enter</strong> to begin.</p></div>',
  cont_key: [13]
};

var instructions_block = {
  type: 'instructions',
  pages: [
    '<div class = centerbox><p class = block-text>Read each item and, as honestly as you can, answer the questions: “How true is this of you?”<br><br> Press <strong>enter</strong> to begin.</p></div>',
  ],
  key_forward: 13,
  allow_backwards: false
};

var opts = ["Very untrue - 1", "2", "3", "4", "5", "6", "Very true - 7"]

var all_pages = [["Many opportunities await me in the future.","I expect that I will set many new goals in the future.","My future is filled with possibilities.","Most of my life lies ahead of me.","My future seems infinite to me.","I could do anything I want in the future.","There is plenty of time left in my life to make new plans.","I have the sense that time is running out.","There are only limited possibilities in my future.","As I get older, I begin to experience time as limited."]]

var all_options = [fillArray(opts, 10)]

var score_scale = {"Very untrue - 1":1, "2":2, "3":3, "4":4, "5":5, "6":6, "Very true - 7":7}

var survey_block = {
  type: "poldrack-survey-multi-choice",
  horizontal: true,
  preamble: '<p><strong>How true is this of you?</strong></p>',
  pages: all_pages,
  options: all_options,
  scale: score_scale,
  show_clickable_nav: true,
  allow_backward: true,
  required: [fillArray(true, 10)],
  reverse_score: [[false, false, false, false, false, false, false, false, false, false]],
};

var end_block = {
  type: 'text',
  timing_response: 60000,
  text: '<div class = centerbox><p class = center-block-text>Congratulations for completing this task!</p><p class = center-block-text>Press <strong>enter</strong> to continue.</p></div>',
  cont_key: [13]
};


//Set up experiment
var future_time_perspective_experiment = []
future_time_perspective_experiment.push(welcome_block);
future_time_perspective_experiment.push(instructions_block);
future_time_perspective_experiment.push(survey_block);
future_time_perspective_experiment.push(end_block);
