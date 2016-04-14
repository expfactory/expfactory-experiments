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

var getInstructFeedback = function() {
  return '<div class = centerbox><p class = "center-block-text">' + feedback_instruct_text +
    '</p></div>'
}

var getChoiceText = function() {
  var options = jsPsych.randomization.shuffle(['Distract', 'Reappraise'])
  var choice_text = '<div class = leftBox><div class = center-text>' + options[0] +
    '</div></div>' + '<div class = rightBox><div class = center-text>' + options[1] +
    '</div></div>'
  return choice_text
}

var getTrainingInstruct = function() {
  var instructions = trainingVars.instruction.shift()
  var instruct_text = ''
  if (instructions == 'distract') {
    instruct_text =
      '<div class = centerbox><div class = center-block-text>For this trial, think about something that is emotionally neutral (distract).</div></div>'
  } else if (instructions == 'reappraise') {
    instruct_text =
      '<div class = centerbox><div class = center-block-text>For this trial, thinking about the image in a way that reduces its negative meaning (reappraisal).</div></div>'
  }
  return instruct_text
}

var getTrainingImage = function() {
  var intensity = trainingVars.intense.shift()
  var stim = ''
  if (intensity == 'high') {
    stim = base_path + 'high_intensity/' + high_intensity_stims.shift()
  } else {
    stim = base_path + 'low_intensity/' + low_intensity_stims.shift()
  }
  return '<div class = imageBox><img class = image src = ' + stim + ' </img></div>'
}

var getPracticeInstruct = function() {
  var instructions = practiceVars.instruction.shift()
  var instruct_text = ''
  if (instructions == 'choose') {
    instruct_text =
      '<div class = centerbox><div class = center-block-text>For this trial, choose whether to think of something emotionally neutral (distract) or think about the image in a way that reduces its negative meaning (reppraisal).</div></div>'
  } else if (instructions == 'distract') {
    instruct_text =
      '<div class = centerbox><div class = center-block-text>For this trial, think about something that is emotionally neutral (distract).</div></div>'
  } else if (instructions == 'reappraise') {
    instruct_text =
      '<div class = centerbox><div class = center-block-text>For this trial, thinking about the image in a way that reduces its negative meaning (reappraisal).</div></div>'
  }
  return instruct_text
}

var getPracticeImage = function() {
  var intensity = practiceVars.intense.shift()
  var stim = ''
  if (intensity == 'high') {
    stim = base_path + 'high_intensity/' + high_intensity_stims.shift()
  } else {
    stim = base_path + 'low_intensity/' + low_intensity_stims.shift()
  }
  return '<div class = imageBox><img class = image src = ' + stim + ' </img></div>'
}

var setImage = function() {
  var intensity = stim_intensities.shift()
  if (intensity == 'high') {
    curr_stim = 'high_intensity/' + high_intensity_stims.shift()
  } else {
    curr_stim = 'low_intensity/' + low_intensity_stims.shift()
  }
}

var getImage = function() {
  var stim = base_path + curr_stim
  return '<div class = imageBox><img class = image src = ' + stim + ' </img></div>'
}

/* ************************************ */
/* Define experimental variables */
/* ************************************ */
// generic task variables
var run_attention_checks = false
var attention_check_thresh = 0.65
var sumInstructTime = 0 //ms
var instructTimeThresh = 0 ///in seconds

// task specific variables
var training_len = 4
var practice_len = 8
var exp_len = 30
var curr_trial = 0
var choices = [37, 39]

var base_path = '/static/experiments/emotion_regulation/images/'
var low_intensity_stims = ['1270.JPG', '1301.JPG', '2278.JPG', '2312.JPG', '2490.JPG', '2691.JPG',
  '2700.JPG', '6010.JPG', '6020.JPG', '6190.JPG', '6241.JPG', '6836.JPG', '7300.JPG', '9101.JPG',
  '9102.JPG', '9120.JPG', '9140.JPG', '9160.JPG', '9171.JPG', '9440.JPG', '9470.JPG'
]
var low_intensity_stims = jsPsych.randomization.shuffle(low_intensity_stims)
var high_intensity_stims = ['2053.JPG', '2800.JPG', '3000.JPG', '3010.JPG', '3015.JPG', '3030.JPG',
  '3068.JPG', '3140.JPG', '3150.JPG', '3180.JPG', '3230.JPG', '3261.JPG', '3530.JPG', '6831.JPG',
  '9181.JPG', '9252.JPG', '9301.JPG', '9320.JPG', '9433.JPG', '9410.JPG', '9420.JPG'
]
var high_intensity_stims = jsPsych.randomization.shuffle(high_intensity_stims)
var stim_intensities = jsPsych.randomization.repeat(['high', 'low'], exp_len / 2)
var trainingVars = {
  'instruction': [],
  'intense': []
}

var images = []
for (var i = 0; i < low_intensity_stims.length; i++) {
  images.push(base_path + 'low_intensity/' + low_intensity_stims[i])
  images.push(base_path + 'high_intensity/' + high_intensity_stims[i])
}
//preload images
jsPsych.pluginAPI.preloadImages(images)

if (Math.random() < 0.5) {
  trainingVars.instruction.push('distract');
  trainingVars.intense.push('low');
  trainingVars.instruction.push('distract');
  trainingVars.intense.push('high');
  trainingVars.instruction.push('reappraise');
  trainingVars.intense.push('low');
  trainingVars.instruction.push('reappraise');
  trainingVars.intense.push('high');
} else {
  trainingVars.instruction.push('reappraise');
  trainingVars.intense.push('low');
  trainingVars.instruction.push('reappraise');
  trainingVars.intense.push('high');
  trainingVars.instruction.push('distract');
  trainingVars.intense.push('low');
  trainingVars.instruction.push('distract');
  trainingVars.intense.push('high');
}

var practiceVars = jsPsych.randomization.repeat([{
  instruction: 'choose',
  intense: 'high'
}, {
  instruction: 'choose',
  intense: 'high'
}, {
  instruction: 'choose',
  intense: 'low'
}, {
  instruction: 'choose',
  intense: 'low'
}, {
  instruction: 'distract',
  intense: 'high'
}, {
  instruction: 'distract',
  intense: 'low'
}, {
  instruction: 'reappraise',
  intense: 'high'
}, {
  instruction: 'reappraise',
  intense: 'low'
}], 1, true)
setImage()
var curr_stim = getImage()

/* ************************************ */
/* Set up jsPsych blocks */
/* ************************************ */
// Set up attention check node
var attention_check_block = {
  type: 'attention-check',
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
    exp_id: 'emotion_regulation'
  },
  text: '<div class = centerbox><p class = "center-block-text">Thanks for completing this task!</p><p class = "center-block-text">Press <strong>enter</strong> to continue.</p></div>',
  cont_key: [13],
  timing_post_trial: 0
};

var feedback_instruct_text =
  'Welcome to the experiment. Press <strong>enter</strong> to begin.'
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
    "<div class = centerbox><p class = 'block-text'>In this task you will view negative pictures. These pictures are designed to evoke negative emotions - they may upset you, anger you, or disturb you. This experiment is investigating different strategies you could use to deal with the negative emotions evoked by the images.</p><p class = block-text>We are interested in two types of strategies: distraction and reappraisal. In this task, distraction is when you think about something emotionally neutral while viewing the image. Reappraisal is when you reinterpret the image in such a way that reduces its negative meaning.</p><p class = block-text>During this experiment you will sometimes be instructed to use one of those two strategies, and sometimes you will be allowed to choose. It is important that you continue to look at the image while employing one of those strategies. When you end instructions we will start with some training so you can learn to use these two strategies.</p></div>"
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

var training_instruct = {
  type: 'poldrack-text',
  data: {
    trial_id: 'instruction',
    exp_stage: 'training'
  },
  cont_key: [13],
  text: getTrainingInstruct,
  response_ends_trial: true,
  timing_post_trial: 0,
  timing_response: 180000
}

var training_view = {
  type: 'poldrack-single-stim',
  stimulus: getTrainingImage,
  is_html: true,
  data: {
    trial_id: 'stim-view',
    exp_stage: 'training'
  },
  choices: 'none',
  timing_stim: 15000,
  timing_response: 15000,
  timing_post_trial: 1000
}

var start_practice_block = {
  type: 'poldrack-text',
  timing_response: 180000,
  data: {
    trial_id: 'start_practice'
  },
  text: '<div class = centerbox><p class = "center-block-text">Now that you are familiar with using the two strategies (distraction and reappraisal), we will continue. We will practice switching off using these strategies. For the next block of trials you will either be told which strategy to use or instructed to select one yourself. Press <strong>enter</strong> to begin.</p></div>',
  cont_key: [13],
  timing_post_trial: 500
};

var practice_instruct = {
  type: 'poldrack-text',
  data: {
    trial_id: 'instruction',
    exp_stage: 'practice'
  },
  cont_key: [13],
  text: getPracticeInstruct,
  response_ends_trial: true,
  timing_post_trial: 0,
  timing_response: 180000
}

var practice_view = {
  type: 'poldrack-single-stim',
  stimulus: getPracticeImage,
  is_html: true,
  data: {
    trial_id: 'stim-view',
    exp_stage: 'practice'
  },
  choices: 'none',
  timing_stim: 5000,
  timing_response: 5000,
  timing_post_trial: 1000
}

var start_test_block = {
  type: 'poldrack-text',
  timing_response: 180000,
  data: {
    trial_id: 'start_test'
  },
  text: '<div class = centerbox><p class = "center-block-text">We are now going to start the test. You will see 30 images. On each trial the image will be briefly presented. You will then be asked to choose a strategy when viewing the image - either Distract or Reappraise. After you select that strategy the image will be presented again, during which you should use the strategy you selected to reduce your negative emotion. Press <strong>enter</strong> to begin.</p></div>',
  cont_key: [13],
  timing_post_trial: 500
};

var preview_block = {
  type: 'poldrack-single-stim',
  stimulus: getImage,
  is_html: true,
  data: {
    trial_id: 'stim-preview',
    exp_stage: 'test'
  },
  choices: 'none',
  timing_stim: 500,
  timing_response: 500,
  timing_post_trial: 0
}

var choice_block = {
  type: 'poldrack-single-stim',
  stimulus: getChoiceText,
  choices: choices,
  is_html: true,
  data: {
    trial_id: 'choice',
    exp_stage: 'test'
  },
  response_ends_trial: true,
  timing_post_trial: 0
}

var view_block = {
  type: 'poldrack-single-stim',
  stimulus: getImage,
  is_html: true,
  data: {
    trial_id: 'stim-view',
    exp_stage: 'test'
  },
  choices: 'none',
  timing_stim: 5000,
  timing_response: 5000,
  timing_post_trial: 1000,
  on_finish: function() {
    setImage()
  }
}



/* create experiment definition array */
var emotion_regulation_experiment = [];
emotion_regulation_experiment.push(instruction_node);
for (var i = 0; i < training_len; i++) {
  emotion_regulation_experiment.push(training_instruct)
  emotion_regulation_experiment.push(training_view)
}
emotion_regulation_experiment.push(start_practice_block)
for (var i = 0; i < practice_len; i++) {
  emotion_regulation_experiment.push(practice_instruct)
  emotion_regulation_experiment.push(practice_view)
}
emotion_regulation_experiment.push(start_test_block)
for (var i = 0; i < exp_len; i++) {
  emotion_regulation_experiment.push(preview_block)
  emotion_regulation_experiment.push(choice_block)
  emotion_regulation_experiment.push(view_block)
}
emotion_regulation_experiment.push(post_task_block)
emotion_regulation_experiment.push(end_block);