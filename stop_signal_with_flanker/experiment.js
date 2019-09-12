/* ************************************ */
/* Define helper functions */
/* ************************************ */
function addID() {
  jsPsych.data.addDataToLastTrial({exp_id: 'stop_signal_with_flanker'})
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
	var experiment_data = jsPsych.data.getTrialsOfType('stop-signal')
	var missed_count = 0
	var trial_count = 0
	var rt_array = []
	var rt = 0
	var correct = 0
	var all_trials = 0
	
		//record choices participants made
	var choice_counts = {}
	choice_counts[-1] = 0
	choice_counts[70] = 0
	choice_counts[72] = 0
	
	for (var k = 0; k < possible_responses.length; k++) {
		choice_counts[possible_responses[k][1]] = 0
	}
	for (var i = 0; i < experiment_data.length; i++) {
		if (experiment_data[i].trial_id == 'test_trial') {
			all_trials += 1
			key = experiment_data[i].key_press
			choice_counts[key] += 1
			if (experiment_data[i].stop_signal_condition == 'go'){
				trial_count += 1
			}
			
			if ((experiment_data[i].stop_signal_condition == 'go') && (experiment_data[i].rt != -1)){
				rt = experiment_data[i].rt
				rt_array.push(rt)
				if (experiment_data[i].key_press == experiment_data[i].correct_response){
					correct += 1
				}
			} else if ((experiment_data[i].stop_signal_condition == 'stop') && (experiment_data[i].rt != -1)){
				rt = experiment_data[i].rt
				rt_array.push(rt)
			}  else if ((experiment_data[i].stop_signal_condition == 'go') && (experiment_data[i].rt == -1)){
				missed_count += 1
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
		if (choice_counts[key] > all_trials * 0.85) {
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

var getCategorizeFeedback = function(){
	curr_trial = jsPsych.progress().current_trial_global - 1
	trial_id = jsPsych.data.getDataByTrialIndex(curr_trial).trial_id
	if ((trial_id == 'practice_trial') && (jsPsych.data.getDataByTrialIndex(curr_trial).stop_signal_condition != 'stop')){
		if (jsPsych.data.getDataByTrialIndex(curr_trial).key_press == jsPsych.data.getDataByTrialIndex(curr_trial).correct_response){
			
			
			return '<div class = fb_box><div class = center-text><font size = 20>Correct!</font></div></div>' + prompt_text
		} else if ((jsPsych.data.getDataByTrialIndex(curr_trial).key_press != jsPsych.data.getDataByTrialIndex(curr_trial).correct_response) && (jsPsych.data.getDataByTrialIndex(curr_trial).key_press != -1)){
			
			
			return '<div class = fb_box><div class = center-text><font size = 20>Incorrect</font></div></div>' + prompt_text
	
		} else if (jsPsych.data.getDataByTrialIndex(curr_trial).key_press == -1){
			
			
			return '<div class = fb_box><div class = center-text><font size = 20>Respond Faster!</font></div></div>' + prompt_text
	
		}
	} else if ((trial_id == 'practice_trial') && (jsPsych.data.getDataByTrialIndex(curr_trial).stop_signal_condition == 'stop')){
		if (jsPsych.data.getDataByTrialIndex(curr_trial).rt == -1){
			return '<div class = fb_box><div class = center-text><font size = 20>Correct!</font></div></div>' + prompt_text
		} else if (jsPsych.data.getDataByTrialIndex(curr_trial).rt != -1){
			return '<div class = fb_box><div class = center-text><font size = 20>There was a star.</font></div></div>' + prompt_text
		}
	}
}

var randomDraw = function(lst) {
  var index = Math.floor(Math.random() * (lst.length))
  return lst[index]
}
							 
var createTrialTypes = function(numTrialsPerBlock){
	stop_signal_trial_types = ['go','go','stop']
	flanker_trial_types = ['H_congruent','H_incongruent','F_congruent','F_incongruent']
	flanker_letters = ['H','F']
	
	var stims = []
	for(var numIterations = 0; numIterations < numTrialsPerBlock/(flanker_trial_types.length*stop_signal_trial_types.length); numIterations++){
		for (var numFlankerConds = 0; numFlankerConds < flanker_trial_types.length; numFlankerConds++){
			for (var numstop_signalConds = 0; numstop_signalConds < stop_signal_trial_types.length; numstop_signalConds++){
			
				flanker_condition = flanker_trial_types[numFlankerConds]
				stop_signal_condition = stop_signal_trial_types[numstop_signalConds]
				center_letter = flanker_condition[0]
			
				if (stop_signal_condition == 'stop'){
					correct_response = -1
				} else if (center_letter == 'H'){
					correct_response = possible_responses[1][1]
				} else if (center_letter == 'F'){
					correct_response = possible_responses[0][1]
				}
			
				if ((flanker_condition == 'H_congruent') || (flanker_condition == 'F_incongruent')){
					flanker_letter = 'H'
				} else if ((flanker_condition == 'F_congruent') || (flanker_condition == 'H_incongruent')){
					flanker_letter = 'F'
				}
			
			
				stim = {
					stop_signal_condition: stop_signal_condition,
					flanker_condition: flanker_condition,
					correct_response: correct_response,
					center_letter: center_letter,
					flanker_letter: flanker_letter
				
					}
		
				stims.push(stim)
				
			}
		}
	}
	stims = jsPsych.randomization.repeat(stims,1)
	return stims	
}

function getSSD(){
	if ((flanker_condition == 'H_congruent') || (flanker_condition == 'F_congruent')){
		return SSD_congruent
	} else if ((flanker_condition == 'H_incongruent') || (flanker_condition == 'F_incongruent')){
		return SSD_incongruent
	}
}

function getSSType(){
	return stop_signal_condition

}

var getStopStim = function(){
	return stop_boards[0] + 
		   	preFileTypeStar + 'stopSignal' + fileTypePNG + 
		   stop_boards[1] 
}


var getStim = function(){
	stim = stims.shift()
	flanker_condition = stim.flanker_condition
	stop_signal_condition = stim.stop_signal_condition
	correct_response = stim.correct_response
	flanker_letter = stim.flanker_letter
	center_letter = stim.center_letter
	
		 	
	return flanker_boards[0]+ preFileType + flanker_letter + fileTypePNG +
		   flanker_boards[1]+ preFileType + flanker_letter + fileTypePNG +
		   flanker_boards[2]+ preFileType + center_letter + fileTypePNG +
		   flanker_boards[3]+ preFileType + flanker_letter + fileTypePNG +
		   flanker_boards[4]+ preFileType + flanker_letter + fileTypePNG
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
		flanker_condition: flanker_condition,
		stop_signal_condition: stop_signal_condition,
		correct_response: correct_response,
		flanker_letter: flanker_letter,
		center_letter: center_letter,
		current_block: current_block,
		current_trial: current_trial,
		SSD_congruent: SSD_congruent,
		SSD_incongruent: SSD_incongruent
	})
	
	
	if ((trial_id == 'test_trial') || (trial_id == 'practice_trial')){
		if ((jsPsych.data.getDataByTrialIndex(curr_trial).key_press == -1) && (jsPsych.data.getDataByTrialIndex(curr_trial).stop_signal_condition == 'stop') && (SSD_congruent < maxSSD) && ((flanker_condition == 'H_congruent') || (flanker_condition == 'F_congruent'))){
			jsPsych.data.addDataToLastTrial({stop_acc: 1})
			SSD_congruent+=50
		} else if ((jsPsych.data.getDataByTrialIndex(curr_trial).key_press != -1) && (jsPsych.data.getDataByTrialIndex(curr_trial).stop_signal_condition == 'stop') && (SSD_congruent > minSSD) && ((flanker_condition == 'H_congruent') || (flanker_condition == 'F_congruent'))){
			jsPsych.data.addDataToLastTrial({stop_acc: 0})
			SSD_congruent-=50
		}
		
		if ((jsPsych.data.getDataByTrialIndex(curr_trial).key_press == -1) && (jsPsych.data.getDataByTrialIndex(curr_trial).stop_signal_condition == 'stop') && (SSD_incongruent < maxSSD) && ((flanker_condition == 'H_incongruent') || (flanker_condition == 'F_incongruent'))){
			jsPsych.data.addDataToLastTrial({stop_acc: 1})
			SSD_incongruent+=50
		} else if ((jsPsych.data.getDataByTrialIndex(curr_trial).key_press != -1) && (jsPsych.data.getDataByTrialIndex(curr_trial).stop_signal_condition == 'stop') && (SSD_incongruent > minSSD) && ((flanker_condition == 'H_incongruent') || (flanker_condition == 'F_incongruent'))){
			jsPsych.data.addDataToLastTrial({stop_acc: 0})
			SSD_incongruent-=50
		}
		
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
var practice_len = 12 // must be divisible by 12, [3 (go,go,stop) by 2 (flanker conditions) by 2 (flanker letters h and s)]
var exp_len = 240 // must be divisible by 12
var numTrialsPerBlock = 48; // divisible by 12
var numTestBlocks = exp_len / numTrialsPerBlock

var accuracy_thresh = 0.75
var rt_thresh = 1000
var missed_thresh = 0.10
var practice_thresh = 3 // 3 blocks of 12 trials

var SSD_congruent = 350
var SSD_incongruent = 350
var maxSSD = 1000
var minSSD = 0 
var maxStopCorrect = 0.70
var minStopCorrect = 0.30

var maxStopCorrectPractice = 1
var minStopCorrectPractice = 0

 
var possible_responses = [['F Key', 70],['H Key', 72]]


var current_trial = 0
var current_block = 0

var fileTypePNG = '.png"></img>'
var preFileType = '<img class = center src="/static/experiments/stop_signal_with_flanker/images/'
var preFileTypeStar = '<img class = star src="/static/experiments/stop_signal_with_flanker/images/'

var stop_boards = ['<div class = bigbox><div class = centerbox><div class = starbox>','</div></div></div>']	   
var flanker_boards = [['<div class = bigbox><div class = centerbox><div class = flankerLeft_2><div class = cue-text>'],['</div></div><div class = flankerLeft_1><div class = cue-text>'],['</div></div><div class = flankerMiddle><div class = cue-text>'],['</div></div><div class = flankerRight_1><div class = cue-text>'],['</div></div><div class = flankerRight_2><div class = cue-text>'],['</div></div></div></div>']]					   
		

var stims = createTrialTypes(practice_len)

var prompt_text = '<ul style = "text-align:left;"><font color=white>'+
					'<li>Indicate the identity of the middle letter</li>' +
					'<li>Do not respond if you see a star around the letters!</li>' +
					'<li>Do not slow down your responses to the letter to wait for the star.</li>' +
				  '</font></ul>'

var pathSource = "/static/experiments/stop_signal_with_flanker/images/"
var images = []
images.push(pathSource + 'F' + '.png')
images.push(pathSource + 'H' + '.png')
images.push(pathSource + 'stopSignal.png')
jsPsych.pluginAPI.preloadImages(images);
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
       exp_id: "stop_signal_with_flanker",
       trial_id: "post_task_questions"
   },
   questions: ['<p class = center-block-text style = "font-size: 20px">Please summarize what you were asked to do in this task.</p>',
              '<p class = center-block-text style = "font-size: 20px">Do you have any comments about this task?</p>'],
   rows: [15, 15],
   timing_response: 360000,
   columns: [60,60]
};


var feedback_text = 
	'Welcome to the experiment. This experiment will take around 10 minutes. Press <i>enter</i> to begin.'
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
	'Welcome to the experiment. This experiment will take around 10 minutes. Press <i>enter</i> to begin.'
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
			'<p class = center-block-text>In this experiment you will see a row of letters.</p> '+
				
			'<p class = center-block-text>If the middle letter is H, please press the H key.</p>'+
		
			'<p class = center-block-text>If the middle letter is F, please press the F key.</p>'+
			
			'<p class = center-block-text>Respond as quickly and accurately as possible.</p>'+
			
			'<p class = center-block-text>Please ignore the letters not in the middle.</p>'+
		'</div>',
		
		'<div class = centerbox>'+
			'<p class = block-text>On some trials, a star will appear around the letters.  The star will appear with, or shortly after the letters appear.</p>'+
			
			'<p class = block-text>If you see a star appear, please try your best to make no response on that trial.</p>'+
			
			'<p class = block-text>If the star appears on a trial, and you try your best to withhold your response, you will find that you will be able to stop sometimes but not always.</p>'+
		
			'<p class = block-text>Please do not slow down your response to the middle letter in order to wait for the star.  Continue to respond as quickly and accurately as possible.</p>'+
		'</div>',
		
		'<div class = centerbox>'+			
			'<p class = block-text>We will start practice when you finish instructions. Please make sure you understand the instructions before moving on. During practice, you will receive a reminder of the rules.  <i>This reminder will be taken out for test</i>.</p>'+

			'<p class = block-text>To avoid technical issues, please keep the experiment tab (on Chrome or Firefox) <i>active and in full-screen mode</i> for the whole duration of each task.</p>'+
		'</div>',
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
			'<p class = block-text>We will now start the test portion. In this experiment you will see a row of letters. '+
			
			'If the middle letter is H, please press the '+possible_responses[1][0]+'.  If the middle letter is F, press the '+possible_responses[0][0]+'. Respond as quickly and accurately as possible. Ignore the letters not in the middle!</p> '+
		
			'<p class = block-text>On some trials, you will see a star appear with or shortly after the letters. Do not respond if you see a star.  Do not slow down your responses to the letter in order to wait for the star.</p>'+
	
			'<p class = block-text>Press Enter to continue.</p>'+
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



var practiceTrials = []
practiceTrials.push(feedback_block)
practiceTrials.push(instructions_block)
for (i = 0; i < practice_len; i++) {
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
		prompt: prompt_text
	}
	
	var practice_block = {
		type: 'stop-signal',
		stimulus: getStim,
		SS_stimulus: getStopStim,
		SS_trial_type: getSSType, //getSSType,
		data: {
			"trial_id": "practice_trial"
		},
		is_html: true,
		choices: [possible_responses[0][1],possible_responses[1][1]],
		timing_stim: 1000,
		timing_response: 2000, //2000
		response_ends_trial: false,
		SSD: getSSD,
		timing_SS: 500, //500
		timing_post_trial: 0,
		on_finish: appendData,
		prompt: prompt_text,
		on_start: function(){
			stoppingTracker = []
			stoppingTimeTracker = []
		}
	}
	
	var categorize_block = {
		type: 'poldrack-single-stim',
		data: {
			trial_id: "practice-stop-feedback"
		},
		choices: 'none',
		stimulus: getCategorizeFeedback,
		timing_post_trial: 0,
		is_html: true,
		timing_stim: 500,
		timing_response: 500, //500
		response_ends_trial: false,

	};
	practiceTrials.push(fixation_block)
	practiceTrials.push(practice_block)
	practiceTrials.push(categorize_block)
}


var practiceCount = 0
var practiceNode = {
	timeline: practiceTrials,
	loop_function: function(data){
		practiceCount += 1
		stims = createTrialTypes(numTrialsPerBlock)
		current_trial = 0
	
		var total_trials = 0
		var sum_responses = 0
		var total_sum_rt = 0
		
		var go_trials = 0
		var go_correct = 0
		var go_rt = 0
		var sum_go_responses = 0
		
		var stop_trials = 0
		var stop_correct = 0
		var stop_rt = 0
		var sum_stop_responses = 0
		
	
		for (var i = 0; i < data.length; i++){
			if ((data[i].trial_id == "practice_trial") && (data[i].stop_signal_condition == 'go')){
				total_trials+=1
				go_trials+=1
				if (data[i].rt != -1){
					total_sum_rt += data[i].rt
					go_rt += data[i].rt
					sum_go_responses += 1
					if (data[i].key_press == data[i].correct_response){
						go_correct += 1
		
					}
				}
		
			} else if ((data[i].trial_id == "practice_trial") && (data[i].stop_signal_condition == 'stop')){
				total_trials+=1
				stop_trials+=1
				if (data[i].rt != -1){
					total_sum_rt += data[i].rt
					stop_rt += data[i].rt
					sum_stop_responses += 1
				}
				if (data[i].key_press == -1){
					stop_correct += 1
	
				}
				
			
			}
	
		}
	
		var accuracy = go_correct / go_trials
		var missed_responses = (go_trials - sum_go_responses) / go_trials
		var ave_rt = go_rt / sum_go_responses
		var stop_acc = stop_correct / stop_trials
	
		feedback_text = "<br>Please take this time to read your feedback and to take a short break! Press enter to continue."
		if (practiceCount == practice_thresh){
			feedback_text +=
				'</p><p class = block-text>Done with this practice.' 
				stims = createTrialTypes(numTrialsPerBlock)
				return false
		}
		
		if ((accuracy > accuracy_thresh) && (stop_acc < maxStopCorrectPractice) && (stop_acc > minStopCorrectPractice)){
			feedback_text +=
					'</p><p class = block-text>Done with this practice. Press Enter to continue.' 
			stims = createTrialTypes(numTrialsPerBlock)
			return false
	
		} else {
			if (accuracy < accuracy_thresh){
			feedback_text +=
					'</p><p class = block-text>We are going to try practice again to see if you can achieve higher accuracy.  Remember: <br>' + prompt_text 
			}
			if (missed_responses > missed_thresh){
			feedback_text +=
					'</p><p class = block-text>You have not been responding to some trials.  Please respond on every trial that requires a response.'
			}

	      	if (ave_rt > rt_thresh){
	        	feedback_text += 
	            	'</p><p class = block-text>You have been responding too slowly.'
	      	}
			
			if (stop_acc === maxStopCorrectPractice){
			feedback_text +=
				'</p><p class = block-text>You have been responding too slowly.  Please respond as quickly and accurately to each stimulus that requires a response.'
			
			}
			
			if (stop_acc === minStopCorrectPractice){
			feedback_text +=
				'</p><p class = block-text>You have not been stopping your response when stars are present.  Please try your best to stop your response if you see a star.'
			
			}
		
			
			feedback_text +=
				'</p><p class = block-text>Redoing this practice. Press Enter to continue.' 
			stims = createTrialTypes(practice_len)
			return true
		
		}
	
	}
	
}


var testTrials = []
testTrials.push(feedback_block)
testTrials.push(attention_node)
for (i = 0; i < numTrialsPerBlock; i++) {
	var fixation_block = {
		type: 'poldrack-single-stim',
		stimulus: '<div class = centerbox><div class = fixation>+</div></div>',
		is_html: true,
		choices: 'none',
		data: {
			trial_id: "test_fixation"
		},
		timing_response: 500, //500
		timing_post_trial: 0
	}
	
	var test_block = {
		type: 'stop-signal',
		stimulus: getStim,
		SS_stimulus: getStopStim,
		SS_trial_type: getSSType,
		data: {
			"trial_id": "test_trial"
		},
		is_html: true,
		choices: [possible_responses[0][1],possible_responses[1][1]],
		timing_stim: 1000,
		timing_response: 2000, //2000
		response_ends_trial: false,
		SSD: getSSD,
		timing_SS: 500, //500
		timing_post_trial: 0,
		on_finish: appendData,
		on_start: function(){
			stoppingTracker = []
			stoppingTimeTracker = []
		}
	}
	testTrials.push(fixation_block)
	testTrials.push(test_block)
}

var testCount = 0
var testNode = {
	timeline: testTrials,
	loop_function: function(data) {
		testCount += 1
		stims = createTrialTypes(numTrialsPerBlock)
		current_trial = 0
	
		var total_trials = 0
		var sum_responses = 0
		var total_sum_rt = 0
	
		var go_trials = 0
		var go_correct = 0
		var go_rt = 0
		var sum_go_responses = 0
	
		var stop_trials = 0
		var stop_correct = 0
		var stop_rt = 0
		var sum_stop_responses = 0
	

		for (var i = 0; i < data.length; i++){
			if ((data[i].trial_id == "test_trial") && (data[i].stop_signal_condition == 'go')){
				total_trials+=1
				go_trials+=1
				if (data[i].rt != -1){
					total_sum_rt += data[i].rt
					go_rt += data[i].rt
					sum_go_responses += 1
					if (data[i].key_press == data[i].correct_response){
						go_correct += 1
	
					}
				}
	
			} else if ((data[i].trial_id == "test_trial") && (data[i].stop_signal_condition == 'stop')){
				total_trials+=1
				stop_trials+=1
				if (data[i].rt != -1){
					total_sum_rt += data[i].rt
					stop_rt += data[i].rt
					sum_stop_responses += 1
				}
				if (data[i].key_press == -1){
					stop_correct += 1

				}		
			}
		}

		var accuracy = go_correct / go_trials
		var missed_responses = (go_trials - sum_go_responses) / go_trials
		var ave_rt = go_rt / sum_go_responses
		var stop_acc = stop_correct / stop_trials
	
		feedback_text = "<br>Please take this time to read your feedback and to take a short break! Press enter to continue"
		feedback_text += "</p><p class = block-text>You have completed: "+testCount+" out of "+numTestBlocks+" blocks of trials."
		
		if (accuracy < accuracy_thresh){
			feedback_text +=
					'</p><p class = block-text>Your accuracy is too low.  Remember: <br>' + prompt_text 
		}
		
		if (missed_responses > missed_thresh){
			feedback_text +=
					'</p><p class = block-text>You have not been responding to some trials.  Please respond on every trial that requires a response.'
		}

      	if (ave_rt > rt_thresh){
        	feedback_text += 
            	'</p><p class = block-text>You have been responding too slowly.'
      	}
		
		if (stop_acc > maxStopCorrect){
			feedback_text +=
			'</p><p class = block-text>You have been responding too slowly.  Please respond as quickly and accurately to each stimulus that requires a response.'
		
		}
		
		if (stop_acc < minStopCorrect){
			feedback_text +=
			'</p><p class = block-text>You have not been stopping your response when stars are present.  Please try your best to stop your response if you see a star.'
		
		}
	
		if (testCount == numTestBlocks){
			feedback_text +=
					'</p><p class = block-text>Done with this test. Press Enter to continue.<br> If you have been completing tasks continuously for an hour or more, please take a 15-minute break before starting again.'
			return false
		} else {
		
			return true
		}
	
	}
}



/* create experiment definition array */
stop_signal_with_flanker_experiment = []

stop_signal_with_flanker_experiment.push(practiceNode)
stop_signal_with_flanker_experiment.push(feedback_block)

stop_signal_with_flanker_experiment.push(start_test_block)
stop_signal_with_flanker_experiment.push(testNode)
stop_signal_with_flanker_experiment.push(feedback_block)

stop_signal_with_flanker_experiment.push(post_task_block)
stop_signal_with_flanker_experiment.push(end_block)
