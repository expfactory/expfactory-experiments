// Reference: http://www.ncbi.nlm.nih.gov/pubmed/18193561
// Decision Making and Learning While Taking Sequential Risks. Pleskac 2008

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

function assessPerformance() {
	var experiment_data = jsPsych.data.getTrialsOfType('single-stim-button')
	var missed_count = 0
	var trial_count = 0
	var rt_array = []
	var rt = 0
	for (var i = 0; i < experiment_data.length; i++) {
		rt = experiment_data[i].rt
		trial_count += 1
		if (rt == -1) {
			missed_count += 1
		} else {
			rt_array.push(rt)
		}
	}
	//calculate average rt
	var sum = 0
	for (var j = 0; j < rt_array.length; j++) {
		sum += rt_array[j]
	}
	var avg_rt = sum / rt_array.length || -1
	var missed_percent = missed_count/experiment_data.length
  	credit_var = (missed_percent < 0.4 && avg_rt > 200)
  	if (credit_var === true) {
    	performance_var = total_points
  	} else {
    	performance_var = 0
  	}
	jsPsych.data.addDataToLastTrial({"credit_var": credit_var, "performance_var": performance_var})

}

var getInstructFeedback = function() {
	return '<div class = centerbox><p class = center-block-text>' + feedback_instruct_text +
		'</p></div>'
}

function appendTextAfter(input, search_term, new_text) {
	var index = input.indexOf(search_term) + search_term.length
	return input.slice(0, index) + new_text + input.slice(index)
}

function getRoundOverText() {
	return '<div class = centerbox><p class = center-block-text>' + round_over_text +
		' The round is over.</p><p class = center-block-text>Press <strong>enter</strong> to begin.</p></div>'
}

function getGame() {
	/* At the beginning of each round the task displays either a new lake (if a new tournament is starting)
	or the state of the lake from the last round after the action had been chosen. This function works
	by editing "game_setup" a string which determines the html to display, followed by calling the "makeFish"
	function, which...makes fish.
	*/
	if (total_fish_num === 0) {
		round_over = 0
		trial_num = 0
		game_state = game_setup
		game_state = appendTextAfter(game_state, 'Trip Bank (points): </strong>', trip_bank)
		game_state = appendTextAfter(game_state, 'Tournament Bank: </strong>', tournament_bank)
		game_state = appendTextAfter(game_state, 'Red Fish in Cooler: </strong>', 0)
		game_state = appendTextAfter(game_state, "Catch N' ", release)
		game_state = appendTextAfter(game_state, "weathertext>", weather)
		$('.jspsych-display-element').html(game_state)
		if (weather == "Sunny") {
			$('.lake').css("background-color", "LightBlue")
		} else {
			$('.lake').css("background-color", "CadetBlue")
		}
		makeFish(start_fish_num)
	} else {
		// Update game state with cached values
		game_state = game_setup
		game_state = appendTextAfter(game_state, 'lake>', lake_state)
		if (weather == "Sunny") {
			game_state = appendTextAfter(game_state, '# Red Fish in lake: </strong>', red_fish_num)
			game_state = appendTextAfter(game_state, '# Blue Fish in lake: </strong>', total_fish_num -
				red_fish_num)
		}
		game_state = appendTextAfter(game_state, 'Trip Bank (points): </strong>', trip_bank)
		game_state = appendTextAfter(game_state, 'Tournament Bank: </strong>', tournament_bank)
		game_state = appendTextAfter(game_state, "Catch N' ", release)
		game_state = appendTextAfter(game_state, "weathertext>", weather)
		if (release == "Keep") {
			game_state = appendTextAfter(game_state, 'Red Fish in Cooler: </strong>', trip_bank)
		}
		$('.jspsych-display-element').html(game_state)
		if (weather == "Sunny") {
			$('.lake').css("background-color", "LightBlue")
		} else {
			$('.lake').css("background-color", "CadetBlue")
		}
		makeFish(total_fish_num)
	}
}

function get_data() {
	/* Records state of the world before the person made their choice
	 */
	var data = {
		exp_stage: "test",
		trial_id: "stim",
		red_fish_num: red_fish_num,
		trip_bank: trip_bank,
		tournament_bank: tournament_bank,
		weather: weather,
		release: release,
		round_num: round_num,
		trial_num: trial_num
	}
	trial_num += 1
	return data
}

function get_practice_data() {
	/* Records state of the world before the person made their choice
	 */
	var data = {
		exp_stage: "practice",
		trial_id: "stim",
		red_fish_num: red_fish_num,
		trip_bank: trip_bank,
		tournament_bank: tournament_bank,
		weather: weather,
		release: release,
		round_num: round_num,
		trial_num: trial_num
	}
	trial_num += 1
	return data
}

function makeFish(fish_num) {
	/* This function makes fish. This includes setting the global variables that track fish number and displaying the
		fish in the lake if it is sunny out. It uses the placeFish function to set the fish locations
	
	*/
	$(".redfish").remove();
	$(".bluefish").remove();
	$(".greyfish").remove();
	red_fish_num = 0
	total_fish_num = 0
	filled_areas = [];
	if (max_x === 0) {
		min_x = $('.lake').width() * 0.05;
		min_y = $('.lake').height() * 0.05;
		max_x = $('.lake').width() * 0.9;
		max_y = $('.lake').height() * 0.9;
	}
	for (i = 0; i < fish_num - 1; i++) {
		red_fish_num += 1
		if (weather == "Sunny") {
			$('.lake').append('<div class = redfish id = red_fish' + red_fish_num + '></div>')
		}
	}
	if (weather == "Sunny") {
		$('.lake').append('<div class = bluefish id = blue_fish></div>')
	}
	place_fish()
	if (weather == "Sunny") {
		$('#red_count').html('<strong># Red Fish in lake:</strong>: ' + red_fish_num)
		$('#blue_count').html('<strong># Blue Fish in lake:</strong>: 1')
	}
	total_fish_num = red_fish_num + 1
}

function goFish() {
	/* If the subject chooses to goFish, one fish is randomly selected from the lake. If it is red, the trip bank
		is increased by "pay". If it is blue the round ends. If the release rule is "Keep", the fish is also removed
		from the lake. Coded as keycode 36 for jspsych
	*/
	if (total_fish_num > 0) {
		if (Math.random() < 1 / (total_fish_num)) {
			$('#blue_fish').remove();
			trip_bank = 0
			$(".lake").html('')
			red_fish_num = 0
			total_fish_num = 0
			last_pay = 0
			round_over = 1
			round_num += 1
			round_over_text = "You caught the blue fish! You have lost all points collected this round."
		} else {
			if (release == "Keep") {
				$('#red_fish' + red_fish_num).remove()
				red_fish_num -= 1
				total_fish_num -= 1
			}
			trip_bank += pay
			last_pay = pay

		}

		lake_state = $('.lake').html()
	}
}

function collect() {
	round_over = 1
	round_num += 1
	round_over_text = "You collected the points from the trip bank (" + trip_bank +
		" points) and moved it to your tournament bank."
		// Tranfers points from trip bank to tournament bank and ends the round. Coded as keycode 35 for jspsych
	tournament_bank += trip_bank
	tournment_bank = tournament_bank
	trip_bank = 0
	$(".redfish").remove();
	$(".bluefish").remove();
	$('#tournament_bank').html('<strong>Tournament Bank:</strong> ' + tournament_bank)
	$('#trip_bank').html('<strong>Trip Bank (points):</strong> ' + trip_bank)
	red_fish_num = 0
	total_fish_num = 0
	lake_state = $('.lake').html()
	cooler_state = $('.lake').html()
}



function calc_overlap(a1) {
	// helper function when placing fish. 
	var overlap = 0;
	for (var i = 0; i < filled_areas.length; i++) {
		a2 = filled_areas[i]
			// no intersection cases
		if (a1.x + a1.width < a2.x) {
			continue;
		}
		if (a2.x + a2.width < a1.x) {
			continue;
		}
		if (a1.y + a1.height < a2.y) {
			continue;
		}
		if (a2.y + a2.height < a1.y) {
			continue;
		}

		// intersection exists : calculate it !
		var x1 = Math.max(a1.x, a2.x);
		var y1 = Math.max(a1.y, a2.y);
		var x2 = Math.min(a1.x + a1.width, a2.x + a2.width);
		var y2 = Math.min(a1.y + a1.height, a2.y + a2.height);

		var intersection = ((x1 - x2) * (y1 - y2));

		overlap += intersection;

	}
	return overlap;
}

function place_fish() {
	/* Places fish in the lake and attempts to overlap them as little as possible. It does this by randomly placing the fish
	   up to maxSearchIterations times. It stops if it places the fish with no overlap. Otherwise, the fish goes where there is the
	   least overlap. 
	*/
	var index = 0;
	fish_types = ['redfish', 'bluefish', 'greyfish']
	for (f = 0; f < fish_types.length; f++) {
		fish = fish_types[f]
		$('.' + fish).each(function(index) {
			var rand_x = 10;
			var rand_y = 10;
			var smallest_overlap = '';
			var best_choice;
			var area;
			for (var i = 0; i < maxSearchIterations; i++) {
				rand_x = Math.round(min_x + ((max_x - min_x) * (Math.random())));
				rand_y = Math.round(min_y + ((max_y - min_y) * (Math.random())));
				area = {
					x: rand_x,
					y: rand_y,
					width: $(this).width(),
					height: $(this).height()
				};
				var overlap = calc_overlap(area);
				if (smallest_overlap === '') {
					smallest_overlap = overlap
					best_choice = area
				} else if (overlap < smallest_overlap) {
					smallest_overlap = overlap;
					best_choice = area;
				}
				if (overlap === 0) {
					break;
				}
			}

			filled_areas.push(best_choice)
			$(this).css({
				position: "absolute",
				"z-index": index++
			});

			$(this).css({
				left: rand_x,
				top: rand_y
			});
		});
	}
}


/* ************************************ */
/* Define experimental variables */
/* ************************************ */
// generic task variables
var run_attention_checks = false
var attention_check_thresh = 0.45
var sumInstructTime = 0 //ms
var instructTimeThresh = 0 ///in seconds
var credit_var = true
var performance_var = 0

// task specific variables
var num_practice_rounds = 2
var num_rounds = 30
var red_fish_num = 0
var total_fish_num = 0
var start_fish_num = 0
var trip_bank = 0
var tournament_bank = 0
var total_points = 0 // used to determine bonus pay
	//each block defines the weather and release law
var blocks = [{
	weather: "Sunny",
	release: "Release"
}, {
	weather: "Sunny",
	release: "Keep"
}, {
	weather: "Cloudy",
	release: "Release"
}, {
	weather: "Cloudy",
	release: "Keep"
}]
var exp_stage = 'practice'
var practiceblocks = jsPsych.randomization.shuffle(blocks)
var blocks = jsPsych.randomization.shuffle(blocks)
var pay = 1 //payment for one red fish
var last_pay = 0 //variable to hold the last amount of points received
var lake_state = '' //variable for redrawing the board from trial to trial
var trial_num = 0 // global variable to track the number of trials into a round
var round_num = 0 // global variable to track the number of rounds into a tournament
var round_over = 0 //equals 1 if a blue fish is caught or the participant 'collects'
var round_over_text = '' 

//Variables for placing fish
var maxSearchIterations = 100;
var min_x = 0
var max_x = 0
var min_y = 0
var max_y = 0
var filled_areas = [];

var game_setup = "<div class = titlebox><div class = center-text>Catch N' </div></div>" +
	"<div class = lake></div>" +
	"<div class = cooler><p class = info-text>&nbsp<strong>Red Fish in Cooler: </strong></p></div>" +
	"<div class = weatherbox><div class = center-text id = weathertext></div></div>" +
	"<div class = infocontainer>" +
	"<div class = subinfocontainer>" +
	"<div class = infobox><p class = info-text id = red_count>&nbsp<strong># Red Fish in lake: </strong></p></div>" +
	"<div class = infobox><p class = info-text id = blue_count>&nbsp<strong># Blue Fish in lake: </strong></p></div>" +
	"</div>" +
	"<div class = subimgcontainer>" +
	"<div class = imgbox></div>" +
	"</div>" +
	"<div class = subinfocontainer>" +
	"<div class = infobox><p class = info-text id = trip_bank><strong>Trip Bank (points): </strong></p></div> " +
	"<div class = infobox><p class = info-text id = tournament_bank><strong>Tournament Bank: </strong></p></div>" +
	"</div>" +
	"</div>" +
	"<div class = buttonbox><button id = 'goFish' class = select-button onclick = goFish()>Go Fish</button><button id = 'Collect' class = select-button onclick = collect()>Collect</button></div>"
	/* ************************************ */
	/* Set up jsPsych blocks */
	/* ************************************ */
	// Set up attention check node
var attention_check_block = {
	type: 'attention-check',
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
	'Welcome to the experiment. This experiment will take around 25 minutes. Press <strong>enter</strong> to begin.'
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
	pages: [
		'<div class = centerbox><p class = block-text>In this task, you will participate in a fishing tournament. During this tournament you will play a fishing game for multiple rounds. Each round, you will see a lake which has many fish in it. Your goal is to catch as many fish as possible.</p><p class = block-text>On the screen you will see a lake and two buttons: "Go Fish" and "Collect". If you "Go Fish" you randomly catch one of the fish in the lake. Each fish is equally likely.</p><p class = block-text>There are many red fish in the lake and one blue fish. Each red fish earns you 1 point towards that round\'s "Trip Bank", which you can then "Collect" to move the points to your "Tournament Bank" and start a new round. However, if you catch the blue fish, the round will end and you will lose all the points you earned that round.</p><p class = block-text>To keep your points from round to round you must  stop fishing and press "Collect" before you catch a blue fish.</p><p class = block-text>After you end instructions you will play ' + num_practice_rounds + ' rounds of the fishing game to practice.</p></div>'
	],
	allow_keys: false,
	data: {
		trial_id: 'instruction'
	},
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

var conditions_instructions_block = {
	type: 'poldrack-instructions',
	pages: [
		'<div class = centerbox><p class = block-text><p class = block-text>You will participate in four tournaments, each with different rules. One way the tournaments differ is whether you keep or release the fish you catch. In the <span style="color:red">Catch N Release</span> condition, you will always release the fish you just caught so the number of red and blue fish will stay the same throughout the round.</p><p class = block-text>In the <span style="color:red">Catch N Keep</span> condition, the fish you catch will come out of the lake and go into your cooler. Thus the chance of catching a blue fish increases each time you catch a red fish.</p></div>',
		'<div class = centerbox><p class = block-text>The <span style="color:blue">weather</span> will also differ between tournaments. When the weather is <span style="color:blue">sunny</span> you will be able to see how many fish are in the lake. There will also be counters below the lake that tell you exactly how many red and blue fish are still in the lake.</p><p class = block-text>When the weather is <span style="color:blue">cloudy</span>, the lake is murky and you will be unable to see any fish. The counters will also be blank. The keep or release rules still apply however. If you are in <span style="color:red">Catch N Release</span>, the number of fish in the lake stay the same after each "Go Fish". If you are in <span style="color:red">Catch N Keep</span>, the fish come out of the lake.</p></div>',
		'<div class = centerbox><p class = block-text>You will play one tournament with each combination of <span style="color:blue">weather</span> (sunny or cloudy) and <span style="color:red">release</span> (release or keep) rules. Each tournament is independent. The points you earn in one tournament has no effect on the next. Your goal is to do as well as possible on all four tournaments.</p><p class = block-text>You can earn bonus pay by doing well on the tasks so try your best to maximize your earnings! Your bonus pay will be proportional to your earnings.</p></div>',
		'<div class = centerbox><p class = block-text>Before we start the tournaments, there will be a brief practice session for each of the four tournaments. Before each practice tournament starts you will choose the number of fish in the lake (1-200). During the actual experiment, you will not be able to choose the number of fish.</p></div>'
	],
	allow_keys: false,
	data: {
		trial_id: 'instruction'
	},
	show_clickable_nav: true,
	timing_post_trial: 1000
};

var end_block = {
	type: 'poldrack-text',
	text: '<div class = centerbox><p class = center-block-text>Thanks for completing this task!</p><p class = center-block-text>Press <strong>enter</strong> to begin.</p></div>',
	cont_key: [13],
	data: {
		trial_id: "end",
    	exp_id: 'angling_risk_task'
	},
	timing_response: 180000,
	timing_post_trial: 0,
	on_finish: assessPerformance
};

var round_over_block = {
	type: 'poldrack-text',
	text: getRoundOverText,
	cont_key: [13],
	timing_response: 180000,
	data: {
		trial_id: "round_over"
	},
	timing_post_trial: 0,
	on_finish: function() {
		caught_blue = false
		if (round_over_text.indexOf('You caught the blue fish!') != -1) {
			caught_blue = true
		}
		jsPsych.data.addDataToLastTrial({
			exp_stage: exp_stage,
			caught_blue: caught_blue,
			weather: weather,
			release: release
		})
	},
};

var update_performance_var_block = {
	type: 'call-function',
	data: {
		trial_id: 'update_performance_var'
	},
	func: function() {
		total_points += tournament_bank
	}
}

var ask_fish_block = {
	type: 'survey-text',
	on_finish: function() {
		jsPsych.data.addDataToLastTrial({
			exp_stage: exp_stage
		})
	},
	data: {
		trial_id: "ask fish"
	},
	questions: [
		[
			"<p class = center-block-text>For this tournament, how many red fish are in the lake? Please enter a number between 1-200</p><p class = center-block-text>If you don't respond, or respond out of these bounds the number of red fish will be randomly set between 1-200.</p>"
		]
	],
}

var set_fish_block = {
	type: 'call-function',
	on_finish: function() {
		jsPsych.data.addDataToLastTrial({
			exp_stage: exp_stage
		})
	},
	data: {
		trial_id: "set_fish"
	},
	func: function() {
		var last_data = jsPsych.data.getData().slice(-1)[0]
		var last_response = parseInt(last_data.responses.slice(7, 10))
		start_fish_num = last_response + 1
		if (isNaN(start_fish_num) || start_fish_num >= 200 || start_fish_num < 0) {
			start_fish_num = Math.floor(Math.random() * 200) + 1
		}
	},
	timing_post_trial: 0,
}

var practice_block = {
	type: 'single-stim-button',
	stimulus: getGame,
	button_class: 'select-button',
	data: get_practice_data,
	timing_post_trial: 0,
	on_finish: function() {
		jsPsych.data.addDataToLastTrial({
			'pay_on_trial': last_pay
		})
	}
};


var practice_node = {
	timeline: [practice_block],
	loop_function: function(data) {
		if (round_over == 1) {
			return false
		} else {
			return true
		}
	}
}

var game_block = {
	type: 'single-stim-button',
	stimulus: getGame,
	button_class: 'select-button',
	data: get_data,
	timing_post_trial: 0,
	on_finish: function() {
		jsPsych.data.addDataToLastTrial({
			'pay_on_trial': last_pay
		})
	}
};

var game_node = {
	timeline: [game_block],
	loop_function: function(data) {
		if (round_over == 1) {
			return false
		} else {
			return true
		}
	}
}

var start_test_block = {
	type: 'poldrack-text',
	data: {
		trial_id: "test_intro"
	},
	timing_response: 180000,
	text: '<div class = centerbox><p class = center-block-text>Done with practice! We will now start the test tournaments. There will be four tournaments, each with 30 rounds of fishing.</p><p class = center-block-text>Press <strong>enter</strong> to begin the test.</p></div>',
	cont_key: [13],
	timing_post_trial: 1000,
	on_finish: function() {
		tournament_bank = 0
		exp_stage = 'test'
	}
};

//Setup task
angling_risk_task_experiment = []
angling_risk_task_experiment.push(instruction_node)
//Practice basic layout
weather = "Sunny"
release = "Keep"
weather_rule = "you can see how many fish are in the lake"
release_rule = "the fish you catch comes out of the lake"
var tournament_intro_block_practice = {
	type: 'poldrack-text',
	text: '<div class = centerbox><p class = block-text>You will now start a tournament. The weather is <span style="color:blue">' +
		weather + '</span> which means ' + weather_rule +
		'. The release rule is <span style="color:red">' + release + '</span>, which means ' +
		release_rule +
		'.</p><p class = center-block-text>Press <strong>enter</strong> to begin.</p></div>',
	cont_key: [13],
	timing_response: 180000,
	data: {
		weather: weather,
		release: release,
		exp_stage: "practice",
		trial_id: "intro"
	},
	on_finish: function(data) {
		weather = data.weather
		release = data.release
		tournament_bank = 0
		round_num = 0
	}
}
angling_risk_task_experiment.push(tournament_intro_block_practice)
angling_risk_task_experiment.push(ask_fish_block)
angling_risk_task_experiment.push(set_fish_block)
for (i = 0; i < num_practice_rounds; i++) {
	angling_risk_task_experiment.push(practice_node)
	angling_risk_task_experiment.push(round_over_block)
}



angling_risk_task_experiment.push(conditions_instructions_block)
//practice each condition
for (b = 0; b < practiceblocks.length; b++) {
	block = practiceblocks[b]
	weather = block.weather
	release = block.release
	if (weather == "Sunny") {
		weather_rule = "you can see how many fish are in the lake"
	} else {
		weather_rule = "you won't be able to see how many fish are in the lake"
	}
	if (release == "Keep") {
		release_rule = "the fish you catch comes out of the lake"
	} else {
		release_rule = "the number of fish in the lake stays the same"
	}
	var tournament_intro_block_practice = {
		type: 'poldrack-text',
		text: '<div class = centerbox><p class = block-text>You will now start a tournament. The weather is <span style="color:blue">' +
			weather + '</span> which means ' + weather_rule +
			'. The release rule is <span style="color:red">' + release + '</span>, which means ' +
			release_rule +
			'.</p><p class = center-block-text>Press <strong>enter</strong> to begin.</p></div>',
		cont_key: [13],
		timing_response: 180000,
		data: {
			weather: weather,
			release: release,
			exp_stage: "practice",
			trial_id: "intro"
		},
		on_finish: function(data) {
			weather = data.weather
			release = data.release
			tournament_bank = 0
			round_num = 0
		}
	}
	angling_risk_task_experiment.push(tournament_intro_block_practice)
	angling_risk_task_experiment.push(ask_fish_block)
	angling_risk_task_experiment.push(set_fish_block)
	for (i = 0; i < num_practice_rounds; i++) {
		angling_risk_task_experiment.push(practice_node)
		angling_risk_task_experiment.push(round_over_block)
	}
}

angling_risk_task_experiment.push(start_test_block)
for (b = 0; b < blocks.length; b++) {
	block = blocks[b]
	weather = block.weather
	release = block.release
	if (weather == "Sunny") {
		weather_rule = "you can see how many fish are in the lake"
	} else {
		weather_rule = "you won't be able to see how many fish are in the lake"
	}
	if (release == "Keep") {
		start_fish_num = 128
		release_rule = "the fish you catch comes out of the lake"
	} else {
		start_fish_num = 65
		release_rule = "the number of fish in the lake stays the same"
	}
	var tournament_intro_block = {
		type: 'poldrack-text',
		text: '<div class = centerbox><p class = block-text>You will now start a tournament. The weather is <span style="color:blue">' +
			weather + '</span> which means ' + weather_rule +
			'. The release rule is <span style="color:red">' + release + '</span>, which means ' +
			release_rule +
			'.</p><p class = center-block-text>Press <strong>enter</strong> to begin.</p></div>',
		cont_key: [13],
		timing_response: 120000,
		data: {
			weather: weather,
			release: release,
			start_fish_num: start_fish_num,
			trial_id: "intro",
			exp_stage: "test"
		},
		on_finish: function(data) {
			weather = data.weather
			release = data.release
			start_fish_num = data.start_fish_num
			tournament_bank = 0
			round_num = 0
		}
	}
	angling_risk_task_experiment.push(tournament_intro_block)
	for (i = 0; i < num_rounds; i++) {
		angling_risk_task_experiment.push(game_node)
		angling_risk_task_experiment.push(round_over_block)
	}
	if ($.inArray(b, [0, 2]) != -1) {
		angling_risk_task_experiment.push(attention_node)
	}
	angling_risk_task_experiment.push(update_performance_var_block)
}
angling_risk_task_experiment.push(post_task_block)
angling_risk_task_experiment.push(end_block)