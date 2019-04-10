/* ************************************ */
/* Define helper functions */
/* ************************************ */
function addID() {
  jsPsych.data.addDataToLastTrial({exp_id: 'cued_task_switching_with_directed_forgetting'})
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
	for (var k = 0; k < possible_responses.length; k++) {
		choice_counts[possible_responses[k]] = 0
	}
	for (var i = 0; i < experiment_data.length; i++) {
		if (experiment_data[i].trial_id == 'test_trial'){
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
	jsPsych.data.addDataToLastTrial({"credit_var": credit_var})
}

var getInstructFeedback = function() {
	return '<div class = centerbox><p class = center-block-text>' + feedback_instruct_text +
		'</p></div>'
}

var getFeedback = function() {
	return '<div class = bigbox><div class = picture_box><p class = block-text><font color="white">' + feedback_text + '</font></p></div></div>'
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


var randomDraw = function(lst) {
  var index = Math.floor(Math.random() * (lst.length))
  return lst[index]
}


var createTrialTypes = function(numTrialsPerBlock){
	var temp_index = Math.floor(Math.random() * 2)
	
	cued_dimension = cued_dimensions[temp_index]
	task_cue = cues[temp_index][Math.floor(Math.random() * 2)]
	
	directed_condition = directed_cond_array[Math.floor(Math.random() * 4)]
	
	var stims = []
	var first_stim = {
		task_condition: 'N/A',
		cued_condition: 'N/A',
		cued_dimension: cued_dimension,
		directed_condition: directed_condition
	}
	
	stims = []
	for(var numIterations = 0; numIterations < numTrialsPerBlock/16; numIterations++){
		for (var numDirectedConds = 0; numDirectedConds < directed_cond_array.length; numDirectedConds++){
			for (var numTaskConds = 0; numTaskConds < task_conditions.length; numTaskConds++){
				for (var numCuedConds = 0; numCuedConds < cued_conditions.length; numCuedConds++){
			
					cued_dimension = 'N/A'
					task_condition = task_conditions[numTaskConds]
					cued_condition = cued_conditions[numCuedConds]
					directed_condition = directed_cond_array[numDirectedConds]
				
					stim = {
						cued_dimension: cued_dimension,
						task_condition: task_condition,
						cued_condition: cued_condition,
						directed_condition: directed_condition
						}
			
					stims.push(stim)
				}
			}
		}
	}
	
	stims = jsPsych.randomization.repeat(stims,1)
	stims.push(first_stim)
	stim_len = stims.length	
	
	var new_stims = []
	for(var i = 0; i < stim_len; i++){
		
		if (i > 0){
			last_dim = cued_dimension 
			last_task_cue = task_cue
		} 
		
		stim = stims.pop()
		cued_condition = stim.cued_condition
		task_condition = stim.task_condition
		directed_condition = stim.directed_condition
		cued_dimension = stim.cued_dimension
		
		if (task_condition == "switch"){
			cued_condition = "switch"
			cued_dimension = randomDraw(['forget','remember'].filter(function(y) {return $.inArray(y, [last_dim]) == -1}))
			if (cued_dimension == 'forget'){
				temp_index = 1
				task_cue = randomDraw(cues[temp_index].filter(function(y) {return $.inArray(y, [last_task_cue]) == -1}))
			} else if (cued_dimension == 'remember'){
				temp_index = 0
				task_cue = randomDraw(cues[temp_index].filter(function(y) {return $.inArray(y, [last_task_cue]) == -1}))
			}
		} else if (task_condition == "stay"){
			cued_dimension = last_dim
			
			if (cued_condition == "switch"){
				if (cued_dimension == 'forget'){
					temp_index = 1
					task_cue = randomDraw(cues[temp_index].filter(function(y) {return $.inArray(y, [last_task_cue]) == -1}))
				} else if (cued_dimension == 'remember'){
					temp_index = 0
					task_cue = randomDraw(cues[temp_index].filter(function(y) {return $.inArray(y, [last_task_cue]) == -1}))
				}		
			} else if (cued_condition == "stay"){
				task_cue = last_task_cue
			}
		}
		
		letters = getTrainingSet()
		cue = getCue()
		probe = getProbe(directed_condition,letters,cue, cued_dimension)
		correct_response = getCorrectResponse(cued_dimension,cue,probe,letters)
			
		stim = {
			task_condition: task_condition,
			cued_condition: cued_condition,
			cued_dimension: cued_dimension,
			directed_condition: directed_condition,
			letters: letters,
			cue: cue,
			probe: probe,
			correct_response: correct_response,
			task_cue: task_cue
			}
		
		new_stims.push(stim)
		

	}
	return new_stims	
}


//this is an algorithm to choose the training set based on rules of the game (training sets are composed of any letter not presented in the last two training sets)
var getTrainingSet = function() {
	preceeding1stims = []
	preceeding2stims = []
	trainingArray = jsPsych.randomization.repeat(stimArray, 1);
	if (current_trial < 1) {
		letters = trainingArray.slice(0,numLetters)
	} else if (current_trial == 1) {
		preceeding1stims = letters.slice()
		letters = trainingArray.filter(function(y) {
			return (jQuery.inArray(y, preceeding1stims) == -1)
		}).slice(0,numLetters)
	} else {
		preceeding2stims = preceeding1stims.slice()
		preceeding1stims = letters.slice()
		letters = trainingArray.filter(function(y) {
			return (jQuery.inArray(y, preceeding1stims.concat(preceeding2stims)) == -1)
		}).slice(0,numLetters)
	}
	return letters
};

//returns a cue randomly, either TOP or BOT
var getCue = function() {
	
	cue = directed_cue_array[Math.floor(Math.random() * 2)]
	
	return cue
};

// Will pop out a probe type from the entire probeTypeArray and then choose a probe congruent with the probe type
var getProbe = function(directed_cond, letters, cue, cued_dimension) {
	var trainingArray = jsPsych.randomization.repeat(stimArray, 1);
	var lastCue = cue
	var lastSet_top = letters.slice(0,numLetters/2)
	var lastSet_bottom = letters.slice(numLetters/2)
	if (cued_dimension == 'forget'){
		if (directed_cond== 'pos') {
			if (lastCue == 'BOT') {
				probe = lastSet_top[Math.floor(Math.random() * numLetters/2)]
			} else if (lastCue == 'TOP') {
				probe = lastSet_bottom[Math.floor(Math.random() * numLetters/2)]
			}
		} else if (directed_cond == 'neg') {
			if (lastCue == 'BOT') {
				probe = lastSet_bottom[Math.floor(Math.random() * numLetters/2)]
			} else if (lastCue == 'TOP') {
				probe = lastSet_top[Math.floor(Math.random() * numLetters/2)]
			}
		} else if (directed_cond == 'con') {
			newArray = trainingArray.filter(function(y) {
				return (y != lastSet_top[0] && y != lastSet_top[1] && 
						y != lastSet_bottom[0] && y != lastSet_bottom[1])
			})
			probe = newArray.pop()
		}
	} else if (cued_dimension == 'remember'){
		if (directed_cond== 'pos') {
			if (lastCue == 'BOT') {
				probe = lastSet_bottom[Math.floor(Math.random() * numLetters/2)]
			} else if (lastCue == 'TOP') {
				probe = lastSet_top[Math.floor(Math.random() * numLetters/2)]
			}
		} else if (directed_cond == 'neg') {
			if (lastCue == 'BOT') {
				probe = lastSet_top[Math.floor(Math.random() * numLetters/2)]
				
			} else if (lastCue == 'TOP') {
				probe = lastSet_bottom[Math.floor(Math.random() * numLetters/2)]
				
			}
		} else if (directed_cond == 'con') {
			newArray = trainingArray.filter(function(y) {
				return (y != lastSet_top[0] && y != lastSet_top[1] &&  
						y != lastSet_bottom[0] && y != lastSet_bottom[1])
			})
			probe = newArray.pop()
		}
	
	}
	
	return probe
};

var getCorrectResponse = function(cued_dimension,cue,probe,letters) {
	if (cued_dimension == 'remember'){
		if (cue == 'TOP') {
			if (jQuery.inArray(probe, letters.slice(0,numLetters/2)) != -1) {
				return possible_responses[0][1]
			} else {
				return possible_responses[1][1]
			}
		} else if (cue == 'BOT') {
			if (jQuery.inArray(probe, letters.slice(numLetters/2)) != -1) {
				return possible_responses[0][1]
			} else {
				return possible_responses[1][1]
			}
		}
	} else if (cued_dimension == 'forget'){
		if (cue == 'TOP') {
			if (jQuery.inArray(probe, letters.slice(numLetters/2)) != -1) {
				return possible_responses[0][1]
			} else {
				return possible_responses[1][1]
			}
		} else if (cue == 'BOT') {
			if (jQuery.inArray(probe, letters.slice(0,numLetters/2)) != -1) {
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
	} else if (trial_id == 'test_trial'){
		current_block = testCount
	}
	
	current_trial+=1
	
	var lastSet_top = letters.slice(0,numLetters/2)
	var lastSet_bottom = letters.slice(numLetters/2)
	
	jsPsych.data.addDataToLastTrial({
		task_condition: task_condition,
		cue_condition: cued_condition,
		task_cue: task_cue,
		cued_dimension: cued_dimension,
		directed_forgetting_condition: directed_condition,
		probe: probe,
		directed_forgetting_cue: cue,
		correct_response: correct_response,
		current_trial: current_trial,
		top_stim: lastSet_top,
		bottom_stim: lastSet_bottom,
		
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
}


var getFixation = function(){
	return '<div class = bigbox><div class = centerbox><div class = fixation><span style="color:white">+</span></font></div></div></div>'
}

var getTrainingStim = function(){
	return task_boards[0]+preFileType+letters[0]+fileTypePNG+
		   task_boards[1]+
		   task_boards[2]+preFileType+letters[1]+fileTypePNG+
		   task_boards[3]+preFileType+letters[2]+fileTypePNG+
		   task_boards[4]+
		   task_boards[5]+preFileType+letters[3]+fileTypePNG+
		   task_boards[6]

}

var getDirectedCueStim = function(){
	return '<div class = bigbox><div class = centerbox><div class = cue-text>' + preFileType + cue + fileTypePNG +'</div></div></div>'	

}

var getSwitchingCueStim = function(){
	stim = stims.shift()
	task_condition = stim.task_condition
	cued_condition = stim.cued_condition
	cued_dimension = stim.cued_dimension
	directed_condition = stim.directed_condition
	probe = stim.probe
	letters = stim.letters
	cue = stim.cue
	correct_response = stim.correct_response
	task_cue = stim.task_cue
	
	return '<div class = bigbox><div class = centerbox><div class = cue-text>'+ preFileType + task_cue + fileTypePNG +'</div></div></div>'	

}

var getProbeStim = function(){
	return '<div class = bigbox><div class = centerbox><div class = cue-text>' + preFileType + probe + fileTypePNG +'</div></div></div>'	

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

// new vars
var practice_len = 16  // must be divisible by 16
var exp_len = 160 // must be divisible by 16
var numTrialsPerBlock = 32; // divisible by 16
var numTestBlocks = exp_len / numTrialsPerBlock

var accuracy_thresh = 0.70
var missed_thresh = 0.10
var practice_thresh = 3 // 3 blocks of 16 trials
var numLetters = 4

var directed_cond_array = ['pos', 'pos', 'neg', 'con']
var directed_cue_array = ['TOP','BOT']
var task_conditions = jsPsych.randomization.repeat(['stay','switch'],1)
var cued_conditions = jsPsych.randomization.repeat(['stay','switch'],1)

var cues = [['retain','remember'],['forget','disregard']]

var cued_dimensions = jsPsych.randomization.repeat(['forget','remember'],1)
var possible_responses = [['M Key', 77],['Z Key', 90]]
							 
var current_trial = 0	

var fileTypePNG = ".png'></img>"
var preFileType = "<img class = center src='/static/experiments/cued_task_switching_with_directed_forgetting/images/"

var stimArray = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O',
	'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
				 
var stims = createTrialTypes(practice_len)

var task_boards = [['<div class = bigbox><div class = lettersBox><div class = topLeft style="font-size:50px;"><div class = cue-text>'],['</div></div><div class = topMiddle style="font-size:50px;"><div class = cue-text>'],['</div></div><div class = topRight style="font-size:50px;"><div class = cue-text>'],['</div></div><div class = bottomLeft style="font-size:50px;"><div class = cue-text>'],['</div></div><div class = bottomMiddle style="font-size:50px;"><div class = cue-text>'],['</div></div><div class = bottomRight style="font-size:50px;"><div class = cue-text>'],['</div></div></div></div>']]
				   

var prompt_text_list = '<ul list-text>'+
						'<li>Cue was '+cued_dimensions[0]+' : '+cued_dimensions[0]+' the cued location</li>' +
						'<li>Cue was '+cued_dimensions[1]+' : '+cued_dimensions[1]+' the cued location</li>' +
						'<li>Please respond if the probe (single letter) was in the memory set.</li>'+
						'<li>In memory set: ' + possible_responses[0][0] + '</li>' +
						'<li>Not in memory set: ' + possible_responses[1][0] + '</li>' +
					   '</ul>'
					   
var prompt_text = '<div class = prompt_box>'+
					  '<p class = center-block-text style = "font-size:16px; line-height:80%%;">Cue was '+cued_dimensions[0]+' : '+cued_dimensions[0]+' the cued location</p>' +
					  '<p class = center-block-text style = "font-size:16px; line-height:80%%;">Cue was '+cued_dimensions[1]+' : '+cued_dimensions[1]+' the cued location</p>' +
					  '<p class = center-block-text style = "font-size:16px; line-height:80%%;">Please respond if the probe (single letter) was in the memory set.</p>' +
					  '<p class = center-block-text style = "font-size:16px; line-height:80%%;">In memory set: ' + possible_responses[0][0] + '</p>' +
					  '<p class = center-block-text style = "font-size:16px; line-height:80%%;">Not in memory set: ' + possible_responses[1][0] + '</p>' +
				  '</div>' 	
				  
/* ************************************ */
/* Set up jsPsych blocks */
/* ************************************ */
var feedback_text = 
'Welcome to the experiment. This task will take around 30 minutes. Press <i>enter</i> to begin.'
var feedback_block = {
	type: 'poldrack-single-stim',
	data: {
		trial_id: "feedback_block"
	},
	choices: [13],
	stimulus: getFeedback,
	timing_post_trial: 0,
	is_html: true,
	timing_response: 180000,
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
       exp_id: "cued_task_switching_with_directed_forgetting",
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
			'<p class = block-text>In this experiment you will be presented with a cue, either remember (or retain) or forget (or disregard). This cue instructs what kind of task you will be doing for that trial.</p> '+
		
			'<p class = block-text>After the remember (or retain) or forget (or disregard) cue disappears, you will be presented with 6 letters. You must memorize all 6 letters.</p> '+
						
			'<p class = block-text>After the 6 letters disappear, you will see another cue, either TOP or BOT. This instructs you which letters you should remember or forget, either the top or bottom letters.</p>'+
		
			'<p class = block-text>For example, if the first cue was forget and the second cue was TOP, please forget the top 3 letters. <i>The other 3 letters are called your memory set!</i></p>'+
		
			'<p class = block-text>If you see the cue, '+cued_dimensions[0]+', please  <i>'+cued_dimensions[0]+'</i> the cued set.</p>'+
		
			'<p class = block-text>If you see the cue, '+cued_dimensions[1]+', please  <i>'+cued_dimensions[1]+'</i> the cued set.</p>'+
		'</div>',
		
		'<div class = centerbox>'+
			'<p class = block-text>After, you will be presented with a probe (single letter).  Please indicate whether this probe was in your memory set.</p>'+
		
			'<p class = block-text>Press the <i>'+possible_responses[0][0]+
			'  </i>if the probe was in the memory set, and the <i>'+possible_responses[1][0]+'  </i>if not.</p>'+
		
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
				'Read through instructions too quickly.  Please take your time and make sure you understand the instructions.  Press <i>enter</i> to continue.'
			return true
		} else if (sumInstructTime > instructTimeThresh * 1000) {
			feedback_instruct_text = 'Done with instructions. Press <i>enter</i> to continue.'
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
			'<p class = block-text>You will be presented with a cue, either remember (or retain) or forget (or disregard). This cue instructs what kind of task you will be doing for that trial.</p> '+
		
			'<p class = block-text>After the remember (or retain) or forget (or disregard) cue disappears, you will be presented with 6 letters. You must memorize all 6 letters.</p> '+
						
			'<p class = block-text>After the 6 letters disappear, you will also see another cue, either TOP or BOT. This instructs you which letters you should remember or forget, either the top or bottom letters.</p>'+
		
			'<p class = block-text>For example, if the first cue was disregard and the second cue was TOP, please forget the top 3 letters. <i>The bottom 3 letters are called your memory set!</i></p>'+
			
			'<p class = block-text>Alternatively, if the first cue was retain and the second cue was TOP, please remember the top 3 letters. <i>The top 3 letters are called your memory set!</i></p>'+
		
			'<p class = block-text>If you see the cue, '+cued_dimensions[0]+', please  <i>'+cued_dimensions[0]+'</i> the top or bottom letters.</p>'+
		
			'<p class = block-text>If you see the cue, '+cued_dimensions[1]+', please  <i>'+cued_dimensions[2]+'</i> the top or bottom.</p>'+
		
			'<p class = block-text>After, you will be presented with a probe (single letter).  Please indicate whether this probe was in your memory set.</p>'+
		
			'<p class = block-text>Press the <i>' +possible_responses[0][0]+ '  </i>if the probe was in the memory set, and the <i>'+possible_responses[1][0]+'  </i>if not.</p>'+
			
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
		stimulus: getFixation,
		is_html: true,
		choices: 'none',
		data: {
			trial_id: "practice_start_fixation"
		},
		timing_post_trial: 0,
		timing_stim: 500, //500
		timing_response: 500, //500
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
		timing_response: 3000, //3000
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
		timing_stim: 1000, //1000
		timing_response: 1000, //1000
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
		timing_stim: 2500, //2500
		timing_response: 2500, //2500
		prompt: prompt_text
	};
	
	var cue_directed_block = {
		type: 'poldrack-single-stim',
		stimulus: getDirectedCueStim,
		is_html: true,
		data: {
			trial_id: "practice_directed_cue",
		},
		choices: false,
		timing_post_trial: 0,
		timing_stim: 1000, //1000
		timing_response: 1000, //1000
		prompt: prompt_text
	};

	var cue_switching_block = {
		type: 'poldrack-single-stim',
		stimulus: getSwitchingCueStim,
		is_html: true,
		data: {
			trial_id: "practice_switching_cue",
		},
		choices: false,
		timing_post_trial: 0,
		timing_stim: 1000, //1000
		timing_response: 1000, //1000
		prompt: prompt_text
	};
	
	var practice_probe_block = {
		type: 'poldrack-single-stim',
		stimulus: getProbeStim,
		choices: [possible_responses[0][1],possible_responses[1][1]],
		data: {trial_id: "practice_trial"},
		timing_stim: 2000, //2000
		timing_response: 2000, //2000
		timing_feedback_duration: 0,
		is_html: true,
		on_finish: appendData,
		prompt: prompt_text,
		timing_post_trial: 0
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
	practiceTrials.push(cue_switching_block)
	practiceTrials.push(start_fixation_block)
	practiceTrials.push(training_block)
	practiceTrials.push(cue_directed_block)
	practiceTrials.push(fixation_block)
	practiceTrials.push(practice_probe_block)
	practiceTrials.push(ITI_fixation_block)
	practiceTrials.push(categorize_block)
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
		feedback_text += "</p><p class = block-text><i>Average reaction time:  " + Math.round(ave_rt) + " ms. 	Accuracy: " + Math.round(accuracy * 100)+ "%</i>"

		if (accuracy > accuracy_thresh){
			feedback_text +=
					'</p><p class = block-text>Done with this practice. Press Enter to continue.' 
			stims = createTrialTypes(numTrialsPerBlock)
			return false
	
		} else if (accuracy < accuracy_thresh){
			feedback_text +=
					'</p><p class = block-text>We are going to try practice again to see if you can achieve higher accuracy.  Remember: <br>' + prompt_text_list 
					
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
		stimulus: getFixation,
		is_html: true,
		choices: 'none',
		data: {
			trial_id: "test_start_fixation"
		},
		timing_post_trial: 0,
		timing_stim: 500, //500
		timing_response: 500 //500
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
		timing_response: 3000 //3000
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
		timing_stim: 1000, //1000
		timing_response: 1000 //1000
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
		timing_stim: 2500, //2500
		timing_response: 2500 //2500
	};
	
	var cue_directed_block = {
		type: 'poldrack-single-stim',
		stimulus: getDirectedCueStim,
		is_html: true,
		data: {
			trial_id: "test_directed_cue",
		},
		choices: false,
		timing_post_trial: 0,
		timing_stim: 1000, //1000
		timing_response: 1000 //1000
	};

	var cue_switching_block = {
		type: 'poldrack-single-stim',
		stimulus: getSwitchingCueStim,
		is_html: true,
		data: {
			trial_id: "test_switching_cue",
		},
		choices: false,
		timing_post_trial: 0,
		timing_stim: 1000, //1000
		timing_response: 1000 //1000
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
		timing_stim: 2000, //2000
		timing_response: 2000, //2000
		response_ends_trial: false,
		on_finish: appendData
	};
	
	testTrials.push(cue_switching_block)
	testTrials.push(start_fixation_block)
	testTrials.push(training_block)
	testTrials.push(cue_directed_block)
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
		feedback_text += "</p><p class = block-text><i>Average reaction time:  " + Math.round(ave_rt) + " ms. 	Accuracy: " + Math.round(accuracy * 100)+ "%</i>"
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
var cued_task_switching_with_directed_forgetting_experiment = [];

cued_task_switching_with_directed_forgetting_experiment.push(practiceNode);
cued_task_switching_with_directed_forgetting_experiment.push(feedback_block);

cued_task_switching_with_directed_forgetting_experiment.push(start_test_block);
cued_task_switching_with_directed_forgetting_experiment.push(testNode);
cued_task_switching_with_directed_forgetting_experiment.push(feedback_block);

cued_task_switching_with_directed_forgetting_experiment.push(post_task_block);
cued_task_switching_with_directed_forgetting_experiment.push(end_block);