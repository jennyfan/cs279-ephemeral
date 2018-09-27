var itemClickListener = function () {//To control what happens when the user clicks an item in a menu
    if (selectionSequence[selectionSequence.length - 1] != this.innerText) {
        itemErrorCtr++;
    }
    else {
        var endTime = new Date().getTime();
        timeToAccomplish = endTime - startTime;
        $(this).trigger('log', ['timeEvent', {time: timeToAccomplish , wrongMenus: menuErrorCtr, wrongItems: itemErrorCtr, prediction: accuratePrediction, condition: testCondition }]);
        if ((level % 2 == 1 && trialNum >=  practiceTrialNum ) || (level % 2 == 0 && trialNum >= taskTrialNum)) {
            if (level >= 4) {
                level++;
                generateModal(9, "Experiment finished! Thank you! Now you are asked to fill a questionnaire, please press start to proceed to the questionnaire");
                $("#infoModal").modal("show");//Questionnaire
            }
            else {
                /*if (level%2 == 1){//To clear the sequence from trial words
                    for (var i = 0; i < practiceTrialNum; i++){
                        selectionSequence.pop();
                    }
                }*/
                var text;
                trialNum = 1;
                level++;
                while (currentWordGroup.length > 0){
                    currentWordGroup.pop();
                }
                while (usedGroups.length > 0){
                    usedGroups.pop();
                }
                switch (level) {
                    case (2):
                        hit = 40;
                        miss = 10;
                        text = "This is the first task. You will finish " + taskTrialNum + " trials similar to the practice trials.";
                        break
                    case (3):
                        hit = 6;
                        miss = 2;
                        text = "This is the second task. In this task, some of the menu items will appear sooner than other items. The items that appear sooner the system predicts that these are the items that you will most likely need. You will be asked to click an item. \nThis is a practice session. You will finish "+practiceTrialNum+" trials.";
                        break
                    case (4):
                        hit = 40;
                        miss = 10;
                        text = "This is the first task. You will finish" + taskTrialNum + " trials similar to the practice trials.";
                        break
                }
                increaseProgress();
                generateModal(level, text);
                $("#infoModal").modal("show");
                generateMenus();
                generatePrompt();
            }
        }
        else {
            trialNum++;
            startTrial();
            while (currentWordGroup.length > 0){
                currentWordGroup.pop();
            }
            while (usedGroups.length > 0){
                usedGroups.pop();
            }
            generateMenus();
            generatePrompt();
            increaseProgress();
        }
        destroyItems();
    }
};
var menuClickListener = function(menuNum){//Click listener for the menus counts errors and saves timestamp for duration
    if (selectionMenu != menuNum){
      // increments wrong menu counter
        menuErrorCtr++;
    }
    else
    {
      console.log("level", level);
        startTime = new Date().getTime();
        if (level == 1 || level == 2){
          // EPHEMERAL CONDITION
            fadeItems(menuNum);
        }
    }
};
