angular.module('Pundit2.TripleComposer')
.controller('StatementCtrl', function($scope, $element, TypesHelper, ResourcePanel, NameSpace) {

    // default values
    $scope.subjectLabel = '';
    $scope.subjectTypeLabel = '';
    $scope.subjectFound = false;
    $scope.subjectSearch = "";
    $scope.subjectIcon = 'pnd-icon-search'; //'pnd-icon-times'

    $scope.predicateLabel = '';
    $scope.predicateFound = false;
    $scope.predicateSearch = "";
    $scope.predicateIcon = 'pnd-icon-search'; //'pnd-icon-times'

    $scope.objectLabel = '';
    $scope.objectTypeLabel = '';
    $scope.objectFound = false;
    $scope.objectSearch = "";
    $scope.objectIcon = 'pnd-icon-search'; //'pnd-icon-times'
    $scope.objectLiteral = false;

    // reference to the items used inside this statement
    var triple = {
        subject: null,
        predicate: null,
        object: null
    };

    var buildUrisArray = function(){
        var res = [];

        if (triple.subject!==null) {
            res.push(triple.subject.uri);
        } else {
            res.push('');
        }
        if (triple.predicate!==null) {
            res.push(triple.predicate.uri);
        } else {
            res.push('');
        }
        if (triple.object!==null) {
            res.push(triple.object.uri);
        } else {
            res.push('');
        }

        return res;
    };

    // remove statement directive
    $scope.remove = function() {
        $scope.tripleComposerCtrl.removeStatement($scope.id);
    };

    // make a copy of this statement (TODO if it's empty ???)
    // and add it to the statements array inside triple composer
    $scope.duplicate = function(){
        $scope.tripleComposerCtrl.duplicateStatement($scope.id);
    };

    // copy the actual triple (invoked inside link function)
    $scope.copy = function(){
        var res = angular.copy(triple);
        if ($scope.objectDate) {
            res.isDate = true;
        }
        if ($scope.objectLiteral) {
            res.isLiteral = true;
        }
        return res;
    };

    $scope.get = function(){
        return triple;
    };

    // read the duplicated property inside scope (this property is owned by the statement tha born by duplication)
    // then add the label value to the relative scope properties
    // this function should be invoked only one time (in the link function)
    // when you duplicate a statement, elsewhere probably is an error
    $scope.init = function(){
        
        triple = $scope.duplicated;
        delete $scope.duplicated;

        if (triple.subject !== null) {
            $scope.subjectLabel = triple.subject.label;
            $scope.subjectTypeLabel = TypesHelper.getLabel(triple.subject.type[0]);
            $scope.subjectFound = true;
        }
        if (triple.predicate !== null) {
            $scope.predicateLabel = triple.predicate.label;
            $scope.predicateFound = true;
        }
        if (triple.object !== null) {
            if (typeof(triple.object) === 'string'){
                // date or literal item
                $scope.objectLabel = triple.object;
                if (triple.isDate) {
                    $scope.objectTypeLabel = TypesHelper.getLabel(NameSpace.dateTime);
                }
                if (triple.isLiteral){
                    $scope.objectTypeLabel = TypesHelper.getLabel(NameSpace.rdfs.literal);
                }
                                
            } else {
                // standard item
                $scope.objectLabel = triple.object.label;
                $scope.objectTypeLabel = TypesHelper.getLabel(triple.object.type[0]);
            }
            $scope.objectFound = true;
            
        }
        
    };

    // reset scope to default
    $scope.wipe = function(){ 
        $scope.wipeSubject();
        $scope.wipePredicate(); 
        $scope.wipeObject();
    };

    $scope.wipeSubject = function(){
        $scope.subjectLabel = '';
        $scope.subjectTypeLabel = '';
        $scope.subjectFound = false;
        $scope.subjectSearch = "search subject";
        $scope.subjectIcon = 'pnd-icon-search';
        triple.subject = null;
    };

    $scope.wipePredicate = function(){
        $scope.predicateLabel = '';
        $scope.predicateFound = false;
        $scope.predicateSearch = "search predicate";
        $scope.predicateIcon = 'pnd-icon-search';
        triple.predicate = null;
    };

    $scope.wipeObject = function(){
        $scope.objectLabel = '';
        $scope.objectTypeLabel = '';
        $scope.objectFound = false;
        $scope.objectSearch = "search object";
        $scope.objectIcon = 'pnd-icon-search';
        $scope.objectLiteral = false;
        triple.object = null; 
    };


    $scope.onClickSubject = function($event){
        ResourcePanel.showItemsForSubject(buildUrisArray(), $event.target, '').then(function(item){
            $scope.subjectLabel = item.label;
            $scope.subjectTypeLabel = TypesHelper.getLabel(item.type[0]);
            $scope.subjectFound = true;
            triple.subject = item;
        });
    };

    $scope.onClickPredicate = function($event){
        ResourcePanel.showProperties(buildUrisArray(), $event.target, '').then(function(item){
            $scope.predicateLabel = item.label;
            $scope.predicateFound = true;
            triple.predicate = item;
        });
    };

    $scope.onClickObject = function($event){
        
        ResourcePanel.showItemsForObject(buildUrisArray(), $event.target, '').then(function(item){

            $scope.objectFound = true;
            triple.object = item;
            
            if (typeof(item) === 'string') {
                // literal item
                $scope.objectLabel = item;
                $scope.objectTypeLabel = TypesHelper.getLabel(NameSpace.rdfs.literal);
                $scope.objectLiteral = true;
            } else if( item instanceof Date) {
                // date item
                triple.object = item.toString();
                $scope.objectLabel = triple.object;
                $scope.objectTypeLabel = TypesHelper.getLabel(NameSpace.dateTime);
                $scope.objectDate = true;
            } else {
                // standard item
                $scope.objectLabel = item.label;
                $scope.objectTypeLabel = TypesHelper.getLabel(item.type[0]);
            }
            
        });
    };

    $scope.onClickObjectCalendar = function($event){
        ResourcePanel.showPopoverCalendar(undefined, $event.target).then(function(date){
            triple.object = date.toString();
            $scope.objectLabel = triple.object;
            $scope.objectTypeLabel = TypesHelper.getLabel(NameSpace.dateTime);
            $scope.objectDate = true;
            $scope.objectFound = true;
        });
    };

    $scope.onClickObjectLiteral = function($event){
        ResourcePanel.showPopoverLiteral('', $event.target).then(function(text){
            $scope.objectFound = true;
            $scope.objectLabel = text;
            $scope.objectTypeLabel = TypesHelper.getLabel(NameSpace.rdfs.literal);
            $scope.objectLiteral = true;
            triple.object = text;
        });
    };


});