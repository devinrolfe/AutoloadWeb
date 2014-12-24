//Run our extension script as soon as the document's DOM is ready.
document.addEventListener('DOMContentLoaded', function () {
  autoloadWebObject.loadSavedChoices_();
});

var autoloadWebObject = {

	//savedWebsiteChoices: loadSavedChoices_(),

	loadSavedChoices_: function(){
		//load saved values, then call displayOptions
		//display options will take in a list of the saved values
		//var info = new WebsiteChoice("thing");

		this.displayOptions_();

	},

	displayOptions_: function(){
		var table = document.createElement("TABLE");
		table.setAttribute("id", "autoloadWebTable");
		document.body.appendChild(table);

		for(i=0; i < 5; i++){
			var tempTR= document.createElement("TR");
			tempTR.setAttribute("id", "row" + i);
			table.appendChild(tempTR);

			var tempButton = document.createElement("INPUT");
			tempButton.setAttribute("type", "button");
			tempButton.setAttribute("name", "row" + i);
			tempButton.setAttribute("id", "row" + i);
			tempButton.setAttribute("value", "row" + i);

			tempTR.appendChild(tempButton);
			/*
			var tempTD = document.createElement("TD");
			var tempCell = document.createTextNode("row" + i);

			tempTD.appendChild(tempCell);
			tempTR.appendChild(tempTD);
			*/
		}
		//create option buttons, should be 3 option buttons
		//1. add current website to...
		//2. Options - create/modify choices
		var optionsRow = document.createElement("TR");
		optionsRow.setAttribute("id", "optionRow");
		table.appendChild(optionsRow);
		//1 and 2 will not be buttons but instead text when clicked does stuff(css)
		//1.
		var option1 = document.createElement("TD");
		var option1Button = document.createElement("INPUT");
		option1Button.setAttribute("type", "button");
		option1Button.setAttribute("name", "option1");
		option1Button.setAttribute("id", "option1");
		option1Button.setAttribute("value", "add current site to...");
		option1.appendChild(option1Button);
		optionsRow.appendChild(option1);
		//2.
		var options = document.createElement("TD");
		var optionsButton = document.createElement("INPUT");
		optionsButton.setAttribute("type", "button");
		optionsButton.setAttribute("name", "options");
		optionsButton.setAttribute("id", "options");
		optionsButton.setAttribute("value", "Options");
		options.appendChild(optionsButton);
		optionsRow.appendChild(options);
		//create action listener for option2; will open a new window where
		//the user can create their new choice.
		optionsButton.addEventListener("click", optionsFunction);
	}

};



function optionsFunction(){
	//this will open the options.html, but before I do this I
	//should check a saved value to see if the options page,
	//is already open, if so then just switch to it.
	chrome.tabs.create({url: "options.html"}); 
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
