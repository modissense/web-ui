$(document).ready(function () {

    var viewModel = {
		version: ko.observable(item),
		
		loadData: function() {
			OData.read(_serviceURL + "/GetVersion", function(data) {
				viewModel.version(data.GetVersion);
			});
		}
    };

    // Activates knockout.js
    ko.applyBindings(viewModel);
	
	viewModel.loadData();
	
});