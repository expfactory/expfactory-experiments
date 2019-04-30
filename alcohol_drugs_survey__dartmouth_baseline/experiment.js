/* ************************************ */
/*       Define Helper Functions        */
/* ************************************ */


function getDisplayElement() {
    $('<div class = display_stage_background></div>').appendTo('body')
    return $('<div class = display_stage></div>').appendTo('body')
}

function addID() {
  jsPsych.data.addDataToLastTrial({exp_id: 'alcohol_drugs_survey__dartmouth_baseline'})
}
var conditional_length_counter = 0
var getQuestions = function(){
	survey_question = survey_questions.shift()
	button_info = button_text.shift()
	fatal_response = fatal_responses.shift()
	conditional_response = conditional_responses.shift()
	question_type = question_types.shift()
	item_name = item_names_dartmouth.shift()
	conditional_length = conditional_lengths.shift()
	buttonText = button_info[0]
	numButtons = button_info[1]
	buttonBoard2 = createButtonBoard2(numButtons,buttonText)
	
	//if subject makes fatal or conditional response on previous question, set time == 1.  
	//doing the above skips the upcoming question
	skip_question = 1
	do_not_skip_question = 180000
	
	if ((sub_made_fatal_response === 0) && (sub_made_conditional_response == -1)){
		whichTime = do_not_skip_question
	}
	
	if (sub_made_fatal_response == 1){
		whichTime = skip_question
	}
	if (sub_made_conditional_response == 1){
		sub_made_conditional_response = -1
		whichTime = do_not_skip_question
	} else if (sub_made_conditional_response === 0){
		conditional_length_counter += 1
		whichTime = skip_question
			if (conditional_length_counter == conditional_length_index){
				sub_made_conditional_response = -1
				conditional_length_counter = 0
			}
	}
	
	if (survey_question == 'In the past 30 days, what tobacco products OTHER THAN cigarettes have you used? <br>(check all that apply - <strong>scroll down to see all 8 options, if necessary</strong>)'){
		return buttonBoard1 + survey_question + checkbox
	}else {
		return buttonBoard1 + survey_question + buttonBoard2
	}
}


var pressCheckbox = function(current_submit){
	checked_item = current_submit
	keyTracker.push(current_submit)
	
}

var createButtonBoard2 = function(numButtons,buttonText){ 
	//numButtons and buttonText need to be same length. numButtons is a number, buttonText is an array
	var buttonBoard2 = '</font></p><div class = buttonbox>'
	for (var i = 1; i < numButtons + 1; i++){
		buttonBoard2 += '<div class = inner><button class="likert_btn unselected" id="btn'+i+'" onClick="pressSubmit(this.id)" >'+buttonText[i-1]+'</button></div>'
	}
	buttonBoard2 += '</div></div></div>'
	return buttonBoard2
}	

var hitKey = function(whichKey){
	e = jQuery.Event("keydown");
  	e.which = whichKey; // # Some key code value
  	e.keyCode = whichKey
  	$(document).trigger(e);
 	e = jQuery.Event("keyup");
  	e.which = whichKey; // # Some key code value
  	e.keyCode = whichKey
  	$(document).trigger(e)
}


var pressSubmit = function(current_submit){
	buttonPressed = current_submit
	buttonPressedText = document.getElementById(current_submit).innerHTML
	console.log('buttonPressedText = ' + buttonPressedText)
	keyTracker.push(buttonPressed)
	if (keyTracker.length === 1){
		$('#'+buttonPressed).addClass('selected');
	} else if (keyTracker.length > 1){
		for (var i = 0; i < keyTracker.length; i++){
			$('#'+keyTracker[i]).removeClass('selected');
		}
		$('#'+buttonPressed).addClass('selected');
	}
	
}

var getTime = function(){
	return whichTime
}

document.addEventListener("keydown", function(e){
    var keynum;
    if(window.event){
    	keynum = e.keyCode;
    } else if(e.which){
    	keynum = e.which;
    }
    if (keynum == 13){
    	if (survey_question == 'In the past 30 days, what tobacco products OTHER THAN cigarettes have you used? <br>(check all that apply - <strong>scroll down to see all 8 options, if necessary</strong>)'){
    		buttonPressedText = []
    		if (document.getElementById("myCheck1").checked === true){
    			buttonPressedText.push(document.getElementById("myCheck1").value)
    		}
    		if (document.getElementById("myCheck2").checked === true){
    			buttonPressedText.push(document.getElementById("myCheck2").value)
    		}
    		if (document.getElementById("myCheck3").checked === true){
    			buttonPressedText.push(document.getElementById("myCheck3").value)
    		} 
    		if (document.getElementById("myCheck4").checked === true){
    			buttonPressedText.push(document.getElementById("myCheck4").value)
    		} 
    		if (document.getElementById("myCheck5").checked === true){
    			buttonPressedText.push(document.getElementById("myCheck5").value)
    		} 
    		if (document.getElementById("myCheck6").checked === true){
    			buttonPressedText.push(document.getElementById("myCheck6").value)
    		} 
    		if (document.getElementById("myCheck7").checked === true){
    			buttonPressedText.push(document.getElementById("myCheck7").value)
    		}
    		if (document.getElementById("myCheck8").checked === true){
    			buttonPressedText.push(document.getElementById("myCheck8").value)
    		}
    		hitKey(81)
    	} else if ((keyTracker.length === 0) && (game_state == 'questions')){
    		alert('Please choose a response.  Resume full-screen if you are taken out.')('Please choose a response')
    	} else  if  ((keyTracker.length > 0) && (game_state == 'questions')){
    		hitKey(81)
    	} 
		
    }
});

var appendData = function(){
	curr_trial = jsPsych.progress().current_trial_global
	trial_id = jsPsych.data.getDataByTrialIndex(curr_trial).trial_id
	
	if ((fatal_response.indexOf(buttonPressedText) != -1) && (question_type == 'Fatal')){
		sub_made_fatal_response = 1
	}
	
	if ((conditional_response.indexOf(buttonPressedText) != -1) && (question_type == 'Conditional')){
		sub_made_conditional_response = 1
		conditional_length_index = conditional_length
	} else if ((conditional_response.indexOf(buttonPressedText) == -1) && (question_type == 'Conditional')){
		sub_made_conditional_response = 0
		conditional_length_index = conditional_length
	}
	
	jsPsych.data.addDataToLastTrial({
		current_answer: buttonPressedText,
		current_question: survey_question,
		response_options: buttonText,
		item_name: item_name
	})
	
	keyTracker = []
	buttonPressed = 'N/A'
    buttonPressedText = 'N/A'
}

/* ************************************ */
/*    Define Experimental Variables     */
/* ************************************ */
var preFileType = "<img class = center src='/static/experiments/alcohol_drugs_survey__dartmouth_baseline/images/"
var pathSource = "/static/experiments/alcohol_drugs_survey__dartmouth_baseline/images/"

var sub_made_fatal_response = 0 // 0 if not, 1 if so
var sub_made_conditional_response = -1 
// -1 if a conditional question hasn't been come across - game start, 0 if sub should skip next question, 1 if sub should not skip next question
var keyTracker = []
var buttonPressed = 'N/A'
var buttonPressedText = 'N/A'
var game_state = 'start'
/* ************************************************ */
/*        Questions and responses for Survey        */
/* ************************************************ */

//Questions to be presented
var survey_questions = ['Have you ever smoked tobacco cigarettes?',
					    'Altogether, have you smoked at least 100 cigarettes in your entire lifetime?',
					    'How long have you smoked (cumulatively)?',
					    'Do you now smoke cigarettes every day, some days or not at all?',
					    'On average, how many cigarettes do you now smoke a day (1 pack = 20 cigarettes)?',
					    'How soon after you wake up do you smoke your first cigarette?',
					    'In the past 30 days, what tobacco products OTHER THAN cigarettes have you used? <br>(check all that apply - <strong>scroll down to see all 8 options, if necessary</strong>)',
					    'How often do you have a drink containing alcohol?',
					    'How many drinks containing alcohol do you have on a typical day when you are drinking?',
					    'How often do you have six or more drinks on one occasion?',
					    'How often during the last year have you found that you were not able to stop drinking once you had started?',
					    'How often during the last year have you failed to do what was normally expected from you because of drinking?',
					    'How often during the last year have you needed a first drink in the morning to get yourself going after a heavy drinking session?',
					    'How often during the last year have you had a feeling of guilt or remorse after drinking?',
					    'How often during the last year have you been unable to remember what happened the night before because you had been drinking?',
					    'Have you or someone else been injured as a result of your drinking?',
					    'Has a relative or friend or a doctor or another health worker been concerned about your drinking or suggested you cut down?',
					    'Have you used any cannabis (marijuana) over the past 6 months?',
					    'How often do you use cannabis?',
					    'How many hours were you ‘stoned’ on a typical day when you had been using cannabis?',
					    'How often during the past six months did you find that you were not able to stop using cannabis once you had started?',
					    'How often during the past six months did you fail to do what was normally expected from you because of using cannabis?',
					    'How often in the past six months have you devoted a great deal of your time to getting, using, or recovering from cannabis?',
					    'How often in the past six months have you had a problem with your memory or concentration after using cannabis?',
					    'How often do you use cannabis in situations that could be physically hazardous, such as driving, operating machinery, or caring for children?',
					    'Have you ever thought about cutting down, or stopping, your use of cannabis?',
					    'Below is a list of questions concerning information about your potential involvement with drugs, excluding alcohol, marijuana and tobacco, during the past 12 months. When the words “drug abuse” are used, they mean the use of prescribed or over‐the‐counter medications/drugs in excess of the directions and any non‐medical use of drugs. The various classes of drugs may include: solvents, tranquilizers (e.g., Valium), barbiturates, cocaine, stimulants (e.g., speed), hallucinogens (e.g., LSD) or narcotics (e.g., heroin). Remember that the questions do not include alcohol, marijuana or tobacco.',
					    'Have you used drugs other than those required for medical reasons?',
					    'Do you abuse more than one drug?',
					    'Are you always able to stop using drugs when you want to?',
					    'Have you had "blackouts" or "flashbacks" as a result of drug use?',
					    'Do you ever feel bad or guilty about your drug use?',
					    'Does your spouse (or parents) ever complain about your involvement with drugs?',
					    'Have you neglected your family because of your use of drugs?',
					    'Have you engaged in illegal activities in order to obtain drugs?',
					    'Have you ever experienced withdrawal symptoms (felt sick) when you stopped taking drugs?',
					    'Have you had medical problems as a result of your drug use (e.g., memory loss, hepatitis, convulsions, bleeding, etc.)?',]

//response options for radio buttons
//each array contains the button text, as well as length of button array.
var button_text = [[['Yes','No'],2],
				   [['Yes','No'],2],
				   [['Less than a year', '1 year', '2 years',  '3 years', '4 years', '5-10 years',' More than 10 years'],7],
				   [['Every day', 'Some days', 'Not at all'], 3],
				   [['Less than a cigarette a day', '1-4', '5-9', '10-19', '20-29', '30-39', '40 or more'], 7],
				   [['Within 5 minutes', '6-30 minutes', '31-60 minutes', 'After 60 minutes', 'Do not know'], 5],
				   [['Chewing tobacco (dip)', 'Cigars', 'Pipe', 'Tobacco for your nose (snuff)', 'E-cigarettes', 'E-hookah or vape pens', 'Cigarillos or little cigars', 'Do not know'], 8],
				   [['Never', 'Monthly or less', '2 to 4 times a month', '2 to 3 times a week', '4 or more times a week'], 5],
				   [['1 or 2', '3 or 4', '5 or 6', '7, 8, or 9', '10 or more'], 5],
				   [['Never', 'Less than monthly', 'Monthly', 'Weekly', 'Daily or almost daily'],5],
				   [['Never', 'Less than monthly', 'Monthly', 'Weekly', 'Daily or almost daily'],5],
				   [['Never', 'Less than monthly', 'Monthly', 'Weekly', 'Daily or almost daily'],5],
				   [['Never', 'Less than monthly', 'Monthly', 'Weekly', 'Daily or almost daily'],5],
				   [['Never', 'Less than monthly', 'Monthly', 'Weekly', 'Daily or almost daily'],5],
				   [['Never', 'Less than monthly', 'Monthly', 'Weekly', 'Daily or almost daily'],5],
				   [['No', 'Yes, but not in the last year', 'Yes, during the last year', 'I do not drink'],4],
				   [['No', 'Yes, but not in the last year', 'Yes, during the last year', 'I do not drink'],4],
				   [['Yes','No'], 2],
				   [['Never', 'Less than monthly', 'Monthly', 'Weekly', 'Daily or almost daily'],5],
				   [['Less than 1', '1 or 2', '3 or 4', '5 or 6', '7 or more'],5],
				   [['Never', 'Less than monthly', 'Monthly', 'Weekly', 'Daily or almost daily'],5],
				   [['Never', 'Less than monthly', 'Monthly', 'Weekly', 'Daily or almost daily'],5],
				   [['Never', 'Less than monthly', 'Monthly', 'Weekly', 'Daily or almost daily'],5],
				   [['Never', 'Less than monthly', 'Monthly', 'Weekly', 'Daily or almost daily'],5],
				   [['Never', 'Less than monthly', 'Monthly', 'Weekly', 'Daily or almost daily'],5],
				   [['Never', 'Yes, but not in the past 6 months', 'Yes, during the past 6 months'],3],
				   [['Continue'],1],
				   [['No', 'Yes'],2],
				   [['No', 'Yes'],2],
				   [['No', 'Yes'],2],
				   [['No', 'Yes'],2],
				   [['No', 'Yes'],2],
				   [['No', 'Yes'],2],
				   [['No', 'Yes'],2],
				   [['No', 'Yes'],2],
				   [['No', 'Yes'],2],
				   [['No', 'Yes'],2]]

//Conditional questions control the presence of a set of following questions. 
//Fatal questions end the survey, if a sub makes a particular response
//questions that are 'neither' are not conditional or fatal
var question_types =   [['Conditional'],
					    ['neither'],
					    ['neither'],
					    ['neither'],
					    ['neither'],
					    ['neither'],
					    ['neither'],
					    ['Conditional'],
					    ['neither'],
					    ['neither'],
					    ['neither'],
					    ['neither'],
					    ['neither'],
					    ['neither'],
					    ['neither'],
					    ['neither'],
					    ['neither'],
					    ['Conditional'],
					    ['neither'],
					    ['neither'],
					    ['neither'],
					    ['neither'],
					    ['neither'],
					    ['neither'],
					    ['neither'],
					    ['neither'],
					    ['neither'],
					    ['Fatal'],
					    ['neither'],
					    ['neither'],
					    ['neither'],
					    ['neither'],
					    ['neither'],
					    ['neither'],
					    ['neither'],
					    ['neither'],
					    ['neither']]				   

//If a subject chooses this response, end survey.  If not, continue survey
var fatal_responses =  [['none'],
					    ['none'],
					    ['none'],
					    ['none'],
					    ['none'],
					    ['none'],
					    ['none'],
					    ['none'],
					    ['none'],
					    ['none'],
					    ['none'],
					    ['none'],
					    ['none'],
					    ['none'],
					    ['none'],
					    ['none'],
					    ['none'],
					    ['none'],
					    ['none'],
					    ['none'],
					    ['none'],
					    ['none'],
					    ['none'],
					    ['none'],
					    ['none'],
					    ['none'],
					    ['none'],
					    ['No'],
					    ['none'],
					    ['none'],
					    ['none'],
					    ['none'],
					    ['none'],
					    ['none'],
					    ['none'],
					    ['none'],
					    ['none']]

//If a subject chooses this response, show the next question.  If not, skip next question					   
var conditional_responses = [['Yes'],
					    	 ['neither'],
					    	 ['neither'],
					    	 ['neither'],
					    	 ['neither'],
					    	 ['neither'],
					    	 ['neither'],
					    	 ['Monthly or less','2 to 4 times a month','2 to 3 times a week','4 or more times a week'],
					    	 ['neither'],
					    	 ['neither'],
					    	 ['neither'],
					    	 ['neither'],
					    	 ['neither'],
					    	 ['neither'],
					    	 ['neither'],
					    	 ['neither'],
					    	 ['neither'],
					    	 ['Yes'],
					    	 ['neither'],
					    	 ['neither'],
					    	 ['neither'],
					    	 ['neither'],
					    	 ['neither'],
					      	 ['neither'],
					    	 ['neither'],
					    	 ['neither'],
					    	 ['neither'],
					    	 ['neither'],
					    	 ['neither'],
					    	 ['neither'],
					    	 ['neither'],
					    	 ['neither'],
					    	 ['neither'],
					    	 ['neither'],
					    	 ['neither'],
					    	 ['neither'],
					    	 ['neither']]
//If sub made a response during a conditional questions that requires skipping the following questions, 
//these are the number of questions to skip.  If integer, leave as integer.  Otherwise, put 'neither'				     
var conditional_lengths =    [[6],
					    	 ['neither'],
					    	 ['neither'],
					    	 ['neither'],
					    	 ['neither'],
					    	 ['neither'],
					    	 ['neither'],
					    	 [9],
					    	 ['neither'],
					    	 ['neither'],
					    	 ['neither'],
					    	 ['neither'],
					    	 ['neither'],
					    	 ['neither'],
					    	 ['neither'],
					    	 ['neither'],
					    	 ['neither'],
					    	 [8],
					    	 ['neither'],
					    	 ['neither'],
					    	 ['neither'],
					    	 ['neither'],
					    	 ['neither'],
					      	 ['neither'],
					    	 ['neither'],
					    	 ['neither'],
					    	 ['neither'],
					    	 ['neither'],
					    	 ['neither'],
					    	 ['neither'],
					    	 ['neither'],
					    	 ['neither'],
					    	 ['neither'],
					    	 ['neither'],
					    	 ['neither'],
					    	 ['neither'],
					    	 ['neither']]

//Names of items that be written on data
var item_names_dartmouth = ['alc_drugs_1_bl',
							'alc_drugs_2_bl',
							'alc_drugs_3_bl',
							'alc_drugs_4_bl',
							'alc_drugs_5_bl',
							'alc_drugs_6_bl',
							'alc_drugs_7_bl',
							'alc_drugs_8_bl',
							'alc_drugs_9_bl',
							'alc_drugs_10_bl',
							'alc_drugs_11_bl',
							'alc_drugs_12_bl',
							'alc_drugs_13_bl',
							'alc_drugs_14_bl',
							'alc_drugs_15_bl',
							'alc_drugs_16_bl',
							'alc_drugs_17_bl',
							'alc_drugs_18_bl',
							'alc_drugs_19_bl',
							'alc_drugs_20_bl',
							'alc_drugs_21_bl',
							'alc_drugs_22_bl',
							'alc_drugs_23_bl',
							'alc_drugs_24_bl',
							'alc_drugs_25_bl',
							'alc_drugs_26_bl',
							'alc_drugs_27_bl',
							'alc_drugs_28_bl',
							'alc_drugs_29_bl',
							'alc_drugs_30_bl',
							'alc_drugs_31_bl',
							'alc_drugs_32_bl',
							'alc_drugs_33_bl',
							'alc_drugs_34_bl',
							'alc_drugs_35_bl',
							'alc_drugs_36_bl',
							'alc_drugs_37_bl']
							
/* ************************************ */
/*       Set up HTML for Survey         */
/* ************************************ */
var buttonBoard1 = 
	'<div class = bigbox><div class = survey_area>'+
	'<p class = center-block-text><font color = "white">'
	
var buttonBoard2 = '</font></p>'+
		
		'<div class = buttonbox>'+
			'<div class = inner><button class="likert_btn unselected" id="btn1" onClick="pressSubmit(this.id)"/>1</button></div>'+
			'<div class = inner><button class="likert_btn unselected" id="btn2" onClick="pressSubmit(this.id)"/>2</button></div>'+
			'<div class = inner><button class="likert_btn unselected" id="btn3" onClick="pressSubmit(this.id)"/>3</button></div>'+
			'<div class = inner><button class="likert_btn unselected" id="btn4" onClick="pressSubmit(this.id)"/>4</button></div>'+
			'<div class = inner><button class="likert_btn unselected" id="btn5" onClick="pressSubmit(this.id)"/>5</button></div>'+
		'</div>'+	
	'</div>'+
'</div>'


var checkbox = '</font></p>'+
		
		'<div class = check_box_name>'+
			'<div class = inner><p id="check1text" style="font-size:24px; color:white;">Chewing tobacco (dip)</p>'+
				'<input class = "check_box" type="checkbox" id="myCheck1" value="Chewing tobacco (dip)" onClick="pressCheckbox(this.id)"></div><br>'+
			'<div class = inner><p id="check2text" style="font-size:24px; color:white;">Cigars</p>'+
				'<input class = "check_box" type="checkbox" id="myCheck2" value="Cigars" onClick="pressCheckbox(this.id)"></div><br>'+
			'<div class = inner><p id="check3text" style="font-size:24px; color:white;">Pipe</p>'+
				'<input class = "check_box" type="checkbox" id="myCheck3" value="Pipe" onClick="pressCheckbox(this.id)"></div><br>'+
			'<div class = inner><p id="check4text" style="font-size:24px; color:white;">Tobacco for your nose (snuff)</p>'+
				'<input class = "check_box" type="checkbox" id="myCheck4" value="Tobacco for your nose (snuff)" onClick="pressCheckbox(this.id)"></div><br>'+
			'<div class = inner><p id="check5text" style="font-size:24px; color:white;">E-cigarettes</p>'+
				'<input class = "check_box" type="checkbox" id="myCheck5" value="E-cigarettes" onClick="pressCheckbox(this.id)"></div><br>'+
			'<div class = inner><p id="check6text" style="font-size:24px; color:white;">E-hookah or vape pens</p>'+
				'<input class = "check_box" type="checkbox" id="myCheck6" value="E-hookah or vape pens" onClick="pressCheckbox(this.id)"></div><br>'+
			'<div class = inner><p id="check7text" style="font-size:24px; color:white;">Cigarillos or little cigars</p>'+
				'<input class = "check_box" type="checkbox" id="myCheck7" value="Cigarillos or little cigars" onClick="pressCheckbox(this.id)"></div><br>'+
			'<div class = inner><p id="check8text" style="font-size:24px; color:white;">Do not know</p>'+
				'<input class = "check_box" type="checkbox" id="myCheck8" value="Do not know" onClick="pressCheckbox(this.id)"></div><br>'+
		'</div>'+
		
	'</div>'
	
		
/* ************************************ */
/*        Set up jsPsych blocks         */
/* ************************************ */
var end_block = {
	type: 'poldrack-text',
	data: {
		exp_id: "alcohol_drugs_survey__dartmouth_baseline",
		trial_id: "end"
	},
	timing_response: 180000,
	text: '<div class = bigbox><div class = centerbox>'+
		  '<p class = center-text2 style="font-size:36px"><font color="white">Thanks for completing this survey!</font></p>'+
		  '<p class = center-text2 style="font-size:36px"><font color="white">Press<strong> enter</strong> to continue.</font></p>'+
		  '</div></div>',
	cont_key: [13],
	timing_post_trial: 0
};

var welcome_block = {
	type: 'poldrack-text',
	data: {
		trial_id: "welcome"
	},
	timing_response: -1,
	text: '<div class = bigbox><div class = centerbox>'+
		  '<p class = center-text2 style="font-size:36px"><font color="white">Welcome to this survey!</font></p>'+
		  '<p class = center-text2 style="font-size:36px"><font color="white">Press<strong> enter</strong> to continue.</font></p>'+
		  '</div></div>',
	cont_key: [13],
	timing_post_trial: 0
};

var instructions_block = {
	type: 'poldrack-text',
	data: {
		trial_id: "instruction"
	},
	timing_response: -1,
	text: '<div class = centerbox>'+
			'<p class = block-text style="font-size:28px"><font color="white">Please answer the following questions regarding your tobacco, alcohol and drug use.</font></p>' +
			'<p class = block-text style="font-size:28px"><font color="white">Click on the button that best fits your answer, then <strong>press enter to submit your response</strong>.</font></p>'+
			'<p class = block-text style="font-size:28px"><font color="white">You will not be able to go back, so please carefully read and understand each question before you move on.</font></p>'+
			'<p class = block-text style="font-size:28px"><font color="white">Each question will disappear after 3 minutes if you do not respond.  Please answer each question by the time limit.</font></p>'+
			'<p class = block-text style="font-size:28px"><font color="white">Press enter to begin the survey.</font></p>'+
		  '</div>',
	cont_key: [13],
	timing_post_trial: 0
};

var update_state_block = {
	type: 'poldrack-text',
	data: {
		trial_id: "update_state"
	},
	timing_response: 1,
	text: '<div class = bigbox></div>',
	cont_key: [13],
	timing_post_trial: 0,
	on_finish: function(){
		game_state = 'questions'
	}
};

post_questionnaire_trials = []
for(var x = 0; x < survey_questions.length; x++){
	var post_exp_block = {
	type: 'poldrack-single-stim',
	stimulus: getQuestions,
	is_html: true,
	choices: [81], //48,49,50,51,52
	data: {
		exp_id: "alcohol_drugs_survey__dartmouth_baseline",
		"trial_id": "post_questionnaire_block"
	},
	timing_post_trial: 0,
	timing_stim: getTime,
	timing_response: getTime,
	response_ends_trial: true,
	on_finish: appendData
	};
	
	post_questionnaire_trials.push(post_exp_block)
}

var post_questionnaire_node = {
	timeline: post_questionnaire_trials,
	loop_function: function(data){
		game_state = 'end'
	}
}


/* ************************************ */
/*          Set up Experiment           */
/* ************************************ */

var alcohol_drugs_survey__dartmouth_baseline_experiment = []

alcohol_drugs_survey__dartmouth_baseline_experiment.push(welcome_block);

alcohol_drugs_survey__dartmouth_baseline_experiment.push(instructions_block);

alcohol_drugs_survey__dartmouth_baseline_experiment.push(update_state_block);

alcohol_drugs_survey__dartmouth_baseline_experiment.push(post_questionnaire_node);

alcohol_drugs_survey__dartmouth_baseline_experiment.push(end_block);