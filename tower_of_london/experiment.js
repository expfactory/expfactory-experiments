
/* ************************************ */
/* Define helper functions */
/* ************************************ */
function getDisplayElement () {
    $('<div class = display_stage_background></div>').appendTo('body')
    return $('<div class = display_stage></div>').appendTo('body')
}

function addID() {
  jsPsych.data.addDataToLastTrial({'exp_id': 'tower_of_london'})
}

var getStim = function() {
  var ref_board = makeBoard('your_board', curr_placement)
  var target_board = makeBoard('peg_board', problems[problem_i])
  var canvas = '<div class = tol_canvas><div class="tol_vertical_line"></div></div>'
  var hold_box;
  if (held_ball !== 0 ) {
    ball = colors[held_ball-1]
    hold_box = '<div class = tol_hand_box><div class = "tol_hand_ball tol_' + ball + '"><div class = tol_ball_label>' + ball[0] + '</div></div></div><div class = tol_hand_label><strong>Ball in Hand</strong></div>'
  } else {
    hold_box = '<div class = tol_hand_box></div><div class = tol_hand_label><strong>Ball in Hand</strong></div>'
  }
  return canvas + ref_board + target_board + hold_box
}

var getPractice = function() {
  var ref_board = makeBoard('your_board', curr_placement)
  var target_board = makeBoard('peg_board', example_problem3)
  var canvas = '<div class = tol_canvas><div class="tol_vertical_line"></div></div>'
  var hold_box;
  if (held_ball !== 0 ) {
    ball = colors[held_ball-1]
    hold_box = '<div class = tol_hand_box><div class = "tol_hand_ball tol_' + ball + '"><div class = tol_ball_label>' + ball[0] + '</div></div></div><div class = tol_hand_label><strong>Ball in Hand</strong></div>'
  } else {
    hold_box = '<div class = tol_hand_box></div><div class = tol_hand_label><strong>Ball in Hand</strong></div>'
  }
  return canvas + ref_board + target_board + hold_box
}

var getFB = function() {
  var data = jsPsych.data.getLastTrialData()
  var target = data.target
  var isequal = true
  for (var i = 0; i < target.length; i++) {
      isequal = arraysEqual(target[i], data.current_position[i])
      if (isequal === false) { 
        break;
      }
    }
  var feedback;
  if (isequal === true) {
    feedback = "You got it!"
  } else {
    feedback = "Didn't get that one."
  }
  var ref_board = makeBoard('your_board', curr_placement)
  var target_board = makeBoard('peg_board', target)
  var canvas = '<div class = tol_canvas><div class="tol_vertical_line"></div></div>'
  var feedback_box = '<div class = tol_feedbackbox><p class = center-text>' + feedback + '</p></div>'
  return canvas + ref_board + target_board + feedback_box
}


var getTime = function() {
  return time_per_trial - time_elapsed
}

var getText = function() {
  return '<div class = centerbox><p class = block-text>About to start problem ' + (problem_i + 2) + '. Press <strong>enter</strong> to begin.</p></div>'
}

var pegClick = function(peg_id) {
  choice = Number(peg_id.slice(-1))-1
  console.log(choice)
  peg = curr_placement[choice]
  if (held_ball === 0) {
    for (var i = peg.length-1; i>=0; i--) {
      if (peg[i] !== 0) {
        held_ball = peg[i]
        peg[i] = 0
        num_moves += 1
        break;
      }
    }
  } else {
    var open_spot = peg.indexOf(0)
    if (open_spot != -1) {
      peg[open_spot] = held_ball
      held_ball = 0
    } 
  }
}

var makeBoard = function(container, ball_placement) {
  var board = '<div class = tol_' + container + '><div class = tol_base></div>'
  if (container == 'your_board') {
    board += '<div class = tol_board_label><strong>Your Board</strong></div>'
  } else {
    board += '<div class = tol_board_label><strong>Target Board</strong></div>'
  }
  for (var p = 0; p<3; p++) {
    board += '<div id = tol_peg_' + (p+1) + '><div class = tol_peg></div></div>' //place peg
    //place balls
    board += '<div class = special id = tol_peg_' + (p+1) + ' onclick = "pegClick(this.id)">' 
    var peg = ball_placement[p]
    for (var b = 0; b < peg.length; b++) {
      if (peg[b] !== 0) {
        ball = colors[peg[b]-1]
        board += '<div class = "tol_ball tol_' + ball + '"><div class = tol_ball_label>' + ball[0] + '</div></div>'
      }
    }
    board += '</div>'
  }
  board += '</div>'
  return board
}

var arraysEqual = function(arr1, arr2) {
    if(arr1.length !== arr2.length)
        return false;
    for(var i = arr1.length; i--;) {
        if(arr1[i] !== arr2[i])
            return false;
    }
    return true;
}

var getInstructFeedback = function() {
	return '<div class = centerbox><p class = center-block-text>' + feedback_instruct_text + '</p></div>'
}

/* ************************************ */
/* Define experimental variables */
/* ************************************ */
// generic task variables
var sumInstructTime = 0    //ms
var instructTimeThresh = 7   ///in seconds

// task specific variables
var colors = ['Green', 'Red', 'Blue']
var choices = [49, 50, 51]
var problem_i = 0
var time_per_trial = 20000 //time per trial in seconds
var time_elapsed = 0//tracks time for a problem
var num_moves = 0 //tracks number of moves for a problem
/*keeps track of peg board (where balls are). Lowest ball is the first value for each peg.
So the initial_placement has the 1st ball and 2nd ball on the first peg and the third ball on the 2nd peg.
*/
// make Your board
var curr_placement = [[1,2,0],[3,0],[0]] 
var example_problem1 = [[1,2,0],[0,0],[3]]
var example_problem2 = [[1,0,0],[3,0],[2]]
var example_problem3 = [[1,0,0],[3,2],[0]]
var ref_board = makeBoard('your_board', curr_placement)
var problems = [
                [[0,0,0],[3,1],[2]],
                [[1,0,0],[2,0],[3]],
                [[1,3,0],[2,0],[0]],
                [[1,0,0],[2,3],[0]],
                [[2,1,0],[3,0],[0]],
                [[3,0,0],[2,1],[0]],
                [[2,3,0],[0,0],[1]],
                [[0,0,0],[2,3],[1]],
                [[2,1,3],[0,0],[0]],
                [[2,3,1],[0,0],[0]],
                [[3,1,0],[2,0],[0]],
                [[3,0,0],[2,0],[1]]
            ]
var answers = [2,2,3,3,4,4,4,4,5,5,5,5]
var held_ball = 0

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

var end_block = {
  type: 'poldrack-text',
  timing_response: 60000,
  text: '<div class = centerbox><p class = center-block-text>Thanks for completing this task!</p><p class = center-block-text>Press <strong>enter</strong> to continue.</p></div>',
  cont_key: [13],
  timing_post_trial: 0
};

var feedback_instruct_text = 'Starting with instructions.  Press <strong> Enter </strong> to continue.'
var feedback_instruct_block = {
  type: 'poldrack-text',
  cont_key: [13],
  text: getInstructFeedback,
  timing_post_trial: 0,
  timing_response: 60000
};
/// This ensures that the subject does not read through the instructions too quickly.  If they do it too quickly, then we will go over the loop again.
var instruction_trials = []
var instructions_block = {
  type: 'poldrack-instructions',
  pages: ['<div class = tol_topbox><p class = block-text>During this task, two boards will be presented at a time. The boards will be of colored balls arranged on pegs like this:</p></div>' + ref_board + makeBoard('peg_board', example_problem1) + '<div class = tol_bottombox><p class = block-text>Imagine that these balls have holes through them and the pegs are going through the holes. Notice that the first peg can hold three balls, the second peg can hold two balls, and the third peg can hold one ball.</p></div>',
  '<div class = tol_topbox><p class = block-text>Your task will be to figure out how many moves would have to be made to make the arrangements of balls in your board look like the arrangements of balls in the target board.</p></div>' + ref_board + makeBoard('peg_board', example_problem1) + '<div class = tol_bottombox><p class = block-text>The balls in the target board are fixed in place, but the balls in your board are movable. You have to move them to make your board look like the target board. It is considered one move when you take a ball from one peg and place it on another. You can only move one ball at a time. Sometime you will have to move a ball to a different peg in order to get to the ball below it. During this task it is important that you remember, you want the <strong>fewest possible moves</strong> that are required to make your board look like the target board. You will have 20 seconds to make your decision.</p></div>',
  '<div class = tol_topbox><p class = block-text>Here is an example. Notice that the balls in your board are in a different arrangement than in the target board. If we move the red ball from the first peg in your board to the third peg then it would look like the target board.</p></div>' + ref_board + makeBoard('peg_board', example_problem2) + '<div class = tol_bottombox><p class = block-text>We would only move one ball one time, so the answer is one move.</p></div>', "<div class = centerbox><p class = block-text>During the test you will move the balls on your board by clicking on the pegs. When you click on a peg, the top ball will move into a box called 'your hand'. When you click on another peg, the ball in 'your hand' will move to the top of that peg.</p><p class = block-text>If you try to select a peg with no balls or try to place a ball on a full peg, nothing will happen. If you successfully make your board look like the target board, the trial will end and you will move to the next problem.</p><p class = block-text>We will start with an easy example so that you can learn the controls.</p></div>"],
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


var start_test_block = {
  type: 'poldrack-text',
  timing_response: 60000,
  text: '<div class = centerbox><p class = block-text>We will now start Problem 1. There will be ' + problems.length + ' problems to complete. Press <strong>enter</strong> to begin.</p></div>',
  cont_key: [13],
  timing_post_trial: 1000,
  on_finish: function() {
    held_ball = 0
    time_elapsed = 0
    num_moves = 0;
    curr_placement = [[1,2,0],[3,0],[0]] 
  }
};

var advance_problem_block = {
  type: 'poldrack-text',
  timing_response: 60000,
  text: getText,
  cont_key: [13],
  on_finish: function() {
    held_ball = 0
    time_elapsed = 0
    problem_i += 1;
    num_moves = 0;
    curr_placement = [[1,2,0],[3,0],[0]] 
  }
}

var practice_block = {
  type: 'single-stim-button',
  stimulus: getPractice,
  button_class: 'special',
  is_html: true,
  data: {trial_id: "practice"},
  timing_stim: getTime,
  timing_response: getTime,
  timing_post_trial: 0,
  on_finish: function(data) {
    if (data.mouse_click != -1) {
      time_elapsed += data.rt
    } else {
        time_elapsed += getTime()
    }
    jsPsych.data.addDataToLastTrial({'current_position': curr_placement, 'num_moves_made': num_moves, 'target': example_problem3, 'min_moves': 1})
  }
}

var test_block = {
  type: 'single-stim-button',
  stimulus: getStim,
  button_class: 'special',
  is_html: true,
  data: {trial_id: "test"},
  timing_stim: getTime,
  timing_response: getTime,
  timing_post_trial: 0,
  on_finish: function(data) {
    if (data.mouse_click != -1) {
      time_elapsed += data.rt
    } else {
        time_elapsed += getTime()
    }
    jsPsych.data.addDataToLastTrial({'current_position': curr_placement, 'num_moves_made': num_moves, 'target': problems[problem_i], 'min_moves': answers[problem_i]})
  }
}

var feedback_block = {
  type: 'poldrack-single-stim',
  stimulus: getFB,
  choices: 'none',
  is_html: true,
  data: {trial_id: 'feedback'},
  timing_stim: 2000,
  timing_response: 2000,
  timing_post_trial: 500
}

var practice_node = {
  timeline: [practice_block],
  loop_function: function(data) {
    if (time_elapsed >= time_per_trial) {
      return false
    }
    data = data[0]
    var target = data.target
    var isequal = true
    for (var i = 0; i < target.length; i++) {
      isequal = arraysEqual(target[i], data.current_position[i])
      if (isequal === false) { 
        break;
      }
    }
    return !isequal
  },
  timing_post_trial: 1000
}

var problem_node = {
  timeline: [test_block],
  loop_function: function(data) {
    if (time_elapsed >= time_per_trial) {
      return false
    }
    data = data[0]
    var target = data.target
    var isequal = true
    for (var i = 0; i < target.length; i++) {
      isequal = arraysEqual(target[i], data.current_position[i])
      if (isequal === false) { 
        break;
      }
    }
    return !isequal
  },
  timing_post_trial: 1000
}

/* create experiment definition array */
var tower_of_london_experiment = [];
tower_of_london_experiment.push(welcome_block);
tower_of_london_experiment.push(instruction_node);
tower_of_london_experiment.push(practice_node);
tower_of_london_experiment.push(feedback_block)
tower_of_london_experiment.push(start_test_block);
for (var i = 0; i < problems.length; i++) {
  tower_of_london_experiment.push(problem_node);
  tower_of_london_experiment.push(feedback_block)
  tower_of_london_experiment.push(advance_problem_block)
}
tower_of_london_experiment.push(end_block);
