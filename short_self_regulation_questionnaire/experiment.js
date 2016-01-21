function fillArray(value, len) {
  if (len == 0) return [];
  var a = [value];
  while (a.length * 2 <= len) a = a.concat(a);
  if (a.length < len) a = a.concat(a.slice(0, len - a.length));
  return a;
}

var opts = ["Strongly disagree", "Somewhat disagree", "Neither agree or disagree", "Somewhat agree", "Strongly agree"]

var all_pages = [["I don't notice the effects of my actions until it's too late. ","I put off making decisions", "It's hard for me to notice when I've had enough (alcohol, food, sweets)", "I have trouble following through with things once I've made up my mind to do something", "I don't seem to learn from my mistakes", "I usually only have to make a mistake one time in order to learn from it", "I can usually find several different possibilities when I want to change something", "Often I don’t notice what I’m doing until someone calls it to my attention.", "I usually think before I act.", "I learn from my mistakes.","I give up quickly","I usually keep track of progress towards my goals","I am able to accomplish goals I have set for myself","I have personal standards and try to live up to them","As soon as I see a problem or a challenge, I start looking for possible solutions","I have a hard time setting goals for myself","When I'm trying to change something, I pay a lot of attention to how I'm doing","I have trouble making plans to help me reach my goals","I set goals for myself and keep track of my progress","If I make a resolution to change something, I pay a lot of attention to how I'm doing","I know how I want to be","I have trouble making up my mind about things","I get easily distracted by my plans","When it comes to deciding about a change, I feel overwhelmed by the choices.","Most of the time I don't pay attention to what I'm doing","I tend to keep doing the same thing, even when it doesn't work","Once I have a goal I can usually plan how to reach it","if I wanted to change, I am confident that I could do it.","I can stick to a plan that's not working well.","I have a lot of willpower.","I am able to resist temptation."]]

var all_options = [fillArray(opts, 31)]

var score_scale = {"Strongly disagree": 1, "Somewhat disagree": 2, "Neither agree or disagree": 3, "Somewhat agree": 4, "Strongly agree": 5}

var survey_block = {
  type: "poldrack-survey-multi-choice",
  horizontal: true,
  preamble: "Answer the questions",
  pages: all_pages,
  options: all_options,
  scale: score_scale,
  show_clickable_nav: true,
  allow_backward: true,
  required: [fillArray(true,31)],
  reverse_score: [[true, true, true, true, true, false, false, true, false, false, true, false, false, false, false, true, false, true, false, false, false, true, true, true, true, true, false, false, false, false, false]],
};

var short_self_regulation_questionnaire_experiment = []
short_self_regulation_questionnaire_experiment.push(survey_block)

