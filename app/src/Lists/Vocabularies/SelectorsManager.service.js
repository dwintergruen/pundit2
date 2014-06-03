angular.module('Pundit2.Vocabularies')
.constant('SELECTORMANAGERDEFAULTS', {

    // The Client will append the content of this template to the DOM to bootstrap
    // this component
    clientDashboardTemplate: "src/Lists/Vocabularies/VocabulariesContainer/ClientVocabulariesContainer.tmpl.html",
    clientDashboardPanel: "lists",
    clientDashboardTabTitle: "Vocab",

    // vocabulary items contextual menu type
    // valid to all items obtaine by selectors
    cMenuType: 'vocabItems',

    debug: false

})
.service('SelectorsManager', function(BaseComponent, SELECTORMANAGERDEFAULTS, $injector, $q) {

    var selectorsManager = new BaseComponent('SelectorsManager', SELECTORMANAGERDEFAULTS);

    // registered selectors
    var selectors = {};
    // active selectors factory instances
    var selectorInstances = [];
    // number of pending incomplete http request
    var pendingRequest;
    // a promise resolved when all selectors complete
    // the http query request
    var promise = null;

    selectorsManager.getItems = function(term){
        
        pendingRequest = 0;
        promise = $q.defer();

        // get items from actives selectors
        for (var j in selectorInstances) {
            pendingRequest++;
            selectorInstances[j].getItems(term).then(function(){
                pendingRequest--;
                if (pendingRequest <= 0 && promise!== null) {
                    promise.resolve();
                    promise = null;
                }
            });
        }

        return promise.promise;

    };

    // inject all selector factory then read config 
    // and instantiate the various instance of the selectors
    // when the init run others factory must to be call the "addSelector" method
    selectorsManager.init = function(){

        // TODO need to instance only one time
        // then extend selectorInstance in the futures calls
        // or we must be sure that it is called only once (eg: inside client)
        selectorInstances = [];

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

    return selectorsManager;

});