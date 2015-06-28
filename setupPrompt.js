//Run our extension script as soon as the document's DOM is ready.
document.addEventListener('DOMContentLoaded', function () {
	setupListeners();
});

function setupListeners(){
	document.getElementById("promptButton").addEventListener("click", saveNewSetup);
}

function saveNewSetup(){
	chrome.storage.sync.get(["webSetupsList"], function(items){

		var savedWebSetupsList = null;
		var name = document.getElementById("promptAnswer").value;
		
		var boolReturn = 0;
		var overWrite = -1;
		
		if(name == ''){
			boolReturn = 1;
		}
		else if(items == null || items.webSetupsList == null){
			boolReturn = 0;
		}
		else{
			//items.webSetupsList is parsed already when it is saved, so we should turn it back into an object.
			savedWebSetupsList = items.webSetupsList

			for(var i=0; i<savedWebSetupsList.length; i++){
				var storedName = JSON.parse(savedWebSetupsList[i]).name;
				if(storedName == name){
					//Ask user if they want to overwrite over existing setup
					if(confirm("Existing setup name '" + name + "' already exists, do you wish to overwrite it?") == true){
						overWrite = i;
					}
					else{
						boolReturn = 1;
					}
				}
			}
		}
		//if name already exists or name is empty, insert error message and return
		if(boolReturn){
			//check if error message already exists
			var tempNameErrorMsg = document.getElementById("nameErrorMsg");

			if(tempNameErrorMsg == null){
				var errorNameMsg = document.createElement("P");
				errorNameMsg.setAttribute("id", "nameErrorMsg");
				if(name == ''){
					errorNameMsg.innerHTML = "Name cannot be empty.";
				}
				else{
					errorNameMsg.innerHTML = "Name already exist, choose another.";
				}
				var myPromptErrorDiv = document.getElementById("myPromptError");
				myPromptErrorDiv.appendChild(errorNameMsg);
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

            chrome.storage.sync.set({'curSetupName': name}, function(){

            });

			//need to load the savedLastSetup
			chrome.storage.sync.get(["lastSavedWebSetup"], function(items){
				var lastSavedSetup = JSON.parse(items.lastSavedWebSetup);
				//check to see if the remove all previous windows checkbox is checked
				if(!document.getElementById("RemovePreviousWindows").checked){
					lastSavedSetup.removePrevWindows = false;
				}
				
				lastSavedSetup.name = name;
				
				if(savedWebSetupsList == null) savedWebSetupsList = [];
				
				if(overWrite != -1){
					savedWebSetupsList[overWrite] = JSON.stringify(lastSavedSetup);
				}
				else{
					savedWebSetupsList.push(JSON.stringify(lastSavedSetup));
				}
				
				//save the new setup and check if options tab is open, if so then change it
				//to account for the new setup.
				//saving new setup
				chrome.storage.sync.set({'webSetupsList': savedWebSetupsList}, 
						function(){
							//message('Settings saved');
							//this will open the options.html, but will first check if the tab is already open
							//ohfbaiaofiialjgaekdhidddnccpibjf LOCAL
							//mifafbjbnhpmdjngkhnmfjdlefdgileh STORE
							chrome.tabs.query({url: "chrome-extension://mifafbjbnhpmdjngkhnmfjdlefdgileh/options.html"},
									function(array_of_Tabs){
										var tab = array_of_Tabs[0];
										if(tab != null){
											//send message to options tab to update the list
											//of setups
											chrome.runtime.sendMessage(
													{greeting: "update",
													 payload: JSON.stringify(lastSavedSetup)});
										}
									});
							//need to close the window
							chrome.windows.getCurrent(
									function(window){
										chrome.windows.remove(window.id);
									});
						});

			});
		}
	});
	
}