angular.module('Pundit2.Vocabularies')
.constant('MURUCASELECTORDEFAULTS', {

    murucaReconURL: 'http://demo2.galassiaariosto.netseven.it/backend.php/reconcile',
    // 'http://demo2.galassiaariosto.netseven.it/reconcile',
    // 'http://dev.galassiaariosto.netseven.it/backend.php/reconcile',

    // queryType: '',
    queryType: 'http://purl.org/galassiariosto/types/Azione',
    queryProperties: {},

    // TODO server support query limit ?
    limit: 1,

    container: 'muruca',

    debug: true

})
.service('MurucaSelector', function(BaseComponent, MURUCASELECTORDEFAULTS, Item, ItemsExchange, SelectorsManager, $http) {

    var murucaSelector = new BaseComponent('MurucaSelector', MURUCASELECTORDEFAULTS);
    murucaSelector.label = murucaSelector.options.container;

    SelectorsManager.addSelector(murucaSelector);

    murucaSelector.getItems = function(term, callback){

        var config = {
            params: {
                query: angular.toJson({
                    query: term,
                    type: murucaSelector.options.queryType,
                    properties: murucaSelector.options.queryProperties
                })
            }
        };

        $http.jsonp(murucaSelector.options.murucaReconURL+"?jsonp=JSON_CALLBACK", config)
            .success(function(data){

                murucaSelector.log('Http success, get items from muruca', data);

                murucaSelector.getItemsDetails(data.result, callback);

            });

    };

    murucaSelector.getItemsDetails = function(result, callback){

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
            ItemsExchange.addItemToContainer(added, murucaSelector.options.container);

        }

        callback();

        murucaSelector.log('Complete items parsing');

    };

    return murucaSelector;

});