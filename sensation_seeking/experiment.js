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
    exp_id: "sensation_seeking"
  }
};

var instructions_block = {
  type: 'poldrack-instructions',
  pages: [
    '<div class = centerbox><p class = block-text>Please indicate which of the following scenarios you would prefer.</p></div>',
  ],
  allow_keys: false,
  show_clickable_nav: true,
  timing_post_trial: 1000,
  data: {
    exp_id: "sensation_seeking"
  }
};

var all_pages = [fillArray("", 10), fillArray("", 10), fillArray("", 10), fillArray("", 4)]

var all_options = [
  [
    ["I would like a job which would require a lot of traveling.",
      "I would prefer a job in one location."
    ],
    ["I am invigorated by a brisk, cold day.",
      "I cannot wait to get into the indoors on a cold day."
    ],
    ["I ﬁnd a certain pleasure in routine kinds of work.",
      "Although it is sometimes necessary I usually dislike routine kinds of work."
    ],
    ["I often wish I could be a mountain climber.",
      "I cannot understand people who risk their necks climbing mountains."
    ],
    ["I dislike all body odors.", "I like some of the earthy body smells."],
    ["I get bored seeing the same old faces.",
      "I like the comfortable familiarity of everyday friends."
    ],
    [
      "I like to explore a strange city or section of town by myself, even if it means getting lost.",
      "I prefer a guide when I am in a place I do not know well."
    ],
    ["I find the quickest and easiest route to a place and stick to it.",
      "I sometimes take diﬁerent routes to a place I often go, just for the sake of variety."
    ],
    ["I would not like to try any drug which might produce strange and dangerous effects on me.",
      "I would like to try some of the new drugs that produce hallucinations."
    ],
    ["I would prefer living in an ideal society where everyone is safe, secure, and happy.",
      "I would have preferred living in the unsettled days of our history."
    ]
  ],
  [
    ["I sometimes like to do things that are a little frightening.",
      "A sensible person avoids activities that are dangerous."
    ],
    [
      "I order the dishes with which I am familiar, so as to avoid disappointment and unpleasantness.",
      "I like to try new foods that I have never tasted before."
    ],
    ["I cannot stand riding with a person who likes to speed.",
      "I sometimes like to drive very fast because I ﬁnd it exciting."
    ],
    [
      "If I were a salesman I would prefer a straight salary, rather than the risk of making little or nothing on a commission basis.",
      "If I were a salesman I would prefer working on a commission if I had a chance to make more money than I could on a salary."
    ],
    ["I would like to take up the sport of water skiing.",
      "I would not like to take up water skiing."
    ],
    [
      "I do not like to argue with people whose beliefs are sharply divergent from mine, since such arguments are never resolved.",
      "I find people that disagree with my beliefs more stimulating than people who agree with me."
    ],
    ["When I go on a trip I like to plan my route and timetable fairly carefully.",
      "I would like to take off on a trip with no preplanned or definite routes, or timetables."
    ],
    ["I enjoy the thrills of watching car races.", "I find our races unpleasant."],
    ["Most people spend entirely too much money on life insurance.",
      "Life insurance is something that no man can afford to be without."
    ],
    ["I would like to learn to ﬂy an airplane.", "I would not like to learn to ﬂy an airplane."]
  ],
  [
    ["I would not like to be hypnotized.",
      "I would like to have the experience of being hypnotized."
    ],
    [
      "The most important goal of life is to live it to the fullest and experience as much of it as you can.",
      "The most important goal of life is to ﬁnd peace and happiness."
    ],
    ["I would like to try parachute jumping.",
      "I would never want to try jumping out of a plane, with or without a parachute."
    ],
    ["I enter cold water gradually giving myself time to get used to it.",
      "I like to dive or jump right into the ocean or a cold pool."
    ],
    ["I do not like the irregularity and discord of most modern music.",
      "I like to listen to new and unusual kinds of music."
    ],
    ["I prefer friends who are exciting unpredictable.",
      "I prefer friends who are reliable and predictable."
    ],
    ["When I go on a vacation I prefer the comfort of a good room and bed.",
      "When I go on a vacation vaould prefer the change of camping out."
    ],
    ["The essence of good art is in its clarity. symmetry of form, and harmony of colors.",
      "I often ﬁnd beauty in the clashing colors and irregular forms of modern paintings."
    ],
    ["The worst social sin is to be rude.", "The worst social sin is to be a bore."],
    ["I look forward to a good night of rest after a long day.",
      "I wish I did not have to waste so much of a day sleeping."
    ]
  ],
  [
    ["I prefer people who are emotionally expressive even if they are a bit unstable.",
      "I prefer people who are calm and even tempered."
    ],
    ["A good painting should shock or jolt the senses.",
      "A good painting should give one a feeling of peace and security."
    ],
    ["When I feel discouraged I recover by relaxing and having some soothing diversion.",
      "When I feel discouraged I recover by going out and doing something new and exciting."
    ],
    ["People who ride motorcycles must have some kind of an unconscious need to hurt themselves.",
      "I would like to drive or ride on a motorcycle."
    ]
  ]
]

//higher - more impulsiveness
var scale_reg = {
  "I would like a job which would require a lot of traveling.": 2,
  "I would prefer a job in one location.": 1,
  "I am invigorated by a brisk, cold day.": 2,
  "I cannot wait to get into the indoors on a cold day.": 1,
  "I ﬁnd a certain pleasure in routine kinds of work.": 1,
  "Although it is sometimes necessary I usually dislike routine kinds of work.": 2,
  "I often wish I could be a mountain climber.": 2,
  "I cannot understand people who risk their necks climbing mountains.": 1,
  "I dislike all body odors.": 1,
  "I like some of the earthy body smells.": 2,
  "I get bored seeing the same old faces.": 2,
  "I like the comfortable familiarity of everyday friends.": 1,
  "I like to explore a strange city or section of town by myself, even if it means getting lost.": 2,
  "I prefer a guide when I am in a place I do not know well.": 1,
  "I find the quickest and easiest route to a place and stick to it.": 1,
  "I sometimes take diﬁerent routes to a place I often go, just for the sake of variety.": 2,
  "I would not like to try any drug which might produce strange and dangerous effects on me.": 1,
  "I would like to try some of the new drugs that produce hallucinations.": 2,
  "I would prefer living in an ideal society where everyone is safe, secure, and happy.": 1,
  "I would have preferred living in the unsettled days of our history.": 2,
  "I sometimes like to do things that are a little frightening.": 2,
  "A sensible person avoids activities that are dangerous.": 1,
  "I order the dishes with which I am familiar, so as to avoid disappointment and unpleasantness.": 1,
  "I like to try new foods that I have never tasted before.": 2,
  "I cannot stand riding with a person who likes to speed.": 1,
  "I sometimes like to drive very fast because I ﬁnd it exciting.": 2,
  "If I were a salesman I would prefer a straight salary, rather than the risk of making little or nothing on a commission basis.": 1,
  "If I were a salesman I would prefer working on a commission if I had a chance to make more money than I could on a salary.": 2,
  "I would like to take up the sport of water skiing.": 2,
  "I would not like to take up water skiing.": 1,
  "I do not like to argue with people whose beliefs are sharply divergent from mine, since such arguments are never resolved.": 1,
  "I find people that disagree with my beliefs more stimulating than people who agree with me.": 2,
  "When I go on a trip I like to plan my route and timetable fairly carefully.": 1,
  "I would like to take off on a trip with no preplanned or definite routes, or timetables.": 2,
  "I enjoy the thrills of watching car races.": 2,
  "I find our races unpleasant.": 1,
  "Most people spend entirely too much money on life insurance.": 2,
  "Life insurance is something that no man can afford to be without.": 1,
  "I would like to learn to ﬂy an airplane.": 2,
  "I would not like to learn to ﬂy an airplane.": 1,
  "I would not like to be hypnotiaed.": 1,
  "I would like to have the experience of being hypnotized.": 2,
  "The most important goal of life is to live it to the fullest and experience as much of it as you can.": 2,
  "The most important goal of life is to ﬁnd peace and happiness.": 1,
  "I would like to try parachute jumping.": 2,
  "I would never want to try jumping out of a plane, with or without a parachute.": 1,
  "I enter cold water gradually giving myself time to get used to it.": 1,
  "I like to dive or jump right into the ocean or a cold pool.": 2,
  "I do not like the irregularity and discord of most modern music.": 1,
  "I like to listen to new and unusual kinds of music.": 2,
  "I prefer friends who are exciting unpredictable.": 2,
  "I prefer friends who are reliable and predictable.": 1,
  "When I go on a vacation I prefer the comfort of a good room and bed.": 1,
  "When I go on a vacation I prefer the change of camping out.": 2,
  "The essence of good art is in its clarity. symmetry of form, and harmony of colors.": 1,
  "I often ﬁnd beauty in the clashing colors and irregular forms of modern paintings.": 2,
  "The worst social sin is to be rude.": 1,
  "The worst social sin is to be a bore.": 2,
  "I look forward to a good night of rest after a long day.": 1,
  "I wish I did not have to waste so much of a day sleeping.": 2,
  "I prefer people who are emotionally expressive even if they are a bit unstable.": 2,
  "I prefer people who are calm and even tempered.": 1,
  "A good painting should shock or jolt the senses.": 2,
  "A good painting should give one a feeling of peace and security.": 1,
  "When I feel discouraged I recover by relaxing and having some soothing diversion.": 1,
  "When I feel discouraged I recover by going out and doing something new and exciting.": 2,
  "People who ride motorcycles must have some kind of an unconscious need to hurt themselves.": 1,
  "I would like to drive or ride on a motorcycle.": 2
}

var score_scale =  [fillArray(scale_reg, 10), fillArray(scale_reg, 10), fillArray(scale_reg, 10), fillArray(scale_reg, 4)]

var survey_block = {
  type: "poldrack-survey-multi-choice",
  exp_id: "sensation_seeking",
  horizontal: false,
  preamble: 'Please choose one of each pair of options.',
  pages: all_pages,
  options: all_options,
  scale: score_scale,
  show_clickable_nav: true,
  allow_backward: true,
  required: [fillArray(true, 10), fillArray(true, 10), fillArray(true, 10), fillArray(true, 4)]
};

var end_block = {
  type: 'text',
  text: '<div class = centerbox><p class = center-block-text>Congratulations for completing this task!</p><p class = center-block-text>Press <strong>enter</strong> to continue.</p></div>',
  cont_key: [13],
  data: {
    exp_id: "sensation_seeking"
  }
};


//Set up experiment
var sensation_seeking_experiment = []
sensation_seeking_experiment.push(welcome_block);
sensation_seeking_experiment.push(instructions_block);
sensation_seeking_experiment.push(survey_block);
sensation_seeking_experiment.push(end_block);