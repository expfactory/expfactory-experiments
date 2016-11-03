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
		if (choice_counts[key] > trial_count * 0.9) {
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

var getInvalidCue = function() {
  return prefix + path + randomDraw(cues) + postfix
}

var getInvalidProbe = function() {
  return prefix + path + randomDraw(probes) + postfix
}

var getFeedback = function() {
  var curr_trial = jsPsych.progress().current_trial_global
  var curr_data = jsPsych.data.getData()[curr_trial - 1]
  var condition = curr_data.condition
  var response = curr_data.key_press
  var feedback_text = ''
  var correct = false
  var correct_response = choices[1]
  if (condition == "AX") {
    correct_response = choices[0]
  }
  if (response == correct_response) {
    correct = true
    feedback_text =  '<div class = centerbox><div style="color:green"; class = center-text>Correct!</div></div>'
  } else if (response == -1) {
    feedback_text =  '<div class = centerbox><div class = center-text>Respond Faster!</p></div>'
  } else {
    feedback_text = '<div class = centerbox><div style="color:red"; class = center-text>Incorrect</div></div>'
  }
  jsPsych.data.addDataToLastTrial({'correct': correct, 'correct_response': correct_response})
  return feedback_text
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
var credit_var = 0

// task specific variables
var current_trial = 0
var choices = [37, 40]
var correct_responses = [
  ["left arrow", 37],
  ["down arrow", 40]
]
var exp_stage = 'practice'
var path = '/static/experiments/dot_pattern_expectancy/images/'
var prefix = '<div class = centerbox><div class = img-container><img src = "'
var postfix = '"</img></div></div>'
var cues = jsPsych.randomization.shuffle(['cue1.png', 'cue2.png', 'cue3.png', 'cue4.png',
  'cue5.png', 'cue6.png'
])
var probes = jsPsych.randomization.shuffle(['probe1.png', 'probe2.png', 'probe3.png', 'probe4.png',
  'probe5.png', 'probe6.png'
])
var images = []
for (var i = 0; i < cues.length; i++) {
  images.push(path + cues[i])
  images.push(path + probes[i])
}
//preload images
jsPsych.pluginAPI.preloadImages(images)

var valid_cue = cues.pop()
var valid_probe = probes.pop()

var trial_proportions = ["AX", "AX", "AX", "AX", "AX", "AX", "AX", "AX", "AX", "AX", "AX", "BX",
  "BX", "AY", "AY", "BY"
]
var practice_block = jsPsych.randomization.repeat(trial_proportions, 2)
var block1_list = jsPsych.randomization.repeat(trial_proportions, 2)
var block2_list = jsPsych.randomization.repeat(trial_proportions, 2)
var block3_list = jsPsych.randomization.repeat(trial_proportions, 2)
var block4_list = jsPsych.randomization.repeat(trial_proportions, 2)
var blocks = [block1_list, block2_list, block3_list, block4_list]

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
  data: {
    trial_id: "end",
    exp_id: 'dot_pattern_expectancy'
  },
  timing_response: 180000,
  text: '<div class = centerbox><p class = center-block-text>Thanks for completing this task!</p><p class = center-block-text>Press <strong>enter</strong> to continue.</p></div>',
  cont_key: [13],
  timing_post_trial: 0,
  on_finish: assessPerformance
};

var feedback_instruct_text =
  'Welcome to the experiment. This experiment will last around 15 minutes. Press <strong>enter</strong> to begin.'
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
    '<div class = centerbox><p class = block-text>In this task, on each trial you will see a group of blue circles presented for a short time, followed by the presentation of  group of black circles. For instance you may see:</p><br><p class = center-block-text><img src = "/static/experiments/dot_pattern_expectancy/images/cue2.png" ></img>&nbsp&nbsp&nbsp...followed by...&nbsp&nbsp&nbsp<img src = "/static/experiments/dot_pattern_expectancy/images/probe2.png" ></img></p></div>',
    '<div class = centerbox><p class = block-text>Your job is to respond by pressing an arrow key during the presentation of the <strong>second</strong> group  of circles. One pair of circles is the <strong>target</strong> pair, and for this pair you should press the <strong>left</strong> arrow key. For any other pair of circles, you should press the <strong>down</strong> arrow key.</p><p class = block-text>After you respond you will get feedback about whether you were correct. The target pair is shown below:</p><br><p class = center-block-text><img src = "/static/experiments/dot_pattern_expectancy/images/' +
    valid_cue +
    '" ></img>&nbsp&nbsp&nbsp...followed by...&nbsp&nbsp&nbsp<img src = "/static/experiments/dot_pattern_expectancy/images/' +
    valid_probe + '" ></img><br></br></p></div>',
    '<div class = centerbox><p class = block-text>We will now start the experiment. Remember, press the left arrow key only after seeing the target pair. The target pair is shown below (for the last time). Memorize it!</p><p class = block-text>Answer as quickly and accurately as possible. You will start practice after you end the instructions.</p><br><p class = center-block-text><img src = "/static/experiments/dot_pattern_expectancy/images/' +
    valid_cue +
    '" ></img>&nbsp&nbsp&nbsp...followed by...&nbsp&nbsp&nbsp<img src = "/static/experiments/dot_pattern_expectancy/images/' +
    valid_probe + '" ></img></p></div>'
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

var rest_block = {
  type: 'poldrack-text',
  data: {
    trial_id: "rest"
  },
  timing_response: 180000,
  text: '<div class = centerbox><p class = block-text>Take a break! Press any key to continue.</p></div>',
  timing_post_trial: 1000
};

var feedback_block = {
  type: 'poldrack-single-stim',
  stimulus: getFeedback,
  is_html: true,
  choices: 'none',
  data: {
    trial_id: "feedback",
  },
  timing_post_trial: 0,
  timing_stim: 1000,
  timing_response: 1000,
  on_finish: function() {
    jsPsych.data.addDataToLastTrial({
    	exp_stage: exp_stage,
    	trial_num: current_trial
    })
    current_trial += 1
  }
}

var fixation_block = {
  type: 'poldrack-single-stim',
  stimulus: '<div class = centerbox><div class = fixation>+</div></div>',
  is_html: true,
  choices: 'none',
  data: {
    trial_id: "fixation",
  },
  timing_post_trial: 0,
  timing_stim: 2000,
  timing_response: 2000,
  on_finish: function() {
    jsPsych.data.addDataToLastTrial({exp_stage: exp_stage})
  }
}

var start_test_block = {
  type: 'poldrack-text',
  data: {
    trial_id: "end"
  },
  timing_response: 180000,
  text: '<div class = centerbox><p class = center-block-text>Done with practice. We will now start the test.</p><p class = center-block-text>Press <strong>enter</strong> to continue.</p></div>',
  cont_key: [13],
  timing_post_trial: 0,
  on_finish: function() {
  	current_trial = 0
    exp_stage = 'test'
  }
};


/* define test block cues and probes*/
var A_cue = {
  type: 'poldrack-single-stim',
  stimulus: prefix + path + valid_cue + postfix,
  is_html: true,
  choices: 'none',
  data: {
    trial_id: "cue",
  },
  timing_stim: 500,
  timing_response: 500,
  timing_post_trial: 0,
  on_finish: function() {
    jsPsych.data.addDataToLastTrial({
    	exp_stage: exp_stage,
    	trial_num: current_trial
    })
  }
};

var other_cue = {
  type: 'poldrack-single-stim',
  stimulus: getInvalidCue,
  is_html: true,
  choices: 'none',
  data: {
    trial_id: "cue",
    exp_stage: "test"
  },
  timing_stim: 500,
  timing_response: 500,
  timing_post_trial: 0,
  on_finish: function() {
    jsPsych.data.addDataToLastTrial({
    	exp_stage: exp_stage,
    	trial_num: current_trial
    })
  }
};

var X_probe = {
  type: 'poldrack-single-stim',
  stimulus: prefix + path + valid_probe + postfix,
  is_html: true,
  choices: choices,
  data: {
    trial_id: "probe",
    exp_stage: "test"
  },
  timing_stim: 500,
  timing_response: 1500,
  timing_post_trial: 0,
  on_finish: function() {
    jsPsych.data.addDataToLastTrial({
    	exp_stage: exp_stage,
    	trial_num: current_trial
	})
  }
};

var other_probe = {
  type: 'poldrack-single-stim',
  stimulus: getInvalidProbe,
  is_html: true,
  choices: choices,
  data: {
    trial_id: "probe",
    exp_stage: "test"
  },
  timing_stim: 500,
  timing_response: 1500,
  timing_post_trial: 0,
  on_finish: function() {
    jsPsych.data.addDataToLastTrial({
    	exp_stage: exp_stage,
    	trial_num: current_trial
    })
  }
};

/* ************************************ */
/* Set up experiment */
/* ************************************ */

var dot_pattern_expectancy_experiment = []
dot_pattern_expectancy_experiment.push(instruction_node);
for (i = 0; i < practice_block.length; i++) {
  switch (practice_block[i]) {
    case "AX":
      cue = jQuery.extend(true, {}, A_cue)
      probe = jQuery.extend(true, {}, X_probe)
      cue.data.condition = "AX"
      probe.data.condition = "AX"
      break;
    case "BX":
      cue = jQuery.extend(true, {}, other_cue)
      probe = jQuery.extend(true, {}, X_probe)
      cue.data.condition = "BX"
      probe.data.condition = "BX"
      break;
    case "AY":
      cue = jQuery.extend(true, {}, A_cue)
      probe = jQuery.extend(true, {}, other_probe)
      cue.data.condition = "AY"
      probe.data.condition = "AY"
      break;
    case "BY":
      cue = jQuery.extend(true, {}, other_cue)
      probe = jQuery.extend(true, {}, other_probe)
      cue.data.condition = "BY"
      probe.data.condition = "BY"
      break;
  }
  dot_pattern_expectancy_experiment.push(cue)
  dot_pattern_expectancy_experiment.push(fixation_block)
  dot_pattern_expectancy_experiment.push(probe)
  dot_pattern_expectancy_experiment.push(feedback_block)
}



dot_pattern_expectancy_experiment.push(start_test_block);
for (b = 0; b < blocks.length; b++) {
  var block = blocks[b]
  for (i = 0; i < block.length; i++) {
    switch (block[i]) {
      case "AX":
        cue = jQuery.extend(true, {}, A_cue)
        probe = jQuery.extend(true, {}, X_probe)
        cue.data.condition = "AX"
        probe.data.condition = "AX"
        break;
      case "BX":
        cue = jQuery.extend(true, {}, other_cue)
        probe = jQuery.extend(true, {}, X_probe)
        cue.data.condition = "BX"
        probe.data.condition = "BX"
        break;
      case "AY":
        cue = jQuery.extend(true, {}, A_cue)
        probe = jQuery.extend(true, {}, other_probe)
        cue.data.condition = "AY"
        probe.data.condition = "AY"
        break;
      case "BY":
        cue = jQuery.extend(true, {}, other_cue)
        probe = jQuery.extend(true, {}, other_probe)
        cue.data.condition = "BY"
        probe.data.condition = "BY"
        break;
    }
    dot_pattern_expectancy_experiment.push(cue)
    dot_pattern_expectancy_experiment.push(fixation_block)
    dot_pattern_expectancy_experiment.push(probe)
    dot_pattern_expectancy_experiment.push(feedback_block)
  }
  if ($.inArray(b, [0, 1, 3]) != -1) {
    dot_pattern_expectancy_experiment.push(attention_node)
  }
  dot_pattern_expectancy_experiment.push(rest_block)
}
dot_pattern_expectancy_experiment.push(post_task_block)
dot_pattern_expectancy_experiment.push(end_block)