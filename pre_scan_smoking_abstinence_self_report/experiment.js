/* ************************************ */
/*       Define Helper Functions        */
/* ************************************ */


function getDisplayElement() {
    $('<div class = display_stage_background></div>').appendTo('body')
    return $('<div class = display_stage></div>').appendTo('body')
}

function addID() {
  jsPsych.data.addDataToLastTrial({exp_id: 'pre_scan_smoking_abstinence_self_report'})
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
	question_format = question_formats.shift()
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
	
	if (question_format == 'radio'){
		return buttonBoard1 + survey_question + buttonBoard2 
	} else if (question_format == 'time'){
		return buttonBoard1 + survey_question + timeBoard
	} else if (question_format == 'slider'){
		return buttonBoard1 + survey_question + sliderBoard
	} else if (question_format == 'checkbox'){
		return buttonBoard1 + survey_question + checkbox
	}
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

var pressCheckbox = function(current_submit){
	checked_item = current_submit
	keyTracker.push(current_submit)
	if ((document.getElementById("myCheck1").checked === true) && (document.getElementById("myCheck2").checked === true)){
		alert('Please choose one response')
		keyTracker = []
	} else if ((document.getElementById("myCheck1").checked === true) && (document.getElementById("myCheck2").checked === false)){
		checked_item = 'Yes' //checked_item = document.getElementById("check1text").innerHTML
		buttonPressedText = 'Yes'
	} else if ((document.getElementById("myCheck1").checked === false) && (document.getElementById("myCheck2").checked === true)){
		checked_item = 'No' //checked_item = document.getElementById("check2text").innerHTML
		buttonPressedText = 'No'
	} else if ((document.getElementById("myCheck1").checked === false) && (document.getElementById("myCheck2").checked === false)){
		alert('Please choose a response')
		keyTracker = []
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
	console.log('here1')
	if ((fatal_response.indexOf(buttonPressedText) != -1) && (question_type[0] == 'Fatal')){
		sub_made_fatal_response = 1
	}
	
	if ((conditional_response.indexOf(buttonPressedText) != -1) && (question_type[0] == 'Conditional')){
		console.log('here2')
		sub_made_conditional_response = 1
		conditional_length_index = conditional_length
	} else if ((conditional_response.indexOf(buttonPressedText) == -1) && (question_type[0] == 'Conditional')){
		console.log('here3')
		sub_made_conditional_response = 0
		conditional_length_index = conditional_length
	}
	
	jsPsych.data.addDataToLastTrial({
		current_question: survey_question,
		response_options: buttonText,
		item_name: item_name
	})
	
	if (question_format == 'radio'){
		jsPsych.data.addDataToLastTrial({
			current_answer: buttonPressedText
		})
	} else if (question_format == 'checkbox'){
		jsPsych.data.addDataToLastTrial({
			current_answer: checked_item,
		})
	} else if (question_format == 'time'){
		jsPsych.data.addDataToLastTrial({
			current_answer: time_answer,
		})
	} else if (question_format == 'slider'){
		jsPsych.data.addDataToLastTrial({
			current_answer: craving,
		})
	}
	
	keyTracker = []
	buttonPressed = 'N/A'
    buttonPressedText = 'N/A'
    checked_item = 'N/A'
    time_answer = 'N/A'
    craving = 'N/A'
}

var submitTime = function(current_submit){
	if(current_submit.id == "time_box"){
		time_answer = current_submit.value
		console.log(time_answer)
		hitKey(81)
	}
}

var ratingSubmit = function(myRange){
	craving = myRange.value
	
	console.log(craving)
	hitKey(81)
}

function updateTextInput(val) {
	document.getElementById('textInput').value=val; 
}

function toggleOpacitySlider(element){
	element.classList.remove('slider-clear');
}

/* ************************************ */
/*    Define Experimental Variables     */
/* ************************************ */
var preFileType = "<img class = center src='/static/experiments/pre_scan_smoking_abstinence_self_report/images/"
var pathSource = "/static/experiments/pre_scan_smoking_abstinence_self_report/images/"

var sub_made_fatal_response = 0 // 0 if not, 1 if so
var sub_made_conditional_response = -1 
// -1 if a conditional question hasn't been come across - game start, 0 if sub should skip next question, 1 if sub should not skip next question
var keyTracker = []
var buttonPressed = 'N/A'
var buttonPressedText = 'N/A'
var game_state = 'start'
var time_answer = 'N/A'
/* ************************************************ */
/*        Questions and responses for Survey        */
/* ************************************************ */

//Questions to be presented
var survey_questions = ['On the next few pages, you will see some products.  Please indicate which of the following products you have used <u>in the last 24 hours</u> (choose yes to all that apply)',
					    'In the last 24 hours, have you used any of the following product[s]: <br><br> Cigarette?',
					    'at what time did you last....<br><br> smoke a cigarette?',
					    'In the last 24 hours, have you used any of the following product[s]: <br><br> Cigar, cigarillo or small cigar like Swisher Sweets or Black and Mild?',
					    'at what time did you last....<br><br> smoke a cigar, cigarillo or little cigar like Swisher Sweets or Black and Mild?',
					    'In the last 24 hours, have you used any of the following product[s]: <br><br> E-cigarette, vape pen, or e-hookah (e.g., Juul, Suorin, Phix)?',
					    'at what time did you last....<br><br> use an e-cigarette, vape pen, or e-hookah (e.g., Juul, Suorin, Phix)?',
					    'In the last 24 hours, have you used any of the following product[s]: <br><br> Smokeless tobacco, chew, or Snus?',
					    'at what time did you last....<br><br> use smokeless tobacco, chew, or Snus?',
					    'In the last 24 hours, have you used any of the following product[s]: <br><br> Pipe tobacco?',
					    'at what time did you last....<br><br> smoke pipe tobacco?',
					    'In the last 24 hours, have you used any of the following product[s]: <br><br> Hookah?',
					    'at what time did you last....<br><br> smoke hookah?',
					    'In the last 24 hours, have you used any of the following product[s]: <br><br> Blunts (i.e., cannabis smoked in a hollowed-out cigar)?',
					    'at what time did you last....<br><br> smoke a blunt?',
					    'In the last 24 hours, have you used any of the following product[s]: <br><br> Nicotine gum, patch, lozenge, nasal spray, or nicotine inhaler?',
					    'at what time did you last....<br><br> use nicotine gum, patch, lozenge, nasal spray, or nicotine inhaler?',
					    'Please put a mark on the line to show how much you are craving a cigarette right now, paying attention to the descriptions at the end of the line.']

//response options for radio buttons
//each array contains the button text, as well as length of button array.
var button_text = [[['Continue'],1],
				   [['Yes','No'],2],
				   [['time'],1],
				   [['Yes','No'],2],
				   [['time'],1],
				   [['Yes','No'],2],
				   [['time'],1],
				   [['Yes','No'],2],
				   [['time'],1],
				   [['Yes','No'],2],
				   [['time'],1],
				   [['Yes','No'],2],
				   [['time'],1],
				   [['Yes','No'],2],
				   [['time'],1],
				   [['Yes','No'],2],
				   [['time'],1],
				   [['slider'],1]]

//Conditional questions control the presence of a set of following questions. 
//Fatal questions end the survey, if a sub makes a particular response
//questions that are 'neither' are not Conditional or Fatal
var question_types =   [['neither'],
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
					    ['neither'],
					    ['Conditional'],
					    ['neither'],
					    ['Conditional'],
					    ['neither'],
					    ['neither']]	

//does the question require radio, checkbox, textfield, numeric, slider, or time?  Numeric and textfield has not been coded					    
var question_formats = [['radio'],
					    ['checkbox'],
					    ['time'],
					    ['checkbox'],
					    ['time'],
					    ['checkbox'],
					    ['time'],
					    ['checkbox'],
					    ['time'],
					    ['checkbox'],
					    ['time'],
					    ['checkbox'],
					    ['time'],
					    ['checkbox'],
					    ['time'],
					    ['checkbox'],
					    ['time'],
					    ['slider']]			   

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
					    ['none']]

//If a subject chooses this response, show the next question.  If not, skip next question					   
var conditional_responses = [['neither'],
					    	 ['Yes'],
					    	 ['neither'],
					    	 ['Yes'],
					    	 ['neither'],
					    	 ['Yes'],
					    	 ['neither'],
					    	 ['Yes'],
					    	 ['neither'],
					    	 ['Yes'],
					    	 ['neither'],
					    	 ['Yes'],
					    	 ['neither'],
					    	 ['Yes'],
					    	 ['neither'],
					    	 ['Yes'],
					    	 ['neither'],
					    	 ['neither']]
//If sub made a response during a conditional questions that requires skipping the following questions, 
//these are the number of questions to skip.  If integer, leave as integer.  Otherwise, put 'neither'	     
var conditional_lengths =    [['neither'],
					    	  [1],
					    	  ['neither'],
					    	  [1],
					    	  ['neither'],
					    	  [1],
					    	  ['neither'],
					    	  [1],
					    	  ['neither'],
					    	  [1],
					    	  ['neither'],
					    	  [1],
					    	  ['neither'],
					    	  [1],
					    	  ['neither'],
					    	  [1],
					    	  ['neither'],
					    	  ['neither']]

//Names of items that be written on data
var item_names_dartmouth = ['pre_scan_smoking_abstinence_1',
							'pre_scan_smoking_abstinence_2',
							'pre_scan_smoking_abstinence_3',
							'pre_scan_smoking_abstinence_4',
							'pre_scan_smoking_abstinence_5',
							'pre_scan_smoking_abstinence_6',
							'pre_scan_smoking_abstinence_7',
							'pre_scan_smoking_abstinence_8',
							'pre_scan_smoking_abstinence_9',
							'pre_scan_smoking_abstinence_10',
							'pre_scan_smoking_abstinence_11',
							'pre_scan_smoking_abstinence_12',
							'pre_scan_smoking_abstinence_13',
							'pre_scan_smoking_abstinence_14',
							'pre_scan_smoking_abstinence_15',
							'pre_scan_smoking_abstinence_16',
							'pre_scan_smoking_abstinence_17',
							'pre_scan_smoking_abstinence_18',]
							
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
	
var checkbox = '</div>'+
		
		'<div class = check_box_name>'+
			'<div class = inner><p id="check1text" style="font-size:24px;">Yes</p></div>'+
			'<div class = inner><p id="check2text" style="font-size:24px;">No</p></div>'+
		'</div>'+
		
		'<div class = buttonbox>'+
			'<div class = inner><input class = "check_box" type="checkbox" id="myCheck1" onClick="pressCheckbox(this.id)"></div>'+
			'<div class = inner><input class = "check_box" type="checkbox" id="myCheck2" onClick="pressCheckbox(this.id)"></div>'+
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
	
	


var textBoard = '<div class = textbox>'+
					 '<textarea id="text_area" cols="10" rows="1" value=""></textarea>'+
					 '<div class = submitbox><input type="submit" value="Submit" data-inline="true" onClick="pressSubmit(document.getElementById(\'text_area\'))"/></div>' +
				'</div></div>'
	
var timeBoard = '<div class = textbox>'+
					 '<input style="font-size:36px;" type="time" id="time_box" name="appt" min="0:00" max="24:00" required>'+
					 '<div class = submitbox><input type="submit" value="Submit" data-inline="true" onClick="submitTime(document.getElementById(\'time_box\'))"/></div>' +
				'</div></div>'	
					 
var sliderBoard = '<div class = textbox>'+
		  		  	'<input type="range" step="1" min="0" max="100" value="50" class="slider" id="myRange" onchange="updateTextInput(this.value);>'+
		  		  	'<div class = submitbox><input type="submit" value="Submit" data-inline="true" onClick="ratingSubmit(document.getElementById(\'myRange\'))"/></div>' +
		  		  '</div>' +
		  		  '<input type="text" id="textInput" value="">' +
				  '<div id="number_box">'+
  				  	'<div><font color="white">No <br>Craving</font></div>'+
  					'<div><font color="white"></font></div>'+
  					'<div><font color="white"></font></div>'+
  					'<div><font color="white">Strong Craving</font></div>'+
		    	  '</div>'
		    	  
		    	  
var sliderBoard = '<div class = slide_big_box>'+

					  '<div class = slidecontainer>'+
						'<input type="range" class="slider slider-clear" name="ageInputName" id="ageInputId" value="50" min="0" max="100" onclick="toggleOpacitySlider(this)" oninput="ageOutputId.value = ageInputId.value">'+
					  '</div>' +
					  
					  '<div class = slider_number_box>'+	
						'<output name="ageOutputName" id="ageOutputId" style="font-size:36px">N/A</output>' + 
					  '</div>'+
					  
					  '<div class = submitbox>'+
						'<input type="submit" value="Submit" data-inline="true" onClick="ratingSubmit(document.getElementById(\'ageInputId\'))"/>'+
					  '</div>'+
					  
					  '<div id="number_box">'+
						'<div><font color="white">No <br>Craving</font></div>'+
						'<div><font color="white"></font></div>'+
						'<div><font color="white"></font></div>'+
						'<div><font color="white">Strong Craving</font></div>'+
					  '</div>'+
					  
					  
				'</div>'

/* ************************************ */
/*        Set up jsPsych blocks         */
/* ************************************ */
var end_block = {
	type: 'poldrack-text',
	data: {
		exp_id: "pre_scan_smoking_abstinence_self_report",
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
	timing_response: 180000,
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
	timing_response: 180000,
	text: '<div class = centerbox>'+
			'<p class = block-text style="font-size:28px"><font color="white">Please answer the following questions regarding your tobacco usage.</font></p>' +
			'<p class = block-text style="font-size:28px"><font color="white">Click on the button that best fits your answer, then <strong>press enter to submit your response</strong>.</font></p>'+
			'<p class = block-text style="font-size:28px"><font color="white">For questions that have a submit button, click the submit button to move onto the next question.</font></p>'+
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
		exp_id: "pre_scan_smoking_abstinence_self_report",
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

var pre_scan_smoking_abstinence_self_report_experiment = []

pre_scan_smoking_abstinence_self_report_experiment.push(welcome_block);

pre_scan_smoking_abstinence_self_report_experiment.push(instructions_block);

pre_scan_smoking_abstinence_self_report_experiment.push(update_state_block);

pre_scan_smoking_abstinence_self_report_experiment.push(post_questionnaire_node);

pre_scan_smoking_abstinence_self_report_experiment.push(end_block);