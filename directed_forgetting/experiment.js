/* ************************************ */
/* Define helper functions */
/* ************************************ */
function getDisplayElement() {
	$('<div class = display_stage_background></div>').appendTo('body')
	return $('<div class = display_stage></div>').appendTo('body')
}

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

function addID() {
	jsPsych.data.addDataToLastTrial({
		'exp_id': 'directed_forgetting'
	})
}

function assessPerformance() {
	var experiment_data = jsPsych.data.getTrialsOfType('poldrack-single-stim')
	var missed_count = 0
	var trial_count = 0
	var rt_array = []
	var rt = 0
	for (var i = 0; i < experiment_data.length; i++) {
		if (experiment_data.trial_id == 'probe') {
			rt = experiment_data[i].rt
			trial_count += 1
			if (rt == -1) {
				missed_count += 1
			} else {
				rt_array.push(rt)
			}
		}
	}
	//calculate average rt
	var sum = 0
	for (var j = 0; j < rt_array.length; j++) {
		sum += rt_array[j]
	}
	var avg_rt = sum / rt_array.length
	credit_var = (avg_rt > 200)
}

var getInstructFeedback = function() {
	return '<div class = centerbox><p class = center-block-text>' + feedback_instruct_text +
		'</p></div>'
}

/* Append gap and current trial to data and then recalculate for next trial*/

//this adds the current trial and the stims shown to the data
var appendTestData = function() {
	jsPsych.data.addDataToLastTrial({
		trial_num: current_trial,
		stim_top: [stim1, stim2, stim3],
		stim_bottom: [stim4, stim5, stim6]
	})
	data = jsPsych.data.getTrialsOfType('poldrack-text')
	practiceDataCount = 0
	testDataCount = 0
	for (i = 0; i < data.length; i++) {
		if (data[i].trial_id == 'practice_intro') {
			practiceDataCount = practiceDataCount + 1
		} else if (data[i].trial_id == 'test_intro') {
			testDataCount = testDataCount + 1
		}
	}
	if (practiceDataCount >= 1 && testDataCount === 0) {
		//temp_id = data[i].trial_id
		jsPsych.data.addDataToLastTrial({
			exp_stage: "practice"
		})
	} else if (practiceDataCount >= 1 && testDataCount >= 1) {
		//temp_id = data[i].trial_id
		jsPsych.data.addDataToLastTrial({
			exp_stage: "test"
		})
	}
};

//this adds the cue shown and trial number to data
var appendCueData = function() {
	jsPsych.data.addDataToLastTrial({
		stim: cue,
		trial_num: current_trial
	})
	data = jsPsych.data.getTrialsOfType('poldrack-text')
	practiceDataCount = 0
	testDataCount = 0
	for (i = 0; i < data.length; i++) {
		if (data[i].trial_id == 'practice_intro') {
			practiceDataCount = practiceDataCount + 1
		} else if (data[i].trial_id == 'test_intro') {
			testDataCount = testDataCount + 1
		}
	}
	if (practiceDataCount >= 1 && testDataCount === 0) {
		//temp_id = data[i].trial_id
		jsPsych.data.addDataToLastTrial({
			exp_stage: "practice"
		})
	} else if (practiceDataCount >= 1 && testDataCount >= 1) {
		//temp_id = data[i].trial_id
		jsPsych.data.addDataToLastTrial({
			exp_stage: "test"
		})
	}
};

//this adds the probe shown, trial number, and whether it was a correct trial to the data
var appendProbeData = function() {
	var global_trial = jsPsych.progress().current_trial_global
	var trialCue = jsPsych.data.getDataByTrialIndex(global_trial - 2).stim
	var lastSet_top = jsPsych.data.getDataByTrialIndex(global_trial - 3).stim_top
	var lastSet_bottom = jsPsych.data.getDataByTrialIndex(global_trial - 3).stim_bottom
	var keypress = jsPsych.data.getDataByTrialIndex(global_trial).key_press
	var memorySet = ''
	if (trialCue == 'BOT') {
		memorySet = lastSet_top
	} else if (trialCue == 'TOP') {
		memorySet = lastSet_bottom
	}
	correct = 'incorrect'
	if ((memorySet.indexOf(probe, 0) == -1) && keypress == 39) {
		correct = 'correct'
		correct_response = 39
	} else if ((memorySet.indexOf(probe, 0) != -1) && keypress == 37) {
		correct = 'correct'
		correct_response = 37
	}
	jsPsych.data.addDataToLastTrial({
		correct: correct,
		probe_letter: probe,
		probe_type: probeType,
		trial_num: current_trial,
		correct_response: correct_response
	})
	data = jsPsych.data.getTrialsOfType('poldrack-text')
	practiceDataCount = 0
	testDataCount = 0
	for (i = 0; i < data.length; i++) {
		if (data[i].trial_id == 'practice_intro') {
			practiceDataCount = practiceDataCount + 1
		} else if (data[i].trial_id == 'test_intro') {
			testDataCount = testDataCount + 1
		}
	}
	if (practiceDataCount >= 1 && testDataCount === 0) {
		//temp_id = data[i].trial_id
		jsPsych.data.addDataToLastTrial({
			exp_stage: "practice"
		})
	} else if (practiceDataCount >= 1 && testDataCount >= 1) {
		//temp_id = data[i].trial_id
		jsPsych.data.addDataToLastTrial({
			exp_stage: "test"
		})
	}
};

//this adds the trial number to the data
var appendFixData = function() {
	jsPsych.data.addDataToLastTrial({
		trial_num: current_trial
	})
	data = jsPsych.data.getTrialsOfType('poldrack-text')
	practiceDataCount = 0
	testDataCount = 0
	for (i = 0; i < data.length; i++) {
		if (data[i].trial_id == 'practice_intro') {
			practiceDataCount = practiceDataCount + 1
		} else if (data[i].trial_id == 'test_intro') {
			testDataCount = testDataCount + 1
		}
	}
	if (practiceDataCount >= 1 && testDataCount === 0) {
		//temp_id = data[i].trial_id
		jsPsych.data.addDataToLastTrial({
			exp_stage: "practice"
		})
	} else if (practiceDataCount >= 1 && testDataCount >= 1) {
		//temp_id = data[i].trial_id
		jsPsych.data.addDataToLastTrial({
			exp_stage: "test"
		})
	}
};

var appendFixData2 = function() {
	jsPsych.data.addDataToLastTrial({
		trial_num: current_trial
	})
	current_trial = current_trial + 1
	data = jsPsych.data.getTrialsOfType('poldrack-text')
	practiceDataCount = 0
	testDataCount = 0
	for (i = 0; i < data.length; i++) {
		if (data[i].trial_id == 'practice_intro') {
			practiceDataCount = practiceDataCount + 1
		} else if (data[i].trial_id == 'test_intro') {
			testDataCount = testDataCount + 1
		}
	}
	if (practiceDataCount >= 1 && testDataCount === 0) {
		//temp_id = data[i].trial_id
		jsPsych.data.addDataToLastTrial({
			exp_stage: "practice"
		})
	} else if (practiceDataCount >= 1 && testDataCount >= 1) {
		//temp_id = data[i].trial_id
		jsPsych.data.addDataToLastTrial({
			exp_stage: "test"
		})
	}
};

//this is an algorithm to choose the training set based on rules of the game (training sets are composed of any letter not presented in the last two training sets)
var getTrainingSet = function() {
	preceeding1stims = []
	preceeding2stims = []
	trainingArray = jsPsych.randomization.repeat(stimArray, 1);
	if (current_trial < 1) {
		stim1 = trainingArray[0];
		stim2 = trainingArray[1];
		stim3 = trainingArray[2];
		stim4 = trainingArray[3];
		stim5 = trainingArray[4];
		stim6 = trainingArray[5];
		return '<div class = centerbox><div class = fixation><span style="color:red">+</span></div></div>' +
			'<div class = topLeft><img class = forgetStim src ="' + pathSource + stim1 + fileType +
			'"></img></div>' +
			'<div class = topMiddle><img class = forgetStim src ="' + pathSource + stim2 + fileType +
			'"></img></div>' +
			'<div class = topRight><img class = forgetStim src ="' + pathSource + stim3 + fileType +
			'"></img></div>' +
			'<div class = bottomLeft><img class = forgetStim src ="' + pathSource + stim4 + fileType +
			'"></img></div>' +
			'<div class = bottomMiddle><img class = forgetStim src ="' + pathSource + stim5 + fileType +
			'"></img></div>' +
			'<div class = bottomRight><img class = forgetStim src ="' + pathSource + stim6 + fileType +
			'"></img></div>'

	} else if (current_trial == 1) {
		global_trial = jsPsych.progress().current_trial_global
		preceeding1stims = jsPsych.data.getDataByTrialIndex(global_trial - 5).stim
		newArray = trainingArray.filter(function(y) {
			return (jQuery.inArray(y, preceeding1stims) == -1)
		})
		stim1 = newArray[0];
		stim2 = newArray[1];
		stim3 = newArray[2];
		stim4 = newArray[3];
		stim5 = newArray[4];
		stim6 = newArray[5];
		return '<div class = centerbox><div class = fixation><span style="color:red">+</span></div></div>' +
			'<div class = topLeft><img class = forgetStim src ="' + pathSource + stim1 + fileType +
			'"></img></div>' +
			'<div class = topMiddle><img class = forgetStim src ="' + pathSource + stim2 + fileType +
			'"></img></div>' +
			'<div class = topRight><img class = forgetStim src ="' + pathSource + stim3 + fileType +
			'"></img></div>' +
			'<div class = bottomLeft><img class = forgetStim src ="' + pathSource + stim4 + fileType +
			'"></img></div>' +
			'<div class = bottomMiddle><img class = forgetStim src ="' + pathSource + stim5 + fileType +
			'"></img></div>' +
			'<div class = bottomRight><img class = forgetStim src ="' + pathSource + stim6 + fileType +
			'"></img></div>'

	} else {
		global_trial = jsPsych.progress().current_trial_global
		preceeding1stims = jsPsych.data.getDataByTrialIndex(global_trial - 5).stim
		preceeding2stims = jsPsych.data.getDataByTrialIndex(global_trial - 10).stim
		newArray = trainingArray.filter(function(y) {
			return (jQuery.inArray(y, preceeding1stims.concat(preceeding2stims)) == -1)
		})
		stim1 = newArray[0];
		stim2 = newArray[1];
		stim3 = newArray[2];
		stim4 = newArray[3];
		stim5 = newArray[4];
		stim6 = newArray[5];
		return '<div class = centerbox><div class = fixation><span style="color:red">+</span></div></div>' +
			'<div class = topLeft><img class = forgetStim src ="' + pathSource + stim1 + fileType +
			'"></img></div>' +
			'<div class = topMiddle><img class = forgetStim src ="' + pathSource + stim2 + fileType +
			'"></img></div>' +
			'<div class = topRight><img class = forgetStim src ="' + pathSource + stim3 + fileType +
			'"></img></div>' +
			'<div class = bottomLeft><img class = forgetStim src ="' + pathSource + stim4 + fileType +
			'"></img></div>' +
			'<div class = bottomMiddle><img class = forgetStim src ="' + pathSource + stim5 + fileType +
			'"></img></div>' +
			'<div class = bottomRight><img class = forgetStim src ="' + pathSource + stim6 + fileType +
			'"></img></div>'
	}
};

//returns a cue pseudorandomly, either TOP or BOT
var getCue = function() {
	var temp = Math.floor(Math.random() * 2)
	cue = cueArray[temp]
	return '<div class = centerbox><img class = forgetStim src ="' + pathSource + cue + fileType +
		'"></img></div>'
};

// Will pop out a probe type from the entire probeTypeArray and then choose a probe congruent with the probe type
var getProbe = function() {
	probeType = probeTypeArray.pop()
	var global_trial = jsPsych.progress().current_trial_global
	var trainingArray = jsPsych.randomization.repeat(stimArray, 1);
	var lastCue = jsPsych.data.getDataByTrialIndex(global_trial - 2).stim
	var lastSet_top = jsPsych.data.getDataByTrialIndex(global_trial - 3).stim_top
	var lastSet_bottom = jsPsych.data.getDataByTrialIndex(global_trial - 3).stim_bottom
	if (probeType == 'pos') {
		if (lastCue == 'BOT') {
			probe = lastSet_top[Math.floor(Math.random() * 3)]
		} else if (lastCue == 'TOP') {
			probe = lastSet_bottom[Math.floor(Math.random() * 3)]
		}
	} else if (probeType == 'neg') {
		if (lastCue == 'BOT') {
			probe = lastSet_bottom[Math.floor(Math.random() * 3)]
		} else if (lastCue == 'TOP') {
			probe = lastSet_top[Math.floor(Math.random() * 3)]
		}
	} else if (probeType == 'con') {
		newArray = trainingArray.filter(function(y) {
			return (y != lastSet_top[0] && y != lastSet_top[1] && y != lastSet_top[2] && y !=
				lastSet_bottom[0] && y != lastSet_bottom[1] && y != lastSet_bottom[2])
		})
		probe = newArray.pop()
	}
	return '<div class = centerbox><img class = forgetStim src ="' + pathSource + probe + fileType +
		'"></img></div>'
};

var getPracticeProbe = function() {
	probeType = practiceProbeTypeArray.pop()
	var global_trial = jsPsych.progress().current_trial_global
	var trainingArray = jsPsych.randomization.repeat(stimArray, 1);
	var lastCue = jsPsych.data.getDataByTrialIndex(global_trial - 2).stim
	var lastSet_top = jsPsych.data.getDataByTrialIndex(global_trial - 3).stim_top
	var lastSet_bottom = jsPsych.data.getDataByTrialIndex(global_trial - 3).stim_bottom
	if (probeType == 'pos') {
		if (lastCue == 'BOT') {
			probe = lastSet_top[Math.floor(Math.random() * 3)]
		} else if (lastCue == 'TOP') {
			probe = lastSet_bottom[Math.floor(Math.random() * 3)]
		}
	} else if (probeType == 'neg') {
		if (lastCue == 'BOT') {
			probe = lastSet_bottom[Math.floor(Math.random() * 3)]
		} else if (lastCue == 'TOP') {
			probe = lastSet_top[Math.floor(Math.random() * 3)]
		}
	} else if (probeType == 'con') {
		newArray = trainingArray.filter(function(y) {
			return (y != lastSet_top[0] && y != lastSet_top[1] && y != lastSet_top[2] && y !=
				lastSet_bottom[0] && y != lastSet_bottom[1] && y != lastSet_bottom[2])
		})
		probe = newArray.pop()
	}
	return '<div class = centerbox><img class = forgetStim src ="' + pathSource + probe + fileType +
		'"></img></div>'
};

var getResponse = function() {
	if (cue == 'TOP') {
		if (probe == stim4 || probe == stim5 || probe == stim6) {
			return 37
		} else {
			return 39
		}

	} else if (cue == 'BOT') {
		if (probe == stim1 || probe == stim2 || probe == stim3) {
			return 37
		} else {
			return 39
		}
	}
}

var appendPracticeProbeData = function() {
	jsPsych.data.addDataToLastTrial({
		probe_letter: probe,
		probeType: probeType,
		trial_num: current_trial
	})
}

var resetTrial = function() {
	current_trial = 0
}

/* ************************************ */
/* Define experimental variables */
/* ************************************ */
// generic task variables
var run_attention_checks = false
var attention_check_thresh = 0.65
var sumInstructTime = 0 //ms
var instructTimeThresh = 0 ///in seconds
var credit_var = true

// task specific variables
var num_trials = 24 // 24 num trials per run
var num_runs = 3 //3
var experimentLength = num_trials * num_runs
var current_trial = 0
var stimArray = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O',
	'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'
];
var cueArray = ['TOP', 'BOT']
var probe = ''
var cue = ''
var stim1 = ''
var stim2 = ''
var stim3 = ''
var stim4 = ''
var stim5 = ''
var stim6 = ''
var probes = ['pos', 'pos', 'neg', 'con']
var probeTypeArray = jsPsych.randomization.repeat(probes, experimentLength / 4)
var practiceProbeTypeArray = jsPsych.randomization.repeat(probes, 1)
var stimFix = ['fixation']
var pathSource = '/static/experiments/directed_forgetting/images/'
var fileType = '.png'
var images = []
for (var i = 0; i < stimArray.length; i++) {
	images.push(pathSource + stimArray[i] + fileType)
}
images.push('TOP.png')
images.push('BOT.png')
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

var end_block = {
	type: 'poldrack-text',
	data: {
		trial_id: "end"
	},
	timing_response: 180000,
	text: '<div class = centerbox><p class = center-block-text>Thanks for completing this task!</p><p class = center-block-text>Press <strong>enter</strong> to continue.</p></div>',
	cont_key: [13],
	timing_post_trial: 0,
	on_finish: assessPerformance
};

var feedback_instruct_text =
	'Welcome to the experiment. Press <strong>enter</strong> to begin.'
var feedback_instruct_block = {
	type: 'poldrack-text',
	data: {
		trial_id: "instructions"
	},
	cont_key: [13],
	text: getInstructFeedback,
	timing_post_trial: 0,
	timing_response: 180000
};
/// This ensures that the subject does not read through the instructions too quickly.  If they do it too quickly, then we will go over the loop again.
var instruction_trials = []
var instructions_block = {
	type: 'poldrack-instructions',
	data: {
		trial_id: "instructions"
	},
	pages: [
		'<div class = centerbox><p class = block-text>In this experiment, you will be presented with 6 letters on each trial, known as your training set.  You must memorize all 6 letters. </p></div>',
		'<div class = centerbox><p class = block-text>After the presentation of 6 letters, there will be a short delay. You will then be presented with a cue, either <strong>TOP</strong> or <strong>BOT</strong>. This will instruct you to forget the 3 letters located at either the top or bottom (respectively) of the screen.</p> <p class = block-text> The three remaining letters that you must remember are called your <strong>memory set</strong>.</p></div>',
		'<div class = centerbox><p class = block-text>You will then be presented with a single letter, respond with the <strong> Left</strong> arrow key if it is in the memory set, and the <strong> Right </strong> arrow key if it was not in the memory set.</p><p class = block-text>Practice will start after you end the instructions.</p></div>',
	],
	allow_keys: false,
	show_clickable_nav: true,
	timing_post_trial: 1000
};
instruction_trials.push(feedback_instruct_block)
instruction_trials.push(instructions_block)

var instruction_node = {
	timeline: instruction_trials,
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
	text: '<div class = centerbox><p class = block-text>We will now start a test run. Press <strong>enter</strong> to begin.</p></div>',
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
		exp_stage: "test"
	},
	timing_post_trial: 0,
	timing_stim: 1000,
	timing_response: 1000,
	on_finish: appendFixData
}

var fixation_block = {
	type: 'poldrack-single-stim',
	stimulus: '<div class = centerbox><div class = fixation><span style="color:red">+</span></div></div>',
	is_html: true,
	choices: 'none',
	data: {
		trial_id: "fixation",
		exp_stage: "test"
	},
	timing_post_trial: 0,
	timing_stim: 3000,
	timing_response: 3000,
	on_finish: appendFixData
}

var ITI_fixation_block = {
	type: 'poldrack-single-stim',
	stimulus: '<div class = centerbox><div class = fixation><span style="color:red">+</span></div></div>',
	is_html: true,
	choices: [37, 39],
	data: {
		trial_id: "ITI_fixation",
		exp_stage: "test"
	},
	timing_post_trial: 0,
	response_ends_trial: false,
	timing_stim: 4000,
	timing_response: 4000,
	on_finish: appendFixData2
}

var training_block = {
	type: 'poldrack-single-stim',
	stimulus: getTrainingSet,
	is_html: true,
	data: {
		trial_id: "stim"
	},
	choices: 'none',
	timing_post_trial: 0,
	timing_stim: 2500,
	timing_response: 2500,
	on_finish: appendTestData,
};



var cue_block = {
	type: 'poldrack-single-stim',
	stimulus: getCue,
	is_html: true,
	data: {
		trial_id: "cue",
		exp_stage: "test"
	},
	choices: false,
	timing_post_trial: 0,
	timing_stim: 1000,
	timing_response: 1000,
	on_finish: appendCueData,
};

var probe_block = {
	type: 'poldrack-single-stim',
	stimulus: getProbe,
	is_html: true,
	data: {
		trial_id: "probe",
		exp_stage: "test"
	},
	choices: [37, 39],
	timing_post_trial: 0,
	timing_stim: 2000,
	timing_response: 2000,
	response_ends_trial: false,
	on_finish: appendProbeData
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


var practice_probe_block = {
	type: 'poldrack-categorize',
	stimulus: getPracticeProbe,
	key_answer: getResponse,
	choices: [37, 39],
	data: {
		trial_id: "probe",
		exp_stage: "practice"
	},
	correct_text: '<div class = bottombox><p style="color:blue"; style="color:green"; class = center-text>Correct!</p></div>',
	incorrect_text: '<div class = bottombox><p style="color:red"; style="color:red"; class = center-text>Incorrect</p></div>',
	timeout_message: '<div class = bottombox><p class = center-text>No response detected</p></div>',
	timing_stim: [2000],
	timing_response: [2000],
	timing_feedback_duration: [750],
	is_html: true,
	on_finish: appendPracticeProbeData,
};

/* create experiment definition array */
var directed_forgetting_experiment = [];
directed_forgetting_experiment.push(instruction_node);
for (i = 0; i < 4; i++) {
	directed_forgetting_experiment.push(start_fixation_block);
	directed_forgetting_experiment.push(training_block);
	directed_forgetting_experiment.push(cue_block);
	directed_forgetting_experiment.push(fixation_block);
	directed_forgetting_experiment.push(practice_probe_block);
	directed_forgetting_experiment.push(ITI_fixation_block);
}

for (r = 0; r < num_runs; r++) {
	if (r === 0) {
		directed_forgetting_experiment.push(intro_test_block)
	} else {
		directed_forgetting_experiment.push(start_test_block);
	}
	for (i = 0; i < num_trials; i++) {
		directed_forgetting_experiment.push(start_fixation_block);
		directed_forgetting_experiment.push(training_block);
		directed_forgetting_experiment.push(cue_block);
		directed_forgetting_experiment.push(fixation_block);
		directed_forgetting_experiment.push(probe_block);
		directed_forgetting_experiment.push(ITI_fixation_block);
	}
	directed_forgetting_experiment.push(attention_node)
}
directed_forgetting_experiment.push(end_block);