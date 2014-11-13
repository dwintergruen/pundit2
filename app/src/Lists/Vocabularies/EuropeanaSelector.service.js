angular.module('Pundit2.Vocabularies')
.constant('EUROPEANADEFAULTS', {

    /**
     * @module punditConfig
     * @ngdoc property
     * @name modules#EuropeanaSelector
     *
     * @description
     * `object`
     *
     * Configuration object for EuropeanaSelector module. This factory can be instantiate
     * more times and query items from Europeana through Korbo.
     */

    /**
     * @module punditConfig
     * @ngdoc property
     * @name modules#EuropeanaSelector.active
     *
     * @description
     * `boolean`
     *
     * Enable or disable all europeana selectors instances. Only active vocabularies are added to selectorsManager
     * and can query the relative database (setting active to false vocabulary is also removed from the interface).
     *
     * Default value:
     * <pre> active: false </pre>
     */
    active: false,

    /**
     * @module punditConfig
     * @ngdoc property
     * @name modules#EuropeanaSelector.limit
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
     * @name modules#EuropeanaSelector.instances
     *
     * @description
     * `Array of object`
     *
     * Array of europeana instances, each object in the array allows you to add and configure 
     * an instance of the vocabulary. By default, the vocabulary has only one instance.
     * Each instance has its own tab in the interface, with its list of items.
     * 
     *
     * Default value:
     * <pre> instances: [
     *   {
     *       // where items is stored inside itemsExchange service
     *       container: 'europeana',
     *       // instance label tab title
     *       label: 'Europeana',
     *       // enable or disable the instance
     *       active: true
     *   }
     * ] </pre>
     */
    instances: [
        {
            // where items is stored inside itemsExchange service
            container: 'europeana',
            // instance label tab title
            label: 'Europeana',
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
     * @name modules#EuropeanaSelector.debug
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
.factory('EuropeanaSelector', function(BaseComponent, EUROPEANADEFAULTS, Item, ItemsExchange, SelectorsManager,
                                            $http, $q) {

    var europeanaSelector = new BaseComponent('EuropeanaSelector', EUROPEANADEFAULTS);
    europeanaSelector.name = 'EuropeanaSelector';


    // add this selector to selector manager
    // then the configured instances are read an instantiated
    if (europeanaSelector.options.active) {
        SelectorsManager.addSelector(europeanaSelector);
    }

    // selector instance constructor
    var EuropeanaFactory = function(config){
        this.config = config;
    };

    EuropeanaFactory.prototype.getItems = function(term){
        var self = this,
            promise = $q.defer(),
            container = self.config.container + term.split(' ').join('$');
            // TODO se basketID è null non aggiungerlo tra i parametri, altrimenti passarlo nell'oggetto params
            var params = {
                q: term,
                p: 'europeana',
                limit: europeanaSelector.options.limit,
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
                europeanaSelector.log('Http success, get items '+self.config.label, res.data);

                if (res.data.length === 0) {
                    europeanaSelector.log('Empty response');
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
                europeanaSelector.log('Http Error');
                promise.resolve();
            });

        return promise.promise;

    };

    EuropeanaFactory.prototype.push = function(config){
        europeanaSelector.options.instances.push(config);
    };

    europeanaSelector.log('Factory init');

    return EuropeanaFactory;

});