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
    exp_id: "mindful_attention_awareness"
  }
};

var instructions_block = {
  type: 'poldrack-instructions',
  pages: [
    '<div class = centerbox><p class = block-text>Please answer the following questions on your tendency to bring your complete attention to experiences occuring in the present moment.</p></div>',
  ],
  allow_keys: false,
  show_clickable_nav: true,
  timing_post_trial: 1000,
  data: {
    exp_id: "mindful_attention_awareness"
  }
};

var opts = ["almost always", "very frequently", "somewhat frequently", "somewhat infrequently",
  "very infrequently", "almost never"
]

var all_pages = [
  ["I could be experiencing some emotion and not be conscious of it until some time later.",
    "I break or spill things because of carelessness, not paying attention, or thinking of something else.",
    "I find it difficult to stay focused on what’s happening in the present.",
    "I tend to walk quickly to get where I’m going without paying attention to what I experience along the way.",
    "I tend not to notice feelings of physical tension or discomfort until they really grab my attention."
  ],
  ["I forget a person’s name almost as soon as I’ve been told it for the first time.",
    "It seems I am “running on automatic” without much awareness of what I’m doing.",
    "I rush through activities without being really attentive to them.",
    "I get so focused on the goal I want to achieve that I lose touch with what I am doing right now to get there.",
    "I do jobs or tasks automatically, without being aware of what I’m doing."
  ],
  ["I find myself listening to someone with one ear, doing something else at the same time.",
    "I drive places on “automatic pilot” and then wonder why I went there.",
    "I find myself preoccupied with the future or the past.",
    "I find myself doing things without paying attention.",
    "I snack without being aware that I’m eating."
  ]
]

var all_options = [fillArray(opts, 5), fillArray(opts, 5), fillArray(opts, 5)]

//higher - more impulsiveness
var score_scale = {
  "almost always": 1,
  "very frequently": 2,
  "somewhat frequently": 3,
  "somewhat infrequently": 4,
  "very infrequently": 5,
  "almost never": 6
}

var survey_block = {
  type: "poldrack-survey-multi-choice",
  exp_id: "mindful_attention_awareness",
  horizontal: true,
  preamble: '',
  pages: all_pages,
  options: all_options,
  scale: score_scale,
  show_clickable_nav: true,
  allow_backward: true,
  required: [fillArray(true, 5), fillArray(true, 5), fillArray(true, 5)],
  reverse_score: [
    [false, false, false, false, false],
    [false, false, false, false, false],
    [false, false, false, false, false]
  ],
};

var end_block = {
  type: 'text',
  text: '<div class = centerbox><p class = center-block-text>Congratulations for completing this task!</p><p class = center-block-text>Press <strong>enter</strong> to continue.</p></div>',
  cont_key: [13],
  data: {
    exp_id: "mindful_attention_awareness"
  }
};


//Set up experiment
var mindful_attention_awareness_experiment = []
mindful_attention_awareness_experiment.push(welcome_block);
mindful_attention_awareness_experiment.push(instructions_block);
mindful_attention_awareness_experiment.push(survey_block);
mindful_attention_awareness_experiment.push(end_block);