/*
reference: http://users.nber.org/~rosenbla/econ311-04/syllabus/holtlaury.pdf
Holt, C. A., & Laury, S. K. (2002). Risk aversion and incentive effects. American economic review, 92(5), 1644-1655.
*/

/* ************************************ */
/* Define helper functions */
/* ************************************ */

/* ************************************ */
/* Define experimental variables */
/* ************************************ */

//define task variables
var lowriskhigh = '100';
var lowrisklow = '80';
var highriskhigh = '190';
var highrisklow = '5';
var highprobs = ['10', '20', '30', '40', '50', '60', '70', '80', '90' , '100'];
var lowprobs = ['90', '80', '70', '60', '50', '40', '30', '20', '10' , '0'];

//create array of html text that will be displayed
var buttonlist = []
//populate the array with the options
for (var i = 0; i < highprobs.length; i++){
  buttonlist += '<center>' + highprobs[i] +'% chance of $' + lowriskhigh + ', '+ lowprobs[i]+'% chance of $'+lowrisklow+'<input type="radio" name="response_'+i+'" value="A"><input type="radio" name="response_'+i+'" value="B">'+highprobs[i]+'% chance of $'+highriskhigh+', '+lowprobs[i]+'% chance of $'+highrisklow+'<br></center>'
}

/* ************************************ */
/* Set up jsPsych blocks */
/* ************************************ */

/* define static blocks */

var welcome_block = {
	
  type: 'text',
  text: '<div class = centerbox><p class = block-text>Welcome to the survey. Press <strong>enter</strong> to begin.</p></div>',
  cont_key: 13
};

var instructions_block = {
  type: 'instructions',
  pages: [
    '<div class = centerbox><p class = block-text>In this experiment you will be presented with a series of lottery choices. Your job is to indicate which option you would prefer for each of the ten paired lottery choices. </p><p class = block-text>You should indicate your <strong>true</strong> preference because at the end of the experiment a random trial will be chosen and you will receive a bonus payment proportional to the option you selected.</p><p class = block-text>Press <strong>enter</strong> to continue.</p></div>',
  ],
  key_forward: 13,
  allow_backwards: false
};

var test_block = {
    type: 'radio-buttonlist',
    //if you're going to add more pages make sure to add same number of elements to preamble array
    preamble: ['<p><center>Please indicate your preference between the two options for each of the ten paired lottery choices below.</center></p>'],
    // placed in array so plug in can parse correctly. 
    // each element of array should be the buttonlist for a page.
    buttonlist: [buttonlist],
    checkAll: [true],
    numq: [10]
};

var end_block = {
  type: 'text',
  text: '<div class = centerbox><p class = center-block-text>Thanks for completing this task!</p><p class = center-block-text>Press <strong>enter</strong> to continue.</p></div>',
  cont_key: 13
};


//Set up experiment
var holt_laury_experiment = []
holt_laury_experiment.push(welcome_block);
holt_laury_experiment.push(instructions_block);
holt_laury_experiment.push(test_block);
holt_laury_experiment.push(end_block)
