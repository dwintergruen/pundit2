angular.module('Pundit2.Vocabularies')
.constant('MURUCASELECTORDEFAULTS', {

    murucaReconURL: 'http://demo2.galassiaariosto.netseven.it/backend.php/reconcile',
    // 'http://demo2.galassiaariosto.netseven.it/reconcile',
    // 'http://dev.galassiaariosto.netseven.it/backend.php/reconcile',

    //queryType: '',
    queryType: 'http://purl.org/galassiariosto/types/Azione',
    queryProperties: {},

    // TODO server support query limit ?
    limit: 1,

    container: 'Muruca',

    debug: true

})
.service('MurucaSelector', function(BaseComponent, MURUCASELECTORDEFAULTS, SelectorsManager, $http) {

    var murucaSelector = new BaseComponent('MurucaSelector', MURUCASELECTORDEFAULTS);
    murucaSelector.label = 'murucaSelector';

    var exampleQuery = "spada";

    SelectorsManager.addSelector(murucaSelector);

    murucaSelector.getItems = function(callback){

        var config = {
            params: {
                query: angular.toJson({
                    query: exampleQuery,
                    type: murucaSelector.options.queryType,
                    properties: murucaSelector.options.queryProperties
                })
            }
        };

        $http.jsonp(murucaSelector.options.murucaReconURL+"?jsonp=JSON_CALLBACK", config)
            .success(function(data){

                murucaSelector.log('Http success, get items from muruca', data);

                murucaSelector.getItemsDetails(data.result);

            });

    };

    murucaSelector.getItemsDetails = function(result){

        var punditItem = [];

        for (var i=0; i<result.length; i++) {
            var current = result[i];

            var item = {
                label: current.name, 
                value: current.resource_url,
                type: []
            };

            murucaSelector.log('Loading metadata for item '+ item.value);

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

            punditItem.push(item);

        }

        murucaSelector.log('Complete parsing for items ', punditItem);

    };

    return murucaSelector;

});