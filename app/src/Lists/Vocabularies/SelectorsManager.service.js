angular.module('Pundit2.Vocabularies')
.constant('SELECTORMANAGERDEFAULTS', {

    debug: true

})
.service('SelectorsManager', function(BaseComponent, SELECTORMANAGERDEFAULTS, $injector) {

    var selectorsManager = new BaseComponent('SelectorsManager', SELECTORMANAGERDEFAULTS);

    // active selectors services
    var selectors = {};

    selectorsManager.getItems = function(term, callback){
        
        pendingRequest = 0;
        registeredCallback = callback;

        // get items from actives selectors
        for (var name in selectors) {
            pendingRequest++;
            selectors[name].getItems(term, checkAllSelectorEnd);
        }

    };

    selectorsManager.addSelector = function(selector){
        selectors[selector.name] = selector;
        selectorsManager.log("Add selector ", selector.name);
    };

    selectorsManager.getActiveSelectors = function(){
        return selectors;
    };

    var pendingRequest,
        registeredCallback = null;
    var checkAllSelectorEnd = function(){
        pendingRequest--;
        if (pendingRequest <= 0 && registeredCallback!== null) {
            registeredCallback();
            registeredCallback = null;
        }
    };


    return selectorsManager;

});