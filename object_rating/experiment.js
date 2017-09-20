/* ************************************ */
/*       Define Helper Functions        */
/* ************************************ */


function getDisplayElement() {
    $('<div class = display_stage_background></div>').appendTo('body')
    return $('<div class = display_stage></div>').appendTo('body')
}

function addID() {
  jsPsych.data.addDataToLastTrial({exp_id: 'object_rating'})
}

var getQuestion = function(){
	
	return '<div class = bigbox><div class = centerbox>'+
	'<p class = center-block-text><font color = "white">' + post_question + '</font></p>'+
	'<div class = textbox><textarea id="question_text_area" cols="110" rows="20" value=""></textarea>'+
	'<div class = submitbox><input type="submit" value="Submit" data-inline="true" onClick="pressSubmit(document.getElementById(\'question_text_area\'))"/></div>' +
	'</div></div>'
}

function getRestText(){
	if(currBlock == numBlocks - 1){
		gameState = "post_questionnaire"
		return '<div class = bigbox><div class = centerbox>'+
		  	  	 '<p class = center-textJamie style="font-size:36px"><font color="white">This phase is over.</font></p>'+
		      	 '<p class = center-textJamie style="font-size:36px"><font color="white">Press enter to start the post-questionnaire.</font></p>'+
		 	   '</div></div>'
	
	}else if(currBlock < numBlocks - 1){	
		var subjectBlock = currBlock + 1
		return '<div class = bigbox><div class = centerbox>'+
		  	  	 '<p class = center-textJamie style="font-size:36px"><font color="white">Take a break!</font></p>'+
		      	 '<p class = center-textJamie style="font-size:36px"><font color="white">Press enter to start.</font></p>'+
		      	 '<p class = center-textJamie style="font-size:36px"><font color="white">Completed: ' + subjectBlock + ' out of ' + numBlocks + ' blocks.</font></p>'+

		 	   '</div></div>'
	}

}


function getRatingBoard(){	
	
	if(gameState == "practice_rating"){
		
		return ratingBoard1 + practiceBoard + ratingBoard2 + '_practice/' + practice_stim + "'" + ratingBoard3
	} else if (gameState == "rating"){
		current_stim = stims.pop()
	
		return ratingBoard1 + ratingBoard2 + '_neutral/' + current_stim + "'" + ratingBoard3
	}
	
}


var hitKey = function(whichKey){
	e = jQuery.Event("keydown");
  	e.which = whichKey; // # Some key code value
  	e.keyCode = whichKey
  	$(document).trigger(e);
 	e = jQuery.Event("keyup");
  	e.which = whichKey; // # Some key code value
  	e.keyCode = whichKey
  	$(document).trigger(e)
}

var pressSubmit = function(current_submit){
	if(current_submit.id == "question_text_area"){
		post_question_current_answer = current_submit.value
		
		hitKey(81)
	
	}
}

document.addEventListener("keydown", function(e){
    var keynum;
    if(window.event){
    	keynum = e.keyCode;
    } else if(e.which){
    	keynum = e.which;
    }
    
    
    if ((keynum == 49) || (keynum == 50) || (keynum == 51) || (keynum == 52) || (keynum == 53)){
		if ((gameState == "rating") || (gameState == "practice_rating")){
			keyTracker.push(keynum)
			if((keynum == 49) && (keyTracker.length == 1)){
				$('#button1').addClass('selected');
				pressedKey = keynum
				hitKey(87)
			}else if((keynum == 50) && (keyTracker.length == 1)){
				$('#button2').addClass('selected');
				pressedKey = keynum
				hitKey(87)
			}else if((keynum == 51) && (keyTracker.length == 1)){
				$('#button3').addClass('selected');
				pressedKey = keynum
				hitKey(87)
			}else if((keynum == 52) && (keyTracker.length == 1)){
				$('#button4').addClass('selected');
				pressedKey = keynum
				hitKey(87)
			}else if((keynum == 53) && (keyTracker.length == 1)){
				$('#button5').addClass('selected');
				pressedKey = keynum
				hitKey(87)
			}
			
		}
    }
    
});


var appendData = function(){
	curr_trial = jsPsych.progress().current_trial_global
	trial_id = jsPsych.data.getDataByTrialIndex(curr_trial).trial_id
	
	if (trial_id == "test_rating"){
	
		jsPsych.data.addDataToLastTrial({
			current_stim: current_stim,
			subj_stim_rating: pressedKey
		})
	
		pressedKey = ""
	} else if (trial_id == "post_questionnaire_block"){
		jsPsych.data.addDataToLastTrial({
			current_answer: post_question_current_answer,
			current_question: post_question,
		})
	}
	
}

/* ************************************ */
/*    Define Experimental Variables     */
/* ************************************ */


var totalPics = 970
var numBlocks = 10
var numTrialsPerBlock = totalPics/numBlocks
var preTR = 16
var currBlock = 0
var current_stim = ""


var preFileType = "<img class = center src='/static/experiments/object_rating/images/BOSS"
var pathSource = "/static/experiments/object_rating/images/BOSS_neutral/"


var keyTracker = []
var pressedKey = ""
var gameState = "start"
var post_question = '1) Do you have any feedback about the experiment?'
var post_question_current_answer = ""

////////////////


var ratingBoard1 = '<div class = bigbox>'
		
var practiceBoard = '<div class = practice_rating_text>'+
			'<p class = center-textJamie style="font-size:22px"><font color = "white">Please rate how much you currently want to consume/use the item.</font></p>'+
			'</div>'
		
var ratingBoard2 =	'<div class = center_picture_box>'+preFileType
		
var ratingBoard3 = 
	    '></div>'+
		
		'<div class = buttonbox>'+
			'<div class = inner><button type="submit" id = "button1" class="likert_btn" onClick="return false;" >1</button></div>'+
			'<div class = inner><button type="submit" id = "button2" class="likert_btn" onClick="return false;" >2</button></div>'+
			'<div class = inner><button type="submit" id = "button3" class="likert_btn" onClick="return false;" >3</button></div>'+
			'<div class = inner><button type="submit" id = "button4" class="likert_btn" onClick="return false;" >4</button></div>'+
			'<div class = inner><button type="submit" id = "button5" class="likert_btn" onClick="return false;" >5</button></div>'+
		'</div>'+	
	'</div>'
	
var practice_stim = 'atm.png'

var neutral_pics = [
 'airhockeypaddle01b.png',
 'armchair02.png',
 'arrow01.png',
 'bag.png',
 'balalaika.png',
 'ballofstring.png',
 'basketball02.png',
 'bikehelmet.png',
 'boxcutter03b.png',
 'boxingglove02a.png',
 'bracelet05.png',
 'breadknife.png',
 'broom02.png',
 'bulletbelt.png',
 'bungeecord01.png',
 'camera01a.png',
 'candle01.png',
 'candle05c.png',
 'catchermask.png',
 'chalkboarderaser01.png',
 'cheeseknife02.png',
 'chisel02a.png',
 'clarinet.png',
 'clock03a.png',
 'coffeepot03b.png',
 'coin02.png',
 'comb02c.png',
 'comb04.png',
 'comb06.png',
 'computerkeyboard01b.png',
 'computermouse01.png',
 'cross03.png',
 'deckofplayingcards01.png',
 'dice03a.png',
 'dice05b.png',
 'drill02b.png',
 'drillbit02a.png',
 'dropper02c.png',
 'dvdcase02a.png',
 'dvdplayer.png',
 'earring01.png',
 'earring02a.png',
 'electricdrumset.png',
 'electricmixer.png',
 'electricrazor.png',
 'electrictoothbrush01a.png',
 'exercisebike.png',
 'fence01.png',
 'file.png',
 'fishinghook02a.png',
 'fishinghook04a.png',
 'flugglehorn.png',
 'flyswatter.png',
 'fork04b.png',
 'gardenshears01b.png',
 'garlicpress03a.png',
 'gavel.png',
 'gymnasticring.png',
 'hammer02a.png',
 'handbag04.png',
 'handbag05.png',
 'handmixer01a.png',
 'highheelshoe02a.png',
 'hikingshoe02.png',
 'interlockingbuildingblock04a.png',
 'ipad01.png',
 'jeans01.png',
 'jewelrybox01b.png',
 'lamp02b.png',
 'lightbulb03a.png',
 'lock03a.png',
 'lock05.png',
 'makeupbrush03a.png',
 'mascarabrush.png',
 'measuringtape02b.png',
 'microphone02.png',
 'mug03.png',
 'nailclipper02a.png',
 'needlenosepliers02.png',
 'notebook02a.png',
 'officechair02.png',
 'paintbrush03b.png',
 'paintbrush05.png',
 'paintscraper.png',
 'paperclip02.png',
 'paperclip03.png',
 'parkbench01.png',
 'peeler03a.png',
 'pencil02a.png',
 'pencilcase02b.png',
 'pillow01b.png',
 'pitcher04a.png',
 'pitcher05b.png',
 'plant03b.png',
 'plant06.png',
 'pliers02b.png',
 'potatomasher02a.png',
 'propanetank03.png',
 'qtip.png',
 'racquetballracket.png',
 'radio02.png',
 'remotecontrol03b.png',
 'ribbon03b.png',
 'ring02.png',
 'road02.png',
 'sandshovel02a.png',
 'scale01a.png',
 'scarf.png',
 'scissors05b.png',
 'screw01.png',
 'scrubbingbrush01b.png',
 'scrubbingbrush05a.png',
 'servingspoon01.png',
 'servingspoon02b.png',
 'shinpad.png',
 'skigoggles02a.png',
 'skihelmet02.png',
 'slipper01c.png',
 'sneaker03b.png',
 'snowshoe.png',
 'soccercleat02.png',
 'solderingiron.png',
 'sportbag.png',
 'sportshorts01.png',
 'sprinkler.png',
 'strawbasket05.png',
 'studiolight.png',
 'swing.png',
 'tambourine01.png',
 'thermometer02a.png',
 'tongs01a.png',
 'toothpick01.png',
 'towel02a.png',
 'toycar04.png',
 'tree.png',
 'trident02.png',
 'tuba.png',
 'tweezers02a.png',
 'videocamera01a.png',
 'whiteout.png',
 'wiicontroller.png',
 'windturbine.png',
 'arrow02.png',
 'backpack01a.png',
 'bandaid01.png',
 'barbecue02.png',
 'baseball01b.png',
 'basketball01.png',
 'battery02b(1).png',
 'battery05.png',
 'bridgestick.png',
 'broadsword.png',
 'bubbleblower.png',
 'buddhastatue.png',
 'bulldozer.png',
 'bullet.png',
 'bus.png',
 'cameracase01a.png',
 'candle04.png',
 'candle06a.png',
 'car.png',
 'carbattery.png',
 'cello.png',
 'chalkboard02.png',
 'chessboard.png',
 'chisel02b.png',
 'christmastree.png',
 'cleaver02.png',
 'clipboard.png',
 'clothespin03b.png',
 'coaster.png',
 'coin01a.png',
 'condom.png',
 'cookingpot.png',
 'cornet.png',
 'craneflower.png',
 'cross01.png',
 'daisy.png',
 'dentalfloss03b.png',
 'diaper01b.png',
 'djmixer02.png',
 'doublebass.png',
 'drillbit01.png',
 'drillbit03a.png',
 'dryingmachine01.png',
 'dustpan.png',
 'electrictoothbrush01c.png',
 'ellipticalmachine.png',
 'espressomachine.png',
 'exercisebench.png',
 'eye.png',
 'eyedrops.png',
 'fan.png',
 'faucet.png',
 'feather02.png',
 'fern.png',
 'fighterjet.png',
 'filmroll.png',
 'fishinghook03.png',
 'fishinghook04b.png',
 'fishingrod.png',
 'flower01.png',
 'fonduefork02.png',
 'forklift.png',
 'gardenshears01a.png',
 'gardenswing.png',
 'gardenutilityvehicle.png',
 'garlicpress02a.png',
 'gasburner.png',
 'generator.png',
 'glassescase.png',
 'grandpiano.png',
 'headphones01.png',
 'helicopter.png',
 'icecubetray01a.png',
 'ipad02.png',
 'ipod.png',
 'iron01a.png',
 'Jesusstatue.png',
 'jewelrybox01a.png',
 'key07.png',
 'lamp03a.png',
 'laptop01a.png',
 'lightbulb02a.png',
 'lock04a.png',
 'makeupbrush03b.png',
 'mallet01b.png',
 'measuringtape02a.png',
 'metalbrush.png',
 'mug02a.png',
 'nailclipper03b.png',
 'officechair03.png',
 'oven.png',
 'paintbrush02b.png',
 'paintcan02.png',
 'papertowel.png',
 'parkbench02.png',
 'pastaspoon.png',
 'patiochair.png',
 'pavedsidewalk.png',
 'pencil02b.png',
 'pingpongpaddle01b.png',
 'pitchfork.png',
 'potatomasher03b.png',
 'protractor.png',
 'radio01.png',
 'razor03c.png',
 'rubberglove01a.png',
 'schoolbus.png',
 'scrubbingbrush05b.png',
 'sewingmachine02a.png',
 'skigoggles01.png',
 'snowshovel.png',
 'spatula03.png',
 'spatula04.png',
 'spear02.png',
 'stairs.png',
 'stepladder.png',
 'swissarmyknife01a.png',
 'taperecorder.png',
 'tongs02a.png',
 'towelrack.png',
 'umbrella03a.png',
 'uprightpiano02.png',
 'urinal.png',
 'wallet01.png',
 'whisk.png',
 'windsurfboard.png',
 'workglove02c.png',
 'battleaxe.png',
 'boat.png',
 'boxcutter01.png',
 'boxingglove01.png',
 'branch01.png',
 'brick.png',
 'chair.png',
 'church.png',
 'cinderblock.png',
 'coatrack.png',
 'coin01b.png',
 'computerkeyboard02.png',
 'convertible.png',
 'cruiseship.png',
 'daffodil.png',
 'dandelion.png',
 'fireextinguisher01.png',
 'firstaidkit.png',
 'fonduefork01.png',
 'foodprocessor.png',
 'footrest02.png',
 'gastank.png',
 'gps.png',
 'headphones02a.png',
 'hockeypuck.png',
 'hulahoop.png',
 'kite.png',
 'magneticcompass.png',
 'measuringspoon.png',
 'measuringtape04.png',
 'nintendods.png',
 'nutcracker01.png',
 'paintcan01.png',
 'parachute.png',
 'powerchair.png',
 'radiator.png',
 'razor03b.png',
 'remotecontrol02b.png',
 'ring01.png',
 'saw02a.png',
 'scalpel.png',
 'scissors01.png',
 'scotchtape.png',
 'screwdriver01.png',
 'shield01.png',
 'shower.png',
 'skippingrope.png',
 'sledgehammer.png',
 'spear01.png',
 'speedball.png',
 'spoon02b.png',
 'sportsjersey.png',
 'strainer02(1).png',
 'strawbasket01.png',
 'styrofoamcup.png',
 'tennisball01a.png',
 'tennisracket.png',
 'thermometer03a.png',
 'toasteroven.png',
 'tongs01b.png',
 'towel01.png',
 'triangleruler01.png',
 'trumpet.png',
 'tulip01.png',
 'tupperware03b.png',
 'visor.png',
 'volleyball.png',
 'watch03b.png',
 'waterbottle01b.png',
 'waterbottle03.png',
 'watercooler.png',
 'wateringcan.png',
 'weight05a.png',
 'windshieldwiper02.png',
 'adjustablewrench01a.png',
 'alarmclock01.png',
 'birdfeeder.png',
 'birdhouse.png',
 'birdie.png',
 'blender.png',
 'boogieboard.png',
 'book01a.png',
 'boot01.png',
 'boot02a.png',
 'bottleopener01.png',
 'bowl01.png',
 'bowlingpin.png',
 'boxcutter05.png',
 'bungeecord02.png',
 'butterknife.png',
 'button04.png',
 'calculator01.png',
 'calendar.png',
 'campfire.png',
 'cane.png',
 'cannon.png',
 'ceilingfan02.png',
 'cessna.png',
 'cherrypicker.png',
 'chisel01a.png',
 'cleaver01.png',
 'clock01b.png',
 'clothesdryingrack.png',
 'coloringset.png',
 'computermouse02b.png',
 'cooler02.png',
 'crayon.png',
 'crosscountryboot.png',
 'curlingiron01b.png',
 'cutlass.png',
 'cuttingboard.png',
 'cuttingpliers02.png',
 'cymbal.png',
 'dartboard.png',
 'deckofplayingcards03.png',
 'dentalfloss01.png',
 'deodorant02b.png',
 'desktopcomputer.png',
 'diaperbag.png',
 'djmixer01.png',
 'doorlock.png',
 'doormat.png',
 'downhillski.png',
 'drillbit04.png',
 'drum01.png',
 'electricguitar02.png',
 'electricoutlet.png',
 'escalator.png',
 'expandablefolder02b.png',
 'eyepatch.png',
 'flashlight02b.png',
 'floorlamp.png',
 'foldingchair.png',
 'football.png',
 'footballhelmet.png',
 'freezer01.png',
 'fridge.png',
 'fryingpan03.png',
 'garbagebin.png',
 'garbagecan01.png',
 'glass02b.png',
 'glasses01b.png',
 'golfbag.png',
 'grater01a.png',
 'hairclip01.png',
 'hairclip03.png',
 'hairclipper.png',
 'hairdryer03b.png',
 'halogenlightbulb.png',
 'hammer03a.png',
 'handbrush02.png',
 'handmixer01c.png',
 'hikingshoe01.png',
 'hockeygoalieglove.png',
 'hockeygoaliepad.png',
 'kidbicycle.png',
 'knee.png',
 'kneepad01a.png',
 'knifesharpener.png',
 'ladle02b.png',
 'laptop02.png',
 'lawnmowertractor.png',
 'leafrake.png',
 'leg.png',
 'lifesaver.png',
 'linedpaper.png',
 'lipstick04.png',
 'lockingplier.png',
 'log.png',
 'makeupbrush05.png',
 'maraca02b.png',
 'mathcompass.png',
 'microwave.png',
 'missile.png',
 'mitten02b.png',
 'monitor.png',
 'motorboat01.png',
 'motorcycle.png',
 'musicalwoodenspoons.png',
 'musicsheet.png',
 'nailclipper04a.png',
 'nailfile.png',
 'nailpolish01.png',
 'needlenosepliers01.png',
 'nunchuk.png',
 'paintbrush01.png',
 'paintroller01.png',
 'papershredder.png',
 'patioumbrella.png',
 'peeler02a.png',
 'pen06.png',
 'pencil01.png',
 'perfume03b.png',
 'pickaxe01.png',
 'pictureframe01.png',
 'pinecone01.png',
 'pinecone02a.png',
 'plant02a.png',
 'plant04a.png',
 'pliers02a.png',
 'poolnet.png',
 'pooltable.png',
 'pooltriangle.png',
 'porsche.png',
 'pot01.png',
 'pot02b.png',
 'potatomasher02b.png',
 'propanetank02.png',
 'ridinghelmet.png',
 'rope02.png',
 'rubberglove02a.png',
 'ruler03b.png',
 'safarihat.png',
 'sailboat.png',
 'sandal.png',
 'sandbagthrowgame.png',
 'sandpaper.png',
 'saw01a.png',
 'screwdriver07.png',
 'screwdriver09a.png',
 'scrubbingbrush06.png',
 'shirt02.png',
 'shoelace.png',
 'shovel02.png',
 'sieve01b.png',
 'sieve02b.png',
 'slipper01b.png',
 'sneaker03a.png',
 'snowblower.png',
 'snowbrush.png',
 'soccerball.png',
 'soccercleat01.png',
 'sock01a.png',
 'solderingwire.png',
 'soundmixer.png',
 'spacerocket.png',
 'spacerover.png',
 'spatula01.png',
 'spatula05a.png',
 'spatula07.png',
 'speaker04.png',
 'sponge02a.png',
 'sponge03a.png',
 'springdoorstop.png',
 'strainer01.png',
 'stroller.png',
 'stubbywrench01b.png',
 'stuffedanimal02b.png',
 'stuffedanimal04.png',
 'suitcase.png',
 'sunglasses02c.png',
 'sunglasses06c.png',
 'sunglasses07a.png',
 'swimgoggles.png',
 'sword02.png',
 'syringe01.png',
 'table02.png',
 'tableknife03.png',
 'tablesaw.png',
 'tambourine02.png',
 'tank.png',
 'television.png',
 'thermometer01b.png',
 'threeholepunch01a.png',
 'thumbtack02b.png',
 'tie02.png',
 'tissuebox01a.png',
 'toiletbrush.png',
 'tongs02b.png',
 'toolbox01.png',
 'toothbrush02a.png',
 'toothbrush04a.png',
 'toothpick02.png',
 'topaz.png',
 'travelmug.png',
 'treetrunk.png',
 'tricycle.png',
 'trombone.png',
 'uprightpiano01.png',
 'vacuumcleaner02.png',
 'vase01.png',
 'washingmachine.png',
 'watch02b.png',
 'watch03a.png',
 'watercolorpaintset.png',
 'weathervane.png',
 'weedwacker.png',
 'weight05c.png',
 'wheel01.png',
 'wheel03.png',
 'woodencrate03.png',
 'woodenshoe.png',
 'workglove02a.png',
 'accordion02.png',
 'acorn.png',
 'acousticguitar02.png',
 'airhockeytable.png',
 'alarmsystem.png',
 'angelstatue.png',
 'arm.png',
 'athleticsock.png',
 'axe01.png',
 'badmintonracket.png',
 'banjo.png',
 'barbecue01.png',
 'barrel01.png',
 'baseballbat.png',
 'baseballglove.png',
 'basketballhoop01.png',
 'basketballhoop02.png',
 'bastingbrush.png',
 'battery02a.png',
 'beachumbrella01.png',
 'bed.png',
 'belt02b.png',
 'belt02c.png',
 'bicycle.png',
 'bikepump02.png',
 'bikerack.png',
 'binoculars01b.png',
 'boltcutter.png',
 'bottleopener02.png',
 'bow.png',
 'bowlingball.png',
 'bowrake.png',
 'button03.png',
 'camera01b.png',
 'canoepaddle01.png',
 'carkey.png',
 'cashregister01.png',
 'ceilingfan01.png',
 'chainsaw.png',
 'charcoalbarbecue.png',
 'chisel03.png',
 'chocolatefonduedish.png',
 'clock01c.png',
 'codedoorlock.png',
 'compactpowder.png',
 'compostbin.png',
 'congadrum.png',
 'corkboard.png',
 'corkscrew05.png',
 'curlingiron01a.png',
 'dentalfloss02a.png',
 'deodorant02a.png',
 'desk01.png',
 'dice02b.png',
 'dolly01.png',
 'dresser02.png',
 'drill01a.png',
 'drum03.png',
 'drum04.png',
 'drumstick.png',
 'ear(1).png',
 'electricguitar01.png',
 'eraser.png',
 'exercisemachine.png',
 'expandablefolder03a.png',
 'filmnegative.png',
 'flail.png',
 'fluorescentlightbulb.png',
 'foosballtable.png',
 'fork02b.png',
 'fountainpen.png',
 'frenchhorn.png',
 'fryingpan01.png',
 'gamecontroller01.png',
 'glassmop.png',
 'globe.png',
 'goldnugget.png',
 'hairdryer03a.png',
 'hairpin.png',
 'hand01a.png',
 'hand01b.png',
 'handgripper.png',
 'handrake01b.png',
 'hanger02b.png',
 'hanger05b.png',
 'hanger06b.png',
 'hardhat02.png',
 'heatpump.png',
 'highheelshoe03a.png',
 'hockeygoaliemask.png',
 'hockeystick.png',
 'icecubetray01b.png',
 'icepack.png',
 'icescraper.png',
 'iron01b.png',
 'ironingboard02.png',
 'jackhammer.png',
 'jeans02.png',
 'jetski.png',
 'joustingspear.png',
 'key03b.png',
 'keyboard.png',
 'keychain.png',
 'keyhook.png',
 'kiddiepool.png',
 'kitchenscale02.png',
 'knife01.png',
 'knife02.png',
 'knife05.png',
 'ladle01a.png',
 'laptop01b.png',
 'lawnmower.png',
 'leaf01b.png',
 'leaf03a.png',
 'leaf04.png',
 'leafblower01.png',
 'lily.png',
 'lintbrush.png',
 'lintroller.png',
 'lip.png',
 'lipstick02a.png',
 'loppingshears.png',
 'lunchbox.png',
 'machete.png',
 'machinegun.png',
 'magnifyingglass01a.png',
 'makeupbrush01.png',
 'manshoe.png',
 'match.png',
 'measuringcup01.png',
 'megaphone.png',
 'microphone01.png',
 'minifridge.png',
 'mirror02.png',
 'mitten01.png',
 'morningstar.png',
 'mortarandpestle.png',
 'motoroilbottle03a.png',
 'muffintray01.png',
 'musicstand.png',
 'musket.png',
 'nail.png',
 'nailgun.png',
 'nailpolish03b.png',
 'nasalspray01.png',
 'oneholepunch.png',
 'pacifier01b.png',
 'paddleball.png',
 'paninigrill.png',
 'pen03c.png',
 'pencil03b.png',
 'pencilcase02a.png',
 'pencilsharpener02a.png',
 'perfume01a.png',
 'pickaxe02.png',
 'picnictable.png',
 'pictureframe02a.png',
 'piggybank.png',
 'pipewrench.png',
 'plant08.png',
 'plant09.png',
 'plant10.png',
 'plant11.png',
 'pliers01.png',
 'pokerset.png',
 'poolcue.png',
 'postalmailbox01.png',
 'postitnote.png',
 'pot02a.png',
 'printer03a.png',
 'punchingbag.png',
 'punchingball.png',
 'pusharoundtoy.png',
 'puzzle.png',
 'quartz.png',
 'radio03a.png',
 'razor01.png',
 'rearviewmirror.png',
 'record.png',
 'recorder04.png',
 'remotecontrol03a.png',
 'revolver.png',
 'rock01a.png',
 'rock01b.png',
 'rollerblade.png',
 'rollercoaster.png',
 'rollingpin01a.png',
 'rowboat.png',
 'safetyglasses.png',
 'saladspinner.png',
 'sandshovel01.png',
 'saxophone.png',
 'scale01b.png',
 'scanner.png',
 'scooter.png',
 'sewingmachine02b.png',
 'shoepolish.png',
 'shoulder.png',
 'shoulderpad.png',
 'shovel01.png',
 'sink.png',
 'skateboard.png',
 'skiboot01a.png',
 'skihelmet01.png',
 'slipper02b.png',
 'sneaker04a.png',
 'snowboard.png',
 'soap04b.png',
 'soapdispenser02.png',
 'soapdispenser04.png',
 'sock02.png',
 'sock03.png',
 'soil.png',
 'squashball.png',
 'staplegun.png',
 'stapler02.png',
 'surfboard.png',
 'swimsuit.png',
 'table01.png',
 'tambourine03.png',
 'tankertruck.png',
 'telescope.png',
 'toaster02.png',
 'toilet.png',
 'toiletpaper01a.png',
 'toydinosaur.png',
 'toyfiretruck.png',
 'toyradio01a.png',
 'trampoline.png',
 'treadmill.png',
 'tripod01.png',
 'tweezers02b.png',
 'vacuumcleaner01.png',
 'violin.png',
 'wafflemaker.png',
 'watch04.png',
 'waterheater.png',
 'webcam.png',
 'weight02b.png',
 'weight04a.png',
 'weight05b.png',
 'wheelbarrow01(1).png',
 'wheelchair.png',
 'whiteglue.png',
 'wirestripper.png',
 'woodboard.png',
 'workglove02b.png',
 'xylophone.png',
 'ziplocbag.png',
 '50dollarbill.png',
 'accordion01.png',
 'acousticguitar01.png',
 'airconditioner.png',
 'aloe02.png',
 'apron.png',
 'axe02.png',
 'backpack01b.png',
 'bandage.png',
 'barbedwire02.png',
 'baseball01a.png',
 'bassguitar.png',
 'bathtub.png',
 'bazooka.png',
 'beachpaddle01b.png',
 'belt01a.png',
 'bench01.png',
 'binoculars02b.png',
 'calculator02a.png',
 'caulking.png',
 'cellphone.png',
 'computermouse02a.png',
 'corkscrew03c.png',
 'crosscountryski.png',
 'dentalfloss02b.png',
 'doorbolt.png',
 'drum02.png',
 'ear.png',
 'gamecontroller02.png',
 'hairdryer02b.png',
 'handheldtelescope.png',
 'handvacuum.png',
 'hanger04.png',
 'hanger05a.png',
 'hanger06a.png',
 'hardhat01.png',
 'headphones03c.png',
 'hedgeshears.png',
 'hibiscusflower02.png',
 'hoe.png',
 'huntingknife.png',
 'icecubetray03.png',
 'ironingboard01.png',
 'jeep.png',
 'key06.png',
 'keyhole.png',
 'knife03.png',
 'ladle01c.png',
 'ladle02a.png',
 'lamppost02.png',
 'lantern01.png',
 'leaf05.png',
 'lilypad.png',
 'lock03b.png',
 'measuringtape01.png',
 'muffintray02.png',
 'nailpolish02a.png',
 'nailpolish03a.png',
 'paintroller02.png',
 'paperclip01c.png',
 'payphone.png',
 'pda.png',
 'pen05a.png',
 'pencilsharpener01.png',
 'pictureframe04.png',
 'pinecone02b.png',
 'pingpongpaddle01a.png',
 'pingpongtable.png',
 'plunger01a.png',
 'poloshirt.png',
 'potatomasher03a.png',
 'puttyknife.png',
 'razor04a.png',
 'recyclingbin.png',
 'rose.png',
 'rubberglove01b.png',
 'rubberglove02b.png',
 'safe.png',
 'sand.png',
 'saw01b.png',
 'saw02b.png',
 'scissors02b.png',
 'scissors05a.png',
 'screwdriver08.png',
 'scrubbingbrush01a.png',
 'shelf.png',
 'shoehorn.png',
 'shorts02.png',
 'sieve03a.png',
 'skipole.png',
 'slipper02a.png',
 'slushiemachine.png',
 'smartboard.png',
 'sneaker05.png',
 'soap03a.png',
 'soap04a.png',
 'speaker03a.png',
 'speaker05.png',
 'sportshorts02.png',
 'stapler01.png',
 'steeringwheel.png',
 'stickytack.png',
 'stubbywrench01a.png',
 'sunglasses02a.png',
 'sunglasses03a.png',
 'tableknife01b.png',
 'tennisball01b.png',
 'thread01a.png',
 'tie03a.png',
 'tissuebox02.png',
 'toiletpaper01b.png',
 'toothbrush03b.png',
 'toothpastetube.png',
 'videocamera01b.png',
 'weight01.png',
 'wheelbarrow01.png',
 'workglove01.png',
 'adjustablewrench02c.png',
 'ball01.png',
 'barbecuelighter.png',
 'beachpaddle01a.png',
 'bikelock.png',
 'binoculars01a.png',
 'canoftennisballs.png',
 'cattail.png',
 'cheeseknife01.png',
 'chisel01b.png',
 'cutleryset.png',
 'dishsoap.png',
 'drumset.png',
 'dumpster.png',
 'fanheater.png',
 'flashlight05.png',
 'foot.png',
 'fork07b.png',
 'fryingpan02a.png',
 'golfball.png',
 'grater01b.png',
 'handrail.png',
 'harmonica.png',
 'hedgetrimmer.png',
 'iceskate.png',
 'kneepad01c.png',
 'lifejacket.png',
 'locomotive.png',
 'mitten03b.png',
 'plant07.png',
 'pokerchips.png',
 'rainboot.png',
 'rollingpin02a.png',
 'rubikcube.png',
 'sewingmachine01a.png',
 'skiboot01b.png',
 'smokedetector01.png',
 'speaker03b.png',
 'strainer02.png',
 'triangleruler02.png',
 'weight04c.png',
 'wheel04.png']
	
/*
var images = []
for(var i = 0; i < neutral_pics.length; i++){
	images.push(pathSource + neutral_pics[i])
}


jsPsych.pluginAPI.preloadImages(images);
*/

var stims = jsPsych.randomization.repeat(neutral_pics,1)



/* ************************************ */
/*        Set up jsPsych blocks         */
/* ************************************ */

var end_block = {
	type: 'poldrack-text',
	data: {
		trial_id: "end"
	},
	timing_response: -1,
	text: '<div class = bigbox><div class = centerbox>'+
		  '<p class = center-textJamie style="font-size:36px"><font color="white">Thanks for completing this task!</font></p>'+
		  '<p class = center-textJamie style="font-size:36px"><font color="white">Press<strong> enter</strong> to continue.</font></p>'+
		  '</div></div>',
	cont_key: [13],
	timing_post_trial: 0
};

var welcome_block = {
	type: 'poldrack-text',
	data: {
		trial_id: "welcome"
	},
	timing_response: -1,
	text: '<div class = bigbox><div class = centerbox>'+
		  '<p class = center-textJamie style="font-size:36px"><font color="white">Welcome to the task!</font></p>'+
		  '<p class = center-textJamie style="font-size:36px"><font color="white">Press<strong> enter</strong> to continue.</font></p>'+
		  '</div></div>',
	cont_key: [13],
	timing_post_trial: 0
};

var post_rating_intro = {
	type: 'poldrack-text',
	data: {
		trial_id: "post_rating_intro"
	},
	timing_response: -1,
	text: '<div class = bigbox><div class = centerbox>'+
		  '<p class = center-textJamie style="font-size:36px"><font color="white">For this next phase, please rate how much you want to consume the item.</font></p>'+
		  '<p class = center-textJamie style="font-size:36px"><font color="white">1 = very low, 5 = very high.</font></p>'+		  
		  '</div></div>',
	cont_key: [13],
	timing_post_trial: 0,
	on_finish: function(){
		jsPsych.data.addDataToLastTrial({
		triggers: trigger_tracker,
		trigger_time: trigger_timer
		})

		trigger_tracker = []
		trigger_timer = []
		
	}
};


var instructions_block = {
	type: 'poldrack-text',
	data: {
		trial_id: "instructions"
	},
	timing_response: -1,
	text: '<div class = bigbox><div class = centerbox>'+
			'<p class = block-text><font color = "white">We are interested in the suitability of different objects to be judged on a "use/utilize now" vs "use/utilize repetitively later" axis.</font></p>'+
			'<p class = block-text><font color = "white">To be specific, for each object we want you to think about how you would feel if you used/utilized that object now - within a few seconds.</font></p>'+
			'<p class = block-text><font color = "white">In addition, we would also like you to think about the long-term consequences of repeatedly using/utilizing <strong>each</strong> object.</font></p>'+
			'<p class = block-text><font color = "white">Please indicate your judgement of each objects suitability on a "use/utilize now" vs "use/utilize repetitively later" axis, using the keyboard keys 1, 2, 4, 5, and 5.</font></p>'+
			'<p class = block-text><font color = "white">You will have 3 seconds to make your choice, and your response will be indicated by a green border surrounding your button of choice.</font></p>'+
			'<p class = block-text><font color = "white">Please start by fixating your eyes at the center of the screen.</font></p>'+
			'<p class = block-text><font color = "white">When you are ready to begin, press <strong>enter</strong> to start with a practice trial.</font></p>'+		
		 '</div></div>',
	cont_key: [13],
	timing_post_trial: 0,
	on_finish: function(){
		gameState = "practice_rating"
	}
};

var start_test_block = {
	type: 'poldrack-text',
	data: {
		trial_id: "start_test_block"
	},
	timing_response: -1,
	text: '<div class = bigbox><div class = centerbox>'+
			'<p class = block-text><font color = "white">A trial will look and be timed like the practice trial, except without the text on top.</font></p>'+
			'<p class = block-text><font color = "white">Please note that each trial will take a specified amount of time, regardless of how fast you respond.</font></p>'+
			'<p class = block-text><font color = "white">Press <strong>enter</strong> to start the task.</font></p>'+		
		 '</div></div>',
	cont_key: [13],
	timing_post_trial: 0
};


var rest_block = {
	type: 'poldrack-single-stim',
	stimulus: getRestText,
	is_html: true,
	choices: [13],
	data: {
		trial_id: "rest_block"
	},
	timing_post_trial: 0,
	timing_stim: -1,
	timing_response: -1,
	response_ends_trial: true
};

var post_exp_block = {
	type: 'poldrack-single-stim',
	stimulus: getQuestion,
	is_html: true,
	choices: [81], 
	data: {
		exp_id: "object_rating",
		"trial_id": "post_questionnaire_block"
	},
	timing_post_trial: 0,
	timing_stim: -1,
	timing_response: -1,
	response_ends_trial: true,
	on_finish: appendData
};
	
var practice_rating_block = {
	type: 'poldrack-single-stim',
	stimulus: getRatingBoard,
	is_html: true,
	choices: [87], //'none'
	data: {
		trial_id: "practice_rating"
	},
	timing_post_trial: 0,
	timing_stim: 3000, 
	timing_response: 3000, 
	response_ends_trial: false,
	on_finish: function(){
		pressedKey = ""
		gameState = "rating"
		keyTracker = []
	}
};

/* ************************************ */
/*        Set up timeline blocks        */
/* ************************************ */
	
	
var fixation_block = {
	type: 'poldrack-single-stim',
	stimulus: '<div class = bigbox><div class = centerbox><div class = fixation><font color="white">+</font></div></div></div>',
	is_html: true,
	choices: 'none',
	data: {
		trial_id: "fixation"
	},
	timing_post_trial: 0,
	timing_stim: 200,
	timing_response: 200,
	on_finish: function(){
		keyTracker = []
		pressedKey = ""
	}
};

var training_trials = []
for(var i = 0; i < numTrialsPerBlock; i++){ //numStims before, should be # of trials per block (40??)
	
	var rating_block = {
	type: 'poldrack-single-stim',
	stimulus: getRatingBoard,
	is_html: true,
	choices: [87], //'none'
	data: {
		trial_id: "test_rating"
	},
	timing_post_trial: 0,
	timing_stim: 3000, 
	timing_response: 3000, 
	response_ends_trial: false,
	on_finish: function(){
		keyTracker = []
		appendData()
	}
	};
	
	//training_trials.push(fixation_block)
	training_trials.push(rating_block)
}
training_trials.push(rest_block)



var training_node = {
	timeline: training_trials,
	loop_function: function(data){
		currBlock += 1
	
		if(currBlock == numBlocks){
			
			
			return false
		}else if (currBlock < numBlocks){
			
			
			return true
		}
	
	}
}


/* ************************************ */
/*          Set up Experiment           */
/* ************************************ */

var object_rating_experiment = []


object_rating_experiment.push(welcome_block);

object_rating_experiment.push(instructions_block);

object_rating_experiment.push(practice_rating_block);

object_rating_experiment.push(start_test_block);

object_rating_experiment.push(training_node);

object_rating_experiment.push(post_exp_block);

object_rating_experiment.push(end_block);




