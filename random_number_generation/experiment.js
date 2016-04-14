/* ************************************ */
/* Define helper functions */
/* ************************************ */
var getInstructFeedback = function() {
  return '<div class = centerbox><p class = center-block-text>' + feedback_instruct_text +
    '</p></div>'
}

var randomDraw = function(lst) {
  var index = Math.floor(Math.random() * (lst.length))
  return lst[index]
}

/* ************************************ */
/* Define experimental variables */
/* ************************************ */
// generic task variables
var sumInstructTime = 0 //ms
var instructTimeThresh = 0 ///in seconds

// task specific variables
var grid =
  '<div class = numbox>' +
  '<button id = button_1 class = "square num-button"><div class = numbers>1</div></button>' +
  '<button id = button_2 class = "square num-button"><div class = numbers>2</div></button>' +
  '<button id = button_3 class = "square num-button"><div class = numbers>3</div></button>' +
  '<button id = button_4 class = "square num-button"><div class = numbers>4</div></button>' +
  '<button id = button_5 class = "square num-button"><div class = numbers>5</div></button>' +
  '<button id = button_6 class = "square num-button"><div class = numbers>6</div></button>' +
  '<button id = button_7 class = "square num-button"><div class = numbers>7</div></button>' +
  '<button id = button_8 class = "square num-button"><div class = numbers>8</div></button>' +
  '<button id = button_9 class = "square num-button"><div class = numbers>9</div></button>' +
  '</div>'

var empty_grid =
  '<div class = numbox><div class = "blank-square num-button"><div class = content><div class = numbers ></div></div></div>' +
  '<div class = "blank-square num-button"><div class = content><div class = numbers ></div></div></div>' +
  '<div class = "blank-square num-button"><div class = content><div class = numbers ></div></div></div>' +
  '<div class = "blank-square num-button"><div class = content><div class = numbers ></div></div></div>' +
  '<div class = "blank-square num-button"><div class = content><div class = numbers ></div></div></div>' +
  '<div class = "blank-square num-button"><div class = content><div class = numbers ></div></div></div>' +
  '<div class = "blank-square num-button"><div class = content><div class = numbers ></div></div></div>' +
  '<div class = "blank-square num-button"><div class = content><div class = numbers ></div></div></div>' +
  '<div class = "blank-square num-button"><div class = content><div class = numbers ></div></div></div></div>'



var num_trials = 162
practice_stims = []
test_stims = []
for (var i = 0; i < 10; i++) {
  practice_stims.push(grid)
}
for (var i = 0; i < num_trials; i++) {
  test_stims.push(grid)
}
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
    '<div class = centerbox><p class = block-text>In this task, your job is to generate a random sequence of digits. You will do this by clicking on a virtual numpad using your mouse. Once you click, the number will temporarily turn red. You have less than a second to respond on each trial so it is important to respond quickly!</p><p class = block-text>.After the trial ends the numbers will dissapear for a moment. When they appear again the next trial has begun and you should respond as quickly as possible.</p><p class = block-text>Your goal is to choose each number completely randomly, as if you were picking a number from a hat with 9 slips of paper, reading it, and placing it back before picking another number.</p></div>',
  ],
  allow_keys: false,
  show_clickable_nav: true,
  //timing_post_trial: 1000
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


var end_block = {
  type: 'poldrack-text',
  timing_response: 180000,
  data: {
    trial_id: "end",
    exp_id: 'random_number_generation'
  },
  text: '<div class = centerbox><p class = center-block-text>Thanks for completing this task!</p><p class = center-block-text>Press <strong>enter</strong> to begin.</p></div>',
  cont_key: [13],
  timing_post_trial: 0
};

var start_practice_block = {
  type: 'poldrack-text',
  timing_response: 180000,
  data: {
    trial_id: "practice_intro"
  },
  text: '<div class = centerbox><p class = center-block-text>Starting a practice block.</p><p class = center-block-text>Press <strong>enter</strong> to begin.</p></div>',
  cont_key: [13],
  timing_post_trial: 1000
};

var start_test_block = {
  type: 'poldrack-text',
  timing_response: 180000,
  data: {
    trial_id: "test_intro"
  },
  text: '<div class = centerbox><p class = center-block-text>Starting a test block.</p><p class = center-block-text>Press <strong>enter</strong> to begin.</p></div>',
  cont_key: [13],
  timing_post_trial: 1000
};

var wait_block = {
  type: 'poldrack-single-stim',
  stimuli: [empty_grid],
  choices: 'none',
  is_html: true,
  data: {
    trial_id: "wait"
  },
  timing_stim: 200,
  timing_response: 200,
  response_ends_trial: false,
  timing_post_trial: 0
};

//Set up experiment
var random_number_generation_experiment = []
random_number_generation_experiment.push(instruction_node);
random_number_generation_experiment.push(start_practice_block);
for (var i = 0; i < practice_stims.length; i++) {
  var practice_block = {
    type: 'single-stim-button',
    stimulus: practice_stims[i],
    button_class: 'num-button',
    data: {
      trial_id: "stim",
      exp_stage: "practice"
    },
    timing_response: 800,
    response_ends_trial: false,
    timing_post_trial: 0
  };
  random_number_generation_experiment.push(practice_block)
  random_number_generation_experiment.push(wait_block)
}
random_number_generation_experiment.push(start_test_block);
//Loop should be changed to go until test_stims.length later
for (var i = 0; i < practice_stims.length; i++) {
  var test_block = {
    type: 'single-stim-button',
    stimulus: test_stims[i],
    button_class: 'num-button',
    data: {
      trial_id: "stim",
      exp_stage: "test"
    },
    timing_response: 800,
    response_ends_trial: false,
    timing_post_trial: 0
  };
  random_number_generation_experiment.push(test_block)
  random_number_generation_experiment.push(wait_block)
}
random_number_generation_experiment.push(post_task_block)
random_number_generation_experiment.push(end_block)