/* ************************************ */
/* Define helper functions */
/* ************************************ */

/* Append gap and current trial to data and then recalculate for next trial*/

//this adds the trial number and which stims are shown to the data set
var appendTestData = function() {
	jsPsych.data.addDataToLastTrial({trial_num:currTrial, stim: [stim1,stim2,stim3,stim4,stim5,stim6]})
};

var randomDraw = function(lst) {
    var index = Math.floor(Math.random()*(lst.length))
    return lst[index]
}

//this adds the trial number, which stims are shown, and if the trial was a correct trial to the data set
var appendProbeData = function() {
	jsPsych.data.addDataToLastTrial({stim:[probe,probeType], trial_num:currTrial})	
	currTrial = currTrial + 1
	global_trial = jsPsych.progress().current_trial_global
	currSet=jsPsych.data.getData()[global_trial-2].stim
	whichProbe=jsPsych.data.getData()[global_trial].stim[0]
	keyPress=jsPsych.data.getData()[global_trial].key_press
	if ((currSet.indexOf(whichProbe,0) != -1) && (keyPress == 37)){
		jsPsych.data.addDataToLastTrial({correct: 1})
	}else if ((currSet.indexOf(whichProbe,0) == -1) && (keyPress == 39)){
		jsPsych.data.addDataToLastTrial({correct: 1})
	}else if ((currSet.indexOf(whichProbe,0) != -1) && (keyPress == 39)){
		jsPsych.data.addDataToLastTrial({correct: -1})
	}else if ((currSet.indexOf(whichProbe,0) == -1) && (keyPress == 37)){
		jsPsych.data.addDataToLastTrial({correct: -1})
	}else{
		jsPsych.data.addDataToLastTrial({correct: -1})
	}
};	
	


//this adds the trial number to the data set
var appendFixData = function(){
	jsPsych.data.addDataToLastTrial({trial_num:currTrial})
};



//returns the divs for training sets.  this algorithm also chooses the training set based on the rules given in the paper(training sets are 
//composed of three letters from the previous set, and three new letters.
var getTrainingSet = function(){
	trainingArray=jsPsych.randomization.repeat(stimArray,1);
	if(currTrial==0){
		stim1 = trainingArray[0];
		stim2 = trainingArray[1];
		stim3 = trainingArray[2];     
		stim4 = trainingArray[3];
		stim5 = trainingArray[4];
		stim6 = trainingArray[5];
		return '<div class = centerbox><div class = fixation><span style="color:red">+</span></div></div>' +
			'<div class = topLeft><img class = recentStim src ="'+pathSource+stim1+fileType+'"></img></div>' +
			'<div class = topMiddle><img class = recentStim src ="'+pathSource+stim2+fileType+'"></img></div>' +
			'<div class = topRight><img class = recentStim src ="'+pathSource+stim3+fileType+'"></img></div>' +
			'<div class = bottomLeft><img class = recentStim src ="'+pathSource+stim4+fileType+'"></img></div>' +
			'<div class = bottomMiddle><img class = recentStim src ="'+pathSource+stim5+fileType+'"></img></div>' +
			'<div class = bottomRight><img class = recentStim src ="'+pathSource+stim6+fileType+'"></img></div>'

	}else if(currTrial==1){
		global_trial = jsPsych.progress().current_trial_global
		preceeding1stims=jsPsych.randomization.repeat(jsPsych.data.getData()[global_trial-5].stim,1)
		tempNewStims=trainingArray.filter(function(y){return(jQuery.inArray(y,preceeding1stims) == -1)})
		oldStims=preceeding1stims.slice(0,3)
		newStims=tempNewStims.slice(0,3)
		newStimArray=oldStims.concat(newStims)
		newArray=jsPsych.randomization.repeat(newStimArray,1)
		stim1 = newArray[0];
		stim2 = newArray[1];
		stim3 = newArray[2];     
		stim4 = newArray[3];
		stim5 = newArray[4];
		stim6 = newArray[5];
		return '<div class = centerbox><div class = fixation><span style="color:red">+</span></div></div>' +
			'<div class = topLeft><img class = recentStim src ="'+pathSource+stim1+fileType+'"></img></div>' +
			'<div class = topMiddle><img class = recentStim src ="'+pathSource+stim2+fileType+'"></img></div>' +
			'<div class = topRight><img class = recentStim src ="'+pathSource+stim3+fileType+'"></img></div>' +
			'<div class = bottomLeft><img class = recentStim src ="'+pathSource+stim4+fileType+'"></img></div>' +
			'<div class = bottomMiddle><img class = recentStim src ="'+pathSource+stim5+fileType+'"></img></div>' +
			'<div class = bottomRight><img class = recentStim src ="'+pathSource+stim6+fileType+'"></img></div>'
	
	}else if(currTrial>1){
		global_trial = jsPsych.progress().current_trial_global
		preceeding1stims=jsPsych.randomization.repeat(jsPsych.data.getData()[global_trial-5].stim,1)
		preceeding2stims=jsPsych.randomization.repeat(jsPsych.data.getData()[global_trial-10].stim,1)
		tempNewStims=trainingArray.filter(function(y){return(jQuery.inArray(y,preceeding1stims.concat(preceeding2stims)) == -1)})
		oldStims=preceeding1stims.slice(0,3)
		newStims=tempNewStims.slice(0,3)
		newStimArray=oldStims.concat(newStims)
		newArray=jsPsych.randomization.repeat(newStimArray,1)
		stim1 = newArray[0];
		stim2 = newArray[1];
		stim3 = newArray[2];     
		stim4 = newArray[3];
		stim5 = newArray[4];
		stim6 = newArray[5];
		return '<div class = centerbox><div class = fixation><span style="color:red">+</span></div></div>' +
			'<div class = topLeft><img class = recentStim src ="'+pathSource+stim1+fileType+'"></img></div>' +
			'<div class = topMiddle><img class = recentStim src ="'+pathSource+stim2+fileType+'"></img></div>' +
			'<div class = topRight><img class = recentStim src ="'+pathSource+stim3+fileType+'"></img></div>' +
			'<div class = bottomLeft><img class = recentStim src ="'+pathSource+stim4+fileType+'"></img></div>' +
			'<div class = bottomMiddle><img class = recentStim src ="'+pathSource+stim5+fileType+'"></img></div>' +
			'<div class = bottomRight><img class = recentStim src ="'+pathSource+stim6+fileType+'"></img></div>'
	}
};

//this returns the divs for the probe stims.  This goes through the entire probeTypeArray and pops one out each time, then chooses a probe that is
//congruent with that probe type
var getProbe = function() {
	global_trial = jsPsych.progress().current_trial_global
	trainingArray=jsPsych.randomization.repeat(stimArray,1);
	currSet=jsPsych.data.getData()[global_trial-2].stim
	lastSet=jsPsych.data.getData()[global_trial-7].stim
	if(currTrial==0){
		temp=Math.floor(Math.random()*2)
		if(temp==1){
			probeType='xrec_pos'
			probeTypeArray.splice(probeTypeArray.indexOf('xrec_pos'),1)
			temp2=jsPsych.randomization.repeat(currSet,1)
			probe=temp2.pop()
			return '<div class = centerBox><img class = recentStim src="'+pathSource+probe+fileType+'"></img></div>'
		}else if(temp==0){
			probeType='xrec_neg'
			probeTypeArray.splice(probeTypeArray.indexOf('xrec_neg'),1)
			temp2=trainingArray.filter(function(y){return (jQuery.inArray(y,currSet) == -1)})
			probe=temp2.pop()
			return '<div class = centerBox><img class = recentStim src="'+pathSource+probe+fileType+'"></img></div>'
		}
	}else if(currTrial>0){
		probeType=probeTypeArray.pop()
		if(probeType=='rec_pos'){
			recProbes=lastSet.filter(function(y){return (jQuery.inArray(y,currSet) > -1)})
			probe=randomDraw(recProbes)
			return '<div class = centerBox><img class = recentStim src="'+pathSource+probe+fileType+'"></img></div>'
		}else if(probeType=='rec_neg'){
			recProbes=lastSet.filter(function(y){return (jQuery.inArray(y,currSet) == -1)})
			probe=randomDraw(recProbes)
			return '<div class = centerBox><img class = recentStim src="'+pathSource+probe+fileType+'"></img></div>'
		}else if(probeType=='xrec_pos'){
			recProbes=currSet.filter(function(y){return (jQuery.inArray(y,lastSet) == -1)})
			probe=randomDraw(recProbes)
			return '<div class = centerBox><img class = recentStim src="'+pathSource+probe+fileType+'"></img></div>'
		}else if(probeType='xrec_neg'){
			recProbes=trainingArray.filter(function(y){return (jQuery.inArray(y,currSet.concat(lastSet)) == -1)})
			probe=randomDraw(recProbes)
		return '<div class = centerBox><img class = recentStim src="'+pathSource+probe+fileType+'"></img></div>'
		}
	}	
}; 


/* ************************************ */
/* Define experimental variables */
/* ************************************ */
var num_trials = 24 // num trials per run
var num_runs = 3 
var experimentLength = num_trials * num_runs
var currTrial=0
var stimArray=['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
var probes= ['rec_pos','xrec_pos', 'rec_neg', 'xrec_neg']
var probeTypeArray=jsPsych.randomization.repeat(probes,experimentLength/4)
var stimFix = ['fixation']
var pathSource = 'static/experiments/recent_probes/images/'
var fileType = '.png'


/* ************************************ */
/* Set up jsPsych blocks */
/* ************************************ */


var welcome_block = {
  type: 'text',
  text: '<div class = centerbox><p class = block-text>Welcome to the Recent Probes task. Press <strong>enter</strong> to begin.</p></div>',
  cont_key: 13,
  timing_post_trial: 0
};


var end_block = {
  type: 'text',
  text: '<div class = centerbox><p class = center-block-text>Thanks for completing this task!</p><p class = center-block-text>Press <strong>enter</strong> to continue.</p></div>',
  cont_key: 13,
  timing_post_trial: 0
};

var instructions_block = {
  type: 'instructions',
  pages:  [
	'<div class = centerbox><p class = block-text>In this experiment, you will be presented with 6 letters on each trial, known as your memory set.  You must memorize all 6 letters. </p><p class = block-text>After the presentation of 6 letters, there will be a short delay and then you will be presented with a  single letter. Respond with the <strong> Left</strong> arrow key if it was in the memory set, and the <strong> Right </strong> arrow key if it was not in the memory set.</p></div>',
  ],
  allow_keys: false,
  show_clickable_nav: true,
  timing_post_trial: 1000
};


var start_test_block = {
  type: 'text',
  text: '<div class = centerbox><p class = block-text>We will now start a test run. Remeber, at the end of the trial respond with the <strong> Left</strong> arrow key if the letter presented is in the memory set, and the <strong> Right </strong> arrow key if it is not in the memory set.</p><p class = block-text> Press <strong>Enter</strong> to begin the experiment.</p></div>',
  cont_key: 13,
  timing_post_trial: 1000
};

var start_fixation_block = {
  type: 'single-stim',
  stimuli: '<div class = centerbox><div class = fixation><span style="color:red">+</span></div></div>',
  is_html: true,
  choices: 'none',
  data: {exp_id: "recent_probes", "trial_id": "fixation"},
  timing_post_trial: 0,
  timing_stim: 1000,
  timing_response: 1000,
  on_finish: appendFixData
}

var fixation_block = {
  type: 'single-stim',
  stimuli: '<div class = centerbox><div class = fixation><span style="color:red">+</span></div></div>',
  is_html: true,
  choices: 'none',
  data: {exp_id: "recent_probes", "trial_id": "fixation"},
  timing_post_trial: 0,
  timing_stim: 3000,
  timing_response: 3000,
  on_finish: appendFixData
}

var ITI_fixation_block = {
  type: 'single-stim',
  stimuli: '<div class = centerbox><div class = fixation><span style="color:red">+</span></div></div>',
  is_html: true,
  choices: [37,39],
  data: {exp_id: "recent_probes", "trial_id": "ITI_fixation"},
  response_ends_trial: false,
  timing_post_trial: 0,
  timing_stim: 4000,
  timing_response: 4000,
  on_finish: appendFixData
}

var training_block = {
  type: 'single-stim',
  stimuli: getTrainingSet,
  is_html: true,
  data: {exp_id: "recent_probes", trial_id: "test"},
  choices: 'none',
  timing_post_trial: 0,
  timing_stim: 2000,
  timing_response: 2000,
  on_finish: appendTestData,
}; 


 var probe_block = {
  type: 'single-stim',
  stimuli: getProbe,
  is_html: true,
  data: {exp_id: "recent_probes", trial_id: "probe"},
  choices: [37,39],
  timing_post_trial: 0,
  timing_stim: 2000,
  timing_response: 2000,
  on_finish: appendProbeData,
}; 


/* create experiment definition array */
var recent_probes_experiment = [];
recent_probes_experiment.push(welcome_block);
recent_probes_experiment.push(instructions_block);
for (r = 0; i < num_runs; r ++ ) {
	recent_probes_experiment.push(start_test_block);
	for(i=0; i<num_trials; i++){
	recent_probes_experiment.push(start_fixation_block);
	recent_probes_experiment.push(training_block);
	recent_probes_experiment.push(fixation_block);
	recent_probes_experiment.push(probe_block);
	recent_probes_experiment.push(ITI_fixation_block)
	}
}
