/* ************************************ */
/* Define helper functions */
/* ************************************ */
function addID() {
  jsPsych.data.addDataToLastTrial({exp_id: 'shape_matching_single_task_network'})
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

var getStim = function() {
	var trial_type = trial_types.pop()
	var probe_i = randomDraw([1,2,3,4,5,6,7,8,9,10])
	var target_i = 0
	var distractor_i = 0
	if (trial_type[0] == 'S') {
		target_i = probe_i
		currData.correct_response = 77
	} else {
		target_i = randomDraw([1,2,3,4,5,6,7,8,9,10].filter(function(y) {return y != probe_i}))
		currData.correct_response = 90
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
	var target = '<div class = leftbox>'+center_prefix+path+target_i+'_green.png'+postfix+'</div>'
	var probe = '<div class = rightbox>'+center_prefix+path+probe_i+'_white.png'+postfix+'</div>'
	var distractor = ''
	if (distractor_i != 'none') {
		distractor = '<div class = distractorbox>'+center_prefix+path+distractor_i+'_red.png'+postfix+'</div>'
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
var run_attention_checks = true

// task specific variables
// Set up variables for stimuli
var colors = ['white','red','green']
var path = '/static/experiments/shape_matching_single_task_network/images/'
var center_prefix = '<div class = centerimg><img src = "'
var mask_prefix = '<div class = "centerimg"><img src = "'
var postfix = '"</img></div>'
var shape_stim = []
var exp_stage = 'practice'
var currData = {'trial_id': 'stim'}
var current_trial = 0

for (var i = 1; i<11; i++) {
	for (var c = 0; c<3; c++) {
		shape_stim.push(path + i + '_' + colors[c] + '.png')
	}
}
jsPsych.pluginAPI.preloadImages(shape_stim.concat(path+'mask.png'))

var practice_len = 14 // must be divisible by 7
// Trial types denoted by three letters for the relationship between:
// probe-target, target-distractor, distractor-probe of the form
// SDS where "S" = match and "D" = non-match, N = "Neutral"
var trial_types = jsPsych.randomization.repeat(['SSS', 'SDD', 'SNN', 'DSD', 'DDD', 'DDS', 'DNN'],practice_len/7)
var exp_len = 245
var numTrialsPerBlock = 49 //must be divisible by 7
var numTestBlocks = exp_len / numTrialsPerBlock
var choices = [90, 77]

var accuracy_thresh = 0.80
var rt_thresh = 1000
var missed_thresh = 0.10
var practice_thresh = 3 // 3 blocks of 14 trials

var prompt_task_list = '<ul style="text-align:left;"><font color="white">'+
						'<li>Respond if green and white shapes are the same or different</li>'+
					   	'<li>Same: M key</li>'+
					   	'<li>Different: Z key</li>'+
					   '</font></ul>'

//PRE LOAD IMAGES HERE
var pathSource = "/static/experiments/shape_matching_single_task_network/images/"
var numbersPreload = ['1','2','3','4','5','6','7','8','9','10']
var colorsPreload = ['white','green','red']
var images = []
for(i=0;i<numbersPreload.length;i++){
	for (x=0;x<colorsPreload.length;x++){
		images.push(pathSource + numbersPreload[i] + '_' + colorsPreload[x] +'.png')
	}
}

images.push(pathSource + 'mask.png')
jsPsych.pluginAPI.preloadImages(images);

/* ************************************ */
/* Set up jsPsych blocks */
/* ************************************ */
// Set up attention check node
var attention_check_block = {
	type: 'attention-check',
	data: {
		exp_id: "shape_matching_single_task_network",
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

/* define static blocks */
var response_keys =
	'<ul list-text><li><span class = "large" style = "color:red">WORD</span>: "R key"</li><li><span class = "large" style = "color:blue">WORD</span>: "B key"</li><li><span class = "large" style = "color:green">WORD</span>: "G key"</li></ul>'


var feedback_instruct_text =
	'Welcome to the experiment. This experiment will take around 11 minutes. Press <i>enter</i> to begin.'
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
			'<p class = block-text>In this experiment you will see a white shape on the right of the screen and a green shape on the left of the screen. Your task is to press the M key if they are the same shape and the Z key if they are different.</p>'+
			'<p class = block-text>On some trials a red shape will also be presented on the left. You should ignore the red shape — your task is only to respond based on whether the white and green shapes are the same.</p>'+
			'<p class = block-text>We will start with practice after you finish the instructions.</p>'+
			'<p class = block-text>To avoid technical issues, please keep the experiment tab (on Chrome or Firefox) <i>active and in full-screen mode</i> for the whole duration of each task.</p>'+
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
	text: '<div class = centerbox><p class = block-text>We will now start the test. Respond exactly like you did during practice, press Z if the green and white shapes are different and press M if they are the same.  Ignore the red shape. </p>'+
								 '<p class = block-text>Press <i>enter</i> to begin the test.</p></div>',
	cont_key: [13],
	timing_post_trial: 1000,
	on_finish: function() {
		current_trial = 0
		exp_stage = 'test'
		trial_types = jsPsych.randomization.repeat(['SSS', 'SDD', 'SNN', 'DSD', 'DDD', 'DDS', 'DNN'],numTrialsPerBlock/7)
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

var fixation_block = {
	type: 'poldrack-single-stim',
	stimulus: '<div class = centerbox><div class = fixation>+</div></div>',
	is_html: true,
	choices: 'none',
	data: {
		trial_id: "fixation"
	},
	timing_response: 500, //500
	timing_post_trial: 0,
	on_finish: function() {
		jsPsych.data.addDataToLastTrial({'exp_stage': exp_stage})
	},
}
//	'<div class = centerbox><p class = block-text>Press M key if the white and green shapes are the same. Otherwise press the Z key.</p></div>.',

var practice_fixation_block = {
	type: 'poldrack-single-stim',
	stimulus: '<div class = centerbox><div class = fixation>+</div></div>',
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
var practice_timing_block = {
	type: 'poldrack-single-stim',
	stimulus: '<div class = "leftbox"></div>',
	is_html: true,
	choices: 'none',
	data: {
		trial_id: "mask"
	},
	timing_response: 500, //500
	timing_post_trial: 0,
	prompt: '<div class = centerbox><p class = block-text>Press M key if the white and green shapes are the same. Otherwise press the Z key.</p></div>.',
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
	correct_text: '<div class = fb_box><div class = center-text><font size = 20>Correct!</font></div></div>',
	incorrect_text: '<div class = fb_box><div class = center-text><font size = 20>Incorrect</font></div></div>',
	timeout_message: '<div class = fb_box><div class = center-text><font size = 20>Respond Faster!</font></div></div>' + prompt_task_list,
	timing_response: 2000, //2000
	timing_stim: 1000,  //1000
	timing_feedback_duration: 500, //500
	show_stim_with_feedback: false,
	timing_post_trial: 0,
	prompt: prompt_task_list,
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
	timing_response: 180000,
	response_ends_trial: true, 

};


var practiceTrials = []
practiceTrials.push(feedback_block)
practiceTrials.push(instructions_block)
for (i = 0; i < practice_len; i++) {
	//practiceTrials.push(practice_fixation_block)
	practiceTrials.push(practice_mask_block)
	practiceTrials.push(practice_block)
	//practiceTrials.push(practice_timing_block)
}

var practiceCount = 0
var practiceNode = {
	timeline: practiceTrials,
	loop_function: function(data) {
		practiceCount += 1
		trial_types = jsPsych.randomization.repeat(['SSS', 'SDD', 'SNN', 'DSD', 'DDD', 'DDS', 'DNN'],practice_len/7)
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

		if (accuracy > accuracy_thresh){
			feedback_text +=
					'</p><p class = block-text>Done with this practice. Press Enter to continue.' 
			return false
	
		} else if (accuracy < accuracy_thresh){
			feedback_text +=
					'</p><p class = block-text>We are going to try practice again to see if you can achieve higher accuracy.  Remember: <br>' + prompt_task_list 
			if (missed_responses > missed_thresh){
				feedback_text +=
						'</p><p class = block-text>You have not been responding to some trials.  Please respond on every trial that requires a response.'
			}

	      	if (ave_rt > rt_thresh){
	        	feedback_text += 
	            	'</p><p class = block-text>You have been responding too slowly.'
	      	}
		
			if (practiceCount == practice_thresh){
				feedback_text +=
					'</p><p class = block-text>Done with this practice.' 
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
	//testTrials.push(fixation_block)
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
	
		feedback_text = "<br>Please take this time to read your feedback and to take a short break! Press enter to continue"
		feedback_text += "</p><p class = block-text>You have completed: "+testCount+" out of "+numTestBlocks+" blocks of trials."
		
		if (accuracy < accuracy_thresh){
			feedback_text +=
					'</p><p class = block-text>Your accuracy is too low.  Remember: <br>' + prompt_task_list
		}
		if (missed_responses > missed_thresh){
			feedback_text +=
					'</p><p class = block-text>You have not been responding to some trials.  Please respond on every trial that requires a response.'
		}

      	if (ave_rt > rt_thresh){
        	feedback_text += 
            	'</p><p class = block-text>You have been responding too slowly.'
      	}
	
		if (testCount == numTestBlocks){
			feedback_text +=
					'</p><p class = block-text>Done with this test. Press Enter to continue.<br>If you have been completing tasks continuously for an hour or more, please take a 15-minute break before starting again.'
			return false
		} else {
		
			return true
		}
		
	}
}
/* create experiment definition array */
var shape_matching_single_task_network_experiment = [];

shape_matching_single_task_network_experiment.push(practiceNode);
shape_matching_single_task_network_experiment.push(feedback_block);

shape_matching_single_task_network_experiment.push(start_test_block);
shape_matching_single_task_network_experiment.push(testNode);
shape_matching_single_task_network_experiment.push(feedback_block);

shape_matching_single_task_network_experiment.push(post_task_block);
shape_matching_single_task_network_experiment.push(end_block);