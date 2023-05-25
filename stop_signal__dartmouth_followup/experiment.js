/* ************************************ */
/* Define helper functions */
/* ************************************ */
function addID() {
  jsPsych.data.addDataToLastTrial({exp_id: 'stop_signal__dartmouth_followup'})
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
		
		//record choices participants made
	var choice_counts = {}
	choice_counts[-1] = 0
	choice_counts[37] = 0
	choice_counts[40] = 0
	
	for (var i = 0; i < experiment_data.length; i++) {
		if (experiment_data[i].trial_id == 'test_trial') {
			if (experiment_data[i].SS_trial_type == 'go'){
				trial_count += 1
			}
			
			if ((experiment_data[i].SS_trial_type == 'go') && (experiment_data[i].rt != -1)){
				rt = experiment_data[i].rt
				rt_array.push(rt)
				key = experiment_data[i].key_press
				choice_counts[key] += 1
				if (experiment_data[i].key_press == experiment_data[i].correct_response){
					correct += 1
				}
			} else if ((experiment_data[i].SS_trial_type == 'stop') && (experiment_data[i].rt != -1)){
				rt = experiment_data[i].rt
				rt_array.push(rt)
			} else if ((experiment_data[i].SS_trial_type == 'go') && (experiment_data[i].rt == -1)){
				missed_count += 1
			}
		}
	}
	//console.log('trial count = ' + trial_count)
	//console.log('correct = ' + correct)
	//console.log('missed_count = ' + missed_count)

	
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
	//console.log('missed_percent = ' + missed_percent)
	//console.log('avg_rt = ' + avg_rt)
	//console.log('responses_ok = ' + responses_ok)
	//console.log('accuracy = ' + accuracy)
}
var randomDraw = function(lst) {
	var index = Math.floor(Math.random() * (lst.length))
	return lst[index]
}

var practice_ITIs = [0.136,0.0,0.272,0.544,0.0,0.0,0.0,0.0,0.0,0.272,0.136,0.408,0.136,0.0,0.272,0.0,0.136,0.272,0.0,0.136]



var practice_get_ITI = function() {
	return 2250 + practice_ITIs.shift()*1000
}

var test_get_ITI = function() {
	return 2250 + test_ITIs.shift()*1000
}


/* Staircase procedure. After each successful stop, make the stop signal delay longer (making stopping harder) */
var updateSSD = function(data) {
	if (data.SS_trial_type == 'stop') {
		if (data.rt == -1 && SSD < 1000) {
			SSD = SSD + 50
		} else if (data.rt != -1 && SSD > 0) {
			SSD = SSD - 50
		}
	}
}

var getSSD = function() {
	return SSD
}
/* After each test block let the subject know their average RT and accuracy. If they succeed or fail on too many stop signal practice_trials, give them a reminder */
var getPracticeFeedback = function() {
	var data = test_block_data
	var rt_array = [];
	var sum_correct = 0;
	var go_length = 0;
	var num_responses = 0;
	for (var i = 0; i < data.length; i++) {
		if (data[i].trial_id == "stim") {
			go_length += 1
			if (data[i].rt != -1) {
				num_responses += 1
				rt_array.push(data[i].rt);
				if (data[i].key_press == data[i].correct_response) {
					sum_correct += 1
				}
			}
		} 
	}
	var average_rt = -1;
    if (rt_array.length !== 0) {
      average_rt = math.median(rt_array);
      rtMedians.push(average_rt)
    }
	var rt_diff = 0
	if (rtMedians.length !== 0) {
		rt_diff = (average_rt - rtMedians.slice(-1)[0])
	}
	var GoCorrect_percent = sum_correct / go_length;
	var missed_responses = (go_length - num_responses) / go_length
	

	test_feedback_text = "<br>Done with a practice block. Please take this time to read your feedback and to take a short break! (Scroll down, if needed)"
	test_feedback_text += "</p><p class = block-text><strong>Average reaction time:  " + Math.round(average_rt) + " ms. Accuracy for practice trials: " + Math.round(GoCorrect_percent * 100)+ "%</strong>" 
	if (average_rt > RT_thresh || rt_diff > rt_diff_thresh) {
		test_feedback_text +=
			'</p><p class = block-text>You have been responding too slowly, please respond to each shape as quickly and as accurately as possible.'
	}
	if (missed_responses >= missed_response_thresh) {
		test_feedback_text +=
			'</p><p class = block-text><strong>We have detected a number of practice trials that required a response, where no response was made.  Please ensure that you are responding to each shape, unless a star appears.</strong>'
	}
	if (GoCorrect_percent < accuracy_thresh) {
		test_feedback_text += '</p><p class = block-text>We are going to try practice again to see if we can achieve an accuracy of 80% or higher. Remember, the correct keys are as follows: ' + prompt_text
	}
	
	test_feedback_text +=
	 		'</p><p class = block-text><strong>Press enter to begin.'

	return '<div class = centerbox><p class = block-text>' + test_feedback_text + '</p></div>'
}

/* After each test block let the subject know their average RT and accuracy. If they succeed or fail on too many stop signal practice_trials, give them a reminder */
var getTestFeedback = function() {
	var data = test_block_data
	var rt_array = [];
	var sum_correct = 0;
	var go_length = 0;
	var stop_length = 0;
	var num_responses = 0;
	var successful_stops = 0;
	for (var i = 0; i < data.length; i++) {
		if (data[i].SS_trial_type == "go") {
			go_length += 1
			if (data[i].rt != -1) {
				num_responses += 1
				rt_array.push(data[i].rt);
				if (data[i].key_press == data[i].correct_response) {
					sum_correct += 1
				}
			}
		} else if (data[i].SS_trial_type == "stop") {
			stop_length += 1
			if (data[i].rt == -1) {
				successful_stops += 1
			}
		}
	}
	var average_rt = -1;
    if (rt_array.length !== 0) {
      average_rt = math.median(rt_array);
      rtMedians.push(average_rt)
    }
	var rt_diff = 0
	if (rtMedians.length !== 0) {
		rt_diff = (average_rt - rtMedians.slice(-1)[0])
	}
	var GoCorrect_percent = sum_correct / go_length;
	var missed_responses = (go_length - num_responses) / go_length
	var StopCorrect_percent = successful_stops / stop_length
	stopAccMeans.push(StopCorrect_percent)
	var stopAverage = math.mean(stopAccMeans)

	test_feedback_text = "<br>Done with a test block. Please take this time to read your feedback and to take a short break!  (Scroll down, if needed)"
	test_feedback_text += "</p><p class = block-text><strong>Average reaction time:  " + Math.round(average_rt) + " ms. Accuracy for non-star trials: " + Math.round(GoCorrect_percent * 100)+ "%</strong>" 
	if (average_rt > RT_thresh || rt_diff > rt_diff_thresh) {
		test_feedback_text +=
			'</p><p class = block-text>You have been responding too slowly, please respond to each shape as quickly and as accurately as possible.'
	}
	if (missed_responses >= missed_response_thresh) {
		test_feedback_text +=
			'</p><p class = block-text><strong>We have detected a number of trials that required a response, where no response was made.  Please ensure that you are responding to each shape, unless a star appears.</strong>'
	}
	if (GoCorrect_percent < accuracy_thresh) {
		test_feedback_text += '</p><p class = block-text>Your accuracy is too low. Remember, the correct keys are as follows: ' + prompt_text
	}
	
	if (stop_length > 0){
		if (StopCorrect_percent < (0.5-stop_thresh) || stopAverage < 0.45){
					test_feedback_text +=
						'</p><p class = block-text><strong>Remember to try and withhold your response when you see a stop signal.</strong>'	
		} else if (StopCorrect_percent > (0.5+stop_thresh) || stopAverage > 0.55){
			test_feedback_text +=
				'</p><p class = block-text><strong>Remember, do not slow your responses to the shape to see if a star will appear before you respond.  Please respond to each shape as quickly and as accurately as possible.</strong>'
		}
	}
	
	test_feedback_text +=
	 		'</p><p class = block-text><strong>Press enter to begin.'

	return '<div class = centerbox><p class = block-text>' + test_feedback_text + '</p></div>'
}

var getPracticepractice_trials = function() {
	var practice = []
	var practice_trials = jsPsych.randomization.repeat(stims, practice_len/4)
	for (i=0; i<practice_trials.length; i++) {
		practice_trials[i].key_answer = practice_trials[i].data.correct_response
	}
	var practice_block = {
		type: 'poldrack-categorize',
		timeline: practice_trials, 
		is_html: true,
		choices: choices,
		timing_stim: 850,
		timing_response: 1850,
		correct_text: '<div class = fb_box><div class = center-text><font size = 20>Correct!</font></div></div>',
		incorrect_text: '<div class = fb_box><div class = center-text><font size = 20>Incorrect</font></div></div>',
		timeout_message: '<div class = fb_box><div class = center-text><font size = 20>Too Slow</font></div></div>',
		show_stim_with_feedback: false,
		timing_feedback_duration: 500,
		timing_post_trial: 250,
		on_finish: function(data) {
			jsPsych.data.addDataToLastTrial({
				exp_stage: 'practice',
				trial_num: current_trial,
				trial_id: 'stim',
				SS_trial_type: 'go'
			})
			current_trial += 1
			test_block_data.push(data)
		}
	}
	practice.push(practice_block)
	practice.push(practice_feedback_block)
	return practice
}

var getStim = function(){
	var temp_stim = practice_blocks[practiceStopCount].pop()
	stim_html = temp_stim.stimulus
	SS_trial_type = temp_stim.SS_trial_type
	correct_response = temp_stim.data.correct_response
	
	return stim_html
}

var getSSTrialType = function(){
	return SS_trial_type
}


var getCategorizeFeedback = function(){
	curr_trial = jsPsych.progress().current_trial_global - 1
	trial_id = jsPsych.data.getDataByTrialIndex(curr_trial).trial_id
	if ((trial_id == 'practice_stop_trial') && (jsPsych.data.getDataByTrialIndex(curr_trial).SS_trial_type == 'go')){
		if (jsPsych.data.getDataByTrialIndex(curr_trial).correct === true){
		
			return '<div class = fb_box><div class = center-text><font size = 20>Correct!</font></div></div>'
		} else if ((jsPsych.data.getDataByTrialIndex(curr_trial).correct === false) && (jsPsych.data.getDataByTrialIndex(curr_trial).key_press != -1)){
		
			return '<div class = fb_box><div class = center-text><font size = 20>Incorrect</font></div></div>'
		} else if (jsPsych.data.getDataByTrialIndex(curr_trial).key_press == -1){
		
			return '<div class = fb_box><div class = center-text><font size = 20>Respond Faster!</font></div></div>'
		}
	} else if ((trial_id == 'practice_stop_trial') && (jsPsych.data.getDataByTrialIndex(curr_trial).SS_trial_type == 'stop')){
		if (jsPsych.data.getDataByTrialIndex(curr_trial).rt == -1){
		
			return '<div class = fb_box><div class = center-text><font size = 20>Correct!</font></div></div>'
		} else if (jsPsych.data.getDataByTrialIndex(curr_trial).rt != -1){
		
			return '<div class = fb_box><div class = center-text><font size = 20>There was a star.</font></div></div>'
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


var practice_repeats = 0
// task specific variables
// Define and load images
var prefix = '/static/experiments/stop_signal__dartmouth_followup/images/'

// ***** REMOVE THE COMMENT - upcoming line should be active 
//var images_order = unique_expfactory_id.charCodeAt() % 24  //24 ways to arrange 4 shapes
var unique_expfactory_id = window.location.pathname.split('/')[3]
var images_order = unique_expfactory_id.charCodeAt() % 24 
var trial_order = unique_expfactory_id.charCodeAt() % 4
trial_order = trial_order % 2

var permArr = [],
  usedChars = [];
  
var shapes_temp = ['moon.png','oval.png','rectangle.png','trapezoid.png']
function permute(input) {
  var i, ch;
  for (i = 0; i < input.length; i++) {
    ch = input.splice(i, 1)[0];
    usedChars.push(ch);
    if (input.length === 0) {
      permArr.push(usedChars.slice());
    }
    permute(input);
    input.splice(i, 0, ch);
    usedChars.pop();
  }
  return permArr
}

var images_temp = permute(shapes_temp)[images_order]
var images = [prefix + images_temp[0], prefix + images_temp[1], prefix + images_temp[2], prefix + images_temp[3]]

var screen_resolution = screen.width + "x" + screen.height


//images = [images[0], images[1], images[2], images[3]]

jsPsych.pluginAPI.preloadImages(images);
/* Stop signal delay in ms */
var SSD = 250
var stop_signal =
	'<div class = coverbox></div><div class = stopbox><div class = centered-shape id = stop-signal></div><div class = centered-shape id = stop-signal-inner></div></div>'

var fileTypePNG = ".png'></img>"
var preFileType = "<img class = stim src='/static/experiments/stop_signal__dartmouth_followup/images/"
var stop_signal = '<div class = coverbox></div><div class = shapebox>'+ preFileType  + 'stopSignal' + fileTypePNG + '</div>'



/* Instruction Prompt */
var possible_responses = [
	["left arrow", 37],
	["down arrow", 40]
]
var choices = [possible_responses[0][1], possible_responses[1][1]]



var prompt_text = '<ul list-text>' + 
					'<li><div class = prompt_container><img class = prompt_stim src = ' + images[0] + '></img>' + possible_responses[0][0] + '</div></li><br><br>' +
					'<li><div class = prompt_container><img class = prompt_stim src = ' + images[1] + '></img>' + possible_responses[0][0] + '</div></li><br><br>' +
					'<li><div class = prompt_container><img class = prompt_stim src = ' + images[2] + '></img>' + possible_responses[1][0] + '</div></li><br><br>' +
					'<li><div class = prompt_container><img class = prompt_stim src = ' + images[3] + '></img>' + possible_responses[1][0] + '</div></li><br><br>' +
				  '</ul>'

/* Global task variables */
var current_trial = 0
var rtMedians = []
var stopAccMeans =[]	
var RT_thresh = 1000
var rt_diff_thresh = 75
var missed_response_thresh = 0.1
var accuracy_thresh = 0.8
var stop_thresh = 0.2	


var practice_len = 20 //20
var practice_num_blocks = 2
var practice_block_len = practice_len/practice_num_blocks

var exp_len = 125 //125
var test_num_blocks = 3
var test_block_len = exp_len/test_num_blocks


var test_block_data = []

/* Define stims */
var stims = [{
	stimulus: '<div class = coverbox></div><div class = shapebox><img class = stim src = ' + images[0] + '></img></div>',
	data: {
		correct_response: possible_responses[0][1],
		trial_id: 'stim',
	}
}, {
	stimulus: '<div class = coverbox></div><div class = shapebox><img class = stim src = ' + images[1] + '></img></div>',
	data: {
		correct_response: possible_responses[0][1],
		trial_id: 'stim',
	}
}, {
	stimulus: '<div class = coverbox></div><div class = shapebox><img class = stim src = ' + images[2] + '></img></div>',
	data: {
		correct_response: possible_responses[1][1],
		trial_id: 'stim',
	}
}, {
	stimulus: '<div class = coverbox></div><div class = shapebox><img class = stim src = ' + images[3] + '></img></div>',
	data: {
		correct_response: possible_responses[1][1],
		trial_id: 'stim',
	}
}]


//set up ITIs

var test_ITIs_list = [[0.0,0.408,0.408,0.0,0.0,0.136,0.544,0.136,0.0,0.0,0.0,0.408,0.408,0.0,0.272,0.0,0.272,0.272,0.272,0.136,0.272,0.272,0.136,0.0,0.272,0.544,0.272,0.136,0.0,0.0,0.0,0.0,0.272,0.0,0.0,0.0,0.0,0.136,0.0,0.0,0.0,0.0,0.272,0.136,0.272,0.0,0.136,0.136,0.0,0.136,0.136,0.136,0.408,0.272,0.0,0.68,0.0,0.272,0.0,0.0,0.0,0.0,0.272,0.816,0.0,0.136,0.136,0.272,0.136,0.136,0.544,0.136,0.0,0.272,0.136,0.136,0.0,0.136,0.0,0.0,0.0,0.136,0.0,0.0,0.136,0.136,0.0,0.272,0.0,0.136,0.0,0.0,0.136,0.272,0.136,0.272,0.68,0.272,0.272,0.0,0.272,0.136,0.0,0.136,0.0,0.136,0.272,0.0,0.136,0.408,0.0,0.952,0.136,0.136,0.272,0.0,0.0,0.0,0.68,0.272,0.272,0.0,0.272,0.0,0.136],
					  [0.136,0.272,0.68,0.272,0.272,0.0,0.272,0.136,0.0,0.136,0.0,0.136,0.272,0.0,0.136,0.408,0.0,0.952,0.136,0.136,0.272,0.0,0.0,0.0,0.68,0.272,0.272,0.0,0.272,0.0,0.136,0.0,0.408,0.408,0.0,0.0,0.136,0.544,0.136,0.0,0.0,0.0,0.408,0.408,0.0,0.272,0.0,0.272,0.272,0.272,0.136,0.272,0.272,0.136,0.0,0.272,0.544,0.272,0.136,0.0,0.0,0.0,0.0,0.272,0.0,0.0,0.0,0.0,0.136,0.0,0.0,0.0,0.0,0.272,0.136,0.272,0.0,0.136,0.136,0.0,0.136,0.136,0.136,0.408,0.272,0.0,0.68,0.0,0.272,0.0,0.0,0.0,0.0,0.272,0.816,0.0,0.136,0.136,0.272,0.136,0.136,0.544,0.136,0.0,0.272,0.136,0.136,0.0,0.136,0.0,0.0,0.0,0.136,0.0,0.0,0.136,0.136,0.0,0.272,0.0,0.136,0.0,0.0,0.136,0.272],
					  [0.816,0.0,0.136,0.136,0.272,0.136,0.136,0.544,0.136,0.0,0.272,0.136,0.136,0.0,0.136,0.0,0.0,0.0,0.136,0.0,0.0,0.136,0.136,0.0,0.272,0.0,0.136,0.0,0.0,0.136,0.272,0.136,0.272,0.68,0.272,0.272,0.0,0.272,0.136,0.0,0.136,0.0,0.136,0.272,0.0,0.136,0.408,0.0,0.952,0.136,0.136,0.272,0.0,0.0,0.0,0.68,0.272,0.272,0.0,0.272,0.0,0.136,0.0,0.408,0.408,0.0,0.0,0.136,0.544,0.136,0.0,0.0,0.0,0.408,0.408,0.0,0.272,0.0,0.272,0.272,0.272,0.136,0.272,0.272,0.136,0.0,0.272,0.544,0.272,0.136,0.0,0.0,0.0,0.0,0.272,0.0,0.0,0.0,0.0,0.136,0.0,0.0,0.0,0.0,0.272,0.136,0.272,0.0,0.136,0.136,0.0,0.136,0.136,0.136,0.408,0.272,0.0,0.68,0.0,0.272,0.0,0.0,0.0,0.0,0.272],
					  [0.272,0.0,0.0,0.0,0.0,0.136,0.0,0.0,0.0,0.0,0.272,0.136,0.272,0.0,0.136,0.136,0.0,0.136,0.136,0.136,0.408,0.272,0.0,0.68,0.0,0.272,0.0,0.0,0.0,0.0,0.272,0.816,0.0,0.136,0.136,0.272,0.136,0.136,0.544,0.136,0.0,0.272,0.136,0.136,0.0,0.136,0.0,0.0,0.0,0.136,0.0,0.0,0.136,0.136,0.0,0.272,0.0,0.136,0.0,0.0,0.136,0.272,0.136,0.272,0.68,0.272,0.272,0.0,0.272,0.136,0.0,0.136,0.0,0.136,0.272,0.0,0.136,0.408,0.0,0.952,0.136,0.136,0.272,0.0,0.0,0.0,0.68,0.272,0.272,0.0,0.272,0.0,0.136,0.0,0.408,0.408,0.0,0.0,0.136,0.544,0.136,0.0,0.0,0.0,0.408,0.408,0.0,0.272,0.0,0.272,0.272,0.272,0.136,0.272,0.272,0.136,0.0,0.272,0.544,0.272,0.136,0.0,0.0,0.0,0.0]]
var test_ITIs = test_ITIs_list[trial_order]


// set up stim order based on optimized trial sequence --- PRACTICE
var practice_stim_index = [0,0,1,0,1,0,0,1,0,1,1,0,0,1,0,0,1,1,1,0,1,0,0,0,1,0,0,1,1,0,1,0,0,1,0,1,0,1,1,0]
var practice_trials = []
var practice_go_stims = jsPsych.randomization.repeat(stims, practice_len*0.6 / 4)
var practice_stop_stims = jsPsych.randomization.repeat(stims, practice_len*0.4 / 4)
for (var i=0; i<practice_stim_index.length; i++) {
	var stim = {}
	if (practice_stim_index[i] === 0) {
		stim = jQuery.extend({},practice_go_stims.shift())
		stim.SS_trial_type = 'go'
	} else {
		stim = jQuery.extend({},practice_stop_stims.shift())
		stim.SS_trial_type = 'stop'
	} 
	practice_trials.push(stim)
	// refill if necessary
	if (practice_go_stims.length === 0) {
		practice_go_stims = jsPsych.randomization.repeat(stims, practice_len*0.6 / 4)
	} 
	if (practice_stop_stims.length === 0) {
		practice_stop_stims = jsPsych.randomization.repeat(stims, practice_len*0.4 / 4)
	} 
}

var practice_blocks = []
for (b=0; b<practice_num_blocks; b++) {
	practice_blocks.push(practice_trials.slice(practice_block_len*b, (practice_block_len*(b+1))))
}



// set up stim order based on optimized trial sequence --- TEST
var stim_index_list = [[1,0,0,0,0,0,1,1,1,1,1,0,0,0,0,0,1,0,1,1,1,0,0,0,0,0,1,1,0,1,1,1,0,0,1,0,0,0,0,1,0,1,1,0,0,1,0,0,0,0,0,1,0,0,1,1,0,0,1,0,0,0,0,1,1,0,1,0,0,0,1,0,1,1,1,0,1,0,0,1,0,0,1,1,1,1,0,1,0,0,0,1,0,0,0,0,1,0,0,0,1,0,0,0,0,1,0,1,1,0,1,0,0,0,1,0,1,1,0,0,0,0,1,1,0],
					   [0,0,1,0,0,0,1,0,0,0,0,1,0,1,1,0,1,0,0,0,1,0,1,1,0,0,0,0,1,1,0,1,0,0,0,0,0,1,1,1,1,1,0,0,0,0,0,1,0,1,1,1,0,0,0,0,0,1,1,0,1,1,1,0,0,1,0,0,0,0,1,0,1,1,0,0,1,0,0,0,0,0,1,0,0,1,1,0,0,1,0,0,0,0,1,1,0,1,0,0,0,1,0,1,1,1,0,1,0,0,1,0,0,1,1,1,1,0,1,0,0,0,1,0,0],
					   [1,1,0,1,0,0,0,1,0,1,1,1,0,1,0,0,1,0,0,1,1,1,1,0,1,0,0,0,1,0,0,0,0,1,0,0,0,1,0,0,0,0,1,0,1,1,0,1,0,0,0,1,0,1,1,0,0,0,0,1,1,0,1,0,0,0,0,0,1,1,1,1,1,0,0,0,0,0,1,0,1,1,1,0,0,0,0,0,1,1,0,1,1,1,0,0,1,0,0,0,0,1,0,1,1,0,0,1,0,0,0,0,0,1,0,0,1,1,0,0,1,0,0,0,0],
					   [0,0,1,0,0,0,0,1,0,1,1,0,0,1,0,0,0,0,0,1,0,0,1,1,0,0,1,0,0,0,0,1,1,0,1,0,0,0,1,0,1,1,1,0,1,0,0,1,0,0,1,1,1,1,0,1,0,0,0,1,0,0,0,0,1,0,0,0,1,0,0,0,0,1,0,1,1,0,1,0,0,0,1,0,1,1,0,0,0,0,1,1,0,1,0,0,0,0,0,1,1,1,1,1,0,0,0,0,0,1,0,1,1,1,0,0,0,0,0,1,1,0,1,1,1]]

var test_stim_index = stim_index_list[trial_order]
var test_trials = []
var test_go_stims = jsPsych.randomization.repeat(stims, exp_len*0.6 / 4)
var test_stop_stims = jsPsych.randomization.repeat(stims, exp_len*0.4 / 4)
for (var i=0; i<test_stim_index.length; i++) {
	var stim = {}
	if (test_stim_index[i] === 0) {
		stim = jQuery.extend({},test_go_stims.shift())
		stim.SS_trial_type = 'go'
	} else {
		stim = jQuery.extend({},test_stop_stims.shift())
		stim.SS_trial_type = 'stop'
	} 
	test_trials.push(stim)
	// refill if necessary
	if (test_go_stims.length === 0) {
		test_go_stims = jsPsych.randomization.repeat(stims, exp_len*0.6 / 4)
	} 
	if (test_stop_stims.length === 0) {
		test_stop_stims = jsPsych.randomization.repeat(stims, exp_len*0.4 / 4)
	} 
}

var test_blocks = []
for (b=0; b<test_num_blocks; b++) {
	test_blocks.push(test_trials.slice(test_block_len*b, (test_block_len*(b+1))))
}

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


/* define static blocks  */
var start_practice_stop_block = {
	type: 'poldrack-instructions',
	data: {
		trial_id: "practice_stop_instructions"
	},
	pages:[
		'<div class = instructbox>'+
			'<p class = block-text>We will now begin the second practice.  You will see the same shapes displayed on the screen one at a time and should respond by pressing the corresponding button  (Scroll down, if needed): ' + prompt_text + '</p>' +
			
			'<p class = block-text>As with the last practice, you should respond to the shapes as quickly as you can, without sacrificing accuracy.</p>'+
			
		'</div>',	
		
		'<div class = instructbox>'+		
			'<p class = block-text>On some trials, a red star will appear.  When the red star appears, you should not respond to the shape.</p>'+
			
				'<p class = block-text>If the star appears on a trial, and you try your best to withhold your response, you will find that you will be able to stop sometimes but not always.</p>'+
			
				'<p class = block-text>Please do not slow down your responses to the shapes in order to wait for the red star.  Continue to respond as quickly and as accurately as possible.</p>'+
				
				'<p class = block-text>On the next page, you will see an example of what the red star around the shape will look like. Please carefully understand the instructions before you move on as you will not be able to go back.</p>'+
			 
		'</div>',	
	],
	allow_keys: false,
	show_clickable_nav: true,
	timing_post_trial: 500,
	on_finish: function() {
  	exp_stage = 'practice_stop'
    current_trial = 0
  }
};


var start_test_block = {
	type: 'poldrack-instructions',
	data: {
		trial_id: "test_instructions"
	},
	pages:[
		'<div class = instructbox>'+
			'<p class = block-text>We will now begin test.  As a reminder, in this task you will see shapes displayed on the screen one at a time and should respond by pressing the corresponding button  (Scroll down, if needed):' + prompt_text + '</p>' +
		
			'<p class = block-text>You should respond to the shapes as quickly as you can, without sacrificing accuracy.</p>'+
			
		'</div>',	
		
		'<div class = instructbox>'+		
			'<p class = block-text>On some trials, a red star will appear.  When the red star appears, you should not respond to the shape.</p>'+
			
			'<p class = block-text>If the star appears on a trial, and you try your best to withhold your response, you will find that you will be able to stop sometimes but not always.</p>'+
		
			'<p class = block-text>Please do not slow down your responses to the shapes in order to wait for the red star.  Continue to respond as quickly and as accurately as possible.</p>'+
		 
		'</div>',	
	],
	allow_keys: false,
	show_clickable_nav: true,
	timing_post_trial: 500,
	on_finish: function() {
  		exp_stage = 'test'
    	current_trial = 0
    }
};

 var end_block = {
	type: 'poldrack-single-stim',
	stimulus: '<div class = centerbox><p class = center-text style = "font-size: 28px"> Thanks for completing the experiment! <br><br>Press <i>enter</i> to continue.</p></div>',
	is_html: true,
	choices: [13],
	timing_response: 180000,
	response_ends_trial: true,
	data: {
		trial_id: "end",
	},
	timing_post_trial: 0,
	on_finish: function(){
		assessPerformance()
		evalAttentionChecks()
    }
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
   timing_response: 360000,
   columns: [60,60]
};

var instructions_block = {
	type: 'poldrack-instructions',
	data: {
		trial_id: "instruction"
	},
	pages:[
		'<div class = instructbox>'+			
			'<p class = block-text>In this task you will see shapes displayed on the screen one at a time and should respond by pressing the corresponding button.</p>' +
			
			'<p class = block-text>You should respond to the shapes as quickly as you can, without sacrificing accuracy.</p>'+
			
			'<p class = block-text> The correct keys are as follows (Scroll down, if needed): ' + prompt_text + '</p>'+
		'</div>'		
	],
	allow_keys: false,
	show_clickable_nav: true,
	timing_post_trial: 500,
};

var welcome_block = {
	type: 'poldrack-text',
	data: {
		trial_id: "welcome"
	},
	timing_response: -1,
	text: '<div class = centerbox>'+
	'<p class = center-block-text>Welcome to the experiment. This experiment will take about 10 minutes.</p>'+
	'<p class = center-block-text>Press<i> enter</i> to continue.</p>'+
	'</div>',
	cont_key: [13],
	timing_post_trial: 0
};

var attn_check_start_test = {
	type: 'poldrack-text',
	data: {
		trial_id: "welcome"
	},
	timing_response: 180000,
	text: '<div class = centerbox>'+
	'<p class = center-block-text>Press<i> enter</i> to continue to the task.</p>'+
	'</div>',
	cont_key: [13],
	timing_post_trial: 0
};


/* set up feedback blocks */
var test_feedback_block = {
  type: 'poldrack-single-stim',
  stimulus: getTestFeedback,
  is_html: true,
  choices: [13],
  timing_stim: 180000, 
  timing_response: 180000,
  response_ends_trial: true,
  data: {
    trial_id: "test_feedback"
  },
  timing_post_trial: 1000,
  on_finish: function() {
  	test_block_data = []
  }
};


var delay_trial_block = {
	type: 'poldrack-single-stim',
	stimulus: '',
	is_html: true,
	choices: [13],
	timing_response: 1000,
	response_ends_trial: false,
	data: {
		trial_id: "end",
	},
	timing_post_trial: 0,
};

/* set up feedback blocks */
var practice_feedback_block = {
  type: 'poldrack-single-stim',
  stimulus: getPracticeFeedback,
  is_html: true,
  choices: [13],
  timing_stim: 180000, 
  timing_response: 180000,
  response_ends_trial: true,
  data: {
    trial_id: "practice_feedback"
  },
  timing_post_trial: 1000,
  on_finish: function() {
  	test_block_data = []
  }
};

// set up practice practice_trials
var practice_practice_trials = getPracticepractice_trials()
var practice_loop = {
  timeline: practice_practice_trials,
  loop_function: function(data) {
    practice_repeats+=1
    total_practice_trials = 0
    correct_practice_trials = 0
    for (var i = 0; i < data.length; i++) {
      if (data[i].trial_id == 'stim') {
        total_practice_trials+=1
        if (data[i].correct === true) {
          correct_practice_trials+=1
        }
      }
    }
    if (correct_practice_trials/total_practice_trials > 0.75 || practice_repeats == 3) {
    	current_trial = 0
      return false
    } else {
      practice_practice_trials = getPracticepractice_trials()
      return true
    }
  }
};


var fileTypePNG = ".png'></img>"
var preFileType = "<img class = center src='/static/experiments/stop_signal__dartmouth_followup/images/"
var stop_signal = '<div class = coverbox></div><div class = picture_box>'+ preFileType  + 'stopSignal' + fileTypePNG + '</div>'

var star_practice_block = {
	type: 'poldrack-single-stim',
	stimulus: '<p class = block-text style = "font-color: white; font-size: 20px;">This is what a trial will look like if a red star appears around the shape.  If you cannot see the red star around the shape, please zoom out.  Press <strong> enter </strong> to continue to practice.</p>' +
			  stop_signal +
			  '<div class = coverbox></div><div class = shapebox><img class = stim src = ' + images[0] + '></img></div>',
	is_html: true,
	choices: [13],
	timing_response: -1,
	response_ends_trial: true,
	data: {
		trial_id: "end",
	},
	timing_post_trial: 0
};


var stop_signal_block_test_img = {
	type: 'stop-signal',
	stimulus: '<div class = coverbox></div><div class = shapebox><img class = stim src = ' + images[0] + '></img></div>', 
	SS_stimulus: stop_signal,
	is_html: true,
	choices: choices,
	timing_stim: -1,
	timing_response: -1,
	SSD: getSSD,
	timing_SS: -1,
	timing_post_trial: 0,
	SS_trial_type: 'stop',
	response_ends_trial: true
}

/* ************************************ */
/* Set up experiment */
/* ************************************ */

var stop_signal__dartmouth_followup_experiment = []

stop_signal__dartmouth_followup_experiment.push(welcome_block);

stop_signal__dartmouth_followup_experiment.push(instructions_block);
stop_signal__dartmouth_followup_experiment.push(delay_trial_block)
stop_signal__dartmouth_followup_experiment.push(practice_loop);

stop_signal__dartmouth_followup_experiment.push(start_practice_stop_block)
stop_signal__dartmouth_followup_experiment.push(star_practice_block)

/* Test blocks */
// Loop through each trial within the block
var practiceStopTrials = []
practiceStopTrials.push(delay_trial_block)
for (i = 0; i < practice_block_len; i++) {
	var stop_signal_block = {
		type: 'stop-signal',
		stimulus: getStim, 
		SS_stimulus: stop_signal,
		is_html: true,
		choices: choices,
		timing_stim: 850,
		timing_response: practice_get_ITI,
		SSD: getSSD,
		timing_SS: 500,
		timing_post_trial: 0,
		SS_trial_type: getSSTrialType,
		on_finish: function(data) {
			correct = false
			if (data.key_press == correct_response) {
				correct = true
			}
			updateSSD(data)
			jsPsych.data.addDataToLastTrial({
				exp_stage: 'practice_stop',
				trial_num: current_trial,
				correct: correct,
				trial_id: 'practice_stop_trial'
			})
			current_trial += 1
			test_block_data.push(data)
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
		timing_response: 500,
		response_ends_trial: false, 
	};
	
	practiceStopTrials.push(stop_signal_block)
	practiceStopTrials.push(categorize_block)
}

var practiceStopCount = 0
var practiceStopNode = {
	timeline: practiceStopTrials,
	loop_function: function(data) {
		practiceStopCount = practiceStopCount + 1
		current_trial = 0
		
	}
}

stop_signal__dartmouth_followup_experiment.push(practiceStopNode)
stop_signal__dartmouth_followup_experiment.push(start_test_block)
stop_signal__dartmouth_followup_experiment.push(delay_trial_block)
/* Test blocks */
// Loop through each trial within the block
for (x = 0; x < test_num_blocks; x++) {
	var stop_signal_block = {
		type: 'stop-signal',
		timeline: test_blocks[x], 
		SS_stimulus: stop_signal,
		is_html: true,
		choices: choices,
		timing_stim: 850,
		timing_response: test_get_ITI,
		SSD: getSSD,
		timing_SS: 500,
		timing_post_trial: 0,
		on_finish: function(data) {
			correct = false
			if (data.SS_trial_type == 'stop'){
				data.correct_response = -1
			}
			
			if (data.key_press == data.correct_response) {
				correct = true
			}
			updateSSD(data)
			jsPsych.data.addDataToLastTrial({
				exp_stage: 'test',
				trial_num: current_trial,
				correct: correct,
				trial_id: 'test_trial',
				condition: data.SS_trial_type
			})
			current_trial += 1
			test_block_data.push(data)
		}
	}
	stop_signal__dartmouth_followup_experiment.push(stop_signal_block)
	if ((x+1)<test_num_blocks) {
		stop_signal__dartmouth_followup_experiment.push(test_feedback_block)
		stop_signal__dartmouth_followup_experiment.push(attention_node)
		stop_signal__dartmouth_followup_experiment.push(attn_check_start_test)
		stop_signal__dartmouth_followup_experiment.push(delay_trial_block)
	}
}

stop_signal__dartmouth_followup_experiment.push(post_task_block)
stop_signal__dartmouth_followup_experiment.push(end_block)