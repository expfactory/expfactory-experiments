/* ************************************ */
/* Define helper functions */
/* ************************************ */
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
	/* Function to calculate the "credit_var", which is a boolean used to
	credit individual experiments in expfactory. 
	 */
	var experiment_data = jsPsych.data.getTrialsOfType('stop-signal');
	var missed_count = 0;
	var trial_count = 0;
	var rt_array = [];
	var rt = 0;
  var avg_rt = -1;
	//record choices participants made
	var choice_counts = {}
	choice_counts[-1] = 0
	for (var k = 0; k < choices.length; k++) {
    choice_counts[choices[k]] = 0
  }
	for (var i = 0; i < experiment_data.length; i++) {
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
	//calculate average rt
  if (rt_array.length !== 0) {
    avg_rt = math.median(rt_array)
  } else {
    avg_rt = -1
  }
	//calculate whether response distribution is okay
	var responses_ok = true
	Object.keys(choice_counts).forEach(function(key, index) {
		if (choice_counts[key] > trial_count * 0.85) {
			responses_ok = false
		}
	})
	credit_var = (avg_rt > 200) && responses_ok
	jsPsych.data.addDataToLastTrial({"credit_var": credit_var})
}

var randomDraw = function(lst) {
  var index = Math.floor(Math.random() * (lst.length))
  return lst[index]
}

var getPracticeFeedback = function() {
  return '<div class = centerbox><p class = block-text>' + practice_feedback_text + '</p></div>'
}
var getSelectiveFeedback = function(){
	var data_length = 0
	var global_trial = jsPsych.progress().current_trial_global
	if(jsPsych.data.getDataByTrialIndex(global_trial - 5).exp_stage == 'practice'){
		data_length = 60
	}else if (jsPsych.data.getDataByTrialIndex(global_trial - 5).exp_stage == 'test'){
		data_length = 100
	}
	var start_cut = global_trial - data_length
	var numIgnore = 0
	var ignoreRespond = 0
	for (var i = 0; i < data_length; i++){
		if(jsPsych.data.getDataByTrialIndex(start_cut + i).trial_id == 'stim' &&  jsPsych.data.getDataByTrialIndex(start_cut + i).condition == 'ignore'){
			numIgnore = numIgnore + 1
			if(jsPsych.data.getDataByTrialIndex(start_cut + i).rt != -1){
				ignoreRespond = ignoreRespond + 1
			}
		}
	}
	var ignoreRespond_percent = ignoreRespond / numIgnore
	if (ignoreRespond_percent <= selective_threshold){
      	selective_feedback_text =
          '<p class = block-text> You have been stopping to both the blue and orange stars.  Please make sure to <strong>stop your response only when the blue star appears.</strong></p><p class = block-text>Press <strong>enter</strong> to view block feedback.'
  	} else {
  		selective_feedback_text =
          '<p class = block-text>Press<strong> enter </strong>to view block feedback.'
    }
  	return '<div class = centerbox>' + selective_feedback_text + '</p></div>'
}
		
	
	

/* After each test block let the subject know their average RT and accuracy. If they succeed or fail on too many stop signal trials, give them a reminder */
var getTestFeedback = function() {
  var data = test_block_data
  var rt_array = [];
  var sum_correct = 0;
  var go_length = 0;
  var stop_length = 0;
  var num_responses = 0;
  var successful_stops = 0;
  for (var i = 0; i < data.length; i++) {
    if (data[i].SS_trial_type != 'stop') {
      go_length += 1
      if (data[i].rt != -1) {
        num_responses += 1
        rt_array.push(data[i].rt);
        if (data[i].key_press == data[i].correct_response) {
          sum_correct += 1
        }
      }
    } else {
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
  
  test_feedback_text = "<br>Done with a test block. Please take this time to read your feedback and to take a short break! Press <strong>enter</strong> to continue after you have read the feedback."
  test_feedback_text += "</p><p class = block-text><strong>Average reaction time:  " + Math.round(average_rt) + " ms. Accuracy for non-blue star trials: " + Math.round(GoCorrect_percent * 100)+ "%</strong>" 
  if (average_rt > RT_thresh || rt_diff > rt_diff_thresh) {
    test_feedback_text +=
      '</p><p class = block-text>You have been responding too slowly, please respond to each shape as quickly and as accurately as possible.'
  }
  if (missed_responses >= missed_response_thresh) {
    test_feedback_text +=
      '</p><p class = block-text><strong>We have detected a number of trials that required a response, where no response was made.  Please ensure that you are responding to each shape, unless a blue star appears.</strong>'
  }
  if (GoCorrect_percent < accuracy_thresh) {
    test_feedback_text += '</p><p class = block-text>Your accuracy is too low. Remember, the correct keys are as follows: ' + prompt_text
  }
      
  if (StopCorrect_percent < (0.5-stop_thresh) || stopAverage < 0.45){
        test_feedback_text +=
          '</p><p class = block-text><strong>Remember to try and withhold your response when you see a blue stop signal.</strong>' 
  } else if (StopCorrect_percent > (0.5+stop_thresh) || stopAverage > 0.55){
    test_feedback_text +=
      '</p><p class = block-text><strong>Remember, do not slow your responses to the shape to see if a blue star will appear before you respond.  Please respond to each shape as quickly and as accurately as possible.</strong>'
  }

  return '<div class = centerbox><p class = block-text>' + test_feedback_text + '</p></div>'
}


/* Staircase procedure. After each successful stop, make the stop signal delay longer (making stopping harder) */
var updateSSD = function(data) {
  if (data.condition == 'stop') {
    if (data.rt == -1 && SSD < 850) {
      SSD = SSD + 50
    } else if (data.rt != -1 && SSD > 0) {
      SSD = SSD - 50
    }
  }
}

var getSSD = function() {
  return SSD
}

/* These methods allow NoSSPractice and SSPractice to be randomized for each iteration
of the "while" loop */
var getNoSSPracticeStim = function() {
  practice_trial_data = NoSS_practice_list.data.pop()
  return NoSS_practice_list.stimulus.pop()
}

var getNoSSPracticeData = function() {
  return practice_trial_data
}

var getSSPracticeStim = function() {
  practice_stop_trial = practice_stop_trials.pop()
  practice_trial_data = practice_list.data.pop()
  practice_trial_data.condition = practice_stop_trial
  return practice_list.stimulus.pop()
}

var getSSPracticeData = function() {
  return practice_trial_data
}

var getSSPractice_trial_type = function() {
  if (practice_stop_trial == 'ignore') {
    return 'stop'
  } else {
    return practice_stop_trial
  }
}

var getSSPractice_stop_signal = function() {
  if (practice_stop_trial == 'ignore') {
    return ignore_signal
  } else {
    return stop_signal
  }
}

var getInstructFeedback = function() {
  return '<div class = centerbox><p class = center-block-text>' + feedback_instruct_text +
    '</p></div>'
}

/* ************************************ */
/* Define experimental variables */
/* ************************************ */
// generic task variables
var run_attention_checks = false
var attention_check_thresh = 0.65
var sumInstructTime = 0 //ms
var instructTimeThresh = 0 ///in seconds
var credit_var = true


// task specific variables
// Define and load images
var prefix = '/static/experiments/stim_selective_stop_signal/images/'
var images = [prefix + 'rectangle.png', prefix + 'oval.png', prefix + 'trapezoid.png', prefix +
  'moon.png'
]
jsPsych.pluginAPI.preloadImages(images);

/* Stop signal delay in ms */
var SSD = 250
var stop_signal =
  '<div class = stopbox><div class = centered-shape id = stop-signal></div><div class = centered-shape id = stop-signal-inner></div></div>'
var ignore_signal =
  '<div class = stopbox><div class = centered-shape id = ignore-signal></div><div class = centered-shape id = ignore-signal-inner></div></div>'

/* Instruction Prompt */
var possible_responses = [
  ["M key", 77],
  ["Z key", 90]
]
var choices = [possible_responses[0][1], possible_responses[1][1]]

var correct_responses = jsPsych.randomization.shuffle([possible_responses[0], possible_responses[0],
  possible_responses[1], possible_responses[1]
])
var tab = '&nbsp&nbsp&nbsp&nbsp'
var prompt_text = '<ul list-text><li><img class = prompt_stim src = ' + images[0] + '></img>' + tab +
  correct_responses[0][0] + '</li><li><img class = prompt_oval_stim src = ' + images[1] + '></img>' + tab +
  correct_responses[1][0] + ' </li><li><img class = prompt_stim src = ' + images[2] + '></img>   ' +
  '&nbsp&nbsp&nbsp' + correct_responses[2][0] +
  ' </li><li><img class = prompt_stim src = ' + images[3] + '></img>' + tab + correct_responses[3][0] +
  ' </li></ul>'

/* Global task variables */
var current_trial = 0
var rtMedians = []
var stopAccMeans =[]
var RT_thresh = 1000
var rt_diff_thresh = 75
var selective_threshold = 0.6;
var missed_response_thresh = 0.1
var accuracy_thresh = 0.8
var stop_thresh = 0.2
var practice_repetitions = 1
var practice_repetition_thresh = 5
var test_block_data = [] // records the data in the current block to calculate feedback
var NoSSpractice_block_len = 12
var practice_block_len = 30
var test_block_len = 50
var numblocks = 6

/* Define Stims */
var stimulus = [{
  stimulus: '<div class = shapebox><img class = stim src = ' + images[0] + '></img></div>',
  data: {
    correct_response: correct_responses[0][1],
    trial_id: 'stim'
  }
}, {
  stimulus: '<div class = shapebox><img class = stim src = ' + images[1] + '></img></div>',
  data: {
    correct_response: correct_responses[1][1],
    trial_id: 'stim'
  }
}, {
  stimulus: '<div class = shapebox><img class = stim src = ' + images[2] + '></img></div>',
  data: {
    correct_response: correct_responses[2][1],
    trial_id: 'stim'
  }
}, {
  stimulus: '<div class = shapebox><img class = stim src = ' + images[3] + '></img></div>',
  data: {
    correct_response: correct_responses[3][1],
    trial_id: 'stim'
  }
}]


var practice_trial_data = '' //global variable to track randomized practice trial data
var NoSS_practice_list = jsPsych.randomization.repeat(stimulus, NoSSpractice_block_len / 4, true)
var practice_list = jsPsych.randomization.repeat(stimulus, practice_block_len / 4, true)
var practice_stop_trials = jsPsych.randomization.repeat(['stop', 'ignore', 'go',
  'go', 'go'], practice_block_len / 5)

//setup blocks
var blocks = []
for (i = 0; i < numblocks; i++) {
  blocks.push(jsPsych.randomization.repeat(stimulus, test_block_len / 4, true))
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

/* define static blocks */
var end_block = {
  type: 'poldrack-text',
  timing_response: 180000,
  data: {
    trial_id: "end",
    exp_id: 'stim_selective_stop_signal'
  },
  text: '<div class = centerbox><p class = center-block-text>Thanks for completing this task!</p><p class = center-block-text>Press <strong>enter</strong> to continue.</p></div>',
  cont_key: [13],
  timing_post_trial: 0,
  on_finish: assessPerformance
};

var feedback_instruct_text =
  'Welcome to the experiment. This experiment will take about 22 minutes. Press <strong>enter</strong> to begin.'
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
    '<div class = centerbox><p class = block-text>In this task you will see black shapes appear on the screen one at a time. You will respond to them by pressing the "Z" and "M" keys.</p></div>',
    '<div class = centerbox><p class = block-text>Only one key is correct for each shape. The correct keys are as follows:' + prompt_text +
    '</p><p class = block-text>These instructions will remain on the screen during practice, but will be removed during the test phase.</p><p class = block-text>You should respond as quickly and accurately as possible to each shape.</p></div>',
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
        'Read through instructions too quickly.  Please take your time and make sure you understand the instructions.  Press <strong>enter</strong> to continue.'
      return true
    } else if (sumInstructTime > instructTimeThresh * 1000) {
      feedback_instruct_text =
        'Done with instructions. Press <strong>enter</strong> to continue.'
      return false
    }
  }
}

var fixation_block = {
  type: 'poldrack-single-stim',
  stimulus: '<div class = centerbox><div class = fixation>+</div></div>',
  is_html: true,
  choices: 'none',
  data: {
    trial_id: "fixation",
    exp_stage: "test"
  },
  timing_post_trial: 0,
  timing_stim: 500,
  timing_response: 500
}

/* prompt blocks are used during practice to show the instructions */

var prompt_fixation_block = {
  type: 'poldrack-single-stim',
  stimulus: '<div class = shapebox><div class = fixation>+</div></div>',
  is_html: true,
  choices: 'none',
  data: {
    trial_id: "fixation",
    exp_stage: "practice"
  },
  timing_post_trial: 0,
  timing_stim: 500,
  timing_response: 500,
  prompt: prompt_text
}

/* Initialize 'feedback text' and set up feedback blocks */
var practice_feedback_text =
  'We will now start with a practice session. In this practice  concentrate on responding quickly and accurately to each shape. Press <strong>enter</strong> to continue.'
var practice_feedback_block = {
  type: 'poldrack-text',
  data: {
    trial_id: "feedback",
    exp_stage: "practice"
  },
  timing_response: 180000,
  cont_key: [13],
  text: getPracticeFeedback
};

var selective_feedback_text = ''
var selective_feedback_block = {
  type: 'poldrack-text',
  data: {
    trial_id: "feedback",
    exp_stage: "practice"
  },
  timing_response: 180000,
  cont_key: [13],
  text: getSelectiveFeedback
};

var test_feedback_block = {
  type: 'poldrack-text',
  data: {
    trial_id: "feedback",
    exp_stage: "test"
  },
  timing_response: 180000,
  cont_key: [13],
  text: getTestFeedback,
  on_finish: function() {
    test_block_data = []
  }
};



/* ************************************ */
/* Set up experiment */
/* ************************************ */

var stim_selective_stop_signal_experiment = []
stim_selective_stop_signal_experiment.push(instruction_node);

/* Practice block w/o SS */

NoSS_practice_trials = []
NoSS_practice_trials.push(practice_feedback_block)
for (i = 0; i < NoSSpractice_block_len; i++) {
  NoSS_practice_trials.push(prompt_fixation_block)
  var stim_block = {
    type: 'poldrack-single-stim',
    stimulus: getNoSSPracticeStim,
    data: getNoSSPracticeData,
    is_html: true,
    choices: choices,
    timing_post_trial: 0,
    timing_stim: 850,
    timing_response: 1850,
    prompt: prompt_text,
    on_finish: function() {
      jsPsych.data.addDataToLastTrial({
        exp_stage: "NoSS_practice",
        trial_num: current_trial
      })
      current_trial += 1
    }
  }
  NoSS_practice_trials.push(stim_block)
}

var NoSS_practice_node = {
  timeline: NoSS_practice_trials,
  loop_function: function(data) {
    practice_repetitions += 1
    var rt_array = [];
    var sum_correct = 0;
    var go_length = 0;
    var num_responses = 0;
    for (var i = 0; i < data.length; i++) {
      if (data[i].trial_id == 'stim') {
        if (data[i].rt != -1) {
          num_responses += 1
          rt_array.push(data[i].rt);
          if (data[i].key_press == data[i].correct_response) {
            sum_correct += 1
          }
        }
        go_length += 1
      }
    }
    var average_rt = -1
    if (rt_array.length !== 0) {
      average_rt = math.median(rt_array);
    }
    var GoCorrect_percent = sum_correct / go_length;
    var missed_responses = (go_length - num_responses) / go_length
    practice_feedback_text = "</p><p class = block-text><strong>Average reaction time:  " + Math.round(average_rt) + " ms. Accuracy for non-blue star trials: " + Math.round(GoCorrect_percent * 100)+ "%</strong>" 
    if ((average_rt < RT_thresh && GoCorrect_percent > accuracy_thresh && missed_responses <
        missed_response_thresh) || practice_repetitions > practice_repetition_thresh) {
      // end the loop
      current_trial = 0
      practice_repetitions = 1
      practice_feedback_text +=
        '</p><p class = block-text>For the rest of the experiment, on some proportion of trials a blue or orange star will appear around the shape. If the star is blue, it is a "stop signal". <strong>When a blue star appears please try your best to stop your response and press nothing on that trial.  If the star is orange, please continue to respond to the shapes.</strong> </p><p class = block-text>The star will appear around the same time or shortly after the shape appears. Because of this, you will not always be able to successfully stop when a blue star appears. However, if you continue to try very hard to stop when a blue star appears, you will be able to stop sometimes but not always.</p><p class = block-text>If an orange star appears, respond as you normally would by pressing the correct key. </p><p class = block-text><strong>Please balance the requirement to respond quickly and accurately to the shapes while trying very hard to stop to the blue stop signal.</strong></p><p class = block-text>Press <strong>Enter</strong> to continue'
      return false;
    } else {
      //rerandomize stim order
      NoSS_practice_list = jsPsych.randomization.repeat(stimulus, 3, true)
      // keep going until they are faster!
      practice_feedback_text += '</p><p class = block-text>We will try another practice block. '
      if (average_rt > RT_thresh) {
        practice_feedback_text +=
          '</p><p class = block-text>You have been responding too slowly, please respond to each shape as quickly and as accurately as possible.'
      }
      if (missed_responses >= missed_response_thresh) {
        practice_feedback_text +=
          '</p><p class = block-text><strong>We have detected a number of trials that required a response, where no response was made.  Please ensure that you are responding to each shape.</strong>'
      }
      if (GoCorrect_percent <= accuracy_thresh) {
        practice_feedback_text +=
          '</p><p class = block-text>Your accuracy is too low. Remember, the correct keys are as follows: ' + prompt_text
      }
      practice_feedback_text += '</p><p class = block-text>Press <strong>Enter</strong> to continue'
      return true;
    }
  }
}

/* Practice block with SS */

var practice_trials = []
practice_trials.push(practice_feedback_block)
for (i = 0; i < practice_block_len; i++) {
  practice_trials.push(prompt_fixation_block)
  var stop_signal_block = {
    type: 'stop-signal',
    stimulus: getSSPracticeStim,
    SS_stimulus: getSSPractice_stop_signal,
    SS_trial_type: getSSPractice_trial_type,
    data: getSSPracticeData,
    is_html: true,
    choices: choices,
    timing_stim: 850,
    timing_response: 1850,
    prompt: prompt_text,
    SSD: SSD,
    timing_SS: 500,
    timing_post_trial: 0,
    on_finish: function(data) {
      jsPsych.data.addDataToLastTrial({
        exp_stage: "practice",
        trial_num: current_trial
      })
      current_trial += 1
    }
  }
  practice_trials.push(stop_signal_block)
}
practice_trials.push(selective_feedback_block)

/* Practice node continues repeating until the subject reaches certain criteria */


var practice_node = {
  timeline: practice_trials,
  // This function defines stopping criteria 
  loop_function: function(data) {
    practice_repetitions += 1
    var rt_array = [];
    var sum_correct = 0;
    var go_length = 0;
    var num_responses = 0;
    var stop_length = 0
    var successful_stops = 0
    for (var i = 0; i < data.length; i++) {
      if (data[i].trial_id == 'stim') {
        if (data[i].SS_trial_type != 'stop') {
          if (data[i].rt != -1) {
            num_responses += 1
            rt_array.push(data[i].rt);
            if (data[i].key_press == data[i].correct_response) {
              sum_correct += 1
            }
          }
          go_length += 1
        } else if (data[i].SS_trial_type == "stop") {
          stop_length += 1
          if (data[i].rt == -1) {
            successful_stops += 1
          }
        }
      }
    }
    
    var numIgnore = 0
    var ignoreRespond = 0
    for (var b = 0; b < data.length; b++){
    	if(data[b].trial_id == 'stim' && data[b].condition == 'ignore'){
    		numIgnore = numIgnore + 1
    		if (data[b].rt != -1){
    			ignoreRespond = ignoreRespond + 1
    		}
    	}
    }
    		
    var average_rt = -1
    if (rt_array.length !== 0) {
      average_rt = math.median(rt_array);
    }
    var ignoreRespond_percent = ignoreRespond/numIgnore
    var GoCorrect_percent = sum_correct / go_length;
    var missed_responses = (go_length - num_responses) / go_length
    var StopCorrect_percent = successful_stops / stop_length
    practice_feedback_text = "</p><p class = block-text><strong>Average reaction time:  " + Math.round(average_rt) + " ms. Accuracy for non-blue star trials: " + Math.round(GoCorrect_percent * 100)+ "%</strong>" 
    if ((average_rt < RT_thresh && GoCorrect_percent > accuracy_thresh && missed_responses <
        missed_response_thresh && StopCorrect_percent > 0.2 && StopCorrect_percent < 0.8 && ignoreRespond_percent > selective_threshold) || practice_repetitions >
      practice_repetition_thresh) {
      // end the loop
      current_trial = 0
      practice_feedback_text +=
        '</p><p class = block-text>Done with practice. We will now begin the ' + 
        numblocks +
        ' test blocks. There will be a break after each block. Press <strong>enter</strong> to continue.'
      return false;
    } else {
      //rerandomize stim and stop_trial order
      practice_list = jsPsych.randomization.repeat(stimulus, practice_block_len/4, true)
      practice_stop_trials = jsPsych.randomization.repeat(['stop', 'ignore', 'go', 'go', 'go'], practice_list.data.length / 5, false)
        // keep going until they are faster!
      practice_feedback_text += '</p><p class = block-text>We will try another practice block. '

      if (average_rt > RT_thresh) {
        practice_feedback_text +=
          '</p><p class = block-text>You have been responding too slowly, please respond to each shape as quickly and as accurately as possible.'
      }

      if (missed_responses >= missed_response_thresh) {
        practice_feedback_text +=
          '</p><p class = block-text><strong>We have detected a number of trials that required a response, where no response was made.  Please ensure that you are responding to each shape, unless a blue star appears.</strong>'
      }

      if (GoCorrect_percent <= accuracy_thresh) {
        practice_feedback_text +=
          '</p><p class = block-text>Your accuracy is too low. Remember, the correct keys are as follows: ' + prompt_text
      }
      
      if (StopCorrect_percent < 0.8){
        practice_feedback_text +=
          '</p><p class = block-text><strong>Remember to try and withhold your response when you see a blue stop signal.</strong>' 
      } else if (StopCorrect_percent > 0.2){
        practice_feedback_text +=
          '</p><p class = block-text><strong>Remember, do not slow your responses to the shape to see if a blue star will appear before you respond.  Please respond to each shape as quickly and as accurately as possible.</strong>'
      }
      practice_feedback_text += '</p><p class = block-text>Press <strong>Enter</strong> to continue'
      return true;
    }
  }
}

stim_selective_stop_signal_experiment.push(NoSS_practice_node)
stim_selective_stop_signal_experiment.push(practice_node)
stim_selective_stop_signal_experiment.push(practice_feedback_block)

/* Test blocks */
// Loop through the multiple blocks within each condition
for (var b = 0; b < numblocks; b++) {
  stop_signal_exp_block = []
  var block = blocks[b]
  var stop_trials = jsPsych.randomization.repeat(['stop', 'ignore', 'go', 'go', 'go'],
      test_block_len / 5)
    // Loop through each trial within the block
  for (var i = 0; i < test_block_len; i++) {
    stop_signal_exp_block.push(fixation_block)
      //Label each trial as an ignore, stop or go trial
    var trial_data = $.extend({}, block.data[i])
    trial_data.condition = stop_trials[i]
    trial_data.exp_stage = 'test'
    if (stop_trials[i] == 'ignore') {
      var stop_trial = 'stop'
      var stop_stim = ignore_signal
    } else {
      var stop_stim = stop_signal
      var stop_trial = stop_trials[i]
      
    }
    var stop_signal_block = {
      type: 'stop-signal',
      stimulus: block.stimulus[i],
      SS_stimulus: stop_stim,
      SS_trial_type: stop_trial,
      data: trial_data,
      is_html: true,
      choices: choices,
      timing_stim: 850,
      timing_response: 1850,
      SSD: getSSD,
      timing_SS: 500,
      timing_post_trial: 0,
      on_finish: function(data) {
        updateSSD(data)
        test_block_data.push(data)
        jsPsych.data.addDataToLastTrial({
          trial_num: current_trial
        })
        current_trial += 1
      }
    }
    stop_signal_exp_block.push(stop_signal_block)
  }

  stim_selective_stop_signal_experiment = stim_selective_stop_signal_experiment.concat(
    stop_signal_exp_block)
  if ($.inArray(b, [0, 1, 4]) != -1) {
    stim_selective_stop_signal_experiment.push(attention_node)
  }
  stim_selective_stop_signal_experiment.push(selective_feedback_block)
  stim_selective_stop_signal_experiment.push(test_feedback_block)
}
stim_selective_stop_signal_experiment.push(post_task_block)
stim_selective_stop_signal_experiment.push(end_block)