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
		//2. create new choice
		//3. modify choices
		var optionsRow = document.createElement("TR");
		optionsRow.setAttribute("id", "optionRow");
		table.appendChild(optionsRow);
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
		var option2 = document.createElement("TD");
		var option2Button = document.createElement("INPUT");
		option2Button.setAttribute("type", "button");
		option2Button.setAttribute("name", "option2");
		option2Button.setAttribute("id", "option2");
		option2Button.setAttribute("value", "create new choice");
		option2.appendChild(option2Button);
		optionsRow.appendChild(option2);
		//create action listener for option2; will open a new window where
		//the user can create their new choice.
		option2Button.addEventListener("click", createNewChoice);
		//3.
		var option3 = document.createElement("TD");
		var option3Button = document.createElement("INPUT");
		option3Button.setAttribute("type", "button");
		option3Button.setAttribute("name", "option3");
		option3Button.setAttribute("id", "option3");
		option3Button.setAttribute("value", "modify choices");
		option3.appendChild(option3Button);
		optionsRow.appendChild(option3);


	}


};



function createNewChoice(){
	
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
