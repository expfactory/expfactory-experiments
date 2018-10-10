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

var getInstructFeedback = function() {
  return '<div class = centerbox><p class = center-block-text>' + feedback_instruct_text +
    '</p></div>'
}

var randomDraw = function(lst) {
  var index = Math.floor(Math.random() * (lst.length))
  return lst[index]
}

var createGrid = function(){
	numStims = 9
	numCorrect = 4
	numIncorrect = 5
	categories = ['tree','feet','pole','phone','water','chair']
	current_category = jsPsych.randomization.repeat(categories,1).pop()
	num_array = jsPsych.randomization.repeat([1,2,3,4,5,6,7,8,9],1)
	correct_nums = num_array.slice(0,4)
	incorrect_nums = num_array.slice(4,9)
	
	var stims = []
	for (var i = 0; i < numCorrect; i++){
		correct_num = correct_nums.pop()
		stim = {
			stim_num: correct_num,
			correct: true,
			category: current_category
		}
		stims.push(stim)
		
	}
	
	for (var i = 0; i < numIncorrect; i++){
		incorrect_num = incorrect_nums.pop()
		category = randomDraw(categories.filter(function(y) {return $.inArray(y, [current_category]) == -1}))
		stim = {
			stim_num: incorrect_num,
			correct: false,
			category: category
		}
		stims.push(stim)
		
	}
	
	stims = jsPsych.randomization.repeat(stims,1)
	return stims
	
}

var getGridStim = function(grid_stims){
	
	return 	response_grid[0] + grid_stims[0].category + '_' + grid_stims[0].stim_num +
			response_grid[1] + grid_stims[1].category + '_' + grid_stims[1].stim_num +
			response_grid[2] + grid_stims[2].category + '_' + grid_stims[2].stim_num +
			response_grid[3] + grid_stims[3].category + '_' + grid_stims[3].stim_num +
			response_grid[4] + grid_stims[4].category + '_' + grid_stims[4].stim_num +
			response_grid[5] + grid_stims[5].category + '_' + grid_stims[5].stim_num +
			response_grid[6] + grid_stims[6].category + '_' + grid_stims[6].stim_num +
			response_grid[7] + grid_stims[7].category + '_' + grid_stims[7].stim_num +
			response_grid[8] + grid_stims[8].category + '_' + grid_stims[8].stim_num +
			response_grid[9],

}

Array.prototype.contains = function(v) {
    for(var i = 0; i < this.length; i++) {
        if(this[i] === v) return true;
    }
    return false;
};

Array.prototype.unique = function() {
    var arr = [];
    for(var i = 0; i < this.length; i++) {
        if(!arr.includes(this[i])) {
            arr.push(this[i]);
        }
    }
    return arr; 
}

var recordClick = function(current_submit) {
  responses.push(current_submit.id)
}

var clearResponses = function(){
	responses = []
}

var submitResponse = function(){
	hitKey(
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

var appendGridData = function(){
	var correct = 0
	var unique_responses = responses.unique()
	
	for (var i = 0; i < unique_responses.length; i++){
		index = unique_responses[1][unique_responses[1].length - 1]
		if (grid_stims[index].correct == true){
			correct += 1
		}
		
	
	}
	
	return correct

}

var responses = []

/* ************************************ */
/* Define experimental variables */
/* ************************************ */
// generic task variables
var run_attention_checks = false
var attention_check_thresh = 0.65
var sumInstructTime = 0 //ms
var instructTimeThresh = 0 ///in seconds

// task specific variables
var num_digits = 3
var num_trials = 14
var curr_seq = []
var stim_time = 800
var gap_time = 200
var time_array = []
var total_time = 0
var errors = 0
var error_lim = 3
var response = []
setStims()
var stim_array = getStims()

var fileType = ".png'></img>"
var preFileType = "<img class = center src='/static/experiments/digit_span_copy/images/"


var response_grid =
  [['<div class = numbox>' +      '<button id = button_1 class = "square num-button" onclick = "recordClick(this)"><div class = content>' + preFileType],
  [fileType + '</div></button>' + '<button id = button_2 class = "square num-button" onclick = "recordClick(this)"><div class = content>' + preFileType],
  [fileType + '</div></button>' + '<button id = button_3 class = "square num-button" onclick = "recordClick(this)"><div class = content>' + preFileType],
  [fileType + '</div></button>' + '<button id = button_4 class = "square num-button" onclick = "recordClick(this)"><div class = content>' + preFileType],
  [fileType + '</div></button>' + '<button id = button_5 class = "square num-button" onclick = "recordClick(this)"><div class = content>' + preFileType],
  [fileType + '</div></button>' + '<button id = button_6 class = "square num-button" onclick = "recordClick(this)"><div class = content>' + preFileType],
  [fileType + '</div></button>' + '<button id = button_7 class = "square num-button" onclick = "recordClick(this)"><div class = content>' + preFileType],
  [fileType + '</div></button>' + '<button id = button_8 class = "square num-button" onclick = "recordClick(this)"><div class = content>' + preFileType],
  [fileType + '</div></button>' + '<button id = button_9 class = "square num-button" onclick = "recordClick(this)"><div class = content>' + preFileType],
  [fileType + '</div></button>' + '<button class = clear_button id = "ClearButton" onclick = "clearResponses()">Clear</button>' + '<button class = submit_button id = "SubmitButton" onclick = "submitResponse()">Submit Answer</button></div>']]





/* ************************************ */
/* Set up jsPsych blocks */
/* ************************************ */

var test_img_block = {
	type: 'poldrack-single-stim',
	stimulus:   response_grid[0] + 'C' +
				response_grid[1] + 'A' +
				response_grid[2] + 'T' +
				response_grid[3] + 'S' +
				response_grid[4] + 'C' +
				response_grid[5] + 'A' +
				response_grid[6] + 'N' +
				response_grid[7] + 'S' +
				response_grid[8] + 'S' +
				response_grid[9],
	is_html: true,
	choices: 'none',
	data: {
		trial_id: "fixation",
	},
	timing_post_trial: 0,
	timing_stim: -1,
	timing_response: -1
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

var grid_block = {
	type: 'poldrack-single-stim',
	stimulus: getGridStim,
	is_html: true,
	choices: 'none',
	data: {
		trial_id: "visual_check",
	},
	timing_post_trial: 0,
	timing_stim: 180000,
	timing_response: 180000,
	response_ends_trial: true,
	on_start: createGrid,
	on_finish: appendGridData,
};

var visualCheckTrials = []
visualCheckTrials.push(set_stims_block)
visualCheckTrials.push(grid_block)


var visualCheckNode = {
	timeline: visualCheckTrials,
	loop_function: function(data) {
	
	
	}
}

/* create experiment definition array */
var digit_span_copy_experiment = [];
digit_span_copy_experiment.push(test_img_block);
