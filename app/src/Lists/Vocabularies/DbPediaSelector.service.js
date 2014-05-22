angular.module('Pundit2.Vocabularies')
.constant('DBPEDIASELECTORDEFAULTS', {

    dbpediaKeywordSearchURL: "http://lookup.dbpedia.org/api/search.asmx/KeywordSearch",

    limit: 1,

    debug: true

})
.service('DbPediaSelector', function(BaseComponent, DBPEDIASELECTORDEFAULTS, NameSpace, SelectorsManager, $http) {

    var dbPediaSelector = new BaseComponent('DbPediaSelector', DBPEDIASELECTORDEFAULTS);
    dbPediaSelector.label = 'dbPediaSelector';

    var exampleQuery = "Jimi Hendrix";

    var output = null;

    SelectorsManager.addSelector(dbPediaSelector);
    
    dbPediaSelector.getItems = function(el){

        output = el;

        $http({
            method: 'GET',
            url: dbPediaSelector.options.dbpediaKeywordSearchURL,
            params: {
                query: exampleQuery,
                limit: dbPediaSelector.options.limit
            }    
        }).success(function(data) {

            dbPediaSelector.log('Http success, get items from DbPedia', data);

        }).error(function(msg) {
            dbPediaSelector.err('Cant get items from DbPedia: ', msg);
        });

    };

    return dbPediaSelector;

});