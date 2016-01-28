
/* ************************************ */
/* Define helper functions */
/* ************************************ */
function getDisplayElement () {
    $('<div class = display_stage_background></div>').appendTo('body')
    return $('<div class = display_stage></div>').appendTo('body')
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
    check_percent = checks_passed/attention_check_trials.length
  } 
  return check_percent
}

var getStim = function() {
  var response_area = '<div class = tol_response_div>' +
                  '<button class = tol_response_button id = 1>1</button>' +
                  '<button class = tol_response_button id = 2>2</button>' +
                  '<button class = tol_response_button id = 3>3</button>' +
                  '<button class = tol_response_button id = 4>4</button>' +
                  '<button class = tol_response_button id = 5>5</button>' +
                  '<button class = tol_response_button id = 6>6</button>' +
                  '<button class = tol_response_button id = 7>7</button>' +
                  '<button class = tol_response_button id = 8>8</button>' +
                  '<button class = tol_response_button id = 9>9</button>' +
                  '<button class = tol_response_button id = ">10">>10</button></div>'
  return ref_board + makeBoard('peg_board', problems[problem_i]) + response_area
}

var makeBoard = function(container, ball_placement) {
  var board = '<div class = tol_' + container + '><div class = tol_base></div>'
  if (container == 'reference_board') {
    board += '<div class = tol_peg_label><strong>Reference Board</strong></div>'
  } else {
    board += '<div class = tol_peg_label><strong>Target Board</strong></div>'
  }
  for (var p = 0; p<3; p++) {
    board += '<div class = tol_peg_' + (p+1) + '><div class = tol_peg></div></div>' //place peg
    //place balls
    board += '<div class = tol_peg_' + (p+1) + '>' 
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



/* ************************************ */
/* Define experimental variables */
/* ************************************ */
// generic task variables
var run_attention_checks = true
var attention_check_thresh = 0.65

// task specific variables
var colors = ['Green', 'Red', 'Blue']
var problem_i = 0
/*keeps track of peg board (where balls are). Lowest ball is the first value for each peg.
So the initial_placement has the 1st ball and 2nd ball on the first peg and the third ball on the 2nd peg.
*/
// make reference board
var initial_placement = [[1,2,0],[3,0],[0]] 
var ref_board = makeBoard('reference_board', initial_placement)
var example_problem1 = [[1,2,0],[0,0],[3]]
var example_problem2 = [[1,0,0],[3,0],[2]]

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

/* ************************************ */
/* Set up jsPsych blocks */
/* ************************************ */
// Set up attention check node
var attention_check_block = {
  type: 'attention-check',
  timing_response: 30000,
  response_ends_trial: true,
  timing_post_trial: 200
}

var attention_node = {
  timeline: [attention_check_block],
  conditional_function: function() {
    return run_attention_checks
  }
}

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

var instructions_block = {
  type: 'poldrack-instructions',
  pages: ['<div class = tol_topbox><p class = block-text>During this task, two pictures will be presented at a time. The pictures will be of colored balls arranged on pegs like this:</p></div>' + ref_board + makeBoard('peg_board', example_problem1) + '<div class = tol_bottombox><p class = block-text>Imagine that these balls have holes through them and the pegs are going through the holes. Notice that the first peg can hold three balls, the second peg can hold two balls, and the third peg can hold one ball.</p></div>',
  '<div class = tol_topbox><p class = block-text>Your task will be to figure out how many moves would have to be made to make the arrangements of balls in the reference picture look like the arrangements of balls in the target picture.</p></div>' + ref_board + makeBoard('peg_board', example_problem1) + '<div class = tol_bottombox><p class = block-text>Imagine that the balls in the target picture are fixed in place, but the balls in the reference picture are movable. You have to move them to make the reference picture look like the target picture. It is considered one move when you take a ball from one peg and place it on another. You can only move one ball at a time. Sometime you will have to move a ball to a different peg in order to get to the ball below it. During this task it is important that you remember, you are imagining the <strong>fewest possible moves</strong> that are required to make the reference picture look like the target picture. You will have 20 seconds to make your decision.</p></div>',
  '<div class = tol_topbox><p class = block-text>Here is an example. Notice that the balls in the reference picture are in a different arrangement than in the target picture. If we move the red ball from the first peg in the reference picture to the third peg then it would look like the target picture.</p></div>' + ref_board + makeBoard('peg_board', example_problem2) + '<div class = tol_bottombox><p class = block-text>We only moved one ball one time, so the answer is one move. During the test you will enter your answer using buttons on the screen.</p></div>'],
  allow_keys: false,
  show_clickable_nav: true,
  timing_post_trial: 1000
};


var start_test_block = {
  type: 'poldrack-text',
  timing_response: 60000,
  text: '<div class = centerbox><p class = block-text>We will now start the test. There will be ' + problems.length + ' problems to complete. Press <strong>enter</strong> to begin.</p></div>',
  cont_key: [13],
  timing_post_trial: 1000
};


/* define test block */
var test_block = {
  type: 'single-stim-button',
  stimulus: getStim,
  button_class: 'tol_response_button',
  data: {exp_id: "tol", trial_id: "test"},
  timing_stim: 20000,
  timing_response: 20000,
  timing_post_trial: 1000,
  on_finish: function() {
    jsPsych.data.addDataTolastTrial({'problem': problems[problem_i], 'answer': answers[problem_i]})
    problem_i += 1
  },
  repetitions: 12
};

/* create experiment definition array */
var tower_of_london_imagine_experiment = [];
tower_of_london_imagine_experiment.push(welcome_block);
tower_of_london_imagine_experiment.push(instructions_block);
tower_of_london_imagine_experiment.push(start_test_block);
tower_of_london_imagine_experiment.push(test_block);
tower_of_london_imagine_experiment.push(end_block);
