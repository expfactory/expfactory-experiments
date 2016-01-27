

/* ************************************ */
/* Define helper functions */
/* ************************************ */
function getDisplayElement () {
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
  cont_key: [13]
};

var instructions_block = {
  type: 'instructions',
  pages: [
    '<div class = centerbox><p class = block-text>For each of the following statements, please indicate whether you agree with them.<br><br> Press <strong>enter</strong> to begin.</p></div>',
  ],
  key_forward: 13,
  allow_backwards: false
};

var opts = ["True", "False"]

var all_pages = [["I don't like to make decisions quickly, even simple decisions, such as choosing what to wear, or what to have for dinner.","I am good at taking advantage of unexpected opportunities,where you have to do something immediately or lose your chance.","Most of the time, i can put my thoughts into words very rapidly. ","I am uncomfortable when l have to make up my mind rapidly.","I like to take part in really fast-paced conversations, where you don't have much time to think before you speak.","I don't like to do things quickly, even when I am doing something that is not very difﬁcult.","I would enjoy working at a job that required me to make a lot of split-second decisions.","I like sports and games in which you have to choose your next move very quickly.","I have often missed out on opportunities because I couldn't make up my mind fast enough.","People have admired me because I can think quickly.","I try to avoid activities where you have to act without much time to think first."], ["I will often say whatever comes into my head without thinking first.","I enjoy working out problems slowly and carefully.","I frequently make appointments without thinking about whether I will be able to keep them.","I frequently buy things without thinking about whether or not I can really afford them.","I often make up my mind without taking the time to consider the situation from all angles.","Often, I don't spend enough time thinking over a situation before I act.","I often get into trouble because I don't think before I act.","Many times the plans I make don't work out because I haven‘t gone over them carefully enough in advance.","I rarely get involved in projects without first considering the potential problems.","Before making any important decision, I carefully weigh the pros and cons.","I am good at careful reasoning.","I often say and do things without considering the consequences."]]

var all_options = [fillArray(opts, 11), fillArray(opts, 12)]

//higher = more impulsive
var score_scale = {"True":2, "False":1}

var survey_block = {
  type: "poldrack-survey-multi-choice",
  horizontal: true,
  preamble: '',
  pages: all_pages,
  options: all_options,
  scale: score_scale,
  show_clickable_nav: true,
  allow_backward: true,
  required: [fillArray(true, 11), fillArray(true, 12)],
  reverse_score: [[true, false, false, true, false, true, false, false, true, false, true],[false, true, false, false, false, false, false, false, true, true, true, false]],
};

var end_block = {
  type: 'text',
  text: '<div class = centerbox><p class = center-block-text>Congratulations for completing this task!</p><p class = center-block-text>Press <strong>enter</strong> to continue.</p></div>',
  cont_key: [13]
};


//Set up experiment
var dickman_experiment = []
dickman_experiment.push(welcome_block);
dickman_experiment.push(instructions_block);
dickman_experiment.push(survey_block);
dickman_experiment.push(end_block);
