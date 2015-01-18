
//Run our extension script as soon as the document's DOM is ready.
document.addEventListener('DOMContentLoaded', function () {
//	chrome.storage.sync.clear(); //use to clear storage
	setupListeners();
	loadExistingChoices();
});


function setupListeners(){
	document.getElementById("addUrlButton1").addEventListener("click", addUrl);
	document.getElementById("addWindowButton1").addEventListener("click", addWindow);
	document.getElementById("saveChoice1").addEventListener("click", saveChoice);
}
//1 000 000 000
function getRandomNumber(){
	return Math.floor(Math.random()*1000000000) + 2;
}
/**
Add a new tab for the window
**/
function addUrl(inputValue){
	var value = "";
	if("string" == (typeof inputValue)){
		value = inputValue;
	}
	
	var tabIDNumber = getRandomNumber()
	
	var curWindow = this.parentNode.parentNode.parentNode;
	curWindow.getElementsByTagName("DL")[0].appendChild(createUrlSection(0, tabIDNumber, value));
}

function createUrlSection(firstUrl, tabIDNumber, value){
	var tempDD = document.createElement("DD");
	
	var tempLabel = document.createElement("LABEL");
	tempLabel.setAttribute("for", "choiceURL" + tabIDNumber);
	tempLabel.innerHTML = "URL(Optional): ";
	tempDD.appendChild(tempLabel);

	var tempAdd = document.createElement("INPUT");
	tempAdd.setAttribute("type", "text");
	tempAdd.setAttribute("class", "urlInput");
	tempAdd.setAttribute("name", "choiceURL");
	tempAdd.setAttribute("value", value);
	tempAdd.setAttribute("id", "choiceURL" + tabIDNumber);
	tempAdd.setAttribute("size", "30");
	tempDD.appendChild(tempAdd);
	
	var tempButton = document.createElement("INPUT");
	tempButton.setAttribute("type", "button");
	if(firstUrl){
		tempButton.setAttribute("id", "addUrlButton" + tabIDNumber);
		tempButton.setAttribute("value", "(+) add URL");
		tempButton.addEventListener("click", addUrl);
		tempDD.appendChild(tempButton);

		var tempErrorDiv = document.createElement("DIV");
		tempErrorDiv.setAttribute("id", "windowURLErrorMsg" + tabIDNumber);
		tempDD.appendChild(tempErrorDiv);
	}else{
		tempButton.setAttribute("id", "deleteUrlButton" + tabIDNumber);
		tempButton.setAttribute("value", "(-) Delete URL");
		tempButton.addEventListener("click", deleteUrl);
		tempDD.appendChild(tempButton);
	}
	return tempDD;
}

function deleteUrl(){
	var tempDD = this.parentNode;
	var tempDL = tempDD.parentNode;
	tempDL.removeChild(tempDD);
}

function addWindow(inputValue){
	var actionCall = 1;
	var firstWindow = 0;
	var choiceID = null;
	if("number" == (typeof inputValue)){
		choiceID = inputValue;
		actionCall = 0;
	}
	
	var windowIDNumber = getRandomNumber();
	var tabIDNumber = getRandomNumber();
	//add div for new window
	var windowDiv = document.createElement("DIV");
	windowDiv.setAttribute("id", "window" + windowIDNumber);
	windowDiv.setAttribute("class", "window");
	
	if(actionCall){
		this.parentNode.insertBefore(windowDiv, this);
	}
	else{
		var choiceListDiv = document.getElementById("choiceList" + choiceID);
		var windowList = choiceListDiv.getElementsByClassName("window");
		
		if(windowList.length < 1){
			firstWindow = 1;
			choiceListDiv.appendChild(windowDiv);
		}
		else{
			var addWindowButton = document.getElementById("addWindowButton" + choiceID);
			choiceListDiv.insertBefore(windowDiv, addWindowButton);
		}
	}
	//add new window header
	var tempHeader = document.createElement("H3");
	tempHeader.innerHTML = "Window";
	windowDiv.appendChild(tempHeader);
	//add delete window button
	if(actionCall || !firstWindow){
		var tempDelete = document.createElement("INPUT");
		tempDelete.setAttribute("type", "button");
		tempDelete.setAttribute("id", "deleteWindowButton" + windowIDNumber);
		tempDelete.setAttribute("value", "(-) Delete Window");
		tempDelete.addEventListener("click", deleteWindow);
		windowDiv.appendChild(tempDelete);
	}
	else{
		var tempAdd = document.createElement("INPUT");
		tempAdd.setAttribute("type", "button");
		tempAdd.setAttribute("id", "addWindowButton" + windowIDNumber);
		tempAdd.setAttribute("value", "(+) Add a new window");
		//NEED TO ADD LISTENER
		tempAdd.addEventListener("click", addWindow);
		
		windowDiv.parentNode.appendChild(tempAdd);
	}
	var tempDL = document.createElement("DL");
	windowDiv.appendChild(tempDL);

	var urlInputList = document.getElementsByClassName("urlInput");
	var tabIDNumber = getRandomNumber();
	
	tempDL.appendChild(createUrlSection(1, tabIDNumber, ""));
	
	return windowDiv;
}

function deleteWindow(){
	var window = this.parentNode;
	var parent = window.parentNode;
	parent.removeChild(window);
}

function saveChoice(){
	
	var parent = this.parentNode;
	var parentID = parseInt(parent.id.slice("choice".length));
	var nameInput = parent.getElementsByClassName("name")[0];
	var name = nameInput.value;

	var savedWebChoicesList = null;
	//need to check if name is not used yet, if it is return, and insert message already exist
	//remove insert message if name does not exist
	chrome.storage.sync.get(["webChoicesList"], function(items){

		var boolReturn = 0;
		if(name == ''){
			boolReturn = 1;
		}
		else if(items == null || items.webChoicesList == null){
			boolReturn = 0;
		}
		else{
			//items.webChoicesList is parsed already when it is saved, so we should turn it back into an object.
			savedWebChoicesList = items.webChoicesList
			//alert("existed: " + savedWebChoicesList);

			for(var i=0; i<savedWebChoicesList.length; i++){
				if(JSON.parse(savedWebChoicesList[i]).name == name){
					//alert("name exists in saved data");
					boolReturn = 1;
				}
			}
		}
		//if name already exists or name is empty, insert error message and return
		if(boolReturn){
			//alert("name already existed or empty, not saving");
			//check if error message already exists
			var tempNameErrorMsg = document.getElementById("nameErotherrorMsg" + parentID);

			if(tempNameErrorMsg == null){
				var errorNameMsg = document.createElement("LABEL");
				errorNameMsg.setAttribute("for", nameInput.id);
				errorNameMsg.setAttribute("id", "nameErrorMsg" + parentID);
				if(name == ''){
					errorNameMsg.innerHTML = "Name cannot be empty.";
				}
				else{
					errorNameMsg.innerHTML = "Name already exist, choose another.";
				}
				var validNameDiv = document.getElementById("choiceNameValid" + parentID);
				validNameDiv.appendChild(errorNameMsg);
			}
			else{//just change the error message if required.
				if(name == ''){
					tempNameErrorMsg.innerHTML = "Name cannot be empty.";
				}
				else{
					tempNameErrorMsg.innerHTML = "Name already exist, choose another.";
				}
			}
			return;
		}
		else{
			//alert("We good no choice already exist.");
			var errorNameMsg = document.getElementById("nameErrorMsg" + parentID);
			if(errorNameMsg != null){
				var errorNameMsgParent = errorNameMsg.parentNode;
				errorNameMsgParent.removeChild(errorNameMsg);
			}
		}

		var webChoices = new WebsiteChoice(name);
		var tempWindows = parent.getElementsByClassName("window");
		
		var urlReturn  = 0;
		for(i=0; i<tempWindows.length; i++){
			var tempWindow = new WebsiteWindow(i);
			var tempTabs = tempWindows[i].getElementsByClassName("urlInput");
			
			//check if first URL tab is not empty, if so error message
			if((tempTabs[0].value == '') || (tempTabs[0].value == tempTabs[0].defaultValue)){
				//alert("url error message");
				if(tempWindows[i].getElementsByClassName("urlErrorMessage").length == 0){
					var errorUrlMsg = document.createElement("Label");
					errorUrlMsg.setAttribute("for", tempTabs[0].id);
					errorUrlMsg.setAttribute("class", "urlErrorMessage");
					errorUrlMsg.innerHTML = "Please insert an URL.";
				
					var windowNumber = parseInt(tempWindows[i].id.slice("window".length));
					var errorMsgDiv = document.getElementById("windowURLErrorMsg" + windowNumber);
					errorMsgDiv.appendChild(errorUrlMsg);				
				}
				urlReturn = 1;
			}
			else{
				if(tempWindows[i].getElementsByClassName("urlErrorMessage").length != 0){
					var windowNumber = parseInt(tempWindows[i].id.slice("window".length));
					var errorMsgDiv = document.getElementById("windowURLErrorMsg" + windowNumber);
					
					errorMsgDiv.removeChild(errorMsgDiv.firstChild);
				}
			}
			
			for(var j=0; j<tempTabs.length; j++){
				//check first url is not empty
				if((tempTabs[j].value != '') || (tempTabs[j].value != tempTabs[j].defaultValue)){
					var tempTab = new WebsiteTab(tempTabs[j].value);
					tempWindow.tabs.push(tempTab);
					
				}
			}
			webChoices.windows.push(tempWindow);
		}
		if(urlReturn){
			return;
		}	

		if(savedWebChoicesList == null){
			savedWebChoicesList = [];
		}
		savedWebChoicesList.push(JSON.stringify(webChoices))
		//alert("Save: " + JSON.stringify(savedWebChoicesList));

		//saving new choice
		chrome.storage.sync.set({'webChoicesList': savedWebChoicesList}, function(){
			//message('Settings saved');
		});
		

		//need to clear all the input to empty
		if(parentID == 1){
			cleanAddNewChoice(parent, 1);
		}
		//Below will put a save message for the save and then have the save message disappear after 5 seconds
		var saveChoiceStateDiv = document.getElementById("choiceStateMsg" + parentID);
		var saveChoiceStateMsg = document.createElement("Label");
		saveChoiceStateMsg.setAttribute("for", this.id);
		saveChoiceStateMsg.setAttribute("class", "choiceStateMsg");
		saveChoiceStateMsg.innerHTML = "Save was successful!";
		saveChoiceStateDiv.appendChild(saveChoiceStateMsg);
		
		setTimeout(function(){
			var saveChoiceStateDiv = document.getElementById("choiceStateMsg" + parentID);
			var saveChoiceStateMsg = document.getElementsByClassName("choiceStateMsg")[0];
			saveChoiceStateDiv.removeChild(saveChoiceStateMsg);
		}, 5000, parentID);
		
		//1. NEED TO ADD A LISTENER TO THIS TO UPDATE MODIFY INFO
		
	});	
}

function cleanAddNewChoice(choice , choiceID){
	//clear name
	var name = document.getElementById("choiceName" + choiceID).value = '';
	//clear windows
	var tempWindows = choice.getElementsByClassName("window");

	var windowParent = tempWindows[0].parentNode;
	var tabParent;
	for(var i=0; i<tempWindows.length; i++){
		if(i == 0){//keep first window, just clean it up
			var tempTabs = tempWindows[i].getElementsByTagName("DD");
			tabParent = tempTabs[0].parentNode;
			for(var j=0; j<tempTabs.length; j++){
				if(j == 0){//keep first tab, just clean it up
					tempTabs[j].getElementsByClassName("urlInput")[0].value = '';
				}
				else{
					tabParent.removeChild(tempTabs[j]);
					j--;
				}
			}
		}
		else{
			windowParent.removeChild(tempWindows[i]);
			i--;
		}
	}
}

function loadExistingChoices(){
	var savedWebChoicesString = null;
	//var savedWebChoicesList = [];

	chrome.storage.sync.get(["webChoicesList"], function(items){

		if(items == null || items.webChoicesList == null){
			return;
		}
		//items.webChoicesList is parsed already when it is saved, so we should turn it back into an object.
		savedWebChoicesString = items.webChoicesList

		var tempWebsiteChoice = null;
		//put all the objects into a list
		for(i=0; i<savedWebChoicesString.length; i++){
			tempWebsiteChoice = JSON.parse(savedWebChoicesString[i]);
			//savedWebChoicesList.push(tempWebsiteChoice);
			//alert(savedWebChoicesString[i]);

			var mainDiv = document.getElementById("modifySavedChoices");
			//adding basic divs that will hold each choice
			var choiceDiv = document.createElement("DIV");
			choiceID = getRandomNumber();
			choiceDiv.setAttribute("id", "choice" + choiceID);
			mainDiv.appendChild(choiceDiv);
			//adding name div
			var nameDiv = createNameSection(tempWebsiteChoice.name, choiceID);
			choiceDiv.appendChild(nameDiv);
			
			//add the div that will contain the list of windows
			var choiceListDiv = document.createElement("DIV");
			choiceListDiv.setAttribute("id", "choiceList" + choiceID);
			choiceDiv.appendChild(choiceListDiv);
			//add the br
			var br = document.createElement("BR");
			choiceDiv.appendChild(br);
			//add the save button for the choice
			var saveChoiceButton = document.createElement("INPUT");
			saveChoiceButton.setAttribute("id", "saveChoice" + choiceID);
			saveChoiceButton.setAttribute("type", "button");
			saveChoiceButton.setAttribute("value", "Save");
			//need action listener!!!!!!!!!!
			choiceDiv.appendChild(saveChoiceButton);
	  	
	  		var deleteChoiceButton = document.createElement("INPUT");
	  		deleteChoiceButton.setAttribute("id", "deleteChoice" + choiceID);
	  		deleteChoiceButton.setAttribute("type", "button");
	  		deleteChoiceButton.setAttribute("value", "Delete");
			//need action listener!!!!!!!!!!!!!!!!!!
			choiceDiv.appendChild(deleteChoiceButton);

			var choiceStateDiv = document.createElement("DIV");
			choiceStateDiv.setAttribute("id", "choiceStateMsg" + choiceID);
			choiceDiv.appendChild(choiceStateDiv);
			
			//adding the windows for the current WebsiteChoice object.
			for(j=0; j<tempWebsiteChoice.windows.length;j++){
				
				//create a new window, function will add the add window or delete window buttons
				var currentWindow = addWindow(choiceID);
				//need to fill in the first urlInput input, and then fill in the rest
				
				
				
				
				
				
//				//tempModifyChoiceList is the main div to add to for this loop.
//				//create window div
//				var tempWindowDiv = document.createElement("DIV");
//				tempWindowDiv.setAttribute("id", "window" + (j+1));
//				tempWindowDiv.setAttribute("class", "window");
//				tempModifyChoiceListDiv.appendChild(tempWindowDiv);
//				//create header for window and append to window div.
//				var tempWindowHeader = document.createElement("H3");
//				tempWindowHeader.innerHTML = "Window " + (j+1);
//				tempWindowDiv.appendChild(tempWindowHeader);
//
//				//if j != 0 then add the delete window button
//				if(j != 0){
//					var tempDelete = document.createElement("INPUT");
//					tempDelete.setAttribute("type", "button");
//					tempDelete.setAttribute("id", "deleteModifyChoiceWindowButton" + (j+1));
//					tempDelete.setAttribute("value", "(-) Delete Window");
//					//tempDelete.addEventListener("click", deleteWindowNewChoice);
//					tempWindowDiv.appendChild(tempDelete);
//				}
//
//				//create dl element and append to window div.
//				var tempDl = document.createElement("DL");
//				tempWindowDiv.appendChild(tempDl);
//				//loop through each tab and append elements to dl
//				for(var k=0; k<tempWebsiteChoice.windows[j].tabs.length; k++){
//					
//					
//					
//					var tempDd = document.createElement("DD");
//					tempDl.appendChild(tempDd);
//
//					var tempLabel = document.createElement("LABEL");
//					tempLabel.setAttribute("for", "addChoiceURL" + (k+1));
//					tempLabel.innerHTML = "URL(Required): ";
//					tempDd.appendChild(tempLabel);
//
//					var tempInputURL = document.createElement("INPUT");
//					tempInputURL.setAttribute("type", "text");
//					tempInputURL.setAttribute("class", "urlInput");
//					tempInputURL.setAttribute("name", "addChoiceURL" + (k+1));
//					tempInputURL.setAttribute("value", tempWebsiteChoice.windows[j].tabs[k].url);
//					tempInputURL.setAttribute("id", "addChoiceURL" + (k+1));
//					tempInputURL.setAttribute("size", "30");
//					tempDd.appendChild(tempInputURL);
//					
//					if(k == 0){
//						/*
//						 * 
//						 * 
//						 * 
//						 * 
//						 * 
//						 * 
//						 * 
//						 * 
//						 */
//						var tempButton = document.createElement("INPUT");
//						tempButton.setAttribute("id", "addModifyChoiceURLButton" + (j+1));
//						tempButton.setAttribute("type", "button");
//						tempButton.setAttribute("value", "(+) add URL");
//						tempButton.addEventListener("click", addUrlToChoice);
//						tempDd.appendChild(tempButton);
//
//						var tempErrorDiv = document.createElement("DIV");
//						tempErrorDiv.setAttribute("id", "windowURLErrorMsg" + (j+1));
//						tempDd.appendChild(tempErrorDiv);
//					}
//					else{
//						var tempDelete = document.createElement("INPUT");
//						tempDelete.setAttribute("type", "button");
//						tempDelete.setAttribute("id", "deleteModifyChoiceURLButton" + addNewChoiceTabCount);
//						tempDelete.setAttribute("value", "(-) Delete URL");
//						//tempDelete.addEventListener("click", deleteURLNewChoice);
//						tempDd.appendChild(tempDelete);
//					}
//
//				}
//			}
//
//   			//create an add window button.
//   			var tempAddWindow = document.createElement("INPUT");
//   			tempAddWindow.setAttribute("id", "addModifyChoiceWindowButton" + (i+1));
//   			tempAddWindow.setAttribute("type", "button");
//   			tempAddWindow.setAttribute("value", "(+) Add a new window");
//   			//need action listener
//   			tempModifyChoiceListDiv.appendChild(tempAddWindow);
//				}
			}
		}
	});
}

function createNameSection(name, choiceID){
	var nameDiv = document.createElement("DIV");
	nameDiv.setAttribute("id", "choiceNameInput" + choiceID);
	//adding name
	var nameLabel = document.createElement("INPUT");
	nameLabel.setAttribute("id", "choiceName" + choiceID);
	nameLabel.setAttribute("class", "name");
	nameLabel.setAttribute("name", "choiceName");
	nameLabel.setAttribute("type", "text");
	nameLabel.setAttribute("size", "12");
	nameLabel.setAttribute("value", name);
	nameDiv.appendChild(nameLabel);
	//hide the saved name for the choice so that we can correct it
	var nameHiddenInput = document.createElement("INPUT");
	nameHiddenInput.setAttribute("id", "choiceNameHiddenName" + choiceID);
	nameHiddenInput.setAttribute("type", "hidden");
	nameHiddenInput.setAttribute("value", name);
	nameDiv.appendChild(nameHiddenInput);
	//adding name div for checkmark/x for valid name or error messages possibly
	var validDiv = document.createElement("DIV");
	validDiv.setAttribute("id", "choiceNameValid" + choiceID);
	nameDiv.appendChild(validDiv);
	
	return nameDiv;
}