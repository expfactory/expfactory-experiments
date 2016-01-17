
/* ************************************ */
/* Define helper functions */
/* ************************************ */

/* ************************************ */
/* Define experimental variables */
/* ************************************ */
var congruent_stim = [{stimulus: '<div class = centerbox><div class = stroop-stim style = "color:red">RED</div></div>', data: {exp_id: 'stroop', condition: 'congruent', correct_response: 82}, key_answer: 82},
						   {stimulus: '<div class = centerbox><div class = stroop-stim style = "color:blue">BLUE</div></div>', data: {exp_id: 'stroop', condition: 'congruent', correct_response: 66}, key_answer: 66},
						   {stimulus: '<div class = centerbox><div class = stroop-stim style = "color:green">GREEN</div></div>', data: {exp_id: 'stroop', condition: 'congruent', correct_response: 71}, key_answer: 71}];
							
var incongruent_stim = [{stimulus: '<div class = centerbox><div class = stroop-stim style = "color:red">BLUE</div></div>', data: {exp_id: 'stroop', condition: 'incongruent', correct_response: 82}, key_answer: 82},
						{stimulus: '<div class = centerbox><div class = stroop-stim style = "color:red">GREEN</div></div>', data: {exp_id: 'stroop', condition: 'incongruent', correct_response: 82, key_answer: 82}},
						{stimulus: '<div class = centerbox><div class = stroop-stim style = "color:blue">RED</div></div>', data: {exp_id: 'stroop', condition: 'incongruent', correct_response: 66, key_answer: 66}},
						{stimulus: '<div class = centerbox><div class = stroop-stim style = "color:blue">GREEN</div></div>', data: {exp_id: 'stroop', condition: 'incongruent', correct_response: 66, key_answer: 66}},
						{stimulus: '<div class = centerbox><div class = stroop-stim style = "color:green">RED</div></div>', data: {exp_id: 'stroop', condition: 'incongruent', correct_response: 71, key_answer: 71}},
						{stimulus: '<div class = centerbox><div class = stroop-stim style = "color:green">BLUE</div></div>', data: {exp_id: 'stroop', condition: 'incongruent', correct_response: 71}, key_answer: 71}];
var stims = [].concat(congruent_stim,congruent_stim,incongruent_stim)
practice_len = 24
practice_stims = jsPsych.randomization.repeat(stims,practice_len/12)

exp_len = 96
test_stims = jsPsych.randomization.repeat(stims,exp_len/12)

/* ************************************ */
/* Set up jsPsych blocks */
/* ************************************ */
/* define static blocks */
var welcome_block = {
  type: 'text',
  text: '<div class = centerbox><p class = block-text>Welcome to the Stroop experiment. Press <strong>enter</strong> to begin.</p></div>',
  cont_key: [13],
  timing_post_trial: 0
};

var response_keys = '<ul list-text><li><span class = "large" style = "color:red">WORD</span>: "R key"</li><li><span class = "large" style = "color:blue">WORD</span>: "B key"</li><li><span class = "large" style = "color:green">WORD</span>: "G key"</li></ul>'

var instructions_block = {
  type: 'poldrack-instructions',
  pages: ['<div class = centerbox><p class = block-text>In this experiment you will see "color" words (RED, BLUE, GREEN) appear one at a time. The "ink" of the words also will be colored. For example, you may see: <span class = "large" style = "color:blue">RED</span>, <span class = "large" style = "color:blue">BLUE</span> or <span class = "large" style = "color:red">BLUE</span>.</p><p class = block-text>Your task is to press the button corresponding to the <strong> ink color </strong> of the word. It is important that you respond as quickly and accurately as possible. The response keys are as follows:</p>' + response_keys + '</div>'],
  allow_keys: false,
  show_clickable_nav: true,
  timing_post_trial: 1000
};

var end_block = {
  type: 'text',
  text: '<div class = centerbox><p class = center-block-text>Thanks for completing this task!</p><p class = center-block-text>Press <strong>enter</strong> to continue.</p></div>',
  cont_key: [13],
  timing_post_trial: 0
};

var start_practice_block = {
  type: 'text',
  text: '<div class = centerbox><p class = block-text>We will start with a few practice trials. Remember, press the key corresponding to the <strong>ink</strong> color of the word: "r" for words colored red, "b" for words colored blue, and "g" for words colored green.</p><p class = block-text>Press <strong>enter</strong> to begin practice.</p></div>',
  cont_key: [13],
  timing_post_trial: 1000
};

var start_test_block = {
  type: 'text',
  text: '<div class = centerbox><p class = center-block-text>We will now start the test. Respond exactly like you did during practice.</p><p class = center-block-text>Press <strong>enter</strong> to begin the test.</p></div>',
  cont_key: [13],
  timing_post_trial: 1000
};

var fixation_block = {
  type: 'poldrack-single-stim',
  stimulus: '<div class = centerbox><div class = fixation>+</div></div>',
  is_html: true,
  choices: 'none',
  data: {exp_id: "stop_signal", "trial_id": "fixation"},
  timing_post_trial: 500,
  timing_stim: 500,
  timing_response: 500
}

/* create experiment definition array */
stroop_experiment = []
stroop_experiment.push(welcome_block)
stroop_experiment.push(instructions_block)
stroop_experiment.push(start_practice_block)
/* define test trials */
for (i=0; i<practice_len; i++) {
	stroop_experiment.push(fixation_block)
	var practice_block = {
	  type: 'poldrack-categorize',
	  timeline: practice_stims,
	  is_html: true,
	  correct_text: '<div stroop class = fb_box><div class = center-text><font size = 20>Correct!</font></div></div>',
	  incorrect_text: '<div stroop class = fb_box><div class = center-text><font size = 20>Incorrect</font></div></div>',
	  choices: [66,71,82],
	  timing_response: -1, 
	  timing_stim: -1,
	  timing_feedback_duration: 500,
	  show_stim_with_feedback: true,
	  timing_post_trial: 250,
	  on_finish: function() {
	  	jsPsych.data.addDataToLastTrial({trial_id: 'practice'})
	  }
	}
	stroop_experiment.push(practice_block)
}

stroop_experiment.push(start_test_block)
/* define test trials */
for (i=0; i<exp_len; i++) {
	stroop_experiment.push(fixation_block)
	var test_block = {
	  type: 'poldrack-categorize',
	  timeline: test_stims,
	  is_html: true,
	  correct_text: '<div stroop class = fb_box><div class = center-text><font size = 20>Correct!</font></div></div>',
	  incorrect_text: '<div stroop class = fb_box><div class = center-text><font size = 20>Incorrect</font></div></div>',
	  choices: [66,71,82],
	  timing_response: -1, 
	  timing_stim: -1,
	  timing_feedback_duration: 500,
	  show_stim_with_feedback: true,
	  timing_post_trial: 250,
	  on_finish: function() {
	  	jsPsych.data.addDataToLastTrial({trial_id: 'practice'})
	  }
	}
	stroop_experiment.push(test_block)
}
stroop_experiment.push(end_block)
