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
  var experiment_data = jsPsych.data.getTrialsOfType('poldrack-multi-stim-multi-response')
  var missed_count = 0
  var trial_count = 0
  var rt_array = []
  var rt = 0
  for (var i = 0; i < experiment_data.length; i++) {
    rt = JSON.parse(experiment_data[i].rt)[0]
    trial_count += 1
    if (rt == -1) {
      missed_count += 1
    } else {
      rt_array.push(rt)
    }
  }
  //calculate average rt
  var avg_rt = -1
  if (rt_array.length !== 0) {
    avg_rt = math.median(rt_array)
  } 
  credit_var = (avg_rt > 200)
  jsPsych.data.addDataToLastTrial({"credit_var": credit_var})
}

var getInstructFeedback = function() {
  return '<div class = centerbox><p class = "center-block-text">' +
    feedback_instruct_text + '</p></div>'
}

var randomDraw = function(lst) {
  var index = Math.floor(Math.random() * (lst.length))
  return lst[index]
}

var getStim = function() {
  var border_i = randomDraw([0, 1]) // get border index
  var number_i = randomDraw([0, 1]) // get inner index
  var stim = stim_prefix + path_source + borders[border_i][0] + ' </img></div></div>'
  var stim2 = stim_prefix + path_source + borders[border_i][0] +
    ' </img></div></div><div class = prp_centerbox><div class = "center-text">' +
    inners[number_i] + '</div></div>'
    // set correct choice for first
  var gonogo_choice;
  if (border_i === 0) {
    gonogo_choice = 75
  } else {
    gonogo_choice = -1
  }
  //update data
  curr_data.gonogo_stim = borders[border_i][1]
  curr_data.choice_stim = inners[number_i]
  curr_data.gonogo_correct_response = gonogo_choice
  curr_data.choice_correct_response = [74, 76][number_i]
  return [stim, stim2]
}

var getISI = function() {
    var ISI = ISIs.shift()
    curr_data.ISI = ISI
    return [ISI, 2000 - ISI]
  }
  /*
  In this task the participant can make two responses - one to a go/nogo stim and one to a 2AFC task. If only one response is made
  and it is one of the 2AFC responses, the person is assumed to have "no-goed" to the go/nogo stim.
  */
var getFB = function() {
  var data = jsPsych.data.getLastTrialData()
  var keys = JSON.parse(data.key_presses)
  var rts = JSON.parse(data.rt)
  var tooShort = false
  var gonogoFB;
  var choiceFB;
  // If the person responded to the colored square
  if (keys[0] == choices[1]) {
    if (rts[1] < data.ISI + 50 && rts[1] > 0) {
      tooShort = true
    } else {
      if (data.gonogo_correct_response != -1) {
        gonogoFB = 'You responded correctly to the colored square!'
      } else {
        gonogoFB = 'You should not respond to the ' + borders[1][1] + '  square.'
      }
      if (keys[1] == data.choice_correct_response) {
        choiceFB = 'You responded correctly to the number!'
      } else if (keys[1] == -1) {
        choiceFB = 'Remember to respond to the number.'
      } else {
        choiceFB = 'You did not respond to the number correctly. Remember: if the number is ' +
          inners[0] + ' press the "J" key with your index finger. If the number is ' + inners[1] +
          ' press the "L" key with your ring finger.'
      }
    }
  }
  // If the person didn't respond to the colored square
  else if (keys[1] == -1 && keys[0] != choices[1]) {
    if (rts[0] > 0 && rts[0] < data.ISI + 50) {
      tooShort = true
    } else {
      if (data.gonogo_correct_response == -1) {
        gonogoFB = 'You responded to the colored square correctly!'
      } else {
        gonogoFB =
          'You should respond to the ' + borders[0][1] + ' square by pressing the "K" key with your middle finger.'
      }
      if (keys[0] == data.choice_correct_response) {
        choiceFB = 'You responded correctly to the number!'
      } else if (keys[0] == -1) {
        choiceFB = 'Remember to respond to the number.'
      } else {
        choiceFB = 'You did not respond to the number correctly. Remember: if the number is ' +
          inners[0] + ' press the "J" key with your index finger. If the number is ' + inners[1] +
          ' press the "L" key with your ring finger.'
      }
    }
  } else if (keys[0] != choices[1] && keys[1] == choices[1]) {
    gonogoFB = 'You must respond to the colored square BEFORE the number.'
    if (keys[0] == data.choice_correct_response) {
      choiceFB = 'You responded correctly to the number!'
    } else if (keys[0] == -1) {
      choiceFB = 'Remember to respond to the number.'
    } else {
      choiceFB = 'You did not respond to the number correctly. Remember: if the number is ' +
        inners[0] + ' press the "J" key with your index finger. If the number is ' + inners[1] +
        ' press the "L" key with your ring finger.'
    }
  }
  if (tooShort) {
    return '<div class = prp_centerbox><p class = "center-block-text">You pressed either "J" or "L" before the number was on the screen! Wait for the number to respond!</p><p class = "center-block-text">Press any key to continue</p></div>'
  } else {
    return '<div class = prp_centerbox><p class = "center-block-text">' + gonogoFB +
      '</p><p class = "center-block-text">' + choiceFB +
      '</p><p class = "center-block-text">Press any key to continue</p></div>'
  }
}

/* ************************************ */
/* Define experimental variables */
/* ************************************ */
// generic task variables
var run_attention_checks = false
var attention_check_thresh = 0.45
var sumInstructTime = 0 //ms
var instructTimeThresh = 0 ///in seconds
var credit_var = true

// task specific variables
var practice_len = 32
var exp_len = 200
var current_trial = 0
var choices = [74, 75, 76]
var practice_ISIs = jsPsych.randomization.repeat([50, 150, 300, 800],
  exp_len / 4)
var ISIs = practice_ISIs.concat(jsPsych.randomization.repeat([50, 150, 300, 800], exp_len / 4))
var curr_data = {
    ISI: '',
    gonogo_stim: '',
    choice_stim: '',
    gonogo_correct_response: '',
    choice_correct_response: ''
  }
  //stim variables
var path_source = '/static/experiments/psychological_refractory_period_gonogo_choice/images/'
var stim_prefix = '<div class = prp_centerbox><div class = prp_stimBox><img class = prpStim src ='
  // border color relates to the go-nogo task. The subject should GO to the first two borders in the following array:
var borders = jsPsych.randomization.shuffle([['2_border.png', 'blue'],
    ['4_border.png', 'yellow']
  ])
  // inner number reflect the choice RT. 
var inners = jsPsych.randomization.shuffle([3, 4])

//instruction stim
var box1 = '<div class = prp_left-instruction><div class = prp_stimBox><img class = prpStim src = ' +
  path_source + borders[0][0] + ' </img></div></div>'
var box2 =
  '<div class = prp_right-instruction><div class = prp_stimBox><img class = prpStim src = ' +
  path_source + borders[1][0] + ' </img></div></div>'
var box_number1 =
  '<div class = prp_left-instruction><div class = prp_stimBox><img class = prpStim src = ' +
  path_source + borders[0][0] + ' </img></div></div>' +
  '<div class = prp_left-instruction><div class = "center-text">' + inners[0] +
  '</div></div>'
var box_number2 =
  '<div class = prp_right-instruction><div class = prp_stimBox><img class = prpStim src = ' +
  path_source + borders[1][0] + ' </img></div></div>' +
  '<div class = prp_right-instruction><div class = "center-text">' + inners[1] +
  '</div></div>'


/* ************************************ */
/* Set up jsPsych blocks */
/* ************************************ */
// Set up attention check node
var attention_check_block = {
  type: 'attention-check',
  data: {
    trial_id: 'attention_check'
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
    trial_id: 'end',
    exp_id: 'psychological_refractory_period_gonogo_choice'
  },
  text: '<div class = prp_centerbox><p class = "center-block-text">Thanks for completing this task!</p><p class = "center-block-text">Press <strong>enter</strong> to continue.</p></div>',
  cont_key: [13],
  timing_post_trial: 0,
  on_finish: assessPerformance
};

var feedback_instruct_text =
  'Welcome to the experiment. This experiment will take about 12 minutes. Press <strong>enter</strong> to begin.'
var feedback_instruct_block = {
  type: 'poldrack-text',
  data: {
    trial_id: 'instruction'
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
    trial_id: 'instruction'
  },
  pages: [
    '<div class = prp_centerbox><p class ="block-text">In this experiment, you will have to do two tasks in quick succession. You will respond by pressing the "J", "K" and "L" keys with your index, middle and ring fingers respectively.</p><p class ="block-text">First, a colored square will appear on the screen. If the square is the ' + borders[0][1] + ' square on the left below, you should press the "K" key with your middle finger. If it is the ' + borders[1][1] + ' square on the right, you should not respond.</p>' +
    box1 + box2 + '</div>',
    '<div class = prp_centerbox><p class ="block-text">After a short delay one of two numbers will appear in the square (as you can see below). If the number is ' +
    inners[0] + ' press the "J" key with your index finger. If the number is ' + inners[1] +
    ' press the "L" key with your ring finger.</p><p class ="block-text">It is very important that you respond as quickly as possible! You should respond to the colored square first and then the number. If you are supposed to respond to the colored square, respond as quickly as you can and then respond to the number. If you are not supposed to respond to the colored square, respond as quickly as possible to the number.</p>' +
    box_number1 + box_number2 + '</div>', '<div class = prp_centerbox><p class ="block-text">We will start with some practice after you end the instructions. Make sure you remember which colored squares to respond to and which keys to press for the two numbers before you continue. Go through the instructions again if you need to.</p></div>'
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
  data: {
    trial_id: 'intro',
    exp_stage: 'practice'
  },
  text: '<div class = prp_centerbox><p class = "center-block-text">We will start ' +
    practice_len + ' practice trials. Press <strong>enter</strong> to begin.</p></div>',
  cont_key: [13],
  timing_post_trial: 1000
};

var start_test_block = {
  type: 'poldrack-text',
  data: {
    trial_id: 'intro',
    exp_stage: 'test'
  },
  text: '<div class = prp_centerbox><p class ="center-block-text">We will now start the test. Press <strong>enter</strong> to begin.</p></div>',
  cont_key: [13],
  timing_post_trial: 1000,
  on_finish: function() {
    current_trial = 0
  }
};

var fixation_block = {
  type: 'poldrack-single-stim',
  stimulus: '<div class = centerbox><div class = "center-text">+</div></div>',
  is_html: true,
  timing_stim: 300,
  timing_response: 300,
  data: {
    trial_id: 'fixation'
  },
  choices: 'none',
  timing_post_trial: 1000,
  on_finish: function(){
    var last_trial= jsPsych.data.getDataByTrialIndex(jsPsych.progress().current_trial_global-1)
    jsPsych.data.addDataToLastTrial({exp_stage: last_trial.exp_stage})  
  }
}

/* define practice block */
var practice_block = {
  type: 'poldrack-multi-stim-multi-response',
  stimuli: getStim,
  is_html: true,
  data: {
    trial_id: 'stim',
    exp_stage: 'practice'
  },
  choices: [choices, choices],
  timing_stim: getISI,
  timing_response: 2000,
  response_ends_trial: true,
  on_finish: function() {
    curr_data.trial_num = current_trial
    jsPsych.data.addDataToLastTrial(curr_data)
    current_trial += 1
  },
  timing_post_trial: 500
}

var feedback_block = {
  type: 'poldrack-single-stim',
  stimulus: getFB,
  is_html: true,
  data: {
    trial_id: 'feedback',
    exp_stage: 'practice'
  },
  timing_stim: -1,
  timing_response: -1,
  response_ends_trial: true,
  timing_post_trial: 500
}


/* define test block */
var test_block = {
  type: 'poldrack-multi-stim-multi-response',
  stimuli: getStim,
  is_html: true,
  data: {
    trial_id: 'stim',
    exp_stage: 'test'
  },
  choices: [choices, choices],
  timing_stim: getISI,
  respond_ends_trial: true,
  timing_response: 2000,
  on_finish: function() {
    curr_data.trial_num = current_trial
    jsPsych.data.addDataToLastTrial(curr_data)
    current_trial += 1
  },
  timing_post_trial: 500
}


/* create experiment definition array */
var psychological_refractory_period_gonogo_choice_experiment = [];
psychological_refractory_period_gonogo_choice_experiment.push(instruction_node);
psychological_refractory_period_gonogo_choice_experiment.push(start_practice_block);
for (var i = 0; i < practice_len; i++) {
  psychological_refractory_period_gonogo_choice_experiment.push(fixation_block);
  psychological_refractory_period_gonogo_choice_experiment.push(practice_block);
  psychological_refractory_period_gonogo_choice_experiment.push(feedback_block);
}
psychological_refractory_period_gonogo_choice_experiment.push(attention_node);
psychological_refractory_period_gonogo_choice_experiment.push(start_test_block);
for (var i = 0; i < exp_len; i++) {
  psychological_refractory_period_gonogo_choice_experiment.push(fixation_block);
  psychological_refractory_period_gonogo_choice_experiment.push(test_block)
}
psychological_refractory_period_gonogo_choice_experiment.push(attention_node);
psychological_refractory_period_gonogo_choice_experiment.push(post_task_block)
psychological_refractory_period_gonogo_choice_experiment.push(end_block);