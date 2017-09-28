/* ************************************ */
/*       Define Helper Functions        */
/* ************************************ */


function getDisplayElement() {
    $('<div class = display_stage_background></div>').appendTo('body')
    return $('<div class = display_stage></div>').appendTo('body')
}

function addID() {
  jsPsych.data.addDataToLastTrial({exp_id: 'object_rating'})
}

var getQuestions = function(){
	post_questionNum += 1
	
	var temp = post_questionNum - 1
	
	return '<div class = bigbox><div class = centerbox>'+
	'<p class = center-block-text><font color = "white">' + post_questions[post_questionNum -1] + '</font></p>'+
	'<div class = textbox><textarea id="question_text_area" cols="110" rows="20" value=""></textarea>'+
	'<div class = submitbox><input type="submit" value="Submit" data-inline="true" onClick="pressSubmit(document.getElementById(\'question_text_area\'))"/></div>' +
	'</div></div>'
}


function getRestText(){
	if(currBlock == numBlocks - 1){
		gameState = "post_questionnaire"
		return '<div class = bigbox><div class = centerbox>'+
		  	  	 '<p class = center-textJamie style="font-size:36px"><font color="white">This phase is over.</font></p>'+
		      	 '<p class = center-textJamie style="font-size:36px"><font color="white">Press enter to start the post-questionnaire.</font></p>'+
		 	   '</div></div>'
	
	}else if(currBlock < numBlocks - 1){	
		var subjectBlock = currBlock + 1
		return '<div class = bigbox><div class = centerbox>'+
		  	  	 '<p class = center-textJamie style="font-size:36px"><font color="white">Take a break!</font></p>'+
		      	 '<p class = center-textJamie style="font-size:36px"><font color="white">Press enter to start.</font></p>'+
		      	 '<p class = center-textJamie style="font-size:36px"><font color="white">Completed: ' + subjectBlock + ' out of ' + numBlocks + ' blocks.</font></p>'+

		 	   '</div></div>'
	}

}


function getRatingBoard(){	
	
	if(gameState == "practice_rating"){
		
		return ratingBoard1 + practiceBoard + ratingBoard2 + '_practice/' + practice_stim + "'" + ratingBoard3
	} else if (gameState == "rating"){
		current_stim = stims.pop()
	
		return ratingBoard1 + ratingBoard2 + '_neutral/' + current_stim + "'" + ratingBoard3
	}
	
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
	if(current_submit.id == "question_text_area"){
		post_question_current_answer = current_submit.value
		
		hitKey(81)
	
	}
}

document.addEventListener("keydown", function(e){
    var keynum;
    if(window.event){
    	keynum = e.keyCode;
    } else if(e.which){
    	keynum = e.which;
    }
    
    
    if ((keynum == 49) || (keynum == 50)){
		if ((gameState == "rating") || (gameState == "practice_rating")){
			keyTracker.push(keynum)
			if((keynum == 49) && (keyTracker.length == 1)){
				$('#button1').addClass('selected');
				pressedKey = keynum
				hitKey(87)
			}else if((keynum == 50) && (keyTracker.length == 1)){
				$('#button2').addClass('selected');
				pressedKey = keynum
				hitKey(87)
			}
			
		}
    }
    
});


var appendData = function(){
	curr_trial = jsPsych.progress().current_trial_global
	trial_id = jsPsych.data.getDataByTrialIndex(curr_trial).trial_id
	
	if (trial_id == "test_rating"){
	
		jsPsych.data.addDataToLastTrial({
			current_stim: current_stim,
			subj_stim_rating: pressedKey
		})
	
		pressedKey = ""
	} else if (trial_id == "post_questionnaire_block"){
		jsPsych.data.addDataToLastTrial({
			current_answer: post_question_current_answer,
			current_question: post_questions[post_questionNum -1],
		})
	}
	
}

/* ************************************ */
/*    Define Experimental Variables     */
/* ************************************ */

var totalPics = 1000
var numBlocks = 10
var numTrialsPerBlock = totalPics/numBlocks
var preTR = 16
var currBlock = 0
var current_stim = ""


var preFileType = "<img class = center src='/static/experiments/object_rating/images/BOSS"
var pathSource = "/static/experiments/object_rating/images/BOSS_neutral/"


var keyTracker = []
var pressedKey = ""
var gameState = "start"
var post_questions = ['1) What strategies/logic did you use to complete each rating?',
					 '2) Do you have any feedback about the experiment?']
var post_question_current_answer = ""
var post_questionNum = 0

////////////////


var ratingBoard1 = '<div class = bigbox>'
		
var practiceBoard = '<div class = practice_rating_text>'+
			'<p class = center-textJamie style="font-size:22px"><font color = "white">Please think about the long-term consequences of repeated use <strong> AND</strong> whether you think many people would like to use this object.</font></p>'+
			'</div>'
		
var ratingBoard2 =	'<div class = center_picture_box>'+preFileType
		
var ratingBoard3 = 
	    '></div>'+
		
		'<div class = buttonbox>'+
			'<div class = inner><button type="submit" id = "button1" class="likert_btn" onClick="return false;" >1</button></div>'+
			'<div class = inner><button type="submit" id = "button2" class="likert_btn" onClick="return false;" >2</button></div>'+
		'</div>'+	
	'</div>'
	
var practice_stim = 'atm.png'

	
/*
var images = []
for(var i = 0; i < neutral_pics.length; i++){
	images.push(pathSource + neutral_pics[i])
}


jsPsych.pluginAPI.preloadImages(images);
*/

var stims = jsPsych.randomization.repeat(neutral_pics,1)



/* ************************************ */
/*        Set up jsPsych blocks         */
/* ************************************ */

var end_block = {
	type: 'poldrack-text',
	data: {
		trial_id: "end"
	},
	timing_response: -1,
	text: '<div class = bigbox><div class = centerbox>'+
		  '<p class = center-textJamie style="font-size:36px"><font color="white">Thanks for completing this task!</font></p>'+
		  '<p class = center-textJamie style="font-size:36px"><font color="white">Press<strong> enter</strong> to continue.</font></p>'+
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
		  '<p class = center-textJamie style="font-size:36px"><font color="white">Welcome to the task!</font></p>'+
		  '<p class = center-textJamie style="font-size:36px"><font color="white">Press<strong> enter</strong> to continue.</font></p>'+
		  '</div></div>',
	cont_key: [13],
	timing_post_trial: 0
};

var post_rating_intro = {
	type: 'poldrack-text',
	data: {
		trial_id: "post_rating_intro"
	},
	timing_response: -1,
	text: '<div class = bigbox><div class = centerbox>'+
		  '<p class = center-textJamie style="font-size:36px"><font color="white">For this next phase, please rate how much you want to consume the item.</font></p>'+
		  '<p class = center-textJamie style="font-size:36px"><font color="white">1 = very low, 5 = very high.</font></p>'+		  
		  '</div></div>',
	cont_key: [13],
	timing_post_trial: 0,
	on_finish: function(){
		jsPsych.data.addDataToLastTrial({
		triggers: trigger_tracker,
		trigger_time: trigger_timer
		})

		trigger_tracker = []
		trigger_timer = []
		
	}
};

var instructions_block = {
	type: 'poldrack-text',
	data: {
		trial_id: "instructions"
	},
	timing_response: -1,
	text: '<div class = bigbox><div class = centerbox>'+
			'<p class = block-text><font color = "white">In this study, you will see a series of object images. We are asking you to evaluate each object on the following 2 criteria:</font></p>'+
			'<p class = block-text><font color = "white">1. Does the object have clear long-term consequences of repeated used? </font></p>'+
			'<p class = block-text><font color = "white">2. Do many people like using this object? </font></p>'+
			'<p class = block-text><font color = "white">Therefore, if you think an object has clear long-term consequences of repeated use AND you think many people like using this object, please respond with the number 1. However, if the long-term consequences of using the object are unclear OR few/no people would like to use that object, please respond 2.  </font></p>'+
			'<p class = block-text><font color = "white">Please choose your response before each object leaves the screen - 3 seconds.</font></p>'+
			'<p class = block-text><font color = "white">Please start by fixating your eyes at the center of the screen.</font></p>'+
			'<p class = block-text><font color = "white">When you are ready to begin, press <strong>enter</strong> to start with a practice trial.</font></p>'+		
		 '</div></div>',
	cont_key: [13],
	timing_post_trial: 0,
	on_finish: function(){
		gameState = "practice_rating"
	}
};

/*
var instructions_block = {
	type: 'poldrack-text',
	data: {
		trial_id: "instructions"
	},
	timing_response: -1,
	text: '<div class = bigbox><div class = centerbox>'+
			'<p class = block-text><font color = "white">We are interested in the suitability of different objects to be judged on a "use/utilize now" vs "use/utilize repetitively later" axis.</font></p>'+
			'<p class = block-text><font color = "white">To be specific, for each object we want you to think about how you would feel if you used/utilized that object now - within a few seconds.</font></p>'+
			'<p class = block-text><font color = "white">In addition, we would also like you to think about the long-term consequences of repeatedly using/utilizing <strong>each</strong> object.</font></p>'+
			'<p class = block-text><font color = "white">Please indicate your judgement of each objects suitability on a "use/utilize now" vs "use/utilize repetitively later" axis, using the keyboard keys 1, 2, 4, 5, and 5.</font></p>'+
			'<p class = block-text><font color = "white">You will have 3 seconds to make your choice, and your response will be indicated by a green border surrounding your button of choice.</font></p>'+
			'<p class = block-text><font color = "white">Please start by fixating your eyes at the center of the screen.</font></p>'+
			'<p class = block-text><font color = "white">When you are ready to begin, press <strong>enter</strong> to start with a practice trial.</font></p>'+		
		 '</div></div>',
	cont_key: [13],
	timing_post_trial: 0,
	on_finish: function(){
		gameState = "practice_rating"
	}
};
*/
var start_test_block = {
	type: 'poldrack-text',
	data: {
		trial_id: "start_test_block"
	},
	timing_response: -1,
	text: '<div class = bigbox><div class = centerbox>'+
			'<p class = block-text><font color = "white">A trial will look and be timed like the practice trial, except without the text on top.</font></p>'+
			'<p class = block-text><font color = "white">Please note that each trial will take a specified amount of time, regardless of how fast you respond.</font></p>'+
			'<p class = block-text><font color = "white">Press <strong>enter</strong> to start the task.</font></p>'+		
		 '</div></div>',
	cont_key: [13],
	timing_post_trial: 0
};


var rest_block = {
	type: 'poldrack-single-stim',
	stimulus: getRestText,
	is_html: true,
	choices: [13],
	data: {
		trial_id: "rest_block"
	},
	timing_post_trial: 0,
	timing_stim: -1,
	timing_response: -1,
	response_ends_trial: true
};

	
var practice_rating_block = {
	type: 'poldrack-single-stim',
	stimulus: getRatingBoard,
	is_html: true,
	choices: [87], //'none'
	data: {
		trial_id: "practice_rating"
	},
	timing_post_trial: 0,
	timing_stim: 3000, 
	timing_response: 3000, 
	response_ends_trial: false,
	on_finish: function(){
		pressedKey = ""
		gameState = "rating"
		keyTracker = []
	}
};

/* ************************************ */
/*        Set up timeline blocks        */
/* ************************************ */
	
	
var fixation_block = {
	type: 'poldrack-single-stim',
	stimulus: '<div class = bigbox><div class = centerbox><div class = fixation><font color="white">+</font></div></div></div>',
	is_html: true,
	choices: 'none',
	data: {
		trial_id: "fixation"
	},
	timing_post_trial: 0,
	timing_stim: 200,
	timing_response: 200,
	on_finish: function(){
		keyTracker = []
		pressedKey = ""
	}
};

var training_trials = []
for(var i = 0; i < numTrialsPerBlock; i++){ //numStims before, should be # of trials per block (40??)
	
	var rating_block = {
	type: 'poldrack-single-stim',
	stimulus: getRatingBoard,
	is_html: true,
	choices: [87], //'none'
	data: {
		trial_id: "test_rating"
	},
	timing_post_trial: 0,
	timing_stim: 3000, 
	timing_response: 3000, 
	response_ends_trial: false,
	on_finish: function(){
		keyTracker = []
		appendData()
	}
	};
	
	//training_trials.push(fixation_block)
	training_trials.push(rating_block)
}
training_trials.push(rest_block)



var training_node = {
	timeline: training_trials,
	loop_function: function(data){
		currBlock += 1
	
		if(currBlock == numBlocks){
			
			
			return false
		}else if (currBlock < numBlocks){
			
			
			return true
		}
	
	}
}

post_questionnaire_trials = []
for(var x = 0; x < post_questions.length; x++){
	var post_exp_block = {
	type: 'poldrack-single-stim',
	stimulus: getQuestions,
	is_html: true,
	choices: [81], //48,49,50,51,52
	data: {
		exp_id: "object_rating",
		"trial_id": "post_questionnaire_block"
	},
	timing_post_trial: 0,
	timing_stim: -1,
	timing_response: -1,
	response_ends_trial: true,
	on_finish: appendData
	};
	
	post_questionnaire_trials.push(post_exp_block)
}

var post_questionnaire_node = {
	timeline: post_questionnaire_trials,
	loop_function: function(data){
	}
}


/* ************************************ */
/*          Set up Experiment           */
/* ************************************ */

var object_rating_experiment = []


object_rating_experiment.push(welcome_block);

object_rating_experiment.push(instructions_block);

object_rating_experiment.push(practice_rating_block);

object_rating_experiment.push(start_test_block);

object_rating_experiment.push(training_node);

object_rating_experiment.push(post_questionnaire_node);

object_rating_experiment.push(end_block);




