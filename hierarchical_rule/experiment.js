/* ************************************ */
/* Define helper functions */
/* ************************************ */
var randomDraw = function(lst) {
    var index = Math.floor(Math.random()*(lst.length))
    return lst[index]
}

var getFeedback = function() {
	var last_trial = jsPsych.data.getLastTrialData()
	if (last_trial.key_press == -1) {
		return '<div class = centerbox><div class = hierarchical-center-text>Respond faster!</div></div>'
	} else if (last_trial.key_press == last_trial.correct_response) {
		return '<div class = centerbox><div class = hierarchical-center-text>Correct</div></div>'
	} else {
		return '<div class = centerbox><div class = hierarchical-center-text>Incorrect</div></div>'
	}
}

/* ************************************ */
/* Define experimental variables */
/* ************************************ */
var exp_len = 20 //number of trials per rule-set
var flat_first = 0//  Math.floor(Math.random())
var path_source = 'static/experiments/hierarchical_rule/images/'
var stim_prefix = '<div class = centerbox><div class = stimBox><img class = hierarchicalStim src ='
var border_prefix = '<img class = hierarchicalBorder src ='
var prompt_prefix = '<img class = hierarchicalPrompt src ='
var postfix = ' </img></div></div>'
var choices = [37,39, 40]
//generate stims
flat_stims = []
hierarchical_stims = []
colors = jsPsych.randomization.shuffle([1, 2, 3, 4]) //border colors
stims = jsPsych.randomization.shuffle([1, 2, 3, 4, 5, 6])
orientations = [1, 2, 3]
random_correct = jsPsych.randomization.repeat(choices,3) // correct responses for random stim
for (var c=0; c < colors.length; c++) {
	for (var s = 0; s < stims.length/2; s++) {
		for (var o = 0; o < orientations.length; o++) {
			if (c < colors.length/2) {
				flat_stims.push({image: stim_prefix + path_source + stims[s] + orientations[o] + '.bmp </img>' + border_prefix + path_source + colors[c] + '_border.png' + postfix,
					data: {stim: stims[s], orientation: orientations[o], border: colors[c], correct_response: random_correct.pop()}})
			} else {
				if (c ==2) {
					correct_response = choices[s-1]
				} else if (c == 3) {
					correct_response = choices[o-1]
				}
				hierarchical_stims.push({image: stim_prefix + path_source + stims[s + (stims.length/2)] + orientations[o] + '.bmp </img>' + border_prefix + path_source + colors[c] + '_border.png' + postfix,
					data: {stim: stims[s + (stims.length/2)], orientation: orientations[o], border: colors[c], correct_response: correct_response}})
			}
		}
	}
}
flat_stims = jsPsych.randomization.repeat(flat_stims,20,true)
hierarchical_stims = jsPsych.randomization.repeat(hierarchical_stims,20,true)



/* ************************************ */
/* Set up jsPsych blocks */
/* ************************************ */
/* define static blocks */

var welcome_block = {
  type: 'text',
  text: '<div class = centerbox><p class = block-text>Welcome to the experiment. Press <strong>enter</strong> to begin.</p></div>',
  cont_key: 13,
  timing_post_trial: 0,
  on_finish: function() {
  	$('body').css('background','black')
  	$('p').css('color','white')
  },
};


var instructions_block = {
  type: 'instructions',
  pages: [
    '<div class = centerbox><p class = hierarchical-block-text>In this experiment you will see a sequence of letters presented one at a time. Your job is to remember the last four letters presented and report them at the end of the sequence.</p><p class = hierarchical-block-text>For instance, if the sequence F...J...K...N...F...L is presented, you would report KNFL.</p><p class = hierarchical-block-text>The sequences vary in length so it is important that you keep track of each letter. To ensure this, while doing the task repeat the last four letters (or less if less than four letters had been shown) out loud or to yourself while the letters are being presented.</p></div>',
	'<div class = centerbox><p class = hierarchical-block-text>We will start with two practice sequences. Following will be 12 test blocks.</p></div>'
  ],
  allow_keys: false,
  show_clickable_nav: true,
  timing_post_trial: 1000
};

var end_block = {
  type: 'text',
  text: '<div class = centerbox><p class = center-hierarchical-block-text>Finished with this task.</p><p class = center-hierarchical-block-text>Press <strong>enter</strong> to begin.</p></div>',
  cont_key: 13,
  timing_post_trial: 0,
  on_finish: function() {
  	$('body').css('background','white')
  }
};

var start_practice_block = {
  type: 'text',
  text: '<div class = centerbox><p class = center-hierarchical-block-text>Starting a practice block.</p><p class = center-hierarchical-block-text>Press <strong>enter</strong> to begin.</p></div>',
  cont_key: 13,
  timing_post_trial: 1000
};

var start_test_block = {
  type: 'text',
  text: '<div class = centerbox><p class = center-hierarchical-block-text>Starting a test block.</p><p class = center-hierarchical-block-text>Press <strong>enter</strong> to begin.</p></div>',
  cont_key: 13,
  timing_post_trial: 1000
};

var feedback_block = {
  type: 'single-stim',
  stimuli: getFeedback,
  is_html: true,
  choices: 'none',
  data: {exp_id: "hierarchical_rule", "trial_id": "feedback"},
  response_ends_trial: false,
  timing_post_trial: 0,
  timing_stim: 1000,
  timing_response: 1500
}

//Set up experiment
var hierarchical_rule_experiment = []
hierarchical_rule_experiment.push(welcome_block);
hierarchical_rule_experiment.push(instructions_block);
hierarchical_rule_experiment.push(start_test_block);
flat_trials = []
for (var i = 0; i < exp_len; i++) {
	var flat_stim_block = {
	  type: 'single-stim',
	  stimuli: flat_stims.image[i],
	  is_html: true,
	  choices: choices,
	  data: flat_stims.data[i],
	  response_ends_trial: false,
	  timing_stim: 1000,
	  timing_response: 3000,
	  prompt: prompt_prefix + path_source + 'FIX_GREEN.png' + ' style:"z-index: -1"' + postfix,
	  timing_post_trial: 0,
	  on_finish: function() {
	  	jsPsych.data.addDataToLastTrial({exp_id: "hierarchical_rule", "trial_id": "flat_stim"})
	  }
	}
	flat_trials.push(flat_stim_block)
	flat_trials.push(feedback_block)
}

hierarchical_trials = []
for (var i = 0; i < exp_len; i++) {
	var  hierarchical_stim_block = {
	  type: 'single-stim',
	  stimuli: hierarchical_stims.image[i],
	  is_html: true,
	  choices: choices,
	  data: hierarchical_stims.data[i],
	  response_ends_trial: false,
	  timing_stim: 1000,
	  timing_response: 3000,
	  prompt: prompt_prefix + path_source + 'FIX_GREEN.png' + ' style:"z-index: -1"' + postfix,
	  timing_post_trial: 0,
	  on_finish: function() {
	  	jsPsych.data.addDataToLastTrial({exp_id: "hierarchical_rule", "trial_id": "hierarchical_stim"})
	  }
	}
	hierarchical_trials.push(hierarchical_stim_block)
	hierarchical_trials.push(feedback_block)
}

if (flat_first == 1) {
	hierarchical_rule_experiment = hierarchical_rule_experiment.concat(flat_trials)
	hierarchical_rule_experiment.push(start_test_block);
	hierarchical_rule_experiment = hierarchical_rule_experiment.concat(hierarchical_trials)
} else {
	hierarchical_rule_experiment = hierarchical_rule_experiment.concat(hierarchical_trials)
	hierarchical_rule_experiment.push(start_test_block);
	hierarchical_rule_experiment = hierarchical_rule_experiment.concat(flat_trials)
}

hierarchical_rule_experiment.push(end_block)
