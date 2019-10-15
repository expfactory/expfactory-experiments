/* ************************************ */
/* Define experimental variables */
/* ************************************ */

/* Global task variables */
var current_trial = 0
//@McKenzie - the vars below are only used once?
var rtMedians = []
var stopAccMeans =[]	
var RT_thresh = 1000
var rt_diff_thresh = 75
var missed_response_thresh = 0.1
var accuracy_thresh = 0.8
var stop_thresh = 0.2	

var practice_len = 12
var exp_len = 125
var num_blocks = 3
var block_len = exp_len/num_blocks
var test_block_data = []

//hardcoded variables for counterbalancing, specific array gotten through scan_order
var ITIs = [
	[0.0,0.408,0.408,0.0,0.0,0.136,0.544,0.136,0.0,0.0,0.0,0.408,0.408,0.0,0.272,0.0,0.272,0.272,0.272,0.136,0.272,0.272,0.136,0.0,0.272,0.544,0.272,0.136,0.0,0.0,0.0,0.0,0.272,0.0,0.0,0.0,0.0,0.136,0.0,0.0,0.0,0.0,0.272,0.136,0.272,0.0,0.136,0.136,0.0,0.136,0.136,0.136,0.408,0.272,0.0,0.68,0.0,0.272,0.0,0.0,0.0,0.0,0.272,0.816,0.0,0.136,0.136,0.272,0.136,0.136,0.544,0.136,0.0,0.272,0.136,0.136,0.0,0.136,0.0,0.0,0.0,0.136,0.0,0.0,0.136,0.136,0.0,0.272,0.0,0.136,0.0,0.0,0.136,0.272,0.136,0.272,0.68,0.272,0.272,0.0,0.272,0.136,0.0,0.136,0.0,0.136,0.272,0.0,0.136,0.408,0.0,0.952,0.136,0.136,0.272,0.0,0.0,0.0,0.68,0.272,0.272,0.0,0.272,0.0,0.136],
	[0.136,0.272,0.68,0.272,0.272,0.0,0.272,0.136,0.0,0.136,0.0,0.136,0.272,0.0,0.136,0.408,0.0,0.952,0.136,0.136,0.272,0.0,0.0,0.0,0.68,0.272,0.272,0.0,0.272,0.0,0.136,0.0,0.408,0.408,0.0,0.0,0.136,0.544,0.136,0.0,0.0,0.0,0.408,0.408,0.0,0.272,0.0,0.272,0.272,0.272,0.136,0.272,0.272,0.136,0.0,0.272,0.544,0.272,0.136,0.0,0.0,0.0,0.0,0.272,0.0,0.0,0.0,0.0,0.136,0.0,0.0,0.0,0.0,0.272,0.136,0.272,0.0,0.136,0.136,0.0,0.136,0.136,0.136,0.408,0.272,0.0,0.68,0.0,0.272,0.0,0.0,0.0,0.0,0.272,0.816,0.0,0.136,0.136,0.272,0.136,0.136,0.544,0.136,0.0,0.272,0.136,0.136,0.0,0.136,0.0,0.0,0.0,0.136,0.0,0.0,0.136,0.136,0.0,0.272,0.0,0.136,0.0,0.0,0.136,0.272],
	[0.816,0.0,0.136,0.136,0.272,0.136,0.136,0.544,0.136,0.0,0.272,0.136,0.136,0.0,0.136,0.0,0.0,0.0,0.136,0.0,0.0,0.136,0.136,0.0,0.272,0.0,0.136,0.0,0.0,0.136,0.272,0.136,0.272,0.68,0.272,0.272,0.0,0.272,0.136,0.0,0.136,0.0,0.136,0.272,0.0,0.136,0.408,0.0,0.952,0.136,0.136,0.272,0.0,0.0,0.0,0.68,0.272,0.272,0.0,0.272,0.0,0.136,0.0,0.408,0.408,0.0,0.0,0.136,0.544,0.136,0.0,0.0,0.0,0.408,0.408,0.0,0.272,0.0,0.272,0.272,0.272,0.136,0.272,0.272,0.136,0.0,0.272,0.544,0.272,0.136,0.0,0.0,0.0,0.0,0.272,0.0,0.0,0.0,0.0,0.136,0.0,0.0,0.0,0.0,0.272,0.136,0.272,0.0,0.136,0.136,0.0,0.136,0.136,0.136,0.408,0.272,0.0,0.68,0.0,0.272,0.0,0.0,0.0,0.0,0.272],
	[0.272,0.0,0.0,0.0,0.0,0.136,0.0,0.0,0.0,0.0,0.272,0.136,0.272,0.0,0.136,0.136,0.0,0.136,0.136,0.136,0.408,0.272,0.0,0.68,0.0,0.272,0.0,0.0,0.0,0.0,0.272,0.816,0.0,0.136,0.136,0.272,0.136,0.136,0.544,0.136,0.0,0.272,0.136,0.136,0.0,0.136,0.0,0.0,0.0,0.136,0.0,0.0,0.136,0.136,0.0,0.272,0.0,0.136,0.0,0.0,0.136,0.272,0.136,0.272,0.68,0.272,0.272,0.0,0.272,0.136,0.0,0.136,0.0,0.136,0.272,0.0,0.136,0.408,0.0,0.952,0.136,0.136,0.272,0.0,0.0,0.0,0.68,0.272,0.272,0.0,0.272,0.0,0.136,0.0,0.408,0.408,0.0,0.0,0.136,0.544,0.136,0.0,0.0,0.0,0.408,0.408,0.0,0.272,0.0,0.272,0.272,0.272,0.136,0.272,0.272,0.136,0.0,0.272,0.544,0.272,0.136,0.0,0.0,0.0,0.0]
];

var stim_index = [
	[1,0,0,0,0,0,1,1,1,1,1,0,0,0,0,0,1,0,1,1,1,0,0,0,0,0,1,1,0,1,1,1,0,0,1,0,0,0,0,1,0,1,1,0,0,1,0,0,0,0,0,1,0,0,1,1,0,0,1,0,0,0,0,1,1,0,1,0,0,0,1,0,1,1,1,0,1,0,0,1,0,0,1,1,1,1,0,1,0,0,0,1,0,0,0,0,1,0,0,0,1,0,0,0,0,1,0,1,1,0,1,0,0,0,1,0,1,1,0,0,0,0,1,1,0],
	[0,0,1,0,0,0,1,0,0,0,0,1,0,1,1,0,1,0,0,0,1,0,1,1,0,0,0,0,1,1,0,1,0,0,0,0,0,1,1,1,1,1,0,0,0,0,0,1,0,1,1,1,0,0,0,0,0,1,1,0,1,1,1,0,0,1,0,0,0,0,1,0,1,1,0,0,1,0,0,0,0,0,1,0,0,1,1,0,0,1,0,0,0,0,1,1,0,1,0,0,0,1,0,1,1,1,0,1,0,0,1,0,0,1,1,1,1,0,1,0,0,0,1,0,0],
	[1,1,0,1,0,0,0,1,0,1,1,1,0,1,0,0,1,0,0,1,1,1,1,0,1,0,0,0,1,0,0,0,0,1,0,0,0,1,0,0,0,0,1,0,1,1,0,1,0,0,0,1,0,1,1,0,0,0,0,1,1,0,1,0,0,0,0,0,1,1,1,1,1,0,0,0,0,0,1,0,1,1,1,0,0,0,0,0,1,1,0,1,1,1,0,0,1,0,0,0,0,1,0,1,1,0,0,1,0,0,0,0,0,1,0,0,1,1,0,0,1,0,0,0,0],
	[0,0,1,0,0,0,0,1,0,1,1,0,0,1,0,0,0,0,0,1,0,0,1,1,0,0,1,0,0,0,0,1,1,0,1,0,0,0,1,0,1,1,1,0,1,0,0,1,0,0,1,1,1,1,0,1,0,0,0,1,0,0,0,0,1,0,0,0,1,0,0,0,0,1,0,1,1,0,1,0,0,0,1,0,1,1,0,0,0,0,1,1,0,1,0,0,0,0,0,1,1,1,1,1,0,0,0,0,0,1,0,1,1,1,0,0,0,0,0,1,1,0,1,1,1]
];

//practice counter to cap practice at 3 blocks
var practice_repeats = 0
// task specific variables
// Define and load images
var prefix = '/static/experiments/stop_signal__fmri/images/'
var images = [prefix + 'moon.png', prefix + 'oval.png', prefix + 'rectangle.png', prefix +
	'trapezoid.png'
]
jsPsych.pluginAPI.preloadImages(images);

/* Stop signal delay in ms */
var SSD = 250
var stop_signal =
	'<div class = coverbox></div><div class = stopbox><div class = centered-shape id = stop-signal></div><div class = centered-shape id = stop-signal-inner></div></div>'

/* Instruction Prompt */
var possible_responses = [
	["index finger", 89],
	["middle finger", 71]
]
// set up responses
var choices = [possible_responses[0][1], possible_responses[1][1]]
var response_permutations = [[0,0,1,1], [0,1,0,1], [0,1,1,0], 
							[1,1,0,0], [1,0,1,0], [1,0,0,1]]



//iterators for practice blocks
var keyCounter = [];
var pracDataCounter = [];
var pracStimCounter = [];

for (i = 0; i < practice_len*3; i++) {
	keyCounter.push(i);
	pracDataCounter.push(i);
	pracStimCounter.push(i);
}

//iterators for test blocks
var stimCounter = [];
var typeCounter = [];
var dataCounter = [];
var timingResponseCounter = [];

for (i = 0; i < exp_len; i++) {
  stimCounter.push(i);
  typeCounter.push(i);
  dataCounter.push(i);
  timingResponseCounter.push(i);
}


/* ************************************ */
/* Define helper functions */
/* ************************************ */

var get_ITI = function(iti) {
	return 2250 + iti*1000 // 500 minimum ITI
}

var randomDraw = function(lst) {
	var index = Math.floor(Math.random() * (lst.length))
	return lst[index]
}

/* Staircase procedure. After each successful stop, make the stop signal delay longer (making stopping harder) */
var updateSSD = function(data) {
	if (data.SS_trial_type == 'stop') {
		if (data.rt == -1 && SSD < 1000) {
			SSD = SSD + 50
		} else if (data.rt != -1 && SSD > 0) {
			SSD = SSD - 50
		}
	}
}

var getSSD = function() {
	return SSD
}

var getPracticeTrials = function() {
	var practice_trials = [];
	for (i = 0; i < practice_len; i++) {
		var practice_trial = {
			type: 'poldrack-categorize',
			key_answer: function() {
				practice_stim = jsPsych.data.getDataByTrialIndex(1).practice_stims;
				return practice_stim[keyPop()].key_answer; 
			},
			data: function() {
				practice_stim = jsPsych.data.getDataByTrialIndex(1).practice_stims;
				return practice_stim[pracDataPop()].data; 
			},
			stimulus: function() {
				practice_stim = jsPsych.data.getDataByTrialIndex(1).practice_stims;
				return practice_stim[pracStimPop()].stimulus; 
			},
			is_html: true,
			choices: choices,
			timing_stim: 850,
			timing_response: 1850,
			correct_text: '<div class = feedbackbox><div style="color:#4FE829"; class = center-text>Correct!</p></div>',
			incorrect_text: '<div class = feedbackbox><div style="color:red"; class = center-text>Incorrect</p></div>',
			timeout_message: '<div class = feedbackbox><div class = center-text>Too Slow</div></div>',
			show_stim_with_feedback: false,
			timing_feedback_duration: 500,
			timing_post_trial: 250,
			on_finish: function(data) {
				jsPsych.data.addDataToLastTrial({
					exp_stage: 'practice',
					trial_num: current_trial,
				})
			current_trial += 1
			// console.log('Trial: ' + current_trial +
			//   '\nCorrect Response? ' + data.correct + ', RT: ' + data.rt)
			}	
	}
	practice_trials.push(practice_trial)
	}
	return practice_trials;
}

/* Iterators */
//iterators for practice blocks
var keyPop = function() {
	return keyCounter.shift();
}

var pracDataPop = function() {
	return pracDataCounter.shift();
}

var pracStimPop = function() {
	return pracStimCounter.shift();
}

//iterators for test blocks
var typePop = function() {
	return typeCounter.shift();
}

var stimPop = function() {
	return stimCounter.shift();
}

var dataPop = function() {
	return dataCounter.shift();
}

var timingPop = function() {
	return timingResponseCounter.shift()
}


/* ************************************ */
/* Set up jsPsych blocks */
/* ************************************ */
var stop_signal__fmri_experiment = [];

/* define static blocks  */
//setup experimenter input
var scan_order_setup_block = {
	type: 'survey-text',
	data: {
		trial_id: "scan_order_setup"
	},
	questions: [
		[
			"<p class = center-block-text>Scanner order:</p>"
		]
	], on_finish: function(data) {
		data.scan_order = parseInt(data.responses.slice(7))
	}
}

//gets permutation index, sets up practice and test block info
var permutation_setup_block = {
	type: 'survey-text',
	data: {
		trial_id: "permutation_setup"
	},
	questions: [
		[
			"<p class = center-block-text>Experiment Permutation order (xx):</p>"
		]
	], on_finish: function(data) { //BUILDS PRACTICE AND TEST TRIALS
		var permutation_index = parseInt(data.responses.slice(7, 10));
		var permutation = response_permutations[permutation_index];
		var correct_responses = [];
		for (var i=0; i<4; i++) {
			correct_responses.push(possible_responses[permutation[i]]);
		}
		console.log('possible_responses pre randomization.shuffle: '+ possible_responses[0] + ', ' + possible_responses[1])
		jsPsych.randomization.shuffle([possible_responses[0], possible_responses[0], //@McKenzie I'm not confident that this is doing anything
			possible_responses[1], possible_responses[1]
		])
		console.log('possible_responses post randomization.shuffle: '+ possible_responses[0] + ', ' + possible_responses[1])
		var stims = [{
			stimulus: '<div class = coverbox></div><div class = shapebox><img class = stim src = ' + images[0] + '></img></div>',
			data: {
				correct_response: correct_responses[0][1],
				trial_id: 'stim',
			}
		}, {
			stimulus: '<div class = coverbox></div><div class = shapebox><img class = stim src = ' + images[1] + '></img></div>',
			data: {
				correct_response: correct_responses[1][1],
				trial_id: 'stim',
			}
		}, {
			stimulus: '<div class = coverbox></div><div class = shapebox><img class = stim src = ' + images[2] + '></img></div>',
			data: {
				correct_response: correct_responses[2][1],
				trial_id: 'stim',
			}
		}, {
			stimulus: '<div class = coverbox></div><div class = shapebox><img class = stim src = ' + images[3] + '></img></div>',
			data: {
				correct_response: correct_responses[3][1],
				trial_id: 'stim',
			}
		}];

		//build up practice stims
		var practice_stims1 = jsPsych.randomization.repeat(stims, practice_len/4);
		var practice_stims2 = jsPsych.randomization.repeat(stims, practice_len/4);
		var practice_stims3 = jsPsych.randomization.repeat(stims, practice_len/4);
		var practice_stims = practice_stims1.concat(practice_stims2).concat(practice_stims3);
		for (var i = 0; i < practice_stims.length; i++) {
			practice_stims[i].key_answer = practice_stims[i].data.correct_response
		}

		//build up test trials
		var go_stims = jsPsych.randomization.repeat(stims, exp_len*0.6 / 4);
		var stop_stims = jsPsych.randomization.repeat(stims, exp_len*0.4 / 4);
		var trials = [];
		var scan_order = jsPsych.data.getDataByTrialIndex(0).scan_order
		var stim_index_subset = stim_index[scan_order]
		for (var i=0; i<exp_len; i++) {
			var stim = {}
			if (stim_index_subset[i] === 0) {
				stim = jQuery.extend({},go_stims.shift())
				stim.SS_trial_type = 'go'
			} else {
				stim = jQuery.extend({},stop_stims.shift())
				stim.SS_trial_type= 'stop'
			} 
			trials.push(stim)
			// refill if necessary
			if (go_stims.length === 0) {
				go_stims = jsPsych.randomization.repeat(stims, exp_len*0.6 / 4)
			} 
			if (stop_stims.length === 0) {
				stop_stims = jsPsych.randomization.repeat(stims, exp_len*0.4 / 4)
			} 
		}
		

		data.permutation_index = permutation_index;
		data.permutation = permutation;
		data.correct_responses = correct_responses;
		data.stims = stims;
		data.go_stims = go_stims;
		data.stop_stims = stop_stims;
		data.stim_index_subset = stim_index_subset;
		data.practice_stims = practice_stims;
		data.trials = trials;
	}
}

var SSD_setup_block = {
	type: 'survey-text',
	data: {
		trial_id: "SSD_setup"
	},
	questions: [
		[
			"<p class = center-block-text>SSD:</p>"
		]
	], on_finish: function(data) {
		SSD = parseInt(data.responses.slice(7, 10))
		SSD = math.max(100,math.min(400,SSD))
	}
}

var start_test_block = {
  type: 'poldrack-single-stim',
  stimulus: '<div class = centerbox><div class = center-text>Get ready!<br><br>Stay as still as possible. Do not swallow.</div></div>',
  is_html: true,
  choices: 'none',
  timing_stim: 1500, 
  timing_response: 1500,
  data: {
    trial_id: "test_start_block"
  },
  timing_post_trial: 500,
  on_finish: function() {
  	exp_stage = 'test'
  }
};

 var end_block = {
	type: 'poldrack-single-stim',
	stimulus: '<div class = centerbox><div class = center-text><i>Fin</i></div></div>',
	is_html: true,
	choices: [32],
	timing_response: -1,
	response_ends_trial: true,
	data: {
		trial_id: "end",
		exp_id: 'stop_signal'
	},
	timing_post_trial: 0
};

 var instructions_block = {
  type: 'poldrack-single-stim',
  stimulus: function() {
	var correct_responses = jsPsych.data.getDataByTrialIndex(1).correct_responses;
	var prompt_text = '<ul list-text>' + 
	'<li><div class = prompt_container><img class = prompt_stim src = ' + 
	images[0] + '></img>' + correct_responses[0][0] + '</div></li>' +
	'</li><li><div class = prompt_container><img class = prompt_stim src = ' +
	images[1] + '></img>'  + correct_responses[1][0] + '</div></li>' +
	' </li><li><div class = prompt_container><img class = prompt_stim src = ' + 
	images[2] + '></img>' + correct_responses[2][0] + '</div></li>' +
	' </li><li><div class = prompt_container><img class = prompt_stim src = ' +
	images[3] + '></img>' + correct_responses[3][0] + '</div></li></ul>'

	return('<div class = instructbox><p class = instruct-text>Only one key is correct for each shape. The correct keys are as follows:' + prompt_text +
		'</p><p class = instruct-text><strong>Do not respond if you see the red star!</strong></p><p class = instruct-text>We will start with practice</p></div>')
	},
  is_html: true,
  timing_stim: -1, 
  timing_response: -1,
  response_ends_trial: true,
  choices: [32],
  data: {
    trial_id: "instructions",
  },
  timing_post_trial: 0
};

var rest_block = {
  type: 'poldrack-single-stim',
  stimulus: '<div class = centerbox><div class = center-text>Take a break!<br>Next run will start in a moment</div></div>',
  is_html: true,
  choices: 'none',
  timing_response: 7500,
  data: {
    trial_id: "rest_block"
  },
  timing_post_trial: 1000
};

// set up practice trials
var practice_trials = getPracticeTrials()
var practice_loop = {
  timeline: practice_trials,
  loop_function: function(data) {
    practice_repeats+=1
    total_trials = 0
    correct_trials = 0
    for (var i = 0; i < data.length; i++) {
      if (data[i].trial_id == 'stim') {
        total_trials+=1
        if (data[i].correct === true) {
          correct_trials+=1
        }
      }
    }
    console.log('Practice Block Accuracy: ', correct_trials/total_trials)
    if (correct_trials/total_trials > 0.75 || practice_repeats == 3) {
    	current_trial = 0
      return false
    } else {
      practice_trials = getPracticeTrials()
      return true
    }
  }
};

/* ************************************ */
/* Set up experiment */
/* ************************************ */


stop_signal__fmri_experiment.push(scan_order_setup_block); //exp_input
stop_signal__fmri_experiment.push(permutation_setup_block); //exp_input
stop_signal__fmri_experiment.push(SSD_setup_block); //exp_input
test_keys(stop_signal__fmri_experiment, choices);
stop_signal__fmri_experiment.push(instructions_block);
stop_signal__fmri_experiment.push(practice_loop);
setup_fmri_intro(stop_signal__fmri_experiment)


/* ************************************ */
/*    Set up test blocks                */
/* ************************************ */
stop_signal__fmri_experiment.push(start_test_block)
// Loop through test trials
for (i = 0; i < exp_len; i++) {
	var stop_signal_trial = {
		type: 'stop-signal',
		SS_trial_type: function() {
			var trials = jsPsych.data.getDataByTrialIndex(1).trials;
			return trials[typePop()].SS_trial_type; 
		},
		data: function() {
			var trials = jsPsych.data.getDataByTrialIndex(1).trials;
			return trials[dataPop()].data; 
		},
		stimulus: function() {
			var trials = jsPsych.data.getDataByTrialIndex(1).trials;
			return trials[stimPop()].stimulus; 
		},
		SS_stimulus: stop_signal,
		is_html: true,
		choices: choices,
		timing_stim: 850,
		timing_response: function() { //use scan_order and timingPop (an iterator) to get correct ITI from ITIs array
			var scan_order = jsPsych.data.getDataByTrialIndex(0).scan_order;
			return get_ITI(ITIs[scan_order][timingPop()]);    
		},
		SSD: getSSD,
		timing_SS: 500,
		timing_post_trial: 0,
		prompt: '<div class = centerbox><div class = fixation>+</div></div>',
		on_finish: function(data) {
			correct = false
			if (data.key_press == data.correct_response) {
				correct = true
			}
			updateSSD(data)
			jsPsych.data.addDataToLastTrial({
				exp_stage: 'test',
				trial_num: current_trial,
				correct: correct
			})
			current_trial += 1
			test_block_data.push(data)
			// console.log('Trial: ' + current_trial +
            // 	'\nCorrect Response? ' + correct + ', RT: ' + data.rt + ', SSD: ' + data.SS_delay)
		}
	}
	stop_signal__fmri_experiment.push(stop_signal_trial)
	if ((i%42 === 0) && ( i > 0)) {
		stop_signal__fmri_experiment.push(rest_block)
		stop_signal__fmri_experiment.push(start_test_block)
	}
}

stop_signal__fmri_experiment.push(end_block)
