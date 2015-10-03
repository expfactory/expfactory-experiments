#Psiturk Experiments

Each folder contains a javascript experiment that can be deployed into a [psiturk experiment battery instance](http://www.github.com/psiturk/psiturk-battery). The folder should contain the following:

### Folder Contents

#### psiturk.json
A data structure that specifies the following:
 - name: the full name of the experiment, best is to use the name of the publication it is associated with.
 - tag: the tag for the experiment, typically the folder name, all lowercase with no special characters.
 - run: entry javascript and css files for the experiment. Paths here should all be relative to the experiment folder, and will be used to generate the code in `load_experiments.js` for example, for the experiment in folder `multi-source` with run variable specified as:

              "run": [
                      "experiment.js",
                      "style.css",
                      "plugin.js"
                     ],
 

will produce the following code in `load_experiment.js`:

		case "multi-source":
			loadjscssfile("static/experiments/multi-source/experiment.js","js")
			loadjscssfile("static/experiments/multi-source/style.css","css")
			loadjscssfile("static/experiments/multi-source/plugin.js","js")
			break;

(TODO: need to figure out how experiments use the jspych plugins, if code should be shared or distributed with experiment)
 - cognitive_atlas_concept: the cognitive atlas concept(s) that are measured by the experiment
 - cognitive_atlas_concept_id: the name of the cognitive atlas concept(s)
 - cognitive_atlas_task_id: the identifier for the experiment defined in the cognitive atlas
 - contributors: a list of contributors to the task code base.
 - lab: a list of labs associated with the task.
 - doi: the doi of associated papers.
 - reference: url(s) to referenced papers to develop the task
 - notes: any notes about the implementation, etc.

An example of a psiturk.json data structure is follows:

      [
          {
              "name": "Model-Based Influences on Humans' Choices and Striatal Prediction Errors",
              "tag": "2-stage-decision",
              "cognitive_atlas_concept_id":"trm_4aae62e4ad209",
              "cognitive_atlas_concept":"cognitive control",
              "contributors": [
                               "Ian Eisenberg",
                               "Zeynep Enkavi",
                               "Patrick Fisher",
                               "Vanessa Sochat",
                               "Russell Poldrack"
                              ], 
              "lab": "Poldracklab",
              "run": [
                      "experiment.js",
                      "style.css",
                      "plugin.js"
                     ],
              "doi":"10.1016/j.neuron.2011.02.027",
              "reference": "http://www.sciencedirect.com/science/article/pii/S0896627311001255",
              "notes": "Condition = ordered stims in stage 1 and stage 2 (so [0, 1] or [1, 0] for stage 1 and [2, 3], [4, 5] etc. for stage 2 and FB for the FB condition (1 for reward, 0 for no reward)"
    
         }
      ]

#### run
A list of javascript and css files that are essential for the experiment to run, specified in `load_experiments.js` (see details above). Typically, an experiment will have an `experiment.js` file and a `style.css`. For jspsych files that are included with the psiturk-battery/js folder, specify the complete path to the file relative to the static folder. For example:

      static/js/jspsych/plugins/jspsych-call-function.js

Any files with full paths specified as the above will be checked for existance within the psiturk-battery folder. If found, the file will be linked successfully. If not found, the file will be looked for in the experiment folder. If the file does not exist in either place, an error will trigger upon generation of the battery.

### experiment-specific static files
Files hard coded into the experiment.js should have a path with the following format:

      static/experiment/[folder-name]/images/

where `folder-name` is replaced with the name of the experiment folder, and any subdirectories to that (e.g., "images" should exist in the experiment directory. For example, to link a sound file in an experiment folder, `tone-monitoring`:

      practice_stims = [{sound: 'static/experiments/tone_monitoring/sounds/880Hz_-6dBFS_.5s.mp3',
		  data: {exp_id: 'tone_monitoring', trial_id: 'high', condition: 'practice'}},
		 {sound: 'static/experiments/tone_monitoring/sounds/440Hz_-6dBFS_.5s.mp3',
		  data: {exp_id: 'tone_monitoring', trial_id: 'medium', condition: 'practice'}},
		 {sound: 'static/experiments/tone_monitoring/sounds/220Hz_-6dBFS_.5s.mp3',
		 data: {exp_id: 'tone_monitoring', trial_id: 'low', condition: 'practice'}}
      ]

These files would be in the tone-monitoring experiment folder as:

      tone_monitoring/
          sounds/
                 880Hz_-6dBFS_.5s.mp3
                 440Hz_-6dBFS_.5s.mp3
                 220Hz_-6dBFS_.5s.mp3

as the entire thing will be included in the experiment's folder (under `static/experiments/[folder-name]`), with the same structure. As specified above, any static files that are included with the psiturk-battery should be linked with those paths, and do not need to be included in the individual experiment folder. However, when linked to via the `run` variable in `psiturk.json`, they will be checked for existence, and an error will occur if they are not found.


#### experiment.js
This is the main javascript file to run the experiment, typically named experiment.js. The name can change, but must be specified in the psiturk.json as one of the "run" variables. Paths to images, sounds, and other files referenced in this file will be expected to follow the same pattern as above, e.g.: `static/experiment/[folder-name]/images/filename.png` `(required)`.

#### images
This is a folder of images that are necessary for the experiment. The images should be specified in the style.css, and linked relative to the experiment folder. When setting up the battery, they will be copied with the experiment folder in the same structure as defined in the folder, and so they are expected to be under `static/experiment/[folder-name]/images/`. `(optional)`

#### style.css
Is the main style file for the experiment, which will be copied into the battery style folder and linked appropriately. Images that are defined in this file should have paths relative to the images folder. `(required)`.

The following should be included in psiturk-doc, linked here for now.

### Instructions to make a new experiment
TODO:

- Functions should exist in psiturk-python for:
   - generating empty templates
   - validating experiments


### Instructions to add to a battery
TODO:

- Functions should exist in psiturk-python for:
   - getting list of available experiments
   - generating battery output for them to run on psiturk


### Instructions to deploy in a virtual machine
TODO:

- Functions should exist in psiturk-python for:
   - doing the above and deploying to vagrant-aws (or other places)

