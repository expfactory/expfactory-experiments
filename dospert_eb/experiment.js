/*
reference: https://sites.google.com/a/decisionsciences.columbia.edu/dospert/
Blais, A-R. and E. U. Weber. 2006. “A Domain-specific Risk-taking (DOSPERT) Scale for Adult Populations.” Judgment and Decision Making, 1, 33-47.
*/

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
  cont_key: [13],
};

var instructions_block = {
  type: 'instructions',
  pages: [
    '<div class = centerbox><p class = block-text>For each of the following statements, please indicate <strong>the benefits</strong> you would obtain from each situation. Provide a rating from <strong>1 to 7</strong>.<br><br> Press <strong>enter</strong> to begin.</p></div>',
  ],
  key_forward: 13,
  allow_backwards: false
};

var opts = ["No benefits at all - 1","2","3","Moderate benefits - 4","5" ,"6","Great benefits - 7"]

var all_pages = [["Admitting that your tastes are different from those of a friend.", "Going camping in the wilderness.", "Betting a day's income at the horse races.", "Investing 10% of your annual income in a moderate growth diversified fund.", "Drinking heavily at a social function.", "Taking some questionable deductions on your income tax return."],["Disagreeing with an authority figure on a major issue.", "Betting a day's income at a high-stake poker game.", "Having an affair with a married man/woman.", "Passing off somebody else’s work as your own.", "Going down a ski run that is beyond your ability.", "Investing 5% of your annual income in a very speculative stock."],["Going whitewater rafting at high water in the spring.", "Betting a day's income on the outcome of a sporting event.", "Engaging in unprotected sex.", "Revealing a friend's secret to someone else.", "Driving a car without wearing a seat belt.", "Investing 10% of your annual income in a new business venture."],["Taking a skydiving class.", "Riding a motorcycle without a helmet.", "Choosing a career that you truly enjoy over a more secure one.", "Speaking your mind about an unpopular issue in a meeting at work.", "Sunbathing without sunscreen.", "Bungee jumping off a tall bridge."],["Piloting a small plane.", "Walking home alone at night in an unsafe area of town.", "Moving to a city far away from your extended family.", "Starting a new career in your mid-thirties.", "Leaving your young children alone at home while running an errand.", "Not returning a wallet you found that contains $200."]]

var all_options = [fillArray(opts, 6), fillArray(opts, 6), fillArray(opts, 6), fillArray(opts, 6), fillArray(opts, 6)]

var score_scale = {"No benefits at all - 1":1,"2":2,"3":3,"Moderate benefits - 4":4,"5":5,"6":6,"Great benefits - 7":7}

var survey_block = {
  type: "poldrack-survey-multi-choice",
  horizontal: true,
  preamble: '<p><strong>Please indicate the benefits you would obtain from each situation. Provide a rating from 1 to 7 using the scale.</strong></p>',
  pages: all_pages,
  options: all_options,
  scale: score_scale,
  show_clickable_nav: true,
  allow_backward: true,
  required: [fillArray(true, 6), fillArray(true, 6), fillArray(true, 6), fillArray(true, 6), fillArray(true, 6)],
  reverse_score: [[false, false, false, false, false, false],[false, false, false, false, false, false],[false, false, false, false, false, false], [false, false, false, false, false, false], [false, false, false, false, false, false]],
};

var end_block = {
  type: 'text',
  text: '<div class = centerbox><p class = center-block-text>Thanks for completing this task!</p><p class = center-block-text>Press <strong>enter</strong> to continue.</p></div>',
  cont_key: [13]
};


//Set up experiment
var dospert_eb_experiment = []
dospert_eb_experiment.push(welcome_block);
dospert_eb_experiment.push(instructions_block);
dospert_eb_experiment.push(survey_block);
dospert_eb_experiment.push(end_block)
