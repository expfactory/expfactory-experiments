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
	credit individual experiments in expfactory. */
	var experiment_data = jsPsych.data.getTrialsOfType('poldrack-single-stim')
	experiment_data = experiment_data.concat(jsPsych.data.getTrialsOfType('poldrack-categorize'))
	var missed_count = 0
	var trial_count = 0
	var rt_array = []
	var rt = 0
	//record choices participants made
	var choice_counts = {}
	choice_counts[-1] = 0
	for (var k = 0; k < choices.length; k++) {
		choice_counts[choices[k]] = 0
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

var randomDraw = function(lst) {
  var index = Math.floor(Math.random() * (lst.length))
  return lst[index]
}

var makeTrialList = function(len, stim, data) {
  //choice array: numeric key codes for the numbers 1-4
  var choice_array = [83, 72]
    // 1 is a switch trial: ensure half the trials are switch trials
  var switch_trials = jsPsych.randomization.repeat([0, 1], len / 2)
    //create test array
  output_list = []
    //randomize first trial
  var trial_index = jsPsych.randomization.shuffle(['global', 'local'])[0]
  if (trial_index == 'global') {
    tmpi = Math.floor(Math.random() * (stim.length / 2))
  } else {
    tmpi = Math.floor(Math.random() * (stim.length / 2)) + stim.length / 2
  }
  var tmp_obj = {}
  tmp_obj.stimulus = stim[tmpi]
  var tmp_data = $.extend({}, data[tmpi])
  tmp_data.switch = 0
  tmp_data.correct_response = choice_array[local_shapes.indexOf(data[tmpi][trial_index + '_shape'])]
  tmp_obj.data = tmp_data
  output_list.push(tmp_obj)
    /* randomly sample from either the global or local stimulus lists (first and half part of the stim/data arrays)
	On stay trials randomly select an additional stimulus from that array. On switch trials choose from the other list. */
  for (i = 1; i < switch_trials.length; i++) {
    tmp_obj = {}
    if (switch_trials[i] == 1) {
      if (trial_index == 'global') {
        trial_index = 'local'
      } else {
        trial_index = 'global'
      }
    }
    if (trial_index == 'global') {
      tmpi = Math.floor(Math.random() * (stim.length / 2))
    } else {
      tmpi = Math.floor(Math.random() * (stim.length / 2)) + stim.length / 2
    }
    tmp_obj.stimulus = stim[tmpi]
    tmp_data = $.extend({}, data[tmpi])
    tmp_data.switch = switch_trials[i]
    tmp_data.correct_response = choice_array[local_shapes.indexOf(data[tmpi][trial_index +
      '_shape'
    ])]
    tmp_obj.data = tmp_data
    output_list.push(tmp_obj)
  }
  return output_list
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
var current_trial = 0
var choices = [72, 83]
var task_colors = jsPsych.randomization.shuffle(['blue', 'black'])
var global_shapes = ['s','h', 'o']
var local_shapes = ['s','h','o']
var path = '/static/experiments/local_global_letter/images/'
var prefix = '<div class = centerbox><img src = "'
var postfix = '"</img></div>'
var stim = []
var data = []
var images = []
for (c = 0; c < task_colors.length; c++) {
  if (c === 0) {
    condition = 'global'
    global_shape_length = 2
    local_shape_length = 3
  } else {
    condition = 'local'
    global_shape_length = 3
    local_shape_length = 2
  }
  for (g = 0; g < global_shape_length; g++) {
    for (l = 0; l < local_shape_length; l++) {
      stim.push(prefix + path + task_colors[c] + '_' + global_shapes[g] + '_of_' + local_shapes[l] +
        '.png' + postfix)
      images.push(path + task_colors[c] + '_' + global_shapes[g] + '_of_' + local_shapes[l] +
        '.png')
      data.push({
        condition: condition,
        global_shape: global_shapes[g],
        local_shape: local_shapes[l]
      })
    }
  }
}

jsPsych.pluginAPI.preloadImages(images)
//Set up experiment stimulus order
var practice_trials = makeTrialList(36, stim, data)  //36
for (i = 0; i < practice_trials.length; i++) {
  practice_trials[i].key_answer = practice_trials[i].data.correct_response
}
var test_trials = makeTrialList(96, stim, data) //96



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
       exp_id: "local_global_letter",
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
  data: {
    trial_id: "end",
    exp_id: 'local_global_letter'
  },
  timing_response: 180000,
  text: '<div class = centerbox><p class = center-block-text>Thanks for completing this task!</p><p class = center-block-text>Press <strong>enter</strong> to continue.</p></div>',
  cont_key: [13],
  timing_post_trial: 0,
  on_finish: assessPerformance
};

var feedback_instruct_text =
  'Welcome to the experiment. This experiment will take about 8 minutes. Press <strong>enter</strong> to begin.'
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
  data: {
    trial_id: "instruction"
  },
  pages: [
    '<div class = centerbox><p class = block-text>In this experiment you will see blue or black letters made up of smaller letters, like the image below. All of the smaller letters will always be the same letter.</p><div class = instructionImgBox><img src = "/static/experiments/local_global_letter/images/blue_s_of_o.png" height = 200 width = 200></img></div></div>',
    '<div class = centerbox><p class = block-text>Your task is to indicate whether the larger or smaller letters is an "H" or "S", depending on the color. If the letter is ' +
    task_colors[0] + ' indicate whether the larger letter is an "H" or "S". If the letter is ' +
    task_colors[1] +
    ' indicate whether the smaller letter is an "H" or "S".</p><p class = block-text>Use the "H" or "S" keys to indicate the letter.</p></div>',
    '<div class = centerbox><p class = block-text>For instance, for the letter below you would press "S" because it is ' +
    task_colors[1] +
    ' which means you should respond based on the smaller shapes. If the shape was instead ' +
    task_colors[0] +
    ' you would press "H".</p><div class = instructionImgBox><img src = "/static/experiments/local_global_letter/images/' +
    task_colors[1] + '_h_of_s.png" height = 200 width = 200></img></div></div>'
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

var start_practice_block = {
  type: 'poldrack-text',
  timing_response: 180000,
  data: {
    trial_id: "practice_intro"
  },
  text: '<div class = centerbox><p class = center-block-text>We will start with some practice. During practice you will get feedback about whether you responded correctly. You will not get feedback during the rest of the experiment.</p><p class = center-block-text>Press <strong>enter</strong> to begin.</p></div>',
  cont_key: [13],
  timing_post_trial: 1000
};

var start_test_block = {
  type: 'poldrack-text',
  timing_response: 180000,
  data: {
    trial_id: "test_intro"
  },
  text: '<div class = centerbox><p class = center-block-text>We will now start the test. Remember, if the letter is ' +
    task_colors[0] + ' indicate whether the larger letter is an "H" or "S". If the letter is ' +
    task_colors[1] +
    ' indicate whether the smaller letter is an "H" or "S".</p><p class = center-block-text>Press <strong>enter</strong> to begin.</p></div>',
  cont_key: [13],
  timing_post_trial: 1000,
  on_finish: function() {
  	current_trial = 0
  }
};

/* define practice block */
var practice_block = {
  type: 'poldrack-categorize',
  timeline: practice_trials,
  is_html: true,
  data: {
    trial_id: "stim",
    exp_stage: "practice"
  },
  correct_text: '<div class = centerbox><div style="color:green"; class = center-text>Correct!</div></div>',
  incorrect_text: '<div class = centerbox><div style="color:red"; class = center-text>Incorrect</div></div>',
  timeout_message: '<div class = centerbox><div class = center-text>Respond faster!</div></div>',
  choices: choices,
  timing_feedback_duration: 1000,
  show_stim_with_feedback: false,
  timing_response: 2000,
  timing_post_trial: 500,
  on_finish: function(data) {
  	jsPsych.data.addDataToLastTrial({
  		trial_num: current_trial
  	})
  	current_trial += 1
  }
}

/* define test block */
var test_block = {
  type: 'poldrack-single-stim',
  timeline: test_trials,
  data: {
    trial_id: "stim",
    exp_stage: "test"
  },
  is_html: true,
  choices: choices,
  timing_post_trial: 500,
  timing_response: 2000,
  on_finish: function(data) {
  	correct = false
    if (data.key_press === data.correct_response) {
      correct = true
    }
  	jsPsych.data.addDataToLastTrial({
  		correct: correct,
  		trial_num: current_trial
  	})
  	current_trial += 1
  }
};

/* create experiment definition array */
var local_global_letter_experiment = [];
local_global_letter_experiment.push(instruction_node);
local_global_letter_experiment.push(start_practice_block);
local_global_letter_experiment.push(practice_block);
local_global_letter_experiment.push(start_test_block);
local_global_letter_experiment.push(test_block);
local_global_letter_experiment.push(attention_node)
local_global_letter_experiment.push(post_task_block)
local_global_letter_experiment.push(end_block);