/* ************************************ */
/* Define helper functions */
/* ************************************ */
var randomDraw = function(lst) {
  var index = Math.floor(Math.random() * (lst.length))
  return lst[index]
}

var createGrid = function(){
	which_set = jsPsych.randomization.repeat([0,1,2],1).pop()
	numStims = 9
	numCorrect = 4
	numIncorrect = 5
	categories = [['tree','feet','pole','phone','water','chair'],
				  ['flower','food','electronics','people','fire'],
				  ['pillow','monitor','window','frame','table']]
	current_categories = categories[which_set]
	current_category = jsPsych.randomization.repeat(current_categories,1).pop()
	num_array = jsPsych.randomization.repeat([1,2,3,4,5,6,7,8,9],1)
	correct_nums = num_array.slice(0,numCorrect)
	incorrect_nums = num_array.slice(numCorrect,numStims)
	
	var grid_stims = []
	for (var i = 0; i < numCorrect; i++){
		correct_num = correct_nums.pop()
		stim = {
			stim_num: correct_num,
			correct: true,
			category: current_category,
			current_category: current_category,
			which_set: which_set
		}
		grid_stims.push(stim)
		
	}
	
	for (var i = 0; i < numIncorrect; i++){
		incorrect_num = incorrect_nums.pop()
		category = randomDraw(categories[which_set].filter(function(y) {return $.inArray(y, [current_category]) == -1}))
		stim = {
			stim_num: incorrect_num,
			correct: false,
			category: category,
			current_category: current_category,
			which_set: which_set
		}
		grid_stims.push(stim)
		
	}
	
	grid_stims = jsPsych.randomization.repeat(grid_stims,1)	
	return grid_stims
}

var setStims = function(){
	grid_stims = createGrid()
}
var getGridStim = function(){
	grid_stims = createGrid()
	
	return 	response_grid[0] + grid_stims[0].which_set + '/' + grid_stims[0].category + '_' + grid_stims[0].stim_num +
			response_grid[1] + grid_stims[1].which_set + '/' + grid_stims[1].category + '_' + grid_stims[1].stim_num +
			response_grid[2] + grid_stims[2].which_set + '/' + grid_stims[2].category + '_' + grid_stims[2].stim_num +
			response_grid[3] + grid_stims[3].which_set + '/' + grid_stims[3].category + '_' + grid_stims[3].stim_num +
			response_grid[4] + grid_stims[4].which_set + '/' + grid_stims[4].category + '_' + grid_stims[4].stim_num +
			response_grid[5] + grid_stims[5].which_set + '/' + grid_stims[5].category + '_' + grid_stims[5].stim_num +
			response_grid[6] + grid_stims[6].which_set + '/' + grid_stims[6].category + '_' + grid_stims[6].stim_num +
			response_grid[7] + grid_stims[7].which_set + '/' + grid_stims[7].category + '_' + grid_stims[7].stim_num +
			response_grid[8] + grid_stims[8].which_set + '/' + grid_stims[8].category + '_' + grid_stims[8].stim_num +
			response_grid[9] +
			'<div class = textbox><p class = center-text style = "font-size:16px;">Please click on all pictures that contains (a) '+grid_stims[0].current_category+'</p></div>'

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
	hitKey(object_responses[0][0])
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
		index = parseInt(unique_responses[i][unique_responses[i].length - 1])
		if (grid_stims[index].correct == true){
			correct += 1
		}
	}
	
	if (correct == numCorrect){
		pass_check = true
	} else {
		pass_check = false
	}
	
	jsPsych.data.addDataToLastTrial({
		stim_0: grid_stims[0].category + '_' + grid_stims[0].stim_num,
		stim_1: grid_stims[1].category + '_' + grid_stims[1].stim_num,
		stim_2: grid_stims[2].category + '_' + grid_stims[2].stim_num,
		stim_3: grid_stims[3].category + '_' + grid_stims[3].stim_num,
		stim_4: grid_stims[4].category + '_' + grid_stims[4].stim_num,
		stim_5: grid_stims[5].category + '_' + grid_stims[5].stim_num,
		stim_6: grid_stims[6].category + '_' + grid_stims[6].stim_num,
		stim_7: grid_stims[7].category + '_' + grid_stims[7].stim_num,
		stim_8: grid_stims[8].category + '_' + grid_stims[8].stim_num,
		category: grid_stims[0].current_category,
		pass_check: pass_check,
		which_clicked: responses,
		which_set: grid_stims[0].which_set
	})
	
	responses = []
}

/* ************************************ */
/* Define experimental variables */
/* ************************************ */
// generic task variables
var sumInstructTime = 0 //ms
var instructTimeThresh = 0 ///in seconds

// task specific variables
var responses = []

var fileTypeObject = ".jpg'></img>"
var prefileTypeObjectObject = "<img class = center src='/static/experiments/stop_signal_with_two_by_two/object_recognition_images/"

var grid_stims = []
var response_grid =
  [['<div class = numbox>' +      '<button id = button_0 class = "square num-button" onclick = "recordClick(this)"><div class = content>' + prefileTypeObjectObject],
  [fileTypeObject + '</div></button>' + '<button id = button_1 class = "square num-button" onclick = "recordClick(this)"><div class = content>' + prefileTypeObjectObject],
  [fileTypeObject + '</div></button>' + '<button id = button_2 class = "square num-button" onclick = "recordClick(this)"><div class = content>' + prefileTypeObjectObject],
  [fileTypeObject + '</div></button>' + '<button id = button_3 class = "square num-button" onclick = "recordClick(this)"><div class = content>' + prefileTypeObjectObject],
  [fileTypeObject + '</div></button>' + '<button id = button_4 class = "square num-button" onclick = "recordClick(this)"><div class = content>' + prefileTypeObjectObject],
  [fileTypeObject + '</div></button>' + '<button id = button_5 class = "square num-button" onclick = "recordClick(this)"><div class = content>' + prefileTypeObjectObject],
  [fileTypeObject + '</div></button>' + '<button id = button_6 class = "square num-button" onclick = "recordClick(this)"><div class = content>' + prefileTypeObjectObject],
  [fileTypeObject + '</div></button>' + '<button id = button_7 class = "square num-button" onclick = "recordClick(this)"><div class = content>' + prefileTypeObjectObject],
  [fileTypeObject + '</div></button>' + '<button id = button_8 class = "square num-button" onclick = "recordClick(this)"><div class = content>' + prefileTypeObjectObject],
  [fileTypeObject + '</div></button>' + '<button class = clear_button id = "ClearButton" onclick = "clearResponses()">Clear all responses</button>' + '<button class = submit_button id = "SubmitButton" onclick = "submitResponse()">Submit Answer</button></div>']]



var object_responses = [[13,'Enter']]

/* ************************************ */
/* Set up jsPsych blocks */
/* ************************************ */
/* define practice and test blocks */
var set_stims_block = {
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
	choices: [object_responses[0][0]],
	data: {
		trial_id: "object_recognition_network",
	},
	timing_post_trial: 0,
	timing_stim: 180000,
	timing_response: 180000,
	response_ends_trial: true,
	on_finish: appendGridData,
};


var visualCheckTrials = []
visualCheckTrials.push(set_stims_block)
visualCheckTrials.push(grid_block)

var numVisualChecks = 0
var maxVisualChecks = 2
var visualCheckNode = {
	timeline: visualCheckTrials,
	loop_function: function(data) {
		numVisualChecks += 1
		if (numVisualChecks == maxVisualChecks){
			return false
		} else {
			return true
		}
	
	}
}
