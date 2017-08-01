$("document").ready(function() {
  const MAX_STEPS = 20;
  var currentRound;
  var sequence;
  var interval;
  var userPos;
  var strictMode = false;

  //initiate game
  function startGame() {
    $(".but").animate({ backgroundPositionX: 0 }, 0);
    sequence = generateSequence();
    currentRound = 1;
    play();
  }

  //generate full sequence
  function generateSequence() {
    var seq = [];
    for (var i = 0; i < MAX_STEPS; i++) {
      //randomly choose the next colour in the sequence
      switch (Math.floor(Math.random() * (4 - 1 + 1)) + 1) {
        case 1:
          seq.push("red");
          break;
        case 2:
          seq.push("yellow");
          break;
        case 3:
          seq.push("blue");
          break;
        case 4:
          seq.push("green");
          break;
      }
    }
    console.log("generated sequence: " + seq);
    return seq;
  }

  function play() {
    //set interval period depending on round
    if (currentRound < 5) {
      interval = 1250;
    } else if (currentRound < 9) {
      interval = 1000;
    } else if (currentRound < 13) {
      interval = 750;
    } else {
      interval = 500;
    }

    //reset number of user clicks this round
    userPos = 0;

    //win condition if limit reached
    if (currentRound > MAX_STEPS) {
      $(".but").animate({ backgroundPositionX: 301 }, 0);
      $("#popmess").append(
        "You win!<br><br><img src='https://raw.githubusercontent.com/J-Sanderson/FCC-Simon-Clone/master/win.png'>"
      );
      $("#popup").show();
      return;
    }

    //display current round
    $("#counts").empty().append(currentRound);

    //display sequence
    for (var i = 0; i < currentRound; i++) {
      lightSwitch(sequence[i], "computer", i);
    }

    //test delay - then make divs clickable
    setTimeout(function() {
      $(".but").addClass("active");
    }, (currentRound * 2 - 1) * interval); //length of display
  } //end of play function

  //user input
  $(".but").click(function() {
    //only act if the button is active!
    if ($(this).hasClass("active")) {
      //remove active class to prevent re-clicks
      $(".but").removeClass("active");
      var clicked = event.target.id;
      //light up the clicked button
      lightSwitch(clicked, "user", 0);
      //is the user's click correct?
      if (clicked == sequence[userPos]) {
        //allow time for user's click to display
        setTimeout(function() {
          //show right message somewhere
          //iterate user position
          userPos++;
          //is the round done?
          if (userPos >= currentRound) {
            //delay so the new round is distinguishable from user click
            setTimeout(function() {
              currentRound++;
              play();
            }, interval);
          } else {
            //add active class again for next click
            $(".but").addClass("active");
          }
        }, interval);
      } else {
        //incorrect click
        //allow time for user's click to display
        setTimeout(function() {
          if (strictMode) {
            //fail message
            $("#popmess").append(
              "You lose!<br><br><img src='https://raw.githubusercontent.com/J-Sanderson/FCC-Simon-Clone/master/lose.png'>"
            );
            $("#popup").show();
            $("#counts").empty().append(0);
            //end game
            return;
          }
          //show 'wrong' message somewhere
          //return to play() on same round
          play();
        }, interval);
      }
    }
  }); //end of user input function

  $("#startagain").click(function() {
    $("#popup").hide();
    $("#popmess").empty();
    startGame();
  });

  //light switching on/off
  function lightSwitch(light, who, pos) {
    //'computer' or 'user' - intervals are different
    var firstDelay = who === "computer" ? pos * 2 * interval : 0;
    var secondDelay = who === "computer" ? (pos * 2 + 1) * interval : interval;
    //switch on
    setTimeout(function() {
      $("#" + light).animate({ backgroundPositionX: 301 }, 0);
    }, firstDelay);
    //switch off
    setTimeout(function() {
      $("#" + light).animate({ backgroundPositionX: 0 }, 0);
    }, secondDelay);
  } //end of light switch function

  //start button
  $("#start").click(function() {
    startGame();
  });

  //reset button
  $("#reset").click(function() { //maybe needs a delay?
    startGame();
  });

  //toggle strict mode
  $("#stricton").change(function() {
    if ($(this).is(":checked")) {
      strictMode = true;
    } else {
      strictMode = false;
    }
  });

  //display about box
  $("#aboutbut").click(function() {
    $("#about").show();
  });

  //hide about box
  $("#aboutclose").click(function() {
    $("#about").hide();
  });
});