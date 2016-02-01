
/* ************************************ */
/* Define helper functions */
/* ************************************ */
function getDisplayElement () {
    $('<div class = display_stage_background></div>').appendTo('body')
    return $('<div class = display_stage></div>').appendTo('body')
}

function fillArray(value, len) {
  if (len === 0) return [];
  var a = [value];
  while (a.length * 2 <= len) a = a.concat(a);
  if (a.length < len) a = a.concat(a.slice(0, len - a.length));
  return a;
}

var getInstructFeedback = function() {
  return '<div class = centerbox><p class = center-block-text>' + feedback_instruct_text + '</p></div>'
}
/* ************************************ */
/* Define experimental variables */
/* ************************************ */
var run_attention_checks = true
var attention_check_thresh = 0.65
var sumInstructTime = 0    //ms
var instructTimeThresh = 3   ///in seconds

var path = 'static/experiments/ravens/images/'
var prefix = '<div><img src = "'
var bottom_id = '" id="bottom_img'
var postfix = '"</img></div>'
var top_img = ['top_1.jpg','top_2.jpg', 'top_3.jpg', 'top_4.jpg', 'top_5.jpg', 'top_6.jpg', 'top_7.jpg', 'top_8.jpg', 'top_9.jpg', 'top_10.jpg', 'top_11.jpg', 'top_12.jpg', 'top_13.jpg', 'top_14.jpg', 'top_15.jpg', 'top_16.jpg', 'top_17.jpg', 'top_18.jpg']
var bottom_img = ['bottom_1.jpg','bottom_2.jpg', 'bottom_3.jpg', 'bottom_4.jpg', 'bottom_5.jpg', 'bottom_6.jpg', 'bottom_7.jpg', 'bottom_8.jpg', 'bottom_9.jpg', 'bottom_10.jpg', 'bottom_11.jpg', 'bottom_12.jpg', 'bottom_13.jpg', 'bottom_14.jpg', 'bottom_15.jpg', 'bottom_16.jpg', 'bottom_17.jpg', 'bottom_18.jpg']

var all_pages = []

for (var i = 0; i < top_img.length; i++) {
  var page = []
  page.push(prefix+path+top_img[i]+postfix+prefix+path+bottom_img[i]+bottom_id+postfix)
  all_pages.push(page)
}

/* ************************************ */
/* Set up jsPsych blocks */
/* ************************************ */

/* define static blocks */

var welcome_block = {
  type: 'text',
  text: '<div class = centerbox><p class = block-text>Welcome to this survey.<br><br> Press <strong>enter</strong> to begin.</p></div>',
  cont_key: [13],
  data: {exp_id: "ravens"}
};

var feedback_instruct_text = 'Starting with instructions.  Press <strong> Enter </strong> to continue.'
var feedback_instruct_block = {
  type: 'poldrack-text',
  cont_key: [13],
  text: getInstructFeedback,
  timing_post_trial: 0,
  timing_response: 60000,
  data: {exp_id: "ravens"}
};
/// This ensures that the subject does not read through the instructions too quickly.  If they do it too quickly, then we will go over the loop again.
var instruction_trials = []   
var instructions_block = {
  type: 'poldrack-instructions',
  pages: [
    '<div class = centerbox><p class = block-text>This is a test of observation and clear thinking with 18 problems. The top part of each problem is a pattern with one part cut out of it. Your task is to look at the pattern, think of what the missing part must look like to complete the pattern correctly, both along the rows and the columns, and then find the right piece out of the eight shown. Only one of the answer choices is perfectly correct.</p></div>',
  ],
  allow_keys: false,
  show_clickable_nav: true,
  timing_post_trial: 1000,
  data: {exp_id : "ravens"}
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

/////////////////////
// ADD PRACTICE BLOCK
/////////////////////

var opts = ["A", "B", "C", "D", "E", "F", "G", "H"]

var all_options = fillArray([opts], 18)

var score_scale = {"A":1, "B":2, "C":3, "D":4, "E":5, "F":6, "G":7, "H":8}

/////////////////////
// ADD correct/incorrect
/////////////////////

var survey_block = {
  type: "poldrack-survey-multi-choice",
  exp_id: "ravens",
  horizontal: true,
  preamble: '',
  pages: all_pages,
  options: all_options,
  scale: score_scale,
  show_clickable_nav: true,
  allow_backward: true,
  required: fillArray([true], 18),
};

var end_block = {
  type: 'text',
  text: '<div class = centerbox><p class = center-block-text>Congratulations for completing this task!</p><p class = center-block-text>Press <strong>enter</strong> to continue.</p></div>',
  cont_key: [13],
  data: {exp_id: "ravens"}
};


//Set up experiment
var ravens_experiment = []
ravens_experiment.push(welcome_block);
ravens_experiment.push(instruction_node);
// ravens_experiment.push(instructions_block);
ravens_experiment.push(survey_block);
ravens_experiment.push(end_block);
