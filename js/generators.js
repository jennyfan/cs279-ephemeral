var generateMenus = function () {//To generate the menu in the dropdown list
    var item = null;
    for(var i=1; i<=3; i++) {
        var numctr = 1;
        var menu = document.getElementById("mymenu" + i);
        var ddlist = document.createElement("ul");
        ddlist.setAttribute("class", "dropdown-menu text-center w-100");
        ddlist.setAttribute("id","list"+ i);
        for (var j = 1; j < 20; j++) {
            if (j % 5 != 0) {
                var word = menuWordGenerator();
                item = document.createElement("li");
                item.setAttribute("class", "dropdown-item");
                item.setAttribute("id", "item" + i + numctr);
                item.innerText = word;
                item.addEventListener("click",itemClickListener );
            }
            else {
                item = document.createElement("div");
                item.setAttribute("class", "dropdown-divider");
                numctr--;
            }
            ddlist.appendChild(item);
            item = null;
            numctr++;
        }
        menu.appendChild(ddlist);
        ddlist = null;
    }
};
var generatePrompt = function(){//To generate a Random selection prompt
    var promptHolder = document.getElementById("instruction");
    var text;
    if (level == 1 || level == 2) {
        var wordID = Math.floor(Math.random() * 48);
        var word = currentWordGroup[wordID];
        selectionSequence.push(word);
        selectionMenu = Math.floor(wordID / 16) + 1;
        text = "Please select: <strong>" + word + "</strong> from <strong>Menu " + selectionMenu + "<\strong>";
        itemsSequence.push(wordID);
    }
    else {
        var menuID, wordID;
        var myMenus = [1, 2, 3];
        var myID = itemsSequence[indicator];
        menuID = Math.floor(myID / 16) + 1;
        var index = myMenus.indexOf(menuID);
        var rndID = Math.floor(Math.random()*2);
        if (myID < 16) {
            wordID = myID ;
        }
        else if (myID > 31) {
            wordID = myID - 32;
        }
        else {
            wordID = myID - 16;
        }
        if (index > -1) {
            myMenus.splice(index, 1);
        }
        var thisMenu = myMenus[rndID];
        var thisWordID = ((thisMenu-1)*16) + wordID;
        var thisWord = currentWordGroup[thisWordID];
        selectionSequence.push(thisWord);
        selectionMenu = thisMenu;
        text = "Please select: <strong>" + thisWord + "</strong> from <strong>Menu " + thisMenu + "<\strong>";
        indicator++;
    }
    adaptiveWords = adaptation(selectionMenu);
    promptHolder.innerHTML = text;
    promptHolder.setAttribute("class" , promptHolder.getAttribute("class") + " pt-3 pb-3");
    $("#instruction").fadeIn(0);
};
var menuWordGenerator = function () {//To generate the right item for control menu
    if(menuGeneratorCounter >= 3) {
        group = randomNum(72);
        menuGeneratorCounter = 0;
    }
    else {
        menuGeneratorCounter++;
    }
    currentWordGroup.push(wordGroups[group][menuGeneratorCounter]);
    return wordGroups[group][menuGeneratorCounter];
};
var generateModal = function (taskNum, text) {//Function to create a modal
    var body = document.getElementById("infoModal");
    var checker;
    if (checker = document.getElementById("myModal")){
        checker.parentNode.removeChild(checker);
    }

    var modaldialog = document.createElement("div");
    modaldialog.setAttribute("class", "modal-dialog-centered");
    modaldialog.setAttribute("role", "document");
    modaldialog.setAttribute("id","myModal");

    var modalcontent = document.createElement("div");
    modalcontent.setAttribute("class", "modal-content");

    var modalbody = document.createElement("div");
    modalbody.setAttribute("class", "modal-body lead");

    var p1 = document.createElement("p");
    p1.setAttribute("id", "informationbody");
    p1.innerText =  text;
    modalbody.appendChild(p1);
    modalcontent.appendChild(modalbody);

    var modalfooter = document.createElement("div");
    modalfooter.setAttribute("class", "modal-footer");

    var cancelbutton = document.createElement("button");
    cancelbutton.setAttribute("type", "button");
    cancelbutton.setAttribute("class", "btn btn-lg btn-dark modal-btns");
    cancelbutton.setAttribute("data-dismiss", "modal");
    cancelbutton.setAttribute("onclick", "window.location.href='index.html'");
    cancelbutton.innerText = "Cancel";
    modalfooter.appendChild(cancelbutton);

    var startbutton = document.createElement("button");
    startbutton.setAttribute("type", "button");
    startbutton.setAttribute("class", "btn btn-lg btn-color modal-btns");
    startbutton.setAttribute("data-dismiss", "modal");
    startbutton.setAttribute("id", "start"+taskNum);
    startbutton.innerText = "Start";
    startbutton.addEventListener("click" , function () {
        startTrial();
    });
    modalfooter.appendChild(startbutton);
    modalcontent.appendChild(modalfooter);
    modaldialog.appendChild(modalcontent);
    body.appendChild(modaldialog);
};
