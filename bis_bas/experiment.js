
/* ************************************ */
/* Define helper functions */
/* ************************************ */

function getDisplayElement () {
    $('<div class = display_stage_background></div>').appendTo('body')
    return $('<div class = display_stage></div>').appendTo('body')
}

function fillArray(value, len) {
  if (len == 0) return [];
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
  text: '<div class = centerbox><p class = block-text>Welcome to this survey. Press <strong>enter</strong> to begin.</p></div>',
  cont_key: [13]
};

var instructions_block = {
  type: 'instructions',
  pages: [
    '<div class = centerbox><p class = block-text>"Each item of this questionnaire is a statement that a person may either agree with or disagree with.  For each item, indicate how much you agree or disagree with what the item says.  Please respond to all the items; do not leave any blank.  Choose only one response to each statement.  Please be as accurate and honest as you can be.  Respond to each item as if it were the only item.  That is, do not worry about being "consistent" in your responses." <br><br> Press <strong>enter</strong> to begin.</p></div>',
  ],
  key_forward: 13,
  allow_backwards: false
};

function fillArray(value, len) {
  if (len == 0) return [];
  var a = [value];
  while (a.length * 2 <= len) a = a.concat(a);
  if (a.length < len) a = a.concat(a.slice(0, len - a.length));
  return a;
}

var opts = ["Very true for me", "Somewhat true for me", "Somewhat false for me", "Very false for me"]

var all_pages = [["A person's family is the most important thing in life.","Even if something bad is about to happen to me, I rarely experience fear or nervousness.","I go out of my way to get things I want.","When I am doing well at something I love to keep at it.","I am always willing to try something new if I think it will be fun.","How I dress is important to me.","When I get something I want, I feel excited and energized.","Criticism or scolding hurts me quite a bit.","When I want something I usually go all-out to get it.","I will often do things for no other reason than that they might be fun."],["It is hard for me to find the time to do things such as get a haircut.","If I see a chance to get something I want I move on it right away.","I feel pretty worried or upset when I think or know somebody is angry at me." ,"When I see an opportunity for something I like I get excited right away." ,"I often act on the spur of the moment." ,"If I think something unpleasant is going to happen I usually get pretty 'worked up.'" ,"I often wonder why people act the way they do.","When good things happen to me, it affects me strongly.","I feel worried when I think I have done poorly at something important.","I crave excitement and new sensations."],["When I go after something I use a 'no holds barred' approach.","I have very few fears compared to my friends.","It would excite me to win a contest.","I worry about making mistakes."]]

var all_options = [fillArray(opts, 10),fillArray(opts, 10), fillArray(opts, 4)]

var score_scale = {"Very true for me": 1, "Somewhat true for me": 2, "Somewhat false for me": 3, "Very false for me": 4}

var survey_block = {
  type: "poldrack-survey-multi-choice",
  horizontal: true,
  preamble: "",
  pages: all_pages,
  options: all_options,
  scale: score_scale,
  show_clickable_nav: true,
  allow_backward: true,
  required: [fillArray(true, 10),fillArray(true, 10), fillArray(true, 4)],
  reverse_score: [[true, false].concat(fillArray(true, 8)),fillArray(true, 10),[true, false].concat(fillArray(true, 2))],
};

var end_block = {
  type: 'text',
  text: '<div class = centerbox><p class = center-block-text>Congratulations for completing this task!</p><p class = center-block-text>Press <strong>enter</strong> to continue.</p></div>',
  cont_key: [13]
};


//Set up experiment
var bis_bas_experiment = []
bis_bas_experiment.push(welcome_block);
bis_bas_experiment.push(instructions_block);
bis_bas_experiment.push(survey_block);
bis_bas_experiment.push(end_block);