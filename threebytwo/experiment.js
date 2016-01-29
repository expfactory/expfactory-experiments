/* ************************************ */
/* Define helper functions */
/* ************************************ */
function getDisplayElement () {
    $('<div class = display_stage_background></div>').appendTo('body')
    return $('<div class = display_stage></div>').appendTo('body')
}

function addID() {
  jsPsych.data.addDataToLastTrial({'exp_id': 'threebytwo'})
}

var randomDraw = function(lst) {
    var index = Math.floor(Math.random()*(lst.length))
    return lst[index]
}

var getKeys = function(obj) {
    var keys = [];
    for (var key in obj) {
        keys.push(key);
    }
    return keys
}

var genStims = function(n) {
    stims = []
    for (var i = 0; i<n; i++) {
        var number = randomDraw('12346789')
        var color = randomDraw(['orange','blue'])
        var stim = {number: parseInt(number), color: color}
        stims.push(stim)
    }
    return stims
}

var getCTI = function() {
	return CTI
}
var getCue = function() {
    var cue_html = '<div class = upperbox><div class = "center-text" >' + curr_cue + '</div></div><div class = lowerbox><div class = fixation>+</div></div>'
    return cue_html
}

var getStim = function() {
    var stim_html = '<div class = upperbox><div class = "center-text" >' + curr_cue + '</div></div><div class = lowerbox><div class = "center-text" style=color:' + curr_stim.color + ';>' + curr_stim.number + '</div>'
    return stim_html
}

var getResponse = function() {
    switch (curr_task) {
        case 'color':
            if (curr_stim.color == 'orange') {
                return response_keys.key[0]
            } else {
                return response_keys.key[1]
            }
            break;
        case 'magnitude':
            if (curr_stim.number > 5) {
                return response_keys.key[0]
            } else {
                return response_keys.key[1]
            }
            break;
        case 'parity':
            if (curr_stim.number%2 === 0) {
                return response_keys.key[0]
            } else {
                return response_keys.key[1]
            }  
    }
}

var setCTI = function() {
  return randomDraw([1,100,200,400,800])
}

/* Index into task_switches using the global var trial_i. Using the task_switch and cue_switch
change the task. If "stay", keep the same task but change the cue based on "cue switch". 
If "switch new", switch to the task that wasn't the current or last task, choosing a random cue. 
If "switch old", switch to the last task and randomly choose a cue.
*/
var setStims = function() {
        var tmp;
	switch(task_switches[trial_i].task_switch) {
		case "stay":
			if (curr_task == "na") {
				tmp = curr_task
				curr_task = randomDraw(getKeys(tasks))
			}
			if (task_switches[trial_i].cue_switch == "switch") {
				cue_i = 1-cue_i
			}
			break
		case "switch_new":
			cue_i = randomDraw([0,1])
			if (last_task == "na") {
				tmp = curr_task
				curr_task = randomDraw(getKeys(tasks).filter(function(x){return (x!=curr_task)}))
				last_task = tmp
			} else {
				tmp = curr_task
				curr_task = getKeys(tasks).filter(function(x){return (x!=curr_task & x!=last_task)})[0]
				last_task = tmp
			}
			break
		case "switch_old":
			cue_i = randomDraw([0,1])
			if (last_task == "na") {
				tmp = curr_task
				curr_task = randomDraw(getKeys(tasks).filter(function(x){return (x!=curr_task)}))
				last_task = tmp
			} else {
				tmp = curr_task
				curr_task = last_task
				last_task = tmp
			}
			break
			
	}
	curr_cue = tasks[curr_task].cues[cue_i]
	curr_stim = stims[trial_i]
	trial_i = trial_i + 1
	CTI = setCTI()
}

/* Append gap and current trial to data and then recalculate for next trial*/
var appendData = function() {
  var trial_num = trial_i-1 //trial_i has already been updated with setStims, so subtract one to record data
  var task_switch = task_switches[trial_num] 
  jsPsych.data.addDataToLastTrial({cue: curr_cue, stim: curr_stim, tasK: curr_task, task_switch: task_switch.task_switch, 
    cue_switch: task_switch.cue_switch, trial_num: trial_num})
}

/* ************************************ */
/* Define experimental variables */
/* ************************************ */
var response_keys = jsPsych.randomization.repeat([{key:77,key_name:'M'},{key:90, key_name: 'Z'}], 1, true)
var practice_length = 100
var test_length = 340

//set up block stim. correct_responses indexed by [block][stim][type]
var tasks = {color: {task: 'color', cues: ['Color', 'Orange-Blue']},
        parity: {task: 'parity', cues: ['Parity', 'Odd-Even']},
        magnitude: {task: 'magnitude', cues: ['Magnitude', 'High-Low']}}

var task_switch_types = ["stay","switch_new","switch_old"]
var cue_switch_types = ["stay","switch"]
var task_switches = []
for (var t = 0; t<task_switch_types.length; t++) {
    for (var c = 0; c<cue_switch_types.length; c++) {
        task_switches.push({task_switch:task_switch_types[t],cue_switch:cue_switch_types[c]})
    }
}
var task_switches = jsPsych.randomization.repeat(task_switches,practice_length/6)
var practiceStims = genStims(practice_length)
var testStims = genStims(test_length)
var stims = practiceStims
var curr_task = randomDraw(getKeys(tasks))
var last_task = 'na'
var curr_cue = 'na'
var cue_i = randomDraw([0,1])
var curr_stim = 'na'
var trial_i = 0
var CTI = 0

var task_list = '<ul><li><strong>Color</strong> or <strong>Orange-Blue</strong>: Press the ' + response_keys.key_name[0] + ' key if orange and the ' + response_keys.key_name[1] +' key if blue.' + 
				'</li><li><strong>Parity</strong> or <strong>Odd-Even</strong>: Press the ' + response_keys.key_name[0] + ' key if even and the ' + response_keys.key_name[1] +' key if odd.' + 
				'</li><li><strong>Magnitude</strong> or <strong>High-Low</strong>: Press the ' + response_keys.key_name[0] + ' key if the number is greater than 5 and the ' + response_keys.key_name[1] +' key if less than 5.</li></ul>'

var prompt_task_list = '<ul><li><strong>Color</strong> or <strong>Orange-Blue</strong>: ' + response_keys.key_name[0] + ' if orange and ' + response_keys.key_name[1] +' if blue.' + 
				'</li><li><strong>Parity</strong> or <strong>Odd-Even</strong>: ' + response_keys.key_name[0] + ' if even and ' + response_keys.key_name[1] +' if odd.' + 
				'</li><li><strong>Magnitude</strong> or <strong>High-Low</strong>: ' + response_keys.key_name[0] + ' if >5 and ' + response_keys.key_name[1] + ' if <5.</li></ul>'

				


/* ************************************ */
/* Set up jsPsych blocks */
/* ************************************ */
/* define static blocks */
var welcome_block = {
  type: 'poldrack-text',
  timing_response: 60000,
  text: '<div class = centerbox><p class = center-block-text>Welcome to the experiment. Press <strong>enter</strong> to begin.</p></div>',
  cont_key: [13],
  timing_post_trial: 0
};

var instructions_block = {
  type: 'poldrack-instructions',
  pages: ['<div class = centerbox><p class = block-text>In this experiment you will have to respond to a sequence of colored numbers by pressing the left or right arrow keys. How you respond to the numbers will depend on the current task, which can change every trial.</p><p class = block-text>For instance, on some trials you will have to indicate whether the number is odd or even, and on other trials you will indicate whether the number is orange or blue. Each trial will start with a cue telling you which task to do on that trial.</p></div>',
		  '<div class = centerbox><p class = block-text>The cue before the number will be a word indicating the task. There will be six different cues indicating three different tasks. Thee cues and tasks are described below:</p>'+ task_list + '</div>',
		  '<div class = centerbox><p class = block-text>After you press "Next" we will start with some practice. </p></div>'],
  allow_keys: false,
  show_clickable_nav: true,
  timing_post_trial: 1000
};

var end_block = {
  type: 'poldrack-text',
  text: '<div class = centerbox><p class = center-block-text>Thanks for completing this task!</p><p class = center-block-text>Press <strong>enter</strong> to continue.</p></div>',
  cont_key: [13]
};

var start_test_block = {
	type: 'poldrack-text',
	text: '<div class = centerbox><p class = block-text>Practice completed. Starting test.</p><p class = block-text>Press <strong>enter</strong> to begin.</p></div>',
	on_finish: function() {
		trial_i = 0
		stims = testStims
		task_switches = jsPsych.randomization.repeat(task_switches,test_length/6)
	},
	timing_post_trial: 1000
}

/* define practice and test blocks */
var setStims_block = {
    type: 'call-function',
    func: setStims,
    timing_post_trial: 0
}

var fixation_block = {
  type: 'poldrack-single-stim',
  stimulus: '<div class = upperbox><div class = fixation>+</div></div><div class = lowerbox><div class = fixation>+</div></div>',
  is_html: true,
  choices: 'none',
  data: {exp_id: "threebytwo", "trial_id": "fixation"},
  timing_post_trial: 0,
  timing_stim: 500,
  timing_response: 500,
  prompt: '<div class = promptbox>' + prompt_task_list + '</div>'
}

var cue_block = {
  type: 'poldrack-single-stim',
  stimulus: getCue,
  is_html: true,
  choices: 'none',
  data: {exp_id: 'threebytwo', trial_id: 'cue'},
  timing_response: getCTI,
  timing_stim: getCTI,
  timing_post_trial: 0,
  prompt: '<div class = promptbox>' + prompt_task_list + '</div>',
  on_finish: appendData
};

var practice_block = {
  type: 'poldrack-categorize',
  stimulus: getStim,
  is_html: true,
  key_answer: getResponse,
  correct_text: '<div class = centerbox><div class = center-text><font size = 20>Correct!</font></div></div><div class = promptbox>' + prompt_task_list + '</div>',
  incorrect_text: '<div class = centerbox><div class = center-text><font size = 20>Incorrect</font></div></div><div class = promptbox>' + prompt_task_list + '</div>',
  timeout_message: '<div class = centerbox><div class = center-text><font size = 20>Too Slow</font></div></div><div class = promptbox>' + prompt_task_list + '</div>',
  choices: response_keys.key,
  data: {exp_id: 'threebytwo', trial_id: 'practice_target'},
  timing_feedback_duration: 1000,
  show_stim_with_feedback: false,
  timing_post_trial: 0,
  prompt: '<div class = promptbox>' + prompt_task_list + '</div>',
  on_finish: appendData
}

var test_block = {
  type: 'poldrack-single-stim',
  stimulus: getStim,
  is_html: true,
  key_answer: getResponse,
  choices: response_keys.key,
  data: {exp_id: 'threebytwo', trial_id: 'target'},
  timing_post_trial: 0,
  prompt: '<div class = promptbox>' + prompt_task_list + '</div>',
  on_finish: appendData
}

var gap_block = {
  type: 'poldrack-single-stim',
  stimulus: '',
  is_html: true,
  choices: 'none',
  data: {exp_id: 'threebytwo', trial_id: 'gap'},
  timing_response: 500,
  timing_stim: 0,
  timing_post_trial: 0,
  prompt: '<div class = promptbox>' + prompt_task_list + '</div>'
};


/* create experiment definition array */
var threebytwo_experiment = [];
threebytwo_experiment.push(welcome_block);
threebytwo_experiment.push(instructions_block);
for (var i = 0; i<practiceStims.length; i++) {
    threebytwo_experiment.push(setStims_block)
    threebytwo_experiment.push(fixation_block)
    threebytwo_experiment.push(cue_block);
    threebytwo_experiment.push(practice_block);
    threebytwo_experiment.push(gap_block);
}
threebytwo_experiment.push(start_test_block)
for (var i = 0; i<stims.length; i++) {
    threebytwo_experiment.push(setStims_block)
    threebytwo_experiment.push(fixation_block)
    threebytwo_experiment.push(cue_block);
    threebytwo_experiment.push(test_block);
    threebytwo_experiment.push(gap_block);
}

threebytwo_experiment.push(end_block)
