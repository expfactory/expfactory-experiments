/* ************************************ */
/*       Define Helper Functions        */
/* ************************************ */

function getDisplayElement() {
    $('<div class = display_stage_background></div>').appendTo('body')
    return $('<div class = display_stage></div>').appendTo('body')
}

function addID() {
  jsPsych.data.addDataToLastTrial({exp_id: 'n_back_with_directed_forgetting'})
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

var createTrialTypes = function(numTrialsPerBlock, delay){	
	
	first_stims = []
	for (var i = 0; i < 3; i++){
		directed_forgetting_condition = 'remember'
		if (i < delay){
			n_back_condition = 'N/A'
		} else {
			n_back_condition = n_back_conditions[Math.floor(Math.random() * 2)]
		}
		probe = randomDraw(letters)
		correct_response = possible_responses[1][1]
		if (n_back_condition == 'match'){
			correct_response = possible_responses[0][1]
			probe = randomDraw([first_stims[i - delay].probe.toUpperCase(), first_stims[i - delay].probe.toLowerCase()])
		} else if (n_back_condition == "mismatch"){
			probe = randomDraw('bBdDgGtTvV'.split("").filter(function(y) {return $.inArray(y, [first_stims[i - delay].probe.toLowerCase(), first_stims[i - delay].probe.toUpperCase()]) == -1}))
			correct_response = possible_responses[1][1]
		}
	
		first_stim = {
			n_back_condition: n_back_condition,
			directed_forgetting_condition: directed_forgetting_condition,
			probe: probe,
			correct_response: correct_response,
			delay: delay,
		}

		first_stims.push(first_stim)
	}
	
	stims = []
	
	for(var numIterations = 0; numIterations < numTrialsPerBlock/10; numIterations++){
		for (var numNBackConds = 0; numNBackConds < n_back_conditions.length; numNBackConds++){
			for (var numShapeConds = 0; numShapeConds < directed_forgetting_conditions.length; numShapeConds++){
			
				directed_forgetting_condition = directed_forgetting_conditions[numShapeConds]
				n_back_condition = n_back_conditions[numNBackConds]
				
				stim = {
					directed_forgetting_condition: directed_forgetting_condition,
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
	remember_letters = []
	for (var i = 0; i < stim_len; i++){
		if (i < 3){
			stim = stims.shift()
			n_back_condition = stim.n_back_condition
			directed_forgetting_condition = stim.directed_forgetting_condition
			probe = stim.probe
			correct_response = stim.correct_response
			delay = stim.delay
			remember_letters.push(probe)
			
	
		} else {
			stim = stims.shift()
			n_back_condition = stim.n_back_condition
			directed_forgetting_condition = stim.directed_forgetting_condition
			
			if (n_back_condition == "match"){
				probe = randomDraw([remember_letters[remember_letters.length - delay].toLowerCase(), remember_letters[remember_letters.length - delay].toUpperCase()])
				correct_response = possible_responses[0][1]
			} else if (n_back_condition == "mismatch"){
				probe = randomDraw('bBdDgGtTvV'.split("").filter(function(y) {return $.inArray(y, [remember_letters[remember_letters.length - delay].toLowerCase(), remember_letters[remember_letters.length - delay].toUpperCase()]) == -1}))
				correct_response = possible_responses[1][1]
	
			}
			
			if (directed_forgetting_condition == 'remember'){
				remember_letters.push(probe)
			}
			
		}
		
		stim = {
			n_back_condition: n_back_condition,
			directed_forgetting_condition: directed_forgetting_condition,
			probe: probe,
			correct_response: correct_response,
			delay: delay,
		}
		
		new_stims.push(stim)
	}
	return new_stims
}


var getStim = function(){	
		
	return '<div class = bigbox><div class = centerbox>'+
		
			'<div class = cue-text><font size="10">'+probe+'</font></div>'+
		   
		   '</div></div>'
	
}

var getCueStim = function(){
	stim = stims.shift()
	n_back_condition = stim.n_back_condition
	directed_forgetting_condition = stim.directed_forgetting_condition
	probe = stim.probe
	correct_response = stim.correct_response
	delay = stim.delay
	
	return '<div class = bigbox><div class = centerbox><div class = cue-text><font size="10">'+directed_forgetting_condition+'</font></div></div></div>'	

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
		n_back_condition: n_back_condition,
		directed_forgetting_condition: directed_forgetting_condition,
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

var practice_len = 20 // 20 must be divisible by 10
var exp_len = 240 // must be divisible by 10
var numTrialsPerBlock = 40 // 54 must be divisible by 10 and we need to have a multiple of 3 blocks (3,6,9) in order to have equal delays across blocks
var numTestBlocks = exp_len / numTrialsPerBlock
var practice_thresh = 3 // 3 blocks of practice trials

var accuracy_thresh = 0.70
var missed_thresh = 0.10

var delays = jsPsych.randomization.repeat([1, 2, 3], numTestBlocks / 3)
var delay = 1

var pathSource = "/static/experiments/n_back_with_directed_forgetting/images/"
var fileTypePNG = ".png'></img>"
var preFileType = "<img class = center src='/static/experiments/n_back_with_directed_forgetting/images/"



var n_back_conditions = ['match','mismatch','mismatch','mismatch','mismatch']
var directed_forgetting_conditions = jsPsych.randomization.repeat(['forget','remember'],1)
var possible_responses = [['M Key', 77],['Z Key', 90]]
							 
var letters = 'bBdDgGtTvV'.split("")
							 

var prompt_text_list = '<ul list-text>'+
						'<li>Match the current letter to the letter that appeared '+delay+' trial(s) ago.</li>' +
						'<li>Press the '+possible_responses[0][0]+' if the letters match.</li>' +
						'<li>Press the '+possible_responses[1][0]+'. if they mismatch.</li>' +
					  '</ul>'
					  
var prompt_text = '<div class = prompt_box>'+
					  '<p class = center-block-text style = "font-size:16px; line-height:80%%;">Match the current letter to the letter that appeared '+delay+' trial(s) ago.</p>' +
					  '<p class = center-block-text style = "font-size:16px; line-height:80%%;">Press the '+possible_responses[0][0]+' if the letters match.</p>' +
					  '<p class = center-block-text style = "font-size:16px; line-height:80%%;">Press the '+possible_responses[1][0]+'. if they mismatch.</p>' +
				  '</div>'
				  
var current_trial = 0
var current_block = 0
/* ************************************ */
/*          Define Game Boards          */
/* ************************************ */

var task_boards = [['<div class = bigbox><div class = centerbox><div class = cue-text><font size="10">'],['</font></div></div></div>']]



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
			'<p class = block-text style="font-size:20px">In this task, you will see a cue, either remember or forget, followed by a letter on every trial.</p>'+
			'<p class = block-text style="font-size:20px">If you saw a remember cue, please add the subsequent letter to your memory set (set of letters to remember).</p>'+
			'<p class = block-text style="font-size:20px">If you saw a forget cue, you should not add the subsequent letter to your memory set.</p>'+
		'</div>',	
		
		'<div class = centerbox>'+
			'<p class = block-text style="font-size:20px">You will be given a delay for every block of trials, either 1, 2, or 3. This delay tells you how many letters to remember in your memory set. So for example, if your delay was 2, you should remember the last 2 letters that appeared after a remember cue.</p>'+
			'<p class = block-text style="font-size:20px">Once your memory set is 1, 2, or 3 long, depending on delay, remove the earlier letters to add new letters. <i>Do this only for the letters that come after a "remember" cue!</i></p>'+
			'<p class = block-text style="font-size:20px">Upon the presentation of the letter on every trial, please respond whether the current letter matches the letter that occurred 2  (delay) trials ago <i>in your memory set.</i></p>'+
			'<p class = block-text style="font-size:20px">Press the '+possible_responses[0][0]+' if the letters match, and the '+possible_responses[1][0]+' if they mismatch.</p>'+
			'<p class = block-text style="font-size:20px">Capitalization does not matter, so "T" matches with "t".</p> '+
			'<p class = block-text style="font-size:20px">We will start practice when you finish instructions. Your delay for practice is 1. Please make sure you understand the instructions before moving on. You will be given a reminder of the rules for practice. <i>This will be removed for test!</i></p>'+
		'</div>'
		/*
		'<div class = centerbox>'+
			'<p class = block-text style="font-size:20px">For example, if your delay for the block was 2, and the cues that you received were remember, remember, forget, and remember, and the letters you received following each of those cues were V, B, v, and V, you would respond, no match, no match, match, and match.</p> '+
			'<p class = block-text style="font-size:20px">The first letter in that sequence, V, DOES NOT have a trial in your memory set to match with, so press the '+possible_responses[1][0]+' on those trials.  However, the cue that came before this letter was remember, so add this letter to your memory set, which now has length of 1, and contains the letter ["V"].</p> '+
			'<p class = block-text style="font-size:20px">The second letter in that sequence, B, ALSO DOES NOT have a trial 2 ago in your memory set to match with, so press the '+possible_responses[1][0]+' on those trials. However, you should add this letter to your memory set since it came after a "remember" cue.  Your memory set now has length of 2, and contains ["V", "B"].</p>'+
			'<p class = block-text style="font-size:20px">The third letter in that sequence, v, DOES match the letter from 2 trials in your memory set ["V","B"], V, so you would respond match.  However, this letter came after the forget cue, so you should NOT add this to your memory set.  Your memory set is still ["V" , "B"].</p>'+
			'<p class = block-text style="font-size:20px">The fourth letter in that sequence, V, DOES match the letter from 2 trials ago in your memory set, V, so you would respond match.  You should add this letter to your memory set, and remove the earlier letter since you need only keep 2 (delay) letters in your memory set.  Your memory set is now ["B", V"]</p>'+
			'<p class = block-text>We will start practice when you finish instructions. Your delay for practice is 1. Please make sure you understand the instructions before moving on. You will be given a reminder of the rules for practice. <i>This will be removed for test!</i></p>'+
		'</div>'
		*/
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
			'<p class = block-text>We will now start the test portion</p>'+
			
			'<p class = block-text style="font-size:20px">In this task, you will see a cue, either remember or forget, followed by a letter on every trial.</p>'+
			'<p class = block-text style="font-size:20px">If you saw a remember cue, please add the subsequent letter to your memory set (set of letters to remember).</p>'+
			'<p class = block-text style="font-size:20px">If you saw a forget cue, you should not add the subsequent letter to your memory set.</p>'+
			'<p class = block-text style="font-size:20px">You will be given a delay for every block of trials, either 1, 2, or 3. This delay tells you how many letters to remember in your memory set. So for example, if your delay was 2, you should remember the last 2 letters that appeared after a remember cue.</p>'+
			'<p class = block-text style="font-size:20px">Once your memory set is 1, 2, or 3 long, depending on delay, remove the earlier letters to add new letters. <i>Do this only for the letters that come after a "remember" cue!</i></p>'+
			'<p class = block-text style="font-size:20px">Upon the presentation of the letter on every trial, please respond whether the current letter matches the letter that occurred 2  (delay) trials ago <i>in your memory set.</i></p>'+
			'<p class = block-text style="font-size:20px">Press the '+possible_responses[0][0]+' if the letters match, and the '+possible_responses[1][0]+' if they mismatch.</p>'+
			'<p class = block-text style="font-size:20px">Capitalization does not matter, so "T" matches with "t". <i>You will be given your delay for the block on the following page.</i></p> '+
				
			'<p class = block-text>Press Enter to continue.</p>'+
		 '</div>',
	cont_key: [13],
	timing_post_trial: 1000,
	on_finish: function(){
		feedback_text = "Your delay for this block is "+delay+". Please match the current letter to the letter that appeared "+delay+" trial(s) ago <i>in your memory set</i>. Press enter to begin."
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
		exp_id: "n_back_with_directed_forgetting",
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
	var cue_block = {
		type: 'poldrack-single-stim',
		stimulus: getCueStim,
		is_html: true,
		data: {
			trial_id: "practice_cue",
		},
		choices: false,
		timing_post_trial: 0,
		timing_stim: 1000, //1000
		timing_response: 1000,
		prompt: prompt_text
	};
	
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
		timing_feedback_duration: 500, //500
		show_stim_with_feedback: false,
		timing_post_trial: 0,
		on_finish: appendData,
		prompt: prompt_text
	}
	//practiceTrials.push(fixation_block)
	practiceTrials.push(cue_block)
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
			delay = delays.pop()
			stims = createTrialTypes(numTrialsPerBlock, delay)
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
					delay = delays.pop()
					stims = createTrialTypes(numTrialsPerBlock, delay)
					return false
			}
			
			feedback_text +=
				'</p><p class = block-text>Redoing this practice. Press Enter to continue.' 
			stims = createTrialTypes(practice_len, delay)
			return true
		
		}
		
	}
}

var testTrials = []
testTrials.push(feedback_block)
testTrials.push(attention_node)
for (i = 0; i < numTrialsPerBlock + 3; i++) {
	var cue_block = {
		type: 'poldrack-single-stim',
		stimulus: getCueStim,
		is_html: true,
		data: {
			trial_id: "test_cue",
		},
		choices: false,
		timing_post_trial: 0,
		timing_stim: 1000, //1000
		timing_response: 1000
	};
	
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
	testTrials.push(cue_block)
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

var n_back_with_directed_forgetting_experiment = []

n_back_with_directed_forgetting_experiment.push(practiceNode);
n_back_with_directed_forgetting_experiment.push(feedback_block);

n_back_with_directed_forgetting_experiment.push(start_test_block);
n_back_with_directed_forgetting_experiment.push(testNode);
n_back_with_directed_forgetting_experiment.push(feedback_block);

n_back_with_directed_forgetting_experiment.push(post_task_block);
n_back_with_directed_forgetting_experiment.push(end_block);
