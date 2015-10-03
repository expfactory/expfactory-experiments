/* ************************************ */
/* Define helper functions */
/* ************************************ */
var post_trial_gap = function() {
  return Math.floor( Math.random() * 500 ) + 500;
}

/* ************************************ */
/* Define experimental variables */
/* ************************************ */
var correct_responses = jsPsych.randomization.repeat([["left arrow",37],["right arrow",39]],1)
var test_stimuli = [
  {
	image: '<div class = centerbox><div class = flanker-text>ffhff</div></div>',
	data: { correct_response: 72, condition: 'incompatible', exp_id: 'flanker'}
  },
  {
	image:  '<div class = centerbox><div class = flanker-text>hhfhh</div></div>',
	data: { correct_response: 70, condition:  'incompatible', exp_id: 'flanker'}
  },
  {
	image: '<div class = centerbox><div class = flanker-text>hhhhh</div></div>',
	data: { correct_response: 72, condition: 'compatible', exp_id: 'flanker'}
  },
  {
	image:  '<div class = centerbox><div class = flanker-text>fffff</div></div>',
	data: { correct_response: 70, condition:  'compatible', exp_id: 'flanker'}
  }
];

practice_len = 12
exp_len = 100
var practice_trials = jsPsych.randomization.repeat(test_stimuli, practice_len/4, true);
var test_trials = jsPsych.randomization.repeat(test_stimuli, exp_len/4, true);

var practice_response_array = [];
for (i = 0; i < practice_trials.data.length; i++) {
	practice_response_array.push(practice_trials.data[i]['correct_response'])
}

var test_response_array = [];
for (i = 0; i < test_trials.data.length; i++) {
	test_response_array.push(test_trials.data[i]['correct_response'])
}

/* ************************************ */
/* Set up jsPsych blocks */
/* ************************************ */
/* define static blocks */
var welcome_block = {
  type: 'text',
  text: '<div class = centerbox><p class = block-text>Welcome to the flanker experiment. Press <strong>enter</strong> to begin.</p></div>',
  cont_key: 13
};

  
var instructions_block = {
  type: 'text',
  text: "<div class = centerbox><p class = block-text>In this experiment you will see five letters on the string composed of f's and h's. For instance, you might see 'fffff' or 'hhfhh'. Your task is to respond by pressing the key corresponding to the <strong>middle</strong> letter. So if you see 'ffhff' you would press the 'h' key.</p><p class = block-text>After each respond you will get feedback about whether you were correct or not. We will start with a short practice set.</p><p class = block-text>Press <strong>enter</strong> to begin.</p></div>",
  cont_key: 13
};

var end_block = {
  type: 'text',
  text: '<div class = centerbox><p class = center-block-text>Finished with this task.</p><p class = center-block-text>Press <strong>enter</strong> to continue.</p></div>',
  cont_key: 13
};

var start_test_block = {
  type: 'text',
  text: '<div class = centerbox><p class = center-block-text>Done with practice. Starting test.</p><p class = center-block-text>Press <strong>enter</strong> to begin.</p></div>',
  cont_key: 13
};

var fixation_block = {
  type: 'single-stim',
  stimuli: '<div class = centerbox><div class = fixation>+</div></div>',
  is_html: true,
  choices: 'none',
  timing_stim: 500,
  timing_response: 500,
  timing_post_trial: 0
  
};

//Set up experiment
flanker_experiment = []
flanker_experiment.push(welcome_block);
flanker_experiment.push(instructions_block);
for (i=0; i<practice_len; i++) {
	flanker_experiment.push(fixation_block)
	var practice_block = {
	  type: 'categorize',
	  stimuli: practice_trials.image[i],
	  is_html: true,
	  key_answer: practice_response_array[i],
	  correct_text: '<div class = centerbox><div class = flanker-text>Correct</div></div>',
	  incorrect_text: '<div class = centerbox><div class = flanker-text>Incorrect</div></div>',
	  timeout_message: '<div class = centerbox><div class = flanker-text>Response faster!</div></div>',
	  choices: [70,72],
	  data: practice_trials.data[i],
	  timing_feedback_duration: 1000,
	  show_stim_with_feedback: false,
	  timing_post_trial: 500,
	}
	flanker_experiment.push(practice_block)
}

flanker_experiment.push(start_test_block)

/* define test block */
for (i=0; i<exp_len; i++) {
	flanker_experiment.push(fixation_block)
	var test_block = {
	  type: 'categorize',
	  stimuli: test_trials.image[i],
	  is_html: true,
	  key_answer: test_response_array[i],
	  correct_text: '<div class = centerbox><div class = flanker-text>Correct</div></div>',
	  incorrect_text: '<div class = centerbox><div class = flanker-text>Incorrect</div></div>',
	  timeout_message: '<div class = centerbox><div class = flanker-text>Response faster!</div></div>',
	  choices: [70,72],
	  data: test_trials.data[i],
	  timing_feedback_duration: 1000,
	  show_stim_with_feedback: false,
	  timing_post_trial: 500,
	}
	flanker_experiment.push(test_block)
}
flanker_experiment.push(end_block)


