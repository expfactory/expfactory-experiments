
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
  text: '<div class = centerbox><p class = center-block-text>Welcome to the experiment. Press <strong>enter</strong> to begin.</p></div>',
  cont_key: [13]
};

var instructions_block = {
  type: 'instructions',
  pages: [
    '<div class = centerbox><p class = block-text>This questionnaire has been designed to investigate your ideas about willpower. Willpower is what you use to resist temptations, to stick to your intentions, and to remain in strenuous mental activity. There are no right or wrong answers. We are interested in your ideas. Using the scale, please indicate how much you agree or disagree with each of the following statements by writing the number that corresponds to your opinion in the space next to each statement.<br><br> Press <strong>enter</strong> to begin.</p></div>',
  ],
  key_forward: 13,
  allow_backwards: false
};

var opts = ["Strongly agree", "Moderately agree", "Slightly agree", "Slightly disagree", "Moderately disagree", "Strongly disagree"]

var all_pages = [["Strenuous mental activity exhausts your resources, which you need to refuel afterwards (e.g. through taking breaks, doing nothing, watching television, eating snacks).","After a strenuous mental activity, your energy is depleted and you must rest to get it refuelled again.","When you have been working on a strenuous mental task, you feel energized and you are able to immediately start with another demanding activity.","Your mental stamina fuels itself. Even after strenuous mental exertion, you can continue doing more of it.","When you have completed a strenuous mental activity, you cannot start another activity immediately with the same concentration because you have to recover your mental energy again.","After a strenuous mental activity, you feel energized for further challenging activities."],["Resisting temptations makes you feel more vulnerable to the next temptations that come along.","When situations accumulate that challenge you with temptations, it gets more and more difficult to resist the temptations.","If you have just resisted a strong temptation, you feel strengthened and you can withstand any new temptations.","It is particularly difficult to resist a temptation after resisting another temptation right before.","Resisting temptations activates your willpower and you become even better able to face new upcoming temptations.","Your capacity to resist temptations is not limited. Even after you have resisted a strong temptation you can control yourself right afterwards."]]

var all_options = [fillArray(opts, 6), fillArray(opts, 6)]

var score_scale = {"Strongly agree":1, "Moderately agree":2, "Slightly agree":3, "Slightly disagree":4, "Moderately disagree":5, "Strongly disagree":6}

var survey_block = {
  type: "poldrack-survey-multi-choice",
  horizontal: true,
  preamble: '',
  pages: all_pages,
  options: all_options,
  scale: score_scale,
  show_clickable_nav: true,
  allow_backward: true,
  required: [fillArray(true, 6), fillArray(true, 6)],
  reverse_score: [[true, true, false, false, true, false],[true, true, false, true, false, false]],
};

var end_block = {
  type: 'text',
  timing_response: 60000,
  text: '<div class = centerbox><p class = center-block-text>Congratulations for completing this task!</p><p class = center-block-text>Press <strong>enter</strong> to continue.</p></div>',
  cont_key: [13]
};


//Set up experiment
var theories_of_willpower_experiment = []
theories_of_willpower_experiment.push(welcome_block);
theories_of_willpower_experiment.push(instructions_block);
theories_of_willpower_experiment.push(survey_block);
theories_of_willpower_experiment.push(end_block);