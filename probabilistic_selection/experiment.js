/* ***************************************** */
/*          Define helper functions          */
/* ***************************************** */
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

var getInstructFeedback = function() {
	return '<div class = centerbox><p class = center-block-text>' + feedback_instruct_text +
		'</p></div>'
}

function assessPerformance() {
	/* Function to calculate the "credit_var", which is a boolean used to
	credit individual experiments in expfactory. */
	var experiment_data = jsPsych.data.getTrialsOfType('poldrack-single-stim')
	experiment_data = experiment_data.concat(jsPsych.data.getTrialsOfType('poldrack-categorize'))
	var missed_count = 0
	var trial_count = 0
	var rt_array = []
	var rt = 0
	//record choices participants made
	var choice_counts = {}
	choice_counts[-1] = 0
	for (var k = 0; k < choices.length; k++) {
		choice_counts[choices[k]] = 0
	}
	for (var i = 0; i < experiment_data.length; i++) {
		if (experiment_data[i].possible_responses != 'none') {
			trial_count += 1
			rt = experiment_data[i].rt
			key = experiment_data[i].key_press
			choice_counts[key] += 1
			if (rt == -1) {
				missed_count += 1
			} else {
				rt_array.push(rt)
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
	credit_var = (missed_percent < 0.4 && avg_rt > 200 && responses_ok)
	jsPsych.data.addDataToLastTrial({"credit_var": credit_var})
}

var getStim = function() {
	stim = firstPhaseStimsComplete.image.pop()
	curr_data = firstPhaseStimsComplete.data.pop()
	return stim;
}

var getData = function() {
	return curr_data
}

var getSecondPhaseStim = function() {
	stim = secondPhaseStimsComplete.image.pop()
	curr_data = secondPhaseStimsComplete.data.pop()
	return stim;
}

var getResponse = function() {
	return answers.pop()
}
var genResponses = function(stimuli) {
	var answers_80_20 = jsPsych.randomization.repeat([37, 37, 37, 37, 37, 37, 37, 37, 39, 39],
		eachComboNum / 10);
	var answers_20_80 = jsPsych.randomization.repeat([39, 39, 39, 39, 39, 39, 39, 39, 37, 37],
		eachComboNum / 10);
	var answers_70_30 = jsPsych.randomization.repeat([37, 37, 37, 37, 37, 37, 37, 39, 39, 39],
		eachComboNum / 10);
	var answers_30_70 = jsPsych.randomization.repeat([39, 39, 39, 39, 39, 39, 39, 37, 37, 37],
		eachComboNum / 10);
	var answers_60_40 = jsPsych.randomization.repeat([37, 37, 37, 37, 37, 37, 39, 39, 39, 39],
		eachComboNum / 10);
	var answers_40_60 = jsPsych.randomization.repeat([39, 39, 39, 39, 39, 39, 37, 37, 37, 37],
		eachComboNum / 10);

	var count1 = 0;
	var count2 = 0;
	var count3 = 0;
	var count4 = 0;
	var count5 = 0;
	var count6 = 0;

	var answers = [];
	for (var i = 0; i < FP_trials; i++) {

		if (stimuli.data[i].condition === '80_20') {
			answers.push(answers_80_20[count1]);
			count1 = count1 + 1;
		} else if (stimuli.data[i].condition === '20_80') {
			answers.push(answers_20_80[count2]);
			count2 = count2 + 1;
		} else if (stimuli.data[i].condition === '70_30') {
			answers.push(answers_70_30[count3]);
			count3 = count3 + 1;
		} else if (stimuli.data[i].condition === '30_70') {
			answers.push(answers_30_70[count4]);
			count4 = count4 + 1;
		} else if (stimuli.data[i].condition === '60_40') {
			answers.push(answers_60_40[count5]);
			count5 = count5 + 1;
		} else {
			answers.push(answers_40_60[count6]);
			count6 = count6 + 1;
		}
	}
	return answers;
};



/*************************************************************************/
/*                 DEFINE EXPERIMENTAL VARIABLES                         */
/*************************************************************************/
// generic task variables
var run_attention_checks = false
var attention_check_thresh = 0.45
var sumInstructTime = 0 //ms
var instructTimeThresh = 0 ///in seconds
var credit_var = true

// task specific variables
var choices = [37, 39]
var curr_data = []
var stim = ''
var current_trial = 0
/* SPECIFY HOW MANY TRIALS YOU WANT FOR FIRST PHASE, and SECOND PHASE.  FP=first(must be divisible by 60), SP=second(must be divisible by 22) */
var FP_trials = 60;
var SP_trials = 90;
var eachComboNum = FP_trials / 6; /* don't change this line */
var eachComboNumSP = SP_trials / 30; /* don't change this line */


/* THIS IS TO RANDOMIZE STIMS */
var stimArray = ["/static/experiments/probabilistic_selection/images/1.png",
	"/static/experiments/probabilistic_selection/images/2.png",
	"/static/experiments/probabilistic_selection/images/3.png",
	"/static/experiments/probabilistic_selection/images/4.png",
	"/static/experiments/probabilistic_selection/images/5.png",
	"/static/experiments/probabilistic_selection/images/6.png"
];
jsPsych.pluginAPI.preloadImages(stimArray)
var randomStimArray = jsPsych.randomization.repeat(stimArray, 1);
var stims = [['80', randomStimArray[0]],
			['20', randomStimArray[1]],
			['70', randomStimArray[2]],
			['30', randomStimArray[3]],
			['60', randomStimArray[4]],
			['40', randomStimArray[5]]]

firstPhaseStims = []

/* THIS IS FOR FIRST PHASE STIMS,  randomized and counterbalanced*/
for (var i = 0; i<3; i++) {
	var order1_stim = {}
	order1_stim.image = "<div class = decision-left><img src='" + stims[i*2][1] +
		"'></img></div><div class = decision-right><img src='" + stims[i*2+1][1] + "'></img></div>"
	order1_stim.data = {
		trial_id: 'stim',
		exp_stage: 'training',
		condition: stims[i*2][0] + '_' + stims[i*2+1][0],
		optimal_response: 37
	}
	var order2_stim = {}
	order2_stim.image = "<div class = decision-left><img src='" + stims[i*2+1][1] +
		"'></img></div><div class = decision-right><img src='" + stims[i*2][1] + "'></img></div>"
	order2_stim.data = {
		trial_id: 'stim',
		exp_stage: 'training',
		condition: stims[i*2+1][0] + '_' + stims[i*2][0],
		optimal_response: 39
	}
	firstPhaseStims.push(order1_stim)
	firstPhaseStims.push(order2_stim)
}


var firstPhaseStimsComplete = jsPsych.randomization.repeat(firstPhaseStims, eachComboNum, true);
var answers = genResponses(firstPhaseStimsComplete)
var curr_data = ''

/*THIS IS FOR SECOND PHASE STIMS, randomized and counterbalanced*/
secondPhaseStims = []
for (var i = 0; i<5; i++) {
	for (var j = i+1; j < 6; j++) {
		var order1_stim = {}
		order1_stim.image = "<div class = decision-left><img src='" + stims[i][1] +
			"'></img></div><div class = decision-right><img src='" + stims[j][1] + "'></img></div>"
		var optimal_response1 = choices[stims[i][0] < stims[j][0] ? 1 : 0]
		order1_stim.data = {
			trial_id: 'stim',
			exp_stage: 'test',
			condition: stims[i][0] + '_' + stims[j][0],
			optimal_response: optimal_response1
		}
		var order2_stim = {}
		order2_stim.image = "<div class = decision-left><img src='" + stims[j][1] +
			"'></img></div><div class = decision-right><img src='" + stims[i][1] + "'></img></div>"
		var optimal_response2 = choices[stims[i][0] > stims[j][0] ? 1 : 0]
		order2_stim.data = {
			trial_id: 'stim',
			exp_stage: 'test',
			condition: stims[j][0] + '_' + stims[i][0],
			optimal_response: optimal_response2
		}
		secondPhaseStims.push(order1_stim)
		secondPhaseStims.push(order2_stim)
	}
}

var secondPhaseStimsComplete = jsPsych.randomization.repeat(secondPhaseStims, eachComboNumSP, true);



/* This is to end the training while loop, if the subject has reached 6 training blocks */
var training_count = 0;



/* ************************************ */
/*         Set up jsPsych blocks        */
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
       trial_id: "post task questions"
   },
   questions: ['<p class = center-block-text style = "font-size: 20px">Please summarize what you were asked to do in this task.</p>',
              '<p class = center-block-text style = "font-size: 20px">Do you have any comments about this task?</p>'],
   rows: [15, 15],
   columns: [60,60]
};

/* define static blocks */
var feedback_instruct_text =
	'Welcome to the experiment. This experiment will take about 14 minutes. Press <strong>enter</strong> to begin.'
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
		'<div class = centerbox><p class = block-text>This experiment is composed of two phases.  During the first phase, you will be presented with one of three pairs of abstract shapes.  For each pair, you must choose one of the shapes by pressing either the <strong>left</strong> or <strong>right arrow key</strong> to correspond with the left or right image respectively.</p><p class = block-text>Each shape has a different chance of being correct. Your task is to maximize your points by selecting the shape with the higher probability of being correct on each trial.</p></div>',
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
			feedback_instruct_text = 'Done with instructions. Press <strong>enter</strong> to continue.'
			return false
		}
	}
}

var FP_block = {
	type: 'poldrack-text',
	data: {
		trial_id: "first_phase_intro"
	},
	timing_response: 180000,
	text: '<div class = centerbox><p class = center-block-text> We will now begin Phase 1.  Press <strong>enter</strong> to begin. </p></div>',
	cont_key: [13],
	timing_post_trial: 1000
};


training_trials = []
for (i = 0; i < 60; i++) {
	var training_block = {
		type: 'poldrack-categorize',
		stimulus: getStim,
		key_answer: getResponse,
		choices: choices,
		correct_text: '<div class = bottombox><div style="color:green"; class = center-text>Correct!</div></div>',
		incorrect_text: '<div class = bottombox><div style="color:red"; class = center-text>Incorrect</div></div>',
		timeout_message: '<div class = bottombox><div class = center-text>no response detected</div></div>',
		timing_stim: 4000,
		timing_response: 4000,
		timing_feedback_duration: 750,
		response_ends_trial: true,
		timing_post_trial: 500,
		is_html: true,
		data: getData,
		on_finish: function(data) {
			choice = choices.indexOf(data.key_press)
			stims = data.condition.split('_')
			chosen_stim = stims[choice]
			correct = false
			if (data.key_press == data.optimal_response){
				correct = true
			}
			jsPsych.data.addDataToLastTrial({
				'feedback': data.correct,
				'correct': correct,
				'stim_chosen': chosen_stim,
				'trial_num': current_trial
			})
			current_trial += 1
		}
	};
	training_trials.push(training_block)
}



var performance_criteria = {
	timeline: training_trials,
	loop_function: function(data) {
		var ab_total_correct = 0;
		var cd_total_correct = 0;
		var ef_total_correct = 0;
		var ab_cum_trials = 0;
		var cd_cum_trials = 0;
		var ef_cum_trials = 0;
		for (var i = 0; i < data.length; i++) {
			if (data[i].condition == "80_20" || data[i].condition == "20_80" ) {
				ab_cum_trials = ab_cum_trials + 1;
				if (data[i].key_press === data[i].optimal_response) {
					ab_total_correct = ab_total_correct + 1;
				}
			} else if (data[i].condition == "70_30" || data[i].condition == "30_70") {
				cd_cum_trials = cd_cum_trials + 1;
				if (data[i].key_press === data[i].optimal_response) {
					cd_total_correct = cd_total_correct + 1;
				}
			} else if (data[i].condition == "60_40" || data[i].condition == "40_60") {
				ef_cum_trials = ef_cum_trials + 1;
				if (data[i].key_press === data[i].optimal_response) {
					ef_total_correct = ef_total_correct + 1;
				}
			}
		}
		var ab_percent = ab_total_correct / ab_cum_trials
		var cd_percent = cd_total_correct / cd_cum_trials
		var ef_percent = ef_total_correct / ef_cum_trials
		training_count = training_count + 1;

		if ((ab_percent > 0.7 && cd_percent > 0.65 && ef_percent > 0.5 && training_count > 3) || (
				training_count == 8)) {
			return false
		} else {
			firstPhaseStimsComplete = jsPsych.randomization.repeat(firstPhaseStims, eachComboNum, true);
			answers = genResponses(firstPhaseStimsComplete)
			return true
		}

	}
};



var SP_block = {
	type: 'poldrack-text',
	timing_response: 180000,
	data: {
		trial_id: "second_phase_intro"
	},
	text: '<div class = centerbox><p class = block-text>We will now begin Phase 2.</p><p class = block-text> For this phase, you must again choose between pairs of shapes. Press the <strong>right</strong> arrow key to choose the image on the right, and the <strong>left</strong> arrow key to choose the image on the left.</p><p class = block-text>In this phase there will be no visual feedback, but your are still earning points. Your task is still to choose the shape that has the higher probability of being correct to maximize your points. If you are not sure how to respond, use your gut instinct.</p><p class = block-text> Press <strong> Enter </strong> when you are ready.</p></div>',
	cont_key: [13],
	on_finish: function() {
		current_trial = 0
	}
};


var second_phase_trials = {
	type: 'poldrack-single-stim',
	stimulus: getSecondPhaseStim,
	is_html: true,
	data: getData,
	choices: choices,
	timing_stim: 2500,
	timing_response: 2500,
	timing_post_trial: 500,
	on_finish: function(data) {
		choice = choices.indexOf(data.key_press)
		stims = data.condition.split('_')
		chosen_stim = stims[choice]
		correct = false
		if (data.key_press == data.optimal_response){
			correct = true
		}
		jsPsych.data.addDataToLastTrial({
			'correct': correct,
			'stim_chosen': chosen_stim,
			'trial_num': current_trial
		})
		current_trial += 1
	}
};


var end_block = {
	type: 'poldrack-text',
	data: {
		trial_id: "end",
		exp_id: 'probabilistic_selection'
	},
	timing_response: 180000,
	text: '<div class = centerbox><p class = center-block-text>Finished with this task!</p><p class = center-block-text>Press <strong>enter</strong> to continue.</p></div>',
	cont_key: [13],
	on_finish: assessPerformance
};



/* create experiment definition array */
var probabilistic_selection_experiment = [];
probabilistic_selection_experiment.push(instruction_node);
probabilistic_selection_experiment.push(FP_block);
probabilistic_selection_experiment.push(performance_criteria);
probabilistic_selection_experiment.push(attention_node);
probabilistic_selection_experiment.push(SP_block);
for(var i = 0; i<SP_trials; i++){
	probabilistic_selection_experiment.push(second_phase_trials);
}
probabilistic_selection_experiment.push(attention_node);
probabilistic_selection_experiment.push(post_task_block)
probabilistic_selection_experiment.push(end_block);