/* ************************************ */
/* Define helper functions */
/* ************************************ */
function addID() {
  jsPsych.data.addDataToLastTrial({exp_id: 'flanker_single_task_network'})
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
	var missed_count = 0
	var trial_count = 0
	var rt_array = []
	var rt = 0
	var correct = 0
		//record choices participants made
	var choice_counts = {}
	choice_counts[-1] = 0
	choice_counts[70] = 0
	choice_counts[72] = 0
	for (var k = 0; k < choices.length; k++) {
		choice_counts[choices[k]] = 0
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

var getInstructFeedback = function() {
	return '<div class = centerbox><p class = center-block-text>' + feedback_instruct_text +
		'</p></div>'
}

var getFeedback = function() {
	return '<div class = bigbox><div class = picture_box><p class = block-text><font color="white">' + feedback_text + '</font></p></div></div>'
}

var changeData = function() {
		data = jsPsych.data.getTrialsOfType('text')
		practiceDataCount = 0
		testDataCount = 0
		for (i = 0; i < data.length; i++) {
			if (data[i].trial_id == 'practice_intro') {
				practiceDataCount = practiceDataCount + 1
			} else if (data[i].trial_id == 'test_intro') {
				testDataCount = testDataCount + 1
			}
		}
		if (practiceDataCount >= 1 && testDataCount === 0) {
			//temp_id = data[i].trial_id
			jsPsych.data.addDataToLastTrial({
				exp_stage: "practice"
			})
		} else if (practiceDataCount >= 1 && testDataCount >= 1) {
			//temp_id = data[i].trial_id
			jsPsych.data.addDataToLastTrial({
				exp_stage: "test"
			})
		}
	}
	/* ************************************ */
	/* Define experimental variables */
	/* ************************************ */
	// generic task variables
var run_attention_checks = true
var attention_check_thresh = 0.45
var sumInstructTime = 0 //ms
var instructTimeThresh = 0 ///in seconds

var accuracy_thresh = 0.75
var rt_thresh = 1000
var missed_response_thresh = 0.10
var practice_thresh = 3 // 3 blocks of 12 trials
var choices = [70, 72]
// task specific variables
var correct_responses = jsPsych.randomization.repeat([
	["left arrow", 37],
	["right arrow", 39]
], 1)

var fileTypePNG = '.png"></img>'
var preFileType = '<img class = center src="/static/experiments/flanker_single_task_network/images/'
var flanker_boards = [['<div class = bigbox><div class = centerbox><div class = flankerLeft_2><div class = cue-text>'],['</div></div><div class = flankerLeft_1><div class = cue-text>'],['</div></div><div class = flankerMiddle><div class = cue-text>'],['</div></div><div class = flankerRight_1><div class = cue-text>'],['</div></div><div class = flankerRight_2><div class = cue-text>'],['</div></div></div></div>']]					   

var test_stimuli = [{
	image: flanker_boards[0]+ preFileType + 'F' + fileTypePNG +
		   flanker_boards[1]+ preFileType + 'F' + fileTypePNG +
		   flanker_boards[2]+ preFileType + 'H' + fileTypePNG +
		   flanker_boards[3]+ preFileType + 'F' + fileTypePNG +
		   flanker_boards[4]+ preFileType + 'F' + fileTypePNG,
	data: {
		correct_response: 72,
		flanker_condition: 'incongruent',
		trial_id: 'stim',
		flanker: 'F',
		center_letter: 'H'
	}
}, {
	image: flanker_boards[0]+ preFileType + 'H' + fileTypePNG +
		   flanker_boards[1]+ preFileType + 'H' + fileTypePNG +
		   flanker_boards[2]+ preFileType + 'F' + fileTypePNG +
		   flanker_boards[3]+ preFileType + 'H' + fileTypePNG +
		   flanker_boards[4]+ preFileType + 'H' + fileTypePNG,
	data: {
		correct_response: 70,
		flanker_condition: 'incongruent',
		trial_id: 'stim',
		flanker: 'H',
		center_letter: 'F'
	}
}, {
	image: flanker_boards[0]+ preFileType + 'H' + fileTypePNG +
		   flanker_boards[1]+ preFileType + 'H' + fileTypePNG +
		   flanker_boards[2]+ preFileType + 'H' + fileTypePNG +
		   flanker_boards[3]+ preFileType + 'H' + fileTypePNG +
		   flanker_boards[4]+ preFileType + 'H' + fileTypePNG,
	data: {
		correct_response: 72,
		flanker_condition: 'congruent',
		trial_id: 'stim',
		flanker: 'H',
		center_letter: 'H'
	}
}, {
	image: flanker_boards[0]+ preFileType + 'F' + fileTypePNG +
		   flanker_boards[1]+ preFileType + 'F' + fileTypePNG +
		   flanker_boards[2]+ preFileType + 'F' + fileTypePNG +
		   flanker_boards[3]+ preFileType + 'F' + fileTypePNG +
		   flanker_boards[4]+ preFileType + 'F' + fileTypePNG,
	data: {
		correct_response: 70,
		flanker_condition: 'congruent',
		trial_id: 'stim',
		flanker: 'F',
		center_letter: 'F'
	}
}];

var practice_len = 12 // must be divisible by 4
var exp_len = 96 // must be divisible by 4, 100 in original
var numTrialsPerBlock = 48 //must be divisible by 4
var numTestBlocks = exp_len / numTrialsPerBlock

var practice_trials = jsPsych.randomization.repeat(test_stimuli, practice_len / 4, true);
var test_trials = jsPsych.randomization.repeat(test_stimuli, numTrialsPerBlock / 4, true);

var practice_response_array = [];
for (i = 0; i < practice_trials.data.length; i++) {
	practice_response_array.push(practice_trials.data[i].correct_response)
}

var test_response_array = [];
for (i = 0; i < test_trials.data.length; i++) {
	test_response_array.push(test_trials.data[i].correct_response)
}



var prompt_text_list = '<ul style="text-align:left;">'+
						'<li>Indicate the identity of the <i> middle </i> letter.</li>' +
						'<li>Press the H key, if H.</li>' +
					    '<li>Press the F key, if F.</li>' +
					  '</ul>'

var prompt_text = '<div class = prompt_box>'+
					  '<p class = center-block-text style = "font-size:16px; line-height:80%%;">Indicate the identity of the <i> middle </i> letter.</p>' +
					  '<p class = center-block-text style = "font-size:16px; line-height:80%%;">Press the H key, if H.</p>' +
					  '<p class = center-block-text style = "font-size:16px; line-height:80%%;">Press the F key, if F.</p>' +
				  '</div>'
				  
//PRE LOAD IMAGES HERE
var pathSource = "/static/experiments/flanker_single_task_network/images/"
var images = []
images.push(pathSource + 'F.png')
images.push(pathSource + 'H.png')
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
       exp_id: "flanker_single_task_network",
       trial_id: "post task questions"
   },
   questions: ['<p class = center-block-text style = "font-size: 20px">Please summarize what you were asked to do in this task.</p>',
              '<p class = center-block-text style = "font-size: 20px">Do you have any comments about this task?</p>'],
   rows: [15, 15],
   timing_response: 360000,
   columns: [60,60]
};
/* define static blocks */
var feedback_instruct_text =
	'Welcome to the experiment. This experiment will take around 5 minutes. Press <i>enter</i> to begin.'
var feedback_instruct_block = {
	type: 'poldrack-text',
	cont_key: [13],
	data: {
		trial_id: "instruction"
	},
	text: getInstructFeedback,
	timing_post_trial: 0,
	timing_response: 180000
};
/// This ensures that the subject does not read through the instructions too quickly.  If they do it too quickly, then we will go over the loop again.
var instructions_block = {
	type: 'poldrack-instructions',
	pages: [
		'<div class = centerbox>'+
			'<p class = block-text>In this experiment you will see five letters on the string composed of F\'s and H\'s. For instance, you might see \'FFFFF\' or \'HHFHH\'. '+
			'Your task is to respond by pressing the key corresponding to the <i>middle</i> letter. So if you see \'FFHFF\' you would press the \'H\' key.</p>'+
			'<p class = block-text>After each response you will get feedback about whether you were correct or not. We will start with a short practice set.</p>'+
			'<p class = block-text>To avoid technical issues, please keep the experiment tab (on Chrome or Firefox) <i>active and in full-screen mode</i> for the whole duration of each task.</p>'+
		'</div>'
	],
	allow_keys: false,
	data: {
		trial_id: "instruction"
	},
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
	timing_response: 180000,
	data: {
		trial_id: "end",
	},
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
		trial_id: "test_intro"
	},
	timing_response: 180000,
	text: '<div class = centerbox><p class = center-block-text>Done with practice. Starting test.</p><p class = center-block-text>Press <i>enter</i> to begin.</p></div>',
	cont_key: [13],
	timing_post_trial: 1000,
	on_finish: function(){
		feedback_text = 'Starting a test block.  Press enter to continue.'
	}
};

var fixation_block = {
	type: 'poldrack-single-stim',
	stimulus: '<div class = centerbox><div class = fixation>+</div></div>',
	is_html: true,
	data: {
		trial_id: "fixation"
	},
	choices: 'none',
	timing_stim: 1000, //500 was 500, but changed to 1000 because I took out timing post trial for practice and test trials
	timing_response: 1000,
	timing_post_trial: 0,
	on_finish: changeData,
};

var feedback_text = 
	'Welcome to the experiment. This experiment will take around 5 minutes. Press <i>enter</i> to begin.'
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
	var practice_fixation_block = {
		type: 'poldrack-single-stim',
		stimulus: '<div class = centerbox><div class = fixation>+</div></div>',
		is_html: true,
		data: {
			trial_id: "practice_fixation"
		},
		choices: 'none',
		timing_stim: 500, //500 
		timing_response: 500, //500
		timing_post_trial: 0,
		on_finish: changeData,
		prompt: prompt_text
	};
	var practice_block = {
		type: 'poldrack-categorize',
		stimulus: practice_trials.image[i],
		is_html: true,
		key_answer: practice_response_array[i],
		correct_text: '<div class = fb_box><div class = center-text><font size = 20>Correct!</font></div></div>' + prompt_text,
		incorrect_text: '<div class = fb_box><div class = center-text><font size = 20>Incorrect</font></div></div>' + prompt_text,
		timeout_message: '<div class = fb_box><div class = center-text><font size = 20>Respond Faster!</font></div></div>' + prompt_text,
		choices: [70, 72],
		data: practice_trials.data[i],
		timing_feedback_duration: 500, //500
		timing_stim: 1000, //1000
		show_stim_with_feedback: false,
		response_ends_trial: false,
		timing_response: 2000, //2000
		timing_post_trial: 0,
		prompt: prompt_text,
		on_finish: function(data) {
			correct_trial = 0
			if (data.key_press == data.correct_response) {
				correct_trial = 1
			}
			current_block = practiceCount
		
			jsPsych.data.addDataToLastTrial({correct_trial: correct_trial,
											 trial_id: 'practice_trial',
											 current_block: current_block,
											 current_trial: i
											 })
		}
	}
	
	practiceTrials.push(practice_fixation_block)
	practiceTrials.push(practice_block)
}

var practiceCount = 0
var practiceNode = {
	timeline: practiceTrials,
	loop_function: function(data) {
		practiceCount += 1
		current_trial = 0 
		
		practice_trials = jsPsych.randomization.repeat(test_stimuli, practice_len / 4, true);
		practice_response_array = [];
		for (i = 0; i < practice_trials.data.length; i++) {
			practice_response_array.push(practice_trials.data[i].correct_response)
		}		
		
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
			test_trials = jsPsych.randomization.repeat(test_stimuli, numTrialsPerBlock / 4, true);
			return false
	
		} else if (accuracy < accuracy_thresh){
			feedback_text +=
					'</p><p class = block-text>We are going to try practice again to see if you can achieve higher accuracy.  Remember: <br>' + prompt_text_list 
			if (missed_responses > missed_response_thresh){
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
	var test_fixation_block = {
		type: 'poldrack-single-stim',
		stimulus: '<div class = centerbox><div class = fixation>+</div></div>',
		is_html: true,
		data: {
			trial_id: "test_fixation"
		},
		choices: 'none',
		timing_stim: 500, //500 
		timing_response: 500, //500
		timing_post_trial: 0,
		on_finish: changeData,
	};
	
	var test_block = {
		type: 'poldrack-single-stim',
		stimulus: test_trials.image[i],
		is_html: true,
		choices: [70, 72],
		data: test_trials.data[i],
		feedback_duration: 0,
		timing_response: 2000, //2000
		timing_stim: 1000, //1000
		response_ends_trial: false,
		show_stim_with_feedback: false,
		timing_post_trial: 0,
		on_finish: function(data) {
			correct_trial = 0
			if (data.key_press == data.correct_response) {
				correct_trial = 1
			}
			
			current_block = testCount
			
			jsPsych.data.addDataToLastTrial({correct_trial: correct_trial,
											 trial_id: 'test_trial',
											 current_block: current_block,
											 current_trial: i
											 })
		}
	};
	
	testTrials.push(test_fixation_block)
	testTrials.push(test_block)
}

var testCount = 0
var testNode = {
	timeline: testTrials,
	loop_function: function(data) {
		testCount += 1
		test_trials = jsPsych.randomization.repeat(test_stimuli, numTrialsPerBlock / 4, true);
		current_trial = 0 
	
		var sum_rt = 0
		var sum_responses = 0
		var correct = 0
		var total_trials = 0
	
		for (var i = 0; i < data.length; i++){
			if (data[i].trial_id == 'test_trial') {
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
					'</p><p class = block-text>Your accuracy is too low.  Remember: <br>' + prompt_text_list
		}
		if (missed_responses > missed_response_thresh){
			feedback_text +=
					'</p><p class = block-text>You have not been responding to some trials.  Please respond on every trial that requires a response.'
		}

      	if (ave_rt > rt_thresh){
        	feedback_text += 
            	'</p><p class = block-text>You have been responding too slowly.'
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

//Set up experiment
flanker_single_task_network_experiment = []

flanker_single_task_network_experiment.push(practiceNode)
flanker_single_task_network_experiment.push(feedback_block)

flanker_single_task_network_experiment.push(start_test_block)
flanker_single_task_network_experiment.push(testNode)
flanker_single_task_network_experiment.push(feedback_block)

flanker_single_task_network_experiment.push(post_task_block)
flanker_single_task_network_experiment.push(end_block)