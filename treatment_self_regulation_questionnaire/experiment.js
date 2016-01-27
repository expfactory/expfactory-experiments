function fillArray(value, len) {
  if (len === 0) return [];
  var a = [value];
  while (a.length * 2 <= len) a = a.concat(a);
  if (a.length < len) a = a.concat(a.slice(0, len - a.length));
  return a;
}

var opts = ["Not at all true",'","", "Somewhat true","","","Very True"]

var all_pages = [["Because I feel that I want to take responsibility for my own health","Because I would feel guilty or ashamed of myself if I smoked","Because I personally believe it is the best thing for my health","Because others would be upset with me if I smoked","I really don't think about it","Because I have carefully thought about it and believe it is very important for many aspects of my life","Because I would feel bad about myself if I smoked","Because it is an important choice I really want to make","Because I feel pressure from others to not smoke","Because it is easier to do what I am told than to think about it","Because it is consistent with my life goals","Because I want others to approve of me","Because it is very important for being as healthy as possible","Because I want others to see that I can do it","I don't really know why"]]

var all_options = [fillArray(opts, 15)]

var score_scale = {"Not at all true": 1, '': 2, '': 3, "Somewhat true": 4, '': 5, '':6,"Very True":7}

var survey_block = {
  type: "poldrack-survey-multi-choice",
  horizontal: true,
  preamble: "Answer the questions",
  pages: all_pages,
  options: all_options,
  scale: score_scale,
  show_clickable_nav: true,
  allow_backward: true,
  required: [fillArray(true,15)],
  reverse_score: [[false, false, false, false, false, false, false, false, false, false, false, false, false, false, false]],
};

var treatment_self_regulation_questionnaire_experiment = []
treatment_self_regulation_questionnaire_experiment.push(survey_block)
