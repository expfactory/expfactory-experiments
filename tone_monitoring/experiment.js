// Reference: http://www.sciencedirect.com/science/article/pii/S001002859990734X
// condition indicates practice/test, trial_id indicates stimulus heard on each trial. Correct response is determined by repetitions since last response and is not calculated in this script (calculate in post)

/* ************************************ */
/* Define helper functions */
/* ************************************ */
function getDisplayElement () {
    $('<div class = display_stage_background></div>').appendTo('body')
    return $('<div class = display_stage></div>').appendTo('body')
}

function addID() {
  jsPsych.data.addDataToLastTrial({'exp_id': 'tone_monitoring'})
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
}

var randomDraw = function(lst) {
    var index = Math.floor(Math.random()*(lst.length))
    return lst[index]
}

var get_correct_key = function() {
	return correct_key
}

var update_count = function() {
	var stim = practice_trials[practice_count].data.trial_id
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

var getInstructFeedback = function() {
	return '<div class = centerbox><p class = center-block-text>' + feedback_instruct_text + '</p></div>'
}

/* ************************************ */
/* Define experimental variables */
/* ************************************ */
// generic task variables
var run_attention_checks = true
var attention_check_thresh = 0.65
var sumInstructTime = 0    //ms
var instructTimeThresh = 7   ///in seconds

// task specific variables
var high_count = 0
var medium_count = 0
var low_count = 0
var correct_key = 'none'
var practice_count = 0

practice_stims = [{stimulus: '/static/experiments/tone_monitoring/sounds/880Hz_-6dBFS_.5s.mp3',
		  data: {exp_id: 'tone_monitoring', trial_id: 'high', condition: 'practice'}},
		 {stimulus: '/static/experiments/tone_monitoring/sounds/440Hz_-6dBFS_.5s.mp3',
		  data: {exp_id: 'tone_monitoring', trial_id: 'medium', condition: 'practice'}},
		 {stimulus: '/static/experiments/tone_monitoring/sounds/220Hz_-6dBFS_.5s.mp3',
		 data: {exp_id: 'tone_monitoring', trial_id: 'low', condition: 'practice'}}
]

stims = [{stimulus: '/static/experiments/tone_monitoring/sounds/880Hz_-6dBFS_.5s.mp3',
		  data: {exp_id: 'tone_monitoring', trial_id: 'high', condition: 'test'}},
		 {stimulus: '/static/experiments/tone_monitoring/sounds/440Hz_-6dBFS_.5s.mp3',
		  data: {exp_id: 'tone_monitoring', trial_id: 'medium', condition: 'test'}},
		 {stimulus: '/static/experiments/tone_monitoring/sounds/220Hz_-6dBFS_.5s.mp3',
		 data: {exp_id: 'tone_monitoring', trial_id: 'low', condition: 'test'}}
]

last_tone = randomDraw(practice_stims)
practice_trials = jsPsych.randomization.repeat(practice_stims,8);
practice_trials.push(last_tone)

block_num = 4
blocks = []
for (b=0; b<block_num; b++){
	block_trials = jsPsych.randomization.repeat(stims,8);
	last_tone = randomDraw(stims)
	block_trials.push(last_tone)
	blocks.push(block_trials)
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


/* define /static blocks */
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
  timing_response: 60000
};
/// This ensures that the subject does not read through the instructions too quickly.  If they do it too quickly, then we will go over the loop again.
var instruction_trials = []
var instructions_block = {
  type: 'poldrack-instructions',
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

var end_block = {
  type: 'poldrack-text',
  text: '<div class = centerbox><p class = center-block-text>Thanks for completing this task!</p><p class = center-block-text>Press <strong>enter</strong> to continue.</p></div>',
  cont_key: [13],
  timing_post_trial: 0
}; 

var start_practice_block = {
  type: 'poldrack-text',
  text: '<div class = centerbox><p class = block-text>We will start with some practice followed by ' + block_num + ' test blocks. During practice you will get feedback about whether your responses are correct or not, which you will not get during the rest of the experiment. Press <strong>enter</strong> to begin.</p></div>',
  cont_key: [13],
  timing_post_trial: 1000
};

var start_test_block = {
  type: 'poldrack-text',
  text: '<div class = centerbox><p class = block-text>Starting a test block. Remember to respond after a tone repeats four times and "reset" your count after you press the spacebar, <strong>regardless of whether or not you were correct</strong>.</p><p class = block-text>Press <strong>enter</strong> to begin.</p></div>',
  cont_key: [13],
  timing_post_trial: 01000
};

var update_function = {
	type: 'call-function',
	func: update_count,
    timing_post_trial: 0
}

var tone_introduction_block = {
  type: 'single-audio',
  stimuli: ['/static/experiments/tone_monitoring/sounds/880Hz_-6dBFS_.5s.mp3',
	    '/static/experiments/tone_monitoring/sounds/440Hz_-6dBFS_.5s.mp3',
	    '/static/experiments/tone_monitoring/sounds/220Hz_-6dBFS_.5s.mp3'],
  choices: 'none',
  timing_stim: 2500,
  timing_response: 2500,
  timing_post_trial: 0,
  prompt: '<div class = centerbox><div class = block-text>First you will hear the high tone, then the medium tone, then the low tone.</div></div>'
};

//Set up experiment
var tone_monitoring_experiment = []
tone_monitoring_experiment.push(welcome_block);
tone_monitoring_experiment.push(instruction_node);
tone_monitoring_experiment.push(tone_introduction_block);
tone_monitoring_experiment.push(start_practice_block);

// set up practice
for (i = 0; i< practice_trials.length; i++) {	
	var practice_tone_block = {
	  type: 'categorize-audio',
	  timeline: practice_trials,
	  key_answer: get_correct_key,
	  correct_text: '<div class = centerbox><div class = center-text>Correct!</div></div>',
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
	  timeline: block,
	  choices: [32],
	  timing_stim: 2500,
	  timing_response: 2500,
	  timing_post_trial: 0,
	  response_ends_trial: false
	};
	tone_monitoring_experiment.push(test_tone_block)
	if ($.inArray(b,[0,2,3]) != -1) {
		tone_monitoring_experiment.push(attention_node)
	}
}

tone_monitoring_experiment.push(end_block)
