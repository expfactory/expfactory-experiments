
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
    '<div class = centerbox><p class = block-text>In the following pages you will be presented with a number of statements that describe ways in which people act and think. For each statement, please indicate how much you agree or disagree with the statement.  Be sure to indicate your agreement or disagreement for every statement.<br><br> Press <strong>enter</strong> to begin.</p></div>',
  ],
  key_forward: 13,
  allow_backwards: false
};

var opts = ["Agree Strongly", "Agree Some", "Disagree Some", "Disagree Strongly"]

var all_pages = [["I have a reserved and cautious attitude toward life.","I have trouble controlling my impulses.","I generally seek new and exciting experiences and sensations.","I generally like to see things through to the end.","When I am very happy, I can’t seem to stop myself from doing things that can have bad consequences.","My thinking is usually careful and purposeful.","I have trouble resisting my cravings (for food, cigarettes, etc.).","I'll try anything once.","I tend to give up easily.","When I am in great mood, I tend to get into situations that could cause me problems.","I am not one of those people who blurt out things without thinking.","I often get involved in things I later wish I could get out of.","I like sports and games in which you have to choose your next move very quickly.","Unfinished tasks really bother me.","When I am very happy, I tend to do things that may cause problems in my life."],["I like to stop and think things over before I do them.","When I feel bad, I will often do things I later regret in order to make myself feel better now.","I would enjoy water skiing.","Once I get going on something I hate to stop.","I tend to lose control when I am in a great mood.","I don't like to start a project until I know exactly how to proceed.","Sometimes when I feel bad, I can't seem to stop what I am doing even though it is making me feel worse.","I quite enjoy taking risks.","I concentrate easily.","When I am really ecstatic, I tend to get out of control.","I would enjoy parachute jumping.","I finish what I start.","I tend to value and follow a rational, 'sensible' approach to things.","When I am upset I often act without thinking.", "Others would say I make bad choices when I am extremely happy about something."],["I welcome new and exciting experiences and sensations, even if they are a little frightening and unconventional.","I am able to pace myself so as to get things done on time.","I usually make up my mind through careful reasoning.","When I feel rejected, I will often say things that I later regret.","Others are shocked or worried about the things I do when I am feeling very excited.","I would like to learn to fly an airplane.","I am a person who always gets the job done.","I am a cautious person.","It is hard for me to resist acting on my feelings.","When I get really happy about something, I tend to do things that can have bad consequences.","I sometimes like doing things that are a bit frightening.","I almost always finish projects that I start.","Before I get into a new situation I like to find out what to expect from it.","I often make matters worse because I act without thinking when I am upset.","When overjoyed, I feel like I can’t stop myself from going overboard."],["I would enjoy the sensation of skiing very fast down a high mountain slope.","Sometimes there are so many little things to be done that I just ignore them all.","I usually think carefully before doing anything.","When I am really excited, I tend not to think of the consequences of my actions.","In the heat of an argument, I will often say things that I later regret.","I would like to go scuba diving.","I tend to act without thinking when I am really excited.","I always keep my feelings under control.","When I am really happy, I often find myself in situations that I normally wouldn't be comfortable with.","Before making up my mind, I consider all the advantages and disadvantages.","I would enjoy fast driving.","When I am very happy, I feel like it is ok to give in to cravings or overindulge.","Sometimes I do impulsive things that I later regret.","I am surprised at the things I do while in a great mood."]]

var all_options = [fillArray(opts, 15), fillArray(opts, 15), fillArray(opts, 15), fillArray(opts, 14)]

var score_scale = {"Agree Strongly":1, "Agree Some":2, "Disagree Some":3, "Disagree Strongly":4}

var survey_block = {
  type: "poldrack-survey-multi-choice",
  horizontal: true,
  preamble: '',
  pages: all_pages,
  options: all_options,
  scale: score_scale,
  show_clickable_nav: true,
  allow_backward: true,
  required: [fillArray(true, 15), fillArray(true, 15), fillArray(true, 15), fillArray(true, 14)],
  reverse_score: [[false, true, true, false, true, false, true, true, true, true, false, true, true, false, true],[false, true, true, false, true, false, true, true, false, true, true, false, false, true, true],[true, false, false, true, true, true, false, false, true, true, true, false, false, true, true],[true, true, false, true, true, true, true, false, true, false, true, true, true, true]]
};

var end_block = {
  type: 'text',
  text: '<div class = centerbox><p class = center-block-text>Congratulations for completing this task!</p><p class = center-block-text>Press <strong>enter</strong> to continue.</p></div>',
  cont_key: [13]
};


//Set up experiment
var upps_p_experiment = []
upps_p_experiment.push(welcome_block);
upps_p_experiment.push(instructions_block);
upps_p_experiment.push(survey_block);
upps_p_experiment.push(end_block);