/* ************************************ */
/* Define helper functions */
/* ************************************ */
function addID() {
  jsPsych.data.addDataToLastTrial({exp_id: 'go_nogo_with_shape_matching'})
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
  jsPsych.data.addDataToLastTrial({"att_check_percent": check_percent})
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
	return '<div class = bigbox><div class = picture_box><p class = block-text>' + feedback_text + '</p></div></div>'
}

var getCategorizeIncorrectText = function(){
	if (go_nogo_condition == 'go'){
	
		return '<div class = fb_box><div class = center-text>Incorrect</div></div>' + prompt_text
	} else {
	
		return '<div class = fb_box><div class = center-text>Incorrect</div></div>' + prompt_text
	}

}

var getTimeoutText = function(){
	if (go_nogo_condition == "go"){
		return '<div class = fb_box><div class = center-text>Respond Faster!</div></div>' + prompt_text
	} else {
		return '<div class = fb_box><div class = center-text>Correct!</div></div>' + prompt_text
	}
}

var getCorrectText = function(){
	if (go_nogo_condition == "go"){
		return '<div class = fb_box><div class = center-text>Correct!</div></div>' + prompt_text
	} else {
		return '<div class = fb_box><div class = center-text>Incorrect</div></div>' + prompt_text
	}
}

var randomDraw = function(lst) {
  var index = Math.floor(Math.random() * (lst.length))
  return lst[index]
}

var getPTD = function(shape_matching_condition, go_nogo_condition){
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
	
	if (go_nogo_condition == 'go'){
		probe_color = go_no_go_styles[0]
	} else if (go_nogo_condition == 'stop'){
		probe_color = go_no_go_styles[1]	
	
	}
	return [probe_i, target_i, distractor_i, correct_response, probe_color]
}
	 
var createTrialTypes = function(numTrialsPerBlock){
	go_nogo_trial_types = ['go','go','go','go','stop']
	shape_matching_trial_types = ['DDD','SDD','DSD','DDS','SSS','SNN','DNN']
	
	var stims = []
	for(var numIterations = 0; numIterations < numTrialsPerBlock/35; numIterations++){
		for (var numShapeConds = 0; numShapeConds < shape_matching_trial_types.length; numShapeConds++){
			for (var numgo_nogoConds = 0; numgo_nogoConds < go_nogo_trial_types.length; numgo_nogoConds++){
			
				shape_matching_condition = shape_matching_trial_types[numShapeConds]
				go_nogo_condition = go_nogo_trial_types[numgo_nogoConds]
				
				answer_arr = getPTD(shape_matching_condition, go_nogo_condition)
				
				probe = answer_arr[0]
				target = answer_arr[1]
				distractor = answer_arr[2]
				correct_response = answer_arr[3]
				probe_color = answer_arr[4]
				
				stim = {
					go_nogo_condition: go_nogo_condition,
					shape_matching_condition: shape_matching_condition,
					probe: probe,
					target: target,
					distractor: distractor,
					probe_color: probe_color,
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
	if (go_nogo_condition == "go"){
		if ((shape_matching_condition == "SNN") || (shape_matching_condition == "DNN")){
			return task_boards[0]+ preFileType + target + '_green' + fileTypePNG + 
				   task_boards[1]+
				   task_boards[2]+ preFileType + probe + '_white'+ '_' + probe_color +  fileTypePNG + 
				   task_boards[3]		   
		
		} else {
	
			return task_boards[0]+ preFileType + target + '_green' + fileTypePNG + 
				   task_boards[1]+ preFileType + distractor + '_red' + fileTypePNG + 
				   task_boards[2]+ preFileType + probe + '_white'+ '_' + probe_color + fileTypePNG + 
				   task_boards[3]		   
		}
	} else if (go_nogo_condition == "stop"){
		if ((shape_matching_condition == "SNN") || (shape_matching_condition == "DNN")){
			return task_boards[0]+ preFileType + target + '_green' + fileTypePNG + 
				   task_boards[1]+
				   task_boards[2]+ preFileType + probe + '_white' + '_' + probe_color + fileTypePNG + 
				   task_boards[3]		   
		
		} else {
	
			return task_boards[0]+ preFileType + target + '_green' + fileTypePNG + 
				   task_boards[1]+ preFileType + distractor + '_red' + fileTypePNG + 
				   task_boards[2]+ preFileType + probe + '_white' + '_' + probe_color + fileTypePNG + 
				   task_boards[3]		   
		}
		
	}
}

		
var getMask = function(){
	stim = stims.shift()
	go_nogo_condition = stim.go_nogo_condition
	shape_matching_condition = stim.shape_matching_condition
	probe = stim.probe
	target = stim.target
	distractor = stim.distractor
	correct_response = stim.correct_response
	probe_color = stim.probe_color
	
	return mask_boards[0]+ preFileType + 'mask' + fileTypePNG + 
		   mask_boards[1]+ preFileType + 'mask' + fileTypePNG + 
		   mask_boards[2]


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
		go_nogo_condition: go_nogo_condition,
		correct_response: correct_response,
		probe_color: probe_color,
		probe: probe,
		target: target,
		distractor: distractor,
		current_block: current_block,
		current_trial: current_trial
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
var practice_len = 35 // must be divisible by 35, [5 (go,go,go,go,stop) by 7 (shape matching conditions)]
var exp_len = 70 //350 must be divisible by 35
var numTrialsPerBlock = 35; // 70 divisible by 35
var numTestBlocks = exp_len / numTrialsPerBlock

var accuracy_thresh = 0.80
var missed_thresh = 0.10
var practice_thresh = 2 // 3 blocks of 28 trials
 
var possible_responses = [['M Key', 77],['Z Key', 90]]

var go_no_go_styles = ['unfilled','solid'] //has dashed as well

var current_trial = 0
var current_block = 0

var fileTypePNG = '.png"></img>'
var preFileType = '<img class = center src="/static/experiments/go_nogo_with_shape_matching/images/'




var task_boards = [['<div class = bigbox><div class = leftbox>'],['</div><div class = distractorbox>'],['</div><div class = rightbox>'],['</div></div>']]
				

var mask_boards = [['<div class = bigbox><div class = leftbox>'],['</div><div class = rightbox>'],['</div></div>']]				   
		


var stims = createTrialTypes(practice_len)

var prompt_text_list = '<ul list-text>'+
						'<li>Indicate whether green and white shapes are the same or different</li>' +
						'<li>same: ' + possible_responses[0][0] + '</li>' +
						'<li>different: ' + possible_responses[1][0] + '</li>' +
						'<li>Do not respond if shape on right is '+ go_no_go_styles[1]+', only respond if '+ go_no_go_styles[0]+'</li>' +
					   '</ul>'
					   

var prompt_text = '<div class = prompt_box>'+
					  '<p class = center-block-text style = "font-size:16px; line-height:80%;">Indicate whether green and white shapes are the same or different</p>' +
					  '<p class = center-block-text style = "font-size:16px; line-height:80%;">Same: ' + possible_responses[0][0] + '</p>' +
					  '<p class = center-block-text style = "font-size:16px; line-height:80%;">Different: ' + possible_responses[1][0] + '</p>' +
					  '<p class = center-block-text style = "font-size:16px; line-height:80%;">Do not respond if shape on right is '+ go_no_go_styles[1]+', only respond if '+ go_no_go_styles[0]+'</p>' +
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

var practice1 = {
	type: 'poldrack-single-stim',
	stimulus: '<div class = bigbox>'+
				'<div class = instructBox>'+
					'<p class = block-text style="font-size:24px;">This is what the trial will look like.  The green and red shapes are on the left, and the white shape is on the right.</p>'+
					'<p class = block-text style="font-size:24px;">If the green and white shapes are the same, press ' + possible_responses[0][0] + '.  If the green and white shapes are different, press ' + possible_responses[1][0] + '</p>'+
					'<p class = block-text style="font-size:24px;">In this case, the green and white shapes are the same, so the correct answer is the ' + possible_responses[0][0] + '.</p>'+
					'<p class = block-text style="font-size:24px;">Press Enter to continue. You will not be able to go back.</p>'+
				'</div>'+
				   
				   '<div class = leftbox>' + preFileType +  '1_green' + fileTypePNG + 
				   task_boards[1]+ preFileType +  '2_red' + fileTypePNG + 
				   task_boards[2]+ preFileType +  '1_white'+ '_' + go_no_go_styles[0] + fileTypePNG + 
				   '</div>'	+
				
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
					'<p class = block-text style="font-size:24px;">If instead, the '+go_no_go_styles[1]+' version of the white shape came out, then do not respond on that trial!</p>'+
					'<p class = block-text style="font-size:24px;">Remember, respond only if the white shape is '+go_no_go_styles[0]+', not if the white shape is '+go_no_go_styles[1]+'.</p>'+
					'<p class = block-text style="font-size:24px;">For example, you would not respond on this trial, because the white shape is '+go_no_go_styles[1]+'.</p>'+
					'<p class = block-text style="font-size:24px;">Press Enter to start practice.</p>'+
				'</div>'+
				
				'<div class = leftbox>' + preFileType +  '1_green' + fileTypePNG + 
				   task_boards[1]+ preFileType +  '2_red' + fileTypePNG + 
				   task_boards[2]+ preFileType +  '1_white'+ '_' + go_no_go_styles[1] + fileTypePNG + 
				'</div>'+
				
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

//Set up post task questionnaire
var post_task_block = {
   type: 'survey-text',
   data: {
       trial_id: "post_task_questions"
   },
   questions: ['<p class = center-block-text style = "font-size: 20px">Please summarize what you were asked to do in this task.</p>',
              '<p class = center-block-text style = "font-size: 20px">Do you have any comments about this task?</p>'],
   rows: [15, 15],
   columns: [60,60]
};

var feedback_text = 
	'Welcome to the experiment. This experiment will take less than 30 minutes. Press <i>enter</i> to begin.'
var feedback_block = {
	type: 'poldrack-single-stim',
	data: {
		exp_id: "go_nogo_with_shape_matching",
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
			'<p class = block-text>In this experiment you will see a red and green shape on the left side of the screen, and a white shape on the right.</p> '+
		
			'<p class = block-text>You will be asked to judge whether the green shape on the left is the same as the white shape on the right.</p>'+
		
			'<p class = block-text>If the shapes are the same, please press the '+possible_responses[0][0]+'.  If the shapes are different, press the '+possible_responses[1][0]+'.</p>'+
			
			'<p class = block-text>Ignore the red shape on the left. Your task is to only to respond based on whether the green and white shapes are the same.</p>'+
		
			'<p class = block-text>On most trials, the white shape will be unfilled.  On some trials, the white shape will be solid.  If the white shape is solid, please make no response on that trial.</p>'+
				
			'<p class = block-text>We will start practice when you finish instructions. Please make sure you understand the instructions before moving on. You will be given a reminder of the rules for practice. <i>This will be removed for test!</i></p>'+
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
    	exp_id: 'go_nogo_with_shape_matching'
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
			
			'<p class = block-text>You will be asked to judge whether the green shape on the left, is the same as the white on the right.</p>'+
		
			'<p class = block-text>If the shapes are the same, please press the '+possible_responses[0][0]+'.  If the shapes are different, press the '+possible_responses[1][0]+'.</p>'+
		
			'<p class = block-text>Please only respond if the shape on the right is ' + go_no_go_styles[0] + ', not if it is ' + go_no_go_styles[1] +'.</p>'+
		
			'<p class = block-text>Ignore the red shape on the left.</p>'+
	
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
		correct_text: getCorrectText,
		incorrect_text: getCategorizeIncorrectText,
		timeout_message: getTimeoutText,
		timing_stim: 2000, //2000
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
			if ((data[i].trial_id == "practice_trial") && (data[i].go_nogo_condition == 'go')){
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
		feedback_text += "</p><p class = block-text><i>Average reaction time:  " + Math.round(ave_rt) + " ms. 	Accuracy for trials requiring a response: " + Math.round(accuracy * 100)+ "%</i>"

		if (accuracy > accuracy_thresh){
			feedback_text +=
					'</p><p class = block-text>Done with this practice. Press Enter to continue.' 
			stims = createTrialTypes(numTrialsPerBlock)
			return false
	
		} else if (accuracy < accuracy_thresh){
			feedback_text +=
					'</p><p class = block-text>Your accuracy is too low.  Remember, judge if the green shape on the left matches or mismatches the <i>CENTER</i> white shape on the right: <br>' + prompt_text_list
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
		timing_stim: 2000, //2000
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
			if ((data[i].trial_id == "test_trial") && (data[i].go_nogo_condition == 'go')){
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
		feedback_text += "</p><p class = block-text><i>Average reaction time:  " + Math.round(ave_rt) + " ms. 	Accuracy for trials requiring a response: " + Math.round(accuracy * 100)+ "%</i>"
		feedback_text += "</p><p class = block-text>You have completed: "+testCount+" out of "+numTestBlocks+" blocks of trials."
		
		if (accuracy < accuracy_thresh){
			feedback_text +=
					'</p><p class = block-text>Your accuracy is too low.  Remember, judge if the green shape on the left matches or mismatches the <i>CENTER</i> white shape on the right: <br>' + prompt_text_list
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
go_nogo_with_shape_matching_experiment = []
//go_nogo_with_shape_matching_experiment.push(test_img_block)
//go_nogo_with_shape_matching_experiment.push(instruction_node)
//go_nogo_with_shape_matching_experiment.push(practice1)
//go_nogo_with_shape_matching_experiment.push(practice2)

go_nogo_with_shape_matching_experiment.push(practiceNode)
go_nogo_with_shape_matching_experiment.push(feedback_block)

go_nogo_with_shape_matching_experiment.push(start_test_block)
go_nogo_with_shape_matching_experiment.push(testNode)
go_nogo_with_shape_matching_experiment.push(feedback_block)

go_nogo_with_shape_matching_experiment.push(post_task_block)
go_nogo_with_shape_matching_experiment.push(end_block)