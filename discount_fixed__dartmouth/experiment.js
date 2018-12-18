/* ************************************ */
/* Define helper functions */
/* ************************************ */
function addID() {
  jsPsych.data.addDataToLastTrial({exp_id: 'discount_fixed__dartmouth'})
}

practice_ITIs = [0,0.136,0.136,0.612]

var practice_get_ITI = function() {
  return 4500 + practice_ITIs.shift()*1000
}

test_ITIs = [0.816,0.068,0.136,0.408,0.0,0.476,0.408,0.068,0.0,1.7,0.204,0.544,0.544,0.68,0.476,0.272,0.272,0.68,0.68,0.748,0.068,0.0,0.408,0.068,1.7,0.408,0.748,0.544,0.136,0.204,0.136,0.068,0.068,0.408,0.34,0.748,0.272,1.496,1.088,0.068,0.612,1.156,0.068,0.272,0.544,0.34,0.68,0.544,0.476,0.476,0.816,0.0,0.544,0.204,0.34,2.244,0.0,0.068,0.204,0.408,0.068,0.272,0.136,0.068,0.952,0.884,0.068,1.768,1.02,0.068,0.136,0.136,0.612,0.816,0.068,0.068,0.068,0.34,0.0,1.156,0.408,0.136,0.0,0.0,0.612,1.632,0.34,0.068,0.204,1.36,0.136,0.816,0.476,0.068,1.02,1.088,1.292,0.068,0.612,0.0,0.34,0.068,0.884,0.544,0.204,0.408,0.408,0.34,0.612,0.612,0.204,0.34,0.34,2.38,0.068,0.272,2.516,0.204,0.68,0.544]

var test_get_ITI = function() {
  return 4500 + test_ITIs.shift()*1000
}

 var randomDraw = function(lst) {
  var index = Math.floor(Math.random() * (lst.length))
  return lst[index]
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
  jsPsych.data.addDataToLastTrial({"att_check_percent": check_percent})
  return check_percent
}


function assessPerformance() {
	var experiment_data = jsPsych.data.getTrialsOfType('poldrack-single-stim')
	var missed_count = 0
	var trial_count = 0
	var rt_array = []
	var rt = 0
	var correct = 0
		
		//record choices participants made
	var choice_counts = {}
	choice_counts[-1] = 0
	choice_counts[37] = 0
	choice_counts[40] = 0
	
	for (var i = 0; i < experiment_data.length; i++) {
		if (experiment_data[i].trial_id == 'test_trial') {
			trial_count += 1
			
			if (experiment_data[i].rt != -1){
				rt = experiment_data[i].rt
				rt_array.push(rt)
				key = experiment_data[i].key_press
				choice_counts[key] += 1
				if (experiment_data[i].key_press == experiment_data[i].correct_response){
					correct += 1
				}
			} else if (experiment_data[i].rt != -1){
				rt = experiment_data[i].rt
				rt_array.push(rt)
			} else if (experiment_data[i].rt == -1){
				missed_count += 1
			}
		}
	}

	//calculate average rt
	var avg_rt = -1
	if (rt_array.length !== 0) {
		avg_rt = math.median(rt_array)
	} 
	var missed_percent = missed_count/trial_count
	credit_var = (missed_percent < 0.25 && avg_rt > 200)
	jsPsych.data.addDataToLastTrial({"credit_var": credit_var})
}
/* ************************************ */
/* Define experimental variables */
/* ************************************ */
// generic task variables
var sumInstructTime = 0 //ms
var instructTimeThresh = 0 ///in seconds
var credit_var = 0
var run_attention_checks = true

// task specific variables
var choices = [37, 40]
var bonus_list = [] //keeps track of choices for bonus
/////////////////////////////////hard coded options for practice
var practice_options = {
  small_amt: [20,20,20,20],
  large_amt: [50, 100, 100, 30],
  later_del: [40, 40, 80, 20]
}

var practice_stim_html = []

//loop through each option to create html
for (var i = 0; i < practice_options.small_amt.length; i++) {
  practice_stim_html[i] =
      '<div class = dd-stim><div class = amtbox style = "color:white">$'+practice_options.large_amt[i]+'</div><br><br>'+
      '<div class = delbox style = "color:white">'+ practice_options.later_del[i]+' days</div></div>'
}

practice_data_prop = []

for (var i = 0; i < practice_options.small_amt.length; i++) {
  practice_data_prop.push({
    small_amount: practice_options.small_amt[i],
    large_amount: practice_options.large_amt[i],
    later_delay: practice_options.later_del[i]
  });
}

practice_trials = []

//used new features to include the stimulus properties in recorded data
for (var i = 0; i < practice_stim_html.length; i++) { 
  practice_trials.push({
    stimulus: practice_stim_html[i],
    data: practice_data_prop[i]
  });
}

/////////////////////////////////hard coded options for test
test_options = {
  small_amt: [20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20],
  large_amt: [77,50,43,71,75,36,36,50,73,33,69,63,39,66,23,41,45,39,44,80,30,23,24,40,25,57,49,78,67,25,27,44,54,28,45,71,32,31,43,78,67,79,66,22,54,77,24,80,77,23,55,28,83,29,58,32,33,23,55,22,27,58,28,65,25,74,74,56,41,65,62,71,23,48,64,81,58,60,66,25,35,29,32,45,30,27,76,23,67,56,58,72,34,28,43,41,34,65,82,52,39,24,61,31,54,24,67,45,29,50,41,33,70,42,25,85,58,24,75,49],
  later_del: [161, 59, 38,176, 60,114,140, 41, 44, 78,172, 37, 95, 58, 61,129,157,161,143,145, 36,134, 87,159,141, 89,140,108, 74,108, 91, 92, 23, 59,107, 88,111, 76,120,129, 41, 92,145, 21, 22,142,139, 39, 24,110,163,132,105, 44, 72, 57,103, 42,107, 27,142, 36,163,156,176, 52,121,172, 55,137,180, 76,176,128, 89, 58, 55,124, 71, 70,171, 75, 74, 72, 23,130,161, 77,103, 93, 53, 95,176,123, 19,174, 43,159, 74,139,104, 38,141, 74,126,125, 23, 26, 58,129, 27,163,108,145, 74,129, 73, 89, 41,172]
}

var test_stim_index = [37,94,77,60,79,31,110,74,27,19,95,113,5,76,75,36,24,106,0,50,23,86,73,12,52,40,67,93,109,14,41,102,2,42,84,55,30,38,4,92,101,98,90,32,68,45,29,111,81,16,103,47,43,99,104,72,22,6,80,96,66,34,48,17,70,46,54,89,107,57,7,64,44,53,117,87,85,21,58,18,49,63,59,1,115,13,119,8,116,71,28,108,100,56,9,65,51,33,62,82,25,112,91,20,15,39,35,97,105,61,11,118,83,114,69,26,88,10,78,3]

test_stim_html = []

//loop through each option to create html
for (var i = 0; i < test_stim_index.length; i++) {
  var index = test_stim_index[i]
  test_stim_html[i] =
	  '<div class = dd-stim><div class = amtbox style = "color:white">$'+test_options.large_amt[index]+'</div><br><br>'+
	  '<div class = delbox style = "color:white">'+ test_options.later_del[index]+' days</div></div>'
}

test_data_prop = []

for (var i = 0; i < test_stim_index.length; i++) {
  index = test_stim_index[i]
  test_data_prop.push({
	small_amount: test_options.small_amt[index],
	large_amount: test_options.large_amt[index],
	later_delay: test_options.later_del[index]
  });
}

test_trials = []

//used new features to include the stimulus properties in recorded data
for (var i = 0; i < test_stim_html.length; i++) { 
  test_trials.push({
	stimulus: test_stim_html[i],
	data: test_data_prop[i]
  });
}

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

var instructions_block = {
	type: 'poldrack-instructions',
	data: {
		trial_id: "instruction"
	},
	pages:[
		'<div class = centerbox>'+
			'<p class = block-text>In this task you will choose between 2 hypothetical options.</p>' +
			
			'<p class = block-text>You will choose between <strong>$20 today</strong> or the <strong>presented option</strong>.</p>'+
			
			'<p class = block-text>Choosing one rejects the other.</p>'+
			
			'<p class = block-text>If you want the option on the screen, please press the left arrow key. If you want to accept 20$ today, press the down arrow key.</p>'+
		'</div>'		
	],
	allow_keys: false,
	show_clickable_nav: true,
	timing_post_trial: 500,
};

var start_test_block = {
  type: 'poldrack-single-stim',
  stimulus: '<div class = centerbox>'+
  				'<p class = block-text>Starting Test. Press enter to begin.</p>'+
  				
  				'<p class = block-text>As a reminder, in this task you will choose between 2 hypothetical options.</p>' +
			
				'<p class = block-text>You will choose between <strong>$20 today</strong> or the <strong>presented option</strong>.</p>'+
			
				'<p class = block-text>Choosing one rejects the other.</p>'+
			
				'<p class = block-text>If you want the option on the screen, please press the left arrow key. If you want to accept 20$ today, press the down arrow key.</p>'+
  			'</div>',
  is_html: true,
  choices: [13],
  response_ends_trial: true,
  timing_stim: 180000, 
  timing_response: 180000,
  data: {
    trial_id: "test_start_block"
  },
  timing_post_trial: 500,
  on_finish: function() {
    current_trial = 0
  }
};

var start_practice_block = {
  type: 'poldrack-single-stim',
  stimulus: '<div class = centerbox>'+
  				'<p class = block-text>Starting practice. Press enter to begin.</p>'+
  			'</div>',
  is_html: true,
  choices: [13],
  response_ends_trial: true,
  timing_stim: 180000, 
  timing_response: 180000,
  data: {
    trial_id: "test_start_block"
  },
  timing_post_trial: 500,
  on_finish: function() {
    current_trial = 0
  }
};

var rest_block = {
  type: 'poldrack-single-stim',
  stimulus: '<div class = centerbox>'+
  				'<p class = block-text>Take a short break! Press enter to begin.</p>'+
  				'<p class = block-text>If you want the option on the screen, please press the left arrow key. If you want to accept 20$ today, press the down arrow key.</p>'+
  			'</div>',
  is_html: true,
  choices: [13],
  response_ends_trial: true,
  timing_stim: 180000, 
  timing_response: 180000,
  data: {
    trial_id: "rest_block"
  },
  timing_post_trial: 500,
  on_finish: function() {
    current_trial = 0
  }
};

var end_block = {
	type: 'poldrack-single-stim',
	stimulus: '<div class = centerbox><div class = center-text><i>Fin</i></div></div>',
	is_html: true,
	choices: [32],
	timing_response: 180000,
	response_ends_trial: true,
	data: {
		trial_id: "end",
	},
	timing_post_trial: 0,
	on_finish: function(){
		assessPerformance()
		evalAttentionChecks()
		var bonus = randomDraw(bonus_list)
    	jsPsych.data.addDataToLastTrial({'bonus': bonus})
    }
};

//Set up post task questionnaire
var post_task_block = {
   type: 'survey-text',
   data: {
       trial_id: "post_task_questions"
   },
   questions: ['<p class = center-block-text style = "font-size: 20px">Please summarize what you were asked to do in this task.</p>',
              '<p class = center-block-text style = "font-size: 20px">Do you have any comments about this task?</p>'],
   rows: [15, 15],
   timing_response: 360000,
   columns: [60,60]
};

//Set up experiment
var discount_fixed__dartmouth_experiment = []
discount_fixed__dartmouth_experiment.push(instructions_block);

// practice portion
discount_fixed__dartmouth_experiment.push(start_practice_block);
for (i = 0; i < practice_options.small_amt.length; i++) {
  var practice_block = {
  type: 'poldrack-single-stim',
  data: {
    trial_id: "practice_trial",
    exp_stage: "practice"
  },
  stimulus: practice_trials[i].stimulus,
  timing_stim: 4000,
  timing_response: practice_get_ITI,  
  data: practice_trials[i].data,
  is_html: true,
  choices: choices,
  response_ends_trial: false,
  timing_post_trial: 0,
  on_finish: function(data) {
  	
    var choice = false;
    if (data.key_press == 37) {
      choice = 'larger_later';
      bonus_list.push({'amount': data.large_amount, 'delay': data.later_delay})
    } else if (data.key_press == 40) {
      choice = 'smaller_sooner';
      bonus_list.push({'amount': data.small_amount, 'delay': 0})
    }
    jsPsych.data.addDataToLastTrial({
      choice: choice
    });
  }
};

  discount_fixed__dartmouth_experiment.push(practice_block)
}


// test portion
discount_fixed__dartmouth_experiment.push(start_test_block);

for (x = 0; x < test_stim_index.length; x++) {
	var test_block = {
		type: 'poldrack-single-stim',
		data: {
		trial_id: "test_trial",
		exp_stage: "test"
		},
		stimulus: test_trials[x].stimulus,
		timing_stim: 4000,
		timing_response: test_get_ITI,  
		data: test_trials[x].data,
		is_html: true,
		choices: [choices[0][1], choices[1][1]],
		response_ends_trial: false,
		timing_post_trial: 0,
		on_finish: function(data) {
			var choice = false;
			if (data.key_press == choices[0][1]) {
			  choice = 'larger_later';
			  bonus_list.push({'amount': data.large_amount, 'delay': data.later_delay})
			} else if (data.key_press == choices[1][1]) {
			  choice = 'smaller_sooner';
			  bonus_list.push({'amount': data.small_amount, 'delay': 0})
			}
			jsPsych.data.addDataToLastTrial({
			  choice: choice
			});
		}
	};

	discount_fixed__dartmouth_experiment.push(test_block)
	if ((x%60 == 0) && (x > 0)) {
		discount_fixed__dartmouth_experiment.push(rest_block)
		discount_fixed__dartmouth_experiment.push(attention_node)
	}
}
discount_fixed__dartmouth_experiment.push(post_task_block);
discount_fixed__dartmouth_experiment.push(end_block);