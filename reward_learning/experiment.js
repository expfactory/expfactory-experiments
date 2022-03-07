/* ***************************************** */
/*          Define helper functions          */
/* ***************************************** */


/* get subject number entry, load stimuli, and report back to subject */
var getSubjnum = function () {
	var subjnum_trial = jsPsych.data.getLastTrialData()
	var subjstring = subjnum_trial.responses[7] + subjnum_trial.responses[8] + subjnum_trial.responses[9]
	var subjnum = Number(subjstring);
	var stimArray = picArray[subjnum];
	var subjcode = subjcodeArray[subjnum];
	var listerrortext = [];
	if (typeof stimArray == "undefined") {
		stimArray = picArray[0];
		listerrortext = "<div class = centerbox><p class = block-text><div style='color:red'>Participant number </p><p class = block-text>" + subjnum + " not found!  </p><p class = block-text>Please <strong>quit</strong> and check the participant number!!</p></div></div>"
	} else {
		listerrortext = "<div class = centerbox><p class = block-text><div style='color:black'>Participant number </p><p class = block-text><strong>" + subjnum + "</strong>, with codeword <strong>" + subjcode + "</strong> found!  </p><p class = block-text>Press <strong>enter</strong> to continue.</p></div></div>"
	}
	jsPsych.pluginAPI.preloadImages(stimArray);
	answers = genLearnphasestims(stimArray)
	return listerrortext
};


var getSubjreport = function () {
	var listerrortext = [];
	if (typeof stimArray == "undefined") {
		stimArray = picArray[0];
		listerrortext = "<div class = centerbox><p class = block-text><div style='color:red'>Participant number </p><p class = block-text>" + numtemp + " not found!  </p><p class = block-text>Please <strong>quit</strong> and check the participant number!!</p></div></div>"
	} else {
		stimArray = picArray(subjnum);
		listerrortext = "<div class = centerbox><p class = block-text><div style='color:black'>Participant number </p><p class = block-text>" + numtemp + " found!  </p><p class = block-text>Press <strong>enter</strong> to continue.</p></div></div>"
	}
	return listerrortext
};



var getInstructFeedback = function() {
	return '<div class = centerbox><p class = center-block-text>' + feedback_instruct_text +
		'</p></div>'
}

function getDisplayElement() {
   $('<div class = display_stage_background></div>').appendTo('body')
   return $('<div class = display_stage></div>').appendTo('body')
}

function addID() {
 jsPsych.data.addDataToLastTrial({exp_id: 'reward_learning'})
}

var getStim = function() {
	stim = learnPhaseStimsComplete.image.pop()
	curr_data = learnPhaseStimsComplete.data.pop()
	return stim
}

var getResponse = function() {
	return answers.answers.pop()
}

var getYes = function() {
  var throwaway = answers.nofdbk.pop()
	return answers.yesfdbk.pop()
}

var getNo = function() {
  var throwaway = answers.yesfdbk.pop()
	return answers.nofdbk.pop()
}

var getMissed = function() {
	var throwaway = answers.yesfdbk.pop()
	throwaway = answers.nofdbk.pop()
	return "<div class = containerbox><div class = centerbox><div style='color:red'; class = center-text>Too late! -$0.50</div></div></div>"
}

var getITIdurstim = function() {
	return itilist.itistim.pop()
}

var getITIdurresp = function() {
	return itilist.itiresp.pop()
}


var getITI = function() {
	gap = ( Math.floor(Math.random() * 5000) + 500 )
	return gap
}


var genITIs = function () {
	var ititemp = [];
	for(var i = 0; i < Learn_trials; i++){
		ititemp.push( Math.floor(Math.random() * 5000) + 500 );
		};
  var itilist = [];
	var itistim = [];
	var itiresp = [];
	for(var j = 0; j < Learn_trials; j++){
		itistim.push(ititemp[j]);
		itiresp.push(ititemp[j]);
	}
	return {
	  itilist: itilist,
		itistim: itistim,
		itiresp: itiresp
	};
};



// generate a random list of numbers to add / subtract to the feedback amounts
var feedbacknoise = jsPsych.randomization.repeat([0.01, -0.01, 0.02, -0.02, 0.03, -0.03, 0.04, -0.04, 0.05, -0.05, 0.01, -0.01, 0.02, -0.02, 0.03, -0.03, 0.04, -0.04, 0.05, -0.05, 0.01, -0.01, 0.02, -0.02, 0.03, -0.03, 0.04, -0.04, 0.05, -0.05, 0.01, -0.01, 0.02, -0.02, 0.03, -0.03, 0.04, -0.04, 0.05, -0.05],1);
		

var genResponses = function(stimuli) {
	var answers_stim1 = jsPsych.randomization.repeat([38, 38, 38, 38, 40],
		eachRepNum / 10);
	var answers_stim2 = jsPsych.randomization.repeat([40, 40, 40, 40, 38],
		eachRepNum / 10);
	var answers_stim3 = jsPsych.randomization.repeat([38, 38, 38, 38, 40],
		eachRepNum / 10);
	var answers_stim4 = jsPsych.randomization.repeat([40, 40, 40, 40, 38],
		eachRepNum / 10);
	var answers_stim5 = jsPsych.randomization.repeat([38, 38, 38, 38, 40],
		eachRepNum / 10);
	var answers_stim6 = jsPsych.randomization.repeat([40, 40, 40, 40, 38],
		eachRepNum / 10);
	var answers_stim7 = jsPsych.randomization.repeat([38, 38, 38, 38, 40],
		eachRepNum / 10);
	var answers_stim8 = jsPsych.randomization.repeat([40, 40, 40, 40, 38],
		eachRepNum / 10);
	
	var count1 = 0;
	var count2 = 0;
	var count3 = 0;
	var count4 = 0;
	var count5 = 0;
	var count6 = 0;
	var count7 = 0;
	var count8 = 0;
	
	var answers = [];
	var yesfdbk = [];
	var nofdbk = [];
	
	for (var i = 0; i < Learn_trials; i++) {
	
		if (stimuli.data[i].condition === 'stim1') {
			answers.push(answers_stim1[count1]);
			if (answers[i] == choices[0]) {
				yesnumb = 0.25 + feedbacknoise[i]; yesnumb = yesnumb.toFixed(2);
				nonumb = -0.05 + feedbacknoise[i]; nonumb = nonumb.toFixed(2);
			} else {
				nonumb = 0.25 + feedbacknoise[i]; nonumb = nonumb.toFixed(2);
				yesnumb = -0.05 + feedbacknoise[i]; yesnumb = yesnumb.toFixed(2);
			}
			count1 = count1 + 1;
		} else if (stimuli.data[i].condition === 'stim2') {
			answers.push(answers_stim2[count2]);
			if (answers[i] == choices[1]) {
				yesnumb = -0.25 + feedbacknoise[i]; yesnumb = yesnumb.toFixed(2);
				nonumb = 0.00 + feedbacknoise[i]; nonumb = nonumb.toFixed(2);
			} else {
				yesnumb = 0.00 + feedbacknoise[i]; yesnumb = yesnumb.toFixed(2);
				nonumb = -0.25 + feedbacknoise[i]; nonumb = nonumb.toFixed(2);
			}
			count2 = count2 + 1;
		} else if (stimuli.data[i].condition === 'stim3') {
			answers.push(answers_stim3[count3]);
			if (answers[i] == choices[0]) {
				yesnumb = 0.25 + feedbacknoise[i]; yesnumb = yesnumb.toFixed(2);
				nonumb = -0.05 + feedbacknoise[i]; nonumb = nonumb.toFixed(2);
			} else {
				nonumb = 0.25 + feedbacknoise[i]; nonumb = nonumb.toFixed(2);
				yesnumb = -0.05 + feedbacknoise[i]; yesnumb = yesnumb.toFixed(2);
			}
			count3 = count3 + 1;
		} else if (stimuli.data[i].condition === 'stim4') {
			answers.push(answers_stim4[count4]);
			if (answers[i] == choices[1]) {
				yesnumb = -0.25 + feedbacknoise[i]; yesnumb = yesnumb.toFixed(2);
				nonumb = 0.00 + feedbacknoise[i]; nonumb = nonumb.toFixed(2);
			} else {
				yesnumb = 0.00 + feedbacknoise[i]; yesnumb = yesnumb.toFixed(2);
				nonumb = -0.25 + feedbacknoise[i]; nonumb = nonumb.toFixed(2);
			}
			count4 = count4 + 1;
		} else if (stimuli.data[i].condition === 'stim5') {
			answers.push(answers_stim5[count5]);
			if (answers[i] == choices[0]) {
				yesnumb = 0.45 + feedbacknoise[i]; yesnumb = yesnumb.toFixed(2);
				nonumb = -0.05 + feedbacknoise[i]; nonumb = nonumb.toFixed(2);
			} else {
				nonumb = 0.45 + feedbacknoise[i]; nonumb = nonumb.toFixed(2);
				yesnumb = -0.05 + feedbacknoise[i]; yesnumb = yesnumb.toFixed(2);
			}
			count5 = count5 + 1;
		} else if (stimuli.data[i].condition === 'stim6') {
			answers.push(answers_stim6[count6]);
			if (answers[i] == choices[1]) {
				yesnumb = -0.25 + feedbacknoise[i]; yesnumb = yesnumb.toFixed(2);
				nonumb = 0.00 + feedbacknoise[i]; nonumb = nonumb.toFixed(2);
			} else {
				yesnumb = 0.00 + feedbacknoise[i]; yesnumb = yesnumb.toFixed(2);
				nonumb = -0.25 + feedbacknoise[i]; nonumb = nonumb.toFixed(2);
			}
			count6 = count6 + 1;
		} else if (stimuli.data[i].condition === 'stim7') {
			answers.push(answers_stim7[count7]);
			if (answers[i] == choices[0]) {
				yesnumb = 0.45 + feedbacknoise[i]; yesnumb = yesnumb.toFixed(2);
				nonumb = -0.05 + feedbacknoise[i]; nonumb = nonumb.toFixed(2);
			} else {
				nonumb = 0.45 + feedbacknoise[i]; nonumb = nonumb.toFixed(2);
				yesnumb = -0.05 + feedbacknoise[i]; yesnumb = yesnumb.toFixed(2);
			}
			count7 = count7 + 1;
		} else {
			answers.push(answers_stim8[count8]);
			if (answers[i] == choices[1]) {
				yesnumb = -0.25 + feedbacknoise[i]; yesnumb = yesnumb.toFixed(2);
				nonumb = 0.00 + feedbacknoise[i]; nonumb = nonumb.toFixed(2);
			} else {
				yesnumb = 0.00 + feedbacknoise[i]; yesnumb = yesnumb.toFixed(2);
				nonumb = -0.25 + feedbacknoise[i]; nonumb = nonumb.toFixed(2);
			}
			count8 = count8 + 1;
		}
		if (answers[i] == choices[0] & stimuli.data[i].optimal_response == choices[0]) {
			yesfdbk.push("<div class = containerbox><div class = centerbox><div style='color:#00C200'; class = center-text>" + yesnumb + "!</div></div></div>");
			nofdbk.push("<div class = containerbox><div class = centerbox><div style='color:#FF0000'; class = center-text>" + nonumb + "!</div></div></div>");
		} else if (answers[i] == choices[1] & stimuli.data[i].optimal_response == choices[0]) {
			yesfdbk.push("<div class = containerbox><div class = centerbox><div style='color:#FF0000'; class = center-text>" + yesnumb + "!</div></div></div>");
			nofdbk.push("<div class = containerbox><div class = centerbox><div style='color:#00C200'; class = center-text>" + nonumb + "!</div></div></div>");
		} else if (answers[i] == choices[1] & stimuli.data[i].optimal_response == choices[1]) {
			yesfdbk.push("<div class = containerbox><div class = centerbox><div style='color:#FF0000'; class = center-text>" + yesnumb + "!</div></div></div>");
			nofdbk.push("<div class = containerbox><div class = centerbox><div style='color:grey'; class = center-text>" + nonumb + "!</div></div></div>");
	  } else if (answers[i] == choices[0] & stimuli.data[i].optimal_response == choices[1]) {
			yesfdbk.push("<div class = containerbox><div class = centerbox><div style='color:grey'; class = center-text>" + yesnumb + "!</div></div></div>");
			nofdbk.push("<div class = containerbox><div class = centerbox><div style='color:#FF0000'; class = center-text>" + nonumb + "!</div></div></div>");
		}
	}
	return {
        answers: answers,
        yesfdbk: yesfdbk,
        nofdbk: nofdbk
    };
};



var getPrevresponse = function() {
	var choice_trial = jsPsych.data.getLastTrialData()
	var keypress = choice_trial.key_press
	var rt = choice_trial.rt
	if (keypress == -1) {
		return getMissed
	} else if (keypress == 38 ) {
		return getYes	
	} else if (keypress == 40 ) {
		return getNo
	}
};



/*************************************************************************/
/*                 DEFINE EXPERIMENTAL VARIABLES                         */
/*************************************************************************/
// task specific variables
var choices = [38, 40]
var curr_data = []
var stim = ''
// specify the number of trials in the learning phase
var Learn_trials = 40;
var eachRepNum = 5;


var genLearnphasestims = function (stimArray) {
	var stims = [['stim1', stimArray[0], choices[0]],
				['stim2', stimArray[1], choices[1]],
				['stim3', stimArray[2], choices[0]],
				['stim4', stimArray[3], choices[1]],
				['stim5', stimArray[4], choices[0]],
				['stim6', stimArray[5], choices[1]],
				['stim7', stimArray[6], choices[0]],
				['stim8', stimArray[7], choices[1]],
				['Yes', stimArray[8], 101],
				['No', stimArray[9], 102]]
	learnPhaseStims = [];
	for (var i = 0; i<8; i++) {
		var list_stim = {}
		list_stim.image = "<div class = containerbox><div class = decision-up><img src='" + stims[8][1] +
			"'></img></div><div class = centerbox><input type = 'image' class = 'picture_size' src='" + stims[i][1] + 
			"'></div><div class = decision-down><img src='" + stims[9][1] +
			"'></img></div></div>"
		list_stim.data = {
			trial_id: 'stim',
			exp_stage: 'learning',
			condition: stims[i][0],
			optimal_response: stims[i][2]
		}
		learnPhaseStims.push(list_stim)
	}
	learnPhaseStimsComplete = jsPsych.randomization.repeat(learnPhaseStims, eachRepNum, true);
	var answers = genResponses(learnPhaseStimsComplete)
	return answers
};

var curr_data = ''


var itilist = genITIs()



/* ************************************ */
/*         Set up jsPsych blocks        */
/* ************************************ */

// set up pre-task entry of subject number
var pre_task_block = {
   type: 'survey-text',
   data: {
       trial_id: "subject number entry"
   },
   questions: ['<p class = center-block-text style = "font-size: 20px">Please enter your 3-digit participant number:</p>'],
   rows: [1, 1],
   columns: [3, 3]
};

// set up post task questionnaire
var post_task_block = {
   type: 'survey-text',
   data: {
       trial_id: "post task questions"
   },
   questions: ['<p class = center-block-text style = "font-size: 20px">On a scale of 1 (easy) - 10 (very difficult), rate how difficult the session was today.</p>',
              '<p class = center-block-text style = "font-size: 20px">On a scale of 1 (awake) - 10 (very tired), rate how tired you felt during the session today.</p>'],
   rows: [15, 15],
   columns: [60,60]
};

/* define static blocks */

// introduction
var feedback_instruct_text =
	'Welcome back to the experiment! This part will take about 5 minutes. Press <strong>enter</strong> to review the instructions.'
var learning_instruct_block = {
	type: 'poldrack-text',
	data: {
		trial_id: "instruction"
	},
	cont_key: [13],
	text: getInstructFeedback,
	timing_post_trial: 0,
	timing_response: 180000000
};


// subject number processing and picture list creation
var learning_participantexists = {
	type: 'poldrack-text',
	data: {
		trial_id: "instruction"
	},
	cont_key: [13],
	text: getSubjnum,
	timing_post_trial: 0,
	timing_response: 180000000
};


// instructions part 1
var instructions_block = {
	type: 'poldrack-instructions',
	data: {
		trial_id: "instruction"
	},
	pages: [
		'<div class = containerbox><div class = centerbox><p class = block-text>Today you will continue learning about the lucky and unlucky scenes from the first session.  As a reminder, you will see each scene with a "Yes" option above and "No" option below.  For each scene, you must choose one option by using the <strong>up</strong> or <strong>down</strong> arrow key.</p><p class = block-text>Each scene has a different chance of being "lucky". Your task is to maximize your winnings ($) by betting "Yes" on lucky scenes and betting "No" on unlucky scenes.</p></div></div>',
	],
	allow_keys: false,
	show_clickable_nav: true,
	timing_post_trial: 1000
};


var learning_phase_trials = {
	type: 'poldrack-categorize',
	stimulus: getStim,
	key_answer: getResponse,
	choices: choices,
	show_stim_with_feedback: false,
	correct_text: "<div class = containerbox><div class = centerbox><div style='color:white'; class = center-text></div></div></div>",
  incorrect_text: "<div class = containerbox><div class = centerbox><div style='color:white'; class = center-text></div></div></div>",
	timeout_message: "<div class = containerbox><div class = centerbox><div style='color:white'; class = center-text></div></div></div>",	
	timing_stim: 1500,
	timing_response: 1500,
	timing_feedback_duration: 1000,
	response_ends_trial: false,
	timing_post_trial: 0,
	is_html: true
};


var learning_phase_feedback = {
	type: 'poldrack-single-stim',
	choices: 'none',
	response_ends_trial: false,
	stimulus: getPrevresponse,
	is_html: true,
	data: {
			trial_id: "feedback",
			exp_stage: "learn"
	},
	timing_post_trial: 0,
	timing_stim: 750,
	timing_response: 750
}


var learning_phase_itis = {
	type: 'poldrack-single-stim',
	choices: 'none',
	response_ends_trial: false,
	stimulus: "<div class = containerbox><div class = centerbox><div class = fixwhite>+</div></div></div>",
	is_html: true,
	data: {
			trial_id: "fixation_white",
			exp_stage: "learn"
	},
	timing_post_trial: 0,
	timing_stim: getITIdurstim,
	timing_response: getITIdurresp
}



var learning_phase_prefix = {
	type: 'poldrack-single-stim',
	stimulus: "<div class = containerbox><div class = centerbox><div class = fixation>+</div></div></div>",
	is_html: true,
	choices: 'none',
	response_ends_trial: false,
	data: {
			trial_id: "fixation_black",
			exp_stage: "learn"
	},
	timing_post_trial: 0,
	timing_stim: 250,
	timing_response: 250
}



var learning_phase_start = {
	type: 'poldrack-text',
	timing_response: 1800000,
	data: {
		trial_id: "learning_phase_intro"
	},
	text: '<div class = centerbox><p class = block-text>Get ready!</p><p class = block-text> Press <strong> Enter </strong> when you are ready.</p></div>',
	cont_key: [13]
};

var end_block = {
	type: 'poldrack-text',
	data: {
		trial_id: "end",
		exp_id: 'reward_learning'
	},
	timing_response: 180000,
	text: '<div class = centerbox><p class = center-block-text>Finished with this task!</p><p class = center-block-text>Press <strong>enter</strong> to continue.</p></div>',
	cont_key: [13]
};



/* create experiment definition array */
var reward_learning_experiment = [];
reward_learning_experiment.push(pre_task_block);
reward_learning_experiment.push(learning_participantexists);
reward_learning_experiment.push(learning_instruct_block);
reward_learning_experiment.push(instructions_block);
reward_learning_experiment.push(learning_phase_start);
for(var i = 0; i<Learn_trials; i++){
	reward_learning_experiment.push(learning_phase_itis);
	reward_learning_experiment.push(learning_phase_prefix);
	reward_learning_experiment.push(learning_phase_trials);
	reward_learning_experiment.push(learning_phase_feedback);
}
reward_learning_experiment.push(post_task_block);
reward_learning_experiment.push(end_block);