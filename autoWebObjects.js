/* OBJECTS */
function WebsiteSetup(name){
	this.name = name;
	this.windows = [];
}

function WebsiteWindow(){
	this.tabs = [];
}

function WebsiteTab(url){
	this.url = url;
}