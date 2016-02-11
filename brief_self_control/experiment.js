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
  text: '<div class = centerbox><p class = block-text>Welcome to this survey. Press <strong>enter</strong> to begin.</p></div>',
  cont_key: [13],
  data: {
    exp_id: "brief_self_control"
  }
};

var instructions_block = {
  type: 'poldrack-instructions',
  pages: [
    '<div class = centerbox><p class = block-text>For each of the following statements please indicate how much each of the following statements reflects how you typically are.</p></div>',
  ],
  allow_keys: false,
  show_clickable_nav: true,
  timing_post_trial: 1000,
  data: {
    exp_id: "brief_self_control"
  }
};

var opts = ["Not at all - 1", "2", "3", "4", "Very much - 5"]
var scale_reg = {"Not at all - 1": 1,"2": 2,"3": 3,"4": 4,"Very much - 5": 5}
var scale_rev = {"Not at all - 1": 5,"2": 4,"3": 3,"4": 2,"Very much - 5": 1}

var all_pages = [
  ["I am good at resisting temptation.", "I have a hard time breaking bad habits.", "I am lazy.",
    "I say inappropriate things.", "I do certain things that are bad for me, if they are fun.",
    "I refuse things that are bad for me.", "I wish I had more self-discipline.",
    "People would say that I have iron self- discipline.",
    "Pleasure and fun sometimes keep me from getting work done.", "I have trouble concentrating.",
    "I am able to work effectively toward long-term goals.",
    "Sometimes I can't stop myself from doing something, even if I know it is wrong.",
    "I often act without thinking through all the alternatives."
  ]
]

var all_options = [fillArray(opts, 13)]

var score_scale = [[scale_reg, scale_rev, scale_rev, scale_rev, scale_rev, scale_reg, scale_rev, scale_reg, scale_rev, scale_rev, scale_reg, scale_rev, scale_rev]]

var survey_block = {
  type: "poldrack-survey-multi-choice",
  exp_id: "brief_self_control",
  horizontal: true,
  preamble: '',
  pages: all_pages,
  options: all_options,
  scale: score_scale,
  show_clickable_nav: true,
  allow_backward: true,
  required: [fillArray(true, 13)]
};

var end_block = {
  type: 'text',
  text: '<div class = centerbox><p class = center-block-text>Congratulations for completing this task!</p><p class = center-block-text>Press <strong>enter</strong> to continue.</p></div>',
  cont_key: [13],
  data: {
    exp_id: "brief_self_control"
  }
};


//Set up experiment
var brief_self_control_experiment = []
brief_self_control_experiment.push(welcome_block);
brief_self_control_experiment.push(instructions_block);
brief_self_control_experiment.push(survey_block);
brief_self_control_experiment.push(end_block);