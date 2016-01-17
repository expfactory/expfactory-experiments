/* ************************************ */
/* Define helper functions */
/* ************************************ */
var randomDraw = function(lst) {
    var index = Math.floor(Math.random()*(lst.length))
    return lst[index]
}

/* ************************************ */
/* Define experimental variables */
/* ************************************ */
var categories = ['animals', 'colors', 'countries', 'distances', 'metals', 'relatives']
var exemplars = {
	'animals': ['fish', 'bird', 'snake', 'cow', 'whale'],
	'colors': ['red', 'yellow','green','blue', 'brown'],
	'countries': ['China', 'US', 'England', 'India', 'Brazil'],
	'distances': ['mile', 'kilometer', 'meter', 'foot', 'inch'],
	'metals': ['iron', 'copper', 'aluminum', 'lead', 'brass'],
	'relatives': ['mother', 'father', 'brother', 'sister', 'aunt']
}

var difficulty_order = jsPsych.randomization.shuffle([3,4,5])
var num_blocks = 3 //per difficulty level
var trial_length = 15 //variable never used, just for reference
var blocks = []
var targets = []
var practice_block = []
var practice_targets = []

/* Draw 2 or 3 exemplars from each of six categories totalling 15 exemplars for each block. Start
with a practice block (difficulty = 3). Then present 3 test blocks for each difficulty level, where each difficulty level has a different number
 of target categories (randomly drawn)
*/
var target_categories = jsPsych.randomization.repeat(categories,1,false).slice(0,3) //select the target categories
var block_exemplars = []
var cat_repeats = jsPsych.randomization.repeat([2,2,2,3,3,3],1,false) //determines how many exemplars from each category to select for this block
for (var cat = 0; cat<categories.length; cat++) {
	var exemplars_to_add = jsPsych.randomization.repeat(exemplars[categories[cat]],1,false).slice(0,cat_repeats[cat])
	var items = []
	exemplars_to_add.forEach(function(entry){
		items.push([categories[cat]].concat(entry))
	})
	block_exemplars = block_exemplars.concat(items)
}
practice_block.push(jsPsych.randomization.repeat(block_exemplars,1,false))
practice_targets.push(target_categories)

for (var i = 0; i<difficulty_order.length; i++) {
	for (var b = 0; b<num_blocks; b++) {
		var target_categories = jsPsych.randomization.repeat(categories,1,false).slice(0,difficulty_order[i]) //select the target categories
		var block_exemplars = []
		var cat_repeats = jsPsych.randomization.repeat([2,2,2,3,3,3],1,false) //determines how many exemplars from each category to select for this block
		for (var cat = 0; cat<categories.length; cat++) {
			var exemplars_to_add = jsPsych.randomization.repeat(exemplars[categories[cat]],1,false).slice(0,cat_repeats[cat])
			var items = []
			exemplars_to_add.forEach(function(entry){
				items.push([categories[cat]].concat(entry))
			})
			block_exemplars = block_exemplars.concat(items)
		}
		blocks.push(jsPsych.randomization.repeat(block_exemplars,1,false))
		targets.push(target_categories)
	}
}

/* ************************************ */
/* Set up jsPsych blocks */
/* ************************************ */
/* define static blocks */

var welcome_block = {
	
  type: 'text',
  text: '<div class = centerbox><p class = block-text>Welcome to the experiment. Press <strong>enter</strong> to begin.</p></div>',
  cont_key: [13],
  timing_post_trial: 0
};

var category_instructions = '<ul class = list-text>' +
	'<li><strong>animals</strong>: fish, bird, snake, cow, whale</li>' +
	'<li><strong>colors</strong>: red, yellow, green, blue, brown</li>' +
	'<li><strong>countries</strong>: China, US, England, India, Brazil</li>' +
	'<li><strong>distances</strong>: mile, kilometer, meter, foot, inch</li>' +
	'<li><strong>metals</strong>: iron, copper, aluminum, lead, brass</li>' +
	'<li><strong>relatives</strong>: mother, father, brother, sister, aunt</li>'

	
var instructions_block = {
  type: 'poldrack-instructions',
  pages: [
    '<div class = centerbox><p class = block-text>In this experiment you will see a sequence of words presented one at time. These words will fall into one of six cateogries: animals, colors, countries, distances, metals and relatives.</p><p class = block-text>3 to 5 of these cateogries will be "target" categories presented at the bottom of the screen. Your job is to remember the <strong>last</strong> word shown from each of the target categories and report them at the end of the trial.</p></div>',
	'<div class = centerbox><p class = block-text>The words in each category are presented below: ' + category_instructions + '</p></div>',
	'<div class = centerbox><p class = block-text>To summarize, a trial will start by presenting you with 3-5 target categories (e.g. "colors, animals, relatives"). You will then see a sequence of words from all six categories, one after the other.</p><p class = block-text>For instance, a trial may be: "dog"... "aunt"... "China"... "red"... "copper"... "bird"... etc. You have to remember the last word in each of the target categories, which you will write down at the end of the trial.</p><p class = block-text>For the example sequence with the previously mentioned targets, you  would respond "red, aunt, bird" as those were the last colors, relatives, and animals, respectively. The order that you write the categories down does not matter.</p></div>',
  ],
  allow_keys: false,
  show_clickable_nav: true,
  timing_post_trial: 1000
};

var end_block = {
  type: 'text',
  text: '<div class = centerbox><p class = center-block-text>Thanks for completing this task!</p><p class = center-block-text>Press <strong>enter</strong> to continue.</p></div>',
  cont_key: [13],
  timing_post_trial: 0
};

var start_practice_block = {
  type: 'text',
  text: '<div class = centerbox><p class = center-block-text>Starting a practice block.</p><p class = center-block-text>Press <strong>enter</strong> to begin.</p></div>',
  cont_key: [13],
  timing_post_trial: 1000
};

var end_practice_block = {
  type: 'text',
  text: '<div class = centerbox><p class = block-text>Finished with practice block. You will now complete 9 test blocks.</p><p class = block-text>Press <strong>enter</strong> to begin.</p></div>',
  cont_key: [13],
  timing_post_trial: 1000
};

var start_test_block = {
  type: 'text',
  text: '<div class = centerbox><p class = center-block-text>Starting a test block.</p><p class = center-block-text>Press <strong>enter</strong> to begin.</p></div>',
  cont_key: [13],
  timing_post_trial: 1000
};


//Set up experiment
var keep_track_experiment = []
keep_track_experiment.push(welcome_block);
keep_track_experiment.push(instructions_block);

// set up practice
keep_track_experiment.push(start_practice_block)
block = practice_block[0]
target = practice_targets[0]
prompt = '<div class = promptbox><div class = prompt-text>Targets: ' + target.join(', ') +'</div></div>'
data = {exp_id: 'keep_track', trial_id: 'practice_prompt', condition: 'target_length_' + target.length, targets: target}
var prompt_block = {
	type: 'poldrack-single-stim',
	stimulus: '<div class = centerbox><p class = block-text>Below are the target categories. They will remain on the bottom of the screen during the trial. Press enter when you are sure you can remember them. </p></div>',
	is_html: true,
	choices: [13],
	data: data,
	prompt: prompt,
	timing_post_trial: 0,
}
var wait_block = {
	type: 'poldrack-single-stim',
	stimulus: ' ',
	is_html: true,
	choices: 'none',
	prompt: prompt,
	timing_stim: 500,
	timing_response: 500,
	timing_post_trial: 0,
}
keep_track_experiment.push(prompt_block)
keep_track_experiment.push(wait_block)
for (i = 0; i < block.length; i++ ) {
	stim = '<div class = centerbox><div class = keep-track-text>' + block[i][1] + '</div></div>'
	data = {exp_id: 'keep_track', trial_id: 'practice_' + block[i][0], condition: 'target_length_' + target.length, targets: target}
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
	}
	keep_track_experiment.push(track_block)
}
var response_block = {
	type: 'survey-text',
	questions: [['What was the last word in each of the target categories? Please separate your words with a space']],
	data: {exp_id: 'keep_track', trial_id: 'response', condition: 'target_length_' + target.length, targets: target}
}
keep_track_experiment.push(response_block)
keep_track_experiment.push(end_practice_block)

	
// set up test blocks
for (b=0; b<blocks.length; b++) {
	keep_track_experiment.push(start_test_block)
	block = blocks[b]
	target = targets[b]
	prompt = '<div class = promptbox><div class = prompt-text>Targets: ' + target.join(', ') +'</div></div>'
	data = {exp_id: 'keep_track', trial_id: 'test_prompt', condition: 'target_length_' + target.length, targets: target}
	var prompt_block = {
		type: 'poldrack-single-stim',
		stimulus: '<div class = centerbox><p class = block-text>Below are the target categories. They will remain on the bottom of the screen during the trial. Press enter when you are sure you can remember them. </p></div>',
		is_html: true,
		choices: [13],
		data: data,
		prompt: prompt,
		timing_post_trial: 0,
	}
	var wait_block = {
		type: 'poldrack-single-stim',
		stimulus: ' ',
		is_html: true,
		choices: 'none',
		prompt: prompt,
		timing_stim: 500,
		timing_response: 500,
		timing_post_trial: 0,
	}
	keep_track_experiment.push(prompt_block)
	keep_track_experiment.push(wait_block)
	for (i = 0; i < block.length; i++ ) {
		stim = '<div class = centerbox><div class = keep-track-text>' + block[i][1] + '</div></div>'
		data = {exp_id: 'keep_track', trial_id: 'test_' + block[i][0], condition: 'target_length_' + target.length, targets: target}
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
		}
		keep_track_experiment.push(track_block)
	}
	var response_block = {
		type: 'survey-text',
		questions: [['What was the last word in each of the target categories? Please separate your words with a space']],
		data: {exp_id: 'keep_track', trial_id: 'response', condition: 'target_length_' + target.length, targets: target}
	}
	keep_track_experiment.push(response_block)
}



keep_track_experiment.push(end_block)
