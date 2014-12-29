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