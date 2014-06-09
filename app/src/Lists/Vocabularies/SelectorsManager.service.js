angular.module('Pundit2.Vocabularies')
.constant('SELECTORMANAGERDEFAULTS', {

    /**
     * @module punditConfig
     * @ngdoc property
     * @name modules#SelectorsManager
     *
     * @description
     * `object`
     *
     * Configuration for SelectorsManager service. This object contains the part of the configuration
     * common to all vocabularies, defines: at which panel add the VocabulariesContainer directive,
     * the type of the context menu opened on items and the directive template path.
     */

    /**
     * @module punditConfig
     * @ngdoc property
     * @name modules#SelectorsManager.clientDashboardTemplate
     *
     * @description
     * `string`
     *
     * Path of template containing myItemsContainer directive, client will append the content of this template 
     * to the DOM (inside dashboard directive) to bootstrap this component
     *
     * Default value:
     * <pre> clientDashboardTemplate: "src/Lists/Vocabularies/VocabulariesContainer/ClientVocabulariesContainer.tmpl.html" </pre>
     */
    clientDashboardTemplate: "src/Lists/Vocabularies/VocabulariesContainer/ClientVocabulariesContainer.tmpl.html",
    
    /**
     * @module punditConfig
     * @ngdoc property
     * @name modules#SelectorsManager.clientDashboardPanel
     *
     * @description
     * `string`
     *
     * Name of the panel where append the directive (legal value to default are: 'lists', 'tools' and 'details')
     *
     * Default value:
     * <pre> clientDashboardPanel: "lists" </pre>
     */
    clientDashboardPanel: "lists",
    
    /**
     * @module punditConfig
     * @ngdoc property
     * @name modules#SelectorsManager.clientDashboardTabTitle
     *
     * @description
     * `string`
     *
     * Tab title inside panel dashboard tabs
     *
     * Default value:
     * <pre> clientDashboardTabTitle: "Vocab" </pre>
     */
    clientDashboardTabTitle: "Vocab",

    /**
     * @module punditConfig
     * @ngdoc property
     * @name modules#SelectorsManager.cMenuType
     *
     * @description
     * `string`
     *
     * Contextual menu type showed by items contained inside directive
     *
     * Default value:
     * <pre> cMenuType: 'vocabItems' </pre>
     */
    cMenuType: 'vocabItems',

    /**
     * @module punditConfig
     * @ngdoc property
     * @name modules#SelectorsManager.debug
     *
     * @description
     * `boolean`
     *
     * Active debug log
     *
     * Default value:
     * <pre> debug: false </pre>
     */
    debug: false

})
.service('SelectorsManager', function(BaseComponent, SELECTORMANAGERDEFAULTS, $injector, $q) {

    var selectorsManager = new BaseComponent('SelectorsManager', SELECTORMANAGERDEFAULTS);

    // registered selectors
    var selectors = {};
    // active selectors factory instances
    var selectorInstances = [];

    selectorsManager.getItems = function(term){
        
        // a promise resolved when all selectors complete
        // the http query request
        var promise = $q.defer(),
            pendingRequest = selectorInstances.length;

        // get items from actives selectors
        for (var j in selectorInstances) {
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

        selectorInstances = [];

        for (var key in selectors) {

            // selector factory constructor
            var Factory = $injector.get(selectors[key].name);

            // initialize one selector instance
            // for each element in the array
            for (var j in selectors[key].options.instances) {
                var sel = new Factory(selectors[key].options.instances[j]);
                selectorInstances.push(sel);
            }
        }
        selectorsManager.log('Init, add selectors instances', selectorInstances);
    };

    // when the selector factory is load run this method
    // another component (client) should inject the singles selector factory 
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