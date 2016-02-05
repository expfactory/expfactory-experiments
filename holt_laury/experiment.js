/*
reference: http://users.nber.org/~rosenbla/econ311-04/syllabus/holtlaury.pdf
Holt, C. A., & Laury, S. K. (2002). Risk aversion and incentive effects. American economic review, 92(5), 1644-1655.
*/

/* ************************************ */
/* Define helper functions */
/* ************************************ */
function getDisplayElement() {
  $('<div class = display_stage_background></div>').appendTo('body')
  return $('<div class = display_stage></div>').appendTo('body')
}

function addID() {
  jsPsych.data.addDataToLastTrial({
    'exp_id': 'holt_laury'
  })
}

var getInstructFeedback = function() {
  return '<div class = centerbox><p class = center-block-text>' + feedback_instruct_text +
    '</p></div>'
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
// generic task variables
var run_attention_checks = true
var attention_check_thresh = 0.65
var sumInstructTime = 0 //ms
var instructTimeThresh = 3 ///in seconds

/* ************************************ */
/* Set up jsPsych blocks */
/* ************************************ */
/* define static blocks */
var welcome_block = {
  type: 'poldrack-text',
  timing_response: 60000,
  text: '<div class = centerbox><p class = center-block-text>Welcome to the experiment. Press <strong>enter</strong> to begin.</p></div>',
  cont_key: [13],
  timing_post_trial: 0,
  data: {
    'exp_id': 'holt_laury'
  },
};

var feedback_instruct_text =
  'Starting with instructions.  Press <strong> Enter </strong> to continue.'
var feedback_instruct_block = {
  type: 'poldrack-text',
  cont_key: [13],
  text: getInstructFeedback,
  timing_post_trial: 0,
  timing_response: 6000,
  data: {
    'exp_id': 'holt_laury'
  },
};
/// This ensures that the subject does not read through the instructions too quickly.  If they do it too quickly, then we will go over the loop again.
var instruction_trials = []
var instructions_block = {
  type: 'poldrack-instructions',
  pages: [
    '<div class = centerbox><p class = block-text>In this experiment you will be presented with a series of lottery choices. Your job is to indicate which option you would prefer for each of the ten paired lottery choices. </p><p class = block-text>You should indicate your <strong>true</strong> preference because at the end of the experiment a random trial will be chosen and you will receive a bonus payment proportional to the option you selected.</p></div>',
  ],
  allow_keys: false,
  show_clickable_nav: true,
  timing_post_trial: 1000,
  data: {
    'exp_id': 'holt_laury'
  },
};
instruction_trials.push(feedback_instruct_block)
instruction_trials.push(instructions_block)

var instruction_node = {
  timeline: instruction_trials,
  /* This function defines stopping criteria */
  loop_function: function(data) {
    for (i = 0; i < data.length; i++) {
      if ((data[i].trial_type == 'poldrack-instructions') && (data[i].rt != -1)) {
        rt = data[i].rt
        sumInstructTime = sumInstructTime + rt
      }
    }
    if (sumInstructTime <= instructTimeThresh * 1000) {
      feedback_instruct_text =
        'Read through instructions too quickly.  Please take your time and make sure you understand the instructions.  Press <strong>enter</strong> to continue.'
      return true
    } else if (sumInstructTime > instructTimeThresh * 1000) {
      feedback_instruct_text =
        'Done with instructions. Press <strong>enter</strong> to continue.'
      return false
    }
  }
}

var all_pages = [fillArray('', 10)]

var all_options = [
  [
    ["10% chance of $100, 90% chance of $80", "10% chance of $190, 90% chance of $5"],
    ["20% chance of $100, 80% chance of $80", "20% chance of $190, 80% chance of $5"],
    ["30% chance of $100, 70% chance of $80", "30% chance of $190, 70% chance of $5"],
    ["40% chance of $100, 60% chance of $80", "40% chance of $190, 60% chance of $5"],
    ["50% chance of $100, 50% chance of $80", "50% chance of $190, 50% chance of $5"],
    ["60% chance of $100, 40% chance of $80", "60% chance of $190, 40% chance of $5"],
    ["70% chance of $100, 30% chance of $80", "70% chance of $190, 30% chance of $5"],
    ["80% chance of $100, 20% chance of $80", "80% chance of $190, 20% chance of $5"],
    ["90% chance of $100, 10% chance of $80", "90% chance of $190, 10% chance of $5"],
    ["100% chance of $100, 0% chance of $80", "100% chance of $190, 0% chance of $5"]
  ]
]

//higher - more impulsiveness: 1 is safe, 2 is risky
var score_scale = {
  "10% chance of $100, 90% chance of $80": 1,
  "10% chance of $190, 90% chance of $5": 2,
  "20% chance of $100, 80% chance of $80": 1,
  "20% chance of $190, 80% chance of $5": 2,
  "30% chance of $100, 70% chance of $80": 1,
  "30% chance of $190, 70% chance of $5": 2,
  "40% chance of $100, 60% chance of $80": 1,
  "40% chance of $190, 60% chance of $5": 2,
  "50% chance of $100, 50% chance of $80": 1,
  "50% chance of $190, 50% chance of $5": 2,
  "60% chance of $100, 40% chance of $80": 1,
  "60% chance of $190, 40% chance of $5": 2,
  "70% chance of $100, 30% chance of $80": 1,
  "70% chance of $190, 30% chance of $5": 2,
  "80% chance of $100, 20% chance of $80": 1,
  "80% chance of $190, 20% chance of $5": 2,
  "90% chance of $100, 10% chance of $80": 1,
  "90% chance of $190, 10% chance of $5": 2,
  "100% chance of $100, 0% chance of $80": 1,
  "100% chance of $190, 0% chance of $5": 2
}

var survey_block = {
  type: "poldrack-survey-multi-choice",
  exp_id: "holt_laury",
  horizontal: true,
  preamble: '<p class = center-block-text>Please indicate your preference between the two gambles.</p>',
  pages: all_pages,
  options: all_options,
  scale: score_scale,
  show_clickable_nav: true,
  allow_backward: true,
  required: [fillArray(true, 10)],
  reverse_score: [
    [false, false, false, false, false, false, false, false, false, false]
  ],
};

var end_block = {
  type: 'poldrack-text',
  timing_response: 60000,
  text: '<div class = centerbox><p class = center-block-text>Thanks for completing this task!</p><p class = center-block-text>Press <strong>enter</strong> to continue.</p></div>',
  cont_key: [13],
  data: {
    'exp_id': 'holt_laury'
  },
};


//Set up experiment
var holt_laury_experiment = []
holt_laury_experiment.push(welcome_block);
holt_laury_experiment.push(instruction_node);
holt_laury_experiment.push(survey_block);
holt_laury_experiment.push(end_block)