var windowId = null;

//Run our extension script as soon as the document's DOM is ready.
document.addEventListener('DOMContentLoaded', function () {
  autoloadWebObject.loadSavedChoices_();
//  chrome.storage.sync.clear();
});

var autoloadWebObject = {

	loadSavedChoices_: function(){
		//load saved values, then call displayOptions
		//display options will take in a list of the saved values
		chrome.storage.sync.get(["webSetupsList"], function(items){

			var websiteSetup = [];
			
			if(!(items == null || items.webSetupsList == null)){
				var savedWebSetupsString = items.webSetupsList
				//put all the objects into a list
				for(var i=0; i<savedWebSetupsString.length; i++){
					websiteSetup.push(JSON.parse(savedWebSetupsString[i]).name);
				}
			}
			autoloadWebObject.displayOptions_(websiteSetup);
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
	
	chrome.storage.sync.get(["webSetupsList"], function(items){

		if(items == null || items.webSetupsList == null){
			return;
		}
		//items.webSetupsList is parsed already when it is saved, so we should turn it back into an object.
		var savedWebChoicesString = items.webSetupsList

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
		for(var i=0; i<websiteChoice.windows.length; i++){
			
			if(i == 0){
				loadWindow(websiteChoice.windows[i], true);
			}
			else{
				loadWindow(websiteChoice.windows[i], false);
			}
		}
		//below is a little trick to make the main chrome window the focus
		setTimeout(function(){
			if(windowId != null){
				chrome.windows.update(windowId, {'focused':true});
			}
			windowId = null;
		}, 500);
		
	});
}

function loadWindow(window, focus){
//	var tempUrl = checkUrl(window.tabs[0].url);
	var tempUrl = window.tabs[0].url;
	
	chrome.windows.create(
			{'url':tempUrl, 'focused': focus},
			function(chromeWindow){
				
				if(focus){windowId = chromeWindow.id;};
				
				for(var i=1; i<window.tabs.length; i++){
					tempUrl = checkUrl(window.tabs[i].url);
					
					chrome.tabs.create(
							{'windowId':chromeWindow.id, 'url':tempUrl, 'active':false, 'selected':false},
							function(chromeTab){
								//nothing to do with the tab at the moment.
							}
					);
				}
				chrome.windows.update(chromeWindow.id, {state:'maximized'});
			}
	);
	
	
	
}

function checkUrl(tempUrl){
	//need to parse the first characters in url to see if match
	//1. https://www
	//2. http://www
	//3. www
	var pattern1 = /https:\/\/www\./;
	var pattern2 = /http:\/\/www\./;
	var pattern3 = /www\./;
	
	if(pattern1.test(tempUrl) || pattern2.test(tempUrl)){
		//done nothing to url since it is in good from
	}
	else if(pattern3.test(tempUrl)){
		tempUrl = "http://" + tempUrl;
	}
	else{
		tempUrl = "http://www." + tempUrl;
	}
	return tempUrl;
}




function saveCurrentSetUp(){
	
	chrome.windows.getAll({populate:true},
		function(windows){
			
		var webSetup = new WebsiteSetup("setup not given a name.");
			//collect all the windows and respective tabs.
			windows.forEach(function(window){
				
				var webWindow = new WebsiteWindow();
				//also add code to get window position and save it!!!!
				
				window.tabs.forEach(function(tab){
					if(tab.url != "chrome-extension://mifafbjbnhpmdjngkhnmfjdlefdgileh/options.html"){
						var webTab = new WebsiteTab(tab.url);
						webWindow.tabs.push(webTab);
					}
				});
				webSetup.windows.push(webWindow);
			});
			//save the setup.
			chrome.storage.sync.set({'lastSavedWebSetup': JSON.stringify(webSetup)}, function(){
				//message('Settings saved');
			});
			
			var w = 420;
		    var h = 100;
		    var left = (screen.width/2)-(w/2);
		    var top = (screen.height/2)-(h/2); 
			
			chrome.windows.create(
				{'url': 'setupPrompt.html', 'type': 'popup', 'width': w, 
				'height': h, 'left': left, 'top': top, 'focused': true});	
			
	});
		
}


/*
 * makes it so that only one option tab is open at a time
 */
function optionsFunction(){
	//NOTE: Only one option tab can be open at a time, so if one option tab is opened in another
	//window then it will be moved to the current window.
	
	//this will open the options.html, but will first check if the tab is already open
	chrome.tabs.query({url: "chrome-extension://mifafbjbnhpmdjngkhnmfjdlefdgileh/options.html"}, 
			function(array_of_Tabs){
				var tab = array_of_Tabs[0];
				if(tab != null){
					
					chrome.windows.getCurrent(
						function(window){
							chrome.tabs.move(tab.id, {windowId: window.id, index: -1}, 
									function(optionTab){
										chrome.tabs.update(tab.id, {selected: true});
									});
						});
				}
				else{
					chrome.tabs.create({url: "options.html"}); 
				}
			});
}

