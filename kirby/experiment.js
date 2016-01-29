/* ************************************ */
/* Define helper functions */
/* ************************************ */
function getDisplayElement () {
    $('<div class = display_stage_background></div>').appendTo('body')
    return $('<div class = display_stage></div>').appendTo('body')
}

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
    check_percent = checks_passed/attention_check_trials.length
  } 
  return check_percent

var getInstructFeedback = function() {
	return '<div class = centerbox><p class = center-block-text>' + feedback_instruct_text + '</p></div>'
}

/* ************************************ */
/* Define experimental variables */
/* ************************************ */
// generic task variables
var run_attention_checks = true
var attention_check_thresh = 0.45
var sumInstructTime = 0    //ms
var instructTimeThresh = 5   ///in seconds

// task specific variables
//hard coded options in the amounts and order specified in Kirby and Marakovic (1996)
var options = {
  small_amt: [54, 55, 19, 31, 14, 47, 15, 25, 78, 40, 11, 67, 34, 27, 69, 49, 80, 24, 33, 28, 34, 25, 41, 54, 54, 22, 20],
  large_amt: [55, 75, 25, 85, 25, 50, 35, 60, 80, 55, 30, 75, 35, 50, 85, 60, 85, 35, 80, 30, 50, 30, 75, 60, 80, 25, 55],
  later_del: [117, 61, 53, 7, 19, 160, 13, 14, 192, 62, 7, 119, 186, 21, 91, 89, 157, 29, 14, 179, 30, 80, 20, 111, 30, 136, 7]
}

var stim_html = []

//loop through each option to create html
for(var i = 0; i < options.small_amt.length; i++){
  stim_html[i] = "<div class = centerbox id='container'><p class = center-block-text>Please select the option that you would prefer pressing <strong>'q'</strong> for left <strong>'p'</strong> for right:</p><div class='table'><div class='row'><div id = 'option'><center><font color='green'>$" + options.small_amt[i] + "<br>today</font></center></div><div id = 'option'><center><font color='green'>$" + options.large_amt[i] + "<br>" + options.later_del[i] + " days</font></center></div></div></div></div>"
}

data_prop = []

for (var i = 0; i<options.small_amt.length; i++){
  data_prop.push({
    small_amt: options.small_amt[i],
    large_amt: options.large_amt[i],
    later_del: options.later_del[i]
  });
}

trials = []

//used new features to include the stimulus properties in recorded data
for (var i = 0; i < stim_html.length; i++){
  trials.push({
    stimulus: stim_html[i],
    data: data_prop[i]
  });
}

/* ************************************ */
/* Set up jsPsych blocks */
/* ************************************ */
// Set up attention check node
var attention_check_block = {
  type: 'attention-check',
  timing_response: 30000,
  response_ends_trial: true,
  timing_post_trial: 200
}

var attention_node = {
  timeline: [attention_check_block],
  conditional_function: function() {
    return run_attention_checks
  }
}

/* define static blocks */
var welcome_block = {
  type: 'poldrack-text',
  timing_response: 60000,
  text: '<div class = centerbox><p class = center-block-text>Welcome to the experiment. Press <strong>enter</strong> to begin.</p></div>',
  cont_key: [13],
  timing_post_trial: 0
};

var feedback_instruct_text = 'Starting with instructions.  Press <strong> Enter </strong> to continue.'
var feedback_instruct_block = {
  type: 'poldrack-text',
  cont_key: [13],
  text: getInstructFeedback,
  timing_post_trial: 0,
  timing_response: 6000
};
/// This ensures that the subject does not read through the instructions too quickly.  If they do it too quickly, then we will go over the loop again.
var instruction_trials = []
var instructions_block = {
  type: 'poldrack-instructions',
  pages: [
    '<div class = centerbox><p class = block-text>In this experiment you will be presented with two amounts of money to choose between. One of the amounts will be available now and the other will be available in the future. Your job is to indicate which option you would prefer by pressing <strong>"q"</strong> for the left option and <strong>"p"</strong> for the right option.</p><p class = block-text>You should indicate your <strong>true</strong> preference because at the end of the experiment a random trial will be chosen and you will receive a bonus payment proportional to the option you selected at the time point you chose.</p></div>',
  ],
  allow_keys: false,
  show_clickable_nav: true
};

instruction_trials.push(feedback_instruct_block)
instruction_trials.push(instructions_block)

var instruction_node = {
    timeline: instruction_trials,
	/* This function defines stopping criteria */
    loop_function: function(data){
		for(i=0;i<data.length;i++){
			if((data[i].trial_type=='poldrack-instructions') && (data[i].rt!=-1)){
				rt=data[i].rt
				sumInstructTime=sumInstructTime+rt
			}
		}
		if(sumInstructTime<=instructTimeThresh*1000){
			feedback_instruct_text = 'Read through instructions too quickly.  Please take your time and make sure you understand the instructions.  Press <strong>enter</strong> to continue.'
			return true
		} else if(sumInstructTime>instructTimeThresh*1000){
			feedback_instruct_text = 'Done with instructions. Press <strong>enter</strong> to continue.'
			return false
		}
    }
}

var start_practice_block = {
  type: 'poldrack-text',
  timing_response: 60000,
  text: '<div class = centerbox><p class = center-block-text>Here is a sample trial. Your choice for this trial will not be included in your bonus payment.</p><p class = center-block-text>Press <strong>enter</strong> to begin.</p></div>',
  cont_key: [13],
  //timing_post_trial: 1000
};

var practice_block = {
  type: 'poldrack-single-stim',
  stimulus: "<div class = centerbox id='container'><p class = center-block-text>Please select the option that you would prefer pressing <strong>'q'</strong> for left <strong>'p'</strong> for right:</p><div class='table'><div class='row'><div id = 'option'><center><font color='green'>$20<br>today</font></center></div><div id = 'option'><center><font color='green'>$25<br>5 days</font></center></div></div></div></div>",
  is_html: true,
  data: {'exp_id': 'kirby'},
  choices: ['q', 'p']
};

var start_test_block = {
  type: 'poldrack-text',
  timing_response: 60000,
  text: '<div class = centerbox><p class = center-block-text>You are now ready to begin the survey.</p><p class = center-block-text>Remember to indicate your <strong>true</strong> preferences.</p><p class = center-block-text>Press <strong>enter</strong> to begin.</p></div>',
  cont_key: [13],
  //timing_post_trial: 1000
};

var test_block = {
  type: 'poldrack-single-stim',
  //stimuli: trials,
  timeline: trials,
  is_html: true,
  data: {'exp_id': 'kirby'},
  choices: ['q', 'p'],
  //used new feature to include choice info in recorded data
  on_finish: function(data){
      var choice = false;
      if(data.key_press == 80){
        choice = 'll';
      } else if(data.key_press == 81){
        choice = 'ss';
      }
      jsPsych.data.addDataToLastTrial({choice: choice});
    }
};

var end_block = {
  type: 'poldrack-text',
  timing_response: 60000,
  text: '<div class = centerbox><p class = center-block-text>Thanks for completing this task!</p><p class = center-block-text>Press <strong>enter</strong> to continue.</p></div>',
  cont_key: [13],
  timing_post_trial: 0
};


//Set up experiment
var kirby_experiment = []
kirby_experiment.push(welcome_block);
kirby_experiment.push(instruction_node);
kirby_experiment.push(start_practice_block);
kirby_experiment.push(practice_block);
kirby_experiment.push(attention_node)
kirby_experiment.push(start_test_block);
kirby_experiment.push(test_block);
kirby_experiment.push(attention_node)
kirby_experiment.push(end_block)