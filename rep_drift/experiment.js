/* ************************************ */
/*       Define Helper Functions        */
/* ************************************ */


function getDisplayElement() {
    $('<div class = display_stage_background></div>').appendTo('body')
    return $('<div class = display_stage></div>').appendTo('body')
}

function addID() {
  jsPsych.data.addDataToLastTrial({exp_id: 'rep_drift', subject_ID: subject_ID})
}

var getFeedbackText = function(){
	if (current_prime_block == numBlocks - 1){
		feedback_text = 'Thanks for completing this phase. We will move on to the next phase.</font></p><p class = center-textJamie><font color = "white">Press <strong>enter</strong> to continue.</font>'
	}else if (current_prime_block < numBlocks - 1){
		var temp = current_prime_block + 1
		feedback_text = 'We will begin another round shortly.  Please get ready for the next round by fixating your eyes at the center of the screen and by placing your fingers on the <strong> left and right arrow keys</strong>.</font></p><p class = center-textJamie><font color = "white">You have completed '+temp+ ' out of '+numBlocks+ ' blocks of trials. </font></p><p class = center-textJamie><font color = "white">Press <strong>enter</strong> to continue.</font>'

	}
	
	return '<div class = bigbox><div class = centerbox><p class = center-textJamie><font color="white">' + feedback_text + '</p></div></div>'
}

/*
editing here to force circle build to start again


'<div class = textbox><input type ="text" value = "" id = "post_question_' + temp +'"></div>'+
'<div class = submitbox><input type="submit" value="Submit" data-inline="true" onClick="pressSubmit(document.getElementById(\'post_question_'+ temp +'\').value)"/></div>' +

*/

var getQuestions = function(){
	post_questionNum += 1
	
	var temp = post_questionNum - 1
	
	return '<div class = bigbox><div class = centerbox>'+
	'<p class = center-block-text><font color = "white">' + post_questions[post_questionNum -1] + '</font></p>'+
	'<div class = textbox><textarea id="question_text_area" cols="110" rows="20" value=""></textarea>'+
	'<div class = submitbox><input type="submit" value="Submit" data-inline="true" onClick="pressSubmit(document.getElementById(\'question_text_area\'))"/></div>' +
	'</div></div>'
}


var createStims = function(numStims,numIterations){
	var lowEnd = 1
	var numberArray = []
	for (i = lowEnd; i<numStims+1; i++){
		num_zeros = 4 - i.toString().length
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



var pressSubmit = function(current_submit){
	if(current_submit.id == "question_text_area"){
		post_question_current_answer = current_submit.value
		console.log(post_question_current_answer)
		
		hitKey(81)
	
	} else if (current_submit.id == "WTP_text"){
		WTP = current_submit.value	
		console.log(WTP)			
		
		WTP_length = WTP.length
		
		if((WTP_length < 5) && (parseFloat(WTP) < WTP_high_end + 0.01) && (parseFloat(WTP) >= 0)){
			
			hitKey(81)
			console.log('here1')
  		
  		} else {
  			submitPress += 1
  			if(submitPress <= submitPressMax){
  				if(WTP_length > 4){
  					alert("Wrong format.  Your answer is too long.  Please ensure that you are using only numbers, in the format (#.##)  The period is allowed.")
  				} else if (parseFloat(WTP) > WTP_high_end){
  					alert("Inputted answer is too high.  Please ensure that you are answering in the range $0 to $3, inclusive. The format should be (#.##)  The period is allowed.")
  				} else if (parseFloat(WTP) < 0){
  					alert("Inputted answer is too low.  Please ensure that you are answering in the range $0 to $3, inclusive.  The format should be (#.##)  The period is allowed.")
  				} else if (WTP === ""){
					alert("No answer inputted.  Please input an answer, using only numbers in the forat (#.##).  The period is allowed.  Please ensure that you are answering in the range $0 to $3, inclusive." )				
  				}
  			
  			
  			}else if(submitPress > submitPressMax){
  				hitKey(81)
  				console.log('here2')
  			
  			}
  		
  		} 
  		
  		
  		
  		
	
	} else if(current_submit.id == "demo_block"){
		
		age = document.getElementById('demo_age').value
		race = document.getElementById('demo_race').value
		ethnicity = document.getElementById('demo_ethnicity').value
		gender = document.getElementById('demo_gender').value
		
		if((Number.isInteger(parseFloat(age)) === true) && (Number.isInteger(parseFloat(race)) === true) && (Number.isInteger(parseFloat(ethnicity)) === true) && (Number.isInteger(parseFloat(gender)) === true)){
			hitKey(81)
		}else{
			submitPress += 1
			if(submitPress <= submitPressMax){
				alert("One or more questions has not been answered.  Please answer all questions before you submit.")
			
			}else if(submitPress > submitPressMax){
				hitKey(81)
			
			}
		}
		
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


var getPracticeRatingStim = function(){

	practice_stim = "Ruffles"
	return practiceRatingBoard1 + "demo/" + practice_stim + ratingBoard2

}


var getRatingStim = function(){	
	stim = stimArray.pop()
	return ratingBoard1 + stim + ratingBoard2
}


var getMaskStim = function(){

	mask = Math.floor((Math.random() * 15));
	mask = mask.toString()
	
	if(current_state == "practice"){
		return practiceMaskingBoard1 + 'mask_'+mask+ maskingBoard2
	}else if(current_state == "test"){
		return maskingBoard1 + 'mask_'+mask+ maskingBoard2
	}
}


var getForcedChoiceStim = function(){
	if(current_state == "test"){
		if (which_side == "left"){
			stim1 = stim
			stim2 = stim_partner
			stim1_WTP = stim_WTP
			stim2_WTP = stim_partner_WTP
	
		}else if (which_side == "right"){
			stim1 = stim_partner
			stim2 = stim
			stim1_WTP = stim_partner_WTP
			stim2_WTP = stim_WTP
		}
	
	
		return forcedChoiceBoard1 + stim1 +fileTypeBMP +'</div>'+
		   forcedChoiceBoard2 + stim2 + fileTypeBMP + '</div></div>'
	}else if(current_state == "practice"){
		stim1 = "WheatThins"
		stim2 = "MrsFields"
		
		return practiceForcedChoiceBoard1 + "demo/" + stim1 +fileTypeBMP +'</div>'+
		   forcedChoiceBoard2 + "demo/" + stim2 + fileTypeBMP + '</div></div>'
		
	}
}

var getPrimeStim = function(){
	if(current_state == "test"){
		stim = stims.stim.pop()
		stim_partner = stims.stim_partner.pop()
		trial_type = stims.trial_type.pop()
		binned_WTP = stims.binned_WTP.pop()
		stim_WTP = stims.stim_WTP.pop()
		stim_partner_WTP = stims.stim_partner_WTP.pop()
		which_side = stims.which_side.pop()
	
		if (trial_type == "prime"){
			prime = stim
		
			return primingBoard1 + "stim_numbered/" + prime + fileTypeBMP + primingBoard2
		} else if(trial_type == "control"){
			num_digits = binned_WTP.toString().length
			if(num_digits == 1){
				prime = "000" + binned_WTP 
			} else if (num_digits == 2){
				prime = "00" + binned_WTP
			}		
		
			return primingBoard1 + "control_non_food/" + prime + fileTypeBMP + primingBoard2
		}		
	} else if(current_state == "practice"){
		prime = "Ruffles"
		return practicePrimingBoard1 + "stim_numbered/demo/" + prime + fileTypeBMP + primingBoard2
	}
}

var getFixation = function(){
	if(current_state == "test"){
	
		return '<div class = bigbox><div class = centerbox><div class = fixation><font color="white">+</font></div></div></div>'
	}else if(current_state == "practice"){
	
		return '<div class = bigbox><div class = practice_rating_text>'+
		'<p class = center-text2><font color = "white">This is a practice choice trial. </font></p>'+
		'</div><div class = centerbox><div class = fixation><font color="white">+</font></div></div></div>'
		
		
		
	}
}



var ratingSplit = function(){
	stimArrayRating = [] //one for each stim
	stimPlacementArray = [] //mult for each stim
	b = math.matrix(math.zeros([numStims, numRepetitions + 1])); //add 1 for label 
	for (var i = 0; i < jsPsych.data.getData().length; i++){
		if (jsPsych.data.getDataByTrialIndex(i).trial_id == 'rating_block'){
			stimPlacementArray.push(jsPsych.data.getDataByTrialIndex(i).stim) 			
			if (stimArrayRating.indexOf(jsPsych.data.getDataByTrialIndex(i).stim) == -1){ // if this is the first time you've seen stim
				b.subset(math.index(stimArrayRating.length, 1),jsPsych.data.getDataByTrialIndex(i).stim_WTP); 
				b.subset(math.index(stimArrayRating.length, 0),jsPsych.data.getDataByTrialIndex(i).stim); 
				stimArrayRating.push(jsPsych.data.getDataByTrialIndex(i).stim)			
			}else if (stimArrayRating.indexOf(jsPsych.data.getDataByTrialIndex(i).stim) != -1){ //second or more time you've seen stim
				indexes = getAllIndexes(stimPlacementArray, jsPsych.data.getDataByTrialIndex(i).stim)
				b.subset(math.index(stimArrayRating.indexOf(jsPsych.data.getDataByTrialIndex(i).stim), indexes.length),jsPsych.data.getDataByTrialIndex(i).stim_WTP); 		
			}		
		}	
	} //above part creates matrix of stims with different values chosen for each stim
	
	a = math.matrix(math.zeros([numStims, 2]));
	for (var x = 0; x < numStims; x++){
		a.subset(math.index(x, 0), b.subset(math.index(x, 0)));
		value = 0
		value_num = 0
		for (y = 1; y <numRepetitions + 1; y++){
			if (b.subset(math.index(x, y)) != -1){
			value += b.subset(math.index(x, y))
			value_num += 1
			}
		}
		average_value = value/value_num
		a.subset(math.index(x, 1), average_value);
	} //above part averages the values for each stimulus
			
	sorted_value_array =[]
	for (var xx = 0; xx< numStims; xx++){
		if (Number.isInteger(a.subset(math.index(xx, 1))) === true){ 
			sorted_value_array.push(a.subset(math.index(xx, 1)) + '.00_' + a.subset(math.index(xx, 0)))
		} else if (Number.isInteger(a.subset(math.index(xx, 1))) === false){
			sorted_value_array.push(a.subset(math.index(xx, 1)) + '_' + a.subset(math.index(xx, 0))) 
		}
	}
	sorted_value_array.sort()
	// above part sorts the values from LOW to HIGH
	
	stims = createBlockStims()
	return stims
	
}

var createBlockStims = function(){
	var temp_stims = []
	for(var i = 0; i < numStims/2; i++){
		temp = Math.round((Math.random() * 1));
		
		if (temp%2 === 0){
			stim1temp = sorted_value_array[i * 2]
			stim1_val = ''
			stim1_stim = ''
			for(var x = 0; x < stim1temp.indexOf('_'); x++){
				stim1_val += stim1temp[x]
			}
			
			for(var y = stim1temp.indexOf('_') + 1; y < stim1temp.length; y++){
				stim1_stim += stim1temp[y]
			}
		
			stim2temp = sorted_value_array[i * 2 + 1]
			stim2_val = ''
			stim2_stim = ''
			for(var z = 0; z < stim2temp.indexOf('_'); z++){
				stim2_val += stim2temp[z]
			}
			
			for(var c = stim2temp.indexOf('_') + 1; c < stim2temp.length; c++){
				stim2_stim += stim2temp[c]
			}
		} else if (temp%2 !== 0){
			stim1temp = sorted_value_array[i * 2 + 1]
			stim1_val = ''
			stim1_stim = ''
			for(var d = 0; d < stim1temp.indexOf('_'); d++){
				stim1_val += stim1temp[d]
			}
			
			for(var e = stim1temp.indexOf('_') + 1; e < stim1temp.length; e++){
				stim1_stim += stim1temp[e]
			}
		
		
			stim2temp = sorted_value_array[i * 2]
			stim2_val = ''
			stim2_stim = ''
			for(var f = 0; f < stim2temp.indexOf('_'); f++){
				stim2_val += stim2temp[f]
			}
			
			for(var g = stim2temp.indexOf('_') + 1; g < stim2temp.length; g++){
				stim2_stim += stim2temp[g]
			}
			
		}
		
			stim1 = { 
				stim_WTP: stim1_val,
				stim_partner_WTP: stim2_val,
				trial_type: "prime",
				stim: stim1_stim,
				which_side: "left",
				stim_partner: stim2_stim,
				binned_WTP: i + 1
				}
		
			stim2 = {
				stim_WTP: stim2_val,
				stim_partner_WTP: stim1_val,
				trial_type: "control",
				stim: stim2_stim,
				which_side: "right",
				stim_partner: stim1_stim,
				binned_WTP: i + 1
				}
					
			stim3 = { 
				stim_WTP: stim1_val,
				stim_partner_WTP: stim2_val,
				trial_type: "prime",
				stim: stim1_stim,
				which_side: "right",
				stim_partner: stim2_stim,
				binned_WTP: i + 1
				}
					
			stim4 = {
				stim_WTP: stim2_val,
				stim_partner_WTP: stim1_val,
				trial_type: "control",
				stim: stim2_stim,
				which_side: "left",
				stim_partner: stim1_stim,
				binned_WTP: i + 1
				}
			
	
	temp_stims.push(stim1)
	temp_stims.push(stim2)
	temp_stims.push(stim3)
	temp_stims.push(stim4)
		
	}
	
	
	temp_stims = jsPsych.randomization.repeat(temp_stims, 1 , true)
	return temp_stims

}


function getAllIndexes(arr, val) {
    var indexes = [], i = -1;
    while ((i = arr.indexOf(val, i+1)) != -1){
        indexes.push(i);
    }
    return indexes;
}


function getAllIndexesList(arr,val){
	all_indexes = []
	for(var i = 0; i < arr.length; i++){
		indexes = getAllIndexes(arr[i],val)
		if (indexes.length !== 0){
			indexes.push(i)
			all_indexes.push(indexes)
		}
	}
	//this function will return an array, temp, containing indexes for each item in the array, arr.  
	//In the array, temp, the values will be the indexes for the searched value.  
	//The LAST value in the array, temp, will be the index in the array, arr, for the value, val.  
	
	// this function searches an array of strings for a value.  Will itterively search each str in array, for a partial str.
	return all_indexes
}


	
var appendData = function(){
	curr_trial = jsPsych.progress().current_trial_global
	trial_id = jsPsych.data.getDataByTrialIndex(curr_trial).trial_id
	
	if((trial_id == "mask_after") || (trial_id == "mask_before")){
		
		jsPsych.data.addDataToLastTrial({
			mask: mask,
			current_block_trial: current_prime_trial,
			current_block: current_prime_block
		})
	
	} else if ((trial_id == "rating_block") || (trial_id == "second_rating_block")){
		
		jsPsych.data.addDataToLastTrial({
			stim: stim,
			stim_WTP: WTP,
		})
	
	} else if (trial_id == "forced_choice") {
	
		var which_chosen = jsPsych.data.getDataByTrialIndex(curr_trial).key_press
		var chosen_stim_temp = ""
		
		if (which_chosen == 37){
			chosen_stim_temp = stim1
		} else if (which_chosen == 39){
			chosen_stim_temp = stim2
		}
		
		jsPsych.data.addDataToLastTrial({
			mask: mask,
			stim_left: stim1,
			stim_right: stim2,
			stim_left_WTP: stim1_WTP,
			stim_right_WTP: stim2_WTP,
			binned_WTP: binned_WTP,
			prime_trial_type: trial_type,
			current_block_trial: current_prime_trial,
			current_block: current_prime_block,
			chosen_stim: chosen_stim_temp
			
		})
		
		if(current_state == "test"){
			current_prime_trial += 1
		}
	} else if (trial_id == "prime"){
	
		jsPsych.data.addDataToLastTrial({
			prime: prime,
			prime_trial_type: trial_type,
			current_block_trial: current_prime_trial,
			current_block: current_prime_block
		})
	
	} else if( trial_id == "post_questionnaire_block"){
		jsPsych.data.addDataToLastTrial({
			current_answer: post_question_current_answer,
			current_question: post_questions[post_questionNum -1]
		})
	} else if(trial_id == "demographic_block"){
		jsPsych.data.addDataToLastTrial({
			age: age,
			gender: gender,
			race: race,
			ethnicity: ethnicity,
			
		})
	
	}
	
	
	
	
	//currTrial += 1
}


document.addEventListener("keydown", function(e){
    var keynum;
    if(window.event){
    	keynum = e.keyCode;
    } else if(e.which){
    	keynum = e.which;
    }
    
    forcedButtonTracker.push(keynum)
    
    if ((keynum == 37) && (forcedButtonTracker.indexOf(39) == -1)){
    	$('#image_left').addClass('selected');
    	
    	
    
    }else if((keynum == 39) && (forcedButtonTracker.indexOf(37) == -1)){
    	$('#image_right').addClass('selected');
    
    }
    
});

/* ************************************ */
/*    Define Experimental Variables     */
/* ************************************ */
var subject_ID = 472

var numStims = 60 // 60, 10
var rating_length = 60 //120, 20;
var numIterrating = rating_length / numStims; // number of times stimuli is repeated during rating phases
var manipulation_length = numStims * 2
var numRepetitions = numIterrating
var WTP_high_end = 3
var numBlocks = 5
var num_mask_stims = 15
var current_state = "practice"
var submitPress = 0
var submitPressMax = 50



var preFileType = "<img class = center src='/static/experiments/rep_drift/images/"
var primeType = "<img class = prime src='/static/experiments/rep_drift/images/"
var forceTypeLeft = "<img id = 'image_left' class = force src='/static/experiments/rep_drift/images/"
var forceTypeRight = "<img id = 'image_right' class = force src='/static/experiments/rep_drift/images/"


var pathSource = "/static/experiments/rep_drift/images/stim_numbered/"
var fileTypeBMP = ".bmp'></img>"
var fileTypePNG = ".png'></img>"
var fileTypeJPG = ".jpg'></img>"


var post_questions = [
					  '1) Did you notice anything about the experiment?',
					  '2) During the phases where you had to submit how much you were willing to pay for each food item, did you use any strategies? If so, please explain.',
					  '3) During the phase where you had to make choices between food items, did you use any strategies to help you make your decision? If so, please explain.',
				 	  '4) During the phase where you had to make choices between food items, did you notice anything about the white noise video?',
				 	  '5) Did you notice that there were pictures within the masks that were presented very briefly?  If so, were you able to clearly see the object?',
				 	  '6) Did you notice that sometimes, the briefly presented pictures were the same as one of the two choices, and that sometimes, it was neither of the two choices?',
				 	  '7) Do you have any thoughts, comments, or concerns about the task?'
				 	 ]
	
				 
var post_questionNum = 0	


var high_low_sorted = []
var stimArrayRating = []
var stimPlacementArray = []
var stims = []
var a = ""
var b = ""
var stim = ""
var stim_partner = ""
var prime = ""
var trial_type = ""
var binned_WTP = ""
var average_WTP = ""
var which_side = ""
var WTP = ""
var WTP_length  = ""
var current_prime_trial = "practice_choice"
var current_prime_block = "practice_choice"
var stim1_WTP = ""
var stim2_WTP = ""
var forcedButtonTracker = []
var post_question_current_answer = ''
var age = ""
var race = ""
var ethnicity = ""
var gender = ""

///////////////////////////////////////////////////////

var practiceRatingBoard1 = '<div class = bigbox><div class = practice_rating_text>'+
		'<p class = center-text2><font color = "white">This is a practice auction trial.  For this trial, please input how much you are willing to pay for the item, in the format (#.##).</font></p>'+
		'<p class = center-text2><font color = "white">Only numbers and 1 period is allowed.  No letters or other special characters permitted. Please respond within the range $0 to $3, inclusive. </font></p>'+
		'<p class = center-text2><font color = "white">Please ensure that you are inputting your <strong>TRUE</strong> willingness to pay value for each item.</font></p>'+
		"</div><div class = ratingbox>"+preFileType + "stim_numbered/"


var ratingBoard1 = '<div class = bigbox>'+
		"<div class = ratingbox>"+preFileType + "stim_numbered/"
		

var ratingBoard2 = fileTypeBMP+"</div>"+
		'<div class = sliderbox>' +
	
		'<div class = labelbox><label for="points"><font color="white" size = "5">Money to Spend on Item:</font></label></div>' +
		
		'<div class = rangebox_left><p class = center-block-text2><font color="white" size = "7">$</font></p></div>'+
		
		'<div class = rangebox><input type="number" step = ".01" min = "0" max = "3" id = "WTP_text" name="FirstName" value=""></div>' +
		  
		'<div class = submitbox><input type="submit" value="Submit" data-inline="true" onClick="pressSubmit(document.getElementById(\'WTP_text\'))"/></div>'+
	
		'</div></div>'


/////////////////////////////////////////////////////// 	

var practicePrimingBoard1 = '<div class = bigbox><div class = practice_rating_text>'+
		'<p class = center-text2><font color = "white">This is a practice choice trial.</font></p>'+
		"</div><div class = ratingbox>"+primeType 


var primingBoard1 = '<div class = bigbox>'+
		"<div class = ratingbox>"+primeType 
		
var primingBoard2 = "</div></div>"


///////////////////////////////////////////////////////

var practiceForcedChoiceBoard1 = '<div class = bigbox><div class = practice_rating_text>'+
		'<p class = center-text2><font color = "white">This is a practice choice trial.</font></p>'+
		"</div><div class = decision-left>"+forceTypeLeft+"stim_numbered/"
		

var forcedChoiceBoard1 = '<div class = bigbox>'+
		"<div class = decision-left>"+forceTypeLeft+"stim_numbered/"

var forcedChoiceBoard2 = "<div class = decision-right>"+forceTypeRight+"stim_numbered/"

///////////////////////////////////////////////////////

var practiceMaskingBoard1 = '<div class = bigbox><div class = practice_rating_text>'+
		'<p class = center-text2><font color = "white">This is a practice choice trial.</font></p>'+
		"</div><div class = ratingbox>"+preFileType+"fluency_mask_no_border/"
		
		

var maskingBoard1 = '<div class = bigbox>'+
		"<div class = ratingbox>"+preFileType+"fluency_mask_no_border/"
		
var maskingBoard2 = fileTypePNG+"</div></div>"


///////////////////////////////////////////////////////



var preloadStimNumbered = createStims(numStims, 1)
var preloadControlNonFood = createStims(30, 1)

 	
var images = []
for(var i=0;i<preloadStimNumbered.length;i++){
	images.push(pathSource + preloadStimNumbered[i] + ".bmp")
}
jsPsych.pluginAPI.preloadImages(images);


var images = []
for(var i=0;i<preloadControlNonFood.length;i++){
	images.push("/static/experiments/rep_drift/images/control_non_food/" + preloadControlNonFood[i] + ".bmp")
}
jsPsych.pluginAPI.preloadImages(images);

var images = []
for(var i=0; i < num_mask_stims; i++){
	images.push("/static/experiments/rep_drift/images/fluency_mask_no_border/mask_" + i + ".png")
}
jsPsych.pluginAPI.preloadImages(images);


var stimArray = createStims(numStims,numIterrating)


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
		  '<p class = center-textJamie><font color="white">Thanks for completing this task!</font></p>'+
		  '<p class = center-textJamie><font color="white">Press<strong> enter</strong> to continue.</font></p>'+
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
		  '<p class = center-textJamie><font color="white">Welcome to the task!</font></p>'+
		  '<p class = center-textJamie><font color="white">Press<strong> enter</strong> to continue.</font></p>'+
		  '</div></div>',
	cont_key: [13],
	timing_post_trial: 0
};


var instructions_intro = {
	type: 'poldrack-text',
	data: {
		trial_id: "instructions"
	},
	timing_response: -1,
	text: '<div class = bigbox><div class = centerbox>'+
			'<p class = center-textJamie><font color = "white">We will now begin with instructions for the task.</font></p>'+
			'<p class = center-textJamie><font color = "white">Press <strong>enter</strong> to continue.</font></p>'+		
	
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
			'<p class = block-text><font color = "white">This experiment is composed of three phases.</font></p>'+
			'<p class = block-text><font color = "white">In the first phase, you will participate in an auction.  Food items will be presented on the screen one at a time.</font></p>'+
			'<p class = block-text><font color = "white">For each item, please input how much you are willing to pay for that food item, in the format (#.##).</font></p>'+
			'<p class = block-text><font color = "white">You will have $3 to spend for <strong>each food item on every trial</strong>.</font></p>'+	
			'<p class = block-text><font color = "white">Please ensure that you are inputting your <strong>TRUE</strong> willingness to pay value for each item.</font></p>'+	
			'<p class = block-text><font color = "white">We will start with a practice auction trial.</font></p>'+	
			'<p class = block-text><font color = "white">Press <strong>enter</strong> to continue.</font></p>'+		
	
		 '</div></div>',
	cont_key: [13],
	timing_post_trial: 0
};


var fixation_block = {
	type: 'poldrack-single-stim',
	stimulus: getFixation,
	is_html: true,
	choices: 'none',
	data: {
		trial_id: "fixation"
	},
	timing_post_trial: 0,
	timing_stim: 500,
	timing_response: 500
};


var rating_intro = {
	type: 'poldrack-single-stim',
	stimulus: '<div class = bigbox><div class = centerbox>'+
		'<p class = center-textJamie><font color = "white">We will begin the auction. </font></p>'+
		'<p class = center-textJamie><font color = "white">Press <strong>enter</strong> to continue.</font></p>'+
		'</div></div>',
	is_html: true,
	choices: [13],
	data: {
		exp_id: "rep_drift",
		"trial_id": "rating_intro"
	},
	timing_post_trial: 0,
	timing_stim: -1,
	timing_response: -1,
	response_ends_trial: true
};



var second_rating_instructions = {
	type: 'poldrack-single-stim',
	stimulus: '<div class = bigbox><div class = centerbox>'+
		
		'<p class = block-text><font color = "white">In this next phase, you will engage in a second auction.  As a reminder:</font></p>'+
		'<p class = block-text><font color = "white">For each item, please input how much you are willing to pay for that food item, in the format (#.##).</font></p>'+
		'<p class = block-text><font color = "white">You will have $3 to spend for each food item on every trial.</font></p>'+
		'<p class = block-text><font color = "white">Please ensure that you are inputting your <strong>TRUE</strong> willingness to pay value for each item.</font></p>'+
		'<p class = block-text><font color = "white">Press <strong>enter</strong> to continue.</font></p>'+

		'</div></div>',
	is_html: true,
	choices: [13],
	data: {
		exp_id: "rep_drift",
		"trial_id": "second_rating_intro"
	},
	timing_post_trial: 0,
	timing_stim: -1,
	timing_response: -1,
	response_ends_trial: true
};


var priming_intro = {
	type: 'poldrack-single-stim',
	stimulus: 
		'<div class = bigbox><div class = centerbox>'+
		
		'<p class = block-text><font color = "white">In this next phase, for ever trial you will see a white fixation point, followed by a white noise video, followed by two food pictures. One of the food pictures will be on the left, and the other on the right.</font></p>'+
		'<p class = block-text><font color = "white">For as long as the fixation point, and the white noise video are up on the screen, please keep your eyes fixated on the center of both the fixation and the white noise video. No response required during fixation and white noise video.</font></p>'+
		'<p class = block-text><font color = "white">When the two food pictures come up, please choose which food item you prefer over the other by <strong>pressing the right arrow key</strong> to choose the food item on the right, and <strong>left arrow key</strong> to choose the food item on left. A green box will highlight your choice.</font></p>'+
		'<p class = block-text><font color = "white">For each of these trials, please respond as <strong>QUICKLY </strong>and as truthfully as possible. You will have 2.5 seconds to make your choice before the trial will end, please try to make your choice before this.</font></p>'+
		'<p class = block-text><font color = "white">We will start with a practice trial.  This practice trial will move quickly, so pay attention.  Start with your eyes in the center of the computer screen, and with your fingers on the <strong>left</strong> and <strong>right arrow keys</strong>.</font></p>'+
		'<p class = block-text><font color = "white">Press <strong>enter</strong> to continue.</font></p>'+

		'</div></div>',
			  
	is_html: true,
	choices: [13],
	data: {
		exp_id: "rep_drift",
		"trial_id": "priming_intro"
	},
	timing_post_trial: 0,
	timing_stim: -1,
	timing_response: -1,
	response_ends_trial: true
};

var demographic_intro = {
    type: 'poldrack-text',
    data: {
        trial_id: "demographic_intro",
    },
    timing_response: -1,
    text: '<div class = bigbox><div class = centerbox>'+
    '<p class = block-text><font color="white">On the next page, you will see a list of basic demographic information.</font></p>'+
    '<p class = block-text><font color="white">Please answer each question by writing the corresponding number of your choice in each text box.</font></p>'+
    '<p class = block-text><font color="white">Press <strong>enter</strong> to continue.</font></p>'+
    '</div></div>',
    cont_key: [13],
    timing_post_trial: 0,
};


var demographic_block = {
	type: 'poldrack-single-stim',
	stimulus: '<div class = bigbox>'+
					'<div class = questions>'+
    				'<p class = center-block-text><font color="white">What is your age? Please input a numeric response in years. (e.g., 18)</font></p>'+
    					'<div class = demo_text><input type="number" step = "1" min = "0" max = "200" id = "demo_age" value=""></div>'+
    				'</div>'+
    				
    				'<div class = questions>'+
    				'<p class = center-block-text><font color="white">What is your ethnicity? Please choose <strong>one</strong> answer from the following choices:</font></p>'+
    					'<p class = center-block-text2><font color="white">1) Hispanic or Latino</font></p>'+
    					'<p class = center-block-text2><font color="white">2) NOT Hispanic or Latino</font></p>'+
    					'<p class = center-block-text2><font color="white">3) Unknown / Not Reported</font></p>'+
    					'<div class = demo_text><input type="number" step = "1" min = "1" max = "3" id = "demo_ethnicity" value=""></div>'+
    				'</div>'+
    					
    				'<div class = questions>'+
    				'<p class = center-block-text><font color="white" size="5">What is your race? Please choose <strong>one</strong> answer from the following choices:</font></p>'+
    					'<p class = center-block-text2><font color="white">1) American Indian/Alaska Native</font></p>'+
    					'<p class = center-block-text2><font color="white">2) Asian</font></p>'+
    					'<p class = center-block-text2><font color="white">3) Native Hawaiian or other Pacific Islander</font></p>'+
    					'<p class = center-block-text2><font color="white">4) Black or African American</font></p>'+
    					'<p class = center-block-text2><font color="white">5) White</font></p>'+
    					'<p class = center-block-text2><font color="white">6) More than one race</font></p>'+
    					'<p class = center-block-text2><font color="white">7) Unknown / Not Reported</font></p>'+
    					'<div class = demo_text><input type="number" step = "1" min = "1" max = "7" id = "demo_race" value=""></div>'+
    				'</div>'+
    				
    				'<div class = questions>'+
    				'<p class = center-block-text><font color="white" size="5">What is your gender? Please choose <strong>one</strong> answer from the following choices:</font></p>'+
    					'<p class = center-block-text2><font color="white">1) Male</font></p>'+
    					'<p class = center-block-text2><font color="white">2) Female</font></p>'+
    					'<div class = demo_text><input type="number" step = "1" min = "1" max = "2" id = "demo_gender" value=""></div>'+
    				'</div>'+	
    					
    				'<br><br><input type="submit" id="demo_block" value="Submit" data-inline="true" onClick="pressSubmit(this)"/>'+
    			'</div>',
	is_html: true,
	choices: [81], 
	data: {
		exp_id: "rep_drift",
		"trial_id": "demographic_block"
	},
	timing_post_trial: 0,
	timing_stim: -1,
	timing_response: -1,
	response_ends_trial: true,
	on_finish: appendData
};

var priming_start = {
	type: 'poldrack-single-stim',
	stimulus: 
		'<div class = bigbox><div class = centerbox>'+
		
		'<p class = block-text><font color = "white">The upcoming trials will look similar to the practice trial you have just finished, only without the practice text on the top of the screen.</font></p>'+
		'<p class = block-text><font color = "white">During the practice trial, you saw the fixation, followed by a white noise video, followed by two food pictures.</font></p>'+
		'<p class = block-text><font color = "white">While the fixation and the white noise video are up on the screen, please keep your eyes fixated in the center of both items. No response required during fixation and white noise video.</font></p>'+
		'<p class = block-text><font color = "white">When the food pictures come up, please choose which food you prefer over the other by<strong> pressing the right arrow key </strong>to choose the image on the right, and the <strong>left arrow </strong>key to choose the image on the left.  A green box will highlight your choice.</font></p>'+
		'<p class = block-text><font color = "white">Please choose which food you prefer, as <strong>QUICKLY </strong>and as truthfully as possible.  You will have 2.5 seconds to make your choice before the trial will end, please try to make your choice before this.</font></p>'+
		'<p class = block-text><font color = "white">We will now start the next phase.  Please get ready by fixating your eyes at the center of the screen, and by placing your fingers on the <strong>left and right arrow keys</strong>.</font></p>'+
		'<p class = block-text><font color = "white">Press <strong>enter</strong> to continue.</font></p>'+


		'</div></div>',
			  
	is_html: true,
	choices: [13],
	data: {
		exp_id: "rep_drift",
		"trial_id": "priming_intro"
	},
	timing_post_trial: 0,
	timing_stim: -1,
	timing_response: -1,
	response_ends_trial: true,
	on_finish: function(){
	current_state = "test"
	current_prime_trial = 0
	current_prime_block = 0 
	}
};

var getRatingValues = {
    type: 'call-function',
    func: ratingSplit
}


var practice_rating_block = {
	type: 'poldrack-single-stim',
	stimulus: getPracticeRatingStim,
	is_html: true,
	choices: [81], //48,49,50,51,52
	data: {
		exp_id: "rep_drift",
		"trial_id": "practice_rating_block"
	},
	timing_post_trial: 0,
	timing_stim: -1,
	timing_response: -1,
	response_ends_trial: true,
	on_finish: appendData,
	on_start: function(){
	submitPress = 0
	}
};


var post_exp_questionnaire_intro = {
        type: 'poldrack-text',
        data: {
                trial_id: "post_exp_questionnaire_intro",
        },
        timing_response: -1,
        text: '<div class = bigbox><div class = centerbox>'+
        '<p class = center-textJamie><font color = "white">We will now start the post-experiment questionnaire.</font></p>'+
        '<p class = center-textJamie><font color = "white">Press <strong>enter</strong> to begin.</font></p>'+
        '</div></div>',
        cont_key: [13],
        timing_post_trial: 0,
};
		




/* ************************************ */
/*        Set up timeline blocks        */
/* ************************************ */




first_rating_trials = []
for (x=0;x<rating_length;x++){ //rating_length

	var rating_block = {
	type: 'poldrack-single-stim',
	stimulus: getRatingStim,
	is_html: true,
	choices: [81], //48,49,50,51,52
	data: {
		exp_id: "rep_drift",
		"trial_id": "rating_block"
	},
	timing_post_trial: 0,
	timing_stim: -1,
	timing_response: -1,
	response_ends_trial: true,
	on_finish: appendData,
	on_start: function(){
	submitPress = 0
	}
	};

first_rating_trials.push(rating_block)

}


var firstRatingNode = {
	timeline: first_rating_trials,
	loop_function: function(data) {
	}
}

var feedback_block = {
	type: 'poldrack-text',
	data: {
		trial_id: "feedback"
	},
	timing_response: -1,
	text: getFeedbackText,
	cont_key: [13],
	timing_post_trial: 0
};

fluency_manipulation_trials = []
for (x = 0; x<manipulation_length; x++){ //manipulation_length

	var mask_block_before = {
	type: 'poldrack-single-stim',
	stimulus: getMaskStim,
	is_html: true,
	choices: 'none',
	data: {
		exp_id: "rep_drift",
		"trial_id": "mask_before"
		},
	timing_post_trial: 0,
	timing_stim: 50,
	timing_response: 50,
	response_ends_trial: false,
	on_finish: appendData
	};
	
	var prime_block = {
	type: 'poldrack-single-stim',
	stimulus: getPrimeStim,
	is_html: true,
	choices: 'none',
	data: {
		exp_id: "rep_drift",
		"trial_id": "prime"
		},
	timing_post_trial: 0,
	timing_stim: 20,
	timing_response: 20,
	response_ends_trial: false,
	on_finish: appendData
	};
	
	var mask_block_after = {
	type: 'poldrack-single-stim',
	stimulus: getMaskStim,
	is_html: true,
	choices: 'none',
	data: {
		exp_id: "rep_drift",
		"trial_id": "mask_after"
		},
	timing_post_trial: 0,
	timing_stim: 50,
	timing_response: 50,
	response_ends_trial: false,
	on_finish: appendData
	};
	
	var forced_choice_block = {
	type: 'poldrack-single-stim',
	stimulus: getForcedChoiceStim,
	is_html: true,
	choices: [37,39],
	data: {
		exp_id: "rep_drift",
		"trial_id": "forced_choice"
		},
	timing_post_trial: 0,
	timing_stim: 2500,
	timing_response: 2500,
	response_ends_trial: false,
	on_start: function(){
		forcedButtonTracker = []
		},
	on_finish: appendData
	};
	
	fluency_manipulation_trials.push(fixation_block)
	
	for(var i = 0; i < 10; i++){
		fluency_manipulation_trials.push(mask_block_before)
	}
	
	fluency_manipulation_trials.push(prime_block)
	
	for(var y = 0; y < 10; y++){
		fluency_manipulation_trials.push(mask_block_after)
	}
	
	fluency_manipulation_trials.push(forced_choice_block)
}

fluency_manipulation_trials.push(feedback_block)


var fluencyManipulationTrials = {
	timeline: fluency_manipulation_trials,
	loop_function: function(data) {
		stimArray = createStims(numStims,numIterrating)
		current_prime_trial = 0
		current_prime_block += 1
		stims = createBlockStims()
		if(current_prime_block == numBlocks){
			return false
		}else if (current_prime_block < numBlocks){
			return true
		}
		
	}
}


var practice_fluency_manipulation_trials = []
practice_fluency_manipulation_trials.push(fixation_block)
for(var i = 0; i < 10; i++){
		practice_fluency_manipulation_trials.push(mask_block_before)
	}
practice_fluency_manipulation_trials.push(prime_block)
for(var y = 0; y < 10; y++){
		practice_fluency_manipulation_trials.push(mask_block_after)
	}
practice_fluency_manipulation_trials.push(forced_choice_block)

var practiceFluencyManipulationTrials = {
	timeline: practice_fluency_manipulation_trials,
	loop_function: function(data) {
		
	}
}


second_rating_trials = []
for (x=0;x< rating_length;x++){ //same as first rating?? should be once, because it will now be WTP

	var rating_block = {
	type: 'poldrack-single-stim',
	stimulus: getRatingStim,
	is_html: true,
	choices: [81], //48,49,50,51,52
	data: {
		exp_id: "rep_drift",
		"trial_id": "second_rating_block"
	},
	timing_post_trial: 0,
	timing_stim: -1,
	timing_response: -1,
	response_ends_trial: true,
	on_finish: appendData,
	on_start: function(){
	submitPress = 0
	}
	};

second_rating_trials.push(rating_block)

}


var secondRatingNode = {
	timeline: second_rating_trials,
	loop_function: function(data) {
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
		exp_id: "rep_drift",
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

var rep_drift_experiment = []



rep_drift_experiment.push(welcome_block);
rep_drift_experiment.push(demographic_intro);
rep_drift_experiment.push(demographic_block);

rep_drift_experiment.push(instructions_intro);
rep_drift_experiment.push(instructions_block);
rep_drift_experiment.push(practice_rating_block);

rep_drift_experiment.push(rating_intro);
rep_drift_experiment.push(firstRatingNode);
rep_drift_experiment.push(getRatingValues)


rep_drift_experiment.push(priming_intro);
rep_drift_experiment.push(practiceFluencyManipulationTrials)
rep_drift_experiment.push(priming_start);
rep_drift_experiment.push(fluencyManipulationTrials);

rep_drift_experiment.push(second_rating_instructions);
rep_drift_experiment.push(rating_intro);
rep_drift_experiment.push(secondRatingNode);

rep_drift_experiment.push(post_exp_questionnaire_intro)
rep_drift_experiment.push(post_questionnaire_node)


rep_drift_experiment.push(end_block);




