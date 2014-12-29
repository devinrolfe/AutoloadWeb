//Global variables
var addNewChoiceWindowCount = 1;
var addNewChoiceTabCount = 1;

//Run our extension script as soon as the document's DOM is ready.
document.addEventListener('DOMContentLoaded', function () {
  setupListeners();
});


function setupListeners(){
	document.getElementById("addNewChoiceURLButton1").addEventListener("click", addAnotherURLToNewChoice);
	document.getElementById("addNewChoiceWindowButton").addEventListener("click", addAnotherWindowToNewChoice);
	document.getElementById("saveAddNewChoice").addEventListener("click", saveNewChoice);
}
/**
Add a new tab for the window
**/
function addAnotherURLToNewChoice(){
	addNewChoiceTabCount += 1;

	var eventID = this.getAttribute("id");

	var windowNumber;
	windowNumber = eventID.slice(-1*addNewChoiceWindowCount.toString().length);

	var curWindow = document.getElementById("window" + windowNumber);

	var tempDd = document.createElement("DD");
	curWindow.getElementsByTagName("DL")[0].appendChild(tempDd);
	
	var tempLabel = document.createElement("LABEL");
	tempLabel.setAttribute("for", "addChoiceURL" + addNewChoiceTabCount);
	tempLabel.innerHTML = "URL(Optional): ";

	var tempAdd = document.createElement("INPUT");
	tempAdd.setAttribute("type", "text");
	tempAdd.setAttribute("class", "urlInput");
	tempAdd.setAttribute("name", "addChoiceURL" + addNewChoiceTabCount);
	tempAdd.setAttribute("value", "");
	tempAdd.setAttribute("id", "addChoiceURL" + addNewChoiceTabCount);
	tempAdd.setAttribute("size", "30");

	var tempDelete = document.createElement("INPUT");
	tempDelete.setAttribute("type", "button");
	tempDelete.setAttribute("id", "deleteNewChoiceURLButton" + addNewChoiceTabCount);
	tempDelete.setAttribute("value", "(-) Delete URL");
	tempDelete.addEventListener("click", deleteURLNewChoice);

	tempDd.appendChild(tempLabel);
	tempDd.appendChild(tempAdd);
	tempDd.appendChild(tempDelete);
}

function deleteURLNewChoice(){
	//parentNode
	var tempDD = this.parentNode;
	var tempDL = tempDD.parentNode;
	tempDL.removeChild(tempDD);
}

function addAnotherWindowToNewChoice(){
	addNewChoiceWindowCount += 1;
	addNewChoiceTabCount += 1;
	//add div for new window
	var tempDiv = document.createElement("DIV");
	tempDiv.setAttribute("id", "window" + addNewChoiceWindowCount);
	document.getElementById("addNewChoiceList").insertBefore(tempDiv, document.getElementById("addNewChoiceWindowButton"));
	//add new window header
	var tempHeader = document.createElement("H3");
	tempHeader.innerHTML = "Window " + addNewChoiceWindowCount;
	tempDiv.appendChild(tempHeader);
	//add delete window button
	var tempDelete = document.createElement("INPUT");
	tempDelete.setAttribute("type", "button");
	tempDelete.setAttribute("id", "deleteNewChoiceWindowButton" + addNewChoiceWindowCount);
	tempDelete.setAttribute("value", "(-) Delete Window");
	tempDelete.addEventListener("click", deleteWindowNewChoice);

	tempDiv.appendChild(tempDelete);
	
	var tempDL = document.createElement("DL");
	tempDiv.appendChild(tempDL);

	var tempDD = document.createElement("DD");
	tempDL.appendChild(tempDD);

	var tempLabel = document.createElement("LABEL");
	tempLabel.setAttribute("for", "addChoiceURL" + addNewChoiceTabCount);
	tempLabel.innerHTML = "URL(Required): ";
	tempDD.appendChild(tempLabel);

	var tempInputURL = document.createElement("INPUT");
	tempInputURL.setAttribute("type", "text");
	tempInputURL.setAttribute("class", "urlInput");
	tempInputURL.setAttribute("name", "addChoiceURL" + addNewChoiceTabCount);
	tempInputURL.setAttribute("value", "");
	tempInputURL.setAttribute("id", "addChoiceURL" + addNewChoiceTabCount);
	tempInputURL.setAttribute("size", "30");
	tempDD.appendChild(tempInputURL);
	
	var tempButton = document.createElement("INPUT");
	tempButton.setAttribute("id", "addNewChoiceURLButton" + addNewChoiceWindowCount);
	tempButton.setAttribute("type", "button");
	tempButton.setAttribute("value", "(+) add URL");
	tempButton.addEventListener("click", addAnotherURLToNewChoice);
	tempDD.appendChild(tempButton);
}

function deleteWindowNewChoice(){
	var windowNumber = parseInt(this.id.slice("deleteNewChoiceWindowButton".length));

	var tempDiv = this.parentNode;
	var parent = tempDiv.parentNode;

	parent.removeChild(tempDiv);
	addNewChoiceWindowCount -= 1;

	var tempDivs = parent.getElementsByTagName("DIV");

	for(i=0; i < tempDivs.length; i++){
		
		var idNumber = parseInt(tempDivs[i].id.slice("window".length));

		if (idNumber > windowNumber){
			//need to reduce sizes here
			tempDivs[i].setAttribute("id", "window" + (idNumber - 1 ));
			tempDivs[i].getElementsByTagName("H3")[0].innerHTML = "Window " + (idNumber - 1);
			
			var tempDeleteWindowButton = document.getElementById("deleteNewChoiceWindowButton" + idNumber);
			tempDeleteWindowButton.setAttribute("id", "deleteNewChoiceWindowButton" + (idNumber - 1));

			var tempAddURLButton = document.getElementById("addNewChoiceURLButton" + idNumber);
			tempAddURLButton.setAttribute("id", "addNewChoiceURLButton" + (idNumber - 1));
		}
	}
}

function saveNewChoice(){
	
	var name = document.getElementById("addChoiceName").value;

	//need to check if name is not used yet, if it is return, and insert message already exist
	//remove insert message if name does not exist

	var webChoices = new WebsiteChoice(name);
	var tempWindows = document.getElementById("addNewChoiceList").getElementsByTagName("DIV");
	
	for(i=0; i<tempWindows.length; i++){
		var tempWindow = new WebsiteWindow(i);
		var tempTabs = tempWindows[i].getElementsByClassName("urlInput");

		for(j=0; j<tempTabs.length; j++){
			
			//check first url is not empty, else insert message like above

			if((tempTabs[j].value != '') || (tempTabs[j].value != tempTabs[j].defaultValue)){
				var tempTab = new WebsiteTab(j, tempTabs[j].value);
				tempWindow.tabs.push(tempTab);
			}
		}
		webChoices.windows.push(tempWindow);
	}

	alert(JSON.stringify(webChoices));

	chrome.storage.sync.set({'webChoices': JSON.stringify(webChoices)}, function(){
		message('Settings saved');
	});

}

	/*
	chrome.storage.sync.get(["webChoices"], function(items){
		//  items = [ { "phasersTo": "awesome" } ]
		alert(items.webChoices);
		var temp = JSON.parse(items.webChoices);
		alert(temp);
	});
	*/