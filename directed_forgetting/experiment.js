/* ************************************ */
/* Define helper functions */
/* ************************************ */
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

function assessPerformance() {
	/* Function to calculate the "credit_var", which is a boolean used to
	credit individual experiments in expfactory. */
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
		if (experiment_data[i].trial_id == 'probe') {
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

var getInstructFeedback = function() {
	return '<div class = centerbox><p class = center-block-text>' + feedback_instruct_text +
		'</p></div>'
}

var getTestFeedback = function() {
	var global_trial = jsPsych.progress().current_trial_global
	var data_length = num_trials * 6
	var start_cut = global_trial - data_length
	var test_feedback_text = ''

	//below are counters to see if the subject is treating this task as a directed remembering as opposed to a directed forgetting task
	var respond_remember_total = 0
	var neg_respond_remember = 0
	var pos_respond_remember = 0
	
	for(var b =0; b < data_length; b++){
		if(jsPsych.data.getDataByTrialIndex(start_cut + b - 1).probe_type == 'neg'){
			respond_remember_total += 1
			if(jsPsych.data.getDataByTrialIndex(start_cut + b - 1).key_press == '37'){
				neg_respond_remember += 1
			}
		}else if (jsPsych.data.getDataByTrialIndex(start_cut + b - 1).probe_type == 'pos'){
			respond_remember_total += 1
			if(jsPsych.data.getDataByTrialIndex(start_cut + b - 1).key_press == '39'){
				pos_respond_remember += 1
			}
		}
	}
	
	var directed_remembering_total = neg_respond_remember + pos_respond_remember
	var directed_remembering_percent = directed_remembering_total / respond_remember_total 

	
	if (directed_remembering_percent >= 0.75){
	test_feedback_text = 'According to the pattern of your responses, we believe that you are treating this task as a directed remembering task.  Please remember that <strong>this is a directed forgetting task</strong>.</p>'+
						 '<p class = block-text>When you are presented with the cue TOP, you should <strong> forget the top letters</strong> and <strong>remember the bottom letters.</strong></p>'+
						 '<p class = block-text>When you are presented with the cue BOT, you should <strong> forget the bottom letters</strong> and <strong>remember the top letters.</strong></p>'+
						 '<p class = block-text>Press the <strong>left</strong> arrow key if the probe letter <strong> is in the memory set</strong>, and the <strong>right</strong> if it is <strong>not in the memory set</strong>.</p>'+
						 '<p class = block-text>Press enter to continue.'		
	} else {
	test_feedback_text = 'Press <strong> enter </strong>to continue'
	}
		
  	return '<div class = centerbox><p class = block-text>' + test_feedback_text + '</p></div>'
}

/* Append gap and current trial to data and then recalculate for next trial*/

//this adds the current trial and the stims shown to the data
var appendTestData = function() {
	jsPsych.data.addDataToLastTrial({
		trial_num: current_trial,
		stim_top: stims.slice(0,3),
		stim_bottom: stims.slice(3),
		exp_stage: exp_stage
	})
};

//this adds the cue shown and trial number to data
var appendCueData = function() {
	jsPsych.data.addDataToLastTrial({
		cue: cue,
		trial_num: current_trial,
		exp_stage: exp_stage
	})
};

//this adds the probe shown, trial number, and whether it was a correct trial to the data
var appendProbeData = function(data) {
	var trialCue = cue
	var lastSet_top = stims.slice(0,3)
	var lastSet_bottom = stims.slice(3)
	var keypress = data.key_press
	var memorySet = ''
	var correct_response = ''
	var correct = false
	if (trialCue == 'BOT') {
		memorySet = lastSet_top
	} else if (trialCue == 'TOP') {
		memorySet = lastSet_bottom
	}
	if (memorySet.indexOf(probe, 0) == -1) {
		correct_response = 39
	} else if (memorySet.indexOf(probe, 0) != -1) {
		correct_response = 37
	}
	if (keypress == correct_response) {
		correct = true
	}
	jsPsych.data.addDataToLastTrial({
		correct: correct,
		probe_letter: probe,
		probe_type: probeType,
		trial_num: current_trial,
		correct_response: correct_response,
		exp_stage: exp_stage
	})
};

//this is an algorithm to choose the training set based on rules of the game (training sets are composed of any letter not presented in the last two training sets)
var getTrainingSet = function() {
	preceeding1stims = []
	preceeding2stims = []
	trainingArray = jsPsych.randomization.repeat(stimArray, 1);
	if (current_trial < 1) {
		stims = trainingArray.slice(0,6)
	} else if (current_trial == 1) {
		preceeding1stims = stims.slice()
		stims = trainingArray.filter(function(y) {
			return (jQuery.inArray(y, preceeding1stims) == -1)
		}).slice(0,6)
	} else {
		preceeding2stims = preceeding1stims.slice()
		preceeding1stims = stims.slice()
		stims = trainingArray.filter(function(y) {
			return (jQuery.inArray(y, preceeding1stims.concat(preceeding2stims)) == -1)
		}).slice(0,6)
	}
	return '<div class = centerbox><div class = fixation><span style="color:red">+</span></div></div>' +
		'<div class = topLeft><img class = forgetStim src ="' + pathSource + stims[0] + fileType +
		'"></img></div>' +
		'<div class = topMiddle><img class = forgetStim src ="' + pathSource + stims[1] + fileType +
		'"></img></div>' +
		'<div class = topRight><img class = forgetStim src ="' + pathSource + stims[2] + fileType +
		'"></img></div>' +
		'<div class = bottomLeft><img class = forgetStim src ="' + pathSource + stims[3] + fileType +
		'"></img></div>' +
		'<div class = bottomMiddle><img class = forgetStim src ="' + pathSource + stims[4] + fileType +
		'"></img></div>' +
		'<div class = bottomRight><img class = forgetStim src ="' + pathSource + stims[5] + fileType +
		'"></img></div>'
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
	var trainingArray = jsPsych.randomization.repeat(stimArray, 1);
	var lastCue = cue
	var lastSet_top = stims.slice(0,3)
	var lastSet_bottom = stims.slice(3)
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
	var trainingArray = jsPsych.randomization.repeat(stimArray, 1);
	var lastCue = cue
	var lastSet_top = stims.slice(0,3)
	var lastSet_bottom = stims.slice(3)
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
		if (jQuery.inArray(probe, stims.slice(3)) != -1) {
			return 37
		} else {
			return 39
		}

	} else if (cue == 'BOT') {
		if (jQuery.inArray(probe, stims.slice(0,3)) != -1) {
			return 37
		} else {
			return 39
		}
	}
}

var appendPracticeProbeData = function() {
	jsPsych.data.addDataToLastTrial({
		probe_letter: probe,
		probe_type: probeType,
		trial_num: current_trial
	})
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
var attention_check_thresh = 0.65
var sumInstructTime = 0 //ms
var instructTimeThresh = 0 ///in seconds
var credit_var = true

// task specific variables
var choices = [37, 39]
var exp_stage = 'practice'
var practice_length = 8
var num_trials = 24
var num_runs = 3 
var experimentLength = num_trials * num_runs
var current_trial = 0
var stimArray = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O',
	'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'
];
var cueArray = ['TOP', 'BOT']
var probe = ''
var cue = ''
var stims = []
var preceeding1stims = []
var preceeding2stims = []
var probes = ['pos', 'pos', 'neg', 'con']
var probeTypeArray = jsPsych.randomization.repeat(probes, experimentLength / 4)
var practiceProbeTypeArray = jsPsych.randomization.repeat(probes, practice_length/2)
var stimFix = ['fixation']
var pathSource = '/static/experiments/directed_forgetting/images/'
var fileType = '.png'
var images = []
for (var i = 0; i < stimArray.length; i++) {
	images.push(pathSource + stimArray[i] + fileType)
}
images.push(pathSource + 'TOP.png')
images.push(pathSource + 'BOT.png')
	//preload images
jsPsych.pluginAPI.preloadImages(images)

/* ************************************ */
/* Set up jsPsych blocks */
/* ************************************ */
var test_img_block1 = {
	type: 'poldrack-single-stim',
	stimulus: '<div class = instructBox><p class = block-text>This is what a trial will look like.  The letters A, B, and C are on the top portion, while the letters D, E, and F are on the bottom portion.  After these letters disappear, a cue will be presented.  If the cue presented is <strong>TOP</strong>, then you should <strong> forget the letters A, B, and C</strong> and remember D, E, and F.  If the cue presented is <strong>BOT</strong>, then you should <strong> forget D, E, and F </strong> and remember A, B, and C.    Press <strong> enter</strong> to continue.</div>'+
		'<div class = centerbox><div class = fixation><span style="color:red">+</span></div></div>' +
		'<div class = topLeft><img class = forgetStim src ="' + pathSource + stimArray[0] + fileType +
		'"></img></div>' +
		'<div class = topMiddle><img class = forgetStim src ="' + pathSource + stimArray[1] + fileType +
		'"></img></div>' +
		'<div class = topRight><img class = forgetStim src ="' + pathSource + stimArray[2] + fileType +
		'"></img></div>' +
		'<div class = bottomLeft><img class = forgetStim src ="' + pathSource + stimArray[3] + fileType +
		'"></img></div>' +
		'<div class = bottomMiddle><img class = forgetStim src ="' + pathSource + stimArray[4] + fileType +
		'"></img></div>' +
		'<div class = bottomRight><img class = forgetStim src ="' + pathSource + stimArray[5] + fileType +
		'"></img></div>',
	is_html: true,
	choices: [13],
	data: {
		trial_id: "instruction_images"
	},
	timing_post_trial: 0,
	timing_stim: 300000,
	timing_response: 300000,
	response_ends_trial: true,
}

var test_img_block2 = {
	type: 'poldrack-single-stim',
	stimulus: '<div class = centerbox><p class = center-block-text>We will present you with 1 example.  Press <strong> enter</strong> to begin.</p></div>',
	is_html: true,
	choices: [13],
	data: {
		trial_id: "instruction_images"
	},
	timing_post_trial: 0,
	timing_stim: 300000,
	timing_response: 300000,
	response_ends_trial: true,
}

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
	data: {
		trial_id: "end",
		exp_id: 'directed_forgetting'
	},
	timing_response: 180000,
	text: '<div class = centerbox><p class = center-block-text>Thanks for completing this task!</p><p class = center-block-text>Press <strong>enter</strong> to continue.</p></div>',
	cont_key: [13],
	timing_post_trial: 0,
	on_finish: assessPerformance
};



var feedback_instruct_text =
	'Welcome to the experiment. This task will take around 20 minutes. Press <strong>enter</strong> to begin.'
var feedback_instruct_block = {
	type: 'poldrack-text',
	data: {
		trial_id: 'instruction'
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
		trial_id: 'instruction'
	},
	pages: [
		'<div class = centerbox><p class = block-text>In this experiment, on each trial you will be presented with 6 letters. You must memorize all 6 letters. </p><p class = block-text>After the presentation of 6 letters, there will be a short delay. You will then be presented with a cue, either <strong>TOP</strong> or <strong>BOT</strong>. This will instruct you to <strong>forget</strong> the 3 letters located at either the top or bottom (respectively) of the screen.</p> <p class = block-text> The three remaining letters that you must remember are called your <strong>memory set</strong>. You should remember these three letters while forgetting the other three.</p><p class = block-text>You will then be presented with a single letter. Respond with the <strong> Left</strong> arrow key if it is in the memory set, and the <strong> Right </strong> arrow key if it was not in the memory set.</p><p class = block-text>Please make sure you understand these instructions before continuing. You will see an example trial after you end the instructions.</p></div>',
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

var start_practice_block = {
	type: 'poldrack-instructions',
	data: {
		trial_id: 'instruction'
	},
	pages: [
		'<div class = centerbox><p class = block-text>As you saw, there are three letters at the top of the screen and three letters on the bottom of the screen. After a delay, the cue (TOP or BOT) tells you whether to <strong>forget</strong> the three letters at the top or bottom of the screen, respectively. The other three letters are your memory set.</p><p class = block-text>After the cue, you are shown a letter and respond with the <strong> Left</strong> arrow key if it is in the memory set, and the <strong> Right </strong> arrow key if it was not in the memory set.</p><p class = block-text>We will now start with a number of practice trials.</p></div>',
	],
	allow_keys: false,
	show_clickable_nav: true,
	timing_post_trial: 1000
};

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
		trial_id: "fixation"
	},
	timing_post_trial: 0,
	timing_stim: 1000,
	timing_response: 1000,
	on_finish: function() {
		jsPsych.data.addDataToLastTrial({
			exp_stage: exp_stage,
			trial_num: current_trial
		})
	}
}

var fixation_block = {
	type: 'poldrack-single-stim',
	stimulus: '<div class = centerbox><div class = fixation><span style="color:red">+</span></div></div>',
	is_html: true,
	choices: 'none',
	data: {
		trial_id: "fixation"
	},
	timing_post_trial: 0,
	timing_stim: 3000,
	timing_response: 3000,
	on_finish: function() {
		jsPsych.data.addDataToLastTrial({
			exp_stage: exp_stage,
			trial_num: current_trial
		})
	}
}

var ITI_fixation_block = {
	type: 'poldrack-single-stim',
	stimulus: '<div class = centerbox><div class = fixation><span style="color:red">+</span></div></div>',
	is_html: true,
	choices: choices,
	data: {
		trial_id: "ITI_fixation"
	},
	timing_post_trial: 0,
	timing_stim: 4000,
	timing_response: 4000,
	on_finish: function() {
		jsPsych.data.addDataToLastTrial({
			exp_stage: exp_stage,
			trial_num: current_trial
		})
		current_trial = current_trial + 1
	}
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
	choices: choices,
	timing_post_trial: 0,
	timing_stim: 2000,
	timing_response: 2000,
	response_ends_trial: false,
	on_finish: function(data) {
		appendProbeData(data)
	}
};

var intro_test_block = {
	type: 'poldrack-text',
	timing_response: 180000,
	data: {
		trial_id: "intro_test",
		exp_stage: "test"
	},
	text: '<div class = centerbox><p class = block-text>We will now begin the experiment.  For these trials, you will no longer get feedback.</p><p class = block-text> Remember, the cue (TOP or BOT) tells you which letters to <strong>forget</strong>. At the end of the trial respond with the <strong> Left</strong> arrow key if the letter presented is in the memory set, and the <strong> Right </strong> arrow key if it is not in the memory set.</p><p class = block-text> Press <strong>Enter</strong> to begin the experiment.</p></div>',
	cont_key: [13],
	timing_post_trial: 1000,
	on_finish: resetTrial,
};


var practice_probe_block = {
	type: 'poldrack-categorize',
	stimulus: getPracticeProbe,
	key_answer: getResponse,
	choices: choices,
	data: {trial_id: "probe", exp_stage: "practice"},
	correct_text: '<div class = bottombox><div style="color:green"; style="color:green"; class = center-text>Correct!</div></div>',
	incorrect_text: '<div class = bottombox><div style="color:red"; style="color:red"; class = center-text>Incorrect</div></div>',
	timeout_message: '<div class = bottombox><div class = center-text>no response detected</div></div>',
	timing_stim: [2000],
	timing_response: [2000],
	timing_feedback_duration: 750,
	is_html: true,
	on_finish: appendPracticeProbeData,
};

var test_feedback_block = {
	type: 'poldrack-text',
	data: {
		trial_id: 'instruction'
	},
	cont_key: [13],
	text: getTestFeedback,
	timing_post_trial: 0,
	timing_response: 180000
};

/* create experiment definition array */
var directed_forgetting_experiment = [];

directed_forgetting_experiment.push(instruction_node);
directed_forgetting_experiment.push(test_img_block1);
directed_forgetting_experiment.push(test_img_block2);
// show one practice trial
directed_forgetting_experiment.push(start_fixation_block);
directed_forgetting_experiment.push(training_block);
directed_forgetting_experiment.push(cue_block);
directed_forgetting_experiment.push(fixation_block);
directed_forgetting_experiment.push(practice_probe_block);
directed_forgetting_experiment.push(ITI_fixation_block);
// start practice
directed_forgetting_experiment.push(start_practice_block);
for (i = 0; i < (practice_length-1); i++) {
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
	directed_forgetting_experiment.push(test_feedback_block)
	directed_forgetting_experiment.push(attention_node)
}
directed_forgetting_experiment.push(post_task_block)
directed_forgetting_experiment.push(end_block);