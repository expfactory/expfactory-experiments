
/* ************************************ */
/* Define helper functions */
/* ************************************ */
function getDisplayElement () {
    $('<div class = display_stage_background></div>').appendTo('body')
    return $('<div class = display_stage></div>').appendTo('body')
}

function fillArray(value, len) {
  if (len == 0) return [];
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
  text: '<div class = centerbox><p class = block-text>Welcome to this survey. Press <strong>enter</strong> to begin.</p></div>',
  cont_key: [13]
};

var instructions_block = {
  type: 'instructions',
  pages: [
    '<div class = centerbox><p class = block-text>Please indicate to what degree you agree with each of the following statements.<br><br> Press <strong>enter</strong> to begin.</p></div>',
  ],
  key_forward: 13,
  allow_backwards: false
};

var opts = ["Strongly disagree", "Mostly disagree", "Somewhat disagree", "Neither agree or disagree", "Somewhat agree", "Mostly agree", "Strongly agree"]

var all_pages = [["I control my emotions by changing the way I think about the situation I am in.","When I want to feel less negative emotion, I change the way I am thinking about the situation.","When I want to feel more positive emotion, I change the way I am thinking about the situation.","When I want to feel more positive emotion (such as joy or amusement), I change what I am thinking about.","When I want to feel less negative emotion (such as sadness or anger), I change what I am thinking about.","When I am faced with a stressful situation, I make myself think about it in a way that helps me stay calm.","I control my emotions by not expressing them.","When I am feeling negative emotions, I make sure not to express them.","I keep my emotions to myself.","When I am feeling positive emotions, I am careful not to express them."]]

var all_options = [fillArray(opts, 10)]

var score_scale = {"Strongly disagree": 1, "Mostly disagree":2, "Somewhat disagree":3, "Neither agree or disagree":4, "Somewhat agree":5, "Mostly agree":6, "Strongly agree":7}

var survey_block = {
  type: "poldrack-survey-multi-choice",
  horizontal: true,
  preamble: '',
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
  text: '<div class = centerbox><p class = center-block-text>Congratulations for completing this task!</p><p class = center-block-text>Press <strong>enter</strong> to continue.</p></div>',
  cont_key: [13]
};


//Set up experiment
var erq_experiment = []
erq_experiment.push(welcome_block);
erq_experiment.push(instructions_block);
erq_experiment.push(survey_block);
erq_experiment.push(end_block);