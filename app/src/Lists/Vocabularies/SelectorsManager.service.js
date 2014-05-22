angular.module('Pundit2.Vocabularies')
.constant('SELECTORMANAGERDEFAULTS', {

    debug: true

})
.service('SelectorsManager', function(BaseComponent, SELECTORMANAGERDEFAULTS, $injector) {

    var selectorsManager = new BaseComponent('SelectorsManager', SELECTORMANAGERDEFAULTS);

    // active selectors services
    var selectors = {};

    selectorsManager.getItems = function(query){
        // get items from actives selectors
    };

    selectorsManager.addSelector = function(selector){
        selectors[selector.label] = selector;
        selectorsManager.log("Add selector ", selector.label);
    };


    return selectorsManager;

});