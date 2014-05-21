angular.module('Pundit2.Vocabularies')
.constant('MURUCASELECTORDEFAULTS', {

    murucaReconURL: 'http://dev.galassiaariosto.netseven.it/backend.php/reconcile',

    queryType: '',
    queryProperties: {},

    limit: 1,

    debug: true

})
.service('MurucaSelector', function(BaseComponent, MURUCASELECTORDEFAULTS, $http) {

    var murucaSelector = new BaseComponent('MurucaSelector', MURUCASELECTORDEFAULTS);

    var exampleQuery = "Jimi Hendrix";

    var output = null;

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
            murucaSelector.err('Cant get items from muruca: ', msg);
        });

    };

    return murucaSelector;

});