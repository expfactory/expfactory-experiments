
/* ************************************ */
/* Define helper functions */
/* ************************************ */

var randomDraw = function(lst) {
    var index = Math.floor(Math.random()*(lst.length))
    return lst[index]
}

var getStim = function() {
  var colors = jsPsych.randomization.shuffle(stim_att.colors)
  var shapes = jsPsych.randomization.shuffle(stim_att.shapes)
  var patterns = jsPsych.randomization.shuffle(stim_att.patterns)
  stims = []
  for (var i = 0; i < 3; i++) {
    stims.push(path_source + colors[i] + '_' + shapes[i] + '_' + patterns[i] + '.png')
  }
  return '<div class = shift_left><img src = ' + stims[0] + ' width = "50%" </img></div>' + 
        '<div class = shift_middle><img src = ' + stims[1] + ' width = "50%"  </img></div>' + 
        '<div class = shift_right><img src = ' + stims[2] + ' width = "50%"  </img></div>'
}

var getFeedback = function() {
  var last_trial = jsPsych.data.getLastTrialData()
  var position_array = ['shift_left', 'shift_middle', 'shift_right']
  var choice = choices.indexOf(last_trial.key_press)
  if (choice != -1) {
    var image = '<div class = ' + position_array[choice] + '><img src = ' + stims[choice] + ' width = "50%" </img></div>'
    var feedback_text = 'You won 0 points.'
    if (image.indexOf(rewarded_feature) != -1 && Math.random() > .25) {
        feedback_text = 'You won 1 point!'
    } else if (image.indexOf(rewarded_feature) == -1 && Math.random() <= .25) {
        feedback_text = 'You won 1 point!'
    }
    return image + '<div class = shift_feedback_box><p class = block-text>' + feedback_text + '</p></div>'
  } else {
    return '<div class = shift_feedback_box><p class = block-text>Respond faster!</p></div>'
  }
}

var getPracticeFeedback = function() {
  var last_trial = jsPsych.data.getLastTrialData()
  var position_array = ['shift_left', 'shift_middle', 'shift_right']
  var choice = choices.indexOf(last_trial.key_press)
  if (choice != -1) {
    var image = '<div class = ' + position_array[choice] + '><img src = ' + stims[choice] + ' width = "50%" </img></div>'
    var feedback_text = 'You won 0 points.'
    if (image.indexOf(rewarded_feature) != -1 && Math.random() > .25) {
        feedback_text = 'You won 1 point!'
    } else if (image.indexOf(rewarded_feature) == -1 && Math.random() <= .25) {
        feedback_text = 'You won 1 point!'
    }
    console.log(switch_count, switch_bound, rewarded_feature)
    if (switch_count+1 == switch_bound) {
      feedback_text += ' The important feature will switch now.'
    }
    return image + '<div class = shift_feedback_box><p class = block-text>' + feedback_text + '</p></div>'
  } else {
    if (switch_count+1 == switch_bound) {
      feedback_text += ' The important feature will switch now.'
    }
    return '<div class = shift_feedback_box><p class = block-text>Respond faster!</p></div>'
  }
}


/* ************************************ */
/* Define experimental variables */
/* ************************************ */
var practice_len = 100
var exp_len = 400
var choices = [37, 40, 39]
var current_trial = 0

// stim variables
var stim_att = {
  colors: ['red','blue','green'],
  shapes: ['circle','square','triangle'],
  patterns: ['dots','lines','waves']
}
var stims = []
var features = stim_att.colors.concat(stim_att.shapes).concat(stim_att.patterns)
var path_source = 'static/experiments/shift_task/images/'
var rewarded_feature = randomDraw(features)

// variables to track feature switch
var switch_count = 0 //when switch_count equals switch_bound the feature switches
var switch_bound = Math.floor(Math.random()*11)+15


/* ************************************ */
/* Set up jsPsych blocks */
/* ************************************ */
/* define static blocks */
var welcome_block = {
  type: 'text',
  text: '<div class = centerbox><p class = block-text>Welcome to the shift experiment. Press <strong>enter</strong> to begin.</p></div>',
  cont_key: 13,
  timing_post_trial: 0
};

var end_block = {
  type: 'text',
  text: '<div class = centerbox><p class = center-block-text>Finished with this task.</p><p class = center-block-text>Press <strong>enter</strong> to continue.</p></div>',
  cont_key: 13,
  timing_post_trial: 0
};

var instructions_block = {
  type: 'instructions',
  pages: ['<div class = shift_feedback_block><p class = block-text>On each trial of this experiment three patterned shapes will be presented.  </p></div>'],
  allow_keys: false,
  show_clickable_nav: true,
  timing_post_trial: 1000
};

var start_test_block = {
  type: 'text',
  text: '<div class = centerbox><p class = block-text>We will now start the test. Press <strong>enter</strong> to begin.</p></div>',
  cont_key: 13,
  timing_post_trial: 1000
};

var reset_block = {
  type: 'call-function',
  func: function() {
    current_trial = 0
    switch_count = 0
    rewarded_feature = randomDraw(features)
  },
  timing_post_trial: 0
}

/* define test block */
var practice_stim_block = {
  type: 'single-stim',
  stimuli: getStim,
  is_html: true,
  data: {exp_id: "shift", trial_id: "practice_stim", trial_num: current_trial},
  choices: choices,
  timing_stim: 2000,
  timing_response: 2000,
  timing_post_trial: 0
};

var practice_feedback_block = {
  type: 'single-stim',
  stimuli: getPracticeFeedback,
  is_html: true,
  data: {exp_id: "shift", trial_id: "practice_feedback", trial_num: current_trial},
  choices: 'none',
  timing_stim: 1000,
  timing_response: 1000,
  timing_post_trial: 500,
  on_finish: function() {
    switch_count += 1
    if (switch_count == switch_bound) {
      switch_count = 0
      switch_bound = Math.floor(Math.random()*11)+15
      rewarded_feature = randomDraw(features.filter(function(x){return x!=rewarded_feature}))
    }
  }
};

/* define test block */
var stim_block = {
  type: 'single-stim',
  stimuli: getStim,
  is_html: true,
  data: {exp_id: "shift", trial_id: "stim", trial_num: current_trial},
  choices: choices,
  timing_stim: 2000,
  timing_response: 2000,
  timing_post_trial: 0
};

var feedback_block = {
  type: 'single-stim',
  stimuli: getFeedback,
  is_html: true,
  data: {exp_id: "shift", trial_id: "feedback", trial_num: current_trial},
  choices: 'none',
  timing_stim: 1000,
  timing_response: 1000,
  timing_post_trial: 500,
  on_finish: function() {
    switch_count += 1
    if (switch_count == switch_bound) {
      switch_count = 0
      switch_bound = Math.floor(Math.random()*11)+15
      rewarded_feature = randomDraw(features.filter(function(x){return x!=rewarded_feature}))
    }
  }
};

/* create experiment definition array */
var shift_task_experiment = [];
shift_task_experiment.push(welcome_block);
shift_task_experiment.push(instructions_block);
shift_task_experiment.push(start_practice_block);
for (var i = 0; i < practice_len; i++) {
  shift_task_experiment.push(practice_stim_block);
  shift_task_experiment.push(practice_feedback_block);
}
shift_task_experiment.push(reset_block);
shift_task_experiment.push(start_test_block);
for (var i = 0; i < exp_len; i++) {
  shift_task_experiment.push(stim_block);
  shift_task_experiment.push(feedback_block);
}
shift_task_experiment.push(end_block);
