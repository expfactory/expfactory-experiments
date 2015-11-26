
/* Main reference: http://www.cns.nyu.edu/~rotto/jocn_in_press.pdf
Cognitive Control Predicts Use of Model-based Reinforcement learning, Otto et al. 2014
*/

/*
Condition indicates cue/target trial type: AX, BX, AY, BY
*/

/* ************************************ */
/* Define helper functions */
/* ************************************ */

var randomDraw = function(lst) {
    var index = Math.floor(Math.random()*(lst.length))
    return lst[index]
}

var getInvalidCue = function() {
 return prefix + path + randomDraw(cues) + postfix
}

var getInvalidProbe = function() {
 return prefix + path + randomDraw(probes) + postfix
}

var getFeedback = function() {
	var curr_trial = jsPsych.progress().current_trial_global
	var curr_data = jsPsych.data.getData()[curr_trial-1]
	var condition = curr_data.condition
	var response = curr_data.key_press
	if (response == -1) {
		return '<div class = centerbox><div class = center-text>TOO SLOW</p></div>'
	}
	if (condition == "AX" && response == 37) {
		return '<div class = centerbox><div class = center-text>CORRECT</p></div>'
	} else if (condition != "AX" && response == 40) {
		return '<div class = centerbox><div class = center-text>CORRECT</p></div>'
	} else {
		return '<div class = centerbox><div class = center-text>INCORRECT</p></div>'
	}
}
/* ************************************ */
/* Define experimental variables */
/* ************************************ */
var correct_responses = [["left arrow",37],["down arrow",40]]
var path = 'static/experiments/dpx/images/'
var prefix = '<div class = centerbox><div class = img-container><img src = "'
var postfix = '"</img></div></div>'
var cues = jsPsych.randomization.shuffle(['cue1.png','cue2.png','cue3.png','cue4.png','cue5.png','cue6.png'])
var probes = jsPsych.randomization.shuffle(['probe1.png','probe2.png','probe3.png','probe4.png','probe5.png','probe6.png'])
var valid_cue = cues.pop()
var valid_probe = probes.pop()

var trial_proportions = ["AX", "AX", "AX", "AX", "AX", "AX", "AX", "AX", "AX", "AX", "AX", "BX", "BX", "AY", "AY", "BY"]
var block1_list = jsPsych.randomization.repeat(trial_proportions,2)
var block2_list = jsPsych.randomization.repeat(trial_proportions,2)
var block3_list = jsPsych.randomization.repeat(trial_proportions,2)
var block4_list = jsPsych.randomization.repeat(trial_proportions,2)
var blocks = [block1_list,block2_list, block3_list, block4_list]

/* ************************************ */
/* Set up jsPsych blocks */
/* ************************************ */

/* define static blocks */
var welcome_block = {
  type: 'text',
  text: '<div class = centerbox><p class = block-text>Welcome to the DPX experiment. Press any key to begin.</p></div>',
  timing_post_trial: 0
};

var end_block = {
  type: 'text',
  text: '<div class = centerbox><p class = center-block-text>Finished with this task.</p><p class = center-block-text>Press <strong>enter</strong> to continue.</p></div>',
  cont_key: 13,
  timing_post_trial: 0
};

var instructions_block = {
  type: 'instructions',
  pages: [
	'<div class = centerbox><p class = block-text>In this task, on each trial you will see a group of blue circles presented for a short time, followed by the presentation of  group of black circles. For instance you may see:</p><p class = block-text><img src = "static/experiments/dpx/images/cue2.png" ></img>	...followed by...		<img src = "static/experiments/dpx/images/probe2.png" ></img><br><br></p></div>',
	'<div class = centerbox><p class = block-text>Your job is to respond by pressing an arrow key during the presentation of the <strong>second</strong> group  of circles. For most pairs of circles you should press the <strong>down</strong> arrow key. One pair of circles is the <strong>target</strong> pair, and for this pair you should press the <strong>left</strong> arrow key.</p><p class = block-text>After you respond you will get feedback about whether you were correct. The target pair is shown below:</p><p class = block-text><img src = "static/experiments/dpx/images/' + valid_cue + '" ></img>	...followed by...		<img src = "static/experiments/dpx/images/' + valid_probe + '.png" ></img><br><br></p></div>',
	'<div class = centerbox><p class = block-text>We will now start the experiment. Remember, press the left arrow key only after seeing the target pair. The target pair is shown below (for the last time). Memorize it!</p><p class = block-text><img src = "static/experiments/dpx/images/' + valid_cue + '" ></img>	...followed by...		<img src = "static/experiments/dpx/images/' + valid_probe + '" ></img><br></br></p></div>'
	],
  allow_keys: false,
  show_clickable_nav: true,
  timing_post_trial: 1000
};

var rest_block = {
  type: 'text',
  text: '<div class = centerbox><p class = block-text>Take a break! Press any key to continue.</p></div>',
  timing_post_trial: 1000
};

var feedback_block = {
  type: 'single-stim',
  stimuli: getFeedback,
  is_html: true,
  choices: 'none',
  data: {exp_id: "dpx", trial_id: "feedback"},
  timing_post_trial: 0,
  timing_stim: 1000,
  timing_response: 1000
}

var fixation_block = {
  type: 'single-stim',
  stimuli: '<div class = centerbox><div class = fixation>+</div></div>',
  is_html: true,
  choices: [37,40],
  data: {exp_id: "dpx", "trial_id": "fixation"},
  timing_post_trial: 0,
  timing_stim: 2000,
  timing_response: 2000,
  response_ends_trial: false
}

/* define test block cues and probes*/
var A_cue = {
  type: 'single-stim',
  stimuli: prefix + path + valid_cue + postfix,
  is_html: true,
  choices: 'none',
  data: {exp_id: "dpx", trial_id: "cue"},
  timing_stim: 500,
  timing_response: 500,
  timing_post_trial: 0
};

var other_cue = {
  type: 'single-stim',
  stimuli: getInvalidCue,
  is_html: true,
  choices: 'none',
  data: {exp_id: "dpx", trial_id: "cue"},
  timing_stim: 500,
  timing_response: 500,
  timing_post_trial: 0
};

var X_probe = {
  type: 'single-stim',
  stimuli: prefix + path + valid_probe + postfix,
  is_html: true,
  choices: [37,40],
  data: {exp_id: "dpx", trial_id: "probe"},
  timing_stim: 500,
  timing_response: 1500,
  response_ends_trial: false,
  timing_post_trial: 0
};

var other_probe = {
  type: 'single-stim',
  stimuli: getInvalidProbe,
  is_html: true,
  choices: [37,40],
  data: {exp_id: "dpx", trial_id: "probe"},
  timing_stim: 500,
  timing_response: 1500,
  response_ends_trial: false,
  timing_post_trial: 0
};

/* ************************************ */
/* Set up experiment */
/* ************************************ */

var dpx_experiment = []
dpx_experiment.push(welcome_block);
dpx_experiment.push(instructions_block);

for (b = 0; b< 1; b++) {
	var block = blocks[b]
	for (i = 0; i < block.length; i++) {
		switch (block[i]) {
			case "AX":
				cue = jQuery.extend(true, {}, A_cue)
				probe = jQuery.extend(true, {}, X_probe)
				cue.data["condition"]="AX"
				probe.data["condition"]="AX"
				break;
			case "BX":
				cue = jQuery.extend(true, {}, other_cue)
				probe = jQuery.extend(true, {}, X_probe)
				cue.data["condition"]="BX"
				probe.data["condition"]="BX"
				break;
			case "AY":
				cue = jQuery.extend(true, {}, A_cue)
				probe = jQuery.extend(true, {}, other_probe)
				cue.data["condition"]="AY"
				probe.data["condition"]="AY"
				break;
			case "BY":
				cue = jQuery.extend(true, {}, other_cue)
				probe = jQuery.extend(true, {}, other_probe)
				cue.data["condition"]="BY"
				probe.data["condition"]="BY"
				break;
		}
		dpx_experiment.push(cue)
		dpx_experiment.push(fixation_block)
		dpx_experiment.push(probe)
		dpx_experiment.push(feedback_block)
	}
	dpx_experiment.push(rest_block)
}
dpx_experiment.push(end_block)
