var feedback_instruct_text =
	'Welcome to the experiment. Press <strong>enter</strong> to begin.'

var test_block = {
	type: 'poldrack-text',
	cont_key: [13],
	text: feedback_instruct_text,
	timing_post_trial: 0,
	timing_response: 10000
};

var experiment_node = {
	timeline: [test_block]
};

var a_test_exp_experiment = []
a_test_exp_experiment.push(experiment_node);