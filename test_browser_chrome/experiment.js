/* ************************************ */
/*       Define Helper Functions        */
/* ************************************ */
function getDisplayElement() {
    $('<div class = display_stage_background></div>').appendTo('body')
    return $('<div class = display_stage></div>').appendTo('body')
}

function addID() {
  jsPsych.data.addDataToLastTrial({exp_id: 'test_browser_chrome'})
}


var getFeedback = function() {
	if (isChrome == true){
		feedback_text += 
			'</p><p class = block-text>You are using a Chrome browser. Please finish this task and continue on with the rest of the battery!'
		feedback_text += 
			'</p><p class = block-text> Press Enter to continue.'
	
	} else {
		feedback_text += 
			'</p><p class = block-text>You are <strong>not</strong> using a Chrome browser. Please copy the current URL, launch Chrome, and paste the URL.'
			
		feedback_text += 
			'</p><p class = block-text>If you do not have Chrome, please download Chrome or refer back to the email we sent you that includes download instructions.'
			
		feedback_text += 
			'</p><p class = block-text><strong>Important! Please close this browser when you are done copying the URL.</strong>'
	
	
	}
	return '<div class = bigbox><div class = picture_box><p class = block-text><font color="white">' + feedback_text + '</font></p></div></div>'
}


/* ************************************ */
/*    Define Experimental Variables     */
/* ************************************ */
// generic task variables
var credit_var = 0
var run_attention_checks = false


var current_trial = 0



var postFileType = "'></img>"
var pathSource = "/static/experiments/test_browser_chrome/images/"
var fileType = ".png"
var preFileType = "<img class = center src='"

var fileTypePNG = ".png'></img>"
var preFileType = "<img class = center src='/static/experiments/test_browser_chrome/images/"


var isOpera = (!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;

// Firefox 1.0+
var isFirefox = typeof InstallTrigger !== 'undefined';

// Safari 3.0+ "[object HTMLElementConstructor]" 
var isSafari = /constructor/i.test(window.HTMLElement) || (function (p) { return p.toString() === "[object SafariRemoteNotification]"; })(!window['safari'] || (typeof safari !== 'undefined' && safari.pushNotification));

// Internet Explorer 6-11
var isIE = /*@cc_on!@*/false || !!document.documentMode;

// Edge 20+
var isEdge = !isIE && !!window.StyleMedia;

// Chrome 1 - 71
var isChrome = !!window.chrome && (!!window.chrome.webstore || !!window.chrome.runtime);

// Blink engine detection
var isBlink = (isChrome || isOpera) && !!window.CSS;


/* ************************************ */
/*        Set up jsPsych blocks         */
/* ************************************ */

var end_block = {
	type: 'poldrack-text',
	data: {
		exp_id: "test_browser_chrome",
		trial_id: "end"
	},
	timing_response: 180000,
	text: '<div class = centerbox>'+
	'<p class = center-block-text>Thanks for completing this browser check!</p>'+
	'<p class = center-block-text>Press<i> enter</i> to continue.</p>'+
	'</div>',
	cont_key: [13],
	timing_post_trial: 0
};


var feedback_text = 
	'Welcome to the battery! This task checks if you are using a Chrome browser.'
var feedback_block = {
	type: 'poldrack-single-stim',
	data: {
		trial_id: "practice-no-stop-feedback"
	},
	choices: [13],
	stimulus: getFeedback,
	timing_post_trial: 0,
	is_html: true,
	timing_response: 180000,
	response_ends_trial: true, 

};


/********************************************/
/*				Set up nodes				*/
/********************************************/



/* ************************************ */
/*          Set up Experiment           */
/* ************************************ */

var test_browser_chrome_experiment = []

test_browser_chrome_experiment.push(feedback_block)

test_browser_chrome_experiment.push(end_block);





