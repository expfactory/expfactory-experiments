/* ************************************ */
/*       Define Helper Functions        */
/* ************************************ */

function getDisplayElement() {
    $('<div class = display_stage_background></div>').appendTo('body')
    return $('<div class = display_stage></div>').appendTo('body')
}

function addID() {
  jsPsych.data.addDataToLastTrial({exp_id: 'n_back_with_predictive_task_switching'})
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



var getResponse = function() {
	return correct_response
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
};

var createControlTypes = function(numTrialsPerBlock){
	var whichQuadStart = jsPsych.randomization.repeat([1,2,3,4],1).pop()
	var predictive_cond_array = predictive_conditions[whichQuadStart%2]
	
	predictive_dimensions = predictive_dimensions_list_control_trials[0]
	
	var n_back_trial_type_list = []
	var n_back_trial_types1 = jsPsych.randomization.repeat(['match','mismatch','mismatch','mismatch','mismatch'], numTrialsPerBlock/20)
	var n_back_trial_types2 = jsPsych.randomization.repeat(['match','mismatch','mismatch','mismatch','mismatch'], numTrialsPerBlock/20)
	var n_back_trial_types3 = jsPsych.randomization.repeat(['match','mismatch','mismatch','mismatch','mismatch'], numTrialsPerBlock/20)
	var n_back_trial_types4 = jsPsych.randomization.repeat(['match','mismatch','mismatch','mismatch','mismatch'], numTrialsPerBlock/20)
	n_back_trial_type_list.push(n_back_trial_types1)
	n_back_trial_type_list.push(n_back_trial_types2)
	n_back_trial_type_list.push(n_back_trial_types3)
	n_back_trial_type_list.push(n_back_trial_types4)
	
	var stims = []
	for (var i = 0; i < numTrialsPerBlock + 1; i++){
		quadIndex = whichQuadStart%4
		if (quadIndex == 0){
			quadIndex = 4
		}
		
		if (i == 0){
			predictive_condition = 'N/A'
			n_back_cond = jsPsych.randomization.repeat(['match','mismatch','mismatch','mismatch','mismatch'],1).pop()
			predictive_dimension = predictive_dimensions[quadIndex - 1][0]
		} else if (i > 0){
			predictive_condition = predictive_cond_array[i%2]	
			predictive_dimension = predictive_dimensions[quadIndex - 1][0]
			n_back_cond = n_back_trial_type_list[quadIndex - 1].pop()
		}
		
		
		if (n_back_cond == 'match'){
			correct_response = possible_responses[0][1]
			if (predictive_dimension == 'T or t'){
				probe = randomDraw(['t','T'])
			} else if (predictive_dimension == 'non-T or non-t'){
				probe = randomDraw('bBdDgGvV'.split("").filter(function(y) {return $.inArray(y, ['t','T']) == -1}))
			}
		} else if (n_back_cond == 'mismatch'){
			correct_response = possible_responses[1][1]
			if (predictive_dimension == 'T or t'){
				probe = randomDraw('bBdDgGvV'.split("").filter(function(y) {return $.inArray(y, ['t','T']) == -1}))
			} else if (predictive_dimension == 'non-T or non-t'){
				probe = randomDraw(['t','T'])
			}			
		}
		
		stim = {
			whichQuad: quadIndex,
			n_back_condition: n_back_cond,
			predictive_dimension: predictive_dimension,
			predictive_condition: predictive_condition,
			probe: probe,
			correct_response: correct_response
		}
		
		stims.push(stim)
		whichQuadStart += 1
	}	
	return stims		
}


var createTrialTypes = function(numTrialsPerBlock){
	// 1 or 3 is stay for predictive
	// 2 or 4 is switch for predictive
	var whichQuadStart = jsPsych.randomization.repeat([1,2,3,4],1).pop()
	//1 2
	//4 3
	var predictive_cond_array = predictive_conditions[whichQuadStart%2]
	
	var n_back_trial_type_list = []
	var n_back_trial_types1 = jsPsych.randomization.repeat(['match','mismatch','mismatch','mismatch','mismatch'], numTrialsPerBlock/20)
	var n_back_trial_types2 = jsPsych.randomization.repeat(['match','mismatch','mismatch','mismatch','mismatch'], numTrialsPerBlock/20)
	var n_back_trial_types3 = jsPsych.randomization.repeat(['match','mismatch','mismatch','mismatch','mismatch'], numTrialsPerBlock/20)
	var n_back_trial_types4 = jsPsych.randomization.repeat(['match','mismatch','mismatch','mismatch','mismatch'], numTrialsPerBlock/20)
	n_back_trial_type_list.push(n_back_trial_types1)
	n_back_trial_type_list.push(n_back_trial_types2)
	n_back_trial_type_list.push(n_back_trial_types3)
	n_back_trial_type_list.push(n_back_trial_types4)
	
	predictive_dimensions = predictive_dimensions_list[0]

	
	stims = []		
	
	for (var i = 0; i < numTrialsPerBlock + 2; i++){
		quadIndex = whichQuadStart%4
		if (quadIndex == 0){
			quadIndex = 4
		}
		
		
		predictive_condition = predictive_cond_array[i%2]	
		predictive_dimension = predictive_dimensions[quadIndex - 1][0]
		delay = predictive_dimensions[quadIndex - 1][1]
		
		if ( i == 0){
			n_back_cond = 'N/A'
			probe = randomDraw(letters)
			correct_response = possible_responses[1][1]
			predictive_dimension = 'N/A'
		
		} else if ( i == 1){
			n_back_cond = jsPsych.randomization.repeat(['match','mismatch','mismatch','mismatch','mismatch'],1).pop()
			
			if ((n_back_cond == "match") && (predictive_dimension == '1-back')){
				probe = randomDraw([stims[i - delay].probe.toUpperCase(), stims[i - delay].probe.toLowerCase()])
				correct_response = possible_responses[0][1]
			} else if ((n_back_cond == "mismatch") && (predictive_dimension == '1-back')){
				probe = randomDraw('bBdDgGtTvV'.split("").filter(function(y) {return $.inArray(y, [stims[i - delay].probe.toLowerCase(), stims[i - delay].probe.toUpperCase()]) == -1}))
				correct_response = possible_responses[1][1]
			
			} else if (delay == 2) {
				probe = randomDraw(letters)
			    correct_response = possible_responses[1][1]
			    predictive_dimension = 'N/A'
			    n_back_cond = 'N/A'
			
			}
		
		} else if ( i > 1){
			n_back_cond = n_back_trial_type_list[quadIndex - 1].pop()
			
			if (n_back_cond == "match"){
				probe = randomDraw([stims[i - delay].probe.toUpperCase(), stims[i - delay].probe.toLowerCase()])
				correct_response = possible_responses[0][1]
			} else if (n_back_cond == "mismatch"){
				probe = randomDraw('bBdDgGtTvV'.split("").filter(function(y) {return $.inArray(y, [stims[i - delay].probe.toLowerCase(), stims[i - delay].probe.toUpperCase()]) == -1}))
				correct_response = possible_responses[1][1]
			
			}
		}
	
		stim = {
			whichQuad: quadIndex,
			n_back_condition: n_back_cond,
			predictive_dimension: predictive_dimension,
			predictive_condition: predictive_condition,
			probe: probe,
			correct_response: correct_response,
			delay: delay
		}
		
		stims.push(stim)	
		whichQuadStart += 1
	}
	return stims
}


var getStim = function(){	
	stim = stims.shift()
	whichQuadrant = stim.whichQuad
	n_back_condition = stim.n_back_condition
	predictive_dimension = stim.predictive_dimension
	predictive_condition = stim.predictive_condition
	probe = stim.probe
	correct_response = stim.correct_response
	delay = stim.delay
		
	return task_boards[whichQuadrant - 1][0] + probe
		   task_boards[whichQuadrant - 1][1]
	
}

var getControlStim = function(){	
	stim = control_stims.shift()
	whichQuadrant = stim.whichQuad
	n_back_condition = stim.n_back_condition
	predictive_dimension = stim.predictive_dimension
	predictive_condition = stim.predictive_condition
	probe = stim.probe
	correct_response = stim.correct_response
		
	return task_boards[whichQuadrant - 1][0] + probe
		   task_boards[whichQuadrant - 1][1]
	
}

var getResponse =  function(){
	return correct_response
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
		whichQuadrant: whichQuadrant,
		n_back_condition: n_back_condition,
		predictive_dimension: predictive_dimension,
		predictive_condition: predictive_condition,
		probe: probe,
		correct_response: correct_response,
		delay: delay,
		current_trial: current_trial,
		current_block: current_block	
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
/*    Define Experimental Variables     */
/* ************************************ */
// generic task variables
var sumInstructTime = 0 //ms
var instructTimeThresh = 0 ///in seconds
var credit_var = 0
var run_attention_checks = true


var practice_len = 20 // 24
var exp_len = 120 //320 must be divisible by 20
var numTrialsPerBlock = 40 // must be divisible by 20
var numTestBlocks = exp_len / numTrialsPerBlock

var accuracy_thresh = 0.80
var missed_thresh = 0.10

var practice_thresh = 3 // 3 blocks of 24 trials

var pathSource = "/static/experiments/n_back_with_predictive_task_switching/images/"
var fileTypePNG = ".png'></img>"
var preFileType = "<img class = center src='/static/experiments/n_back_with_predictive_task_switching/images/"



var n_back_conditions = ['match','mismatch']
var predictive_conditions = [['stay','switch'],
							 ['switch','stay']]

var predictive_dimensions_list = [[['1-back',1], ['1-back',1], ['2-back',2], ['2-back',2]],
							 	  [['2-back',2], ['2-back',2], ['1-back',1], ['1-back',1]]]
	
var predictive_dimensions_list_control_trials = jsPsych.randomization.repeat([[['T or t'], ['T or t'], ['non-T or non-t'], ['non-T or non-t']],
							 								   	   			  [['non-T or non-t'], ['non-T or non-t'], ['T or t'], ['T or t']]],1)					 
var letters = 'bBdDgGtTvV'.split("")
							 

var possible_responses = [['M Key', 77],['Z Key', 90]]

var control_stims = createControlTypes(numTrialsPerBlock)
var stims = createTrialTypes(practice_len)


var prompt_text_list = '<ul list-text>'+
						'<li>Top 2 quadrants: match the current letter to the letter that appeared '+predictive_dimensions[0][1]+' trial(s) ago</li>' +
						'<li>Bottom 2 quadrants: match the current letter to the letter that occurred '+predictive_dimensions[2][1]+' trial(s) ago</li>' +
						'<li>If they match, press the '+possible_responses[0][0]+'</li>' +
					    '<li>If they mismatch, press the '+possible_responses[1][0]+'</li>' +
					  '</ul>'

var prompt_text = '<div class = prompt_box>'+
					  '<p class = center-block-text style = "font-size:16px; line-height:80%%;">Top 2 quadrants: match the current letter to the letter that appeared '+predictive_dimensions[0][1]+' trial(s) ago</p>' +
					  '<p class = center-block-text style = "font-size:16px; line-height:80%%;">Bottom 2 quadrants: match the current letter to the letter that occurred '+predictive_dimensions[2][1]+' trial(s) ago</p>' +
					  '<p class = center-block-text style = "font-size:16px; line-height:80%%;">If they match, press the '+possible_responses[0][0]+'</p>' +
					  '<p class = center-block-text style = "font-size:16px; line-height:80%%;">If they mismatch, press the '+possible_responses[1][0]+'</p>' +
				  '</div>'
				  				  

var current_trial = 0
var current_block = 0
/* ************************************ */
/*          Define Game Boards          */
/* ************************************ */

var task_boards = [[['<div class = bigbox><div class = decision-top-left><div class = centerbox><div class = fixation>'],['</div></div></div><div class = decision-top-right></div><div class = decision-bottom-right></div><div class = decision-bottom-left></div></div>']],
				   [['<div class = bigbox><div class = decision-top-left></div><div class = decision-top-right><div class = centerbox><div class = fixation>'],['</div></div></div><div class = decision-bottom-right></div><div class = decision-bottom-left></div></div>']],
				   [['<div class = bigbox><div class = decision-top-left></div><div class = decision-top-right></div><div class = decision-bottom-right><div class = centerbox><div class = fixation>'],['</div></div></div><div class = decision-bottom-left></div></div>']],
				   [['<div class = bigbox><div class = decision-top-left></div><div class = decision-top-right></div><div class = decision-bottom-right></div><div class = decision-bottom-left><div class = centerbox><div class = fixation>'],['</div></div></div></div>']]]



/* ************************************ */
/*        Set up jsPsych blocks         */
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
  data: {
    trial_id: "end",
    exp_id: 'stop_signal_with_two_by_two'
  },
  text: '<div class = centerbox><p class = center-block-text>Thanks for completing this task!</p><p class = center-block-text>Press <i>enter</i> to continue.</p></div>',
  cont_key: [13],
  timing_response: 180000,
  on_finish: function(){
  	assessPerformance()
  	evalAttentionChecks()
  }
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
			'<p class = block-text>In this task, you will see a letter moving clockwise through the screen on every trial.</p>'+
			'<p class = block-text>You will be asked to match the current letter, to the letter that appeared either 1 or 2 trials ago depending on if the letter was on the top or bottom quadrants.</p> '+
			'<p class = block-text>When in the top two quadrants, do a '+predictive_dimensions[0][0]+'. Please respond if the current letter was the same as the letter that occurred '+predictive_dimensions[0][1]+' trial(s) ago.</p> '+
			'<p class = block-text>When in the bottom two quadrants, do a '+predictive_dimensions[2][0]+'.   Please respond if the current letter was the same as the letter that occurred '+predictive_dimensions[2][1]+' trial(s) ago.</p> '+
			'<p class = block-text>Press the '+possible_responses[0][0]+' if the current letter matches the letter 1 or 2 trials ago, and the '+possible_responses[1][0]+' if they mismatch.</p> '+
			'<p class = block-text>Capitalization does not matter, so "T" matches with "t".</p> '+
			'<p class = block-text>We will start practice when you finish instructions. Your delay for practice is 1. Please make sure you understand the instructions before moving on. You will be given a reminder of the rules for practice. <i>This will be removed for test!</i></p>'+
		'</div>',
		/*
		'<div class = centerbox>'+
			'<p class = block-text>For example, if you were asked to do (implicitly, through the quadrants) a 1-back, 1-back, 2-back, 2-back and the letters you received for each of those tasks were V, B, v, V, you would respond, no match, no match, match, and no match.</p> '+
			'<p class = block-text>The first letter in that sequence, V, DOES NOT have a preceding trial to match with, so press the '+possible_responses[1][0]+' on those trials.</p> '+
			'<p class = block-text>The second letter in that sequence, B, DOES NOT match the letter from trial 1 ago, V, so you would respond mismatch.</p>'+
			'<p class = block-text>The third letter in that sequence, v, DOES match the letter from trials 2 ago, V, so you would respond match.</p>'+
			'<p class = block-text>The fourth letter in that sequence, V, DOES NOT match the letter from trials 2 ago, B, so you would respond mismatch.</p>'+
			'<p class = block-text>We will start with practice after you finish the instructions. Please ensure that you understand the instructions before you move on.</p>'+
		'</div>'*/
	],
	allow_keys: false,
	show_clickable_nav: true,
	timing_post_trial: 1000
};



/* This function defines stopping criteria */

var instruction_node = {
	timeline: [feedback_instruct_block, instructions_block],
	
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

var start_control_block = {
	type: 'poldrack-text',
	data: {
		trial_id: "instruction"
	},
	timing_response: 180000,
	text: '<div class = centerbox>'+
			'<p class = block-text>For this block of trials, you do not have to match letters.  Instead, indicate whether the current letter is a T (or t) or any other letter other than T (or t) depending on which quadrant the letter is in.</p>'+
			'<p class = block-text>When in the top two quadrants, respond if the current letter was a '+predictive_dimensions_list_control_trials[0][0]+'. Press the '+possible_responses[0][0]+' if the current letter was a '+predictive_dimensions_list_control_trials[0][0]+' and the '+possible_responses[1][0]+' if not.</p> '+
			'<p class = block-text>When in the bottom two quadrants, respond if the current letter was a '+predictive_dimensions_list_control_trials[0][2]+'. Press the '+possible_responses[0][0]+' if the current letter was a '+predictive_dimensions_list_control_trials[0][2]+' and the '+possible_responses[1][0]+' if not.</p> '+	
			'<p class = block-text>You will no longer receive the rule prompt, so remember the instructions before you continue. Press Enter to begin.</p>'+
		 '</div>',
	cont_key: [13],
	timing_post_trial: 1000,
	on_finish: function(){
		feedback_text = "We will now start this block. Press enter to begin."
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
			'<p class = block-text>You will be asked to match the current letter, to the letter that appeared either 1 or 2 trials ago depending on if the letter was on the top or bottom quadrants.</p> '+
			'<p class = block-text>When in the top two quadrants, do a '+predictive_dimensions[0][0]+'. Please respond if the current letter was the same as the letter that occurred '+predictive_dimensions[0][1]+' trial(s) ago.</p> '+
			'<p class = block-text>When in the bottom two quadrants, do a '+predictive_dimensions[2][0]+'.   Please respond if the current letter was the same as the letter that occurred '+predictive_dimensions[2][1]+' trial(s) ago.</p> '+
			'<p class = block-text>Press the '+possible_responses[0][0]+' if the current letter matches the letter 1 or 2 trials ago, and the '+possible_responses[1][0]+' if they mismatch.</p> '+
			'<p class = block-text>Capitalization does not matter, so "T" matches with "t".</p> '+
	
			'<p class = block-text>You will no longer receive the rule prompt, so remember the instructions before you continue. Press Enter to begin.</p>'+
		 '</div>',
	cont_key: [13],
	timing_post_trial: 1000,
	on_finish: function(){
		feedback_text = "We will now start the test portion. Press enter to begin."
	}
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



var feedback_text = 
'Welcome to the experiment. This experiment will take less than 30 minutes. Press <i>enter</i> to begin.'
var feedback_block = {
	type: 'poldrack-single-stim',
	data: {
		exp_id: "n_back_with_predictive_task_switching",
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


/* ************************************ */
/*        Set up timeline blocks        */
/* ************************************ */

var control_before = Math.round(Math.random()) //0 control comes before test, 1, after

var controlTrials = []
controlTrials.push(feedback_block)
for (i = 0; i < numTrialsPerBlock + 1; i++) {
	
	var control_block = {
		type: 'poldrack-single-stim',
		stimulus: getControlStim,
		is_html: true,
		data: {
			"trial_id": "control_trial",
		},
		choices: [possible_responses[0][1],possible_responses[1][1]],
		timing_stim: 2000, //2000
		timing_response: 2000, //2000
		timing_post_trial: 0,
		response_ends_trial: false,
		on_finish: appendData
	}
	//controlTrials.push(fixation_block)
	controlTrials.push(control_block)
}

var controlCount = 0
var controlNode = {
	timeline: controlTrials,
	loop_function: function(data) {
		controlCount += 1
		stims = createTrialTypes(numTrialsPerBlock)
		current_trial = 0
	
		var sum_rt = 0
		var sum_responses = 0
		var correct = 0
		var total_trials = 0
	
		for (var i = 0; i < data.length; i++){
			if (data[i].trial_id == "control_trial"){
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

		if (controlCount == 1){
			feedback_text +=
					'</p><p class = block-text>Done with this block. Press Enter to continue.' 
			stims = createTrialTypes(numTrialsPerBlock)
			return false
	
		} 
	}
}

var practiceTrials = []
practiceTrials.push(feedback_block)
practiceTrials.push(instructions_block)
for (i = 0; i < practice_len + 2; i++) {
	
	var practice_block = {
		type: 'poldrack-categorize',
		stimulus: getStim,
		is_html: true,
		choices: [possible_responses[0][1],possible_responses[1][1]],
		key_answer: getResponse,
		data: {
			trial_id: "practice_trial"
			},
		correct_text: '<div class = fb_box><div class = center-text><font size = 20>Correct!</font></div></div>'+ prompt_text,
		incorrect_text: '<div class = fb_box><div class = center-text><font size = 20>Incorrect</font></div></div>'+ prompt_text,
		timeout_message: '<div class = fb_box><div class = center-text><font size = 20>Respond Faster!</font></div></div>'+ prompt_text,
		timing_stim: 1000, //2000
		timing_response: 2000,
		timing_feedback: 500, //500
		show_stim_with_feedback: false,
		timing_post_trial: 0,
		on_finish: appendData,
		prompt: prompt_text
	}
	//practiceTrials.push(fixation_block)
	practiceTrials.push(practice_block)
}

var practiceCount = 0
var practiceNode = {
	timeline: practiceTrials,
	loop_function: function(data) {
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
for (i = 0; i < numTrialsPerBlock + 2; i++) {
	
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
			stims = createTrialTypes(numTrialsPerBlock)
			return false
		} else {
		
			return true
		}
	
	}
}


/* ************************************ */
/*          Set up Experiment           */
/* ************************************ */

var n_back_with_predictive_task_switching_experiment = []

//n_back_with_predictive_task_switching_experiment.push(instruction_node);
n_back_with_predictive_task_switching_experiment.push(practiceNode);
n_back_with_predictive_task_switching_experiment.push(feedback_block);

/*
if (control_before == 0){
	n_back_with_predictive_task_switching_experiment.push(start_control_block);
	n_back_with_predictive_task_switching_experiment.push(controlNode);
}
*/

n_back_with_predictive_task_switching_experiment.push(start_test_block);
n_back_with_predictive_task_switching_experiment.push(testNode);
n_back_with_predictive_task_switching_experiment.push(feedback_block);

/*
if (control_before == 1){
	n_back_with_predictive_task_switching_experiment.push(start_control_block);
	n_back_with_predictive_task_switching_experiment.push(controlNode);
}
*/
n_back_with_predictive_task_switching_experiment.push(post_task_block);
n_back_with_predictive_task_switching_experiment.push(end_block);
