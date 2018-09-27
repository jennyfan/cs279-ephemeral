//Variables that can be changed
var taskTrialNum = 50;
var practiceTrialNum = 8;
var fadeInTime = 1000;
//--------------------------------------------------------------------------------------------------------------
var usedGroups = [];
var randomNum = function(range){//To generate a Random number without repetition to assure that the items in menus are not repeating.
    var x = Math.floor(Math.random()* range);
    var i = 0 ;
    while ( i< usedGroups.length){
        i++;
        if (x == usedGroups[i]){
            x = Math.floor(Math.random()* range);
            i = 0;
        }
    }
    usedGroups.push(x);
    return x;
};
var progress= 0;
var menuErrorCtr = 0;//to count the number of times wrong menu was opened
var itemErrorCtr = 0;//to count the number of times a wrong item was selected
var wordGroups;//A set of 72x4 wordgroups
var currentWordGroup =[];//List of words in the menus: each 16 belong to a menu, each 4 belong to a group.
var menuGeneratorCounter = -1;//A counter to assure that each set of 4 words belong to the same semantic group.
var selectionSequence = [];//To store the selected items.
var itemsSequence = [];//To restore items sequence
var indicator = 0;//to keep track of sequence
var selectionMenu ;//To store the current menu that should be chosen.
var startTime;//To store the starting time.
var timeToAccomplish = 0; //Variable to store the time taken to select the right item.
var group = randomNum(72);//A group to start the generation with.
var hit = 6;//Variable to count how many time the adaptation hits for 79% of practiceTrialNum and taskTrialNum
var miss = 2;//Variable to count how many time the adaptation misses for 21% of practiceTrialNum and taskTrialNum
var accuratePrediction = false; // NEW VARIABLE = 1 (true) if 79% algo predicts accurately, 0 (false) if not
var testCondition = 'A'; // A if Traditional First, B if Ephemeral first
var adaptiveWords = [];
var trialNum = 1;//Variable to count trials
var level = 1;//To store current level
//--------------------------------------------------------------------------------------------------------------
$(document).ready(function () {
    generateModal(level,"You will have 3 menus and a prompt asking you to choose an item from one of these menus.\nThis is the first task. In this task, you are given a traditional menu and asked to click an item each trial. \nThis is a practice session. You will finish " + practiceTrialNum + " trials.");
    $("#infoModal").modal("show");
    $('#myprogressbar').attr('aria-valuenow', progress).css('width', progress + "%");
    wordGroups = getWordGroups(data);
    generateMenus();
    generatePrompt();
    $("#menu1").on("click", function (event) {
        if (event.target === this) {
            menuClickListener(1);
        }
    });
    $("#menu2").on("click", function (event) {
        if (event.target === this) {
            menuClickListener(2);
        }
    });
    $("#menu3").on("click", function (event) {
        if (event.target === this) {
            menuClickListener(3);
        }
    });
});
//--------------------------------------------------------------------------------------------------------------
//Functions
var adaptation = function (menuNum) {//Algorithm that returns a set word that 79% matches the prompt
    var result = [];
    var nextWord = selectionSequence[selectionSequence.length - 1];
    var wordWeight = 1;
    var wordCount = 1;
    var recentFlag = false;
    var adaptedOption;
    var accuratePrediction;

    if (selectionSequence.lastIndexOf(nextWord) != selectionSequence.indexOf(nextWord)) {//Repeated words
        for (var i = 0; i < selectionSequence.length - 2; i++) {
            if (selectionSequence[i] == nextWord) {
                wordCount++;
                if (i >= selectionSequence.length - 12) {
                    recentFlag = true;
                }
            }
        }
        if (wordCount > 1) {
            wordWeight++;
        }
        if (recentFlag) {
            wordWeight++;
        }
    }
    //My algorithm to randomly draw 79% hits
    if (wordWeight > 1) {
        if (hit > 0) {
            adaptedOption = 1;
        }
        else if (miss > 0) {
            adaptedOption = 0;
        }
        else {
            adaptedOption = -1;
        }
    }
    else {
        adaptedOption = Math.floor(Math.random() * 2);
        if (adaptedOption == 1 && hit > 0)
            hit--;
        else if (adaptedOption == 1 && hit <= 0) {
            if (miss <= 0)
                adaptedOption = -1
            else {
                adaptedOption = 0;
                miss--;
            }
        }
        if (adaptedOption == 0 && miss > 0)
            miss--;
        else if (adaptedOption == 0 && miss <= 0) {
            if (hit <= 0)
                adaptedOption = -1;
            else {
                adaptedOption = 1;
                hit--;
            }
        }
    }
    switch (adaptedOption) {
        case 1:
            result.push(nextWord);
            accuratePrediction = true;
            break;
        case 0:
            do {
                var wordID = Math.floor(Math.random() * 16);
                wordID = wordID + ((menuNum-1)*16);
                var word = currentWordGroup[wordID];
            } while (word == nextWord);
            result.push(word);
            accuratePrediction = false;
            break;
        case -1:
            result.push("Error");
            break
    }
    var word;
    do {
        var wordID = Math.floor(Math.random() * 16);
        wordID = wordID + ((menuNum-1)*16);
        word = currentWordGroup[wordID];
        if (result.indexOf(word) == -1 && result.length <= 2 && word != nextWord){
            result.push(word);
        }
    } while ((result.indexOf(word)>-1 && result.length<= 2) || (word == nextWord&& result.length<= 2));
    return result;
};
var fadeItems = function (menuNum) {//Function to fade items
    var holder;
    var arr = [];
    for (var i = 1; i < 17; i++) {
        holder = document.getElementById("item" + menuNum + i);
        var fadeTime = String(fadeInTime) + "ms";
        for (var j = 0; j < adaptiveWords.length; j++) {
            if (holder.innerText === adaptiveWords[j]) {
                arr.push("item"+ menuNum + i);
            }
            else{
                holder.style.animation = "fadein " + fadeTime;
            }
        }
    }
    for (var k = 0; k < arr.length; k++){
        holder = document.getElementById(arr[k]);
        holder.style.animation = "fadein 0ms";
    }
};
var startTrial = function () {//Start each trial
    var title = document.getElementById("title");
    var text;
    switch (level){
        case (1):
            text = "Traditional (Practice " + trialNum + " of " + practiceTrialNum + ")";
            break
        case (2):
            text = "Traditional (" + trialNum +  " of " + taskTrialNum + ")";
            break
        case (3):
            text = "Ephemeral (Practice " + trialNum +  " of " + practiceTrialNum + ")";
            break
        case (4):
            text = "Ephemeral (" + trialNum +  " of " + taskTrialNum + ")";
            break;
    }
    if(level == 5){
        window.location.href='questionnaire.html';
    }
    else {
        title.innerText = text;
        title.setAttribute("class", "display-4 text-center ")
    }
};
var increaseProgress = function () {//Function to increase the progress bar
    progress = progress + (100/(2*taskTrialNum + 2*practiceTrialNum));
    $('#myprogressbar').attr('aria-valuenow', progress).css('width', progress + "%");
};
var destroyItems = function(){//function to destroy items in menus to recreate them
    var item;
    for (var i = 1; i<4; i++ ){
        for (var j = 1; j<17; j++){
            if(item = document.getElementById("item"+i+j)) {
                item.remove();
            }
        }
    }
};
