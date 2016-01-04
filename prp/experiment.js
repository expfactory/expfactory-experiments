
/* ************************************ */
/* Define helper functions */
/* ************************************ */

var randomDraw = function(lst) {
    var index = Math.floor(Math.random()*(lst.length))
    return lst[index]
}

var getStim = function() {
  var bi = randomDraw([0, 1, 2, 3]) // get border index
  var ii = randomDraw([0, 1]) // get inner index
  var stim = stim_prefix + path_source + borders[bi] + ' </img></div></div>'
  var stim2 = stim_prefix + path_source + borders[bi] + ' </img></div></div><div class = prp_centerbox><div class = prp_center-text>' + inners[ii] + '</div></div>'
  // set correct choice for first
  if (bi < 2) {
    var gonogo_choice = 75
  } else {
    var gonogo_choice = -1
  }
  //update data
  curr_data['gonogo_stim'] = bi
  curr_data['choice_stim'] = ii
  curr_data['gonogo_correct_response'] = gonogo_choice
  curr_data['choice_correct_response'] = [74, 76][ii]
  return [stim,stim2]
}

var getISI = function() {
  var ISI = ISIs.shift()
  curr_data['ISI'] = ISI
  return [ISI, 2000-ISI]
}
/*
In this task the participant can make two responses - one to a go/nogo stim and one to a 2AFC task. If only one response is made
and it is one of the 2AFC responses, the person is assumed to have "no-goed" to the go/nogo stim.
*/
var getFB = function() {
  var data = jsPsych.data.getLastTrialData()
  var keys = JSON.parse(data.key_press)
  var rts = JSON.parse(data.rt)
  var tooShort = false
  // If the person responded to the colored square
  if (keys[0] == choices[1]) {
    if (rts[1] < data.ISI + 100) {
      var tooShort = true
    } else {
      if (data.gonogo_correct_response != -1) {
        var gonogoFB = 'You responded to the colored square correctly!'
      } else {
        var gonogoFB = 'You should not respond to that colored square.'
      }
      if (keys[1] == data.choice_correct_response) {
        var choiceFB = 'You responded correctly to the number!'
      } else if (keys[1] == -1) {
        var choiceFB = 'Remember to respond to the number.'
      } else {
        var choiceFB = 'You did not respond to the number correctly. Remember: if the number is ' + inners[0] + ' press the "J" key with your index finger. If the number is ' + inners[1] + ' press the "L" key with your ring finger.'
      } 
   }
  }
  // If the person didn't respond to the colored square
  else if (keys[1] == -1 && keys[0] != choices[1]) {
    if (rts[0] > 0 && rts[0] < data.ISI + 50) {
      var tooShort = true
    } else {
      if (data.gonogo_correct_response == -1) {
        var gonogoFB = 'You responded to the colored square correctly!'
      } else {
        var gonogoFB = 'You should respond to that colored square by pressing the "K" key with your middle finger.'
      }
      if (keys[0] == data.choice_correct_response) {
        var choiceFB = 'You responded correctly to the number!'
      } else if (keys[0] == -1) {
        var choiceFB = 'Remember to respond to the number.'
      } else {
        var choiceFB = 'You did not respond to the number correctly. Remember: if the number is ' + inners[0] + ' press the "J" key with your index finger. If the number is ' + inners[1] + ' press the "L" key with your ring finger.'
      } 
    }
  } else if (keys[0] != choices[1] && keys[1] == choices[1]) {
      var gonogoFB = 'You must respond to the colored square BEFORE the number.'
      if (keys[0] == data.choice_correct_response) {
        var choiceFB = 'You responded correctly to the number!'
      } else if (keys[0] == -1) {
        var choiceFB = 'Remember to respond to the number.'
      } else {
        var choiceFB = 'You did not respond to the number correctly. Remember: if the number is ' + inners[0] + ' press the "J" key with your index finger. If the number is ' + inners[1] + ' press the "L" key with your ring finger.'
      } 
  }
  if (tooShort) {
    return '<div class = prp_centerbox><p class = prp_center-block-text>You pressed either "J" or "L" before the number was on the screen! Wait for the number to respond!</p><p class = prp_center-block-text>Press any key to continue</p></div>'
  } else {
    return '<div class = prp_centerbox><p class = prp_center-block-text>' + gonogoFB + '</p><p class = prp_center-block-text>' + choiceFB + '</p><p class = prp_center-block-text>Press any key to continue</p></div>'
  }
}

var appendData = function(data, trial_id) {
  curr_data['trial_id'] = trial_id
  curr_data['trial_num'] = curr_trial
  jsPsych.data.addDataToLastTrial(curr_data)
}

/* ************************************ */
/* Define experimental variables */
/* ************************************ */
var practice_len = 36
var exp_len = 180
var curr_trial = 0
var choices = [74,75,76]
var practice_ISIs = jsPsych.randomization.repeat([5, 50,100,150,200,300, 400, 500, 700], exp_len/9)
var ISIs = practice_ISIs.concat(jsPsych.randomization.repeat([5, 50,100,150,200,300, 400, 500, 700], exp_len/9))
var curr_data = {exp_id: 'prp', trial_id: '', ISI: '', gonogo_stim: '', choice_stim: '', gonogo_correct_response: '', choice_correct_response: ''}
//stim variables
var path_source = 'static/experiments/prp/images/'
var stim_prefix = '<div class = prp_centerbox><div class = prp_stimBox><img class = prpStim src ='
// border color relates to the go-nogo task. The subject should GO to the first two borders in the following array:
var borders = jsPsych.randomization.shuffle(['1_border.png', '2_border.png','3_border.png', '4_border.png'])
// inner number reflect the choice RT. 
var inners = jsPsych.randomization.shuffle([3,4])

//instruction stim
var box1 = '<div class = prp_left-instruction><div class = prp_stimBox><img class = prpStim src = ' + path_source + borders[0] + ' </img></div></div>'
var box2 = '<div class = prp_right-instruction><div class = prp_stimBox><img class = prpStim src = ' + path_source + borders[1] + ' </img></div></div>'
var box_number1 = '<div class = prp_left-instruction><div class = prp_stimBox><img class = prpStim src = ' + path_source + borders[0] + ' </img></div></div>' + '<div class = prp_left-instruction><div class = prp_center-text>' + inners[0] + '</div></div>'
var box_number2 = '<div class = prp_right-instruction><div class = prp_stimBox><img class = prpStim src = ' + path_source + borders[1] + ' </img></div></div>' + '<div class = prp_right-instruction><div class = prp_center-text>' + inners[1] + '</div></div>'


/* ************************************ */
/* Set up jsPsych blocks */
/* ************************************ */
/* define static blocks */
var welcome_block = {
  type: 'text',
  text: '<div class = prp_centerbox><p class = center-block-text>Welcome to the PRP experiment. Press <strong>enter</strong> to begin.</p></div>',
  cont_key: 13,
  timing_post_trial: 0,
  on_finish: function() {
    $('body').css('background','black')
  }
};

var end_block = {
  type: 'text',
  text: '<div class = prp_centerbox><p class = prp_center-block-text>Thanks for completing this task!</p><p class = prp_center-block-text>Press <strong>enter</strong> to continue.</p></div>',
  cont_key: 13,
  timing_post_trial: 0,
  on_finish: function() {
    $('body').css('background','white')
  }
};

var instructions_block = {
  type: 'instructions',
  pages: ['<div class = prp_centerbox><p class =prp_block-text>In this experiment, you will have to do two tasks in quick succession. You will respond by pressing the "J", "K" and "L" keys with your index, middle and ring fingers respectively.</p><p class =prp_block-text>First, a colored square will appear on the screen. If the square is either of the two below, you should press "K" key with your middle finger. If it is not one of those colors, you should not respond.</p></div>' + box1 + box2,
  '<div class = prp_centerbox><p class =prp_block-text>After a short delay one of two numbers will appear in the square (as you can see below). If the number is ' + inners[0] + ' press the "J" key with your index finger. If the number is ' + inners[1] + ' press the "L" key with your ring finger.</p><p class =prp_block-text>It is very important that you respond as quickly as possible! You should respond to the colored square first and then the number. If you are supposed to respond to the colored square, respond as quickly as you can and then respond to the number. If you are not supposed to respond to the colored square, respond as quickly as possible to the number.</p><p class =prp_block-text>We will start with some practice after you end the instructions. Make sure you remember which colored squares to respond to and which keys to press for the two numbers before you continue.</p></div>' + box_number1 + box_number2],
  allow_keys: false,
  show_clickable_nav: true,
  timing_post_trial: 1000
};

var start_practice_block = {
  type: 'text',
  text: '<div class = prp_centerbox><p class = prp_center-block-text>We will start ' + practice_len + ' practice trials. Press <strong>enter</strong> to begin.</p></div>',
  cont_key: 13,
  timing_post_trial: 1000
};

var start_test_block = {
  type: 'text',
  text: '<div class = prp_centerbox><p class =prp_center-block-text>We will now start the test. Respond to the "X" as quickly as possible by pressing the spacebar. Press <strong>enter</strong> to begin.</p></div>',
  cont_key: 13,
  timing_post_trial: 1000,
  on_finish: function() {
    curr_trial = 0
  }
};

var fixation_block = {
  type: 'single-stim',
  stimuli: '<div class = centerbox><div class = prp_center-text>+</div></div>',
  is_html: true,
  timing_stim: 300,
  timing_response: 300,
  data: {exp_id: 'prp', trial_id: 'fixation'},
  choices: 'none',
  response_ends_trial: true,
  timing_post_trial: 1000
}

/* define practice block */
var practice_block = {
  type: 'multi-stim-multi-response',
  stimuli: getStim,
  is_html: true,
  choices: [choices,choices],
  timing_stim: getISI,
  timing_response: 2000,
  response_ends_trial: true, 
  on_finish: function() {
    appendData('practice')
    curr_trial += 1
  },
  timing_post_trial: 500
}

var feedback_block = {
  type: 'single-stim',
  stimuli: getFB,
  is_html: true,
  data: {exp_id: 'prp', trial_id: 'practice_feedback'},
  timing_stim: -1,
  timing_response: -1,
  response_ends_trial: true,
  timing_post_trial: 500
}


/* define test block */
var test_block = {
  type: 'multi-stim-multi-response',
  stimuli: getStim,
  is_html: true,
  choices: [choices,choices],
  timing_stim: getISI,
  respond_ends_trial: true,
  timing_response: 2000, 
  on_finish: function(data) {
    appendData('test')
    curr_trial += 1
  },
  timing_post_trial: 500
}


/* create experiment definition array */
var prp_experiment = [];
prp_experiment.push(welcome_block);
prp_experiment.push(instructions_block);
prp_experiment.push(start_practice_block);
for (var i = 0; i < practice_len; i++) {
  prp_experiment.push(fixation_block);
  prp_experiment.push(practice_block);
  prp_experiment.push(feedback_block);
}
prp_experiment.push(start_test_block);
for (var i = 0; i < exp_len; i++) {
  prp_experiment.push(fixation_block);
  prp_experiment.push(test_block)
}
prp_experiment.push(end_block);
