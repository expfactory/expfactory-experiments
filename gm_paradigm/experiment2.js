
/* ************************************ */
/* Define helper functions */
/* ************************************ */
function getDisplayElement() {
    $('<div class = display_stage_background></div>').appendTo('body')
    return $('<div class = display_stage></div>').appendTo('body')
}

/////practice learning phase functions

var practiceCount = 0
var getPracticePrompt = function (){
	if(practiceCount === 0){
	temp = '<div class = centerbox><p class = block-text>We will now practice some trials for the <strong>'+ colors[practiceCount]+' square.</strong> These trials will be identical to the main Phase 1 task except the action and outcome will only be presented to you in these practice trials so you must commit them to memory before the main Phase 1 task.</p><p class = block-text>Please try both pressing the spacebar and pressing nothing to see the different outcomes for each action.</p><p class = block-text>Press <strong>enter</strong> to continue</p></div>',
	practiceCount=practiceCount+1
	return temp
	} else if (practiceCount ==1){
	temp = '<div class = centerbox><p class = block-text>We will now practice some trials for the <strong>'+ colors[practiceCount]+' square.</strong> These trials will be identical to the main Phase 1 task except the action and outcome will only be presented to you in these practice trials so you must commit them to memory before the main Phase 1 task.</p><p class = block-text>Please try both pressing the spacebar and pressing nothing to see the different outcomes for each action.</p><p class = block-text>Press <strong>enter</strong> to continue</p></div>',
	practiceCount= practiceCount+1
	return temp
	}else if (practiceCount ==2){
	temp = '<div class = centerbox><p class = block-text>We will now practice some trials for the <strong>'+ colors[practiceCount]+' square.</strong> These trials will be identical to the main Phase 1 task except the action and outcome will only be presented to you in these practice trials so you must commit them to memory before the main Phase 1 task.</p><p class = block-text>Please try both pressing the spacebar and pressing nothing to see the different outcomes for each action.</p><p class = block-text>Press <strong>enter</strong> to continue</p></div>',
	practiceCount= practiceCount+1
	return temp
	}else if (practiceCount ==3){
	temp = '<div class = centerbox><p class = block-text>We will now practice some trials for the <strong>'+ colors[practiceCount]+' square.</strong> These trials will be identical to the main Phase 1 task except the action and outcome will only be presented to you in these practice trials so you must commit them to memory before the main Phase 1 task.</p><p class = block-text>Please try both pressing the spacebar and pressing nothing to see the different outcomes for each action.</p><p class = block-text>Press <strong>enter</strong> to continue</p></div>',
	practiceCount= practiceCount+1
	return temp
	}else if (practiceCount ==4){
	temp = '<div class = centerbox><p class = block-text>We will now practice some trials for the <strong>'+ colors[practiceCount]+' square.</strong> These trials will be identical to the main Phase 1 task except the action and outcome will only be presented to you in these practice trials so you must commit them to memory before the main Phase 1 task.</p><p class = block-text>Please try both pressing the spacebar and pressing nothing to see the different outcomes for each action.</p><p class = block-text>Press <strong>enter</strong> to continue</p></div>',
	practiceCount= practiceCount+1
	return temp
	}else if (practiceCount ==5){
	temp = '<div class = centerbox><p class = block-text>We will now practice some trials for the <strong>'+ colors[practiceCount]+' square.</strong> These trials will be identical to the main Phase 1 task except the action and outcome will only be presented to you in these practice trials so you must commit them to memory before the main Phase 1 task.</p><p class = block-text>Please try both pressing the spacebar and pressing nothing to see the different outcomes for each action.</p><p class = block-text>Press <strong>enter</strong> to continue</p></div>',
	practiceCount= practiceCount+1
	return temp
	}else if (practiceCount ==6){
	temp = '<div class = centerbox><p class = block-text>We will now practice some trials for the <strong>'+ colors[practiceCount]+' square.</strong> These trials will be identical to the main Phase 1 task except the action and outcome will only be presented to you in these practice trials so you must commit them to memory before the main Phase 1 task.</p><p class = block-text>Please try both pressing the spacebar and pressing nothing to see the different outcomes for each action.</p><p class = block-text>Press <strong>enter</strong> to continue</p></div>',
	practiceCount= practiceCount+1
	return temp
	}else if (practiceCount ==7){
	temp = '<div class = centerbox><p class = block-text>We will now practice some trials for the <strong>'+ colors[practiceCount]+' square.</strong> These trials will be identical to the main Phase 1 task except the action and outcome will only be presented to you in these practice trials so you must commit them to memory before the main Phase 1 task.</p><p class = block-text>Please try both pressing the spacebar and pressing nothing to see the different outcomes for each action.</p><p class = block-text>Press <strong>enter</strong> to continue</p></div>',
	practiceCount = 0
	return temp
	}
}

var practiceCount2=0
var getPracticeLearning = function(){
	tempRule=practiceLearningText[practiceCount2]
	tempStims=practiceLearningStims[practiceCount2]
	practiceCount2=practiceCount2+1
	return prompt_practice_text_heading1 + tempRule  + tempStims.image
}

var practiceCount3=0
var getPracticeLearningStim = function(){
	tempStims=practiceLearningStims[practiceCount3]
	currData = tempStims.data
	tempRulePrompt = practicePrompts[practiceCount3]
	return tempStims.image + tempRulePrompt
}



/* ************************************ */
/* Define experimental variables */
/* ************************************ */





///////////    THIS IS FOR PRACTICE LEARNING TEXTS    //////////////

var practiceLearningText = ['  <br><br>Each time you see the <strong>'+colors[0]+' '+shapes[0]+'</strong>, you should <strong>press the space bar</strong> to earn 25 cents. You should not press nothing, as this will result in earning 0 cents.  <br><br> Press <strong>enter</strong> to continue',
							'  <br><br>Each time you see the <strong>'+colors[1]+' '+shapes[0]+'</strong>, you should <strong>press the space bar</strong> to lose 0 cents.  You should not press the space bar, as this will result in losing 25 cents.  <br><br> Press <strong>enter</strong> to continue',
							'  <br><br>Each time you see the <strong>'+colors[2]+' '+shapes[0]+'</strong>, you should <strong>do nothing</strong> to gain 25 cents.  You should  not press the space bar, as this will result in gaining 0 cents.  <br><br> Press <strong>enter</strong> to continue',
							'  <br><br>Each time you see the <strong>'+colors[3]+' '+shapes[0]+'</strong>, you should <strong>do nothing</strong> to lose 0 cents.  You should not act, as this will result in losing 25 cents.  <br><br> Press <strong>enter</strong> to continue',
							'  <br><br>Each time you see the <strong>'+colors[4]+' '+shapes[0]+'</strong>, you should <strong>press the space bar</strong> to earn 25 cents.  You should not press nothing, as this will result in earning 0 cents.  <br><br> Press <strong>enter</strong> to continue',
			  			    '  <br><br>Each time you see the <strong>'+colors[5]+' '+shapes[0]+'</strong>, you should <strong>press the space bar</strong> to lose 0 cents.  You should not press nothing, as this will result in losing 25 cents.  <br><br> Press <strong>enter</strong> to continue',
			   				'  <br><br>Each time you see the <strong>'+colors[6]+' '+shapes[0]+'</strong>, you should <strong>do nothing</strong> to gain 25 cents.  You should not press the space bar, as this will result in gaining 0 cents.  <br><br> Press <strong>enter</strong> to continue',
							'  <br><br>Each time you see the <strong>'+colors[7]+' '+shapes[0]+'</strong>, you should <strong>do nothing</strong> to lose 0 cents.  You should not act, as this will result in losing 25 cents.  <br><br> Press <strong>enter</strong> to continue']



var prompt_practice_text_heading1 = '<div><p><strong>This is one of the colors that you will see.</strong></p>'
var prompt_practice_text_heading2 = '  We will take a look at all colors associated with the rules.</p><p>Press <strong>Enter</strong> to move to the next page.</div>'



var practiceLearningStims= [{image: preFileType+pathSource+ stim1 +fileType+postFileType, data: {exp_id: 'gmParadigm', stimulus: stim1, correct_response: correct_responses[3], condition: conditions[0]}},
					  	    {image: preFileType+pathSource+ stim2 +fileType+postFileType, data: {exp_id: 'gmParadigm', stimulus: stim2, correct_response: correct_responses[3], condition: conditions[1]}},
					  	    {image: preFileType+pathSource+ stim3 +fileType+postFileType, data: {exp_id: 'gmParadigm', stimulus: stim3, correct_response: correct_responses[2], condition: conditions[2]}},
					  	    {image: preFileType+pathSource+ stim4 +fileType+postFileType, data: {exp_id: 'gmParadigm', stimulus: stim4, correct_response: correct_responses[2], condition: conditions[3]}},
 					  	    {image: preFileType+pathSource+ stim5 +fileType+postFileType, data: {exp_id: 'gmParadigm', stimulus: stim5, correct_response: correct_responses[3], condition: conditions[0]}},
					  	    {image: preFileType+pathSource+ stim6 +fileType+postFileType, data: {exp_id: 'gmParadigm', stimulus: stim6, correct_response: correct_responses[3], condition: conditions[1]}},
					 	    {image: preFileType+pathSource+ stim7 +fileType+postFileType, data: {exp_id: 'gmParadigm', stimulus: stim7, correct_response: correct_responses[2], condition: conditions[2]}},
							{image: preFileType+pathSource+ stim8 +fileType+postFileType, data: {exp_id: 'gmParadigm', stimulus: stim8, correct_response: correct_responses[2], condition: conditions[3]}}]


var practicePrompts = ['<ul list-text><li><strong>'+colors[0]+'</strong>: '+ correct_responses[3][0] + ' ('+practiceConditions[0]+')'+ '</li>',
 					   '<ul list-text><li><strong>'+colors[1]+'</strong>: '+ correct_responses[3][0] + ' ('+practiceConditions[1]+')'+ '</li>',
					   '<ul list-text><li><strong>'+colors[2]+'</strong>: '+ correct_responses[2][0] + ' ('+practiceConditions[2]+')'+ '</li>',
					   '<ul list-text><li><strong>'+colors[3]+'</strong>: '+ correct_responses[2][0] + ' ('+practiceConditions[3]+')'+ '</li>',
					   '<ul list-text><li><strong>'+colors[4]+'</strong>: '+ correct_responses[3][0] + ' ('+practiceConditions[0]+')'+ '</li>',
					   '<ul list-text><li><strong>'+colors[5]+'</strong>: '+ correct_responses[3][0] + ' ('+practiceConditions[1]+')'+ '</li>',
					   '<ul list-text><li><strong>'+colors[6]+'</strong>: '+ correct_responses[2][0] + ' ('+practiceConditions[2]+')'+ '</li>',
					   '<ul list-text><li><strong>'+colors[7]+'</strong>: '+ correct_responses[2][0] + ' ('+practiceConditions[3]+')'+ '</li>']


var subjectID=115
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
var preFileTypeReward = "<img class = center src='"

var forcedChoiceType="<div class = decision-left><img src='"
var forcedChoiceType2="<div class = decision-right><img src='"

var preFileStopType = "<img class = center src='"
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
var missed_response_thresh = 0.05

var practiceConditions = ['Press space bar to earn 25 cents','Press space bar to avoid losing 25 cents','Press nothing to earn 25 cents','Press nothing to avoid losing 25 cents']

var startTestPrompt = '<ul list-text><li><strong>'+colors[0]+'</strong>: '+ correct_responses[3][0] + ' ('+practiceConditions[0]+')'+ '</li><li><strong>'+colors[1]+':</strong> '+ correct_responses[3][0] +' ('+practiceConditions[1]+')'+'</li><li><strong>'+colors[4]+':</strong> '+ correct_responses[3][0] + ' ('+practiceConditions[0]+')'+'</li><li><strong>'+colors[5]+':</strong> '+ correct_responses[3][0] + ' ('+practiceConditions[1]+')'+'</li><li><strong>'+colors[6]+':</strong> '+ correct_responses[2][0] + ' ('+practiceConditions[2]+')'+'</li><li><strong>'+colors[7]+': </strong>'+correct_responses[2][0]+ ' ('+practiceConditions[3]+')'+'</li><li><strong>'+colors[2]+': </strong>'+ correct_responses[2][0] + ' ('+practiceConditions[2]+')'+'</li><li><strong>'+colors[3]+': </strong>'+correct_responses[2][0]+' ('+practiceConditions[3]+')'+'</li></ul>'

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

tempCombo = []
for(i=1;i<10;i++){
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
combos1SStype=[]
combos2SStype=[]

for(i=0;i<45; i++){
	uniqueCombo = tempCombo.pop()
	whichColor = uniqueCombo[0]-1
	whichColor2= uniqueCombo[1]-1
	ChoiceCombos1.push([colors[whichColor]+'_square', colors[whichColor2]+'_square'])
	
	colorNum=whichColor
	colorNum2=whichColor2
	if(colorNum<4){
		tempCond = conditions[colorNum]
		tempSStype = "go"
	} else if(colorNum==4||colorNum==5||colorNum==6||colorNum==7){
		tempColorNum=colorNum-4
		tempCond = conditions[tempColorNum]
		tempSStype = "stop"
	} else if(colorNum==8){
		tempCond=conditions[4]
		tempSStype = "go"
	} else if(colorNum==9){
		tempSStype = "stop"
		tempCond=conditions[4]
	}

	
	if(colorNum2<4){
		tempCond2 = conditions[colorNum2]
		tempSStype2 = "go"
	} else if(colorNum2==4||colorNum2==5||colorNum2==6||colorNum2==7){
		tempColorNum2=colorNum2-4
		tempCond2 = conditions[tempColorNum2]
		tempSStype2 = "stop"
	} else if(colorNum2==8){
		tempCond2=conditions[4]
		tempSStype2 = "go"
 	} else if(colorNum2==9){
 		tempCond2=conditions[4]
		tempSStype2 = "stop"

 	}
	
	combos1Data.push([tempCond,tempCond2])
	combos1SStype.push([tempSStype,tempSStype2])
	///
	
	uniqueCombo2 = tempCombo2.pop()
	whichColor_1 = uniqueCombo2[0]-1
	whichColor2_1= uniqueCombo2[1]-1
	ChoiceCombos2.push([colors[whichColor_1]+'_square', colors[whichColor2_1]+'_square'])
	
	colorNum_1=whichColor_1
	colorNum_2=whichColor2_1
	if(colorNum_1<4){
		tempCond = conditions[colorNum_1]
		tempSStype = "go"
	} else if(colorNum_1==4||colorNum_1==5||colorNum_1==6||colorNum_1==7){
		tempColorNum=colorNum_1-4
		tempCond = conditions[tempColorNum]
		tempSStype = "stop"
	} else if(colorNum_1==8){
		tempSStype = "go"
		tempCond=conditions[4]
	} else if(colorNum_1==9){
		tempSStype = "stop"
		tempCond=conditions[4]
	}


	if(colorNum_2<4){
		tempCond2 = conditions[colorNum_2]
		tempSStype2 = "go"
	} else if(colorNum_2==4||colorNum_2==5||colorNum_2==6||colorNum_2==7){
		tempColorNum2=colorNum_2-4
		tempCond2 = conditions[tempColorNum2]
		tempSStype2 = "stop"
	} else if(colorNum_2==8){
		tempCond2=conditions[4]
		tempSStype2 = "go"
	} else if(colorNum_2==9){
		tempCond2=conditions[4]
		tempSStype2 = "stop"
	}
	combos2Data.push([tempCond,tempCond2])
	combos2SStype.push([tempSStype,tempSStype2])

}


/* ************************************ */
/* Set up jsPsych blocks */
/* ************************************ */
/* define static blocks */
	
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
  text: preFileType+pathSource+'green_circle'+fileType+postFileType+preFileTypeReward+pathSource+'minus_25'+fileType+postFileType+'<div class = fixation-gmParadigm><span style="color:red">+</span></div>',
  cont_key: [13],
  timing_post_trial: 0,
};


var instructions_block = {
  type: 'poldrack-instructions',
  pages: [
	'<div class = centerbox><p class = center-block-text>This experiment is composed of 3 phases.</p></div>',
	'<div class =centerbox><p class = center-block-text>Your goal for the first phase is to try to maximize your earnings by choosing to press the space bar or not based upon the presentation of 8 different colored squares.  Each of the eight colors will be rewarded according to one of the following four reward schedules:</p><p class =block-text>'+ 
	'<ul list-text><li> 1) <strong> Press space bar to gain 25 cents:</strong> Press nothing to gain 0 cents. </li><li> 2) <strong> Press space bar to lose 0 cents: </strong>Press nothing to lose 25 cents.</li><li> 3)<strong> Press nothing to gain 25 cents: </strong>Press space bar to gain 0 cents. </li><li>4) <strong> Press nothing to lose 0 cents: </strong> Press space bar to lose 25 cents</li></ul></p>'+
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
  data: {exp_id: "gm_paradigm", "trial_id": "pre-learning"},
  timing_post_trial: 0,
  timing_stim: -1,
  timing_response: -1,
};



var start_test = {
  type: 'poldrack-single-stim',
  stimulus: '<div class = centerbox><p class = block-text>We will now start phase 1 of the experiment.  For these trials, the rules associated with each color are as follows: </p><p class = block-text>'+startTestPrompt+'</p><p class = block-text> Make sure that you remember these rules before you move on to the test.</p></div>',
  is_html: true,
  choices: [49],
  data: {exp_id: "gm_paradigm", "trial_id": "learning_intro (phase 1)"},
  timing_post_trial: 0,
  timing_stim: -1,
  timing_response: -1,
};

var stop_intro = {
  type: 'poldrack-single-stim',
  stimulus: '<div class = centerbox><p class = block-text>We will now start the practice for phase 2 of the experiment.<br><br>For these trials, you must press the <strong> Z key </strong> or the <strong> M key </strong> depending on the shape of the stimulus.  Make sure to respond as quickly and accurately as possible to the shape. <br><br> The responses for each shape are as follows: ' + zmprompt_text+  '</p><p class = block-text>Remember these rules before you proceed, as they will not be presented during the trial.</p></div>',
  is_html: true,
  choices: [49],
  data: {exp_id: "gm_paradigm", "trial_id": "stop_intro (phase 2)"},
  timing_post_trial: 0,
  timing_stim: -1,
  timing_response: -1,
};

var stop_intro2 = {
  type: 'poldrack-single-stim',
  stimulus: '<div class = centerbox><p class = block-text>These trials will be similar to the trials you have just completed.  Again, please respond to the shape of the stimulus. <br><br> On a subset of trials, a star will appear around the shape, when this happens please try your best to stop your response and press nothing. Do not slow your responses to the shape to achieve this. <br><br>The responses for each shape are as follows: ' + zmprompt_text+  '</p><p class =block-text>Remember these rules before you proceed, as they will not be presented during the trial.</p></div>',
  is_html: true,
  choices: [49],
  data: {exp_id: "gm_paradigm", "trial_id": "stop_intro (phase 2)"},
  timing_post_trial: 0,
  timing_stim: -1,
  timing_response: -1,
};


var main_stop_intro1 = {
  type: 'poldrack-single-stim',
  stimulus: '<div class = centerbox><p class = block-text>We will now start Phase 2 of the experiment.<br><br>These trials are similar to the trials that you have just completed.  Like last time, on a subset of trials a star will appear around the shape, when this happens please try your best to stop your response and press nothing. Do not slow your responses to the shape to achieve this.<br><br>The rules for each shape are as follows:  <br>'+zmprompt_text+'</p><p class = block-text>Remember these rules before you proceed.</p><p class = block-text>Press <strong> enter</strong> to begin.</p></div>',
  is_html: true,
  choices: [13],
  data: {exp_id: "gm_paradigm", "trial_id": "main_stop_intro (phase 3)"},
  timing_post_trial: 0,
  timing_stim: -1,
  timing_response: -1,
};



var forced_choice_intro = {
  type: 'poldrack-single-stim',
  stimulus: '<div class = centerbox><p class = block-text>We will now start phase 3 of the experiment.<br><br>In this part of the experiment, you will see two color patches presented on each trial, one on the left side of the screen and the other on the right. You will choose the color which you find more rewarding by pressing either the left or right arrow key to correspond with the left or right color patch, respectively.</p></div>',
  is_html: true,
  choices: [49],
  data: {exp_id: "gm_paradigm", "trial_id": "forced_choice_intro"},
  timing_post_trial: 0,
  timing_stim: -1,
  timing_response: -1,
};

var forced_choice_intro_break = {
  type: 'poldrack-single-stim',
  stimulus: '<div class = centerbox><p class = block-text>We will now take a short break.  <br><br>Press <strong>enter</strong> to continue.</p></div>',
  is_html: true,
  choices: [13],
  data: {exp_id: "gm_paradigm", "trial_id": "forced_choice_intro"},
  timing_post_trial: 0,
  timing_stim: -1,
  timing_response: -1,
};


var forced_choice_block = {
  type: 'poldrack-single-stim',
  stimulus: getCombo,
  is_html: true,
  choices: [37,39],
  data: {exp_id: "gm_paradigm", "trial_id": "forced_choice"},
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
  data: {exp_id: "gm_paradigm", "trial_id": "forced_choice"},
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
  data: {exp_id: "gm_paradigm", "trial_id": "reward"},
  timing_post_trial: 0,
  timing_stim: 1500,
  timing_response: 1500,
  on_finish: appendRewardData,

};



var practice_feedback_text = 'We will now start with a practice session. In this practice  concentrate on responding quickly and accurately to each stimuli. Press <strong>enter</strong> to continue.'
var practice_feedback_block = {
  type: 'text',
  cont_key: [13],
  text: getPracticeFeedback,
    timing_post_trial: 0,

};

var practice_feedback_text2 = 'We will now start with a practice session. In this practice  concentrate on responding quickly and accurately to each stimuli. Press <strong>enter</strong> to continue.'
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
  data: {exp_id: "gm_paradigm", "trial_id": "prompt"},
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
  data: {exp_id: "gm_paradigm", "trial_id": "Learning Phase Instructions"},
  timing_post_trial: 0,
  timing_stim: -1,
  timing_response: -1,
};

subjectTrialsStim1 = []
for(i=0;i<1;i++){
subjectTrialsStim1.push(fixationBlock)
	var subjectPracticeTrials1 = {
	type: 'poldrack-single-stim',
	stimulus: getPracticeLearningStim,
	is_html: true,
	data: {exp_id: "gm_paradigm", "trial_id": "practice-learning"},
	choices: [32],
	timing_stim: 1500,
	timing_response:1500, 
	timing_post_trial: 0,
	on_finish: appendData2,
	response_ends_trial: false,
	}
subjectTrialsStim1.push(subjectPracticeTrials1)
subjectTrialsStim1.push(rewardBlock2)

}

var learning_node1 = {
    timeline: subjectTrialsStim1,
	loop_function: function(data){
	if(data[1].key_press==32 || data[1].key_press == -1){
		whichKey1=data[1].key_press	
		 return false
	}else {
	return true
	}
}
}

var learning_node1_2 = {
    timeline: subjectTrialsStim1,
	loop_function: function(data){
	if(data[1].key_press!=whichKey1){
		currTrial = 0
		practiceCount3=practiceCount3+1
		return false
	}else {
	return true
	}
}
}

/* create experiment definition array */
var gm_paradigm_experiment = [];
gm_paradigm_experiment.push(welcome_block)
gm_paradigm_experiment.push(instructions_block)
for(i=0;i<8;i++){
gm_paradigm_experiment.push(pre_practice_learning_block)
gm_paradigm_experiment.push(start_practice)
gm_paradigm_experiment.push(learning_node1)
gm_paradigm_experiment.push(learning_node1_2)
}

