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
  text: '<div class = centerbox><p class = center-block-text>Welcome to this survey. Press <strong>enter</strong> to begin.</p></div>',
  cont_key: [13],
  data: {
    exp_id: "self_regulation"
  }
};

var instructions_block = {
  type: 'poldrack-instructions',
  pages: [
    '<div class = centerbox><p class = block-text>Each item of this questionnaire is a statement that a person may either agree with or disagree with.  For each item, indicate how much you agree or disagree with what the item says.  Please respond to all the items; do not leave any blank.  Choose only one response to each statement.  Please be as accurate and honest as you can be.  Respond to each item as if it were the only item.  That is, do not worry about being "consistent" in your responses.</p></div>',
  ],
  allow_keys: false,
  show_clickable_nav: true,
  timing_post_trial: 1000,
  data: {
    exp_id: "self_regulation"
  }
};

var opts = ["Strongly disagree", "Somewhat disagree", "Neutral", "Somewhat agree", "Strongly agree"]

var all_pages = [
  ["I don't notice the effects of my actions until it's too late.", "I put off making decision.",
    "It's hard for me to notice when I've 'had enough' (alcohol, food, sweets).",
    "I have trouble following through with things once I've made up my mind to do something.",
    "I don't seem to learn from my mistakes.",
    "I usually only have to make a mistake one time in order to learn from it.",
    "I can usually find several different possibilities when I want to change something.",
    "Often I don't notice what I'm doing until someone calls it to my attention.",
    "I usually think before I act.", "I learn from my mistakes.", "I give up quickly."
  ],
  ["I usually keep track of my progress toward my goals.",
    "I am able to accomplish goals for myself.",
    "I have personal standards, and try to live up to them.",
    "As soon as I see a problem or challenge, I start looking for possible solutions.",
    "I have a hard time setting goals for myself.",
    "When I'm trying to change something, I pay a lot of attention to how I'm doing.",
    "I have trouble making plans to help me reach my goals.",
    "I set goals for myself and keep track of my progress.",
    "If I make a resolution to change something, I pay a lot of attention to how I'm doing.",
    "I know how I want to be."
  ],
  ["I have trouble making up my mind about things.", "I get easily distracted from my plans.",
    "When it comes to deciding about a change, I feel overwhelmed by the choices.",
    "Most of the time don't pay attention to what I'm doing.",
    "I tend to keep doing the same thing, even when it doesn't work.",
    "Once I have a goal, I can usually plan how to reach it.",
    "If I wanted to change, I am confident that I could do it.",
    "I can stick to a plan that's working well.", "I have a lot of willpower.",
    "I am able to resist temptation."
  ]
]

var all_options = [fillArray(opts, 11), fillArray(opts, 10), fillArray(opts, 10)]

var score_scale = {
  "Strongly disagree": 1,
  "Somewhat disagree": 2,
  "Neutral": 3,
  "Somewhat agree": 4,
  "Strongly agree": 5
}

var survey_block = {
  type: "poldrack-survey-multi-choice",
  exp_id: "self_regulation",
  horizontal: true,
  preamble: '',
  pages: all_pages,
  options: all_options,
  scale: score_scale,
  show_clickable_nav: true,
  allow_backward: true,
  required: [fillArray(true, 11), fillArray(true, 10), fillArray(true, 10)],
  //no instructions on reverse scoring. judging by the factor scores using raw scores
  reverse_score: [
    [false, false, false, false, false, false, false, false, false, false, false],
    [false, false, false, false, false, false, false, false, false, false],
    [false, false, false, false, false, false, false, false, false, false]
  ],
};

var end_block = {
  type: 'text',
  text: '<div class = centerbox><p class = center-block-text>Congratulations for completing this task!</p><p class = center-block-text>Press <strong>enter</strong> to continue.</p></div>',
  cont_key: [13],
  data: {
    exp_id: "self_regulation"
  }
};


//Set up experiment
var self_regulation_experiment = []
self_regulation_experiment.push(welcome_block);
self_regulation_experiment.push(instructions_block);
self_regulation_experiment.push(survey_block);
self_regulation_experiment.push(end_block);