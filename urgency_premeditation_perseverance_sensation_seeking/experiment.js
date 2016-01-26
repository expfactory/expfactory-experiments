function fillArray(value, len) {
  if (len == 0) return [];
  var a = [value];
  while (a.length * 2 <= len) a = a.concat(a);
  if (a.length < len) a = a.concat(a.slice(0, len - a.length));
  return a;
}

var opts = ["Agree Strongly","Agree Some","Disagree Some","Disagree Strongly"]

var all_pages = [["I have a reserved and cautious attitude towards life","I have trouble controlling my impulses","I generally seek new and exciting experiences and sensations","My thinking is usually careful and purposeful","I have trouble resisting my cravings (for food, cigarettes, etc.).","I'll try anything once","I tend to give up easily","I am not one of those people who blurt out things without thinking"," I often get involved in things I later wish I could get out of","I like sports and games in which you have to choose your next move very quickly","Unfinished tasks really bother me","I like to stop and think things over before I do them","When I feel bad, I will often do things I later regret in order to make myself feel better now","I would enjoy water skiing","Once I get going on something I hate to stop","I don't like to start a project until I know exactly how to proceed"],["Sometimes when I feel bad, I can't seem to stop what I am doing even though it is making me feel worse","I quite enjoy taking risks","I concentrate easily","I would enjoy parachute jumping","I finish what I start","I tend to value and follow a rational 'sensible' approach to things","When I am upset I often act without thinking","I welcome new and exciting experiences and sensations, even if they are a little frightening and unconventional","I am able to pace myself so as to get things done on time","I usually make up my mind through careful reasoning","When I feel rejected, I will often say things that I later regret","I would like to learn to fly an airplane","I am a person who always gets the job done","I am a cautious person","It is hard for me to resist acting on my feelings","I sometimes like doing things that are a bit frightening","I almost always finish projects that I start","Before I get into a new situation I like to find out what to expect from it","I often make matters worse because I act without thinking when I am upset"],["I would enjoy the sensation of skiing very fast down a high mountain slope","Sometimes there are so many little things to be done that I just ignore them all","I usually think carefully before doing anything","In the heat of an argument, I will often say things that I later regret","I would like to go scuba diving","I always keep my feelings under control","Before making up my mind, I consider all the advantages and disadvantages","Sometimes I do impulsive things that I later regret"]]
var all_options = [fillArray(opts, 45)]

var score_scale = {"Agree Strongly": 1, "Agree Some": 2, "Disagree Some": 3, "Disagree Strongly": 4}

var survey_block = {
  type: "poldrack-survey-multi-choice",
  horizontal: true,
  preamble: "Answer the questions",
  pages: all_pages,
  options: all_options,
  scale: score_scale,
  show_clickable_nav: true,
  allow_backward: true,
  required: [fillArray(true,45)],
  reverse_score: [[false, true, true, false, false, true, true, true, false, true, true, true, false, false, true, true, false],[false, true, true, false, true, false ,false ,true, true, false, false, true, true, false, false, true, true, false, false, true, true, true, false, true, true, false, false, true, true]],
};

var urgency_premeditation_perseverance_sensation_seeking_experiment = []
urgency_premeditation_perseverance_sensation_seeking_experiment.push(survey_block)
