angular.module('Pundit2.Vocabularies')
.constant('MURUCASELECTORDEFAULTS', {

    murucaReconURL: 'http://dev.galassiaariosto.netseven.it/backend.php/reconcile',

    queryType: '',
    queryProperties: {},

    limit: 1,

    debug: true

})
.service('MurucaSelector', function(BaseComponent, MURUCASELECTORDEFAULTS, SelectorsManager, $http) {

    var murucaSelector = new BaseComponent('MurucaSelector', MURUCASELECTORDEFAULTS);
    murucaSelector.label = 'murucaSelector';

    var exampleQuery = "Jimi Hendrix";

    var output = null;

    SelectorsManager.addSelector(murucaSelector);

    murucaSelector.getItems = function(el){

        output = el;

        $http({
            method: 'GET',
            url: murucaSelector.options.murucaReconURL,
            params: {
                query: angular.toJson({
                    query: exampleQuery,
                    type: murucaSelector.options.queryType,
                    properties: murucaSelector.options.queryProperties
                })
            },
            withCredentials: true
        }).success(function(data) {

            murucaSelector.log('Http success, get items from muruca', data);

        }).error(function(msg) {
            murucaSelector.err('Error in get items from muruca: ', msg);
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
            // put output inside element (test)
            output.html(JSON.stringify(item, null, "  "));

        }

        murucaSelector.log('Complete parsing for items ', punditItem);

    };

    return murucaSelector;

});