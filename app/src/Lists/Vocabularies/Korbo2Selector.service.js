angular.module('Pundit2.Vocabularies')
.constant('KORBO2DEFAULTS', {

    /**
     * @module punditConfig
     * @ngdoc property
     * @name modules#Korbo2Selector
     *
     * @description
     * `object`
     *
     * Configuration object for Korbo2Selector module. This factory can be instantiate
     * more times and query items from korbo.
     */

    /**
     * @module punditConfig
     * @ngdoc property
     * @name modules#Korbo2Selector.active
     *
     * @description
     * `boolean`
     *
     * Enable or disable all korbo selectors instances. Only active vocabularies are added to selectorsManager
     * and can query the relative database (setting active to false vocabulary is also removed from the interface).
     *
     * Default value:
     * <pre> active: true </pre>
     */
    active: true,

    /**
     * @module punditConfig
     * @ngdoc property
     * @name modules#Korbo2Selector.limit
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
     * @name modules#Korbo2Selector.instances
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
     *       container: 'korbo2',
     *       // instance label tab title
     *       label: 'Korbo2',
     *       // enable or disable the instance
     *       active: true
     *   }
     * ] </pre>
     */
    instances: [
        {
            // where items is stored inside itemsExchange service
            container: 'korbo2',
            // instance label tab title
            label: 'Korbo2',
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
     * @name modules#Korbo2Selector.debug
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
.factory('Korbo2Selector', function(BaseComponent, KORBO2DEFAULTS, Item, ItemsExchange, SelectorsManager,
                                            $http, $q) {

    var korbo2Selector = new BaseComponent('Korbo2Selector', KORBO2DEFAULTS);
    korbo2Selector.name = 'Korbo2Selector';

    // add this selector to selector manager
    // then the configured instances are read an instantiated
    if (korbo2Selector.options.active) {
        SelectorsManager.addSelector(korbo2Selector);
    }

    // selector instance constructor
    var Korbo2Factory = function(config){
        this.config = config;
    };

    Korbo2Factory.prototype.getItems = function(term){
        var self = this,
            promise = $q.defer(),
            container = self.config.container + term.split(' ').join('$');
            // TODO se basketID è null non aggiungerlo tra i parametri, altrimenti passarlo nell'oggetto params
            var params = {
                q: term,
                p: 'korbo',
                limit: korbo2Selector.options.limit,
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
                korbo2Selector.log('Http success, get items '+self.config.label, res.data);

                if (res.data.length === 0) {
                    korbo2Selector.log('Empty response');
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
                korbo2Selector.log('Http Error');
                promise.resolve();
            });

        return promise.promise;

    };

    Korbo2Factory.prototype.push = function(config){
        korbo2Selector.options.instances.push(config);
    }

    korbo2Selector.log('Factory init');

    return Korbo2Factory;

});