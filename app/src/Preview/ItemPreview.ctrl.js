angular.module('Pundit2.Preview')

.controller('ItemPreviewCtrl', function($scope, $timeout, TypesHelper, ItemsExchange, $element, Preview, ImageFragmentAnnotatorHelper) {
    var currentElement = angular.element($element).find(".pnd-annotation-preview-item-container");
    var sticking;
    var imgTempReference;
    $scope.typeHidden = true;
    $scope.isSticky = false;
    $scope.hasImage = false;

    if (typeof($scope.sticking) !== 'undefined') {
        sticking = $scope.sticking;
    } else {
        sticking = false;
    }

    // get the label of a type from his uri
    $scope.getTypeLabel = function(uri) {
        return TypesHelper.getLabel(uri);
    };

    $scope.$watch('uri', function() {
        // TODO: special initialization for certain kind of items, like image fragments?
        $scope.item = ItemsExchange.getItemByUri($scope.uri);
        $scope.typeHidden = true;

        if (typeof($scope.item) !== 'undefined') {
            $scope.hasImage = typeof($scope.item.image) !== 'undefined';
        }

        if (typeof($scope.item) !== 'undefined' && $scope.item.isImageFragment()) {
            // TODO preview must be refactoring !!!!!
            // if there is a sticky item the template is not removed and re-inserted during mouseover
            // if there isn't a sticky item the template is removed and re-inserted during mouserover
            // must be fixed and use only one behaviour
            if (typeof($scope.item.polygon) !== 'undefined') {
                $timeout(function() {
                    // TODO not good idea
                    angular.element($element).find(".pnd-preview-item-image span > svg.pnd-polygon-layer").remove();
                    ImageFragmentAnnotatorHelper.drawPolygonOverImage($scope.item.polygon, imgTempReference);
                    imgTempReference = angular.element($element).find(".pnd-preview-item-image > img");
                }, 50);
            }
        }

        if (sticking) {
            if (Preview.getItemDashboardSticky() !== null && Preview.getItemDashboardSticky().uri === $scope.uri) {
                $scope.isSticky = true;
            } else {
                $scope.isSticky = false;
            }
        }
    });

    $scope.$watch(function() {
        if (typeof(imgTempReference) !== 'undefined') {
            return imgTempReference.width();
        }
    }, function(newWidth, oldWith) {
        if (typeof(newWidth) !== 'undefined') {
            angular.element($element).find(".pnd-preview-item-image span > svg.pnd-polygon-layer").remove();
            ImageFragmentAnnotatorHelper.drawPolygonOverImage($scope.item.polygon, imgTempReference);
        }
    });

    $scope.$watch(function() {
        return currentElement.find('li.pnd-preview-single-type').css('width');
    }, function() {
        var liList;

        // if preview sticky item,
        if ($scope.isSticky && sticking) {
            $scope.typeHiddenPresent = $scope.prev;

        } else {

            liList = currentElement.find('div.pnd-preview-item-types').children('ul.pnd-preview-item-types-ul').children('li:not(.pnd-is-sticky)');

            // get <ul> width containing types
            var luWidth = parseInt(currentElement.find('div.pnd-preview-item-types').children('ul.pnd-preview-item-types-ul').css('width'), 10);

            // get height (with margin) of single <li> element
            var heightLiSingle = currentElement.find(liList[0]).outerHeight(true);

            // get div where types are shown
            var divTypes = currentElement.find('div.pnd-preview-item-types');

            // get padding div below type. It need to calculate the right height for div where types are shown
            var prevDivPadding = 0;
            if (currentElement.find('.pnd-preview-item-image').length > 0) {
                prevDivPadding = parseInt(currentElement.find('.pnd-preview-item-image').css('padding-top'), 10);
            } else if (currentElement.find('.pnd-preview-item-description').length > 0) {
                prevDivPadding = parseInt(currentElement.find('.pnd-preview-item-description').css('padding-top'), 10);

            }

            // set div types height
            var h = heightLiSingle + prevDivPadding;
            divTypes.css({
                'height': h
            });

            $scope.heigthTypesDiv = h;
            checkFitTypes(liList, luWidth);

        }

    });

    // when change width panel where preview is shown...
    var divPndPreview = currentElement.find('div.pnd-preview');
    $scope.$watch(function() {
        return divPndPreview.width();
    }, function() {
        // ... update types visible and not
        var liList = currentElement.find('div.pnd-preview-item-types').children('ul.pnd-preview-item-types-ul').children('li');
        var luWidth = currentElement.find('div.pnd-preview-item-types').children('ul.pnd-preview-item-types-ul').width();
        checkFitTypes(liList, luWidth);
    });

    // check if there is at least a type that doesn't fit in <ul> width
    // set a flag in itemPreview scope
    var checkFitTypes = function(typeList, ulWidth) {
        // store current state. It is used when show types of sticky element
        $scope.prev = $scope.typeHiddenPresent;
        var tmpWidth = 0,
            // offset for caret icon
            offset = 30,
            widthToFit = ulWidth - offset,
            w;

        // for each types
        for (var i = 0; i < typeList.length; i++) {
            // get width of <li> element and check if fit in <ul> width
            w = parseInt(currentElement.find(typeList[i]).css('width'), 10) + tmpWidth;
            if (w > widthToFit) {

                $scope.typeHiddenPresent = true;
                return true;

            } else {
                tmpWidth = w;
            }
        }

        $scope.typeHiddenPresent = false;
        return false;
    };


    // hide/show types
    $scope.showAlltypes = function() {
        // get div where types list is shown
        var div = currentElement.find('div.pnd-preview-item-types');

        // get current height of div where types list is shown
        var divHeight = currentElement.find('div.pnd-preview-item-types').height();

        // toggle types visibility

        // set height to auto to show all types
        // and set flag typeHidden to show right caret icon
        if (divHeight === $scope.heigthTypesDiv) {
            $scope.typeHidden = false;
            div.css({
                'height': 'auto'
            });
        } else {
            // set height to fixed height, in this way show only few types
            // and set flag typeHidden to show right caret icon
            $scope.typeHidden = true;
            div.css({
                'height': $scope.heigthTypesDiv
            });
        }
    };

});