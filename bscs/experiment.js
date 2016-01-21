
/* ************************************ */
/* Define helper functions */
/* ************************************ */

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
    '<div class = centerbox><p class = block-text>"For each of the following statements please indicate how much each of the following statements reflects how you typically are."<br><br> Press <strong>enter</strong> to begin.</p></div>',
  ],
  key_forward: 13,
  allow_backwards: false
};

var opts = ["Not at all - 1", "2", "3", "4", "Very much - 5"]

var all_pages = [["I am good at resisting temptation.","I have a hard time breaking bad habits.","I am lazy.","I say inappropriate things.","I do certain things that are bad for me, if they are fun.","I refuse things that are bad for me.","I wish I had more self-discipline.","People would say that I have iron self- discipline.","Pleasure and fun sometimes keep me from getting work done.","I have trouble concentrating.","I am able to work effectively toward long-term goals.","Sometimes I can't stop myself from doing something, even if I know it is wrong.","I often act without thinking through all the alternatives."]]

var all_options = [fillArray(opts, 13)]

var score_scale = {"Not at all - 1": 1, "2": 2, "3": 3, "4": 4, "Very much - 5": 5}

var survey_block = {
  type: "poldrack-survey-multi-choice",
  horizontal: true,
  preamble: '',
  pages: all_pages,
  options: all_options,
  scale: score_scale,
  show_clickable_nav: true,
  allow_backward: true,
  required: [fillArray(true, 13)],
  reverse_score: [[false, true, true, true, true, false, true, false, true, true, false, true, true]],
};

var end_block = {
  type: 'text',
  text: '<div class = centerbox><p class = center-block-text>Congratulations for completing this task!</p><p class = center-block-text>Press <strong>enter</strong> to continue.</p></div>',
  cont_key: [13]
};


//Set up experiment
var bscs_experiment = []
bscs_experiment.push(welcome_block);
bscs_experiment.push(instructions_block);
bscs_experiment.push(survey_block);
bscs_experiment.push(end_block);