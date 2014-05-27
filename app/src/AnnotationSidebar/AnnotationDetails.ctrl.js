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
    $scope.annotationClass = AnnotationDetails.getItemClass(mainItem);
    $scope.annotationIcon = AnnotationDetails.getItemIcon(mainItem);
    $scope.itemTypeLabel = TypesHelper.getLabel(mainItem.type[0]);


    var getTypesLabel = function(types) {
        var results = []
        for (var i in types){
            results.push(TypesHelper.getLabel(types[i]));
        }
        return results;
    };

    $scope.items = [];
    for (var key in annotation.items){
        var item = ItemsExchange.getItemByUri(key);
        $scope.items.push({
            label: item.label,
            class: AnnotationDetails.getItemClass(item),
            description: item.description,
            icon: AnnotationDetails.getItemIcon(item),
            type: TypesHelper.getLabel(item.type[0]),
            types: getTypesLabel(item.type)
        });
    }

    AnnotationDetails.log('Controller Details Run');
});