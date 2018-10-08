/* ************************************ */
/* Define helper functions */
/* ************************************ */
function addID() {
  jsPsych.data.addDataToLastTrial({exp_id: 'stop_signal_with_directed_forgetting'})
}

function evalAttentionChecks() {
  var check_percent = 1
  if (run_attention_checks) {
    var attention_check_trials = jsPsych.data.getTrialsOfType('attention-check')
    var checks_passed = 0
    for (var i = 0; i < attention_check_trials.length; i++) {
      if (attention_check_trials[i].correct === true) {
        checks_passed += 1
      }
    }
    check_percent = checks_passed / attention_check_trials.length
  }
  jsPsych.data.addDataToLastTrial({"att_check_percent": check_percent})
  return check_percent
}

function assessPerformance() {
	var experiment_data = jsPsych.data.getTrialsOfType('poldrack-single-stim')
	experiment_data = experiment_data.concat(jsPsych.data.getTrialsOfType('poldrack-categorize'))
	var missed_count = 0
	var trial_count = 0
	var rt_array = []
	var rt = 0
		//record choices participants made
	var choice_counts = {}
	choice_counts[-1] = 0
	for (var k = 0; k < possible_responses.length; k++) {
		choice_counts[possible_responses[k][1]] = 0
	}
	for (var i = 0; i < experiment_data.length; i++) {
		if (experiment_data[i].possible_responses != 'none') {
			trial_count += 1
			rt = experiment_data[i].rt
			key = experiment_data[i].key_press
			choice_counts[key] += 1
			if (rt == -1) {
				missed_count += 1
			} else {
				rt_array.push(rt)
			}
		}
	}
	//calculate average rt
	var avg_rt = -1
	if (rt_array.length !== 0) {
		avg_rt = math.median(rt_array)
	} 
	//calculate whether response distribution is okay
	var responses_ok = true
	Object.keys(choice_counts).forEach(function(key, index) {
		if (choice_counts[key] > trial_count * 0.85) {
			responses_ok = false
		}
	})
	var missed_percent = missed_count/trial_count
	credit_var = (missed_percent < 0.4 && avg_rt > 200 && responses_ok)
	jsPsych.data.addDataToLastTrial({"credit_var": credit_var})
}

var getInstructFeedback = function() {
	return '<div class = centerbox><p class = center-block-text>' + feedback_instruct_text +
		'</p></div>'
}

var getFeedback = function() {
	return '<div class = bigbox><div class = picture_box><p class = block-text>' + feedback_text + '</p></div></div>'
}

var getCategorizeFeedback = function(){
	curr_trial = jsPsych.progress().current_trial_global - 1
	trial_id = jsPsych.data.getDataByTrialIndex(curr_trial).trial_id
	console.log(trial_id)
	if ((trial_id == 'practice_trial') && (jsPsych.data.getDataByTrialIndex(curr_trial).stop_signal_condition != 'stop')){
		if (jsPsych.data.getDataByTrialIndex(curr_trial).key_press == jsPsych.data.getDataByTrialIndex(curr_trial).correct_response){
			
			
			return '<div class = fb_box><div class = center-text><font size = 20>Correct!</font></div></div>' + prompt_text
		} else if ((jsPsych.data.getDataByTrialIndex(curr_trial).key_press != jsPsych.data.getDataByTrialIndex(curr_trial).correct_response) && (jsPsych.data.getDataByTrialIndex(curr_trial).key_press != -1)){
			
			
			return '<div class = fb_box><div class = center-text><font size = 20>Incorrect</font></div></div>' + prompt_text
	
		} else if (jsPsych.data.getDataByTrialIndex(curr_trial).key_press == -1){
			
			
			return '<div class = fb_box><div class = center-text><font size = 20>Respond Faster!</font></div></div>' + prompt_text
	
		}
	} else if ((trial_id == 'practice_trial') && (jsPsych.data.getDataByTrialIndex(curr_trial).stop_signal_condition == 'stop')){
		if (jsPsych.data.getDataByTrialIndex(curr_trial).rt == -1){
			return '<div class = fb_box><div class = center-text><font size = 20>Correct!</font></div></div>' + prompt_text
		} else if (jsPsych.data.getDataByTrialIndex(curr_trial).rt != -1){
			return '<div class = fb_box><div class = center-text><font size = 20>Incorrect</font></div></div>' + prompt_text
		}
	}
}

var randomDraw = function(lst) {
  var index = Math.floor(Math.random() * (lst.length))
  return lst[index]
}
							 
var createTrialTypes = function(numTrialsPerBlock){
	
	var stims = []
	for(var numIterations = 0; numIterations < numTrialsPerBlock/12; numIterations++){
		for (var numDirectedConds = 0; numDirectedConds < directed_cond_array.length; numDirectedConds++){
			for (var numstop_signalConds = 0; numstop_signalConds < stop_signal_conditions.length; numstop_signalConds++){
			
				stop_signal_condition = stop_signal_conditions[numstop_signalConds]
				directed_condition = directed_cond_array[numDirectedConds]
				
				stim = {
					stop_signal_condition: stop_signal_condition,
					directed_condition: directed_condition
				}
				
				stims.push(stim)
			}
		}
	}
		
	stims = jsPsych.randomization.repeat(stims,1)
	new_len = stims.length
	new_stims = []
	
	for (var i = 0; i < new_len; i++){
		stim = stims.shift()
		stop_signal_condition = stim.stop_signal_condition
		directed_condition = stim.directed_condition

		letters = getTrainingSet()
		cue = getCue()
		probe = getProbe(directed_condition, letters, cue)
		correct_response = getCorrectResponse(cue, probe, letters, stop_signal_condition)
		 if (stop_signal_condition == 'go'){
			probe_color = 'green'
		 } else {
			probe_color = 'red'
		 }
		
		stim = {
			stop_signal_condition: stop_signal_condition,
			directed_condition: directed_condition,
			letters: letters,
			cue: cue,
			probe: probe,
			probe_color: probe_color,
			correct_response: correct_response
			}
	
		new_stims.push(stim)
		
	}	
	return new_stims
		
}


//this is an algorithm to choose the training set based on rules of the game (training sets are composed of any letter not presented in the last two training sets)
var getTrainingSet = function() {
	preceeding1stims = []
	preceeding2stims = []
	trainingArray = jsPsych.randomization.repeat(stimArray, 1);
	if (current_trial < 1) {
		letters = trainingArray.slice(0,6)
	} else if (current_trial == 1) {
		preceeding1stims = letters.slice()
		letters = trainingArray.filter(function(y) {
			return (jQuery.inArray(y, preceeding1stims) == -1)
		}).slice(0,6)
	} else {
		preceeding2stims = preceeding1stims.slice()
		preceeding1stims = letters.slice()
		letters = trainingArray.filter(function(y) {
			return (jQuery.inArray(y, preceeding1stims.concat(preceeding2stims)) == -1)
		}).slice(0,6)
	}
	return letters
};

//returns a cue randomly, either TOP or BOT
var getCue = function() {
	
	cue = directed_cue_array[Math.floor(Math.random() * 2)]
	
	return cue
};

// Will pop out a probe type from the entire probeTypeArray and then choose a probe congruent with the probe type
var getProbe = function(directed_cond, letters, cue) {
	var trainingArray = jsPsych.randomization.repeat(stimArray, 1);
	var lastCue = cue
	var lastSet_top = letters.slice(0,3)
	var lastSet_bottom = letters.slice(3)
	if (directed_cond== 'pos') {
		if (lastCue == 'BOT') {
			probe = lastSet_top[Math.floor(Math.random() * 3)]
		} else if (lastCue == 'TOP') {
			probe = lastSet_bottom[Math.floor(Math.random() * 3)]
		}
	} else if (directed_cond == 'neg') {
		if (lastCue == 'BOT') {
			probe = lastSet_bottom[Math.floor(Math.random() * 3)]
		} else if (lastCue == 'TOP') {
			probe = lastSet_top[Math.floor(Math.random() * 3)]
		}
	} else if (directed_cond == 'con') {
		newArray = trainingArray.filter(function(y) {
			return (y != lastSet_top[0] && y != lastSet_top[1] && y != lastSet_top[2] && y !=
				lastSet_bottom[0] && y != lastSet_bottom[1] && y != lastSet_bottom[2])
		})
		probe = newArray.pop()
	}
	
	
	return probe
};

var getCorrectResponse = function(cue,probe,letters,stop_signal_condition) {
	if (stop_signal_condition == 'stop'){
		return correct_response = -1
	}
	
	if (cue == 'TOP') {
		if (jQuery.inArray(probe, letters.slice(3)) != -1) {
			return possible_responses[0][1]
		} else {
			return possible_responses[1][1]
		}
	} else if (cue == 'BOT') {
		if (jQuery.inArray(probe, letters.slice(0,3)) != -1) {
			return possible_responses[0][1]
		} else {
			return possible_responses[1][1]
		}
	}	
	
		
}

function getSSD(){
	return SSD
}

function getSSType(){
	return stop_signal_condition

}

var getStopStim = function(){
	return stop_signal_boards[0] + 
		   	preFileType + 'stopSignal' + fileTypePNG + 
		   stop_signal_boards[1] 
}



var appendData = function(){
	curr_trial = jsPsych.progress().current_trial_global
	trial_id = jsPsych.data.getDataByTrialIndex(curr_trial).trial_id
	
	if (trial_id == 'practice_trial'){
		current_block = practiceCount
	}else{
		current_block = testCount
	}
	
	current_trial+=1
	
	jsPsych.data.addDataToLastTrial({
		stop_signal_condition: stop_signal_condition,
		directed_condition: directed_condition,
		probe: probe,
		letters: letters,
		cue: cue,
		correct_response: correct_response,
		current_trial: current_trial,
		current_block: current_block
		
	})
	
	if (jsPsych.data.getDataByTrialIndex(curr_trial).key_press == correct_response){
		jsPsych.data.addDataToLastTrial({
			correct_trial: 1,
		})
	
	} else if (jsPsych.data.getDataByTrialIndex(curr_trial).key_press != correct_response){
		jsPsych.data.addDataToLastTrial({
			correct_trial: 0,
		})
	
	}
	
	if (trial_id == 'test_trial'){
		if ((jsPsych.data.getDataByTrialIndex(curr_trial).key_press == -1) && (jsPsych.data.getDataByTrialIndex(curr_trial).stop_signal_condition == 'stop') && (SSD < maxSSD)){
			jsPsych.data.addDataToLastTrial({stop_acc: 1})
			SSD+=50
		} else if ((jsPsych.data.getDataByTrialIndex(curr_trial).key_press != -1) && (jsPsych.data.getDataByTrialIndex(curr_trial).stop_signal_condition == 'stop') && (SSD > minSSD)){
			jsPsych.data.addDataToLastTrial({stop_acc: 0})
			SSD-=50
		}
	}
}

var getNextStim = function(){
	stim = stims.shift()
	stop_signal_condition = stim.stop_signal_condition
	directed_condition = stim.directed_condition
	probe = stim.probe
	letters = stim.letters
	cue = stim.cue
	correct_response = stim.correct_response
	
	return stim
}

var getTrainingStim = function(){
	return task_boards[0]+letters[0]+
		   task_boards[1]+letters[1]+
		   task_boards[2]+letters[2]+
		   task_boards[3]+letters[3]+
		   task_boards[4]+letters[4]+
		   task_boards[5]+letters[5]+
		   task_boards[6]

}

var getDirectedCueStim = function(){
	return '<div class = bigbox><div class = centerbox><div class = cue-text>'+cue+'</font></div></div></div>'	

}


var getProbeStim = function(){
	return '<div class = bigbox><div class = centerbox><div class = cue-text>'+probe+'</font></div></div></div>'
}
/* ************************************ */
/* Define experimental variables */
/* ************************************ */
// generic task variables
var sumInstructTime = 0 //ms
var instructTimeThresh = 0 ///in seconds
var credit_var = 0
var run_attention_checks = true

// task specific variables
// Set up variables for stimuli
var practice_len = 12 // 24 must be divisible by 12, [3 (go,go,stop) by 4 (directed_forgetting conditions)]
var exp_len = 24 //378 must be divisible by 12
var numTrialsPerBlock = 12; // 63 divisible by 12
var numTestBlocks = exp_len / numTrialsPerBlock

var accuracy_thresh = 0.80
var missed_thresh = 0.30
var practice_thresh = 3 // 3 blocks of 28 trials

var maxStopCorrect = 0.70
var minStopCorrect = 0.30

var SSD = 250
var maxSSD = 850
var minSSD = 0 
 
var possible_responses = [['M Key', 77],['Z Key', 90]]

var current_trial = 0
var current_block = 0

var stimArray = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O',
	'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'
];

var directed_cond_array = ['pos', 'pos', 'neg', 'con']
var directed_cue_array = ['TOP','BOT']
var stop_signal_conditions = ['go','go','stop']

var fileTypePNG = '.png"></img>'
var preFileType = '<img class = center src="/static/experiments/stop_signal_with_directed_forgetting/images/'




var task_boards = [['<div class = bigbox><div class = topLeft><div class = fixation>'],['</div></div><div class = topMiddle><div class = fixation>'],['</div></div><div class = topRight><div class = fixation>'],['</div></div><div class = bottomLeft><div class = fixation>'],['</div></div><div class = bottomMiddle><div class = fixation>'],['</div></div><div class = bottomRight><div class = fixation>'],['</div></div></div>']]

var stop_signal_boards = ['<div class = bigbox><div class = starbox>','</div></div>']
		   
		

var stims = createTrialTypes(practice_len)

var prompt_text_list = '<ul list-text>'+
						'<li>Please respond if the probe (single letter) was in the memory set.</li>'+
						'<li>In memory set: ' + possible_responses[0][0] + '</li>' +
						'<li>Not in memory set: ' + possible_responses[1][0] + '</li>' +
						'<li>Do not respond if a star appears around the probe (single letter)!</li>' +
					   '</ul>'

var prompt_text = '<div class = prompt_box>'+
					  '<p class = center-block-text style = "font-size:16px; line-height:80%%;">Please respond if the probe (single letter) was in the memory set.</p>' +
					  '<p class = center-block-text style = "font-size:16px; line-height:80%%;">In memory set: ' + possible_responses[0][0] + '</p>' +
					  '<p class = center-block-text style = "font-size:16px; line-height:80%%;">Not in memory set: ' + possible_responses[1][0] + '</p>' +
					  '<p class = center-block-text style = "font-size:16px; line-height:80%%;">Do not respond if a star appears around the probe (single letter)!</p>' +
				  '</div>'
/* ************************************ */
/* Set up jsPsych blocks */
/* ************************************ */
// Set up attention check node
var attention_check_block = {
  type: 'attention-check',
  data: {
    trial_id: "attention_check"
  },
  timing_response: 180000,
  response_ends_trial: true,
  timing_post_trial: 200
}

var attention_node = {
  timeline: [attention_check_block],
  conditional_function: function() {
    return run_attention_checks
  }
}


var practice1 = {
	type: 'poldrack-single-stim',
	stimulus: '<div class = bigbox>'+
				'<div class = instructBox>'+
					'<p class = block-text style="font-size:22px;">This is what the first part of the trial will look like.  The letters A, B, and C are on the top portion, while the letters D, E, and F are on the bottom portion.</p>'+
					'<p class = block-text style="font-size:22px;">Please remember all 6 letters.</p>'+
					'<p class = block-text style="font-size:22px;">Press enter to start continue. You will not be able to go back.</p>'+
				'</div>'+
				'<div class = lettersBox>'+
					'<div class = topLeft style="font-size:50px;">A</div>' +
					'<div class = topMiddle style="font-size:50px;">B</div>' +
					'<div class = topRight style="font-size:50px;">C</div>' +
					'<div class = bottomLeft style="font-size:50px;">D</div>' +
					'<div class = bottomMiddle style="font-size:50px;">E</div>' +
					'<div class = bottomRight style="font-size:50px;">F</div>'+
				'</div>'+
			  '</div>',
	is_html: true,
	choices: [13],
	data: {
		trial_id: "visual_instruction"
	},
	timing_post_trial: 0,
	timing_stim: 300000,
	timing_response: 300000,
	response_ends_trial: true,
}

var practice2 = {
	type: 'poldrack-single-stim',
	stimulus: '<div class = bigbox>'+
				'<div class = instructBox>'+
					'<p class = block-text style="font-size:22px;">This is what the second part of the trial will look like. A cue will be presented, either TOP or BOT.  This cue instructs you which of the 6 letters to forget, either the top 3 or bottom 3 letters.</p>'+
					'<p class = block-text style="font-size:22px;">If the cue presented is <i>TOP</i>, then you should <i> forget the top letters A, B, and C</i> and remember D, E, and F.</p>'+
					'<p class = block-text style="font-size:22px;">If the cue presented is <i>BOT</i>, then you should <i> forget the bottom letters D, E, and F </i> and remember A, B, and C.</p>'+
					'<p class = block-text style="font-size:22px;">The letters that you must remember, are called your memory set. </i></p>'+
					'<p class = block-text style="font-size:22px;">In this case, the cue is TOP, so forget the top 3 letters, A, B, and C. <i>Your memory set is D, E, and F!</i></p>'+
					'<p class = block-text style="font-size:22px;">Press enter to continue. You will not be able to go back.</p>'+
				'</div>'+
				
				
				'<div class = centerbox><div class = flanker-text>TOP</div></div>'+
				
			  '</div>',
	is_html: true,
	choices: [13],
	data: {
		trial_id: "visual_instruction"
	},
	timing_post_trial: 0,
	timing_stim: 300000,
	timing_response: 300000,
	response_ends_trial: true,
}

var practice3 = {
	type: 'poldrack-single-stim',
	stimulus: '<div class = bigbox>'+
				'<div class = instructBox>'+
					'<p class = block-text style="font-size:22px;">After the cue, TOP or BOT disappears, you will be presented with a probe - a single letter.  Please respond if the probe was in the memory set.</p>'+
					'<p class = block-text style="font-size:22px;">Press '+possible_responses[0][0]+' if the probe was in the memory set, and '+possible_responses[1][0]+' if not.</p>'+
					'<p class = block-text style="font-size:22px;">In this case, your memory set was D, E, and F, so the letter A, is not in your memory set. The correct response is the '+possible_responses[1][0]+'</p>'+
					'<p class = block-text style="font-size:22px;">Press enter to continue. You will not be able to go back.</p>'+
				'</div>'+
		
				'<div class = centerbox><div class = flanker-text>A</div></div>'+
			  '</div>',
	is_html: true,
	choices: [13],
	data: {
		trial_id: "visual_instruction"
	},
	timing_post_trial: 0,
	timing_stim: 300000,
	timing_response: 300000,
	response_ends_trial: true,
}

var practice4 = {
	type: 'poldrack-single-stim',
	stimulus: '<div class = bigbox>'+
				'<div class = instructBox>'+
					'<p class = block-text style="font-size:22px;">On some trials, a star will appear around the probe.  The star will appear with, or shortly after the probe appears.</p>'+
					'<p class = block-text style="font-size:22px;">If you see a star, please make <i> no response </i> on that trial.</p>'+
					'<p class = block-text style="font-size:22px;">Do not slow down your responses to the probe in order to wait for the star.  Continue to respond as quickly and accurately as possible to the probe.</p>'+
					'<p class = block-text style="font-size:22px;">Press enter to start practice.</p>'+
				'</div>'+
		
				'<div class = centerbox><div class = flanker-text>A</div></div>'+
				'<div class = starbox>' + preFileType + 'stopSignal' + fileTypePNG + '</div>'+
		   
			  '</div>',
	is_html: true,
	choices: [13],
	data: {
		trial_id: "visual_instruction"
	},
	timing_post_trial: 0,
	timing_stim: 300000,
	timing_response: 300000,
	response_ends_trial: true,
}

//Set up post task questionnaire
var post_task_block = {
   type: 'survey-text',
   data: {
       trial_id: "post_task_questions"
   },
   questions: ['<p class = center-block-text style = "font-size: 20px">Please summarize what you were asked to do in this task.</p>',
              '<p class = center-block-text style = "font-size: 20px">Do you have any comments about this task?</p>'],
   rows: [15, 15],
   columns: [60,60]
};


var feedback_text = 
	'Welcome to the experiment. This experiment will take less than 30 minutes. Press <i>enter</i> to begin.'
var feedback_block = {
	type: 'poldrack-single-stim',
	data: {
		trial_id: "feedback_block"
	},
	choices: [13],
	stimulus: getFeedback,
	timing_post_trial: 0,
	is_html: true,
	timing_stim: -1,
	timing_response: -1,
	response_ends_trial: true, 

};

var feedback_instruct_text =
	'Welcome to the experiment. This experiment will take less than 30 minutes. Press <i>enter</i> to begin.'
var feedback_instruct_block = {
	type: 'poldrack-text',
	data: {
		trial_id: "instruction"
	},
	cont_key: [13],
	text: getInstructFeedback,
	timing_post_trial: 0,
	timing_response: 180000
};

/// This ensures that the subject does not read through the instructions too quickly.  If they do it too quickly, then we will go over the loop again.
var instructions_block = {
	type: 'poldrack-instructions',
	data: {
		trial_id: "instruction"
	},
	pages: [
		'<div class = centerbox>'+
			'<p class = block-text>In this experiment you will be presented with 6 letters on each trial. 3 will be at the top, and 3 on the bottom. You must memorize all 6 letters.</p> '+
				
			'<p class = block-text>There will be a short delay, then you will see a cue, either <i>TOP</i> or <i>BOT</i>. '+
			'This will instruct you to <i>FORGET</i> the 3 letters located at either the top or bottom (respectively) of the screen.</p>'+
			
			'<p class = block-text>The three remaining letters that you must remember are called your <i>MEMORY SET</i>. Please forget the letters not in the memory set.</p>'+
		
			'<p class = block-text>So for example, if you get the cue TOP, please <i>forget the top 3 letters</i> and remember the bottom 3 letters. <i>The bottom three letters would be your MEMORY SET.</i></p>'+
		
		'</div>',
		
		'<div class = centerbox>'+
			'<p class = block-text>So for example, if you get the cue TOP, please <i>forget the top 3 letters</i> and remember the bottom 3 letters. <i>The bottom three letters would be your MEMORY SET.</i></p>'+
		
			'<p class = block-text>After a short delay, you will be presented with a probe - a single letter.  Please indicate whether this probe was in your memory set.</p>'+
		
			'<p class = block-text>Press the <i>'+possible_responses[0][0]+
			' </i>if the probe was in the memory set, and the <i>'+possible_responses[1][0]+'  </i>if not.</p>'+
		'</div>',
		
		'<div class = centerbox>'+
			'<p class = block-text>On some trials, a star will appear around the probe.  The star will appear with, or shortly after the probe appears.</p>'+
			
			'<p class = block-text>If you see a star appear, please try your best to make no response on that trial.</p>'+
		
			'<p class = block-text>Please do not slow down your responses to the probe in order to wait for the star.  Continue to respond as quickly and accurately as possible to the probe.</p>'+
					
			'<p class = block-text>We will start practice when you finish instructions. Please make sure you understand the instructions before moving on. During practice, you will receive a reminder of the rules.  <i>This reminder will be taken out for test</i>.</p>'+
		'</div>',
	],
	allow_keys: false,
	show_clickable_nav: true,
	timing_post_trial: 1000
};



/* This function defines stopping criteria */

var instruction_node = {
	timeline: [feedback_instruct_block, instructions_block],
	
	loop_function: function(data) {
		for (i = 0; i < data.length; i++) {
			if ((data[i].trial_type == 'poldrack-instructions') && (data[i].rt != -1)) {
				rt = data[i].rt
				sumInstructTime = sumInstructTime + rt
			}
		}
		if (sumInstructTime <= instructTimeThresh * 1000) {
			feedback_instruct_text =
				'Read through instructions too quickly.  Please take your time and make sure you understand the instructions.  Press <i>enter</i> to continue.'
			return true
		} else if (sumInstructTime > instructTimeThresh * 1000) {
			feedback_instruct_text = 'Done with instructions. Press <i>enter</i> to continue.'
			return false
		}
	}
}

var end_block = {
	type: 'poldrack-text',
	data: {
		trial_id: "end",
	},
	timing_response: 180000,
	text: '<div class = centerbox><p class = center-block-text>Thanks for completing this task!</p><p class = center-block-text>Press <i>enter</i> to continue.</p></div>',
	cont_key: [13],
	timing_post_trial: 0,
	on_finish: function(){
  	assessPerformance()
  	evalAttentionChecks()
  }
};

var start_test_block = {
	type: 'poldrack-text',
	data: {
		trial_id: "instruction"
	},
	timing_response: 180000,
	text: '<div class = centerbox>'+
			'<p class = block-text>We will now start the test portion</p>'+
			
			'<p class = block-text>In this experiment you will be presented with 6 letters on each trial. You must memorize all 6 letters.</p> '+
				
			'<p class = block-text>There will be a short delay, then you will see a cue, either <i>TOP</i> or <i>BOT</i>. '+
			'This will instruct you to <i>FORGET</i> the 3 letters located at either the top or bottom (respectively) of the screen. '+
			'The three remaining letters that you must remember are called your <i>MEMORY SET</i>. Please forget the letters not in the memory set.</p>'+
		
			'<p class = block-text>So for example, if you get the cue TOP, please forget the top 3 letters and remember the bottom 3 letters.</p>'+
		
			'<p class = block-text>After a short delay, you will be presented with a probe - a single letter.  Please indicate whether this probe was in your memory set.</p>'+
		
			'<p class = block-text>Press the <i>'+possible_responses[0][0]+
			' </i>if the probe was in the memory set, and the <i>'+possible_responses[1][0]+'  </i>if not.</p>'+
		
			'<p class = block-text>On some trials, you will see a star appear with or shortly after the probe. Do not respond if you see a star.  Do not slow down your probe to the letter in order to wait for the star.</p>'+
	
			'<p class = block-text>You will no longer receive the rule prompt, so remember the instructions before you continue. Press Enter to begin.</p>'+
		 '</div>',
	cont_key: [13],
	timing_post_trial: 1000,
	on_finish: function(){
		feedback_text = "We will now start the test portion. Press enter to begin."
	}
};

var rest_block = {
	type: 'poldrack-text',
	data: {
		trial_id: "instruction"
	},
	timing_response: 180000,
	text: '<div class = centerbox><p class = center-block-text>Take a short break!</p><p class = center-block-text>Press <i>enter</i> to continue the test.</p></div>',
	cont_key: [13],
	timing_post_trial: 1000
};



var start_fixation_block = {
	type: 'poldrack-single-stim',
	stimulus: '<div class = centerbox><div class = fixation><span style="color:red">+</span></div></div>',
	is_html: true,
	choices: 'none',
	data: {
		trial_id: "fixation"
	},
	timing_post_trial: 0,
	timing_stim: 1000, //1000
	timing_response: 1000,
	on_finish: function(){
		stim = getNextStim()
	}
}

var fixation_block = {
	type: 'poldrack-single-stim',
	stimulus: '<div class = centerbox><div class = fixation><span style="color:red">+</span></div></div>',
	is_html: true,
	choices: 'none',
	data: {
		trial_id: "fixation"
	},
	timing_post_trial: 0,
	timing_stim: 3000, //3000
	timing_response: 3000
}

var ITI_fixation_block = {
	type: 'poldrack-single-stim',
	stimulus: '<div class = centerbox><div class = fixation><span style="color:red">+</span></div></div>',
	is_html: true,
	choices: [possible_responses[0][1],possible_responses[1][1]],
	data: {
		trial_id: "ITI_fixation"
	},
	timing_post_trial: 0,
	timing_stim: 4000, //4000
	timing_response: 4000
}

var cue_directed_block = {
	type: 'poldrack-single-stim',
	stimulus: getDirectedCueStim,
	is_html: true,
	data: {
		trial_id: "cue",
	},
	choices: false,
	timing_post_trial: 0,
	timing_stim: 1000, //1000
	timing_response: 1000
};


var training_block = {
	type: 'poldrack-single-stim',
	stimulus: getTrainingStim,
	is_html: true,
	data: {
		trial_id: "stim"
	},
	choices: 'none',
	timing_post_trial: 0,
	timing_stim: 2500, //2500
	timing_response: 2500
};


var practice_probe_block = {
	type: 'stop-signal',
	stimulus: getProbeStim,
	SS_stimulus: getStopStim,
	stop_signal_condition: getSSType, //getSSType,
	data: {
		"trial_id": "practice_trial"
	},
	is_html: true,
	choices: [possible_responses[0][1],possible_responses[1][1]],
	timing_stim: 850,
	timing_response: 1850,
	response_ends_trial: false,
	SSD: getSSD,
	timing_SS: 500,
	timing_post_trial: 0,
	on_finish: appendData,
	on_start: function(){
		stoppingTracker = []
		stoppingTimeTracker = []
	}
}

var test_probe_block = {
	type: 'stop-signal',
	stimulus: getProbeStim,
	SS_stimulus: getStopStim,
	SS_trial_type: getSSType, //getSSType,
	data: {
		"trial_id": "test_trial"
	},
	is_html: true,
	choices: [possible_responses[0][1],possible_responses[1][1]],
	timing_stim: 850,
	timing_response: 1850,
	response_ends_trial: false,
	SSD: getSSD,
	timing_SS: 500,
	timing_post_trial: 0,
	on_finish: appendData,
	on_start: function(){
		stoppingTracker = []
		stoppingTimeTracker = []
	}
}



var practiceTrials = []
practiceTrials.push(feedback_block)
practiceTrials.push(instructions_block)
for (i = 0; i < practice_len; i++) {
	var practice_start_fixation_block = {
		type: 'poldrack-single-stim',
		stimulus: '<div class = centerbox><div class = fixation><span style="color:red">+</span></div></div>',
		is_html: true,
		choices: 'none',
		data: {
			trial_id: "practice_fixation"
		},
		timing_post_trial: 0,
		timing_stim: 1000, //1000
		timing_response: 1000,
		prompt: prompt_text,
		on_finish: function(){
			stim = getNextStim()
		}
	}

	var practice_fixation_block = {
		type: 'poldrack-single-stim',
		stimulus: '<div class = centerbox><div class = fixation><span style="color:red">+</span></div></div>',
		is_html: true,
		choices: 'none',
		data: {
			trial_id: "practice_fixation"
		},
		timing_post_trial: 0,
		prompt: prompt_text,
		timing_stim: 3000, //3000
		timing_response: 3000
	}

	var practice_ITI_fixation_block = {
		type: 'poldrack-single-stim',
		stimulus: '<div class = centerbox><div class = fixation><span style="color:red">+</span></div></div>',
		is_html: true,
		choices: [possible_responses[0][1],possible_responses[1][1]],
		data: {
			trial_id: "practice_ITI_fixation"
		},
		timing_post_trial: 0,
		prompt: prompt_text,
		timing_stim: 4000, //4000
		timing_response: 4000
	}

	var practice_cue_directed_block = {
		type: 'poldrack-single-stim',
		stimulus: getDirectedCueStim,
		is_html: true,
		data: {
			trial_id: "practice_cue",
		},
		choices: false,
		timing_post_trial: 0,
		timing_stim: 1000, //1000
		timing_response: 1000,
		prompt: prompt_text,
	};


	var practice_training_block = {
		type: 'poldrack-single-stim',
		stimulus: getTrainingStim,
		is_html: true,
		data: {
			trial_id: "practice_stim"
		},
		choices: 'none',
		timing_post_trial: 0,
		prompt: prompt_text,
		timing_stim: 2500, //2500
		timing_response: 2500
	};


	var practice_probe_block = {
		type: 'stop-signal',
		stimulus: getProbeStim,
		SS_stimulus: getStopStim,
		SS_trial_type: getSSType, //getSSType,
		data: {
			"trial_id": "practice_trial"
		},
		is_html: true,
		choices: [possible_responses[0][1],possible_responses[1][1]],
		timing_stim: 850,
		timing_response: 1850,
		response_ends_trial: false,
		SSD: getSSD,
		timing_SS: 500,
		timing_post_trial: 0,
		on_finish: appendData,
		prompt: prompt_text,
		on_start: function(){
			stoppingTracker = []
			stoppingTimeTracker = []
		}
	}
	
	var categorize_block = {
		type: 'poldrack-single-stim',
		data: {
			trial_id: "practice-stop-feedback"
		},
		choices: 'none',
		stimulus: getCategorizeFeedback,
		timing_post_trial: 0,
		is_html: true,
		timing_stim: 500,
		timing_response: 500,
		response_ends_trial: false, 

	  };
	practiceTrials.push(practice_start_fixation_block)
	practiceTrials.push(practice_training_block)
	practiceTrials.push(practice_cue_directed_block)
	practiceTrials.push(practice_fixation_block)
	practiceTrials.push(practice_probe_block)
	practiceTrials.push(categorize_block)
	practiceTrials.push(practice_ITI_fixation_block)
}

var practiceCount = 0
var practiceNode = {
	timeline: practiceTrials,
	loop_function: function(data){
		practiceCount += 1
		current_trial = 0
		stims = createTrialTypes(practice_len)
	
		var total_trials = 0
		var sum_responses = 0
		var total_sum_rt = 0
		
		var go_trials = 0
		var go_correct = 0
		var go_rt = 0
		var sum_go_responses = 0
		
		var stop_trials = 0
		var stop_correct = 0
		var stop_rt = 0
		var sum_stop_responses = 0
		
	
		for (var i = 0; i < data.length; i++){
			if ((data[i].trial_id == "practice_trial") && (data[i].stop_signal_condition == 'go')){
				total_trials+=1
				go_trials+=1
				if (data[i].rt != -1){
					total_sum_rt += data[i].rt
					go_rt += data[i].rt
					sum_go_responses += 1
					if (data[i].key_press == data[i].correct_response){
						go_correct += 1
		
					}
				}
		
			} else if ((data[i].trial_id == "practice_trial") && (data[i].stop_signal_condition == 'stop')){
				total_trials+=1
				stop_trials+=1
				if (data[i].rt != -1){
					total_sum_rt += data[i].rt
					stop_rt += data[i].rt
					sum_stop_responses += 1
					if (data[i].key_press == -1){
						stop_correct += 1
		
					}
				}
			
			}
	
		}
	
		var accuracy = go_correct / go_trials
		var missed_responses = (go_trials - sum_go_responses) / go_trials
		var ave_rt = go_rt / sum_go_responses
		var stop_acc = stop_correct / stop_trials
	
		feedback_text = "<br>Please take this time to read your feedback and to take a short break! Press enter to continue"
		feedback_text += "</p><p class = block-text><i>Average reaction time:  " + Math.round(ave_rt) + " ms. 	Accuracy for go trials: " + Math.round(accuracy * 100)+ "%</i>"

		if ((accuracy > accuracy_thresh) && (stop_correct < maxStopCorrect) && (stop_correct > minStopCorrect)){
			feedback_text +=
					'</p><p class = block-text>Done with this practice. Press Enter to continue.' 
			stims = createTrialTypes(numTrialsPerBlock)
			return false
	
		} else if (accuracy < accuracy_thresh){
			feedback_text +=
					'</p><p class = block-text>Your accuracy is too low.  Remember: <br>' + prompt_text_list
					
			if (missed_responses > missed_thresh){
				feedback_text +=
						'</p><p class = block-text>You have not been responding to some trials.  Please respond on every trial that requires a response.'
			}
			
			if (stop_correct > maxStopCorrect){
				'</p><p class = block-text>You have been responding too slowly.  Please respond as quickly and accurately to each stimuli that requires a response.'
			
			}
			
			if (stop_correct < minStopCorrect){
				'</p><p class = block-text>You have not been stopping your response when stars are present.  Please try your best to stop your response if you see a star.'
			
			}
		
			if (practiceCount == practice_thresh){
				feedback_text +=
					'</p><p class = block-text>Done with this practice.' 
					stims = createTrialTypes(numTrialsPerBlock)
					return false
			}
			
			feedback_text +=
				'</p><p class = block-text>Redoing this practice. Press Enter to continue.' 
			
			return true
		
		}
	
	}
	
}

var testTrials = []
testTrials.push(feedback_block)
testTrials.push(attention_node)
for (i = 0; i < numTrialsPerBlock; i++) {
	testTrials.push(start_fixation_block)
	testTrials.push(training_block)
	testTrials.push(cue_directed_block)
	testTrials.push(fixation_block)
	testTrials.push(test_probe_block)
	testTrials.push(ITI_fixation_block)
}

var testCount = 0
var testNode = {
	timeline: testTrials,
	loop_function: function(data) {
	testCount += 1
	current_trial = 0
	stims = createTrialTypes(numTrialsPerBlock)
	
	var sum_rt = 0
		var sum_responses = 0
		var correct = 0
		var total_trials = 0
	
		for (var i = 0; i < data.length; i++){
			if ((data[i].trial_id == "test_trial") && (data[i].stop_signal_condition == 'go')){
				total_trials+=1
				if (data[i].rt != -1){
					sum_rt += data[i].rt
					sum_responses += 1
					if (data[i].key_press == data[i].correct_response){
						correct += 1
		
					}
				}
		
			}
	
		}
	
		var accuracy = correct / total_trials
		var missed_responses = (total_trials - sum_responses) / total_trials
		var ave_rt = sum_rt / sum_responses
	
		feedback_text = "<br>Please take this time to read your feedback and to take a short break! Press enter to continue"
		feedback_text += "</p><p class = block-text><i>Average reaction time:  " + Math.round(ave_rt) + " ms. 	Accuracy: " + Math.round(accuracy * 100)+ "%</i>"
		feedback_text += "</p><p class = block-text>You have completed: "+testCount+" out of "+numTestBlocks+" blocks of trials."
		
		if (accuracy < accuracy_thresh){
			feedback_text +=
					'</p><p class = block-text>Your accuracy is too low.  Remember: <br>' + prompt_text_list
		}
		
		if (missed_responses > missed_thresh){
			feedback_text +=
					'</p><p class = block-text>You have not been responding to some trials.  Please respond on every trial that requires a response.'
		}
		
		if (stop_correct > maxStopCorrect){
			'</p><p class = block-text>You have been responding too slowly.  Please respond as quickly and accurately to each stimuli that requires a response.'
		
		}
		
		if (stop_correct < minStopCorrect){
			'</p><p class = block-text>You have not been stopping your response when stars are present.  Please try your best to stop your response if you see a star.'
		
		}
	
		if (testCount == numTestBlocks){
			feedback_text +=
					'</p><p class = block-text>Done with this test. Press Enter to continue.'
			return false
		} else {
		
			return true
		}
	
	}
}


/* create experiment definition array */
stop_signal_with_directed_forgetting_experiment = []

//stop_signal_with_directed_forgetting_experiment.push(attn_node)

//stop_signal_with_directed_forgetting_experiment.push(instruction_node)

//stop_signal_with_directed_forgetting_experiment.push(practice1)

//stop_signal_with_directed_forgetting_experiment.push(practice2)

//stop_signal_with_directed_forgetting_experiment.push(practice3)

//stop_signal_with_directed_forgetting_experiment.push(practice4)

stop_signal_with_directed_forgetting_experiment.push(practiceNode)

stop_signal_with_directed_forgetting_experiment.push(start_test_block)

stop_signal_with_directed_forgetting_experiment.push(testNode)

stop_signal_with_directed_forgetting_experiment.push(post_task_block)

stop_signal_with_directed_forgetting_experiment.push(end_block)
