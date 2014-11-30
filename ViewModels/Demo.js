$(document).ready(function () {

    var viewModel = {
		firstName: ko.observable("Joe"),
		lastName: ko.observable("User")
    };
	
	viewModel.fullName = ko.dependentObservable(function () {
		return this.firstName() + " " + this.lastName();
	}, viewModel);

	viewModel.greet = ko.dependentObservable(function () {
		return "Hello " + this.fullName();
	}, viewModel);

	viewModel.save = function () {
		alert("Hello " + this.fullName() + " from Knockout.js");
	}

    // Activates knockout.js
    ko.applyBindings(viewModel);
	
});