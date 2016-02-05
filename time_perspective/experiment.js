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
    exp_id: "time_perspective"
  }
};

var instructions_block = {
  type: 'poldrack-instructions',
  pages: [
    '<div class = centerbox><p class = block-text>Please reach each item and answer the following question as honestly as you can: "How characteristic or true is this of you?"</p></div>',
  ],
  allow_keys: false,
  show_clickable_nav: true,
  timing_post_trial: 1000,
  data: {
    exp_id: "time_perspective"
  }
};

var opts = ["Very uncharacteristic", "Uncharacteristic", "Neutral", "Characteristic",
  "Very characteristic"
]

var all_pages = [
  [
    "I believe that getting together with one's friends to party is one of life's important pleasures.",
    "Familiar childhood sigKts, sounds, smells often bring back a flood of wonderful memories.",
    "Fate determines much in my life.",
    "I often think of what I should have done differently in my life.",
    "My decisions are mostly influenced by people and things around me.",
    "I believe that a person's day should be planned ahead each morning.",
    "It gives me pleasure to think about my past.", "I do things impulsively.",
    "If things don't get done on time, I don't worry about it.",
    "When I want to achieve something, I set goals and consider specific means for reaching those goals."
  ],
  ["On balance, there is much more good to recall than bad in my past.",
    "When listening to my favorite music, I often lose all track of time.",
    "Meeting tomorrow's deadlines and doing other necessary work comes before tonight's play.",
    "Since whatever will be will be, it doesn't really matter what I do.",
    "I enjoy stories about how things used to be in the 'good old times.'",
    "Painful past experiences keep being replayed in my mind.",
    "I try to live my life as fully as possible, one day at a time.",
    "It upsets me to be late for appointments.",
    "Ideally, I would live each day as if it were my last.",
    "Happy memories of good times spring readily to mind."
  ],
  ["I meet my obligations to friends and authorities on time.",
    "I've taken my share of abuse and rejection in the past.",
    "I make decisions on the spur of the moment.",
    "I take each day as it is rather than try to plan it out.",
    "The past has too many unpleasant memories that I prefer not to think about.",
    "It is important to put excitement in my life.",
    "I've made mistakes in the past that I wish I could undo.",
    "I feel that it's more important to enjoy what you're doing than to get work done on time.",
    "I get nostalgic about my childhood.",
    "Before making a decision, I weigh the costs against the benefits."
  ],
  ["Taking risks keeps my life from becoming boring.",
    "It is more important for me to enjoy life's journey than to focus only on the destination.",
    "Things rarely work out as I expected.",
    "It's hard for me to forget unpleasant images of my youth.",
    "It takes joy out of the process and flow of my activities, if I have to think about goals, outcomes, and products.",
    "Even when I am enjoying the present, I am drawn back to comparisonswith similar past experiences.",
    "You can't really plan for the future because things change so much.",
    "My life path is controlled by forces I cannot influence.",
    "It doesn't make sense to worry about the future, since there is nothing that I can do about it anyway.",
    "I complete projects on time by making steady progress."
  ],
  ["I find myself tuning out when family members talk about the way things used to be.",
    "I take risks to put excitement in my life.", "I make lists of things to do.",
    "I often follow my heart more than my head.",
    "I am able to resist temptations when I know that there is work to be done.",
    "I find myself getting swept up in the excitement of the moment.",
    "Life today is too complicated; I would prefer the simpler life of the past.",
    "I prefer friends who are spontaneous rather than predictable.",
    "I like family rituals and traditions that are regularly repeated.",
    "I think about the bad things that have happened to me in the past."
  ],
  ["I keep working at difficult, uninteresting tasks if they will help me get ahead.",
    "Spending what I earn on pleasures today is better than saving for tomorrow's security.",
    "Often luck pays off better than hard work.",
    "I think about the good things that I have missed out on in my life.",
    "I like my close relationships to be passionate.",
    "There will always be time to catch up on my work."
  ]
]

var all_options = [fillArray(opts, 10), fillArray(opts, 10), fillArray(opts, 10), fillArray(opts,
  10), fillArray(opts, 10), fillArray(opts, 6)]

var score_scale = {
  "Very uncharacteristic": 1,
  "Uncharacteristic": 2,
  "Neutral": 3,
  "Characteristic": 4,
  "Very characteristic": 5
}

var survey_block = {
  type: "poldrack-survey-multi-choice",
  exp_id: "time_perspective",
  horizontal: true,
  preamble: '<p><strong>How characteristic or true is this of you?</strong></p>',
  pages: all_pages,
  options: all_options,
  scale: score_scale,
  show_clickable_nav: true,
  allow_backward: true,
  required: [fillArray(true, 10), fillArray(true, 10), fillArray(true, 10), fillArray(true, 10),
    fillArray(true, 10), fillArray(true, 6)
  ],
  reverse_score: [
    [false, false, false, false, false, false, false, false, false, false],
    [false, false, false, false, false, false, false, false, false, false],
    [false, false, false, false, false, false, false, false, false, false],
    [false, false, false, false, false, false, false, false, false, false],
    [false, false, false, false, false, false, false, false, false, false],
    [false, false, false, false, false, false]
  ],
};

var end_block = {
  type: 'text',
  timing_response: 60000,
  text: '<div class = centerbox><p class = center-block-text>Congratulations for completing this task!</p><p class = center-block-text>Press <strong>enter</strong> to continue.</p></div>',
  cont_key: [13],
  data: {
    exp_id: "time_perspective"
  }
};


//Set up experiment
var time_perspective_experiment = []
time_perspective_experiment.push(welcome_block);
time_perspective_experiment.push(instructions_block);
time_perspective_experiment.push(survey_block);
time_perspective_experiment.push(end_block);