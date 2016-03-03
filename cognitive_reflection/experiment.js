/* ************************************ */
/* Define helper functions */
/* ************************************ */
function getDisplayElement() {
	$('<div class = display_stage_background></div>').appendTo('body')
	return $('<div class = display_stage></div>').appendTo('body')
}

function addID() {
	jsPsych.data.addDataToLastTrial({
		'exp_id': 'cognitive_reflection'
	})
}

/* ************************************ */
/* Define experimental variables */
/* ************************************ */

/* ************************************ */
/* Set up jsPsych blocks */
/* ************************************ */

/* define static blocks */
var welcome_block = {
	type: 'poldrack-text',
	timing_response: 180000,
	text: '<div class = centerbox><p class = center-block-text>Welcome to the experiment. Press <strong>enter</strong> to begin.</p></div>',
	cont_key: [13],
	timing_post_trial: 0
};

var experiment_block = {
	type: 'survey-text',
	preamble: '<strong>For every question except the last, enter your numeric answer below the question.</strong>',
	questions: [
		[
			'If three elves can wrap three toys in hour, how many elves are needed to wrap six toys in 2 hours? <br><strong>Answer</strong>: _____ elves'
		],
		[
			'In an athletics team, tall members are three times more likely to win a medal than short members. This year theteam has won 60 medals so far. How many of these have been won by short athletes?  <br><strong>Answer</strong>: _____ medals'
		],
		[
			'If John can drink one barrel of water in 6 days, and Mary can drink one barrel of water in 12 days, how long would it take them to drink one barrel of water together? <br><strong>Answer</strong>: _____ days'
		],
		[
			'Jerry received both the 15th highest and the 15th lowest mark in the class. How many students are in the class? <br><strong>Answer</strong>: _____ students'
		],
		[
			'A man buys a pig for $60, sells it for $70, buys it back for $80, and sells it finally for $90. How much has he made? <br><strong>Answer</strong>: _____ dollars'
		],
		[
			' Simon decided to invest $8,000 in the stock market one day early in 2008. Six months after he invested, on July 17, the stocks he had purchasedwere down 50 % .Fortunately for Simon, from July 17 to October 17, the stocks he had purchased went up 75%. At this point, Simon has: <strong>(a)</strong> broken even in the stock market, <strong>(b)</strong> is ahead of where he began, <strong>(c)</strong> has lost money. <br><strong>Answer</strong>: _____ (enter the letter)'
		]
	]

};


var end_block = {
	type: 'poldrack-text',
	text: '<div class = centerbox><p class = center-block-text>Congratulations for completing this task!</p><p class = center-block-text>Press <strong>enter</strong> to continue.</p></div>',
	cont_key: [13]
};


//Set up experiment
var cognitive_reflection_experiment = []
cognitive_reflection_experiment.push(welcome_block);
cognitive_reflection_experiment.push(experiment_block);
cognitive_reflection_experiment.push(end_block)