// Reference: http://www.sciencedirect.com/science/article/pii/S001002859990734X
//Condition indicates block task (add, subtract, alternate)

/* ************************************ */
/* Define helper functions */
/* ************************************ */
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
var numbers = [];
for (var i = 10; i <= 99; i++) {
  numbers.push(i.toString());
}
var numbers = jsPsych.randomization.shuffle(numbers)
var practice_numbers = jsPsych.randomization.shuffle(numbers).slice(0,15)
var add_list = []
var minus_list = []
var alternate_list = []
var practice_list = []
for (var i = 0; i < practice_numbers.length; i++) {
  practice_list.push('<p class = center-block-text>' + practice_numbers[i] + '</p>')
}

for (var i = 0; i < numbers.length; i++) {
  if (i < 30) {
    add_list.push('<p class = center-block-text>' + numbers[i] + '</p>')
  } else if (i < 60) {
    minus_list.push('<p class = center-block-text>' + numbers[i] + '</p>')
  } else {
    alternate_list.push('<p class = center-block-text>' + numbers[i] + '</p>')
  }
}

/* ************************************ */
/* Set up jsPsych blocks */
/* ************************************ */

//Set up post task questionnaire
var post_task_block = {
   type: 'survey-text',
   data: {
       trial_id: "post_task"
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
    exp_id: 'plus_minus'
  },
  text: '<div class = centerbox><p class = center-block-text>Thanks for completing this task!</p><p class = center-block-text>Press <strong>enter</strong> to continue.</p></div>',
  cont_key: [13],
  timing_post_trial: 0
};

var feedback_instruct_text =
  'Welcome to the experiment. Press <strong>enter</strong> to begin.'
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
    '<div class = centerbox><p class = block-text>In this experiment you will be adding and subtracting numbers. It is important that you respond as quickly and accurately as possible. To familiarize you with the test, on the next screen will be a list of numbers. For each number, copy the number into the blank as quickly and accurately as possible. Use the "tab" key to move from question to question. If possible, use your numpad to make entering numbers easier.</p></div>'
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

var start_add_block = {
  type: 'poldrack-text',
  data: {
    trial_id: "start_add_block"
  },
  timing_response: 180000,
  text: '<div class = centerbox><p class = block-text>On the following screen you will see a list of numbers. <strong>Add 3</strong> to them and enter the value in the box below the number. Complete the list as quickly and accurately as possible. Press any key to begin.</p></div>',
  timing_post_trial: 1000
};

var start_minus_block = {
  type: 'poldrack-text',
  data: {
    trial_id: "start_minus_block"
  },
  timing_response: 180000,
  text: '<div class = centerbox><p class = block-text>On the following screen you will see a list of numbers. <strong>Subtract 3</strong> from them and enter the value in the box below the number. Complete the list as quickly and accurately as possible. Press any key to begin.</p></div>',
  timing_post_trial: 1000
};

var start_alternate_block = {
  type: 'poldrack-text',
  timing_response: 180000,
  data: {
    trial_id: "start_alternative_block"
  },
  text: '<div class = centerbox><p class = block-text>On the following screen you will see a list of numbers. <strong>Alternate between adding and subtracting 3</strong> to the numbers and enter the value in the box below the number.</p><p class = block-text>For instance, if the numbers were 27, 13, 40, your responses should be 30 (27+3), 10 (13-3), 43 (40+3). Complete the list as quickly and accurately as possible. Press any key to begin.</p></div>',
  timing_post_trial: 1000
};

var practice_block = {
  type: 'survey-text',
  data: {
    trial_id: "stim",
    exp_stage: "practice"
  },
  questions: practice_list
};

var add_block = {
  type: 'survey-text',
  questions: add_list,
  data: {
    exp_id: 'plus_minus',
    condition: 'add',
    trial_id: "stim",
    exp_stage: 'test'
  }
};

var minus_block = {
  type: 'survey-text',
  questions: minus_list,
  data: {
    exp_id: 'plus_minus',
    condition: 'subtract',
    trial_id: "stim",
    exp_stage: 'test'
  }
};

var alternate_block = {
  type: 'survey-text',
  questions: alternate_list,
  data: {
    exp_id: 'plus_minus',
    condition: 'alternate',
    trial_id: "stim",
    exp_stage: 'test'
  }
};

var posttask_questionnaire = {
  type: 'survey-text',
  questions: ['Did you use a numpad?'],
  data: {
    exp_id: 'plus_minus',
    trial_id: 'post-task questionnaire',
    exp_stage: 'test'
  }
};


/* create experiment definition array */
var plus_minus_experiment = [];
plus_minus_experiment.push(instruction_node)
plus_minus_experiment.push(practice_block)
plus_minus_experiment.push(start_add_block)
plus_minus_experiment.push(add_block)
plus_minus_experiment.push(start_minus_block)
plus_minus_experiment.push(minus_block)
plus_minus_experiment.push(start_alternate_block)
plus_minus_experiment.push(alternate_block)
plus_minus_experiment.push(post_task_block)
plus_minus_experiment.push(end_block)