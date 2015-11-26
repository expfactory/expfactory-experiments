// reference: http://www.sciencedirect.com/science/article/pii/S1053811905001424


/* ************************************ */
/* Define helper functions */
/* ************************************ */

var randomDraw = function(lst) {
    var index = Math.floor(Math.random()*(lst.length))
    return lst[index]
}

/* ************************************ */
/* Define experimental variables */
/* ************************************ */
var grid = 
		'<div class = numbox><div class = "square num-button"><div class = content><div class = numbers >1</div></div></div>' +
		'<div class = "square num-button"><div class = content><div class = numbers >2</div></div></div>' +
		'<div class = "square num-button"><div class = content><div class = numbers >3</div></div></div>' +
		'<div class = "square num-button"><div class = content><div class = numbers >4</div></div></div>' +
		'<div class = "square num-button"><div class = content><div class = numbers >5</div></div></div>' +
		'<div class = "square num-button"><div class = content><div class = numbers >6</div></div></div>' +
		'<div class = "square num-button"><div class = content><div class = numbers >7</div></div></div>' +
		'<div class = "square num-button"><div class = content><div class = numbers >8</div></div></div>' +
		'<div class = "square num-button"><div class = content><div class = numbers >9</div></div></div></div>'

var empty_grid = 
		'<div class = numbox><div class = "square num-button"><div class = content><div class = numbers ></div></div></div>' +
		'<div class = "square num-button"><div class = content><div class = numbers ></div></div></div>' +
		'<div class = "square num-button"><div class = content><div class = numbers ></div></div></div>' +
		'<div class = "square num-button"><div class = content><div class = numbers ></div></div></div>' +
		'<div class = "square num-button"><div class = content><div class = numbers ></div></div></div>' +
		'<div class = "square num-button"><div class = content><div class = numbers ></div></div></div>' +
		'<div class = "square num-button"><div class = content><div class = numbers ></div></div></div>' +
		'<div class = "square num-button"><div class = content><div class = numbers ></div></div></div>' +
		'<div class = "square num-button"><div class = content><div class = numbers ></div></div></div></div>'
		
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
/* define static blocks */

var welcome_block = {
	
  type: 'text',
  text: '<div class = centerbox><p class = block-text>Welcome to the random number generation task experiment. Press <strong>enter</strong> to begin.</p></div>',
  cont_key: 13,
  timing_post_trial: 0
};

var instructions_block = {
  type: 'instructions',
  pages: [
    '<div class = centerbox><p class = block-text>In this task, your job is to generate a random sequence of digits. You will do this by clicking on a virtual numpad using your mouse. Once you click, the number will temporarily turn red. You have less than a second to respond on each trial so it is important to respond quickly!</p><p class = block-text>.After the trial ends the numbers will dissapear for a moment. When they appear again the next trial has begun and you should respond as quickly as possible.</p><p class = block-text>Your goal is to choose each number completely randomly, as if you were picking a number from a hat with 9 slips of paper, reading it, and placing it back before picking another number.</p></div>',
  ],
  allow_keys: false,
  show_clickable_nav: true,
  timing_post_trial: 1000
};

var end_block = {
  type: 'text',
  text: '<div class = centerbox><p class = center-block-text>Finished with this task.</p><p class = center-block-text>Press <strong>enter</strong> to begin.</p></div>',
  cont_key: 13,
  timing_post_trial: 0
};

var start_practice_block = {
  type: 'text',
  text: '<div class = centerbox><p class = center-block-text>Starting a practice block.</p><p class = center-block-text>Press <strong>enter</strong> to begin.</p></div>',
  cont_key: 13,
  timing_post_trial: 1000
};

var start_test_block = {
  type: 'text',
  text: '<div class = centerbox><p class = center-block-text>Starting a test block.</p><p class = center-block-text>Press <strong>enter</strong> to begin.</p></div>',
  cont_key: 13,
  timing_post_trial: 1000
};

var  wait_block = {
  type: 'single-stim',
  stimuli: [empty_grid],
  choices: 'none',
  is_html: true,
  data: {exp_id: "rng", trial_id: "practice"},
  timing_stim: 200,
  timing_response: 200,
  response_ends_trial: false,
  timing_post_trial: 0
};

//Set up experiment
var rng_experiment = []
rng_experiment.push(welcome_block);
rng_experiment.push(instructions_block);
rng_experiment.push(start_practice_block);
for (var i = 0; i <practice_stims.length; i++) {
	var  practice_block = {
	  type: 'multi-button',
	  buttons: [practice_stims[i]],
	  button_class: 'num-button',
	  data: {exp_id: "rng", trial_id: "practice"},
	  timing_response: 800,
	  response_ends_trial: false,
	  timing_post_trial: 0
	};
	RNG_experiment.push(practice_block)
	RNG_experiment.push(wait_block)
}
rng_experiment.push(start_test_block);
//Loop should be changed to go until test_stims.length later
for (var i = 0; i <practice_stims.length; i++) {
	var  test_block = {
	  type: 'multi-button',
	  buttons: [test_stims[i]],
	  button_class: 'num-button',
	  data: {exp_id: "rng", trial_id: "test"},
	  timing_response: 800,
	  response_ends_trial: false,
	  timing_post_trial: 0
	};
	rng_experiment.push(test_block)
	rng_experiment.push(wait_block)
}
rng_experiment.push(end_block)
