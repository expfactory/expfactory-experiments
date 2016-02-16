/**
 * jspsych plugin for categorization trials with feedback (including rt feedback)
 * Ian Eisenberg
 *
 * documentation: docs.jspsych.org
 **/


jsPsych.plugins.attention_network_task_practice = (function() {

  var plugin = {};

  jsPsych.pluginAPI.registerPreload('animation', 'stimulus', 'image');

  plugin.trial = function(display_element, trial) {

    // default parameters
    trial.text_answer = (typeof trial.text_answer === 'undefined') ? "" : trial.text_answer;
    trial.correct_text = (typeof trial.correct_text === 'undefined') ? "<p class='feedback'>Correct</p>" : trial.correct_text;
    trial.incorrect_text = (typeof trial.incorrect_text === 'undefined') ? "<p class='feedback'>Incorrect</p>" : trial.incorrect_text;
    trial.show_stim_with_feedback = (typeof trial.show_stim_with_feedback === 'undefined') ? true : trial.show_stim_with_feedback;
    trial.is_html = (typeof trial.is_html === 'undefined') ? false : trial.is_html;
    trial.force_correct_button_press = (typeof trial.force_correct_button_press === 'undefined') ? false : trial.force_correct_button_press;
    trial.prompt = (typeof trial.prompt === 'undefined') ? '' : trial.prompt;
    trial.show_feedback_on_timeout = (typeof trial.show_feedback_on_timeout === 'undefined') ? false : trial.show_feedback_on_timeout;
    trial.timeout_message = trial.timeout_message || "<p>Please respond faster.</p>";
    // timing params
    trial.response_ends_trial = (typeof trial.response_ends_trial == 'undefined') ? false : trial.response_ends_trial;
    trial.timing_stim = trial.timing_stim || -1; // default is to show image until response
    trial.timing_response = trial.timing_response || -1; // default is no max response time
    trial.timing_feedback_duration = trial.timing_feedback_duration || 2000;

    // if any trial variables are functions
    // this evaluates the function and replaces
    // it with the output of the function
    trial = jsPsych.pluginAPI.evaluateFunctionParameters(trial);

    // this array holds handlers from setTimeout calls
    // that need to be cleared if the trial ends early
    var setTimeoutHandlers = [];

    if (!trial.is_html) {
      // add image to display
      display_element.append($('<img>', {
        "src": trial.stimulus,
        "class": 'jspsych-ant-stimulus',
        "id": 'jspsych-ant-stimulus'
      }));
    } else {
      display_element.append($('<div>', {
        "id": 'jspsych-ant-stimulus',
        "class": 'jspsych-ant-stimulus',
        "html": trial.stimulus
      }));
    }

    // hide image after time if the timing parameter is set
    if (trial.timing_stim > 0) {
      setTimeoutHandlers.push(setTimeout(function() {
        $('#jspsych-ant-stimulus').css('visibility', 'hidden');
      }, trial.timing_stim));
    }

    // if prompt is set, show prompt
    if (trial.prompt !== "") {
      display_element.append(trial.prompt);
    }

    var trial_data = {};

    // create response function
    var after_response = function(info) {

      // after a valid response, the stimulus will have the CSS class 'responded'
      // which can be used to provide visual feedback that a response was recorded
      $("#jspsych-ant-stimulus").addClass('responded');

      // kill any remaining setTimeout handlers
      for (var i = 0; i < setTimeoutHandlers.length; i++) {
        clearTimeout(setTimeoutHandlers[i]);
      }

      // clear keyboard listener
      jsPsych.pluginAPI.cancelAllKeyboardResponses();

      var correct = false;
      if (trial.key_answer == info.key) {
        correct = true;
      }

      //calculate stim and block duration
      var stim_duration = trial.timing_stim
      var block_duration = trial.timing_response
      if (trial.response_ends_trial & info.rt != -1) {
          block_duration = info.rt
      }
      if (stim_duration != -1) {
        stim_duration = Math.min(block_duration,trial.timing_stim)
      } else {
        stim_duration = block_duration
      }

      // save data
      trial_data = {
        "rt": info.rt,
        "correct": correct,
        "stimulus": trial.stimulus,
        "key_press": info.key,
        "correct_response": trial.key_answer,
        "possible_responses": trial.choices,
        "stim_duration": stim_duration,
        "block_duration": block_duration,
        "feedback_duration": trial.timing_feedback_duration,
        "timing_post_trial": trial.timing_post_trial
      };

      var timeout = info.rt == -1;
      // if response ends trial display feedback immediately
      if (trial.response_ends_trial || info.rt == -1) {
        display_element.html('');
        doFeedback(correct, timeout, info.rt);
      // otherwise wait until timing_response is reached
      } else {
        setTimeout(function() {
          display_element.html('');
          doFeedback(correct, timeout, info.rt);
        }, trial.timing_response - info.rt);
      }
    }

    jsPsych.pluginAPI.getKeyboardResponse({
      callback_function: after_response,
      valid_responses: trial.choices,
      rt_method: 'date',
      persist: false,
      allow_held_key: false
    });

    if (trial.timing_response > 0) {
      setTimeoutHandlers.push(setTimeout(function() {
        after_response({
          key: -1,
          rt: -1
        });
      }, trial.timing_response));
    }

    function doFeedback(correct, timeout, rt) {

      if (timeout && !trial.show_feedback_on_timeout) {
        display_element.append(trial.timeout_message);
      } else {
        // show image during feedback if flag is set
        if (trial.show_stim_with_feedback) {
          if (!trial.is_html) {
            // add image to display
            display_element.append($('<img>', {
              "src": trial.stimulus,
              "class": 'jspsych-ant-stimulus',
              "id": 'jspsych-ant-stimulus'
            }));
          } else {
            display_element.append($('<div>', {
              "id": 'jspsych-ant-stimulus',
              "class": 'jspsych-ant-stimulus',
              "html": trial.stimulus
            }));
          }
        }

        // substitute answer in feedback string.
        var atext = "";
        if (correct) {
          atext = trial.correct_text.replace("RT", rt);
        } else {
          atext = trial.incorrect_text.replace("RT", rt);
        }

        // show the feedback
        display_element.append(atext);
      }
      // check if force correct button press is set
      if (trial.force_correct_button_press && correct === false && ((timeout && trial.show_feedback_on_timeout) || !timeout)) {

        var after_forced_response = function(info) {
          endTrial();
        }

        jsPsych.pluginAPI.getKeyboardResponse({
          callback_function: after_forced_response,
          valid_responses: [trial.key_answer],
          rt_method: 'date',
          persist: false,
          allow_held_key: false
        });

      } else {
        setTimeout(function() {
          endTrial();
        }, trial.timing_feedback_duration);
      }

    }

    function endTrial() {
      display_element.html("");
      jsPsych.finishTrial(trial_data);
    }

  };

  return plugin;
})();
