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
    exp_id: "impulsive_venture"
  }
};

var instructions_block = {
  type: 'poldrack-instructions',
  pages: [
    '<div class = centerbox><p class = block-text>Please answer each question by clicking "Yes" or "No" following the questions. There are no right or wrong answers, and no trick questions. Work quickly and do not think too long about the exact meaning of the question.</p></div>',
  ],
  allow_keys: false,
  show_clickable_nav: true,
  timing_post_trial: 1000,
  data: {
    exp_id: "impulsive_venture"
  }
};

var opts = ["Yes", "No"]
var scale_reg = {
  "Yes": 2,
  "No": 1
}
var scale_rev = {
  "Yes": 1,
  "No": 2
}

var all_pages = [
  ['Do you often buy things on impulse?',
    'Do you generally do and say things without stopping to think?',
    'Do you often get into a jam because you do things without thinking?',
    'Are you an impulsive person?', 'Do you usually think carefully before doing anything?',
    'Do you often do things on the spur of the moment?',
    'Do you mostly speak before thinking things out?',
    'Do you often get involved in things you later Wish you could get out of?',
    'Do you get so "carried away" by new and exciting ideas. that you never think of possible snags?',
    'Do you need to use a lot of self-control to keep out of trouble?',
    'Would you agree that almost everything enjoyable is illegal or immoral?',
    "Are you often surprised at people's reactions to what you do or say?",
    "Do you think an evening out is more successful if it is unplanned or arranged at the last moment?",
    "Do you usually work quickly, without bothering to check?",
    "Do you often change your interests?"
  ],
  ["Would you enjoy water skiing?",
    "Usually do you prefer to stick to brands you know are reliable to trying new ones on the chance of finding something better?",
    "Do you quite enjoy taking risks?", "Would you enjoy parachute jumping?",
    "Do you think hitch-hiking is too dangerous a way to travel?",
    "Do you like diving off the highboard?",
    "Do you welcome new and exciting experiences and sensations even if they are a little frightening and unconventional?",
    "Would you like to learn to fly an aeroplane?",
    "Do you find it hard to understand people who risk their necks climbing mountains?",
    "Do you sometimes like doing things that are a bit frightening?",
    "Generally do you prefer to enter cold sea water gradually, to diving or jumping straight in?",
    "Would you enjoy the sensation of skiing very fast down a high mountain slope?",
    "Would you like to go scuba diving?", "Would you enjoy fast driving?",
    "Would you like to go pot-holing?",
    "Would you be put off a job involving quite a bit of danger?"
  ]
]

var all_options = [fillArray(opts, 19), fillArray(opts, 16)]

//higher = more impulsive
var score_scale = [
    [scale_reg, scale_reg, scale_reg, scale_reg, scale_rev, scale_reg, scale_reg, scale_reg, scale_reg, scale_reg, scale_reg, scale_reg, scale_reg,
      scale_reg, scale_reg, scale_rev, scale_rev, scale_reg, scale_reg
    ],
    [scale_reg, scale_rev, scale_reg, scale_reg, scale_rev, scale_reg, scale_reg, scale_reg, scale_rev, scale_reg, scale_rev, scale_reg, scale_reg,
      scale_reg, scale_reg, scale_rev
    ]
  ]

var survey_block = {
  type: "poldrack-survey-multi-choice",
  exp_id: "impulsive_venture",
  horizontal: true,
  preamble: '',
  pages: all_pages,
  options: all_options,
  scale: score_scale,
  show_clickable_nav: true,
  allow_backward: true,
  required: [fillArray(true, 19), fillArray(true, 16)]
};

var end_block = {
  type: 'text',
  text: '<div class = centerbox><p class = center-block-text>Congratulations for completing this task!</p><p class = center-block-text>Press <strong>enter</strong> to continue.</p></div>',
  cont_key: [13],
  data: {
    exp_id: "impulsive_venture"
  }
};


//Set up experiment
var impulsive_venture_experiment = []
impulsive_venture_experiment.push(welcome_block);
impulsive_venture_experiment.push(instructions_block);
impulsive_venture_experiment.push(survey_block);
impulsive_venture_experiment.push(end_block);