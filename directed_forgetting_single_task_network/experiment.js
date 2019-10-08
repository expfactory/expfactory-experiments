/* ************************************ */
/* Define helper functions */
/* ************************************ */
function addID() {
  jsPsych.data.addDataToLastTrial({exp_id: 'directed_forgetting_single_task_network'})
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


function assessPerformance() {
	/* Function to calculate the "credit_var", which is a boolean used to
	credit individual experiments in expfactory. */
	var experiment_data = jsPsych.data.getTrialsOfType('poldrack-single-stim')
	var missed_count = 0
	var trial_count = 0
	var rt_array = []
	var rt = 0
	var correct = 0
	
	//record choices participants made
	var choice_counts = {}
	choice_counts[-1] = 0
	choice_counts[77] = 0
	choice_counts[90] = 0
	for (var k = 0; k < choices.length; k++) {
		choice_counts[choices[k]] = 0
	}
	for (var i = 0; i < experiment_data.length; i++) {
		if (experiment_data[i].trial_id == 'test_trial') {
			trial_count += 1
			rt = experiment_data[i].rt
			key = experiment_data[i].key_press
			choice_counts[key] += 1
			if (rt == -1) {
				missed_count += 1
			} else {
				rt_array.push(rt)
			}
			
			if (key == experiment_data[i].correct_response){
				correct += 1
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
	var accuracy = correct / trial_count
	credit_var = (missed_percent < 0.25 && avg_rt > 200 && responses_ok && accuracy > 0.60)
	jsPsych.data.addDataToLastTrial({final_credit_var: credit_var,
									 final_missed_percent: missed_percent,
									 final_avg_rt: avg_rt,
									 final_responses_ok: responses_ok,
									 final_accuracy: accuracy})
}

var getInstructFeedback = function() {
	return '<div class = centerbox><p class = center-block-text>' + feedback_instruct_text +
		'</p></div>'
}

var getFeedback = function() {
	return '<div class = bigbox><div class = picture_box><p class = block-text>' + feedback_text + '</p></div></div>'
}

var getTestFeedback = function() {
	return '<div class = bigbox><div class = picture_box><p class = block-text>' + test_feedback_text + '</p></div></div>'
}

var getCategorizeFeedback = function(){
	curr_trial = jsPsych.progress().current_trial_global - 2
	trial_id = jsPsych.data.getDataByTrialIndex(curr_trial).trial_id
	if (trial_id == 'practice_trial'){
		if (jsPsych.data.getDataByTrialIndex(curr_trial).key_press == jsPsych.data.getDataByTrialIndex(curr_trial).correct_response){
			
			return '<div class = fb_box><div class = center-text><font size = 20>Correct!</font></div></div>' + prompt_text
		} else if ((jsPsych.data.getDataByTrialIndex(curr_trial).key_press != jsPsych.data.getDataByTrialIndex(curr_trial).correct_response) && (jsPsych.data.getDataByTrialIndex(curr_trial).key_press != -1)){
			
			return '<div class = fb_box><div class = center-text><font size = 20>Incorrect</font></div></div>' + prompt_text
	
		} else if (jsPsych.data.getDataByTrialIndex(curr_trial).key_press == -1){
			
			return '<div class = fb_box><div class = center-text><font size = 20>Respond Faster!</font></div></div>' + prompt_text
		}
	}
}

//this adds the probe shown, trial number, and whether it was a correct trial to the data
var appendProbeData = function(data) {
	var curr_trial = jsPsych.progress().current_trial_global
	var trialCue = cue
	var lastSet_top = letters.slice(0,numLetters/2)
	var lastSet_bottom = letters.slice(numLetters/2)
	var keypress = data.key_press
	var memorySet = ''
	var forgetSet = ''
	var correct = false
	if (trialCue == 'BOT') {
		memorySet = lastSet_top
		forgetSet = lastSet_bottom
	} else if (trialCue == 'TOP') {
		memorySet = lastSet_bottom
		forgetSet = lastSet_top
	}
	
	if (keypress == correct_response) {
		correct = true
	}
	
	jsPsych.data.addDataToLastTrial({
		correct: correct,
		probe_letter: probe,
		directed_forgetting_condition: directed_condition,
		trial_num: current_trial,
		correct_response: correct_response,
		exp_stage: exp_stage,
		cue: cue,
		top_stim: lastSet_top,
		bottom_stim: lastSet_bottom,
		memory_set: memorySet,
		forget_set: forgetSet
	})
	
	
	if (jsPsych.data.getDataByTrialIndex(curr_trial).key_press == correct_response){
		jsPsych.data.addDataToLastTrial({
			correct_trial: 1,
		})

	} else if (jsPsych.data.getDataByTrialIndex(curr_trial).key_press != correct_response){
		jsPsych.data.addDataToLastTrial({
			correct_trial: 0,
		})
	}
};

//this is an algorithm to choose the training set based on rules of the game (training sets are composed of any letter not presented in the last two training sets)
var getTrainingSet = function(used_letters, numLetters) {
	
	var trainingArray = jsPsych.randomization.repeat(stimArray, 1);
	var letters = trainingArray.filter(function(y) {
		
		return (jQuery.inArray(y, used_letters.slice(-numLetters*2)) == -1)
	}).slice(0,numLetters)
	
	return letters
};

//returns a cue pseudorandomly, either TOP or BOT
var getCue = function() {
	var temp = Math.floor(Math.random() * 2)
	cue = cueArray[temp]
	
	return cue
};

// Will pop out a probe type from the entire probeTypeArray and then choose a probe congruent with the probe type
var getProbe = function(letters,directed_condition,cue) {
	var trainingArray = jsPsych.randomization.repeat(stimArray, 1);
	var lastSet_top = letters.slice(0,numLetters/2)
	var lastSet_bottom = letters.slice(numLetters/2)
	if (directed_condition == 'pos') {
		if (cue == 'BOT') {
			probe = lastSet_top[Math.floor(Math.random() * numLetters/2)]
		} else if (cue == 'TOP') {
			probe = lastSet_bottom[Math.floor(Math.random() * numLetters/2)]
		}
	} else if (directed_condition == 'neg') {
		if (cue == 'BOT') {
			probe = lastSet_bottom[Math.floor(Math.random() * numLetters/2)]
		} else if (cue == 'TOP') {
			probe = lastSet_top[Math.floor(Math.random() * numLetters/2)]
		}
	} else if (directed_condition == 'con') {
		newArray = trainingArray.filter(function(y) {
			return (y != lastSet_top[0] && y != lastSet_top[1] &&
					y != lastSet_bottom[0] && y != lastSet_bottom[1])
		})
		probe = newArray.pop()
	}
		
	return probe
	//'<div class = bigbox><div class = centerbox><div class = cue-text>' + preFileType + probe + fileTypePNG + '</div></div></div>'
};

var getCueHTML = function(){
	return '<div class = bigbox><div class = centerbox><div class = cue-text>' + preFileType + cue + fileTypePNG + '</div></div></div>'
}

var getProbeHTML = function(){
	return '<div class = bigbox><div class = centerbox><div class = cue-text>' + preFileType + probe + fileTypePNG + '</div></div></div>'
}

var getLettersHTML = function(){
	stim = stims.pop()
	directed_condition = stim.directed_condition
	letters = stim.letters
	cue = stim.cue
	probe = stim.probe
	correct_response = stim.correct_response
	
	
	return task_boards[0]+ preFileType + letters[0] + fileTypePNG +
		   task_boards[1]+
		   task_boards[2]+ preFileType + letters[1] + fileTypePNG +
		   task_boards[3]+ preFileType + letters[2] + fileTypePNG +
		   task_boards[4]+
		   task_boards[5]+ preFileType + letters[3] + fileTypePNG +
		   task_boards[6]
}

var getCorrectResponse = function(probeType){
	
	if (probeType == 'pos') {
		return choices[0]
	} else if (probeType == 'neg') {
		return choices[1]
	} else if (probeType == 'con') {
		return choices[1]
	}
}


var resetTrial = function() {
	current_trial = 0
	exp_stage = 'test'
}


var createTrialTypes = function (numTrialsPerBlock,numLetters){
	var probeTypeArray = jsPsych.randomization.repeat(probes, numTrialsPerBlock / probes.length)
	var used_letters = []
	var stims = []
	
	for (var i = 0; i < numTrialsPerBlock; i++){
		var directed_condition = probeTypeArray.pop()
		var letters = getTrainingSet(used_letters,numLetters)
		var cue = getCue()
		var probe = getProbe(letters,directed_condition,cue)
		var correct_response = getCorrectResponse(directed_condition)
		
		stim = {
			directed_condition:directed_condition,
			letters: letters,
			cue: cue,
			probe: probe,
			correct_response: correct_response
			}
		stims.push(stim)
		
		used_letters = used_letters.concat(letters)
		 
	
	
	}
	
	return stims
	
}

/* ************************************ */
/* Define experimental variables */
/* ************************************ */
// generic task variables
var run_attention_checks = true
var attention_check_thresh = 0.65
var sumInstructTime = 0 //ms
var instructTimeThresh = 0 ///in seconds
var credit_var = 0

// task specific variables
var choices = [77, 90]
var exp_stage = 'practice'
var practice_length = 8 
var numTrialsPerBlock = 48
var numTestBlocks = 4 
var practice_thresh = 3 // 3 blocks of 8 trials
var accuracy_thresh = 0.75
var rt_thresh = 1000
var missed_thresh = 0.10
var exp_len = numTrialsPerBlock * numTestBlocks
var current_trial = 0
var stimArray = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O',
	'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'
];
var numLetters = 4
var cueArray = ['TOP', 'BOT']
var probe = ''
var cue = ''
var stims = []
var preceeding1stims = []
var preceeding2stims = []
var probes = ['pos', 'pos', 'neg', 'con']
var stimFix = ['fixation']
var pathSource = '/static/experiments/directed_forgetting_single_task_network/images/'
var fileType = '.png'
var fileTypePNG = ".png'></img>"
var preFileType = "<img class = center src='/static/experiments/directed_forgetting_single_task_network/images/"


var task_boards = [['<div class = bigbox><div class = topLeft><div class = cue-text>'],['</div></div><div class = topMiddle><div class = cue-text>'],['</div></div><div class = topRight><div class = cue-text>'],['</div></div><div class = bottomLeft><div class = cue-text>'],['</div></div><div class = bottomMiddle><div class = cue-text>'],['</div></div><div class = bottomRight><div class = cue-text>'],['</div></div></div>']]

var prompt_text_list = '<ul style="text-align:left">'+
						'<li>Please respond if the probe (single letter) was in the memory set.</li>'+
						'<li>In memory set: M key</li>' +
						'<li>Not in memory set: Z key</li>' +
					   '</ul>'

var prompt_text = '<div class = prompt_box>'+
					  '<p class = center-block-text style = "font-size:16px; line-height:80%%;">Please respond if the probe (single letter) was in the memory set.</p>' +
					  '<p class = center-block-text style = "font-size:16px; line-height:80%%;">In memory set: M key</p>' +
					  '<p class = center-block-text style = "font-size:16px; line-height:80%%;">Not in memory set: Z key</p>' +
				  '</div>'
				  
				  
//PRE LOAD IMAGES HERE
var pathSource = "/static/experiments/directed_forgetting_single_task_network/images/"
var images = []

for(i = 0; i < stimArray.length; i++){
	images.push(pathSource + stimArray[i] + '.png')
}
images.push(pathSource + 'BOT.png')
images.push(pathSource + 'TOP.png')
jsPsych.pluginAPI.preloadImages(images);

var stims = createTrialTypes(practice_length,numLetters)

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
       exp_id: "directed_forgetting_single_task_network",
       trial_id: "post task questions"
   },
   questions: ['<p class = center-block-text style = "font-size: 20px">Please summarize what you were asked to do in this task.</p>',
              '<p class = center-block-text style = "font-size: 20px">Do you have any comments about this task?</p>'],
   rows: [15, 15],
   timing_response: 360000,
   columns: [60,60]
};

var end_block = {
	type: 'poldrack-text',
	data: {
		trial_id: "end",
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
	'Welcome to the experiment. This task will take around 14 minutes. Press <i>enter</i> to begin.'
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
			''+numLetters+' letters. You must memorize all '+numLetters+' letters. </p>'+
		
			'<p class = block-text>After the presentation of '+numLetters+' letters, there will be a short delay. You will then be presented with a cue, '+
			'either <i>TOP</i> or <i>BOT</i>. This will instruct you to <i>forget</i> the '+
			''+numLetters/2+' letters located at either the top or bottom (respectively) of the screen.</p>' + 
			
			'<p class = block-text>So if you get the cue <i>TOP</i>, please <i>forget</i> the top '+numLetters/2+' letters.</p>'+
		
			'<p class = block-text>'+
				'The '+numLetters/2+' remaining letters that you must remember are called your <i>memory set</i>. You should remember '+
				'these '+numLetters/2+' letters while forgetting the other '+numLetters/2+'.</p>'+
		'</div>',
		
		'<div class = centerbox>'+
			'<p class = block-text>You will then be presented with a single '+
			'letter. Respond with the <i> M</i> key if it is in the memory set, and the <i> Z </i> '+
			'key if it was not in the memory set.</p>'+
				
			'<p class = block-text>We will start practice when you finish instructions. Please make sure you understand the instructions before moving on. During practice, you will receive a reminder of the rules.  <i>This reminder will be taken out for test</i>.</p>'+
			'<p class = block-text>To avoid technical issues, please keep the experiment tab (on Chrome or Firefox) <i>active and in full-screen mode</i> for the whole duration of each task.</p>'+
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
		'<div class = centerbox><p class = block-text>As you saw, there are '+numLetters/2+' letters at the top of the screen and '+numLetters/2+' letters on the bottom of the screen. After a delay, the cue (TOP or BOT) tells you whether to <i>forget</i> the '+numLetters/2+' letters at the top or bottom of the screen, respectively. The other '+numLetters/2+' letters are your memory set.</p><p class = block-text>After the cue, you are shown a letter and respond with the <i> M</i> key if it is in the memory set, and the <i> Z </i> key if it was not in the memory set.</p><p class = block-text>We will now start with a number of practice trials.</p></div>',
	],
	allow_keys: false,
	show_clickable_nav: true,
	timing_response: 180000,
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
	stimulus: '<div class = centerbox><div class = fixation><span style="color:white">+</span></div></div>',
	is_html: true,
	choices: 'none',
	data: {
		trial_id: "fixation"
	},
	timing_post_trial: 0,
	timing_stim: 500, //500
	timing_response: 500, //500
	on_finish: function() {
		jsPsych.data.addDataToLastTrial({
			exp_stage: exp_stage,
			trial_num: current_trial
		})
	}
}

var fixation_block = {
	type: 'poldrack-single-stim',
	stimulus: '<div class = centerbox><div class = fixation><span style="color:white">+</span></div></div>',
	is_html: true,
	choices: 'none',
	data: {
		trial_id: "fixation"
	},
	timing_post_trial: 0,
	timing_stim: 2000, //2000
	timing_response: 2000, //2000
	on_finish: function() {
		jsPsych.data.addDataToLastTrial({
			exp_stage: exp_stage,
			trial_num: current_trial
		})
	}
}

var ITI_fixation_block = {
	type: 'poldrack-single-stim',
	is_html: true,
	choices: choices,
	data: {
		trial_id: "ITI_fixation"
	},
	timing_post_trial: 0,
	timing_stim: 1000, //1000
	timing_response: 1000, //1000
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
	stimulus: getLettersHTML,
	is_html: true,
	data: {
		trial_id: "stim"
	},
	choices: 'none',
	timing_post_trial: 0,
	timing_stim: 2000, //2000
	timing_response: 2000 //2000
};



var cue_block = {
	type: 'poldrack-single-stim',
	stimulus: getCueHTML,
	is_html: true,
	data: {
		trial_id: "cue",
		exp_stage: "test"
	},
	choices: false,
	timing_post_trial: 0,
	timing_stim: 1000, //1000
	timing_response: 1000 //1000
};

var probe_block = {
	type: 'poldrack-single-stim',
	stimulus: getProbeHTML,
	is_html: true,
	data: {
		trial_id: "test_trial",
		exp_stage: "test"
	},
	choices: choices,
	timing_post_trial: 0,
	timing_stim: 1000, //1000
	timing_response: 1000, //1000
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
	text: '<div class = centerbox><p class = block-text>We will now begin the experiment.  For these trials, you will no longer get feedback.</p><p class = block-text> Remember, the cue (TOP or BOT) tells you which letters to <i>forget</i>. At the end of the trial respond with the <i> M</i> key if the letter presented is in the memory set, and the <i> Z </i> key if it is not in the memory set.</p><p class = block-text> Press <i>Enter</i> to begin the experiment.</p></div>',
	cont_key: [13],
	timing_post_trial: 1000,
	on_finish: resetTrial,
};


var practice_probe_block = {
	type: 'poldrack-single-stim',
	stimulus: getProbeHTML,
	choices: choices,
	data: {trial_id: "practice_trial", 
		   exp_stage: "practice"
		   },
	timing_stim: 1000, //1000
	timing_response: 1000, //1000
	timing_post_trial: 0,
	is_html: true,
	prompt: prompt_text,
	on_finish: appendProbeData
};

var feedback_text = 
	'Welcome to the experiment. This experiment will take around 15 minutes. Press <i>enter</i> to begin.'
var feedback_block = {
	type: 'poldrack-single-stim',
	data: {
		trial_id: "practice_feedback"
	},
	choices: [13],
	stimulus: getFeedback,
	timing_post_trial: 0,
	is_html: true,
	timing_response: 180000,
	response_ends_trial: true, 

};

var test_feedback_text = 
	'We will now start a test run.  Press <i>enter</i> to begin.'
var test_feedback_block = {
	type: 'poldrack-single-stim',
	data: {
		trial_id: "test_feedback"
	},
	choices: [13],
	stimulus: getTestFeedback,
	timing_post_trial: 0,
	is_html: true,
	timing_response: 180000,
	response_ends_trial: true, 

};

var practiceTrials = []
practiceTrials.push(feedback_block)
practiceTrials.push(instructions_block)
for (i = 0; i < (practice_length); i++) {
	var practice_start_fixation_block = {
		type: 'poldrack-single-stim',
		stimulus: '<div class = centerbox><div class = fixation><span style="color:white">+</span></div></div>',
		is_html: true,
		choices: 'none',
		data: {
			trial_id: "practice_fixation"
		},
		timing_post_trial: 0,
		timing_stim: 500, //500
		timing_response: 500, //500
		prompt: prompt_text,
		on_finish: function() {
			jsPsych.data.addDataToLastTrial({
				exp_stage: exp_stage,
				trial_num: current_trial
			})
		}
	}

	var practice_fixation_block = {
		type: 'poldrack-single-stim',
		stimulus: '<div class = centerbox><div class = fixation><span style="color:white">+</span></div></div>',
		is_html: true,
		choices: 'none',
		data: {
			trial_id: "practice_fixation"
		},
		timing_post_trial: 0,
		timing_stim: 2000, //2000
		prompt: prompt_text,
		timing_response: 2000, //2000
		on_finish: function() {
			jsPsych.data.addDataToLastTrial({
				exp_stage: exp_stage,
				trial_num: current_trial
			})
		}
	}

	var practice_ITI_fixation_block = {
		type: 'poldrack-single-stim',
		is_html: true,
		choices: 'none',
		data: {
			trial_id: "practice_ITI_fixation"
		},
		timing_post_trial: 0,
		timing_stim: 1000, //1000
		prompt: prompt_text,
		timing_response: 1000, //1000
		on_finish: function() {
			jsPsych.data.addDataToLastTrial({
				exp_stage: exp_stage,
				trial_num: current_trial
			})
			current_trial = current_trial + 1
		}
	}

	var practice_training_block = {
		type: 'poldrack-single-stim',
		stimulus: getLettersHTML,
		is_html: true,
		data: {
			trial_id: "practice_stim"
		},
		choices: 'none',
		prompt: prompt_text,
		timing_post_trial: 0,
		timing_stim: 2000, //2000
		timing_response: 2000 //2000
	};



	var practice_cue_block = {
		type: 'poldrack-single-stim',
		stimulus: getCueHTML,
		is_html: true,
		data: {
			trial_id: "practice_cue",
		},
		choices: 'none',
		prompt: prompt_text,
		timing_post_trial: 0,
		timing_stim: 1000, //1000
		timing_response: 1000 //1000
	};
	
	var categorize_block = {
		type: 'poldrack-single-stim',
		data: {
			trial_id: "practice-stop-feedback"
		},
		choices: 'none',
		stimulus: getCategorizeFeedback,
		timing_post_trial: 0,
		is_html: true,
		timing_stim: 500, //500
		timing_response: 500, //500
		response_ends_trial: false, 

	};
	
	practiceTrials.push(practice_start_fixation_block);
	practiceTrials.push(practice_training_block);
	practiceTrials.push(practice_cue_block);
	practiceTrials.push(practice_fixation_block);
	practiceTrials.push(practice_probe_block);
	practiceTrials.push(practice_ITI_fixation_block);
	practiceTrials.push(categorize_block);
}


var practiceCount = 0
var practiceNode = {
	timeline: practiceTrials,
	loop_function: function(data){
		practiceCount += 1
		stims = createTrialTypes(practice_length,numLetters)
	
		var sum_rt = 0
		var sum_responses = 0
		var correct = 0
		var total_trials = 0
	
		for (var i = 0; i < data.length; i++){
			if (data[i].trial_id == 'practice_trial'){
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

		if (accuracy > accuracy_thresh){
			feedback_text +=
					'</p><p class = block-text>Done with this practice. Press Enter to continue.' 
			stims = createTrialTypes(numTrialsPerBlock,numLetters)
			return false
	
		} else if (accuracy < accuracy_thresh){
			feedback_text +=
					'</p><p class = block-text>We are going to try practice again to see if you can achieve higher accuracy.  Remember: <br>' + prompt_text_list
					
			if (missed_responses > missed_thresh){
				feedback_text +=
						'</p><p class = block-text>You have not been responding to some trials.  Please respond on every trial that requires a response.'
			}

	      	if (ave_rt > rt_thresh){
	        	feedback_text += 
	            	'</p><p class = block-text>You have been responding too slowly.'
	      	}

		
			if (practiceCount == practice_thresh){
				feedback_text +=
					'</p><p class = block-text>Done with this practice.' 
					stims = createTrialTypes(numTrialsPerBlock,numLetters)
					return false
			}
			
			feedback_text +=
				'</p><p class = block-text>Redoing this practice. Press Enter to continue.' 
			
			return true
		
		}
	
	}
	
}

var testTrials = []
testTrials.push(test_feedback_block)
testTrials.push(attention_node)
for (i = 0; i < numTrialsPerBlock; i++) { //numTrialsPerBlock
	testTrials.push(start_fixation_block);
	testTrials.push(training_block);
	testTrials.push(cue_block);
	testTrials.push(fixation_block);
	testTrials.push(probe_block);
	testTrials.push(ITI_fixation_block);
}

var testCount = 0
var testNode = {
	timeline: testTrials,
	loop_function: function(data) {
		stims = createTrialTypes(numTrialsPerBlock,numLetters)
		testCount += 1
		current_trial = 0 
		
		//below are counters to see if the subject is treating this task as a directed remembering as opposed to a directed forgetting task
		var respond_remember_total = 0
		var neg_respond_remember = 0
		var pos_respond_remember = 0
	
		for (var i = 0; i < data.length; i++) {
			if (data[i].trial_id == 'test_trial') {
				if(data[i].probe_type == 'neg'){
					respond_remember_total += 1
					if(data[i].key_press == choices[0]){
						neg_respond_remember += 1
					}
				}else if (data[i].probe_type == 'pos'){
					respond_remember_total += 1
					if(data[i].key_press == choices[1]){
						pos_respond_remember += 1
					}
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
			var sum_rt = 0
			var sum_responses = 0
			var correct = 0
			var total_trials = 0
	
			for (i = 0; i < data.length; i++){
				if (data[i].trial_id == "test_trial"){
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
	
			test_feedback_text = "<br>Please take this time to read your feedback and to take a short break! Press enter to continue"
			test_feedback_text += "</p><p class = block-text>You have completed: "+testCount+" out of "+numTestBlocks+" blocks of trials."
		
			if (accuracy < accuracy_thresh){
				test_feedback_text +=
						'</p><p class = block-text>Your accuracy is too low.  Remember: <br>' + prompt_text_list
			}
			if (missed_responses > missed_thresh){
				test_feedback_text +=
						'</p><p class = block-text>You have not been responding to some trials.  Please respond on every trial that requires a response.'
			}

	      	if (ave_rt > rt_thresh){
	        	feedback_text += 
	            	'</p><p class = block-text>You have been responding too slowly.'
	      	}
	
			if (testCount == numTestBlocks){
				test_feedback_text +=
						'</p><p class = block-text>Done with this test. Press Enter to continue.<br> If you have been completing tasks continuously for an hour or more, please take a 15-minute break before starting again.'
				return false
			}
		}
	
		return '<div class = bigbox><div class = picture_box><p class = block-text>' + test_feedback_text + '</p></div></div>'	
		
	}
}
/* create experiment definition array */
var directed_forgetting_single_task_network_experiment = [];

directed_forgetting_single_task_network_experiment.push(practiceNode)
directed_forgetting_single_task_network_experiment.push(feedback_block)

directed_forgetting_single_task_network_experiment.push(intro_test_block)
directed_forgetting_single_task_network_experiment.push(testNode)
directed_forgetting_single_task_network_experiment.push(test_feedback_block)

directed_forgetting_single_task_network_experiment.push(post_task_block)
directed_forgetting_single_task_network_experiment.push(end_block);