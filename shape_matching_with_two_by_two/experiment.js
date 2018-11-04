/* ************************************ */
/* Define helper functions */
/* ************************************ */
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
	experiment_data = experiment_data.concat(jsPsych.data.getTrialsOfType('poldrack-categorize'))
	var missed_count = 0
	var trial_count = 0
	var rt_array = []
	var rt = 0
	//
	var object_recognition_correct = 0
	var object_recognition_count = 0
	var object_recognition_rt = 0
	var object_recognition_threshold = 0.75  // must achieve accuracy higher than 75% to get credit 
	//
		//record choices participants made
	var choice_counts = {}
	choice_counts[-1] = 0
	for (var k = 0; k < response_keys.key.length; k++) {
		choice_counts[response_keys.key[k]] = 0
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
		//
		if (experiment_data[i].trial_id == "object_recognition_network"){
			object_recognition_count += 1
			if (experiment_data[i].pass_check == true){
				object_recognition_correct += 1
				object_recognition_rt += experiment_data[i].rt
			}
		}
		//
	}
	
	var object_correct = object_recognition_correct / object_recognition_count
	var object_ave_rt = object_recognition_rt / object_recognition_count
	
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
	//&& object_correct > object_recognition_threshold && object_ave_rt > 200
	jsPsych.data.addDataToLastTrial({"credit_var": credit_var})
}

var randomDraw = function(lst) {
  var index = Math.floor(Math.random() * (lst.length))
  return lst[index]
}

var getInstructFeedback = function() {
  return '<div class = centerbox><p class = center-block-text>' + feedback_instruct_text +
    '</p></div>'
}

var getCategorizeIncorrectText = function(){
	if (shape_matching_condition == 'go'){
	
		return '<div class = fb_box><div class = center-text><font size = 20>Incorrect</font></div></div>' + '<div class = promptbox>' + prompt_task_list + '</div>'
	} else {
	
		return '<div class = fb_box><div class = center-text><font size = 20>Incorrect</font></div></div>' + '<div class = promptbox>' + prompt_task_list + '</div>'
	}

}

var getTimeoutText = function(){
	if (shape_matching_condition == "go"){
		return '<div class = fb_box><div class = center-text><font size = 20>Respond Faster!</font></div></div>' + '<div class = promptbox>' + prompt_task_list + '</div>'
	} else {
		return '<div class = fb_box><div class = center-text><font size = 20>Correct!</font></div></div>' + '<div class = promptbox>' + prompt_task_list + '</div>'
	}
}

var getCategorizeCorrectText = function(){
	if (shape_matching_condition == "go"){
		return '<div class = fb_box><div class = center-text><font size = 20>Correct!</font></div></div>' + '<div class = promptbox>' + prompt_task_list + '</div>'
	} else {
		return '<div class = fb_box><div class = center-text><font size = 20>Incorrect</font></div></div>' + '<div class = promptbox>' + prompt_task_list + '</div>'
	}
}

// Task Specific Functions
var getKeys = function(obj) {
  var keys = [];
  for (var key in obj) {
    keys.push(key);
  }
  return keys
}

var genStims = function(n) {
  stims = []
  for (var i = 0; i < n; i++) {
    var number = randomDraw('12346789')
    var color = 'white'
    var stim = {
      number: parseInt(number),
      color: color
    }
    stims.push(stim)
  }
  return stims
}

//Sets the cue-target-interval for the cue block
var setCTI = function() {
  return 300 //randomDraw([100, 900])
}

var getCTI = function() {
  return CTI
}

var getFeedback = function() {
	return '<div class = bigbox><div class = picture_box><p class = block-text><font color="white">' + feedback_text + '</font></p></div></div>'
}

/* Index into task_switches using the global var current_trial. Using the task_switch and cue_switch
change the task. If "stay", keep the same task but change the cue based on "cue switch". 
If "switch new", switch to the task that wasn't the current or last task, choosing a random cue. 
If "switch old", switch to the last task and randomly choose a cue.
*/
var setStims = function() {
  var tmp;
  switch (task_switches[current_trial].task_switch) {
    case "stay":
      if (curr_task == "na") {
        tmp = curr_task
        curr_task = randomDraw(getKeys(tasks))
      }
      if (task_switches[current_trial].cue_switch == "switch") {
        cue_i = 1 - cue_i
      }
      break
    case "switch_new":
      cue_i = randomDraw([0, 1])
      if (last_task == "na") {
        tmp = curr_task
        curr_task = randomDraw(getKeys(tasks).filter(function(x) {
          return (x != curr_task)
        }))
        last_task = tmp
      } else {
        tmp = curr_task
        curr_task = getKeys(tasks).filter(function(x) {
          return (x != curr_task)
        })[0]
        last_task = tmp
      }
      break
    case "switch_old":
      cue_i = randomDraw([0, 1])
      if (last_task == "na") {
        tmp = curr_task
        curr_task = randomDraw(getKeys(tasks).filter(function(x) {
          return (x != curr_task)
        }))
        last_task = tmp
      } else {
        tmp = curr_task
        curr_task = last_task
        last_task = tmp
      }
      break

  }
  curr_cue = tasks[curr_task].cues[cue_i]
  curr_stim = stims[current_trial]
  shape_matching_condition = task_switches[current_trial].shape_matching_type
  PTDC = getPTDC(shape_matching_condition,curr_task)
  probe = PTDC[0]
  target = PTDC[1]
  distractor = PTDC[2]
  correct_response = PTDC[3] 
  current_trial = current_trial + 1
  CTI = setCTI()
}

var getCue = function() {
  var cue_html = '<div class = upperbox><div class = "center-text" >' + curr_cue + '</div></div>'+
  				 '<div class = lowerbox>'+ 
					'<div class = leftbox>' + preFileType + 'mask' + fileTypePNG + 
					'<div class = centerbox><div class = fixation>+</div></div>' +
					'</div>' +
					'<div class = distractorbox>' + '' + '</div>' +
					'<div class = rightbox>' + preFileType + 'mask' + fileTypePNG + 
					'<div class = centerbox><div class = fixation>+</div></div>' +
					'</div>' +
				'</div>'
  return cue_html
}


var getStim = function(){
	if ((shape_matching_condition == "SNN") || (shape_matching_condition == "DNN")){
		var stim_html = '<div class = upperbox><div class = "center-text" >' + curr_cue + '</div></div>' +
						'<div class = lowerbox>'+ 
							'<div class = leftbox>' + preFileType + target + '_green' + fileTypePNG + '</div>' +
							'<div class = distractorbox>' + '' + '</div>' +
							'<div class = rightbox>' + preFileType + probe + '_white' + fileTypePNG + '</div>' +
						'</div>'
	} else {
		var stim_html = '<div class = upperbox><div class = "center-text" >' + curr_cue + '</div></div>' +
						'<div class = lowerbox>'+ 
							'<div class = leftbox>' + preFileType + target + '_green' + fileTypePNG + '</div>' +
							'<div class = distractorbox>' + preFileType + distractor + '_red' + fileTypePNG + '</div>' +
							'<div class = rightbox>' + preFileType + probe + '_white' + fileTypePNG + '</div>' +
						'</div>'
	}
	return stim_html
}

var getResponse = function() {
  return correct_response
}

var getPTDC = function(shape_matching_condition,curr_task){
	var probe_i = randomDraw([1,2,3,4,5,6,7,8,9,10])
	var target_i = 0
	var distractor_i = 0
	if (shape_matching_condition[0] == 'S') {
		target_i = probe_i
		if (curr_task == 'same'){
			correct_response = possible_responses[0][1]
		} else  {
			correct_response = possible_responses[1][1]		
		}
	} else {
		target_i = randomDraw([1,2,3,4,5,6,7,8,9,10].filter(function(y) {return y != probe_i}))				
		if (curr_task == 'different'){
			correct_response = possible_responses[0][1]
		} else  {
			correct_response = possible_responses[1][1]		
		}
	
	}
	
	if (shape_matching_condition[1] == 'S') {
		distractor_i = target_i
	} else if (shape_matching_condition[2] == 'S') {
		distractor_i = probe_i
	} else if (shape_matching_condition[2] == 'D') {
		distractor_i = randomDraw([1,2,3,4,5,6,7,8,9,10].filter(function(y) {return $.inArray(y, [target_i, probe_i]) == -1}))
	} else if (shape_matching_condition[2] == 'N'){
		distractor_i = 'none'
	}
	
	return [probe_i, target_i, distractor_i, correct_response]
}

/* Append gap and current trial to data and then recalculate for next trial*/
var appendData = function() {
  var curr_trial = jsPsych.progress().current_trial_global
  var trial_id = jsPsych.data.getDataByTrialIndex(curr_trial).trial_id
  var trial_num = current_trial - 1 //current_trial has already been updated with setStims, so subtract one to record data
  var task_switch = task_switches[trial_num]
  jsPsych.data.addDataToLastTrial({
    cue: curr_cue,
    task: curr_task,
    task_switch: task_switch.task_switch,
    cue_switch: task_switch.cue_switch,
    shape_matching_condition: shape_matching_condition,
    trial_num: trial_num,
    probe: probe,
	target: target,
	distractor: distractor,
	correct_response: correct_response,
  })
  
  if ((trial_id == 'test_trial') || (trial_id == 'practice_trial')){
  	jsPsych.data.addDataToLastTrial({correct_response: correct_response})
	if (jsPsych.data.getDataByTrialIndex(curr_trial).key_press == jsPsych.data.getDataByTrialIndex(curr_trial).correct_response){
		jsPsych.data.addDataToLastTrial({shape_cued_acc: 1})
	} else {
		jsPsych.data.addDataToLastTrial({shape_cued_acc: 0})
	}
  }
}

var getCTI = function(){
	return CTI
}
/* ************************************ */
/* Define experimental variables */
/* ************************************ */
// generic task variables
var run_attention_checks = true
var attention_check_thresh = 0.45
var sumInstructTime = 0 //ms
var instructTimeThresh = 0 ///in seconds
var credit_var = 0

var fileTypePNG = '.png"></img>'
var preFileType = '<img class = center src="/static/experiments/shape_matching_with_two_by_two/images/'
var accuracy_thresh = 0.70
var missed_thresh = 0.10
var practice_thresh = 3
var lowestNumCond = 28
var CTI = 300
// task specific variables
var response_keys = jsPsych.randomization.repeat([{
  key: 77,
  key_name: 'M'
}, {
  key: 90,
  key_name: 'Z'
}], 1, true)
var choices = response_keys.key
var practice_length = 28
var test_length = 560
var numTrialsPerBlock = 112
var numTestBlocks = test_length / numTrialsPerBlock

var go_no_go_styles = ['solid','unfilled']
var possible_responses = [['M Key', 77],['Z Key', 90]]


//set up block stim. correct_responses indexed by [block][stim][type]
var tasks = {
  same: {
    task: 'same',
    cues: ['Same', 'Equal']
  },
  different: {
    task: 'different',
    cues: ['Different', 'Distinct']
  }
}
/*
color: {
    task: 'color',
    cues: ['Color', 'Orange-Blue']
  },
*/

var task_switch_types = ["stay", "switch_new"]
var cue_switch_types = ["stay", "switch"]
var shape_matching_trial_types = ['DDD','SDD','DSD','DDS','SSS','SNN','DNN']
var task_switches_arr = []
for (var t = 0; t < task_switch_types.length; t++) {
  for (var c = 0; c < cue_switch_types.length; c++) {
  	for (var s = 0; s < shape_matching_trial_types.length; s++){
  	
		task_switches_arr.push({
		  task_switch: task_switch_types[t],
		  cue_switch: cue_switch_types[c],
		  shape_matching_type: shape_matching_trial_types[s]
		})
	}
  }
}
var task_switches = jsPsych.randomization.repeat(task_switches_arr, practice_length / lowestNumCond)
var practiceStims = genStims(practice_length)
var testStims = genStims(numTrialsPerBlock)
var stims = practiceStims
var curr_task = randomDraw(getKeys(tasks))
var last_task = 'na' //object that holds the last task, set by setStims()
var curr_cue = 'na' //object that holds the current cue, set by setStims()
var cue_i = randomDraw([0, 1]) //index for one of two cues of the current task
var curr_stim = 'na' //object that holds the current stim, set by setStims()
var current_trial = 0
var exp_stage = 'practice' // defines the exp_stage, switched by start_test_block

var task_list = '<ul>'+
					'<li><i>Same</i> or <i>Equal</i>: ' + possible_responses[0][0] + ' if shapes are the same and ' + possible_responses[1][0] + ' if not.</li>'+
					'<li><i>Different</i> or <i>Distinct</i>: ' + possible_responses[0][0] + ' if shapes are different and ' + possible_responses[1][0] + ' if not.</li>'+
				'</ul>'

var prompt_task_list = '<ul>'+
					   	'<li><i>Same</i> or <i>Equal</i>: ' + possible_responses[0][0] + ' if shapes are the same and ' + possible_responses[1][0] + ' if not.</li>'+
					   	'<li><i>Different</i> or <i>Distinct</i>: ' + possible_responses[0][0] + ' if shapes are different and ' + possible_responses[1][0] + ' if not.</li>'+
					   '</ul>'



var task_boards = [['<div class = bigbox><div class = leftbox>'],['</div><div class = distractorbox>'],['</div><div class = rightbox>'],['</div></div>']]


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

//Set up post task questionnaire
var post_task_block = {
   type: 'survey-text',
   data: {
       trial_id: "post task questions"
   },
   questions: ['<p class = center-block-text style = "font-size: 20px">Please summarize what you were asked to do in this task.</p>',
              '<p class = center-block-text style = "font-size: 20px">Do you have any comments about this task?</p>'],
   rows: [15, 15],
   columns: [60,60],
   timing_response: 360000
};

/* define static blocks */
var feedback_instruct_text =
  'Welcome to the experiment. This experiment will take about 24 minutes. Press <i>enter</i> to begin.'
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
			'<p class = block-text>In this experiment you will see a cue, either <i>same</i>, <i>equal</i>, <i>different</i>, or <i>distinct</i>, followed by some shapes. '+
			'You will see a white shape on the right side of the screen and a green shape on the left side.</p> '+
		
			'<p class = block-text> Depending on which cue you see, you will be asked if the green shape matches or mismatches the white shape.</p>'+
		'</div>',
		
		'<div class = centerbox>'+
			'<p class = block-text>If you see the cue, <i>same</i> or <i>equal</i>, please judge whether the two shapes are the same. Press the <i>'+possible_responses[0][0]+
			'  </i>if they are the same, and the <i>'+possible_responses[1][0]+'  </i>if not.</p>'+
	
			'<p class = block-text>If you see the cue, <i>different</i> or <i>distinct</i>, please judge whether the two shapes are different. Press the <i>'+possible_responses[0][0]+
			'  </i>if they are different, and the <i>'+possible_responses[1][0]+'  </i>if not.</p>'+
		
			'<p class = block-text>On some trials a red shape will also be presented on the left. '+
			'You should ignore the red shape - your task is only to respond based on whether the white and green shapes matches or mismatches.</p>'+
		
			'<p class = block-text>We will start practice after you finish instructions. Please make sure you understand the instructions before moving on. During practice, you will receive a reminder of the rules.  <i>This reminder will not be available for test</i>.</p>'+
		'</div>'
	],
	allow_keys: false,
	show_clickable_nav: true,
	timing_post_trial: 1000
};

var instruction_node = {
  timeline: [feedback_instruct_block, instructions_block],
  /* This function defines stopping criteria */
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
      feedback_instruct_text =
        'Done with instructions. Press <i>enter</i> to continue.'
      return false
    }
  }
}
var end_block = {
  type: 'poldrack-text',
  data: {
    trial_id: "end",
    exp_id: 'shape_matching_with_two_by_two'
  },
  text: '<div class = centerbox><p class = center-block-text>Thanks for completing this task!</p><p class = center-block-text>Press <i>enter</i> to continue.</p></div>',
  cont_key: [13],
  timing_response: 180000,
  on_finish: function(){
		assessPerformance()
		evalAttentionChecks()
    }
};

var start_practice_block = {
  type: 'poldrack-text',
  data: {
    trial_id: "practice_intro"
  },
  text: '<div class = centerbox><p class = center-block-text>Starting with some practice. </p><p class = center-block-text>Press <i>enter</i> to continue.</p></div>',
  cont_key: [13],
  timing_response: 180000
};

var start_test_block = {
	type: 'poldrack-text',
	data: {
		trial_id: "instruction"
	},
	timing_response: 180000,
	text: '<div class = centerbox>'+
			'<p class = block-text>We will now start the test portion</p>'+
			
			'<p class = block-text>Please judge if the green shape is the same or different than the white shape, depending on the cue.</p>'+
	
			'<p class = block-text>If you see the cue, <i>same</i> or <i>equal</i>, please judge whether the two shapes are the same. Press the <i>'+possible_responses[0][0]+
			'  </i>if they are the same, and the <i>'+possible_responses[1][0]+'  </i>if not.</p>'+
	
			'<p class = block-text>If you see the cue, <i>different</i> or <i>distinct</i>, please judge whether the two shapes are different. Press the <i>'+possible_responses[0][0]+
			'  </i>if they are different, and the <i>'+possible_responses[1][0]+'  </i>if not.</p>'+
		
			'<p class = block-text>On some trials a red shape will also be presented on the left. '+
			'You should ignore the red shape - your task is only to respond based on whether the white and green shapes matches or mismatches.</p>'+
		
			'<p class = block-text>You will no longer receive the rule prompt, so remember the instructions before you continue. Press Enter to begin.</p>'+
		 '</div>',
	cont_key: [13],
	timing_post_trial: 1000,
	on_finish: function(){
		feedback_text = "We will now start the test portion. Press enter to begin."
		current_trial = 0
    	stims = testStims
    	task_switches = jsPsych.randomization.repeat(task_switches_arr, numTrialsPerBlock / lowestNumCond)
	}
};

/* define practice and test blocks */
var setStims_block = {
  type: 'call-function',
  data: {
    trial_id: "set_stims"
  },
  func: setStims,
  timing_post_trial: 0
}


var feedback_text = 'Welcome to the experiment. This experiment will take less than 30 minutes. Press <i>enter</i> to begin.'
var feedback_block = {
	type: 'poldrack-single-stim',
	data: {
		exp_id: "cued_predictive_task_switching",
		trial_id: "practice-stop-feedback"
	},
	choices: [13],
	stimulus: getFeedback,
	timing_post_trial: 0,
	is_html: true,
	timing_response: 180000,
	response_ends_trial: true, 

};


var practice_block = {
  type: 'poldrack-categorize',
  stimulus: getStim,
  is_html: true,
  key_answer: getResponse,
  correct_text: '<div class = fb_box><div class = center-text><font size = 20>Correct!</font></div></div>' + '<div class = promptbox>' + prompt_task_list + '</div>',
  incorrect_text: '<div class = fb_box><div class = center-text><font size = 20>Incorrect</font></div></div>' +'<div class = promptbox>' + prompt_task_list + '</div>',
  timeout_message: '<div class = fb_box><div class = center-text><font size = 20>Respond Faster!</font></div></div>' + '<div class = promptbox>' + prompt_task_list + '</div>',
  choices: choices,
  data: {
    trial_id: 'practice_trial',
    exp_stage: "practice"
  },
  timing_feedback_duration: 500,
  show_stim_with_feedback: false,
  timing_response: 2000,
  timing_stim: 1000,
  timing_post_trial: 0,
  prompt: '<div class = promptbox>' + prompt_task_list + '</div>',
  on_finish: appendData
}



var test_block = {
  type: 'poldrack-single-stim',
  stimulus: getStim,
  is_html: true,
  choices: choices,
  data: {
    trial_id: 'test_trial',
    exp_stage: 'test'
  },
  timing_post_trial: 0,
  timing_response: 2000,
  timing_stim: 1000,
  on_finish: function(data) {
    appendData()
    correct = false
    if (data.key_press === correct_response) {
      correct = true
    }
    jsPsych.data.addDataToLastTrial({
      'correct_response': correct_response,
      'correct': correct
    })
  }
}

var practiceTrials = []
practiceTrials.push(feedback_block)
practiceTrials.push(instructions_block)
for (var i = 0; i < practice_length; i++) {
	var practice_fixation_block = {
	  type: 'poldrack-single-stim',
	  stimulus: '<div class = upperbox><div class = fixation>+</div></div>'+
				'<div class = lowerbox>'+ 
					'<div class = leftbox>' + 
					'<div class = centerbox><div class = fixation>+</div></div>' +
					'</div>' +
					'<div class = distractorbox>' + '' + '</div>' +
					'<div class = rightbox>' + 
					'<div class = centerbox><div class = fixation>+</div></div>' +
					'</div>' +
				'</div>',
	  is_html: true,
	  choices: 'none',
	  data: {
		trial_id: "fixation"
	  },
	  timing_post_trial: 0,
	  timing_stim: 500,
	  timing_response: 500,
	  prompt: '<div class = promptbox>' + prompt_task_list + '</div>',
	  on_finish: function() {
		jsPsych.data.addDataToLastTrial({
		  exp_stage: exp_stage
		})
	  }
	}

	var practice_cue_block = {
	  type: 'poldrack-single-stim',
	  stimulus: getCue,
	  is_html: true,
	  choices: 'none',
	  data: {
		trial_id: 'cue'
	  },
	  timing_response: getCTI,
	  timing_stim: getCTI,
	  timing_post_trial: 0,
	  prompt: '<div class = promptbox>' + prompt_task_list + '</div>',
	  on_finish: function() {
		jsPsych.data.addDataToLastTrial({
		  exp_stage: exp_stage
		})
		appendData()
	  }
	};
  practiceTrials.push(setStims_block)
  practiceTrials.push(practice_fixation_block)
  practiceTrials.push(practice_cue_block);
  practiceTrials.push(practice_block);
}

var practiceCount = 0
var practiceNode = {
	timeline: practiceTrials,
	loop_function: function(data) {
		practiceCount += 1
		task_switches = jsPsych.randomization.repeat(task_switches_arr, practice_length / lowestNumCond)
		practiceStims = genStims(practice_length)
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
		feedback_text += "</p><p class = block-text><i>Average reaction time:  " + Math.round(ave_rt) + " ms. 	Accuracy: " + Math.round(accuracy * 100)+ "%</i>"

		if (accuracy > accuracy_thresh){
			feedback_text +=
					'</p><p class = block-text>Done with this practice. Press Enter to continue.' 
			testStims = genStims(numTrialsPerBlock)
			task_switches = jsPsych.randomization.repeat(task_switches_arr, numTrialsPerBlock /lowestNumCond)
			return false
	
		} else if (accuracy < accuracy_thresh){
			feedback_text +=
					'</p><p class = block-text>Your accuracy is too low.  Remember: <br>' + prompt_task_list 
			if (missed_responses > missed_thresh){
				feedback_text +=
						'</p><p class = block-text>You have not been responding to some trials.  Please respond on every trial that requires a response.'
			}
		
			if (practiceCount == practice_thresh){
				feedback_text +=
					'</p><p class = block-text>Done with this practice.' 
					testStims = genStims(numTrialsPerBlock)
					task_switches = jsPsych.randomization.repeat(task_switches_arr, numTrialsPerBlock /lowestNumCond)
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
for (var i = 0; i < numTrialsPerBlock; i++) {
	var fixation_block = {
	  type: 'poldrack-single-stim',
	  stimulus: '<div class = upperbox><div class = fixation>+</div></div><div class = lowerbox><div class = fixation>+</div></div>',
	  is_html: true,
	  choices: 'none',
	  data: {
		trial_id: "fixation"
	  },
	  timing_post_trial: 0,
	  timing_stim: 500,
	  timing_response: 500,
	  on_finish: function() {
		jsPsych.data.addDataToLastTrial({
		  exp_stage: exp_stage
		})
	  }
	}

	var cue_block = {
	  type: 'poldrack-single-stim',
	  stimulus: getCue,
	  is_html: true,
	  choices: 'none',
	  data: {
		trial_id: 'cue'
	  },
	  timing_response: getCTI,
	  timing_stim: getCTI,
	  timing_post_trial: 0,
	  on_finish: function() {
		jsPsych.data.addDataToLastTrial({
		  exp_stage: exp_stage
		})
		appendData()
	  }
	};
  testTrials.push(setStims_block)
  testTrials.push(fixation_block)
  testTrials.push(cue_block);
  testTrials.push(test_block);
}

var testCount = 0
var testNode = {
	timeline: testTrials,
	loop_function: function(data) {
		testCount += 1
		task_switches = jsPsych.randomization.repeat(task_switches_arr, numTrialsPerBlock / lowestNumCond)
		testStims = genStims(numTrialsPerBlock)
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
		feedback_text += "</p><p class = block-text><i>Average reaction time:  " + Math.round(ave_rt) + " ms. 	Accuracy: " + Math.round(accuracy * 100)+ "%</i>"
		feedback_text += "</p><p class = block-text>You have completed: "+testCount+" out of "+numTestBlocks+" blocks of trials."
		
		if (accuracy < accuracy_thresh){
			feedback_text +=
					'</p><p class = block-text>Your accuracy is too low.  Remember: <br>' + prompt_task_list 
		}
		if (missed_responses > missed_thresh){
			feedback_text +=
					'</p><p class = block-text>You have not been responding to some trials.  Please respond on every trial that requires a response.'
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
var shape_matching_with_two_by_two_experiment = [];

shape_matching_with_two_by_two_experiment.push(practiceNode);
shape_matching_with_two_by_two_experiment.push(feedback_block);

shape_matching_with_two_by_two_experiment.push(visualCheckNode);

shape_matching_with_two_by_two_experiment.push(start_test_block)
shape_matching_with_two_by_two_experiment.push(testNode);
shape_matching_with_two_by_two_experiment.push(feedback_block);

shape_matching_with_two_by_two_experiment.push(visualCheckNode);

shape_matching_with_two_by_two_experiment.push(post_task_block)
shape_matching_with_two_by_two_experiment.push(end_block)
