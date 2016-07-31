/* ************************************ */
/* Define helper functions */
/* ************************************ */
/* Append gap and current trial to data and then recalculate for next trial*/
function evalAttentionChecks() {
	var check_percent = 1
	if (run_attention_checks) {
		var attention_check_trials = jsPsych.data.getTrialsOfType('attention-check')
		var checks_passed = 0
		for (var i = 0; i < attention_check_trials.length; i++) {
			if (attention_check_trials[i].correct === true) {
				checks_passed += 1
			}
		}
		check_percent = checks_passed / attention_check_trials.length
	}
	return check_percent
}

var getInstructFeedback = function() {
	return '<div class = centerbox><p class = center-block-text>' + feedback_instruct_text +
		'</p></div>'
}

function assessPerformance() {
	var experiment_data = jsPsych.data.getTrialsOfType('poldrack-single-stim')
	var missed_count = 0
	var trial_count = 0
	var rt_array = []
	var rt = 0
	//record choices participants made
	var choice_counts = {}
	choice_counts[-1] = 0
	for (var k = 0; k < choices.length; k++) {
		choice_counts[choices[k]] = 0
	}
	for (var i = 0; i < experiment_data.length; i++) {
		if (experiment_data.trial_id == 'probe') {
			trial_count += 1
			rt = experiment_data[i].rt
			key = experiment_data[i].key_press
			choice_counts[key] += 1
			if (rt == -1) {
				missed_count += 1
			} else {
				rt_array.push(rt)
			}
		}
	}
	//calculate average rt
	var avg_rt = -1
	if (rt_array.length !== 0) {
		avg_rt = math.median(rt_array)
	} 
	//calculate whether response distribution is okay
	var responses_ok = true
	Object.keys(choice_counts).forEach(function(key, index) {
		if (choice_counts[key] > trial_count * 0.85) {
			responses_ok = false
		}
	})
	var missed_percent = missed_count/trial_count
	credit_var = (missed_percent < 0.4 && avg_rt > 200 && responses_ok)
	jsPsych.data.addDataToLastTrial({"credit_var": credit_var})
}

//this adds the trial number and which stims are shown to the data set
var appendTestData = function() {
	jsPsych.data.addDataToLastTrial({
		trial_num: current_trial,
		stim: stims,
		stims_1back: preceeding1stims,
		stims_2back: preceeding2stims,
		exp_stage: exp_stage
	})
};

var randomDraw = function(lst) {
	var index = Math.floor(Math.random() * (lst.length))
	return lst[index]
}

//this adds the trial number, which stims are shown, and if the trial was a correct trial to the data set
var appendProbeData = function() {
	var global_trial = jsPsych.progress().current_trial_global
	var keyPress = jsPsych.data.getDataByTrialIndex(global_trial).key_press
	var correct = false
	var correct_response = ''
	if (stims.indexOf(probe, 0) != -1) {
		correct_response = 37
	} else if (stims.indexOf(probe, 0) == -1) {
		correct_response = 39
	} 
	if (keyPress == correct_response) {
		correct = true
	}
	jsPsych.data.addDataToLastTrial({
		probe_letter: probe,
		probeType: probeType,
		trial_num: current_trial,
		correct_response: correct_response,
		correct: correct
	})
};

var appendPracticeProbeData = function() {
	jsPsych.data.addDataToLastTrial({
		probe_letter: probe,
		probeType: probeType,
		trial_num: current_trial
	})
}

//returns the divs for training sets.  this algorithm also chooses the training set based on the rules given in the paper(training sets are 
//composed of three letters from the previous set, and three new letters.
var getTrainingSet = function() {
	var oldStims = []
	var newStims = []
	var newStimArray = []
	var tempNewStims = []
	trainingArray = jsPsych.randomization.repeat(stimArray, 1);
	if (current_trial === 0) {
		stims = trainingArray.slice(0,6)
	} else if (current_trial == 1) {
		preceeding1stims = stims.slice()
		tempNewStims = trainingArray.filter(function(y) {
			return (jQuery.inArray(y, preceeding1stims) == -1)
		})
		oldStims = preceeding1stims.slice(0, 3)
		newStims = tempNewStims.slice(0, 3)
		newStimArray = oldStims.concat(newStims)
		stims = jsPsych.randomization.repeat(newStimArray, 1)
	} else if (current_trial > 1) {
		preceeding2stims = preceeding1stims.slice()
		preceeding1stims = stims.slice()
		tempNewStims = trainingArray.filter(function(y) {
			return (jQuery.inArray(y, preceeding1stims.concat(preceeding2stims)) == -1)
		})
		oldStims = preceeding1stims.slice(0, 3)
		newStims = tempNewStims.slice(0, 3)
		newStimArray = oldStims.concat(newStims)
		stims = jsPsych.randomization.repeat(newStimArray, 1)
	}
	return  '<div class = centerbox><div class = fixation><span style="color:red">+</span></div></div>' +
		'<div class = topLeft><img class = recentStim src ="' + pathSource + stims[0] + fileType +
		'"></img></div>' +
		'<div class = topMiddle><img class = recentStim src ="' + pathSource + stims[1] + fileType +
		'"></img></div>' +
		'<div class = topRight><img class = recentStim src ="' + pathSource + stims[2] + fileType +
		'"></img></div>' +
		'<div class = bottomLeft><img class = recentStim src ="' + pathSource + stims[3] + fileType +
		'"></img></div>' +
		'<div class = bottomMiddle><img class = recentStim src ="' + pathSource + stims[4] + fileType +
		'"></img></div>' +
		'<div class = bottomRight><img class = recentStim src ="' + pathSource + stims[5] + fileType +
		'"></img></div>'

};

//this returns the divs for the probe stims.  This goes through the entire probeTypeArray and pops one out each time, then chooses a probe that is
//congruent with that probe type
var getProbe = function() {
	if (current_trial === 0) {
		temp = Math.floor(Math.random() * 2)
		if (temp == 1) {
			probeType = 'xrec_pos'
			probeTypeArray.splice(probeTypeArray.indexOf('xrec_pos'), 1)
			temp2 = jsPsych.randomization.repeat(stims, 1)
			probe = temp2.pop()
			return '<div class = centerbox><img class = recentStim src="' + pathSource + probe + fileType +
				'"></img></div>'
		} else if (temp === 0) {
			probeType = 'xrec_neg'
			probeTypeArray.splice(probeTypeArray.indexOf('xrec_neg'), 1)
			temp2 = trainingArray.filter(function(y) {
				return (jQuery.inArray(y, stims) == -1)
			})
			probe = temp2.pop()
			return '<div class = centerbox><img class = recentStim src="' + pathSource + probe + fileType +
				'"></img></div>'
		}
	} else if (current_trial > 0) {
		probeType = probeTypeArray.pop()
		if (probeType == 'rec_pos') {
			recProbes = preceeding1stims.filter(function(y) {
				return (jQuery.inArray(y, stims) > -1)
			})
			probe = randomDraw(recProbes)
			return '<div class = centerbox><img class = recentStim src="' + pathSource + probe + fileType +
				'"></img></div>'
		} else if (probeType == 'rec_neg') {
			recProbes = preceeding1stims.filter(function(y) {
				return (jQuery.inArray(y, stims) == -1)
			})
			probe = randomDraw(recProbes)
			return '<div class = centerbox><img class = recentStim src="' + pathSource + probe + fileType +
				'"></img></div>'
		} else if (probeType == 'xrec_pos') {
			recProbes = stims.filter(function(y) {
				return (jQuery.inArray(y, preceeding1stims) == -1)
			})
			probe = randomDraw(recProbes)
			return '<div class = centerbox><img class = recentStim src="' + pathSource + probe + fileType +
				'"></img></div>'
		} else if (probeType == 'xrec_neg') {
			recProbes = trainingArray.filter(function(y) {
				return (jQuery.inArray(y, stims.concat(preceeding1stims)) == -1)
			})
			probe = randomDraw(recProbes)
			return '<div class = centerbox><img class = recentStim src="' + pathSource + probe + fileType +
				'"></img></div>'
		}
	}
};

var getPracticeProbe = function() {
	if (current_trial === 0) {
		temp = Math.floor(Math.random() * 2)
		if (temp == 1) {
			probeType = 'xrec_pos'
			probeTypeArray.splice(probeTypeArray.indexOf('xrec_pos'), 1)
			temp2 = jsPsych.randomization.repeat(stims, 1)
			probe = temp2.pop()
			return '<div class = centerbox><img class = recentStim src="' + pathSource + probe + fileType +
				'"></img></div>'
		} else if (temp === 0) {
			probeType = 'xrec_neg'
			probeTypeArray.splice(probeTypeArray.indexOf('xrec_neg'), 1)
			temp2 = trainingArray.filter(function(y) {
				return (jQuery.inArray(y, stims) == -1)
			})
			probe = temp2.pop()
			return '<div class = centerbox><img class = recentStim src="' + pathSource + probe + fileType +
				'"></img></div>'
		}
	} else if (current_trial > 0) {
		probeType = practiceProbeTypeArray.pop()
		if (probeType == 'rec_pos') {
			recProbes = preceeding1stims.filter(function(y) {
				return (jQuery.inArray(y, stims) > -1)
			})
			probe = randomDraw(recProbes)
			return '<div class = centerbox><img class = recentStim src="' + pathSource + probe + fileType +
				'"></img></div>'
		} else if (probeType == 'rec_neg') {
			recProbes = preceeding1stims.filter(function(y) {
				return (jQuery.inArray(y, stims) == -1)
			})
			probe = randomDraw(recProbes)
			return '<div class = centerbox><img class = recentStim src="' + pathSource + probe + fileType +
				'"></img></div>'
		} else if (probeType == 'xrec_pos') {
			recProbes = stims.filter(function(y) {
				return (jQuery.inArray(y, preceeding1stims) == -1)
			})
			probe = randomDraw(recProbes)
			return '<div class = centerbox><img class = recentStim src="' + pathSource + probe + fileType +
				'"></img></div>'
		} else if (probeType == 'xrec_neg') {
			recProbes = trainingArray.filter(function(y) {
				return (jQuery.inArray(y, stims.concat(preceeding1stims)) == -1)
			})
			probe = randomDraw(recProbes)
			return '<div class = centerbox><img class = recentStim src="' + pathSource + probe + fileType +
				'"></img></div>'
		}
	}
};

var getResponse = function() {
	if (jQuery.inArray(probe, stims) != -1) {
		return 37
	} else {
		return 39
	}
}

var resetTrial = function() {
	current_trial = 0
	exp_stage = 'test'
}

/* ************************************ */
/* Define experimental variables */
/* ************************************ */
// generic task variables
var run_attention_checks = false
var attention_check_thresh = 0.45
var sumInstructTime = 0 //ms
var instructTimeThresh = 0 ///in seconds
var credit_var = true

// task specific variables
var probeType = ''
var stims = []
var preceeding1stims = []
var preceeding2stims = []
var probe = ''
var choices = [37, 39]
var exp_stage = 'practice'

var num_trials = 24 //  num trials per run
var num_runs = 3 //
var experimentLength = num_trials * num_runs
var current_trial = 0
var stimArray = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P',
	'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'
];
var probes = ['rec_pos', 'xrec_pos', 'rec_neg', 'xrec_neg']
var probeTypeArray = jsPsych.randomization.repeat(probes, experimentLength / 4)
var practiceProbeTypeArray = jsPsych.randomization.repeat(probes, 1)
var stimFix = ['fixation']
var pathSource = '/static/experiments/recent_probes/images/'
var fileType = '.png'
var images = []
for (var i = 0; i < stimArray.length; i++) {
	images.push(pathSource + stimArray[i] + fileType)
}
//preload images
jsPsych.pluginAPI.preloadImages(images)


/* ************************************ */
/* Set up jsPsych blocks */
/* ************************************ */
// Set up attention check node
var attention_check_block = {
	type: 'attention-check',
	data: {
		trial_id: "attention_check"
	},
	timing_response: 180000,
	response_ends_trial: true,
	timing_post_trial: 200
}

var attention_node = {
	timeline: [attention_check_block],
	conditional_function: function() {
		return run_attention_checks
	}
}

//Set up post task questionnaire
var post_task_block = {
   type: 'survey-text',
   data: {
       trial_id: "post task questions"
   },
   questions: ['<p class = center-block-text style = "font-size: 20px">Please summarize what you were asked to do in this task.</p>',
              '<p class = center-block-text style = "font-size: 20px">Do you have any comments about this task?</p>'],
   rows: [15, 15],
   columns: [60,60]
};

var end_block = {
	type: 'poldrack-text',
	timing_response: 180000,
	data: {
		trial_id: "end",
		exp_id: "recent_probes"
	},
	text: '<div class = centerbox><p class = center-block-text>Thanks for completing this task!</p><p class = center-block-text>Press <strong>enter</strong> to continue.</p></div>',
	cont_key: [13],
	timing_post_trial: 0,
	on_finish: assessPerformance
};

var feedback_instruct_text =
	'Welcome to the experiment. This experiment will take about 22 minutes. Press <strong>enter</strong> to begin.'
var feedback_instruct_block = {
	type: 'poldrack-text',
	data: {
		trial_id: "instruction"
	},
	cont_key: [13],
	text: getInstructFeedback,
	timing_post_trial: 0,
	timing_response: 180000
};
/// This ensures that the subject does not read through the instructions too quickly.  If they do it too quickly, then we will go over the loop again.
var instructions_block = {
	type: 'poldrack-instructions',
	data: {
		trial_id: "instruction"
	},
	pages: [
		'<div class = centerbox><p class = block-text>In this experiment, you will be presented with 6 letters on each trial, known as your memory set.  You must memorize all 6 letters. </p><p class = block-text>After the presentation of 6 letters, there will be a short delay and then you will be presented with a  single letter. Respond with the <strong> Left</strong> arrow key if it was in the memory set, and the <strong> Right </strong> arrow key if it was not in the memory set.</p><p class = block-text>Practice will start after you end the instructions.</p></div>'
	],
	allow_keys: false,
	show_clickable_nav: true,
	timing_post_trial: 1000
};

var instruction_node = {
	timeline: [feedback_instruct_block, instructions_block],
	/* This function defines stopping criteria */
	loop_function: function(data) {
		for (i = 0; i < data.length; i++) {
			if ((data[i].trial_type == 'poldrack-instructions') && (data[i].rt != -1)) {
				rt = data[i].rt
				sumInstructTime = sumInstructTime + rt
			}
		}
		if (sumInstructTime <= instructTimeThresh * 1000) {
			feedback_instruct_text =
				'Read through instructions too quickly.  Please take your time and make sure you understand the instructions.  Press <strong>enter</strong> to continue.'
			return true
		} else if (sumInstructTime > instructTimeThresh * 1000) {
			feedback_instruct_text = 'Done with instructions. Press <strong>enter</strong> to continue.'
			return false
		}
	}
}


var start_test_block = {
	type: 'poldrack-text',
	timing_response: 180000,
	data: {
		trial_id: "test_intro",
		exp_stage: "test"
	},
	text: '<div class = centerbox><p class = block-text>We will now start another test run. Press <strong>enter</strong> to begin.</p></div>',
	cont_key: [13],
	timing_post_trial: 1000,
	on_finish: resetTrial,
};

var intro_test_block = {
	type: 'poldrack-text',
	timing_response: 180000,
	data: {
		trial_id: "intro_test",
		exp_stage: "test"
	},
	text: '<div class = centerbox><p class = block-text>We will now begin the experiment.  For these trials, you will no longer get feedback.</p><p class = block-text> Remember, at the end of the trial respond with the <strong> Left</strong> arrow key if the letter presented is in the memory set, and the <strong> Right </strong> arrow key if it is not in the memory set.</p><p class = block-text> Press <strong>Enter</strong> to begin the experiment.</p></div>',
	cont_key: [13],
	timing_post_trial: 1000,
	on_finish: resetTrial,
};

var start_fixation_block = {
	type: 'poldrack-single-stim',
	stimulus: '<div class = centerbox><div class = fixation><span style="color:red">+</span></div></div>',
	is_html: true,
	choices: 'none',
	data: {
		trial_id: "fixation",
	},
	timing_post_trial: 0,
	timing_stim: 1000,
	timing_response: 1000,
	on_finish: function() {
		jsPsych.data.addDataToLastTrial({exp_stage: exp_stage})
	}
}

var fixation_block = {
	type: 'poldrack-single-stim',
	stimulus: '<div class = centerbox><div class = fixation><span style="color:red">+</span></div></div>',
	is_html: true,
	choices: 'none',
	data: {
		trial_id: "fixation",
	},
	timing_post_trial: 0,
	timing_stim: 3000,
	timing_response: 3000,
	on_finish: function() {
		jsPsych.data.addDataToLastTrial({exp_stage: exp_stage})
	}
}

var ITI_fixation_block = {
	type: 'poldrack-single-stim',
	stimulus: '<div class = centerbox><div class = fixation><span style="color:red">+</span></div></div>',
	is_html: true,
	choices: choices,
	data: {
		trial_id: "ITI_fixation",
	},
	timing_post_trial: 0,
	timing_stim: 5000,
	timing_response: 5000,
	on_finish: function() {
		jsPsych.data.addDataToLastTrial({
			exp_stage: exp_stage,
			trial_num: current_trial
		})
		current_trial += 1
	}
}

var training_block = {
	type: 'poldrack-single-stim',
	stimulus: getTrainingSet,
	is_html: true,
	data: {
		trial_id: "stim",
	},
	choices: 'none',
	timing_post_trial: 0,
	timing_stim: 2500,
	timing_response: 2500,
	on_finish: appendTestData,
};


var practice_probe_block = {
	type: 'poldrack-categorize',
	stimulus: getPracticeProbe,
	key_answer: getResponse,
	choices: choices,
	data: {
		trial_id: "probe",
		exp_stage: "practice"
	},
	correct_text: '<div class = bottombox><div style="color:green"; style="color:green"; class = center-text>Correct!</div></div>',
	incorrect_text: '<div class = bottombox><div style="color:red"; style="color:red"; class = center-text>Incorrect</div></div>',
	timeout_message: '<div class = bottombox><div class = center-text>no response detected</div></div>',
	timing_stim: 2000,
	timing_response: 2000,
	timing_feedback_duration: 750,
	is_html: true,
	on_finish: function() {
		appendPracticeProbeData()
		current_trial += 1
	}
};

var probe_block = {
	type: 'poldrack-single-stim',
	stimulus: getProbe,
	is_html: true,
	data: {
		trial_id: "probe",
		exp_stage: "test"
	},
	choices: choices,
	timing_post_trial: 0,
	timing_stim: 2000,
	timing_response: 7000,
	prompt: '<div class = fixation style = "z-index: -1"><span style="color:red">+</span></div>',
	on_finish: function() {
		appendProbeData()
		current_trial += 1
	},
};

/* create experiment definition array */
var recent_probes_experiment = [];
recent_probes_experiment.push(instruction_node);
for (k = 0; k < 4; k++) {
	recent_probes_experiment.push(start_fixation_block);
	recent_probes_experiment.push(training_block);
	recent_probes_experiment.push(fixation_block);
	recent_probes_experiment.push(practice_probe_block);
	recent_probes_experiment.push(ITI_fixation_block)
}
for (r = 0; r < num_runs; r++) {
	if (r === 0) {
		recent_probes_experiment.push(intro_test_block)
	} else {
		recent_probes_experiment.push(start_test_block);
	}
	for (i = 0; i < num_trials; i++) {
		recent_probes_experiment.push(start_fixation_block);
		recent_probes_experiment.push(training_block);
		recent_probes_experiment.push(fixation_block);
		recent_probes_experiment.push(probe_block);
	}
	if ($.inArray(r, [0, 2]) != -1) {
		recent_probes_experiment.push(attention_node);
	}
}
recent_probes_experiment.push(post_task_block)
recent_probes_experiment.push(end_block)