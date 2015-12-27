
/* ************************************ */
/* Define helper functions */
/* ************************************ */
var getStim = function() {
  var ref_board = makeBoard('your_board', curr_placement)
  var target_board = makeBoard('peg_board', problems[problem_i])
  var canvas = '<div class = tol_canvas></div>'
  if (held_ball != 0 ) {
    ball = colors[held_ball-1]
    var hold_box = '<div class = tol_hand_box><div class = "tol_hand_ball tol_' + ball + '"><div class = tol_ball_label>' + ball[0] + '</div></div></div><div class = tol_hand_label><strong>Ball in Hand</strong></div>'
  } else {
    var hold_box = '<div class = tol_hand_box></div><div class = tol_hand_label><strong>Ball in Hand</strong></div>'
  }
  return canvas + ref_board + target_board + hold_box
}

var getTime = function() {
  return time_per_trial - time_elapsed
}

var getText = function() {
  return '<div class = centerbox><p class = block-text>About to start problem ' + (problem_i + 2) + '. Press <strong>enter</strong> to begin.</p></div>'
}

var makeBoard = function(container, ball_placement) {
  var board = '<div class = tol_' + container + '><div class = tol_base></div>'
  if (container == 'your_board') {
    board += '<div class = tol_board_label><strong>Your Board</strong></div>'
  } else {
    board += '<div class = tol_board_label><strong>Target Board</strong></div>'
  }
  for (var p = 0; p<3; p++) {
    board += '<div class = tol_peg_' + (p+1) + '><div class = tol_peg></div></div>' //place peg
    //place balls
    board += '<div class = tol_peg_' + (p+1) + '>' 
    var peg = ball_placement[p]
    for (var b = 0; b < peg.length; b++) {
      if (peg[b] != 0) {
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

/* ************************************ */
/* Define experimental variables */
/* ************************************ */
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
  type: 'text',
  text: '<div class = centerbox><p class = block-text>Welcome to the Tower of London experiment. Press <strong>enter</strong> to begin.</p></div>',
  cont_key: 13,
  timing_post_trial: 0
};

var end_block = {
  type: 'text',
  text: '<div class = centerbox><p class = center-block-text>Thanks for completing this task!</p><p class = center-block-text>Press <strong>enter</strong> to continue.</p></div>',
  cont_key: 13,
  timing_post_trial: 0
};

var instructions_block = {
  type: 'instructions',
  pages: ['<div class = tol_topbox><p class = block-text>During this task, two pictures will be presented at a time. The pictures will be of colored balls arranged on pegs like this:</p></div>' + ref_board + makeBoard('peg_board', example_problem1) + '<div class = tol_bottombox><p class = block-text>Imagine that these balls have holes through them and the pegs are going through the holes. Notice that the first peg can hold three balls, the second peg can hold two balls, and the third peg can hold one ball.</p></div>',
  '<div class = tol_topbox><p class = block-text>Your task will be to figure out how many moves would have to be made to make the arrangements of balls in the Your picture look like the arrangements of balls in the target picture.</p></div>' + ref_board + makeBoard('peg_board', example_problem1) + '<div class = tol_bottombox><p class = block-text>Imagine that the balls in the target picture are fixed in place, but the balls in the Your picture are movable. You have to move them to make the Your picture look like the target picture. It is considered one move when you take a ball from one peg and place it on another. You can only move one ball at a time. Sometime you will have to move a ball to a different peg in order to get to the ball below it. During this task it is important that you remember, you are imagining the <strong>fewest possible moves</strong> that are required to make the Your picture look like the target picture. You will have 20 seconds to make your decision.</p></div>',
  '<div class = tol_topbox><p class = block-text>Here is an example. Notice that the balls in the Your picture are in a different arrangement than in the target picture. If we move the red ball from the first peg in the Your picture to the third peg then it would look like the target picture.</p></div>' + ref_board + makeBoard('peg_board', example_problem2) + '<div class = tol_bottombox><p class = block-text>We would only move one ball one time, so the answer is one move.</p></div>', "<div class = centerbox><p class = block-text>During the test you will move the balls on the Your board using the 1, 2, and 3 number keys which correspond to the pegs from left to right (the 1 key corresponds to the left peg). When you press a peg's key, the top ball on that peg will move to 'your hand'. When you press another number key the ball in your hand will then be placed on that peg.</p><p class = block-text>If you try to select a peg with no balls or try to place a ball on a full peg, nothing will happen. If you successfully make the Your board look like the target board, the trial will end and you will move to the next problem.</p></div>"],
  allow_keys: false,
  show_clickable_nav: true,
  timing_post_trial: 1000
};


var start_test_block = {
  type: 'text',
  text: '<div class = centerbox><p class = block-text>We will now start Problem 1. There will be ' + problems.length + ' problems to complete. Press <strong>enter</strong> to begin.</p></div>',
  cont_key: 13,
  timing_post_trial: 1000
};

var advance_problem_block = {
  type: 'text',
  text: getText,
  cont_key: 13,
  on_finish: function() {
    held_ball = 0
    time_elapsed = 0
    problem_i += 1;
    num_moves = 0;
    curr_placement = [[1,2,0],[3,0],[0]] 
  }
}
/* define test block */
var test_block = {
  type: 'single-stim',
  stimuli: getStim,
  choices: choices,
  is_html: true,
  data: {exp_id: "tol", trial_id: "test"},
  timing_stim: getTime,
  timing_response: getTime,
  timing_post_trial: 0,
  on_finish: function(data) {
    if (data.key_press != -1) {
      var choice = choices.indexOf(data.key_press)
      var peg = curr_placement[choice]
      time_elapsed += data.rt
      if (held_ball == 0) {
        for (var i = peg.length-1; i>=0; i--) {
          if (peg[i] != 0) {
            held_ball = peg[i]
            curr_placement[choice][i] = 0
            num_moves += 1
            break;
          }
        }
      } else {
        var open_spot = curr_placement[choice].indexOf(0)
        if (open_spot != -1) {
          curr_placement[choice][open_spot] = held_ball
          held_ball = 0
        } 
      }
    } else {
        time_elapsed += getTime()
    }
    jsPsych.data.addDataToLastTrial({'current_position': curr_placement, 'num_moves_made': num_moves, 'target': problems[problem_i], 'min_moves': answers[problem_i]})
  }
};

var problem_chunk = {
  chunk_type: 'while',
  timeline: [test_block],
  continue_function: function(data) {
    if (time_elapsed >= time_per_trial) {
      return false
    }
    var data = data[0]
    var target = data.target
    var isequal = true
    for (var i = 0; i < target.length; i++) {
      isequal = arraysEqual(target[i], data.current_position[i])
      if (isequal == false) { 
        break;
      }
    }
    return !isequal
  },
  timing_post_trial: 1000
}

/* create experiment definition array */
var tol_experiment = [];
tol_experiment.push(welcome_block);
tol_experiment.push(instructions_block);
tol_experiment.push(start_test_block);
for (var i = 0; i < problems.length; i++) {
  tol_experiment.push(problem_chunk);
  tol_experiment.push(advance_problem_block)
}
tol_experiment.push(end_block);
