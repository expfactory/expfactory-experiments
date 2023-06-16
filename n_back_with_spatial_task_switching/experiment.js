/* ************************************ */
/*       Define Helper Functions        */
/* ************************************ */

function getDisplayElement() {
  $("<div class = display_stage_background></div>").appendTo("body");
  return $("<div class = display_stage></div>").appendTo("body");
}

function addID() {
  jsPsych.data.addDataToLastTrial({
    exp_id: "n_back_with_predictable_task_switching",
  });
}

function evalAttentionChecks() {
  var check_percent = 1;
  if (run_attention_checks) {
    var attention_check_trials =
      jsPsych.data.getTrialsOfType("attention-check");
    var checks_passed = 0;
    for (var i = 0; i < attention_check_trials.length; i++) {
      if (attention_check_trials[i].correct === true) {
        checks_passed += 1;
      }
    }
    check_percent = checks_passed / attention_check_trials.length;
  }
  jsPsych.data.addDataToLastTrial({ att_check_percent: check_percent });
  return check_percent;
}

function assessPerformance() {
  var experiment_data = jsPsych.data.getTrialsOfType("poldrack-single-stim");
  var missed_count = 0;
  var trial_count = 0;
  var rt_array = [];
  var rt = 0;
  var correct = 0;

  //record choices participants made
  var choice_counts = {};
  choice_counts[-1] = 0;
  choice_counts[77] = 0;
  choice_counts[90] = 0;
  for (var k = 0; k < possible_responses.length; k++) {
    choice_counts[possible_responses[k][1]] = 0;
  }
  for (var i = 0; i < experiment_data.length; i++) {
    if (experiment_data[i].trial_id == "test_trial") {
      trial_count += 1;
      rt = experiment_data[i].rt;
      key = experiment_data[i].key_press;
      choice_counts[key] += 1;
      if (rt == -1) {
        missed_count += 1;
      } else {
        rt_array.push(rt);
      }

      if (key == experiment_data[i].correct_response) {
        correct += 1;
      }
    }
  }

  //calculate average rt
  var avg_rt = -1;
  if (rt_array.length !== 0) {
    avg_rt = math.median(rt_array);
  }
  //calculate whether response distribution is okay
  var responses_ok = true;
  Object.keys(choice_counts).forEach(function (key, index) {
    if (choice_counts[key] > trial_count * 0.85) {
      responses_ok = false;
    }
  });
  var missed_percent = missed_count / trial_count;
  var accuracy = correct / trial_count;
  credit_var =
    missed_percent < 0.25 && avg_rt > 200 && responses_ok && accuracy > 0.6;
  jsPsych.data.addDataToLastTrial({
    final_credit_var: credit_var,
    final_missed_percent: missed_percent,
    final_avg_rt: avg_rt,
    final_responses_ok: responses_ok,
    final_accuracy: accuracy,
  });
}

var getResponse = function () {
  return correct_response;
};

var getInstructFeedback = function () {
  return (
    "<div class = centerbox><p class = center-block-text>" +
    feedback_instruct_text +
    "</p></div>"
  );
};

var getFeedback = function () {
  return (
    '<div class = bigbox><div class = picture_box><p class = block-text><font color="white">' +
    feedback_text +
    "</font></p></div></div>"
  );
};

var randomDraw = function (lst) {
  var index = Math.floor(Math.random() * lst.length);
  return lst[index];
};

var createControlTypes = function (numTrialsPerBlock) {
  var whichQuadStart = jsPsych.randomization.repeat([1, 2, 3, 4], 1).pop();
  var predictable_cond_array = predictable_conditions[whichQuadStart % 2];

  predictable_dimensions = predictable_dimensions_list_control_trials[0];

  var n_back_trial_type_list = [];
  var n_back_trial_types1 = jsPsych.randomization.repeat(
    n_back_conditions,
    numTrialsPerBlock / numConds
  );
  var n_back_trial_types2 = jsPsych.randomization.repeat(
    n_back_conditions,
    numTrialsPerBlock / numConds
  );
  var n_back_trial_types3 = jsPsych.randomization.repeat(
    n_back_conditions,
    numTrialsPerBlock / numConds
  );
  var n_back_trial_types4 = jsPsych.randomization.repeat(
    n_back_conditions,
    numTrialsPerBlock / numConds
  );
  n_back_trial_type_list.push(n_back_trial_types1);
  n_back_trial_type_list.push(n_back_trial_types2);
  n_back_trial_type_list.push(n_back_trial_types3);
  n_back_trial_type_list.push(n_back_trial_types4);

  var stims = [];
  for (var i = 0; i < numTrialsPerBlock + 1; i++) {
    quadIndex = whichQuadStart % 4;
    if (quadIndex === 0) {
      quadIndex = 4;
    }

    if (i === 0) {
      predictable_condition = "N/A";
      n_back_cond = jsPsych.randomization.repeat(n_back_conditions, 1).pop();
      predictable_dimension = predictable_dimensions[quadIndex - 1][0];
    } else if (i > 0) {
      predictable_condition = predictable_cond_array[i % 2];
      predictable_dimension = predictable_dimensions[quadIndex - 1][0];
      n_back_cond = n_back_trial_type_list[quadIndex - 1].pop();
    }

    if (n_back_cond == "match") {
      correct_response = possible_responses[0][1];
      if (predictable_dimension == "T or t") {
        probe = randomDraw(["t", "T"]);
      } else if (predictable_dimension == "non-T or non-t") {
        probe = randomDraw(
          "bBdDgGvV".split("").filter(function (y) {
            return $.inArray(y, ["t", "T"]) == -1;
          })
        );
      }
    } else if (n_back_cond == "mismatch") {
      correct_response = possible_responses[1][1];
      if (predictable_dimension == "T or t") {
        probe = randomDraw(
          "bBdDgGvV".split("").filter(function (y) {
            return $.inArray(y, ["t", "T"]) == -1;
          })
        );
      } else if (predictable_dimension == "non-T or non-t") {
        probe = randomDraw(["t", "T"]);
      }
    }

    stim = {
      whichQuad: quadIndex,
      n_back_condition: n_back_cond,
      predictable_dimension: predictable_dimension,
      predictable_condition: predictable_condition,
      probe: probe,
      correct_response: correct_response,
    };

    stims.push(stim);
    whichQuadStart += 1;
  }
  return stims;
};
//added for spatial task
var makeTaskSwitches = function (numTrials) {
  task_switch_arr = [
    "tstay_cstay",
    "tstay_cswitch",
    "tswitch_cswitch",
    "tswitch_cswitch",
  ];

  out = jsPsych.randomization.repeat(task_switch_arr, numTrials / 4);
  return out;
};

//added for spatial task
var getQuad = function (oldQuad, curr_switch) {
  var out;
  switch (curr_switch) {
    case "tstay_cstay":
      out = oldQuad;
      break;
    case "tstay_cswitch":
      if (oldQuad % 2 == 0) {
        // if even (2,4), subtract 1
        out = oldQuad - 1;
      } else {
        out = oldQuad + 1; //if odd (1,3), add 1
      }
      break;
    case "tswitch_cswitch":
      if (oldQuad < 3) {
        //if in top quadrants (1,2)
        out = Math.ceil(Math.random() * 2) + 2; // should return 3 or 4
      } else {
        //if in bottom quadrants (3,4)
        out = Math.ceil(Math.random() * 2); // should return 1 or 2
      }
      break;
  }
  return out;
};

var createTrialTypes = function (task_switches, numTrialsPerBlock) {
  //spatial task
  // 1 or 3 is stay for predictable
  // 2 or 4 is switch for predictable
  var whichQuadStart = jsPsych.randomization.repeat([1, 2, 3, 4], 1).pop();
  //1 2
  //4 3
  var predictable_cond_array = predictable_conditions[whichQuadStart % 2];

  var n_back_trial_type_list = [];
  var n_back_trial_types1 = jsPsych.randomization.repeat(
    n_back_conditions,
    numConds
  );
  var n_back_trial_types2 = jsPsych.randomization.repeat(
    n_back_conditions,
    numConds
  );
  var n_back_trial_types3 = jsPsych.randomization.repeat(
    n_back_conditions,
    numConds
  );
  var n_back_trial_types4 = jsPsych.randomization.repeat(
    n_back_conditions,
    numConds
  );
  n_back_trial_type_list.push(n_back_trial_types1);
  n_back_trial_type_list.push(n_back_trial_types2);
  n_back_trial_type_list.push(n_back_trial_types3);
  n_back_trial_type_list.push(n_back_trial_types4);

  predictable_dimensions = predictable_dimensions_list[0];

  stims = [];

  oldQuad = whichQuadStart; //added for spatial
  for (var i = 0; i < numTrialsPerBlock; i++) {
    quadIndex = whichQuadStart % 4;
    if (quadIndex === 0) {
      quadIndex = 4;
    }

    quadIndex = getQuad(oldQuad, task_switches[i]); //added for spatial
    predictable_condition = predictable_cond_array[i % 2];
    predictable_dimension = predictable_dimensions[quadIndex - 1][0];
    delay = predictable_dimensions[quadIndex - 1][1];

    if (i === 0) {
      n_back_cond = "Mismatch";
      probe = randomDraw(letters);
      correct_response = possible_responses[1][1];
      predictable_dimension = predictable_dimension; //originally 'N/A' here (because for trials =< current delay, there've not enough previous trials yet to match to). However, '1-back' or '2-back' being shown is okay, too.
    } else if (i == 1) {
      n_back_cond = jsPsych.randomization.repeat(n_back_conditions, 1).pop();

      if (n_back_cond == "match" && predictable_dimension == "1-back") {
        probe = randomDraw([
          stims[i - delay].probe.toUpperCase(),
          stims[i - delay].probe.toLowerCase(),
        ]);
        correct_response = possible_responses[0][1];
      } else if (
        n_back_cond == "mismatch" &&
        predictable_dimension == "1-back"
      ) {
        probe = randomDraw(
          "bBdDgGtTvV".split("").filter(function (y) {
            return (
              $.inArray(y, [
                stims[i - delay].probe.toLowerCase(),
                stims[i - delay].probe.toUpperCase(),
              ]) == -1
            );
          })
        );
        correct_response = possible_responses[1][1];
      } else if (delay == 2) {
        probe = randomDraw(letters);
        correct_response = possible_responses[1][1];
        predictable_dimension = predictable_dimension;
        n_back_cond = "Mismatch";
      }
    } else if (i > 1) {
      n_back_cond = n_back_trial_type_list[quadIndex - 1].pop();

      if (n_back_cond == "match") {
        probe = randomDraw([
          stims[i - delay].probe.toUpperCase(),
          stims[i - delay].probe.toLowerCase(),
        ]);
        correct_response = possible_responses[0][1];
      } else if (n_back_cond == "mismatch") {
        probe = randomDraw(
          "bBdDgGtTvV".split("").filter(function (y) {
            return (
              $.inArray(y, [
                stims[i - delay].probe.toLowerCase(),
                stims[i - delay].probe.toUpperCase(),
              ]) == -1
            );
          })
        );
        correct_response = possible_responses[1][1];
      }
    }

    stim = {
      whichQuad: quadIndex,
      n_back_condition: n_back_cond,
      predictable_dimension: predictable_dimension,
      predictable_condition: predictable_condition,
      probe: probe,
      correct_response: correct_response,
      delay: delay,
    };

    stims.push(stim);
    whichQuadStart += 1;
    oldQuad = quadIndex; // added for spatial
  }
  return stims;
};

var getStim = function () {
  stim = stims.shift();
  whichQuadrant = stim.whichQuad;
  n_back_condition = stim.n_back_condition;
  predictable_dimension = stim.predictable_dimension;
  predictable_condition = stim.predictable_condition;
  probe = stim.probe;
  correct_response = stim.correct_response;
  delay = stim.delay;
  if (probe == probe.toUpperCase()) {
    letter_case = "uppercase";
  } else if (probe == probe.toLowerCase()) {
    letter_case = "lowercase";
  }

  return (
    task_boards[whichQuadrant - 1][0] +
    preFileType +
    letter_case +
    "_" +
    probe.toUpperCase() +
    fileTypePNG +
    task_boards[whichQuadrant - 1][1]
  );
};

var getControlStim = function () {
  stim = control_stims.shift();
  whichQuadrant = stim.whichQuad;
  n_back_condition = stim.n_back_condition;
  predictable_dimension = stim.predictable_dimension;
  predictable_condition = stim.predictable_condition;
  probe = stim.probe;
  correct_response = stim.correct_response;

  return (
    task_boards[whichQuadrant - 1][0] +
    probe +
    task_boards[whichQuadrant - 1][1]
  );
};

var getResponse = function () {
  return correct_response;
};

var appendData = function () {
  curr_trial = jsPsych.progress().current_trial_global;
  trial_id = jsPsych.data.getDataByTrialIndex(curr_trial).trial_id;
  current_trial += 1;
  task_switch = "na";
  if (current_trial > 1) {
    task_switch = task_switches[current_trial - 2]; //this might be off
  }

  if (trial_id == "practice_trial") {
    current_block = practiceCount;
  } else if (trial_id == "test_trial") {
    current_block = testCount;
  }

  jsPsych.data.addDataToLastTrial({
    whichQuadrant: whichQuadrant,
    n_back_condition: n_back_condition,
    predictable_dimension: predictable_dimension,
    predictable_condition: predictable_condition,
    task_switch: task_switch,
    probe: probe,
    correct_response: correct_response,
    delay: delay,
    current_trial: current_trial,
    current_block: current_block,
  });

  if (
    jsPsych.data.getDataByTrialIndex(curr_trial).key_press == correct_response
  ) {
    jsPsych.data.addDataToLastTrial({
      correct_trial: 1,
    });
  } else if (
    jsPsych.data.getDataByTrialIndex(curr_trial).key_press != correct_response
  ) {
    jsPsych.data.addDataToLastTrial({
      correct_trial: 0,
    });
  }
};

/* ************************************ */
/*    Define Experimental Variables     */
/* ************************************ */
// generic task variables
var sumInstructTime = 0; //ms
var instructTimeThresh = 0; ///in seconds
var credit_var = 0;
var run_attention_checks = true;

var practice_len = 20; // 20
var exp_len = 240; // must be divisible by 10
var numTrialsPerBlock = 40; // must be divisible by 10
var numTestBlocks = exp_len / numTrialsPerBlock;

var accuracy_thresh = 0.75;
var rt_thresh = 1000;
var missed_thresh = 0.1;

var practice_thresh = 3; // 3 blocks of 20 trials

var pathSource =
  "/static/experiments/n_back_with_spatial_task_switching/images/";
var fileTypePNG = ".png'></img>";
var preFileType =
  "<img class = center src='/static/experiments/n_back_with_spatial_task_switching/images/";

var n_back_conditions = [
  "match",
  "mismatch",
  "mismatch",
  "mismatch",
  "mismatch",
];
var predictable_conditions = [
  ["stay", "switch"],
  ["switch", "stay"],
];

var predictable_dimensions_list = [
  [
    ["1-back", 1],
    ["1-back", 1],
    ["2-back", 2],
    ["2-back", 2],
  ],
  [
    ["2-back", 2],
    ["2-back", 2],
    ["1-back", 1],
    ["1-back", 1],
  ],
];
var numConds =
  n_back_conditions.length *
  predictable_conditions.length *
  predictable_dimensions_list.length;
var predictable_dimensions_list_control_trials = jsPsych.randomization.repeat(
  [
    [["T or t"], ["T or t"], ["non-T or non-t"], ["non-T or non-t"]],
    [["non-T or non-t"], ["non-T or non-t"], ["T or t"], ["T or t"]],
  ],
  1
);
var letters = "bBdDgGtTvV".split("");

var possible_responses = [
  ["M Key", 77],
  ["Z Key", 90],
];

var control_stims = createControlTypes(numTrialsPerBlock);
var task_switches = makeTaskSwitches(practice_len); //spatial
var stims = createTrialTypes(task_switches, practice_len); //spatial

var prompt_text_list =
  '<ul style="text-align:left;">' +
  "<li>Top 2 quadrants: match the current letter to the letter that appeared " +
  predictable_dimensions[0][1] +
  " trial(s) ago</li>" +
  "<li>Bottom 2 quadrants: match the current letter to the letter that occurred " +
  predictable_dimensions[2][1] +
  " trial(s) ago</li>" +
  "<li>If they match, press the " +
  possible_responses[0][0] +
  "</li>" +
  "<li>If they mismatch, press the " +
  possible_responses[1][0] +
  "</li>" +
  "</ul>";

var prompt_text_list =
  '<ul style="text-align:left;">' +
  "<li>Top 2 quadrants: Judge <i>middle</i> number on " +
  predictable_dimensions_list[0].dim +
  "</li>" +
  "<li>" +
  predictable_dimensions_list[0].values[0] +
  ": " +
  possible_responses[0][0] +
  "</li>" +
  "<li>" +
  predictable_dimensions_list[0].values[1] +
  ": " +
  possible_responses[1][0] +
  "</li>" +
  "<li>Bottom 2 quadrants: Judge <i>middle</i> number on " +
  predictable_dimensions_list[1].dim +
  "</li>" +
  "<li>" +
  predictable_dimensions_list[1].values[0] +
  ": " +
  possible_responses[0][0] +
  "</li>" +
  "<li>" +
  predictable_dimensions_list[1].values[1] +
  ": " +
  possible_responses[1][0] +
  "</li>" +
  "</ul>";

var prompt_text =
  "<div class = prompt_box>" +
  '<p class = center-block-text style = "font-size:16px;">Top 2 quadrants: Judge number on ' +
  predictable_dimensions_list[0].dim +
  "</p>" +
  '<p class = center-block-text style = "font-size:16px;">' +
  predictable_dimensions_list[0].values[0] +
  ": " +
  possible_responses[0][0] +
  " " +
  predictable_dimensions_list[0].values[1] +
  ": " +
  possible_responses[1][0] +
  "</p>" +
  "<p>&nbsp</p>" +
  '<p class = center-block-text style = "font-size:16px;">Bottom 2 quadrants: Judge number on ' +
  predictable_dimensions_list[1].dim +
  "</p>" +
  '<p class = center-block-text style = "font-size:16px;">' +
  predictable_dimensions_list[1].values[0] +
  ": " +
  possible_responses[0][0] +
  " " +
  predictable_dimensions_list[1].values[1] +
  ": " +
  possible_responses[1][0] +
  "</p>" +
  "</div>";

var current_trial = 0;
var current_block = 0;

//PRE LOAD IMAGES HERE
var lettersPreload = ["B", "D", "G", "T", "V"];
var casePreload = ["lowercase", "uppercase"];
var pathSource =
  "/static/experiments/n_back_with_spatial_task_switching/images/";
var images = [];

for (i = 0; i < lettersPreload.length; i++) {
  for (y = 0; y < casePreload.length; y++) {
    images.push(pathSource + casePreload[y] + "_" + lettersPreload[i] + ".png");
  }
}
jsPsych.pluginAPI.preloadImages(images);
/* ************************************ */
/*          Define Game Boards          */
/* ************************************ */

var task_boards = [
  [
    [
      "<div class = bigbox><div class = quad_box><div class = decision-top-left><div class = gng_number><div class = cue-text>",
    ],
    [
      "</div></div></div><div class = decision-top-right></div><div class = decision-bottom-right></div><div class = decision-bottom-left></div></div></div>",
    ],
  ],
  [
    [
      "<div class = bigbox><div class = quad_box><div class = decision-top-left></div><div class = decision-top-right><div class = gng_number><div class = cue-text>",
    ],
    [
      "</div></div></div><div class = decision-bottom-right></div><div class = decision-bottom-left></div></div></div>",
    ],
  ],
  [
    [
      "<div class = bigbox><div class = quad_box><div class = decision-top-left></div><div class = decision-top-right></div><div class = decision-bottom-right><div class = gng_number><div class = cue-text>",
    ],
    ["</div></div></div><div class = decision-bottom-left></div></div></div>"],
  ],
  [
    [
      "<div class = bigbox><div class = quad_box><div class = decision-top-left></div><div class = decision-top-right></div><div class = decision-bottom-right></div><div class = decision-bottom-left><div class = gng_number><div class = cue-text>",
    ],
    ["</div></div></div></div></div>"],
  ],
];

/* ************************************ */
/*        Set up jsPsych blocks         */
/* ************************************ */
// Set up attention check node
var attention_check_block = {
  type: "attention-check",
  data: {
    trial_id: "attention_check",
  },
  timing_response: 180000,
  response_ends_trial: true,
  timing_post_trial: 200,
};

var attention_node = {
  timeline: [attention_check_block],
  conditional_function: function () {
    return run_attention_checks;
  },
};

//Set up post task questionnaire
var post_task_block = {
  type: "survey-text",
  data: {
    exp_id: "n_back_with_spatial_task_switching",
    trial_id: "post task questions",
  },
  questions: [
    '<p class = center-block-text style = "font-size: 20px">Please summarize what you were asked to do in this task.</p>',
    '<p class = center-block-text style = "font-size: 20px">Do you have any comments about this task?</p>',
  ],
  rows: [15, 15],
  timing_response: 360000,
  columns: [60, 60],
};

var end_block = {
  type: "poldrack-text",
  data: {
    trial_id: "end",
  },
  text: "<div class = centerbox><p class = center-block-text>Thanks for completing this task!</p><p class = center-block-text>Press <i>enter</i> to continue.</p></div>",
  cont_key: [13],
  timing_response: 180000,
  on_finish: function () {
    assessPerformance();
    evalAttentionChecks();
  },
};

var feedback_instruct_text =
  "Welcome to the experiment. This experiment will take about 10 minutes. Press <i>enter</i> to begin.";
var feedback_instruct_block = {
  type: "poldrack-text",
  data: {
    trial_id: "instruction",
  },
  cont_key: [13],
  text: getInstructFeedback,
  timing_post_trial: 0,
  timing_response: 180000,
};

/// This ensures that the subject does not read through the instructions too quickly.  If they do it too quickly, then we will go over the loop again.
var instructions_block = {
  type: "poldrack-instructions",
  data: {
    trial_id: "instruction",
  },
  pages: [
    "<div class = centerbox>" +
      "<p class = block-text>In this task, you will see a letter on the screen in one of 4 quadrants.</p>" +
      "<p class = block-text>You will be asked to match the current letter to the letter that appeared either 1 or 2 trials ago depending on if the letter was on the top or bottom quadrants.</p> " +
      "<p class = block-text>When in the top two quadrants, the rule is " +
      predictable_dimensions[0][0] +
      ". Please respond if the current letter was the same as the letter that occurred " +
      predictable_dimensions[0][1] +
      " trial(s) ago.</p> " +
      "<p class = block-text>When in the bottom two quadrants, the rule is " +
      predictable_dimensions[2][0] +
      ". Please respond if the current letter was the same as the letter that occurred " +
      predictable_dimensions[2][1] +
      " trial(s) ago.</p> " +
      "<p class = block-text>Press the " +
      possible_responses[0][0] +
      " if the current letter matches the letter 1 or 2 trials ago, and the " +
      possible_responses[1][0] +
      " if they mismatch.</p> " +
      '<p class = block-text>Capitalization does not matter, so "T" matches with "t".</p> ' +
      "</div>",
    "<div class = centerbox>" +
      "<p class = block-text>We will start practice when you finish instructions. Please make sure you understand the instructions before moving on. You will be given a reminder of the rules for practice. <i>This will be removed for test!</i></p>" +
      "<p class = block-text>To avoid technical issues, please keep the experiment tab (on Chrome or Firefox) <i>active and in full-screen mode</i> for the whole duration of each task.</p>" +
      "</div>",
  ],
  allow_keys: false,
  show_clickable_nav: true,
  timing_post_trial: 1000,
};

/* This function defines stopping criteria */

var instruction_node = {
  timeline: [feedback_instruct_block, instructions_block],

  loop_function: function (data) {
    for (i = 0; i < data.length; i++) {
      if (data[i].trial_type == "poldrack-instructions" && data[i].rt != -1) {
        rt = data[i].rt;
        sumInstructTime = sumInstructTime + rt;
      }
    }
    if (sumInstructTime <= instructTimeThresh * 1000) {
      feedback_instruct_text =
        "Read through instructions too quickly.  Please take your time and make sure you understand the instructions.  Press <i>enter</i> to continue.";
      return true;
    } else if (sumInstructTime > instructTimeThresh * 1000) {
      feedback_instruct_text =
        "Done with instructions. Press <i>enter</i> to continue.";
      return false;
    }
  },
};

var start_control_block = {
  type: "poldrack-text",
  data: {
    trial_id: "instruction",
  },
  timing_response: 180000,
  text:
    "<div class = centerbox>" +
    "<p class = block-text>For this block of trials, you do not have to match letters.  Instead, indicate whether the current letter is a T (or t) or any other letter other than T (or t) depending on which quadrant the letter is in.</p>" +
    "<p class = block-text>When in the top two quadrants, respond if the current letter was a " +
    predictable_dimensions_list_control_trials[0][0] +
    ". Press the " +
    possible_responses[0][0] +
    " if the current letter was a " +
    predictable_dimensions_list_control_trials[0][0] +
    " and the " +
    possible_responses[1][0] +
    " if not.</p> " +
    "<p class = block-text>When in the bottom two quadrants, respond if the current letter was a " +
    predictable_dimensions_list_control_trials[0][2] +
    ". Press the " +
    possible_responses[0][0] +
    " if the current letter was a " +
    predictable_dimensions_list_control_trials[0][2] +
    " and the " +
    possible_responses[1][0] +
    " if not.</p> " +
    "<p class = block-text>You will no longer receive the rule prompt, so remember the instructions before you continue. Press Enter to begin.</p>" +
    "</div>",
  cont_key: [13],
  timing_post_trial: 1000,
  on_finish: function () {
    feedback_text = "We will now start this block. Press enter to begin.";
  },
};

var start_test_block = {
  type: "poldrack-text",
  data: {
    trial_id: "instruction",
  },
  timing_response: 180000,
  text:
    "<div class = centerbox>" +
    "<p class = block-text>We will now start the test portion</p>" +
    "<p class = block-text>You will be asked to match the current letter to the letter that appeared either 1 or 2 trials ago depending on if the letter was on the top or bottom quadrants.</p> " +
    "<p class = block-text>When in the top two quadrants, the rule is " +
    predictable_dimensions[0][0] +
    ". Please respond if the current letter was the same as the letter that occurred " +
    predictable_dimensions[0][1] +
    " trial(s) ago.</p> " +
    "<p class = block-text>When in the bottom two quadrants, the rule is " +
    predictable_dimensions[2][0] +
    ". Please respond if the current letter was the same as the letter that occurred " +
    predictable_dimensions[2][1] +
    " trial(s) ago.</p> " +
    "<p class = block-text>Press the " +
    possible_responses[0][0] +
    " if the current letter matches the letter 1 or 2 trials ago, and the " +
    possible_responses[1][0] +
    " if they mismatch.</p> " +
    '<p class = block-text>Capitalization does not matter, so "T" matches with "t".</p> ' +
    "<p class = block-text>You will no longer receive the rule prompt, so remember the instructions before you continue. Press Enter to begin.</p>" +
    "</div>",
  cont_key: [13],
  timing_post_trial: 1000,
  on_finish: function () {
    feedback_text = "We will now start the test portion. Press enter to begin.";
  },
};

var fixation_block = {
  type: "poldrack-single-stim",
  stimulus: "<div class = centerbox><div class = fixation>+</div></div>",
  is_html: true,
  choices: "none",
  data: {
    trial_id: "fixation",
  },
  timing_response: 500, //500
  timing_post_trial: 0,
};

var feedback_text =
  "Welcome to the experiment. This experiment will take about 10 minutes. Press <i>enter</i> to begin.";
var feedback_block = {
  type: "poldrack-single-stim",
  data: {
    trial_id: "practice-no-stop-feedback",
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

var control_before = Math.round(Math.random()); //0 control comes before test, 1, after

var controlTrials = [];
controlTrials.push(feedback_block);
for (i = 0; i < numTrialsPerBlock + 1; i++) {
  var practice_fixation_block = {
    type: "poldrack-single-stim",
    stimulus: "<div class = centerbox><div class = fixation>+</div></div>",
    is_html: true,
    choices: "none",
    data: {
      trial_id: "practice_fixation",
    },
    timing_response: 500, //500
    timing_post_trial: 0,
    prompt: prompt_text,
  };

  var control_block = {
    type: "poldrack-single-stim",
    stimulus: getControlStim,
    is_html: true,
    data: {
      trial_id: "control_trial",
    },
    choices: [possible_responses[0][1], possible_responses[1][1]],
    timing_stim: 2000, //2000
    timing_response: 2000, //2000
    timing_post_trial: 0,
    response_ends_trial: false,
    on_finish: appendData,
  };
  controlTrials.push(practice_fixation_block);
  controlTrials.push(control_block);
}

var controlCount = 0;
var controlNode = {
  timeline: controlTrials,
  loop_function: function (data) {
    controlCount += 1;
    task_switches = makeTaskSwitches(numTrialsPerBlock);
    stims = createTrialTypes(task_switches, numTrialsPerBlock);
    current_trial = 0;

    var sum_rt = 0;
    var sum_responses = 0;
    var correct = 0;
    var total_trials = 0;

    for (var i = 0; i < data.length; i++) {
      if (data[i].trial_id == "control_trial") {
        total_trials += 1;
        if (data[i].rt != -1) {
          sum_rt += data[i].rt;
          sum_responses += 1;
          if (data[i].key_press == data[i].correct_response) {
            correct += 1;
          }
        }
      }
    }

    var accuracy = correct / total_trials;
    var missed_responses = (total_trials - sum_responses) / total_trials;
    var ave_rt = sum_rt / sum_responses;

    feedback_text =
      "<br>Please take this time to read your feedback and to take a short break! Press enter to continue";

    if (controlCount == 1) {
      feedback_text +=
        "</p><p class = block-text>Done with this block. Press Enter to continue.";
      task_switches = makeTaskSwitches(numTrialsPerBlock);
      stims = createTrialTypes(task_switches, numTrialsPerBlock);
      return false;
    }
  },
};

var practiceTrials = [];
practiceTrials.push(feedback_block);
practiceTrials.push(instructions_block);
for (i = 0; i < practice_len; i++) {
  var practice_fixation_block = {
    type: "poldrack-single-stim",
    stimulus: "<div class = centerbox><div class = fixation>+</div></div>",
    is_html: true,
    choices: "none",
    data: {
      trial_id: "practice_fixation",
    },
    timing_response: 500, //500
    timing_post_trial: 0,
    prompt: prompt_text,
  };

  var practice_block = {
    type: "poldrack-categorize",
    stimulus: getStim,
    is_html: true,
    choices: [possible_responses[0][1], possible_responses[1][1]],
    key_answer: getResponse,
    data: {
      trial_id: "practice_trial",
    },
    correct_text:
      "<div class = fb_box><div class = center-text><font size = 20>Correct!</font></div></div>" +
      prompt_text,
    incorrect_text:
      "<div class = fb_box><div class = center-text><font size = 20>Incorrect</font></div></div>" +
      prompt_text,
    timeout_message:
      "<div class = fb_box><div class = center-text><font size = 20>Respond Faster!</font></div></div>" +
      prompt_text,
    timing_stim: 1000,
    timing_response: 2000, //2000
    timing_feedback_duration: 500, //500
    show_stim_with_feedback: false,
    timing_post_trial: 0,
    on_finish: appendData,
    prompt: prompt_text,
  };
  practiceTrials.push(practice_fixation_block);
  practiceTrials.push(practice_block);
}

var practiceCount = 0;
var practiceNode = {
  timeline: practiceTrials,
  loop_function: function (data) {
    practiceCount += 1;
    task_switches = makeTaskSwitches(practice_len);
    stims = createTrialTypes(task_switches, practice_len);
    current_trial = 0;

    var sum_rt = 0;
    var sum_responses = 0;
    var correct = 0;
    var total_trials = 0;
    var mismatch_press = 0;

    for (var i = 0; i < data.length; i++) {
      if (data[i].trial_id == "practice_trial") {
        total_trials += 1;
        if (data[i].rt != -1) {
          sum_rt += data[i].rt;
          sum_responses += 1;
          if (data[i].key_press == data[i].correct_response) {
            correct += 1;
          }
        }

        if (data[i].key_press == possible_responses[1][1]) {
          mismatch_press += 1;
        }
      }
    }

    var accuracy = correct / total_trials;
    var missed_responses = (total_trials - sum_responses) / total_trials;
    var ave_rt = sum_rt / sum_responses;
    var mismatch_press_percentage = mismatch_press / total_trials;

    feedback_text =
      "<br>Please take this time to read your feedback and to take a short break! Press enter to continue";

    if (accuracy > accuracy_thresh) {
      feedback_text +=
        "</p><p class = block-text>Done with this practice. Press Enter to continue.";
      task_switches = makeTaskSwitches(numTrialsPerBlock);
      stims = createTrialTypes(task_switches, numTrialsPerBlock);
      return false;
    } else if (accuracy < accuracy_thresh) {
      if (missed_responses > missed_thresh) {
        feedback_text +=
          "</p><p class = block-text>You have not been responding to some trials.  Please respond on every trial that requires a response.";
      }

      if (ave_rt > rt_thresh) {
        feedback_text +=
          "</p><p class = block-text>You have been responding too slowly.";
      }

      if (mismatch_press_percentage >= 0.9) {
        feedback_text +=
          '</p><p class = block-text>Please do not simply press the "' +
          possible_responses[1][0] +
          '" to every stimulus. Please try to identify the matches and press the "' +
          possible_responses[0][0] +
          '" when they occur.';
      }

      if (practiceCount == practice_thresh) {
        feedback_text += "</p><p class = block-text>Done with this practice.";
        task_switches = makeTaskSwitches(numTrialsPerBlock);
        stims = createTrialTypes(task_switches, numTrialsPerBlock);
        return false;
      }

      feedback_text +=
        "</p><p class = block-text>We are going to try practice again to see if you can achieve higher accuracy.  Remember: <br>" +
        prompt_text_list;

      feedback_text += "</p><p class = block-text>Press Enter to continue.";

      return true;
    }
  },
};

var testTrials = [];
testTrials.push(feedback_block);
testTrials.push(attention_node);
for (i = 0; i < numTrialsPerBlock; i++) {
  var test_block = {
    type: "poldrack-single-stim",
    stimulus: getStim,
    is_html: true,
    data: {
      trial_id: "test_trial",
    },
    choices: [possible_responses[0][1], possible_responses[1][1]],
    timing_stim: 1000, //1000
    timing_response: 2000, //2000
    timing_post_trial: 0,
    response_ends_trial: false,
    on_finish: appendData,
  };
  testTrials.push(fixation_block);
  testTrials.push(test_block);
}

var testCount = 0;
var testNode = {
  timeline: testTrials,
  loop_function: function (data) {
    testCount += 1;
    task_switches = makeTaskSwitches(numTrialsPerBlock);
    stims = createTrialTypes(task_switches, numTrialsPerBlock);
    current_trial = 0;

    var sum_rt = 0;
    var sum_responses = 0;
    var correct = 0;
    var total_trials = 0;
    var mismatch_press = 0;

    for (var i = 0; i < data.length; i++) {
      if (data[i].trial_id == "test_trial") {
        total_trials += 1;
        if (data[i].rt != -1) {
          sum_rt += data[i].rt;
          sum_responses += 1;
          if (data[i].key_press == data[i].correct_response) {
            correct += 1;
          }
        }

        if (data[i].key_press == possible_responses[1][1]) {
          mismatch_press += 1;
        }
      }
    }

    var accuracy = correct / total_trials;
    var missed_responses = (total_trials - sum_responses) / total_trials;
    var ave_rt = sum_rt / sum_responses;
    var mismatch_press_percentage = mismatch_press / total_trials;

    feedback_text =
      "<br>Please take this time to read your feedback and to take a short break! Press enter to continue";
    feedback_text +=
      "</p><p class = block-text>You have completed: " +
      testCount +
      " out of " +
      numTestBlocks +
      " blocks of trials.";

    if (accuracy < accuracy_thresh) {
      feedback_text +=
        "</p><p class = block-text>Your accuracy is too low.  Remember: <br>" +
        prompt_text_list;
    }
    if (missed_responses > missed_thresh) {
      feedback_text +=
        "</p><p class = block-text>You have not been responding to some trials.  Please respond on every trial that requires a response.";
    }

    if (ave_rt > rt_thresh) {
      feedback_text +=
        "</p><p class = block-text>You have been responding too slowly.";
    }

    if (mismatch_press_percentage >= 0.9) {
      feedback_text +=
        '</p><p class = block-text>Please do not simply press the "' +
        possible_responses[1][0] +
        '" to every stimulus. Please try to identify the matches and press the "' +
        possible_responses[0][0] +
        '" when they occur.';
    }

    if (testCount == numTestBlocks) {
      feedback_text +=
        "</p><p class = block-text>Done with this test. Press Enter to continue.<br>If you have been completing tasks continuously for an hour or more, please take a 15-minute break before starting again.";
      task_switches = makeTaskSwitches(numTrialsPerBlock);
      stims = createTrialTypes(task_switches, numTrialsPerBlock);
      return false;
    } else {
      return true;
    }
  },
};

/* ************************************ */
/*          Set up Experiment           */
/* ************************************ */

var n_back_with_spatial_task_switching_experiment = [];

n_back_with_spatial_task_switching_experiment.push(practiceNode);
n_back_with_spatial_task_switching_experiment.push(feedback_block);

n_back_with_spatial_task_switching_experiment.push(start_test_block);
n_back_with_spatial_task_switching_experiment.push(testNode);
n_back_with_spatial_task_switching_experiment.push(feedback_block);

n_back_with_spatial_task_switching_experiment.push(post_task_block);
n_back_with_spatial_task_switching_experiment.push(end_block);
