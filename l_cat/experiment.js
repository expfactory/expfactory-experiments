
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
    '<div class = centerbox><p class = block-text>Please answer the following question on your level of physical activity.<br><br> Press <strong>enter</strong> to begin.</p></div>',
  ],
  key_forward: 13,
  allow_backwards: false
};

// var survey_block = {
//   type: "survey-multi-choice",
//   questions: ["During the past month, which statement best describes the kinds of physical activity you usually did? Do not include the time you spent working at a job. Please read all six statements before selecting one."],
//   options: [["I did not do much physical activity. I mostly did things like watching television, reading, playing cards, or playing computer games. Only occasionally, no more than once or twice a month, did I do anything more active such as going for a walk or playing tennis.","Once or twice a week, I did light activities such as getting outdoors on the weekends for an easy walk or stroll. Or once or twice a week, I did chores around the house such as sweeping floors or vacuuming.","About three times a week, I did moderate activities such as brisk walking, swimming, or riding a bike for about 15 - 20 minutes each time. Or about once a week, I did moderately difficult chores such as raking or mowing the lawn for about 45 - 60 minutes. Or about once a week, I played sports such as softball, basketball, or soccer for about 45 - 60 minutes.","Almost daily, that is five or more times a week, I did moderate activities such as brisk walking, swimming, or riding a bike for 30 minutes or more each time. Or about once a week, I did moderately difficult chores or played sports for 2 hours or more.","About three times a week, I did vigorous activities such as running or riding hard on a bike for 30 minutes or more each time.","Almost daily, that is, five or more times a week, I did vigorous activities such as running or riding hard on a bike for 30 minutes or more each time."]],
//   require: true,
//   horizontal: false,
// }

var survey_block = {
  type: "poldrack-survey-multi-choice",
  horizontal: false,
  preamble: '',
  pages: [["During the past month, which statement best describes the kinds of physical activity you usually did? Do not include the time you spent working at a job. Please read all six statements before selecting one."]],
  options: [[["I did not do much physical activity. I mostly did things like watching television, reading, playing cards, or playing computer games. Only occasionally, no more than once or twice a month, did I do anything more active such as going for a walk or playing tennis.","Once or twice a week, I did light activities such as getting outdoors on the weekends for an easy walk or stroll. Or once or twice a week, I did chores around the house such as sweeping floors or vacuuming.","About three times a week, I did moderate activities such as brisk walking, swimming, or riding a bike for about 15 - 20 minutes each time. Or about once a week, I did moderately difficult chores such as raking or mowing the lawn for about 45 - 60 minutes. Or about once a week, I played sports such as softball, basketball, or soccer for about 45 - 60 minutes.","Almost daily, that is five or more times a week, I did moderate activities such as brisk walking, swimming, or riding a bike for 30 minutes or more each time. Or about once a week, I did moderately difficult chores or played sports for 2 hours or more.","About three times a week, I did vigorous activities such as running or riding hard on a bike for 30 minutes or more each time.","Almost daily, that is, five or more times a week, I did vigorous activities such as running or riding hard on a bike for 30 minutes or more each time."]]],
  scale: {"I did not do much physical activity. I mostly did things like watching television, reading, playing cards, or playing computer games. Only occasionally, no more than once or twice a month, did I do anything more active such as going for a walk or playing tennis.":1,"Once or twice a week, I did light activities such as getting outdoors on the weekends for an easy walk or stroll. Or once or twice a week, I did chores around the house such as sweeping floors or vacuuming.":2,"About three times a week, I did moderate activities such as brisk walking, swimming, or riding a bike for about 15 - 20 minutes each time. Or about once a week, I did moderately difficult chores such as raking or mowing the lawn for about 45 - 60 minutes. Or about once a week, I played sports such as softball, basketball, or soccer for about 45 - 60 minutes.":3,"Almost daily, that is five or more times a week, I did moderate activities such as brisk walking, swimming, or riding a bike for 30 minutes or more each time. Or about once a week, I did moderately difficult chores or played sports for 2 hours or more.":4,"About three times a week, I did vigorous activities such as running or riding hard on a bike for 30 minutes or more each time.":5,"Almost daily, that is, five or more times a week, I did vigorous activities such as running or riding hard on a bike for 30 minutes or more each time.":6},
  show_clickable_nav: true,
  allow_backward: true,
  required: [[true]],
  reverse_score: [[false]],
};

var end_block = {
  type: 'text',
  timing_response: 60000,
  text: '<div class = centerbox><p class = center-block-text>Congratulations for completing this task!</p><p class = center-block-text>Press <strong>enter</strong> to continue.</p></div>',
  cont_key: [13]
};


//Set up experiment
var l_cat_experiment = []
l_cat_experiment.push(welcome_block);
// l_cat_experiment.push(instructions_block);
l_cat_experiment.push(survey_block);
l_cat_experiment.push(end_block);