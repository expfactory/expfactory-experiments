function fillArray(value, len) {
  if (len == 0) return [];
  var a = [value];
  while (a.length * 2 <= len) a = a.concat(a);
  if (a.length < len) a = a.concat(a.slice(0, len - a.length));
  return a;
}

var opts = ["Strongly disagree", "Mostly disagree", "Somewhat disagree", "Neither agree or disagree", "Somewhat agree", "Mostly agree", "Strongly agree"]

var all_pages = [["I control my emotions by changing the way I think about the situation I am in.","When I want to feel less negative emotion, I change the way I am thinking about the situation."],["When I want to feel more positive emotion, I change the way I am thinking about the situation.","When I want to feel more positive emotion (such as joy or amusement), I change what I am thinking about.","When I want to feel less negative emotion (such as sadness or anger), I change what I am thinking about."],["When I am faced with a stressful situation, I make myself think about it in a way that helps me stay calm.","I control my emotions by not expressing them.","When I am feeling negative emotions, I make sure not to express them.","I keep my emotions to myself.","When I am feeling positive emotions, I am careful not to express them."]]

var all_options = [fillArray(opts, 2),fillArray(opts, 3), fillArray(opts, 5)]

var score_scale = {"Strongly disagree": 1, "Mostly disagree": 2, "Somewhat disagree": 3, "Neither agree or disagree": 4, "Somewhat agree": 5, "Mostly agree": 6, "Strongly agree": 7}

var survey_block = {
  type: "survey-multi-choice",
  horizontal: true,
  preamble: "Answer the questions",
  pages: all_pages,
  options: all_options,
  scale: score_scale,
  show_clickable_nav: true,
  allow_backward: true,
  required: [fillArray(true,2),[false].concat(fillArray(true, 2)),fillArray(true, 5)],
  reverse_score: [fillArray(true,2),fillArray(false, 3),fillArray(true, 5)],
};

var survey_experiment = []
survey_experiment.push(survey_block)