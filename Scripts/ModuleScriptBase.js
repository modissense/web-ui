

ko.bindingHandlers.dateString = {
    update: function (element, valueAccessor, allBindingsAccessor, viewModel) {
        var value = valueAccessor(), allBindings = allBindingsAccessor()
        var valueUnwrapped = ko.utils.unwrapObservable(value);
        $(element).html(new Date(parseInt(valueUnwrapped.replace(/\/+Date\(([\d+-]+)\)\/+/, '$1'))).toString());
    }
};

function DateFromJSON(jsonDate) {
    return new Date(parseInt(jsonDate.substr(6)));
};