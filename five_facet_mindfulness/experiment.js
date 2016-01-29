
/* ************************************ */
/* Define helper functions */
/* ************************************ */

function getDisplayElement () {
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
  text: '<div class = centerbox><p class = block-text>Welcome to this survey. Press <strong>enter</strong> to begin.</p></div>',
  cont_key: [13],
  data: {exp_id: "five_facet_mindfulness"}
};

var instructions_block = {
  type: 'poldrack-instructions',
  pages: [
    '<div class = centerbox><p class = block-text>Please answer the following questions on your tendency to bring your complete attention to experiences occuring in the present moment.</p></div>',
  ],
  allow_keys: false,
  show_clickable_nav: true,
  timing_post_trial: 1000,
  data: {exp_id : "five_facet_mindfulness"}
};

var fmi_opts = ["Rarely", "Occasionally", "Fairly Often", "Almost always"]
var mq_opts = ["agree totally", "agree mostly", "agree somewhat","neutral", "disagree somewhat","disagree mostly","disagree totally"]
var kims_opts = ["never or very rarely true", "seldom true", "sometimes true", "often true","always or almost always true"]
var maas_opts = ["almost always", "very frequently", "somewhat frequently", "somewhat infrequently", "very infrequently", "almost never"]
var cams_opts = ["rarely/not at all", "sometimes","often", "almost always"]

var all_pages = [["I perceive my feelings and emotions without having to react to them.","I watch my feelings without getting lost in them.","In difficult situations, I can pause without immediately reacting.","Usually when I have distressing thoughts or images, I am able just to notice them without reacting.","Usually when I have distressing thoughts or images, I feel calm soon after.","Usually when I have distressing thoughts or images, I “step back” and am aware of the thought or image without getting taken over by it. ","Usually when I have distressing thoughts or images, I just notice them and let them go."],["When I’m walking, I deliberately notice the sensations of my body moving.","When I take a shower or a bath, I stay alert to the sensations of water on my body.","I notice how foods and drinks affect my thoughts, bodily sensations, and emotions.","I pay attention to sensations, such as the wind in my hair or sun on my face.","I pay attention to sounds, such as clocks ticking, birds chirping, or cars passing.","I notice the smells and aromas of things.","I notice visual elements in art or nature, such as colors, shapes, textures, or patterns of light and shadow.","I pay attention to how my emotions affect my thoughts and behavior."],["I find it difficult to stay focused on what’s happening in the present.","It seems I am “running on automatic” without much awareness of what I’m doing.","I rush through activities without being really attentive to them.","I do jobs or tasks automatically, without being aware of what I’m doing.","I find myself doing things without paying attention.","When I do things, my mind wanders off and I’m easily distracted.","I don’t pay attention to what I’m doing because I’m daydreaming, worrying, or otherwise distracted.","I am easily distracted."],["I’m good at finding the words to describe my feelings.","I can easily put my beliefs, opinions, and expectations into words.","It’s hard for me to find the words to describe what I’m thinking.","I have trouble thinking of the right words to express how I feel about things.","When I have a sensation in my body, it’s hard for me to describe it because I can’t find the right words. *KIMS 26: Even when I’m feeling terribly upset, I can find a way to put it into words.","My natural tendency is to put my experiences into words.","I can usually describe how I feel at the moment in considerable detail."],["I criticize myself for having irrational or inappropriate emotions.","I tell myself that I shouldn’t be feeling the way I’m feeling.","I believe some of my thoughts are abnormal or bad and I shouldn’t think that way.","I make judgments about whether my thoughts are good or bad.","I tell myself I shouldn’t be thinking the way I’m thinking.","I think some of my emotions are bad or inappropriate and I shouldn’t feel them.","I disapprove of myself when I have irrational ideas.","Usually when I have distressing thoughts or images, I judge myself as good or bad, depending what the thought/image is about."]]

var all_options = [[fmi_opts, fmi_opts, fmi_opts, mq_opts, mq_opts, mq_opts, mq_opts],fillArray(kims_opts,8),[maas_opts, maas_opts, maas_opts, maas_opts, maas_opts, kims_opts, kims_opts, cams_opts],[kims_opts, kims_opts, kims_opts, kims_opts, kims_opts, kims_opts, cams_opts],[kims_opts, kims_opts, kims_opts, kims_opts, kims_opts, kims_opts, kims_opts, mq_opts]]

//not sure about scoring this. revisit
var score_scale = {"almost always":1, "very frequently": 2, "somewhat frequently": 3, "somewhat infrequently": 4, "very infrequently": 5, "almost never": 6, "Rarely": 1, "Occasionally":2, "Fairly Often":3, "Almost always":4, "never or very rarely true":1, "seldom true":2, "sometimes true":3, "often true":4,"always or almost always true":5, "rarely/not at all":1, "sometimes":2,"often":3, "almost always":4, "agree totally":7, "agree mostly":6, "agree somewhat":5,"neutral":4, "disagree somewhat":3,"disagree mostly":2,"disagree totally":1}

var survey_block = {
  type: "poldrack-survey-multi-choice",
  exp_id: "five_facet_mindfulness",
  horizontal: true,
  preamble: '',
  pages: all_pages,
  options: all_options,
  scale: score_scale,
  show_clickable_nav: true,
  allow_backward: true,
  required: [fillArray(true, 7),fillArray(true, 8), fillArray(true, 8), fillArray(true, 7),fillArray(true, 8)],
  reverse_score: [[false, false, false, false, false, false, false],[false, false, false, false, false, false, false, false],[false, false, false, false, false, false, false,false], [false, false, false, false, false, false, false], [false, false, false, false, false, false, false, false]],
};

var end_block = {
  type: 'text',
  text: '<div class = centerbox><p class = center-block-text>Congratulations for completing this task!</p><p class = center-block-text>Press <strong>enter</strong> to continue.</p></div>',
  cont_key: [13],
  data: {exp_id: "five_facet_mindfulness"}
};


//Set up experiment
var five_facet_mindfulness_experiment = []
five_facet_mindfulness_experiment.push(welcome_block);
five_facet_mindfulness_experiment.push(instructions_block);
five_facet_mindfulness_experiment.push(survey_block);
five_facet_mindfulness_experiment.push(end_block);
