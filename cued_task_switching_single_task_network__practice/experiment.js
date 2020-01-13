/* ************************************ */
/* Define helper functions */
/* ************************************ */

//Functions added for in-person sessions
function genITIs() { 
	mean_iti = 0.5 //mean and standard deviation of 0.5 secs
	min_thresh = 0
	max_thresh = 4

	lambda = 1/mean_iti
	iti_array = []
	for (i=0; i < exp_len +numTestBlocks ; i++) { //add 3 ITIs per test block to make sure there are enough
		curr_iti = - Math.log(Math.random()) / lambda;
		while (curr_iti > max_thresh || curr_iti < min_thresh) {
			curr_iti = - Math.log(Math.random()) / lambda;
		}
		iti_array.push(curr_iti*1000) //convert ITIs from seconds to milliseconds

	}
	return(iti_array)
}

function getITI_stim() { //added for fMRI compatibility
	var currITI = ITIs_stim.shift()
	return currITI
}

function getITI_resp() { //added for fMRI compatibility
	var currITI = ITIs_resp.shift()
	return currITI
}


//feedback functions added for practice version
var getPracticeFeedback = function() { 
	return '<div class = bigbox><div class = picture_box><p class = instruct-text><font color="white">' + practice_feedback_text + '</font></p></div></div>'
}

var getPracticeTrialID = function() {
	return practice_trial_id
}

var getPracticeFeedbackTiming = function() {
	return practice_feedback_timing
}

var getPracticeResponseEnds = function() {
	return practice_response_ends
}

//functions from original script
function addID() {
  jsPsych.data.addDataToLastTrial({exp_id: 'cued_task_switching_single_task_network__practice'})
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
var sumInstructTime = 0 //ms
var instructTimeThresh = 0 ///in seconds
var credit_var = 0

// task specific variables
var response_keys = {key: [37,39], key_name: ["index finger","middle finger"]}
var choices = response_keys.key
var practice_length = 16 // must be divisible by 4
var refresh_length = 8 //must be divisible by 4
var exp_len = 208 //192 // must be divisible by 4
var numTrialsPerBlock = 52 //48 
var numTestBlocks = exp_len / numTrialsPerBlock

var practice_thresh = 4 // was 3 blocks of 16 trials
var rt_thresh = 1000;
var missed_response_thresh = 0.10;
var accuracy_thresh = 0.75;

var fileTypePNG = ".png'></img>"
var preFileType = "<img class = center src='/static/experiments/cued_task_switching_single_task_network__practice/images/"

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

var task_list = '<ul><li><strong><i>Parity</i> or <i>Odd-Even</i>: Press your ' + response_keys.key_name[
    0] + ' key if even and your ' + response_keys.key_name[1] + ' key if odd.' +
  '</li><li><i>Magnitude</i> or <i>High-Low</i>: Press your ' + response_keys.key_name[
    0] + ' key if the number is greater than 5 and your ' + response_keys.key_name[1] +
  ' key if less than 5.</strong></li></ul>'

var prompt_task_list = '<ul style="text-align:left"><li><i>Parity</i> or <i>Odd-Even</i>: ' + response_keys.key_name[0] +
  ' if even and ' + response_keys.key_name[1] + ' if odd.' +
  '</li><li><i>Magnitude</i> or <i>High-Low</i>: ' + response_keys.key_name[0] +
  ' if >5 and ' + response_keys.key_name[1] + ' if <5.</li></ul>'


//PRE LOAD IMAGES HERE
var pathSource = "/static/experiments/cued_task_switching_single_task_network__practice/images/"
var numbersPreload = ['1','2','3','4','6','7','8','9']
var images = []
for(i=0;i<numbersPreload.length;i++){
  images.push(pathSource + numbersPreload[i] + '.png')
}

jsPsych.pluginAPI.preloadImages(images);

//ADDED FOR SCANNING
//fmri variables
var ITIs_stim = []
var ITIs_resp = []

//practice feedback variables
var practice_feedback_text = '<div class = instructbox><p class = instruct-text>In this task, you will have to respond to a sequence of numbers by pressing your middle and index fingers. How you respond to the numbers will depend on the current task, which can change every trial.</p>'+
'<p class = instruct-text>On some trials you will have to indicate whether the number is odd or even, and on other trials you will indicate whether the number is higher or lower than 5. Each trial will start with a cue telling you which task to do on that trial.</p>' +
'<p class = instruct-text>The cue before the number will be a word indicating the task. There will be four different cues indicating two different tasks. The cues and tasks are described below:</p>' +
task_list +
'<p class = instruct-text>During practice, you will see a reminder of the rules.  <i> This will be removed for the test</i>. </p>'+ 
'<p class = instruct-text>When you are ready to begin, please press the spacebar. </p>'+
'</div>'
var practice_trial_id = "instructions"
var practice_feedback_timing = -1
var practice_response_ends = true

/* ************************************ */
/* Set up jsPsych blocks */
/* ************************************ */

var intro_block = {
	type: 'poldrack-single-stim',
	data: {
		trial_id: "instructions"
	},
	choices: [32],
	stimulus: '<div class = centerbox><p class = center-block-text> Welcome to the task.</p></div>',
	timing_post_trial: 0,
	is_html: true,
	timing_response: -1,
	response_ends_trial: true, 

};



var practice_feedback_block = { //initially instructions block, becomes feedback after first practice block
	type: 'poldrack-single-stim',
	stimulus: getPracticeFeedback,
	data: {
		trial_id: getPracticeTrialID
	},
	choices: [32],

	timing_post_trial: 0,
	is_html: true,
	timing_response: -1, //10 seconds for feedback
	timing_stim: -1,
	response_ends_trial: true,
	on_finish: function() {
		practice_trial_id = "practice-no-stop-feedback"
		practice_feedback_timing = 10000
		practice_response_ends = false
		if (ITIs_stim.length===0) { //if ITIs haven't been generated, generate them!
			ITIs_stim = genITIs()
			ITIs_resp = ITIs_stim.slice(0) //make a copy of ITIs so that timing_stimulus & timing_response are the same
		}

	} 

};


var practice_end_block = {
  type: 'poldrack-text',
  data: {
    trial_id: "end",
  },
  text: '<div class = centerbox><p class = center-block-text>Thanks for completing this practice!</p></div>',
  cont_key: [32],
  timing_response: 10000,
  response_ends_trial: true,
  on_finish: function(){
    assessPerformance()
    }
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



//out of scanner practice trials
var practiceTrials = []
practiceTrials.push(practice_feedback_block)
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
    // prompt: '<div class = promptbox>' + prompt_task_list + '</div>',
    prompt: prompt_task_list,
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
    // prompt: '<div class = promptbox>' + prompt_task_list + '</div>',
    prompt: prompt_task_list,
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
    timeout_message: '<div class = upperbox><div class = center-text><font size = 20>Respond Faster!</font></div></div>' +
    prompt_task_list,
    correct_text: '<div class = upperbox><div class = center-text><font size = 20>Correct!</font></div></div>',
    incorrect_text: '<div class = upperbox><div class = center-text><font size = 20>Incorrect</font></div></div>',
    choices: choices,
    data: {
    trial_id: 'practice_trial'
    },
    timing_feedback_duration: 500, //500
    show_stim_with_feedback: false,
    timing_response: 2000, //2000
    timing_stim: 1000, //1000
    timing_post_trial: 0,
    // prompt: '<div class = promptbox>' + prompt_task_list + '</div>',
    prompt: prompt_task_list,
    on_finish: appendData,
    fixation_default: true,
    fixation_stim: '<div class = upperbox><div class = fixation>+</div></div><div class = lowerbox><div class = fixation>+</div></div>'
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
  
    practice_feedback_text = "<br>Please take this time to read your feedback and to take a short break!"

    if (accuracy > accuracy_thresh){
      practice_feedback_text +=
          '</p><p class = instruct-text>Done with this practice.' 
      
      task_switches = jsPsych.randomization.repeat(task_switches_arr, numTrialsPerBlock / 4)
      task_switches.unshift({task_switch: 'na', cue_switch: 'na', go_no_go_type: jsPsych.randomization.repeat(['go','nogo'],1).pop()})
      stims = genStims(numTrialsPerBlock + 1)
      return false
  
    } else if (accuracy < accuracy_thresh){
      practice_feedback_text +=
          '</p><p class = instruct-text>We are going to try practice again to see if you can achieve higher accuracy.  Remember: <br>' + prompt_task_list 
      if (missed_responses > missed_response_thresh){
        practice_feedback_text +=
            '</p><p class = instruct-text>You have been responding too slowly. Please respond as quickly and as accurately as possible.'
      }

      if (ave_rt > rt_thresh) {
        practice_feedback_text += 
            '</p><p class = instruct-text>You have been responding too slowly.'
      }
    
      if (practiceCount == practice_thresh){
        practice_feedback_text +=
          '</p><p class = instruct-text>Done with this practice.' 
          
          task_switches = jsPsych.randomization.repeat(task_switches_arr, numTrialsPerBlock / 4)
          task_switches.unshift({task_switch: 'na', cue_switch: 'na', go_no_go_type: jsPsych.randomization.repeat(['go','nogo'],1).pop()})
          stims = genStims(numTrialsPerBlock + 1)
          return false
      }
      
      practice_feedback_text +=
        '</p><p class = instruct-text>Redoing this practice. When you are ready to continue, please press the spacebar.' 
      
      return true
    
    }
    
  }
}




/* create experiment definition array */
var cued_task_switching_single_task_network__practice_experiment = [];

//out of scanner practice
cued_task_switching_single_task_network__practice_experiment.push(intro_block)
cued_task_switching_single_task_network__practice_experiment.push(practiceNode);
cued_task_switching_single_task_network__practice_experiment.push(practice_feedback_block);
cued_task_switching_single_task_network__practice_experiment.push(practice_end_block)



