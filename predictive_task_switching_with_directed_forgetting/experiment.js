/* ************************************ */
/* Define helper functions */
/* ************************************ */
function addID() {
  jsPsych.data.addDataToLastTrial({exp_id: 'predictive_task_switching_with_directed_forgetting'})
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
	//record choices participants made
	var choice_counts = {}
	choice_counts[-1] = 0
	for (var k = 0; k < possible_responses.length; k++) {
		choice_counts[possible_responses[k]] = 0
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


var createTrialTypes = function(numTrialsPerBlock){
	//probeTypeArray = jsPsych.randomization.repeat(probes, numTrialsPerBlock / 4)
	var whichQuadStart = jsPsych.randomization.repeat([1,2,3,4],1).pop()
	var predictive_cond_array = predictive_conditions[whichQuadStart%2]
	predictive_dimensions = predictive_dimensions_list[Math.floor(Math.random() * 2)]
	
	var directed_forgetting_trial_type_list = []
	var directed_forgetting_trial_types1 = jsPsych.randomization.repeat(directed_cond_array, numTrialsPerBlock/4)
	var directed_forgetting_trial_types2 = jsPsych.randomization.repeat(directed_cond_array, numTrialsPerBlock/4)
	var directed_forgetting_trial_types3 = jsPsych.randomization.repeat(directed_cond_array, numTrialsPerBlock/4)
	var directed_forgetting_trial_types4 = jsPsych.randomization.repeat(directed_cond_array, numTrialsPerBlock/4)
	directed_forgetting_trial_type_list.push(directed_forgetting_trial_types1)
	directed_forgetting_trial_type_list.push(directed_forgetting_trial_types2)
	directed_forgetting_trial_type_list.push(directed_forgetting_trial_types3)
	directed_forgetting_trial_type_list.push(directed_forgetting_trial_types4)
	
	directed_condition =  jsPsych.randomization.repeat(directed_cond_array, 1).pop()
	predictive_dimension = predictive_dimensions[whichQuadStart - 1]
	
	letters = getTrainingSet()
	cue = getCue()
	probe = getProbe(directed_condition,letters,cue, predictive_dimension)
	correct_response = getCorrectResponse(predictive_dimension,cue,probe,letters)
	
	var stims = []
	var first_stim = {
		whichQuad: whichQuadStart,
		predictive_condition: 'N/A',
		predictive_dimension: predictive_dimension,
		directed_condition: directed_condition,
		letters: letters,
		cue: cue,
		probe: probe,
		correct_response: correct_response
	
	}
	
	stims.push(first_stim)
	
	for (var i = 0; i < numTrialsPerBlock; i++){
		whichQuadStart += 1
		quadIndex = whichQuadStart%4
		if (quadIndex == 0){
			quadIndex = 4
		}
		directed_condition = directed_forgetting_trial_type_list[quadIndex - 1].pop()
		predictive_dimension = predictive_dimensions[quadIndex - 1]
		
		letters = getTrainingSet()
		cue = getCue()
		probe = getProbe(directed_condition,letters,cue, predictive_dimension)
		correct_response = getCorrectResponse(predictive_dimension,cue,probe,letters)
		
		var stim = {
			whichQuad: quadIndex,
			predictive_condition:  predictive_cond_array[i%2],
			predictive_dimension: predictive_dimension,
			directed_condition: directed_condition,
			letters: letters,
			cue: cue,
			probe: probe,
			correct_response: correct_response
		}
		
		stims.push(stim)
	}
	
	return stims
}


//this is an algorithm to choose the training set based on rules of the game (training sets are composed of any letter not presented in the last two training sets)
var getTrainingSet = function() {
	preceeding1stims = []
	preceeding2stims = []
	trainingArray = jsPsych.randomization.repeat(stimArray, 1);
	if (current_trial < 1) {
		letters = trainingArray.slice(0,6)
	} else if (current_trial == 1) {
		preceeding1stims = letters.slice()
		letters = trainingArray.filter(function(y) {
			return (jQuery.inArray(y, preceeding1stims) == -1)
		}).slice(0,6)
	} else {
		preceeding2stims = preceeding1stims.slice()
		preceeding1stims = letters.slice()
		letters = trainingArray.filter(function(y) {
			return (jQuery.inArray(y, preceeding1stims.concat(preceeding2stims)) == -1)
		}).slice(0,6)
	}
	return letters
		/*
		'<div class = centerbox><div class = fixation><span style="color:red">+</span></div></div>' +
		'<div class = topLeft><img class = forgetStim src ="' + pathSource + stim[0] + fileType +
		'"></img></div>' +
		'<div class = topMiddle><img class = forgetStim src ="' + pathSource + stim[1] + fileType +
		'"></img></div>' +
		'<div class = topRight><img class = forgetStim src ="' + pathSource + stim[2] + fileType +
		'"></img></div>' +
		'<div class = bottomLeft><img class = forgetStim src ="' + pathSource + stim[3] + fileType +
		'"></img></div>' +
		'<div class = bottomMiddle><img class = forgetStim src ="' + pathSource + stim[4] + fileType +
		'"></img></div>' +
		'<div class = bottomRight><img class = forgetStim src ="' + pathSource + stim[5] + fileType +
		'"></img></div>'
		*/
};

//returns a cue randomly, either TOP or BOT
var getCue = function() {
	
	cue = directed_cue_array[Math.floor(Math.random() * 2)]
	
	return cue
		/*
		'<div class = centerbox><img class = forgetStim src ="' + pathSource + cue + fileType +
		'"></img></div>'
		*/
};

// Will pop out a probe type from the entire probeTypeArray and then choose a probe congruent with the probe type
var getProbe = function(directed_cond, letters, cue, predictive_dimension) {
	var trainingArray = jsPsych.randomization.repeat(stimArray, 1);
	var lastCue = cue
	var lastSet_top = letters.slice(0,3)
	var lastSet_bottom = letters.slice(3)
	if (predictive_dimension == 'forget'){
		if (directed_cond== 'pos') {
			if (lastCue == 'BOT') {
				probe = lastSet_top[Math.floor(Math.random() * 3)]
			} else if (lastCue == 'TOP') {
				probe = lastSet_bottom[Math.floor(Math.random() * 3)]
			}
		} else if (directed_cond == 'neg') {
			if (lastCue == 'BOT') {
				probe = lastSet_bottom[Math.floor(Math.random() * 3)]
			} else if (lastCue == 'TOP') {
				probe = lastSet_top[Math.floor(Math.random() * 3)]
			}
		} else if (directed_cond == 'con') {
			newArray = trainingArray.filter(function(y) {
				return (y != lastSet_top[0] && y != lastSet_top[1] && y != lastSet_top[2] && y !=
					lastSet_bottom[0] && y != lastSet_bottom[1] && y != lastSet_bottom[2])
			})
			probe = newArray.pop()
		}
	} else if (predictive_dimension == 'remember'){
		if (directed_cond== 'pos') {
			if (lastCue == 'BOT') {
				probe = lastSet_bottom[Math.floor(Math.random() * 3)]
			} else if (lastCue == 'TOP') {
				probe = lastSet_top[Math.floor(Math.random() * 3)]
			}
		} else if (directed_cond == 'neg') {
			if (lastCue == 'BOT') {
				probe = lastSet_top[Math.floor(Math.random() * 3)]
				
			} else if (lastCue == 'TOP') {
				probe = lastSet_bottom[Math.floor(Math.random() * 3)]
				
			}
		} else if (directed_cond == 'con') {
			newArray = trainingArray.filter(function(y) {
				return (y != lastSet_top[0] && y != lastSet_top[1] && y != lastSet_top[2] && y !=
					lastSet_bottom[0] && y != lastSet_bottom[1] && y != lastSet_bottom[2])
			})
			probe = newArray.pop()
		}
	
	}
	
	return probe
		/*
		'<div class = centerbox><img class = forgetStim src ="' + pathSource + probe + fileType +
		'"></img></div>'
		*/
};

var getCorrectResponse = function(predictive_dimension,cue,probe,letters) {
	if (predictive_dimension == 'remember'){
		if (cue == 'TOP') {
			if (jQuery.inArray(probe, letters.slice(0,3)) != -1) {
				return possible_responses[0][1]
			} else {
				return possible_responses[1][1]
			}
		} else if (cue == 'BOT') {
			if (jQuery.inArray(probe, letters.slice(3)) != -1) {
				return possible_responses[0][1]
			} else {
				return possible_responses[1][1]
			}
		}
	} else if (predictive_dimension == 'forget'){
		if (cue == 'TOP') {
			if (jQuery.inArray(probe, letters.slice(3)) != -1) {
				return possible_responses[0][1]
			} else {
				return possible_responses[1][1]
			}
		} else if (cue == 'BOT') {
			if (jQuery.inArray(probe, letters.slice(0,3)) != -1) {
				return possible_responses[0][1]
			} else {
				return possible_responses[1][1]
			}
		}		
	}
}

var getResponse = function() {
	return correct_response
}



var appendData = function(){
	curr_trial = jsPsych.progress().current_trial_global
	trial_id = jsPsych.data.getDataByTrialIndex(curr_trial).trial_id
	
	if (trial_id == 'practice_trial'){
		current_block = practiceCount
	}else{
		current_block = testCount
	}
	
	current_trial+=1
	
	jsPsych.data.addDataToLastTrial({
		predictive_condition: predictive_condition,
		predictive_dimension: predictive_dimension,
		directed_condition: directed_condition,
		probe: probe,
		letters: letters,
		cue: cue,
		correct_response: correct_response,
		whichQuadrant: whichQuadrant,
		current_trial: current_trial
		
	})
}


var getTrainingStim = function(){
	return task_boards[whichQuadrant - 1][0]+letters[0]+
		   task_boards[whichQuadrant - 1][1]+letters[1]+
		   task_boards[whichQuadrant - 1][2]+letters[2]+
		   task_boards[whichQuadrant - 1][3]+letters[3]+
		   task_boards[whichQuadrant - 1][4]+letters[4]+
		   task_boards[whichQuadrant - 1][5]+letters[5]+
		   task_boards[whichQuadrant - 1][6]

}

var getCueStim = function(){
	return center_boards[whichQuadrant - 1][0] + cue + center_boards[whichQuadrant - 1][1]
}

var getProbeStim = function(){
	return center_boards[whichQuadrant - 1][0] + probe + center_boards[whichQuadrant - 1][1]	

}

var getStartFix = function(){
	stim = stims.shift()
	predictive_condition = stim.predictive_condition
	predictive_dimension = stim.predictive_dimension
	directed_condition = stim.directed_condition
	probe = stim.probe
	letters = stim.letters
	cue = stim.cue
	correct_response = stim.correct_response
	whichQuadrant = stim.whichQuad	
	
	return center_boards[whichQuadrant - 1][0] + '<span style="color:red">+</span>' + center_boards[whichQuadrant - 1][1]	

}

var getFixation = function(){
	return center_boards[whichQuadrant - 1][0] + '<span style="color:red">+</span>' + center_boards[whichQuadrant - 1][1]	
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

// new vars
var practice_len = 16
var exp_len = 320 //320 must be divisible by 16
var numTrialsPerBlock = 64; // divisible by 64
var numTestBlocks = exp_len / numTrialsPerBlock

var accuracy_thresh = 0.80
var missed_thresh = 0.10
var practice_thresh = 3 // 3 blocks of 16 trials

var directed_cond_array = ['pos', 'pos', 'neg', 'con']
var directed_cue_array = ['TOP','BOT']
var predictive_conditions = [['switch','stay'],
							 ['stay','switch']]
var predictive_dimensions_list = [['forget', 'forget', 'remember','remember'],
							 ['remember','remember', 'forget', 'forget' ]]
							 
var possible_responses = [['M Key', 77],['Z Key', 90]]
var current_trial = 0	

var current_trial = 0
var stimArray = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O',
	'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'
];
				 


var stims = createTrialTypes(practice_len)

var task_boards = [[['<div class = bigbox><div class = decision-top-left><div class = lettersBox><div class = topLeft style="font-size:50px;"><div class = fixation>'],['</div></div><div class = topMiddle style="font-size:50px;"><div class = fixation>'],['</div></div><div class = topRight style="font-size:50px;"><div class = fixation>'],['</div></div><div class = bottomLeft style="font-size:50px;"><div class = fixation>'],['</div></div><div class = bottomMiddle style="font-size:50px;"><div class = fixation>'],['</div></div><div class = bottomRight style="font-size:50px;"><div class = fixation>'],['</div></div></div></div></div>']],
				   [['<div class = bigbox><div class = decision-top-right><div class = lettersBox><div class = topLeft style="font-size:50px;"><div class = fixation>'],['</div></div><div class = topMiddle style="font-size:50px;"><div class = fixation>'],['</div></div><div class = topRight style="font-size:50px;"><div class = fixation>'],['</div></div><div class = bottomLeft style="font-size:50px;"><div class = fixation>'],['</div></div><div class = bottomMiddle style="font-size:50px;"><div class = fixation>'],['</div></div><div class = bottomRight style="font-size:50px;"><div class = fixation>'],['</div></div></div></div></div>']],
				   [['<div class = bigbox><div class = decision-bottom-right><div class = lettersBox><div class = topLeft style="font-size:50px;"><div class = fixation>'],['</div></div><div class = topMiddle style="font-size:50px;"><div class = fixation>'],['</div></div><div class = topRight style="font-size:50px;"><div class = fixation>'],['</div></div><div class = bottomLeft style="font-size:50px;"><div class = fixation>'],['</div></div><div class = bottomMiddle style="font-size:50px;"><div class = fixation>'],['</div></div><div class = bottomRight style="font-size:50px;"><div class = fixation>'],['</div></div></div></div></div>']],
				   [['<div class = bigbox><div class = decision-bottom-left><div class = lettersBox><div class = topLeft style="font-size:50px;"><div class = fixation>'],['</div></div><div class = topMiddle style="font-size:50px;"><div class = fixation>'],['</div></div><div class = topRight style="font-size:50px;"><div class = fixation>'],['</div></div><div class = bottomLeft style="font-size:50px;"><div class = fixation>'],['</div></div><div class = bottomMiddle style="font-size:50px;"><div class = fixation>'],['</div></div><div class = bottomRight style="font-size:50px;"><div class = fixation>'],['</div></div></div></div></div>']]]

var center_boards = [[['<div class = bigbox><div class = decision-top-left><div class = centerbox><div class = fixation>'],['</div></div></div></div>']],
					 [['<div class = bigbox><div class = decision-top-right><div class = centerbox><div class = fixation>'],['</div></div></div></div>']],
					 [['<div class = bigbox><div class = decision-bottom-right><div class = centerbox><div class = fixation>'],['</div></div></div></div>']],
					 [['<div class = bigbox><div class = decision-bottom-left><div class = centerbox><div class = fixation>'],['</div></div></div></div>']]]
					 
var prompt_text_list = '<ul list-text>'+
						'<li>Upper 2 quadrants: '+predictive_dimensions[0]+' the cued location</li>' +
						'<li>Lower 2 quadrants: '+predictive_dimensions[2]+' the cued location</li>' +
						'<li>Please respond if the probe (single letter) was in the memory set.</li>'+
						'<li>In memory set: ' + possible_responses[0][0] + '</li>' +
						'<li>Not in memory set: ' + possible_responses[1][0] + '</li>' +
					  '</ul>'

var prompt_text = '<div class = prompt_box>'+
					  '<p class = center-block-text style = "font-size:16px; line-height:80%%;">Upper 2 quadrants: '+predictive_dimensions[0]+' the cued location</p>' +
					  '<p class = center-block-text style = "font-size:16px; line-height:80%%;">Lower 2 quadrants: '+predictive_dimensions[2]+' the cued location</p>' +
					  '<p class = center-block-text style = "font-size:16px; line-height:80%%;">Please respond if the probe (single letter) was in the memory set.</p>' +
					  '<p class = center-block-text style = "font-size:16px; line-height:80%%;">In memory set: ' + possible_responses[0][0] + '</p>' +
					  '<p class = center-block-text style = "font-size:16px; line-height:80%%;">Not in memory set: ' + possible_responses[1][0] + '</p>' +
				  '</div>' 				  
/* ************************************ */
/* Set up jsPsych blocks */
/* ************************************ */
var test_img_block = {
	type: 'poldrack-single-stim',
	stimulus:'<div class = bigbox><div class = decision-top-left>'+ 
			'<div class = centerbox><div class = fixation><span style="color:black">+</span></div></div>' +
			'<div class = topLeft><div class = fixation>A</div></div>' +
			'<div class = topMiddle><div class = fixation>B</div></div>' +
			'<div class = topRight><div class = fixation>C</div></div>' +
			'<div class = bottomLeft><div class = fixation>D</div></div>' +
			'<div class = bottomMiddle><div class = fixation>E</div></div>' +
			'<div class = bottomRight><div class = fixation>F</div></div>'+
			'</div></div>',
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

var practice1 = {
	type: 'poldrack-single-stim',
	stimulus: '<div class = bigbox>'+
				'<div class = instructBox>'+
					'<p class = block-text style="font-size:24px;">This is what the first part of the trial will look like.  All 6 letters are in a lower quadrant. The letters A, B, and C are on the top portion, while the letters D, E, and F are on the bottom portion.  Please memorize all 6 letters.</p>'+
					'<p class = block-text style="font-size:24px;">After these letters disappear, a cue will be presented, either TOP or BOT. This cue will instruct you which of the 6 letters to remember or forget, either top or bottom.</p>'+
					'<p class = block-text style="font-size:24px;">Upper 2 quadrants: '+predictive_dimensions[0]+' the cued location</p>'+
					'<p class = block-text style="font-size:24px;">Lower 2 quadrants: '+predictive_dimensions[2]+' the cued location</p>'+
					'<p class = block-text style="font-size:24px;">The letters you must remember are called your memory set. </strong></p>'+
					'<p class = block-text style="font-size:24px;">For example, if you are in a quadrant where you need to forget AND you get the cue TOP, please forget A, B, and C. <strong> Your memory set would be D, E, and F!</strong></p>'+
					'<p class = block-text style="font-size:24px;">Press Enter to continue.</p>'+
				'</div>'+
				'<div class = decision-bottom-left><div class = lettersBox>'+
					'<div class = topLeft style="font-size:50px;">A</div>' +
					'<div class = topMiddle style="font-size:50px;">B</div>' +
					'<div class = topRight style="font-size:50px;">C</div>' +
					'<div class = bottomLeft style="font-size:50px;">D</div>' +
					'<div class = bottomMiddle style="font-size:50px;">E</div>' +
					'<div class = bottomRight style="font-size:50px;">F</div>'+
				'</div></div>'+
			  '</div>',
	is_html: true,
	choices: [13],
	data: {
		trial_id: "visual_instruction"
	},
	timing_post_trial: 0,
	timing_stim: 300000,
	timing_response: 300000,
	response_ends_trial: true,
}

var practice2 = {
	type: 'poldrack-single-stim',
	stimulus: '<div class = bigbox>'+
				'<div class = instructBox>'+
					'<p class = block-text style="font-size:24px;">After the cue, TOP or BOT disappears, you will be presented with a probe (single letter)  like this.  Please respond if the probe  was in the memory set.</p>'+
					'<p class = block-text style="font-size:24px;">Press '+possible_responses[0][0]+' if the probe was in the memory set, and '+possible_responses[1][0]+' if not.</p>'+
					'<p class = block-text style="font-size:24px;">Press enter to start practice.</p>'+
				'</div>'+
		
				'<div class = decision-bottom-left><div class = centerbox><div class = fixation>B</div></div></div>'+
			  '</div>',
	is_html: true,
	choices: [13],
	data: {
		trial_id: "visual_instruction"
	},
	timing_post_trial: 0,
	timing_stim: 300000,
	timing_response: 300000,
	response_ends_trial: true,
}


var feedback_text = 'We will start practice. During practice, you will receive a prompt which shows you the answers.  <strong>This prompt will be removed for test!</strong> Press <strong>enter</strong> to begin.'
var feedback_block = {
	type: 'poldrack-single-stim',
	data: {
		exp_id: "shape_matching_with_predictive_task_switching",
		trial_id: "feedback_block"
	},
	choices: [13],
	stimulus: getFeedback,
	timing_post_trial: 0,
	is_html: true,
	timing_stim: -1,
	timing_response: -1,
	response_ends_trial: true, 

};
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
		exp_id: 'predictive_task_switching_with_directed_forgetting'
	},
	timing_response: 180000,
	text: '<div class = centerbox><p class = center-block-text>Thanks for completing this task!</p><p class = center-block-text>Press <strong>enter</strong> to continue.</p></div>',
	cont_key: [13],
	timing_post_trial: 0,
	on_finish: function(){
  	assessPerformance()
  	evalAttentionChecks()
  }
};

var feedback_text = 
'Welcome to the experiment. This task will take around 30 minutes. Press <strong>enter</strong> to begin.'
var feedback_block = {
	type: 'poldrack-single-stim',
	data: {
		trial_id: "feedback_block"
	},
	choices: [13],
	stimulus: getFeedback,
	timing_post_trial: 0,
	is_html: true,
	timing_stim: -1,
	timing_response: -1,
	response_ends_trial: true, 

};

var feedback_instruct_text =
	'Welcome to the experiment. This task will take around 30 minutes. Press <strong>enter</strong> to begin.'
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
			'<p class = block-text>In this experiment, you will be presented with 6 letters, all of which you must memorize.'+
			'These 6 letters will move clockwise from quadrant to quadrant across trials.</p> '+
				
			'<p class = block-text>You will be asked to remember or forget some letters, depending on which quadrant the 6 letters are in. For now, remember all 6 letters.</p>'+
		
			'<p class = block-text>After the 6 letters disappear, you will receive a cue either TOP or BOT.  This cue states which of the 6 letters you should forget or remember, either the top or bottom 3 letters.</p>'+
		
			'<p class = block-text>When in the upper two quadrants, please  <strong>'+predictive_dimensions[0]+'</strong> the cued set.</p>'+
		
			'<p class = block-text>When in the lower two quadrants, please  <strong>'+predictive_dimensions[2]+'</strong> the cued set.</p>'+
			
			'<p class = block-text>The 3 letters that you need to remember are called your memory set.</p>'+
		'</div>',
		
		'<div class = centerbox>'+
		
			'<p class = block-text>After, you will be presented with a probe (single letter).  Please indicate whether this probe was in your memory set.</p>'+
				
			'<p class = block-text>Press the <strong>'+possible_responses[0][0]+
			'</strong> if the probe was in the memory set, and the <strong>'+possible_responses[1][0]+'  </strong>if not.</p>'+
		
			'<p class = block-text>We will start practice when you finish instructions. Please make sure you understand the instructions before moving on. During practice, you will receive a reminder of the rules.  <i>This reminder will be taken out for test</i>.</p>'+
		'</div>'
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
	data: {
		trial_id: "instruction"
	},
	timing_response: 180000,
	text: '<div class = centerbox>'+
			'<p class = block-text>You will be asked to remember or forget some letters, depending on which quadrant the 6 letters are in.</p>'+
		
			'<p class = block-text>You will also be presented with a cue after the 6 letters.  This cue states which of the 6 letters you should forget or remember. '+
			'If you get a TOP cue, please remember or forget the top 3 letters.  If you get a BOT cue, please remember or forget the bottom 3 letters.  '+
			'<strong>The 3 remaining letters are called your memory set.</strong></p>'+
		
			'<p class = block-text>After, you will be presented with a probe.  Please indicate whether this probe was in your memory set.</p>'+
		
			'<p class = block-text>When in the top two quadrants, please  <strong>'+predictive_dimensions[0]+'</strong> the cued set. Press the <strong>'+possible_responses[0][0]+
			'  </strong>if the probe was in the memory set, and the <strong>'+possible_responses[1][0]+'  </strong>if not.</p>'+
		
			'<p class = block-text>When in the bottom two quadrants, please  <strong>'+predictive_dimensions[2]+'</strong> the cued set. Press the <strong>'+possible_responses[0][0]+
			' </strong> if the probe was in the memory set, and the <strong>'+possible_responses[1][0]+' </strong> if not.</p>'+
			
			'<p class = block-text>You will no longer receive the rule prompt, so remember the instructions before you continue. Press Enter to begin.</p>'+
		 '</div>',
	cont_key: [13],
	timing_post_trial: 1000,
	on_finish: function(){
		feedback_text = "We will now start the test portion. Press enter to begin."
	}
};


var practiceTrials = []
practiceTrials.push(feedback_block)
practiceTrials.push(instructions_block)
for (i = 0; i < practice_len + 1; i++) {
	var start_fixation_block = {
		type: 'poldrack-single-stim',
		stimulus: getStartFix,
		is_html: true,
		choices: 'none',
		data: {
			trial_id: "practice_start_fixation"
		},
		timing_post_trial: 0,
		timing_stim: 1000, //1000
		timing_response: 1000,
		prompt: prompt_text
	}

	var fixation_block = {
		type: 'poldrack-single-stim',
		stimulus: getFixation,
		is_html: true,
		choices: 'none',
		data: {
			trial_id: "practice_fixation"
		},
		timing_post_trial: 0,
		timing_stim: 3000, //3000
		timing_response: 3000,
		prompt: prompt_text
	}

	var ITI_fixation_block = {
		type: 'poldrack-single-stim',
		stimulus: getFixation,
		is_html: true,
		choices: [possible_responses[0][1],possible_responses[1][1]],
		data: {
			trial_id: "practice_ITI_fixation"
		},
		timing_post_trial: 0,
		timing_stim: 4000, //4000
		timing_response: 4000,
		prompt: prompt_text
	}

	var training_block = {
		type: 'poldrack-single-stim',
		stimulus: getTrainingStim,
		is_html: true,
		data: {
			trial_id: "practice_six_letters"
		},
		choices: 'none',
		timing_post_trial: 0,
		timing_stim: 2500,
		timing_response: 2500,
		prompt: prompt_text
	};



	var cue_block = {
		type: 'poldrack-single-stim',
		stimulus: getCueStim,
		is_html: true,
		data: {
			trial_id: "practice_cue",
		},
		choices: false,
		timing_post_trial: 0,
		timing_stim: 1000,
		timing_response: 1000,
		prompt: prompt_text
	};


	var practice_probe_block = {
		type: 'poldrack-categorize',
		stimulus: getProbeStim,
		key_answer: getCorrectResponse,
		choices: [possible_responses[0][1],possible_responses[1][1]],
		data: {trial_id: "practice_trial"},
		correct_text: '<div class = fb_box><div class = center-text><font size = 20>Correct!</font></div></div>' + prompt_text,
		incorrect_text: '<div class = fb_box><div class = center-text><font size = 20>Incorrect</font></div></div>' + prompt_text,
		timeout_message: '<div class = fb_box><div class = center-text><font size = 20>Respond Faster!</font></div></div>' + prompt_text,
		timing_stim: 2000,
		timing_response: 2000,
		timing_feedback_duration: 500,
		is_html: true,
		on_finish: appendData,
		prompt: prompt_text,
		timing_post_trial: 0
	};

	practiceTrials.push(start_fixation_block)
	practiceTrials.push(training_block)
	practiceTrials.push(cue_block)
	practiceTrials.push(fixation_block)
	practiceTrials.push(practice_probe_block)
	practiceTrials.push(ITI_fixation_block)
}

var practiceCount = 0
var practiceNode = {
	timeline: practiceTrials,
	loop_function: function(data){
		practiceCount += 1
		current_trial = 0
		stims = createTrialTypes(practice_len)
	
		var sum_rt = 0
		var sum_responses = 0
		var correct = 0
		var total_trials = 0
	
		for (var i = 0; i < data.length; i++){
			if (data[i].trial_id == "practice_trial"){
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
		feedback_text += "</p><p class = block-text><strong>Average reaction time:  " + Math.round(ave_rt) + " ms. 	Accuracy: " + Math.round(accuracy * 100)+ "%</strong>"

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
					stims = createTrialTypes(numTrialsPerBlock)
					return false
			}
			
			feedback_text +=
				'</p><p class = block-text>Redoing this practice. Press Enter to continue.' 
			
			return true
		
		}
	
	}
	
}

var testTrials = []
testTrials.push(feedback_block)
testTrials.push(attention_node)
for (i = 0; i < numTrialsPerBlock + 1; i++) {
	var start_fixation_block = {
		type: 'poldrack-single-stim',
		stimulus: getStartFix,
		is_html: true,
		choices: 'none',
		data: {
			trial_id: "test_start_fixation"
		},
		timing_post_trial: 0,
		timing_stim: 1000, //1000
		timing_response: 1000
	}

	var fixation_block = {
		type: 'poldrack-single-stim',
		stimulus: getFixation,
		is_html: true,
		choices: 'none',
		data: {
			trial_id: "test_fixation"
		},
		timing_post_trial: 0,
		timing_stim: 3000, //3000
		timing_response: 3000
	}

	var ITI_fixation_block = {
		type: 'poldrack-single-stim',
		stimulus: getFixation,
		is_html: true,
		choices: [possible_responses[0][1],possible_responses[1][1]],
		data: {
			trial_id: "test_ITI_fixation"
		},
		timing_post_trial: 0,
		timing_stim: 4000, //4000
		timing_response: 4000
	}

	var training_block = {
		type: 'poldrack-single-stim',
		stimulus: getTrainingStim,
		is_html: true,
		data: {
			trial_id: "test_six_letters"
		},
		choices: 'none',
		timing_post_trial: 0,
		timing_stim: 2500,
		timing_response: 2500
	};



	var cue_block = {
		type: 'poldrack-single-stim',
		stimulus: getCueStim,
		is_html: true,
		data: {
			trial_id: "test_cue",
		},
		choices: false,
		timing_post_trial: 0,
		timing_stim: 1000,
		timing_response: 1000
	};

	var probe_block = {
		type: 'poldrack-single-stim',
		stimulus: getProbeStim,
		is_html: true,
		data: {
			trial_id: "test_trial",
		},
		choices: [possible_responses[0][1],possible_responses[1][1]],
		timing_post_trial: 0,
		timing_stim: 2000,
		timing_response: 2000,
		response_ends_trial: false,
		on_finish: appendData
	};
	testTrials.push(start_fixation_block)
	testTrials.push(training_block)
	testTrials.push(cue_block)
	testTrials.push(fixation_block)
	testTrials.push(probe_block)
	testTrials.push(ITI_fixation_block)
}

var testCount = 0
var testNode = {
	timeline: testTrials,
	loop_function: function(data) {
	testCount += 1
	current_trial = 0
	stims = createTrialTypes(numTrialsPerBlock)
	
	var sum_rt = 0
		var sum_responses = 0
		var correct = 0
		var total_trials = 0
	
		for (var i = 0; i < data.length; i++){
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
	
		feedback_text = "<br>Please take this time to read your feedback and to take a short break! Press enter to continue"
		feedback_text += "</p><p class = block-text><strong>Average reaction time:  " + Math.round(ave_rt) + " ms. 	Accuracy: " + Math.round(accuracy * 100)+ "%</strong>"
		feedback_text += "</p><p class = block-text>You have completed: "+testCount+" out of "+numTestBlocks+" blocks of trials."
		
		if (accuracy < accuracy_thresh){
			feedback_text +=
					'</p><p class = block-text>Your accuracy is too low.  Remember: <br>' + prompt_text_list 
		}
		
		if (missed_responses > missed_thresh){
			feedback_text +=
					'</p><p class = block-text>You have not been responding to some trials.  Please respond on every trial that requires a response.'
		}
	
		if (testCount == numTestBlocks){
			feedback_text +=
					'</p><p class = block-text>Done with this test. Press Enter to continue.'
			return false
		} else {
		
			return true
		}
	
	}
}


/* create experiment definition array */
var predictive_task_switching_with_directed_forgetting_experiment = [];

//predictive_task_switching_with_directed_forgetting_experiment.push(instruction_node);
//predictive_task_switching_with_directed_forgetting_experiment.push(practice1);
//predictive_task_switching_with_directed_forgetting_experiment.push(practice2);

predictive_task_switching_with_directed_forgetting_experiment.push(practiceNode);
predictive_task_switching_with_directed_forgetting_experiment.push(feedback_block);

predictive_task_switching_with_directed_forgetting_experiment.push(start_test_block);
predictive_task_switching_with_directed_forgetting_experiment.push(testNode);
predictive_task_switching_with_directed_forgetting_experiment.push(feedback_block);

predictive_task_switching_with_directed_forgetting_experiment.push(post_task_block);
predictive_task_switching_with_directed_forgetting_experiment.push(end_block);