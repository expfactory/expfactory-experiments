/* ************************************ */
/* Define helper functions */
/* ************************************ */
function addID() {
  jsPsych.data.addDataToLastTrial({exp_id: 'flanker_with_shape_matching'})
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
	var experiment_data = jsPsych.data.getTrialsOfType('poldrack-single-stim')
	experiment_data = experiment_data.concat(jsPsych.data.getTrialsOfType('poldrack-categorize'))
	var missed_count = 0
	var trial_count = 0
	var rt_array = []
	var rt = 0
		//record choices participants made
	var choice_counts = {}
	choice_counts[-1] = 0
	for (var k = 0; k < possible_responses.length; k++) {
		choice_counts[possible_responses[k][1]] = 0
	}
	for (var i = 0; i < experiment_data.length; i++) {
		if (experiment_data[i].possible_responses != 'none') {
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


var randomDraw = function(lst) {
  var index = Math.floor(Math.random() * (lst.length))
  return lst[index]
}

var getPTD = function(shape_matching_condition, flanker_condition){
	var probe_i = randomDraw([1,2,3,4,5,6,7,8,9,10])
	var target_i = 0
	var distractor_i = 0
	if (shape_matching_condition[0] == 'S') {
		target_i = probe_i
		correct_response = possible_responses[0][1]		
	} else {
		target_i = randomDraw([1,2,3,4,5,6,7,8,9,10].filter(function(y) {return y != probe_i}))				
		correct_response = possible_responses[1][1]
	}
	//console.log('probe = ' + probe + ', target = ' + target)
	if (shape_matching_condition[1] == 'S') {
		distractor_i = target_i
	} else if (shape_matching_condition[2] == 'S') {
		distractor_i = probe_i
	} else if (shape_matching_condition[2] == 'D') {
		distractor_i = randomDraw([1,2,3,4,5,6,7,8,9,10].filter(function(y) {return $.inArray(y, [target_i, probe_i]) == -1}))
	} else if (shape_matching_condition[2] == 'N'){
		distractor_i = 'none'
	}
	
	if (flanker_condition == 'congruent'){
		flankers = probe_i
	} else if (flanker_condition == 'incongruent'){
		flankers = randomDraw([1,2,3,4,5,6,7,8,9,10].filter(function(y) {return y != probe_i}))
	
	
	}
	return [probe_i, target_i, distractor_i, correct_response, flankers]
}
	 
var createTrialTypes = function(numTrialsPerBlock){
	flanker_trial_types = ['congruent','incongruent']
	shape_matching_trial_types = ['DDD','SDD','DSD','DDS','SSS','SNN','DNN']
	
	var stims = []
	for(var numIterations = 0; numIterations < numTrialsPerBlock/14; numIterations++){
		for (var numShapeConds = 0; numShapeConds < shape_matching_trial_types.length; numShapeConds++){
			for (var numFlankerConds = 0; numFlankerConds < flanker_trial_types.length; numFlankerConds++){
			
				shape_matching_condition = shape_matching_trial_types[numShapeConds]
				flanker_condition = flanker_trial_types[numFlankerConds]
				
				answer_arr = getPTD(shape_matching_condition, flanker_condition)
				
				probe = answer_arr[0]
				target = answer_arr[1]
				distractor = answer_arr[2]
				correct_response = answer_arr[3]
				flankers = answer_arr[4]
				
				stim = {
					flanker_condition: flanker_condition,
					shape_matching_condition: shape_matching_condition,
					probe: probe,
					target: target,
					distractor: distractor,
					flankers: flankers,
					correct_response: correct_response
					}
			
				stims.push(stim)
			}
			
		}
	}
	stims = jsPsych.randomization.repeat(stims,1)
	return stims	
}


var getResponse = function() {
	return correct_response
}

var getStim = function(){
	if ((shape_matching_condition == "SNN") || (shape_matching_condition == "DNN")){
	
		return task_boards[0]+ preFileType + target + '_green' + fileTypePNG +
			   task_boards[1]+ 
			   task_boards[2]+ preFileType + flankers + '_white' + fileTypePNG +
			   task_boards[3]+ preFileType + flankers + '_white' + fileTypePNG +
			   task_boards[4]+ preFileType + probe + '_white' + fileTypePNG +
			   task_boards[5]+ preFileType + flankers + '_white' + fileTypePNG +
			   task_boards[6]+ preFileType + flankers + '_white' + fileTypePNG +	
			   task_boards[7]
	
	
	} else {
	
		return task_boards[0]+ preFileType + target + '_green' + fileTypePNG +
			   task_boards[1]+ preFileType + distractor + '_red' + fileTypePNG +
			   task_boards[2]+ preFileType + flankers + '_white' + fileTypePNG +
			   task_boards[3]+ preFileType + flankers + '_white' + fileTypePNG +
			   task_boards[4]+ preFileType + probe + '_white' + fileTypePNG +
			   task_boards[5]+ preFileType + flankers + '_white' + fileTypePNG +
			   task_boards[6]+ preFileType + flankers + '_white' + fileTypePNG +	
			   task_boards[7]
	}
}
	

var getMask = function(){

	stim = stims.shift()
	shape_matching_condition = stim.shape_matching_condition
	flanker_condition = stim.flanker_condition

	correct_response = stim.correct_response
	probe = stim.probe
	target = stim.target
	distractor = stim.distractor
	flankers = stim.flankers
	
		console.log('shape condition = '+shape_matching_condition+', flanker_condition: '+ flanker_condition+', correct_response: '+correct_response+', probe: '+probe+', target: '+target+', distractor: '+distractor+', flankers: '+flankers)

	
	return task_boards[0]+ preFileType + 'mask' + fileTypePNG +
		   task_boards[1]+ 
		   task_boards[2]+ preFileType + 'mask' + fileTypePNG +
		   task_boards[3]+ preFileType + 'mask' + fileTypePNG + 
		   task_boards[4]+ preFileType + 'mask' + fileTypePNG + '<div class = centerbox><div class = fixation>+</div></div>' +
		   task_boards[5]+ preFileType + 'mask' + fileTypePNG +
		   task_boards[6]+ preFileType + 'mask' + fileTypePNG +	
		   task_boards[7]

}

var appendData = function(){
	curr_trial = jsPsych.progress().current_trial_global
	trial_id = jsPsych.data.getDataByTrialIndex(curr_trial).trial_id
	
	current_trial+=1
	
	if (trial_id == 'practice_trial'){
		current_block = practiceCount
	} else if (trial_id == 'test_trial'){
		current_block = testCount
	}
	
	jsPsych.data.addDataToLastTrial({
		shape_matching_condition: shape_matching_condition,
		flanker_condition: flanker_condition,
		correct_response: correct_response,
		flankers: flankers,
		probe: probe,
		target: target,
		distractor: distractor,
		current_block: current_block,
		current_trial: current_trial
	})
	
	
	
}

/* ************************************ */
/* Define experimental variables */
/* ************************************ */
// generic task variables
var sumInstructTime = 0 //ms
var instructTimeThresh = 0 ///in seconds
var credit_var = 0
var run_attention_checks = true

// task specific variables
// Set up variables for stimuli
var practice_len = 28 // must be divisible by 14
var exp_len = 336 //320 must be divisible by 64
var numTrialsPerBlock = 84; // divisible by 14
var numTestBlocks = exp_len / numTrialsPerBlock

var accuracy_thresh = 0.80
var missed_thresh = 0.10
var practice_thresh = 3 // 3 blocks of 28 trials
 
var possible_responses = [['M Key', 77],['Z Key', 90]]


var current_trial = 0
var current_block = 0

var fileTypePNG = '.png"></img>'
var preFileType = '<img class = center src="/static/experiments/flanker_with_shape_matching/images/'




var task_boards = [['<div class = bigbox><div class = leftbox>'],['</div><div class = distractorbox>'],['</div><div class = rightbox1>'],['</div><div class = rightbox2>'],['</div><div class = rightbox_center>'],['</div><div class = rightbox3>'],['</div><div class = rightbox4>'],['</div></div>']]
				   
		


var stims = createTrialTypes(practice_len)

var prompt_text_list = '<ul list-text>'+
						'<li>Match: ' + possible_responses[0][0] + '</li>' +
						'<li>Mismatch: ' + possible_responses[1][0] + '</li>' +
					  '</ul>'

var prompt_text = '<div class = prompt_box>'+
					  '<p class = center-block-text style = "font-size:16px; line-height:80%%;">Please judge if the green and the <i>middle</i> white shapes are the same.</p>' +
					  '<p class = center-block-text style = "font-size:16px; line-height:80%%;">Same: ' + possible_responses[0][0] + '</p>' +
					  '<p class = center-block-text style = "font-size:16px; line-height:80%%;">Different: ' + possible_responses[1][0] + '</p>' +
				  '</div>' 
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
   columns: [60,60],
   timing_response: 360000
};


var feedback_text = 
'Welcome to the experiment. This task will take around 30 minutes. Press <strong>enter</strong> to begin.'
var feedback_block = {
	type: 'poldrack-single-stim',
	data: {
		exp_id: "flanker_with_shape_matching",
		trial_id: "feedback_block"
	},
	choices: [13],
	stimulus: getFeedback,
	timing_post_trial: 0,
	is_html: true,
	timing_response: 180000,
	response_ends_trial: true, 

};

var feedback_instruct_text =
	'Welcome to the experiment. This experiment will take less than 30 minutes. Press <strong>enter</strong> to begin.'
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
		'<div class = centerbox>'+
			'<p class = block-text>In this experiment you will see a row of shapes. You will always see 5 white shapes to the right, 1 green shape to the left, and sometimes, 1 red shape overlapping with the green shape.</p> '+
		
			'<p class = block-text>You will be asked to judge whether the green shape on the left, matches the <i>middle</i> white shape on the right.</p>'+
		
		'</div>',
		
		'<div class = centerbox>'+
				
			'<p class = block-text>If the shapes are the same, please press the '+possible_responses[0][0]+'.  If the shapes are different, press the '+possible_responses[1][0]+'.</p>'+
		
			'<p class = block-text>You will always see multiple white shapes, please match the green shape only to the <i>middle</i> white shape. Ignore the other white shapes.</p>'+
		
			'<p class = block-text>Sometimes, you will also see a red shape near the green shape.  Ignore this red shape as well.</p>'+
				
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

var end_block = {
	type: 'poldrack-text',
	data: {
		trial_id: "end",
    	exp_id: 'flanker_with_shape_matching'
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

var start_test_block = {
	type: 'poldrack-text',
	data: {
		trial_id: "instruction"
	},
	timing_response: 180000,
	text: '<div class = centerbox>'+
			'<p class = block-text>We will now start the test portion</p>'+
			
			'<p class = block-text>You will be asked to judge whether the green shape on the left, matches the <i>middle</i> white shape on the right..</p>'+
		
			'<p class = block-text>If the shapes are the same, please press the '+possible_responses[0][0]+'.  If the shapes are different, press the '+possible_responses[0][0]+'.</p>'+
		
			'<p class = block-text>You will always see multiple white shapes, please match the green shape only to the <i>middle</i> white shape. Ignore the other white shapes.</p>'+
		
			'<p class = block-text>Sometimes, you will also see a red shape near the green shape.  Ignore this red shape as well.</p>'+
	
			'<p class = block-text>You will no longer receive the rule prompt, so remember the instructions before you continue. Press Enter to begin.</p>'+
		 '</div>',
	cont_key: [13],
	timing_post_trial: 1000,
	on_finish: function(){
		feedback_text = "We will now start the test portion. Press enter to begin."
	}
};

var rest_block = {
	type: 'poldrack-text',
	data: {
		trial_id: "instruction"
	},
	timing_response: 180000,
	text: '<div class = centerbox><p class = center-block-text>Take a short break!</p><p class = center-block-text>Press <strong>enter</strong> to continue the test.</p></div>',
	cont_key: [13],
	timing_post_trial: 1000
};

var fixation_block = {
	type: 'poldrack-single-stim',
	stimulus: '<div class = centerbox><div class = fixation>+</div></div>',
	is_html: true,
	choices: 'none',
	data: {
		trial_id: "practice_fixation"
	},
	timing_response: 500, //500
	timing_post_trial: 0,
}

var practiceTrials = []
practiceTrials.push(feedback_block)
practiceTrials.push(instructions_block)
for (i = 0; i < practice_len; i++) {
	var mask_block = {
		type: 'poldrack-single-stim',
		stimulus: getMask,
		is_html: true,
		data: {
			"trial_id": "practice_mask",
		},
		choices: 'none',
		timing_response: 500, //500
		timing_post_trial: 0,
		response_ends_trial: false,
		prompt: prompt_text
	}
	
	var practice_block = {
		type: 'poldrack-categorize',
		stimulus: getStim,
		is_html: true,
		choices: [possible_responses[0][1],possible_responses[1][1]],
		key_answer: getResponse,
		data: {
			exp_id: "shape_matching_with_cued_task_switching",
			trial_id: "practice_trial"
			},
		correct_text: '<div class = fb_box><div class = center-text><font size = 20>Correct!</font></div></div>' + prompt_text,
		incorrect_text: '<div class = fb_box><div class = center-text><font size = 20>Incorrect</font></div></div>' + prompt_text,
		timeout_message: '<div class = fb_box><div class = center-text><font size = 20>Respond Faster!</font></div></div>' + prompt_text,
		timing_stim: 1000, //2000
		timing_response: 2000,
		timing_feedback: 500, //500
		show_stim_with_feedback: false,
		timing_post_trial: 0,
		on_finish: appendData,
		prompt: prompt_text
	}
	practiceTrials.push(mask_block)
	practiceTrials.push(practice_block)
}


var practiceCount = 0
var practiceNode = {
	timeline: practiceTrials,
	loop_function: function(data){
		practiceCount += 1
		stims = createTrialTypes(practice_len)
		current_trial = 0
	
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
					'</p><p class = block-text>Your accuracy is too low.  Remember: ' + prompt_text_list 
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
for (i = 0; i < numTrialsPerBlock; i++) {
	var mask_block = {
		type: 'poldrack-single-stim',
		stimulus: getMask,
		is_html: true,
		data: {
			"trial_id": "test_mask",
		},
		choices: 'none',
		timing_response: 500, //500
		timing_post_trial: 0,
		response_ends_trial: false
	}
	
	var test_block = {
		type: 'poldrack-single-stim',
		stimulus: getStim,
		is_html: true,
		data: {
			"trial_id": "test_trial",
		},
		choices: [possible_responses[0][1],possible_responses[1][1]],
		timing_stim: 1000, //2000
		timing_response: 2000, //2000
		timing_post_trial: 0,
		response_ends_trial: false,
		on_finish: appendData
	}
	testTrials.push(mask_block)
	testTrials.push(test_block)
}

var testCount = 0
var testNode = {
	timeline: testTrials,
	loop_function: function(data) {
	testCount += 1
	stims = createTrialTypes(numTrialsPerBlock)
	current_trial = 0
	
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
					'</p><p class = block-text>Your accuracy is too low.  Remember: ' + prompt_text_list 
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
flanker_with_shape_matching_experiment = []
//flanker_with_shape_matching_experiment.push(test_img_block)
//flanker_with_shape_matching_experiment.push(instruction_node)
//flanker_with_shape_matching_experiment.push(practice1)

flanker_with_shape_matching_experiment.push(practiceNode)
flanker_with_shape_matching_experiment.push(feedback_block)

flanker_with_shape_matching_experiment.push(start_test_block)
flanker_with_shape_matching_experiment.push(testNode)
flanker_with_shape_matching_experiment.push(feedback_block)

flanker_with_shape_matching_experiment.push(post_task_block)
flanker_with_shape_matching_experiment.push(end_block)