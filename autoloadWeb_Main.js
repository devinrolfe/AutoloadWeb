var autoloadWebObject = {

	//savedWebsiteChoices: loadSavedChoices_(),

	loadSavedChoices_: function(){
		//load saved values, then call displayOptions
		//display options will take in a list of the saved values
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

			var tempTD = document.createElement("TD");
			var tempCell = document.createTextNode("row" + i);

			tempTD.appendChild(tempCell);
			tempTR.appendChild(tempTD);
		}	

	}


};
//Run our extension script as soon as the document's DOM is ready.
document.addEventListener('DOMContentLoaded', function () {
  autoloadWebObject.loadSavedChoices_();
});