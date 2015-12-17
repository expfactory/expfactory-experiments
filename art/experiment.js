// Reference: http://www.ncbi.nlm.nih.gov/pubmed/18193561
// Decision Making and Learning While Taking Sequential Risks. Pleskac 2008

/* ************************************ */
/* Define helper functions */
/* ************************************ */
function appendTextAfter(input,search_term, new_text) {
	var index = input.indexOf(search_term)+search_term.length
	return input.slice(0,index) + new_text + input.slice(index)
}

function getRoundOverText() {
	 return '<div class = centerbox><p class = center-block-text>' + round_over_text + ' The round is over.</p><p class = center-block-text>Press <strong>enter</strong> to begin.</p></div>'
}

function getGame() {
	/* At the beginning of each round the task displays either a new lake (if a new tournament is starting)
	or the state of the lake from the last round after the action had been chosen. This function works
	by editing "game_setup" a string which determines the html to display, followed by calling the "makeFish"
	function, which...makes fish.
	*/
	if (total_fish_num == 0) {
		round_over = 0
		game_state = game_setup
		game_state = appendTextAfter(game_state, 'Trip Bank: </strong>$', trip_bank)
		game_state = appendTextAfter(game_state, 'Tournament Bank: </strong>$', tournament_bank)
		game_state = appendTextAfter(game_state, 'Red Fish in Cooler: </strong>', 0)
		game_state = appendTextAfter(game_state, "Catch N' ", release)
		game_state = appendTextAfter(game_state, "weathertext>", weather)
		$(document.body).html(game_state)
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
			game_state = appendTextAfter(game_state, '# Blue Fish in lake: </strong>', total_fish_num-red_fish_num)
		}
		game_state = appendTextAfter(game_state, 'Trip Bank: </strong>$', trip_bank)
		game_state = appendTextAfter(game_state, 'Tournament Bank: </strong>$', tournament_bank)
		game_state = appendTextAfter(game_state, "Catch N' ", release)
		game_state = appendTextAfter(game_state, "weathertext>", weather)
		if (release == "Keep") {
			game_state = appendTextAfter(game_state, 'Red Fish in Cooler: </strong>', Math.round(trip_bank/pay*100)/100)
		}
		$(document.body).html(game_state)
		if (weather == "Sunny") {
			$('.lake').css("background-color", "LightBlue")
		} else {
			$('.lake').css("background-color", "CadetBlue")
		}
		makeFish(total_fish_num)
	}
}

function get_data() {
	/* This records the data AFTER the choice has been made and so the values have all been updated. We are interested
		in the state of the world before the choice has been made. What value is the trip_bank at when the choice was made?
		To get this we need to subtract the changes due to this choice.
	*/
	if (last_pay == .05) {
		FB = 1
	} else {
		FB = 0
	}
	return {exp_id: "art",
			trial_id: "test",
			red_fish_num: red_fish_num + 1,
			trip_bank: trip_bank - last_pay,
			FB: FB,
			tournament_bank: tournament_bank,
			weather: weather,
			release: release}
}

function get_practice_data() {
	/* This records the data AFTER the choice has been made and so the values have all been updated. We are interested
		in the state of the world before the choice has been made. What value is the trip_bank at when the choice was made?
		To get this we need to subtract the changes due to this choice.
	*/
	if (last_pay == .05) {
		FB = 1
	} else {
		FB = 0
	}
	return {exp_id: "art",
			trial_id: "practice",
			red_fish_num: red_fish_num + 1,
			trip_bank: trip_bank - last_pay,
			FB: FB,
			tournament_bank: tournament_bank,
			weather: weather,
			release: release}
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
    for (i=0;i<fish_num-1;i++) {
        if (max_x == 0) {
			min_x = $('.lake').width()*.05;
			min_y = $('.lake').height()*.05;
            max_x = $('.lake').width()*.9;
            max_y = $('.lake').height()*.9;   
        }
		red_fish_num+=1
		if (weather == "Sunny") {
			$('.lake').append('<div class = redfish id = red_fish' + red_fish_num +'></div>')  
		} 
    }
	if (weather == "Sunny") {
		$('.lake').append('<div class = bluefish id = blue_fish></div>')  
	} 
	place_fish()
	if (weather == "Sunny") {
		$('#red_count').html('<strong># Red Fish in lake:</strong>: ' + red_fish_num)
		$('#blue_count').html('<strong># Red Fish in lake:</strong>: 1')
	}
	total_fish_num = red_fish_num + 1
}

function goFish() {
	/* If the subject chooses to goFish, one fish is randomly selected from the lake. If it is red, the trip bank
		is increased by "pay". If it is blue the round ends. If the release rule is "Keep", the fish is also removed
		from the lake. Coded as keycode 36 for jspsych
	*/
	if (total_fish_num > 0) {
		if (Math.random() < 1/(total_fish_num)) {
			$('#blue_fish').remove();
			trip_bank = 0
			$(".lake").html('')
			red_fish_num = 0
			total_fish_num = 0
			last_pay = 0
			round_over = 1
			round_over_text = "You caught the blue fish! You have lost all money collected this round."
		 } else {
			if (release == "Keep") {
				$('#red_fish' + red_fish_num).remove()
				red_fish_num-=1
				total_fish_num-=1
			} 
			trip_bank += pay
			trip_bank = Math.round(trip_bank * 100) / 100
			last_pay = pay
			
		 }

		lake_state = $('.lake').html()
	}	
}

function collect() {
	round_over = 1
	round_over_text = "You collected the money from the trip bank ($" + trip_bank + ") and moved it to your tournament bank."
	// Tranfers money from trip bank to tournament bank and ends the round. Coded as keycode 35 for jspsych
 	tournament_bank += trip_bank
	tournment_bank = Math.round(tournament_bank * 100) / 100
    trip_bank = 0
    $(".redfish").remove();
    $(".bluefish").remove();
    $('#tournament_bank').html('<strong>Tournament Bank:</strong> $' + tournament_bank)
    $('#trip_bank').html('<strong>Trip Bank:</strong> $' + trip_bank)
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
	fish_types = ['redfish','bluefish','greyfish']
	for (f = 0; f<fish_types.length; f++) {
		fish = fish_types[f]
		$('.' + fish).each(function(index) {
			var rand_x = 0;
			var rand_y = 0;
			var i = 0;
			var smallest_overlap = '';
			var best_choice;
			var area;
			for (var i = 0; i < maxSearchIterations; i++) {
				rand_x = Math.round(min_x + ((max_x - min_x) * (Math.random() % 1)));
				rand_y = Math.round(min_y + ((max_y - min_y) * (Math.random() % 1)));
				area = {
					x: rand_x,
					y: rand_y,
					width: $(this).width(),
					height: $(this).height()
				};
				var overlap = calc_overlap(area);
				if (smallest_overlap == '') {
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
			
			$(this).css({left:rand_x, top: rand_y});

		});
	}
}


/* ************************************ */
/* Define experimental variables */
/* ************************************ */
//Task variables
var num_practice_rounds = 2
var num_rounds = 30
var red_fish_num = 0
var total_fish_num = 0
var start_fish_num = 0
var trip_bank = 0
var tournament_bank = 0
//each block defines the weather and release law
var blocks = [{weather: "Sunny", release: "Release"}, {weather: "Sunny", release: "Keep"}, {weather: "Cloudy", release: "Release"}, {weather: "Cloudy", release: "Keep"}]
var practiceblocks = jsPsych.randomization.shuffle(blocks)
var blocks = jsPsych.randomization.shuffle(blocks)
var pay = .05 //payment for one red fish
var last_pay = 0 //variable to hold the last amount of money received
var lake_state = '' //variable for redrawing the board from trial to trial
var round_over = 0  //equals 1 if a blue fish is caught or the participant 'collects'
var round_over_text = '' //Either "You caught the blue fish and lost the money i." or "You collec."

//Variables for placing fish
var maxSearchIterations = 100;
var min_x = 0
var max_x = 0
var min_y = 0
var max_y = 0
var filled_areas = [];

var game_setup = "<div class = titlebox><div class = center-text>Catch N' </div></div>" +
"<div class = lake></div>" +
"<div class = cooler><p class = info-text><strong>Red Fish in Cooler: </strong></p></div>" +
"<div class = weatherbox><div class = center-text id = weathertext></div></div>" +
"<div class = infocontainer>" +
    "<div class = subinfocontainer>" +
        "<div class = infobox><p class = info-text id = red_count>&nbsp&nbsp<strong># Red Fish in lake: </strong></p></div>" +
        "<div class = infobox><p class = info-text id = blue_count>&nbsp&nbsp<strong># Blue Fish in lake: </strong></p></div>" +
    "</div>" +
    "<div class = subimgcontainer>" +
		"<div class = imgbox></div>" +
	"</div>" +
    "<div class = subinfocontainer>" +
        "<div class = infobox><p class = info-text id = trip_bank>&nbsp&nbsp<strong>Trip Bank: </strong>$</p></div> " +
        "<div class = infobox><p class = info-text id = tournament_bank>&nbsp&nbsp<strong>Tournament Bank: </strong>$</p></div>" +
"</div>" +
    "</div>" +
"<div class = buttonbox><button id = 'goFish' class = select-button onclick = goFish()>Go Fish</button><button id = 'Collect' class = select-button onclick = collect()>Collect</button></div>" 
/* ************************************ */
/* Set up jsPsych blocks */
/* ************************************ */
/* define static blocks */

var welcome_block = {
  type: 'text',
  text: '<div class = centerbox><p class = block-text>Welcome to the ART experiment. Press <strong>enter</strong> to begin.</p></div>',
  cont_key: 13,
  timing_post_trial: 0
};

var instructions_block = {
  type: 'instructions',
  pages: [
    '<div class = centerbox><p class = block-text>In this task, you will participate in a fishing tournament. During this tournament you will play a fishing game for multiple rounds. Each round, you will see a lake which has many fish in it, and your goal is to catch as many fish as possible.</p><p class = block-text>On the screen you will see a lake and two buttons: "Go Fish" and "Collect". If you "Go Fish" you randomly catch one of the fish in the lake. Each fish is equally likely.</p><p class = block-text>There are many red fish in the lake and one blue fish. Each red fish earns you 5 cents towards that round\'s "Trip Bank", which you can then "Collect" to move the money to your "Tournament Bank" and start a new round. However, if you catch the blue fish, the round will end and you will lose all the money you earned that round.</p></div>',
    '<div class = centerbox><p class = block-text>To keep your money from round to round you must  stop fishing and press "Collect" before you catch a blue fish.</p><p class = block-text>You will participate in four tournaments, each with different rules. One way the tournaments differ is whether you keep or release the fish you catch. In the "Catch N Release" condition, you will always release the fish you just caught so the number of red and blue fish will stay the same throughout the tournament.</p><p class = block-text>In the "Catch N Keep" condition, the fish you catch will come out of the lake and go into your cooler. Thus the chance of catching a blue fish increases each time you catch a red fish.</p></div>',
	'<div class = centerbox><p class = block-text>The weather will also differ between tournaments. When the weather is sunny you will be able to see how many fish are in the lake. There will also be counters below the lake that tell you exactly how many red and blue fish are still in the lake.</p><p class = block-text>When the weather is cloudy, the lake is murky and you will be unable to see any fish. The counters will also be blank. The keep or release rules still apply however. If you are in "Catch N Release", the number of fish in the lake stay the same after each "Go Fish". If you are in "Catch N Keep", the fish come out of the lake.</p></div>',
	'<div class = centerbox><p class = block-text>You will play one tournament with each combination of weather (sunny or cloudy) and release (release or keep) rules. Each tournament is independent. The money you earn in one tournament has no effect on the next. Your goal is to do as well as possible on all four tournaments.</p><p class = block-text>You can earn bonus pay by doing well on the tasks so try your best!</p></div>',
	'<div class = centerbox><p class = block-text>Before we start the tournaments, there will be a brief practice session for each of the four tournaments. Before each practice tournament starts you will choose the number of fish in the lake (1-200). During the actual experiment, you will not be able to choose the number of fish.</p></div>',
  ],
  allow_keys: false,
  show_clickable_nav: true,
  timing_post_trial: 1000
};

var end_block = {
  type: 'text',
  text: '<div class = centerbox><p class = center-block-text>Finished with this task.</p><p class = center-block-text>Press <strong>enter</strong> to begin.</p></div>',
  cont_key: 13,
  timing_post_trial: 0
};

var round_over_block = {
  type: 'text',
  text: getRoundOverText,
  cont_key: 13,
  timing_post_trial: 0
};

var ask_fish_block = {
		type: 'survey-text',
		questions: [["<p>For this tournament, how many fish are in the lake? Please enter a number between 1-200</p><p>If you don't respond, or respond out of these bounds the number of fish will be randomly set between 1-200.</p>"]]
}

var set_fish_block = {
	type: 'call-function',
	func: function() {
		var last_data = jsPsych.data.getData().slice(-1)[0]
		var last_response = parseInt(last_data.responses.slice(7,10))
		start_fish_num = last_response
		if (isNaN(start_fish_num) || start_fish_num > 200 || start_fish_num < 0) {
			start_fish_num = Math.floor(Math.random()*200)+1
		}
	},
    timing_post_trial: 0
}

var practice_block = {
  type: 'multi-button',
  stimuli: getGame,
  button_class: 'select-button',
  data: get_practice_data,
  timing_post_trial: 0
};


var practice_chunk = {
    chunk_type: 'while',
    timeline: [practice_block],
    continue_function: function(data){ 
       if (round_over == 1) {
			return false
		} else {
			return true
		}
    }
}

var game_block = {
  type: 'multi-button',
  stimuli: getGame,
  button_class: 'select-button',
  data: get_data,
  timing_post_trial: 0
};

var game_chunk = {
    chunk_type: 'while',
    timeline: [game_block],
    continue_function: function(data){
        if (round_over == 1) {
			return false
		} else {
			return true
		}
    }
}

art_experiment = []
art_experiment.push(welcome_block)
art_experiment.push(instructions_block)
for (b = 0; b<practiceblocks.length; b++) {
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
	var tournament_intro_block = {
		type: 'text',
		text: '<div class = centerbox><p class = block-text>You will now start a tournament. The weather is <span style="color:blue">' + weather + '</span> which means ' + weather_rule + '. The release rule is <span style="color:red">"' + release + '"</span>, which means ' + release_rule + '.</p><p class = center-block-text>Press <strong>enter</strong> to begin.</p></div>',
		cont_key: 13,
		data: {weather: weather, release: release},
		on_finish: function(data) {
			weather = data.weather
			release = data.release
		}
	}
	art_experiment.push(tournament_intro_block)
	art_experiment.push(ask_fish_block)
	art_experiment.push(set_fish_block)
	for (i=0; i <num_practice_rounds; i++) {
		art_experiment.push(practice_chunk)
		art_experiment.push(round_over_block)
	}
}

for (b = 0; b<blocks.length; b++) {
	block = blocks[b]
	weather = block.weather
	release = block.release
	if (weather == "Sunny") {
		start_fish_num = 128
		weather_rule = "you can see how many fish are in the lake"
	} else {
		start_fish_num = 65
		weather_rule = "you won't be able to see how many fish are in the lake"
	}
	if (release == "Keep") {
		release_rule = "the fish you catch comes out of the lake"
	} else {
		release_rule = "the number of fish in the lake stays the same"
	}
	var tournament_intro_block = {
		type: 'text',
		text: '<div class = centerbox><p class = block-text>You will now start a tournament. The weather is <span style="color:blue">' + weather + '</span> which means ' + weather_rule + '. The release rule is <span style="color:red">"' + release + '"</span>, which means ' + release_rule + '.</p><p class = center-block-text>Press <strong>enter</strong> to begin.</p></div>',
		cont_key: 13,
		data: {weather: weather, release: release},
		on_finish: function(data) {
			weather = data.weather
			release = data.release
		}
	}
	art_experiment.push(tournament_intro_block)
	for (i=0; i <num_rounds; i++) {
		art_experiment.push(game_chunk)
		art_experiment.push(round_over_block)
	}
}
art_experiment.push(end_block)
