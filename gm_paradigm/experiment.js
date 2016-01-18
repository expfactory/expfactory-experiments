/* ************************************ */
/* Define helper functions */
/* ************************************ */
//

var getStim1 = function(){
	temp = practiceLearningStims1
	image=temp.image
	currData=temp.data
	return image + startTestPrompt0 
}

var getStim2 = function(){
	temp = practiceLearningStims2
	image=temp.image
	currData=temp.data
	return image + startTestPrompt1 
}

var getStim3 = function(){
	temp = practiceLearningStims3
	image=temp.image
	currData=temp.data
	return image + startTestPrompt2 
}

var getStim4 = function(){
	temp = practiceLearningStims4
	image=temp.image
	currData=temp.data
	return image + startTestPrompt3 
}

var getStim5 = function(){
	temp = practiceLearningStims5
	image=temp.image
	currData=temp.data
	return image + startTestPrompt4 
}

var getStim6 = function(){
	temp = practiceLearningStims6
	image=temp.image
	currData=temp.data
	return image + startTestPrompt5 
}

var getStim7 = function(){
	temp = practiceLearningStims7
	image=temp.image
	currData=temp.data
	return image + startTestPrompt6 
}

var getStim8 = function(){
	temp = practiceLearningStims8
	image=temp.image
	currData=temp.data
	return image + startTestPrompt7 
}

practiceCount = 0
var getPracticePrompt = function (){
	if(practiceCount == 0){
	temp = '<div class = centerbox><p class = block-text>We will now practice some trials for the <strong>'+ colors[practiceCount]+' square.</strong> These trials will be identical to the main Phase 1 task except the action and outcome will only be presented to you in these practice trials so you must commit them to memory before the main Phase 1 task. <br><br> Please try both pressing the spacebar and pressing nothing to see the different outcomes for each action.</p></div>',
	practiceCount=practiceCount+1
	return temp
	} else if (practiceCount ==1){
	temp = '<div class = centerbox><p class = block-text>We will now practice some trials for the <strong>'+ colors[practiceCount]+' square.</strong> These trials will be identical to the main Phase 1 task except the action and outcome will only be presented to you in these practice trials so you must commit them to memory before the main Phase 1 task. <br><br> Please try both pressing the spacebar and pressing nothing to see the different outcomes for each action.</p></div>',
	practiceCount= practiceCount+1
	return temp
	}else if (practiceCount ==2){
	temp = '<div class = centerbox><p class = block-text>We will now practice some trials for the <strong>'+ colors[practiceCount]+' square.</strong> These trials will be identical to the main Phase 1 task except the action and outcome will only be presented to you in these practice trials so you must commit them to memory before the main Phase 1 task. <br><br> Please try both pressing the spacebar and pressing nothing to see the different outcomes for each action.</p></div>',
	practiceCount= practiceCount+1
	return temp
	}else if (practiceCount ==3){
	temp = '<div class = centerbox><p class = block-text>We will now practice some trials for the <strong>'+ colors[practiceCount]+' square.</strong> These trials will be identical to the main Phase 1 task except the action and outcome will only be presented to you in these practice trials so you must commit them to memory before the main Phase 1 task. <br><br> Please try both pressing the spacebar and pressing nothing to see the different outcomes for each action.</p></div>',
	practiceCount= practiceCount+1
	return temp
	}else if (practiceCount ==4){
	temp = '<div class = centerbox><p class = block-text>We will now practice some trials for the <strong>'+ colors[practiceCount]+' square.</strong> These trials will be identical to the main Phase 1 task except the action and outcome will only be presented to you in these practice trials so you must commit them to memory before the main Phase 1 task. <br><br> Please try both pressing the spacebar and pressing nothing to see the different outcomes for each action.</p></div>',
	practiceCount= practiceCount+1
	return temp
	}else if (practiceCount ==5){
	temp = '<div class = centerbox><p class = block-text>We will now practice some trials for the <strong>'+ colors[practiceCount]+' square.</strong> These trials will be identical to the main Phase 1 task except the action and outcome will only be presented to you in these practice trials so you must commit them to memory before the main Phase 1 task. <br><br> Please try both pressing the spacebar and pressing nothing to see the different outcomes for each action.</p></div>',
	practiceCount= practiceCount+1
	return temp
	}else if (practiceCount ==6){
	temp = '<div class = centerbox><p class = block-text>We will now practice some trials for the <strong>'+ colors[practiceCount]+' square.</strong> These trials will be identical to the main Phase 1 task except the action and outcome will only be presented to you in these practice trials so you must commit them to memory before the main Phase 1 task. <br><br> Please try both pressing the spacebar and pressing nothing to see the different outcomes for each action.</p></div>',
	practiceCount= practiceCount+1
	return temp
	}else if (practiceCount ==7){
	temp = '<div class = centerbox><p class = block-text>We will now practice some trials for the <strong>'+ colors[practiceCount]+' square.</strong> These trials will be identical to the main Phase 1 task except the action and outcome will only be presented to you in these practice trials so you must commit them to memory before the main Phase 1 task. <br><br> Please try both pressing the spacebar and pressing nothing to see the different outcomes for each action.</p></div>',
	practiceCount = 0
	return temp
	}
}

//////////////////////////////////////////////////////////////////////////////////////////////////
//first phase functions

var getStim = function(){
	stim = firstPhaseStimsComplete.image.pop()
	curr_data = firstPhaseStimsComplete.data.pop()
	curr_answer = curr_data.correct_response[1]
	return stim
}

var appendData = function(){
	jsPsych.data.addDataToLastTrial({stim: curr_data.stimulus, condition: curr_data.condition, correct_response: curr_data.correct_response[1], current_trial: currTrial})
	currTrial=currTrial+1
}

var appendData2 = function(){
	jsPsych.data.addDataToLastTrial({stim: currData.stimulus, condition: currData.condition, correct_response: currData.correct_response[1], current_trial: currTrial})
	currTrial=currTrial+1
}


var getReward = function(){
	global_trial = jsPsych.progress().current_trial_global
	subjectResponse=jsPsych.data.getData()[global_trial-1].key_press
	correctResponse=jsPsych.data.getData()[global_trial-1].correct_response
	trialCondition=jsPsych.data.getData()[global_trial-1].condition
	
	if((correctResponse==subjectResponse) && (trialCondition == 'go_win')){
		reward = 'plus_25'
		return preFileType+pathSource+'plus_25'+fileType+postFileType
	}else if((correctResponse==subjectResponse) && (trialCondition == 'nogo_win')){
		reward ='plus_25'
		return preFileType+pathSource+'plus_25'+fileType+postFileType
	}else if((correctResponse==subjectResponse) && (trialCondition == 'go_avoid')){
		reward = 'minus_0'
		return preFileType+pathSource+'minus_0'+fileType+postFileType
	}else if((correctResponse==subjectResponse) && (trialCondition == 'nogo_avoid')){
		reward = 'minus_0'
		return preFileType+pathSource+'minus_0'+fileType+postFileType
	}
	if((correctResponse!=subjectResponse) && (trialCondition == 'go_win')){
		reward = 'plus_0'
		return preFileType+pathSource+'plus_0'+fileType+postFileType
	}else if((correctResponse!=subjectResponse) && (trialCondition == 'nogo_win')){
		reward = 'plus_0'
		return preFileType+pathSource+'plus_0'+fileType+postFileType
	}else if((correctResponse!=subjectResponse) && (trialCondition == 'go_avoid')){
		reward ='minus_five'
		return preFileType+pathSource+'minus_25'+fileType+postFileType
	}else if((correctResponse!=subjectResponse) && (trialCondition == 'nogo_avoid')){
		reward ='minus_five'
		return preFileType+pathSource+'minus_25'+fileType+postFileType
	}
}


var getReward2 = function(){
	global_trial = jsPsych.progress().current_trial_global
	subjectResponse=jsPsych.data.getData()[global_trial-1].key_press
	correctResponse=jsPsych.data.getData()[global_trial-1].correct_response
	trialCondition=jsPsych.data.getData()[global_trial-1].condition
	if((correctResponse[1]==subjectResponse) && (trialCondition == 'go_win')){
		reward='plus_five'
		return preFileType+pathSource+'plus_five'+fileType+postFileType+prompt_text
	}else if((correctResponse[1]==subjectResponse) && (trialCondition == 'nogo_win')){
		reward='plus_five'
		return preFileType+pathSource+'plus_five'+fileType+postFileType+prompt_text
	}else if((correctResponse[1]==subjectResponse) && (trialCondition == 'go_avoid')){
		reward = 'minus_zero'
		return preFileType+pathSource+'minus_zero'+fileType+postFileType+prompt_text
	}else if((correctResponse[1]==subjectResponse) && (trialCondition == 'nogo_avoid')){
		reward ='minus_zero'
		return preFileType+pathSource+'minus_zero'+fileType+postFileType+prompt_text
	}
	if((correctResponse[1]!=subjectResponse) && (trialCondition == 'go_win')){
		reward = 'plus_zero'
		return preFileType+pathSource+'plus_zero'+fileType+postFileType+prompt_text
	}else if((correctResponse[1]!=subjectResponse) && (trialCondition == 'nogo_win')){
		reward = 'plus_zero'
		return preFileType+pathSource+'plus_zero'+fileType+postFileType+prompt_text
	}else if((correctResponse[1]!=subjectResponse) && (trialCondition == 'go_avoid')){
		reward ='minus_five'
		return preFileType+pathSource+'minus_five'+fileType+postFileType+prompt_text
	}else if((correctResponse[1]!=subjectResponse) && (trialCondition == 'nogo_avoid')){
		reward = 'minus_five'
		return preFileType+pathSource+'minus_five'+fileType+postFileType+prompt_text
	}
}

var appendRewardData = function(){
	jsPsych.data.addDataToLastTrial({reward: reward})

}

var getLearningFeedback = function() {
	return '<div class = centerbox><p class = block-text>' + learning_feedback_text + '</p></div>'
}


var getStopFeedback = function() {
	return '<div class = centerbox><p class = block-text>' + stop_feedback_text + '</p></div>'
}

//////////////////////////////////////////////////////////////////////////////////////////////////
// second phase functions

var getPracticeFeedback = function() {
	return '<div class = centerbox><p class = block-text>' + practice_feedback_text + '</p></div>'
}

var getSSPracticeStim = function() {
	practice_trial_data = secondPhaseStimsComplete.data.pop()
	practice_trial_data["trial_id"] = "practice"
	return secondPhaseStimsComplete.image.pop()
}

var getSSPractice_trial_type = function() {
	return practice_stop_trials.pop()
}

var getSSPracticeData = function() {
	return practice_trial_data
}

var appendPracticeStopData = function(){
	jsPsych.data.addDataToLastTrial({stim: practice_trial_data.stimulus, condition: practice_trial_data.condition, stop_stim: stop_signal, stop_condition: "neutral", current_trial: currTrial})
	currTrial = currTrial+1

}

practiceShapeArray = jsPsych.randomization.repeat([1,2,3,4],3)
var getPracticeStopStim = function(){
	practiceShape=practiceShapeArray.pop()
	if(practiceShape == 1){
	goStim = {image: preFileType+pathSource+colors[8]+'_'+shapes[practiceShape] +fileType+postFileType, data: {exp_id: 'gmParadigm', stimulus: colors[8]+'_'+shapes[practiceShape], correct_response: practiceStop_responses[0], condition: conditions[4]}}
	currData= goStim.data
	practiceShape=practiceShape+1
	return goStim.image
	} else if(practiceShape == 2){
	goStim = {image: preFileType+pathSource+colors[8]+'_'+shapes[practiceShape] +fileType+postFileType, data: {exp_id: 'gmParadigm', stimulus: colors[8]+'_'+shapes[practiceShape], correct_response: practiceStop_responses[0], condition: conditions[4]}}
	currData= goStim.data
	practiceShape=practiceShape+1
	return goStim.image
	} else if(practiceShape == 3){
	goStim = {image: preFileType+pathSource+colors[8]+'_'+shapes[practiceShape] +fileType+postFileType, data: {exp_id: 'gmParadigm', stimulus: colors[8]+'_'+shapes[practiceShape], correct_response: practiceStop_responses[1], condition: conditions[4]}}
	currData= goStim.data
	practiceShape=practiceShape+1
	return goStim.image
	} else if(practiceShape == 4){
	goStim = {image: preFileType+pathSource+colors[8]+'_'+shapes[practiceShape] +fileType+postFileType, data: {exp_id: 'gmParadigm', stimulus: colors[8]+'_'+shapes[practiceShape], correct_response: practiceStop_responses[1], condition: conditions[4]}}
	currData= goStim.data
	practiceShape=1
	return goStim.image
	}
}

var appendPracticeGoData = function(){
	jsPsych.data.addDataToLastTrial({current_trial:currTrial, stim: goStim.image, condition: currData.condition, correct_response : currData.correct_response})
	currTrial = currTrial +1 
}

//////////////////////////////////////////////////////////////////////////////////////////////////
// third phase functions




var getSSPracticeStim3 = function() {
	tempColor = a.color.pop()
	shape1 = tempShape.pop()
	if(shape1==1 || shape1==2){
		if(tempColor ==0){
		goStim = {image: preFileType+pathSource+colors[tempColor]+'_'+shapes[shape1] +fileType+postFileType, data: {exp_id: 'gmParadigm', stim: colors[tempColor]+'_'+shapes[shape1], correct_response: practiceStop_responses[0], condition: conditions[0], go_color: colors[tempColor]}}
		} else if(tempColor==1){
		goStim = {image: preFileType+pathSource+colors[tempColor]+'_'+shapes[shape1] +fileType+postFileType, data: {exp_id: 'gmParadigm', stim: colors[tempColor]+'_'+shapes[shape1], correct_response: practiceStop_responses[0], condition: conditions[1], go_color: colors[tempColor]}}
		} else if(tempColor==2){
		goStim = {image: preFileType+pathSource+colors[tempColor]+'_'+shapes[shape1] +fileType+postFileType, data: {exp_id: 'gmParadigm', stim: colors[tempColor]+'_'+shapes[shape1], correct_response: practiceStop_responses[0], condition: conditions[2], go_color: colors[tempColor]}}
		} else if(tempColor==3){
		goStim = {image: preFileType+pathSource+colors[tempColor]+'_'+shapes[shape1] +fileType+postFileType, data: {exp_id: 'gmParadigm', stim: colors[tempColor]+'_'+shapes[shape1], correct_response: practiceStop_responses[0], condition: conditions[3], go_color: colors[tempColor]}}
		} else if(tempColor==8){
		goStim = {image: preFileType+pathSource+colors[tempColor]+'_'+shapes[shape1] +fileType+postFileType, data: {exp_id: 'gmParadigm', stim: colors[tempColor]+'_'+shapes[shape1], correct_response: practiceStop_responses[0], condition: conditions[4], go_color: colors[tempColor]}}
		}
	} else if (shape1==3||shape1==4){
		if(tempColor ==0){
		goStim = {image: preFileType+pathSource+colors[tempColor]+'_'+shapes[shape1] +fileType+postFileType, data: {exp_id: 'gmParadigm', stim: colors[tempColor]+'_'+shapes[shape1], correct_response: practiceStop_responses[1], condition: conditions[0], go_color: colors[tempColor]}}
		} else if(tempColor==1){
		goStim = {image: preFileType+pathSource+colors[tempColor]+'_'+shapes[shape1] +fileType+postFileType, data: {exp_id: 'gmParadigm', stim: colors[tempColor]+'_'+shapes[shape1], correct_response: practiceStop_responses[1], condition: conditions[1], go_color: colors[tempColor]}}
		} else if(tempColor==2){
		goStim = {image: preFileType+pathSource+colors[tempColor]+'_'+shapes[shape1] +fileType+postFileType, data: {exp_id: 'gmParadigm', stim: colors[tempColor]+'_'+shapes[shape1], correct_response: practiceStop_responses[1], condition: conditions[2], go_color: colors[tempColor]}}
		} else if(tempColor==3){
		goStim = {image: preFileType+pathSource+colors[tempColor]+'_'+shapes[shape1] +fileType+postFileType, data: {exp_id: 'gmParadigm', stim: colors[tempColor]+'_'+shapes[shape1], correct_response: practiceStop_responses[1], condition: conditions[3], go_color: colors[tempColor]}}
		} else if(tempColor==8){
		goStim = {image: preFileType+pathSource+colors[tempColor]+'_'+shapes[shape1] +fileType+postFileType, data: {exp_id: 'gmParadigm', stim: colors[tempColor]+'_'+shapes[shape1], correct_response: practiceStop_responses[1], condition: conditions[4], go_color: colors[tempColor]}}
		}
	}
	practice_trial_data = goStim.data
	practice_trial_data["trial_id"] = "test"
	return goStim.image
}


var getSSPracticeData3 = function() {
	return practice_trial_data
}

var getStopSignal = function(){
	temp=a.stop_color.pop()
	if(temp==4){
	stopStim= {image: preFileStopType+pathSource+ colors[temp]+'_stopSignal'+fileType+postFileType, data: {exp_id: 'gmParadigm', stop_stim: colors[temp]+'_stopSignal', correct_response: ["none", -1], stop_color_condition: conditions[0]}}
	currData= stopStim.data
	return stopStim.image
	} else if(temp==5){
	stopStim= {image: preFileStopType+pathSource+ colors[temp]+'_stopSignal'+fileType+postFileType, data: {exp_id: 'gmParadigm', stop_stim: colors[temp]+'_stopSignal', correct_response: ["none", -1], stop_color_condition: conditions[1]}}
	currData= stopStim.data
	return stopStim.image
	} else if(temp==6){
	stopStim= {image: preFileStopType+pathSource+ colors[temp]+'_stopSignal'+fileType+postFileType, data: {exp_id: 'gmParadigm', stop_stim: colors[temp]+'_stopSignal', correct_response: ["none", -1], stop_color_condition: conditions[2]}}
	currData= stopStim.data
	return stopStim.image
	} else if(temp==7){
	stopStim= {image: preFileStopType+pathSource+ colors[temp]+'_stopSignal'+fileType+postFileType, data: {exp_id: 'gmParadigm', stop_stim: colors[temp]+'_stopSignal', correct_response: ["none", -1], stop_color_condition: conditions[3]}}
	currData= stopStim.data
	return stopStim.image
	} else if(temp==9){
	stopStim= {image: preFileStopType+pathSource+ colors[temp]+'_stopSignal'+fileType+postFileType, data: {exp_id: 'gmParadigm', stop_stim: colors[temp]+'_stopSignal', correct_response: ["none", -1], stop_color_condition: conditions[4]}}
	currData= stopStim.data
	return stopStim.image
	}
}

var getSSPractice_trial_type3 = function() {
	temp=a.trial.pop()
	return temp
}


var getSSD = function() {
	return SSD
}

var resetSSD = function() {
	SSD = 250
}

var getGap = function() {
	return gap
}

var resetGap = function() {
	gap = 500
	currTrial = 0
}


var updateSSDandData = function() {
	jsPsych.data.addDataToLastTrial({SSD: SSD, stop_stim: currData.stop_stim, stop_condition: currData.stop_color_condition, current_trial: currTrial})
	currTrial = currTrial+1
	var curr_trial = jsPsych.progress().current_trial_global
	if ((jsPsych.data.getData()[curr_trial].rt == -1) && (SSD<850) && (jsPsych.data.getData()[curr_trial].SS_trial_type=='stop')) {
		SSD = SSD + 50
	} else if ((jsPsych.data.getData()[curr_trial].rt != -1) && (SSD > 0) && (jsPsych.data.getData()[curr_trial].SS_trial_type=='stop')) { 
		SSD = SSD - 50
	}
}
//////////////////////////////////////////////////////////////////////////////////////////////////
// practice learning block functions

var getPracticeLearningStim = function(){
	temp = practiceLearningStims.pop()
	data = temp.data
	action = practice_responses.pop()[0]
	if(action=="no"){
	return temp.image + prompt_practice_text + '<p><strong> Press '+ action+' key</strong></p>'
	} else if(action == "space bar"){
	return temp.image + prompt_practice_text + '<p><strong> Press the '+ action+' key</strong></p>'
	}
}

var getPrompt = function(){
	prePrompt = prePracticeLearningStim.pop()
	return prePrompt
}

var appendPracticeLearningData = function(){
	jsPsych.data.addDataToLastTrial({stim: temp.image, correct_response: data.correct_response, condition: data.condition})

}

//////////////////////////////////////////////////////////////////////////////////////////////////
// forced choice functions


var getCombo = function(){
	squares=ChoiceCombos1.pop()
	data=combos1Data.pop()
	firstCond=data[0]
	secCond=data[1]
	whichSquare=squares[0]
	whichSquare2=squares[1]
	return [forcedChoiceType+pathSource+whichSquare+fileType+postFileTypeForced+forcedChoiceType2+pathSource+whichSquare2+fileType+postFileTypeForced]
} 

var getCombo2 = function(){
	squares=ChoiceCombos2.pop()
	data=combos2Data.pop()
	firstCond=data[0]
	secCond=data[1]
	whichSquare=squares[0]
	whichSquare2=squares[1]
	return [forcedChoiceType+pathSource+whichSquare+fileType+postFileTypeForced+forcedChoiceType2+pathSource+whichSquare2+fileType+postFileTypeForced]
} 

var appendForcedChoiceData = function(){
	jsPsych.data.addDataToLastTrial({stimLeft: whichSquare, cond_left: firstCond, stimRight: whichSquare2,  cond_right: secCond, current_trial: currTrial})
	currTrial = currTrial +1
}

/* ************************************ */
/* Define experimental variables */
/* ************************************ */

var RT_thresh = 1000
var SSD = 250
var accuracy_thresh = .75
var learning_accuracy_thresh = .60
var gap = 0
var learningNumTrials = 24
var practiceStopNumTrials = 24
var numLearningBlocks = 0
var numLearningBlocksTotal = 3
var numTrials = 80
var currTrial = 0
var pathSource = '/static/experiments/gm_paradigm/images/'
var fileType = '.png'
var preFileType = "<img class = duck src='"
var preFileTypeReward = "<img class = duck src='"

var forcedChoiceType="<div class = decision-left><img src='"
var forcedChoiceType2="<div class = decision-right><img src='"

var preFileStopType = "<img class = duck src='"
var postFileType = "'></img>"
var postFileTypeForced = "'></img></div>"

var shapes = jsPsych.randomization.repeat(['circle','rhombus','pentagon','triangle'],1)
shapes.splice(0,0,'square')
var triangleNum = shapes.indexOf('triangle')
var colors = jsPsych.randomization.repeat(['red','green','blue','yellow','orange','black','purple','grey','brown','pink'],1)
var correct_responses = [["left arrow",37],["right arrow",39],["none" , -1],["space bar", 32]]
var practice_responses = [["space bar",37],["no" , -1]]
var practiceStop_responses = [["Z Key", 90 ],["M Key", 77]]
var conditions = ['go_win','go_avoid','nogo_win','nogo_avoid','neutral']
var practice_trial_data = '' //global variable to track randomized practice trial data
var missed_response_thresh = .05
var practiceConditions = ['Act to earn reward','Act to avoid losing reward','Do not act to gain reward','Do not act to avoid losing reward','neutral']
var practiceConditions = ['Press space bar to earn 25 cents','Press space bar to avoid losing 25 cents','Press nothing to earn 25 cents','Press nothing to avoid losing 25 cents']

var startTestPrompt = '<ul list-text><li><strong>'+colors[0]+'</strong>: '+ correct_responses[3][0] + ' ('+practiceConditions[0]+')'+ '</li><li><strong>'+colors[1]+':</strong> '+ correct_responses[3][0] +' ('+practiceConditions[1]+')'+'</li><li><strong>'+colors[4]+':</strong> '+ correct_responses[3][0] + ' ('+practiceConditions[0]+')'+'</li><li><strong>'+colors[5]+':</strong> '+ correct_responses[3][0] + ' ('+practiceConditions[1]+')'+'</li><li><strong>'+colors[6]+':</strong> '+ correct_responses[2][0] + ' ('+practiceConditions[2]+')'+'</li><li><strong>'+colors[7]+': </strong>'+correct_responses[2][0]+ ' ('+practiceConditions[3]+')'+'</li><li><strong>'+colors[2]+': </strong>'+ correct_responses[2][0] + ' ('+practiceConditions[2]+')'+'</li><li><strong>'+colors[3]+': </strong>'+correct_responses[2][0]+' ('+practiceConditions[3]+')'+'</li></ul>'

var startTestPrompt0 = '<ul list-text><li><strong>'+colors[0]+'</strong>: '+ correct_responses[3][0] + ' ('+practiceConditions[0]+')'+ '</li>'
var startTestPrompt1 = '<ul list-text><li><strong>'+colors[1]+'</strong>: '+ correct_responses[3][0] + ' ('+practiceConditions[1]+')'+ '</li>'
var startTestPrompt2 = '<ul list-text><li><strong>'+colors[2]+'</strong>: '+ correct_responses[2][0] + ' ('+practiceConditions[2]+')'+ '</li>'
var startTestPrompt3 = '<ul list-text><li><strong>'+colors[3]+'</strong>: '+ correct_responses[2][0] + ' ('+practiceConditions[3]+')'+ '</li>'
var startTestPrompt4 = '<ul list-text><li><strong>'+colors[4]+'</strong>: '+ correct_responses[3][0] + ' ('+practiceConditions[0]+')'+ '</li>'
var startTestPrompt5 = '<ul list-text><li><strong>'+colors[5]+'</strong>: '+ correct_responses[3][0] + ' ('+practiceConditions[1]+')'+ '</li>'
var startTestPrompt6 = '<ul list-text><li><strong>'+colors[6]+'</strong>: '+ correct_responses[2][0] + ' ('+practiceConditions[2]+')'+ '</li>'
var startTestPrompt7 = '<ul list-text><li><strong>'+colors[7]+'</strong>: '+ correct_responses[2][0] + ' ('+practiceConditions[3]+')'+ '</li>'

var zmprompt_text = '<ul list-text><li>'+shapes[1]+': '+ practiceStop_responses[0][0] + '</li><li>'+shapes[2]+': '+ practiceStop_responses[0][0] + '</li><li>'+shapes[3]+': '+ practiceStop_responses[1][0] + '</li><li>'+shapes[4]+': '+practiceStop_responses[1][0]+'</li></ul>'

var prompt_text = '<ul list-text><li>'+shapes[1]+': '+ correct_responses[0][0] + '</li><li>'+shapes[2]+': '+ correct_responses[0][0] + '</li><li>'+shapes[3]+': '+ correct_responses[1][0] + '</li><li>'+shapes[4]+': '+correct_responses[1][0]+'</li></ul>'
var prompt_practice_text_heading1 = '<div><p><strong>This is one of the colors that you will see.</strong></p>'
var prompt_practice_text_heading2 = '  We will take a look at all colors associated with the rules.</p><p>Press <strong>Enter</strong> to move to the next page.</div>'

var tempText1= '  <br><br>Each time you see the <strong>'+colors[0]+' '+shapes[0]+'</strong>, you should <strong>press the space bar</strong> to earn 25 cents. You should not press nothing, as this will result in earning 0 cents.  <br><br> Press <strong>enter</strong> to continue'
var tempText2= '  <br><br>Each time you see the <strong>'+colors[1]+' '+shapes[0]+'</strong>, you should <strong>press the space bar</strong> to lose 0 cents.  You should not press the space bar, as this will result in losing 25 cents.  <br><br> Press <strong>enter</strong> to continue'
var tempText3= '  <br><br>Each time you see the <strong>'+colors[2]+' '+shapes[0]+'</strong>, you should <strong>do nothing</strong> to gain 25 cents.  You should  not press the space bar, as this will result in gaining 0 cents.  <br><br> Press <strong>enter</strong> to continue'
var tempText4= '  <br><br>Each time you see the <strong>'+colors[3]+' '+shapes[0]+'</strong>, you should <strong>do nothing</strong> to lose 0 cents.  You should not act, as this will result in losing 25 cents.  <br><br> Press <strong>enter</strong> to continue'

var tempText5= '  <br><br>Each time you see the <strong>'+colors[4]+' '+shapes[0]+'</strong>, you should <strong>press the space bar</strong> to earn 25 cents.  You should not press nothing, as this will result in earning 0 cents.  <br><br> Press <strong>enter</strong> to continue'
var tempText6= '  <br><br>Each time you see the <strong>'+colors[5]+' '+shapes[0]+'</strong>, you should <strong>press the space bar</strong> to lose 0 cents.  You should not press nothing, as this will result in losing 25 cents.  <br><br> Press <strong>enter</strong> to continue'
var tempText7= '  <br><br>Each time you see the <strong>'+colors[6]+' '+shapes[0]+'</strong>, you should <strong>do nothing</strong> to gain 25 cents.  You should not press the space bar, as this will result in gaining 0 cents.  <br><br> Press <strong>enter</strong> to continue'
var tempText8=  ' <br><br>Each time you see the <strong>'+colors[7]+' '+shapes[0]+'</strong>, you should <strong>do nothing</strong> to lose 0 cents.  You should not act, as this will result in losing 25 cents.  <br><br> Press <strong>enter</strong> to continue'


var count = 0
var count1 = 0
var countStims = 0
var countPractice = 0
var stopCount = 0
var stopPracticeCount = 0


var stim1=colors[0]+'_'+shapes[0]
var stim2=colors[1]+'_'+shapes[0]
var stim3=colors[2]+'_'+shapes[0]
var stim4=colors[3]+'_'+shapes[0]
var stim5=colors[4]+'_'+shapes[0]
var stim6=colors[5]+'_'+shapes[0]
var stim7=colors[6]+'_'+shapes[0]
var stim8=colors[7]+'_'+shapes[0]


var p2stim1 = colors[8]+'_'+shapes[1]
var p2stim2 = colors[8]+'_'+shapes[2]
var p2stim3 = colors[8]+'_'+shapes[3]
var p2stim4 = colors[8]+'_'+shapes[4]
var p2stop  = colors[9]+'_stopSignal'
var stop_signal = preFileStopType+pathSource+p2stop+fileType+postFileType


var p3stim1 = colors[0]+'_'+shapes[1]
var p3stim2 = colors[1]+'_'+shapes[1]
var p3stim3 = colors[2]+'_'+shapes[1]
var p3stim4 = colors[3]+'_'+shapes[1]
var p3stim5 = colors[8]+'_'+shapes[1]
var p3stim6 = colors[0]+'_'+shapes[2]
var p3stim7 = colors[1]+'_'+shapes[2]
var p3stim8 = colors[2]+'_'+shapes[2]
var p3stim9 = colors[3]+'_'+shapes[2]
var p3stim10 = colors[8]+'_'+shapes[2]
var p3stim11 = colors[0]+'_'+shapes[3]
var p3stim12 = colors[1]+'_'+shapes[3]
var p3stim13 = colors[2]+'_'+shapes[3]
var p3stim14 = colors[3]+'_'+shapes[3]
var p3stim15 = colors[8]+'_'+shapes[3]
var p3stim16 = colors[0]+'_'+shapes[4]
var p3stim17 = colors[1]+'_'+shapes[4]
var p3stim18 = colors[2]+'_'+shapes[4]
var p3stim19 = colors[3]+'_'+shapes[4]
var p3stim20 = colors[8]+'_'+shapes[4]



firstPhaseStims = [{image: preFileType+pathSource+ stim1 +fileType+postFileType, data: {exp_id: 'gmParadigm', stimulus: stim1, correct_response: correct_responses[3], condition: conditions[0]}},
				   {image: preFileType+pathSource+ stim2 +fileType+postFileType, data: {exp_id: 'gmParadigm', stimulus: stim2, correct_response: correct_responses[3], condition: conditions[1]}},
		           {image: preFileType+pathSource+ stim3 +fileType+postFileType, data: {exp_id: 'gmParadigm', stimulus: stim3, correct_response: correct_responses[2], condition: conditions[2]}},
				   {image: preFileType+pathSource+ stim4 +fileType+postFileType, data: {exp_id: 'gmParadigm', stimulus: stim4, correct_response: correct_responses[2], condition: conditions[3]}},
				   {image: preFileType+pathSource+ stim5 +fileType+postFileType, data: {exp_id: 'gmParadigm', stimulus: stim5, correct_response: correct_responses[3], condition: conditions[0]}},
				   {image: preFileType+pathSource+ stim6 +fileType+postFileType, data: {exp_id: 'gmParadigm', stimulus: stim6, correct_response: correct_responses[3], condition: conditions[1]}},
				   {image: preFileType+pathSource+ stim7 +fileType+postFileType, data: {exp_id: 'gmParadigm', stimulus: stim7, correct_response: correct_responses[2], condition: conditions[2]}},
		 		   {image: preFileType+pathSource+ stim8 +fileType+postFileType, data: {exp_id: 'gmParadigm', stimulus: stim8, correct_response: correct_responses[2], condition: conditions[3]}}]


secondPhaseStims = [{image: preFileType+pathSource+ p2stim1 +fileType+postFileType, data: {exp_id: 'gmParadigm', stimulus: p2stim1, correct_response: practiceStop_responses[0], condition: conditions[4]}},
					{image: preFileType+pathSource+ p2stim2 +fileType+postFileType, data: {exp_id: 'gmParadigm', stimulus: p2stim2, correct_response: practiceStop_responses[0], condition: conditions[4]}},
					{image: preFileType+pathSource+ p2stim3 +fileType+postFileType, data: {exp_id: 'gmParadigm', stimulus: p2stim3, correct_response: practiceStop_responses[1], condition: conditions[4]}},
					{image: preFileType+pathSource+ p2stim4 +fileType+postFileType, data: {exp_id: 'gmParadigm', stimulus: p2stim4, correct_response: practiceStop_responses[1], condition: conditions[4]}}]

firstPhaseStimsComplete = jsPsych.randomization.repeat(firstPhaseStims, learningNumTrials/8, true);   //learningNumTrials =24, so does practiceStopNumTrials
secondPhaseStimsComplete = jsPsych.randomization.repeat(secondPhaseStims, 3, true);



//this is for main stopping stims


exp_len = 75
		 stop_percent = (1/3)
		 stim_colors = [0,1,2,3,8]
		 stims = []
		 var num_stims = exp_len/stim_colors.length
			for (var c = 0; c < stim_colors.length; c++) {
				var stop_trials = jsPsych.randomization.repeat(['stop','go','go'], num_stims/3)
				var stop_colors = [4,5,6,7,9]
					for (var s = 0; s< num_stims; s++) {
						if (stop_trials[s] == 'stop') {
							var stim = {'color': stim_colors[c], 'trial': stop_trials[s], 'stop_color': stop_colors.pop()}
						} else {
							var stim = {'color': stim_colors[c], 'trial': stop_trials[s], 'stop_color': 'NA'}
						}
					stims.push(stim)
					}
			}

a=jsPsych.randomization.repeat(stims,1,true)	//a is a 300x3 matrix (300 = numStims, column 1= go colors, col2= stop trial type, and col3= stop color)
tempShape=jsPsych.randomization.repeat([1,2,3,4],18)
tempShape.push(Math.floor(Math.random()*4+1))
tempShape.push(Math.floor(Math.random()*4+1))
tempShape.push(Math.floor(Math.random()*4+1))
	
	

var practice_stop_trials = jsPsych.randomization.repeat(['stop','stop','stop','stop','go','go','go','go','go','go','go','go'], 1,false)





practiceLearningStims1={image: preFileType+pathSource+ stim1 +fileType+postFileType, data: {exp_id: 'gmParadigm', stimulus: stim1, correct_response: correct_responses[3], condition: conditions[0]}}
practiceLearningStims2={image: preFileType+pathSource+ stim2 +fileType+postFileType, data: {exp_id: 'gmParadigm', stimulus: stim2, correct_response: correct_responses[3], condition: conditions[1]}}
practiceLearningStims3={image: preFileType+pathSource+ stim3 +fileType+postFileType, data: {exp_id: 'gmParadigm', stimulus: stim3, correct_response: correct_responses[2], condition: conditions[2]}}
practiceLearningStims4={image: preFileType+pathSource+ stim4 +fileType+postFileType, data: {exp_id: 'gmParadigm', stimulus: stim4, correct_response: correct_responses[2], condition: conditions[3]}}
practiceLearningStims5={image: preFileType+pathSource+ stim5 +fileType+postFileType, data: {exp_id: 'gmParadigm', stimulus: stim5, correct_response: correct_responses[3], condition: conditions[0]}}
practiceLearningStims6={image: preFileType+pathSource+ stim6 +fileType+postFileType, data: {exp_id: 'gmParadigm', stimulus: stim6, correct_response: correct_responses[3], condition: conditions[1]}}
practiceLearningStims7={image: preFileType+pathSource+ stim7 +fileType+postFileType, data: {exp_id: 'gmParadigm', stimulus: stim7, correct_response: correct_responses[2], condition: conditions[2]}}
practiceLearningStims8={image: preFileType+pathSource+ stim8 +fileType+postFileType, data: {exp_id: 'gmParadigm', stimulus: stim8, correct_response: correct_responses[2], condition: conditions[3]}}



tempCombo = []
for(i=1;i<11;i++){
	for(x=i+1; x<11; x++){
		tempCombo.push([i,x])
	}
}
tempCombo=jsPsych.randomization.repeat(tempCombo,1)

tempCombo2=[]
for(i=0;i<tempCombo.length; i++){
	firstNum = tempCombo[i][0]
	secondNum = tempCombo[i][1]
	tempCombo2.push([secondNum,firstNum])
}
tempCombo2=jsPsych.randomization.repeat(tempCombo2,1)


ChoiceCombos1=[]
ChoiceCombos2=[]
combos1Data=[]
combos2Data=[]

for(i=0;i<45; i++){
	uniqueCombo = tempCombo.pop()
	whichColor = uniqueCombo[0]-1
	whichColor2= uniqueCombo[1]-1
	ChoiceCombos1.push([colors[whichColor]+'_square', colors[whichColor2]+'_square'])
	
	colorNum=whichColor
	colorNum2=whichColor2
	if(colorNum<4){
		tempCond = conditions[colorNum]
	} else if(colorNum==4||colorNum==5||colorNum==6||colorNum==7){
		tempColorNum=colorNum-4
		tempCond = conditions[tempColorNum]
	} else if(colorNum==8||colorNum==9){
		tempCond=conditions[4]
	}
	
	if(colorNum2<4){
		tempCond2 = conditions[colorNum2]
	} else if(colorNum2==4||colorNum2==5||colorNum2==6||colorNum2==7){
		tempColorNum2=colorNum2-4
		tempCond2 = conditions[tempColorNum2]
	} else if(colorNum2==8||colorNum2==9){
		tempCond2=conditions[4]
	}
	
	combos1Data.push([tempCond,tempCond2])
	///
	
	uniqueCombo2 = tempCombo2.pop()
	whichColor_1 = uniqueCombo2[0]-1
	whichColor2_1= uniqueCombo2[1]-1
	ChoiceCombos2.push([colors[whichColor_1]+'_square', colors[whichColor2_1]+'_square'])
	
	colorNum_1=whichColor_1
	colorNum_2=whichColor2_1
	if(colorNum_1<4){
		tempCond = conditions[colorNum_1]
	} else if(colorNum_1==4||colorNum_1==5||colorNum_1==6||colorNum_1==7){
		tempColorNum=colorNum_1-4
		tempCond = conditions[tempColorNum]

	} else if(colorNum_1==8||colorNum_1==9){
		tempCond=conditions[4]
	}
	
	if(colorNum_2<4){
		tempCond2 = conditions[colorNum_2]
	} else if(colorNum_2==4||colorNum_2==5||colorNum_2==6||colorNum_2==7){
		tempColorNum2=colorNum_2-4
		tempCond2 = conditions[tempColorNum2]
	} else if(colorNum_2==8||colorNum_2==9){
		tempCond2=conditions[4]
	}
	
	combos2Data.push([tempCond,tempCond2])


}

	
/* ************************************ */
/* Set up jsPsych blocks */
/* ************************************ */

var welcome_block = {
  type: 'text',
  text: '<div class = centerbox><p class = center-block-text>Welcome to the GM task. Press <strong>enter</strong> to begin.</p></div>',
  cont_key: [13],
  timing_post_trial: 0
};

var testImages = {
  type: 'text',
  text: "<img class = duck src='/Users/jamieli/Desktop/jamie/experimentImages/gmParadigm/green_circle.png'></img><img class = duck src='/Users/jamieli/Desktop/jamie/experimentImages/gmParadigm/green_stopSignal.png'></img>",
  cont_key: [13],
  timing_post_trial: 0
};

var testImagesBlock = {
  type: 'text',
  text: preFileType+pathSource+'green_circle'+fileType+postFileType+preFileTypeReward+pathSource+'minus_25'+fileType+postFileType+'<div class = fixation-gmParadigm><span style="color:red">+</span></div>',
  cont_key: [13],
  timing_post_trial: 0
};


var instructions_block = {
  type: 'poldrack-instructions',
  pages: [
	'<div class = centerbox><p class = block-text>This experiment is composed of 3 phases.</p></div>',
	'<div class =centerbox><p class = block-text>Your goal for the first phase is to try to maximize your earnings by choosing to press the space bar or not based upon the presentation of 8 different colored squares.  Each of the eight colors will be rewarded according to one of the following four reward schedules:</p><p class =block-text>'+ 
	'<ul list-text><li> 1) <strong> Press space bar to gain 25 cents:</strong> Press nothing to gain 0 cents. </li><li> 2) <strong> Press space bar to lose 0 cents: </strong>Press nothing to lose 25 cents.</li><li> 3)<strong> Press nothing to gain 25 cents: </strong>Press space bar to gain 0 cents. </li><li>4) <strong> Press nothing to lose 0 cents: </strong> Press space bar to lose 25 cents</li></ul></p>'+
	'<p class = block-text>We will go over each of these rules.</div>',
  ],
  allow_keys: false,
  show_clickable_nav: true,
  timing_post_trial: 1000
};

var start_practice = {
  type: 'poldrack-single-stim',
  stimulus: getPracticePrompt,
  is_html: true,
  choices: [13],
  data: {exp_id: "gmParadigm", "trial_id": "pre-learning"},
  timing_post_trial: 0,
  timing_stim: -1,
  timing_response: -1,
};



var start_test = {
  type: 'poldrack-single-stim',
  stimulus: '<div class = centerbox><p class = block-text>We will now start phase 1 of the experiment.  For these trials, the rules associated with each color are as follows: </p><p class = block-text>'+startTestPrompt+'</p><p class = block-text> Make sure that you remember these rules before you move on to the test. <br><br>Press <strong>Enter</strong> to begin.'+'</p></div>',
  is_html: true,
  choices: [13],
  data: {exp_id: "gmParadigm", "trial_id": "learning_intro (phase 1)"},
  timing_post_trial: 0,
  timing_stim: -1,
  timing_response: -1,
};

var stop_intro = {
  type: 'poldrack-single-stim',
  stimulus: '<div class = centerbox><p class = block-text>We will now start the practice for phase 2 of the experiment.<br><br>For these trials, you must press the <strong> Z key </strong> or the <strong> M key </strong> depending on the shape of the stimulus.  Make sure to respond as quickly and accurately as possible to the shape. <br><br> The responses for each shape are as follows: ' + zmprompt_text+  '</p><p class = block-text>Remember these rules before you proceed, as they will not be presented during the trial. <br><br>Press <strong>enter</strong> to begin. </p></div>',
  is_html: true,
  choices: [13],
  data: {exp_id: "gmParadigm", "trial_id": "stop_intro (phase 2)"},
  timing_post_trial: 0,
  timing_stim: -1,
  timing_response: -1,
};

var stop_intro2 = {
  type: 'poldrack-single-stim',
  stimulus: '<div class = centerbox><p class = block-text>These trials will be similar to the trials you have just completed.  Again, please respond to the shape of the stimulus. <br><br> On a subset of trials, a star will appear around the shape, when this happens please try your best to stop your response and press nothing. Do not slow your responses to the shape to achieve this. <br><br>The responses for each shape are as follows: ' + zmprompt_text+  '</p><p class =block-text>Remember these rules before you proceed, as they will not be presented during the trial. </p><p class =block-text>Press <strong>enter</strong> to begin. </p></div>',
  is_html: true,
  choices: [13],
  data: {exp_id: "gmParadigm", "trial_id": "stop_intro (phase 2)"},
  timing_post_trial: 0,
  timing_stim: -1,
  timing_response: -1,
};


var main_stop_intro1 = {
  type: 'poldrack-single-stim',
  stimulus: '<div class = centerbox><p class = block-text>We will now start Phase 2 of the experiment.<br><br>These trials are similar to the trials that you have just completed.  Like last time, on a subset of trials a star will appear around the shape, when this happens please try your best to stop your response and press nothing. Do not slow your responses to the shape to achieve this.<br><br>The rules for each shape are as follows:  <br>'+zmprompt_text+'</p><p class = block-text>Remember these rules before you proceed.</p><p class = block-text>Press <strong> enter</strong> to begin.</p></div>',
  is_html: true,
  choices: [13],
  data: {exp_id: "gmParadigm", "trial_id": "main_stop_intro (phase 3)"},
  timing_post_trial: 0,
  timing_stim: -1,
  timing_response: -1,
};



var forced_choice_intro = {
  type: 'poldrack-single-stim',
  stimulus: '<div class = centerbox><p class = block-text>We will now start phase 3 of the experiment.<br><br>In this part of the experiment, you will see two color patches presented on each trial, one on the left side of the screen and the other on the right. You will choose the color which you find more rewarding by pressing either the left or right arrow key to correspond with the left or right color patch, respectively. <br><br>Press <strong>enter</strong> to continue.</p></div>',
  is_html: true,
  choices: [13],
  data: {exp_id: "gmParadigm", "trial_id": "forced_choice_intro"},
  timing_post_trial: 0,
  timing_stim: -1,
  timing_response: -1,
};

var forced_choice_intro_break = {
  type: 'poldrack-single-stim',
  stimulus: '<div class = centerbox><p class = block-text>We will now take a short break.  <br><br>Press <strong>enter</strong> to continue.</p></div>',
  is_html: true,
  choices: [13],
  data: {exp_id: "gmParadigm", "trial_id": "forced_choice_intro"},
  timing_post_trial: 0,
  timing_stim: -1,
  timing_response: -1,
};


var forced_choice_block = {
  type: 'poldrack-single-stim',
  stimulus: getCombo,
  is_html: true,
  choices: [37,39],
  data: {exp_id: "gmParadigm", "trial_id": "forced_choice"},
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
  choices: [37,39],
  data: {exp_id: "gmParadigm", "trial_id": "forced_choice"},
  timing_post_trial: 0,
  timing_stim: 3000,
  timing_response: 3000,
  response_ends_trial: false,
  on_finish: appendForcedChoiceData,
};


var fixationBlock = {
  type: 'poldrack-single-stim',
  stimulus: '<div class = centerbox><div class = fixation-gmParadigm><span style="color:red">+</span></div></div>',
  is_html: true,
  choices: 'none',
  data: {exp_id: "gmParadigm", "trial_id": "fixation"},
  timing_post_trial: 0,
  timing_stim: 500,
  timing_response: 500,
};

var fixationBlock2 = {
  type: 'poldrack-single-stim',
  stimulus: '<div class = centerbox><div class = fixation-gmParadigm><span style="color:red">+</span></div></div>',
  is_html: true,
  choices: 'none',
  data: {exp_id: "gmParadigm", "trial_id": "fixation"},
  timing_post_trial: 0,
  timing_stim: 500,
  timing_response: 500,
};



var rewardBlock2 = {
  type: 'poldrack-single-stim',
  stimulus: getReward2,
  is_html: true,
  choices: 'none',
  data: {exp_id: "gmParadigm", "trial_id": "reward"},
  timing_post_trial: 0,
  timing_stim: 1500,
  timing_response: 1500,
  response_ends_trial: false,
  on_finish: appendRewardData,
};

var rewardBlock = {
  type: 'poldrack-single-stim',
  stimulus: getReward,
  is_html: true,
  choices: 'none',
  data: {exp_id: "gmParadigm", "trial_id": "reward"},
  timing_post_trial: 0,
  timing_stim: 1500,
  timing_response: 1500,
  response_ends_trial: false,
 on_finish: appendRewardData,

};

var practice_feedback_text = 'We will now start with a practice session. In this practice  concentrate on responding quickly and accurately to each stimuli. Press <strong>enter</strong> to continue.'
var practice_feedback_block = {
  type: 'text',
  cont_key: [13],
  text: getPracticeFeedback
};



var learning_feedback_text = 'We will now start a round. Press <strong>enter</strong> to continue.'
var learning_feedback_block = {
  type: 'text',
  cont_key: [13],
  text: getLearningFeedback
};

var stop_feedback_text = 'We will now start a round. Press <strong>enter</strong> to continue.'
var stop_feedback_block = {
  type: 'text',
  cont_key: [13],
  text: getStopFeedback
};

var prompt_block = {
  type: 'poldrack-single-stim',
  stimulus: prompt_text,
  choices: 'none',
  data: {exp_id: "gmParadigm", "trial_id": "prompt"},
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

var reset_Gap = {
    type: 'call-function',
    func: resetGap,
    timing_post_trial: 0
}

var pre_practice_learning_block1 = {
  type: 'poldrack-single-stim',
  stimulus: prompt_practice_text_heading1 + tempText1  + practiceLearningStims1.image,
  is_html: true,
  choices: [13],
  data: {exp_id: "gmParadigm", "trial_id": "Learning Phase Instructions"},
  timing_post_trial: 0,
  timing_stim: -1,
  timing_response: -1,
};

var pre_practice_learning_block2 = {
  type: 'poldrack-single-stim',
  stimulus: prompt_practice_text_heading1 + tempText2  + practiceLearningStims2.image,
  is_html: true,
  choices: [13],
  data: {exp_id: "gmParadigm", "trial_id": "Learning Phase Instructions"},
  timing_post_trial: 0,
  timing_stim: -1,
  timing_response: -1,
};

var pre_practice_learning_block3 = {
  type: 'poldrack-single-stim',
  stimulus: prompt_practice_text_heading1 + tempText3  + practiceLearningStims3.image,
  is_html: true,
  choices: [13],
  data: {exp_id: "gmParadigm", "trial_id": "Learning Phase Instructions"},
  timing_post_trial: 0,
  timing_stim: -1,
  timing_response: -1,
};

var pre_practice_learning_block4 = {
  type: 'poldrack-single-stim',
  stimulus: prompt_practice_text_heading1 + tempText4  + practiceLearningStims4.image,
  is_html: true,
  choices: [13],
  data: {exp_id: "gmParadigm", "trial_id": "Learning Phase Instructions"},
  timing_post_trial: 0,
  timing_stim: -1,
  timing_response: -1,
};

var pre_practice_learning_block5 = {
  type: 'poldrack-single-stim',
  stimulus: prompt_practice_text_heading1 + tempText5  + practiceLearningStims5.image,
  is_html: true,
  choices: [13],
  data: {exp_id: "gmParadigm", "trial_id": "Learning Phase Instructions"},
  timing_post_trial: 0,
  timing_stim: -1,
  timing_response: -1,
};

var pre_practice_learning_block6 = {
  type: 'poldrack-single-stim',
  stimulus: prompt_practice_text_heading1 + tempText6  + practiceLearningStims6.image,
  is_html: true,
  choices: [13],
  data: {exp_id: "gmParadigm", "trial_id": "Learning Phase Instructions"},
  timing_post_trial: 0,
  timing_stim: -1,
  timing_response: -1,
};

var pre_practice_learning_block7 = {
  type: 'poldrack-single-stim',
  stimulus: prompt_practice_text_heading1 + tempText7  + practiceLearningStims7.image,
  is_html: true,
  choices: [13],
  data: {exp_id: "gmParadigm", "trial_id": "Learning Phase Instructions"},
  timing_post_trial: 0,
  timing_stim: -1,
  timing_response: -1,
};

var pre_practice_learning_block8 = {
  type: 'poldrack-single-stim',
  stimulus: prompt_practice_text_heading1 + tempText8  + practiceLearningStims8.image,
  is_html: true,
  choices: [13],
  data: {exp_id: "gmParadigm", "trial_id": "Learning Phase Instructions"},
  timing_post_trial: 0,
  timing_stim: -1,
  timing_response: -1,
};

/* ************************************ */
/* Set up experiment */
/* ************************************ */

var gm_paradigm_experiment=[]

/******************** PRACTICE PHASE ************************/

subjectTrialsStim1 = []
for(i=0;i<1;i++){
subjectTrialsStim1.push(fixationBlock)
	var subjectPracticeTrials1 = {
	type: 'poldrack-single-stim',
	stimulus: getStim1,
	is_html: true,
	data: {exp_id: "gmParadigm", "trial_id": "learning"},
	choices: [32],
	timing_stim: 1500,
	timing_response:1500, 
	on_finish: appendData2,
	response_ends_trial: false,
	}
subjectTrialsStim1.push(subjectPracticeTrials1)
subjectTrialsStim1.push(rewardBlock)

}

var learning_chunk1 = {
    chunk_type: 'while',
    timeline: subjectTrialsStim1,
	continue_function: function(data){
	if(data[1].key_press==32 || data[1].key_press == -1){
		whichKey1=data[1].key_press	
		 return false
	}else {
	currTrial = 0
	return true
	}
}
}

var learning_chunk1_2 = {
	chunk_type: 'while',
    timeline: subjectTrialsStim1,
	continue_function: function(data){
	if(data[1].key_press!=whichKey1){
		return false
	}else {
		currTrial = 0
	return true
	}
}
}
///
subjectTrialsStim2 = []
for(i=0;i<1;i++){
subjectTrialsStim2.push(fixationBlock)
	var subjectPracticeTrials2 = {
	type: 'poldrack-single-stim',
	stimulus: getStim2,
	is_html: true,
	data: {exp_id: "gmParadigm", "trial_id": "learning"},
	choices: [32],
	timing_stim: 1500,
	timing_response:1500, 
	on_finish: appendData2,
	response_ends_trial: false,
	}
subjectTrialsStim2.push(subjectPracticeTrials2)
subjectTrialsStim2.push(rewardBlock)
}

var learning_chunk2 = {
    chunk_type: 'while',
    timeline: subjectTrialsStim2,
	continue_function: function(data){
	if(data[1].key_press==32 || data[1].key_press == -1){
		whichKey1=data[1].key_press	
		return false
	}else {
		currTrial = 0
	return true
	}
}
}

var learning_chunk2_2 = {
	chunk_type: 'while',
    timeline: subjectTrialsStim2,
	continue_function: function(data){
	if(data[1].key_press!=whichKey1){
		return false
	}else {
		currTrial = 0
	return true
	}
}
}
////
subjectTrialsStim3 = []
for(i=0;i<1;i++){
subjectTrialsStim3.push(fixationBlock)
	var subjectPracticeTrials3 = {
	type: 'poldrack-single-stim',
	stimulus: getStim3,
	is_html: true,
	data: {exp_id: "gmParadigm", "trial_id": "learning"},
	choices: [32],
	timing_stim: 1500,
	timing_response:1500, 
	on_finish: appendData2,
	response_ends_trial: false,
	}
subjectTrialsStim3.push(subjectPracticeTrials3)
subjectTrialsStim3.push(rewardBlock)


}

var learning_chunk3 = {
    chunk_type: 'while',
    timeline: subjectTrialsStim3,
	continue_function: function(data){
	if(data[1].key_press==32 || data[1].key_press == -1){
		whichKey1=data[1].key_press	
		return false
	}else {
		currTrial = 0
	return true
	}
}
}

var learning_chunk3_2 = {
	chunk_type: 'while',
    timeline: subjectTrialsStim3,
	continue_function: function(data){
	if(data[1].key_press!=whichKey1){
		return false
	}else {
		currTrial = 0
	return true
	}
}
}
///
subjectTrialsStim4 = []
for(i=0;i< 1;i++){
subjectTrialsStim4.push(fixationBlock)
	var subjectPracticeTrials4 = {
	type: 'poldrack-single-stim',
	stimulus: getStim4,
	is_html: true,
	data: {exp_id: "gmParadigm", "trial_id": "learning"},
	choices: [32],
	timing_stim: 1500,
	timing_response:1500, 
	on_finish: appendData2,
	response_ends_trial: false,
	}
subjectTrialsStim4.push(subjectPracticeTrials4)
subjectTrialsStim4.push(rewardBlock)


}

var learning_chunk4 = {
    chunk_type: 'while',
    timeline: subjectTrialsStim4,
	continue_function: function(data){
	if(data[1].key_press==32 || data[1].key_press == -1){
		whichKey1=data[1].key_press	
		return false
	}else {
		currTrial = 0
	return true
	}
}
}

var learning_chunk4_2 = {
	chunk_type: 'while',
    timeline: subjectTrialsStim4,
	continue_function: function(data){
	if(data[1].key_press!=whichKey1){
		return false
	}else {
		currTrial = 0
	return true
	}
}
}	
////	
subjectTrialsStim5 = []
for(i=0;i< 1;i++){
subjectTrialsStim5.push(fixationBlock)
	var subjectPracticeTrials5 = {
	type: 'poldrack-single-stim',
	stimulus: getStim5,
	is_html: true,
	data: {exp_id: "gmParadigm", "trial_id": "learning"},
	choices: [32],
	timing_stim: 1500,
	timing_response:1500, 
	on_finish: appendData2,
	response_ends_trial: false,

	}
subjectTrialsStim5.push(subjectPracticeTrials5)
subjectTrialsStim5.push(rewardBlock)



}
var learning_chunk5 = {
    chunk_type: 'while',
    timeline: subjectTrialsStim5,
	continue_function: function(data){
	if(data[1].key_press==32 || data[1].key_press == -1){
		whichKey1=data[1].key_press	
		return false
	}else {
		currTrial = 0
	return true
	}
}
}

var learning_chunk5_2 = {
	chunk_type: 'while',
    timeline: subjectTrialsStim5,
	continue_function: function(data){
	if(data[1].key_press!=whichKey1){
		return false
	}else {
		currTrial = 0
	return true
	}
}
}
////
subjectTrialsStim6 = []
for(i=0;i< 1;i++){
subjectTrialsStim6.push(fixationBlock)
	var subjectPracticeTrials6 = {
	type: 'poldrack-single-stim',
	stimulus: getStim6,
	is_html: true,
	data: {exp_id: "gmParadigm", "trial_id": "learning"},
	choices: [32],
	timing_stim: 1500,
	timing_response:1500, 
	on_finish: appendData2,
	response_ends_trial: false,

	}
subjectTrialsStim6.push(subjectPracticeTrials6)
subjectTrialsStim6.push(rewardBlock)

}
var learning_chunk6 = {
    chunk_type: 'while',
    timeline: subjectTrialsStim6,
	continue_function: function(data){
	if(data[1].key_press==32 || data[1].key_press == -1){
		whichKey1=data[1].key_press	
		return false
	}else {
		currTrial = 0
	return true
	}
}
}

var learning_chunk6_2 = {
	chunk_type: 'while',
    timeline: subjectTrialsStim6,
	continue_function: function(data){
	if(data[1].key_press!=whichKey1){
		return false
	}else {
		currTrial = 0
	return true
	}
}
}
/////
subjectTrialsStim7 = []
for(i=0;i<1;i++){
subjectTrialsStim7.push(fixationBlock)
	var subjectPracticeTrials7 = {
	type: 'poldrack-single-stim',
	stimulus: getStim7,
	is_html: true,
	data: {exp_id: "gmParadigm", "trial_id": "learning"},
	choices: [32],
	timing_stim: 1500,
	timing_response: 1500, 
	on_finish: appendData2,
	response_ends_trial: false,
	}
subjectTrialsStim7.push(subjectPracticeTrials7)
subjectTrialsStim7.push(rewardBlock)

}
var learning_chunk7 = {
    chunk_type: 'while',
    timeline: subjectTrialsStim7,
	continue_function: function(data){
	if(data[1].key_press==32 || data[1].key_press == -1){
		whichKey1=data[1].key_press	
		return false
	}else {
		currTrial = 0
	return true
	}
}
}

var learning_chunk7_2 = {
	chunk_type: 'while',
    timeline: subjectTrialsStim7,
	continue_function: function(data){
	if(data[1].key_press!=whichKey1){
		return false
	}else {
		currTrial = 0
	return true
	}
}
}
////

subjectTrialsStim8 = []
for(i=0;i<1;i++){
subjectTrialsStim8.push(fixationBlock)
	var subjectPracticeTrials8 = {
	type: 'poldrack-single-stim',
	stimulus: getStim8,
	is_html: true,
	data: {exp_id: "gmParadigm", "trial_id": "learning"},
	choices: [32],
	timing_stim: 1500,
	timing_response: 1500, 
	on_finish: appendData2,
	response_ends_trial: false,
	}
subjectTrialsStim8.push(subjectPracticeTrials8)
subjectTrialsStim8.push(rewardBlock)

}
var learning_chunk8 = {
    chunk_type: 'while',
    timeline: subjectTrialsStim8,
	continue_function: function(data){
	if(data[1].key_press==32 || data[1].key_press == -1){
		whichKey1=data[1].key_press	
		return false
	}else {
		currTrial = 0
	return true
	}
}
}

var learning_chunk8_2 = {
	chunk_type: 'while',
    timeline: subjectTrialsStim8,
	continue_function: function(data){
	if(data[1].key_press!=whichKey1){
		return false
	}else {
		currTrial = 0
	return true
	}
}
}
////

/******************** gmParadigm learning phase without stop signal ************************/
practiceTrials = []
practiceTrials.push(learning_feedback_block)
for(h=0;h<24;h++){
practiceTrials.push(fixationBlock)
var practiceBlock = {
	type: 'poldrack-single-stim',
	stimulus: getStim,
	is_html: true,
	data: {exp_id: "gmParadigm", "trial_id": "learning"},
	choices: [32],
	timing_stim: 1500,
	timing_response:1500, 
	on_finish: appendData,
	response_ends_trial: false,

	}
practiceTrials.push(practiceBlock);
practiceTrials.push(rewardBlock);
}

var learning_chunk = {
    chunk_type: 'while',
    timeline: practiceTrials,
	continue_function: function(data){
	numLearningBlocks = numLearningBlocks +1
	var totalTrials = 0
	var totalCorrect = 0
	if(numLearningBlocks<=2){
	for(learning = 0; learning<data.length; learning++){
		if(data[learning].condition!= undefined){
		totalTrials = totalTrials +1
			if(data[learning].key_press == data[learning].correct_response){
			totalCorrect = totalCorrect +1
			}
  		}
  	}
	firstPhaseStimsComplete = jsPsych.randomization.repeat(firstPhaseStims, learningNumTrials/8, true);
	learning_feedback_text = '</p><p class = block-text> Your accuracy is: '+ (totalCorrect/totalTrials)*100+'%'+ '<br><br>Remember the rules associated with each color are as follows: <br>'+startTestPrompt+'<br> .'	
	currTrial = 0
	return true
	} else if (numLearningBlocks==numLearningBlocksTotal){
	learning_feedback_text = '</p><p class = block-text> Done with Phase 1. </p><p class = block-text> Press <strong>enter</strong> to continue.'	
	return false
	}
  }
}
/*	var totalTrials = 0
	var totalCorrect = 0
	for(learning = 0; learning<data.length; learning++){
		if(data[learning].condition!= undefined){
		totalTrials = totalTrials +1
			if(data[learning].key_press == data[learning].correct_response){
			totalCorrect = totalCorrect +1
			}
  		}
  	}
	if(totalCorrect/totalTrials >= learning_accuracy_thresh){
	return false
	} else if(totalCorrect/totalTrials < learning_accuracy_thresh){
	firstPhaseStimsComplete = jsPsych.randomization.repeat(firstPhaseStims, learningNumTrials/8, true);
	learning_feedback_text += '</p><p class = block-text> Remember the rules associated with each color are as follows: <br>'+startTestPrompt+'<br> .'	
	currTrial = 0
	return true
	} */



/******************** Practice block with SS, and neutral colors ************************/

var practiceStopTrials = []
for(i=0;i<12;i++){
	practiceStopTrials.push(fixationBlock)
var practiceStop = {
	type: 'poldrack-single-stim',
	stimulus: getPracticeStopStim,
	is_html: true,
	data: {exp_id: "gmParadigm", "trial_id": "learning"},
	choices: [77,90],
	timing_stim: 850,
	timing_response:1850,
	on_finish: appendPracticeGoData,
	response_ends_trial: false,
	 
	}
	practiceStopTrials.push(practiceStop)
}
practiceStopCount = 0
var practiceStopChunk = {
	chunk_type: 'while',
	timeline: practiceStopTrials,
	continue_function: function(data){
	practiceStopCount = practiceStopCount +1
	if(practiceStopCount == 1){
	var sum_rt = 0
    var sum_correct = 0
    var tot_trials = 0
	var num_responses =0
        for(var i=0; i < data.length; i++){
            if (data[i].condition == "neutral") {
            	tot_trials += 1
            	if(data[i].key_press!=-1){
            		sum_rt += data[i].rt
            		num_responses += 1
            			if (data[i].key_press == data[i].correct_response[1]){
            			sum_correct += 1
            			}
            	}
            }
        }
        var average_rt = sum_rt / num_responses;
        var average_correct = sum_correct / tot_trials;
        practice_feedback_text = "Average reaction time:  " + Math.round(average_rt) + " ms. Accuracy: " + Math.round(average_correct*100) + "%"
        if (average_correct<accuracy_thresh) {
            practice_feedback_text += '</p><p class = block-text>Remember, the correct responses for each shape are as follows: <br><br>'+zmprompt_text
        } else if (average_rt > RT_thresh) {
            practice_feedback_text += '</p><p class = block-text>Remember to respond quickly to each shape.'
        }
        practiceStopCount2 = practiceStopCount2+1
        if(practiceStopCount2==1){
        return false;
        } 
      }
   }
}

	


var phase2_trials = []
for (i = 0; i < 12; i++) { 
	phase2_trials.push(fixationBlock)
	var stim_data = $.extend({},secondPhaseStimsComplete.data[i])
    var stop_signal_block = {
	  type: 'stop-signal',
	  stimuli: getSSPracticeStim,
	  SS_stimulus: stop_signal,
	  SS_trial_type: getSSPractice_trial_type,
	  data: getSSPracticeData,
	  is_html: true,
	  choices: [77,90],
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

/* Practice chunk continues repeating until the subject reaches certain criteria */
var practice_chunk = {
    chunk_type: 'while',
    timeline: phase2_trials,
	/* This function defines stopping criteria */
    continue_function: function(data){
        var sum_rt = 0;
        var sum_correct = 0;
        var go_length = 0;
		var num_responses = 0;
		var stop_length = 0
		var successful_stops = 0
        for(var i=0; i < data.length; i++){
            if (data[i].SS_trial_type == "go") {
            	go_length += 1
				if (data[i].rt != -1) {
					num_responses += 1
					sum_rt += data[i].rt;
					if (data[i].key_press == data[i].correct_response[1]) { sum_correct += 1 }
				}/*else if (data[i+1].rt != -1) {
					num_responses += 1
					sum_rt += (850 + data[i+1].rt);
					if (data[i+1].key_press == data[i].correct_response) { sum_correct += 1 }
				}*/
				 
            } else if (data[i].SS_trial_type == "stop"){
				stop_length +=1
				if (data[i].rt == -1) {
					successful_stops +=1
				}
			}
        }
        var average_rt = sum_rt / num_responses;
        var average_correct = sum_correct / go_length;
		var missed_responses = (go_length - num_responses) / go_length
		var stop_percent = successful_stops/stop_length
        practice_feedback_text = "Average reaction time:  " + Math.round(average_rt) + " ms. Accuracy: " + Math.round(average_correct*100) + "%"
        practiceStopCount2 = practiceStopCount2+1
        if(practiceStopCount2==1){
            // end the loop
			practice_feedback_text += '</p><p class = block-text>Done with practice. We will now begin the test blocks.  Press <strong>enter</strong> to continue.' 
            if (average_rt > RT_thresh) {
                practice_feedback_text += '</p><p class = block-text>Remember, try to respond as quickly and accurately as possible when no stop signal occurs.'
            } 
            if (average_correct<accuracy_thresh) {
            practice_feedback_text += '</p><p class = block-text>Remember, the correct responses for each shape are as follows: <br><br>'+zmprompt_text
			}
			if (missed_responses >= missed_response_thresh) {
			    practice_feedback_text += '</p><p class = block-text>Remember to respond to each shape unless you see the stop signal.'
			}
			 if (stop_percent == 0) {
		        practice_feedback_text += '</p><p class = block-text> Remember to try to withhold your response when you see a stop signal.'
		    }
            return false;
        } 
    }
}


/********************* Practice block with SS, and ALL colors *********************/
var phase3_trials = []
phase3_trials.push(stop_feedback_block)
for (i = 0; i < 75; i++) {
	phase3_trials.push(fixationBlock)
	var stim_data = $.extend({},practice_trial_data)
    var stop_signal_block = {
	  type: 'stop-signal',
	  stimuli: getSSPracticeStim3,
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
	phase3_trials.push(stop_signal_block)
} 



/* Practice chunk continues repeating until the subject reaches certain criteria */
var test_chunk = {
    chunk_type: 'while',
    timeline: phase3_trials,
	/* This function defines stopping criteria */
    continue_function: function(data){
		var sum_rt = 0;
        var sum_correct = 0;
        var go_length = 0;
		var num_responses = 0;
		var stop_length = 0
		var successful_stops = 0
        for(var i=0; i < data.length; i++){
            if (data[i].SS_trial_type == "go") {
            	go_length += 1
				if (data[i].rt != -1) {
					num_responses += 1
					sum_rt += data[i].rt;
					if (data[i].key_press == data[i].correct_response[1]) { sum_correct += 1 }
				}/*else if (data[i+1].rt != -1) {
					num_responses += 1
					sum_rt += (850 + data[i+1].rt);
					if (data[i+1].key_press == data[i].correct_response) { sum_correct += 1 }
				}*/
				 
            } else if (data[i].SS_trial_type == "stop"){
				stop_length +=1
				if (data[i].rt == -1) {
					successful_stops +=1
				}
			}
        }
        var average_rt = sum_rt / num_responses;
        var average_correct = sum_correct / go_length;
		var missed_responses = (go_length - num_responses) / go_length
		var stop_percent = successful_stops/stop_length
        practice_feedback_text = "Average reaction time:  " + Math.round(average_rt) + " ms. Accuracy: " + Math.round(average_correct*100) + "%"
		 
		 stopCount = stopCount + 1
		 if(stopCount == 6){
		 return false
		 } else {
		 exp_len = 75
		 stop_percent = (1/3)
		 stim_colors = [0,1,2,3,8]
		 stims = []
		 var num_stims = exp_len/stim_colors.length
			for (var c = 0; c < stim_colors.length; c++) {
				var stop_trials = jsPsych.randomization.repeat(['stop','go','go'], num_stims/3)
				var stop_colors = [4,5,6,7,9]
					for (var s = 0; s< num_stims; s++) {
						if (stop_trials[s] == 'stop') {
							var stim = {'color': stim_colors[c], 'trial': stop_trials[s], 'stop_color': stop_colors.pop()}
						} else {
							var stim = {'color': stim_colors[c], 'trial': stop_trials[s], 'stop_color': 'NA'}
						}
					stims.push(stim)
					}
			}
		a=jsPsych.randomization.repeat(stims,1,true)
		tempShape=jsPsych.randomization.repeat([1,2,3,4],18)
		tempShape.push(Math.floor(Math.random()*4+1))
		tempShape.push(Math.floor(Math.random()*4+1))
		tempShape.push(Math.floor(Math.random()*4+1))
		stop_feedback_text = "Average reaction time:  " + Math.round(average_rt) + " ms. Accuracy: " + Math.round(average_correct*100) + "%" 
		if(stopCount == 1){
		stop_feedback_text += '</p><p class = block-text><strong>Please Get the Experimenter.</strong> We will begin another round shortly.'
        } else {
        stop_feedback_text += '</p><p class = block-text>We will begin another round.  Press <strong>enter</strong> to begin.'
        }
            if (average_rt > RT_thresh) {
                stop_feedback_text += '</p><p class = block-text>Remember, try to respond as quickly and accurately as possible when no stop signal occurs.'
            }
			if (missed_responses >= missed_response_thresh) {
			    stop_feedback_text += '</p><p class = block-text>Remember to respond to each shape unless you see the stop signal.'
			}
			 if (stop_percent == 0) {
		        stop_feedback_text += '</p><p class = block-text> Remember to try to withhold your response when you see a stop signal.'
		    }
		     if(average_correct<accuracy_thresh){
		    	stop_feedback_text += '</p><p class = block-text> Remember, the correct responses for each shape are as follows: <br>'+ zmprompt_text 
		    }
			currTrial = 0
			return true
		}
	}
}     
    



gm_paradigm_experiment.push(welcome_block)
gm_paradigm_experiment.push(instructions_block)

gm_paradigm_experiment.push(pre_practice_learning_block1)
gm_paradigm_experiment.push(start_practice)
gm_paradigm_experiment.push(learning_chunk1)
gm_paradigm_experiment.push(learning_chunk1_2)

gm_paradigm_experiment.push(pre_practice_learning_block2)
gm_paradigm_experiment.push(start_practice)
gm_paradigm_experiment.push(learning_chunk2)
gm_paradigm_experiment.push(learning_chunk2_2)


gm_paradigm_experiment.push(pre_practice_learning_block3)
gm_paradigm_experiment.push(start_practice)
gm_paradigm_experiment.push(learning_chunk3)
gm_paradigm_experiment.push(learning_chunk3_2)


gm_paradigm_experiment.push(pre_practice_learning_block4)
gm_paradigm_experiment.push(start_practice)
gm_paradigm_experiment.push(learning_chunk4)
gm_paradigm_experiment.push(learning_chunk4_2)


gm_paradigm_experiment.push(pre_practice_learning_block5)
gm_paradigm_experiment.push(start_practice)
gm_paradigm_experiment.push(learning_chunk5)
gm_paradigm_experiment.push(learning_chunk5_2)


gm_paradigm_experiment.push(pre_practice_learning_block6)
gm_paradigm_experiment.push(start_practice)
gm_paradigm_experiment.push(learning_chunk6)
gm_paradigm_experiment.push(learning_chunk6_2)


gm_paradigm_experiment.push(pre_practice_learning_block7)
gm_paradigm_experiment.push(start_practice)
gm_paradigm_experiment.push(learning_chunk7)
gm_paradigm_experiment.push(learning_chunk7_2)


gm_paradigm_experiment.push(pre_practice_learning_block8)
gm_paradigm_experiment.push(start_practice)
gm_paradigm_experiment.push(learning_chunk8)
gm_paradigm_experiment.push(learning_chunk8_2)





gm_paradigm_experiment.push(start_test)
gm_paradigm_experiment.push(learning_chunk)
gm_paradigm_experiment.push(reset_Gap)
gm_paradigm_experiment.push(learning_feedback_block)

gm_paradigm_experiment.push(stop_intro)
gm_paradigm_experiment.push(practiceStopChunk)
gm_paradigm_experiment.push(practice_feedback_block);
gm_paradigm_experiment.push(stop_intro2)
gm_paradigm_experiment.push(practice_chunk)
gm_paradigm_experiment.push(practice_feedback_block);
gm_paradigm_experiment.push(reset_SSD)
gm_paradigm_experiment.push(reset_Gap)



gm_paradigm_experiment.push(main_stop_intro1)
gm_paradigm_experiment.push(test_chunk)
gm_paradigm_experiment.push(reset_Gap)

gm_paradigm_experiment.push(forced_choice_intro)
for(forcedChoice=0;forcedChoice<45;forcedChoice++){
gm_paradigm_experiment.push(fixationBlock)
gm_paradigm_experiment.push(forced_choice_block)
} 
gm_paradigm_experiment.push(forced_choice_intro_break)
for(forcedChoice=0;forcedChoice<45;forcedChoice++){
gm_paradigm_experiment.push(fixationBlock)
gm_paradigm_experiment.push(forced_choice_block2)
}