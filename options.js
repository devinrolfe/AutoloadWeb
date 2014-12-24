//Run our extension script as soon as the document's DOM is ready.
document.addEventListener('DOMContentLoaded', function () {
  setupListeners();
});


function setupListeners(){
	document.getElementById("addNewChoiceURLButton").addEventListener("click", addAnotherURLToNewChoice);
	document.getElementById("saveAddNewChoice").addEventListener("click", saveNewChoice);
}

function addAnotherURLToNewChoice(){
	var tempDd = document.createElement("DD");
	document.getElementById("addNewChoiceList").appendChild(tempDd);

	var tempLabel = document.createElement("LABEL");
	tempLabel.setAttribute("for", "tempURL");
	tempLabel.innerHTML= "URL(Optional):";

	var tempInput = document.createElement("INPUT");
	tempInput.setAttribute("type", "text");
	tempInput.setAttribute("class", "input");
	tempInput.setAttribute("size", "12");

	tempDd.appendChild(tempLabel);
	tempDd.appendChild(tempInput);
}

function saveNewChoice(){
	alert("Saved new choice (not implemented).");
}





/* OBJECTS */
function WebsiteChoice(name){
	this.name = name;
	this.windows = [];
}

function WebsiteWindow(windowID){
	this.id = windowID;
	this.tabs = [];
}

function WebsiteTab(tabID, url){
	this.id = tabID;
	this.url = url;
}