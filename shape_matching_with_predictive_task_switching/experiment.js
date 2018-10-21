/* ************************************ */
/* Define helper functions */
/* ************************************ */
function addID() {
  jsPsych.data.addDataToLastTrial({exp_id: 'shape_matching_with_predictive_task_switching'})
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


							 
var createTrialTypes = function(numTrialsPerBlock){
	var whichQuadStart = jsPsych.randomization.repeat([1,2,3,4],1).pop()
	var predictive_cond_array = predictive_conditions[whichQuadStart%2]
	predictive_dimensions = predictive_dimensions_list[0]
	
	var shape_matching_trial_type_list = []
	var shape_matching_trial_types1 = jsPsych.randomization.repeat(['DDD','SDD','DSD','DDS','SSS','SNN','DNN'], numTrialsPerBlock/28)
	var shape_matching_trial_types2 = jsPsych.randomization.repeat(['DDD','SDD','DSD','DDS','SSS','SNN','DNN'], numTrialsPerBlock/28)
	var shape_matching_trial_types3 = jsPsych.randomization.repeat(['DDD','SDD','DSD','DDS','SSS','SNN','DNN'], numTrialsPerBlock/28)
	var shape_matching_trial_types4 = jsPsych.randomization.repeat(['DDD','SDD','DSD','DDS','SSS','SNN','DNN'], numTrialsPerBlock/28)
	shape_matching_trial_type_list.push(shape_matching_trial_types1)
	shape_matching_trial_type_list.push(shape_matching_trial_types2)
	shape_matching_trial_type_list.push(shape_matching_trial_types3)
	shape_matching_trial_type_list.push(shape_matching_trial_types4)
	
	shape_matching_condition = jsPsych.randomization.repeat(['DDD','SDD','DSD','DDS','SSS','SNN','DNN'], 1).pop()
	predictive_dimension = predictive_dimensions[whichQuadStart - 1]
	
	var probe_i = randomDraw([1,2,3,4,5,6,7,8,9,10])
	var target_i = 0
	var distractor_i = 0
	if (shape_matching_condition[0] == 'S') {
		target_i = probe_i
		if (predictive_dimension == 'the same'){
			correct_response = possible_responses[0][1]
		} else  {
			correct_response = possible_responses[1][1]		
		}
	} else {
		target_i = randomDraw([1,2,3,4,5,6,7,8,9,10].filter(function(y) {return y != probe_i}))				
		if (predictive_dimension == 'the same'){
			correct_response = possible_responses[1][1]
		} else  {
			correct_response = possible_responses[0][1]		
		}
	
	}
	
	if (shape_matching_condition[1] == 'S') {
		distractor_i = target_i
	} else if (shape_matching_condition[2] == 'S') {
		distractor_i = probe_i
	} else if (shape_matching_condition[2] == 'D') {
		distractor_i = randomDraw([1,2,3,4,5,6,7,8,9,10].filter(function(y) {return $.inArray(y, [target_i, probe_i]) == -1}))
	} else if (shape_matching_condition[2] == 'N'){
		distractor_i = 'none'
	}
	
		
	var stims = []
	
	var first_stim = {
		whichQuad: whichQuadStart,
		predictive_condition: 'N/A',
		predictive_dimension: predictive_dimension,
		shape_matching_condition: shape_matching_condition,
		probe: probe_i,
		target: target_i,
		distractor: distractor_i,
		correct_response: correct_response
		}
	stims.push(first_stim)
	
	for (var i = 0; i < numTrialsPerBlock; i++){
		whichQuadStart += 1
		quadIndex = whichQuadStart%4
		if (quadIndex == 0){
			quadIndex = 4
		}
		shape_matching_condition = shape_matching_trial_type_list[quadIndex - 1].pop()
		predictive_dimension = predictive_dimensions[quadIndex - 1]
		var probe_i = randomDraw([1,2,3,4,5,6,7,8,9,10])
		var target_i = 0
		var distractor_i = 0
		if (shape_matching_condition[0] == 'S') {
			target_i = probe_i
			if (predictive_dimension == 'the same'){
				correct_response = possible_responses[0][1]
			} else  {
				correct_response = possible_responses[1][1]		
			}
		} else {
			target_i = randomDraw([1,2,3,4,5,6,7,8,9,10].filter(function(y) {return y != probe_i}))				
			if (predictive_dimension == 'the same'){
				correct_response = possible_responses[1][1]
			} else  {
				correct_response = possible_responses[0][1]		
			}
		
		}
		
		if (shape_matching_condition[1] == 'S') {
			distractor_i = target_i
		} else if (shape_matching_condition[2] == 'S') {
			distractor_i = probe_i
		} else if (shape_matching_condition[2] == 'D') {
			distractor_i = randomDraw([1,2,3,4,5,6,7,8,9,10].filter(function(y) {return $.inArray(y, [target_i, probe_i]) == -1}))
		} else if (shape_matching_condition[2] == 'N'){
			distractor_i = 'none'
		}
			
		stim = {
			whichQuad: quadIndex,
			predictive_condition: predictive_cond_array[i%2],
			predictive_dimension: predictive_dimension,
			shape_matching_condition: shape_matching_condition,
			probe: probe_i,
			target: target_i,
			distractor: distractor_i,
			correct_response: correct_response
			}
		
		stims.push(stim)
		
		
	}

	return stims	
}	

var getResponse = function() {
	return correct_response
}

var getStim = function(){
	if ((shape_matching_condition == "SNN") || (shape_matching_condition == "DNN")){
		return task_boards[whichQuadrant - 1][0]+ preFileType + target + '_green' + fileTypePNG + 
			   task_boards[whichQuadrant - 1][1]+
			   task_boards[whichQuadrant - 1][2]+ preFileType + probe + '_white' + fileTypePNG + 
			   task_boards[whichQuadrant - 1][3]		   
			
	} else {
	
		return task_boards[whichQuadrant - 1][0]+ preFileType + target + '_green' + fileTypePNG + 
			   task_boards[whichQuadrant - 1][1]+ preFileType + distractor + '_red' + fileTypePNG + 
			   task_boards[whichQuadrant - 1][2]+ preFileType + probe + '_white' + fileTypePNG + 
			   task_boards[whichQuadrant - 1][3]		   
	}
}
		
var getMask = function(){
	stim = stims.shift()
	predictive_condition = stim.predictive_condition
	predictive_dimension = stim.predictive_dimension
	shape_matching_condition = stim.shape_matching_condition
	probe = stim.probe
	target = stim.target
	distractor = stim.distractor
	correct_response = stim.correct_response
	whichQuadrant = stim.whichQuad
	
	return mask_boards[whichQuadrant - 1][0]+ preFileType + 'mask' + fileTypePNG + 
		   '<div class = centerbox><div class = fixation>+</div></div>' +
		   mask_boards[whichQuadrant - 1][1]+ preFileType + 'mask' + fileTypePNG + 
		   '<div class = centerbox><div class = fixation>+</div></div>' +
		   mask_boards[whichQuadrant - 1][2]
}


var getFixation = function(){
	
	return fixation_boards[whichQuadrant - 1]
}


var appendData = function(){
	curr_trial = jsPsych.progress().current_trial_global
	trial_id = jsPsych.data.getDataByTrialIndex(curr_trial).trial_id
	
	jsPsych.data.addDataToLastTrial({
		predictive_condition: predictive_condition,
		predictive_dimension: predictive_dimension,
		shape_matching_condition: shape_matching_condition,
		probe: probe,
		target: target,
		distractor: distractor,
		correct_response: correct_response,
		whichQuadrant: whichQuadrant
		
	})
}

/* ************************************ */
/* Define experimental variables */
/* ************************************ */
// generic task variables
var run_attention_checks = true
var sumInstructTime = 0 //ms
var instructTimeThresh = 0 ///in seconds
var credit_var = 0

// task specific variables
// Set up variables for stimuli
var practice_len = 28
var exp_len = 56 //336 must be divisible by 28
var numTrialsPerBlock = 28; // divisible by 28
var numTestBlocks = exp_len / numTrialsPerBlock

var accuracy_thresh = 0.70
var missed_thresh = 0.10
var practice_thresh = 3 // 3 blocks of 28 trials
 

var predictive_conditions = [['switch','stay'],
							 ['stay','switch']]
var predictive_dimensions_list = [['the same', 'the same', 'different','different'],
							 	  ['different','different', 'the same', 'the same' ]]
var possible_responses = [['M Key', 77],['Z Key', 90]]




var fileTypePNG = ".png'></img>"
var preFileType = "<img class = center src='/static/experiments/shape_matching_with_predictive_task_switching/images/"
var path = '/static/experiments/shape_matching_with_predictive_task_switching/images/'
var colors = ['white','red','green']

var exp_stage = 'practice'
var current_trial = 0

var shape_stim = []
for (var i = 1; i<11; i++) {
	for (var c = 0; c<3; c++) {
		shape_stim.push(path + i + '_' + colors[c] + '.png')
	}
}
jsPsych.pluginAPI.preloadImages(shape_stim.concat(path+'mask.png'))

// Trial types denoted by three letters for the relationship between:
// probe-target, target-distractor, distractor-probe of the form
// SDS where "S" = match and "D" = non-match, N = "Neutral"
//['SSS', 'SDD', 'SNN', 'DSD', 'DDD', 'DDS', 'DNN']



var task_boards = [[['<div class = bigbox><div class = decision-top-left><div class = leftbox>'],['</div><div class = distractorbox>'],['</div><div class = rightbox>'],['</div></div><div class = decision-top-right></div><div class = decision-bottom-right></div><div class = decision-bottom-left></div></div>']],
				   [['<div class = bigbox><div class = decision-top-left></div><div class = decision-top-right><div class = leftbox>'],['</div><div class = distractorbox>'],['</div><div class = rightbox>'],['</div></div><div class = decision-bottom-right></div><div class = decision-bottom-left></div></div>']],
				   [['<div class = bigbox><div class = decision-top-left></div><div class = decision-top-right></div><div class = decision-bottom-right><div class = leftbox>'],['</div><div class = distractorbox>'],['</div><div class = rightbox>'],['</div></div><div class = decision-bottom-left></div></div>']],
				   [['<div class = bigbox><div class = decision-top-left></div><div class = decision-top-right></div><div class = decision-bottom-right></div><div class = decision-bottom-left><div class = leftbox>'],['</div><div class = distractorbox>'],['</div><div class = rightbox>'],['</div></div></div>']]]

var mask_boards = [[['<div class = bigbox><div class = decision-top-left><div class = leftbox>'],['</div><div class = rightbox>'],['</div></div><div class = decision-top-right></div><div class = decision-bottom-right></div><div class = decision-bottom-left></div></div>']],
				   [['<div class = bigbox><div class = decision-top-left></div><div class = decision-top-right><div class = leftbox>'],['</div><div class = rightbox>'],['</div></div><div class = decision-bottom-right></div><div class = decision-bottom-left></div></div>']],
				   [['<div class = bigbox><div class = decision-top-left></div><div class = decision-top-right></div><div class = decision-bottom-right><div class = leftbox>'],['</div><div class = rightbox>'],['</div></div><div class = decision-bottom-left></div></div>']],
				   [['<div class = bigbox><div class = decision-top-left></div><div class = decision-top-right></div><div class = decision-bottom-right></div><div class = decision-bottom-left><div class = leftbox>'],['</div><div class = rightbox>'],['</div></div></div>']]]


var fixation_boards = [['<div class = bigbox><div class = decision-top-left><div class = centerbox><div class = fixation>+</div></div></div></div>'],
					   ['<div class = bigbox><div class = decision-top-right><div class = centerbox><div class = fixation>+</div></div></div></div>'],
					   ['<div class = bigbox><div class = decision-bottom-right><div class = centerbox><div class = fixation>+</div></div></div></div>'],
					   ['<div class = bigbox><div class = decision-bottom-left><div class = centerbox><div class = fixation>+</div></div></div></div>']]


var stims = createTrialTypes(practice_len)

var prompt_text_list = '<ul list-text>'+
						'<li>Top 2 quadrants: Answer if the green and white shapes are '+predictive_dimensions[0]+'</li>' +
						'<li>'+predictive_dimensions[0] +': ' + possible_responses[0][0] + '</li>' +
						'<li>'+predictive_dimensions[2] +': ' + possible_responses[1][0] + '</li>' +
						'<li>Bottom 2 quadrants: Answer if the green and white shapes are '+predictive_dimensions[2]+'</li>' +
						'<li>'+predictive_dimensions[2] +': ' + possible_responses[0][0] + '</li>' +
						'<li>'+predictive_dimensions[0] +': ' + possible_responses[1][0] + '</li>' +
					  '</ul>'
				  
var prompt_text = '<div class = prompt_box>'+
					  '<p class = center-block-text style = "font-size:16px; line-height:80%%;">Top 2 quadrants: Answer if the green and white shapes are '+predictive_dimensions[0]+'</p>' +
					  '<p class = center-block-text style = "font-size:16px; line-height:80%%;">'+predictive_dimensions[0] +': ' + possible_responses[0][0] + ' | '+predictive_dimensions[2] +': ' + possible_responses[1][0] + '</p>' +
					  '<p class = center-block-text style = "font-size:16px; line-height:80%%;">Bottom 2 quadrants: Answer if the green and white shapes are '+predictive_dimensions[2]+'</p>' +
					  '<p class = center-block-text style = "font-size:16px; line-height:80%%;">'+predictive_dimensions[2] +': ' + possible_responses[0][0] + ' | '+predictive_dimensions[0] +': ' + possible_responses[1][0] + '</p>' +
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

//Set up post task questionnaire
var post_task_block = {
   type: 'survey-text',
   data: {
       trial_id: "post_task_questions"
   },
   questions: ['<p class = center-block-text style = "font-size: 20px">Please summarize what you were asked to do in this task.</p>',
              '<p class = center-block-text style = "font-size: 20px">Do you have any comments about this task?</p>'],
   rows: [15, 15],
   columns: [60,60],
   timing_response: 360000
};


var feedback_text = 
'Welcome to the experiment. This experiment will take less than 30 minutes. Press <i>enter</i> to begin.'
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

var feedback_instruct_text =
	'Welcome to the experiment. This experiment will take less than 30 minutes. Press <i>enter</i> to begin.'
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
			'<p class = block-text>In this experiment, across trials you will see shapes moving clockwise on the screen in 4 quadrants. '+
			'On every trial, one quadrant will have a  white shape on the right and a green shape on the left.</p> '+
		
			'<p class = block-text>You will be asked if the green shape is the same or different than the white shape, depending on which quadrant '+
			'the shapes are in.</p>'+
		'</div>',
		
		'<div class = centerbox>'+
			'<p class = block-text>When in the top two quadrants, please judge whether the two shapes are <i>'+predictive_dimensions[0]+'</i>. Press the <i>'+possible_responses[0][0]+
			'  </i>if they are <i>'+predictive_dimensions[0]+'</i>, and the <i>'+possible_responses[1][0]+'  </i>if they are <i>'+predictive_dimensions[2]+'</i>.</p>'+
	
			'<p class = block-text>When in the bottom two quadrants, please judge whether the two shapes are <i>'+predictive_dimensions[2]+'.</i>'+
			' Press the <i>'+possible_responses[0][0]+' </i> if they are <i>'+predictive_dimensions[2]+'</i>, and the <i>'+possible_responses[1][0]+
			' </i> if they are <i>'+predictive_dimensions[0]+'</i>.</p>'+
		
			'<p class = block-text>On some trials a red shape will also be presented on the left. '+
			'You should ignore the red shape - your task is only to respond based on whether the white and green shapes matches or mismatches.</p>'+
		
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

var end_block = {
	type: 'poldrack-text',
	data: {
		trial_id: "end",
    	exp_id: 'shape_matching_with_predictive_task_switching'
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

var start_test_block = {
	type: 'poldrack-text',
	data: {
		trial_id: "instruction"
	},
	timing_response: 180000,
	text: '<div class = centerbox>'+
			'<p class = block-text>We will now start the test portion</p>'+
			
			'<p class = block-text>Please judge if the green shape matches or mismatches the white shape, depending on which quadrant '+
			'the shapes are in.</p>'+
	
			'<p class = block-text>When in the top two quadrants, please judge whether the two shapes are <i>'+predictive_dimensions[0]+'</i>. Press the <i>'+possible_responses[0][0]+
			'  </i>if they are <i>'+predictive_dimensions[0]+'</i>, and the <i>'+possible_responses[1][0]+'  </i>if they are <i>'+predictive_dimensions[2]+'</i>.</p>'+
	
			'<p class = block-text>When in the bottom two quadrants, please judge whether the two shapes are <i>'+predictive_dimensions[2]+'es.</i>'+
			' Press the <i>'+possible_responses[0][0]+' </i> if they are <i>'+predictive_dimensions[2]+'</i>, and the <i>'+possible_responses[1][0]+
			' </i> if they are <i>'+predictive_dimensions[0]+'</i>.</p>'+
	
			'<p class = block-text>On some trials a red shape will also be presented on the left. '+
			'You should ignore the red shape - your task is only to respond based on whether the white and green shapes matches or mismatches.</p>'+
	
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
	text: '<div class = centerbox><p class = center-block-text>Take a short break!</p><p class = center-block-text>Press <i>enter</i> to continue the test.</p></div>',
	cont_key: [13],
	timing_post_trial: 1000
};



var practiceTrials = []
practiceTrials.push(feedback_block)
practiceTrials.push(instructions_block)
for (i = 0; i < 10; i++) { //practice_len + 1
	var mask_block = {
		type: 'poldrack-single-stim',
		stimulus: getMask,
		is_html: true,
		data: {
			exp_id: "shape_matching_with_predictive_task_switching",
			"trial_id": "mask",
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
	var mask_block = {
		type: 'poldrack-single-stim',
		stimulus: getMask,
		is_html: true,
		data: {
			exp_id: "shape_matching_with_predictive_task_switching",
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
			exp_id: "shape_matching_with_predictive_task_switching",
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
	console.log('hereherhe')
	
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
shape_matching_with_predictive_task_switching_experiment = []

//shape_matching_with_predictive_task_switching_experiment.push(instruction_node)
//shape_matching_with_predictive_task_switching_experiment.push(practice1)

shape_matching_with_predictive_task_switching_experiment.push(practiceNode)
shape_matching_with_predictive_task_switching_experiment.push(feedback_block)

shape_matching_with_predictive_task_switching_experiment.push(start_test_block)
shape_matching_with_predictive_task_switching_experiment.push(testNode)
shape_matching_with_predictive_task_switching_experiment.push(feedback_block)

shape_matching_with_predictive_task_switching_experiment.push(post_task_block)
shape_matching_with_predictive_task_switching_experiment.push(end_block)