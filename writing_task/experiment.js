/* ************************************ */
/* Define helper functions */
/* ************************************ */
function getDisplayElement() {
  $('<div class = display_stage_background></div>').appendTo('body')
  return $('<div class = display_stage></div>').appendTo('body')
}

function addID() {
  jsPsych.data.addDataToLastTrial({
    'exp_id': 'writing_task'
  })
}

/* ************************************ */
/* Define experimental variables */
/* ************************************ */
// generic task variables
var sumInstructTime = 0 //ms
var instructTimeThresh = 5 ///in seconds

// task specific variables
var start_time = new Date();
var timelimit = 10

/* ************************************ */
/* Set up jsPsych blocks */
/* ************************************ */
/* define static blocks */
var welcome_block = {
  type: 'poldrack-text',
  data: {
    exp_id: "writing_task",
    trial_id: "welcome"
  },
  text: '<div class = centerbox><p class = center-block-text>Welcome to the experiment. Press <strong>enter</strong> to begin.</p></div>',
  cont_key: [13],
  timing_response: 60000,
  timing_post_trial: 0
};

var end_block = {
  type: 'poldrack-text',
  data: {
    exp_id: "writing_task",
    trial_id: "end"
  },
  text: '<div class = centerbox><p class = center-block-text>Thanks for completing this task!</p><p class = center-block-text>Press <strong>enter</strong> to continue.</p></div>',
  cont_key: [13],
  timing_response: 60000,
  timing_post_trial: 0
};

var feedback_instruct_text =
  'Starting with instructions.  Press <strong> Enter </strong> to continue.'
var feedback_instruct_block = {
  type: 'poldrack-text',
  data: {
    exp_id: "writing_task",
    trial_id: "instruction"
  },
  cont_key: [13],
  text: getInstructFeedback,
  timing_post_trial: 0,
  timing_response: 60000
};
/// This ensures that the subject does not read through the instructions too quickly.  If they do it too quickly, then we will go over the loop again.
var instruction_trials = []
var instructions_block = {
  type: 'poldrack-instructions',
  data: {
    exp_id: "writing_task",
    trial_id: "instruction"
  },
  pages: [
    '<div class = centerbox><p class = block-text>In this task we want you to write. On the next page write for ' +
    timelimit +
    'minutes in response to the prompt "What happened in the last month?".</p><p class = block-text> It is important that you write for the entire time and stay on task. After you end the instructions you will start.</p></div>'
  ],
  allow_keys: false,
  show_clickable_nav: true,
  timing_post_trial: 1000
};
instruction_trials.push(feedback_instruct_block)
instruction_trials.push(instructions_block)

var instruction_node = {
  timeline: instruction_trials,
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

/* define test block */
var test_block = {
  type: 'writing',
  data: {
    exp_id: "writing_task",
    trial_id: "write",
    exp_stage: 'test'
  },
  text_class: 'writing_class',
  is_html: true,
  timing_post_trial: 0
};

var loop_node = {
  timeline: [test_block],
  loop_function: function() {
    var elapsed = (new Date() - start_time) / 60000
    if (elapsed < timelimit) {
      return true;
    } else {
      return false;
    }
  }
}

/* create experiment definition array */
var writing_task_experiment = [];
writing_task_experiment.push(welcome_block);
writing_task_experiment.push(instruction_node);
writing_task_experiment.push(loop_node);
writing_task_experiment.push(end_block);