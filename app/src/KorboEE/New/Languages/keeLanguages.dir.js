angular.module('KorboEE')
    .directive('keeLanguages', function() {

        return {
            restrict: 'EAC',
            scope: true,
            templateUrl: 'src/KorboEE/New/Languages/keeLanguages.dir.tmpl.html',
            controller: 'keeLanguagesCtrl'
        };

    });