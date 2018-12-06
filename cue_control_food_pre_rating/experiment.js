/* ************************************ */
/*       Define Helper Functions        */
/* ************************************ */


function getDisplayElement() {
    $('<div class = display_stage_background></div>').appendTo('body')
    return $('<div class = display_stage></div>').appendTo('body')
}

function addID() {
  jsPsych.data.addDataToLastTrial({exp_id: 'cue_control_food_pre_rating'})
}


var createStims = function(numStims,numIterations,numZeroes){
	var lowEnd = 1
	var stimArray = []
	
	var neutral_stim_array = jsPsych.randomization.repeat(neutral_pics,1)
	var valued_stim_array = jsPsych.randomization.repeat(valued_pics,1)
	
	for (x = 0; x < numStims; x++){
		stim1 = {
			stim: valued_stim_array[x],
			stim_type: experiment_stim_type
		} 
		
		stim2 = {
			stim: neutral_pics[x],
			stim_type: 'Neutral'
		}
		
		stimArray.push(stim1)
		stimArray.push(stim2)
	}

	stimArray = jsPsych.randomization.repeat(stimArray, numIterations, true)
	return stimArray
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


function getRatingBoard(){	
		current_stim = stims.stim.pop()
		stim_type = stims.stim_type.pop()
		
		if(stim_type == experiment_stim_type){
	
			return ratingBoard1 + valued_stim_directory + current_stim + "'></img>"  + ratingBoard2		
		}else if(stim_type == "Neutral"){
			return ratingBoard1 + neutral_directory + current_stim + "'></img>"  + ratingBoard2	
		}
}

var appendData = function(){
	//curr_trial = jsPsych.progress().current_trial_global
	//trial_id = jsPsych.data.getDataByTrialIndex(curr_trial).trial_id
	
	if(response_tracker.length === 0){
    	stim_rating = ""
    }
    
	jsPsych.data.addDataToLastTrial({
		stim: current_stim,
		stim_type: stim_type,
		stim_rating: stim_rating,
		current_trial: currTrial
	})
	
	currTrial += 1
	response_tracker = []

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
    	stim_rating = keynum
    
    }else if((keynum == possible_responses[1][1]) && (response_tracker.length == 1)){
    	$('#btn2').removeClass('unselected');
    	$('#btn2').addClass('selected');
    	stim_rating = keynum
    	hitKey(13)
    
    }else if((keynum == possible_responses[2][1]) && (response_tracker.length == 1)){
    	$('#btn3').removeClass('unselected');
    	$('#btn3').addClass('selected');
    	stim_rating = keynum
    	hitKey(13)
    
    }else if((keynum == possible_responses[3][1]) && (response_tracker.length == 1)){
    	$('#btn4').removeClass('unselected');
    	$('#btn4').addClass('selected');
    	stim_rating = keynum
    	hitKey(13)
    
    }else if((keynum == possible_responses[4][1]) && (response_tracker.length == 1)){
    	$('#btn5').removeClass('unselected');
    	$('#btn5').addClass('selected');
    	stim_rating = keynum
    	hitKey(13)
    
    }
    
    
    
});

/* ************************************ */
/*    Define Experimental Variables     */
/* ************************************ */
var subject_ID = 472
var numStimsPerCategory = 36
var totalStims = numStimsPerCategory * 2 // 5 total conditions


var numIterations = 1 //number of a certain stim, in each of the one conditions

var stim = ''
var stim_type = ''
var stim_rating = ''
var currTrial = 0


var now_cue = 'NOW'
var later_cue = 'LATER'
var experiment_stim_type = 'food'
var current_game_state = "start"
var postRateNullType = 0


var preFileType = "<img class = center src='/static/experiments/cue_control_food_pre_rating/images/"
var valued_stim_directory = "PDC3_chosen_food_500/" //controls if you are showing food or smoking pictures
var neutral_directory = "neutral_stims_500/"

var fileTypeJPG = ".jpg'></img>"

var response_tracker = []
var subject_response = ""
var possible_responses = [['1', 49],['2',50],['3',51],['4',52],['5',53]]

var exp_target_phase = 0

////////////////


var ratingBoard1 = 
	"<div class = bigbox>"+
		"<div class = practice_rating_text>"+
		"<p class = center-textJamie style='font-size:26px'><font color = 'white'>Please rate how much you currently want to consume/use the item.</font></p>"+
		"</div>"+
		
		"<div class = center_picture_box>"+preFileType
		
var ratingBoard2 = 
	    "</div>"+
		
		'<div class = buttonbox>'+
			'<div class = inner><button class="likert_btn unselected" id="btn1" onClick="return false;" >1</button></div>'+
			'<div class = inner><button class="likert_btn unselected" id="btn2" onClick="return false;" >2</button></div>'+
			'<div class = inner><button class="likert_btn unselected" id="btn3" onClick="return false;" >3</button></div>'+
			'<div class = inner><button class="likert_btn unselected" id="btn4" onClick="return false;" >4</button></div>'+
			'<div class = inner><button class="likert_btn unselected" id="btn5" onClick="return false;" >5</button></div>'+
		'</div>'+	
	'</div>'
		
	
var stims = createStims(numStimsPerCategory,numIterations,3) // last input is for numZeroes


/* ************************************ */
/*        Set up jsPsych blocks         */
/* ************************************ */

var end_block = {
	type: 'poldrack-text',
	data: {
		exp_id: "cue_control_food_pre_rating",
		trial_id: "end"
	},
	timing_response: -1,
	text: '<div class = bigbox><div class = centerbox>'+
		  '<p class = center-textJamie style="font-size:36px"><font color="white">Thanks for completing this task!</font></p>'+
		  '<p class = center-textJamie style="font-size:36px"><font color="white">Press<strong> enter</strong> to continue.</font></p>'+
		  '</div></div>',
	cont_key: [13],
	timing_post_trial: 0,
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
	timing_post_trial: 0,
};

var post_rating_intro = {
	type: 'poldrack-text',
	data: {
		trial_id: "post_rating_intro"
	},
	timing_response: -1,
	text: '<div class = bigbox><div class = centerbox>'+
		  '<p class = center-textJamie style="font-size:36px"><font color="white">For this phase, please rate how much you want to consume / use the item.</font></p>'+
		  '<p class = center-textJamie style="font-size:36px"><font color="white">1 = very low, 5 = very high.</font></p>'+		  
		  '</div></div>',
	cont_key: [13],
	timing_post_trial: 0,
	on_finish: function(){
		exp_target_phase = 1
	}
};

var instructions_block = {
	type: 'poldrack-text',
	data: {
		trial_id: "instructions"
	},
	timing_response: -1,
	text: '<div class = bigbox><div class = centerbox>'+
			'<p class = block-text><font color = "white">You will be rating various items based on how much you currently want to use and/or consume the item.</font></p>'+
			'<p class = block-text><font color = "white">1 = very low, 5 = very high.  Please use the keyboard to indicate your choice.</font></p>'+
			'<p class = block-text><font color = "white">Press <strong>enter</strong> to continue.</font></p>'+		
	
		 '</div></div>',
	cont_key: [13],
	timing_post_trial: 0,
};



/* ************************************ */
/*        Set up timeline blocks        */
/* ************************************ */



var post_rating_trials = []
for(var i = 0; i < totalStims; i++){ //numStims before, but probably should equal the number of all stims = 120
	var rating_block = {
	type: 'poldrack-single-stim',
	stimulus: getRatingBoard,
	is_html: true,
	choices: [13],
	data: {
		trial_id: "post_rating"
	},
	timing_post_trial: 0,
	timing_stim: 3000, //3000
	timing_response: 3000, //3000
	on_finish: appendData,
	response_ends_trial: false
	};
	
	//post_rating_trials.push(fixation_block)
	post_rating_trials.push(rating_block)
}

var post_rating_node = {
	timeline: post_rating_trials,
	loop_function: function(data){
		
	
	}
}


/* ************************************ */
/*          Set up Experiment           */
/* ************************************ */

var cue_control_food_pre_rating_experiment = []

cue_control_food_pre_rating_experiment.push(welcome_block);

cue_control_food_pre_rating_experiment.push(instructions_block);

cue_control_food_pre_rating_experiment.push(post_rating_intro);

cue_control_food_pre_rating_experiment.push(post_rating_node);

cue_control_food_pre_rating_experiment.push(end_block);

