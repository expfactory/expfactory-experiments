/* ************************************ */
/* Define helper functions */
/* ************************************ */
function getDisplayElement () {
    $('<div class = display_stage_background></div>').appendTo('body')
    return $('<div class = display_stage></div>').appendTo('body')
}

var randomDraw = function(lst) {
    var index = Math.floor(Math.random()*(lst.length))
    return lst[index]
}


/* ************************************ */
/* Define experimental variables */
/* ************************************ */
var grid = 
    '<div class = numbox>' +
    '<button id = button_1 class = "square num-button"><div class = numbers>1</div></button>' +
    '<button id = button_2 class = "square num-button"><div class = numbers>2</div></button>' +
    '<button id = button_3 class = "square num-button"><div class = numbers>3</div></button>' +
    '<button id = button_4 class = "square num-button"><div class = numbers>4</div></button>' +
    '<button id = button_5 class = "square num-button"><div class = numbers>5</div></button>' +
    '<button id = button_6 class = "square num-button"><div class = numbers>6</div></button>' +
    '<button id = button_7 class = "square num-button"><div class = numbers>7</div></button>' +
    '<button id = button_8 class = "square num-button"><div class = numbers>8</div></button>' +
    '<button id = button_9 class = "square num-button"><div class = numbers>9</div></button>' +
    '</div>'

var empty_grid = 
    '<div class = numbox><div class = "blank-square num-button"><div class = content><div class = numbers ></div></div></div>' +
    '<div class = "blank-square num-button"><div class = content><div class = numbers ></div></div></div>' +
    '<div class = "blank-square num-button"><div class = content><div class = numbers ></div></div></div>' +
    '<div class = "blank-square num-button"><div class = content><div class = numbers ></div></div></div>' +
    '<div class = "blank-square num-button"><div class = content><div class = numbers ></div></div></div>' +
    '<div class = "blank-square num-button"><div class = content><div class = numbers ></div></div></div>' +
    '<div class = "blank-square num-button"><div class = content><div class = numbers ></div></div></div>' +
    '<div class = "blank-square num-button"><div class = content><div class = numbers ></div></div></div>' +
    '<div class = "blank-square num-button"><div class = content><div class = numbers ></div></div></div></div>'








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
  type: 'poldrack-text',
  timing_response: 60000,
  text: '<div class = centerbox><p class = center-block-text>Welcome to the experiment. Press <strong>enter</strong> to begin.</p></div>',
  cont_key: [13],
  timing_post_trial: 0
};

var instructions_block = {
  type: 'poldrack-instructions',
  pages: [
    '<div class = centerbox><p class = block-text>In this task, your job is to generate a random sequence of digits. You will do this by clicking on a virtual numpad using your mouse. Once you click, the number will temporarily turn red. You have less than a second to respond on each trial so it is important to respond quickly!</p><p class = block-text>.After the trial ends the numbers will dissapear for a moment. When they appear again the next trial has begun and you should respond as quickly as possible.</p><p class = block-text>Your goal is to choose each number completely randomly, as if you were picking a number from a hat with 9 slips of paper, reading it, and placing it back before picking another number.</p></div>',
  ],
  allow_keys: false,
  show_clickable_nav: true,
  //timing_post_trial: 1000
};

var end_block = {
  type: 'poldrack-text',
  timing_response: 60000,
  text: '<div class = centerbox><p class = center-block-text>Thanks for completing this task!</p><p class = center-block-text>Press <strong>enter</strong> to begin.</p></div>',
  cont_key: [13],
  timing_post_trial: 0
};

var start_practice_block = {
  type: 'poldrack-text',
  timing_response: 60000,
  text: '<div class = centerbox><p class = center-block-text>Starting a practice block.</p><p class = center-block-text>Press <strong>enter</strong> to begin.</p></div>',
  cont_key: [13],
  timing_post_trial: 1000
};

var start_test_block = {
  type: 'poldrack-text',
  timing_response: 60000,
  text: '<div class = centerbox><p class = center-block-text>Starting a test block.</p><p class = center-block-text>Press <strong>enter</strong> to begin.</p></div>',
  cont_key: [13],
  timing_post_trial: 1000
};

var  wait_block = {
  type: 'poldrack-single-stim',
  stimuli: [empty_grid],
  choices: 'none',
  is_html: true,
  data: {exp_id: "random_number_generation", trial_id: "wait"},
  timing_stim: 200,
  timing_response: 200,
  response_ends_trial: false,
  timing_post_trial: 0
};

//Set up experiment
var random_number_generation_experiment = []
random_number_generation_experiment.push(welcome_block);
random_number_generation_experiment.push(instructions_block);
random_number_generation_experiment.push(start_practice_block);
for (var i = 0; i <practice_stims.length; i++) {
  var  practice_block = {
    type: 'single-stim-button',
    stimuli: [practice_stims[i]],
    button_class: 'num-button',
    data: {exp_id: "random_number_generation", trial_id: "practice"},
    timing_response: 800,
    response_ends_trial: false,
    timing_post_trial: 0
  };
  random_number_generation_experiment.push(practice_block)
  random_number_generation_experiment.push(wait_block)
}
random_number_generation_experiment.push(start_test_block);
//Loop should be changed to go until test_stims.length later
for (var i = 0; i <practice_stims.length; i++) {
  var  test_block = {
    type: 'single-stim-button',
    stimuli: [test_stims[i]],
    button_class: 'num-button',
    data: {exp_id: "rng", trial_id: "test"},
    timing_response: 800,
    response_ends_trial: false,
    timing_post_trial: 0
  };
  random_number_generation_experiment.push(test_block)
  random_number_generation_experiment.push(wait_block)
}
random_number_generation_experiment.push(end_block)
