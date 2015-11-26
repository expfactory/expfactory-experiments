// Reference: http://www.sciencedirect.com/science/article/pii/S001002859990734X
// condition indicates practice/test, trial_id indicates stimulus shown on each trial. Correct response is determined by repetitions since last response and is not calculated in this script (calculate in post)


/* ************************************ */
/* Define helper functions */
/* ************************************ */
var randomDraw = function(lst) {
    var index = Math.floor(Math.random()*(lst.length))
    return lst[index]
}

var get_correct_key = function() {
	return correct_key
}

var update_count = function() {
	var stim = practice_trials.data[practice_count].trial_id
	if (stim == 'red') {
		red_count += 1
	} else if (stim == 'green') {
		green_count += 1
	} else if (stim == 'blue') {
		blue_count += 1
	}
	
	if (stim == 'red' && red_count == 4) {
		correct_key = 32
		red_count = 0
	} else if (stim == 'green' && green_count == 4) {
		correct_key = 32
		green_count = 0
	} else if (stim == 'blue' && blue_count == 4) {
		correct_key = 32
		blue_count = 0
	} else {
		correct_key =  'none'
	}
	practice_count += 1 
}

var reset_count = function() {
	var curr_trial = jsPsych.progress().current_trial_global
	var stim = jsPsych.data.getData()[curr_trial].trial_id
	var key = jsPsych.data.getData()[curr_trial].key_press
	if (stim == 'red' && key != -1) {
		red_count = 0
	} else if (stim == 'green' && key != -1) {
		green_count = 0
	} else if (stim == 'blue' && key != -1) {
		blue_count = 0
	} else {
		return 'none'
	}
}
/* ************************************ */
/* Define experimental variables */
/* ************************************ */
var red_count = 0
var green_count = 0
var blue_count = 0
var correct_key = 'none'
var practice_count = 0

practice_stims = [{image: '<div class = centerbox><div class = shape id = stim1></div></div>',
		  data: {exp_id: 'image_monitoring', trial_id: 'red', condition: 'practice'}},
		 {image: '<div class = centerbox><div class = shape id = stim2></div></div>',
		  data: {exp_id: 'image_monitoring', trial_id: 'green', condition: 'practice'}},
		 {image: '<div class = centerbox><div class = shape id = stim3></div></div>',
		 data: {exp_id: 'image_monitoring', trial_id: 'blue', condition: 'practice'}}
]

stims = [{image: '<div class = centerbox><div class = shape id = stim1></div></div>',
		  data: {exp_id: 'image_monitoring', trial_id: 'red', condition: 'test'}},
		 {image: '<div class = centerbox><div class = shape id = stim2></div></div>',
		  data: {exp_id: 'image_monitoring', trial_id: 'green', condition: 'test'}},
		 {image: '<div class = centerbox><div class = shape id = stim3></div></div>',
		 data: {exp_id: 'image_monitoring', trial_id: 'blue', condition: 'test'}}
]

last_tone = randomDraw(practice_stims)
practice_trials = jsPsych.randomization.repeat(practice_stims,8, true);
practice_trials.image.push(last_tone.sound)
practice_trials.data.push(last_tone.data)

block_num = 4
blocks = []
for (b=0; b<block_num; b++){
	block_trials = jsPsych.randomization.repeat(stims,8,true);
	last_shape = randomDraw(stims)
	block_trials.image.push(last_shape.sound)
	block_trials.data.push(last_shape.data)
	blocks.push(block_trials)
}

/* ************************************ */
/* Set up jsPsych blocks */
/* ************************************ */
/* define static blocks */
var welcome_block = {
	
  type: 'text',
  text: '<div class = centerbox><p class = block-text>Welcome to the shape monitoring experiment. Press <strong>enter</strong> to begin.</p></div>',
  cont_key: 13,
  timing_post_trial: 0
};

  
var instructions_block = {
  type: 'instructions',
  pages: [
    '<div class = centerbox><p class = block-text>In this experiment you will see shapes in a sequence, one after the other. You will see one of three shapes on each trial: a red square, a green square, or a blue square.</p></div>',
    '<div class = centerbox><p class = block-text>Your job is to keep each track of the number of times each shape repeats and respond when you see any shape repeat four times by pressing the spacebar. For instance, if you see "red, red, blue, green, red, blue, green, <strong>red</strong>" you should respond on the last (fourth) red shape.</p><p class = block-text>If the sequence of shapes continued with "red, green, blue, <strong>green</strong>" you would respond again, as the green shape had repeated four times, and so on.</p></div>',
	"<div class = centerbox><p class = block-text>After you respond by pressing the spacebar, you should 'reset' that shape's count. So in the previous examples, once you press the spacebar in response to the red shapes, you should start counting the red shapes again from 0.</p><p class = block-text>Even if you believe you pressed the spacebar at the wrong time (if you thought only 3 red shapes had passed instead of 4), you <strong>still should reset your count</strong>. So if you count 3 red shapes and inappropriately responded, begin counting red shapes from 0 again.</p></div>",
	'<div class = centerbox><p class = block-text>To summarize, you will keep track of three different shapes: blue, green and red. When you count 4 of any shape, press the spacebar. After you respond to a shape (regardless of if you were correct or not), mentally reset that shapes count, while leaving the count for the other shapes intact.</p></div>'
	],
  allow_keys: false,
  show_clickable_nav: true,
  timing_post_trial: 1000
};


var end_block = {
  type: 'text',
  text: '<div class = centerbox><p class = center-block-text>Finished with this task.</p><p class = center-block-text>Press <strong>enter</strong> to continue.</p></div>',
  cont_key: 13,
  timing_post_trial: 0
};

var start_practice_block = {
  type: 'text',
  text: '<div class = centerbox><p class = block-text>We will start with some practice followed by ' + block_num + ' test blocks. During practice you will get feedback about whether your responses are correct or not, which you will not get during the rest of the experiment. Press <strong>enter</strong> to begin.</p></div>',
  cont_key: 13,
  timing_post_trial: 1000
};

var start_test_block = {
  type: 'text',
  text: '<div class = centerbox><p class = block-text>Starting a test block. Remember to respond after a shape repeats four times and "reset" your count after you press the spacebar, <strong>regardless of whether or not you were correct</strong>.</p><p class = block-text>Press <strong>enter</strong> to begin.</p></div>',
  cont_key: 13,
  timing_post_trial: 1000
};

var update_function = {
	type: 'call-function',
	func: update_count,
    timing_post_trial: 0
}

//Set up experiment
var image_monitoring_experiment = []
image_monitoring_experiment.push(welcome_block);
image_monitoring_experiment.push(instructions_block);
image_monitoring_experiment.push(start_practice_block);

// set up practice
for (i = 0; i< practice_trials.image.length; i++) {	
	var practice_shape_block = {
	  type: 'categorize',
	  is_html: true,
	  stimuli: [practice_trials.image[i]],
	  data: [practice_trials.data[i]],
	  key_answer: get_correct_key,
	  correct_text: '<div class = centerbox><div class = center-text>Correct</div></div>',
	  incorrect_text: '<div class = centerbox><div class = center-text>Incorrect</div></div>',
	  timeout_message: ' ',
	  choices: [32],
	  timing_stim: 500,
	  timing_response: 2000,
	  timing_feedback_duration: 1000,
	  show_stim_with_feedback: false,
	  timing_post_trial: 500,
	  on_trial_start: update_count,
	  on_finish: reset_count
	};
	//image_monitoring_experiment.push(update_function)
	//image_monitoring_experiment.push(practice_shape_block)
}

// set up test
for (b=0; b<block_num; b++) {
	block = blocks[b]
	image_monitoring_experiment.push(start_test_block)
	var test_shape_block = {
	  type: 'single-stim',
	  is_html: true,
	  stimuli: block.image,
	  data: block.data,
	  choices: [32],
	  timing_stim: 500,
	  timing_response: 2500,
	  response_ends_trial: false,
	  timing_post_trial: 0
	};
	image_monitoring_experiment.push(test_shape_block)
}

image_monitoring_experiment.push(end_block)
