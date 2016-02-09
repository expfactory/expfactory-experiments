/* ************************************ */
/* Define helper functions */
/* ************************************ */
//

function getDisplayElement() {
	$('<div class = display_stage_background></div>').appendTo('body')
	return $('<div class = display_stage></div>').appendTo('body')
}


var practiceCount = 0
var getPracticePrompt = function() {
	temp =
		'<div class = centerbox><p class = block-text>We will now practice some trials for the <strong>' +
		colors[practiceCount] +
		' square.</strong> These trials will be identical to the main Phase 1 task except the action and outcome will only be presented to you in these practice trials so you must commit them to memory before the main Phase 1 task.</p><p class = block-text>Please try both pressing the spacebar and pressing nothing to see the different outcomes for each action.</p><p class = block-text>Press <strong>enter</strong> to continue</p></div>'
	if (practiceCount != 7) {
		practiceCount = practiceCount + 1
	} else if (practiceCount == 7) {
		practiceCount = 0
	}
	return temp
}


var practiceCount2=0
var getPracticeLearning = function(){
	tempRule=practiceLearningText[practiceCount2]
	tempStims=practiceLearningStims[practiceCount2]
	practiceCount2=practiceCount2+1
	return prompt_practice_text_heading1 + tempRule  + tempStims.image
}

var practiceCount3 = 0
var getPracticeLearningStim = function() {
	tempStims = practiceLearningStims[practiceCount3]
	currData = tempStims.data
	tempRulePrompt = practicePrompts[practiceCount3]
	return tempStims.image + tempRulePrompt
}

var appendData2 = function() {
	jsPsych.data.addDataToLastTrial({
		subject_ID: subjectID,
		stim: currData.stimulus,
		condition: currData.condition,
		correct_response: currData.correct_response[1],
		current_trial: currTrial
	})
	currTrial = currTrial + 1
}

var getReward = function() {
	global_trial = jsPsych.progress().current_trial_global
	subjectResponse = jsPsych.data.getData()[global_trial - 1].key_press
	correctResponse = jsPsych.data.getData()[global_trial - 1].correct_response
	trialCondition = jsPsych.data.getData()[global_trial - 1].condition

	if ((correctResponse == subjectResponse) && (trialCondition == 'go_win')) {
		reward = 'plus_25'
		return preFileType + pathSource + 'plus_25' + fileType + postFileType
	} else if ((correctResponse == subjectResponse) && (trialCondition == 'nogo_win')) {
		reward = 'plus_25'
		return preFileType + pathSource + 'plus_25' + fileType + postFileType
	} else if ((correctResponse == subjectResponse) && (trialCondition == 'go_avoid')) {
		reward = 'minus_0'
		return preFileType + pathSource + 'minus_0' + fileType + postFileType
	} else if ((correctResponse == subjectResponse) && (trialCondition == 'nogo_avoid')) {
		reward = 'minus_0'
		return preFileType + pathSource + 'minus_0' + fileType + postFileType
	}
	if ((correctResponse != subjectResponse) && (trialCondition == 'go_win')) {
		reward = 'plus_0'
		return preFileType + pathSource + 'plus_0' + fileType + postFileType
	} else if ((correctResponse != subjectResponse) && (trialCondition == 'nogo_win')) {
		reward = 'plus_0'
		return preFileType + pathSource + 'plus_0' + fileType + postFileType
	} else if ((correctResponse != subjectResponse) && (trialCondition == 'go_avoid')) {
		reward = 'minus_25'
		return preFileType + pathSource + 'minus_25' + fileType + postFileType
	} else if ((correctResponse != subjectResponse) && (trialCondition == 'nogo_avoid')) {
		reward = 'minus_25'
		return preFileType + pathSource + 'minus_25' + fileType + postFileType
	}
}

var appendRewardData2 = function() {
	jsPsych.data.addDataToLastTrial({
		stim: reward
	})
}

//////////////////////////////////////////////////////////////////////////////////////////////////
//first phase functions

var getStim = function() {
	stim = firstPhaseStimsComplete.image.pop()
	curr_data = firstPhaseStimsComplete.data.pop()
	curr_answer = curr_data.correct_response[1]
	return stim
}

var appendRewardData = function() {
	jsPsych.data.addDataToLastTrial({
		reward: reward
	})

}

var appendData = function() {
	jsPsych.data.addDataToLastTrial({
		subject_ID: subjectID,
		stim: curr_data.stimulus,
		condition: curr_data.condition,
		correct_response: curr_data.correct_response[1],
		current_trial: currTrial
	})
	currTrial = currTrial + 1
}


var getLearningFeedback = function() {
	return '<div class = centerbox><p class = block-text>' + learning_feedback_text + '</p></div>'
}

//////////////////////////////////////////////////////////////////////////////////////////////////
// practice second phase functions

var getPracticeFeedback = function() {
	return '<div class = centerbox><p class = block-text>' + practice_feedback_text + '</p></div>'
}


var getPracticeFeedback2 = function() {
	return '<div class = centerbox><p class = block-text>' + practice_feedback_text2 + '</p></div>'
}

var getSSPracticeStim = function() {
	practice_trial_data = secondPhaseStimsComplete.data.pop()
	return secondPhaseStimsComplete.image.pop()
}

var practice_stop_trials = jsPsych.randomization.repeat(['stop', 'stop', 'stop', 'stop', 'go', 'go',
	'go', 'go', 'go', 'go', 'go', 'go'
], 1, false)
var getSSPractice_trial_type = function() {
	return practice_stop_trials.pop()
}

var getSSPracticeData = function() {
	return practice_trial_data
}

var appendPracticeStopData = function() {
	jsPsych.data.addDataToLastTrial({
		trial_id: "practice_stop",
		subject_ID: subjectID,
		stim: practice_trial_data.stimulus,
		condition: practice_trial_data.condition,
		stop_stim: stop_signal,
		stop_condition: "neutral",
		current_trial: currTrial
	})
	currTrial = currTrial + 1

}

practiceShapeArray = jsPsych.randomization.repeat([1, 2, 3, 4], 3)
var getPracticeStopStim = function() {
	practiceShape = practiceShapeArray.pop()
	if (practiceShape == 1 || practiceShape == 2) {
		goStim = {
			image: preFileType + pathSource + colors[8] + '_' + shapes[practiceShape] + fileType +
				postFileType,
			data: {
				exp_id: 'gm_paradigm',
				subject_ID: subjectID,
				stimulus: colors[8] + '_' + shapes[practiceShape],
				correct_response: practiceStop_responses[0],
				condition: conditions[4]
			}
		}
		currData = goStim.data
		return goStim.image
	} else if (practiceShape == 3 || practiceShape == 4) {
		goStim = {
			image: preFileType + pathSource + colors[8] + '_' + shapes[practiceShape] + fileType +
				postFileType,
			data: {
				exp_id: 'gm_paradigm',
				subject_ID: subjectID,
				stimulus: colors[8] + '_' + shapes[practiceShape],
				correct_response: practiceStop_responses[1],
				condition: conditions[4]
			}
		}
		currData = goStim.data
		return goStim.image
	}
}

var appendPracticeGoData = function() {
	jsPsych.data.addDataToLastTrial({
		trial_id: "practice-stop",
		subject_ID: subjectID,
		current_trial: currTrial,
		stim: goStim.image,
		condition: currData.condition,
		correct_response: currData.correct_response
	})
	currTrial = currTrial + 1
}

//////////////////////////////////////////////////////////////////////////////////////////////////
// second phase functions
var getSSPracticeStim3 = function() {
	goTemp = goStimsArray.shift()
	practice_trial_data = goTemp.data
	return goTemp.image
}

var getStopSignal = function(){
	stopTemp = stopStimsArray.shift()
	currData = stopTemp.data
	return stopTemp.image
}

var getSSPracticeData3 = function() {
	return practice_trial_data
}

var getSSPractice_trial_type3 = function() {
	return a.trial.pop() 
}


var getSSD = function() {
	return SSD
}

var resetSSD = function() {
	SSD = 250
}

var resetTrial = function() {
	currTrial = 0
}

var getStopFeedback = function() {
	return '<div class = centerbox><p class = block-text>' + stop_feedback_text + '</p></div>'
}

var updateSSDandData = function() {
	jsPsych.data.addDataToLastTrial({
		trial_id: "test-stop",
		subject_ID: subjectID,
		SSD: SSD,
		stop_stim: currData.stop_stim,
		stop_condition: currData.stop_color_condition,
		current_trial: currTrial
	})
	currTrial = currTrial + 1
	curr_trial = jsPsych.progress().current_trial_global
	if ((jsPsych.data.getDataByTrialIndex(curr_trial).rt == -1) && (SSD<850) && (jsPsych.data.getDataByTrialIndex(curr_trial).SS_trial_type=='stop')) {
		SSD = SSD + 50
	} else if ((jsPsych.data.getDataByTrialIndex(curr_trial).rt != -1) && (SSD > 0) && (jsPsych.data.getDataByTrialIndex(curr_trial).SS_trial_type=='stop')) { 
		SSD = SSD - 50
	}
	
	if ((jsPsych.data.getDataByTrialIndex(curr_trial).key_press == jsPsych.data.getDataByTrialIndex(curr_trial).correct_response[1]) && (jsPsych.data.getDataByTrialIndex(curr_trial).SS_trial_type == 'go')){
		jsPsych.data.addDataToLastTrial({go_acc: 1})
	} else if ((jsPsych.data.getDataByTrialIndex(curr_trial).key_press != jsPsych.data.getDataByTrialIndex(curr_trial).correct_response[1]) && (jsPsych.data.getDataByTrialIndex(curr_trial).SS_trial_type == 'go')){
		jsPsych.data.addDataToLastTrial({go_acc: 0})
	}
	if ((jsPsych.data.getDataByTrialIndex(curr_trial).key_press == -1) && (jsPsych.data.getDataByTrialIndex(curr_trial).SS_trial_type == 'stop')){
		jsPsych.data.addDataToLastTrial({stop_acc: 1})
	} else if ((jsPsych.data.getDataByTrialIndex(curr_trial).key_press != -1) && (jsPsych.data.getDataByTrialIndex(curr_trial).SS_trial_type == 'stop')){
		jsPsych.data.addDataToLastTrial({stop_acc: 0})
	} 
}


//////////////////////////////////////////////////////////////////////////////////////////////////
// forced choice functions


var getCombo = function() {
	squares = ChoiceCombos1.pop()
	whichSquare = squares[0]
	whichSquare2 = squares[1]
	data = combos1Data.pop()
	firstCond = data[0]
	secCond = data[1]
	ssType = combos1SStype.pop()
	firstSS = ssType[0]
	secondSS = ssType[1]
	return [forcedChoiceType + pathSource + whichSquare + fileType + postFileTypeForced +
		forcedChoiceType2 + pathSource + whichSquare2 + fileType + postFileTypeForced
	]
}

var getCombo2 = function() {
	squares = ChoiceCombos2.pop()
	whichSquare = squares[0]
	whichSquare2 = squares[1]
	data = combos2Data.pop()
	firstCond = data[0]
	secCond = data[1]
	ssType = combos2SStype.pop()
	firstSS = ssType[0]
	secondSS = ssType[1]
	return [forcedChoiceType + pathSource + whichSquare + fileType + postFileTypeForced +
		forcedChoiceType2 + pathSource + whichSquare2 + fileType + postFileTypeForced
	]
}

var appendForcedChoiceData = function() {
	curr_trial = jsPsych.progress().current_trial_global
	whichKey = jsPsych.data.getData()[curr_trial].key_press
	if (whichKey == 37) {
		jsPsych.data.addDataToLastTrial({
			subject_ID: subjectID,
			chosenStim: whichSquare,
			chosenCond: firstCond,
			chosenGo_Stop: firstSS,
			stimLeft: whichSquare,
			cond_left: firstCond,
			go_stop_left: firstSS,
			stimRight: whichSquare2,
			cond_right: secCond,
			go_stop_right: secondSS,
			current_trial: currTrial
		})
	} else if (whichKey == 39) {
		jsPsych.data.addDataToLastTrial({
			subject_ID: subjectID,
			chosenStim: whichSquare2,
			chosenCond: secCond,
			chosenGo_Stop: secondSS,
			stimLeft: whichSquare,
			cond_left: firstCond,
			go_stop_left: firstSS,
			stimRight: whichSquare2,
			cond_right: secCond,
			go_stop_right: secondSS,
			current_trial: currTrial
		})
	} else if (whichKey == -1) {
		jsPsych.data.addDataToLastTrial({
			subject_ID: subjectID,
			chosenStim: "",
			chosenCond: "",
			chosenGo_Stop: "",
			stimLeft: whichSquare,
			cond_left: firstCond,
			go_stop_left: firstSS,
			stimRight: whichSquare2,
			cond_right: secCond,
			go_stop_right: secondSS,
			current_trial: currTrial
		})
	}
	currTrial = currTrial + 1
}

///////////////////////////////////
var getBonus = function() {
	data = jsPsych.data.getData()
	sumReward = 0
	for (i = 0; i < data.length; i++) {
		whichReward = jsPsych.data.getData()[i].reward
		if (whichReward == 'plus_25') {
			sumReward = sumReward + 0.25
		} else if (whichReward == 'minus_25') {
			sumReward = sumReward - 0.25
		} else if (whichReward == 'plus_0' || whichReward == 'minus_0') {
			sumReward = sumReward
		}
	}
	jsPsych.data.addDataToLastTrial({
		subject_ID: subjectID,
		total_reward: sumReward
	})
	return '<div class = centerbox><p class = center-block-text>Your bonus is:  <strong>' + sumReward +
		'</strong></div>'
}



/* ************************************ */
/* Define experimental variables */
/* ************************************ */


var subjectID = 115
var RT_thresh = 800
var SSD = 250
var accuracy_thresh = 0.85
var gap = 0
var learningNumTrials = 24
var practiceStopNumTrials = 24
var numLearningBlocks = 0
var numLearningBlocksTotal = 3
var numTrials = 80
var currTrial = 0
var pathSource = '/static/experiments/gm_paradigm/images/'
var fileType = '.png'
var preFileType = "<img class = center src='"
var forcedChoiceType = "<div class = decision-left><img src='"
var forcedChoiceType2 = "<div class = decision-right><img src='"
var postFileType = "'></img>"
var postFileTypeForced = "'></img></div>"

var shapes = jsPsych.randomization.repeat(['circle', 'rhombus', 'pentagon', 'triangle'], 1)
shapes.splice(0, 0, 'square')
var colors = jsPsych.randomization.repeat(['red', 'green', 'blue', 'yellow', 'orange', 'black',
	'purple', 'grey', 'brown', 'pink'
], 1)
var correct_responses = [
	["left arrow", 37],
	["right arrow", 39],
	["none", -1],
	["space bar", 32]
]
var practice_responses = [
	["space bar", 37],
	["no", -1]
]
var practiceStop_responses = [
	["Z Key", 90],
	["M Key", 77]
]
var conditions = ['go_win', 'go_avoid', 'nogo_win', 'nogo_avoid', 'neutral']
var practice_trial_data = '' //global variable to track randomized practice trial data
var missed_response_thresh = 0.05
var practiceConditions = ['Press space bar to earn 25 cents',
	'Press space bar to avoid losing 25 cents', 'Press nothing to earn 25 cents',
	'Press nothing to avoid losing 25 cents'
]
var startTestPrompt = '<ul list-text><li><strong>' + colors[0] + '</strong>: ' + correct_responses[
		3][0] + ' (' + practiceConditions[0] + ')' + '</li><li><strong>' + colors[1] + ':</strong> ' +
	correct_responses[3][0] + ' (' + practiceConditions[1] + ')' + '</li><li><strong>' + colors[4] +
	':</strong> ' + correct_responses[3][0] + ' (' + practiceConditions[0] + ')' + '</li><li><strong>' +
	colors[5] + ':</strong> ' + correct_responses[3][0] + ' (' + practiceConditions[1] + ')' +
	'</li><li><strong>' + colors[6] + ':</strong> ' + correct_responses[2][0] + ' (' +
	practiceConditions[2] + ')' + '</li><li><strong>' + colors[7] + ': </strong>' + correct_responses[
		2][0] + ' (' + practiceConditions[3] + ')' + '</li><li><strong>' + colors[2] + ': </strong>' +
	correct_responses[2][0] + ' (' + practiceConditions[2] + ')' + '</li><li><strong>' + colors[3] +
	': </strong>' + correct_responses[2][0] + ' (' + practiceConditions[3] + ')' + '</li></ul>'
var zmprompt_text = '<ul list-text><li>' + shapes[1] + ': ' + practiceStop_responses[0][0] +
	'</li><li>' + shapes[2] + ': ' + practiceStop_responses[0][0] + '</li><li>' + shapes[3] + ': ' +
	practiceStop_responses[1][0] + '</li><li>' + shapes[4] + ': ' + practiceStop_responses[1][0] +
	'</li></ul>'
var prompt_text = '<ul list-text><li>' + shapes[1] + ': ' + correct_responses[0][0] + '</li><li>' +
	shapes[2] + ': ' + correct_responses[0][0] + '</li><li>' + shapes[3] + ': ' + correct_responses[1][0] + '</li><li>' + shapes[4] + ': ' + correct_responses[1][0] + '</li></ul>'
var prompt_practice_text_heading1 =
	'<div><p><strong>This is one of the colors that you will see.</strong></p>'
var prompt_practice_text_heading2 =
	'  We will take a look at all colors associated with the rules.</p><p>Press <strong>Enter</strong> to move to the next page.</div>'

stopStim = {
	image: preFileType + pathSource + colors[8] + '_stopSignal' + fileType + postFileType,
	data: {
		exp_id: 'gm_paradigm',
		subject_ID: subjectID,
		stop_stim: colors[8] + '_stopSignal',
		correct_response: ["none", -1],
		stop_color_condition: conditions[4]
	}
}
currData = stopStim.data


var count = 0
var count1 = 0
var countStims = 0
var countPractice = 0
var stopCount = 0
var stopPracticeCount = 0


var stim1 = colors[0] + '_' + shapes[0]
var stim2 = colors[1] + '_' + shapes[0]
var stim3 = colors[2] + '_' + shapes[0]
var stim4 = colors[3] + '_' + shapes[0]
var stim5 = colors[4] + '_' + shapes[0]
var stim6 = colors[5] + '_' + shapes[0]
var stim7 = colors[6] + '_' + shapes[0]
var stim8 = colors[7] + '_' + shapes[0]


var p2stim1 = colors[8] + '_' + shapes[1]
var p2stim2 = colors[8] + '_' + shapes[2]
var p2stim3 = colors[8] + '_' + shapes[3]
var p2stim4 = colors[8] + '_' + shapes[4]
var p2stop = colors[9] + '_stopSignal'
var stop_signal = preFileType + pathSource + p2stop + fileType + postFileType

var practiceLearningText = ['  <br><br>Each time you see the <strong>' + colors[0] + ' ' + shapes[0] +
	'</strong>, you should <strong>press the space bar</strong> to earn 25 cents. You should not press nothing, as this will result in earning 0 cents.  <br><br> Press <strong>enter</strong> to continue',
	'  <br><br>Each time you see the <strong>' + colors[1] + ' ' + shapes[0] +
	'</strong>, you should <strong>press the space bar</strong> to lose 0 cents.  You should not press the space bar, as this will result in losing 25 cents.  <br><br> Press <strong>enter</strong> to continue',
	'  <br><br>Each time you see the <strong>' + colors[2] + ' ' + shapes[0] +
	'</strong>, you should <strong>do nothing</strong> to gain 25 cents.  You should  not press the space bar, as this will result in gaining 0 cents.  <br><br> Press <strong>enter</strong> to continue',
	'  <br><br>Each time you see the <strong>' + colors[3] + ' ' + shapes[0] +
	'</strong>, you should <strong>do nothing</strong> to lose 0 cents.  You should not act, as this will result in losing 25 cents.  <br><br> Press <strong>enter</strong> to continue',
	'  <br><br>Each time you see the <strong>' + colors[4] + ' ' + shapes[0] +
	'</strong>, you should <strong>press the space bar</strong> to earn 25 cents.  You should not press nothing, as this will result in earning 0 cents.  <br><br> Press <strong>enter</strong> to continue',
	'  <br><br>Each time you see the <strong>' + colors[5] + ' ' + shapes[0] +
	'</strong>, you should <strong>press the space bar</strong> to lose 0 cents.  You should not press nothing, as this will result in losing 25 cents.  <br><br> Press <strong>enter</strong> to continue',
	'  <br><br>Each time you see the <strong>' + colors[6] + ' ' + shapes[0] +
	'</strong>, you should <strong>do nothing</strong> to gain 25 cents.  You should not press the space bar, as this will result in gaining 0 cents.  <br><br> Press <strong>enter</strong> to continue',
	'  <br><br>Each time you see the <strong>' + colors[7] + ' ' + shapes[0] +
	'</strong>, you should <strong>do nothing</strong> to lose 0 cents.  You should not act, as this will result in losing 25 cents.  <br><br> Press <strong>enter</strong> to continue'
]

var practiceLearningStims = [{
	image: preFileType + pathSource + stim1 + fileType + postFileType,
	data: {
		exp_id: 'gm_paradigm',
		stimulus: stim1,
		correct_response: correct_responses[3],
		condition: conditions[0]
	}
}, {
	image: preFileType + pathSource + stim2 + fileType + postFileType,
	data: {
		exp_id: 'gm_paradigm',
		stimulus: stim2,
		correct_response: correct_responses[3],
		condition: conditions[1]
	}
}, {
	image: preFileType + pathSource + stim3 + fileType + postFileType,
	data: {
		exp_id: 'gm_paradigm',
		stimulus: stim3,
		correct_response: correct_responses[2],
		condition: conditions[2]
	}
}, {
	image: preFileType + pathSource + stim4 + fileType + postFileType,
	data: {
		exp_id: 'gm_paradigm',
		stimulus: stim4,
		correct_response: correct_responses[2],
		condition: conditions[3]
	}
}, {
	image: preFileType + pathSource + stim5 + fileType + postFileType,
	data: {
		exp_id: 'gm_paradigm',
		stimulus: stim5,
		correct_response: correct_responses[3],
		condition: conditions[0]
	}
}, {
	image: preFileType + pathSource + stim6 + fileType + postFileType,
	data: {
		exp_id: 'gm_paradigm',
		stimulus: stim6,
		correct_response: correct_responses[3],
		condition: conditions[1]
	}
}, {
	image: preFileType + pathSource + stim7 + fileType + postFileType,
	data: {
		exp_id: 'gm_paradigm',
		stimulus: stim7,
		correct_response: correct_responses[2],
		condition: conditions[2]
	}
}, {
	image: preFileType + pathSource + stim8 + fileType + postFileType,
	data: {
		exp_id: 'gm_paradigm',
		stimulus: stim8,
		correct_response: correct_responses[2],
		condition: conditions[3]
	}
}]

var practicePrompts = ['<ul list-text><li><strong>' + colors[0] + '</strong>: ' + correct_responses[
		3][0] + ' (' + practiceConditions[0] + ')' + '</li>',
	'<ul list-text><li><strong>' + colors[1] + '</strong>: ' + correct_responses[3][0] + ' (' +
	practiceConditions[1] + ')' + '</li>',
	'<ul list-text><li><strong>' + colors[2] + '</strong>: ' + correct_responses[2][0] + ' (' +
	practiceConditions[2] + ')' + '</li>',
	'<ul list-text><li><strong>' + colors[3] + '</strong>: ' + correct_responses[2][0] + ' (' +
	practiceConditions[3] + ')' + '</li>',
	'<ul list-text><li><strong>' + colors[4] + '</strong>: ' + correct_responses[3][0] + ' (' +
	practiceConditions[0] + ')' + '</li>',
	'<ul list-text><li><strong>' + colors[5] + '</strong>: ' + correct_responses[3][0] + ' (' +
	practiceConditions[1] + ')' + '</li>',
	'<ul list-text><li><strong>' + colors[6] + '</strong>: ' + correct_responses[2][0] + ' (' +
	practiceConditions[2] + ')' + '</li>',
	'<ul list-text><li><strong>' + colors[7] + '</strong>: ' + correct_responses[2][0] + ' (' +
	practiceConditions[3] + ')' + '</li>'
]


firstPhaseStims = [{
	image: preFileType + pathSource + stim1 + fileType + postFileType,
	data: {
		exp_id: 'gm_paradigm',
		stimulus: stim1,
		correct_response: correct_responses[3],
		condition: conditions[0]
	}
}, {
	image: preFileType + pathSource + stim2 + fileType + postFileType,
	data: {
		exp_id: 'gm_paradigm',
		stimulus: stim2,
		correct_response: correct_responses[3],
		condition: conditions[1]
	}
}, {
	image: preFileType + pathSource + stim3 + fileType + postFileType,
	data: {
		exp_id: 'gm_paradigm',
		stimulus: stim3,
		correct_response: correct_responses[2],
		condition: conditions[2]
	}
}, {
	image: preFileType + pathSource + stim4 + fileType + postFileType,
	data: {
		exp_id: 'gm_paradigm',
		stimulus: stim4,
		correct_response: correct_responses[2],
		condition: conditions[3]
	}
}, {
	image: preFileType + pathSource + stim5 + fileType + postFileType,
	data: {
		exp_id: 'gm_paradigm',
		stimulus: stim5,
		correct_response: correct_responses[3],
		condition: conditions[0]
	}
}, {
	image: preFileType + pathSource + stim6 + fileType + postFileType,
	data: {
		exp_id: 'gm_paradigm',
		stimulus: stim6,
		correct_response: correct_responses[3],
		condition: conditions[1]
	}
}, {
	image: preFileType + pathSource + stim7 + fileType + postFileType,
	data: {
		exp_id: 'gm_paradigm',
		stimulus: stim7,
		correct_response: correct_responses[2],
		condition: conditions[2]
	}
}, {
	image: preFileType + pathSource + stim8 + fileType + postFileType,
	data: {
		exp_id: 'gm_paradigm',
		stimulus: stim8,
		correct_response: correct_responses[2],
		condition: conditions[3]
	}
}]


secondPhaseStims = [{
	image: preFileType + pathSource + p2stim1 + fileType + postFileType,
	data: {
		exp_id: 'gm_paradigm',
		stimulus: p2stim1,
		correct_response: practiceStop_responses[0],
		condition: conditions[4]
	}
}, {
	image: preFileType + pathSource + p2stim2 + fileType + postFileType,
	data: {
		exp_id: 'gm_paradigm',
		stimulus: p2stim2,
		correct_response: practiceStop_responses[0],
		condition: conditions[4]
	}
}, {
	image: preFileType + pathSource + p2stim3 + fileType + postFileType,
	data: {
		exp_id: 'gm_paradigm',
		stimulus: p2stim3,
		correct_response: practiceStop_responses[1],
		condition: conditions[4]
	}
}, {
	image: preFileType + pathSource + p2stim4 + fileType + postFileType,
	data: {
		exp_id: 'gm_paradigm',
		stimulus: p2stim4,
		correct_response: practiceStop_responses[1],
		condition: conditions[4]
	}
}]

firstPhaseStimsComplete = jsPsych.randomization.repeat(firstPhaseStims, learningNumTrials / 8, true); //learningNumTrials =24, so does practiceStopNumTrials
secondPhaseStimsComplete = jsPsych.randomization.repeat(secondPhaseStims, 19, true);
var practice_stop_trials = jsPsych.randomization.repeat(['stop','stop','stop','stop','go','go','go','go','go','go','go','go'], 7,false)

var exp_len = 75
var stop_percent = (1 / 3)
var stim_colors = [0, 1, 2, 3, 8]
var stims = []
var stim = {}
var num_stims = exp_len / stim_colors.length
for (var c = 0; c < stim_colors.length; c++) {
	var stop_trials = jsPsych.randomization.repeat(['stop', 'go', 'go'], num_stims / 3)
	var stop_colors = [4, 5, 6, 7, 9]
	for (var s = 0; s < num_stims; s++) {
		if (stop_trials[s] == 'stop') {
			stim = {
				'color': stim_colors[c],
				'trial': stop_trials[s],
				'stop_color': stop_colors.pop()
			}
		} else {
			stim = {
				'color': stim_colors[c],
				'trial': stop_trials[s],
				'stop_color': 'NA'
			}
		}
		stims.push(stim)
	}
}

a = jsPsych.randomization.repeat(stims, 1, true) //a is a 300x3 matrix (300 = numStims, column 1= go colors, col2= stop trial type, and col3= stop color)
tempShape = jsPsych.randomization.repeat([1, 2, 3, 4], 18)
tempShape.push(Math.floor(Math.random() * 4 + 1))
tempShape.push(Math.floor(Math.random() * 4 + 1))
tempShape.push(Math.floor(Math.random() * 4 + 1))
goStimsArray = []
for (i = 0; i < 75; i++) {
	tempColor = a.color.pop()
	shape1 = tempShape.pop()
	if (shape1 == 1 || shape1 == 2) {
		if (tempColor === 0 || tempColor == 1 || tempColor == 2 || tempColor == 3) {
			goStim = {
				image: preFileType + pathSource + colors[tempColor] + '_' + shapes[shape1] + fileType +
					postFileType,
				data: {
					trial_id: "test-stop",
					exp_id: 'gm_paradigm',
					subject_ID: subjectID,
					stim: colors[tempColor] + '_' + shapes[shape1],
					correct_response: practiceStop_responses[0],
					condition: conditions[tempColor],
					go_color: colors[tempColor]
				}
			}
			goStimsArray.push(goStim)
		} else if (tempColor == 8) {
			goStim = {
				image: preFileType + pathSource + colors[tempColor] + '_' + shapes[shape1] + fileType +
					postFileType,
				data: {
					trial_id: "test-stop",
					exp_id: 'gm_paradigm',
					subject_ID: subjectID,
					stim: colors[tempColor] + '_' + shapes[shape1],
					correct_response: practiceStop_responses[0],
					condition: conditions[4],
					go_color: colors[tempColor]
				}
			}
			goStimsArray.push(goStim)

		}
	} else if (shape1 == 3 || shape1 == 4) {
		if (tempColor === 0 || tempColor == 1 || tempColor == 2 || tempColor == 3) {
			goStim = {
				image: preFileType + pathSource + colors[tempColor] + '_' + shapes[shape1] + fileType +
					postFileType,
				data: {
					trial_id: "test-stop",
					exp_id: 'gm_paradigm',
					subject_ID: subjectID,
					stim: colors[tempColor] + '_' + shapes[shape1],
					correct_response: practiceStop_responses[1],
					condition: conditions[tempColor],
					go_color: colors[tempColor]
				}
			}
			goStimsArray.push(goStim)
		} else if (tempColor == 8) {
			goStim = {
				image: preFileType + pathSource + colors[tempColor] + '_' + shapes[shape1] + fileType +
					postFileType,
				data: {
					trial_id: "test-stop",
					exp_id: 'gm_paradigm',
					subject_ID: subjectID,
					stim: colors[tempColor] + '_' + shapes[shape1],
					correct_response: practiceStop_responses[1],
					condition: conditions[4],
					go_color: colors[tempColor]
				}
			}
			goStimsArray.push(goStim)

		}
	}
}
stopStimsArray = []
for (i = 0; i < 75; i++) {
	temp = a.stop_color.pop()
	if (temp == 4 || temp == 5 || temp == 6 || temp == 7) {
		tempCond = temp - 4
		stopStim = {
			image: preFileType + pathSource + colors[temp] + '_stopSignal' + fileType + postFileType,
			data: {
				exp_id: 'gm_paradigm',
				subject_ID: subjectID,
				stop_stim: colors[temp] + '_stopSignal',
				correct_response: ["none", -1],
				stop_color_condition: conditions[tempCond]
			}
		}
		currData = stopStim.data
		stopStimsArray.push(stopStim)
	} else if (temp == 9) {
		stopStim = {
			image: preFileType + pathSource + colors[temp] + '_stopSignal' + fileType + postFileType,
			data: {
				exp_id: 'gm_paradigm',
				subject_ID: subjectID,
				stop_stim: colors[temp] + '_stopSignal',
				correct_response: ["none", -1],
				stop_color_condition: conditions[4]
			}
		}
		currData = stopStim.data
		stopStimsArray.push(stopStim)
	} else if (temp == "NA") {
		stopStim = {
			image: preFileType + pathSource + colors[temp] + '_stopSignal' + fileType + postFileType,
			data: {
				exp_id: 'gm_paradigm',
				subject_ID: subjectID,
				stop_stim: "",
				correct_response: "",
				stop_color_condition: ""
			}
		}
		currData = stopStim.data
		stopStimsArray.push(stopStim)
	}
}



practiceLearningStims1 = {
	image: preFileType + pathSource + stim1 + fileType + postFileType,
	data: {
		exp_id: 'gm_paradigm',
		stimulus: stim1,
		correct_response: correct_responses[3],
		condition: conditions[0]
	}
}
practiceLearningStims2 = {
	image: preFileType + pathSource + stim2 + fileType + postFileType,
	data: {
		exp_id: 'gm_paradigm',
		stimulus: stim2,
		correct_response: correct_responses[3],
		condition: conditions[1]
	}
}
practiceLearningStims3 = {
	image: preFileType + pathSource + stim3 + fileType + postFileType,
	data: {
		exp_id: 'gm_paradigm',
		stimulus: stim3,
		correct_response: correct_responses[2],
		condition: conditions[2]
	}
}
practiceLearningStims4 = {
	image: preFileType + pathSource + stim4 + fileType + postFileType,
	data: {
		exp_id: 'gm_paradigm',
		stimulus: stim4,
		correct_response: correct_responses[2],
		condition: conditions[3]
	}
}
practiceLearningStims5 = {
	image: preFileType + pathSource + stim5 + fileType + postFileType,
	data: {
		exp_id: 'gm_paradigm',
		stimulus: stim5,
		correct_response: correct_responses[3],
		condition: conditions[0]
	}
}
practiceLearningStims6 = {
	image: preFileType + pathSource + stim6 + fileType + postFileType,
	data: {
		exp_id: 'gm_paradigm',
		stimulus: stim6,
		correct_response: correct_responses[3],
		condition: conditions[1]
	}
}
practiceLearningStims7 = {
	image: preFileType + pathSource + stim7 + fileType + postFileType,
	data: {
		exp_id: 'gm_paradigm',
		stimulus: stim7,
		correct_response: correct_responses[2],
		condition: conditions[2]
	}
}
practiceLearningStims8 = {
	image: preFileType + pathSource + stim8 + fileType + postFileType,
	data: {
		exp_id: 'gm_paradigm',
		stimulus: stim8,
		correct_response: correct_responses[2],
		condition: conditions[3]
	}
}



tempCombo = []
for (i = 1; i < 10; i++) {
	for (x = i + 1; x < 11; x++) {
		tempCombo.push([i, x])
	}
}
tempCombo = jsPsych.randomization.repeat(tempCombo, 1)

tempCombo2 = []
for (i = 0; i < tempCombo.length; i++) {
	firstNum = tempCombo[i][0]
	secondNum = tempCombo[i][1]
	tempCombo2.push([secondNum, firstNum])
}
tempCombo2 = jsPsych.randomization.repeat(tempCombo2, 1)


ChoiceCombos1 = []
ChoiceCombos2 = []
combos1Data = []
combos2Data = []
combos1SStype = []
combos2SStype = []

for (i = 0; i < 45; i++) {
	uniqueCombo = tempCombo.pop()
	whichColor = uniqueCombo[0] - 1
	whichColor2 = uniqueCombo[1] - 1
	ChoiceCombos1.push([colors[whichColor] + '_square', colors[whichColor2] + '_square'])

	colorNum = whichColor
	colorNum2 = whichColor2
	if (colorNum < 4) {
		tempCond = conditions[colorNum]
		tempSStype = "go"
	} else if (colorNum == 4 || colorNum == 5 || colorNum == 6 || colorNum == 7) {
		tempColorNum = colorNum - 4
		tempCond = conditions[tempColorNum]
		tempSStype = "stop"
	} else if (colorNum == 8) {
		tempCond = conditions[4]
		tempSStype = "go"
	} else if (colorNum == 9) {
		tempSStype = "stop"
		tempCond = conditions[4]
	}


	if (colorNum2 < 4) {
		tempCond2 = conditions[colorNum2]
		tempSStype2 = "go"
	} else if (colorNum2 == 4 || colorNum2 == 5 || colorNum2 == 6 || colorNum2 == 7) {
		tempColorNum2 = colorNum2 - 4
		tempCond2 = conditions[tempColorNum2]
		tempSStype2 = "stop"
	} else if (colorNum2 == 8) {
		tempCond2 = conditions[4]
		tempSStype2 = "go"
	} else if (colorNum2 == 9) {
		tempCond2 = conditions[4]
		tempSStype2 = "stop"

	}

	combos1Data.push([tempCond, tempCond2])
	combos1SStype.push([tempSStype, tempSStype2])
		///

	uniqueCombo2 = tempCombo2.pop()
	whichColor_1 = uniqueCombo2[0] - 1
	whichColor2_1 = uniqueCombo2[1] - 1
	ChoiceCombos2.push([colors[whichColor_1] + '_square', colors[whichColor2_1] + '_square'])

	colorNum_1 = whichColor_1
	colorNum_2 = whichColor2_1
	if (colorNum_1 < 4) {
		tempCond = conditions[colorNum_1]
		tempSStype = "go"
	} else if (colorNum_1 == 4 || colorNum_1 == 5 || colorNum_1 == 6 || colorNum_1 == 7) {
		tempColorNum = colorNum_1 - 4
		tempCond = conditions[tempColorNum]
		tempSStype = "stop"
	} else if (colorNum_1 == 8) {
		tempSStype = "go"
		tempCond = conditions[4]
	} else if (colorNum_1 == 9) {
		tempSStype = "stop"
		tempCond = conditions[4]
	}


	if (colorNum_2 < 4) {
		tempCond2 = conditions[colorNum_2]
		tempSStype2 = "go"
	} else if (colorNum_2 == 4 || colorNum_2 == 5 || colorNum_2 == 6 || colorNum_2 == 7) {
		tempColorNum2 = colorNum_2 - 4
		tempCond2 = conditions[tempColorNum2]
		tempSStype2 = "stop"
	} else if (colorNum_2 == 8) {
		tempCond2 = conditions[4]
		tempSStype2 = "go"
	} else if (colorNum_2 == 9) {
		tempCond2 = conditions[4]
		tempSStype2 = "stop"
	}
	combos2Data.push([tempCond, tempCond2])
	combos2SStype.push([tempSStype, tempSStype2])

}



/* ************************************ */
/* Set up jsPsych blocks */
/* ************************************ */

var welcome_block = {
	type: 'text',
	text: '<div class = centerbox><p class = center-block-text>Welcome to the GM task. Press <strong>enter</strong> to begin.</p></div>',
	cont_key: [13],
	timing_post_trial: 0,
};

var end_block = {
	type: 'text',
	text: '<div class = centerbox><p class = center-block-text>Finished with the experiment.</div>',
	cont_key: [13],
	timing_post_trial: 0,
};


var bonus_block = {
	type: 'text',
	text: getBonus,
	cont_key: [13],
	timing_post_trial: 0,
};


var testImagesBlock = {
	type: 'text',
	text: preFileType + pathSource + 'green_circle' + fileType + postFileType + preFileType +
		pathSource + 'minus_25' + fileType + postFileType +
		'<div class = fixation-gm_paradigm><span style="color:red">+</span></div>',
	cont_key: [13],
	timing_post_trial: 0,
};


var instructions_block = {
	type: 'poldrack-instructions',
	pages: [
		'<div class = centerbox><p class = center-block-text>This experiment is composed of 3 phases.</p></div>',
		'<div class =centerbox><p class = center-block-text>Your goal for the first phase is to try to maximize your earnings by choosing to press the space bar or not based upon the presentation of 8 different colored squares.  Each of the eight colors will be rewarded according to one of the following four reward schedules:</p><p class =block-text>' +
		'<ul list-text><li> 1) <strong> Press space bar to gain 25 cents:</strong> Press nothing to gain 0 cents. </li><li> 2) <strong> Press space bar to lose 0 cents: </strong>Press nothing to lose 25 cents.</li><li> 3)<strong> Press nothing to gain 25 cents: </strong>Press space bar to gain 0 cents. </li><li>4) <strong> Press nothing to lose 0 cents: </strong> Press space bar to lose 25 cents</li></ul></p>' +
		'<p class = block-text>We will go over each of these rules.</div>',
	],
	allow_keys: false,
	show_clickable_nav: true,
	timing_post_trial: 0,
};

var start_practice = {
	type: 'poldrack-single-stim',
	stimulus: getPracticePrompt,
	is_html: true,
	choices: [13],
	data: {
		exp_id: "gm_paradigm",
		"trial_id": "pre-learning"
	},
	timing_post_trial: 0,
	timing_stim: -1,
	timing_response: -1,
};



var start_test = {
	type: 'poldrack-single-stim',
	stimulus: '<div class = centerbox><p class = block-text>We will now start phase 1 of the experiment.  For these trials, the rules associated with each color are as follows: </p><p class = block-text>' +
		startTestPrompt +
		'</p><p class = block-text> Make sure that you remember these rules before you move on to the test.</p></div>',
	is_html: true,
	choices: [49],
	data: {
		exp_id: "gm_paradigm",
		"trial_id": "learning_intro (phase 1)"
	},
	timing_post_trial: 0,
	timing_stim: -1,
	timing_response: -1,
};

var stop_intro = {
	type: 'poldrack-single-stim',
	stimulus: '<div class = centerbox><p class = block-text>We will now start the practice for phase 2 of the experiment.<br><br>For these trials, you must press the <strong> Z key </strong> or the <strong> M key </strong> depending on the shape of the stimulus.  Make sure to respond as quickly and accurately as possible to the shape. <br><br> The responses for each shape are as follows: ' +
		zmprompt_text +
		'</p><p class = block-text>Remember these rules before you proceed, as they will not be presented during the trial.</p></div>',
	is_html: true,
	choices: [49],
	data: {
		exp_id: "gm_paradigm",
		"trial_id": "stop_intro (phase 2)"
	},
	timing_post_trial: 0,
	timing_stim: -1,
	timing_response: -1,
};

var stop_intro2 = {
	type: 'poldrack-single-stim',
	stimulus: '<div class = centerbox><p class = block-text>These trials will be similar to the trials you have just completed.  Again, please respond to the shape of the stimulus. <br><br> On a subset of trials, a star will appear around the shape, when this happens please try your best to stop your response and press nothing. Do not slow your responses to the shape to achieve this. <br><br>The responses for each shape are as follows: ' +
		zmprompt_text +
		'</p><p class =block-text>Remember these rules before you proceed, as they will not be presented during the trial.</p></div>',
	is_html: true,
	choices: [49],
	data: {
		exp_id: "gm_paradigm",
		"trial_id": "stop_intro (phase 2)"
	},
	timing_post_trial: 0,
	timing_stim: -1,
	timing_response: -1,
};


var main_stop_intro1 = {
	type: 'poldrack-single-stim',
	stimulus: '<div class = centerbox><p class = block-text>We will now start Phase 2 of the experiment.<br><br>These trials are similar to the trials that you have just completed.  Like last time, on a subset of trials a star will appear around the shape, when this happens please try your best to stop your response and press nothing. Do not slow your responses to the shape to achieve this.<br><br>The rules for each shape are as follows:  <br>' +
		zmprompt_text +
		'</p><p class = block-text>Remember these rules before you proceed.</p><p class = block-text>Press <strong> enter</strong> to begin.</p></div>',
	is_html: true,
	choices: [13],
	data: {
		exp_id: "gm_paradigm",
		"trial_id": "main_stop_intro (phase 3)"
	},
	timing_post_trial: 0,
	timing_stim: -1,
	timing_response: -1,
};



var forced_choice_intro = {
	type: 'poldrack-single-stim',
	stimulus: '<div class = centerbox><p class = block-text>We will now start phase 3 of the experiment.<br><br>In this part of the experiment, you will see two color patches presented on each trial, one on the left side of the screen and the other on the right. You will choose the color which you find more rewarding by pressing either the left or right arrow key to correspond with the left or right color patch, respectively.</p></div>',
	is_html: true,
	choices: [49],
	data: {
		exp_id: "gm_paradigm",
		"trial_id": "forced_choice_intro"
	},
	timing_post_trial: 0,
	timing_stim: -1,
	timing_response: -1,
};

var forced_choice_intro_break = {
	type: 'poldrack-single-stim',
	stimulus: '<div class = centerbox><p class = block-text>We will now take a short break.  <br><br>Press <strong>enter</strong> to continue.</p></div>',
	is_html: true,
	choices: [13],
	data: {
		exp_id: "gm_paradigm",
		"trial_id": "forced_choice_intro"
	},
	timing_post_trial: 0,
	timing_stim: -1,
	timing_response: -1,
};


var forced_choice_block = {
	type: 'poldrack-single-stim',
	stimulus: getCombo,
	is_html: true,
	choices: [37, 39],
	data: {
		exp_id: "gm_paradigm",
		"trial_id": "forced_choice"
	},
	timing_post_trial: 0,
	timing_stim: 3000,
	timing_response: 3000,
	response_ends_trial: false,
	on_finish: appendForcedChoiceData,
};

var forced_choice_block2 = {
	type: 'poldrack-single-stim',
	stimulus: getCombo2,
	is_html: true,
	choices: [37, 39],
	data: {
		exp_id: "gm_paradigm",
		"trial_id": "forced_choice"
	},
	timing_post_trial: 0,
	timing_stim: 3000,
	timing_response: 3000,
	response_ends_trial: false,
	on_finish: appendForcedChoiceData,
};


var fixationBlock = {
	type: 'poldrack-single-stim',
	stimulus: '<div class = centerbox><div class = fixation-gm_paradigm><span style="color:red">+</span></div></div>',
	is_html: true,
	choices: 'none',
	data: {
		exp_id: "gm_paradigm",
		"trial_id": "fixation"
	},
	timing_post_trial: 0,
	timing_stim: 500,
	timing_response: 500,
};

var fixationBlock2 = {
  type: 'poldrack-single-stim',
  stimulus: '<div class = centerbox><div class = fixation-gmParadigm><span style="color:red">+</span></div></div>',
  is_html: true,
  choices: 'none',
  data: {exp_id: "gm_paradigm", "trial_id": "fixation"},
  timing_post_trial: 0,
  timing_stim: 500,
  timing_response: 500,
};

var rewardBlock = {
	type: 'poldrack-single-stim',
	stimulus: getReward,
	is_html: true,
	choices: 'none',
	data: {
		exp_id: "gm_paradigm",
		"trial_id": "reward"
	},
	timing_post_trial: 0,
	timing_stim: 1500,
	timing_response: 1500,
	on_finish: appendRewardData,

};

var rewardBlock2 = {
	type: 'poldrack-single-stim',
	stimulus: getReward,
	is_html: true,
	choices: 'none',
	data: {
		exp_id: "gm_paradigm",
		"trial_id": "reward"
	},
	timing_post_trial: 0,
	timing_stim: 1500,
	timing_response: 1500,
	on_finish: appendRewardData2,

};

var practice_feedback_text =
	'We will now start with a practice session. In this practice  concentrate on responding quickly and accurately to each stimuli. Press <strong>enter</strong> to continue.'
var practice_feedback_block = {
	type: 'text',
	cont_key: [13],
	text: getPracticeFeedback,
	timing_post_trial: 0,

};

var practice_feedback_text2 =
	'We will now start with a practice session. In this practice  concentrate on responding quickly and accurately to each stimuli. Press <strong>enter</strong> to continue.'
var practice_feedback_block2 = {
	type: 'text',
	cont_key: [13],
	text: getPracticeFeedback2,
	timing_post_trial: 0,

};


var learning_feedback_text = 'We will now start a round. Press <strong>enter</strong> to continue.'
var learning_feedback_block = {
	type: 'text',
	cont_key: [13],
	text: getLearningFeedback,
	timing_post_trial: 0,

};

var stop_feedback_text = 'We will now start a round. Press <strong>enter</strong> to continue.'
var stop_feedback_block = {
	type: 'text',
	cont_key: [13],
	text: getStopFeedback,
	timing_post_trial: 0,

};

var prompt_block = {
	type: 'poldrack-single-stim',
	stimulus: prompt_text,
	choices: 'none',
	data: {
		exp_id: "gm_paradigm",
		"trial_id": "prompt"
	},
	is_html: true,
	timing_post_trial: 0,
	timing_stim: RT_thresh,
	timing_response: RT_thresh,
	response_ends_trial: false,
}



var reset_SSD = {
	type: 'call-function',
	func: resetSSD,
	timing_post_trial: 0
}

var reset_Trial = {
	type: 'call-function',
	func: resetTrial,
	timing_post_trial: 0
}


var pre_practice_learning_block = {
	type: 'poldrack-single-stim',
	stimulus: getPracticeLearning,
	is_html: true,
	choices: [13],
	data: {
		exp_id: "gm_paradigm",
		"trial_id": "Learning Phase Instructions"
	},
	timing_post_trial: 0,
	timing_stim: -1,
	timing_response: -1,
};



/* ************************************ */
/* Set up experiment */
/* ************************************ */


/******************** PRACTICE PHASE ************************/

/////// Practice for learning/////////////
subjectTrialsStim1 = []
for (i = 0; i < 1; i++) {
	subjectTrialsStim1.push(fixationBlock)
	var subjectPracticeTrials1 = {
		type: 'poldrack-single-stim',
		stimulus: getPracticeLearningStim,
		is_html: true,
		data: {
			exp_id: "gm_paradigm",
			"trial_id": "practice-learning"
		},
		choices: [32],
		timing_stim: 1500,
		timing_response: 1500,
		timing_post_trial: 0,
		on_finish: appendData2,
		response_ends_trial: false,
	}
	subjectTrialsStim1.push(subjectPracticeTrials1)
	subjectTrialsStim1.push(rewardBlock2)

}

var learning_node1 = {
	timeline: subjectTrialsStim1,
	loop_function: function(data) {
		if (data[1].key_press == 32 || data[1].key_press == -1) {
			whichKey1 = data[1].key_press
			return false
		} else {
			return true
		}
	}
}

var learning_node1_2 = {
	timeline: subjectTrialsStim1,
	loop_function: function(data) {
		if (data[1].key_press != whichKey1) {
			currTrial = 0
			practiceCount3 = practiceCount3 + 1
			return false
		} else {
			return true
		}
	}
}

/******************** gm_paradigm learning phase  ************************/
practiceTrials = []
practiceTrials.push(learning_feedback_block)
for (h = 0; h < 24; h++) {
	practiceTrials.push(fixationBlock)
	var practiceBlock = {
		type: 'poldrack-single-stim',
		stimulus: getStim,
		is_html: true,
		data: {
			exp_id: "gm_paradigm",
			"trial_id": "test-learning"
		},
		choices: [32],
		timing_stim: 1500,
		timing_response: 1500,
		timing_post_trial: 0,
		on_finish: appendData,
		response_ends_trial: false,

	}
	practiceTrials.push(practiceBlock);
	practiceTrials.push(rewardBlock);
}

var learning_node = {
	timeline: practiceTrials,
	loop_function: function(data) {
		numLearningBlocks = numLearningBlocks + 1
		var totalTrials = 0
		var totalCorrect = 0
		for (learning = 0; learning < data.length; learning++) {
			if (data[learning].condition !== undefined) {
				totalTrials = totalTrials + 1
				if (data[learning].key_press == data[learning].correct_response) {
					totalCorrect = totalCorrect + 1
				}
			}
		}
		learning_acc = totalCorrect / totalTrials
		learning_feedback_text = 'Your accuracy is: ' + (totalCorrect / totalTrials) * 100 + '%'
		if (numLearningBlocks == 1) {
			currTrial = 0
			firstPhaseStimsComplete = jsPsych.randomization.repeat(firstPhaseStims, learningNumTrials / 8,
				true);
			learning_feedback_text +=
				'</p><p class = block-text><strong>Please get the experimenter</strong>'
			if (learning_acc < accuracy_thresh) {
				learning_feedback_text +=
					'</p><p class = block-text>Remember the rules associated with each color are as follows: <br>' +
					startTestPrompt + '<br> .'
			}
			return true
		} else if (numLearningBlocks == 2) {
			if (learning_acc < accuracy_thresh) {
				learning_feedback_text +=
					'</p><p class = block-text>Remember the rules associated with each color are as follows: <br>' +
					startTestPrompt + '<br> .'
			}
			firstPhaseStimsComplete = jsPsych.randomization.repeat(firstPhaseStims, learningNumTrials / 8,
				true);
			currTrial = 0
			return true
		} else if (numLearningBlocks == numLearningBlocksTotal) {
			learning_feedback_text =
				'</p><p class = block-text> Done with Phase 1. </p><p class = block-text> Press <strong>enter</strong> to continue.'
			return false
		}
	}
}


/******************** Practice block with SS, and neutral colors ************************/

var practiceStopTrials = []
practiceStopTrials.push(practice_feedback_block)
for (i = 0; i < 12; i++) {
	practiceStopTrials.push(fixationBlock)
	var practiceStop = {
		type: 'poldrack-single-stim',
		stimulus: getPracticeStopStim,
		is_html: true,
		data: {
			exp_id: "gm_paradigm",
			"trial_id": "practice-stop"
		},
		choices: [77, 90],
		timing_stim: 850,
		timing_response: 1850,
		on_finish: appendPracticeGoData,
		timing_post_trial: 0,
		response_ends_trial: false,

	}
	practiceStopTrials.push(practiceStop)
}
practiceStopCount = 0
var practiceStopnode = {
	timeline: practiceStopTrials,
	loop_function: function(data) {
		practiceStopCount = practiceStopCount + 1
		var sum_rt = 0
		var sumGo_correct = 0
		var totGo_trials = 0
		var num_responses = 0
		for (var i = 0; i < data.length; i++) {
			if (data[i].condition == "neutral") {
				totGo_trials += 1
				if (data[i].key_press != -1) {
					sum_rt += data[i].rt
					num_responses += 1
					if (data[i].key_press == data[i].correct_response[1]) {
						sumGo_correct += 1
					}
				}
			}
		}
		var average_rt = sum_rt / num_responses;
		var averageGo_correct = sumGo_correct / totGo_trials;


		practice_feedback_text = "Average reaction time:  " + Math.round(average_rt) +
			" ms. Accuracy: " + Math.round(averageGo_correct * 100) + "%"

		if (sumGo_correct > 9) {
			practice_feedback_text += '</p><p class = block-text>Done with this practice.'
			return false;
		} else if (sumGo_correct < 10) {
			practiceShapeArray = jsPsych.randomization.repeat([1, 2, 3, 4], 3)
			if (average_rt > RT_thresh) {
				practice_feedback_text +=
					'</p><p class = block-text><strong>Please get the experimenter</strong> (' + sumGo_correct +
					',' + Math.round(average_rt) + ')'
			}
			if (averageGo_correct < accuracy_thresh) {
				practice_feedback_text +=
					'</p><p class = block-text>Remember, the correct responses for each shape are as follows: <br><br>' +
					zmprompt_text
			}
			return false;
		}
	}
}



var phase2_trials = []
phase2_trials.push(practice_feedback_block2)

for (i = 0; i < 12; i++) {
	phase2_trials.push(fixationBlock)
		//var stim_data = $.extend({},secondPhaseStimsComplete.data[i])
	var stop_signal_block = {
		type: 'stop-signal',
		stimulus: getSSPracticeStim,
		SS_stimulus: stop_signal,
		SS_trial_type: getSSPractice_trial_type,
		data: getSSPracticeData,
		is_html: true,
		choices: [77, 90],
		timing_stim: 850,
		timing_response: 1850,
		response_ends_trial: false,
		SSD: SSD,
		timing_SS: 500,
		timing_post_trial: 0,
		on_finish: appendPracticeStopData,
	}
	phase2_trials.push(stop_signal_block)
}


practiceStopCount2 = 0

/* Practice node continues repeating until the subject reaches certain criteria */
var practice_node = {
	timeline: phase2_trials,
	/* This function defines stopping criteria */
	loop_function: function(data) {
		var sum_rt = 0;
		var sumGo_correct = 0;
		var go_length = 0;
		var num_responses = 0;
		var sumStop_correct = 0;
		var stop_length = 0
		for (i = 0; i < data.length; i++) {
			if (data[i].SS_trial_type == "go") {
				go_length += 1
				if (data[i].rt != -1) {
					num_responses += 1
					sum_rt += data[i].rt;
					if (data[i].key_press == data[i].correct_response[1]) {
						sumGo_correct += 1
					}
				}
			} else if (data[i].SS_trial_type == "stop") {
				stop_length += 1
				if (data[i].rt == -1) {
					sumStop_correct += 1
				}
			}
		}
		var average_rt = sum_rt / num_responses;
		var averageGo_correct = sumGo_correct / go_length;
		var missed_responses = (go_length - num_responses) / go_length
		var averageStop_correct = sumStop_correct / stop_length


		practice_feedback_text2 = "Average reaction time:  " + Math.round(average_rt) +
			" ms. Accuracy: " + Math.round(averageGo_correct * 100) + "%"
		practiceStopCount2 = practiceStopCount2 + 1
		if (practiceStopCount2 == 1) {
			if (average_rt > RT_thresh || missed_responses >= missed_response_thresh ||
				averageStop_correct < 0.36 || averageStop_correct > 0.64) {
				practice_feedback_text2 +=
					'</p><p class = block-text><strong>Please get the experimenter</strong> (' + sumGo_correct +
					',' + Math.round(average_rt) + ',' + sumStop_correct + ')'
			}
			if (averageGo_correct < accuracy_thresh) {
				practice_feedback_text2 +=
					'</p><p class = block-text>Remember, the correct responses for each shape are as follows: <br><br>' +
					zmprompt_text
			}
			practice_feedback_text2 += '</p><p class = block-text>Done with this practice.'
			return false;
		}
	}
}



/********************* block with SS, and ALL colors *********************/
var phase3_trials = []
phase3_trials.push(stop_feedback_block)
for (i = 0; i < 75; i++) {
	phase3_trials.push(fixationBlock)
	var stim_data = $.extend({},practice_trial_data)
    var stop_signal_block2 = {
	  type: 'stop-signal',
	  stimulus: getSSPracticeStim3,
	  SS_stimulus: getStopSignal,
	  SS_trial_type: getSSPractice_trial_type3,
	  data: getSSPracticeData3,
	  is_html: true,
	  choices: [77,90],
	  timing_stim: 850,
	  timing_response: 1850,
	  response_ends_trial: false,
	  SSD: getSSD,
	  timing_SS: 500,
	  timing_post_trial: 0,  
	  on_finish: updateSSDandData,
    }
	phase3_trials.push(stop_signal_block2)
} 



/* Test node continues through 6 blocks */
var test_node = {
	timeline: phase3_trials,
	/* This function defines stopping criteria */
	loop_function: function(data) {
		var exp_len = 75
		var stop_percent = (1 / 3)
		var stim_colors = [0, 1, 2, 3, 8]
		var stims = []
		var stim = {}
		var num_stims = exp_len / stim_colors.length
		for (var c = 0; c < stim_colors.length; c++) {
			var stop_trials = jsPsych.randomization.repeat(['stop', 'go', 'go'], num_stims / 3)
			var stop_colors = [4, 5, 6, 7, 9]
			for (var s = 0; s < num_stims; s++) {
				if (stop_trials[s] == 'stop') {
					stim = {
						'color': stim_colors[c],
						'trial': stop_trials[s],
						'stop_color': stop_colors.pop()
					}
				} else {
					stim = {
						'color': stim_colors[c],
						'trial': stop_trials[s],
						'stop_color': 'NA'
					}
				}
				stims.push(stim)
			}
		}

		a = jsPsych.randomization.repeat(stims, 1, true) //a is a 300x3 matrix (300 = numStims, column 1= go colors, col2= stop trial type, and col3= stop color)
		tempShape = jsPsych.randomization.repeat([1, 2, 3, 4], 18)
		tempShape.push(Math.floor(Math.random() * 4 + 1))
		tempShape.push(Math.floor(Math.random() * 4 + 1))
		tempShape.push(Math.floor(Math.random() * 4 + 1))
		goStimsArray = []
		for (i = 0; i < 75; i++) {
			tempColor = a.color.pop()
			shape1 = tempShape.pop()
			if (shape1 == 1 || shape1 == 2) {
				if (tempColor === 0 || tempColor == 1 || tempColor == 2 || tempColor == 3) {
					goStim = {
						image: preFileType + pathSource + colors[tempColor] + '_' + shapes[shape1] + fileType +
							postFileType,
						data: {
							trial_id: "test-stop",
							exp_id: 'gm_paradigm',
							subject_ID: subjectID,
							stim: colors[tempColor] + '_' + shapes[shape1],
							correct_response: practiceStop_responses[0],
							condition: conditions[tempColor],
							go_color: colors[tempColor]
						}
					}
					goStimsArray.push(goStim)
				} else if (tempColor == 8) {
					goStim = {
						image: preFileType + pathSource + colors[tempColor] + '_' + shapes[shape1] + fileType +
							postFileType,
						data: {
							trial_id: "test-stop",
							exp_id: 'gm_paradigm',
							subject_ID: subjectID,
							stim: colors[tempColor] + '_' + shapes[shape1],
							correct_response: practiceStop_responses[0],
							condition: conditions[4],
							go_color: colors[tempColor]
						}
					}
					goStimsArray.push(goStim)
				}
			} else if (shape1 == 3 || shape1 == 4) {
				if (tempColor === 0 || tempColor == 1 || tempColor == 2 || tempColor == 3) {
					goStim = {
						image: preFileType + pathSource + colors[tempColor] + '_' + shapes[shape1] + fileType +
							postFileType,
						data: {
							trial_id: "test-stop",
							exp_id: 'gm_paradigm',
							subject_ID: subjectID,
							stim: colors[tempColor] + '_' + shapes[shape1],
							correct_response: practiceStop_responses[1],
							condition: conditions[tempColor],
							go_color: colors[tempColor]
						}
					}
					goStimsArray.push(goStim)
				} else if (tempColor == 8) {
					goStim = {
						image: preFileType + pathSource + colors[tempColor] + '_' + shapes[shape1] + fileType +
							postFileType,
						data: {
							trial_id: "test-stop",
							exp_id: 'gm_paradigm',
							subject_ID: subjectID,
							stim: colors[tempColor] + '_' + shapes[shape1],
							correct_response: practiceStop_responses[1],
							condition: conditions[4],
							go_color: colors[tempColor]
						}
					}
					goStimsArray.push(goStim)

				}
			}
		}
		stopStimsArray = []
		for (i = 0; i < 75; i++) {
			temp = a.stop_color.pop()
			if (temp == 4 || temp == 5 || temp == 6 || temp == 7) {
				tempCond = temp - 4
				stopStim = {
					image: preFileType + pathSource + colors[temp] + '_stopSignal' + fileType + postFileType,
					data: {
						exp_id: 'gm_paradigm',
						subject_ID: subjectID,
						stop_stim: colors[temp] + '_stopSignal',
						correct_response: ["none", -1],
						stop_color_condition: conditions[tempCond]
					}
				}
				currData = stopStim.data
				stopStimsArray.push(stopStim)
			} else if (temp == 9) {
				stopStim = {
					image: preFileType + pathSource + colors[temp] + '_stopSignal' + fileType + postFileType,
					data: {
						exp_id: 'gm_paradigm',
						subject_ID: subjectID,
						stop_stim: colors[temp] + '_stopSignal',
						correct_response: ["none", -1],
						stop_color_condition: conditions[4]
					}
				}
				currData = stopStim.data
				stopStimsArray.push(stopStim)
			} else if (temp == "NA") {
				stopStim = {
					image: preFileType + pathSource + colors[temp] + '_stopSignal' + fileType + postFileType,
					data: {
						exp_id: 'gm_paradigm',
						subject_ID: subjectID,
						stop_stim: "",
						correct_response: "",
						stop_color_condition: ""
					}
				}
				currData = stopStim.data
				stopStimsArray.push(stopStim)
			}
		}

		var sum_rt = 0;
		var sumGo_correct = 0;
		var go_length = 0;
		var num_responses = 0;
		var sumStop_correct = 0;
		var stop_length = 0
		for (i = 0; i < data.length; i++) {
			if (data[i].SS_trial_type == "go") {
				go_length += 1
				if (data[i].rt != -1) {
					num_responses += 1
					sum_rt += data[i].rt;
					if (data[i].key_press == data[i].correct_response[1]) {
						sumGo_correct += 1
					}
				}
			} else if (data[i].SS_trial_type == "stop") {
				stop_length += 1
				if (data[i].rt == -1) {
					sumStop_correct += 1
				}
			}
		}
		var average_rt = sum_rt / num_responses;
		var averageGo_correct = sumGo_correct / go_length;
		var missed_responses = (go_length - num_responses) / go_length
		var averageStop_correct = sumStop_correct / stop_length

		stop_feedback_text = "Average reaction time:  " + Math.round(average_rt) + " ms. Accuracy: " +
			Math.round(averageGo_correct * 100) + "%"
		stopCount = stopCount + 1

		if (stopCount == 6) {
			stop_feedback_text += '</p><p class = block-text>Done with this phase.'
			return false

		} else if (stopCount == 1) {
			stop_feedback_text +=
				'</p><p class = block-text><strong>Please Get the Experimenter.</strong> (' + sumGo_correct +
				',' + Math.round(average_rt) + ',' + sumStop_correct + ')'
			if (averageGo_correct < accuracy_thresh) {
				stop_feedback_text +=
					'</p><p class = block-text>Remember, the correct responses for each shape are as follows: <br><br>' +
					zmprompt_text
			}
			currTrial = 0
			return true;
		} else if (stopCount == 2) {
			stop_feedback_text +=
				'</p><p class = block-text><strong>Please Get the Experimenter.</strong> (' + sumGo_correct +
				',' + Math.round(average_rt) + ',' + sumStop_correct + ')'
			if (averageGo_correct < accuracy_thresh) {
				stop_feedback_text +=
					'</p><p class = block-text>Remember, the correct responses for each shape are as follows: <br><br>' +
					zmprompt_text
			}
			currTrial = 0
			return true;
		} else if (stopCount > 2 && stopCount < 6) {
			if (average_rt > RT_thresh || missed_responses >= missed_response_thresh ||
				averageStop_correct < 0.36 || averageStop_correct > 0.64) {
				stop_feedback_text +=
					'</p><p class = block-text><strong>Please get the experimenter</strong> (' + sumGo_correct +
					',' + Math.round(average_rt) + ',' + sumStop_correct + ')'
			}
			if (averageGo_correct < accuracy_thresh) {
				stop_feedback_text +=
					'</p><p class = block-text>Remember, the correct responses for each shape are as follows: <br><br>' +
					zmprompt_text
			}
			return false;
		}
	}
}



var gm_paradigm_experiment = []

///welcome and instructions
gm_paradigm_experiment.push(welcome_block)
gm_paradigm_experiment.push(instructions_block)
//practice learning associations (pre-phase 1)
for(i=0;i<8;i++){
gm_paradigm_experiment.push(pre_practice_learning_block)
gm_paradigm_experiment.push(start_practice)
gm_paradigm_experiment.push(learning_node1)
gm_paradigm_experiment.push(learning_node1_2)
}

//learning phase (phase 1)
gm_paradigm_experiment.push(start_test)
gm_paradigm_experiment.push(learning_node)
gm_paradigm_experiment.push(reset_Trial)
gm_paradigm_experiment.push(learning_feedback_block)
gm_paradigm_experiment.push(bonus_block)

//practice stop first session (pre-phase 2)
gm_paradigm_experiment.push(stop_intro)
gm_paradigm_experiment.push(practiceStopnode)
gm_paradigm_experiment.push(practice_feedback_block);
gm_paradigm_experiment.push(reset_Trial)

//practice stop second session (pre-phase 2)
gm_paradigm_experiment.push(stop_intro2)
gm_paradigm_experiment.push(practice_node)
gm_paradigm_experiment.push(practice_feedback_block2);
gm_paradigm_experiment.push(reset_SSD)
gm_paradigm_experiment.push(reset_Trial)

//stopping phase (phase 2)
gm_paradigm_experiment.push(main_stop_intro1)
gm_paradigm_experiment.push(test_node)
gm_paradigm_experiment.push(stop_feedback_block);


//forced choice phase (phase 3)
gm_paradigm_experiment.push(forced_choice_intro)
for(forcedChoice=0;forcedChoice<45;forcedChoice++){
gm_paradigm_experiment.push(fixationBlock2)
gm_paradigm_experiment.push(forced_choice_block)
} 
gm_paradigm_experiment.push(reset_Trial)

gm_paradigm_experiment.push(forced_choice_intro_break)
for(forcedChoice=0;forcedChoice<45;forcedChoice++){
gm_paradigm_experiment.push(fixationBlock2)
gm_paradigm_experiment.push(forced_choice_block2)
}
gm_paradigm_experiment.push(bonus_block)
gm_paradigm_experiment.push(end_block)
