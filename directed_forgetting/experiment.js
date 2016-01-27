/* ************************************ */
/* Define helper functions */
/* ************************************ */
function getDisplayElement () {
    $('<div class = display_stage_background></div>').appendTo('body')
    return $('<div class = display_stage></div>').appendTo('body')
}

/* Append gap and current trial to data and then recalculate for next trial*/

//this adds the current trial and the stims shown to the data
var appendTestData = function() {
	jsPsych.data.addDataToLastTrial({trial_num:currTrial, stim: [stim1,stim2,stim3,stim4,stim5,stim6]})
};

//this adds the cue shown and trial number to data
var appendCueData = function() {
	jsPsych.data.addDataToLastTrial({stim: cue, trial_num:currTrial})
};

//this adds the probe shown, trial number, and whether it was a correct trial to the data
var appendProbeData = function() {
	jsPsych.data.addDataToLastTrial({stim: [probe,probeType],trial_num:currTrial})
	global_trial = jsPsych.progress().current_trial_global
	trialCue=jsPsych.data.getData()[global_trial-2].stim
	trialProbe=jsPsych.data.getData()[global_trial].stim[0]
	lastSet=jsPsych.data.getData()[global_trial-3].stim
	keypress=jsPsych.data.getData()[global_trial].key_press
	if(trialCue=='BOT'){
		memorySet=lastSet.splice(0,3)
	} else if (trialCue=='TOP'){
		memorySet=lastSet.splice(3,3)
	}
	if((memorySet.indexOf(trialProbe,0)==-1) && keypress ==39){
		jsPsych.data.addDataToLastTrial({correct: 1})
	} else if((memorySet.indexOf(trialProbe,0)!=-1) && keypress ==37){
		jsPsych.data.addDataToLastTrial({correct: 1})
	} else{
		jsPsych.data.addDataToLastTrial({correct: -1})
	}	
	currTrial = currTrial + 1
};

//this adds the trial number to the data
var appendFixData = function(){
	jsPsych.data.addDataToLastTrial({trial_num:currTrial})
};


//this is an algorithm to choose the training set based on rules of the game (training sets are composed of any letter not presented in the last two training sets)
var getTrainingSet = function(){
	preceeding1stims=[]
	preceeding2stims=[]
	trainingArray=jsPsych.randomization.repeat(stimArray,1);
	if (currTrial<1) {
		stim1 = trainingArray[0];
		stim2 = trainingArray[1];
		stim3 = trainingArray[2];     
		stim4 = trainingArray[3];
		stim5 = trainingArray[4];
		stim6 = trainingArray[5];
		return '<div class = centerbox><div class = fixation><span style="color:red">+</span></div></div>' +
			'<div class = topLeft><img class = forgetStim src ="'+pathSource+stim1+fileType+'"></img></div>' +
			'<div class = topMiddle><img class = forgetStim src ="'+pathSource+stim2+fileType+'"></img></div>' +
			'<div class = topRight><img class = forgetStim src ="'+pathSource+stim3+fileType+'"></img></div>' +
			'<div class = bottomLeft><img class = forgetStim src ="'+pathSource+stim4+fileType+'"></img></div>' +
			'<div class = bottomMiddle><img class = forgetStim src ="'+pathSource+stim5+fileType+'"></img></div>' +
			'<div class = bottomRight><img class = forgetStim src ="'+pathSource+stim6+fileType+'"></img></div>'

	} else if(currTrial==1) {
		global_trial = jsPsych.progress().current_trial_global
		preceeding1stims=jsPsych.data.getData()[global_trial-5].stim
		newArray=trainingArray.filter(function(y){return(jQuery.inArray(y,preceeding1stims) == -1)})
		stim1 = newArray[0];
		stim2 = newArray[1];
		stim3 = newArray[2];     
		stim4 = newArray[3];
		stim5 = newArray[4];
		stim6 = newArray[5];
		return '<div class = centerbox><div class = fixation><span style="color:red">+</span></div></div>' +
			'<div class = topLeft><img class = forgetStim src ="'+pathSource+stim1+fileType+'"></img></div>' +
			'<div class = topMiddle><img class = forgetStim src ="'+pathSource+stim2+fileType+'"></img></div>' +
			'<div class = topRight><img class = forgetStim src ="'+pathSource+stim3+fileType+'"></img></div>' +
			'<div class = bottomLeft><img class = forgetStim src ="'+pathSource+stim4+fileType+'"></img></div>' +
			'<div class = bottomMiddle><img class = forgetStim src ="'+pathSource+stim5+fileType+'"></img></div>' +
			'<div class = bottomRight><img class = forgetStim src ="'+pathSource+stim6+fileType+'"></img></div>'	

	} else {
		global_trial = jsPsych.progress().current_trial_global
		preceeding1stims=jsPsych.data.getData()[global_trial-5].stim
		preceeding2stims=jsPsych.data.getData()[global_trial-10].stim
		newArray=trainingArray.filter(function(y){return(jQuery.inArray(y,preceeding1stims.concat(preceeding2stims)) == -1)})
		stim1 = newArray[0];
		stim2 = newArray[1];
		stim3 = newArray[2];     
		stim4 = newArray[3];
		stim5 = newArray[4];
		stim6 = newArray[5];
		return '<div class = centerbox><div class = fixation><span style="color:red">+</span></div></div>' +
			'<div class = topLeft><img class = forgetStim src ="'+pathSource+stim1+fileType+'"></img></div>' +
			'<div class = topMiddle><img class = forgetStim src ="'+pathSource+stim2+fileType+'"></img></div>' +
			'<div class = topRight><img class = forgetStim src ="'+pathSource+stim3+fileType+'"></img></div>' +
			'<div class = bottomLeft><img class = forgetStim src ="'+pathSource+stim4+fileType+'"></img></div>' +
			'<div class = bottomMiddle><img class = forgetStim src ="'+pathSource+stim5+fileType+'"></img></div>' +
			'<div class = bottomRight><img class = forgetStim src ="'+pathSource+stim6+fileType+'"></img></div>'	
	}
};

//returns a cue pseudorandomly, either TOP or BOT
var getCue = function(){
	var temp = Math.floor(Math.random()*2)
	cue=cueArray[temp]
	return '<div class = centerbox><img class = forgetStim src ="'+pathSource+cue+fileType+'"></img></div>'
};

// Will pop out a probe type from the entire probeTypeArray and then choose a probe congruent with the probe type
var getProbe = function() {
	probeType = probeTypeArray.pop()
	global_trial = jsPsych.progress().current_trial_global
	trainingArray=jsPsych.randomization.repeat(stimArray,1);
	lastCue=jsPsych.data.getData()[global_trial-2].stim
	lastSet=jsPsych.data.getData()[global_trial-3].stim
	if(probeType=='pos'){
		if(lastCue=='BOT'){
			probe= lastSet[Math.floor(Math.random()*3)]	
			return '<div class = centerbox><img class = forgetStim src ="'+pathSource+probe+fileType+'"></img></div>'
		} else if(lastCue=='TOP') {
			probe= lastSet[Math.floor(Math.random()*3)+3]
			return '<div class = centerbox><img class = forgetStim src ="'+pathSource+probe+fileType+'"></img></div>'
	    }
	}else if(probeType=='neg'){
	  if(lastCue=='BOT'){
			probe= lastSet[Math.floor(Math.random()*3)+3]	
			return '<div class = centerbox><img class = forgetStim src ="'+pathSource+probe+fileType+'"></img></div>'
		} else if(lastCue=='TOP'){
			probe= lastSet[Math.floor(Math.random()*3)]
			return '<div class = centerbox><img class = forgetStim src ="'+pathSource+probe+fileType+'"></img></div>'
	    }
	}else if(probeType=='con'){
			newArray=trainingArray.filter(function(y){return(y!=lastSet[0] && y!=lastSet[1] && y!=lastSet[2] && y!=lastSet[3] && y!=lastSet[4] && y!=lastSet[5])})
			probe=newArray.pop()
			return '<div class = centerbox><img class = forgetStim src ="'+pathSource+probe+fileType+'"></img></div>'
	}	
};

var getInstructFeedback = function() {
	return '<div class = centerbox><p class = center-block-text>' + feedback_instruct_text + '</p></div>'
}


/* ************************************ */
/* Define experimental variables */
/* ************************************ */
var sumInstructTime = 0    //ms
var instructTimeThresh = 5   ///in seconds

var num_trials = 24 // num trials per run
var num_runs = 3
var experimentLength = num_trials * num_runs
var currTrial = 0
var stimArray = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O',
				'P','Q','R','S','T','U','V','W','X','Y','Z'];
var cueArray = ['TOP','BOT']
var probes = ['pos','pos','neg','con']
var probeTypeArray=jsPsych.randomization.repeat(probes,experimentLength/4)
var stimFix = ['fixation']
var pathSource = 'static/experiments/directed_forgetting/images/'
var fileType = '.png'


/* ************************************ */
/* Set up jsPsych blocks */
/* ************************************ */
var welcome_block = {
  type: 'poldrack-text',
  timing_response: 60000,
  text: '<div class = centerbox><p class = center-block-text>Welcome to the experiment. Press <strong>enter</strong> to begin.</p></div>',
  cont_key: [13],
  timing_post_trial: 0
};

var end_block = {
  type: 'poldrack-text',
  timing_response: 60000,
  text: '<div class = centerbox><p class = center-block-text>Thanks for completing this task!</p><p class = center-block-text>Press <strong>enter</strong> to continue.</p></div>',
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
  pages:  [
	'<div class = centerbox><p class = block-text>In this experiment, you will be presented with 6 letters on each trial, known as your memory set.  You must memorize all 6 letters. </p></div>',
    '<div class = centerbox><p class = block-text>After the presentation of 6 letters, there will be a short delay. You will then be presented with a cue, either <strong>TOP</strong> or <strong>BOT</strong>. This will instruct you to forget the 3 letters located at either the top or bottom (respectively) of the screen.</p> <p class = block-text> The three remaining letters that you must remember are called your <strong>memory set</strong>.</p></div>',
    '<div class = centerbox><p class = block-text>You will then be presented with a single letter, respond with the <strong> Left</strong> arrow key if it is in the memory set, and the <strong> Right </strong> arrow key if it was not in the memory set.</p></div>',
    '<div class = centerbox><p class = block-text>There will be 6 runs of 24 trials each. You will get a break between each run.</p></div>'
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


var start_test_block = {
  type: 'poldrack-text',
  timing_response: 60000,
  text: '<div class = centerbox><p class = block-text>We will now start a test run. Remeber, at the end of the trial respond with the <strong> Left</strong> arrow key if the letter presented is in the memory set, and the <strong> Right </strong> arrow key if it is not in the memory set.</p><p class = block-text> Press <strong>Enter</strong> to begin the experiment.</p></div>',
  cont_key: [13],
  timing_post_trial: 1000
};

var start_fixation_block = {
  type: 'poldrack-single-stim',
  stimulus: '<div class = centerbox><div class = fixation><span style="color:red">+</span></div></div>',
  is_html: true,
  choices: 'none',
  data: {exp_id: "directed_forgetting", "trial_id": "fixation"},
  timing_post_trial: 0,
  timing_stim: 1000,
  timing_response: 1000,
  on_finish: appendFixData
}

var fixation_block = {
  type: 'poldrack-single-stim',
  stimulus: '<div class = centerbox><div class = fixation><span style="color:red">+</span></div></div>',
  is_html: true,
  choices: 'none',
  data: {exp_id: "directed_forgetting", "trial_id": "fixation"},
  timing_post_trial: 0,
  timing_stim: 3000,
  timing_response: 3000,
  on_finish: appendFixData
}

var ITI_fixation_block = {
  type: 'poldrack-single-stim',
  stimulus: '<div class = centerbox><div class = fixation><span style="color:red">+</span></div></div>',
  is_html: true,
  choices: [37,39],
  data: {exp_id: "directed_forgetting", "trial_id": "ITI_fixation"},
  timing_post_trial: 0,
  response_ends_trial: false,
  timing_stim: 4000,
  timing_response: 4000,
  on_finish: appendFixData
}

var training_block = {
  type: 'poldrack-single-stim',
  stimulus: getTrainingSet,
  is_html: true,
  data: {exp_id: "directed_forgetting", trial_id: "test"},
  choices: 'none',
  timing_post_trial: 0,
  timing_stim: 2000,
  timing_response: 2000,
  on_finish: appendTestData,
}; 



var cue_block = {
  type: 'poldrack-single-stim',
  stimulus: getCue,
  is_html: true,
  data: {exp_id: "directed_forgetting", trial_id: "cue"},
  choices: false,
  timing_post_trial: 0,
  timing_stim: 1000,
  timing_response: 1000,
  on_finish: appendCueData,
};

var probe_block = {
  type: 'poldrack-single-stim',
  stimulus: getProbe,
  is_html: true,
  data: {exp_id: "directed_forgetting", trial_id: "probe"},
  choices: [37,39],
  timing_post_trial: 0,
  timing_stim: 2000,
  timing_response: 2000,
  response_ends_trial: false,
  on_finish: appendProbeData
};


/* create experiment definition array */
var directed_forgetting_experiment = [];
directed_forgetting_experiment.push(welcome_block);
directed_forgetting_experiment.push(instruction_node);
for (r = 0; r < num_runs; r ++ ) {
directed_forgetting_experiment.push(start_test_block);
	for(i=0; i<num_trials; i++){
		directed_forgetting_experiment.push(start_fixation_block);
		directed_forgetting_experiment.push(training_block);
		directed_forgetting_experiment.push(cue_block);
		directed_forgetting_experiment.push(fixation_block);
		directed_forgetting_experiment.push(probe_block);
		directed_forgetting_experiment.push(ITI_fixation_block);
	}
}
directed_forgetting_experiment.push(end_block);
