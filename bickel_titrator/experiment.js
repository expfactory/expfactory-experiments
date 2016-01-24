/* ************************************ */
/* Define helper functions */
/* ************************************ */
function getDisplayElement () {
    $('<div class = display_stage_background></div>').appendTo('body')
    return $('<div class = display_stage></div>').appendTo('body')
}

var getStim = function() {
  var immediate_stim;
  var delayed_stim;
  if (Math.random() < 0.5) {
    immediate_stim = '<div class = bickel_leftBox><div class = center-text> $' + immediate_amount + ' immediately</div></div>'
    delayed_stim = '<div class = bickel_rightBox><div class = center-text> $' + delayed_amount + ' in ' + curr_delay + '</p></div>'  
    displayed_amounts = [immediate_amount,delayed_amount] // in order from left to right
  } else {
    immediate_stim = '<div class = bickel_rightBox><div class = center-text> $' + immediate_amount + ' immediately</div></div>'
    delayed_stim = '<div class = bickel_leftBox><div class = center-text> $' + delayed_amount + ' in ' + curr_delay + '</div></div>'  
    displayed_amounts = [delayed_amount, immediate_amount] // in order from left to right
  }
  return immediate_stim + delayed_stim
}

var updateAmount = function(choice) {
  if (choice == 'delayed') {
    immediate_amount += step
  } else {
    immediate_amount -= step
  }
  step /= 2
}

var updateDelay = function() {
  step = 250
  immediate_amount = 500
  curr_delay = delays.shift()
  curr_delay_in_minutes = convertToMins(curr_delay)
}

var convertToMins = function(time) {
  switch(time) {
    case '1 day':
      return 1
      break;
    case '1 week':
      return 7
      break;
    case '1 month':
      return 30
      break;
    case '60 months':
      return 180
      break;
    case '1 year':
      return 365
      break;
    case '5 years':
      return 1825
      break;
    case '25 years':
      return 9125
      break;
  }
}

/* ************************************ */
/* Define experimental variables */
/* ************************************ */

var delays = jsPsych.randomization.shuffle(['1 day', '1 week', '1 month', '6 months', '1 year', '5 years', '25 years'])
var choices = [37, 39]
var curr_delay = delays.shift()
var curr_delay_in_minutes = convertToMins(curr_delay)
var immediate_amount = 500
var delayed_amount = 1000
var displayed_amounts = []
var step = 250
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
    '<div class = centerbox><p class = block-text>In this experiment you will be presented with two amounts of money to choose between. These amounts will be available at different time points. Your job is to indicate which option you would prefer by pressing the left or right arrow key to indicate your choice.</p><p class = block-text>You should indicate your <strong>true</strong> preference because at the end of the experiment a random trial will be chosen and you will receive a bonus payment proportional to the option you selected at the time point you chose.</p><p class = block-text>We will start after instructions end.</p></div>',
  ],
  allow_keys: false,
  show_clickable_nav: true,
  timing_post_trial: 1000
};

var update_delay_block = {
  type: 'call-function',
  func: function() {
    updateDelay()
  },
  timing_post_trial: 0
}

var test_block = {
	type: 'poldrack-single-stim',
	stimulus: getStim,
  data: {'exp_id': 'bickel_titrator'},
	is_html: true,
	choices: choices,
  on_finish: function(data) {
    var choice;
    var choice_i = choices.indexOf(data.key_press)
    if (displayed_amounts[choice_i] == 1000) {
      choice = 'delayed' 
    } else {
      choice = 'immediate'
    }
    jsPsych.data.addDataToLastTrial({'sooner_amount': immediate_amount, 'later_amount': delayed_amount, 'sooner_time_days': 0, 'later_time_days': curr_delay_in_minutes, 'choice': choice})
    updateAmount(choice)
  },
  timing_post_trial: 1000
};

var end_block = {
  type: 'poldrack-text',
  timing_response: 60000,
  text: '<div class = centerbox><p class = center-block-text>Thanks for completing this task!</p><p class = center-block-text>Press <strong>enter</strong> to continue.</p></div>',
  cont_key: [13],
  timing_post_trial: 0
};


//Set up experiment
var bickel_titrator_experiment = []
bickel_titrator_experiment.push(welcome_block);
bickel_titrator_experiment.push(instructions_block);
for (var i = 0; i < delays.length; i++) {
  for (var j = 0; j < 5; j++) {
    bickel_titrator_experiment.push(test_block);
  }
  bickel_titrator_experiment.push(update_delay_block);
}

bickel_titrator_experiment.push(end_block)
