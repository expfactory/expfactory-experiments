
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
  cont_key: [13],
  data: {exp_id: "grit_scale"}
};

var instructions_block = {
  type: 'poldrack-instructions',
  pages: [
    '<div class = centerbox><p class = block-text>For each of the following statements, please indicate the descriptive they are of you.</p></div>',
  ],
  allow_keys: false,
  show_clickable_nav: true,
  timing_post_trial: 1000,
  data: {exp_id : "grit_scale"}
};

var opts = ["Not at all like me - 1", "2", "3", "4", "Very much like me - 5"]

var all_pages = [["I often set a goal but later choose to pursue a different one.","New ideas and projects sometimes distract me from previous ones.","I have been obsessed with a certain idea or project for a short time but later lost interest.","I have diﬂiculty maintaining my focus on projects that take more than a few months to complete.","I ﬁnish whatever I begin.","Setbacks don’t discourage me.","I am a hard worker.","I am diligent."]]

var all_options = [fillArray(opts, 8)]

var score_scale = {"Not at all like me - 1":1, "2":2, "3":3, "4":4, "Very much like me - 5":5}

var survey_block = {
  type: "poldrack-survey-multi-choice",
  exp_id: "grit_scale",
  horizontal: true,
  preamble: '',
  pages: all_pages,
  options: all_options,
  scale: score_scale,
  show_clickable_nav: true,
  allow_backward: true,
  required: [fillArray(true, 8)],
  reverse_score: [[false, false, false, true, false, false, false, false]],
};

var end_block = {
  type: 'text',
  timing_response: 60000,
  text: '<div class = centerbox><p class = center-block-text>Congratulations for completing this task!</p><p class = center-block-text>Press <strong>enter</strong> to continue.</p></div>',
  cont_key: [13],
  data: {exp_id : "grit_scale"}
};


//Set up experiment
var grit_scale_experiment = []
grit_scale_experiment.push(welcome_block);
grit_scale_experiment.push(instructions_block);
grit_scale_experiment.push(survey_block);
grit_scale_experiment.push(end_block);
