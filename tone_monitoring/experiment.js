// Reference: http://www.sciencedirect.com/science/article/pii/S001002859990734X
// condition indicates practice/test, trial_id indicates stimulus heard on each trial. Correct response is determined by repetitions since last response and is not calculated in this script (calculate in post)

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
	if (stim == 'high') {
		high_count += 1
	} else if (stim == 'medium') {
		medium_count += 1
	} else if (stim == 'low') {
		low_count += 1
	}
	
	if (stim == 'high' && high_count == 4) {
		correct_key = 32
		high_count = 0
	} else if (stim == 'medium' && medium_count == 4) {
		correct_key = 32
		medium_count = 0
	} else if (stim == 'low' && low_count == 4) {
		correct_key = 32
		low_count = 0
	} else {
		correct_key =  'none'
	}
	practice_count += 1 
}

var reset_count = function() {
	var curr_trial = jsPsych.progress().current_trial_global
	var stim = jsPsych.data.getData()[curr_trial].trial_id
	var key = jsPsych.data.getData()[curr_trial].key_press
	if (stim == 'high' && key != -1) {
		high_count = 0
	} else if (stim == 'medium' && key != -1) {
		medium_count = 0
	} else if (stim == 'low' && key != -1) {
		low_count = 0
	} else {
		return 'none'
	}
}

/* ************************************ */
/* Define experimental variables */
/* ************************************ */
var high_count = 0
var medium_count = 0
var low_count = 0
var correct_key = 'none'
var practice_count = 0

practice_stims = [{sound: 'static/experiments/tone_monitoring/sounds/880Hz_-6dBFS_.5s.mp3',
		  data: {exp_id: 'tone_monitoring', trial_id: 'high', condition: 'practice'}},
		 {sound: 'static/experiments/tone_monitoring/sounds/440Hz_-6dBFS_.5s.mp3',
		  data: {exp_id: 'tone_monitoring', trial_id: 'medium', condition: 'practice'}},
		 {sound: 'static/experiments/tone_monitoring/sounds/220Hz_-6dBFS_.5s.mp3',
		 data: {exp_id: 'tone_monitoring', trial_id: 'low', condition: 'practice'}}
]

stims = [{sound: 'static/experiments/tone_monitoring/sounds/880Hz_-6dBFS_.5s.mp3',
		  data: {exp_id: 'tone_monitoring', trial_id: 'high', condition: 'test'}},
		 {sound: 'static/experiments/tone_monitoring/sounds/440Hz_-6dBFS_.5s.mp3',
		  data: {exp_id: 'tone_monitoring', trial_id: 'medium', condition: 'test'}},
		 {sound: 'static/experiments/tone_monitoring/sounds/220Hz_-6dBFS_.5s.mp3',
		 data: {exp_id: 'tone_monitoring', trial_id: 'low', condition: 'test'}}
]

last_tone = randomDraw(practice_stims)
practice_trials = jsPsych.randomization.repeat(practice_stims,8, true);
practice_trials.sound.push(last_tone.sound)
practice_trials.data.push(last_tone.data)

block_num = 4
blocks = []
for (b=0; b<block_num; b++){
	block_trials = jsPsych.randomization.repeat(stims,8,true);
	last_tone = randomDraw(stims)
	block_trials.sound.push(last_tone.sound)
	block_trials.data.push(last_tone.data)
	blocks.push(block_trials)
}

/* ************************************ */
/* Set up jsPsych blocks */
/* ************************************ */
/* define static blocks */
var welcome_block = {
	
  type: 'text',
  text: '<div class = centerbox><p class = block-text>Welcome to the tone monitoring experiment. This experiment has sound. At this time, make sure you can hear sounds using headphones or speakers. Press <strong>enter</strong> to begin.</p></div>',
  cont_key: 13,
  timing_post_trial: 0
};

  
var instructions_block = {
  type: 'instructions',
  pages: [
    '<div class = centerbox><p class = block-text>In this experiment you will hear tones in a sequence, one after the other. You will hear one of three tones on each trial: a high tone, a medium tone, or a low tone.</p></div>',
    '<div class = centerbox><p class = block-text>Your job is to keep each track of the number of times each tone repeats and respond when you hear any tone repeat four times by pressing the spacebar. For instance, if you hear "high, high, low, medium, high, low, medium, <strong>high</strong>" you should respond on the last (fourth) high tone.</p><p class = block-text>If the sequence of tones continued with "high, medium, low, <strong>medium</strong>" you would respond again, as the medium tone had repeated four times, and so on.</p></div>',
	"<div class = centerbox><p class = block-text>After you respond by pressing the spacebar, you should 'reset' that tone's count. So in the previous examples, once you press the spacebar in response to the high tones, you should start counting the high tones again from 0.</p><p class = block-text>Even if you believe you pressed the spacebar at the wrong time (if you thought only 3 high tones had passed instead of 4), you <strong>still should reset your count</strong>. So if you count 3 high tones and inappropriately responded, begin counting high tones from 0 again.</p></div>",
	'<div class = centerbox><p class = block-text>To summarize, you will keep track of three different tones: low, medium and high. When you count 4 of any tone, press the spacebar. After you respond to a tone (regardless of if you were correct or not), mentally reset that tones count, while leaving the count for the other tones intact.</p></div>'
	],
  allow_keys: false,
  show_clickable_nav: true,
  timing_post_trial: 1000
};

var end_block = {
  type: 'text',
  text: '<div class = centerbox><p class = center-block-text>Thanks for completing this task!</p><p class = center-block-text>Press <strong>enter</strong> to continue.</p></div>',
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
  text: '<div class = centerbox><p class = block-text>Starting a test block. Remember to respond after a tone repeats four times and "reset" your count after you press the spacebar, <strong>regardless of whether or not you were correct</strong>.</p><p class = block-text>Press <strong>enter</strong> to begin.</p></div>',
  cont_key: 13,
  timing_post_trial: 01000
};

var update_function = {
	type: 'call-function',
	func: update_count,
    timing_post_trial: 0
}

var tone_introduction_block = {
  type: 'single-audio',
  stimuli: ['static/experiments/tone_monitoring/sounds/880Hz_-6dBFS_.5s.mp3',
	    'static/experiments/tone_monitoring/sounds/440Hz_-6dBFS_.5s.mp3',
	    'static/experiments/tone_monitoring/sounds/220Hz_-6dBFS_.5s.mp3'],
  choices: 'none',
  timing_stim: 2500,
  timing_response: 2500,
  timing_post_trial: 0,
  prompt: '<div class = centerbox><div class = block-text>First you will hear the high tone, then the medium tone, then the low tone.</div></div>'
};

//Set up experiment
var tone_monitoring_experiment = []
tone_monitoring_experiment.push(welcome_block);
tone_monitoring_experiment.push(instructions_block);
tone_monitoring_experiment.push(tone_introduction_block);
tone_monitoring_experiment.push(start_practice_block);

// set up practice
for (i = 0; i< practice_trials.sound.length; i++) {	
	var practice_tone_block = {
	  type: 'categorize-audio',
	  stimuli: [practice_trials.sound[i]],
	  data: [practice_trials.data[i]],
	  key_answer: get_correct_key,
	  correct_text: '<div class = centerbox><div class = center-text>Correct</div></div>',
	  incorrect_text: '<div class = centerbox><div class = center-text>Incorrect</div></div>',
	  timeout_message: ' ',
	  choices: [32],
	  timing_response: 2000,
	  timing_feedback_duration: 1000,
	  timing_post_trial: 500,
	  on_trial_start: update_count,
	  on_finish: reset_count,
	  prompt: '<div class = centerbox><div class = block-text>Press the spacebar when any tone repeats four times. After you press the spacebar (for any reason), reset your count for that tone.</div></div>'
	};
	tone_monitoring_experiment.push(update_function)
	tone_monitoring_experiment.push(practice_tone_block)
}

// set up test
for (b=0; b<block_num; b++) {
	block = blocks[b]
	tone_monitoring_experiment.push(start_test_block)
	var test_tone_block = {
	  type: 'single-audio',
	  stimuli: block.sound,
	  data: block.data,
	  choices: [32],
	  timing_stim: 2500,
	  timing_response: 2500,
	  timing_post_trial: 0,
	  response_ends_trial: false
	};
	tone_monitoring_experiment.push(test_tone_block)
}

tone_monitoring_experiment.push(end_block)
