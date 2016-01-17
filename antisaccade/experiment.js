/* ************************************ */
/* Define helper functions */
/* ************************************ */

var randomDraw = function(lst) {
    var index = Math.round(Math.random()*(lst.length-1))
    return lst[index]
}

var getFixationLength = function() {
    return Math.floor(Math.random()*9)*250+1500
}


/* ************************************ */
/* Define experimental variables */
/* ************************************ */


var correct_responses = jsPsych.randomization.repeat([["left arrow",37],["left arrow",37],["right arrow",39],["right arrow",39]],1)
var prompt_text = '<ul list-text><li>Square:  ' + correct_responses[0][0] + '</li><li>Circle:  ' + correct_responses[1][0] + ' </li><li>Triangle:  ' + correct_responses[2][0] + ' </li><li>Diamond:  ' + correct_responses[3][0] + ' </li></ul>'

var cues = [
	{image: '<div class = centerbox><div class = stim_left id = cue></div></div>',
	data: {exp_id: "antisaccade", trial_id: "cue", condition: "left"}
	},
	{image: '<div class = centerbox><div class = stim_right id = cue></div></div>',
	data: {exp_id: "antisaccade", trial_id: "cue", condition: "right"}
	}

]
var targets = [
	{image: '<div class = centerbox><div class = stim_left id = target></div></div>',
	data: {exp_id: "antisaccade", trial_id: "target", condition: "left"}
	},
	{image: '<div class = centerbox><div class = stim_right id = target></div></div>',
	data: {exp_id: "antisaccade", trial_id: "target", condition: "right"}
	}
]

var masks = [
	{image: '<div class = centerbox><div class = stim_left id = mask></div></div>',
	data: {exp_id: "antisaccade", trial_id: "mask", condition: "left"}
	},
	{image: '<div class = centerbox><div class = stim_right id = mask></div></div>',
	data: {exp_id: "antisaccade", trial_id: "mask", condition: "right"}
	}
]


practice_len = 22
exp_len = 90
//0 = right, 1 = left
practice_cue_sides = jsPsych.randomization.repeat([0,1],practice_len/2,false)
test_cue_sides = jsPsych.randomization.repeat([0,1],exp_len/2,false)

/* ************************************ */
/* Set up jsPsych blocks */
/* ************************************ */

/* define static blocks */
var welcome_block = {
  type: 'text',
  text: '<div class = centerbox><p class = block-text>Welcome to the antisaccade experiment. Press <strong>enter</strong> to begin.</p></div>',
  cont_key: [13],
  timing_post_trial: 0
};

var end_block = {
  type: 'text',
  text: '<div class = centerbox><p class = center-block-text>Thanks for completing this task!</p><p class = center-block-text>Press <strong>enter</strong> to continue.</p></div>',
  cont_key: [13],
  timing_post_trial: 0
};

var instructions_block = {
  type: 'poldrack-instructions',
  pages: ['<div class = centerbox><p class = block-text>In this task you will have to identify which way an arrow is pointing. In each trial a cross will appear on the screen, after which a black square will be presented on one side of the screen (left or right).</p><p class = block-text>Following the square an arrow will be presented on the other side of the screen and then quickly covered up by a grey mask. You should respond by identifying which way the arrow was pointed (left, right, or up) using the arrow keys.</p></div>'],
  allow_keys: false,
  show_clickable_nav: true,
  timing_post_trial: 1000
};

var begin_practice_block = {
  type: 'text',
  text: '<div class = centerbox><p class = block-text>We will start with some practice. Remember, use the arrow keys (left, right, and up) to indicate which direction the arrow is pointing.</p><p class = block-text>Press <strong>enter</strong> to begin.</p></div>',
  cont_key: [13],
  timing_post_trial: 1000
};

var begin_test_block = {
  type: 'text',
  text: '<div class = centerbox><p class = block-text>We will now start the main experiment. Remember, use the arrow keys (left, right, and up) to indicate which direction the arrow is pointing.</p><p class = block-text>Press <strong>enter</strong> to begin.</p></div>',
  cont_key: [13],
  timing_post_trial: 1000
};


var fixation_block = {
  type: 'poldrack-single-stim',
  stimulus: '<div class = centerbox><div class = fixation>+</div></div>',
  is_html: true,
  choices: 'none',
  data: {exp_id: "antisaccade", "trial_id": "fixation"},
  timing_post_trial: 0,
  timing_stim: getFixationLength(),
  timing_response: 500
}



/* ************************************ */
/* Set up experiment */
/* ************************************ */

var antisaccade_experiment = []
antisaccade_experiment.push(welcome_block);
antisaccade_experiment.push(instructions_block);

//Set up practice
antisaccade_experiment.push(begin_practice_block)
for (i=0; i<practice_len; i++) {
    antisaccade_experiment.push(fixation_block)
    target_direction = randomDraw([['left',37],['right',39],['up',38]])
    if (practice_cue_sides[i]==0) {
        cue = cues[0]
        target = {image: '<div class = centerbox><div class = stim_right id = target_' + target_direction[0] + '></div></div>',
                data: {exp_id: "antisaccade", trial_id: "target", correct_response: target_direction[1], condition: 'right'}
                }
        mask = masks[1]
    } else {
        cue = cues[1]
        target = {image: '<div class = centerbox><div class = stim_left id = target_' + target_direction[0] + '></div></div>',
                data: {exp_id: "antisaccade", trial_id: "target", correct_response: target_direction[1], condition: 'left'}
                }
        mask = masks[0]
    }
    var cue_block = {
      type: 'poldrack-single-stim',
      stimulus: cue.image,
      is_html: true,
      choices: [37, 38, 39],
      data: cue.data,
      timing_post_trial: 0,
      timing_stim: 225,
      timing_response: 225,
      response_ends_trial: false
    }
    
    var target_block = {
      type: 'poldrack-single-stim',
      stimulus: target.image,
      is_html: true,
      choices: [37, 38, 39],
      data: target.data,
      timing_post_trial: 0,
      timing_stim: 150,
      timing_response: 150,
      response_ends_trial: false
    }
    
    var mask_block = {
      type: 'poldrack-single-stim',
      stimulus: mask.image,
      is_html: true,
      choices: [37, 38, 39],
      data: mask.data,
      timing_post_trial: 0,
      timing_stim: 1000,
      timing_response: 1000,
      response_ends_trial: false
    }
    antisaccade_experiment.push(cue_block)
    antisaccade_experiment.push(target_block)
    antisaccade_experiment.push(mask_block)
}

//Set up test
antisaccade_experiment.push(begin_test_block)
for (i=0; i<exp_len; i++) {
    antisaccade_experiment.push(fixation_block)
    target_direction = randomDraw([['left',37],['right',39],['up',38]])
    if (test_cue_sides[i]==0) {
        cue = cues[0]
        target = {image: '<div class = centerbox><div class = stim_right id = target_' + target_direction[0] + '></div></div>',
                data: {exp_id: "antisaccade", trial_id: "target", correct_response: target_direction[1], condition: 'right'}
                }
        mask = masks[1]
    } else {
        cue = cues[1]
        target = {image: '<div class = centerbox><div class = stim_left id = target_' + target_direction[0] + '></div></div>',
                data: {exp_id: "antisaccade", trial_id: "target", correct_response: target_direction[1], condition: 'left'}
                }
        mask = masks[0]
    }
    var cue_block = {
      type: 'poldrack-single-stim',
      stimulus: cue.image,
      is_html: true,
      choices: [37, 38, 39],
      data: cue.data,
      timing_post_trial: 0,
      timing_stim: 225,
      timing_response: 225,
      response_ends_trial: false
    }
    
    var target_block = {
      type: 'poldrack-single-stim',
      stimulus: target.image,
      is_html: true,
      choices: [37, 38, 39],
      data: target.data,
      timing_post_trial: 0,
      timing_stim: 150,
      timing_response: 150,
      response_ends_trial: false
    }
    
    var mask_block = {
      type: 'poldrack-single-stim',
      stimulus: mask.image,
      is_html: true,
      choices: [37, 38, 39],
      data: mask.data,
      timing_post_trial: 0,
      timing_stim: 1000,
      timing_response: 1000,
      response_ends_trial: false
    }
    antisaccade_experiment.push(cue_block)
    antisaccade_experiment.push(target_block)
    antisaccade_experiment.push(mask_block)
}
