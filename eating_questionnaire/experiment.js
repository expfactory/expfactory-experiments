
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
  text: '<div class = centerbox><p class = block-text>Welcome to this survey.<br><br> Press <strong>enter</strong> to begin.</p></div>',
  cont_key: [13],
  data: {exp_id: "eating_questionnaire"}
};

var instructions_block = {
  type: 'poldrack-instructions',
  pages: [
    '<div class = centerbox><p class = block-text>Please answer the following questions about your eating habits.</p></div>',
  ],
  allow_keys: false,
  show_clickable_nav: true,
  timing_post_trial: 1000,
  data: {exp_id : "eating_questionnaire"}
};

var opts1 = ["Definitely true", "mostly true", "mostly false", "definitely false"]

var opts2 = ["Only at meal times", "sometimes between meals", "often between meals", "almost always"]

var opts3 = ["Almost never", "seldom", "usually", "almost always"]

var opts4 = ["Unlikely", "slightly likely", "moderately likely", "very likely"]

var opts5 = ["Never", "rarely", "sometimes", "at least once a week"]

var opts6 = ["1", "2", "3", "4", "5", "6", "7", "8"]

var all_pages = [["When I smell a sizzling steak or juicy piece of meat, I find it very difficult to keep from eating, even if I have just finished a meal.","I deliberately take small helpings as a means of controlling my weight.","When I feel anxious, I find myself eating.","Sometimes when I start eating, I just can’t seem to stop.","Being with someone who is eating often makes me hungry enough to eat also.","When I feel blue, I often overeat."],["When I see a real delicacy, I often get so hungry that I have to eat right away.","I get so hungry that my stomach often seems like a bottomless pit.","I am always hungry so it is hard for me to stop eating before I finish the food on my plate.","When I feel lonely, I console myself by eating.","I consciously hold back at meals in order not to weight gain.","I do not eat some foods because they make me fat."],["I am always hungry enough to eat at any time.","How often do you feel hungry?","How frequently do you avoid “stocking up” on tempting foods?","How likely are you to consciously eat less than you want?","Do you go on eating binges though you are not hungry?","On a scale of 1 to 8, where 1 means no restraint in eating (eating whatever you want, whenever you want it) and 8 means total restraint (constantly limiting food intake and never “giving in”), what number would you give yourself?"]]

var all_options = [fillArray(opts1, 6), fillArray(opts1, 6), [opts1, opts2, opts3, opts4, opts5, opts6]]

//higher - more impulsiveness
var score_scale = {"Definitely true":4, "mostly true":3, "mostly false":2, "definitely false":1, "Only at meal times":1, "sometimes between meals":2, "often between meals":3, "almost always":4, "Almost never":1, "seldom":2, "usually":3, "Unlikely":1, "slightly likely":2, "moderately likely":3, "very likely":4, "Never":1, "rarely":2, "sometimes":3, "at least once a week":4, "1":1, "2":1, "3":2, "4":2, "5":3, "6":3, "7":4, "8":4}

var survey_block = {
  type: "poldrack-survey-multi-choice",
  exp_id: "eating_questionnaire",
  horizontal: true,
  preamble: '',
  pages: all_pages,
  options: all_options,
  scale: score_scale,
  show_clickable_nav: true,
  allow_backward: true,
  required: [fillArray(true, 6), fillArray(true, 6), fillArray(true, 6)],
  reverse_score: [[false, false, false, false, false, false],[false, false, false, false, false, false],[false, false, false, false, false, false]]
};

var end_block = {
  type: 'text',
  text: '<div class = centerbox><p class = center-block-text>Congratulations for completing this task!</p><p class = center-block-text>Press <strong>enter</strong> to continue.</p></div>',
  cont_key: [13],
  data: {exp_id: "eating_questionnaire"}
};


//Set up experiment
var eating_questionnaire_experiment = []
eating_questionnaire_experiment.push(welcome_block);
eating_questionnaire_experiment.push(instructions_block);
eating_questionnaire_experiment.push(survey_block);
eating_questionnaire_experiment.push(end_block);
