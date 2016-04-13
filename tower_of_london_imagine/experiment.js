/* ************************************ */
/* Define helper functions */
/* ************************************ */
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
  for (var p = 0; p < 3; p++) {
    board += '<div class = tol_peg_' + (p + 1) + '><div class = tol_peg></div></div>' //place peg
      //place balls
    board += '<div class = tol_peg_' + (p + 1) + '>'
    var peg = ball_placement[p]
    for (var b = 0; b < peg.length; b++) {
      if (peg[b] !== 0) {
        ball = colors[peg[b] - 1]
        board += '<div class = "tol_ball tol_' + ball + '"><div class = tol_ball_label>' + ball[0] +
          '</div></div>'
      }
    }
    board += '</div>'
  }
  board += '</div>'
  return board
}

var getInstructFeedback = function() {
  return '<div class = centerbox><p class = center-block-text>' + feedback_instruct_text +
    '</p></div>'
}


/* ************************************ */
/* Define experimental variables */
/* ************************************ */
// generic task variables
var sumInstructTime = 0 //ms
var instructTimeThresh = 0 ///in seconds

// task specific variables
var colors = ['Green', 'Red', 'Blue']
var problem_i = 0
  /*keeps track of peg board (where balls are). Lowest ball is the first value for each peg.
  So the initial_placement has the 1st ball and 2nd ball on the first peg and the third ball on the 2nd peg.
  */
  // make reference board
var initial_placement = [
  [1, 2, 0],
  [3, 0],
  [0]
]
var ref_board = makeBoard('reference_board', initial_placement)
var example_problem1 = [
  [1, 2, 0],
  [0, 0],
  [3]
]
var example_problem2 = [
  [1, 0, 0],
  [3, 0],
  [2]
]

var problems = [
  [
    [0, 0, 0],
    [3, 1],
    [2]
  ],
  [
    [1, 0, 0],
    [2, 0],
    [3]
  ],
  [
    [1, 3, 0],
    [2, 0],
    [0]
  ],
  [
    [1, 0, 0],
    [2, 3],
    [0]
  ],
  [
    [2, 1, 0],
    [3, 0],
    [0]
  ],
  [
    [3, 0, 0],
    [2, 1],
    [0]
  ],
  [
    [2, 3, 0],
    [0, 0],
    [1]
  ],
  [
    [0, 0, 0],
    [2, 3],
    [1]
  ],
  [
    [2, 1, 3],
    [0, 0],
    [0]
  ],
  [
    [2, 3, 1],
    [0, 0],
    [0]
  ],
  [
    [3, 1, 0],
    [2, 0],
    [0]
  ],
  [
    [3, 0, 0],
    [2, 0],
    [1]
  ]
]
var answers = [2, 2, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5]

/* ************************************ */
/* Set up jsPsych blocks */
/* ************************************ */
//Set up post task questionnaire
var post_task_block = {
   type: 'survey-text',
   data: {
       trial_id: "post task questions"
   },
   questions: ['<p class = center-block-text style = "font-size: 20px">Please summarize what you were asked to do in this task.</p>',
              '<p class = center-block-text style = "font-size: 20px">Do you have any comments about this task?</p>'],
   rows: [15, 15],
   columns: [60,60]
};

/* define static blocks */
var end_block = {
  type: 'poldrack-text',
  data: {
    exp_id: 'tower_of_london_imagine',
    trial_id: 'end'
  },
  timing_response: 180000,
  text: '<div class = centerbox><p class = center-block-text>Thanks for completing this task!</p><p class = center-block-text>Press <strong>enter</strong> to continue.</p></div>',
  cont_key: [13],
  timing_post_trial: 0
};


var feedback_instruct_text =
  'Welcome to the experiment. Press <strong>enter</strong> to begin.'
var feedback_instruct_block = {
  type: 'poldrack-text',
  data: {
    trial_id: 'instruction'
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
    trial_id: 'instruction'
  },
  pages: [
    '<div class = tol_topbox><p class = block-text>During this task, two pictures will be presented at a time. The pictures will be of colored balls arranged on pegs like this:</p></div>' +
    ref_board + makeBoard('peg_board', example_problem1) +
    '<div class = tol_bottombox><p class = block-text>Imagine that these balls have holes through them and the pegs are going through the holes. Notice that the first peg can hold three balls, the second peg can hold two balls, and the third peg can hold one ball.</p></div>',
    '<div class = tol_topbox><p class = block-text>Your task will be to figure out how many moves would have to be made to make the arrangements of balls in the reference picture look like the arrangements of balls in the target picture.</p></div>' +
    ref_board + makeBoard('peg_board', example_problem1) +
    '<div class = tol_bottombox><p class = block-text>Imagine that the balls in the target picture are fixed in place, but the balls in the reference picture are movable. You have to move them to make the reference picture look like the target picture. It is considered one move when you take a ball from one peg and place it on another. You can only move one ball at a time. Sometime you will have to move a ball to a different peg in order to get to the ball below it. During this task it is important that you remember, you are imagining the <strong>fewest possible moves</strong> that are required to make the reference picture look like the target picture. You will have 20 seconds to make your decision.</p></div>',
    '<div class = tol_topbox><p class = block-text>Here is an example. Notice that the balls in the reference picture are in a different arrangement than in the target picture. If we move the red ball from the first peg in the reference picture to the third peg then it would look like the target picture.</p></div>' +
    ref_board + makeBoard('peg_board', example_problem2) +
    '<div class = tol_bottombox><p class = block-text>We only moved one ball one time, so the answer is one move. During the test you will enter your answer using buttons on the screen.</p></div>'
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
        'Read through instructions too quickly.  Please take your time and make sure you understand the instructions.  Press <strong>enter</strong> to continue.'
      return true
    } else if (sumInstructTime > instructTimeThresh * 1000) {
      feedback_instruct_text =
        'Done with instructions. Press <strong>enter</strong> to continue.'
      return false
    }
  }
}



var start_test_block = {
  type: 'poldrack-text',
  data: {
    trial_id: 'test_intro'
  },
  timing_response: 180000,
  text: '<div class = centerbox><p class = block-text>We will now start the test. There will be ' +
    problems.length + ' problems to complete. Press <strong>enter</strong> to begin.</p></div>',
  cont_key: [13],
  timing_post_trial: 1000
};


/* define test block */
var test_block = {
  type: 'single-stim-button',
  data: {
    trial_id: 'stim',
    exp_stage: 'test'
  },
  stimulus: getStim,
  button_class: 'tol_response_button',
  timing_stim: 20000,
  timing_response: 20000,
  timing_post_trial: 1000,
  on_finish: function() {
    jsPsych.data.addDataToLastTrial({
      'problem': problems[problem_i],
      'answer': answers[problem_i]
    })
    problem_i += 1
  }
};

/* create experiment definition array */
var tower_of_london_imagine_experiment = [];
tower_of_london_imagine_experiment.push(instruction_node);
tower_of_london_imagine_experiment.push(start_test_block);
for (var i = 0; i < problems.length; i++) {
  tower_of_london_imagine_experiment.push(test_block);
}
tower_of_london_imagine_experiment.push(post_task_block)
tower_of_london_imagine_experiment.push(end_block);