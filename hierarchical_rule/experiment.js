/* ************************************ */
/* Define helper functions */
/* ************************************ */
var randomDraw = function(lst) {
    var index = Math.floor(Math.random()*(lst.length))
    return lst[index]
}

var getFixLength = function() {
	return 250 + Math.random()*500
}
var getFeedback = function() {
	var last_trial = jsPsych.data.getLastTrialData()
	if (last_trial.key_press == -1) {
		return '<div class = centerbox><div class = "white-text center-text">Respond faster!</div></div>'
	} else if (last_trial.key_press == last_trial.correct_response) {
		correct += 1
		return '<div class = centerbox><div class = "white-text center-text">Correct</div></div>'
	} else {
		return '<div class = centerbox><div class = "white-text center-text">Incorrect</div></div>'
	}
}

/* ************************************ */
/* Define experimental variables */
/* ************************************ */
var exp_len = 200 //number of trials per rule-set
var flat_first = 0//  Math.floor(Math.random())
var path_source = 'static/experiments/hierarchical_rule/images/'
var stim_prefix = '<div class = centerbox><div class = stimBox><img class = hierarchicalStim src ='
var border_prefix = '<img class = hierarchicalBorder src ='
var prompt_prefix = '<img class = hierarchicalPrompt src ='
var postfix = ' </img></div></div>'
var choices = [74,75,76]
var correct = 0 // tracks correct trials

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
				flat_stims.push({stimulus: stim_prefix + path_source + stims[s] + orientations[o] + '.bmp </img>' + border_prefix + path_source + colors[c] + '_border.png' + postfix,
					data: {stim: stims[s], orientation: orientations[o], border: colors[c], correct_response: random_correct.pop()}})
			} else {
				if (c ==2) {
					correct_response = choices[s-1]
				} else if (c == 3) {
					correct_response = choices[o-1]
				}
				hierarchical_stims.push({stimulus: stim_prefix + path_source + stims[s + (stims.length/2)] + orientations[o] + '.bmp </img>' + border_prefix + path_source + colors[c] + '_border.png' + postfix,
					data: {stim: stims[s + (stims.length/2)], orientation: orientations[o], border: colors[c], correct_response: correct_response}})
			}
		}
	}
}
// flat_stims = jsPsych.randomization.repeat(flat_stims,20,true)
// hierarchical_stims = jsPsych.randomization.repeat(hierarchical_stims,20,true)
// Change structure of object array to work with new structure
flat_stims = jsPsych.randomization.repeat(flat_stims,20)
hierarchical_stims = jsPsych.randomization.repeat(hierarchical_stims,20)

instructions_grid = '<div class = gridBox>'
for (var c =0; c < colors.length/2; c++) {
	for (var s = 0; s < stims.length/2; s++) {
		for (var o = 0; o < orientations.length; o++) {
			instructions_grid += 
				'<div class = imgGridBox><img class = gridImage src = ' + path_source + stims[s] + orientations[o] + '.bmp </img>'
			instructions_grid += 
				'<img class = gridBorder src = ' + path_source + colors[c] + '_border.png </img></div>' 
		}
	}
}
instructions_grid += '</div>'


/* ************************************ */
/* Set up jsPsych blocks */
/* ************************************ */
/* define static blocks */

var welcome_block = {
  type: 'text',
  text: '<div class = centerbox><p class = block-text>Welcome to the experiment. Press <strong>enter</strong> to begin.</p></div>',
  cont_key: [13],
  timing_post_trial: 0,
  on_finish: function() {
  	$('body').css('background','black')
  },
};



var instructions_block = {
  type: 'instructions',
  pages: [
    '<div class = centerbox><p class = "white-text block-text">In this experiment stimuli will come up one at a time. You should respond to them by pressing the J, K or L keys, after which you will receive feedback about whether you were right or not. If you were correct you will get points which contribute to your bonus payment.</p><p class = "white-text block-text">Your job is to get as many trials correct as possible! On the next page are the stimuli you will be responding to.</p></div>',
    	instructions_grid,
    	'<div class = centerbox><p class = "white-text block-text">Make sure you are familiar with the stimuli on the last page. Remember, respond to the stimuli by pressing J, K, or L. You will get a bonus based on your performance so try your best!</p><p class = "white-text block-text">This experiment will take about 30 minutes. There will be a break half way through. Good luck!</p></div>'
  ],
  allow_keys: false,
  show_clickable_nav: true,
  // timing_post_trial: 1000
};

var end_block = {
  type: 'text',
  text: '<div class = centerbox><p class = center-"white-text block-text">Thanks for completing this task!</p><p class = center-"white-text block-text">Press <strong>enter</strong> to begin.</p></div>',
  cont_key: [13],
  timing_post_trial: 0,
  on_finish: function() {
  	$('body').css('background','white')
  }
};


var start_test_block = {
  type: 'text',
  text: '<div class = centerbox><p class = "white-text block-text">We will now start the test.</p><p class = center-"white-text block-text">Press <strong>enter</strong> to begin.</p></div>',
  cont_key: [13],
  timing_post_trial: 1000
};

var fixation_block = {
  type: 'single-stim',
  // stimuli: prompt_prefix + path_source + 'FIX.png' + ' style:"z-index: -1"' + postfix,
  stimulus: prompt_prefix + path_source + 'FIX.png' + ' style:"z-index: -1"' + postfix,
  is_html: true,
  choices: 'none',
  data: {exp_id: "hierarchical_rule", "trial_id": "feedback"},
  response_ends_trial: false,
  timing_post_trial: 0,
  timing_stim: -1,
  timing_response: getFixLength
}

var feedback_block = {
  type: 'single-stim',
  // stimuli: getFeedback,
  stimulus: getFeedback,
  is_html: true,
  choices: 'none',
  // aze: check if you need quotes around trial_id
  data: {exp_id: "hierarchical_rule", "trial_id": "feedback"},
  response_ends_trial: false,
  timing_post_trial: 0,
  timing_stim: 1000,
  timing_response: 1000
}

//Set up experiment
var hierarchical_rule_experiment = []
hierarchical_rule_experiment.push(welcome_block);
hierarchical_rule_experiment.push(instructions_block);
hierarchical_rule_experiment.push(start_test_block);
// flat_trials = []
// for (var i = 0; i < exp_len; i++) {
// 	var flat_stim_block = {
// 	  type: 'single-stim',
// 	  // stimuli: flat_stims.image[i],
// 	  timeline: flat_stims.image,
// 	  is_html: true,
// 	  choices: choices,
// 	  data: flat_stims.data[i],
// 	  response_ends_trial: false,
// 	  timing_stim: 1000,
// 	  timing_response: 3000,
// 	  prompt: prompt_prefix + path_source + 'FIX_GREEN.png' + ' style:"z-index: -1"' + postfix,
// 	  timing_post_trial: 0,
// 	  on_finish: function() {
// 	  	jsPsych.data.addDataToLastTrial({exp_id: "hierarchical_rule", "trial_id": "flat_stim"})
// 	  }
// 	}
// 	flat_trials.push(fixation_block)
// 	flat_trials.push(flat_stim_block)
// 	flat_trials.push(feedback_block)
// }

// hierarchical_trials = []
// for (var i = 0; i < exp_len; i++) {
// 	var  hierarchical_stim_block = {
// 	  type: 'single-stim',
// 	  stimuli: hierarchical_stims.image[i],
// 	  is_html: true,
// 	  choices: choices,
// 	  data: hierarchical_stims.data[i],
// 	  response_ends_trial: false,
// 	  timing_stim: 1000,
// 	  timing_response: 3000,
// 	  prompt: prompt_prefix + path_source + 'FIX_GREEN.png' + ' style:"z-index: -1"' + postfix,
// 	  timing_post_trial: 0,
// 	  on_finish: function() {
// 	  	jsPsych.data.addDataToLastTrial({exp_id: "hierarchical_rule", "trial_id": "hierarchical_stim"})
// 	  }
// 	}
// 	hierarchical_trials.push(fixation_block)
// 	hierarchical_trials.push(hierarchical_stim_block)
// 	hierarchical_trials.push(feedback_block)
// }

// note this setup doesn't necessarily involve less code but is in line with the design of the package and is more efficient

//create flat_stim_block and hierarchical_stim_block's w just stimuli w/out the loops
var cur_len_flat = 0

var flat_stim_block = {
	  type: 'single-stim',
	  // stimuli: flat_stims.image[i],
	  timeline: flat_stims,
	  is_html: true,
	  choices: choices,
	  //data: flat_stims.data[i],
	  response_ends_trial: false,
	  timing_stim: 1000,
	  timing_response: 3000,
	  prompt: prompt_prefix + path_source + 'FIX_GREEN.png' + ' style:"z-index: -1"' + postfix,
	  timing_post_trial: 0,
	  on_finish: function() {
	  	jsPsych.data.addDataToLastTrial({exp_id: "hierarchical_rule", "trial_id": "flat_stim"})
	  	cur_len_flat++
	  }
}

var cur_len_hierarchical = 0

var hierarchical_stim_block = {
	  type: 'single-stim',
	  // stimuli: flat_stims.image[i],
	  timeline: hierarchical_stims,
	  is_html: true,
	  choices: choices,
	  //data: flat_stims.data[i],
	  response_ends_trial: false,
	  timing_stim: 1000,
	  timing_response: 3000,
	  prompt: prompt_prefix + path_source + 'FIX_GREEN.png' + ' style:"z-index: -1"' + postfix,
	  timing_post_trial: 0,
	  on_finish: function() {
	  	jsPsych.data.addDataToLastTrial({exp_id: "hierarchical_rule", "trial_id": "hierarchical_stim"})
	  	cur_len_hierarchical++
	  }
}

// loop nodes instead of creating a huge array with three blocks for all trials
var flat_loop_node = {
    timeline: [fixation_block, flat_stim_block, feedback_block],
    loop_function: function(data){
        if(cur_len_flat < exp_len){
            return true;
        } else {
            return false;
        }
    }
}

var hierarchical_loop_node = {
    timeline: [fixation_block, hierarchical_stim_block, feedback_block],
    loop_function: function(data){
        if(cur_len_hierarchical < exp_len){
            return true;
        } else {
            return false;
        }
    }
}

// setup exp w loop nodes after pushing the practice etc. blocks
if (flat_first == 1){
	hierarchical_rule_experiment.push(flat_loop_node, start_test_block, hierarchical_loop_node);
}
else {
	hierarchical_rule_experiment.push(hierarchical_loop_node, start_test_block, flat_loop_node);
}

// if (flat_first == 1) {
// 	hierarchical_rule_experiment = hierarchical_rule_experiment.concat(flat_trials)
// 	hierarchical_rule_experiment.push(start_test_block);
// 	hierarchical_rule_experiment = hierarchical_rule_experiment.concat(hierarchical_trials)
// } else {
// 	hierarchical_rule_experiment = hierarchical_rule_experiment.concat(hierarchical_trials)
// 	hierarchical_rule_experiment.push(start_test_block);
// 	hierarchical_rule_experiment = hierarchical_rule_experiment.concat(flat_trials)
// }

hierarchical_rule_experiment.push(end_block)
