// Reference: http://www.sciencedirect.com/science/article/pii/S001002859990734X
//condition indicates block (which task, or rotateswitch block) and trial_id indicates stimulus position
/* ************************************ */
/* Define helper functions */
/* ************************************ */
var randomDraw = function(lst) {
    var index = Math.floor(Math.random()*(lst.length))
    return lst[index]
}

var getStim = function() {
    return randomDraw(randomDraw(letters)) + randomDraw(randomDraw(numbers))
}

var getTopStim = function() {
    stim_place = 'top' + randomDraw(['left','right'])
    return [stim_place, '<div class = numlet-' +  stim_place +'><p class = numlet-text>' + getStim() + '</p></div><div class = vertical-line></div><div class = horizontal-line></div>']
}

var getBottomStim = function() {
    stim_place = 'bottom' + randomDraw(['left','right'])
    return [stim_place,'<div class = numlet-' +  stim_place +'><p class = numlet-text>' + getStim() + '</p></div><div class = vertical-line></div><div class = horizontal-line></div>']
}

var getRotateStim = function() {
    switch(place) {
        case 0:
            stim_place = 'bottomright'
            break
        case 1:
            stim_place = 'bottomleft'
            break
        case 2:
            stim_place = 'topleft'
            break
        case 3:
            stim_place = 'topright'
            break
        }
    place = (place+1)%4
    return [stim_place, '<div class = numlet-' + stim_place +'><p class = numlet-text>' + getStim() + '</p></div><div class = vertical-line></div><div class = horizontal-line></div>']
}

/* ************************************ */
/* Define experimental variables */
/* ************************************ */
var correct_responses = jsPsych.randomization.repeat([["left arrow",37],["right arrow",39]],1)
var evens = [2,4,6,8]
var odds = [3,5,7,9]
var numbers = [evens,odds]
var consonants = ["G","K","M","R"]
var vowels = ["A","E","I","U"]
var letters = [consonants, vowels]
var place = randomDraw([0,1,2,3])

/* ************************************ */
/* Set up jsPsych blocks */
/* ************************************ */

/* define static blocks */
var welcome_block = {
  type: 'text',
  text: '<div class = centerbox><p class = block-text>Welcome to the number-letter experiment. Press any key to begin.</p></div>'
};

var end_block = {
  type: 'text',
  text: '<div class = centerbox><p class = center-block-text>Finished with this task.</p><p class = center-block-text>Press <strong>enter</strong> to continue.</p></div>',
  cont_key: 13
};

var instructions_block = {
  type: 'instructions',
  pages: [
	'<div class = centerbox><p class = block-text>In this experiment you will see letter-number pairs appear in one of four quadrants on the screen. For instance, you may see "G9" appear in the top right of the screen.</p><p class = block-text>Use the <strong>right arrow key</strong> to advance through the instructions. You can go back using the <strong>left arrow key</strong>.</p></div>',
	'<div class = centerbox><p class = block-text>When the letter-number pair is in the top half of the screen, you should indicate whether the number is odd or even using the arrow keys: left of odd, right for even.</p><p class = block-text>Use the <strong>right arrow key</strong> to advance through the instructions. You can go back using the <strong>left arrow key</strong>.</p></div>',
	'<div class = centerbox><p class = block-text>When the letter-number pair is in the bottom half of the screen, you should indicate whether the letter is a consonant or vowel using the arrow keys: left for consonant, right for vowel.</p><p class = block-text>Use the <strong>right arrow key</strong> to advance through the instructions. You can go back using the <strong>left arrow key</strong>.</p></div>'
	]
};

/* create experiment definition array */
var number_letter_experiment = []
number_letter_experiment.push(welcome_block)
number_letter_experiment.push(instructions_block)

half_block_len = 32
rotate_block_len = 128
for (i=0; i<half_block_len; i++) {
    stim = getTopStim()
    var top_block = {
        type: 'single-stim',
        stimuli: stim[1],
        is_html: true,
        choices: [37,39],
        data: {'exp_id': 'number-letter', 'trial_id': stim[0], 'condition': 'top_oddeven'},
        timing_post_trial: 150 
    }
    number_letter_experiment.push(top_block)
}
for (i=0; i<half_block_len; i++) {
    stim = getBottomStim()
    var bottom_block = {
        type: 'single-stim',
        stimuli: stim[1],
        is_html: true,
        choices: [37,39],
        data: {'exp_id': 'number-letter', 'trial_id': stim[0], 'condition': 'bottom_consonantvowel'},
        timing_post_trial: 150 
    }
    number_letter_experiment.push(bottom_block)
}
for (i=0; i<rotate_block_len; i++) {
    stim = getRotateStim()
    var rotate_block = {
        type: 'single-stim',
        stimuli: stim[1],
        is_html: true,
        choices: [37,39],
        data: {'exp_id': 'number-letter', 'trial_id': stim[0], 'condition': 'rotate_switch'},
        timing_post_trial: 150 
    }
    number_letter_experiment.push(rotate_block)
}
number_letter_experiment.push(end_block)



