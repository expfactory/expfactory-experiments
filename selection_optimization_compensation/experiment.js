/* ************************************ */
/* Define helper functions */
/* ************************************ */
function getDisplayElement() {
  $('<div class = display_stage_background></div>').appendTo('body')
  return $('<div class = display_stage></div>').appendTo('body')
}

function fillArray(value, len) {
  if (len === 0) return [];
  var a = [value];
  while (a.length * 2 <= len) a = a.concat(a);
  if (a.length < len) a = a.concat(a.slice(0, len - a.length));
  return a;
}

/* ************************************ */
/* Define experimental variables */
/* ************************************ */

/* ************************************ */
/* Set up jsPsych blocks */
/* ************************************ */

/* define static blocks */

var welcome_block = {
  type: 'text',
  text: '<div class = centerbox><p class = center-block-text>Welcome to this survey.<br><br> Press <strong>enter</strong> to begin.</p></div>',
  cont_key: [13],
  data: {
    exp_id: "selection_optimization_compensation"
  }
};

var instructions_block = {
  type: 'poldrack-instructions',
  pages: [
    '<div class = centerbox><p class = block-text>Please select which of the two statements is more true for you.</p></div>',
  ],
  allow_keys: false,
  show_clickable_nav: true,
  timing_post_trial: 1000,
  data: {
    exp_id: "selection_optimization_compensation"
  }
};

var all_pages = [fillArray("", 12), fillArray("", 12), fillArray("", 12), fillArray("", 12)]

var all_options = [
  [
    ["I concentrate all my energy on a few things", "I divide my energy among many things"],
    ["I always focus on the one most important goal at a given time",
      "I am always working on several goals at once"
    ],
    ["When I think about what I want in life, I commit myself to one or two important goals",
      "Even when I really consider what I want in life, I wait and see what happens instead of committing myself to just one or two particular goals"
    ],
    ["To achieve a particular goal, I am willing to abandon other goals",
      "Just to achieve a particular goal, I am not willing to abandon other ones"
    ],
    ["I always pursue goals one after the other",
      "I always pursue many goals at once, so that I easily get bogged down"
    ],
    ["I know exactly what I want and what I do not want",
      "I often only know what I want as the result of a situation"
    ],
    ["When I decide upon a goal, I stick to it", "I can change a goal again at any time"],
    ["I always direct my attention to my most important goal",
      "I always approach several goals at once"
    ],
    ["I make important life decisions",
      "I do not like to commit myself to speciﬁc life decisions"
    ],
    ["I consider exactly what is important for me",
      "I take things as they come and carry on from there"
    ],
    ["I do not have many goals in life that are equally important to me",
      "I have many goals in life that are equally important to me"
    ],
    ["I have set my goals clearly and stick to them", "I often adapt my goals to small changes"]
  ],
  [
    ["When things do not go as well as before, I choose one or two important goals",
      "When things do not go as well as before, I still try to keep all my goals"
    ],
    ["When I cannot do something important the way I did before, I look for a new goal",
      "When I cannot do something important the way I did before, I distribute my time and energy among many other things"
    ],
    [
      "When I cannot do something as well as I used to, I think about what exactly is important to me",
      "When I cannot do something as well as I used to, I wait and see what comes"
    ],
    ["If I cannot do something as well as before, I concentrate only on essentials",
      "Even if I cannot do something as well as before, I pursue all my goals"
    ],
    ["When I cannot carry on as I used to, I direct my attention to my most important goal",
      "When I cannot carry on as I used to, I direct my attention, like usual, to all my goals"
    ],
    [
      "When something becomes increasingly difﬁcult for me, I consider which goals I could achieve under the circumstances",
      "When something becomes increasingly difﬁcult for me, I accept it"
    ],
    ["When things do not work so well, I pursue my most important goal ﬁrst",
      "When things do not go so well, I leave it at that"
    ],
    ["When something requires more and more effort, I think about what exactly I really want",
      "When something requires more and more effort, I do not worry about it"
    ],
    [
      "When things do not go as well as before, I drop some goals to concentrate on the more important ones",
      "When things do not go as well as before, I wait for better times"
    ],
    [
      "When I am not able to achieve something anymore, I direct my efforts at what is still possible",
      "When I am not able to achieve something anymore, I trust that the situation will improve by itself"
    ],
    [
      "When things do not go as well as before, I think about what, exactly, is really important to me",
      "When things do not go as well as before, I leave it at that"
    ],
    [
      "When I can no longer do something in my usual way, I think about what, exactly, I am able to do under the circumstances",
      "When I can no longer do something in my usual way, I do not think long about it"
    ]
  ],
  [
    ["I keep working on what I have planned until I succeed",
      "When I do not succeed right away at what I want to do, I do not try other possibilities for very long"
    ],
    ["I make every effort to achieve a given goal",
      "I prefer to wait for a while and see if things will work out by themselves"
    ],
    ["If something matters to me, I devote myself fully and completely to it",
      "Even if something matters to me, I still have a hard time devoting myself fully and completely to it"
    ],
    ["I keep trying until I succeed at a goal",
      "I do not keep trying very long, when I don’t succeed right away at a goal"
    ],
    ["I do everything I can to realize my plans",
      "I wait a while ﬁrst to see if my plans do not realize themselves"
    ],
    ["When I choose a goal, I am also willing to invest much effort in it",
      "I usually choose a goal that I can achieve without much effort"
    ],
    ["When I want to achieve something, I can wait for the right moment",
      "When I want to achieve something, I take the ﬁrst opportunity that comes"
    ],
    [
      "When I have started something that is important to me, but has little chance at success, I make a particular effort",
      "When I start something that is important to me but has little chance at success, I usually stop trying"
    ],
    ["When I want to get ahead, I take a successful person as a model",
      "When I want to get ahead, only I myself know the best way to do it"
    ],
    ["I think about exactly how I can best realize my plans",
      "I do not think long about how to realize my plans, I just try it"
    ],
    ["When something is important to me, I do not let setbacks discourage me",
      "Setbacks show me that I should turn to something else"
    ],
    ["I think about when exactly I can best realize my plans",
      "In terms of realizing my plans, I begin right away"
    ]
  ],
  [
    [
      "When things do not go as well as they used to, I keep trying other ways until I can achieve the same result I used to",
      "When things do not go as well as they used to, I accept it"
    ],
    [
      "When something in my life is not working as well as it used to, I ask others for help or advice",
      "When something in my life is not working as well as it used to, I decide what to do about it myself, without involving other people"
    ],
    [
      "When it becomes harder for me to get the same results I keep trying harder until I can do it as well as before",
      "When it becomes harder for me to get the same results as I used to, it is time to let go of that expectation"
    ],
    ["For important things, I pay attention to whether I need to devote more time or effort",
      "Even if something is important to me, it can happen that I do not invest the necessary time or effort"
    ],
    [
      "In particularly difﬁcult life situations, I try to get help from doctors, counselors or other experts",
      "In particularly difﬁcult life situations, I try to manage by myself"
    ],
    ["When things are not going so well, I accept help from others",
      "Even in difﬁcult situations, I do not burden others"
    ],
    ["When things do not work the way they used to, I look for other ways to achieve them",
      "When things do not work the way they used to, I accept things the way they are"
    ],
    [
      "When I cannot do something as well as before, then I ﬁnd out about other ways and means to achieve it",
      "When I cannot do something as well as before then I accept it"
    ],
    ["When I cannot do something as well as I used to, then I ask someone else to do it for me",
      "When I cannot do something as well as I used to, I accept the change"
    ],
    [
      "When I am afraid of losing something that I have achieved, then I invest more time and effort in it",
      "Just to prevent losing what I have achieved, I am not willing to invest more time and effort in it"
    ],
    ["When something does not work as well as usual, I look at how others do it",
      "When something does not work as well as usual, I do not spend much time thinking about it"
    ],
    [
      "When something does not work as well as before, I listen to advisory broadcasts and books as well",
      "When something does not work as well as before, I am the one who knows what is best for me"
    ]
  ]
]

//target:1 distractor:2
var score_scale = {
  "I concentrate all my energy on a few things": 1,
  "I divide my energy among many things": 2,
  "I always focus on the one most important goal at a given time": 1,
  "I am always working on several goals at once": 2,
  "When I think about what I want in life, I commit myself to one or two important goals": 1,
  "Even when I really consider what I want in life, I wait and see what happens instead of committing myself to just one or two particular goals": 2,
  "To achieve a particular goal, I am willing to abandon other goals": 1,
  "Just to achieve a particular goal, I am not willing to abandon other ones": 2,
  "I always pursue goals one after the other": 1,
  "I always pursue many goals at once, so that I easily get bogged down": 2,
  "I know exactly what I want and what I do not want": 1,
  "I often only know what I want as the result of a situation": 2,
  "When I decide upon a goal, I stick to it": 1,
  "I can change a goal again at any time": 2,
  "I always direct my attention to my most important goal": 1,
  "I always approach several goals at once": 2,
  "I make important life decisions": 1,
  "I do not like to commit myself to speciﬁc life decisions": 2,
  "I consider exactly what is important for me": 1,
  "I take things as they come and carry on from there": 2,
  "I do not have many goals in life that are equally important to me": 1,
  "I have many goals in life that are equally important to me": 2,
  "I have set my goals clearly and stick to them": 1,
  "I often adapt my goals to small changes": 2,
  "When things do not go as well as before, I choose one or two important goals": 1,
  "When things do not go as well as before, I still try to keep all my goals": 2,
  "When I cannot do something important the way I did before, I look for a new goal": 1,
  "When I cannot do something important the way I did before, I distribute my time and energy among many other things": 2,
  "When I cannot do something as well as I used to, I think about what exactly is important to me": 1,
  "When I cannot do something as well as I used to, I wait and see what comes": 2,
  "If I cannot do something as well as before, I concentrate only on essentials": 1,
  "Even if I cannot do something as well as before, I pursue all my goals": 2,
  "When I cannot carry on as I used to, I direct my attention to my most important goal": 1,
  "When I cannot carry on as I used to, I direct my attention, like usual, to all my goals": 2,
  "When something becomes increasingly difﬁcult for me, I consider which goals I could achieve under the circumstances": 1,
  "When something becomes increasingly difﬁcult for me, I accept it": 2,
  "When things do not work so well, I pursue my most important goal ﬁrst": 1,
  "When things do not go so well, I leave it at that": 2,
  "When something requires more and more effort, I think about what exactly I really want": 1,
  "When something requires more and more effort, I do not worry about it": 2,
  "When things do not go as well as before, I drop some goals to concentrate on the more important ones": 1,
  "When things do not go as well as before, I wait for better times": 2,
  "When I am not able to achieve something anymore, I direct my efforts at what is still possible": 1,
  "When I am not able to achieve something anymore, I trust that the situation will improve by itself": 2,
  "When things do not go as well as before, I think about what, exactly, is really important to me": 1,
  "When things do not go as well as before, I leave it at that": 2,
  "When I can no longer do something in my usual way, I think about what, exactly, I am able to do under the circumstances": 1,
  "When I can no longer do something in my usual way, I do not think long about it": 2,
  "I keep working on what I have planned until I succeed": 1,
  "When I do not succeed right away at what I want to do, I do not try other possibilities for very long": 2,
  "I make every effort to achieve a given goal": 1,
  "I prefer to wait for a while and see if things will work out by themselves": 2,
  "If something matters to me, I devote myself fully and completely to it": 1,
  "Even if something matters to me, I still have a hard time devoting myself fully and completely to it": 2,
  "I keep trying until I succeed at a goal": 1,
  "I do not keep trying very long, when I don’t succeed right away at a goal": 2,
  "I do everything I can to realize my plans": 1,
  "I wait a while ﬁrst to see if my plans do not realize themselves": 2,
  "When I choose a goal, I am also willing to invest much effort in it": 1,
  "I usually choose a goal that I can achieve without much effort": 2,
  "When I want to achieve something, I can wait for the right moment": 1,
  "When I want to achieve something, I take the ﬁrst opportunity that comes": 2,
  "When I have started something that is important to me, but has little chance at success, I make a particular effort": 1,
  "When I start something that is important to me but has little chance at success, I usually stop trying": 2,
  "When I want to get ahead, I take a successful person as a model": 1,
  "When I want to get ahead, only I myself know the best way to do it": 2,
  "I think about exactly how I can best realize my plans": 1,
  "I do not think long about how to realize my plans, I just try it": 2,
  "When something is important to me, I do not let setbacks discourage me": 1,
  "Setbacks show me that I should turn to something else": 2,
  "I think about when exactly I can best realize my plans": 1,
  "In terms of realizing my plans, I begin right away": 2,
  "When things do not go as well as they used to, I keep trying other ways until I can achieve the same result I used to": 1,
  "When things do not go as well as they used to, I accept it": 2,
  "When something in my life is not working as well as it used to, I ask others for help or advice": 1,
  "When something in my life is not working as well as it used to, I decide what to do about it myself, without involving other people": 2,
  "When it becomes harder for me to get the same results I keep trying harder until I can do it as well as before": 1,
  "When it becomes harder for me to get the same results as I used to, it is time to let go of that expectation": 2,
  "For important things, I pay attention to whether I need to devote more time or effort": 1,
  "Even if something is important to me, it can happen that I do not invest the necessary time or effort": 2,
  "In particularly difﬁcult life situations, I try to get help from doctors, counselors or other experts": 1,
  "In particularly difﬁcult life situations, I try to manage by myself": 2,
  "When things are not going so well, I accept help from others": 1,
  "Even in difﬁcult situations, I do not burden others": 2,
  "When things do not work the way they used to, I look for other ways to achieve them": 1,
  "When things do not work the way they used to, I accept things the way they are": 2,
  "When I cannot do something as well as before, then I ﬁnd out about other ways and means to achieve it": 1,
  "When I cannot do something as well as before then I accept it": 2,
  "When I cannot do something as well as I used to, then I ask someone else to do it for me": 1,
  "When I cannot do something as well as I used to, I accept the change": 2,
  "When I am afraid of losing something that I have achieved, then I invest more time and effort in it": 1,
  "Just to prevent losing what I have achieved, I am not willing to invest more time and effort in it": 2,
  "When something does not work as well as usual, I look at how others do it": 1,
  "When something does not work as well as usual, I do not spend much time thinking about it": 2,
  "When something does not work as well as before, I listen to advisory broadcasts and books as well": 1,
  "When something does not work as well as before, I am the one who knows what is best for me": 2
}

var survey_block = {
  type: "poldrack-survey-multi-choice",
  exp_id: "selection_optimization_compensation",
  horizontal: false,
  preamble: '',
  pages: all_pages,
  options: all_options,
  scale: score_scale,
  show_clickable_nav: true,
  allow_backward: true,
  required: [fillArray(true, 12), fillArray(true, 12), fillArray(true, 12), fillArray(true, 12)],
  reverse_score: [
    [false, false, false, false, false, false, false, false, false, false, false, false],
    [false, false, false, false, false, false, false, false, false, false, false, false],
    [false, false, false, false, false, false, false, false, false, false, false, false],
    [false, false, false, false, false, false, false, false, false, false, false, false]
  ],
};

var end_block = {
  type: 'text',
  text: '<div class = centerbox><p class = center-block-text>Congratulations for completing this task!</p><p class = center-block-text>Press <strong>enter</strong> to continue.</p></div>',
  cont_key: [13],
  data: {
    exp_id: "selection_optimization_compensation"
  }
};


//Set up experiment
var selection_optimization_compensation_experiment = []
selection_optimization_compensation_experiment.push(welcome_block);
selection_optimization_compensation_experiment.push(instructions_block);
selection_optimization_compensation_experiment.push(survey_block);
selection_optimization_compensation_experiment.push(end_block);