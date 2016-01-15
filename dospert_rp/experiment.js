/*
reference: https://sites.google.com/a/decisionsciences.columbia.edu/dospert/
Blais, A-R. and E. U. Weber. 2006. “A Domain-specific Risk-taking (DOSPERT) Scale for Adult Populations.” Judgment and Decision Making, 1, 33-47.
*/

/* ************************************ */
/* Define helper functions */
/* ************************************ */

/* ************************************ */
/* Define experimental variables */
/* ************************************ */

// defining groups of questions that will go together.
var page_1_questions = ["Admitting that your tastes are different from those of a friend.", "Going camping in the wilderness.", "Betting a day's income at the horse races.", "Investing 10% of your annual income in a moderate growth diversified fund.", "Drinking heavily at a social function.", "Taking some questionable deductions on your income tax return."];
var page_2_questions = ["Disagreeing with an authority figure on a major issue.", "Betting a day's income at a high-stake poker game.", "Having an affair with a married man/woman.", "Passing off somebody else’s work as your own.", "Going down a ski run that is beyond your ability.", "Investing 5% of your annual income in a very speculative stock."];
var page_3_questions = ["Going whitewater rafting at high water in the spring.", "Betting a day's income on the outcome of a sporting event.", "Engaging in unprotected sex.", "Revealing a friend's secret to someone else.", "Driving a car without wearing a seat belt.", "Investing 10% of your annual income in a new business venture."];
var page_4_questions = ["Taking a skydiving class.", "Riding a motorcycle without a helmet.", "Choosing a career that you truly enjoy over a more secure one.", "Speaking your mind about an unpopular issue in a meeting at work.", "Sunbathing without sunscreen.", "Bungee jumping off a tall bridge."];
var page_5_questions = ["Piloting a small plane.", "Walking home alone at night in an unsafe area of town.", "Moving to a city far away from your extended family.", "Starting a new career in your mid-thirties.", "Leaving your young children alone at home while running an errand.", "Not returning a wallet you found that contains $200."];

// definiting response scale.
var scale = ["Not at all risky", "Slightly risky", "Somewhat risky", "Moderately risky", "Risky", "Very Risky", "Extremely Risky"];

//defining preamble text for each page.
var pretext ='<p><strong>Please indicate how risky you perceive each situation.</strong></p>'

var header = []

for (var i = 0; i < scale.length; i++){
  header += '<th>'+scale[i]+'</th>'
}

var page_1_buttonlist = ['<table><tr><th></th>']

page_1_buttonlist += header + '</tr>'

for (var i = 0; i < page_1_questions.length; i++){
  page_1_buttonlist += '<tr><td>'+ page_1_questions[i] +'</td><td><center><input type="radio" name="response_' + i + '" value = "1"></center></td><td><center><input type="radio" name="response_' + i + '" value = "2"></center></td><td><center><input type="radio" name="response_' + i + '" value = "3"></center></td><td><center><input type="radio" name="response_' + i + '" value = "4"></center></td><td><center><input type="radio" name="response_' + i + '" value = "5"></center></td><td><center><input type="radio" name="response_' + i + '" value = "6"></center></td><td><center><input type="radio" name="response_' + i + '" value = "7"></center></td></tr>'
}

page_1_buttonlist += '</table>'

var page_2_buttonlist = ['<table><tr><th></th>']

page_2_buttonlist += header + '</tr>'

for (var i = 0; i < page_2_questions.length; i++){
  page_2_buttonlist += '<tr><td>'+ page_2_questions[i] +'</td><td><center><input type="radio" name="response_' + i + '" value = "1"></center></td><td><center><input type="radio" name="response_' + i + '" value = "2"></center></td><td><center><input type="radio" name="response_' + i + '" value = "3"></center></td><td><center><input type="radio" name="response_' + i + '" value = "4"></center></td><td><center><input type="radio" name="response_' + i + '" value = "5"></center></td><td><center><input type="radio" name="response_' + i + '" value = "6"></center></td><td><center><input type="radio" name="response_' + i + '" value = "7"></center></td></tr>'
}

page_2_buttonlist += '</table>'

var page_3_buttonlist = ['<table><tr><th></th>']

page_3_buttonlist += header + '</tr>'

for (var i = 0; i < page_3_questions.length; i++){
  page_3_buttonlist += '<tr><td>'+ page_3_questions[i] +'</td><td><center><input type="radio" name="response_' + i + '" value = "1"></center></td><td><center><input type="radio" name="response_' + i + '" value = "2"></center></td><td><center><input type="radio" name="response_' + i + '" value = "3"></center></td><td><center><input type="radio" name="response_' + i + '" value = "4"></center></td><td><center><input type="radio" name="response_' + i + '" value = "5"></center></td><td><center><input type="radio" name="response_' + i + '" value = "6"></center></td><td><center><input type="radio" name="response_' + i + '" value = "7"></center></td></tr>'
}

page_3_buttonlist += '</table>'

var page_4_buttonlist = ['<table><tr><th></th>']

page_4_buttonlist += header + '</tr>'

for (var i = 0; i < page_4_questions.length; i++){
  page_4_buttonlist += '<tr><td>'+ page_4_questions[i] +'</td><td><center><input type="radio" name="response_' + i + '" value = "1"></center></td><td><center><input type="radio" name="response_' + i + '" value = "2"></center></td><td><center><input type="radio" name="response_' + i + '" value = "3"></center></td><td><center><input type="radio" name="response_' + i + '" value = "4"></center></td><td><center><input type="radio" name="response_' + i + '" value = "5"></center></td><td><center><input type="radio" name="response_' + i + '" value = "6"></center></td><td><center><input type="radio" name="response_' + i + '" value = "7"></center></td></tr>'
}

page_4_buttonlist += '</table>'

var page_5_buttonlist = ['<table><tr><th></th>']

page_5_buttonlist += header + '</tr>'

for (var i = 0; i < page_5_questions.length; i++){
  page_5_buttonlist += '<tr><td>'+ page_5_questions[i] +'</td><td><center><input type="radio" name="response_' + i + '" value = "1"></center></td><td><center><input type="radio" name="response_' + i + '" value = "2"></center></td><td><center><input type="radio" name="response_' + i + '" value = "3"></center></td><td><center><input type="radio" name="response_' + i + '" value = "4"></center></td><td><center><input type="radio" name="response_' + i + '" value = "5"></center></td><td><center><input type="radio" name="response_' + i + '" value = "6"></center></td><td><center><input type="radio" name="response_' + i + '" value = "7"></center></td></tr>'
}

page_5_buttonlist += '</table>'

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
    '<div class = centerbox><p class = block-text>People often see some risk in situations that contain uncertainty about what the outcome or consequences will be and for which there is the possibility of negative consequences. However, riskiness is a very personal and intuitive notion, and we are interested in <strong>your gut level assessment of how risky</strong> each situation or behavior is.<br><br>For each of the following statements, please indicate <strong>how risky you perceive</strong> each situation.<br><br> Press <strong>enter</strong> to begin.</p></div>',
  ],
  key_forward: 13,
  allow_backwards: false
};

var likert_block = {
    type: 'radio-buttonlist',
    timeline: [{buttonlist: page_1_buttonlist},{buttonlist: page_2_buttonlist},{buttonlist: page_3_buttonlist},{buttonlist: page_4_buttonlist},{buttonlist: page_5_buttonlist}],
    preamble: pretext,
    checkAll: true,
    numq: 6
};

var end_block = {
  type: 'text',
  text: '<div class = centerbox><p class = center-block-text>Thanks for completing this task!</p><p class = center-block-text>Press <strong>enter</strong> to continue.</p></div>',
  cont_key: [13]
};


//Set up experiment
var dospert_rp_experiment = []
dospert_rp_experiment.push(welcome_block);
dospert_rp_experiment.push(instructions_block);
dospert_rp_experiment.push(likert_block);
dospert_rp_experiment.push(end_block)
