// Generated by CoffeeScript 2.0.2
// coffeelint: disable=max_line_length, indentation
var BLOCKS, CONDITION, DEBUG, DEMO, N_TRIAL, PARAMS, SCORE, STRUCTURE, TALK, TRIALS, calculateBonus, createStartButton, getTrials, initializeExperiment, psiturk, saveData;

DEBUG = false;

TALK = false;

if (DEBUG) {
  console.log("X X X X X X X X X X X X X X X X X\n X X X X X DEBUG  MODE X X X X X\nX X X X X X X X X X X X X X X X X");
  CONDITION = 0;
} else {
  console.log("# =============================== #\n# ========= NORMAL MODE ========= #\n# =============================== #");
  console.log('16/01/18 12:38:03 PM');
  CONDITION = parseInt(condition);
}

if (mode === "{{ mode }}") {
  DEMO = true;
  CONDITION = 0;
}

BLOCKS = void 0;

PARAMS = void 0;

TRIALS = void 0;

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
    console.log('Loading data');
    PARAMS = {
      inspectCost: 1,
      startTime: Date(Date.now()),
      bonusRate: .01,
      // variance: ['constant_high', 'constant_low', 'increasing', 'decreasing'][CONDITION]
      branching: '312'
    };
    psiturk.recordUnstructuredData('params', PARAMS);
    STRUCTURE = loadJson(`static/json/structure/${PARAMS.branching}.json`);
    TRIALS = loadJson(`static/json/rewards/${PARAMS.branching}.json`);
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
  $('#load-icon').hide();
  $('#slow-load').hide();
  $('#success-load').show();
  return $('#load-btn').click(initializeExperiment);
};

initializeExperiment = function() {
  var Block, ButtonBlock, MouselabBlock, QuizLoop, TextBlock, bonus_text, divider, experiment_timeline, finish, fullMessage, img, pre_test, prompt_resubmit, quiz, reprompt, reset_score, save_data, talk_demo, test, text, train, train_basic, train_final, train_hidden, train_inspect_cost, train_inspector, verbal_responses;
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

  })();
  ButtonBlock = (function() {
    class ButtonBlock extends Block {};

    ButtonBlock.prototype.type = 'button-response';

    ButtonBlock.prototype.is_html = true;

    ButtonBlock.prototype.choices = ['Continue'];

    ButtonBlock.prototype.button_html = '<button class="btn btn-primary btn-lg">%choice%</button>';

    return ButtonBlock;

  })();
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
    MouselabBlock.prototype.lowerMessage = "Click on the nodes to reveal their values.<br>\nMove with the arrow keys.";

    return MouselabBlock;

  })();
  //  ============================== #
  //  ========= EXPERIMENT ========= #
  //  ============================== #
  img = function(name) {
    return `<img class='display' src='static/images/${name}.png'/>`;
  };
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
      return "<div class='center'>Press <code>space</code> to continue.</div>";
    }
  });
  train_basic = new MouselabBlock({
    blockName: 'train_basic',
    stateDisplay: 'always',
    prompt: function() {
      return markdown("## Web of Cash\n\nIn this HIT, you will play a game called *Web of Cash*. You will guide a\nmoney-loving spider through a spider web. When you land on a gray circle\n(a ***node***) the value of the node is added to your score. A node can\nhave value -10, -5, 5, or 10. All values are equally likely.\n\nYou can move the spider with the arrow keys, but only in the direction\nof the arrows between the nodes. Go ahead, try a few rounds now!");
    },
    lowerMessage: 'Move with the arrow keys.',
    timeline: getTrials(10)
  });
  train_hidden = new MouselabBlock({
    blockName: 'train_hidden',
    stateDisplay: 'never',
    prompt: function() {
      return markdown("## Hidden Information\n\nNice job! When you can see the values of each node, it's not too hard to\ntake the best possible path. Unfortunately, you can't always see the\nvalue of the nodes. Without this information, it's hard to make good\ndecisions. Try completing a few more rounds.");
    },
    lowerMessage: 'Move with the arrow keys.',
    timeline: getTrials(5)
  });
  train_inspector = new MouselabBlock({
    blockName: 'train_inspector',
    // special: 'trainClick'
    stateDisplay: 'click',
    stateClickCost: 0,
    prompt: function() {
      return markdown("## Node Inspector\n\nIt's hard to make good decision when you can't see what you're doing!\nFortunately, you have access to a ***node inspector*** which can reveal\nthe value of a node. To use the node inspector, simply click on a node.\n**Note:** you can only use the node inspector when you're on the first\nnode.\n\nTrying using the node inspector on a few nodes before making your first\nmove.");
    },
    // but the node inspector takes some time to work and you can only inspect one node at a time.
    timeline: getTrials(5)
  });
  // lowerMessage: "<b>Click on the nodes to reveal their values.<b>"
  train_inspect_cost = new MouselabBlock({
    blockName: 'train_inspect_cost',
    stateDisplay: 'click',
    stateClickCost: PARAMS.inspectCost,
    prompt: function() {
      return markdown(`## The price of information\n\nYou can use node inspector to gain information and make better\ndecisions. But, as always, there's a catch. Using the node inspector\ncosts $${PARAMS.inspectCost} per node. To maximize your score, you have\nto know when it's best to gather more information, and when it's time to\nact!`);
    },
    timeline: getTrials(5)
  });
  bonus_text = function(long) {
    var s;
    // if PARAMS.bonusRate isnt .01
    //   throw new Error('Incorrect bonus rate')
    s = "**you will earn 1 cent for every $1 you make in the game.**";
    if (long) {
      s += " For example, if your final score is $150, you will receive a bonus of $1.50.";
    }
    return s;
  };
  train_final = new MouselabBlock({
    blockName: 'train_final',
    stateDisplay: 'click',
    stateClickCost: PARAMS.inspectCost,
    prompt: function() {
      return markdown(`## Earn a Big Bonus\n\nNice! You've learned how to play *Web of Cash*, and you're almost ready\nto play it for real. To make things more interesting, you will earn real\nmoney based on how well you play the game. Specifically,\n${bonus_text('long')}\n\nThese are the **final practice rounds** before your score starts counting\ntowards your bonus.`);
    },
    lowerMessage: fullMessage,
    timeline: getTrials(5)
  });
  train = new Block({
    training: true,
    timeline: [train_basic, divider, train_hidden, divider, train_inspector, divider, train_inspect_cost, divider, train_final]
  });
  quiz = new Block({
    preamble: function() {
      return markdown("# Quiz\n");
    },
    type: 'survey-multi-choice',
    questions: ["What was the range of node values?", "What is the cost of clicking?", "How much REAL money do you earn?"],
    options: [['$0 to $15', '-$10 to $10', '-$12 to 12', '-$30 to $30'], ['$0', '$1', '$2', '$3'], ['1 cent for every $1 you make in the game', '1 cent for every $10 you make in the game', '1 dollar for every $1 you make in the game', '1 dollar for every $10 you make in the game']]
  });
  pre_test = new ButtonBlock({
    stimulus: function() {
      SCORE = 0;
      ({
        prompt: ''
      });
      psiturk.finishInstructions();
      return markdown(`# Training Completed\n\nWell done! You've completed the training phase and you're ready to\nplay *Web of Cash* for real. You will have **${test.timeline.length}\nrounds** to make as much money as you can. Remember, ${bonus_text()}\n\nOne more thing: **You must spend *at least* 7 seconds on each round.**\nIf you finish a round early, you'll have to wait until 7 seconds have\npassed.\n\nTo thank you for your work so far, we'll start you off with **$50**.\nGood luck!`);
    }
  });
  test = new MouselabBlock({
    minTime: 7,
    blockName: 'test',
    stateDisplay: 'click',
    stateClickCost: PARAMS.inspectCost,
    timeline: getTrials((DEBUG ? 3 : 30)),
    startScore: 50
  });
  verbal_responses = new Block({
    type: 'survey-text',
    preamble: function() {
      return markdown("# Please answer these questions\n");
    },
    questions: ['How did you decide where to click??', 'How did you decide where NOT to click?', 'How did you decide when to stop clicking?', 'Where were you most likely to click at the beginning of each round?', 'Can you describe anything else about your strategy?'],
    button: 'Finish'
  });
  // TODO: ask about the cost of clicking
  finish = new Block({
    type: 'survey-text',
    preamble: function() {
      return markdown(`# You've completed the HIT\n\nThanks for participating. We hope you had fun! Based on your\nperformance, you will be awarded a bonus of\n**$${calculateBonus().toFixed(2)}**.\n\nPlease briefly answer the questions below before you submit the HIT.`);
    },
    questions: ['Was anything confusing or hard to understand?', 'What is your age?', 'Additional coments?'],
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
  if (DEBUG) {
    experiment_timeline = [
      train,
      // quiz
      pre_test,
      test,
      verbal_responses,
      finish
    ];
  } else if (TALK) {
    experiment_timeline = [talk_demo];
  } else {
    experiment_timeline = [train, quiz, pre_test, test, verbal_responses, finish];
  }
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
