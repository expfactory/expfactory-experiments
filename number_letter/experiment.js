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

var getStim = function() {
  return randomDraw(randomDraw(letters)) + randomDraw(randomDraw(numbers))
}

var getTopStim = function() {
  stim_place = 'top' + randomDraw(['left', 'right'])
  stim_id = getStim()
  return [stim_place, stim_id, '<div class = numlet-' + stim_place + '><p class = numlet-text>' + stim_id +
    '</p></div><div class = vertical-line></div><div class = horizontal-line></div>'
  ]
}

var getBottomStim = function() {
  stim_place = 'bottom' + randomDraw(['left', 'right'])
  stim_id = getStim()
  return [stim_place, stim_id, '<div class = numlet-' + stim_place + '><p class = numlet-text>' + stim_id +
    '</p></div><div class = vertical-line></div><div class = horizontal-line></div>'
  ]
}

var getRotateStim = function() {
  switch (place) {
    case 0:
      stim_place = 'bottomright'
      break
    case 1:
      stim_place = 'bottomleft'
      break
    case 2:
      stim_place = 'topleft'
      break
    case 3:
      stim_place = 'topright'
      break
  }
  place = (place + 1) % 4
  stim_id = getStim()
  return [stim_place, stim_id, '<div class = numlet-' + stim_place + '><p class = numlet-text>' + stim_id+
    '</p></div><div class = vertical-line></div><div class = horizontal-line></div>'
  ]
}



/* ************************************ */
/* Define experimental variables */
/* ************************************ */
// generic task variables
var sumInstructTime = 0 //ms
var instructTimeThresh = 0 ///in seconds

// task specific variables
var correct_responses = jsPsych.randomization.shuffle([
  ["M", 77],
  ["Z", 90]
]).concat(jsPsych.randomization.shuffle([
  ["M", 77],
  ["Z", 90]
]))

var evens = [2, 4, 6, 8]
var odds = [3, 5, 7, 9]
var numbers = [evens, odds]
var consonants = ["G", "K", "M", "R"]
var vowels = ["A", "E", "I", "U"]
var letters = [consonants, vowels]
var place = randomDraw([0, 1, 2, 3])
var choices = [90, 77]
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
  timing_response: 180000,
  data: {
    trial_id: 'end',
    exp_id: 'number_letter'
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
    '<div class = centerbox><p class = block-text>In this experiment you will see letter-number pairs appear in one of four quadrants on the screen. For instance, you may see "G9" appear in the top right of the screen.</p><p class = block-text>When the letter-number pair is in the top half of the screen, you should indicate whether the number is odd or even using the "Z" and "M" keys: <strong>"' + correct_responses[0][0] + '" for odd, "' + correct_responses[1][0] + '" for even.</strong></p><p class = block-text>When the letter-number pair is in the bottom half of the screen, you should indicate whether the letter is a consonant or vowel using the same keys: <strong>"' + correct_responses[2][0] + '" for consonant, "' + correct_responses[3][0] + '" for vowel.</strong></p></div>'
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
      if ((data[i].trial_type === 'poldrack-instructions') && (data[i].rt !== -1)) {
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

var gap_block = {
  type: 'poldrack-single-stim',
  stimulus: '<div class = vertical-line></div><div class = horizontal-line></div>',
  choices: 'none',
  is_html: true,
  data: {
    trial_id: 'gap'
  },
  timing_response: 150,
  timing_stim: 150,
  timing_post_trial: 0

}
/* create experiment definition array */
var number_letter_experiment = []
number_letter_experiment.push(instruction_node)

half_block_len = 32
rotate_block_len = 128
for (i = 0; i < half_block_len; i++) {
  stim = getTopStim()
  var top_block = {
    type: 'poldrack-single-stim',
    stimulus: stim[2],
    is_html: true,
    choices: choices,
    data: {
      trial_id: 'stim',
      exp_stage: 'top',
      stim_place: stim[0],
      stim_id: stim[1],
      condition: 'oddeven'
    },
    timing_post_trial: 0,
    response_ends_trial: true,
    on_finish: function(data) {
    	var correct = false
    	var correct_response = 0
    	if (data.stim_id[1] % 2 === 0) {
    		correct_response = correct_responses[1][1]
    	}
    	else {
    		correct_response = correct_responses[0][1]
    	}
    	if (data.key_press === correct_response) {
    		correct = true
    	}
    	jsPsych.data.addDataToLastTrial({correct: correct, correct_response: correct_response})
    }
  }
  number_letter_experiment.push(top_block)
  number_letter_experiment.push(gap_block)
}
for (i = 0; i < half_block_len; i++) {
  stim = getBottomStim()
  var bottom_block = {
    type: 'poldrack-single-stim',
    stimulus: stim[2],
    is_html: true,
    choices: choices,
    data: {
      trial_id: 'stim',
      exp_stage: 'bottom',
      stim_place: stim[0],
      stim_id: stim[1],
      condition: 'consonantvowel'
    },
    timing_post_trial: 0,
    response_ends_trial: true,
    on_finish: function(data) {
    	var correct = false
    	var correct_response = 0
    	if (['a', 'e', 'i', 'o', 'u'].indexOf(data.stim_id[1].toLowerCase()) === -1) {
    		correct_response = correct_responses[2][1]
    	}
    	else {
    		correct_response = correct_responses[3][1]
    	}
    	if (data.key_press === correct_response) {
    		correct = true
    	}
    	jsPsych.data.addDataToLastTrial({correct: correct, correct_response: correct_response})
    }
  }
  number_letter_experiment.push(bottom_block)
  number_letter_experiment.push(gap_block)
}
for (i = 0; i < rotate_block_len; i++) {
  stim = getRotateStim()
  var rotate_block = {
    type: 'poldrack-single-stim',
    stimulus: stim[2],
    is_html: true,
    choices: choices,
    data: {
      trial_id: 'stim',
      exp_stage: 'rotate_switch',
      stim_place: stim[0],
      stim_id: stim[1]
    },
    timing_post_trial: 0,
    response_ends_trial: true,
    on_finish: function(data) {
    	var correct = false
    	var condition = 'oddeven'
    	var correct_response = 0
    	if (data.stim_place === "bottomleft" | data.stim_place === "bottomright") {
    		condition = 'consonantvowel'
	    	if (['a', 'e', 'i', 'o', 'u'].indexOf(data.stim_id[1].toLowerCase()) === -1) {
	    		correct_response = correct_responses[2][1]
	    	}
	    	else {
	    		correct_response = correct_responses[3][1]
	    	}
	    } else {
	    	if (data.trial_id[1] % 2 === 0) {
    			correct_response = correct_responses[1][1]
    	}
	    	else {
	    		correct_response = correct_responses[0][1]
	    	}
	    }
    	if (data.key_press === correct_response) {
    		correct = true
    	}
    	jsPsych.data.addDataToLastTrial({correct: correct, 
    									correct_response: correct_response,
    									condition: condition})
    }
  }
  number_letter_experiment.push(rotate_block)
  number_letter_experiment.push(gap_block)
}
number_letter_experiment.push(post_task_block)
number_letter_experiment.push(end_block)