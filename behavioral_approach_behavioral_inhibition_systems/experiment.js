function fillArray(value, len) {
  if (len === 0) return [];
  var a = [value];
  while (a.length * 2 <= len) a = a.concat(a);
  if (a.length < len) a = a.concat(a.slice(0, len - a.length));
  return a;
}

var opts = ["Very True for Me","Somewhat True for Me","Somewhat False for Me","Very False for Me"]

var all_pages = [["A person's family is the most important thing in life","Even if something bad is about to happen to me, I rarely experience fear or nervousness","I go out of my way to get the things I want","When I'm doing well at something I love to keep at it","I'm always willing to try something new if I think it will be fun","How I dress is important to me","When I get something I want, I feel excited and energized","Criticism or scolding hurts me quite a bit","When I want something, I usually go all-out to get it","I will often do things for no other reason than that they might be fun","It's hard for me to find the time to do things such as get a haircut","If I see a chance to get something that I want I move on it right away","I feel pretty worried or upset when I think or I know someone is angry at me","When I see an opportunity for something that I like, I get excited right away","I often act on the spur of the moment","If I think that something unpleasant is about to happen, I usually get pretty 'worked up'","I often wonder why people act the way that they do","When good things happen to me, it affects me strongly","I feel worried when I feel like I have done poorly on something important","I crave excitement and new sensations","When I go after something I use a 'no holds barred' approach","I have very few fears compared to my friends","It would excite me to win a contest","I worry about making mistakes"]]

var all_options = [fillArray(opts, 24)]

var score_scale = {"Very True for Me": 1, "Somewhat True for Me": 2, "Somewhat False for Me": 3, "Very False for Me": 4}

var survey_block = {
  type: "poldrack-survey-multi-choice",
  horizontal: true,
  preamble: "Answer the questions",
  pages: all_pages,
  options: all_options,
  scale: score_scale,
  show_clickable_nav: true,
  allow_backward: true,
  required: [fillArray(true,24)],
  reverse_score: [[false, true, false, false, false, false, false, false, false, false, false, false, false, false, false,false, false, false, false,false, false, false, false, false, true, false, false]],
};

var behavioral_approach_behavioral_inhibition_systems_experiment = []
behavioral_approach_behavioral_inhibition_systems_experiment.push(survey_block)
