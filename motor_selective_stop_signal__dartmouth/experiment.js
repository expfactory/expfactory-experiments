/* ************************************ */
/* Define helper functions */
/* ************************************ */
function addID() {
  jsPsych.data.addDataToLastTrial({exp_id: 'motor_selective_stop_signal__dartmouth'})
}

var practice_ITIs = [0.0,0.0,0.1,0.3,0.7,0.0,0.1,0.3,0.0,0.1,0.3,0.2,0.1,0.4,0.3,0.5,0.3,0.2,0.5,0.3,0.1,0.0,0.4,0.0,0.1,0.0,0.1,0.1,0.0,0.6,0.0,0.0,0.1,0.3,0.7,0.0,0.1,0.3,0.0,0.1,0.3,0.2,0.1,0.4,0.3,0.5,0.3,0.2,0.5,0.3,0.1,0.0,0.4,0.0,0.1,0.0,0.1,0.1,0.0,0.6]
var test_ITIs = [0.0,0.0,0.1,0.3,0.7,0.0,0.1,0.3,0.0,0.1,0.3,0.2,0.1,0.4,0.3,0.5,0.3,0.2,0.5,0.3,0.1,0.0,0.4,0.0,0.1,0.0,0.1,0.1,0.0,0.6,0.1,0.0,0.1,0.2,0.0,0.0,0.5,0.1,0.5,0.2,0.0,0.1,0.4,0.2,0.0,0.1,0.7,0.0,0.7,0.2,0.0,0.1,0.2,0.0,0.2,0.5,0.0,0.1,0.2,0.1,0.0,0.3,0.2,0.4,0.0,0.4,0.1,0.0,0.0,0.0,0.1,0.3,0.1,0.2,0.2,0.1,0.0,0.3,0.3,0.0,0.0,0.2,0.1,0.0,0.9,0.4,0.0,0.2,0.6,0.2,0.0,0.0,0.3,0.0,0.1,0.1,0.0,0.1,0.0,0.2,0.0,0.1,0.2,0.0,0.0,0.6,0.0,1.2,0.1,0.1,0.1,0.2,0.3,0.1,0.0,0.0,0.8,0.2,0.1,0.0,1.0,0.7,0.3,0.1,0.3,0.1,0.0,0.2,0.1,0.4,0.0,0.0,0.2,0.0,0.3,0.0,0.1,0.0,0.3,0.3,0.1,0.1,0.0,0.2,0.0,0.2,0.4,0.2,0.1,0.0,0.3,0.0,0.0,0.1,0.0,0.4,0.1,0.2,0.1,0.0,0.0,0.0,0.0,0.1,1.1,0.3,0.5,0.5,0.4,0.2,0.0,0.1,0.2,0.8,0.1,0.0,0.1,0.1,0.1,0.1,0.1,0.0,0.1,0.2,0.1,0.6,0.3,0.5,0.0,0.0,0.6,0.1,0.0,0.0,0.0,0.1,0.4,0.5,0.0,0.5,0.0,0.1,0.1,0.3,0.0,0.0,0.0,0.1,0.4,0.1,0.0,0.1,0.1,0.6,0.2,0.1,0.4,0.0,0.0,0.0,0.2,0.1,0.0,0.1,0.2,0.1,0.0,0.0,0.1,0.1,0.1,0.7,0.0,0.1,0.0,0.2,0.1,0.3,0.3,0.0,0.0,0.5,0.1,0.0,0.2,0.0,0.1,0.0,0.0,0.0]

var practice_get_ITI = function() {
  return 2250 + practice_ITIs.shift()*1000
 }

var test_get_ITI = function() {
  return 2250 + test_ITIs.shift()*1000
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
	
	console.log(experiment_data.length)
	
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
	console.log('trial count = ' + trial_count)
	console.log('correct = ' + correct)
	console.log('missed_count = ' + missed_count)

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
	console.log('missed_percent = ' + missed_percent)
	console.log('avg_rt = ' + avg_rt)
	console.log('responses_ok = ' + responses_ok)
	console.log('accuracy = ' + accuracy)
}

var randomDraw = function(lst) {
	var index = Math.floor(Math.random() * (lst.length))
	return lst[index]
}

var permute = function(input) {
    var permArr = [],
        usedChars = [];
    return (function main() {
        for (var i = 0; i < input.length; i++) {
            var ch = input.splice(i, 1)[0];
            usedChars.push(ch);
            if (input.length === 0) {
                permArr.push(usedChars.slice());
            }
            main();
            input.splice(i, 0, ch);
            usedChars.pop();
        }
        return permArr;
    })();
}


/* Staircase procedure. After each successful stop, make the stop signal delay longer (making stopping harder) */
var updateSSD = function(data) {
	if (data.condition == 'stop') {
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

	test_feedback_text = "<br>Done with a practice block. Please take this time to read your feedback and to take a short break! (Scroll Down)"
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
		test_feedback_text += '</p><p class = block-text>Your accuracy is too low. Remember, the correct keys are as follows: ' + prompt_text
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

	test_feedback_text = "<br>Done with a test block. Please take this time to read your feedback and to take a short break! Remember, do not respond if a star appears and if you were going to respond with your " + stop_response[0] + ". (Scroll Down)"
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

var getPracticeTrials = function() {
	var practice = []
	var trials = jsPsych.randomization.repeat(stimuli, practice_len/4)
	for (i=0; i<trials.length; i++) {
		//trials[i]['key_answer'] = trials[i].data.correct_response
		trials[i].key_answer = trials[i].data.correct_response
	}
	var practice_block = {
		type: 'poldrack-categorize',
		timeline: trials, 
		is_html: true,
		choices: choices,
		timing_stim: 850,
		timing_response: 1850,
		correct_text: '<div class = feedbackbox><div style="color:#4FE829"; class = center-text>Correct!</p></div>',
		incorrect_text: '<div class = feedbackbox><div style="color:red"; class = center-text>Incorrect</p></div>',
		timeout_message: '<div class = feedbackbox><div class = center-text>Too Slow</div></div>',
		show_stim_with_feedback: false,
		timing_feedback_duration: 500,
		timing_post_trial: 250,
		on_finish: function(data) {
			jsPsych.data.addDataToLastTrial({
				exp_stage: 'practice',
				trial_num: current_trial,
			})
			current_trial += 1
			test_block_data.push(data)
			console.log('Trial: ' + current_trial +
              '\nCorrect Response? ' + data.correct + ', RT: ' + data.rt)
		}
	}
	practice.push(practice_block)
	practice.push(practice_feedback_block)
	return practice
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
var prefix = '/static/experiments/motor_selective_stop_signal__dartmouth/images/'
var images = jsPsych.randomization.repeat([prefix + 'circle.png', prefix + 'Lshape.png', prefix + 'rhombus.png', prefix + 'triangle.png'],1)

images = [images[0], images[1], images[2], images[3]]
jsPsych.pluginAPI.preloadImages(images);

/* Stop signal delay in ms */
var SSD = 250
var stop_signal =
	'<div class = coverbox></div><div class = stopbox><div class = centered-shape id = stop-signal></div><div class = centered-shape id = stop-signal-inner></div></div>'

/* Instruction Prompt */
//commented line below - new permutation_index is defined by expfactory unique id (keeps responses consistent across batteries)
//var choice_order = unique_expfactory_id.charCodeAt() % 2

var possible_responses = [
	["right index finger (left arrow)", 37],
	["right middle finger (down arrow)", 40]
]

var choices = [possible_responses[0][1], possible_responses[1][1]]

var prompt_text = '<ul list-text>' + 
					'<li><div class = prompt_container><img class = prompt_stim src = ' + images[0] + '></img>' + possible_responses[0][0] + '</div></li><br><br>' +
					'<li><div class = prompt_container><img class = prompt_stim src = ' + images[1] + '></img>' + possible_responses[0][0] + '</div></li><br><br>' +
					'<li><div class = prompt_container><img class = prompt_stim src = ' + images[2] + '></img>' + possible_responses[1][0] + '</div></li><br><br>' +
					'<li><div class = prompt_container><img class = prompt_stim src = ' + images[3] + '></img>' + possible_responses[1][0] + '</div></li>' +
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
var motor_thresh = 0.6
var stop_response = possible_responses[Math.round(Math.random( ))]
var ignore_response = possible_responses[randomDraw([0,1].filter(function(y) {return $.inArray(y, [stop_response]) == -1}))]
var practice_len = 20

var test_block_data = [] // records the data in the current block to calculate feedback

var practice_block_len = 30 //30
var num_practice_blocks = 1 //2
var practice_stop_len = practice_block_len * num_practice_blocks

var test_block_len = 50
var num_test_blocks = 5 //5
var test_len = test_block_len*num_test_blocks

/* Define Stims */
var stimuli = [{
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

// set up stim order based on optimized trial sequence PRACTICE STOP
var practice_stim_index = [0,0,2,1,0,1,0,0,2,2,2,2,0,0,0,1,1,2,0,0,1,0,0,1,0,0,0,0,0,2,
						   1,0,2,1,0,1,0,0,2,0,2,2,0,2,0,0,1,2,0,0,1,0,0,1,0,0,0,0,0,2]
var practice_stims = []
var practice_go_stims = jsPsych.randomization.repeat(stimuli, practice_stop_len*0.6 / 4)
var practice_stop_stims = jsPsych.randomization.repeat(stimuli.slice(0,2), practice_stop_len*0.2 / 2)
var practice_ignore_stims = jsPsych.randomization.repeat(stimuli.slice(2,4), practice_stop_len*0.2 / 2)
for (var i=0; i<practice_stim_index.length; i++) {
	var stim = {}
	if (practice_stim_index[i] === 0) {
		stim.stim = jQuery.extend({}, practice_go_stims.shift())
		stim.type = 'go'
	} else if (practice_stim_index[i] == 1) {
		stim.stim = jQuery.extend({},practice_stop_stims.shift())
		stim.type = 'stop'
	} else {
		stim.stim = jQuery.extend({},practice_ignore_stims.shift())
		stim.type = 'ignore'
	}
	practice_stims.push(stim)
	// refill if necessary
	if (practice_go_stims.length === 0) {
		practice_go_stims = jsPsych.randomization.repeat(stimuli, practice_stop_len*0.6 / 4)
	} 
	if (practice_stop_stims.length === 0) {
		practice_stop_stims = jsPsych.randomization.repeat(stimuli.slice(0,2), practice_stop_len*0.2 / 2)
	} 
	if (practice_ignore_stims.length === 0) {
		practice_ignore_stims = jsPsych.randomization.repeat(stimuli.slice(2,4), practice_stop_len*0.2 / 2)
	} 
}


// set up stim order based on optimized trial sequence
var stim_index = [0,0,2,1,0,1,0,0,2,2,2,2,0,0,0,1,1,2,0,0,1,0,0,1,0,0,0,0,0,2,0,0,0,0,1,2,0,2,0,0,0,1,0,1,0,2,2,0,0,2,1,0,0,1,2,0,2,0,2,0,2,0,0,0,1,2,0,0,0,0,0,2,0,1,0,1,2,0,0,2,0,1,0,0,0,0,2,1,2,0,0,0,2,1,0,1,0,2,0,0,0,0,2,1,0,0,0,0,2,2,0,1,2,0,1,0,0,0,0,1,1,0,1,0,1,0,0,2,0,2,0,1,0,0,1,0,2,1,1,0,0,0,0,2,0,2,1,0,0,2,0,0,0,0,0,2,2,0,2,1,0,1,0,1,0,0,1,0,0,1,0,0,0,0,0,2,0,0,0,2,0,0,1,0,0,0,0,0,2,0,1,0,0,1,0,0,0,1,0,1,2,0,0,0,0,2,0,0,1,0,2,0,1,0,0,0,0,0,2,0,0,0,1,1,2,0,0,0,2,1,0,0,0,0,0,2,2,2,0,0,0,1,1,1,0,0,0,0,1,1]
var test_stims = []
var go_stims = jsPsych.randomization.repeat(stimuli, test_len*0.6 / 4)
var stop_stims = jsPsych.randomization.repeat(stimuli.slice(0,2), test_len*0.2 / 2)
var ignore_stims = jsPsych.randomization.repeat(stimuli.slice(2,4), test_len*0.2 / 2)
for (var i=0; i<stim_index.length; i++) {
	var stim = {}
	if (stim_index[i] === 0) {
		stim.stim = jQuery.extend({}, go_stims.shift())
		stim.type = 'go'
	} else if (stim_index[i] == 1) {
		stim.stim = jQuery.extend({},stop_stims.shift())
		stim.type = 'stop'
	} else {
		stim.stim = jQuery.extend({},ignore_stims.shift())
		stim.type = 'ignore'
	}
	test_stims.push(stim)
	// refill if necessary
	if (go_stims.length === 0) {
		go_stims = jsPsych.randomization.repeat(stimuli, test_len*0.6 / 4)
	} 
	if (stop_stims.length === 0) {
		stop_stims = jsPsych.randomization.repeat(stimuli.slice(0,2), test_len*0.2 / 2)
	} 
	if (ignore_stims.length === 0) {
		ignore_stims = jsPsych.randomization.repeat(stimuli.slice(2,4), test_len*0.2 / 2)
	} 
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
  type: 'poldrack-single-stim',
  stimulus: '<div class = instructbox>'+
				'<p class = block-text>We will now begin the second practice.  You will see the same shapes displayed on the screen one at a time and should respond by pressing the corresponding button:' + prompt_text + ' (Scroll Down)</p>' +
			
				'<p class = block-text>As with the last practice, you should respond to the shapes as quickly as you can, without sacrificing accuracy.</p>'+
			
				'<p class = block-text>On some trials, a red star will appear.  <strong>If the red star appears, and if you were going to respond with your ' + stop_response[0] + ', you should not respond to the shape.</strong></p>'+
				
				'<p class = block-text><strong>If the star appears and you were going to respond with your ' + ignore_response[0] + ', you can ignore the star and respond to the shape.</strong></p>'+
							
				'<p class = block-text>If the star appears and if you were going to respond with your ' + stop_response[0] + ', if you try your best to withhold your response, you will find that you will be able to stop sometimes but not always</p>'+
			
				'<p class = block-text>Please do not slow down your responses to the shapes in order to wait for the red star.  Continue to respond as quickly and as accurately as possible.</p>'+
			 
				'<p class = block-text>Press enter to begin practice.</p>' +
			'</div>',	
  is_html: true,
  choices: [13],
  response_ends_trial: true,
  timing_stim: 180000, 
  timing_response: 180000,
  data: {
    trial_id: "test_start_block"
  },
  timing_post_trial: 500,
  on_finish: function() {
  	exp_stage = 'practice_stop'
    current_trial = 0
  }
};

var start_test_block = {
  type: 'poldrack-single-stim',
  stimulus: '<div class = instructbox>'+
				'<p class = block-text>We will now begin test.  As a reminder, in this task you will see shapes displayed on the screen one at a time and should respond by pressing the corresponding button:' + prompt_text + ' (Scroll Down)</p>' +
			
				'<p class = block-text>You should respond to the shapes as quickly as you can, without sacrificing accuracy.</p>'+
			
				'<p class = block-text>On some trials, a red star will appear.  If the red star appears, and if you were going to respond with your ' + stop_response[0] + ', you should not respond to the shape.</p>'+
				
				'<p class = block-text>If the star appears and you were going to respond with your ' + ignore_response[0] + ', you can ignore the star and respond to the shape.</p>'+
							
				'<p class = block-text>If the star appears and if you were going to respond with your ' + stop_response[0] + ', if you try your best to withhold your response, you will find that you will be able to stop sometimes but not always</p>'+
				
				'<p class = block-text>Please do not slow down your responses to the shapes in order to wait for the red star.  Continue to respond as quickly and as accurately as possible.</p>'+
			 
				'<p class = block-text>Press enter to begin test.</p>'+
			'</div>',	
  is_html: true,
  choices: [13],
  response_ends_trial: true,
  timing_stim: 180000, 
  timing_response: 180000,
  data: {
    trial_id: "test_start_block"
  },
  timing_post_trial: 500,
  on_finish: function() {
  	exp_stage = 'test'
    current_trial = 0
  }
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

 var end_block = {
	type: 'poldrack-single-stim',
	stimulus: '<div class = centerbox><div class = center-text><i>Fin</i></div></div>',
	is_html: true,
	choices: [32],
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
			
			'<p class = block-text> The correct keys are as follows (scroll down): ' + prompt_text + '</p>'+
		'</div>'		
	],
	allow_keys: false,
	show_clickable_nav: true,
	timing_post_trial: 500,
};


// set up practice trials
var practice_trials = getPracticeTrials()
var practice_loop = {
  timeline: practice_trials,
  loop_function: function(data) {
    practice_repeats+=1
    total_trials = 0
    correct_trials = 0
    for (var i = 0; i < data.length; i++) {
      if (data[i].trial_id == 'stim') {
        total_trials+=1
        if (data[i].correct === true) {
          correct_trials+=1
        }
      }
    }
    console.log('Practice Block Accuracy: ', correct_trials/total_trials)
    if (correct_trials/total_trials > 0.75 || practice_repeats == 3) {
    	current_trial = 0
      return false
    } else {
      practice_trials = getPracticeTrials()
      return true
    }
  }
};

/* ************************************ */
/* Set up experiment */
/* ************************************ */
var motor_selective_stop_signal__dartmouth_experiment = []
motor_selective_stop_signal__dartmouth_experiment.push(instructions_block);
motor_selective_stop_signal__dartmouth_experiment.push(practice_loop);

motor_selective_stop_signal__dartmouth_experiment.push(start_practice_stop_block)

/* Test blocks */
// Loop through the multiple blocks within each condition
for (b = 0; b < num_practice_blocks; b++) {
	stop_signal_exp_block = []

	// Loop through each trial within the block
	for (i = 0; i < practice_block_len; i++) {
		var current_stim = practice_stims.shift()
		var trial_stim = current_stim.stim.stimulus
		var trial_data = current_stim.stim.data
	    trial_data = $.extend({}, trial_data)
	    trial_data.condition = current_stim.type
	    var stop_trial = 'stop'
	    if (current_stim.type == 'go') {
	    	stop_trial = 'go'
	    }
		var stop_signal_block = {
			type: 'stop-signal',
			stimulus: trial_stim,
			SS_stimulus: stop_signal,
			SS_trial_type: stop_trial,
			data: trial_data,
			is_html: true,
			choices: choices,
			timing_stim: 850,
			timing_response: practice_get_ITI,
			SSD: getSSD,
			timing_SS: 500,
			timing_post_trial: 0,
			on_finish: function(data) {
				correct = false
				if (data.key_press == data.correct_response) {
					correct = true
				}
				updateSSD(data)
				jsPsych.data.addDataToLastTrial({
					exp_stage: "practice_stop",
					stop_response: stop_response[1],
					trial_num: current_trial,
					correct: correct,
					trial_id: 'practice_trial_with_stop',
				})
				current_trial += 1
				test_block_data.push(data)
				console.log('Trial: ' + current_trial +
              '\nCorrect Response? ' + correct + ', RT: ' + data.rt + ', SSD: ' + data.SS_delay)
			}
		}
		stop_signal_exp_block.push(stop_signal_block)
	}

	motor_selective_stop_signal__dartmouth_experiment = motor_selective_stop_signal__dartmouth_experiment.concat(
		stop_signal_exp_block)
	if ((b+1)<num_practice_blocks) {
			motor_selective_stop_signal__dartmouth_experiment.push(test_feedback_block)
	}

}

motor_selective_stop_signal__dartmouth_experiment.push(start_test_block)

for (b = 0; b < num_test_blocks; b++) {
	stop_signal_exp_block = []

	// Loop through each trial within the block
	motor_selective_stop_signal__dartmouth_experiment.push(attention_node)
	for (i = 0; i < test_block_len; i++) {
		var current_stim = test_stims.shift()
		var trial_stim = current_stim.stim.stimulus
		var trial_data = current_stim.stim.data
	    trial_data = $.extend({}, trial_data)
	    trial_data.condition = current_stim.type
	    var stop_trial = 'stop'
	    if (current_stim.type == 'go') {
	    	stop_trial = 'go'
	    }
		var stop_signal_block = {
			type: 'stop-signal',
			stimulus: trial_stim,
			SS_stimulus: stop_signal,
			SS_trial_type: stop_trial,
			data: trial_data,
			is_html: true,
			choices: choices,
			timing_stim: 850,
			timing_response: test_get_ITI,
			SSD: getSSD,
			timing_SS: 500,
			timing_post_trial: 0,
			on_finish: function(data) {
				correct = false
				if (data.key_press == data.correct_response) {
					correct = true
				}
				updateSSD(data)
				jsPsych.data.addDataToLastTrial({
					exp_stage: "test",
					stop_response: stop_response[1],
					trial_num: current_trial,
					trial_id: 'test_trial',
					correct: correct
				})
				current_trial += 1
				test_block_data.push(data)
				console.log('Trial: ' + current_trial +
              '\nCorrect Response? ' + correct + ', RT: ' + data.rt + ', SSD: ' + data.SS_delay)
			}
		}
		stop_signal_exp_block.push(stop_signal_block)
	}

	motor_selective_stop_signal__dartmouth_experiment = motor_selective_stop_signal__dartmouth_experiment.concat(
		stop_signal_exp_block)
	if ((b+1)<num_test_blocks) {
		motor_selective_stop_signal__dartmouth_experiment.push(test_feedback_block)
	}
}

motor_selective_stop_signal__dartmouth_experiment.push(post_task_block)
motor_selective_stop_signal__dartmouth_experiment.push(end_block)