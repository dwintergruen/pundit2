angular.module('Pundit2.ResourcePanel')

.directive('calendarDateFormat', function($filter) {
    // TODO: block the insertion of invalid characters

    return {
        require: 'ngModel',
        link: function(scope, element, attrs, ngModelController) {
            var dateFormat = 'yyyy-MM-dd';

            // //view format -> model format
            // ngModelController.$parsers.push(function(data) {
            //     return data;
            // });

            // model format -> view format
            ngModelController.$formatters.push(function(modelValue) {
                var isModelADate = angular.isDate(modelValue);
                ngModelController.$setValidity('datefield', isModelADate);

                return isModelADate ? $filter('date')(modelValue, dateFormat) : NaN;
            });
        }
    }
});