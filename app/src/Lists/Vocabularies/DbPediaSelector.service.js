angular.module('Pundit2.Vocabularies')
.constant('DBPEDIASELECTORDEFAULTS', {

    dbpediaKeywordSearchURL: "http://lookup.dbpedia.org/api/search.asmx/KeywordSearch",

    limit: 1,

    debug: true

})
.service('DbPediaSelector', function(BaseComponent, DBPEDIASELECTORDEFAULTS, NameSpace, $http) {

    var dbPediaSelector = new BaseComponent('DbPediaSelector', DBPEDIASELECTORDEFAULTS);

    return dbPediaSelector;

});