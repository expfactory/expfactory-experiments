/* ************************************ */
/*       Define Helper Functions        */
/* ************************************ */

function getDisplayElement() {
    $('<div class = display_stage_background></div>').appendTo('body')
    return $('<div class = display_stage></div>').appendTo('body')
}

function addID() {
  jsPsych.data.addDataToLastTrial({exp_id: 'n_back_with_cued_task_switching'})
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
  return check_percent
}

function assessPerformance() {
	var experiment_data = jsPsych.data.getTrialsOfType('poldrack-single-stim')
	var missed_count = 0
	var trial_count = 0
	var rt_array = []
	var rt = 0
	var correct = 0 
		//record choices participants made
	var choice_counts = {}
	choice_counts[-1] = 0
	choice_counts[77] = 0
	choice_counts[90] = 0

	for (var i = 0; i < experiment_data.length; i++) {
		if (experiment_data[i].trial_id == 'test_trial') {
			trial_count += 1
			rt = experiment_data[i].rt
			key = experiment_data[i].key_press
			choice_counts[key] += 1
			if (rt == -1) {
				missed_count += 1
			} else {
				rt_array.push(rt)
			}
			
			if (key == experiment_data[i].correct_response){
				correct += 1
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
	var accuracy = correct / trial_count
	credit_var = (missed_percent < 0.25 && avg_rt > 200 && responses_ok && accuracy > 0.60)
	jsPsych.data.addDataToLastTrial({final_credit_var: credit_var,
									 final_missed_percent: missed_percent,
									 final_avg_rt: avg_rt,
									 final_responses_ok: responses_ok,
									 final_accuracy: accuracy})
}


var getResponse = function() {
	return correct_response
}

var getInstructFeedback = function() {
	return '<div class = centerbox><p class = center-block-text>' + feedback_instruct_text +
		'</p></div>'
}


var getFeedback = function() {
	return '<div class = bigbox><div class = picture_box><p class = block-text><font color="white">' + feedback_text + '</font></p></div></div>'
}


var randomDraw = function(lst) {
	var index = Math.floor(Math.random() * (lst.length))
	return lst[index]
};


var createTrialTypes = function(numTrialsPerBlock){
	//cued_dimension = cued_dimensions[Math.floor(Math.random() * 2)][Math.floor(Math.random() * 2)] // current task, 1 or 2 back
	curr_task = 'one_back'
	curr_cue = tasks[curr_task].cues[Math.floor(Math.random() * 2)]
	cued_condition = 'N/A' // switch or stay for tasks
	n_back_condition = 'N/A' 
	cued_switch_condition = 'N/A' //stay or switch for cues
	probe = randomDraw(letters)
	correct_response = possible_responses[1][1]
	
	first_stim = {
		n_back_condition: n_back_condition,
		curr_task: curr_task,
		curr_cue: curr_cue,
		cued_condition: cued_condition,
		probe: probe,
		correct_response: correct_response,
		delay: tasks[curr_task].delay,
		cued_switch_condition: cued_switch_condition
	}	
	
	n_back_condition = jsPsych.randomization.repeat(['match','mismatch','mismatch','mismatch','mismatch'],1).pop()
	cued_condition = cued_conditions[Math.floor(Math.random() * 2)]
	cued_switch_condition = cued_switch_conditions[Math.floor(Math.random() * 2)]
	last_task = curr_task
	if (cued_condition == "switch"){ // if switch tasks, pick a random cue and switch to other task
		curr_task = randomDraw(['one_back','two_back'].filter(function(y) {return $.inArray(y, [last_task]) == -1}))
		curr_cue = tasks[curr_task].cues[Math.floor(Math.random() * 2)]
		cued_switch_condition = 'switch'
	} else if (cued_condition == "stay"){ // if stay tasks, if cued_switch condition is switch, then switch to other cue, stay if not.
		if (cued_switch_condition == 'switch'){
		last_cue = curr_cue
		curr_cue = randomDraw(tasks[curr_task].cues.filter(function(y) {return $.inArray(y, [last_cue]) == -1}))
		}
	
	}
	delay = tasks[curr_task].delay
	
	if ((n_back_condition == "match") && (curr_task == 'one_back')){
		probe = randomDraw([first_stim.probe.toUpperCase(), first_stim.probe.toLowerCase()])
		correct_response = possible_responses[0][1]
	} else if ((n_back_condition == "mismatch") && (curr_task == 'two_back')){
		probe = randomDraw('bBdDgGtTvV'.split("").filter(function(y) {return $.inArray(y, [first_stim.probe.toLowerCase(), first_stim.probe.toUpperCase()]) == -1}))
		correct_response = possible_responses[1][1]
	
	} else if (delay == 2) {
		probe = randomDraw(letters)
		correct_response = possible_responses[1][1]
		n_back_condition = 'N/A'
	
	}
	
	second_stim = {
		n_back_condition: n_back_condition,
		curr_task: curr_task,
		curr_cue: curr_cue,
		cued_condition: cued_condition,
		probe: probe,
		correct_response: correct_response,
		delay: tasks[curr_task].delay,
		cued_switch_condition: cued_switch_condition
	}
	
	stims = []
	
	for(var numIterations = 0; numIterations < numTrialsPerBlock/(n_back_conditions.length*cued_conditions.length*cued_switch_conditions.length); numIterations++){
		for (var numNBackConds = 0; numNBackConds < n_back_conditions.length; numNBackConds++){
			for (var numCuedConds = 0; numCuedConds < cued_conditions.length; numCuedConds++){
				for (var numCuedSwitchConds = 0; numCuedSwitchConds < cued_switch_conditions.length; numCuedSwitchConds++){
			
					//cued_dimension = 'N/A'
					cued_condition = cued_conditions[numCuedConds]
					n_back_condition = n_back_conditions[numNBackConds]
					curr_task = 'N/A'
					cued_switch_condition = cued_switch_conditions[numCuedSwitchConds]
				
					stim = {
						//cued_dimension: cued_dimension,
						cued_condition: cued_condition,
						n_back_condition: n_back_condition,
						curr_task: curr_task,
						cued_switch_condition: cued_switch_condition
						}
			
					stims.push(stim)
				}
			}
			
		}
	}
	
	stims = jsPsych.randomization.repeat(stims,1)
	stims.push(second_stim)
	stims.push(first_stim)
	
	stim_len = stims.length
	
	new_stims = []
	for (var i = 0; i < stim_len; i++){
		if (i < 2){
			stim = stims.pop()
			n_back_condition = stim.n_back_condition
			//cued_dimension = stim.cued_dimension
			curr_task = stim.curr_task
			curr_cue = stim.curr_cue
			cued_switch_condition = stim.cued_switch_condition
			cued_condition = stim.cued_condition
			probe = stim.probe
			correct_response = stim.correct_response
			delay = stims.delay
		} else if (i > 1){
			stim = stims.pop()
			n_back_condition = stim.n_back_condition
			cued_condition = stim.cued_condition
			cued_switch_condition = stim.cued_switch_condition
			
			last_task = curr_task
			if (cued_condition == "switch"){ // if switch tasks, pick a random cue and switch to other task
				cued_switch_condition = 'switch'
				curr_task = randomDraw(['one_back','two_back'].filter(function(y) {return $.inArray(y, [last_task]) == -1}))
				curr_cue = tasks[curr_task].cues[Math.floor(Math.random() * 2)]
			} else if (cued_condition == "stay"){ // if stay tasks, if cued_switch condition is switch, then switch to other cue, stay if not.
				if (cued_switch_condition == 'switch'){
				last_cue = curr_cue
				curr_cue = randomDraw(tasks[curr_task].cues.filter(function(y) {return $.inArray(y, [last_cue]) == -1}))
				}
	
			}
	
			delay = tasks[curr_task].delay
		
			if (n_back_condition == "match"){
				probe = randomDraw([new_stims[i - delay].probe.toUpperCase(), new_stims[i - delay].probe.toLowerCase()])
				correct_response = possible_responses[0][1]
			} else if (n_back_condition == "mismatch"){
				probe = randomDraw('bBdDgGtTvV'.split("").filter(function(y) {return $.inArray(y, [new_stims[i - delay].probe.toLowerCase(), new_stims[i - delay].probe.toUpperCase()]) == -1}))
				correct_response = possible_responses[1][1]
		
			}
		}
		
		stim = {
			n_back_condition: n_back_condition,
			//cued_dimension: cued_dimension[0],
			curr_task: curr_task,
			curr_cue: curr_cue,
			cued_condition: cued_condition,
			probe: probe,
			correct_response: correct_response,
			delay: tasks[curr_task].delay,
			cued_switch_condition: cued_switch_condition
		}
		
		new_stims.push(stim)	
		}
	return new_stims
}

var getCueStim = function() {
	stim = stims.shift()
	n_back_condition = stim.n_back_condition
	curr_task = stim.curr_task
	curr_cue = stim.curr_cue
	cued_switch_condition = stim.cued_switch_condition
	cued_condition = stim.cued_condition
	probe = stim.probe
	correct_response = stim.correct_response
	delay = stim.delay
	
	if (probe == probe.toUpperCase()) {
	 letter_case = 'uppercase'
	} else if (probe == probe.toLowerCase()) {
	 letter_case = 'lowercase'
	}
	
  var cue_html = '<div class = upperbox><div class = "center-text" >' + curr_cue +
    '</div></div><div class = lowerbox><div class = fixation>+</div></div>'
  return cue_html
}

var getStim = function() {

  var stim_html = '<div class = upperbox><div class = "center-text" >' + curr_cue + '</div></div>'+
  				  '<div class = lowerbox><div class = gng_number><div class = cue-text>'+ preFileType  + letter_case + '_' + probe.toUpperCase() + fileTypePNG +'</div></div></div>'
		
  return stim_html
}

var getCueControlStim = function(){
	stim = control_stims.shift()
	n_back_condition = stim.n_back_condition
	cued_dimension = stim.cued_dimension
	cued_condition = stim.cued_condition
	probe = stim.probe
	correct_response = stim.correct_response

	return task_boards[0] + cued_dimension + task_boards[1]
}

var getResponse =  function(){
	return correct_response
}

var appendData = function(){
	curr_trial = jsPsych.progress().current_trial_global
	trial_id = jsPsych.data.getDataByTrialIndex(curr_trial).trial_id
	current_trial+=1
	
	
	if (trial_id == 'practice_trial'){
		current_block = practiceCount
	} else if (trial_id == 'test_trial'){
		current_block = testCount
	}
		
	jsPsych.data.addDataToLastTrial({
		n_back_condition: n_back_condition,
		cue_condition: cued_switch_condition,
		curr_task: curr_task,
		curr_cue: curr_cue,
		task_condition: cued_condition,
		probe: probe,
		correct_response: correct_response,
		delay: delay,
		current_trial: current_trial,
		current_block: current_block,
		CTI: CTI
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
				
	 
}

var getCTI = function(){
	return CTI
}

/* ************************************ */
/*    Define Experimental Variables     */
/* ************************************ */
// generic task variables
var sumInstructTime = 0 //ms
var instructTimeThresh = 0 ///in seconds
var credit_var = 0
var run_attention_checks = true


var practice_len = 20 // 20
var exp_len = 240 //240 must be divisible by 20
var numTrialsPerBlock = 80 // must be divisible by 20
var numTestBlocks = exp_len / numTrialsPerBlock

var accuracy_thresh = 0.75
var rt_thresh = 1000
var missed_thresh = 0.10
var practice_thresh = 3 // 3 blocks of 20 trials

var CTI = 150

var pathSource = "/static/experiments/n_back_with_cued_task_switching/images/"
var fileTypePNG = ".png'></img>"
var preFileType = "<img class = center src='/static/experiments/n_back_with_cued_task_switching/images/"



var n_back_conditions = ['match','mismatch','mismatch','mismatch','mismatch']
var cued_conditions = jsPsych.randomization.repeat(['stay','switch'],1) //task switching
var cued_switch_conditions = jsPsych.randomization.repeat(['stay','switch'],1) //cue switching

var cued_dimensions = jsPsych.randomization.repeat([['1-back',1],['2-back',2]],1) //cues for each task
var cued_dimensions = jsPsych.randomization.repeat([[['1-back',1],['one ago',1]],[['2-back',2],['two ago',2]]],1) //cues for each task

var tasks = {
  one_back: {
    task: '1-back',
    cues: ['1-back', 'one-ago'],
    delay: 1
  },
  two_back: {
    task: '2-back',
    cues: ['2-back', 'two-ago'],
    delay: 2
  }
}

var control_dimensions = jsPsych.randomization.repeat([['T or t'],['non-T or non-t']],1) //control cues
var possible_responses = [['M Key', 77],['Z Key', 90]]
							 
var letters = 'bBdDgGtTvV'.split("")

var stims = createTrialTypes(practice_len)


var prompt_text_list = '<ul style="text-align:left;">'+
						'<li>one-ago or 1-back: match the current letter to the letter that appeared 1 trial ago</li>' +
						'<li>two-ago or 2-back: match the current letter to the letter that appeared 2 trials ago</li>' +
						'<li>If they match, press the '+possible_responses[0][0]+'</li>' +
					    '<li>If they mismatch, press the '+possible_responses[1][0]+'</li>' +
					  '</ul>'

var prompt_text = '<div class = prompt_box>'+
					  '<p class = center-block-text style = "font-size:16px; line-height:80%%;">one-ago or 1-back: match the current letter to the letter that appeared 1 trial ago</p>' +
					  '<p class = center-block-text style = "font-size:16px; line-height:80%%;">two-ago or 2-back: match the current letter to the letter that appeared 2 trials ago</p>' +
					  '<p class = center-block-text style = "font-size:16px; line-height:80%%;">If they match, press the '+possible_responses[0][0]+'</p>' +
					  '<p class = center-block-text style = "font-size:16px; line-height:80%%;">If they mismatch, press the '+possible_responses[1][0]+'</p>' +
				  '</div>'

var current_trial = 0
var current_block = 0

//PRE LOAD IMAGES HERE
var pathSource = "/static/experiments/n_back_with_cued_task_switching/images/"
var lettersPreload = ['B','D','G','T','V']
var casePreload = ['uppercase','lowercase']
var images = []

for(i=0;i<lettersPreload.length;i++){
	for(x=0;x<casePreload.length;x++){
		images.push(pathSource + casePreload[x] + '_' + lettersPreload[i] + '.png')
	}
}

jsPsych.pluginAPI.preloadImages(images);

/* ************************************ */
/*          Define Game Boards          */
/* ************************************ */

var task_boards = ['<div class = bigbox><div class = centerbox><div class = gng_number><div class = cue-text>','</div></div></div></div>']		


/* ************************************ */
/*        Set up jsPsych blocks         */
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

//Set up post task questionnaire
var post_task_block = {
   type: 'survey-text',
   data: {
       exp_id: "n_back_with_cued_task_switching",
       trial_id: "post task questions"
   },
   questions: ['<p class = center-block-text style = "font-size: 20px">Please summarize what you were asked to do in this task.</p>',
              '<p class = center-block-text style = "font-size: 20px">Do you have any comments about this task?</p>'],
   rows: [15, 15],
   timing_response: 360000,
   columns: [60,60]
};

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


var feedback_instruct_text =
	'Welcome to the experiment. This experiment will take around 15 minutes. Press <i>enter</i> to begin.'
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
			'<p class = block-text>In this task, you will see a cue, either <i>1-back</i>, <i>one-ago</i>, <i>2-back</i>, or <i>two-ago</i> followed by a letter on every trial.</p>'+
			'<p class = block-text>You will be asked to match the current letter, to the letter that appeared either 1 or 2 trials ago depending on which cue you saw.</p> '+
			'<p class = block-text>If you saw a <i>1-back</i> or <i>one-ago cue</i>, please respond if the current letter was the same as the letter that occurred 1 trial(s) ago.</p> '+
			'<p class = block-text>If you saw a <i>2-back</i> or <i>two-ago cue</i>, please respond if the current letter was the same as the letter that occurred 2 trial(s) ago.</p> '+
			'<p class = block-text>Press the '+possible_responses[0][0]+' if the current letter matches the letter 1 or 2 trials ago, and the '+possible_responses[1][0]+' if they mismatch.</p> '+
			'<p class = block-text>Capitalization does not matter, so "T" matches with "t".</p> '+
		'</div>',
		'<div class = centerbox>'+
			'<p class = block-text>For example, if the cues you saw were  1-back, 2-back, two-ago, and one-ago, and the letters you received following each of those cues were V, B, v, and V, you would respond, no match, no match, match, and match.</p> '+
			'<p class = block-text>The first letter in that sequence, V, DOES NOT have a preceding trial to match with, so press the '+possible_responses[1][0]+' on those trials.</p> '+
			'<p class = block-text>The second letter in that sequence, B, ALSO DOES NOT have a trial 2 ago to match with, so press the '+possible_responses[1][0]+' on those trials.</p>'+
			'<p class = block-text>The third letter in that sequence, v, DOES match the letter from trials 2 ago, V, so you would respond match.</p>'+
			'<p class = block-text>The fourth letter in that sequence, V, DOES match the letter from trial 1 ago, v, so you would respond match.</p>'+
			'<p class = block-text>We will start practice after you finish instructions. Please make sure you understand the instructions before moving on. During practice, you will receive a reminder of the rules.  <i>This reminder will not be available for test</i>.</p>'+
			'<p class = block-text>To avoid technical issues, please keep the experiment tab (on Chrome or Firefox) <i>active and in full-screen mode</i> for the whole duration of each task.</p>'+
		'</div>'
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

var start_test_block = {
	type: 'poldrack-text',
	data: {
		trial_id: "instruction"
	},
	timing_response: 180000,
	text: '<div class = centerbox>'+
			'<p class = block-text>We will now start the test portion</p>'+
			
			'<p class = block-text>You will be asked to match the current letter, to the letter that appeared either 1 or 2 trials ago depending on if you saw the <i>1-back</i>, <i>one-ago</i>, <i>2-back</i>, or <i>two-ago</i> cue.</p> '+
			'<p class = block-text>If you saw a <i>1-back</i> or <i>one-ago cue</i>, please respond if the current letter was the same as the letter that occurred 1 trial(s) ago.</p> '+
			'<p class = block-text>If you saw a <i>2-back</i> or <i>two-ago cue</i>, please respond if the current letter was the same as the letter that occurred 2 trial(s) ago.</p> '+
			'<p class = block-text>Press the '+possible_responses[0][0]+' if the current letter matches the letter 1 or 2 trials ago, and the '+possible_responses[1][0]+' if they mismatch.</p> '+
			'<p class = block-text>Capitalization does not matter, so "T" matches with "t".</p> '+
				
			'<p class = block-text>You will no longer receive the rule prompt, so remember the instructions before you continue. Press Enter to begin.</p>'+
		 '</div>',
	cont_key: [13],
	timing_post_trial: 1000,
	on_finish: function(){
		feedback_text = "We will now start the test portion. Press enter to begin."
	}
};

var start_control_block = {
	type: 'poldrack-text',
	data: {
		trial_id: "instruction"
	},
	timing_response: 180000,
	text: '<div class = centerbox>'+
			'<p class = block-text>For this block of trials, you do not have to match letters.  Instead, indicate whether the current letter is a T (or t) or any other letter other than T (or t) depending on which cue you saw.</p>'+
			'<p class = block-text>If you saw the cue, '+control_dimensions[0]+', respond if the current letter was a '+control_dimensions[0]+'. Press the '+possible_responses[0][0]+' if the current letter was a '+control_dimensions[0]+' and the '+possible_responses[1][0]+' if not.</p> '+
			'<p class = block-text>If you saw the cue, '+control_dimensions[1]+', respond if the current letter was a '+control_dimensions[1]+'. Press the '+possible_responses[0][0]+' if the current letter was a '+control_dimensions[1]+' and the '+possible_responses[1][0]+' if not.</p> '+	
			'<p class = block-text>You will no longer receive the rule prompt, so remember the instructions before you continue. Press Enter to begin.</p>'+
		 '</div>',
	cont_key: [13],
	timing_post_trial: 1000,
	on_finish: function(){
		feedback_text = "We will now start this block. Press enter to begin."
	}
};

var feedback_text = 
'Welcome to the experiment. This experiment will take around 15 minutes. Press <i>enter</i> to begin.'
var feedback_block = {
	type: 'poldrack-single-stim',
	data: {
		trial_id: "feedback_block"
	},
	choices: [13],
	stimulus: getFeedback,
	timing_post_trial: 0,
	is_html: true,
	timing_response: 180000,
	response_ends_trial: true, 

};
/* ************************************ */
/*        Set up timeline blocks        */
/* ************************************ */

var practiceTrials = []
practiceTrials.push(feedback_block)
practiceTrials.push(instructions_block)
for (i = 0; i < practice_len + 2; i++) {
	var practice_fixation_block = {
	  type: 'poldrack-single-stim',
	  stimulus: '<div class = upperbox><div class = fixation>+</div></div><div class = lowerbox><div class = fixation>+</div></div>',
	  is_html: true,
	  choices: 'none',
	  data: {
		trial_id: "practice_fixation"
	  },
	  timing_post_trial: 0,
	  timing_stim: 500, //500
	  timing_response: 500, //500
	  prompt: prompt_text
	}
	
	var cue_block = {
		type: 'poldrack-single-stim',
		stimulus: getCueStim,
		is_html: true,
		data: {
			trial_id: "practice_cue",
		},
		choices: false,
		timing_post_trial: 0,
		timing_stim: getCTI, //getCTI
		timing_response: getCTI, //getCTI
		prompt: prompt_text
	};
	
	var practice_block = {
		type: 'poldrack-categorize',
		stimulus: getStim,
		is_html: true,
		choices: [possible_responses[0][1],possible_responses[1][1]],
		key_answer: getResponse,
		data: {
			trial_id: "practice_trial"
			},
		correct_text: '<div class = fb_box><div class = center-text><font size = 20>Correct!</font></div></div>' + prompt_text,
		incorrect_text: '<div class = fb_box><div class = center-text><font size = 20>Incorrect</font></div></div>' + prompt_text,
		timeout_message: '<div class = fb_box><div class = center-text><font size = 20>Respond Faster!</font></div></div>' + prompt_text,
		timing_stim: 1000, //1000
		timing_response: 2000, //2000
		timing_feedback_duration: 500,
		show_stim_with_feedback: false,
		timing_post_trial: 0,
		on_finish: appendData,
		prompt: prompt_text
	}
	practiceTrials.push(practice_fixation_block)
	practiceTrials.push(cue_block)
	practiceTrials.push(practice_block)
}

var practiceCount = 0
var practiceNode = {
	timeline: practiceTrials,
	loop_function: function(data) {
		practiceCount += 1
		stims = createTrialTypes(practice_len)
		current_trial = 0
	
		var sum_rt = 0
		var sum_responses = 0
		var correct = 0
		var total_trials = 0
	
		for (var i = 0; i < data.length; i++){
			if (data[i].trial_id == "practice_trial"){
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

		if (accuracy > accuracy_thresh){
			feedback_text +=
					'</p><p class = block-text>Done with this practice. Press Enter to continue.' 
			stims = createTrialTypes(numTrialsPerBlock)
			return false
	
		} else if (accuracy < accuracy_thresh){
			feedback_text +=
					'</p><p class = block-text>We are going to try practice again to see if you can achieve higher accuracy.  Remember: <br>' + prompt_text_list 
			if (missed_responses > missed_thresh){
				feedback_text +=
						'</p><p class = block-text>You have not been responding to some trials.  Please respond on every trial that requires a response.'
			}

	      	if (ave_rt > rt_thresh) {
	        	feedback_text += 
	            	'</p><p class = block-text>You have been responding too slowly.'
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
for (i = 0; i < numTrialsPerBlock + 2; i++) {
	var test_fixation_block = {
	  type: 'poldrack-single-stim',
	  stimulus: '<div class = upperbox><div class = fixation>+</div></div><div class = lowerbox><div class = fixation>+</div></div>',
	  is_html: true,
	  choices: 'none',
	  data: {
		trial_id: "test_fixation"
	  },
	  timing_post_trial: 0,
	  timing_stim: 500, //500
	  timing_response: 500, //500
	}
	
	var cue_block = {
		type: 'poldrack-single-stim',
		stimulus: getCueStim,
		is_html: true,
		data: {
			trial_id: "test_cue",
		},
		choices: false,
		timing_post_trial: 0,
		timing_stim: getCTI, //getCTI
		timing_response: getCTI //getCTI
	};
	
	var test_block = {
		type: 'poldrack-single-stim',
		stimulus: getStim,
		is_html: true,
		data: {
			"trial_id": "test_trial",
		},
		choices: [possible_responses[0][1],possible_responses[1][1]],
		timing_stim: 1000, //1000
		timing_response: 2000, //2000
		timing_post_trial: 0,
		response_ends_trial: false,
		on_finish: appendData
	}
	testTrials.push(test_fixation_block)
	testTrials.push(cue_block)
	testTrials.push(test_block)
}

var testCount = 0
var testNode = {
	timeline: testTrials,
	loop_function: function(data) {
	testCount += 1
	stims = createTrialTypes(numTrialsPerBlock)
	current_trial = 0
	
	var sum_rt = 0
		var sum_responses = 0
		var correct = 0
		var total_trials = 0
	
		for (var i = 0; i < data.length; i++){
			if (data[i].trial_id == "test_trial"){
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
		feedback_text += "</p><p class = block-text>You have completed: "+testCount+" out of "+numTestBlocks+" blocks of trials."
		
		if (accuracy < accuracy_thresh){
			feedback_text +=
					'</p><p class = block-text>Your accuracy is too low.  Remember: <br>' + prompt_text_list 
		}
		if (missed_responses > missed_thresh){
			feedback_text +=
					'</p><p class = block-text>You have not been responding to some trials.  Please respond on every trial that requires a response.'
		}
		
      	if (ave_rt > rt_thresh) {
        	feedback_text += 
            	'</p><p class = block-text>You have been responding too slowly.'
      	}
	
		if (testCount == numTestBlocks){
			feedback_text +=
					'</p><p class = block-text>Done with this test. Press Enter to continue.<br> If you have been completing tasks continuously for an hour or more, please take a 15-minute break before starting again.'
			return false
		} else {
		
			return true
		}
	
	}
}


/* ************************************ */
/*          Set up Experiment           */
/* ************************************ */

var n_back_with_cued_task_switching_experiment = []

n_back_with_cued_task_switching_experiment.push(practiceNode);
n_back_with_cued_task_switching_experiment.push(feedback_block);

n_back_with_cued_task_switching_experiment.push(start_test_block);
n_back_with_cued_task_switching_experiment.push(testNode);
n_back_with_cued_task_switching_experiment.push(feedback_block);

n_back_with_cued_task_switching_experiment.push(post_task_block);
n_back_with_cued_task_switching_experiment.push(end_block);
