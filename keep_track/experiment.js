/* ************************************ */
/* Define helper functions */
/* ************************************ */
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

var randomDraw = function(lst) {
	var index = Math.floor(Math.random() * (lst.length))
	return lst[index]
}

var getInstructFeedback = function() {
	return '<div class = centerbox><p class = center-block-text>' + feedback_instruct_text +
		'</p></div>'
}

/* ************************************ */
/* Define experimental variables */
/* ************************************ */
// generic task variables
var run_attention_checks = false
var attention_check_thresh = 0.65
var sumInstructTime = 0 //ms
var instructTimeThresh = 0 ///in seconds

// task specific variables
var categories = ['animals', 'colors', 'countries', 'distances', 'metals', 'relatives']
var exemplars = {
	'animals': ['fish', 'bird', 'snake', 'cow', 'whale'],
	'colors': ['red', 'yellow', 'green', 'blue', 'brown'],
	'countries': ['China', 'US', 'England', 'India', 'Brazil'],
	'distances': ['mile', 'kilometer', 'meter', 'foot', 'inch'],
	'metals': ['iron', 'titanium', 'aluminum', 'lead', 'brass'],
	'relatives': ['mother', 'father', 'brother', 'sister', 'aunt']
}

var difficulty_order = jsPsych.randomization.shuffle([3, 4, 5])
var num_blocks = 3 //per difficulty level
var blocks = []
var targets = []
var practice_block = []
var practice_targets = []
var last_targets = {}

/* Draw 2 or 3 exemplars from each of six categories totalling 15 exemplars for each block. Start
with a practice block (difficulty = 3). Then present 3 test blocks for each difficulty level, where each difficulty level has a different number
 of target categories (randomly drawn)
*/
var target_categories = jsPsych.randomization.repeat(categories, 1, false).slice(0, 3) //select the target categories
var block_exemplars = []
var cat_repeats = jsPsych.randomization.repeat([2, 2, 2, 3, 3, 3], 1, false) //determines how many exemplars from each category to select for this block
for (var cat = 0; cat < categories.length; cat++) {
	var exemplars_to_add = jsPsych.randomization.repeat(exemplars[categories[cat]], 1, false).slice(0,
		cat_repeats[cat])
	var items = []
	exemplars_to_add.forEach(function(entry) {
		items.push([categories[cat]].concat(entry))
	})
	block_exemplars = block_exemplars.concat(items)
}
practice_block.push(jsPsych.randomization.repeat(block_exemplars, 1, false))
practice_targets.push(target_categories)

for (var i = 0; i < difficulty_order.length; i++) {
	for (var b = 0; b < num_blocks; b++) {
		var target_categories = jsPsych.randomization.repeat(categories, 1, false).slice(0,
				difficulty_order[i]) //select the target categories
		var block_exemplars = []
		var cat_repeats = jsPsych.randomization.repeat([2, 2, 2, 3, 3, 3], 1, false) //determines how many exemplars from each category to select for this block
		for (var cat = 0; cat < categories.length; cat++) {
			var exemplars_to_add = jsPsych.randomization.repeat(exemplars[categories[cat]], 1, false).slice(
				0, cat_repeats[cat])
			var items = []
			exemplars_to_add.forEach(function(entry) {
				items.push([categories[cat]].concat(entry))
			})
			block_exemplars = block_exemplars.concat(items)
		}
		blocks.push(jsPsych.randomization.repeat(block_exemplars, 1, false))
		targets.push(target_categories)
	}
}

/* ************************************ */
/* Set up jsPsych blocks */
/* ************************************ */
// Set up attention check node
var attention_check_block = {
	type: 'attention-check',
	data: {
		trial_id: 'attention_check'
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
var category_instructions = '<ul class = list-text>' +
	'<li><strong>animals</strong>: fish, bird, snake, cow, whale</li>' +
	'<li><strong>colors</strong>: red, yellow, green, blue, brown</li>' +
	'<li><strong>countries</strong>: China, US, England, India, Brazil</li>' +
	'<li><strong>distances</strong>: mile, kilometer, meter, foot, inch</li>' +
	'<li><strong>metals</strong>: iron, titanium, aluminum, lead, brass</li>' +
	'<li><strong>relatives</strong>: mother, father, brother, sister, aunt</li>'


var feedback_instruct_text =
	'Welcome to the experiment. This expeirment will take around 6 minutes. Press <strong>enter</strong> to begin.'
var feedback_instruct_block = {
	type: 'poldrack-text',
	cont_key: [13],
	data: {
		trial_id: 'instruction'
	},
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
		'<div class = centerbox><p class = block-text>In this experiment you will see a sequence of words presented one at time. These words will fall into one of six cateogries: animals, colors, countries, distances, metals and relatives.</p><p class = block-text>3 to 5 of these categories will be "target" categories presented on the screen. Your goal is to remember the <strong>last</strong> word shown from each of the target categories and type them at the end of the trial.</p></div>',
		'<div class = centerbox><p class = block-text>To make sure there is no confusion about which word is in each category, the words in each category are presented below: ' +
		category_instructions +
		'</p><p class = block-text>Make sure you know which category each word belongs to.</p></div>',
		'<div class = centerbox><p class = block-text>To summarize, a trial will start by presenting you with 3-5 target categories (e.g. "colors, animals, relatives"). You will then see a sequence of words from all six categories, one after the other.</p><p class = block-text>For instance, a trial may end with: "... dog"... "aunt"... "China"... "red"... "titanium"... "bird". You have to remember the last word in each of the target categories, which you will write down at the end of the trial.</p><p class = block-text>For the example sequence with the previously mentioned targets, you  would respond "red, aunt, bird" as those were the last colors, relatives, and animals, respectively. The order that you write the categories down does not matter.</p><p class = block-text>After you end instructions you will complete a practice block of trials.</p></div>',
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

var end_block = {
	type: 'poldrack-text',
	timing_response: 180000,
	data: {
		trial_id: 'end',
		exp_id: 'keep_track'
	},
	text: '<div class = centerbox><p class = center-block-text>Thanks for completing this task!</p><p class = center-block-text>Press <strong>enter</strong> to continue.</p></div>',
	cont_key: [13],
	timing_post_trial: 0
};

var end_practice_block = {
	type: 'poldrack-text',
	timing_response: 180000,
	data: {
		trial_id: 'practice_end'
	},
	text: '<div class = centerbox><p class = center-block-text>Finished with practice block. You will now complete 9 test blocks.</p><p class = center-block-text>Press <strong>enter</strong> to begin.</p></div>',
	cont_key: [13],
	timing_post_trial: 1000
};

var start_test_block = {
	type: 'poldrack-text',
	timing_response: 180000,
	data: {
		trial_id: 'test_intro'
	},
	text: '<div class = centerbox><p class = center-block-text>Starting a test block.</p><p class = center-block-text>Press <strong>enter</strong> to begin.</p></div>',
	cont_key: [13],
	timing_post_trial: 1000,
	on_finish: function() {
		last_targets = {}
	}
};


//Set up experiment
var keep_track_experiment = []
keep_track_experiment.push(instruction_node);

// set up practice
block = practice_block[0]
target = practice_targets[0]
prompt = '<div class = promptbox><div class = prompt-text>Targets: ' + target.join(', ') +
	'</div></div>'
data = {
	trial_id: 'prompt',
	exp_stage: "practice",
	load: target.length,
	targets: target
}
var prompt_block = {
	type: 'poldrack-single-stim',
	stimulus: '<div class = centerbox><p class = block-text>Below are the target categories. They will remain on the bottom of the screen during the trial. Press enter when you are sure you can remember them. </p></div>',
	is_html: true,
	choices: [13],
	response_ends_trial: true,
	data: data,
	prompt: prompt,
	timing_post_trial: 1000,
}
var wait_block = {
	type: 'poldrack-single-stim',
	stimulus: ' ',
	is_html: true,
	data: {
		trial_id: 'wait',
		exp_stage: 'practice'
	},
	choices: 'none',
	prompt: prompt,
	timing_stim: 500,
	timing_response: 500,
	timing_post_trial: 0,
}
keep_track_experiment.push(prompt_block)
keep_track_experiment.push(wait_block)

// set up practice blocks
for (i = 0; i < block.length; i++) {
	stim = '<div class = centerbox><div class = keep-track-text>' + block[i][1] + '</div></div>'
	data = {
		trial_id: 'stim',
		category: block[i][0],
		exp_stage: "practice",
		load: target.length,
		targets: target,
		stim: block[i][1]
	}
	var track_block = {
		type: 'poldrack-single-stim',
		stimulus: stim,
		is_html: true,
		choices: 'none',
		data: data,
		timing_response: 1500,
		timing_stim: 1500,
		prompt: prompt,
		timing_post_trial: 0,
		on_finish: function(data) {
			if ($.inArray(data.category, data.targets) != -1) {
				last_targets[data.category] = data.stim
			}
		}
	}
	keep_track_experiment.push(track_block)
}
var response_block = {
	type: 'survey-text',
	questions: [['<p class = center-block-text>What was the last word in each of the target categories? Please separate your words with a space</p>']
	],
	data: {
		trial_id: 'response',
		exp_stage: "practice",
		load: target.length,
		targets: target
	},
	on_finish: function() {
		jsPsych.data.addDataToLastTrial({'correct_responses': last_targets})
	}
}
keep_track_experiment.push(response_block)
keep_track_experiment.push(attention_node)
keep_track_experiment.push(end_practice_block)


// set up test blocks
for (b = 0; b < blocks.length; b++) { 
	keep_track_experiment.push(start_test_block)
	block = blocks[b]
	target = targets[b]
	prompt = '<div class = promptbox><div class = prompt-text>Targets: ' + target.join(', ') +
		'</div></div>'
	data = {
		trial_id: 'prompt',
		exp_stage: "test",
		load: target.length,
		targets: target
	}
	var prompt_block = {
		type: 'poldrack-single-stim',
		stimulus: '<div class = centerbox><p class = block-text>Below are the target categories. They will remain on the bottom of the screen during the trial. Press enter when you are sure you can remember them. </p></div>',
		is_html: true,
		choices: [13],
		data: data,
		prompt: prompt,
		timing_post_trial: 1000,
		response_ends_trial: true
	}
	var wait_block = {
		type: 'poldrack-single-stim',
		stimulus: ' ',
		is_html: true,
		choices: 'none',
		data: {
			trial_id: 'wait',
			exp_stage: 'test'
		},
		prompt: prompt,
		timing_stim: 500,
		timing_response: 500,
		timing_post_trial: 0,
	}
	keep_track_experiment.push(prompt_block)
	keep_track_experiment.push(wait_block)
	for (i = 0; i < block.length; i++) {
		stim = '<div class = centerbox><div class = keep-track-text>' + block[i][1]+ '</div></div>'
		data = {
			trial_id: 'stim',
			category: block[i][0],
			exp_stage: "test",
			load: target.length,
			targets: target,
			stim: block[i][1]
		}
		var track_block = {
			type: 'poldrack-single-stim',
			stimulus: stim,
			is_html: true,
			choices: 'none',
			data: data,
			timing_response: 1500,
			timing_stim: 1500,
			prompt: prompt,
			timing_post_trial: 0,
			on_finish: function(data) {
				if ($.inArray(data.category, data.targets) != -1) {
					last_targets[data.category] = data.stim
				}
			}
		}
		keep_track_experiment.push(track_block)
	}
	var response_block = {
		type: 'survey-text',
		questions: [['<p class = center-block-text>What was the last word in each of the target categories? Please separate your words with a space</p>']],
		data: {
			trial_id: 'response',
			exp_stage: 'test',
			load: target.length,
			targets: target
		},
		on_finish: function() {
			jsPsych.data.addDataToLastTrial({'correct_responses': last_targets})
		}
	}
	keep_track_experiment.push(response_block)
	if ($.inArray(b, [0, 2]) != -1) {
		keep_track_experiment.push(attention_node)
	}
}

keep_track_experiment.push(post_task_block)
keep_track_experiment.push(end_block)