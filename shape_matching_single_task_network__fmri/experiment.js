/* ************************************ */
/* Define helper functions */
/* ************************************ */

//Functions added for in-person sessions
function genITIs() { 
	mean_iti = 0.5 //mean and standard deviation of 0.5 secs
	min_thresh = 0
	max_thresh = 4

	lambda = 1/mean_iti
	iti_array = []
	for (i=0; i < exp_len +numTestBlocks ; i++) { //add 3 ITIs per test block to make sure there are enough
		curr_iti = - Math.log(Math.random()) / lambda;
		while (curr_iti > max_thresh || curr_iti < min_thresh) {
			curr_iti = - Math.log(Math.random()) / lambda;
		}
		iti_array.push(curr_iti*1000) //convert ITIs from seconds to milliseconds

	}
	return(iti_array)
}

function getITI_stim() { //added for fMRI compatibility
	var currITI = ITIs_stim.shift()
	return currITI
}

function getITI_resp() { //added for fMRI compatibility
	var currITI = ITIs_resp.shift()
	return currITI
}

//feedback functions added for in-person version
var getRefreshFeedback = function() {
	return '<div class = bigbox><div class = picture_box><p class = instruct-text><font color="white">' + refresh_feedback_text + '</font></p></div></div>'
}

var getRefreshTrialID = function() {
	return refresh_trial_id
}

var getRefreshFeedbackTiming = function() {
	return refresh_feedback_timing
}

var getRefreshResponseEnds = function() {
	return refresh_response_ends
}
//


function addID() {
  jsPsych.data.addDataToLastTrial({exp_id: 'shape_matching_single_task_network__fmri'})
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
	choice_counts[71] = 0
	choice_counts[89] = 0
	
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


var getFeedback = function() {
	return '<div class = bigbox><div class = picture_box><p class = instruct-text><font color="white">' + feedback_text + '</font></p></div></div>'
}

var randomDraw = function(lst) {
  var index = Math.floor(Math.random() * (lst.length))
  return lst[index]
}

var getStim = function() {
	var trial_type = trial_types.pop()
	var probe_i = randomDraw([1,2,3,4,5,6,7,8,9,10])
	var target_i = 0
	var distractor_i = 0
	if (trial_type[0] == 'S') {
		target_i = probe_i
		currData.correct_response = 71
	} else {
		target_i = randomDraw([1,2,3,4,5,6,7,8,9,10].filter(function(y) {return y != probe_i}))
		currData.correct_response = 89
	}
	if (trial_type[1] == 'S') {
		distractor_i = target_i
	} else if (trial_type[2] == 'S') {
		distractor_i = probe_i
	} else if (trial_type[2] == 'D') {
		distractor_i = randomDraw([1,2,3,4,5,6,7,8,9,10].filter(function(y) {return $.inArray(y, [target_i, probe_i]) == -1}))
	} else if (trial_type[2] == 'N'){
		distractor_i = 'none'
	}
	currData.current_trial = current_trial
	currData.shape_matching_condition = trial_type
	currData.probe_id = probe_i
	currData.target_id = target_i
	currData.distractor_id = distractor_i
	var target = '<div class = leftbox>'+center_prefix+path+target_i+'_target.png'+postfix+'</div>'
	var probe = '<div class = rightbox>'+center_prefix+path+probe_i+'_probe.png'+postfix+'</div>' //
	// var probe = '<div class = rightbox>'+center_prefix+path+probe_i+'_distractor.png'+postfix+'</div>' //
	var distractor = ''
	if (distractor_i != 'none') {
		distractor = '<div class = distractorbox>'+center_prefix+path+distractor_i+'_distractor.png'+postfix+'</div>' // distractor
		// distractor = '<div class = distractorbox>'+center_prefix+path+distractor_i+'_probe.png'+postfix+'</div>' // distractor
	}
	current_trial += 1
	var stim = target  + probe + distractor
	return stim
}

var getData = function() {
	currData.exp_stage = exp_stage
	return currData
}

var getResponse = function() {
	return currData.correct_response
}
/* ************************************ */
/* Define experimental variables */
/* ************************************ */

// generic task variables
var sumInstructTime = 0 //ms
var instructTimeThresh = 0 ///in seconds
var credit_var = 0

// task specific variables
// Set up variables for stimuli
var type = ['probe','distractor','target']
var path = '/static/experiments/shape_matching_single_task_network__fmri/images/'
var center_prefix = '<div class = centerimg><img src = "'
var mask_prefix = '<div class = "centerimg"><img src = "'
var postfix = '"</img></div>'
var shape_stim = []
var exp_stage = 'practice'
var currData = {'trial_id': 'stim'}
var current_trial = 0

for (var i = 1; i<11; i++) {
	for (var c = 0; c<3; c++) {
		shape_stim.push(path + i + '_' + type[c] + '.png')
	}
}
jsPsych.pluginAPI.preloadImages(shape_stim.concat(path+'mask.png'))

var practice_len = 7 // must be divisible by 7
// Trial types denoted by three letters for the relationship between:
// probe-target, target-distractor, distractor-probe of the form
// SDS where "S" = match and "D" = non-match, N = "Neutral"
var trial_types = jsPsych.randomization.repeat(['SSS', 'SDD', 'SNN', 'DSD', 'DDD', 'DDS', 'DNN'],practice_len/7)
var exp_len = 168 //196 // originally 245
var numTrialsPerBlock = 42 //49 //must be divisible by 7
var numTestBlocks = exp_len / numTrialsPerBlock
var choices = [89, 71]
//var choices = [90, 77]

var accuracy_thresh = 0.80
var rt_thresh = 1000
var missed_thresh = 0.10
var practice_thresh = 3 // 3 blocks of 14 trials

var prompt_task_list = '<ul style="text-align:left;"><font color="white">'+
						'<li>Respond if black and gray shapes are the same or different</li>'+
					   	'<li>Same: middle finger</li>'+
					   	'<li>Different: index finger</li>'+
					   '</font></ul>'

//PRE LOAD IMAGES HERE
var pathSource = "/static/experiments/shape_matching_single_task_network__fmri/images/"
var numbersPreload = ['1','2','3','4','5','6','7','8','9','10']
var typePreload = ['probe','target','distractor']
var images = []
for(i=0;i<numbersPreload.length;i++){
	for (x=0;x<typePreload.length;x++){
		images.push(pathSource + numbersPreload[i] + '_' + typePreload[x] +'.png')
	}
}

images.push(pathSource + 'mask.png')
jsPsych.pluginAPI.preloadImages(images);

//ADDED FOR SCANNING
//fmri variables
var ITIs_stim = []
var ITIs_resp = []

//refresh feedback variables
var refresh_feedback_text = '<div class = instructbox>'+
		'<p class = instruct-text>In this task, you will see a gray shape on the right of the screen and a black shape on the left of the screen.</p>'+
		'<p class = instruct-text><strong>Your task is to press your middle finger if they are the same shape and your index finger if they are different.</strong></p>'+
		'<p class = instruct-text>On some trials a white shape will also be presented on the left. You should ignore the white shape. Your task is only to respond based on whether the gray and black shapes are the same.</p>'+
		'<p class = instruct-text>During practice, you will see a reminder of the rules.  <i> This will be removed for the test</i>. </p>'+ 
		'<p class = instruct-text>To let the experimenters know when you are ready to begin, please press any button. </p>'+
		'</div>'
var refresh_trial_id = "instructions"
var refresh_feedback_timing = -1
var refresh_response_ends = true

/* ************************************ */
/* Set up jsPsych blocks */
/* ************************************ */

/* define static blocks */
var refresh_feedback_block = {
	type: 'poldrack-single-stim',
	stimulus: getRefreshFeedback,
	data: {
		trial_id: getRefreshTrialID
	},
	choices: [32],

	timing_post_trial: 0,
	is_html: true,
	timing_response: getRefreshFeedbackTiming, //10 seconds for feedback
	timing_stim: getRefreshFeedbackTiming,
	response_ends_trial: getRefreshResponseEnds,
	on_finish: function() {
		refresh_trial_id = "practice-no-stop-feedback"
		refresh_feedback_timing = 10000
		refresh_response_ends = false
		if (ITIs_stim.length===0) { //if ITIs haven't been generated, generate them!
			ITIs_stim = genITIs()
			ITIs_resp = ITIs_stim.slice(0) //make a copy of ITIs so that timing_stimulus & timing_response are the same
		}

	} 

};


var end_block = {
	type: 'poldrack-text',
	data: {
		trial_id: "end",
	},
	timing_response: 10000,
	text: '<div class = centerbox><p class = center-block-text>Thanks for completing this task!</p></div>',
	cont_key: [32],
	timing_post_trial: 0,
	on_finish: function(){
		assessPerformance()
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

var fixation_block = {
	type: 'poldrack-single-stim',
	stimulus: '<div class = "leftbox"><div class = centerbox><div class = fixation>+</div></div></div>' +
	'<div class = "rightbox"><div class = centerbox><div class = fixation>+</div></div></div>',
	is_html: true,
	choices: 'none',
	data: {
		trial_id: "fixation"
	},
	timing_stim: getITI_stim, //500
    timing_response: getITI_resp, //500
	timing_post_trial: 0,
	on_finish: function() {
		jsPsych.data.addDataToLastTrial({'exp_stage': exp_stage})
	},
}

var practice_fixation_block = {
	type: 'poldrack-single-stim',
	stimulus: '<div class = "leftbox"><div class = centerbox><div class = fixation>+</div></div></div>' +
	'<div class = "rightbox"><div class = centerbox><div class = fixation>+</div></div></div>',
	is_html: true,
	choices: 'none',
	data: {
		trial_id: "fixation"
	},
	timing_response: 500, //500
	timing_post_trial: 0,
	prompt: prompt_task_list,
	on_finish: function() {
		jsPsych.data.addDataToLastTrial({'exp_stage': exp_stage})
	},
}

var refresh_fixation_block = {
	type: 'poldrack-single-stim',
	stimulus: '<div class = "leftbox"><div class = centerbox><div class = fixation>+</div></div></div>' +
	'<div class = "rightbox"><div class = centerbox><div class = fixation>+</div></div></div>',
	is_html: true,
	choices: 'none',
	data: {
		trial_id: "fixation"
	},
	timing_response: 500, //500
	timing_post_trial: 0,
	prompt: prompt_task_list,
	on_finish: function() {
		jsPsych.data.addDataToLastTrial({'exp_stage': exp_stage})
	},
}

var practice_mask_block = {
	type: 'poldrack-single-stim',
	stimulus: '<div class = "leftbox">'+mask_prefix+path+'mask.png'+postfix+
			  '<div class = centerbox><div class = fixation>+</div></div>' + '</div>' +
			  '<div class = "rightbox">'+mask_prefix+path+'mask.png'+postfix+
			  '<div class = centerbox><div class = fixation>+</div></div>' + '</div>',
	is_html: true,
	choices: 'none',
	data: {
		trial_id: "mask"
	},
	timing_response: 500, //500
	timing_post_trial: 0,
	prompt: prompt_task_list,
	on_finish: function() {
		jsPsych.data.addDataToLastTrial({'exp_stage': exp_stage})
	},
}

var refresh_mask_block = {
	type: 'poldrack-single-stim',
	stimulus: '<div class = "leftbox">'+mask_prefix+path+'mask.png'+postfix+
			  '<div class = centerbox><div class = fixation>+</div></div>' + '</div>' +
			  '<div class = "rightbox">'+mask_prefix+path+'mask.png'+postfix+
			  '<div class = centerbox><div class = fixation>+</div></div>' + '</div>',
	is_html: true,
	choices: 'none',
	data: {
		trial_id: "mask"
	},
	timing_response: 500, //500
	timing_post_trial: 0,
	prompt: prompt_task_list,
	on_finish: function() {
		jsPsych.data.addDataToLastTrial({'exp_stage': exp_stage})
	},
}

var test_mask_block = {
	type: 'poldrack-single-stim',
	stimulus: '<div class = "leftbox">'+mask_prefix+path+'mask.png'+postfix+
			  '<div class = centerbox><div class = fixation>+</div></div>' + '</div>' +
			  '<div class = "rightbox">'+mask_prefix+path+'mask.png'+postfix+
			  '<div class = centerbox><div class = fixation>+</div></div>' + '</div>',
	is_html: true,
	choices: 'none',
	data: {
		trial_id: "mask"
	},
	timing_response: 500, //500
	timing_post_trial: 0,
	on_finish: function() {
		jsPsych.data.addDataToLastTrial({'exp_stage': exp_stage})
	},
}

var practice_block = {
	type: 'poldrack-categorize',
	stimulus: getStim,
	is_html: true,
	choices: choices,
	key_answer: getResponse,
	data: getData,
	correct_text: '<div class = upperbox><div class = center-text>Correct!</font></div></div>',
	incorrect_text: '<div class = upperbox><div class = center-text>Incorrect</font></div></div>',
	timeout_message: '<div class = upperbox><div class = center-text>Respond Faster!</font></div></div>' + prompt_task_list,
	timing_response: 2000, //2000
	timing_stim: 1000,  //1000
	timing_feedback_duration: 500, //500
	show_stim_with_feedback: false,
	timing_post_trial: 0,
	prompt: prompt_task_list,
	fixation_default: true,
	fixation_stim: '<div class = "leftbox"><div class = centerbox><div class = fixation>+</div></div></div>' +
	'<div class = "rightbox"><div class = centerbox><div class = fixation>+</div></div></div>',
	on_finish: function(){
		jsPsych.data.addDataToLastTrial({trial_id: 'practice_trial'})
	}
}



var refresh_block = {
	type: 'poldrack-categorize',
	stimulus: getStim,
	is_html: true,
	choices: choices,
	key_answer: getResponse,
	data: getData,
	correct_text: '<div class = fb_box><div class = center-text><font size = 20>Correct!</font></div></div>',
	incorrect_text: '<div class = fb_box><div class = center-text><font size = 20>Incorrect</font></div></div>',
	timeout_message: '<div class = fb_box><div class = center-text><font size = 20>Respond Faster!</font></div></div>' + prompt_task_list,
	timing_response: 2000, //2000
	timing_stim: 1000,  //1000
	timing_feedback_duration: 500, //500
	show_stim_with_feedback: false,
	timing_post_trial: 0,
	prompt: prompt_task_list,
	fixation_default: true,
	fixation_stim: '<div class = "leftbox"><div class = centerbox><div class = fixation>+</div></div></div>' +
	'<div class = "rightbox"><div class = centerbox><div class = fixation>+</div></div></div>',
	on_finish: function(){
		jsPsych.data.addDataToLastTrial({trial_id: 'practice_trial'})
	}
}


var test_block = {
	type: 'poldrack-single-stim',
	stimulus: getStim,
	is_html: true,
	choices: choices,
	timing_response: 2000, //2000
	timing_stim: 1000, //1000
	data: getData,
	timing_post_trial: 0,
	fixation_default: true,
	fixation_stim: '<div class = "leftbox"><div class = centerbox><div class = fixation>+</div></div></div>' +
	'<div class = "rightbox"><div class = centerbox><div class = fixation>+</div></div></div>',
	on_finish: function(data) {
		correct_trial = 0
		if (data.key_press == data.correct_response) {
			correct_trial = 1
		}
		
		jsPsych.data.addDataToLastTrial({correct_trial: correct_trial,
										 trial_id: 'test_trial'})
	}
}


var feedback_text = 
'Welcome to the experiment. This experiment will take around 11 minutes. Press <i>enter</i> to begin.'
var feedback_block = {
	type: 'poldrack-single-stim',
	data: {
		trial_id: "practice-no-stop-feedback"
	},
	choices: [13],
	stimulus: getFeedback,
	timing_post_trial: 0,
	is_html: true,
	timing_response: 10000,
	response_ends_trial: true, 

};

//in scanner practice block
var refreshTrials = []
refreshTrials.push(refresh_feedback_block)
for (i = 0; i < practice_len; i++) {
	refreshTrials.push(refresh_fixation_block)
	refreshTrials.push(refresh_mask_block)
	refreshTrials.push(refresh_block)
	//practiceTrials.push(practice_timing_block)
}

var refreshNode = {
	timeline: refreshTrials,
	loop_function: function(data) {
		trial_types = jsPsych.randomization.repeat(['SSS', 'SDD', 'SNN', 'DSD', 'DDD', 'DDS', 'DNN'],numTrialsPerBlock/7)
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
	
		refresh_feedback_text = "<br><p class = instruct-text>Please take this time to read your feedback and to take a short break!"

		 if (accuracy < accuracy_thresh){
			refresh_feedback_text +=
					'</p><p class = instruct-text>  Remember: <br>' + prompt_task_list 
			if (missed_responses > missed_thresh){
				refresh_feedback_text +=
						'</p><p class = instruct-text>You have not been responding to some trials.  Please respond on every trial that requires a response.'
			}

	      	if (ave_rt > rt_thresh){
	        	refresh_feedback_text += 
	            	'</p><p class = instruct-text>You have been responding too slowly.'
	      	}
		
		}
		refresh_feedback_text +=
		'</p><p class = instruct-text>Done with this practice. The test will begin shortly.' 
		exp_stage = 'test'

		return false
		
	}
}



//in scanner test blocks
var testCount = 0
//first block skips intro feedback
var testTrials0 = []
for (i = 0; i < numTrialsPerBlock; i++) {
	testTrials0.push(fixation_block)
	testTrials0.push(test_mask_block)
	testTrials0.push(test_block)
}

var testNode0 = {
	timeline: testTrials0,
	loop_function: function(data) {
		testCount += 1
		trial_types = jsPsych.randomization.repeat(['SSS', 'SDD', 'SNN', 'DSD', 'DDD', 'DDS', 'DNN'],numTrialsPerBlock/7)
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
	
		feedback_text = "<br><p class = instruct-text>Please take this time to read your feedback and to take a short break!"
		feedback_text += "</p><p class = instruct-text>You have completed: "+testCount+" out of "+numTestBlocks+" blocks of trials."
		
		if (accuracy < accuracy_thresh){
			feedback_text +=
					'</p><p class = instruct-text>Your accuracy is too low.  Remember: <br>' + prompt_task_list
		}
		if (missed_responses > missed_thresh){
			feedback_text +=
					'</p><p class = instruct-text>You have not been responding to some trials.  Please respond on every trial that requires a response.'
		}

      	if (ave_rt > rt_thresh){
        	feedback_text += 
            	'</p><p class = instruct-text>You have been responding too slowly.'
      	}

		return false
	}
}


//remaining blocks
var testTrials = []
testTrials.push(feedback_block)
for (i = 0; i < numTrialsPerBlock; i++) {
	testTrials.push(fixation_block)
	testTrials.push(test_mask_block)
	testTrials.push(test_block)
}

var testCount = 0
var testNode = {
	timeline: testTrials,
	loop_function: function(data) {
		testCount += 1
		trial_types = jsPsych.randomization.repeat(['SSS', 'SDD', 'SNN', 'DSD', 'DDD', 'DDS', 'DNN'],numTrialsPerBlock/7)
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
	
		feedback_text = "<br><p class = instruct-text>Please take this time to read your feedback and to take a short break!"
		feedback_text += "</p><p class = instruct-text>You have completed: "+testCount+" out of "+numTestBlocks+" blocks of trials."
		
		if (accuracy < accuracy_thresh){
			feedback_text +=
					'</p><p class = instruct-text>Your accuracy is too low.  Remember: <br>' + prompt_task_list
		}
		if (missed_responses > missed_thresh){
			feedback_text +=
					'</p><p class = instruct-text>You have not been responding to some trials.  Please respond on every trial that requires a response.'
		}

      	if (ave_rt > rt_thresh){
        	feedback_text += 
            	'</p><p class = instruct-text>You have been responding too slowly.'
      	}
	
		if (testCount == numTestBlocks){
			feedback_text +=
					'</p><p class = instruct-text>Done with this test.'
			return false
		} else {
		
			return true
		}
		
	}
}
/* create experiment definition array */
var shape_matching_single_task_network__fmri_experiment = [];


test_keys(shape_matching_single_task_network__fmri_experiment, choices)

//in scanner practice
shape_matching_single_task_network__fmri_experiment.push(refreshNode);
shape_matching_single_task_network__fmri_experiment.push(refresh_feedback_block);


//in scanner test
cni_bore_setup(shape_matching_single_task_network__fmri_experiment)
shape_matching_single_task_network__fmri_experiment.push(testNode0);
shape_matching_single_task_network__fmri_experiment.push(testNode);
shape_matching_single_task_network__fmri_experiment.push(feedback_block);

shape_matching_single_task_network__fmri_experiment.push(end_block);