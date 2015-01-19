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

		chrome.storage.sync.get(["webChoicesList"], function(items){

			if(items == null || items.webChoicesList == null){
				return;
			}
			//items.webChoicesList is parsed already when it is saved, so we should turn it back into an object.
			savedWebChoicesString = items.webChoicesList

			var websiteChoice = [];
			//put all the objects into a list
			for(var i=0; i<savedWebChoicesString.length; i++){
				websiteChoice.push(JSON.parse(savedWebChoicesString[i]).name);
			}
			autoloadWebObject.displayOptions_(websiteChoice);
		});
		

	},

	displayOptions_: function(websiteChoice){
		var table = document.createElement("TABLE");
		table.setAttribute("id", "autoloadWebTable");
		document.body.appendChild(table);

		for(var i=0; i < websiteChoice.length; i++){
			var tempTR= document.createElement("TR");
			tempTR.setAttribute("id", "row" + i);
			table.appendChild(tempTR);

			var tempButton = document.createElement("INPUT");
			tempButton.setAttribute("type", "button");
			tempButton.setAttribute("name", "row" + i);
			tempButton.setAttribute("id", "row" + i);
			tempButton.setAttribute("value", websiteChoice[i]);
			tempButton.addEventListener("click", loadSetup);
			tempTR.appendChild(tempButton);
		}
		//create option buttons, should be 3 option buttons
		//1. save current set up
		//2. add current website to...
		//3. Options - create/modify choices
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
		option1Button.setAttribute("value", "save current set up");
		option1Button.addEventListener("click", saveCurrentSetUp);
		option1.appendChild(option1Button);
		optionsRow.appendChild(option1);
		//need listener to save all windows/tabs
		//2.
		var option2 = document.createElement("TD");
		var option2Button = document.createElement("INPUT");
		option2Button.setAttribute("type", "button");
		option2Button.setAttribute("name", "option1");
		option2Button.setAttribute("id", "option1");
		option2Button.setAttribute("value", "add current site to...");
		option2Button.addEventListener("click", addCurrentSiteTo);
		option2.appendChild(option2Button);
		optionsRow.appendChild(option2);
		//need listener to save current site
		//3.
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
function loadSetup(){
	alert("not implemented!");
}
function saveCurrentSetUp(){
	alert("not implemented!");
}
function addCurrentSiteTo(){
	alert("not implemented!");
}

/*
 * makes it so that only one option tab is open at a time
 */
function optionsFunction(){
	//this will open the options.html, but before I do this I
	//should check a saved value to see if the options page,
	//is already open, if so then just switch to it.
	chrome.tabs.query({url: "chrome-extension://oonpekkcdidfjkfkmcokdlmanefiocle/options.html"}, 
			function(array_of_Tabs){
				var tab = array_of_Tabs[0];
				if(tab != null){
					chrome.tabs.update(tab.id, {selected: true});
					
				}else{
					chrome.tabs.create({url: "options.html"}); 
				}
			});
}

