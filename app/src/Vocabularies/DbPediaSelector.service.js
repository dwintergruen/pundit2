angular.module('Pundit2.Vocabularies')
.service('DbPediaSelector', function(BaseComponent, NameSpace, $http) {

    var dbPediaSelector = new BaseComponent('DbPediaSelector');

    return dbPediaSelector;

});