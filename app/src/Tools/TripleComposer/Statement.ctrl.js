angular.module('Pundit2.TripleComposer')

.controller('StatementCtrl', function($scope, $element,
    TypesHelper, ContextualMenu, ResourcePanel, NameSpace, 
    TripleComposer, Toolbar, Preview, EventDispatcher) {

    // default values
    $scope.subjectLabel = '';
    $scope.subjectTypeLabel = '';
    $scope.subjectFound = false;
    // fixed by template
    $scope.subjectFixed = false;

    $scope.predicateLabel = '';
    $scope.predicateFound = false;
    // fixed by template
    $scope.predicateFixed = false;

    $scope.objectLabel = '';
    $scope.objectTypeLabel = '';
    $scope.objectFound = false;
    $scope.objectLiteral = false;
    // fixed by template
    $scope.objectFixed = false;

    $scope.canBeObjectDate = true;
    $scope.canBeObjectLiteral = true;

    // true when pundit is in template mode
    $scope.templateMode;

    // if is true the triple must be completed before save annotation (in template mode)
    // if is false the triple can not ben completed and when save the annotation
    // the triple simply is skipped and not included
    $scope.isMandatory = true;

    if (TripleComposer.getStatements().length < 2) {
        ContextualMenu.modifyHeaderActionByName('removeTriple', true);
    } else {
        ContextualMenu.modifyHeaderActionByName('removeTriple', false);
    }

    // reference to the items used inside this statement
    var triple = {
        subject: null,
        predicate: null,
        object: null
    };

    var lastDate;

    // tripleProperty, es. object of triple
    // predicateProperty, es. range of predicate
    var checkPredicateTolerance = function(triplePropertyName, predicatePropertyName) {
        if (triple.predicate === null) {
            return;
        }

        var tripleProperty = triple[triplePropertyName];
        var predicateProperty = triple.predicate[predicatePropertyName];

        // predicate check
        if (typeof(predicateProperty) === 'undefined') {
            return;
        }
        if (predicateProperty.length < 1) {
            return;
        }
        // property check
        if (typeof(tripleProperty) === 'undefined') {
            return;
        }
        if (tripleProperty === null) {
            return;
        }
        if (typeof(tripleProperty.type) === 'undefined') {
            return;
        }
        if (tripleProperty.type.length < 1) {
            $scope.wipePredicate();
            return;
        }

        var check = false;
        var types = tripleProperty.type;
        angular.forEach(predicateProperty, function(itm) {
            for (var i = 0; i < types.length; i++) {
                if (types[i] === itm) {
                    check = true;
                    return;
                }
            }
        });

        if (!check) {
            $scope.wipePredicate();
        }
    };

    var parseDate = function(date) {
        var month = date.getMonth() + 1,
            day = date.getDate();

        if (month < 10) {
            month = "0" + month;
        }
        if (day < 10) {
            day = "0" + day;
        }
        return date.getFullYear() + "-" + month + "-" + day;
    };

    $scope.isStatementComplete = function() {
        if (triple.subject !== null && triple.predicate !== null && triple.object !== null) {
            return true;
        } else {
            return false;
        }
    };

    $scope.isStatementEmpty = function() {
        if ((triple.subject !== null && !$scope.subjectFixed) ||
            (triple.predicate !== null && !$scope.predicateFixed) ||
            (triple.object !== null && !$scope.objectFixed)) {
            return false;
        } else {
            return true;
        }
    };

    // remove statement directive
    $scope.remove = function() {
        ResourcePanel.hide();
        $scope.tripleComposerCtrl.removeStatement($scope.id);
    };

    // make a copy of this statement (TODO if it's empty ???)
    // and add it to the statements array inside triple composer
    $scope.duplicate = function() {
        ResourcePanel.hide();
        $scope.tripleComposerCtrl.duplicateStatement($scope.id);
    };

    // copy the actual triple (invoked inside link function)
    $scope.copy = function() {
        var res = angular.copy(triple);
        if ($scope.objectDate) {
            res.isDate = true;
        }
        if ($scope.objectLiteral) {
            res.isLiteral = true;
        }
        return res;
    };

    $scope.get = function() {
        return triple;
    };

    // reset scope to default
    $scope.wipe = function() {
        $scope.wipeSubject();
        $scope.wipePredicate();
        $scope.wipeObject();
        Preview.clearItemDashboardSticky();
        EventDispatcher.sendEvent('Pundit.changeSelection');
    };

    $scope.wipeSubject = function() {
        $scope.subjectLabel = '';
        $scope.subjectTypeLabel = '';
        $scope.subjectFound = false;
        $scope.subjectFixed = false;
        triple.subject = null;
        ResourcePanel.hide();
        angular.element('.pnd-triplecomposer-save').addClass('disabled');
        $scope.tripleComposerCtrl.isTripleErasable();
        Preview.clearItemDashboardSticky();
        EventDispatcher.sendEvent('Pundit.changeSelection');
    };

    $scope.wipePredicate = function() {
        $scope.predicateLabel = '';
        $scope.predicateFound = false;
        $scope.canBeObjectDate = true;
        $scope.canBeObjectLiteral = true;
        $scope.predicateFixed = false;
        triple.predicate = null;
        ResourcePanel.hide();
        angular.element('.pnd-triplecomposer-save').addClass('disabled');
        $scope.tripleComposerCtrl.isTripleErasable();
        Preview.clearItemDashboardSticky();
        EventDispatcher.sendEvent('Pundit.changeSelection');
    };

    $scope.wipeObject = function() {
        $scope.objectLabel = '';
        $scope.objectTypeLabel = '';
        $scope.objectFound = false;
        $scope.objectLiteral = false;
        $scope.objectDate = false;
        $scope.objectFixed = false;
        triple.object = null;
        ResourcePanel.hide();
        angular.element('.pnd-triplecomposer-save').addClass('disabled');
        $scope.tripleComposerCtrl.isTripleErasable();
        EventDispatcher.sendEvent('Pundit.changeSelection');
    };

    $scope.onSubjectMouseOver = function() {
        Preview.showDashboardPreview(triple.subject);
    };

    $scope.onPredicateMouseOver = function() {
        Preview.showDashboardPreview(triple.predicate);
    };

    $scope.onObjectMouseOver = function() {
        if ($scope.objectDate || $scope.objectLiteral) {
            // literal and date not have a preview
            return;
        }
        Preview.showDashboardPreview(triple.object);
    };

    $scope.onItemMouseOut = function() {
        Preview.hideDashboardPreview();
    };

    $scope.setSubject = function(item, fixed) {
        $scope.subjectLabel = item.label;
        $scope.subjectTypeLabel = TypesHelper.getLabel(item.type[0]);
        $scope.subjectFound = true;
        triple.subject = item;

        if (typeof(fixed) !== 'undefined') {
            $scope.subjectFixed = fixed;
        }

        checkPredicateTolerance('subject', 'domain');

        ResourcePanel.hide();

        $scope.tripleComposerCtrl.isAnnotationComplete();
        $scope.tripleComposerCtrl.isTripleErasable();
        Preview.clearItemDashboardSticky();
    };

    $scope.onClickSubject = function($event) {
        if ($scope.templateMode) {
            if ($scope.subjectFixed || $scope.subjectFound) {
                Preview.setItemDashboardSticky(triple.subject);
            }
            return;
        }
        ResourcePanel.showItemsForSubject(triple, $event.target).then($scope.setSubject);

        if ($scope.subjectFound) {
            EventDispatcher.sendEvent('Pundit.changeSelection');
            Preview.setItemDashboardSticky(triple.subject);
        }
    };

    $scope.setPredicate = function(item, fixed) {
        $scope.predicateLabel = item.label;
        $scope.predicateFound = true;
        triple.predicate = item;

        if (typeof(fixed) !== 'undefined') {
            $scope.predicateFixed = fixed;
        }

        // check predicate range
        if (item.range.indexOf(NameSpace.rdfs.literal) === -1 && item.range.length > 0) {
            $scope.canBeObjectLiteral = false;
        }
        if (item.range.indexOf(NameSpace.dateTime) === -1 && item.range.length > 0) {
            $scope.canBeObjectDate = false;
        }

        ResourcePanel.hide();

        $scope.tripleComposerCtrl.isAnnotationComplete();
        $scope.tripleComposerCtrl.isTripleErasable();
        Preview.clearItemDashboardSticky();
    };

    $scope.onClickPredicate = function($event) {
        if ($scope.templateMode && $scope.predicateFixed) {
            Preview.setItemDashboardSticky(triple.predicate);
            return;
        }
        ResourcePanel.showProperties(triple, $event.target).then($scope.setPredicate);
        if ($scope.predicateFound) {
            EventDispatcher.sendEvent('Pundit.changeSelection');
            Preview.setItemDashboardSticky(triple.predicate);
        }
    };

    $scope.setObject = function(item, fixed) {
        $scope.objectFound = true;

        if (typeof(fixed) !== 'undefined') {
            $scope.objectFixed = fixed;
        }

        triple.object = item;

        if (typeof(item) === 'string') {
            // literal item
            $scope.objectLabel = item;
            $scope.objectTypeLabel = TypesHelper.getLabel(NameSpace.rdfs.literal);
            $scope.objectLiteral = true;
        } else if (item instanceof Date) {
            // date item
            lastDate = item;
            triple.object = parseDate(item);
            $scope.objectLabel = triple.object;
            $scope.objectTypeLabel = TypesHelper.getLabel(NameSpace.dateTime);
            $scope.objectDate = true;
        } else {
            // standard item
            $scope.objectLabel = item.label;
            $scope.objectTypeLabel = TypesHelper.getLabel(item.type[0]);
            checkPredicateTolerance('object', 'range');
        }

        ResourcePanel.hide();

        $scope.tripleComposerCtrl.isAnnotationComplete();
        $scope.tripleComposerCtrl.isTripleErasable();
        Preview.clearItemDashboardSticky();

    };

    $scope.onClickObject = function($event) {
        if ($scope.templateMode && $scope.objectFixed) {
            Preview.setItemDashboardSticky(triple.object);
            return;
        }

        if (triple.object === null || (!$scope.objectLiteral && !$scope.objectDate)) {
            ResourcePanel.showItemsForObject(triple, $event.target).then($scope.setObject);
        } else {
            if ($scope.objectLiteral) {
                $scope.onClickObjectLiteral($event);
            } else if ($scope.objectDate) {
                $scope.onClickObjectCalendar($event);
            }
        }

        if ($scope.objectFound && !$scope.objectLiteral && !$scope.objectDate) {
            EventDispatcher.sendEvent('Pundit.changeSelection');
            Preview.setItemDashboardSticky(triple.object);
        }
    };

    $scope.onClickObjectCalendar = function($event) {
        var d;
        if ($scope.objectDate) {
            d = lastDate;
        } else {
            d = new Date();
        }

        ResourcePanel.showPopoverCalendar(d, $event.target).then(function(date) {
            if (isNaN(date)) {
                return;
            }
            $scope.setObject(date);
        });
    };

    $scope.onClickObjectLiteral = function($event) {
        var str = '';
        if (typeof(triple.object) === 'string') {
            str = triple.object;
        }
        ResourcePanel.showPopoverLiteral(str, $event.target).then($scope.setObject);
    };

    $scope.showDropdown = function(event) {
        var resource = {
            id: $scope.id
        };
        ResourcePanel.hide();
        ContextualMenu.show(event.pageX, event.pageY, resource, TripleComposer.options.cMenuType);
        event.stopPropagation();
    };

    // read the duplicated property inside scope (this property is owned by the statement tha born by duplication)
    // then add the label value to the relative scope properties
    // this function should be invoked only one time (in the link function)
    // when you duplicate a statement, elsewhere probably is an error
    $scope.init = function() {
        triple = $scope.duplicated;
        delete $scope.duplicated;

        if (triple.predicate !== null) {
            $scope.setPredicate(triple.predicate);
        }
        if (triple.subject !== null) {
            $scope.setSubject(triple.subject);
        }
        if (triple.object !== null) {
            if (triple.isDate) {
                $scope.setObject(new Date(triple.object));
            } else {
                $scope.setObject(triple.object);
            }
        }
    };

    $scope.$watch(function() {
        return Toolbar.isActiveTemplateMode();
    }, function(val) {
        $scope.templateMode = val;
    });

});