function fillArray(value, len) {
  if (len === 0) return [];
  var a = [value];
  while (a.length * 2 <= len) a = a.concat(a);
  if (a.length < len) a = a.concat(a.slice(0, len - a.length));
  return a;
}

var opts = ["Strongly disagree", "Mostly disagree", "Somewhat disagree", "Neither agree or disagree", "Somewhat agree", "Mostly agree", "Strongly agree"]

var all_pages = [["Extraverted, Enthusiastic","Critical, Quarrelsome", "Dependable, Self-Disciplined", "Anxious, Easily Upset", "Open to new experiences, complex", "Reserved, Quiet", "Sympathetic, Warm", "Disorganized, Careless", "Calm, Emotionally Stable", "Conventional, Uncreative"]]

var all_options = [fillArray(opts, 10)]

var score_scale = {"Strongly disagree": 1, "Mostly disagree": 2, "Somewhat disagree": 3, "Neither agree or disagree": 4, "Somewhat agree": 5, "Mostly agree": 6, "Strongly agree": 7}

var survey_block = {
  type: "poldrack-survey-multi-choice",
  horizontal: true,
  preamble: "Answer the questions",
  pages: all_pages,
  options: all_options,
  scale: score_scale,
  show_clickable_nav: true,
  allow_backward: true,
  required: [fillArray(true,10)],
  reverse_score: [[false, true, false, true, false, true, false, true, false, true]],
};

var ten_item_personality_inventory_experiment = []
ten_item_personality_inventory_experiment.push(survey_block)