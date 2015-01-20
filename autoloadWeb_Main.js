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
		//create option buttons, should be 2 option buttons
		//1. save current set up
		//3. Options - create/modify setups
		var optionsRow = document.createElement("TR");
		optionsRow.setAttribute("id", "optionRow");
		table.appendChild(optionsRow);
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
		//2.
		var options = document.createElement("TD");
		var optionsButton = document.createElement("INPUT");
		optionsButton.setAttribute("type", "button");
		optionsButton.setAttribute("name", "options");
		optionsButton.setAttribute("id", "options");
		optionsButton.setAttribute("value", "Options");
		options.appendChild(optionsButton);
		optionsRow.appendChild(options);
		optionsButton.addEventListener("click", optionsFunction);
	}

};
function loadSetup(){

	var name = this.value;
	
	chrome.storage.sync.get(["webChoicesList"], function(items){

		if(items == null || items.webChoicesList == null){
			return;
		}
		//items.webChoicesList is parsed already when it is saved, so we should turn it back into an object.
		savedWebChoicesString = items.webChoicesList

		var websiteChoice = null;;
		//put all the objects into a list
		for(var i=0; i<savedWebChoicesString.length; i++){
			if(name == JSON.parse(savedWebChoicesString[i]).name){
				websiteChoice = JSON.parse(savedWebChoicesString[i]);
				break;
			}
		}
		if(websiteChoice == null){
			return;
		}
//		chrome.windows.create({"url":"http://www.facebook.com"}, function(){});
		for(var i=0; i<websiteChoice.windows.length; i++){
			
			if(i == 0){
				loadWindow(websiteChoice.windows[i], true);
			}
			else{
				loadWindow(websiteChoice.windows[i], false);
			}
		}
		
	});
}



function loadWindow(window, focus){
	chrome.windows.create(
			//'url':window.tabs[0].url
			//need to parse the first characters in url to see if match
			//1. https://www
			//2. http://www
			//3. www
			{'url':'http://www.google.com', 'focused':focus},
			function(chromeWindow){
				//window.tabs[j].url
				for(var i=1; i<window.tabs.length; i++){
					chrome.tabs.create(
							{'windowId':chromeWindow.id, 'url':'http://www.google.com'},
							function(chromeTab){
								
							}
					);
				}
				
				chrome.windows.update(chromeWindow.id, {state:'maximized'});
				
			}
	);
}






function saveCurrentSetUp(){
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

