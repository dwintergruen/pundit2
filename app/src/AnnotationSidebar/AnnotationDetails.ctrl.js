/*jshint strict: false*/

angular.module('Pundit2.AnnotationSidebar')
.controller('AnnotationDetailsCtrl', function($scope, AnnotationSidebar, AnnotationDetails, 
        AnnotationsExchange, ItemsExchange, TypesHelper) {

    $scope.isAnnotationExpanded = false;
    
    var annotation = AnnotationsExchange.getAnnotationById($scope.id);
    // console.log($scope.annotation.id);

    var first;
    for (first in annotation.graph){
        break;
    }

    var mainItem = ItemsExchange.getItemByUri(first);
    // $scope.annotationLabel = annotation.items[first].label;
    $scope.annotationLabel = mainItem.label;
    $scope.annotationClass = mainItem.getClass();
    $scope.annotationIcon = mainItem.getIcon();
    $scope.itemTypeLabel = TypesHelper.getLabel(mainItem.type[0]);


    var getTypesLabel = function(types) {
        var results = []
        for (var i in types){
            var typeLabel = TypesHelper.getLabel(types[i]);
            if(results.indexOf(typeLabel) === -1){
                results.push(typeLabel);
            }
        }
        return results;
    };

    $scope.items = [];
    for (var key in annotation.items){
        var item = ItemsExchange.getItemByUri(key);
        $scope.items.push({
            label: item.label,
            class: item.getClass(),
            description: item.description,
            icon: item.getIcon(),
            type: TypesHelper.getLabel(item.type[0]),
            types: getTypesLabel(item.type)
        });
    }

    AnnotationDetails.log('Controller Details Run');
});