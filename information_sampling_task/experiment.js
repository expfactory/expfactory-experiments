
/* ************************************ */
/* Define helper functions */
/* ************************************ */

function appendTextAfter(input,search_term, new_text) {
	var index = input.indexOf(search_term)+search_term.length
	return input.slice(0,index) + new_text + input.slice(index)
}

function appendTextAfter2(input,search_term, new_text) {
	var index = input.indexOf(search_term)+search_term.length
	return input.slice(0,index) + new_text + input.slice(index+'/static/experiments/information_sampling_task/images/grey_small_square.png'.length+6+1)
}


var appendTestData = function(){
	if(whichColor==1){
		if(color1.indexOf(tempID,0)!=-1){
			jsPsych.data.addDataToLastTrial({clicked_on: whichSmallColor1, box_id: tempID, which_click_in_round: numClicks, correct_response: whichLargeColor1})
		} else if (color2.indexOf(tempID, 0) != -1){
			jsPsych.data.addDataToLastTrial({clicked_on: whichSmallColor2, box_id: tempID, which_click_in_round: numClicks, correct_response: whichLargeColor1})
		} else if (tempID==26){
			jsPsych.data.addDataToLastTrial({clicked_on: whichLargeColor1, box_id: tempID, which_click_in_round: numClicks, correct_response: whichLargeColor1})
		} else if (tempID==27){
			jsPsych.data.addDataToLastTrial({clicked_on: whichLargeColor2, box_id: tempID, which_click_in_round: numClicks, correct_response: whichLargeColor1})
		}
	} else if(whichColor===0){
		if(color1.indexOf(tempID,0)!=-1){
			jsPsych.data.addDataToLastTrial({clicked_on: whichSmallColor1, box_id: tempID, which_click_in_round: numClicks, correct_response: whichLargeColor2})
		} else if (color2.indexOf(tempID, 0) != -1){
			jsPsych.data.addDataToLastTrial({clicked_on: whichSmallColor2, box_id: tempID, which_click_in_round: numClicks, correct_response: whichLargeColor2})
		} else if (tempID==26){
			jsPsych.data.addDataToLastTrial({clicked_on: whichLargeColor1, box_id: tempID, which_click_in_round: numClicks, correct_response: whichLargeColor2})
		} else if (tempID==27){
			jsPsych.data.addDataToLastTrial({clicked_on: whichLargeColor2, box_id: tempID, which_click_in_round: numClicks, correct_response: whichLargeColor2})
		}
	}
}
	

var appendRewardDataDW= function(){
	jsPsych.data.addDataToLastTrial({reward: reward})
}

var appendRewardDataFW= function(){
	jsPsych.data.addDataToLastTrial({reward: reward})
}


var getRound = function(){
  if(roundOver === 0){ // start of the round
		gameState=gameSetup
			gameState=appendTextAfter2(gameState, "id = '26'", " src='/static/experiments/information_sampling_task/images/"+whichLargeColor1+".png'")		
			gameState=appendTextAfter2(gameState, "id = '27'", " src='/static/experiments/information_sampling_task/images/"+whichLargeColor2+".png'")		

		return gameState
  }else if(roundOver == 1){
  			gameState=gameSetup
  			gameState=appendTextAfter2(gameState, "id = '26'", " src='/static/experiments/information_sampling_task/images/"+whichLargeColor1+".png'")		
			gameState=appendTextAfter2(gameState, "id = '27'", " src='/static/experiments/information_sampling_task/images/"+whichLargeColor2+".png'")		
		clickedCards.sort(function(a, b){return a-b})
		for(i=0;i<clickedCards.length; i++){
			if(color1.indexOf(clickedCards[i],0)!=-1){
				gameState=appendTextAfter2(gameState, "id = '"+""+clickedCards[i]+"'", " src='/static/experiments/information_sampling_task/images/"+whichSmallColor1+".png'")		
			} else if(color2.indexOf(clickedCards[i],0)!=-1){
				gameState=appendTextAfter2(gameState, "id = '"+""+clickedCards[i]+"'", " src='/static/experiments/information_sampling_task/images/"+whichSmallColor2+".png'")		
			}
		}
		return gameState
  }
}




var chooseCard = function(clicked_id){
	tempID=clicked_id
	roundOver=1
	numClicks=numClicks+1
	currID = parseInt(clicked_id)
	clickedCards.push(clicked_id)
	temp = color1.indexOf(currID,0)
	if(temp!=-1){
		clickedCardsColor1.push(currID)
		e = jQuery.Event("keydown");
		e.which = 37; // # Some key code value
		e.keyCode = 37
		$(document).trigger(e);
		e = jQuery.Event("keyup");
		e.which = 37; // # Some key code value
		e.keyCode = 37
		$(document).trigger(e)
	} else if (temp ==-1){
		clickedCardsColor2.push(currID)
		e = jQuery.Event("keydown");
		e.which = 37; // # Some key code value
		e.keyCode = 37
		$(document).trigger(e);
		e = jQuery.Event("keyup");
		e.which = 37; // # Some key code value
		e.keyCode = 37
		$(document).trigger(e)	
	}
}

var pressKey = function(){
		e = jQuery.Event("keydown");
		e.which = 37; // # Some key code value
		e.keyCode = 37
		$(document).trigger(e);
		e = jQuery.Event("keyup");
		e.which = 37; // # Some key code value
		e.keyCode = 37
		$(document).trigger(e)
}

var makeChoice = function(clicked_id){
	tempID=clicked_id
	roundOver = 2 
	numClicks=numClicks+1
	currID= parseInt(clicked_id)
	if(clicked_id == 26){
	for(i=1;i<26;i++){
			if(color1.indexOf(i)!= -1){
			document.getElementById(''+i+'').src='/static/experiments/information_sampling_task/images/'+whichSmallColor1+'.png';
			} else if(color2.indexOf(i)!= -1){
			document.getElementById(''+i+'').src='/static/experiments/information_sampling_task/images/'+whichSmallColor2+'.png';
			}
		}
	bigBoxChoices.push([clicked_id, whichLargeColor1])
	setTimeout(pressKey,1500)
	
	
	}else if(clicked_id == 27){
	for(i=1;i<26;i++){
			if(color1.indexOf(i)!= -1){
			document.getElementById(''+i+'').src='/static/experiments/information_sampling_task/images/'+whichSmallColor1+'.png';
			} else if(color2.indexOf(i)!= -1){
			document.getElementById(''+i+'').src='/static/experiments/information_sampling_task/images/'+whichSmallColor2+'.png';
			}
		}
	
	bigBoxChoices.push([clicked_id, whichLargeColor2])
	setTimeout(pressKey,1500)

	}
}


var resetRound = function(){
	DWPoints = 250
	FWPoints = 0
	roundOver = 0
	numClicks = 0
	clickedCardsColor1 = []  //color1
	clickedCardsColor2 = []  //color2
	clickedCards = []
	colors = jsPsych.randomization.repeat(['green','red','blue','teal','yellow','orange','purple','brown'],1)
	numbersArray= jsPsych.randomization.repeat(numbers,1)
	whichColor = Math.floor(Math.random()*2)
	if(whichColor==1){
	color1=[]
	for(i=0;i<13;i++){
		temp=numbersArray.pop()
		color1.push(temp)
	}
	color2=[]
	for(i=0;i<12;i++){
		temp=numbersArray.pop()
		color2.push(temp)
	}
	whichLargeColor1 = colors[1]+'_'+shapes[1]
	whichLargeColor2 = colors[2]+'_'+shapes[1]

	whichSmallColor1 = colors[1]+'_'+shapes[0]
	whichSmallColor2 = colors[2]+'_'+shapes[0]
	} else if(whichColor === 0){
	color1=[]
	for(i=0;i<12;i++){
		temp=numbersArray.pop()
		color1.push(temp)
	}
	color2=[]
	for(i=0;i<13;i++){
		temp=numbersArray.pop()
		color2.push(temp)
	}
	whichLargeColor1 = colors[1]+'_'+shapes[1]
	whichLargeColor2 = colors[2]+'_'+shapes[1]

	whichSmallColor1 = colors[1]+'_'+shapes[0]
	whichSmallColor2 = colors[2]+'_'+shapes[0]
	
	}

}


var getRewardFW = function(){
	global_trial = jsPsych.progress().current_trial_global
	lastAnswer=jsPsych.data.getData()[global_trial-1].clicked_on
	correctAnswer=jsPsych.data.getData()[global_trial-1].correct_response
		if(lastAnswer==correctAnswer){
		totFWPoints=totFWPoints+100
		reward=100
		return '<div class = centerbox><p class = center-block-text>Correct! You have won 100 points!</p><p class = center-block-text>Press <strong>enter</strong> to continue.</p></div>'
		} else if(lastAnswer!=correctAnswer){
		totFWPoints=totFWPoints-100
		reward = -100
		return '<div class = centerbox><p class = center-block-text>Wrong! You have lost 100 points!</p><p class = center-block-text>Press <strong>enter</strong> to continue.</p></div>'
		}
}


var getRewardDW = function(){
	global_trial = jsPsych.progress().current_trial_global
	lastAnswer=jsPsych.data.getData()[global_trial-1].clicked_on
	correctAnswer=jsPsych.data.getData()[global_trial-1].correct_response
		if(lastAnswer==correctAnswer){
		clicks = numClicks-1
		lossPoints=clicks*10
		DWPoints=DWPoints-lossPoints
		reward = DWPoints
		totDWPoints = totDWPoints + DWPoints
		return '<div class = centerbox><p class = center-block-text>Correct! You have won '+DWPoints+' points!</p><p class = center-block-text>Press <strong>enter</strong> to continue.</p></div>'
		} else if(lastAnswer!=correctAnswer){
		totDWPoints = totDWPoints - DWPoints
		reward = DWPoints-100
		return '<div class = centerbox><p class = center-block-text>Wrong! You have lost 100 points!</p><p class = center-block-text>Press <strong>enter</strong> to continue.</p></div>'
		}
}

var instructionFunction = function(clicked_id){
	tempID=clicked_id
	currID = parseInt(clicked_id)
	clickedCards.push(clicked_id)
	temp = color1.indexOf(currID,0)
	if(temp!=-1){
		clickedCardsColor1.push(currID)
		document.getElementById(clicked_id).src='images/'+whichSmallColor1+'.png';

	} else if (temp ==-1){
		clickedCardsColor2.push(currID)
		document.getElementById(clicked_id).src='images/'+whichSmallColor2+'.png';

	}
}

var makeInstructChoice = function(clicked_id){
	if(clicked_id == 26){
		reward = '<div class = centerbox><p class = center-block-text>Correct! You have won 100 points!</p><p class = center-block-text>Press <strong>enter</strong> to continue.</p></div>'
		e = jQuery.Event("keydown");
		e.which = 37; // # Some key code value
		e.keyCode = 37
		$(document).trigger(e);
		e = jQuery.Event("keyup");
		e.which = 37; // # Some key code value
		e.keyCode = 37
		$(document).trigger(e)
	} else if(clicked_id == 27){
		reward = '<div class = centerbox><p class = center-block-text>Incorrect! You have lost 100 points! </p><p class = center-block-text>Press <strong>enter</strong> to continue.</p></div>'
		e = jQuery.Event("keydown");
		e.which = 37; // # Some key code value
		e.keyCode = 37
		$(document).trigger(e);
		e = jQuery.Event("keyup");
		e.which = 37; // # Some key code value
		e.keyCode = 37
		$(document).trigger(e)
	}
}

var getReward = function(){
	return reward
}

var getInstructFeedback = function() {
	return '<div class = centerbox><p class = center-block-text>' + feedback_instruct_text + '</p></div>'
}
/* ************************************ */
/* Define experimental variables */
/* ************************************ */
// generic task variables
var sumInstructTime = 0    //ms
var instructTimeThresh = 5   ///in seconds

// task specific variables
var e = ""
var totFWPoints = 0
var totDWPoints = 0
var DWPoints = 250
var FWPoints = 0
var roundOver = 0
var numClicks=0
var colors = jsPsych.randomization.repeat(['green','red','blue','teal','yellow','orange','purple','brown'],1)
colors.splice(0,0,'grey')
var shapes = ['small_square','large_square']
var numbers = ['1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24','25']
var conditions = ['FW','DW']
var whichCond = Math.floor(Math.random()*2)
var numbersArray= jsPsych.randomization.repeat(numbers,1)
var clickedCardsColor1 = []  //color1
var clickedCardsColor2 = []  //color2
var clickedCards = []
var bigBoxChoices = []
var whichColor = 1


color1=[]
for(i=0;i<13;i++){
	temp=numbersArray.pop()
	color1.push(temp)
}

color2=[]
for(i=0;i<12;i++){
	temp=numbersArray.pop()
	color2.push(temp)
}


whichLargeColor1 = colors[1]+'_'+shapes[1]
whichLargeColor2 = colors[2]+'_'+shapes[1]

whichSmallColor1 = colors[1]+'_'+shapes[0]
whichSmallColor2 = colors[2]+'_'+shapes[0]

 
 gameSetup= "<div class = bigbox><div class = numbox>"+
 			"<div class = square><input type='image' id = '1' src='/static/experiments/information_sampling_task/images/grey_small_square.png' onclick = chooseCard(this.id)></div>"+
 		    "<div class = square><input type='image' id = '2' src='/static/experiments/information_sampling_task/images/grey_small_square.png' onclick = chooseCard(this.id)></div>"+
            "<div class = square><input type='image' id = '3' src='/static/experiments/information_sampling_task/images/grey_small_square.png' onclick = chooseCard(this.id)></div>"+
  		    "<div class = square><input type='image' id = '4' src='/static/experiments/information_sampling_task/images/grey_small_square.png' onclick = chooseCard(this.id)></div>"+
 		    "<div class = square><input type='image' id = '5' src='/static/experiments/information_sampling_task/images/grey_small_square.png' onclick = chooseCard(this.id)></div>"+
 		    
 		    "<div class = square><input type='image' id = '6' src='/static/experiments/information_sampling_task/images/grey_small_square.png' onclick = chooseCard(this.id)></div>"+
 		    "<div class = square><input type='image' id = '7' src='/static/experiments/information_sampling_task/images/grey_small_square.png' onclick = chooseCard(this.id)></div>"+
  			"<div class = square><input type='image' id = '8' src='/static/experiments/information_sampling_task/images/grey_small_square.png' onclick = chooseCard(this.id)></div>"+
			"<div class = square><input type='image' id = '9' src='/static/experiments/information_sampling_task/images/grey_small_square.png' onclick = chooseCard(this.id)></div>"+
 		    "<div class = square><input type='image' id = '10' src='/static/experiments/information_sampling_task/images/grey_small_square.png' onclick = chooseCard(this.id)></div>"+
 		    
 		    "<div class = square><input type='image' id = '11' src='/static/experiments/information_sampling_task/images/grey_small_square.png' onclick = chooseCard(this.id)></div>"+
 		    "<div class = square><input type='image' id = '12' src='/static/experiments/information_sampling_task/images/grey_small_square.png' onclick = chooseCard(this.id)></div>"+
 		    "<div class = square><input type='image' id = '13' src='/static/experiments/information_sampling_task/images/grey_small_square.png' onclick = chooseCard(this.id)></div>"+
 		    "<div class = square><input type='image' id = '14' src='/static/experiments/information_sampling_task/images/grey_small_square.png' onclick = chooseCard(this.id)></div>"+
 		    "<div class = square><input type='image' id = '15' src='/static/experiments/information_sampling_task/images/grey_small_square.png' onclick = chooseCard(this.id)></div>"+
 		   	
 		   	"<div class = square><input type='image' id = '16' src='/static/experiments/information_sampling_task/images/grey_small_square.png' onclick = chooseCard(this.id)></div>"+
 		    "<div class = square><input type='image' id = '17' src='/static/experiments/information_sampling_task/images/grey_small_square.png' onclick = chooseCard(this.id)></div>"+
 		    "<div class = square><input type='image' id = '18' src='/static/experiments/information_sampling_task/images/grey_small_square.png' onclick = chooseCard(this.id)></div>"+
 		    "<div class = square><input type='image' id = '19' src='/static/experiments/information_sampling_task/images/grey_small_square.png' onclick = chooseCard(this.id)></div>"+
 		    "<div class = square><input type='image' id = '20' src='/static/experiments/information_sampling_task/images/grey_small_square.png' onclick = chooseCard(this.id)></div>"+
 		  
 		    "<div class = square><input type='image' id = '21' src='/static/experiments/information_sampling_task/images/grey_small_square.png' onclick = chooseCard(this.id)></div>"+
 		    "<div class = square><input type='image' id = '22' src='/static/experiments/information_sampling_task/images/grey_small_square.png' onclick = chooseCard(this.id)></div>"+
 		    "<div class = square><input type='image' id = '23' src='/static/experiments/information_sampling_task/images/grey_small_square.png' onclick = chooseCard(this.id)></div>"+
 		    "<div class = square><input type='image' id = '24' src='/static/experiments/information_sampling_task/images/grey_small_square.png' onclick = chooseCard(this.id)></div>"+
 		    "<div class = square><input type='image' id = '25' src='/static/experiments/information_sampling_task/images/grey_small_square.png' onclick = chooseCard(this.id)></div></div>"+
 		    
 		    
 		    
 		    "<div class = bottomLeft><input type='image' id = '26' src='/static/experiments/information_sampling_task/images/"+whichLargeColor1+".png' onclick = makeChoice(this.id)></div>"+
 		    "<div class = bottomRight><input type='image' id = '27' src='/static/experiments/information_sampling_task/images/"+whichLargeColor2+".png' onclick = makeChoice(this.id)></div></div></div>"
 		    



instructionsSetup =  "<div class = bigbox><div class = numbox>"+
 			"<div class = square><input type='image' id = '1' src='/static/experiments/information_sampling_task/images/grey_small_square.png' onclick = instructionFunction(this.id)></div>"+
 		    "<div class = square><input type='image' id = '2' src='/static/experiments/information_sampling_task/images/grey_small_square.png' onclick = instructionFunction(this.id)></div>"+
            "<div class = square><input type='image' id = '3' src='/static/experiments/information_sampling_task/images/grey_small_square.png' onclick = instructionFunction(this.id)></div>"+
  		    "<div class = square><input type='image' id = '4' src='/static/experiments/information_sampling_task/images/grey_small_square.png' onclick = instructionFunction(this.id)></div>"+
 		    "<div class = square><input type='image' id = '5' src='/static/experiments/information_sampling_task/images/grey_small_square.png' onclick = instructionFunction(this.id)></div>"+
 		    
 		    "<div class = square><input type='image' id = '6' src='/static/experiments/information_sampling_task/images/grey_small_square.png' onclick = instructionFunction(this.id)></div>"+
 		    "<div class = square><input type='image' id = '7' src='/static/experiments/information_sampling_task/images/grey_small_square.png' onclick = instructionFunction(this.id)></div>"+
  			"<div class = square><input type='image' id = '8' src='/static/experiments/information_sampling_task/images/grey_small_square.png' onclick = instructionFunction(this.id)></div>"+
			"<div class = square><input type='image' id = '9' src='/static/experiments/information_sampling_task/images/grey_small_square.png' onclick = instructionFunction(this.id)></div>"+
 		    "<div class = square><input type='image' id = '10' src='/static/experiments/information_sampling_task/images/grey_small_square.png' onclick = instructionFunction(this.id)></div>"+
 		    
 		    "<div class = square><input type='image' id = '11' src='/static/experiments/information_sampling_task/images/grey_small_square.png' onclick = instructionFunction(this.id)></div>"+
 		    "<div class = square><input type='image' id = '12' src='/static/experiments/information_sampling_task/images/grey_small_square.png' onclick = instructionFunction(this.id)></div>"+
 		    "<div class = square><input type='image' id = '13' src='/static/experiments/information_sampling_task/images/grey_small_square.png' onclick = instructionFunction(this.id)></div>"+
 		    "<div class = square><input type='image' id = '14' src='/static/experiments/information_sampling_task/images/grey_small_square.png' onclick = instructionFunction(this.id)></div>"+
 		    "<div class = square><input type='image' id = '15' src='/static/experiments/information_sampling_task/images/grey_small_square.png' onclick = instructionFunction(this.id)></div>"+
 		   	
 		   	"<div class = square><input type='image' id = '16' src='/static/experiments/information_sampling_task/images/grey_small_square.png' onclick = instructionFunction(this.id)></div>"+
 		    "<div class = square><input type='image' id = '17' src='/static/experiments/information_sampling_task/images/grey_small_square.png' onclick = instructionFunction(this.id)></div>"+
 		    "<div class = square><input type='image' id = '18' src='/static/experiments/information_sampling_task/images/grey_small_square.png' onclick = instructionFunction(this.id)></div>"+
 		    "<div class = square><input type='image' id = '19' src='/static/experiments/information_sampling_task/images/grey_small_square.png' onclick = instructionFunction(this.id)></div>"+
 		    "<div class = square><input type='image' id = '20' src='/static/experiments/information_sampling_task/images/grey_small_square.png' onclick = instructionFunction(this.id)></div>"+
 		  
 		    "<div class = square><input type='image' id = '21' src='/static/experiments/information_sampling_task/images/grey_small_square.png' onclick = instructionFunction(this.id)></div>"+
 		    "<div class = square><input type='image' id = '22' src='/static/experiments/information_sampling_task/images/grey_small_square.png' onclick = instructionFunction(this.id)></div>"+
 		    "<div class = square><input type='image' id = '23' src='/static/experiments/information_sampling_task/images/grey_small_square.png' onclick = instructionFunction(this.id)></div>"+
 		    "<div class = square><input type='image' id = '24' src='/static/experiments/information_sampling_task/images/grey_small_square.png' onclick = instructionFunction(this.id)></div>"+
 		    "<div class = square><input type='image' id = '25' src='/static/experiments/information_sampling_task/images/grey_small_square.png' onclick = instructionFunction(this.id)></div></div>"+
 		    
 		    
 		    
 		    "<div class = bottomLeft><input type='image' id = '26' src='/static/experiments/information_sampling_task/images/"+whichLargeColor1+".png' onclick = makeInstructChoice(this.id)></div>"+
 		    "<div class = bottomRight><input type='image' id = '27' src='/static/experiments/information_sampling_task/images/"+whichLargeColor2+".png' onclick = makeInstructChoice(this.id)></div></div></div>"

/* ************************************ */
/* Set up jsPsych blocks */
/* ************************************ */
/* define static blocks */
var welcome_block = {
  type: 'text',
  text: '<div class = centerbox><p class = center-block-text>Welcome to the Information Sampling Task task.</p><p class = center-block-text>Press <strong>enter</strong> to continue.</p></div>',
  cont_key: [13],
  timing_post_trial: 0
};

var end_block = {
  type: 'text',
  text: '<div class = centerbox><p class = center-block-text>Finished with this task.</p><p class = center-block-text>Press <strong>enter</strong> to continue.</p></div>',
  cont_key: [13],
  timing_post_trial: 0
};

var feedback_instruct_text = 'Starting with instructions.  Press <strong> Enter </strong> to continue.'
var feedback_instruct_block = {
  type: 'poldrack-text',
  cont_key: [13],
  text: getInstructFeedback,
  timing_post_trial: 0,
  timing_response: 6000
};
/// This ensures that the subject does not read through the instructions too quickly.  If they do it too quickly, then we will go over the loop again.
var instruction_trials = []	
var instructions_block = {
  type: 'poldrack-instructions',
  pages: ['<div class = centerbox><p class = block-text>In this experiment, you will see small grey squares arranged in a 5 by 5 matrix.  Underneath the small grey squares squares, you will see two larger colored squares.</p></div>',
  		  '<div class = centerbox><p class = block-text>Upon touching one of the smaller squares, the smaller square will open up to show you that it is one of the two colors from the larger squares underneath.</p><p class = block-text>Your job is to figure out which color holds the majority in the smaller squares.</p></div>',
  		  '<div class = centerbox><p class = block-text>You can open the boxes at your own rate and you can open as many smaller grey squares as you want to make your choice.</p><p class = block-text>When you decide that you have enough information to determine which color holds the majority, click on the larger square whose color you think holds the majority.</p></div>',
  		  '<div class = centerbox><p class = block-text>This experiment will last around 12 minutes</p></div>',
  		  ],

  
  allow_keys: false,
  show_clickable_nav: true,
  timing_post_trial: 1000
};
instruction_trials.push(feedback_instruct_block)
instruction_trials.push(instructions_block)

var instruction_node = {
    timeline: instruction_trials,
	/* This function defines stopping criteria */
    loop_function: function(data){
		for(i=0;i<data.length;i++){
			if((data[i].trial_type=='poldrack-instructions') && (data[i].rt!=-1)){
				rt=data[i].rt
				sumInstructTime=sumInstructTime+rt
			}
		}
		if(sumInstructTime<=instructTimeThresh*1000){
			feedback_instruct_text = 'Read through instructions too quickly.  Please take your time and make sure you understand the instructions.  Press <strong>enter</strong> to continue.'
			return true
		} else if(sumInstructTime>instructTimeThresh*1000){
			feedback_instruct_text = 'Done with instructions. Press <strong>enter</strong> to continue.'
			return false
		}
    }
}


var start_practice_block = {
  type: 'text',
  text: '<div class = centerbox><p class = block-text>We will show you a practice trial.  Press <strong>enter</strong> to begin.</p></div>',
  cont_key: [13],
  timing_post_trial: 1000
};

var subjectPracticeBlock ={
  type: 'poldrack-single-stim',
  stimulus: instructionsSetup,
  is_html: true,
  data: {exp_id: "information_sampling_task", trial_id: "test"},
  choices: [37],
  timing_post_trial: 500,
};


var start_test_block = {
  type: 'text',
  text: '<div class = centerbox><p class = block-text>A trial will look like that. There will be two conditions that affect how your reward will be counted.</p><p class = block-text>In the <strong>DW </strong>condition, you will start out at 250 points.  Every box opened until you make your choice deducts 10 points from this total.  So for example, if you open 7 boxes before you make a correct choice, your score for that round would be 180.  An incorrect decision loses 100 points regardless of how many boxes opened.</p><p class = block-text>In the <strong>FW</strong> condition, you will start out at 0 points.  A correct decision will lead to a gain of 100 points, regardless of the number of boxes opened.  Similarly, an incorrect decision will lead to a loss of 100 points. <br><br>Press <strong>enter</strong> to continue.</p></div>',
  cont_key: [13],
  timing_post_trial: 1000
};



var practice_block = {
  type: 'poldrack-single-stim',
  stimulus: getRound,
  is_html: true,
  data: {exp_id: "information_sampling_task", trial_id: "test"},
  choices: [37],
  timing_post_trial: 0,
  on_finish: appendTestData,
};

var DW_intro_block = {
  type: 'text',
  text: '<div class = centerbox><p class = block-text>You are beginning rounds under the <strong>DW</strong> condition.</p><p class = block-text>Remember, you will start out with 250 points.  Every box opened until you make a correct choice deducts 10 points from this total, after which the remaining will be how much you have gained for the round.  An incorrect decision losses 100 points regardless of number of boxes opened.<br><br>Press <strong>enter</strong> to continue.</div>',
  cont_key: [13],
  timing_post_trial: 0
};

var FW_intro_block = {
  type: 'text',
  text: '<div class = centerbox><p class = block-text>You are beginning rounds under the <strong>FW</strong> condition.</p><p class = block-text>Remember, you will start out with 0 points.  If you make a correct choice, you will gain 100 points.  An incorrect decision losses 100 points regardless of number of boxes opened.<br><br>Press <strong>enter</strong> to continue.</div>',
  cont_key: [13],
  timing_post_trial: 0
};



var rewardFW_block = {
  type: 'poldrack-single-stim',
  stimulus:getRewardFW,
  is_html: true,
  data: {exp_id: "information_sampling_task", trial_id: "reward"},
  choices: [13],
  timing_post_trial: 1000,
  on_finish: appendRewardDataFW,
};

var rewardDW_block = {
  type: 'poldrack-single-stim',
  stimulus:getRewardDW,
  is_html: true,
  data: {exp_id: "information_sampling_task", trial_id: "reward"},
  choices: [13],
  timing_post_trial: 1000,
  on_finish: appendRewardDataDW,  
};



var subjectRewardBlock ={
  type: 'poldrack-single-stim',
  stimulus:getReward,
  is_html: true,
  data: {exp_id: "information_sampling_task", trial_id: "reward"},
  choices: [13],
  timing_post_trial: 1000,
};



var practice_chunk = {
    chunk_type: 'while',
    timeline: [practice_block],
    continue_function: function(data){ 
       if (roundOver == 2) {
			return false
		} else if(roundOver ==1 || roundOver===0){
			return true
		}
    }
}

var reset_block = {
    type: 'call-function',
    func: resetRound,
    timing_post_trial: 0
}

/* create experiment definition array */
var information_sampling_task_experiment = [];
information_sampling_task_experiment.push(welcome_block);
information_sampling_task_experiment.push(instruction_node);
information_sampling_task_experiment.push(start_practice_block);
information_sampling_task_experiment.push(subjectPracticeBlock);
information_sampling_task_experiment.push(subjectRewardBlock);
information_sampling_task_experiment.push(start_test_block);

if(whichCond===0){// do the FW first, then DW
information_sampling_task_experiment.push(FW_intro_block);

information_sampling_task_experiment.push(practice_chunk);
information_sampling_task_experiment.push(rewardFW_block);
information_sampling_task_experiment.push(reset_block);

information_sampling_task_experiment.push(practice_chunk);
information_sampling_task_experiment.push(rewardFW_block);
information_sampling_task_experiment.push(reset_block);

information_sampling_task_experiment.push(practice_chunk);
information_sampling_task_experiment.push(rewardFW_block);
information_sampling_task_experiment.push(reset_block);

information_sampling_task_experiment.push(practice_chunk);
information_sampling_task_experiment.push(rewardFW_block);
information_sampling_task_experiment.push(reset_block);

information_sampling_task_experiment.push(practice_chunk);
information_sampling_task_experiment.push(rewardFW_block);
information_sampling_task_experiment.push(reset_block);

information_sampling_task_experiment.push(practice_chunk);
information_sampling_task_experiment.push(rewardFW_block);
information_sampling_task_experiment.push(reset_block);

information_sampling_task_experiment.push(practice_chunk);
information_sampling_task_experiment.push(rewardFW_block);
information_sampling_task_experiment.push(reset_block);

information_sampling_task_experiment.push(practice_chunk);
information_sampling_task_experiment.push(rewardFW_block);
information_sampling_task_experiment.push(reset_block);

information_sampling_task_experiment.push(practice_chunk);
information_sampling_task_experiment.push(rewardFW_block);
information_sampling_task_experiment.push(reset_block);

information_sampling_task_experiment.push(practice_chunk);
information_sampling_task_experiment.push(rewardFW_block);
information_sampling_task_experiment.push(reset_block);

///////switching cond
information_sampling_task_experiment.push(DW_intro_block);

information_sampling_task_experiment.push(practice_chunk);
information_sampling_task_experiment.push(rewardDW_block);
information_sampling_task_experiment.push(reset_block);

information_sampling_task_experiment.push(practice_chunk);
information_sampling_task_experiment.push(rewardDW_block);
information_sampling_task_experiment.push(reset_block);

information_sampling_task_experiment.push(practice_chunk);
information_sampling_task_experiment.push(rewardDW_block);
information_sampling_task_experiment.push(reset_block);

information_sampling_task_experiment.push(practice_chunk);
information_sampling_task_experiment.push(rewardDW_block);
information_sampling_task_experiment.push(reset_block);

information_sampling_task_experiment.push(practice_chunk);
information_sampling_task_experiment.push(rewardDW_block);
information_sampling_task_experiment.push(reset_block);

information_sampling_task_experiment.push(practice_chunk);
information_sampling_task_experiment.push(rewardDW_block);
information_sampling_task_experiment.push(reset_block);

information_sampling_task_experiment.push(practice_chunk);
information_sampling_task_experiment.push(rewardDW_block);
information_sampling_task_experiment.push(reset_block);

information_sampling_task_experiment.push(practice_chunk);
information_sampling_task_experiment.push(rewardDW_block);
information_sampling_task_experiment.push(reset_block);

information_sampling_task_experiment.push(practice_chunk);
information_sampling_task_experiment.push(rewardDW_block);
information_sampling_task_experiment.push(reset_block);

information_sampling_task_experiment.push(practice_chunk);
information_sampling_task_experiment.push(rewardDW_block);
information_sampling_task_experiment.push(reset_block);

}else if(whichCond==1){  ////do DW first then FW
information_sampling_task_experiment.push(DW_intro_block);

information_sampling_task_experiment.push(practice_chunk);
information_sampling_task_experiment.push(rewardDW_block);
information_sampling_task_experiment.push(reset_block);

information_sampling_task_experiment.push(practice_chunk);
information_sampling_task_experiment.push(rewardDW_block);
information_sampling_task_experiment.push(reset_block);

information_sampling_task_experiment.push(practice_chunk);
information_sampling_task_experiment.push(rewardDW_block);
information_sampling_task_experiment.push(reset_block);

information_sampling_task_experiment.push(practice_chunk);
information_sampling_task_experiment.push(rewardDW_block);
information_sampling_task_experiment.push(reset_block);

information_sampling_task_experiment.push(practice_chunk);
information_sampling_task_experiment.push(rewardDW_block);
information_sampling_task_experiment.push(reset_block);

information_sampling_task_experiment.push(practice_chunk);
information_sampling_task_experiment.push(rewardDW_block);
information_sampling_task_experiment.push(reset_block);

information_sampling_task_experiment.push(practice_chunk);
information_sampling_task_experiment.push(rewardDW_block);
information_sampling_task_experiment.push(reset_block);

information_sampling_task_experiment.push(practice_chunk);
information_sampling_task_experiment.push(rewardDW_block);
information_sampling_task_experiment.push(reset_block);

information_sampling_task_experiment.push(practice_chunk);
information_sampling_task_experiment.push(rewardDW_block);
information_sampling_task_experiment.push(reset_block);

information_sampling_task_experiment.push(practice_chunk);
information_sampling_task_experiment.push(rewardDW_block);
information_sampling_task_experiment.push(reset_block);

///////switching cond
information_sampling_task_experiment.push(FW_intro_block);

information_sampling_task_experiment.push(practice_chunk);
information_sampling_task_experiment.push(rewardFW_block);
information_sampling_task_experiment.push(reset_block);

information_sampling_task_experiment.push(practice_chunk);
information_sampling_task_experiment.push(rewardFW_block);
information_sampling_task_experiment.push(reset_block);

information_sampling_task_experiment.push(practice_chunk);
information_sampling_task_experiment.push(rewardFW_block);
information_sampling_task_experiment.push(reset_block);

information_sampling_task_experiment.push(practice_chunk);
information_sampling_task_experiment.push(rewardFW_block);
information_sampling_task_experiment.push(reset_block);

information_sampling_task_experiment.push(practice_chunk);
information_sampling_task_experiment.push(rewardFW_block);
information_sampling_task_experiment.push(reset_block);

information_sampling_task_experiment.push(practice_chunk);
information_sampling_task_experiment.push(rewardFW_block);
information_sampling_task_experiment.push(reset_block);

information_sampling_task_experiment.push(practice_chunk);
information_sampling_task_experiment.push(rewardFW_block);
information_sampling_task_experiment.push(reset_block);

information_sampling_task_experiment.push(practice_chunk);
information_sampling_task_experiment.push(rewardFW_block);
information_sampling_task_experiment.push(reset_block);

information_sampling_task_experiment.push(practice_chunk);
information_sampling_task_experiment.push(rewardFW_block);
information_sampling_task_experiment.push(reset_block);

information_sampling_task_experiment.push(practice_chunk);
information_sampling_task_experiment.push(rewardFW_block);
information_sampling_task_experiment.push(reset_block);
} 

information_sampling_task_experiment.push(end_block);