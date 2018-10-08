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

var getFeedback = function() {
	return '<div class = bigbox><div class = picture_box><p class = block-text><font color="white">' + feedback_text + '</font></p></div></div>'
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
			if(jsPsych.data.getDataByTrialIndex(start_cut + b - 1).key_press == choices[0]){
				neg_respond_remember += 1
			}
		}else if (jsPsych.data.getDataByTrialIndex(start_cut + b - 1).probe_type == 'pos'){
			respond_remember_total += 1
			if(jsPsych.data.getDataByTrialIndex(start_cut + b - 1).key_press == choices[1]){
				pos_respond_remember += 1
			}
		}
	}
	
	var directed_remembering_total = neg_respond_remember + pos_respond_remember
	var directed_remembering_percent = directed_remembering_total / respond_remember_total 

	
	if (directed_remembering_percent >= 0.75){
	test_feedback_text = 'According to the pattern of your responses, we believe that you are treating this task as a directed remembering task.  Please remember that <i>this is a directed forgetting task</i>.</p>'+
						 '<p class = block-text>When you are presented with the cue TOP, you should <i> forget the top letters</i> and <i>remember the bottom letters.</i></p>'+
						 '<p class = block-text>When you are presented with the cue BOT, you should <i> forget the bottom letters</i> and <i>remember the top letters.</i></p>'+
						 '<p class = block-text>Press the <i>left</i> arrow key if the probe letter <i> is in the memory set</i>, and the <i>right</i> if it is <i>not in the memory set</i>.</p>'+
						 '<p class = block-text>Press enter to continue.'		
	} else {
	test_feedback_text = 'Press <i> enter </i>to continue'
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
		correct_response = choices[1]
	} else if (memorySet.indexOf(probe, 0) != -1) {
		correct_response = choices[0]
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
	return task_boards[0]+stims[0]+
		   task_boards[1]+stims[1]+
		   task_boards[2]+stims[2]+
		   task_boards[3]+stims[3]+
		   task_boards[4]+stims[4]+
		   task_boards[5]+stims[5]+
		   task_boards[6]
};

//returns a cue pseudorandomly, either TOP or BOT
var getCue = function() {
	var temp = Math.floor(Math.random() * 2)
	cue = cueArray[temp]

	return '<div class = bigbox><div class = centerbox><div class = cue-text>'+cue+'</font></div></div></div>'
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
		
	return '<div class = bigbox><div class = centerbox><div class = cue-text>'+probe+'</font></div></div></div>'
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
	return '<div class = bigbox><div class = centerbox><div class = cue-text>'+probe+'</font></div></div></div>'
};

var getResponse = function() {
	if (cue == 'TOP') {
		if (jQuery.inArray(probe, stims.slice(3)) != -1) {
			return choices[0]
		} else {
			return choices[1]
		}

	} else if (cue == 'BOT') {
		if (jQuery.inArray(probe, stims.slice(0,3)) != -1) {
			return choices[0]
		} else {
			return choices[1]
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
var choices = [77, 90]
var exp_stage = 'practice'
var practice_length = 8
var num_trials = 24
var num_runs = 3 
var practice_thresh = 3 // 3 blocks of 15 trials
var accuracy_thresh = 0.80
var missed_thresh = 0.10
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
var pathSource = '/static/experiments/directed_forgetting_single_task_network/images/'
var fileType = '.png'
var images = []
for (var i = 0; i < stimArray.length; i++) {
	images.push(pathSource + stimArray[i] + fileType)
}
images.push(pathSource + 'TOP.png')
images.push(pathSource + 'BOT.png')
	//preload images
jsPsych.pluginAPI.preloadImages(images)

var task_boards = [['<div class = bigbox><div class = topLeft><div class = fixation>'],['</div></div><div class = topMiddle><div class = fixation>'],['</div></div><div class = topRight><div class = fixation>'],['</div></div><div class = bottomLeft><div class = fixation>'],['</div></div><div class = bottomMiddle><div class = fixation>'],['</div></div><div class = bottomRight><div class = fixation>'],['</div></div></div>']]


/* ************************************ */
/* Set up jsPsych blocks */
/* ************************************ */
var test_img_block1 = {
	type: 'poldrack-single-stim',
	stimulus: '<div class = instructBox><p class = block-text>This is what a trial will look like.  The letters A, B, and C are on the top portion, while the letters D, E, and F are on the bottom portion.  After these letters disappear, a cue will be presented.  If the cue presented is <i>TOP</i>, then you should <i> forget the letters A, B, and C</i> and remember D, E, and F.  If the cue presented is <i>BOT</i>, then you should <i> forget D, E, and F </i> and remember A, B, and C.    Press <i> enter</i> to continue.</div>'+
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
	stimulus: '<div class = centerbox><p class = center-block-text>We will present you with 1 example.  Press <i> enter</i> to begin.</p></div>',
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
	text: '<div class = centerbox><p class = center-block-text>Thanks for completing this task!</p><p class = center-block-text>Press <i>enter</i> to continue.</p></div>',
	cont_key: [13],
	timing_post_trial: 0,
	on_finish: function(){
		assessPerformance()
		evalAttentionChecks()
    }
};



var feedback_instruct_text =
	'Welcome to the experiment. This task will take around 30 minutes. Press <i>enter</i> to begin.'
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
		'<div class = centerbox>'+
			'<p class = block-text>In this experiment, on each trial you will be presented with '+
			'6 letters. You must memorize all 6 letters. </p>'+
		
			'<p class = block-text>After the presentation of 6 letters, there will be a short delay. You will then be presented with a cue, '+
			'either <i>TOP</i> or <i>BOT</i>. This will instruct you to <i>forget</i> the '+
			'3 letters located at either the top or bottom (respectively) of the screen.</p>'+
		
			'<p class = block-text>'+
			'The three remaining letters that you must remember are called your <i>memory set</i>. You should remember '+
			'these three letters while forgetting the other three.</p><p class = block-text>You will then be presented with a single '+
			'letter. Respond with the <i> M</i> key if it is in the memory set, and the <i> Z </i> '+
			'key if it was not in the memory set.</p>'+
		
			'<p class = block-text>Please make sure you understand these instructions before continuing. You will see an example trial after you end the instructions.</p>'+
		
			'<p class = block-text>We will start practice when you finish instructions. Please make sure you understand the instructions before moving on. During practice, you will receive a reminder of the rules.  <i>This reminder will be taken out for test</i>.</p>'+
		
		'</div>',
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
				'Read through instructions too quickly.  Please take your time and make sure you understand the instructions.  Press <i>enter</i> to continue.'
			return true
		} else if (sumInstructTime > instructTimeThresh * 1000) {
			feedback_instruct_text = 'Done with instructions. Press <i>enter</i> to continue.'
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
		'<div class = centerbox><p class = block-text>As you saw, there are three letters at the top of the screen and three letters on the bottom of the screen. After a delay, the cue (TOP or BOT) tells you whether to <i>forget</i> the three letters at the top or bottom of the screen, respectively. The other three letters are your memory set.</p><p class = block-text>After the cue, you are shown a letter and respond with the <i> M</i> key if it is in the memory set, and the <i> Z </i> key if it was not in the memory set.</p><p class = block-text>We will now start with a number of practice trials.</p></div>',
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
	text: '<div class = centerbox><p class = block-text>We will now start a test run. Press <i>enter</i> to begin.</p></div>',
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
	text: '<div class = centerbox><p class = block-text>We will now begin the experiment.  For these trials, you will no longer get feedback.</p><p class = block-text> Remember, the cue (TOP or BOT) tells you which letters to <i>forget</i>. At the end of the trial respond with the <i> M</i> key if the letter presented is in the memory set, and the <i> Z </i> key if it is not in the memory set.</p><p class = block-text> Press <i>Enter</i> to begin the experiment.</p></div>',
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
	correct_text: '<div class = bottombox><div class = center-text>Correct!</div></div>',
	incorrect_text: '<div class = bottombox><div class = center-text>Incorrect</div></div>',
	timeout_message: '<div class = bottombox><div class = center-text>Respond Faster!</div></div>',
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

var feedback_text = 
	'Welcome to the experiment. This experiment will take less than 30 minutes. Press <i>enter</i> to begin.'
var feedback_block = {
	type: 'poldrack-single-stim',
	data: {
		exp_id: "n_back_single_task_network",
		trial_id: "practice-no-stop-feedback"
	},
	choices: [13],
	stimulus: getFeedback,
	timing_post_trial: 0,
	is_html: true,
	timing_stim: -1,
	timing_response: -1,
	response_ends_trial: true, 

};


var practiceTrials = []
practiceTrials.push(feedback_block)
practiceTrials.push(instructions_block)
for (i = 0; i < (practice_length-1); i++) {
	practiceTrials.push(start_fixation_block);
	practiceTrials.push(training_block);
	practiceTrials.push(cue_block);
	practiceTrials.push(fixation_block);
	practiceTrials.push(practice_probe_block);
	practiceTrials.push(ITI_fixation_block);
}


var practiceCount = 0
var practiceNode = {
	timeline: practiceTrials,
	loop_function: function(data){
		practiceCount += 1
		probeTypeArray = jsPsych.randomization.repeat(probes, experimentLength / 4)
		practiceProbeTypeArray = jsPsych.randomization.repeat(probes, practice_length/2)
	
		var sum_rt = 0
		var sum_responses = 0
		var correct = 0
		var total_trials = 0
	
		for (var i = 0; i < data.length; i++){
			if (data[i].trial_id == "probe"){
				total_trials+=1
				if (data[i].rt != -1){
					sum_rt += data[i].rt
					sum_responses += 1
					if (data[i].key_press == data[i].correct_response){
						correct += 1
		
					}
				}
		
			}
	
		}
	
		var accuracy = correct / total_trials
		var missed_responses = (total_trials - sum_responses) / total_trials
		var ave_rt = sum_rt / sum_responses
	
		feedback_text = "<br>Please take this time to read your feedback and to take a short break! Press enter to continue"
		feedback_text += "</p><p class = block-text><i>Average reaction time:  " + Math.round(ave_rt) + " ms. 	Accuracy: " + Math.round(accuracy * 100)+ "%</i>"

		if (accuracy > accuracy_thresh){
			feedback_text +=
					'</p><p class = block-text>Done with this practice. Press Enter to continue.' 
			stims = createTrialTypes(numTrialsPerBlock)
			return false
	
		} else if (accuracy < accuracy_thresh){
			feedback_text +=
					'</p><p class = block-text>Your accuracy is too low.  Remember: <br>' + prompt_text_list
					
			if (missed_responses > missed_thresh){
				feedback_text +=
						'</p><p class = block-text>You have not been responding to some trials.  Please respond on every trial that requires a response.'
			}
		
			if (practiceCount == practice_thresh){
				feedback_text +=
					'</p><p class = block-text>Done with this practice.' 
					
					return false
			}
			
			feedback_text +=
				'</p><p class = block-text>Redoing this practice. Press Enter to continue.' 
			
			return true
		
		}
	
	}
	
}
/* create experiment definition array */
var directed_forgetting_single_task_network_experiment = [];
/*
directed_forgetting_single_task_network_experiment.push(instruction_node);

directed_forgetting_single_task_network_experiment.push(test_img_block1);
directed_forgetting_single_task_network_experiment.push(test_img_block2);
// show one practice trial
directed_forgetting_single_task_network_experiment.push(start_fixation_block);
directed_forgetting_single_task_network_experiment.push(training_block);
directed_forgetting_single_task_network_experiment.push(cue_block);
directed_forgetting_single_task_network_experiment.push(fixation_block);
directed_forgetting_single_task_network_experiment.push(practice_probe_block);
directed_forgetting_single_task_network_experiment.push(ITI_fixation_block);
*/

directed_forgetting_single_task_network_experiment.push(practiceNode)
directed_forgetting_single_task_network_experiment.push(feedback_block)

for (r = 0; r < num_runs; r++) {
	if (r === 0) {
		directed_forgetting_single_task_network_experiment.push(intro_test_block)
	} else {
		directed_forgetting_single_task_network_experiment.push(start_test_block);
	}
	for (i = 0; i < num_trials; i++) {
		directed_forgetting_single_task_network_experiment.push(start_fixation_block);
		directed_forgetting_single_task_network_experiment.push(training_block);
		directed_forgetting_single_task_network_experiment.push(cue_block);
		directed_forgetting_single_task_network_experiment.push(fixation_block);
		directed_forgetting_single_task_network_experiment.push(probe_block);
		directed_forgetting_single_task_network_experiment.push(ITI_fixation_block);
	}
	directed_forgetting_single_task_network_experiment.push(test_feedback_block)
	directed_forgetting_single_task_network_experiment.push(attention_node)
}
directed_forgetting_single_task_network_experiment.push(post_task_block)
directed_forgetting_single_task_network_experiment.push(end_block);