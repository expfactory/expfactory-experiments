/* ************************************ */
/* Define helper functions */
/* ************************************ */
function assessPerformance() {
  var experiment_data = jsPsych.data.getTrialsOfType('poldrack-single-stim')
  var trial_count = 0
  var missed_count = 0
  var rt_array = []
  var rt = 0
  for (var i = 0; i < experiment_data.length; i++) {
    if (experiment_data[i].possible_responses != 'none') {
      trial_count += 1
      rt = experiment_data[i].rt
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
  var missed_percent = missed_count/trial_count
  credit_var = (missed_percent < 0.4 && avg_rt > 100)
  jsPsych.data.addDataToLastTrial({"credit_var": credit_var})
}

var get_trial_time_practice = function() {
  // ref: https://gist.github.com/nicolashery/5885280
  function randomExponential(rate, randomUniform) {
    // http://en.wikipedia.org/wiki/Exponential_distribution#Generating_exponential_variates
    rate = rate || 1;

    // Allow to pass a random uniform value or function
    // Default to Math.random()
    var U = randomUniform;
    if (typeof randomUniform === 'function') U = randomUniform();
    if (!U) U = Math.random();

    return -Math.log(U) / rate;
  }
  gap = randomExponential(1)*1000
  if (gap > 4500) {
    gap = 4500
  }
  return gap + 2000
}

var get_trial_time = function() {
  // ref: https://gist.github.com/nicolashery/5885280
  function randomExponential(rate, randomUniform) {
    // http://en.wikipedia.org/wiki/Exponential_distribution#Generating_exponential_variates
    rate = rate || 1;

    // Allow to pass a random uniform value or function
    // Default to Math.random()
    var U = randomUniform;
    if (typeof randomUniform === 'function') U = randomUniform();
    if (!U) U = Math.random();

    return -Math.log(U) / rate;
  }
  gap = randomExponential(1)*1000
  if (gap > 4500) {
    gap = 4500
  }
  if (flag_curr_trial == 1){
    gap = 10000
    fast_rt_flags = 0
  }
  return gap
}

var get_message_time = function(){
	if (flag_curr_trial == 1) {
    return 9000
  }
  else {
    return -1
  }
}

var get_message = function(){
  var fast_rt_message = '<div class = centerbox><p class = block-text>We have detected a number of trials where the reaction time was implausibly fast.  Please make sure that you hit the spacebar <strong> once</strong>, as quickly as possible <strong>only after the large X appears</strong>.</p></div>'
	if (flag_curr_trial == 1){
		return fast_rt_message
	} else{
		return '<div class = centerbox></div>'
	}	
}

/* Append gap and current trial to data and then recalculate for next trial*/
var appendData = function(data) {
	var curr_rt = data.rt	
	if(curr_rt < 125 && curr_rt != -1){
		fast_rt_flags +=1
	}
	
	if(fast_rt_flags >= flag_thresh){
		flag_curr_trial = 1
	}
	
	jsPsych.data.addDataToLastTrial({
    	trial_num: current_trial
 	})
  current_trial = current_trial + 1
}

var getInstructFeedback = function() {
  return '<div class = centerbox><p class = center-block-text>' + feedback_instruct_text +
    '</p></div>'
}

/* ************************************ */
/* Define experimental variables */
/* ************************************ */
// generic task variables
var sumInstructTime = 0 //ms
var instructTimeThresh = 0 ///in seconds

// task specific variables
var practice_len = 5
var num_blocks = 3
var block_len = 50
var gap = 0
var current_trial = 0
var stim = '<div class = shapebox><div id = cross></div></div>'
var fast_rt_flags = 0;
var flag_thresh = 5
var flag_curr_trial = 0;
/* ************************************ */
/* Set up jsPsych blocks */
/* ************************************ */
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
    exp_id: 'simple_reaction_time'
  },
  timing_response: 180000,
  text: '<div class = centerbox><p class = center-block-text>Thanks for completing this task!</p><p class = center-block-text>Press <strong>enter</strong> to continue.</p></div>',
  cont_key: [13],
  timing_post_trial: 0,
  on_finish: assessPerformance
};

var rest_block = {
  type: 'poldrack-text',
  data: {
    trial_id: "end",
    exp_id: 'simple_reaction_time'
  },
  timing_response: 180000,
  text: '<div class = centerbox><p class = block-text>Take a break!  Press <strong> enter</strong> to continue the task.</p></div>',
  cont_key: [13],
  timing_post_trial: 0,
  on_finish: function() {
    flag_curr_trial = 0
    fast_rt_flags = 0
  }
};


var feedback_instruct_text =
  'Welcome to the experiment. This experiment will take about 8 minutes. Press <strong>enter</strong> to begin.'
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
    '<div class = centerbox><p class = block-text>In this experiment, we are testing how fast you can respond. On each trial press the spacebar as quickly as possible <strong>after</strong> you see the large "X".</p></div>'
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
  text: '<div class = centerbox><p class = center-block-text>Take a break! Press <strong>enter</strong> to continue.</p></div>',
  cont_key: [13],
  timing_post_trial: 1000
};

var start_practice_block = {
  type: 'poldrack-text',
  data: {
    trial_id: "practice_intro"
  },
  timing_response: 180000,
  text: '<div class = centerbox><p class = center-block-text>We will start 5 practice trials. Press <strong>enter</strong> to begin.</p></div>',
  cont_key: [13],
  timing_post_trial: 1000
};



var start_test_block = {
  type: 'poldrack-text',
  data: {
    trial_id: "test_intro"
  },
  timing_response: 180000,
  text: '<div class = centerbox><p class = block-text>We will now start the test. Respond to the "X" as quickly as possible by pressing the spacebar. There will be two breaks. Press <strong>enter</strong> to begin.</p></div>',
  cont_key: [13],
  timing_post_trial: 1000,
  on_finish: function() {
    current_trial = 0
    fast_rt_flags = 0
  }
};


/* define practice block */
var practice_block = {
  type: 'poldrack-single-stim',
  stimulus: stim,
  timing_post_trial: 0,
  timing_stim: 2000,
  timing_response: get_trial_time_practice,
  response_ends_trial: false,
  is_html: true,
  data: {
    trial_id: "stim",
    exp_stage: "practice"
  },
  choices: [32],
  on_finish: function(data) {
    appendData(data)
  }
};

/* define test block */
var test_block1 = {
  type: 'poldrack-single-stim',
  stimulus: stim,
  timing_stim: 2000,
  timing_response: 2000,
  timing_post_trial: 0,
  response_ends_trial: false,
  is_html: true,
  data: {
    trial_id: "stim",
    exp_stage: "test"
  },
  choices: [32],
  on_finish: function(data) {
    appendData(data)
  }
};

var test_block2 = {
  type: 'poldrack-single-stim',
  stimulus: get_message,
  timing_stim: get_message_time,
  timing_response: get_trial_time,
  timing_post_trial: 0,
  response_ends_trial: false,
  choices: 'none',
  is_html: true,
  data: {
    trial_id: "gap-message",
    exp_stage: "test"
  },
  on_finish: function(){
    flag_curr_trial = 0;
  }
};

/* create experiment definition array */
var simple_reaction_time_experiment = [];
simple_reaction_time_experiment.push(instruction_node);

simple_reaction_time_experiment.push(start_practice_block);
for (var i = 0; i < practice_len; i++) {
  simple_reaction_time_experiment.push(practice_block);
}
simple_reaction_time_experiment.push(start_test_block);

for(var b = 0; b < 3; b++){
	for (var i = 0; i < block_len; i++) {
    	simple_reaction_time_experiment.push(test_block1);
    	simple_reaction_time_experiment.push(test_block2);
	}
	simple_reaction_time_experiment.push(rest_block)
}

simple_reaction_time_experiment.push(post_task_block)
simple_reaction_time_experiment.push(end_block);
