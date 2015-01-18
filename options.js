//Global variables
var addNewChoiceWindowCount = 1;
var addNewChoiceTabCount = 1;
var modifyChoiceCount = 1;


//var asyncChecker = 0;
//var boolReturn = 0;

//Run our extension script as soon as the document's DOM is ready.
document.addEventListener('DOMContentLoaded', function () {
	//chrome.storage.sync.clear(); //use to clear storage
	setupListeners();
	loadExistingChoices();
});


function setupListeners(){
	document.getElementById("addNewChoiceURLButton1").addEventListener("click", addAnotherURLToNewChoice);
	document.getElementById("addNewChoiceWindowButton").addEventListener("click", addAnotherWindowToNewChoice);
	document.getElementById("saveAddNewChoice").addEventListener("click", saveNewChoice);
}

/* BELOW ARE FUNCTIONS THAT DEAL WITH THE NEW CHOICES
***********************************************************
***********************************************************
***********************************************************
***********************************************************
***********************************************************
***********************************************************
***********************************************************
addAnotherURLToNewChoice()
deleteURLNewChoice()
addAnotherWindowToNewChoice()
deleteWindowNewChoice()
saveNewChoice()
cleanAddNewChoice()
*/


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
	tempDiv.setAttribute("class", "window");
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

	var tempErrorDiv = document.createElement("DIV");
	tempErrorDiv.setAttribute("id", "windowURLErrorMsg" + addNewChoiceWindowCount);
	tempDD.appendChild(tempErrorDiv);
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

			for(i=0; i<savedWebChoicesList.length; i++){
				if(JSON.parse(savedWebChoicesList[i]).name == name){
					//alert("name exists in saved data");
					boolReturn = 1;
				}
			}
		}
		//if name already exists or name is empty, insert error message and return
		if(boolReturn){
			//alert("name already existed, not saving");

			//check if error message already exists
			var tempNameErrorMsg = document.getElementById("newChoiceNameErrorMsg");

			if(tempNameErrorMsg == null){
				var tempLabel = document.getElementById("addChoiceName");
				var tempParent = tempLabel.parentNode;
				
				var newChoiceErrorName = document.createElement("LABEL");
				newChoiceErrorName.setAttribute("for", "addChoiceName");
				newChoiceErrorName.setAttribute("id", "newChoiceNameErrorMsg");
				if(name == ''){
					newChoiceErrorName.innerHTML = "Name cannot be empty.";
				}
				else{
					newChoiceErrorName.innerHTML = "Name already exist, choose another.";
				}
				tempParent.appendChild(newChoiceErrorName);
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

			var newChoiceErrorName = document.getElementById("newChoiceNameErrorMsg");

			if(newChoiceErrorName != null){
				var tempParent = newChoiceErrorName.parentNode;
				tempParent.removeChild(newChoiceErrorName);
			}
		}

		var webChoices = new WebsiteChoice(name);
		var tempWindows = document.getElementById("addNewChoiceList").getElementsByClassName("window");
		
		var urlReturn  = 0;
		for(i=0; i<tempWindows.length; i++){
			var tempWindow = new WebsiteWindow(i);
			var tempTabs = tempWindows[i].getElementsByClassName("urlInput");
			
			//check if first URL tab is not empty, if so error message
			if((tempTabs[0].value == '') || (tempTabs[0].value == tempTabs[0].defaultValue)){
				//alert("url error message");

				if(tempWindows[i].getElementsByClassName("urlErrorMessage").length == 0){
					var newChoiceErrorURL = document.createElement("Label");
					newChoiceErrorURL.setAttribute("for", tempTabs[0].id);
					newChoiceErrorURL.setAttribute("class", "urlErrorMessage");
					newChoiceErrorURL.innerHTML = "Please insert an URL.";
				
					var windowNumber = parseInt(tempWindows[i].id.slice("window".length));
					var errorMsgDiv = document.getElementById("windowURLErrorMsg" + windowNumber);
					errorMsgDiv.appendChild(newChoiceErrorURL);				
				}
				urlReturn = 1;
			}
			else{
				if(tempWindows[i].getElementsByClassName("urlErrorMessage").length != 0){
					var windowNumber = parseInt(tempWindows[i].id.slice("window".length));
					var errorMsgDiv = document.getElementById("windowURLErrorMsg" + windowNumber);
					
					while(errorMsgDiv.firstChild){
						errorMsgDiv.removeChild(errorMsgDiv.firstChild);
					}
				}
			}

			for(j=0; j<tempTabs.length; j++){
				//check first url is not empty, else insert message like above
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
		alert("Save: " + JSON.stringify(savedWebChoicesList));

		//saving new choice
		chrome.storage.sync.set({'webChoicesList': savedWebChoicesList}, function(){
			//message('Settings saved');
		});
		
		//NEED TO ADD A LISTENER TO THIS TO UPDATE MODIFY INFO

		//need to clear all the input to empty
		cleanAddNewChoice();
	});	
}

function cleanAddNewChoice(){
	//set global variables to initial
	addNewChoiceWindowCount = 1;
	addNewChoiceTabCount = 1;
	//clear name
	var name = document.getElementById("addChoiceName").value = '';
	//clear windows
	var tempWindows = document.getElementById("addNewChoiceList").getElementsByClassName("window");

	var windowParent = tempWindows[0].parentNode;
	var tabParent;
	for(i=0; i<tempWindows.length; i++){
		if(i == 0){//keep first window, just clean it up
			var tempTabs = tempWindows[i].getElementsByTagName("DD");
			tabParent = tempTabs[0].parentNode;
			for(j=0; j<tempTabs.length; j++){
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


/*
chrome.storage.sync.get(["webChoices"], function(items){
	//  items = [ { "phasersTo": "awesome" } ]
	alert(items.webChoices);
	var temp = JSON.parse(items.webChoices);
	alert(temp);
});
*/

/* BELOW ARE FUNCTIONS THAT DEAL WITH THE MODIFY CHOICES
***********************************************************
***********************************************************
***********************************************************
***********************************************************
***********************************************************
***********************************************************
***********************************************************
loadExistingChoices()
*/
function loadExistingChoices(){
	//alert("loading existing choices, not implemented.");

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

			//add the WebsiteChoice object into the html
			//1. name - can change name, but with error but back original name
			//2. Windows - have delete window button
			//3. tabs(urls) - have a delete url button
			//4. save button
			//5. delete button

			var mainDiv = document.getElementById("modifySavedChoiceslist");
			//adding basic divs that will hold each choice
			var tempChoiceDiv = document.createElement("DIV");
			tempChoiceDiv.setAttribute("id", "modifyWebChoiceDiv" + (i+1));
			mainDiv.appendChild(tempChoiceDiv);
			//adding name div
			var tempNameDiv = document.createElement("DIV");
			tempNameDiv.setAttribute("id", "modifyChoiceNameInput" + (i+1));
			tempChoiceDiv.appendChild(tempNameDiv);
			//adding name
			var tempNameLabel = document.createElement("INPUT");
			tempNameLabel.setAttribute("id", "modifyChoiceName" + (i+1));
			tempNameLabel.setAttribute("class", "textToInput");
			tempNameLabel.setAttribute("type", "text");
			tempNameLabel.setAttribute("size", "12");
			tempNameLabel.setAttribute("value", tempWebsiteChoice.name);
			tempNameDiv.appendChild(tempNameLabel);
			//hide the saved name for the choice so that we can correct it
			var tempNameHiddenInput = document.createElement("INPUT");
			tempNameHiddenInput.setAttribute("id", "modifyChoiceNameHiddenName" + (i+1));
			tempNameHiddenInput.setAttribute("type", "hidden");
			tempNameHiddenInput.setAttribute("value", tempWebsiteChoice.name);
			tempNameDiv.appendChild(tempNameHiddenInput);
			//adding name div for checkmark/x
			var tempValidDiv = document.createElement("DIV");
			tempValidDiv.setAttribute("id", "modifyChoiceNameValid" + (i+1));
			tempNameDiv.appendChild(tempValidDiv);

			var tempModifyChoiceListDiv = document.createElement("DIV");
			tempModifyChoiceListDiv.setAttribute("id", "modifyChoiceList" + (i+1));
			tempChoiceDiv.appendChild(tempModifyChoiceListDiv);
			//adding the windows for the current WebsiteChoice object.
			for(j=0; j<tempWebsiteChoice.windows.length;j++){
				//tempModifyChoiceList is the main div to add to for this loop.
				//create window div
				var tempWindowDiv = document.createElement("DIV");
				tempWindowDiv.setAttribute("id", "window" + (j+1));
				tempWindowDiv.setAttribute("class", "window");
				tempModifyChoiceListDiv.appendChild(tempWindowDiv);
				//create header for window and append to window div.
				var tempWindowHeader = document.createElement("H3");
				tempWindowHeader.innerHTML = "Window " + (j+1);
				tempWindowDiv.appendChild(tempWindowHeader);

				//if j != 0 then add the delete window button
				if(j != 0){
					var tempDelete = document.createElement("INPUT");
					tempDelete.setAttribute("type", "button");
					tempDelete.setAttribute("id", "deleteModifyChoiceWindowButton" + (j+1));
					tempDelete.setAttribute("value", "(-) Delete Window");
					//tempDelete.addEventListener("click", deleteWindowNewChoice);
					tempWindowDiv.appendChild(tempDelete);
				}

				//create dl element and append to window div.
				var tempDl = document.createElement("DL");
				tempWindowDiv.appendChild(tempDl);
				//loop through each tab and append elements to dl
				for(k=0; k<tempWebsiteChoice.windows[j].tabs.length; k++){
					var tempDd = document.createElement("DD");
					tempDl.appendChild(tempDd);

					var tempLabel = document.createElement("LABEL");
					tempLabel.setAttribute("for", "addChoiceURL" + (k+1));
					tempLabel.innerHTML = "URL(Required): ";
					tempDd.appendChild(tempLabel);

					var tempInputURL = document.createElement("INPUT");
					tempInputURL.setAttribute("type", "text");
					tempInputURL.setAttribute("class", "urlInput");
					tempInputURL.setAttribute("name", "addChoiceURL" + (k+1));
					tempInputURL.setAttribute("value", tempWebsiteChoice.windows[j].tabs[k].url);
					tempInputURL.setAttribute("id", "addChoiceURL" + (k+1));
					tempInputURL.setAttribute("size", "30");
					tempDd.appendChild(tempInputURL);
					
					if(k == 0){
						var tempButton = document.createElement("INPUT");
						tempButton.setAttribute("id", "addModifyChoiceURLButton" + (j+1));
						tempButton.setAttribute("type", "button");
						tempButton.setAttribute("value", "(+) add URL");
						//tempButton.addEventListener("click", addAnotherURLToNewChoice);
						tempDd.appendChild(tempButton);

						var tempErrorDiv = document.createElement("DIV");
						tempErrorDiv.setAttribute("id", "windowURLErrorMsg" + (j+1));
						tempDd.appendChild(tempErrorDiv);
					}
					else{
						var tempDelete = document.createElement("INPUT");
						tempDelete.setAttribute("type", "button");
						tempDelete.setAttribute("id", "deleteModifyChoiceURLButton" + addNewChoiceTabCount);
						tempDelete.setAttribute("value", "(-) Delete URL");
						//tempDelete.addEventListener("click", deleteURLNewChoice);
						tempDd.appendChild(tempDelete);
					}

				}
			}



   			//create a add window button.
   			var tempAddWindow = document.createElement("INPUT");
   			tempAddWindow.setAttribute("id", "addModifyChoiceWindowButton" + (i+1));
   			tempAddWindow.setAttribute("type", "button");
   			tempAddWindow.setAttribute("value", "(+) Add a new window");
   			//need action listener
   			tempModifyChoiceListDiv.appendChild(tempAddWindow);

   			var tempBr = document.createElement("BR");
   			tempChoiceDiv.appendChild(tempBr);
   			
   			var tempSaveChoiceButton = document.createElement("INPUT");
   			tempSaveChoiceButton.setAttribute("id", "saveModifyChoice" + (i+1));
   			tempSaveChoiceButton.setAttribute("type", "button");
   			tempSaveChoiceButton.setAttribute("value", "Save");
   			//need action listener
   			tempChoiceDiv.appendChild(tempSaveChoiceButton);
		  	
		  	var tempDeleteChoiceButton = document.createElement("INPUT");
   			tempDeleteChoiceButton.setAttribute("id", "DeleteModifyChoice" + (i+1));
   			tempDeleteChoiceButton.setAttribute("type", "button");
   			tempDeleteChoiceButton.setAttribute("value", "Delete");
   			//need action listener
   			tempChoiceDiv.appendChild(tempDeleteChoiceButton);

   			var validChoiceErrorDiv = document.createElement("DIV");
   			validChoiceErrorDiv.setAttribute("id", "modifyChoiceValid" + (i+1));
			tempChoiceDiv.appendChild(validChoiceErrorDiv);
			


   			//this value will be used when we add stuff?
   			modifyChoiceCount++;
		}
	});
}