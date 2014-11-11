angular.module('Pundit2.Vocabularies')
.constant('GEONAMESDEFAULTS', {

    /**
     * @module punditConfig
     * @ngdoc property
     * @name modules#GeonamesSelector
     *
     * @description
     * `object`
     *
     * Configuration object for geonamesSelector module. This factory can be instantiate
     * more times and query items from Geonames through Korbo.
     */

    /**
     * @module punditConfig
     * @ngdoc property
     * @name modules#GeonamesSelector.active
     *
     * @description
     * `boolean`
     *
     * Enable or disable all geonames selectors instances. Only active vocabularies are added to selectorsManager
     * and can query the relative database (setting active to false vocabulary is also removed from the interface).
     *
     * Default value:
     * <pre> active: false </pre>
     */
    active: false,

    /**
     * @module punditConfig
     * @ngdoc property
     * @name modules#GeonamesSelector.limit
     *
     * @description
     * `number`
     *
     * Maximum number of items taken from the vocabulary inside search http call.
     *
     * Default value:
     * <pre> limit: 15 </pre>
     */
    limit: 15,

    //url: 'http://dev.korbo2.org/v1',

    //language: 'en',

    /**
     * @module punditConfig
     * @ngdoc property
     * @name modules#GeonamesSelector.instances
     *
     * @description
     * `Array of object`
     *
     * Array of korbo instances, each object in the array allows you to add and configure 
     * an instance of the vocabulary. By default, the vocabulary has only one instance.
     * Each instance has its own tab in the interface, with its list of items.
     * 
     *
     * Default value:
     * <pre> instances: [
     *   {
     *       // where items is stored inside itemsExchange service
     *       container: 'geonames',
     *       // instance label tab title
     *       label: 'Geonames',
     *       // enable or disable the instance
     *       active: true
     *   }
     * ] </pre>
     */
    instances: [
        {
            // where items is stored inside itemsExchange service
            container: 'geonames',
            // instance label tab title
            label: 'Geonames',
            // enable or disable the instance
            active: true,

            basketID: null,
            url: 'http://dev.korbo2.org/v1',
            language: 'en'
        }
    ],

    /**
     * @module punditConfig
     * @ngdoc property
     * @name modules#GeonamesSelector.debug
     *
     * @description
     * `number`
     *
     * Active debug log for this module
     *
     * Default value:
     * <pre> debug: false </pre>
     */
    debug: false

})
.factory('GeonamesSelector', function(BaseComponent, GEONAMESDEFAULTS, Item, ItemsExchange, SelectorsManager,
                                            $http, $q) {

    var geonamesSelector = new BaseComponent('GeonamesSelector', GEONAMESDEFAULTS);
    geonamesSelector.name = 'GeonamesSelector';


    // add this selector to selector manager
    // then the configured instances are read an instantiated
    if (geonamesSelector.options.active) {
        SelectorsManager.addSelector(geonamesSelector);
    }

    // selector instance constructor
    var GeonamesFactory = function(config){
        this.config = config;
    };

    GeonamesFactory.prototype.getItems = function(term){
        var self = this,
            promise = $q.defer(),
            container = self.config.container + term.split(' ').join('$');
            // TODO se basketID è null non aggiungerlo tra i parametri, altrimenti passarlo nell'oggetto params
            var params = {
                q: term,
                p: 'geonames',
                limit: geonamesSelector.options.limit,
                offset: 0,
                lang: self.config.language
            };

            if(self.config.basketID !== null){
                params.basketId = self.config.basketID;
            }

            $http({
                //headers: { 'Content-Type': 'application/json' },
                method: 'GET',
                url: self.config.url + "/search/items",
                cache: false,
                params: params

            }).success(function(res){
                geonamesSelector.log('Http success, get items '+self.config.label, res.data);

                if (res.data.length === 0) {
                    geonamesSelector.log('Empty response');
                    ItemsExchange.wipeContainer(container);
                    // promise is always resolved
                    promise.resolve();
                    return;
                }

                ItemsExchange.wipeContainer(container);

                for (var i=0; i<res.data.length; i++) {
                    var current = res.data[i];

                    var item = {
                        label: current.label,
                        uri: current.uri,
                        type: current.type
                    };
                    // optional propeties
                    if (current.depiction !== "") {
                        item.image = current.depiction;
                    }
                    if (current.abstract !== "") {
                        item.description = current.abstract;
                    }

                    // add to itemsExchange
                    ItemsExchange.addItemToContainer(new Item(item.uri, item), container);
                }

                promise.resolve();
            }).error(function(){
                geonamesSelector.log('Http Error');
                promise.resolve();
            });

        return promise.promise;

    };

    GeonamesFactory.prototype.push = function(config){
        geonamesSelector.options.instances.push(config);
    };

    geonamesSelector.log('Factory init');

    return GeonamesFactory;

});