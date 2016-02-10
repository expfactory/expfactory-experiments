/*
reference: https://sites.google.com/a/decisionsciences.columbia.edu/dospert/
Blais, A-R. and E. U. Weber. 2006. “A Domain-specific Risk-taking (DOSPERT) Scale for Adult Populations.” Judgment and Decision Making, 1, 33-47.
*/

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
  text: '<div class = centerbox><p class = center-block-text>Welcome to the experiment. Press <strong>enter</strong> to begin.</p></div>',
  cont_key: [13],
  data: {
    exp_id: "dospert_rt"
  }
};

var instructions_block = {
  type: 'poldrack-instructions',
  pages: [
    '<div class = centerbox><p class = block-text>For each of the following statements, please indicate the <strong>likelihood</strong> that you would engage in the described activity or behavior if you were to find yourself in that situation.<br><br> Press <strong>enter</strong> to begin.</p></div>',
  ],
  allow_keys: false,
  show_clickable_nav: true,
  timing_post_trial: 1000,
  data: {
    exp_id: "dospert_rt"
  }
};

var opts = ["Extremely Unlikely", "Moderately Unlikely", "Somewhat Unlikely", "Not Sure",
  "Somewhat Likely", "Moderately Likely", "Extremely Likely"
]

var all_pages = [
  ["Admitting that your tastes are different from those of a friend.",
    "Going camping in the wilderness.", "Betting a day's income at the horse races.",
    "Investing 10% of your annual income in a moderate growth diversified fund.",
    "Drinking heavily at a social function.",
    "Taking some questionable deductions on your income tax return."
  ],
  ["Disagreeing with an authority figure on a major issue.",
    "Betting a day's income at a high-stake poker game.",
    "Having an affair with a married man/woman.", "Passing off somebody else’s work as your own.",
    "Going down a ski run that is beyond your ability.",
    "Investing 5% of your annual income in a very speculative stock."
  ],
  ["Going whitewater rafting at high water in the spring.",
    "Betting a day's income on the outcome of a sporting event.", "Engaging in unprotected sex.",
    "Revealing a friend's secret to someone else.", "Driving a car without wearing a seat belt.",
    "Investing 10% of your annual income in a new business venture."
  ],
  ["Taking a skydiving class.", "Riding a motorcycle without a helmet.",
    "Choosing a career that you truly enjoy over a more secure one.",
    "Speaking your mind about an unpopular issue in a meeting at work.",
    "Sunbathing without sunscreen.", "Bungee jumping off a tall bridge."
  ],
  ["Piloting a small plane.", "Walking home alone at night in an unsafe area of town.",
    "Moving to a city far away from your extended family.",
    "Starting a new career in your mid-thirties.",
    "Leaving your young children alone at home while running an errand.",
    "Not returning a wallet you found that contains $200."
  ]
]

var all_options = [fillArray(opts, 6), fillArray(opts, 6), fillArray(opts, 6), fillArray(opts, 6),
  fillArray(opts, 6)
]

var score_scale = {
  "Extremely Unlikely": 1,
  "Moderately Unlikely": 2,
  "Somewhat Unlikely": 3,
  "Not Sure": 4,
  "Somewhat Likely": 5,
  "Moderately Likely": 6,
  "Extremely Likely": 7
}

var survey_block = {
  type: "poldrack-survey-multi-choice",
  exp_id: "dospert_rt",
  horizontal: true,
  preamble: '<p><strong>Please indicate the likelihood that you would engage in the described activity or behavior if you were to find yourself in that situation.</strong></p>',
  pages: all_pages,
  options: all_options,
  scale: score_scale,
  show_clickable_nav: true,
  allow_backward: true,
  required: [fillArray(true, 6), fillArray(true, 6), fillArray(true, 6), fillArray(true, 6),
    fillArray(true, 6)
  ],
  reverse_score: [
    [false, false, false, false, false, false],
    [false, false, false, false, false, false],
    [false, false, false, false, false, false],
    [false, false, false, false, false, false],
    [false, false, false, false, false, false]
  ],
};

var end_block = {
  type: 'text',
  timing_response: 180000,
  text: '<div class = centerbox><p class = center-block-text>Congratulations for completing this task!</p><p class = center-block-text>Press <strong>enter</strong> to continue.</p></div>',
  cont_key: [13],
  data: {
    exp_id: "dospert_rt"
  }
};


//Set up experiment
var dospert_rt_experiment = []
dospert_rt_experiment.push(welcome_block);
dospert_rt_experiment.push(instructions_block);
dospert_rt_experiment.push(survey_block);
dospert_rt_experiment.push(end_block);