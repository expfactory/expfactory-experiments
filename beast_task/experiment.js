//FOR PATRICK

//createTrialTypes(numTrials) 

/*
this function creates the trial types (trials types mean the conditions that make the trial) 
If you would like to not use dummy conditions, erase lines 21-32, and input createTrialTypes(24) or createTrialTypes(48)
24 and 48 = number of trials, this argument must be divisible by 24.   Also, take away the double / on line 3, and change argument to your desired trial number length.

	trial_types_temp = [] //This is to create the trial types that this function uses to make letters.  In this case, this will make a block of 5 identical trials
	for(i=0;i<5;i++){
	trial_type = {'stop_type': 'go',
				   'adaptive_type': 'non-target',
				   'flanker_type':'incongruent',
				   'n_back_flanker_type':'different',
				   'flanking_stim': '',
				   'stim':'',
				   }
	trial_types_temp.push(trial_type)
	}
	block_trials = jsPsych.randomization.repeat(trial_types_temp,true,1)
	
	var adaptive_type_array = []
	var flanker_type_array = []
	var stop_type_array = []
	var n_back_flanker_type_array = []
	for (i = 0; i < delay; i++){
		adaptive_type_array[i] = 'temp-non-target'
		flanker_type_array[i] = flankerTrials[Math.floor(Math.random()*2)]
		stop_type_array[i] = stopTrials[Math.floor(Math.random()*3)]
		n_back_flanker_type_array[i] = 'temp-non-target'
		}
    
    var adaptiveNew = adaptive_type_array.concat(block_trials.adaptive_type)
    var stopNew = stop_type_array.concat(block_trials.stop_type)
    var nbackNew = n_back_flanker_type_array.concat(block_trials.n_back_flanker_type)
    var flankerNew = flanker_type_array.concat(block_trials.flanker_type)
    
    block_trials.stop_type = stopNew
    block_trials.adaptive_type = adaptiveNew
    block_trials.n_back_flanker_type = nbackNew
    block_trials.flanker_type = flankerNew
*/

var createStims = function() {  
	flanking_stim = undefined
	var block_tries = 0
	delayStimCount = delayStimCount + 1
	var block_made = false
	while (block_made == false){ //has a block of trials been made? if not, block_made = false.  If so, block_made = true and this ends the function
	
	//console.log('making blocks' + block_tries)
	
	createTrialTypes(24) 
	
	var delayStimCount = 0

	
	
	var move_forward = false // move_forward is used to see if we should throw away these blocks of trials, if you cannot create a letter given a trial type, create a whole new block of trials
	var numStimTries = 0
	
	
		while(numStimTries < block_trials.stop_type.length && move_forward == false){  //within each block, this is the number of stims within each block.  For length of block_trials
			//console.log('making trials')
			delayStimCount = delayStimCount + 1
			numStimTries = numStimTries + 1 //move to the end of the while loop, so that I can use this value to iterate through block_trial values
			var curr_trial = numStimTries - 1
		    var delayed_target_trial = curr_trial - delay
			
			//gets the trials types for the rest of the trials, that have been premade
			adaptive_type = block_trials.adaptive_type[curr_trial]
			flanker_type = block_trials.flanker_type[curr_trial]
			stop_type = block_trials.stop_type[curr_trial]
			n_back_flanker_type = block_trials.n_back_flanker_type[curr_trial]
			//console.log('conditions = '+ numStimTries + adaptive_type + ' '+ flanker_type + ' '+ stop_type + ' '+ n_back_flanker_type)
		
		
		flanking_stim = undefined

		var numTries = 0
		while(flanking_stim == undefined  && numTries < 5){ //for each trial_type, try to find a letter five times
			//console.log('stim selection')
			numTries = numTries + 1
			
			// these next few lines determine what the possible flankers, and possible stims are given the constraints, and picks one from the resulting population
			if(adaptive_type == 'non-target'){  
			delayedStim = block_trials.stim[delayed_target_trial]
			possible_stims = letters.filter(function(y) {
				return (jQuery.inArray(y, delayedStim) == -1)
			})
			stim = randomDraw(possible_stims)
			} else if (adaptive_type == 'target'){
			delayedStim = block_trials.stim[delayed_target_trial]
			stim = delayedStim
			} else if (adaptive_type == 'temp-non-target'){
				stim = randomDraw(letters)
			}
	
			if(n_back_flanker_type == 'same'){
				delayedFlanker = block_trials.flanking_stim[delayed_target_trial]
				possible_delayed_flankers  = [delayedFlanker] //P
			} else if (	n_back_flanker_type == 'different'){
				delayedFlanker = block_trials.flanking_stim[delayed_target_trial]
				possible_delayed_flankers = letters.filter(function(y) { //[P,V,T]
				return (jQuery.inArray(y, delayedFlanker) == -1)
				})
			} else if (	n_back_flanker_type == 'temp-non-target'){
				possible_delayed_flankers = letters
				//n_back_flanker = randomDraw(possible_delayed_flankers)
			}
	
			if(flanker_type == 'congruent'){
				possible_current_flankers = [stim]
			} else if (flanker_type == 'incongruent'){
				possible_current_flankers =letters.filter(function(y) {
				return (jQuery.inArray(y, stim) == -1)
				})
			}	
	
			possible_flankers = possible_current_flankers.filter(function(y) { //[P,V,T]
				return (jQuery.inArray(y, possible_delayed_flankers) != -1)
				})
			flanking_stim = randomDraw(possible_flankers)
			
		
	if(flanking_stim == undefined  && numTries == 5){
		move_forward = true
		block_tries += 1
		//console.log('failed at creating a stim, creating new block of trials')
	} else if (flanking_stim != undefined){
		//console.log('making a stim '+ numStimTries + flanking_stim+ stim + flanking_stim + block_trials.stop_type.length)
		
		block_trials.flanking_stim[numStimTries - 1] = flanking_stim
		block_trials.stim[numStimTries - 1] = stim
	
		if ((flanking_stim != undefined) && (numStimTries == block_trials.stop_type.length)){
		console.log(block_trials.stop_type)
		console.log(block_trials.adaptive_type)
		console.log(block_trials.flanker_type)
		console.log(block_trials.n_back_flanker_type)
		console.log(block_trials.stim)
		console.log(block_trials.flanking_stim)
		console.log(block_tries)
		block_made = true
		//console.log('made a block') //if you are successful in creating a stim for ever trial type in the block, end the function.
		}
	}
	}		
	} 
		
	}
				
	return block_trials
}


var update_stims_block = {
	type: 'call-function',
	func: createStims,
	data: {
		trial_id: "update_delay"
	},
	timing_post_trial: 0
}

var end_block = {
	type: 'poldrack-text',
	data: {
		trial_id: "end",
	},
	timing_response: -1,
	text: '<div class = centerbox><p class = center-block-text>Thanks for completing this task!</p><p class = center-block-text>Press<strong> enter</strong> to continue.</p></div>',
	cont_key: [13],
	timing_post_trial: 0,
};

var welcome_block = {
	type: 'poldrack-text',
	data: {
		trial_id: "welcome",
	},
	timing_response: -1,
	text: '<div class = centerbox><p class = center-block-text>Welcome to the task!</p><p class = center-block-text>Press<strong> enter</strong> to continue.</p></div>',
	cont_key: [13],
	timing_post_trial: 0,
};


/* ************************************ */
/*      End of while loop blocks        */
/* ************************************ */


/* ************************************ */
/*       Define Helper Functions        */
/* ************************************ */
function getDisplayElement() {
    $('<div class = display_stage_background></div>').appendTo('body')
    return $('<div class = display_stage></div>').appendTo('body')
}

function addID() {
  jsPsych.data.addDataToLastTrial({exp_id: 'beast_task'})
}

var getEndText = function(){
	return '<div class = centerbox><p class = block-text>'+ practice_feedback_text+'</p></div>'
}

var getPracticeFeedback = function() {
	return '<div class = centerbox><p class = block-text>' + practice_feedback_text + '</p></div>'
}

var getText = function() {
	return '<div class = "centerbox"><p class = "block-text">In these next blocks, you should respond when the current middle letter matches the middle letter that appeared ' +
	delay +
		' trials before.</p><p class = center-block-text>Press <strong>enter</strong> to begin.</p></div>'
}


var update_delay = function() {
	if (delay >= 2) {
		if (mistakes < 3) {
			delay += 1
		} else if (mistakes > 5) {
			delay -= 1
		}
	} else if (delay == 1) {
		if (mistakes < 3) {
			delay += 1
		}
	}
	mistakes = 0
	block_acc = 0
	current_trial = 0
	createTrialTypes(numTrials)
	delayStimCount = 0
	
	var data_flanker = []
	var curr_trial = jsPsych.progress().current_trial_global
	var startCut = curr_trial - numTrials*2
	
	for(var i = startCut; i < curr_trial; i++){
		data_flanker.push(jsPsych.data.getDataByTrialIndex(i))
	}
	
	var congruentRT = 0
	var incongruentRT = 0
	var congruentPress = 0
	var incongruentPress = 0
	for(var ii = 0; ii < data_flanker.length; ii++){
		if((data_flanker[ii].flanker_trial_type == 'congruent') && (data_flanker[ii].stop_trial_type == 'go') && (data_flanker[ii].key_press != -1)){
			congruentRT = congruentRT + data_flanker[ii].rt
			congruentPress = congruentPress + 1
		} else if((data_flanker[ii].flanker_trial_type == 'incongruent') && (data_flanker[ii].stop_trial_type == 'go') &&(data_flanker[ii].key_press != -1)){
			incongruentRT = incongruentRT + data_flanker[ii].rt
			incongruentPress = incongruentPress + 1
		}
	}
	data_flanker = []
	var meanCongruentRT = congruentRT/congruentPress
	var meanIncongruentRT = incongruentRT/incongruentPress
	if((meanIncongruentRT - meanCongruentRT > mean_flanker_effect) && (flanker_difficulty < 11)){
		flanker_difficuluty += 1
	} else if ((meanIncongruentRT - meanCongruentRT < mean_flanker_effect) && (flanker_difficulty > 1)){
		flanker_difficulty -= 1
	}
	
	
};


var getSSstim = function(){
if(flanker_type == 'congruent'){
		flanking_stim = stim
		return "<div class = containerbox>"+
		"<div class = letterbox1>"+
		"<div class = letters1_"+flanker_difficulty+"><input type= 'image' class = 'small_letters' src='/static/experiments/beast_task/images/"+"red"+stim+".png'></div>"+
		"<div class = letters1_"+flanker_difficulty+"><input type= 'image' class = 'small_letters' src='/static/experiments/beast_task/images/"+"red"+stim+".png'></div>"+
		"<div class = letters1_"+flanker_difficulty+"><input type= 'image' class = 'small_letters' src='/static/experiments/beast_task/images/"+"red"+stim+".png'></div>"+
		"</div>"+
		"<div class = letterbox2>"+
		"<div class = letters2_"+flanker_difficulty+"><input type= 'image' class = 'small_letters' src='/static/experiments/beast_task/images/"+"red"+stim+".png'></div>"+
		"<div class = letters2_"+flanker_difficulty+"><input type= 'image' class = 'small_letters' src='/static/experiments/beast_task/images/"+"red"+stim+".png'></div>"+
		"<div class = letters2_"+flanker_difficulty+"><input type= 'image' class = 'small_letters' src='/static/experiments/beast_task/images/"+"red"+stim+".png'></div>"+
		"</div>"+
		"<div class = letterbox3>"+
		"<div class = letters3><input type= 'image' class = 'small_letters' src='/static/experiments/beast_task/images/"+"red"+stim+".png'></div>"+
		"</div></div>"
	
	} else if(flanker_type == 'incongruent'){
		return "<div class = containerbox>"+
		"<div class = letterbox1>"+
		"<div class = letters1_"+flanker_difficulty+"><input type= 'image' class = 'small_letters' src='/static/experiments/beast_task/images/"+"red"+flanking_stim+".png'></div>"+
		"<div class = letters1_"+flanker_difficulty+"><input type= 'image' class = 'small_letters' src='/static/experiments/beast_task/images/"+"red"+flanking_stim+".png'></div>"+
		"<div class = letters1_"+flanker_difficulty+"><input type= 'image' class = 'small_letters' src='/static/experiments/beast_task/images/"+"red"+flanking_stim+".png'></div>"+
		"</div>"+
		"<div class = letterbox2>"+
		"<div class = letters2_"+flanker_difficulty+"><input type= 'image' class = 'small_letters' src='/static/experiments/beast_task/images/"+"red"+flanking_stim+".png'></div>"+
		"<div class = letters2_"+flanker_difficulty+"><input type= 'image' class = 'small_letters' src='/static/experiments/beast_task/images/"+"red"+flanking_stim+".png'></div>"+
		"<div class = letters2_"+flanker_difficulty+"><input type= 'image' class = 'small_letters' src='/static/experiments/beast_task/images/"+"red"+flanking_stim+".png'></div>"+
		"</div>"+
		"<div class = letterbox3>"+
		"<div class = letters3><input type= 'image' class = 'small_letters' src='/static/experiments/beast_task/images/"+"red"+stim+".png'></div>"+
		"</div></div>"
	}
}

var getSSD = function(){
	return SSD
}

var getSSTrialType = function(){
	return stop_type
}

var randomDraw = function(lst) {
	var index = Math.floor(Math.random() * (lst.length))
	return lst[index]
};

var createTrialTypes = function(numberTrials){ ///numberTrials must be divisible by 24
trial_types = []
    for (var x = 0; x < numberTrials/3*2; x++){
        if (x % 2 == 0){
            trial_type= {'stop_type' : 'go',
                    'flanker_type': 'congruent',
                    'adaptive_type': '',
                    'n_back_flanker_type': '',
                    'stim': '',
                    'flanking_stim': '',
                     }
        }else if ( x % 2 != 0){
            trial_type = {'stop_type': 'go', 
                    'flanker_type': 'incongruent',
                    'adaptive_type': '',
                    'n_back_flanker_type': '',
                    'stim': '',
                    'flanking_stim': '',
                     }
        }
    trial_types.push(trial_type)
    }

    for (var y = 0; y < numberTrials/3; y++){
        if (y % 2 == 0){
            trial_type = {'stop_type': 'stop',
                    'flanker_type': 'congruent',
                     'adaptive_type': '',
                     'n_back_flanker_type': '',
                     'stim': '',
                    'flanking_stim': '',
                     }
        } else if ( y % 2 != 0){
            trial_type = {'stop_type': 'stop',
                     'flanker_type': 'incongruent',
                     'adaptive_type': '',
                     'n_back_flanker_type': '',
                     'stim': '',
                    'flanking_stim': '',
                     }
        }
    trial_types.push(trial_type)
    }
    
    var go_cong = 0
    var go_incong = 0
    var stop_cong = 0
    var stop_incong = 0
    var nsteps = numberTrials/12
    var nstopsteps = numberTrials/24
    
    for( var w = 0; w < trial_types.length; w++){
        if(trial_types[w].stop_type == 'go' && trial_types[w].flanker_type == 'congruent'){
            go_cong += 1
                if(go_cong <= numberTrials/6){
                    trial_types[w].adaptive_type = 'target'
                    	
                    	if(go_cong <= numberTrials/12){
                    	trial_types[w].n_back_flanker_type = 'same'
                    	} else if (go_cong > numberTrials/12 &&  go_cong <= numberTrials/12*2){
                    	trial_types[w].n_back_flanker_type = 'different'
                    	}
                    	
                } else if (go_cong > numberTrials/6){
                    trial_types[w].adaptive_type = 'non-target'
                    	
                    	if(go_cong > numberTrials/12*2  && go_cong <= numberTrials/12*2+nsteps){
                    	trial_types[w].n_back_flanker_type = 'same'
                    	} else if (go_cong > numberTrials/12*2+nsteps ){
                    	trial_types[w].n_back_flanker_type = 'different'
                    	}
                    	
                }
        }
        
        if(trial_types[w].stop_type == 'go' && trial_types[w].flanker_type == 'incongruent'){
            go_incong += 1
                if(go_incong <=numberTrials/6){
                    trial_types[w].adaptive_type = 'target'
                    
                    if(go_incong <= numberTrials/12){
                    	trial_types[w].n_back_flanker_type = 'same'
                    } else if (go_incong > numberTrials/12 &&  go_incong <= numberTrials/12*2){
                    	trial_types[w].n_back_flanker_type = 'different'
                    }
                    	
                } else if (go_incong > numberTrials/6){
                    trial_types[w].adaptive_type = 'non-target'
                    
                   if(go_incong > numberTrials/12*2  && go_incong <= numberTrials/12*2+nsteps){
                    	trial_types[w].n_back_flanker_type = 'same'
                    } else if (go_incong > numberTrials/12*2+nsteps ){
                    	trial_types[w].n_back_flanker_type = 'different'
                    }
                }
        }
        
        if(trial_types[w].stop_type == 'stop' && trial_types[w].flanker_type == 'congruent'){
            stop_cong += 1
                if(stop_cong <= numberTrials/12){
                    trial_types[w].adaptive_type = 'target'
                    
                    if(stop_cong <= numberTrials/24){
                    	trial_types[w].n_back_flanker_type = 'same'
                    } else if (stop_cong > numberTrials/24 &&  stop_cong <= numberTrials/24*2){
                    	trial_types[w].n_back_flanker_type = 'different'
                    }
                    	
                } else if (stop_cong > numberTrials/24*2){
                    trial_types[w].adaptive_type = 'non-target'
                
                    	if(stop_cong > numberTrials/24*2 && stop_cong <= numberTrials/24*2+nstopsteps){
                    	trial_types[w].n_back_flanker_type = 'same'
                    	} else if (stop_cong > numberTrials/24*2+nstopsteps){
                    	trial_types[w].n_back_flanker_type = 'different'
                    	}
                
                	
                }
        }
        
        if(trial_types[w].stop_type == 'stop' && trial_types[w].flanker_type == 'incongruent'){
            stop_incong += 1
                if(stop_incong <= numberTrials/12){
                    trial_types[w].adaptive_type = 'target'
                     if(stop_incong <= numberTrials/24){
                    	trial_types[w].n_back_flanker_type = 'same'
                    } else if (stop_incong > numberTrials/24 &&  stop_incong <= numberTrials/24*2){
                    	trial_types[w].n_back_flanker_type = 'different'
                    }
                    
                } else if (stop_incong > numberTrials/12){
                    trial_types[w].adaptive_type = 'non-target'
                    if(stop_incong > numberTrials/24*2 && stop_incong <= numberTrials/24*2+nstopsteps){
                    	trial_types[w].n_back_flanker_type = 'same'
                    } else if (stop_incong > numberTrials/24*2+nstopsteps){
                    	trial_types[w].n_back_flanker_type = 'different'
                    }
                }
        }
    }
        
        
    block_trials = jsPsych.randomization.repeat(trial_types,true,1)
	
	var adaptive_type_array = []
	var flanker_type_array = []
	var stop_type_array = []
	var n_back_flanker_type_array = []
	for (i = 0; i < delay; i++){
		adaptive_type_array[i] = 'temp-non-target'
		flanker_type_array[i] = flankerTrials[Math.floor(Math.random()*2)]
		stop_type_array[i] = stopTrials[Math.floor(Math.random()*3)]
		n_back_flanker_type_array[i] = 'temp-non-target'
		}
    
    var adaptiveNew = adaptive_type_array.concat(block_trials.adaptive_type)
    var stopNew = stop_type_array.concat(block_trials.stop_type)
    var nbackNew = n_back_flanker_type_array.concat(block_trials.n_back_flanker_type)
    var flankerNew = flanker_type_array.concat(block_trials.flanker_type)
    
    block_trials.stop_type = stopNew
    block_trials.adaptive_type = adaptiveNew
    block_trials.n_back_flanker_type = nbackNew
    block_trials.flanker_type = flankerNew
    
    return block_trials
    
}


trial_types_temp = []
for(i=0;i<5;i++){
	trial_type = {'stop_type': 'go',
				   'adaptive_type': 'non-target',
				   'flanker_type':'congruent',
				   'n_back_flanker_type':'different',
				   'flanking_stim': '',
				   'stim':'',
				   }
	trial_types_temp.push(trial_type)
	}
block_trials = jsPsych.randomization.repeat(trial_types_temp,true,1)
	




	

var appendData = function() {
	jsPsych.data.addDataToLastTrial({
		trial_id: "stim",
		exp_stage: "test",
		load: delay,
		target: target,
		trial_num: current_trial,
		adaptive_trial_type: adaptive_type,
		stop_trial_type: stop_type,
		flanker_trial_type: flanker_type,
		stim: stim,
		flanking_stim: flanking_stim,
		flanker_difficulty: flanker_difficulty,
		target: target,
		yes_response_key: yes_key,
		no_response_key: no_key,
		n_back_flanker_type: n_back_flanker_type
	});

	var curr_trial = jsPsych.progress().current_trial_global
	if((jsPsych.data.getDataByTrialIndex(curr_trial).rt == -1) && (SSD<1500) && (jsPsych.data.getDataByTrialIndex(curr_trial).stop_trial_type == 'stop')){
		SSD = SSD + 50
	} else if ((jsPsych.data.getDataByTrialIndex(curr_trial).rt != -1) && (SSD>0) && (jsPsych.data.getDataByTrialIndex(curr_trial).stop_trial_type == 'stop')){
		SSD = SSD - 50
	}
	
	if ((jsPsych.data.getDataByTrialIndex(curr_trial).key_press == yes_key[0]) && (jsPsych.data.getDataByTrialIndex(curr_trial).stop_trial_type == 'go') && (jsPsych.data.getDataByTrialIndex(curr_trial).adaptive_trial_type == 'target')){
		jsPsych.data.addDataToLastTrial({go_acc: 1})
	}else if ((jsPsych.data.getDataByTrialIndex(curr_trial).key_press == no_key[0]) && (jsPsych.data.getDataByTrialIndex(curr_trial).stop_trial_type == 'go') && (jsPsych.data.getDataByTrialIndex(curr_trial).adaptive_trial_type == 'non-target')){
		jsPsych.data.addDataToLastTrial({go_acc: 1})
	}else {
		jsPsych.data.addDataToLastTrial({go_acc: 0})
	}
	
	if ((jsPsych.data.getDataByTrialIndex(curr_trial).key_press == -1) && (jsPsych.data.getDataByTrialIndex(curr_trial).stop_trial_type == 'stop')){
		jsPsych.data.addDataToLastTrial({stop_acc: 1})

	} else if ((jsPsych.data.getDataByTrialIndex(curr_trial).key_press != -1) && (jsPsych.data.getDataByTrialIndex(curr_trial).stop_trial_type == 'stop')){
		jsPsych.data.addDataToLastTrial({stop_acc: 0})

	}
	
	if ((jsPsych.data.getDataByTrialIndex(curr_trial).key_press == yes_key[0]) && (jsPsych.data.getDataByTrialIndex(curr_trial).adaptive_trial_type == 'target')){
		jsPsych.data.addDataToLastTrial({adaptive_acc: 1})

	} else if ((jsPsych.data.getDataByTrialIndex(curr_trial).key_press == no_key[0]) && (jsPsych.data.getDataByTrialIndex(curr_trial).adaptive_trial_type == 'non-target')){
		jsPsych.data.addDataToLastTrial({adaptive_acc: 1})

	} else if ((jsPsych.data.getDataByTrialIndex(curr_trial).key_press == no_key[0]) && (jsPsych.data.getDataByTrialIndex(curr_trial).adaptive_trial_type == 'target')){
		jsPsych.data.addDataToLastTrial({adaptive_acc: 0})
		console.log('mistakes1 = '+ mistakes)
		mistakes = mistakes + 1
	} else if ((jsPsych.data.getDataByTrialIndex(curr_trial).key_press == yes_key[0]) && (jsPsych.data.getDataByTrialIndex(curr_trial).adaptive_trial_type == 'non-target')){
		jsPsych.data.addDataToLastTrial({adaptive_acc: 0})
		console.log('mistakes2 = '+ mistakes)
		mistakes = mistakes + 1
	} else if ((jsPsych.data.getDataByTrialIndex(curr_trial).key_press == -1) && ((jsPsych.data.getDataByTrialIndex(curr_trial).adaptive_trial_type == 'non-target' )|| (jsPsych.data.getDataByTrialIndex(curr_trial).adaptive_trial_type == 'target')) && (jsPsych.data.getDataByTrialIndex(curr_trial).stop_trial_type == 'go')){
		jsPsych.data.addDataToLastTrial({adaptive_acc: 0})
		console.log('mistakes3 = '+ mistakes)
		mistakes = mistakes + 1
	}

	current_trial += 1
	flanking_stim = undefined
}

/* ************************************ */
/*    Define Experimental Variables     */
/* ************************************ */
var letters = jsPsych.randomization.repeat(['P','B','V','T','D'],1) //add g
var stopSignals = jsPsych.randomization.repeat(['redP','redB','redV','redT','redD'],1)
var stopTrials = jsPsych.randomization.repeat(['go','go','stop'],1)
var flankerTrials = jsPsych.randomization.repeat(['congruent','incongruent'],1)
var adaptiveTrials = ['target','non-target']

var numTrials = 24
var delay = 2
var SSD = 250
var flanker_difficulty = 11 // 11 is hardest, 1 is easiest
var mean_flanker_effect = 70

var responses = jsPsych.randomization.repeat([[77,'M key',],[90,'Z key']],1)
var yes_key = responses[0]
var no_key = responses[1]
var mistakes = 0
var match_acc_thresh = .70
var flanking_stim = undefined
var stim = undefined
var possible_delayed_flankers = ''
var possible_current_flankers = ''
var block_trials = []
var throw_trials = []


var num_blocks = 3 // number of adaptive blocks 20
var base_num_trials = 20 // total num_trials = base + load 
var control_before = Math.round(Math.random()) //0 control comes before test, 1, after
var block_acc = 0 // record block accuracy to determine next blocks delay
var delay = 2 // starting delay
var trials_done = 0 // counter used by adaptive_test_node
var target_trials = [] // array defining whether each trial in a block is a target trial
var current_trial = 0
var target = ""
var curr_stim = ''
var stims = [] //hold stims per block

var numGoTrials = numTrials/3*2
var numStopTrials = numTrials/3

//createTrialTypes(numTrials)

var postFileType = "'></img>"
var pathSource = '/static/experiments/beast_task/images/'
var fileType = '.png'
var preFileType = "<img class = center src='"
//"<img class = center src='/static/experiments/beast_task/images/P.png'></img>"
//preFileType + pathSource + colors[testGoColor] + '_' + shapes[testShape] + fileType + postFileType,

var forcedPrefix = "'<div class = bigbox><div class = centerbox>"
var forcedChoiceType1 = "<img class = decision-left src='"
var forcedChoiceType2 = "<img class = decision-right src='"
var postFileTypeForced = ".png'></img>"
var postFileTypeForcedEnd = "</div></div>'"
var pathSource = '/static/experiments/beast_task/images/'

var allStimuli = ['P','B','V','T','D','redP','redB','redV','redT','redD']
var images = []
for(i=0;i<allStimuli.length;i++){
	images.push(pathSource + allStimuli[i] + '.png')
}
jsPsych.pluginAPI.preloadImages(images);


/* ************************************ */
/*        Set up jsPsych blocks         */
/* ************************************ */

var instruction_page_5 = {
	type: 'poldrack-text',
	data: {
		trial_id: "instruction_2",
	},
	timing_response: -1,
	text: "<div class = containerbox_test>"+
		"<div class = centerbox3><p class = block-text>In this example, the delay is 2, and these were the stimulus that was presented to you in 4 trials.  The correct responses for these example trials would be to respond <strong> no </strong>for trials 1 and 2 and <strong> yes </strong>for trials 3 and 4.</p><p class = block-text>Press <strong> enter</strong> to continue.</p></div>"+
		"<div class = letterbox1_test1>"+
		"<div class = letters1_test><input type= 'image' class = 'small_letters' src='/static/experiments/beast_task/images/T.png'></div>"+
		"<div class = letters1_test><input type= 'image' class = 'small_letters' src='/static/experiments/beast_task/images/T.png'></div>"+
		"<div class = letters1_test><input type= 'image' class = 'small_letters' src='/static/experiments/beast_task/images/T.png'></div>"+
		"<div class = letters1_test><input type= 'image' class = 'small_letters' src='/static/experiments/beast_task/images/1.png'></div>"+
		"</div>"+
		"<div class = letterbox2_test1>"+
		"<div class = letters2_test><input type= 'image' class = 'small_letters' src='/static/experiments/beast_task/images/T.png'></div>"+
		"<div class = letters2_test><input type= 'image' class = 'small_letters' src='/static/experiments/beast_task/images/T.png'></div>"+
		"<div class = letters2_test><input type= 'image' class = 'small_letters' src='/static/experiments/beast_task/images/T.png'></div>"+
		"</div>"+
		"<div class = letterbox3_test1>"+
		"<div class = letters3_test><input type= 'image' class = 'small_letters' src='/static/experiments/beast_task/images/V.png'></div>"+
		"</div>"+
		"<div class = letterbox1_test2>"+
		"<div class = letters1_test><input type= 'image' class = 'small_letters' src='/static/experiments/beast_task/images/B.png'></div>"+
		"<div class = letters1_test><input type= 'image' class = 'small_letters' src='/static/experiments/beast_task/images/B.png'></div>"+
		"<div class = letters1_test><input type= 'image' class = 'small_letters' src='/static/experiments/beast_task/images/B.png'></div>"+
		"<div class = letters1_test><input type= 'image' class = 'small_letters' src='/static/experiments/beast_task/images/2.png'></div>"+
		"</div>"+
		"<div class = letterbox2_test2>"+
		"<div class = letters2_test><input type= 'image' class = 'small_letters' src='/static/experiments/beast_task/images/B.png'></div>"+
		"<div class = letters2_test><input type= 'image' class = 'small_letters' src='/static/experiments/beast_task/images/B.png'></div>"+
		"<div class = letters2_test><input type= 'image' class = 'small_letters' src='/static/experiments/beast_task/images/B.png'></div>"+
		"</div>"+
		"<div class = letterbox3_test2>"+
		"<div class = letters3_test><input type= 'image' class = 'small_letters' src='/static/experiments/beast_task/images/B.png'></div>"+
		"</div>"+
		"<div class = letterbox1_test3>"+
		"<div class = letters1_test><input type= 'image' class = 'small_letters' src='/static/experiments/beast_task/images/P.png'></div>"+
		"<div class = letters1_test><input type= 'image' class = 'small_letters' src='/static/experiments/beast_task/images/P.png'></div>"+
		"<div class = letters1_test><input type= 'image' class = 'small_letters' src='/static/experiments/beast_task/images/P.png'></div>"+
		"<div class = letters1_test><input type= 'image' class = 'small_letters' src='/static/experiments/beast_task/images/3.png'></div>"+
		"</div>"+
		"<div class = letterbox2_test3>"+
		"<div class = letters2_test><input type= 'image' class = 'small_letters' src='/static/experiments/beast_task/images/P.png'></div>"+
		"<div class = letters2_test><input type= 'image' class = 'small_letters' src='/static/experiments/beast_task/images/P.png'></div>"+
		"<div class = letters2_test><input type= 'image' class = 'small_letters' src='/static/experiments/beast_task/images/P.png'></div>"+
		"</div>"+
		"<div class = letterbox3_test3>"+
		"<div class = letters3_test><input type= 'image' class = 'small_letters' src='/static/experiments/beast_task/images/V.png'></div>"+
		"</div>"+
		"<div class = letterbox1_test4>"+
		"<div class = letters1_test><input type= 'image' class = 'small_letters' src='/static/experiments/beast_task/images/B.png'></div>"+
		"<div class = letters1_test><input type= 'image' class = 'small_letters' src='/static/experiments/beast_task/images/B.png'></div>"+
		"<div class = letters1_test><input type= 'image' class = 'small_letters' src='/static/experiments/beast_task/images/B.png'></div>"+
		"<div class = letters1_test><input type= 'image' class = 'small_letters' src='/static/experiments/beast_task/images/4.png'></div>"+
		"</div>"+
		"<div class = letterbox2_test4>"+
		"<div class = letters2_test><input type= 'image' class = 'small_letters' src='/static/experiments/beast_task/images/B.png'></div>"+
		"<div class = letters2_test><input type= 'image' class = 'small_letters' src='/static/experiments/beast_task/images/B.png'></div>"+
		"<div class = letters2_test><input type= 'image' class = 'small_letters' src='/static/experiments/beast_task/images/B.png'></div>"+
		"</div>"+
		"<div class = letterbox3_test4>"+
		"<div class = letters3_test><input type= 'image' class = 'small_letters' src='/static/experiments/beast_task/images/B.png'></div>"+
		"</div>"+
		"</div>",
	cont_key: [13],
	timing_post_trial: 0,
};



var instruction_page_1 = {
	type: 'poldrack-text',
	data: {
		trial_id: "instruction_1",
	},
	timing_response: -1,
	text: '<div class = centerbox><p class = block-text>In this task you will see a horizontal line of 7 letters. You will respond to the middle letter by pressing either the '+yes_key[1]+' or ' +no_key[1]+ '.</p><p class = block-text>Press <strong> enter</strong> to continue.</p></div>',
	cont_key: [13],
	timing_post_trial: 0,
};

var instruction_page_2 = {
	type: 'poldrack-text',
	data: {
		trial_id: "instruction_2",
	},
	timing_response: -1,
	text: "<div class = centerbox2><p class = block-text>This is an example stimulus.  In this case, the middle letter is 'V'.  You will be presented with one stimulus on every trial.</p><p class = block-text>Press <strong> enter</strong> to continue.</p></div>"+
		"<div class = containerbox>"+
		"<div class = letterbox1>"+
		"<div class = letters1_11><input type= 'image' class = 'small_letters' src='/static/experiments/beast_task/images/T.png'></div>"+
		"<div class = letters1_11><input type= 'image' class = 'small_letters' src='/static/experiments/beast_task/images/T.png'></div>"+
		"<div class = letters1_11><input type= 'image' class = 'small_letters' src='/static/experiments/beast_task/images/T.png'></div>"+
		"</div>"+
		"<div class = letterbox2>"+
		"<div class = letters2_11><input type= 'image' class = 'small_letters' src='/static/experiments/beast_task/images/T.png'></div>"+
		"<div class = letters2_11><input type= 'image' class = 'small_letters' src='/static/experiments/beast_task/images/T.png'></div>"+
		"<div class = letters2_11><input type= 'image' class = 'small_letters' src='/static/experiments/beast_task/images/T.png'></div>"+
		"</div>"+
		"<div class = letterbox3>"+
		"<div class = letters3><input type= 'image' class = 'small_letters' src='/static/experiments/beast_task/images/V.png'></div>"+
		"</div></div>",
	cont_key: [13],
	timing_post_trial: 0,
};

var instruction_page_3 = {
	type: 'poldrack-text',		
	data: {
		trial_id: "instruction_3",
	},
	timing_response: -1,
	text: "<div class = centerbox><p class = block-text>Your job is to <strong> respond yes by pressing the "+ yes_key[1]+" </strong> if the current middle letter matches the middle letter, some number of trials ago (the number of trials is called the 'delay').  Otherwise, you should <strong>respond no by pressing the "+ no_key[1]+".</strong>"+
	"<p class = block-text><strong>You should try to ignore the letters that are not in the middle.</strong></p>"+
	"<p class = block-text>Press <strong> enter</strong> to continue.</p></div>",
	cont_key: [13],
	timing_post_trial: 0,
};



var instruction_page_4 = {
	type: 'poldrack-text',
	data: {
		trial_id: "instruction_4",
	},
	timing_response: -1,
	text: '<div class = centerbox><p class = block-text>The specific delay you should pay attention to will differ between blocks of trials, and you will be told the delay before starting a block.</p>'+
	'<p class = block-text>For instance, if the delay is 2, you should respond yes by pressing the ' + yes_key[1]+ ' when the current <strong> middle </strong> letter matches the <strong> middle letter that occurred 2 trials ago. </strong></p>'+ 
	'<p class = block-text>If the sequence of middle letters are as follows: P...P...V...T...B...T...B, you would press the ' + yes_key[1]+ ' on the last "T" and the last "B" and you should respond no by pressing the '+
	 no_key[1]+ ' for every other letter.</p><p class = block-text>Press <strong> enter</strong> to continue.</p></div>',
	cont_key: [13],
	timing_post_trial: 0,
};

var instruction_page_6 = {
	type: 'poldrack-text',
	data: {
		trial_id: "instruction_5",
	},
	timing_response: -1,
	text: '<div class = centerbox><p class = block-text>We will go through some practice.  Press <strong> enter </strong> when you are ready to begin practice.</p></div>',
	cont_key: [13],
	timing_post_trial: 0,
};

/*

var update_delay_block = {
	type: 'call-function',
	func: update_delay,
	data: {
		trial_id: "update_delay"
	},
	timing_post_trial: 0
}



var fixation_block = {
	type: 'poldrack-single-stim',
	stimulus: '<div class = centerbox><div class = fixation>+</div></div>',
	is_html: true,
	choices: 'none',
	data: {
		trial_id: "fixation",
		exp_stage: "test"
	},
	timing_post_trial: 0,
	timing_stim: 500,
	timing_response: 500
}

var start_adaptive_block = {
	type: 'poldrack-text',
	data: {
		trial_id: "start_test_text"
	},
	text: getText,
	cont_key: [13],
};

var start_adaptive_practice_block = {
	type: 'poldrack-text',
	data: {
		trial_id: "start_practice_text"
	},
	text: '<div class = "centerbox"><p class = "block-text">For this practice block, you should respond when the current middle letter matches the middle letter that appeared 2 trials before.</p><p class = center-block-text>Press <strong>enter</strong> to begin.</p></div>',
	cont_key: [13],
};

//"<img class = center src='/static/experiments/beast_task/images/smallfix.png'></img>"
var test_img_block = {
	type: 'poldrack-text',
	data: {
		trial_id: "welcome",
	},
	timing_response: -1,
	text: "<div class = containerbox>"+
	"<div class = letterbox1>"+
	"<div class = letters1_11><input type= 'image' class = 'small_letters' src='/static/experiments/beast_task/images/T.png'></div>"+
	"<div class = letters1_11><input type= 'image' class = 'small_letters' src='/static/experiments/beast_task/images/T.png'></div>"+
	"<div class = letters1_11><input type= 'image' class = 'small_letters' src='/static/experiments/beast_task/images/T.png'></div>"+
	"</div>"+
	"<div class = letterbox2>"+
	"<div class = letters2_11><input type= 'image' class = 'small_letters' src='/static/experiments/beast_task/images/T.png'></div>"+
	"<div class = letters2_11><input type= 'image' class = 'small_letters' src='/static/experiments/beast_task/images/T.png'></div>"+
	"<div class = letters2_11><input type= 'image' class = 'small_letters' src='/static/experiments/beast_task/images/T.png'></div>"+
	"</div>"+
	"<div class = letterbox3>"+
	"<div class = letters3><input type= 'image' class = 'small_letters' src='/static/experiments/beast_task/images/T.png'></div>"+
	"</div></div>",
	cont_key: [13],
	timing_post_trial: 0,
};

var practice_feedback_text = 'For this practice block, you should respond when the current middle letter matches the middle letter that appeared 2 trials before.</p><p class = center-block-text>Press <strong>enter</strong> to begin.'
var practice_feedback_block = {
	type: 'poldrack-single-stim',
	data: {
		trial_id: "practice-no-stop-feedback"
	},
	choices: [13],
	stimulus: getPracticeFeedback,
	timing_post_trial: 0,
	is_html: true,
	timing_stim: 20000,
	timing_response: 20000,
	response_ends_trial: true,

};

var practice_stop_intro = {
	type: 'poldrack-text',
	data: {
		trial_id: "practice_stop_intro",
	},
	timing_response: -1,
	text: '<div class = centerbox><p class = block-text>These trials will be similar to the trials that you have just completed.  Again, please press the ' + yes_key[1]+ ' if the current middle letter matches the middle letter that appeared two trials ago.</p>'+
	'<p class = block-text>On a subset of trials, all of the letters will turn from black to red.  When this happens, please try your best to stop your response and press nothing on that trial.</p>'+
	'<p class = block-text>The letters will turn red at different times, because of this you will not always be able to successfully stop when the letters turn red.' +
	' However, if you continue to try very hard to stop when the letters turn red, you will be able to stop sometimes but not always.</p>' +
	'<p class = block-text>Please do not slow down your responses to the middle letter because you are waiting to see if all of the letters will turn red.</p>'+
	'<p class = block-text>Please balance the requirement to respond quickly and accurately to the shapes while trying very hard to stop to the stars.</p>'+
	'<p class = block-text>Press <strong> enter </strong> when you are ready to begin the practice session.</p>'+
	'</div>',
	cont_key: [13],
	timing_post_trial: 0,
};

var practice_end_block = {
	type: 'poldrack-text',
	data: {
		trial_id: "practice_end_text",
	},
	timing_response: -1,
	text: getEndText,
	cont_key: [13],
	timing_post_trial: 0,
	on_finish: function(){
	practice_feedback_text = 'For this practice block, you should respond when the current middle letter matches the middle letter that appeared 2 trials before.</p><p class = center-block-text>Press <strong>enter</strong> to begin.'
	}
};




var practice_block = {
	type: 'poldrack-single-stim',
	stimulus: getStim,
	is_html: true,
	choices: [77,90],
	timing_stim: 2000,
	timing_response: 3500,
	response_ends_trial: false,
	timing_SS: 2000,
	timing_post_trial: 0,
	on_finish: appendData,
};

var test_block = {
	type: 'stop-signal',
	stimulus: getStim,
	SS_stimulus: getSSstim,
	SS_trial_type: getSSTrialType,
	is_html: true,
	choices: [77,90],
	timing_stim: 2000,
	timing_response: 3500,
	response_ends_trial: false,
	SSD: 100, //getSSD
	timing_SS: 2000,
	timing_post_trial: 0,
	on_finish: appendData,
};

var practice_no_stop_node = {
	timeline: [fixation_block,practice_block],
	loop_function: function() {
		trials_done += 1
		if (trials_done == numTrials + delay) {
			trials_done = 0
			return false
		} else { 
			return true 
		}
	}
}
var practiceNoStopCount = 0
var practice_no_stop_node_node = {
	timeline: [practice_feedback_block, practice_no_stop_node],
	loop_function: function(data) {
	practiceNoStopCount += 1
	var numMatchCorrect = 0
	for(var i = 0; i < data.length; i++){
		if((data[i].key_press == yes_key[0]) && (data[i].adaptive_trial_type == 'target')){
			numMatchCorrect += 1
		} else if((data[i].key_press == no_key[0]) && (data[i].adaptive_trial_type == 'non-target')){
			numMatchCorrect += 1
		}
	}
	var averageMatchCorrect = numMatchCorrect/numTrials
	practice_feedback_text = 'Your matching accuracy is '+ averageMatchCorrect * 100 +'%.'
		if (averageMatchCorrect > match_acc_thresh || practiceNoStopCount == 2 ) {
			tempCount = 0
			current_trial = 0
			delayStimCount = 0
			createTrialTypes(numTrials)
			practice_feedback_text += '</p><p class = block-text> Done with this practice.  Press <strong> enter</strong> to continue'
			return false
		} else { 
			current_trial = 0
			delayStimCount = 0
			createTrialTypes(numTrials)
			practice_feedback_text += '</p><p class = block-text> We will try another practice block.  Press <strong> enter</strong> to continue'
			return true 
		}
	}
}
var practice_stop_node = {
	timeline: [fixation_block,test_block],
	loop_function: function() {
		trials_done += 1
		if (trials_done == numTrials + delay) {
			trials_done = 0
			return false
		} else { 
			return true 
		}
	}
}

var practiceStopCount = 0
var practice_stop_node_node = {
	timeline: [practice_feedback_block, practice_stop_node],
	loop_function: function(data) {
	practiceStopCount += 1
	var numMatchCorrect = 0
	var numStopCorrect = 0
	var numStopTrial = 0
	
	for(var i = 0; i < data.length; i++){
		if((data[i].key_press == yes_key[0]) && (data[i].adaptive_trial_type == 'target')){
			numMatchCorrect += 1
		} else if((data[i].key_press == no_key[0]) && (data[i].adaptive_trial_type == 'non-target')){
			numMatchCorrect += 1
		} 
		
		if(data[i].stop_trial_type == 'stop'){
			numStopTrial += 1
			if (data[i].key_press == -1){
				numStopCorrect += 1
			}
		}
	}
	var averageMatchCorrect = numMatchCorrect/numTrials
	var averageStopCorrect = numStopCorrect/numStopTrial
	
	practice_feedback_text = 'Your matching accuracy is '+ averageMatchCorrect * 100 +'%.</p><p class = block-text>Your stopping accuracy is ' + averageStopCorrect * 100+'%.'
		if (practiceStopCount == 1 ) {
			tempCount = 0
			current_trial = 0
			delayStimCount = 0
			console.log(block_trials)
			createTrialTypes(numTrials)
			practice_feedback_text += '</p><p class = block-text> Done with this practice.  Press <strong> enter</strong> to continue'
			return false
		} 
	}
}
		

var test_node = {
	timeline: [fixation_block,test_block],
	loop_function: function() {
		trials_done += 1
		if (trials_done == numTrials + delay) {
			trials_done = 0
			return false
		} else { 
			return true 
		}
	}
}
*/

/* ************************************ */
/*          Set up Experiment           */
/* ************************************ */

var beast_task_experiment = []

//beast_task_experiment.push(test_img_block);
beast_task_experiment.push(welcome_block);
beast_task_experiment.push(instruction_page_1);
beast_task_experiment.push(instruction_page_2);
beast_task_experiment.push(instruction_page_3);
beast_task_experiment.push(instruction_page_4);
beast_task_experiment.push(instruction_page_5);
beast_task_experiment.push(instruction_page_6);

/*

beast_task_experiment.push(welcome_block);
beast_task_experiment.push(update_stims_block);
beast_task_experiment.push(end_block);

beast_task_experiment.push(welcome_block);
beast_task_experiment.push(instruction_page_1);
beast_task_experiment.push(instruction_page_2);
beast_task_experiment.push(instruction_page_3);
beast_task_experiment.push(instruction_page_4);
beast_task_experiment.push(instruction_page_5);
beast_task_experiment.push(instruction_page_6);

//first practice
beast_task_experiment.push(practice_no_stop_node_node);
beast_task_experiment.push(practice_end_block);


//second practice
beast_task_experiment.push(practice_stop_intro);
beast_task_experiment.push(practice_stop_node_node);
beast_task_experiment.push(practice_end_block);


//test blocks
for (var b = 0; b < num_blocks; b++) {
	beast_task_experiment.push(start_adaptive_block)
	beast_task_experiment.push(test_node)
	beast_task_experiment.push(update_delay_block)
}

beast_task_experiment.push(end_block);
*/