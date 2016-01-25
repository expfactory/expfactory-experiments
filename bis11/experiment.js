
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
    '<div class = centerbox><p class = block-text>People differ in the ways they act and think in different situations. This is a test to measure some of the ways in which you act and think. Read each statement and click on the appropriate circle below the question. Do not spend too much time on any statement. Answer quickly and honestly.<br><br> Press <strong>enter</strong> to begin.</p></div>',
  ],
  key_forward: 13,
  allow_backwards: false
};

var opts = ["Rarely/Never", "Occasionally", "Often", "Almost Always/Always"]

var all_pages = [["I plan tasks carefully.","I do things without thinking.","I make-up my mind quickly.","I am happy-go-lucky.","I don't 'pay attention.'","I have 'racing' thoughts.","I plan trips well ahead of time.","I am self controlled.","I concentrate easily.","I save regularly."],["I 'squirm' at plays or lectures.","I am a careful thinker.","I plan for job security.","I say things without thinking.","I like to think about complex problems.","I change jobs.","I act 'on impulse.'","I get easily bored when solving thought problems.","I act on the spur of the moment.","I am a steady thinker."],["I change residences.","I buy things on impulse.","I can only think about one thing at a time.","I change hobbies.","I spend or charge more than I earn.","I often have extraneous thoughts when thinking.","I am more interested in the present than the future.","I am restless at the theater or lectures.","I am restless at the theater or lectures.","I am future oriented."]]

var all_options = [fillArray(opts, 10),fillArray(opts, 10), fillArray(opts, 10)]

var score_scale = {"Rarely/Never": 1, "Occasionally": 2, "Often": 3, "Almost Always/Always": 4}

var survey_block = {
  type: "poldrack-survey-multi-choice",
  horizontal: true,
  preamble: '<div class = center-content><p class = block-text>People differ in the ways they act and think in different situations. This is a test to measure some of the ways in which you act and think. Read each statement and click on the appropriate circle below the question. Do not spend too much time on any statement. Answer quickly and honestly.</p></div>',
  pages: all_pages,
  options: all_options,
  scale: score_scale,
  show_clickable_nav: true,
  allow_backward: true,
  required: [fillArray(true, 10),fillArray(true, 10), fillArray(true, 10)],
  reverse_score: [[true, false, false, false, false, false, true, true, true, true],[false, true, true, false, true, false, false, false,false,true],[false, false, false, false, false, false, false, false, true, true]],
};

var end_block = {
  type: 'text',
  text: '<div class = centerbox><p class = center-block-text>Congratulations for completing this task!</p><p class = center-block-text>Press <strong>enter</strong> to continue.</p></div>',
  cont_key: [13]
};


//Set up experiment
var bis11_experiment = []
bis11_experiment.push(welcome_block);
bis11_experiment.push(instructions_block);
bis11_experiment.push(survey_block);
bis11_experiment.push(end_block);