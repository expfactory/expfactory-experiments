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
  text: '<div class = centerbox><p class = block-text>Welcome to this survey. Press <strong>enter</strong> to begin.</p></div>',
  cont_key: [13],
  data: {
    exp_id: "demographics"
  }
};

var instructions_block = {
  type: 'poldrack-instructions',
  pages: [
    '<div class = centerbox><p class = block-text>Please answer the following questions regarding your demographics.</p></div>',
  ],
  allow_keys: false,
  show_clickable_nav: true,
  timing_post_trial: 1000,
  data: {
    exp_id: "demographics"
  }
};


var all_pages = [
  ["What is your sex?", "What is your marital status?", "If you've been divorced, how many times?", "What is your ethnic background?", "If you chose 'Other' for your ethic background how would you describe it?", "How many children do you have?","How tall are you (in inches - one foot = 12 inches)?","How much you do weigh?","How many traffic tickets have you gotten in the last year?"],
  ["Altogether, have you smoked at least 100 or more cigarettes in your entire lifetime?", "How long have you smoked (cumulatively)?", "Do you now smoke cigarettes every day, some days or not at all?", "On average, how many cigarettes do you now smoke a day (1 pack = 20 cigarettes)?", "How soon after you wake up do you smoke your first cigarette?", "In the past 30 days, what tobacco products OTHER THAN cigarettes have you used (check all that apply)?"],
  ["How often do you have a drink containing alcohol?", "How many drinks containing alcohol do you have on a typical day when you are drinking?", "How often do you have six or more drinks on one occasion?", "How often during the last year have you found that you were not able to stop drinking once you had started?", "How often during the last year have you failed to do what was normally expected from you because of drinking?", "How often during the last year have you needed a first drink in the morning to get yourself going after a heavy drinking session?", "How often during the last year have you had a feeling of guilt or remorse after drinking?", "How often during the last year have you been unable to remember what happened the night before because you had been drinking?", "Have you or someone else been injured as a result of your drinking?", "Has a relative or friend or a doctor or another health worker been concerned about your drinking or suggested you cut down?"],
  ["What is your daily caffeine intake (in mg)? (1 cup of regular coffee ~ 120 mg, 1 cup black tea ~ 50 mg, 1 cup green tea ~ 40 mg)", "Do you have any chronic medical problems which continue to interfere with your life?", "Are you taking any prescribed medication on a regular basis for a physical problem?", "In addition to visits related to a chronic problem how often do you visit your doctor/have annual check ups in a year?", "How many times in your life have you been arrested and/or charged with illigal activities?", "Do you have a retirement account?", "If you do have a retirement account what percent is in stocks?", "Do you have any debt (credit card or other)?", "If you have any debt how much (in dollars)?", "Do you own or the house you live in?", "What are you motivations for participating in this experiment?", "Please list other motivations."]
]

var opts_1 = ["Male", "Female", "Choose not to respond"]
var scale_1 = {"Male": 0, "Female": 1, "Choose not to respond": 2}

var opts_2 = ["Single", "Married", "Separated", "Divorced", "Widowed"]
var scale_2 = {"Single":0, "Married":1, "Separated":2, "Divorced":3, "Widowed":4}

var opts_3 = ["1", "2", "3", "4", "5", "More"]
var scale_3 = {"1":1, "2":2, "3":3, "4":4, "5":5, "More":6}

var opts_4 = ["American Indian or Alaska Native", "Asian", "Black or African American", "Hispanic or Latino", "Native Hawaiian or Other Pacific Islander", "White", "Choose not to respond", "Other"]
var scale_4 = {"American Indian or Alaska Native":1, "Asian":2, "Black or African American":3, "Hispanic or Latino":4, "Native Hawaiian or Other Pacific Islander":5, "White":6, "Choose not to respond":7, "Other":8}

var opts_5 = ["Yes", "No"]
var scale_5 = {"Yes":1, "No":2}

var opts_6 = ["Less than a year", "1 year", "2 years", "3 years", "4 years", "5-10 years", "More than 10 years"]
var scale_6 = {"Less than a year":1, "1 year":2, "2 years":3, "3 years":4, "4 years":5, "5-10 years":6, "More than 10 years":7}

var opts_7 = ["Every day", "Some days", "Not at all"]
var scale_7 = {"Every day":3, "Some days":2, "Not at all":1}

var opts_8 = ["Less than a cigarette a day", "<5", "5-10", "10-20", "1 pack", "2 packs", "More than 2 packs"]
var scale_8 = {"Less than a cigarette a day": 1, "<5":2, "5-10":3, "10-20":4, "1 pack":5, "2 packs":6, "More than 2 packs":7}

var opts_9 = ["Within 5 minutes" , "6-30 minutes", "31-60 minutes", "After 60 minutes", "Don't know"]
var scale_9 = {"Within 5 minutes":1 , "6-30 minutes":2, "31-60 minutes":3, "After 60 minutes":4, "Don't know":5}

var opts_10 = ["0", "1", "2", "3", "4", "5-10", ">10"]
var scale_10 = {"0":1, "1":2, "2":3, "3":4, "4":5, "5-10":6, ">10":7}

var opts_11 = ["Never", "Montly or less", "2 to 4 times a month", "2 to 3 times a week", "4 or more times a week"]
var scale_11 = {"Never":1, "Montly or less":2, "2 to 4 times a month":3, "2 to 3 times a week":4, "4 or more times a week":5}

var opts_12 = ["1 or 2", "3 or 4", "5 or 6", "7, 8, or 9", "10 or more"]
var scale_12 = {"1 or 2":1, "3 or 4":2, "5 or 6":3, "7, 8, or 9":4, "10 or more":5}

var opts_13 = ["Never", "Less than monthly", "Monthly", "Weekly", "Daily or almost daily"]
var scale_13 = {"Never":1, "Less than monthly":2, "Monthly":3, "Weekly":4, "Daily or almost daily":5}

var opts_14 = ["No", "Yes, but not in the last year", "Yes, during the last year"]
var scale_14 = {"No":1, "Yes, but not in the last year":2, "Yes, during the last year":3}

var opts_15 = ["0 mg", "<50 mg", "50-100 mg", "100-150 mg", "150-200 mg", "200-250 mg", ">250 mg"]
var scale_15 = {"0 mg":1, "<50 mg":2, "50-100 mg":3, "100-150 mg":4, "150-200 mg":5, "200-250 mg":6, ">250 mg":7}

var opts_16 = ["<10%", "10-20%", "20-30%", "30-40%", "40-50%", "60-70%", "70-80%", "80-90%", ">90%"]
var scale_16 = {"<10%":1, "10-20%":2, "20-30%":2, "30-40%":3, "40-50%":4, "60-70%":5, "70-80%":6, "80-90%":7, ">90%":8}

var opts_17 = ["<$500", "$500-$2500", "$2500-$10000", "$10000-$25000", "$25000-$50000", "$50000-$100000", "$100000-$200000", ">$200000"]
var scale_17 = {"<$500":1, "$500-$2500":2, "$2500-$10000":3, "$10000-$25000":4, "$25000-$50000":5, "$50000-$100000":6, "$100000-$200000":7, ">$200000":8}

var opts_18 = ["Chewing tobacco (dip)", "Cigars", "Pipe", "Tobacco for your nose (snuff)", "E-cigarettes", "E-hookah or vape pens", "Cigarillos or little cigars", "Don't Know"]
var scale_18 = {"Chewing tobacco (dip)":1, "Cigars":2, "Pipe":3, "Tobacco for your nose (snuff)":4, "E-cigarettes":5, "E-hookah or vape pens":6, "Cigarillos or little cigars":7, "Don't Know":8}

var opts_19 = ["money", "tasks are fun", "want to contribute to research", "other"]
var scale_19 = {"money":1, "tasks are fun":2, "want to contribute to research":3, "other":4}

var all_options = [[opts_1, opts_2, opts_3, opts_4, opts_4, opts_10, opts_10,opts_10,opts_10],
[opts_5, opts_6, opts_7, opts_8, opts_9, opts_18],
[opts_11, opts_12, opts_13, opts_13, opts_13, opts_13, opts_13, opts_13, opts_14, opts_14],
[opts_15, opts_5, opts_5, opts_10, opts_10, opts_5, opts_16, opts_5, opts_17, opts_5, opts_19, opts_19]
]

var score_scale = [[scale_1, scale_2, scale_3, scale_4, scale_4, scale_10, scale_10,scale_10,scale_10],
[scale_5, scale_6, scale_7, scale_8, scale_9, scale_18],
[scale_11, scale_12, scale_13, scale_13, scale_13, scale_13, scale_13, scale_13, scale_14, scale_14],
[scale_15, scale_5, scale_5, scale_10, scale_10, scale_5, scale_16, scale_5, scale_17, scale_5, scale_19, scale_19]
]

var survey_block = {
  type: "poldrack-survey-multi-choice",
  exp_id: "demographics",
  horizontal: true,
  preamble: '',
  pages: all_pages,
  options: all_options,
  scale: score_scale,
  show_clickable_nav: true,
  allow_backward: true,
  required: [fillArray(false, 9),fillArray(false, 6), fillArray(false, 10), fillArray(false, 12)],
  input_type: [["radio", "radio", "number", "checkbox","text", "number", "number","number", "number"],
  ["radio", "radio", "radio", "number", "radio", "checkbox"],
  ["radio","radio","radio","radio","radio","radio","radio","radio","radio","radio"],
  ["number", "radio", "radio", "number", "number", "radio", "number", "radio", "number", "radio", "checkbox", "text"]]
};

var end_block = {
  type: 'text',
  text: '<div class = centerbox><p class = center-block-text>Congratulations for completing this task!</p><p class = center-block-text>Press <strong>enter</strong> to continue.</p></div>',
  cont_key: [13],
  data: {
    exp_id: "demographics"
  }
};


//Set up experiment
var demographics_experiment = []
demographics_experiment.push(welcome_block);
demographics_experiment.push(instructions_block);
demographics_experiment.push(survey_block);
demographics_experiment.push(end_block);