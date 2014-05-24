angular.module('Pundit2.Vocabularies')
.constant('SELECTORMANAGERDEFAULTS', {

    // The Client will append the content of this template to the DOM to bootstrap
    // this component
    clientDashboardTemplate: "src/Lists/Vocabularies/VocabulariesContainer/ClientVocabulariesContainer.tmpl.html",
    clientDashboardPanel: "lists",
    clientDashboardTabTitle: "Vocab",

    debug: false

})
.service('SelectorsManager', function(BaseComponent, SELECTORMANAGERDEFAULTS, $injector) {

    var selectorsManager = new BaseComponent('SelectorsManager', SELECTORMANAGERDEFAULTS);

    // active selectors services
    var selectors = {};
    // active selectors services instance
    var selectorInstances = [];

    selectorsManager.getItems = function(term, callback){
        
        pendingRequest = 0;
        registeredCallback = callback;

        // get items from actives selectors
        for (var j in selectorInstances) {
            pendingRequest++;
            selectorInstances[j].getItems(term, checkAllSelectorEnd);
        }

    };

    // inject all selector factory then read config 
    // and instantiate the various instance of the selectors
    // when the init run others factory must to be call the "addSelector" method
    selectorsManager.init = function(){

        for (var key in selectors) {

            // selector factory
            var Factory = $injector.get(selectors[key].name);

            for (var j in selectors[key].options.instances) {
                // selector instance
                var sel = new Factory(selectors[key].options.instances[j]);
                selectorInstances.push(sel);
            }
        }
        selectorsManager.log('Init, add selector instances', selectorInstances);
    };

    // when the selector factory is load run this method
    // another component should inject the singles selector factory 
    // to start the initialization process
    selectorsManager.addSelector = function(selector){
        selectors[selector.name] = selector;
        selectorsManager.log("Add selector ", selector.name);
    };

    // return all active selectors instances
    selectorsManager.getActiveSelectors = function(){
        return selectorInstances;
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