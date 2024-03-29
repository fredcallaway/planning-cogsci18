// Generated by CoffeeScript 2.2.2
// coffeelint: disable=max_line_length, indentation
var BLOCKS, CONDITION, DEBUG, DEMO, DEMO_TRIALS, N_TRIAL, PARAMS, SCORE, SHOW_PARTICIPANT, STRUCTURE, TALK, TRIALS, calculateBonus, createStartButton, getTrials, initializeExperiment, psiturk, saveData, with_feedback;

DEBUG = false;

TALK = false;

SHOW_PARTICIPANT = false;

if (DEBUG) {
  console.log("X X X X X X X X X X X X X X X X X\n X X X X X DEBUG  MODE X X X X X\nX X X X X X X X X X X X X X X X X");
  CONDITION = 1;
} else {
  console.log("# =============================== #\n# ========= NORMAL MODE ========= #\n# =============================== #");
  console.log('16/01/18 12:38:03 PM');
  CONDITION = parseInt(condition);
}

if (mode === "{{ mode }}") {
  DEMO = true;
  CONDITION = 1;
}

with_feedback = CONDITION > 0;

BLOCKS = void 0;

PARAMS = void 0;

TRIALS = void 0;

DEMO_TRIALS = void 0;

STRUCTURE = void 0;

N_TRIAL = void 0;

SCORE = 0;

calculateBonus = void 0;

getTrials = void 0;

psiturk = new PsiTurk(uniqueId, adServerLoc, mode);

saveData = function() {
  return new Promise(function(resolve, reject) {
    var timeout;
    timeout = delay(10000, function() {
      return reject('timeout');
    });
    return psiturk.saveData({
      error: function() {
        clearTimeout(timeout);
        console.log('Error saving data!');
        return reject('error');
      },
      success: function() {
        clearTimeout(timeout);
        console.log('Data saved to psiturk server.');
        return resolve();
      }
    });
  });
};

$(window).resize(function() {
  return checkWindowSize(800, 600, $('#jspsych-target'));
});

$(window).resize();

$(window).on('load', function() {
  var loadTimeout, slowLoad;
  // Load data and test connection to server.
  slowLoad = function() {
    var ref;
    return (ref = $('slow-load')) != null ? ref.show() : void 0;
  };
  loadTimeout = delay(12000, slowLoad);
  psiturk.preloadImages(['static/images/spider.png']);
  return delay(300, function() {
    var id;
    console.log('Loading data');
    PARAMS = {
      inspectCost: 1,
      startTime: Date(Date.now()),
      bonusRate: .002,
      // variance: ['2_4_24', '24_4_2'][CONDITION]
      branching: '312'
    };
    psiturk.recordUnstructuredData('params', PARAMS);
    if (PARAMS.variance) {
      id = `${PARAMS.branching}_${PARAMS.variance}`;
    } else {
      id = `${PARAMS.branching}`;
    }
    STRUCTURE = loadJson("static/json/structure/312.json");
    TRIALS = loadJson("static/json/mcrl_trials/increasing.json");
    console.log(`loaded ${(TRIALS != null ? TRIALS.length : void 0)} trials`);
    getTrials = (function() {
      var idx, t;
      t = _.shuffle(TRIALS);
      idx = 0;
      return function(n) {
        idx += n;
        return t.slice(idx - n, idx);
      };
    })();
    if (DEBUG || TALK) {
      createStartButton();
      return clearTimeout(loadTimeout);
    } else {
      console.log('Testing saveData');
      if (DEMO) {
        clearTimeout(loadTimeout);
        return delay(500, createStartButton);
      } else {
        return saveData().then(function() {
          clearTimeout(loadTimeout);
          return delay(500, createStartButton);
        }).catch(function() {
          clearTimeout(loadTimeout);
          return $('#data-error').show();
        });
      }
    }
  });
});

createStartButton = function() {
  if (DEBUG || TALK) {
    initializeExperiment();
    return;
  }
  if (DEMO) {
    $('#jspsych-target').append("<div class='alert alert-info'>\n  <h3>Demo mode</h3>\n\n  To go through the task as if you were a participant, click\n  <b>Begin</b> above.<br> To view replays of the participants in in our\n  study, or simulated runs of one of our models, click one of the buttons below\n\n</div>\n<div class='center' id='replay-buttons'></div>");
    ['Human', 'Optimal', 'Best-First', 'Yourself'].forEach(function(option) {
      var btn;
      return btn = $('<button/>', {
        class: 'btn btn-primary btn-lg',
        text: option,
        click: function() {
          SHOW_PARTICIPANT = true;
          if (option === 'Yourself') {
            DEMO_TRIALS = TRIALS;
          } else {
            DEMO_TRIALS = _.shuffle(loadJson(`static/json/demo/312_${option.toLowerCase()}.json`));
          }
          return initializeExperiment();
        }
      }).appendTo($('#replay-buttons'));
    });
  }
  // <button class='btn btn-primary btn-lg centered' id="view-replays">View Optimal</button>

  // $('#view-optimal').click ->
  //   SHOW_PARTICIPANT = true
  //   DEMO_TRIALS = _.shuffle loadJson "static/json/demo/312_optimal.json"
  //   initializeExperiment()
  // $('#view-optimal').click ->
  //   SHOW_PARTICIPANT = true
  //   DEMO_TRIALS = _.shuffle loadJson "static/json/demo/312_optimal.json"
  //   initializeExperiment()
  $('#load-icon').hide();
  $('#slow-load').hide();
  $('#success-load').show();
  return $('#load-btn').click(initializeExperiment);
};

initializeExperiment = function() {
  var Block, ButtonBlock, MouselabBlock, QuizLoop, TextBlock, bonus_text, divider, divider_intro_training, divider_pretest_training, divider_training_test, experiment_timeline, finish, fullMessage, img, nodeValuesDescription, post_test, pre_test, pre_test_intro, prompt_resubmit, quiz, reprompt, reset_score, save_data, talk_demo, test_block_intro, text, train_basic1, training, verbal_responses;
  $('#jspsych-target').html('');
  console.log('INITIALIZE EXPERIMENT');
  //  ======================== #
  //  ========= TEXT ========= #
  //  ======================== #

  // These functions will be executed by the jspsych plugin that
  // they are passed to. String interpolation will use the values
  // of global variables defined in this file at the time the function
  // is called.
  text = {
    debug: function() {
      if (DEBUG) {
        return "`DEBUG`";
      } else {
        return '';
      }
    }
  };
  // ================================= #
  // ========= BLOCK CLASSES ========= #
  // ================================= #
  Block = class Block {
    constructor(config) {
      _.extend(this, config);
      this._block = this; // allows trial to access its containing block for tracking state
      if (this._init != null) {
        this._init();
      }
    }

  };
  TextBlock = (function() {
    class TextBlock extends Block {};

    TextBlock.prototype.type = 'text';

    TextBlock.prototype.cont_key = [];

    return TextBlock;

  }).call(this);
  ButtonBlock = (function() {
    class ButtonBlock extends Block {};

    ButtonBlock.prototype.type = 'button-response';

    ButtonBlock.prototype.is_html = true;

    ButtonBlock.prototype.choices = ['Continue'];

    ButtonBlock.prototype.button_html = '<button class="btn btn-primary btn-lg">%choice%</button>';

    return ButtonBlock;

  }).call(this);
  QuizLoop = class QuizLoop extends Block {
    loop_function(data) {
      var c, i, len, ref;
      console.log('data', data);
      ref = data[data.length].correct;
      for (i = 0, len = ref.length; i < len; i++) {
        c = ref[i];
        if (!c) {
          return true;
        }
      }
      return false;
    }

  };
  MouselabBlock = (function() {
    class MouselabBlock extends Block {
      _init() {
        _.extend(this, STRUCTURE);
        return this.trialCount = 0;
      }

    };

    MouselabBlock.prototype.type = 'mouselab-mdp';

    MouselabBlock.prototype.playerImage = 'static/images/spider.png';

    // moveDelay: PARAMS.moveDelay
    // clickDelay: PARAMS.clickDelay
    // moveEnergy: PARAMS.moveEnergy
    // clickEnergy: PARAMS.clickEnergy
    MouselabBlock.prototype.lowerMessage = "<b>Click on the nodes to reveal their values.<br>\nMove with the arrow keys.</b>";

    return MouselabBlock;

  }).call(this);
  //  ============================== #
  //  ========= EXPERIMENT ========= #
  //  ============================== #
  img = function(name) {
    return `<img class='display' src='static/images/${name}.png'/>`;
  };
  nodeValuesDescription = (function() {
    switch (PARAMS.variance) {
      case "6_6_6":
        return "A node can have value -10, -5, 5, or 10. All values are equally likely.";
      case "2_4_24":
        return "The more steps it takes to reach a node, the more variable its value\ntends to be: The value of a node you can reach in **one** step is equally\nlikely to be **-4, -2, 2, or 4**. The value of a node you can reach in **two**\nsteps is equally likely to be **-8, -4, 4, or 8**. Finally,  the value of a\nnode you can reach in **three** steps is equally likely to be **-48, -24, 24,\nor 48**.";
      case "24_4_2":
        return "The more steps it takes to reach a node, the less variable its value\ntends to be: The value of a node you can reach in **one** step is equally\nlikely to be **-48, -24, 24, or 48**. The value of a node you can reach in\n**two** steps is equally likely to be **-8, -4, 4, or 8**. Finally,  the value\nof a node you can reach in **three** steps is equally likely to be  -4, -2,\n2, or 4.";
    }
  })();
  
  // instruct_loop = new Block
  //   timeline: [instructions, quiz]
  //   loop_function: (data) ->
  //     for c in data[1].correct
  //       if not c
  //         return true  # try again
  //     psiturk.finishInstructions()
  //     psiturk.saveData()
  //     return false
  fullMessage = "";
  reset_score = new Block({
    type: 'call-function',
    func: function() {
      return SCORE = 0;
    }
  });
  divider = new TextBlock({
    text: function() {
      SCORE = 0;
      return "<div style='text-align: center;'> Press <code>space</code> to continue.</div>";
    }
  });
  divider_training_test = new TextBlock({
    text: function() {
      SCORE = 0;
      return "<div style='text-align: center;'> Congratulations! You have completed the training block. <br/> <br/> Press <code>space</code> to start the test block.</div>";
    }
  });
  test_block_intro = new TextBlock({
    text: function() {
      SCORE = 0;
      return `<div style='text-align: center;'> Welcome to the test block! Here, you can use what you have learned to earn a bonus. Concretely, ${bonus_text('long')} <br/> Press <code>space</code> to continue. </div>\n`;
    }
  });
  divider_intro_training = new TextBlock({
    text: function() {
      SCORE = 0;
      return "<div style='text-align: center;'> Congratulations! You have completed the instructions. Next, you will enter a training block where you can practice planning, and a test block where you can use what you have learned to earn a bonus. <br/> Press <code>space</code> to start the training block.</div>";
    }
  });
  divider_pretest_training = new TextBlock({
    text: function() {
      SCORE = 0;
      return "<div style='text-align: center;'> You will now enter a training block where you can practice playing Web of Cash some more. After that, there will be a test block where you can use what you have learned to earn a bonus. <br/> Press <code>space</code> to start the training block.</div>";
    }
  });
  train_basic1 = new MouselabBlock({
    blockName: 'train_basic',
    stateDisplay: 'never',
    prompt: function() {
      return markdown("## Web of Cash\n\nIn this HIT, you will play a game called *Web of Cash*. You will guide a\nmoney-loving spider through a spider web. When you land on a gray circle\n(a ***node***) the value of the node is added to your score.\n\nYou can move the spider with the arrow keys, but only in the direction\nof the arrows between the nodes. Go ahead, try it out!");
    },
    lowerMessage: 'Move with the arrow keys.',
    stateDisplay: 'never',
    timeline: getTrials(1)
  });
  
  //   train_basic2 = new MouselabBlock
  //    blockName: 'train_basic2'
  //    stateDisplay: 'always'
  //    prompt: ->
  //      markdown """
  //      ## Some nodes are more important than others

  //{nodeValuesDescription} Please take a look at the example below to see what this means.

  //      Try a few more rounds now!
  //    """
  //    lowerMessage: 'Move with the arrow keys.'
  //    timeline: getTrials 5

  //  train_hidden = new MouselabBlock
  //    blockName: 'train_hidden'
  //    stateDisplay: 'never'
  //    prompt: ->
  //      markdown """
  //      ## Hidden Information

  //      Nice job! When you can see the values of each node, it's not too hard to
  //      take the best possible path. Unfortunately, you can't always see the
  //      value of the nodes. Without this information, it's hard to make good
  //      decisions. Try completing a few more rounds.
  //    """
  //    lowerMessage: 'Move with the arrow keys.'
  //    timeline: getTrials 5

  //  train_inspector = new MouselabBlock
  //    blockName: 'train_inspector'
  // special: 'trainClick'
  //    stateDisplay: 'click'
  //    stateClickCost: 0
  //    prompt: ->
  //      markdown """
  //      ## Node Inspector

  //      It's hard to make good decision when you can't see what you're doing!
  //      Fortunately, you have access to a ***node inspector*** which can reveal
  //      the value of a node. To use the node inspector, simply click on a node.
  //      **Note:** you can only use the node inspector when you're on the first
  //      node.

  //      Trying using the node inspector on a few nodes before making your first
  //      move.
  //    """
  //    # but the node inspector takes some time to work and you can only inspect one node at a time.
  //    timeline: getTrials 1
  // lowerMessage: "<b>Click on the nodes to reveal their values.<b>"

  //  train_inspect_cost = new MouselabBlock
  //    blockName: 'train_inspect_cost'
  //    stateDisplay: 'click'
  //    stateClickCost: PARAMS.inspectCost
  //    prompt: ->
  //      markdown """
  //      ## The price of information

  //      You can use node inspector to gain information and make better
  //      decisions. But, as always, there's a catch. Using the node inspector
  //      costs $#{PARAMS.inspectCost} per node. To maximize your score, you have
  //      to know when it's best to gather more information, and when it's time to
  //      act!
  //    """
  //    timeline: getTrials 1
  bonus_text = function(long) {
    var s;
    // if PARAMS.bonusRate isnt .01
    //   throw new Error('Incorrect bonus rate')
    s = "**you will earn 1 cent for every $5 you make in the game.**";
    if (long) {
      s += " For example, if your final score is $1000, you will receive a bonus of $2.";
    }
    return s;
  };
  //  train_final = new MouselabBlock
  //    blockName: 'train_final'
  //    stateDisplay: 'click'
  //    stateClickCost: PARAMS.inspectCost
  //    prompt: ->
  //      markdown """
  //      ## Earn a Big Bonus

  //     Nice! You've learned how to play *Web of Cash*, and you're almost ready
  //      to play it for real. To make things more interesting, you will earn real
  //      money based on how well you play the game. Specifically,
  //      #{bonus_text('long')}

  //      These are the **final practice rounds** before your score starts counting
  //      towards your bonus.
  //    """
  //    lowerMessage: fullMessage
  //    timeline: getTrials 5

  //  train = new Block
  //    training: true
  //    timeline: [
  //      train_basic1
  //       divider    
  //      train_basic2    
  //      divider
  //      train_hidden
  //      divider
  //      train_inspector
  //       divider
  //      train_inspect_cost
  //      divider
  //       train_final
  //    ]
  quiz = new Block({
    preamble: function() {
      return markdown("# Quiz\n");
    },
    type: 'survey-multi-choice',
    questions: ["What is the range of node values in the first step?", "What is the range of node values in the last step?", "What is the cost of clicking?", "How much REAL money do you earn?"],
    options: [['$-4 to $4', '$-8 to $8', '$-48 to $48'], ['$-4 to $4', '$-8 to $8', '$-48 to $48'], ['$0', '$1', '$8', '$24'], ['1 cent for every $1 you make in the game', '1 cent for every $5 you make in the game', '5 cents for every $1 you make in the game', '5 cents for every $10 you make in the game']]
  });
  pre_test_intro = new TextBlock({
    text: function() {
      SCORE = 0;
      //prompt: ''
      //psiturk.finishInstructions()
      return markdown("## Node Inspector\n\nIt's hard to make good decision when you can't see what you will get!\nFortunately, you have access to a ***node inspector*** which can reveal\nthe value of a node. To use the node inspector, simply ***click on a node***.\n**Note:** you can only use the node inspector when you're on the first\nnode. \n\n<img class='display' style=\"width:50%; height:auto\" src='static/images/web-of-cash.png'/>\n\nOne more thing: **You must spend *at least* 7 seconds on each round.**\nIf you finish a round early, you'll have to wait until 7 seconds have\npassed.\n\nTo thank you for your work so far, we'll start you off with **$50**.\nGood luck! \n\nPress <code>space</code> to continue.\n  ");
    }
  });
  pre_test = new MouselabBlock({
    minTime: 7,
    show_feedback: false,
    blockName: 'pre_test',
    stateDisplay: 'click',
    stateClickCost: PARAMS.inspectCost,
    timeline: (function() {
      switch (false) {
        case !SHOW_PARTICIPANT:
          return DEMO_TRIALS;
        case !DEBUG:
          return TRIALS.slice(6, 7);
        default:
          return getTrials(1);
      }
    })(),
    startScore: 50
  });
  training = new MouselabBlock({
    minTime: 7,
    show_feedback: with_feedback,
    blockName: 'training',
    stateDisplay: 'click',
    stateClickCost: PARAMS.inspectCost,
    timeline: (function() {
      switch (false) {
        case !SHOW_PARTICIPANT:
          return DEMO_TRIALS;
        case !DEBUG:
          return TRIALS.slice(6, 8);
        default:
          return getTrials(6);
      }
    })(),
    startScore: 50
  });
  post_test = new MouselabBlock({
    minTime: 7,
    show_feedback: false,
    blockName: 'test',
    stateDisplay: 'click',
    stateClickCost: PARAMS.inspectCost,
    timeline: (function() {
      switch (false) {
        case !SHOW_PARTICIPANT:
          return DEMO_TRIALS;
        case !DEBUG:
          return TRIALS.slice(6, 8);
        default:
          return getTrials(10);
      }
    })(),
    startScore: 50
  });
  verbal_responses = new Block({
    type: 'survey-text',
    preamble: function() {
      return markdown("# Please answer these questions\n");
    },
    questions: ['How did you decide where to click?', 'How did you decide where NOT to click?', 'How did you decide when to stop clicking?', 'Where were you most likely to click at the beginning of each round?', 'Can you describe anything else about your strategy?'],
    button: 'Finish'
  });
  // TODO: ask about the cost of clicking
  finish = new Block({
    type: 'survey-text',
    preamble: function() {
      return markdown(`# You've completed the HIT\n\nThanks for participating. We hope you had fun! Based on your\nperformance, you will be awarded a bonus of\n**$${calculateBonus().toFixed(2)}**.\n\nPlease briefly answer the questions below before you submit the HIT.`);
    },
    questions: ['What did you learn?', 'Was anything confusing or hard to understand?', 'What is your age?', 'Additional coments?'],
    button: 'Submit HIT'
  });
  talk_demo = new Block({
    timeline: [
      // new MouselabBlock
      //   lowerMessage: 'Move with the arrow keys.'
      //   stateDisplay: 'always'
      //   prompt: null
      //   stateClickCost: PARAMS.inspectCost
      //   timeline: getTrials 3

      // divider
      new MouselabBlock({
        stateDisplay: 'click',
        prompt: null,
        stateClickCost: PARAMS.inspectCost,
        timeline: TRIALS.slice(10,
      14)
      })
    ]
  });
  experiment_timeline = (function() {
    switch (false) {
      case !SHOW_PARTICIPANT:
        return [test];
      case !DEBUG:
        return [
          train_basic1,
          //train_inspector
          //train_inspect_cost
          //instructions1    
          pre_test_intro,
          pre_test,
          divider_pretest_training,
          training,
          divider_training_test,
          test_block_intro,
          post_test,
          quiz,
          verbal_responses,
          finish
        ];
      case !TALK:
        return [talk_demo];
      default:
        return [
          train_basic1,
          //train_inspector
          //train_inspect_cost
          //instructions1    
          pre_test_intro,
          pre_test,
          divider_pretest_training,
          training,
          divider_training_test,
          test_block_intro,
          post_test,
          quiz,
          verbal_responses,
          finish
        ];
    }
  })();
  // ================================================ #
  // ========= START AND END THE EXPERIMENT ========= #
  // ================================================ #

  // bonus is the total score multiplied by something
  calculateBonus = function() {
    var bonus;
    bonus = SCORE * PARAMS.bonusRate;
    bonus = (Math.round(bonus * 100)) / 100; // round to nearest cent
    return Math.max(0, bonus);
  };
  reprompt = null;
  save_data = function() {
    return psiturk.saveData({
      success: function() {
        console.log('Data saved to psiturk server.');
        if (reprompt != null) {
          window.clearInterval(reprompt);
        }
        return psiturk.computeBonus('compute_bonus', psiturk.completeHIT);
      },
      error: function() {
        return prompt_resubmit;
      }
    });
  };
  prompt_resubmit = function() {
    $('#jspsych-target').html("<h1>Oops!</h1>\n<p>\nSomething went wrong submitting your HIT.\nThis might happen if you lose your internet connection.\nPress the button to resubmit.\n</p>\n<button id=\"resubmit\">Resubmit</button>");
    return $('#resubmit').click(function() {
      $('#jspsych-target').html('Trying to resubmit...');
      reprompt = window.setTimeout(prompt_resubmit, 10000);
      return save_data();
    });
  };
  return jsPsych.init({
    display_element: $('#jspsych-target'),
    timeline: experiment_timeline,
    // show_progress_bar: true
    on_finish: function() {
      if (DEBUG) {
        return jsPsych.data.displayData();
      } else {
        psiturk.recordUnstructuredData('final_bonus', calculateBonus());
        return save_data();
      }
    },
    on_data_update: function(data) {
      console.log('data', data);
      return psiturk.recordTrialData(data);
    }
  });
};
