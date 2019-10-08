/* ************************************ */
/*       Define Helper Functions        */
/* ************************************ */

function getDisplayElement() {
    $('<div class = display_stage_background></div>').appendTo('body')
    return $('<div class = display_stage></div>').appendTo('body')
}

function addID() {
  jsPsych.data.addDataToLastTrial({exp_id: 'n_back_with_shape_matching'})
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
		choice_counts[possible_responses[k][1]] = 0
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


var createTrialTypes = function(numTrialsPerBlock, delay){
	first_stims = []
	for (var i = 0; i < 3; i++){ // i can now take 0, 1, or 2 as its value. This's because there can be three possible first trials that have no previous match (i.e. delay = 1, 2, or 3).
		if (i < delay){
			n_back_condition = 'N/A' //if this is 'mismatch' (i.e. exactly as one of the two possible n_back_condition), the script will break.
		} else {
			n_back_condition = n_back_conditions[Math.floor(Math.random() * 5)] //No idea why this was originally *2. There're 5 conds/elements in n_back_conditions; so, Math.random() should pick from 0-5
		}
		shape_matching_condition = jsPsych.randomization.repeat(['match','mismatch'],1).pop()
		probe = randomDraw(letters)
		correct_response = possible_responses[1][1]
		if (n_back_condition == 'match'){
			correct_response = possible_responses[0][1]
			probe = randomDraw([first_stims[i - delay].probe.toUpperCase(), first_stims[i - delay].probe.toLowerCase()])
		} else if (n_back_condition == "mismatch"){
			probe = randomDraw('bBdDgGtTvV'.split("").filter(function(y) {return $.inArray(y, [first_stims[i - delay].probe.toLowerCase(), first_stims[i - delay].probe.toUpperCase()]) == -1}))
			correct_response = possible_responses[1][1]
	
		}
		
		if (shape_matching_condition == 'match'){
			distractor = probe
		} else if (shape_matching_condition == 'mismatch'){
			distractor = randomDraw('bBdDgGtTvV'.split("").filter(function(y) {return $.inArray(y, [probe.toLowerCase(), probe.toUpperCase()]) == -1}))
		}
		
		first_stim = {
			n_back_condition: n_back_condition,
			shape_matching_condition: shape_matching_condition,
			probe: probe,
			correct_response: correct_response,
			delay: delay,
			distractor: distractor
		}	
		first_stims.push(first_stim)	
	}
	
	stims = []
		
	for(var numIterations = 0; numIterations < numTrialsPerBlock/(n_back_conditions.length*shape_matching_conditions.length); numIterations++){
		for (var numNBackConds = 0; numNBackConds < n_back_conditions.length; numNBackConds++){
			for (var numShapeConds = 0; numShapeConds < shape_matching_conditions.length; numShapeConds++){
			
				shape_matching_condition = shape_matching_conditions[numShapeConds]
				n_back_condition = n_back_conditions[numNBackConds]
				
				stim = {
					shape_matching_condition: shape_matching_condition,
					n_back_condition: n_back_condition
					}
			
				stims.push(stim)
			}
		}
	}
	
	stims = jsPsych.randomization.repeat(stims,1)
	stims = first_stims.concat(stims)
	
	stim_len = stims.length
	
	new_stims = []
	for (i = 0; i < stim_len; i++){
		if (i < 3){ //meaning only the first_stims
			stim = stims.shift() //stim. now has the properties from first_stims
			n_back_condition = stim.n_back_condition
			shape_matching_condition = stim.shape_matching_condition
			probe = stim.probe
			correct_response = stim.correct_response
			delay = stim.delay
			distractor = stim.distractor
		} else {
			stim = stims.shift()
			n_back_condition = stim.n_back_condition
			shape_matching_condition = stim.shape_matching_condition
		
			if (n_back_condition == "match"){
				probe = randomDraw([new_stims[i - delay].probe.toUpperCase(), new_stims[i - delay].probe.toLowerCase()])
				correct_response = possible_responses[0][1]
			} else if (n_back_condition == "mismatch"){
				probe = randomDraw('bBdDgGtTvV'.split("").filter(function(y) {return $.inArray(y, [new_stims[i - delay].probe.toLowerCase(), new_stims[i - delay].probe.toUpperCase()]) == -1}))
				correct_response = possible_responses[1][1]
			}
			
			if (shape_matching_condition == 'match'){
				distractor = probe
			} else if (shape_matching_condition == 'mismatch'){
				distractor = randomDraw('bBdDgGtTvV'.split("").filter(function(y) {return $.inArray(y, [probe.toLowerCase(), probe.toUpperCase()]) == -1}))
			}
		}
		
		stim = {
			n_back_condition: n_back_condition,
			shape_matching_condition: shape_matching_condition,
			probe: probe,
			correct_response: correct_response,
			delay: delay,
			distractor: distractor
		}
		
		new_stims.push(stim)
	}
	return new_stims
}


var getStim = function(){	
	stim = stims.shift()
	n_back_condition = stim.n_back_condition
	shape_matching_condition = stim.shape_matching_condition
	probe = stim.probe
	correct_response = stim.correct_response
	delay = stim.delay
	distractor = stim.distractor
	
	if (probe == probe.toUpperCase()) {
	 letter_case = 'uppercase'
	} else if (probe == probe.toLowerCase()) {
	 letter_case = 'lowercase'
	}
	
	if (distractor == distractor.toUpperCase()) {
	 letter_case_distractor = 'uppercase'
	} else if (distractor == distractor.toLowerCase()) {
	 letter_case_distractor = 'lowercase'
	}
		
	return '<div class = bigbox><div class = centerbox>'+
	
			'<div class = distractor-text><div class = cue-text>'+preFileTypeDistractor  + 'red_' + letter_case_distractor + '_' + distractor.toUpperCase() + fileTypePNG+'</div></div>'+
	
			'<div class = gng_number><div class = cue-text>'+preFileType  + letter_case + '_' + probe.toUpperCase() + fileTypePNG+'</div></div>'+
		   
		   '</div></div>'
	
}

// var getControlStim = function(){	
// 	stim = control_stims.shift()
// 	n_back_condition = stim.n_back_condition
// 	shape_matching_condition = stim.shape_matching_condition
// 	probe = stim.probe
// 	correct_response = stim.correct_response
// 	distractor = stim.distractor
		
// 	return '<div class = bigbox><div class = centerbox>'+
	
// 			'<div class = distractor-text><font color="red">'+distractor+'</font></div>'+
	
// 			'<div class = cue-text>'+probe+'</div>'+
		   
// 		   '</div></div>'
	
// }



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
		n_back_condition: n_back_condition,
		shape_matching_condition: shape_matching_condition,
		probe: probe,
		distractor: distractor,
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


var practice_len = 20 // 20 must be divisible by 10
var exp_len = 240 // must be divisible by 10
var numTrialsPerBlock = 40 // 40 must be divisible by 10 and we need to have a multiple of 3 blocks (3,6,9) in order to have equal delays across blocks
var numTestBlocks = exp_len / numTrialsPerBlock //must be a multiple of 3 to have equal # of delays
var practice_thresh = 3 // 3 blocks of 10 trials

var accuracy_thresh = 0.75
var rt_thresh = 1000
var missed_thresh = 0.10

var delays = jsPsych.randomization.repeat([1, 2, 3], numTestBlocks / 3)

var delay = 1

var pathSource = "/static/experiments/n_back_with_shape_matching/images/"
var fileTypePNG = ".png'></img>"
var preFileType = "<img class = center src='/static/experiments/n_back_with_shape_matching/images/"
var preFileTypeDistractor = "<img class = distractor src='/static/experiments/n_back_with_shape_matching/images/"



var n_back_conditions = ['match','mismatch','mismatch','mismatch','mismatch']
var shape_matching_conditions = jsPsych.randomization.repeat(['match','mismatch'],1)
//var shape_matching_conditions_control = jsPsych.randomization.repeat(['match','mismatch'],1)
var possible_responses = [['M Key', 77],['Z Key', 90]]
							 
var letters = 'bBdDgGtTvV'.split("")
							 



var prompt_text_list = '<ul style="text-align:left;">'+
						'<li>Match the current WHITE letter to the WHITE letter that appeared some number of trials ago</li>' +
						'<li>If they match, press the '+possible_responses[0][0]+'</li>' +
					    '<li>If they mismatch, press the '+possible_responses[1][0]+'</li>' +
					  '</ul>'

var prompt_text = '<div class = prompt_box>'+
					  '<p class = center-block-text style = "font-size:16px; line-height:80%%;">Match the current WHITE letter to the WHITE letter that appeared 1 trial ago</p>' +
					  '<p class = center-block-text style = "font-size:16px; line-height:80%%;">If they match, press the '+possible_responses[0][0]+'</p>' +
					  '<p class = center-block-text style = "font-size:16px; line-height:80%%;">If they mismatch, press the '+possible_responses[1][0]+'</p>' +
				  '</div>'


var current_trial = 0
var current_block = 0

//PRE LOAD IMAGES HERE
var lettersPreload = ['B','D','G','T','V']
var casePreload = ['lowercase','uppercase']
var pathSource = "/static/experiments/n_back_with_shape_matching/images/"
var images = []

for(i = 0; i < lettersPreload.length; i++){
	for (y = 0; y < casePreload.length; y++){
		images.push(pathSource + casePreload[y] + '_' + lettersPreload[i] + '.png')
	}
}

for(i = 0; i < lettersPreload.length; i++){
	for (y = 0; y < casePreload.length; y++){
		images.push(pathSource + 'red_' + casePreload[y] + '_' + lettersPreload[i] + '.png')
	}
}
jsPsych.pluginAPI.preloadImages(images);
/* ************************************ */
/*          Define Game Boards          */
/* ************************************ */

var task_boards = [['<div class = bigbox><div class = centerbox><div class = fixation>'],['</div></div></div>']]

var stims = createTrialTypes(practice_len, delay)

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
       exp_id: "n_back_with_shape_matching",
       trial_id: "post task questions"
   },
   questions: ['<p class = center-block-text style = "font-size: 20px">Please summarize what you were asked to do in this task.</p>',
              '<p class = center-block-text style = "font-size: 20px">Do you have any comments about this task?</p>'],
   rows: [15, 15],
   columns: [60,60],
   timing_response: 360000
};


var end_block = {
  type: 'poldrack-text',
  data: {
    trial_id: "end",
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
	'Welcome to the experiment. This experiment will take about 10 minutes. Press <i>enter</i> to begin.'
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
			'<p class = block-text>In this task, you will see a white letter with an overlapping red letter on every trial.</p>'+
			'<p class = block-text>You will be asked to match the current white letter to the white letter that appeared either 1, 2, 3 trials ago depending on the delay given to you for that block.</p>'+
			'<p class = block-text>Press the '+possible_responses[0][0]+' if the white letters match, and the '+possible_responses[1][0]+' if they mismatch.</p>'+
			'<p class = block-text>Your delay (the number of trials ago which you must match the current letter to) will change from block to block. You will be given the delay at the start of every block of trials.</p>'+
			'<p class = block-text>Ignore the red letter, focus only on the white letter.</p>'+
			'<p class = block-text>Capitalization does not matter, so "T" matches with "t".</p> '+
			'<p class = block-text>We will start practice when you finish instructions. Your delay for practice is 1. Please make sure you understand the instructions before moving on. You will be given a reminder of the rules for practice. <i>This will be removed for test!</i></p>'+
			'<p class = block-text>To avoid technical issues, please keep the experiment tab (on Chrome or Firefox) <i>active and in full-screen mode</i> for the whole duration of each task.</p>'+
		'</div>',
		
		/*
		'<div class = centerbox>'+
			'<p class = block-text>For example, if your delay for the block was 2, and the WHITE letters you received for the first 4 trials were V, B, v, and V, you would respond, no match, no match, match, and no match.</p> '+
			'<p class = block-text>The first letter in that sequence, V, DOES NOT have a preceding trial to match with, so press the '+possible_responses[1][0]+' on those trials.</p> '+
			'<p class = block-text>The second letter in that sequence, B, ALSO DOES NOT have a trial 2 ago to match with, so press the '+possible_responses[1][0]+' on those trials.</p>'+
			'<p class = block-text>The third letter in that sequence, v, DOES match the letter from 2 trials, V, so you would respond match.</p>'+
			'<p class = block-text>The fourth letter in that sequence, V, DOES NOT match the letter from 2 trials ago, B, so you would respond no match.</p>'+
			'<p class = block-text>We will show you what a trial looks like when you finish instructions. Please make sure you understand the instructions before moving on.</p>' +
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

var start_test_block = {
	type: 'poldrack-text',
	data: {
		trial_id: "instruction"
	},
	timing_response: 180000,
	text: '<div class = centerbox>'+
			'<p class = block-text>We will now begin the test portion.</p>'+
			'<p class = block-text>You will be asked to match the current WHITE letter, to the WHITE letter that appeared either 1, 2, 3 trials ago depending on the delay given to you for that block.</p>'+
			'<p class = block-text>Press the '+possible_responses[0][0]+' if they match, and the '+possible_responses[1][0]+' if they mismatch.</p>'+
			'<p class = block-text>Your delay (the number of trials ago which you must match the current letter to) will change from block to block.</p>'+
			'<p class = block-text>Ignore the red letter, focus only on the white letter.</p>'+
			'<p class = block-text>Capitalization does not matter, so "T" matches with "t".</p> '+
				
			'<p class = block-text>You will no longer receive the rule prompt, so remember the instructions before you continue. Press Enter to begin.</p>'+
		 '</div>',
	cont_key: [13],
	timing_post_trial: 1000,
	on_finish: function(){
		feedback_text = "Your delay for this block is "+delay+". Please match the current white letter to the letter that appeared "+delay+" trial(s) ago. Press enter to begin."
	}
};

// var start_control_block = {
// 	type: 'poldrack-text',
// 	data: {
// 		trial_id: "instruction"
// 	},
// 	timing_response: 180000,
// 	text: '<div class = centerbox>'+
// 			'<p class = block-text>For this block of trials, you do not have to match letters.  Instead, indicate whether the current WHITE letter is a T (or t).</p>'+
// 			'<p class = block-text>Press the '+possible_responses[0][0]+' if the current WHITE letter was a T (or t) and the '+possible_responses[1][0]+' if not.</p> '+
// 			'<p class = block-text>You will no longer receive the rule prompt, so remember the instructions before you continue. Press Enter to begin.</p>'+
// 		 '</div>',
// 	cont_key: [13],
// 	timing_post_trial: 1000,
// 	on_finish: function(){
// 		feedback_text = "We will now start this block. Press enter to begin."
// 	}
// };

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



var feedback_text = 'Welcome to the experiment. This experiment will take about 10 minutes. Press <i>enter</i> to begin.'
var feedback_block = {
	type: 'poldrack-single-stim',
	data: {
		trial_id: "practice-no-stop-feedback"
	},
	choices: [13],
	stimulus: getFeedback,
	timing_post_trial: 0,
	is_html: true,
	timing_response: 180000,
	response_ends_trial: true, 

};


/* ************************************ */
/*        Set up timeline blocks        */
/* ************************************ */
var practiceTrials = []
practiceTrials.push(feedback_block)
practiceTrials.push(instructions_block)
for (i = 0; i < practice_len + 3; i++) {
	
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
		timing_stim: 1000, //1000
		timing_response: 2000, //2000
		timing_feedback_duration: 500,  //500
		show_stim_with_feedback: false,
		timing_post_trial: 0,
		on_finish: appendData,
		prompt: prompt_text
	}
	practiceTrials.push(practice_block)
}

var practiceCount = 0
var practiceNode = {
	timeline: practiceTrials,
	loop_function: function(data) {
		practiceCount += 1
		current_trial = 0
	
		var sum_rt = 0
		var sum_responses = 0
		var correct = 0
		var total_trials = 0
		var mismatch_press = 0
	
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
				
				if (data[i].key_press == possible_responses[1][1]){
					mismatch_press += 1
				}
		
			}
	
		}
	
		var accuracy = correct / total_trials
		var missed_responses = (total_trials - sum_responses) / total_trials
		var ave_rt = sum_rt / sum_responses
		var mismatch_press_percentage = mismatch_press / total_trials
	
		feedback_text = "<br>Please take this time to read your feedback and to take a short break! Press enter to continue"

		if (accuracy > accuracy_thresh){
			feedback_text +=
					'</p><p class = block-text>Done with this practice. Press Enter to continue.' 
			delay = delays.pop()
			stims = createTrialTypes(numTrialsPerBlock, delay)
			return false
	
		} else if (accuracy < accuracy_thresh){
			if (missed_responses > missed_thresh){
				feedback_text +=
						'</p><p class = block-text>You have not been responding to some trials.  Please respond on every trial that requires a response.'
			}

	      	if (ave_rt > rt_thresh){
	        	feedback_text += 
	            	'</p><p class = block-text>You have been responding too slowly.'
	      	}
			
			if (mismatch_press_percentage >= 0.90){
				feedback_text +=
						'</p><p class = block-text>Please do not simply press the "'+possible_responses[1][0]+'" to every stimulus. Please try to identify the matches and press the "'+possible_responses[0][0]+'" when they occur.'
			}
		
			if (practiceCount == practice_thresh){
				feedback_text +=
					'</p><p class = block-text>Done with this practice.' 
					delay = delays.pop()
					stims = createTrialTypes(numTrialsPerBlock, delay)
					return false
			}
			
			feedback_text +=
				'</p><p class = block-text>We are going to try practice again to see if you can achieve higher accuracy.  Remember: <br>' + prompt_text_list 
			
			feedback_text +=
				'</p><p class = block-text>Press Enter to continue.' 
			stims = createTrialTypes(practice_len, delay)
			return true
		
		}
		
	}
}

var testTrials = []
testTrials.push(feedback_block)
testTrials.push(attention_node)
for (i = 0; i < numTrialsPerBlock +3; i++) {
	
	var test_block = {
		type: 'poldrack-single-stim',
		stimulus: getStim,
		is_html: true,
		data: {
			"trial_id": "test_trial",
		},
		choices: [possible_responses[0][1],possible_responses[1][1]],
		timing_stim: 1000, //1000
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
	current_trial = 0
	
	var sum_rt = 0
		var sum_responses = 0
		var correct = 0
		var total_trials = 0
		var mismatch_press = 0

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
				
				if (data[i].key_press == possible_responses[1][1]){
					mismatch_press += 1
				}
			} 
		}
	
		var accuracy = correct / total_trials
		var missed_responses = (total_trials - sum_responses) / total_trials
		var ave_rt = sum_rt / sum_responses
		var mismatch_press_percentage = mismatch_press / total_trials
	
		feedback_text = "<br>Please take this time to read your feedback and to take a short break! Press enter to continue"
		feedback_text += "</p><p class = block-text>You have completed: "+testCount+" out of "+numTestBlocks+" blocks of trials."
		
		if (accuracy < accuracy_thresh){
			feedback_text +=
					'</p><p class = block-text>Your accuracy is too low.  Remember: <br>' + prompt_text_list 
		}
		if (missed_responses > missed_thresh){
			feedback_text +=
					'</p><p class = block-text>You have not been responding to some trials.  Please respond on every trial that requires a response.'
		}

      	if (ave_rt > rt_thresh){
        	feedback_text += 
            	'</p><p class = block-text>You have been responding too slowly.'
      	}
		
		if (mismatch_press_percentage >= 0.90){
			feedback_text +=
					'</p><p class = block-text>Please do not simply press the "'+possible_responses[1][0]+'" to every stimulus. Please try to identify the matches and press the "'+possible_responses[0][0]+'" when they occur.'
		}
	
		if (testCount == numTestBlocks){
			feedback_text +=
					'</p><p class = block-text>Done with this test. Press Enter to continue.<br>If you have been completing tasks continuously for an hour or more, please take a 15-minute break before starting again.'
			return false
		} else {
			delay = delays.pop()
			stims = createTrialTypes(numTrialsPerBlock, delay)
			feedback_text += "</p><p class = block-text><i>For the next round of trials, your delay is "+delay+"</i>.  Press Enter to continue."
			return true
		}
	
	}
}


/* ************************************ */
/*          Set up Experiment           */
/* ************************************ */

var n_back_with_shape_matching_experiment = []

n_back_with_shape_matching_experiment.push(practiceNode);
n_back_with_shape_matching_experiment.push(feedback_block);

n_back_with_shape_matching_experiment.push(start_test_block);
n_back_with_shape_matching_experiment.push(testNode);
n_back_with_shape_matching_experiment.push(feedback_block);

n_back_with_shape_matching_experiment.push(post_task_block);
n_back_with_shape_matching_experiment.push(end_block);
