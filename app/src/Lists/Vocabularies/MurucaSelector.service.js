angular.module('Pundit2.Vocabularies')
.constant('MURUCASELECTORDEFAULTS', {

    // common configuration
    murucaReconURL: 'http://demo2.galassiaariosto.netseven.it/backend.php/reconcile',
    // 'http://demo2.galassiaariosto.netseven.it/reconcile',
    // 'http://dev.galassiaariosto.netseven.it/backend.php/reconcile',
    queryProperties: {},
    // enable or disable all muruca selectors instances
    active: true,
    // max number of items
    limit: 5,

    // singles instances configuration
    instances: [
        {
            // query type
            queryType: '',
            // where put items inside items exchange
            container: 'muruca',
            // used how tab title
            label: 'Muruca',
            // true if this instace do the query
            active: true
        }
    ],    

    debug: true

})
.factory('MurucaSelector', function(BaseComponent, MURUCASELECTORDEFAULTS, Item, ItemsExchange, SelectorsManager, $http) {

    var murucaSelector = new BaseComponent('MurucaSelector', MURUCASELECTORDEFAULTS);
    murucaSelector.name = 'MurucaSelector';

    // add this selector to selector manager
    // then the configured instances are read an instantiated
    if (murucaSelector.options.active) {
        SelectorsManager.addSelector(murucaSelector);
    }

    // muruca selector instance constructor
    var MurucaFactory = function(config){
        this.config = config;
    };

    MurucaFactory.prototype.getItems = function(term, callback){
        var self = this;

        ItemsExchange.wipeContainer(self.config.container);

        var config = {
            params: {
                query: angular.toJson({
                    query: term,
                    type: self.config.queryType,
                    properties: murucaSelector.options.queryProperties,
                    limit: murucaSelector.options.limit
                })
            }
        };

        $http.jsonp(murucaSelector.options.murucaReconURL+"?jsonp=JSON_CALLBACK", config)
            .success(function(data){

                murucaSelector.log('Http success, get items from muruca '+self.config.label, data);

                self.getItemsDetails(data.result, callback);

            });

    };

    MurucaFactory.prototype.getItemsDetails = function(result, callback){

        var self = this;

        for (var i=0; i<result.length; i++) {
            var current = result[i];

            var item = {
                label: current.name, 
                uri: current.resource_url,
                type: []
            };

            murucaSelector.log('Loading metadata for item '+ item.uri);

            if ('description' in current) {
                item.description = current.description;
            }
                
            if (('type' in current) && ('length' in current.type)) {
                for (var j = current.type.length; j--;) {
                    if (typeof(current.type[j]) === 'string') {
                        // add type to item
                        item.type.push(current.type[j]);
                    }
                    else {
                        murucaSelector.log('ERROR: Weird type is weird? '+typeof(current.type[j])+': '+current.type[j]);
                    }
                }
            }

            var added = new Item(item.uri, item);
            ItemsExchange.addItemToContainer(added, self.config.container);

        }

        callback();

        murucaSelector.log('Complete items parsing');

    };

    murucaSelector.log('Factory init');

    return MurucaFactory;

});