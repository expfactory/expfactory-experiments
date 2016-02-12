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

/* ************************************ */
/* Define experimental variables */
/* ************************************ */

/* ************************************ */
/* Set up jsPsych blocks */
/* ************************************ */

/* define static blocks */

var welcome_block = {
  type: 'text',
  text: '<div class = centerbox><p class = center-block-text>Welcome to this survey.<br><br> Press <strong>enter</strong> to begin.</p></div>',
  cont_key: [13],
  data: {
    exp_id: "mpq_control"
  }
};

var instructions_block = {
  type: 'poldrack-instructions',
  pages: [
    '<div class = centerbox><p class = block-text>Please answer each question by clicking "True" or "False" following the questions to indicate whether they are descriptive of you and your actions. There are no right or wrong answers, and no trick questions.</p></div>',
  ],
  allow_keys: false,
  show_clickable_nav: true,
  timing_post_trial: 1000,
  data: {
    exp_id: "mpq_control"
  }
};

var opts = ["True", "False"]

var all_pages = [
  ["Stop one activity before completing it.", "Take time to consider all aspects.",
    "Think before doing.", "Stop and think.", "Fast and careless.", "Never reckless.",
    "Buy something without thinking.", "Value rational approach."
  ],
  ["Spur of the moment.", "Careful reasoning.", "Not as cautious.", "Cautious person.",
    "Spontaneous person.", "Do first thing that comes to mind.", "Close track of money.",
    "Play things by ear."
  ],
  ["Know how to proceed.", "Very level-headed.", "Organize my work.", "Often start projects.",
    "I am methodical.", "Not have detailed plans.", "Have a good idea of what I'm going to do.",
    "Like to find out what to expect."
  ]
]

var all_options = [fillArray(opts, 8), fillArray(opts, 8), fillArray(opts, 8)]

//higher - more impulsiveness
var score_scale = {
  "True": 2,
  "False": 1
}

var survey_block = {
  type: "poldrack-survey-multi-choice",
  exp_id: "mpq_control",
  horizontal: true,
  preamble: 'Is it true or false that you generally...',
  pages: all_pages,
  options: all_options,
  scale: score_scale,
  show_clickable_nav: true,
  allow_backward: true,
  required: [fillArray(true, 8), fillArray(true, 8), fillArray(true, 8)],
  reverse_score: [
    [false, true, true, true, false, true, false, true],
    [false, true, false, true, false, false, true, false],
    [true, true, true, false, true, false, true, true]
  ],
};

var end_block = {
  type: 'text',
  text: '<div class = centerbox><p class = center-block-text>Congratulations for completing this task!</p><p class = center-block-text>Press <strong>enter</strong> to continue.</p></div>',
  cont_key: [13],
  data: {
    exp_id: "mpq_control"
  }
};


//Set up experiment
var mpq_control_experiment = []
mpq_control_experiment.push(welcome_block);
mpq_control_experiment.push(instructions_block);
mpq_control_experiment.push(survey_block);
mpq_control_experiment.push(end_block);