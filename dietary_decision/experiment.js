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
  /* Function to calculate the "credit_var", which is a boolean used to
  credit individual experiments in expfactory.
   */
  var experiment_data = jsPsych.data.getTrialsOfType('single-stim-button');
  var missed_count = 0;
  var trial_count = 0;
  var rt_array = [];
  var rt = 0;
  var avg_rt = -1;
  //record choices participants made
  for (var i = 0; i < experiment_data.length; i++) {
    trial_count += 1
    rt = experiment_data[i].rt
    if (rt == -1) {
      missed_count += 1
    } else {
      rt_array.push(rt)
    }
  }
  //calculate average rt
  if (rt_array.length !== 0) {
    avg_rt = math.median(rt_array)
  } else {
    avg_rt = -1
  }
  credit_var = (avg_rt > 200)
  jsPsych.data.addDataToLastTrial({"credit_var": credit_var})
}

var randomDraw = function(lst) {
  var index = Math.floor(Math.random() * (lst.length))
  return lst[index]
}

var getHealthStim = function() {
  curr_stim = health_stims.shift()
  var stim = base_path + curr_stim
  return '<div class = dd_stimBox><img class = dd_Stim src = ' + stim + ' </img></div>' +
    health_response_area
}

var getTasteStim = function() {
  curr_stim = taste_stims.shift()
  var stim = base_path + curr_stim
  return '<div class = dd_stimBox><img class = dd_Stim src = ' + stim + ' </img></div>' +
    taste_response_area
}

var getDecisionStim = function() {
  curr_stim = decision_stims.shift()
  var stim = base_path + curr_stim
  return '<div class = dd_stimBox><img class = dd_Stim src = ' + stim + ' </img></div>' +
    decision_response_area
}

var getDecisionText = function() {
  return '<div class = dd_centerbox><p class = "block-text">In the next block of trials you should choose whether you would rather eat the food shown on each trial OR the food shown below. You will select response from "Strong No", "No", "Neutral", "Yes" and "Strong Yes". "No" means that you would rather eat the food below, while "Yes" means you would rather eat the food displayed on that trial.</p><p class = block-text>Take these decisions seriously. Imagine that at the end of the experiment you had to eat the food you chose in one random decision.</p><p class = block-text>Press <strong>enter</strong> to begin.</p></div></div><div class = dd_referenceBox><img class = dd_Stim src = ' +
    base_path + reference_stim + ' </img></div>'
}


var setUpTest = function() {
  // Calculate avg scores
  var random_stims = jsPsych.randomization.shuffle(stims)
  var ratings = {
    'taste': [],
    'health': []
  }
  var key = ''
  for (var j = 0; j < stims.length; j++) {
    key = stims[j]
    if (stim_ratings[key].taste !== 'NaN') {
      ratings.taste.push(stim_ratings[key].taste)
    }
    if (stim_ratings[key].health !== 'NaN') {
      ratings.health.push(stim_ratings[key].health)
    }
  }
  var median_taste = math.median(ratings.taste)
  var median_health = math.median(ratings.health)
  var min_distance = 100
  for (var i = 0; i < stims.length; i++) {
    key = random_stims[i]
    if (stim_ratings[key].taste !== 'NaN' && stim_ratings[key].health !== 'NaN') {
      var taste_dist = Math.pow((stim_ratings[key].taste - median_taste), 2)
      var health_dist = Math.pow((stim_ratings[key].health - median_health), 2)
      var dist = health_dist + taste_dist
      if (dist < min_distance) {
        if (reference_stim !== '') {
          decision_stims.push(reference_stim)
        }
        reference_stim = key
        min_distance = dist
      } else {
        decision_stims.push(key)
      }
    } else {
      decision_stims.push(key)
    }
  }
}


var getInstructFeedback = function() {
    return '<div class = centerbox><p class = "center-block-text">' +
      feedback_instruct_text + '</p></div>'
  }
  /* ************************************ */
  /* Define experimental variables */
  /* ************************************ */
  // generic task variables
var run_attention_checks = false
var attention_check_thresh = 0.65
var sumInstructTime = 0 //ms
var instructTimeThresh = 0 ///in seconds
var credit_var = true

// task specific variables
var healthy_responses = ['Very_Unhealthy', 'Unhealthy', 'Neutral', 'Healthy', 'Very_Healthy']
var tasty_responses = ['Very_Bad', 'Bad', 'Neutral', 'Good', 'Very_Good']
var decision_responses = ['Strong_No', 'No', 'Neutral', 'Yes', 'Strong_Yes']

var health_response_area = '<div class = dd_response_div>' +
  '<button class = dd_response_button id = Very_Unhealthy>Very Unhealthy</button>' +
  '<button class = dd_response_button id = Unhealthy>Unhealthy</button>' +
  '<button class = dd_response_button id = Neutral>Neutral</button>' +
  '<button class = dd_response_button id = Healthy>Healthy</button>' +
  '<button class = dd_response_button id = Very_Healthy>Very Healthy</button></div>'

var taste_response_area = '<div class = dd_response_div>' +
  '<button class = dd_response_button id = Very_Bad>Very Bad</button>' +
  '<button class = dd_response_button id = Bad>Bad</button>' +
  '<button class = dd_response_button id = Neutral>Neutral</button>' +
  '<button class = dd_response_button id = Good>Good</button>' +
  '<button class = dd_response_button id = Very_Good>Very Good</button></div>'

// Higher value indicates choosing the food item over the neutral food item.
var decision_response_area = '<div class = dd_response_div>' +
  '<button class = dd_response_button id = Strong_No>Strong No</button>' +
  '<button class = dd_response_button id = No>No</button>' +
  '<button class = dd_response_button id = Neutral>Neutral</button>' +
  '<button class = dd_response_button id = Yes>Yes</button>' +
  '<button class = dd_response_button id = Strong_Yes>Strong Yes</button></div>'

var base_path = '/static/experiments/dietary_decision/images/'
var stims = ['100Grand.bmp', 'banana.bmp', 'blueberryyogart.bmp', 'brocollincauliflower.bmp',
  'butterfinger.bmp', 'carrots.bmp', 'cellery.bmp', 'cherryicecream.bmp',
  'ChipsAhoy.bmp', 'cookiencream.bmp', 'cookies.bmp', 'cranberries.bmp',
  'Doritosranch.bmp', 'FamousAmos.bmp', 'ffraspsorbet.bmp', 'FlamingCheetos.bmp',
  'frozenyogart.bmp', 'Ghiradelli.bmp', 'grannysmith.bmp', 'HoHo.bmp',
  'icecreamsandwich.bmp', 'keeblerfudgestripes.bmp', 'keeblerrainbow.bmp', 'KitKat.bmp',
  'laysclassic.bmp', 'Lindt.bmp', 'mixedyogart.bmp', 'MrsFields.bmp', 'orange.bmp',
  'orangejello.bmp', 'Oreos.bmp', 'raisins.bmp', 'reddelicious.bmp',
  'redgrapes.bmp', 'Reeses.bmp', 'RiceKrispyTreat.bmp', 'ruffles.bmp',
  'sbcrackers.bmp', 'sbdietbar.bmp', 'slimfastC.bmp', 'slimfastV.bmp', 'specialKbar.bmp',
  'strawberries.bmp', 'strussel.bmp', 'uToberlorone.bmp', 'uTwix.bmp', 'wheatcrisps.bmp',
  'whitegrapes.bmp', 'wwbrownie.bmp', 'wwmuffin.bmp'
]
var images = []
for (var i = 0; i < stims.length; i++) {
  images.push(base_path + stims[i])
}
//preload images
jsPsych.pluginAPI.preloadImages(images)

var current_trial = 0
var health_stims = jsPsych.randomization.shuffle(stims)
var taste_stims = jsPsych.randomization.shuffle(stims)
var decision_stims = []
var reference_stim = ''
var curr_stim = ''
var stim_ratings = {}
for (var s = 0; s < stims.length; s++) {
  stim_ratings[stims[s]] = {}
}

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
var end_block = {
  type: 'poldrack-text',
  timing_response: 180000,
  data: {
    trial_id: 'end',
    exp_id: 'dietary_decision'
  },
  text: '<div class = centerbox><p class = "center-block-text">Thanks for completing this task!</p><p class = "center-block-text">Press <strong>enter</strong> to continue.</p></div>',
  cont_key: [13],
  timing_post_trial: 0,
  on_finish: assessPerformance
};

var feedback_instruct_text =
  'Welcome to the experiment. This task will take around 15 minutes. Press <strong>enter</strong> to begin.'
var feedback_instruct_block = {
  type: 'poldrack-text',
  data: {
    trial_id: 'instruction'
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
    trial_id: 'instruction'
  },
  pages: [
    "<div class = centerbox><p class = 'block-text'>In this task you will be rating different food items based on their tastiness and healthiness. Respond before the food item leaves the screen. The whole task should not take more than 10 minutes.</p></div>"
  ],
  allow_keys: false,
  show_clickable_nav: true,
  //timing_post_trial: 1000
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
      feedback_instruct_text =
        'Done with instructions. Press <strong>enter</strong> to continue.'
      return false
    }
  }
}

var start_health_block = {
  type: 'poldrack-text',
  timing_response: 180000,
  data: {
    trial_id: 'start_health'
  },
  text: '<div class = centerbox><p class = "center-block-text">In the next block of trials, rate the healthiness of each food item without regard for its taste. Press <strong>enter</strong> to begin.</p></div>',
  cont_key: [13],
  timing_post_trial: 500,
  on_finish: function() {
  	current_trial = 0
  }
};

var start_taste_block = {
  type: 'poldrack-text',
  data: {
    trial_id: 'start_taste'
  },
  timing_response: 180000,
  text: '<div class = centerbox><p class = "center-block-text">In the next block of trials, rate the tastiness of each food item without regard for its healthiness. Press <strong>enter</strong> to begin.</p></div>',
  cont_key: [13],
  timing_post_trial: 500,
  on_finish: function() {
  	current_trial = 0
  }
};

var setup_block = {
  type: 'call-function',
  data: {
    trial_id: 'setup test'
  },
  func: setUpTest,
  timing_post_trial: 0
}

var start_decision_block = {
  type: 'poldrack-text',
  timing_response: 180000,
  data: {
    trial_id: 'decision_text'
  },
  text: getDecisionText,
  cont_key: [13],
  timing_post_trial: 500,
  on_finish: function() {
  	current_trial = 0
  }
};


var fixation_block = {
  type: 'poldrack-single-stim',
  // stimulus: '<div class = centerbox><div class = "center-text">+</div></div>',
  stimulus: '<div class = centerbox><div class = "center-text">+</div></div>',
  is_html: true,
  timing_stim: 300,
  timing_response: 300,
  data: {
    trial_id: 'fixation'
  },
  choices: 'none',
  response_ends_trial: true,
  timing_post_trial: 1000
}

var health_block = {
  type: 'single-stim-button',
  // stimulus: getHealthStim,
  stimulus: getHealthStim,
  button_class: 'dd_response_button',
  data: {
    trial_id: 'stim',
    exp_stage: 'health_rating'
  },
  timing_stim: 4000,
  timing_response: 4000,
  response_ends_trial: true,
  timing_post_trial: 500,
  on_finish: function(data) {
    var numeric_rating = healthy_responses.indexOf(data.mouse_click) - 2
    if (data.mouse_click === -1) {
      numeric_rating = 'NaN'
    }
    jsPsych.data.addDataToLastTrial({
      'stim': curr_stim.slice(0, -4),
      'coded_response': numeric_rating,
      'trial_num': current_trial
    })
    current_trial += 1
    stim_ratings[curr_stim].health = numeric_rating
  }
}

var taste_block = {
  type: 'single-stim-button',
  // stimulus: getTasteStim,
  stimulus: getTasteStim,
  button_class: 'dd_response_button',
  data: {
    trial_id: 'stim',
    exp_stage: 'taste_rating'
  },
  timing_stim: 4000,
  timing_response: 4000,
  response_ends_trial: true,
  timing_post_trial: 500,
  on_finish: function(data) {
    var numeric_rating = tasty_responses.indexOf(data.mouse_click) - 2
    if (data.mouse_click === -1) {
      numeric_rating = 'NaN'
    }
    jsPsych.data.addDataToLastTrial({
      'stim': curr_stim.slice(0, -4),
      'coded_response': numeric_rating,
      'trial_num': current_trial
    })
    current_trial += 1
    stim_ratings[curr_stim].taste = numeric_rating
  }
}

var decision_block = {
  type: 'single-stim-button',
  stimulus: getDecisionStim,
  button_class: 'dd_response_button',
  data: {
    trial_id: 'stim',
    exp_stage: 'decision'
  },
  timing_stim: 4000,
  timing_response: 4000,
  response_ends_trial: true,
  timing_post_trial: 500,
  on_finish: function(data) {
    var decision_rating = decision_responses.indexOf(data.mouse_click) - 2
    var reference_rating = JSON.stringify(stim_ratings[reference_stim])
    var stim_rating = JSON.stringify(stim_ratings[curr_stim])
    jsPsych.data.addDataToLastTrial({
      'stim': curr_stim.slice(0, -4),
      'reference': reference_stim.slice(0, -4),
      'stim_rating': stim_rating,
      'reference_rating': reference_rating,
      'coded_response': decision_rating,
      'trial_num': current_trial
    })
    current_trial += 1
  }
}


/* create experiment definition array */
var dietary_decision_experiment = [];
dietary_decision_experiment.push(instruction_node);
if (Math.random() < 0.5) {
  dietary_decision_experiment.push(start_health_block);
  for (var i = 0; i < stims.length; i++) {
    dietary_decision_experiment.push(health_block);
  }
  dietary_decision_experiment.push(start_taste_block);
  for (var i = 0; i < stims.length; i++) {
    dietary_decision_experiment.push(taste_block);
  }
  dietary_decision_experiment.push(attention_node)
} else {
  dietary_decision_experiment.push(start_taste_block);
  for (var i = 0; i < stims.length; i++) {
    dietary_decision_experiment.push(taste_block);
  }
  dietary_decision_experiment.push(start_health_block);
  for (var i = 0; i < stims.length; i++) {
    dietary_decision_experiment.push(health_block);
  }
}
dietary_decision_experiment.push(setup_block);
dietary_decision_experiment.push(start_decision_block);
for (var i = 0; i < stims.length - 1; i++) {
  dietary_decision_experiment.push(decision_block);
}
dietary_decision_experiment.push(post_task_block)
dietary_decision_experiment.push(end_block);