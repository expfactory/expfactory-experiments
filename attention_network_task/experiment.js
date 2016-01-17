/* ************************************ */
/* Define helper functions */
/* ************************************ */
var post_trial_gap = function() {
  var curr_trial = jsPsych.progress().current_trial_global
  return 3500 - jsPsych.data.getData()[curr_trial - 1].rt - jsPsych.data.getData()[curr_trial - 4].duration
}

var get_RT = function() {
  var curr_trial = jsPsych.progress().current_trial_global
  return jsPsych.data.getData()[curr_trial].rt
}

/* ************************************ */
/* Define experimental variables */
/* ************************************ */
/* set up stim: location (2) * cue (4) * direction (2) * condition (3) */
var locations = ['up', 'down']
var cues = ['nocue', 'center', 'double', 'spatial']
var current_trial = 0
var test_stimuli = []
for (l = 0; l < locations.length; l++) {
	var loc = locations[l]
	for (ci = 0; ci < cues.length; ci++) {
		var c = cues[ci]
		stims = [
		  {
			image: '<div class = centerbox><div class = ANT_text>+</div></div><div class = ANT_' + loc + '><div class = ANT_text> &mdash; &mdash; &larr; &mdash; &mdash;</div></div></div>',
			data: {correct_response: 37, direction: 'left', flanker: 'neutral', location: loc, cue: c, exp_id: 'attention_network_task'}
		  }, 
		  {
			image: '<div class = centerbox><div class = ANT_text>+</div></div><div class = ANT_' + loc + '><div class = ANT_text> &larr; &larr; &larr; &larr; &larr; </div></div></div>',
			data: {correct_response: 37, direction: 'left', flanker: 'congruent', location: loc, cue: c, exp_id: 'attention_network_task'}
		  }, 
		  {
			image: '<div class = centerbox><div class = ANT_text>+</div></div><div class = ANT_' + loc + '><div class = ANT_text> &rarr; &rarr; &larr; &rarr; &rarr; </div></div></div>',
			data: {correct_response: 37, direction: 'left', flanker: 'incongruent', location: loc, cue: c, exp_id: 'attention_network_task'}
		  }, 
		  {
			image: '<div class = centerbox><div class = ANT_text>+</div></div><div class = ANT_' + loc + '><div class = ANT_text> &mdash; &mdash; &rarr; &mdash; &mdash; </div></div></div>',
			data: {correct_response: 39,direction: 'right', flanker: 'neutral', location: loc, cue: c, exp_id: 'attention_network_task'}
		  }, 
		  {
			image: '<div class = centerbox><div class = ANT_text>+</div></div><div class = ANT_' + loc + '><div class = ANT_text> &rarr; &rarr; &rarr; &rarr; &rarr; </div></div></div>',
			data: {correct_response: 39, direction: 'right', flanker: 'congruent', location: loc, cue: c, exp_id: 'attention_network_task'}
		  }, 
		  {
			image: '<div class = centerbox><div class = ANT_text>+</div></div><div class = ANT_' + loc + '><div class = ANT_text> &larr; &larr; &rarr; &larr; &larr; </div></div></div>',
			data: {correct_response: 39, direction: 'right', flanker: 'incongruent', location: loc, cue: c, exp_id: 'attention_network_task'}
		  }
	  ]
	  for (i= 0; i < stims.length; i++) {
		test_stimuli.push(stims[i])
	  }
	}
}

/* set up 24 practice trials. Included all nocue up trials, center cue up trials, double cue down trials, and 6 spatial trials (3 up, 3 down) */
var practice_block = jsPsych.randomization.repeat(test_stimuli.slice(0,12).concat(test_stimuli.slice(18,21)).concat(test_stimuli.slice(36,45)),1,true);

/* set up repeats for three test blocks */
var block1_trials = jsPsych.randomization.repeat($.extend(true,[],test_stimuli), 2, true);
var block2_trials = jsPsych.randomization.repeat($.extend(true,[],test_stimuli), 2, true);
var block3_trials = jsPsych.randomization.repeat($.extend(true,[],test_stimuli), 2, true);
var blocks = [block1_trials, block2_trials, block3_trials]


/* ************************************ */
/* Set up jsPsych blocks */
/* ************************************ */

/* define static blocks */
var welcome_block = {
  type: 'text',
  text: '<div class = centerbox><p class = block-text>Welcome to the Attention Network Task experiment. Press any key to begin.</p></div>',
  timing_post_trial: 0
};

var end_block = {
  type: 'text',
  text: '<div class = centerbox><p class = center-block-text>Thanks for completing this task!</p><p class = center-block-text>Press <strong>enter</strong> to continue.</p></div>',
  cont_key: [13],
  timing_post_trial: 0
};

var instructions_block = {
  type: 'poldrack-instructions',
  pages: [
	'<div class = centerbox><p class = block-text>In this experiment you will see groups of five arrows and dashes pointing left or right (e.g &larr; &larr; &larr; &larr; &larr;, or &mdash; &mdash; &rarr; &mdash; &mdash;) presented randomly at the top or bottom of the screen.</p><p class = block-text>Your job is to indicate which way the central arrow is pointing by pressing the corresponding arrow key.</p></p></p></div>',
	'<div class = centerbox><p class = block-text>Before the arrows and dashes come up, an "*" will occasionally come up, either in the center of the screen, at the top and bottom of the screen, or where the arrows and dashes will be presented.</p><p class = block-text>It is important that you respond as quickly and accurately as possible by pressing the arrow key corresponding to the center arrow.</p></div>'	
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

var fixation = {
  type: 'poldrack-single-stim',
  stimulus: '<div class = centerbox><div class = ANT_text>+</div></div>',
  is_html: true,
  choices: 'none',
  data: {exp_id: 'attention_network_task', trial_type: 'fixation', duration: 400},
  timing_post_trial: 0,
  timing_stim: 400,
  timing_response: 400
}

var no_cue = {
  type: 'poldrack-single-stim',
  stimulus: '<div class = centerbox><div class = ANT_text>+</div></div>',
  is_html: true,
  choices: 'none',
  data: {exp_id: 'attention_network_task', trial_type: 'nocue', duration: 100},
  timing_post_trial: 0,
  timing_stim: 100,
  timing_response: 100
}

var center_cue = {
  type: 'poldrack-single-stim',
  stimulus: '<div class = centerbox><div class = ANT_centercue_text>*</div></div>',
  is_html: true,
  choices: 'none',
  data: {exp_id: 'attention_network_task', trial_type: 'centercue', duration: 100},
  timing_post_trial: 0,
  timing_stim: 100,
  timing_response: 100
}

var double_cue = {
  type: 'poldrack-single-stim',
  stimulus: '<div class = centerbox><div class = ANT_text>+</div></div><div class = ANT_down><div class = ANT_text>*</div></div><div class = ANT_up><div class = ANT_text>*</div><div></div>',
  is_html: true,
  choices: 'none',
  data: {exp_id: 'attention_network_task', trial_type: 'doublecue', duration: 100},
  timing_post_trial: 0,
  timing_stim: 100,
  timing_response: 100
}


/* set up ANT experiment */
var attention_network_task_experiment = [];
attention_network_task_experiment.push(welcome_block);
attention_network_task_experiment.push(instructions_block);

/* set up ANT practice */
var trial_num = 0
var block = practice_block
for (i = 0; i < block.data.length; i++) {
	var trial_num = trial_num + 1
	var first_fixation_gap = Math.floor( Math.random() * 1200 ) + 400;
	var first_fixation = {
	  type: 'poldrack-single-stim',
	  stimulus: '<div class = centerbox><div class = ANT_text>+</div></div>',
	  is_html: true,
	  choices: 'none',
	  data: {exp_id: 'attention_network_task', trial_type: 'fixation', duration: 100},
	  timing_post_trial: 0,
	  timing_stim: first_fixation_gap,
	  timing_response: first_fixation_gap
	}
	attention_network_task_experiment.push(first_fixation)
		
	if (block.data[i].cue == 'nocue') {
		attention_network_task_experiment.push(no_cue)
	} else if (block.data[i].cue == 'center') {
		attention_network_task_experiment.push(center_cue)
	} else if (block.data[i].cue == 'double') {
		attention_network_task_experiment.push(double_cue)
	} else {
		var spatial_cue = {
		  type: 'poldrack-single-stim',
		  stimulus: '<div class = centerbox><div class = ANT_' + block.data[i].location +'><div class = ANT_text>*</p></div></div>',
		  is_html: true,
		  choices: 'none',
		  data: {exp_id: 'attention_network_task', trial_type: 'spatialcue', duration: 100},
		  timing_post_trial: 0,
		  timing_stim: 100,
		  timing_response: 100
		}
		attention_network_task_experiment.push(spatial_cue)
	}
	attention_network_task_experiment.push(fixation)
	
	block.data[i].trial_num = trial_num
	block.data[i].exp_id = 'attention_network_task_practice'
	var attention_network_task_practice_trial = {
	  type: 'attention_network_task_practice',
	  stimulus: block.image[i],
	  is_html: true,
	  key_answer: block.data[i].correct_response,
	  correct_text: '<div class = centerbox><div class = center-text>Correct. <br></br>Reaction time: RT ms.</div></div>',
	  incorrect_text: '<div class = centerbox><div class = center-text>Incorrect. <br></br>Reaction time: RT ms.</div></div>',
	  timeout_message: '<div class = centerbox><div class = center-text>Respond faster!</div></div>',
	  choices: [37,39],
	  data: block.data[i],
	  timing_response: 1700, 
	  timing_stim: 1700,
	  timing_feedback_duration: 1000,
	  show_stim_with_feedback: false,
	  timing_post_trial: 0
	}
	attention_network_task_experiment.push(attention_network_task_practice_trial)

	var last_fixation = {
	  type: 'poldrack-single-stim',
	  stimulus: '<div class = centerbox><div class = ANT_text>+</div></div>',
	  is_html: true,
	  choices: 'none',
	  data: {exp_id: 'attention_network_task', trial_type: 'fixation', duration: 100},
	  timing_post_trial: 0,
	  timing_stim: post_trial_gap,
	  timing_response: post_trial_gap
	}
	attention_network_task_experiment.push(last_fixation)
}
attention_network_task_experiment.push(rest_block)


/* Set up ANT main task */
var trial_num = 0
for (b = 0; b < blocks.length; b ++) {
	var block = blocks[b]
	for (i = 0; i < block.data.length; i++) {
		var trial_num = trial_num + 1
		var first_fixation_gap = Math.floor( Math.random() * 1200 ) + 400;
		var first_fixation = {
		  type: 'poldrack-single-stim',
		  stimulus: '<div class = centerbox><div class = ANT_text>+</div></div>',
		  is_html: true,
		  choices: 'none',
		  data: {exp_id: 'fixation', duration: first_fixation_gap},
		  timing_post_trial: 0,
		  timing_stim: first_fixation_gap,
		  timing_response: first_fixation_gap
		}
		attention_network_task_experiment.push(first_fixation)
			
		if (block.data[i].cue == 'nocue') {
			attention_network_task_experiment.push(no_cue)
		} else if (block.data[i].cue == 'center') {
			attention_network_task_experiment.push(center_cue)
		} else if (block.data[i].cue == 'double') {
			attention_network_task_experiment.push(double_cue)
		} else {
			var spatial_cue = {
			  type: 'poldrack-single-stim',
			  stimulus: '<div class = centerbox><div class = ANT_' + block.data[i].location +'><div class = ANT_text>*</p></div></div>',
			  is_html: true,
			  choices: 'none',
			  data: {exp_id: 'spatialcue', duration: 100},
			  timing_post_trial: 0,
			  timing_stim: 100,
			  timing_response: 100
			}
			attention_network_task_experiment.push(spatial_cue)
		}
		attention_network_task_experiment.push(fixation)
		
		block.data[i].trial_num = trial_num
		var ANT_trial = {
		  type: 'poldrack-single-stim',
		  stimulus: block.image[i],
		  is_html: true,
		  choices: [37,39],
		  data: block.data[i],
		  timing_response: 1700, 
		  timing_stim: 1700,
		  timing_post_trial: 0
		}
		attention_network_task_experiment.push(ANT_trial)
	
		var last_fixation = {
		  type: 'poldrack-single-stim',
		  stimulus: '<div class = centerbox><div class = ANT_text>+</div></div>',
		  is_html: true,
		  choices: 'none',
		  data: {exp_id: 'fixation'},
		  timing_post_trial: 0,
		  timing_stim: post_trial_gap,
		  timing_response: post_trial_gap
		}
		attention_network_task_experiment.push(last_fixation)
	}
	attention_network_task_experiment.push(rest_block)
}

attention_network_task_experiment.push(end_block)
