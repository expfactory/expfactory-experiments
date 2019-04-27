/* ************************************ */
/*       Define Helper Functions        */
/* ************************************ */


function getDisplayElement() {
    $('<div class = display_stage_background></div>').appendTo('body')
    return $('<div class = display_stage></div>').appendTo('body')
}

function addID() {
  jsPsych.data.addDataToLastTrial({exp_id: 'qewp5__dartmouth_followup'})
}

var getQuestions = function(){
	survey_question = survey_questions.shift()
	button_info = button_text.shift()
	fatal_response = fatal_responses.shift()
	conditional_response = conditional_responses.shift()
	question_type = question_types.shift()
	item_name = item_names_dartmouth.shift()
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
		sub_made_conditional_response = -1
		whichTime = skip_question
	}
	
	return buttonBoard1 + survey_question + buttonBoard2
}


var createButtonBoard2 = function(numButtons,buttonText){ 
	//numButtons and buttonText need to be same length. numButtons is a number, buttonText is an array
	var temp1 = '</div>'
	var buttonBoard2 = temp1
	buttonBoard2 += '<div class = buttonbox>'
	for (var i = 1; i < numButtons + 1; i++){
		buttonBoard2 += '<div class = inner><button class="likert_btn unselected" id="btn'+i+'" onClick="pressSubmit(this.id)" >'+buttonText[i-1]+'</button></div>'
	}
	buttonBoard2 += temp1
	buttonBoard2 += temp1
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
    	if ((keyTracker.length === 0) && (game_state == 'questions')){
    		alert('Please choose a response')
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
	} else if ((conditional_response.indexOf(buttonPressedText) == -1) && (question_type == 'Conditional')){
		sub_made_conditional_response = 0
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
var preFileType = "<img class = center src='/static/experiments/qewp5__dartmouth_followup/images/"
var pathSource = "/static/experiments/qewp5__dartmouth_followup/images/"

var sub_made_fatal_response = 0 // 0 if not, 1 if so
var sub_made_conditional_response = -1 // -1 if unapplicable, 0 if not and applicable, 1 if yes and applicable
var keyTracker = []
var buttonPressed = 'N/A'
var buttonPressedText = 'N/A'
var game_state = 'start'
/* ************************************************ */
/*        Questions and responses for Survey        */
/* ************************************************ */

var survey_questions = ['During the past month, did you ever eat, in a short period of time  (For example, a two hour period) what most people would think was an unusually large amount of food?',
					    'During the times when you ate an unusually large amount of food, did you ever feel you could not stop eating or control what or how much you were eating?',
					    'During the past month, how often, on average, did you have episodes like this? That is, eating large amounts of food plus the feeling that your eating was out of control? (There may have been some weeks when this did not happen, just average those in.)',
					    'On the following pages, please answer: Did you usually have any of the following experiences during these episodes?',
					    'Eating much more rapidly than normal?',
					    'Eating until feeling uncomfortably full?',
					    'Eating large amounts of food when not feeling physically hungry?',
					    'Eating alone because of feeling embarrassed by how much you were eating?',
					    'Feeling disgusted with yourself, depressed, or feeling very guilty afterward?',
					    'In general, during the past month, how upset were you by these episodes? (When you ate a large amount of food and felt your eating was out of control)?',
					    'During the past month, did you ever make yourself vomit in order to avoid gaining weight after episodes of eating like you described (when you ate a large amount of food and felt your eating was out of control)?',
					    'How often, on average, was that?',
					    'During the past month, did you ever take more than the recommended dose of laxatives in order to avoid gaining weight after episodes of eating like you described (when you ate a large amount of food and felt your eating was out of control)?',
					    'How often, on average, was that?',
					    'During the past month, did you ever take more than the recommended dose of diuretics (water pills) in order to avoid gaining weight after episodes of eating like you described (when you ate a large amount of food and felt your eating was out of control)?',
					    'How often, on average, was that?',
					    'During the past month, did you ever fast – for example, not eat anything at all for at least 24 hours -- in order to avoid gaining weight after episodes of eating like you described (when you ate a large amount of food and felt your eating was out of control)?',
					    'How often, on average, was that?',
					    'During the past month, did you ever exercise excessively for example, exercised even though it interfered with important activities or despite being injured, specifically in order to avoid gaining weight after episodes of eating like you described. (When you ate a large amount of food and felt your eating was out of control)?',
					    'How often, on average, was that?',
					    'During the past month, did you ever take more than the recommended dose of a diet pill in order to avoid gaining weight after episodes of eating like you described (When you ate a large amount of food and felt your eating was out of control)?',
					    'How often, on average, was that?']
					  
var button_text = [[['Yes','No'],2],
				   [['Yes','No'],2],
				   [['Less than 1 episode per week','1 episode per week','2-3 episodes per week','4-7 episodes per week','8-13 episodes per week','14 or more episodes per week'],6],
				   [['Continue'], 1],
				   [['Yes','No'], 2],
				   [['Yes','No'], 2],
				   [['Yes','No'], 2],
				   [['Yes','No'], 2],
				   [['Yes','No'], 2],
				   [['Not at all','Slightly','Moderately','Greatly','Extremely'],5],
				   [['Yes','No'], 2],
				   [['Less than 1 episode per week','1 episode per week','2-3 episodes per week','4-7 episodes per week','8-13 episodes per week','14 or more episodes per week'],6],
				   [['Yes','No'], 2],
				   [['Less than 1 time per week','1 time per week','2-3 times per week','4-5 times per week','6-7 times per week','8 or more times per week'],6],
				   [['Yes','No'], 2],
				   [['Less than 1 time per week','1 time per week','2-3 times per week','4-5 times per week','6-7 times per week','8 or more times per week'],6],
				   [['Yes','No'], 2],
				   [['Less than 1 day per week','1 day per week','2 days per week','3 days per week','4-5 days per week','More than 5 days per week'],6],
				   [['Yes','No'], 2],
				   [['Less than 1 time per week','1 time per week','2-3 times per week','4-7 times per week','8-13 times per week','14 or more times per week'],6],
				   [['Yes','No'], 2],
				   [['Less than 1 time per week','1 time per week','2-3 times per week','4-7 times per week','8-13 times per week','14 or more times per week'],6]]
				   
var question_types =   [['Fatal'],
					   ['Fatal'],
					   ['neither'], //'Fatal'
					   ['neither'],
					   ['neither'],
					   ['neither'],
					   ['neither'],
					   ['neither'],
					   ['neither'],
					   ['neither'], //'Fatal'
					   ['Conditional'],
					   ['neither'],
					   ['Conditional'],
					   ['neither'],
					   ['Conditional'],
					   ['neither'],
					   ['Conditional'],
					   ['neither'],
					   ['Conditional'],
					   ['neither'],
					   ['Conditional'],
					   ['neither']]				   

var fatal_responses = [['No'],
					   ['No'],
					   ['none'], //'Less than 1 episode per week'
					   ['none'],
					   ['none'],
					   ['none'],
					   ['none'],
					   ['none'],
					   ['none'],
					   ['none'], // 'Not at all','Slightly','Moderately'
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
					   ['none']]
					   
var conditional_responses = [['none'],
						     ['none'],
						     ['none'],
						     ['none'],
						     ['none'],
						     ['none'],
						     ['none'],
						     ['none'],
						     ['none'],
						     ['none'],
						     ['Yes'],
						     ['none'],
						     ['Yes'],
						     ['none'],
						     ['Yes'],
						     ['none'],
						     ['Yes'],
						     ['none'],
						     ['Yes'],
						     ['none'],
						     ['Yes'],
						     ['none']]

var item_names_dartmouth = ['qwep8_fu',
							'qwep9_fu',
							'qwep10_fu',
							'qwep_11_header_fu',
							'qwep11a_fu',
							'qwep11b_fu',
							'qwep11c_fu',
							'qwep11d_fu',
							'qwep11e_fu',
							'qwep13_fu',
							'qwep14_fu',
							'qwep14a_fu',
							'qwep15_fu',
							'qwep15a_fu',
							'qwep16_fu',
							'qwep16a_fu',
							'qwep17_fu',
							'qwep17a_fu',
							'qwep18_fu',
							'qwep18a_fu',
							'qwep19_fu',
							'qwep19a_fu']
							
/* ************************************ */
/*       Set up HTML for Survey         */
/* ************************************ */
var buttonBoard1 = 
	'<div class = bigbox><div class = centerbox>'+
	'<p class = center-block-text><font color = "white">'
	
var buttonBoard2 = 
	    '</div>'+
		
		'<div class = buttonbox>'+
			'<div class = inner><button class="likert_btn unselected" id="btn1" onClick="pressSubmit(this.id)"/>1</button></div>'+
			'<div class = inner><button class="likert_btn unselected" id="btn2" onClick="pressSubmit(this.id)"/>2</button></div>'+
			'<div class = inner><button class="likert_btn unselected" id="btn3" onClick="pressSubmit(this.id)"/>3</button></div>'+
			'<div class = inner><button class="likert_btn unselected" id="btn4" onClick="pressSubmit(this.id)"/>4</button></div>'+
			'<div class = inner><button class="likert_btn unselected" id="btn5" onClick="pressSubmit(this.id)"/>5</button></div>'+
		'</div>'+	
	'</div>'

var textBoard1 = 
	'<div class = bigbox><div class = centerbox>'+
	'<p class = center-block-text><font color = "white">' 
	
var textBoard2 = 
	'</font></p>'+
	'<div class = textbox><textarea id="question_text_area" cols="110" rows="20" value=""></textarea>'+
	'<div class = submitbox><input type="submit" value="Submit" data-inline="true" onClick="pressSubmit(document.getElementById(\'question_text_area\'))"/></div>' +
	'</div></div>'
	
	
/* ************************************ */
/*        Set up jsPsych blocks         */
/* ************************************ */
var end_block = {
	type: 'poldrack-text',
	data: {
		exp_id: "qewp5__dartmouth_followup",
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
			'<p class = block-text style="font-size:28px"><font color="white">Please answer the following questions regarding your eating.</font></p>' +
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
		exp_id: "qewp5__dartmouth_followup",
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

var qewp5__dartmouth_followup_experiment = []

qewp5__dartmouth_followup_experiment.push(welcome_block);

qewp5__dartmouth_followup_experiment.push(instructions_block);

qewp5__dartmouth_followup_experiment.push(update_state_block);

qewp5__dartmouth_followup_experiment.push(post_questionnaire_node);

qewp5__dartmouth_followup_experiment.push(end_block);