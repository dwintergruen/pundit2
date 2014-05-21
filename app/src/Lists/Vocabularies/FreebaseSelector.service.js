angular.module('Pundit2.Vocabularies')
.service('FreebaseSelector', function(BaseComponent, NameSpace, $http) {

    var freebaseSelector = new BaseComponent('FreebaseSelector');

    return freebaseSelector;

});