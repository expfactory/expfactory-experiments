/* ************************************ */
/*       Define Helper Functions        */
/* ************************************ */


function getDisplayElement() {
    $('<div class = display_stage_background></div>').appendTo('body')
    return $('<div class = display_stage></div>').appendTo('body')
}

function addID() {
  jsPsych.data.addDataToLastTrial({exp_id: 'cue_control_smoking_practice'})
}


var createStims = function(numStims,numIterations,numZeroes){
	var lowEnd = 1
	var numberArray = []
	for (i = lowEnd; i<numStims+1; i++){
		num_zeros = numZeroes - i.toString().length
		if (num_zeros === 0) {
			numberArray.push(i)
		}else if (num_zeros == 1) {
			numberArray.push('0' +i)
		}else if (num_zeros == 2) {
			numberArray.push('00' +i)
		}else if (num_zeros == 3) {
			numberArray.push('000' +i)
		}
	}

	var stimArray = jsPsych.randomization.repeat(numberArray,numIterations)
	return stimArray
}

	
	
function createAllStims(numStimsPerCategory, numIterations, numZeroes, nullType){
	
	var neutral_stim_array = jsPsych.randomization.repeat(neutral_pics,1)
	var valued_stim_array = jsPsych.randomization.repeat(valued_pics,1)

	
	var stims = []
	for(var i = 0; i < numStimsPerCategory/2; i++){
		valued_now = {
			stim: valued_stim_array.pop(),
			trial_cue_type: now_cue,
			stim_type: experiment_stim_type,
			}
		
		valued_later = {
			stim: valued_stim_array.pop(),
			trial_cue_type: later_cue,
			stim_type: experiment_stim_type,
			}
			
		control_now = {
			stim: neutral_stim_array.pop(),
			trial_cue_type: now_cue,
			stim_type: 'neutral',
			}
			
		control_later = {
			stim: neutral_stim_array.pop(),
			trial_cue_type: later_cue,
			stim_type: 'neutral',
			}
		
		if (nullType == 1){
		
			null_stims = {
				stim: 'null',
				trial_cue_type: 'null',
				stim_type: 'null',
			}
			
			stims.push(null_stims)
		}
		stims.push(valued_now)
		stims.push(valued_later)
		stims.push(control_now)
		stims.push(control_later)
	}
	
	stims = jsPsych.randomization.repeat(stims,1,true)
	return stims
}
	

function getRestText(){
	if(currBlock == numBlocks - 1){
		return '<div class = bigbox><div class = centerbox>'+
		  	  	 '<p class = center-textJamie style="font-size:36px"><font color="white">This practice is over.</font></p>'+
		      	 '<p class = center-textJamie style="font-size:36px"><font color="white">Press enter to continue.</font></p>'+
		 	   '</div></div>'
	
	}else if(currBlock < numBlocks - 1){	
		return '<div class = bigbox><div class = centerbox>'+
		  	  	 '<p class = center-textJamie style="font-size:36px"><font color="white">Take a break!</font></p>'+
		      	 '<p class = center-textJamie style="font-size:36px"><font color="white">The task will start again in 10 seconds.</font></p>'+
		 	   '</div></div>'
	}

}



function getCue(){	
	whichCue = stims.trial_cue_type.pop()
	stim_type = stims.stim_type.pop()
	current_stim = stims.stim.pop()

	
	if (whichCue == "null"){
	
		return '<div class = bigbox><div class = centerbox><div class = fixation></div></div></div>'
	
	} else {

		return '<div class = bigbox><div class = centerbox><div class = fixation><font color="white">'+whichCue+'</font></div></div></div>'
	
	}

}



function getProbe(){
	
	
	if(stim_type == experiment_stim_type){
	
		return probeBoard1 + valued_stim_directory + current_stim + "'></img>" + probeBoard2		
	}else if(stim_type == "neutral"){

		return probeBoard1 + neutral_directory + current_stim + "'></img>" + probeBoard2	
	}else if (stim_type == "null"){
		return '<div class = bigbox></div>'
	}
	
	
}



function getRatingBoard(){	
	
	
		if(stim_type == experiment_stim_type){
	
			return ratingBoard1 + valued_stim_directory + current_stim + "'></img>" + ratingBoard2	
		} else if(stim_type == "neutral"){

			return ratingBoard1 + neutral_directory + current_stim + "'></img>" + ratingBoard2	
		} else if (stim_type == "null"){
			
			return '<div class = bigbox></div>'
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



document.addEventListener("keydown", function(e){
    var keynum;    
    
    if(window.event){
    	keynum = e.keyCode;
    } else if(e.which){
    	keynum = e.which;
    }
    
    
    if ((keynum == possible_responses[0][1]) || 
    	(keynum == possible_responses[1][1]) || 
    	(keynum == possible_responses[2][1]) || 
    	(keynum == possible_responses[3][1]) || 
    	(keynum == possible_responses[4][1])){

		
	
		if (exp_target_phase == 1){
    
    		response_tracker.push(keynum)
    	
    	}
    }
    
    
    if ((keynum == possible_responses[0][1]) && (response_tracker.length == 1)){
    	$('#btn1').removeClass('unselected');
    	$('#btn1').addClass('selected');
    	hitKey(13)
    	subject_response = keynum
    
    }else if((keynum == possible_responses[1][1]) && (response_tracker.length == 1)){
    	$('#btn2').removeClass('unselected');
    	$('#btn2').addClass('selected');
    	subject_response = keynum
    	hitKey(13)
    
    }else if((keynum == possible_responses[2][1]) && (response_tracker.length == 1)){
    	$('#btn3').removeClass('unselected');
    	$('#btn3').addClass('selected');
    	subject_response = keynum
    	hitKey(13)
    
    }else if((keynum == possible_responses[3][1]) && (response_tracker.length == 1)){
    	$('#btn4').removeClass('unselected');
    	$('#btn4').addClass('selected');
    	subject_response = keynum
    	hitKey(13)
    
    }else if((keynum == possible_responses[4][1]) && (response_tracker.length == 1)){
    	$('#btn5').removeClass('unselected');
    	$('#btn5').addClass('selected');
    	subject_response = keynum
    	hitKey(13)
    
    }
});



var appendData = function(){

	curr_trial = jsPsych.progress().current_trial_global
	trial_id = jsPsych.data.getDataByTrialIndex(curr_trial).trial_id
	
	if(response_tracker.length === 0){
    	subject_response = ""
    }
	
	if (trial_id == "current_rating"){
		jsPsych.data.addDataToLastTrial({
			stim: current_stim,
			stim_type: stim_type,
			which_cue: whichCue,
			response: subject_response
			
		})
	
	} 
	response_tracker = []
	exp_target_phase = 0
}

/* ************************************ */
/*    Define Experimental Variables     */
/* ************************************ */
var subject_ID = 472
var numStimsPerCategory = 6
var totalStims = (numStimsPerCategory/2) * 5 // 5 total conditions
var possible_responses = [['1', 49],['2',50],['3',51],['4',52],['5',53]]



var numIterations = 1 //number of a certain stim, in each of the one conditions
var numBlocks = 1
var numStimsPerBlock = totalStims / numBlocks

var submitPressMax = 5
var exp_target_phase = 0



var now_cue = 'NOW'
var later_cue = 'LATER'
var experiment_stim_type = 'smoking'
var current_game_state = "start"
var mainNullType = 1
var postRateNullType = 0


var preFileType = "<img class = center src='/static/experiments/cue_control_smoking_practice/images/"


var valued_stim_directory = "smoking/" //controls if you are showing food or smoking pictures
var neutral_directory = "neutral/"

var fileTypeBMP = ".bmp'></img>"
var fileTypePNG = ".png'></img>"
var fileTypeJPG = ".jpg'></img>"


var whichCue = ""
var current_stim = ""
var current_trial_type = ""
var currBlock = 0
var response_tracker = []
var submitPress = 0
var subject_response = ""





////////////////
var probeBoard1 = '<div class = bigbox>'+
		"<div class = center_picture_box>"+preFileType 
		
var probeBoard2 = "</div></div>"
////////////////


var ratingBoard1 = 
	'<div class = bigbox>'+
		'<div class = practice_rating_text>'+
		'<p class = center-textJamie style="font-size:26px"><font color = "white">Please rate how much you currently want to consume/use the item.</font></p>'+
		'</div>'+
		
		'<div class = center_picture_box>'+preFileType
		
var ratingBoard2 = 
	    '</div>'+
		
		'<div class = buttonbox>'+
			'<div class = inner><button class="likert_btn unselected" id="btn1" onClick="return false;" >1</button></div>'+
			'<div class = inner><button class="likert_btn unselected" id="btn2" onClick="return false;" >2</button></div>'+
			'<div class = inner><button class="likert_btn unselected" id="btn3" onClick="return false;" >3</button></div>'+
			'<div class = inner><button class="likert_btn unselected" id="btn4" onClick="return false;" >4</button></div>'+
			'<div class = inner><button class="likert_btn unselected" id="btn5" onClick="return false;" >5</button></div>'+
		'</div>'+	
	'</div>'
	
	
var stims = createAllStims(numStimsPerCategory,numIterations,3,mainNullType) // last input is for numZeroes


/* ************************************ */
/*        Set up jsPsych blocks         */
/* ************************************ */

var end_block = {
	type: 'poldrack-text',
	data: {
		exp_id: "cue_control_smoking_practice",
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


var instructions_block = {
	type: 'poldrack-text',
	data: {
		trial_id: "instructions"
	},
	timing_response: -1,
	text: '<div class = bigbox><div class = centerbox>'+
			'<p class = block-text><font color = "white">Each trial is composed of multiple parts.</font></p>'+
			'<p class = block-text><font color = "white">In the first part, you will see a cue, either NOW or LATER followed by an item.  The cue will instruct you how to think about the item.</font></p>'+
			'<p class = block-text><font color = "white">If you see the cue, NOW, please think about the immediate consequences of consuming/using the item.</font></p>'+
			'<p class = block-text><font color = "white">If you see the cue, LATER, please think about the long-term consequences of repeatedly consuming/using the item.</font></p>'+
			'<p class = block-text><font color = "white">In the second part, you will rate the current item.  Please indicate how much you currently want to consume/use the item on the screen.</font></p>'+
			'<p class = block-text><font color = "white">Press <strong>enter</strong> to continue.</font></p>'+		
	
		 '</div></div>',
	cont_key: [13],
	timing_post_trial: 0
};


var scanner_rest_block = {
	type: 'poldrack-single-stim',
	stimulus: getRestText,
	is_html: true,
	choices: [13],
	data: {
		trial_id: "scanner_rest"
	},
	timing_post_trial: 0,
	timing_stim: 3000,
	timing_response: 3000,
	response_ends_trial: true
};


/* ************************************ */
/*        Set up timeline blocks        */
/* ************************************ */

var training_trials = []
for(var i = 0; i < numStimsPerBlock; i++){ //numStims before, should be # of trials per block (40??)
	
	var cue_block = {
	type: 'poldrack-single-stim',
	stimulus: getCue,
	is_html: true,
	choices: [13], //'none'
	data: {
		trial_id: "cue"
	},
	timing_post_trial: 0,
	timing_stim: 2000, 
	timing_response: 2000,
	response_ends_trial: false
	};
	
	var probe_block = {
	type: 'poldrack-single-stim',
	stimulus: getProbe,
	is_html: true,
	choices: [13], //'none'
	data: {
		trial_id: "probe"
	},
	timing_post_trial: 0,
	timing_stim: 5000,
	timing_response: 5000,
	response_ends_trial: false,
	on_finish: function(){
	exp_target_phase = 1
	
	}
	};
	
	var rating_block = {
	type: 'poldrack-single-stim',
	stimulus: getRatingBoard,
	is_html: true,
	choices: [13], //[possible_responses[0][1], possible_responses[1][1], possible_responses[2][1], possible_responses[3][1], possible_responses[4][1]]
	data: {
		trial_id: "current_rating"
	},
	timing_post_trial: 0,
	timing_stim: 3000, 
	timing_response: 3000, 
	on_finish: appendData,
	response_ends_trial: false
	};
	
	training_trials.push(cue_block)
	training_trials.push(probe_block)
	training_trials.push(rating_block)
}
training_trials.push(scanner_rest_block)



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

/* ************************************ */
/*          Set up Experiment           */
/* ************************************ */

var cue_control_smoking_practice_experiment = []

cue_control_smoking_practice_experiment.push(welcome_block);

cue_control_smoking_practice_experiment.push(instructions_block);

cue_control_smoking_practice_experiment.push(training_node);

cue_control_smoking_practice_experiment.push(end_block);




