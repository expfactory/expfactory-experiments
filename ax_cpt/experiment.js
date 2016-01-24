/* ************************************ */
/* Define helper functions */
/* ************************************ */

var getChar = function() {
 return '<div class = centerbox><p class = AX_text>' + chars[Math.floor(Math.random()*22)] + '</p></div>'
}


/* ************************************ */
/* Define experimental variables */
/* ************************************ */
var possible_responses = [["M key",77],["Z key",90]]
var chars = 'BCDEFGHIJLMNOPQRSTUVWZ'
var trial_proportions = ["AX", "AX", "AX", "AX", "AX", "AX", "AX", "BX", "AY", "BY"]
var block1_list = jsPsych.randomization.repeat(trial_proportions,4)
var block2_list = jsPsych.randomization.repeat(trial_proportions,4)
var block3_list = jsPsych.randomization.repeat(trial_proportions,4)
var blocks = [block1_list,block2_list, block3_list]

/* ************************************ */
/* Set up jsPsych blocks */
/* ************************************ */
/* define static blocks */
var welcome_block = {
  type: 'poldrack-text',
  timing_response: 60000,
  text: '<div class = centerbox><p class = center-block-text>Welcome to the experiment. Press <strong>enter</strong> to begin.</p></div>',
  cont_key: [13],
  timing_post_trial: 0
};

var end_block = {
  type: 'poldrack-text',
  timing_response: 60000,
  text: '<div class = centerbox><p class = center-block-text>Thanks for completing this task!</p><p class = center-block-text>Press <strong>enter</strong> to continue.</p></div>',
  cont_key: [13],
  timing_post_trial: 0
};

var instructions_block = {
  type: 'poldrack-instructions',
  pages: [
	'<div class = centerbox><p class = block-text>In this task, on each trial you will see a letter presented for a short time, followed by the presentation of another letter. For instance you may see "A", which would then disappear to be replaced by "F".</p><p class = block-text>Your job is to respond by pressing an arrow key during the presentation of the <strong>second</strong> letter. If the first letter was an "A" <strong>AND</strong> the second letter was an "X", press the ' + possible_responses[0][0] + '. Otherwise press the ' + possible_responses[1][0] + '.</p></div>',
	'<div class = centerbox><p class = block-text>We will now start the experiment. Remember, press the left arrow key after you see "A" followed by an "X", and the down arrow key for all other combinations.</p></div>'
	],
  allow_keys: false,
  show_clickable_nav: true,
  timing_post_trial: 01000
};

var rest_block = {
  type: 'poldrack-text',
  timing_response: 60000,
  text: '<div class = centerbox><p class = block-text>Take a break! Press any key to continue.</p></div>',
  timing_post_trial: 1000
};

var wait_block = {
  type: 'poldrack-single-stim',
  stimulus: '<div class = centerbox><div class = AX_feedback>Trial over, get ready for the next one.</div></div>',
  is_html: true,
  choices: 'none',
  data: {exp_id: "ax_cpt", trial_id: "feedback"},
  timing_post_trial: 500,
  timing_stim: 1000,
  timing_response: 1000
}

/* define test block cues and probes*/
var A_cue = {
  type: 'poldrack-single-stim',
  stimulus: '<div class = centerbox><div class = AX_text>A</div></div>',
  is_html: true,
  choices: 'none',
  data: {exp_id: "ax_cpt", trial_id: "cue"},
  timing_stim: 300,
  timing_response: 5200,
  response_ends_trial: false,
  timing_post_trial: 0
};

var other_cue = {
  type: 'poldrack-single-stim',
  stimulus: getChar,
  is_html: true,
  choices: 'none',
  data: {exp_id: "ax_cpt", trial_id: "cue"},
  timing_stim: 300,
  timing_response: 5200,
  response_ends_trial: false,
  timing_post_trial: 0
};

var X_probe = {
  type: 'poldrack-single-stim',
  stimulus: '<div class = centerbox><div class = AX_text>X</div></div>',
  is_html: true,
  choices: [possible_responses[0][1], possible_responses[1][1]],
  data: {exp_id: "ax_cpt", trial_id: "probe"},
  timing_stim: 300,
  timing_response: 1300,
  response_ends_trial: false,
  timing_post_trial: 0
};

var other_probe = {
  type: 'poldrack-single-stim',
  stimulus: getChar,
  is_html: true,
  choices: [possible_responses[0][1], possible_responses[1][1]],
  data: {exp_id: "ax_cpt", trial_id: "probe"},
  timing_stim: 300,
  timing_response: 1300,
  response_ends_trial: false,
  timing_post_trial: 0
};

/* ************************************ */
/* Set up experiment */
/* ************************************ */

var ax_cpt_experiment = []
ax_cpt_experiment.push(welcome_block);
ax_cpt_experiment.push(instructions_block);

for (b = 0; b< blocks.length; b++) {
	var block = blocks[b]
	for (i = 0; i < block.length; i++) {
		switch (block[i]) {
			case "AX":
				cue = jQuery.extend(true, {}, A_cue)
        		probe = jQuery.extend(true, {}, X_probe)
				cue.data.condition="AX"
				probe.data.condition="AX"
				break;
			case "BX":
				cue = jQuery.extend(true, {}, other_cue)
        		probe = jQuery.extend(true, {}, X_probe)
				cue.data.condition="BX"
				probe.data.condition="BX"
				break;
			case "AY":
				cue = jQuery.extend(true, {}, A_cue)
        		probe = jQuery.extend(true, {}, other_probe)
				cue.data.condition="AY"
				probe.data.condition="AY"
				break;
			case "BY":
				cue = jQuery.extend(true, {}, other_cue)
        		probe = jQuery.extend(true, {}, other_probe)
				cue.data.condition="BY"
				probe.data.condition="BY"
				break;
		}
		ax_cpt_experiment.push(cue)
		ax_cpt_experiment.push(probe)
		ax_cpt_experiment.push(wait_block)
	}
	ax_cpt_experiment.push(rest_block)
}
ax_cpt_experiment.push(end_block)
