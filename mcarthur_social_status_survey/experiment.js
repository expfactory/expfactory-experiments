/* ************************************ */
/*       Define Helper Functions        */
/* ************************************ */

function getDisplayElement() {
  $("<div class = display_stage_background></div>").appendTo("body");
  return $("<div class = display_stage></div>").appendTo("body");
}

function addID() {
  jsPsych.data.addDataToLastTrial({ exp_id: "mcarthur_social_status_survey" });
}
var conditional_length_counter = 0;
var getQuestions = function () {
  survey_question = survey_questions.shift();
  button_info = button_text.shift();
  fatal_response = fatal_responses.shift();
  conditional_response = conditional_responses.shift();
  question_type = question_types.shift();
  item_name = item_names_dartmouth.shift();
  conditional_length = conditional_lengths.shift();
  buttonText = button_info[0];
  numButtons = button_info[1];
  buttonBoard2 = createButtonBoard2(numButtons, buttonText);

  //if subject makes fatal or conditional response on previous question, set time == 1.
  //doing the above skips the upcoming question
  skip_question = 1;
  do_not_skip_question = 300000;

  if (sub_made_fatal_response === 0 && sub_made_conditional_response == -1) {
    whichTime = do_not_skip_question;
  }

  if (sub_made_fatal_response == 1) {
    whichTime = skip_question;
  }
  if (sub_made_conditional_response == 1) {
    sub_made_conditional_response = -1;
    whichTime = do_not_skip_question;
  } else if (sub_made_conditional_response === 0) {
    conditional_length_counter += 1;
    whichTime = skip_question;
    if (conditional_length_counter == conditional_length_index) {
      sub_made_conditional_response = -1;
      conditional_length_counter = 0;
    }
  }

  return buttonBoard1 + survey_question + buttonBoard2;
};

var createButtonBoard2 = function (numButtons, buttonText) {
  //numButtons and buttonText need to be same length. numButtons is a number, buttonText is an array
  var buttonBoard2 = "</font></p><div class = buttonbox>";
  for (var i = 1; i < numButtons + 1; i++) {
    buttonBoard2 +=
      '<div class = inner><button class="likert_btn unselected" id="btn' +
      i +
      '" onClick="pressSubmit(this.id)" >' +
      buttonText[i - 1] +
      "</button></div>";
  }
  buttonBoard2 += "</div></div></div>";
  return buttonBoard2;
};

var hitKey = function (whichKey) {
  e = jQuery.Event("keydown");
  e.which = whichKey; // # Some key code value
  e.keyCode = whichKey;
  $(document).trigger(e);
  e = jQuery.Event("keyup");
  e.which = whichKey; // # Some key code value
  e.keyCode = whichKey;
  $(document).trigger(e);
};

var pressSubmit = function (current_submit) {
  buttonPressed = current_submit;
  buttonPressedText = document.getElementById(current_submit).innerHTML;
  console.log("buttonPressedText = " + buttonPressedText);
  keyTracker.push(buttonPressed);
  if (keyTracker.length === 1) {
    $("#" + buttonPressed).addClass("selected");
  } else if (keyTracker.length > 1) {
    for (var i = 0; i < keyTracker.length; i++) {
      $("#" + keyTracker[i]).removeClass("selected");
    }
    $("#" + buttonPressed).addClass("selected");
  }
};

var getTime = function () {
  return whichTime;
};

document.addEventListener("keydown", function (e) {
  var keynum;
  if (window.event) {
    keynum = e.keyCode;
  } else if (e.which) {
    keynum = e.which;
  }
  if (keynum == 13) {
    if (keyTracker.length === 0 && game_state == "questions") {
      alert(
        "Please choose a response.  Resume full-screen if you are taken out."
      );
    } else if (keyTracker.length > 0 && game_state == "questions") {
      hitKey(81);
    }
  }
});

var appendData = function () {
  curr_trial = jsPsych.progress().current_trial_global;
  trial_id = jsPsych.data.getDataByTrialIndex(curr_trial).trial_id;

  if (
    fatal_response.indexOf(buttonPressedText) != -1 &&
    question_type == "Fatal"
  ) {
    sub_made_fatal_response = 1;
  }

  if (
    conditional_response.indexOf(buttonPressedText) != -1 &&
    question_type == "Conditional"
  ) {
    sub_made_conditional_response = 1;
    conditional_length_index = conditional_length;
  } else if (
    conditional_response.indexOf(buttonPressedText) == -1 &&
    question_type == "Conditional"
  ) {
    sub_made_conditional_response = 0;
    conditional_length_index = conditional_length;
  }

  jsPsych.data.addDataToLastTrial({
    response: buttonPressedText,
    text: survey_question,
    options: buttonText,
    question_id: item_name,
  });

  keyTracker = [];
  buttonPressed = "N/A";
  buttonPressedText = "N/A";
};

getInstructions = function (index) {
  return instruction_prompts[index];
};

/* ************************************ */
/*    Define Experimental Variables     */
/* ************************************ */
var preFileType =
  "<img class = center src='/static/experiments/mcarthur_social_status_survey/images/";
var pathSource = "/static/experiments/mcarthur_social_status_survey/images/";

var sub_made_fatal_response = 0; // 0 if not, 1 if so
var sub_made_conditional_response = -1;
// -1 if a conditional question hasn't been come across - game start, 0 if sub should skip next question, 1 if sub should not skip next question
var keyTracker = [];
var buttonPressed = "N/A";
var buttonPressedText = "N/A";
var game_state = "start";
/* ************************************************ */
/*        Questions and responses for Survey        */
/* ************************************************ */

//Questions to be presented
var survey_questions = [
  "Think of this ladder as representing where people stand in the United States.</strong> At the <strong>top</strong> of the ladder are the people who are the best off – those who have the most money, the most education, and the most respected jobs. At the <strong>bottom</strong> are the people who are the worst off – those who have the least money, least education, the least respected jobs, or no job. The higher up you are on this ladder, the closer you are to the people at the very top; the lower you are, the closer you are to the people at the very bottom. Where would you place yourself on this ladder? Please choose the number on the rung where you think you stand at this time in your life relative to other people in the United States." +
    '<div class = "ladder"><img src="/static/experiments/mcarthur_social_status_survey/images/ladder.png"></div>',
  "Think of this ladder as representing where people stand in their communities.</strong> People define community in different ways; please define it in whatever way is most meaningful to you. At the <strong>top</strong> of the ladder are people who have the highest standing in their community. At the <strong>bottom</strong> are the people who have the lowest standing in their community. Where would you place yourself on this ladder? Please choose the number on the rung where you think you stand at this time in your life relative to other people in your community." +
    '<div class = "ladder"><img src="/static/experiments/mcarthur_social_status_survey/images/ladder.png"></div>',
];

//response options for radio buttons
//each array contains the button text, as well as length of button array.
var button_text = [
  [[1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 10],
  [[1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 10],
];

//Conditional questions control the presence of a set of following questions.
//Fatal questions end the survey, if a sub makes a particular response
//questions that are 'neither' are not conditional or fatal
var question_types = [["neither"], ["neither"]];

//If a subject chooses this response, end survey.  If not, continue survey
var fatal_responses = [["none"], ["none"]];

//If a subject chooses this response, show the next question.  If not, skip next question
var conditional_responses = [["neither"], ["neither"]];
//If sub made a response during a conditional questions that requires skipping the following questions,
//these are the number of questions to skip.  If integer, leave as integer.  Otherwise, put 'neither'
var conditional_lengths = [["neither"], ["neither"]];

//Names of items that be written on data
var item_names_dartmouth = ["mcarthur_1", "mcarthur_2"];

/* ************************************ */
/*       Set up HTML for Survey         */
/* ************************************ */
var buttonBoard1 =
  "<div class = bigbox><div class = survey_area>" +
  '<p class = center-block-text><font color = "white">';

var buttonBoard2 =
  "</font></p>" +
  "<div class = buttonbox>" +
  '<div class = inner><button class="likert_btn unselected" id="btn1" onClick="pressSubmit(this.id)"/>1</button></div>' +
  '<div class = inner><button class="likert_btn unselected" id="btn2" onClick="pressSubmit(this.id)"/>2</button></div>' +
  '<div class = inner><button class="likert_btn unselected" id="btn3" onClick="pressSubmit(this.id)"/>3</button></div>' +
  '<div class = inner><button class="likert_btn unselected" id="btn4" onClick="pressSubmit(this.id)"/>4</button></div>' +
  '<div class = inner><button class="likert_btn unselected" id="btn5" onClick="pressSubmit(this.id)"/>5</button></div>' +
  "</div>" +
  "</div>" +
  "</div>";

/* ************************************ */
/*        Set up jsPsych blocks         */
/* ************************************ */
var end_block = {
  type: "poldrack-text",
  data: {
    exp_id: "alcohol_drugs_survey_network",
    trial_id: "end",
  },
  timing_response: 180000,
  text:
    "<div class = bigbox><div class = centerbox>" +
    '<p class = center-text2 style="font-size:36px"><font color="white">Thanks for completing this survey!</font></p>' +
    '<p class = center-text2 style="font-size:36px"><font color="white">Press<strong> enter</strong> to continue.</font></p>' +
    "</div></div>",
  cont_key: [13],
  timing_post_trial: 0,
};

var welcome_block = {
  type: "poldrack-text",
  data: {
    trial_id: "welcome",
  },
  timing_response: -1,
  text:
    "<div class = bigbox><div class = centerbox>" +
    '<p class = center-text2 style="font-size:36px"><font color="white">Welcome to this survey!</font></p>' +
    '<p class = center-text2 style="font-size:36px"><font color="white">Press<strong> enter</strong> to continue.</font></p>' +
    "</div></div>",
  cont_key: [13],
  timing_post_trial: 0,
};

var opening_instructions_block = {
  type: "poldrack-text",
  data: {
    trial_id: "instruction",
  },
  timing_response: -1,
  text:
    "<div class = centerbox>" +
    '<p class = block-text style="font-size:28px"><font color="white">Please answer the following questions.</font></p>' +
    '<p class = block-text style="font-size:28px"><font color="white">Click on the button that best fits your answer, then <strong>press enter to submit your response</strong>.</font></p>' +
    '<p class = block-text style="font-size:28px"><font color="white">You will not be able to go back, so please carefully read and understand each question before you move on.</font></p>' +
    '<p class = block-text style="font-size:28px"><font color="white">Each question will disappear after 5 minutes if you do not respond.  Please answer each question by the time limit.</font></p>' +
    '<p class = block-text style="font-size:28px"><font color="white">Press enter to begin the survey.</font></p>' +
    "</div>",
  cont_key: [13],
  timing_post_trial: 0,
};

var update_state_block = {
  type: "poldrack-text",
  data: {
    trial_id: "update_state",
  },
  timing_response: 1,
  text: "<div class = bigbox></div>",
  cont_key: [13],
  timing_post_trial: 0,
  on_finish: function () {
    game_state = "questions";
  },
};

post_questionnaire_trials = [];
for (var x = 0; x < survey_questions.length; x++) {
  var post_exp_block = {
    type: "poldrack-single-stim",
    stimulus: getQuestions,
    is_html: true,
    choices: [81], //48,49,50,51,52
    data: {
      exp_id: "mcarthur_social_status_survey",
      trial_id: "post_questionnaire_block",
    },
    timing_post_trial: 0,
    timing_stim: getTime,
    timing_response: getTime,
    response_ends_trial: true,
    on_finish: appendData,
  };

  post_questionnaire_trials.push(post_exp_block);
}

var post_questionnaire_node = {
  timeline: post_questionnaire_trials,
  loop_function: function (data) {
    game_state = "end";
  },
};

/* ************************************ */
/*          Set up Experiment           */
/* ************************************ */

var mcarthur_social_status_survey_experiment = [];

mcarthur_social_status_survey_experiment.push(welcome_block);
mcarthur_social_status_survey_experiment.push(opening_instructions_block);

mcarthur_social_status_survey_experiment.push(update_state_block);

mcarthur_social_status_survey_experiment.push(post_questionnaire_node);

mcarthur_social_status_survey_experiment.push(end_block);
