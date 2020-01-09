 /* ************************************ */
/* Define helper functions */
/* ************************************ */
function addID() {
  jsPsych.data.addDataToLastTrial({exp_id: 'cued_task_switching_single_task_network'})
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
    check_percent = checks_passed / attention_check_trials.length
  }
  return check_percent
}



function assessPerformance() {
  /* Function to calculate the "credit_var", which is a boolean used to
  credit individual experiments in expfactory. 
   */
  var experiment_data = jsPsych.data.getTrialsOfType('poldrack-single-stim')
  var missed_count = 0
  var trial_count = 0
  var rt_array = []
  var rt = 0
  var correct = 0
    //record choices participants made
  var choice_counts = {}
  choice_counts[-1] = 0
  choice_counts[77] = 0
  choice_counts[90] = 0

  for (var i = 0; i < experiment_data.length; i++) {
    if (experiment_data[i].trial_id == 'test_trial') {
      trial_count += 1
      rt = experiment_data[i].rt
      key = experiment_data[i].key_press
      choice_counts[key] += 1
      if (rt == -1) {
        missed_count += 1
      } else {
        rt_array.push(rt)
      }
      
      if (key == experiment_data[i].correct_response){
        correct += 1
      }
    }
  }
  
  //calculate average rt
  var avg_rt = -1
  if (rt_array.length !== 0) {
    avg_rt = math.median(rt_array)
  } 
    //calculate whether response distribution is okay
  var responses_ok = true
  Object.keys(choice_counts).forEach(function(key, index) {
    if (choice_counts[key] > trial_count * 0.85) {
      responses_ok = false
    }
  })
  var missed_percent = missed_count/trial_count
  var accuracy = correct / trial_count
  credit_var = (missed_percent < 0.25 && avg_rt > 200 && responses_ok && accuracy > 0.60)
  jsPsych.data.addDataToLastTrial({final_credit_var: credit_var,
                   final_missed_percent: missed_percent,
                   final_avg_rt: avg_rt,
                   final_responses_ok: responses_ok,
                   final_accuracy: accuracy})
}

var randomDraw = function(lst) {
  var index = Math.floor(Math.random() * (lst.length))
  return lst[index]
}

var getInstructFeedback = function() {
  return '<div class = centerbox><p class = center-block-text>' + feedback_instruct_text +
    '</p></div>'
}

var getFeedback = function() {
  return '<div class = bigbox><div class = picture_box><p class = block-text><font color="white">' + feedback_text + '</font></p></div></div>'
}

// Task Specific Functions
var getKeys = function(obj) {
  var keys = [];
  for (var key in obj) {
    keys.push(key);
  }
  return keys
}

var genStims = function(n) {
  stims = []
  for (var i = 0; i < n; i++) {
    var number = randomDraw('12346789')
    var color = randomDraw(['white'])
    var stim = {
      number: parseInt(number),
      color: color
    }
    stims.push(stim)
  }
  return stims
}

//Sets the cue-target-interval for the cue block
var setCTI = function() {
  return CTI
}

var getCTI = function() {
  return CTI
}

/* Index into task_switches using the global var current_trial. Using the task_switch and cue_switch
change the task. If "stay", keep the same task but change the cue based on "cue switch". 
If "switch new", switch to the task that wasn't the current or last task, choosing a random cue. 
If "switch old", switch to the last task and randomly choose a cue.
*/
var setStims = function() {
  var tmp;
  switch (task_switches[current_trial].task_switch) {
    case "na":
      tmp = curr_task
      curr_task = randomDraw(getKeys(tasks))
      cue_i = randomDraw([0, 1])
      break
    case "stay":
      if (curr_task == "na") {
        tmp = curr_task
        curr_task = randomDraw(getKeys(tasks))
      }
      if (task_switches[current_trial].cue_switch == "switch") {
        cue_i = 1 - cue_i
      }
      break
    case "switch":
      task_switches[current_trial].cue_switch = "switch"
      cue_i = randomDraw([0, 1])
      if (last_task == "na") {
        tmp = curr_task
        curr_task = randomDraw(getKeys(tasks).filter(function(x) {
          return (x != curr_task)
        }))
        last_task = tmp
      } else {
        tmp = curr_task
        curr_task = getKeys(tasks).filter(function(x) {
          return (x != curr_task)
        })[0]
        last_task = tmp
      }
      break
    case "switch_old":
      task_switches[current_trial].cue_switch = "switch"
      cue_i = randomDraw([0, 1])
      if (last_task == "na") {
        tmp = curr_task
        curr_task = randomDraw(getKeys(tasks).filter(function(x) {
          return (x != curr_task)
        }))
        last_task = tmp
      } else {
        tmp = curr_task
        curr_task = last_task
        last_task = tmp
      }
      break

  }
  curr_cue = tasks[curr_task].cues[cue_i]
  curr_stim = stims[current_trial]
  current_trial = current_trial + 1
  CTI = setCTI()
  correct_response = getResponse()
  correct = false
}

var getCue = function() {
  var cue_html = '<div class = upperbox><div class = "center-text" >' + curr_cue + '</div></div>'+
           '<div class = lowerbox><div class = fixation>+</div></div>'
  return cue_html
}

var getStim = function() {
  var stim_html = '<div class = upperbox><div class = "center-text" >' + curr_cue + '</div></div>'+
            '<div class = lowerbox><div class = gng_number><div class = cue-text>'+ preFileType + curr_stim.number + fileTypePNG + '</div></div></div>'
  return stim_html
}

//Returns the key corresponding to the correct response for the current
// task and stim
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
      if (curr_stim.number % 2 === 0) {
        return response_keys.key[0]
      } else {
        return response_keys.key[1]
      }
  }
}


/* Append gap and current trial to data and then recalculate for next trial*/
var appendData = function() {
  var curr_trial = jsPsych.progress().current_trial_global
  var trial_id = jsPsych.data.getDataByTrialIndex(curr_trial).trial_id
  var trial_num = current_trial - 1 //current_trial has already been updated with setStims, so subtract one to record data
  var task_switch = task_switches[trial_num]

  jsPsych.data.addDataToLastTrial({
    cue: curr_cue,
    stim_number: curr_stim.number,
    task: curr_task,
    task_condition: task_switch.task_switch,
    cue_condition: task_switch.cue_switch,
    current_trial: trial_num,
    correct_response: correct_response,
    CTI: CTI
  })

  if ((trial_id == 'practice_trial') || (trial_id == 'test_trial')){
  correct_trial = 0
    if (jsPsych.data.getDataByTrialIndex(curr_trial).key_press == correct_response){
      correct_trial = 1
    }
  jsPsych.data.addDataToLastTrial({
        correct_trial: correct_trial
    })
  } 
}

/* ************************************ */
/* Define experimental variables */
/* ************************************ */
// generic task variables
var run_attention_checks = true
var attention_check_thresh = 0.45
var sumInstructTime = 0 //ms
var instructTimeThresh = 0 ///in seconds
var credit_var = 0

// task specific variables
var response_keys = {key: [77,90], key_name: ["M","Z"]}
var choices = response_keys.key
var practice_length = 16 // must be divisible by 4
var exp_len = 192 // must be divisible by 4
var numTrialsPerBlock = 48 
var numTestBlocks = exp_len / numTrialsPerBlock

var practice_thresh = 3 // 3 blocks of 16 trials
var rt_thresh = 1000;
var missed_response_thresh = 0.10;
var accuracy_thresh = 0.75;

var fileTypePNG = ".png'></img>"
var preFileType = "<img class = center src='/static/experiments/cued_task_switching_single_task_network/images/"

//set up block stim. correct_responses indexed by [block][stim][type]
var tasks = {
  parity: {
    task: 'parity',
    cues: ['Parity', 'Odd-Even']
  },
  magnitude: {
    task: 'magnitude',
    cues: ['Magnitude', 'High-Low']
  }
}
/*
color: {
    task: 'color',
    cues: ['Color', 'Orange-Blue']
  },
*/

var task_switch_types = ["stay", "switch"]
var cue_switch_types = ["stay", "switch"]
var task_switches_arr = []
for (var t = 0; t < task_switch_types.length; t++) {
  for (var c = 0; c < cue_switch_types.length; c++) {
    task_switches_arr.push({
      task_switch: task_switch_types[t],
      cue_switch: cue_switch_types[c]
    })
  }
}
var task_switches = jsPsych.randomization.repeat(task_switches_arr, practice_length / 4)
task_switches.unshift({task_switch: 'na', cue_switch: 'na', go_no_go_type: jsPsych.randomization.repeat(['go','nogo'],1).pop()})
var practiceStims = genStims(practice_length + 1)
var testStims = genStims(numTrialsPerBlock + 1)
var stims = practiceStims
var curr_task = randomDraw(getKeys(tasks))
var last_task = 'na' //object that holds the last task, set by setStims()
var curr_cue = 'na' //object that holds the current cue, set by setStims()
var cue_i = randomDraw([0, 1]) //index for one of two cues of the current task
var curr_stim = 'na' //object that holds the current stim, set by setStims()
var current_trial = 0
var CTI = 150 //cue-target-interval or cue's length (7/29, changed from 300 to 150; less time to process the cue should increase cue switch costs and task switch costs)
var exp_stage = 'practice' // defines the exp_stage, switched by start_test_block

var task_list = '<ul><li><i>Parity</i> or <i>Odd-Even</i>: Press the ' + response_keys.key_name[
    0] + ' key if even and the ' + response_keys.key_name[1] + ' key if odd.' +
  '</li><li><i>Magnitude</i> or <i>High-Low</i>: Press the ' + response_keys.key_name[
    0] + ' key if the number is greater than 5 and the ' + response_keys.key_name[1] +
  ' key if less than 5.</li></ul>'

var prompt_task_list = '<ul style="text-align:left"><li><i>Parity</i> or <i>Odd-Even</i>: ' + response_keys.key_name[0] +
  ' if even and ' + response_keys.key_name[1] + ' if odd.' +
  '</li><li><i>Magnitude</i> or <i>High-Low</i>: ' + response_keys.key_name[0] +
  ' if >5 and ' + response_keys.key_name[1] + ' if <5.</li></ul>'


//PRE LOAD IMAGES HERE
var pathSource = "/static/experiments/cued_task_switching_single_task_network/images/"
var numbersPreload = ['1','2','3','4','6','7','8','9']
var images = []
for(i=0;i<numbersPreload.length;i++){
  images.push(pathSource + numbersPreload[i] + '.png')
}

jsPsych.pluginAPI.preloadImages(images);
/* ************************************ */
/* Set up jsPsych blocks */
/* ************************************ */
// Set up attention check node
var attention_check_block = {
  type: 'attention-check',
  data: {
    trial_id: "attention_check"
  },
  timing_response: 180000,
  response_ends_trial: true,
  timing_post_trial: 200
}

var attention_node = {
  timeline: [attention_check_block],
  conditional_function: function() {
    return run_attention_checks
  }
}

//Set up post task questionnaire
var post_task_block = {
   type: 'survey-text',
   data: {
       exp_id: "cued_task_switching_single_task_network",
       trial_id: "post task questions"
   },
   questions: ['<p class = center-block-text style = "font-size: 20px">Please summarize what you were asked to do in this task.</p>',
              '<p class = center-block-text style = "font-size: 20px">Do you have any comments about this task?</p>'],
   rows: [15, 15],
   timing_response: 360000,
   columns: [60,60]
};

/* define static blocks */
var feedback_instruct_text =
  'Welcome to the experiment. This experiment will take around 10 minutes. Press <i>enter</i> to begin.'
var feedback_instruct_block = {
  type: 'poldrack-text',
  data: {
    trial_id: "instruction"
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
    trial_id: "instruction"
  },
  pages: [
    '<div class = centerbox><p class = block-text>In this experiment you will have to respond to a sequence of numbers by pressing the "M" and "Z" keys. How you respond to the numbers will depend on the current task, which can change every trial.</p><p class = block-text>On some trials you will have to indicate whether the number is odd or even, and on other trials you will indicate whether the number is higher or lower than 5. Each trial will start with a cue telling you which task to do on that trial.</p></div>',
    '<div class = centerbox><p class = block-text>The cue before the number will be a word indicating the task. There will be four different cues indicating two different tasks. The cues and tasks are described below:</p>' +
    task_list +
    '<p class = block-text>Practice will start after you end instructions.</p>'+
    '<p class = block-text>To avoid technical issues, please keep the experiment tab (on Chrome or Firefox) active and in full-screen mode for the whole duration of each task.</p></div>'
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
        'Read through instructions too quickly.  Please take your time and make sure you understand the instructions.  Press <i>enter</i> to continue.'
      return true
    } else if (sumInstructTime > instructTimeThresh * 1000) {
      feedback_instruct_text =
        'Done with instructions. Press <i>enter</i> to continue.'
      return false
    }
  }
}
var end_block = {
  type: 'poldrack-text',
  data: {
    trial_id: "end",
  },
  text: '<div class = centerbox><p class = center-block-text>Thanks for completing this task!</p><p class = center-block-text>Press <i>enter</i> to continue.</p></div>',
  cont_key: [13],
  timing_response: 180000,
  on_finish: function(){
    assessPerformance()
    evalAttentionChecks()
    }
};

var start_practice_block = {
  type: 'poldrack-text',
  timing_response: 180000,
  data: {
    trial_id: "practice_intro"
  },
  text: '<div class = centerbox><p class = center-block-text>Starting with some practice. </p><p class = center-block-text>Press <i>enter</i> to continue.</p></div>',
  cont_key: [13]
};

var start_test_block = {
  type: 'poldrack-text',
  data: {
    trial_id: "test_intro"
  },
  cont_key: [13],
  timing_response: 180000,
  text: '<div class = centerbox>'+
      '<p class = block-text>Finished with practice.  You will no longer receive the rule prompt during trials.</p>'+
      '<p class = block-text>Test will be exactly like practice.  You will have to respond to a sequence of numbers by pressing the "M" and "Z" keys. How you respond to the numbers will depend on the current task, which can change every trial.</p><p class = block-text>For instance, on some trials you will have to indicate whether the number is odd or even, and on other trials you will indicate whether the number is higher or lower than 5. Each trial will start with a cue telling you which task to do on that trial.</p>'+
      '<p class = block-text>The cue before the number will be a word indicating the task. There will be four different cues indicating two different tasks. The cues and tasks are described below:</p>' +
      task_list +
      '<p class = block-text>Press enter to continue.</p>' +
    '</div>',
  on_finish: function() {
    current_trial = 0
    feedback_text = 
  'Starting a test block. Press enter to continue.'
  exp_stage = 'test'
  },
  timing_post_trial: 1000
}

/* define practice and test blocks */
var setStims_block = {
  type: 'call-function',
  data: {
    trial_id: "set_stims"
  },
  func: setStims,
  timing_post_trial: 0
}


var feedback_text = 
'Welcome to the experiment. This experiment will take around 10 minutes. Press <i>enter</i> to begin.'
var feedback_block = {
  type: 'poldrack-single-stim',
  data: {
    trial_id: "practice-stop-feedback"
  },
  choices: [13],
  stimulus: getFeedback,
  timing_post_trial: 0,
  is_html: true,
  timing_response: 180000,
  response_ends_trial: true, 

};

var practiceTrials = []
practiceTrials.push(feedback_block)
practiceTrials.push(instructions_block)
for (var i = 0; i < practice_length + 1; i++) {
  var practice_fixation_block = {
    type: 'poldrack-single-stim',
    stimulus: '<div class = upperbox><div class = fixation>+</div></div><div class = lowerbox><div class = fixation>+</div></div>',
    is_html: true,
    choices: 'none',
    data: {
    trial_id: "practice_fixation"
    },
    timing_post_trial: 0,
    timing_stim: 500, //500
    timing_response: 500, //500
    prompt: '<div class = promptbox>' + prompt_task_list + '</div>',
    on_finish: function() {
    jsPsych.data.addDataToLastTrial({
      exp_stage: exp_stage
    })
    }
  }

  var practice_cue_block = {
    type: 'poldrack-single-stim',
    stimulus: getCue,
    is_html: true,
    choices: 'none',
    data: {
    trial_id: 'practice_cue'
    },
    timing_response: getCTI, //getCTI
    timing_stim: getCTI,  //getCTI
    timing_post_trial: 0,
    prompt: '<div class = promptbox>' + prompt_task_list + '</div>',
    on_finish: function() {
    jsPsych.data.addDataToLastTrial({
      exp_stage: exp_stage
    })
    appendData()
    }
  };
  
  var practice_block = {
    type: 'poldrack-categorize',
    stimulus: getStim,
    is_html: true,
    key_answer: getResponse,
    correct_text: '<div class = fb_box><div class = center-text><font size = 20>Correct!</font></div></div><div class = promptbox>' +
    prompt_task_list + '</div>',
    incorrect_text: '<div class = fb_box><div class = center-text><font size = 20>Incorrect</font></div></div><div class = promptbox>' +
    prompt_task_list + '</div>',
    timeout_message: '<div class = fb_box><div class = center-text><font size = 20>Respond Faster!</font></div></div><div class = promptbox>' +
    prompt_task_list + '</div>',
    choices: choices,
    data: {
    trial_id: 'practice_trial'
    },
    timing_feedback_duration: 500, //500
    show_stim_with_feedback: false,
    timing_response: 2000, //2000
    timing_stim: 1000, //1000
    timing_post_trial: 0,
    prompt: '<div class = promptbox>' + prompt_task_list + '</div>',
    on_finish: appendData
    /*
    function(data) {
    appendData()
    correct_response = getResponse()
    correct = false
    if (data.key_press === correct_response) {
      correct = true
    }
    jsPsych.data.addDataToLastTrial({
      'correct_response': correct_response,
      'correct': correct
    })
    */
  }

  practiceTrials.push(setStims_block)
  practiceTrials.push(practice_fixation_block)
  practiceTrials.push(practice_cue_block);
  practiceTrials.push(practice_block);
}

var practiceCount = 0
var practiceNode = {
  timeline: practiceTrials,
  loop_function: function(data) {
    practiceCount += 1
    task_switches = jsPsych.randomization.repeat(task_switches_arr, practice_length / 4)
    task_switches.unshift({task_switch: 'na', cue_switch: 'na', go_no_go_type: jsPsych.randomization.repeat(['go','nogo'],1).pop()})
    stims = genStims(practice_length + 1)
    current_trial = 0
  
    var sum_rt = 0
    var sum_responses = 0
    var correct = 0
    var total_trials = 0
  
    for (var i = 0; i < data.length; i++){
      if (data[i].trial_id == "practice_trial"){
        total_trials+=1
        if (data[i].rt != -1){
          sum_rt += data[i].rt
          sum_responses += 1
          if (data[i].key_press == data[i].correct_response){
            correct += 1
    
          }
        }
    
      }
  
    }
  
    var accuracy = correct / total_trials
    var missed_responses = (total_trials - sum_responses) / total_trials
    var ave_rt = sum_rt / sum_responses
  
    feedback_text = "<br>Please take this time to read your feedback and to take a short break! Press enter to continue"

    if (accuracy > accuracy_thresh){
      feedback_text +=
          '</p><p class = block-text>Done with this practice. Press Enter to continue.' 
      
      task_switches = jsPsych.randomization.repeat(task_switches_arr, numTrialsPerBlock / 4)
      task_switches.unshift({task_switch: 'na', cue_switch: 'na', go_no_go_type: jsPsych.randomization.repeat(['go','nogo'],1).pop()})
      stims = genStims(numTrialsPerBlock + 1)
      return false
  
    } else if (accuracy < accuracy_thresh){
      feedback_text +=
          '</p><p class = block-text>We are going to try practice again to see if you can achieve higher accuracy.  Remember: <br>' + prompt_task_list 
      if (missed_responses > missed_response_thresh){
        feedback_text +=
            '</p><p class = block-text>You have been responding too slowly. Please respond as quickly and as accurately as possible.'
      }

      if (ave_rt > rt_thresh) {
        feedback_text += 
            '</p><p class = block-text>You have been responding too slowly.'
      }
    
      if (practiceCount == practice_thresh){
        feedback_text +=
          '</p><p class = block-text>Done with this practice.' 
          
          task_switches = jsPsych.randomization.repeat(task_switches_arr, numTrialsPerBlock / 4)
          task_switches.unshift({task_switch: 'na', cue_switch: 'na', go_no_go_type: jsPsych.randomization.repeat(['go','nogo'],1).pop()})
          stims = genStims(numTrialsPerBlock + 1)
          return false
      }
      
      feedback_text +=
        '</p><p class = block-text>Redoing this practice. Press Enter to continue.' 
      
      return true
    
    }
    
  }
}


var testTrials = []
testTrials.push(feedback_block)
testTrials.push(attention_node)
for (i = 0; i < numTrialsPerBlock + 1; i++) {
  var fixation_block = {
    type: 'poldrack-single-stim',
    stimulus: '<div class = upperbox><div class = fixation>+</div></div><div class = lowerbox><div class = fixation>+</div></div>',
    is_html: true,
    choices: 'none',
    data: {
    trial_id: "test_fixation"
    },
    timing_post_trial: 0,
    timing_stim: 500, //500
    timing_response: 500, //500
    on_finish: function() {
    jsPsych.data.addDataToLastTrial({
      exp_stage: exp_stage
    })
    }
  }

  var cue_block = {
    type: 'poldrack-single-stim',
    stimulus: getCue,
    is_html: true,
    choices: 'none',
    data: {
    trial_id: 'test_cue'
    },
    timing_response: getCTI, //getCTI
    timing_stim: getCTI, //getCTI
    timing_post_trial: 0,
    on_finish: function() {
    jsPsych.data.addDataToLastTrial({
      exp_stage: exp_stage
    })
    appendData()
    }
  };


  var test_block = {
    type: 'poldrack-single-stim',
    stimulus: getStim,
    is_html: true,
    choices: choices,
    data: {
    trial_id: 'test_trial',
    exp_stage: 'test'
    },
    timing_post_trial: 0,
    timing_response: 2000, //2000
    timing_stim: 1000, //1000
    response_ends_trial: false,
    on_finish: appendData
    /*
    function(data) {
    appendData()
    correct_response = getResponse()
    correct = false
    if (data.key_press === correct_response) {
      correct = true
    }
    jsPsych.data.addDataToLastTrial({
      'correct_response': correct_response,
      'correct': correct
    })
    */
    
   }
  
  testTrials.push(setStims_block)
  testTrials.push(fixation_block)
  testTrials.push(cue_block);
  testTrials.push(test_block);
}

var testCount = 0
var testNode = {
  timeline: testTrials,
  loop_function: function(data) {
  testCount += 1
  current_trial = 0
  task_switches = jsPsych.randomization.repeat(task_switches_arr, numTrialsPerBlock / 4)
  task_switches.unshift({task_switch: 'na', cue_switch: 'na', go_no_go_type: jsPsych.randomization.repeat(['go','nogo'],1).pop()})
  stims = genStims(numTrialsPerBlock + 1)
  
  var sum_rt = 0
    var sum_responses = 0
    var correct = 0
    var total_trials = 0

    for (var i = 0; i < data.length; i++){
      if (data[i].trial_id == "test_trial"){
        total_trials+=1
        if (data[i].rt != -1){
          sum_rt += data[i].rt
          sum_responses += 1
          if (data[i].key_press == data[i].correct_response){
            correct += 1
          }
        }
      } 
    }
  
    var accuracy = correct / total_trials
    var missed_responses = (total_trials - sum_responses) / total_trials
    var ave_rt = sum_rt / sum_responses
  
    feedback_text = "<br>Please take this time to read your feedback and to take a short break! Press enter to continue"
    feedback_text += "</p><p class = block-text>You have completed: "+testCount+" out of "+numTestBlocks+" blocks of trials."
    
    if (accuracy < accuracy_thresh){
      feedback_text +=
          '</p><p class = block-text>Your accuracy is too low.  Remember: <br>' + prompt_task_list 
    }
    if (missed_responses > missed_response_thresh){
      feedback_text +=
          '</p><p class = block-text>You have not been responding to some trials.  Please respond on every trial that requires a response.'
    }

    if (ave_rt > rt_thresh) {
      feedback_text += 
          '</p><p class = block-text>You have been responding too slowly.'
    }
  
    if (testCount == numTestBlocks){
      feedback_text +=
          '</p><p class = block-text>Done with this test. Press Enter to continue. <br>If you have been completing tasks continuously for one hour or more, please take a 15-minute break before starting again.'
      return false
    } else {
      return true
    }
  
  }
}

/* create experiment definition array */
var cued_task_switching_single_task_network_experiment = [];

cued_task_switching_single_task_network_experiment.push(practiceNode);
cued_task_switching_single_task_network_experiment.push(feedback_block);

cued_task_switching_single_task_network_experiment.push(start_test_block)
cued_task_switching_single_task_network_experiment.push(testNode);
cued_task_switching_single_task_network_experiment.push(feedback_block);

cued_task_switching_single_task_network_experiment.push(post_task_block)
cued_task_switching_single_task_network_experiment.push(end_block)
