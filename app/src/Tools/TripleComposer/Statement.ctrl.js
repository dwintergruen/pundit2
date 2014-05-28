angular.module('Pundit2.TripleComposer')
.controller('StatementCtrl', function($scope, $element, TypesHelper, ResourcePanel, NameSpace) {

    // default values
    $scope.subjectLabel = '';
    $scope.subjectTypeLabel = '';
    $scope.subjectFound = false;
    $scope.subjectSearch = "search subject";
    $scope.subjectIcon = 'pnd-icon-search'; //'pnd-icon-times'

    $scope.predicateLabel = '';
    $scope.predicateFound = false;
    $scope.predicateSearch = "search predicate";
    $scope.predicateIcon = 'pnd-icon-search'; //'pnd-icon-times'

    $scope.objectLabel = '';
    $scope.objectTypeLabel = '';
    $scope.objectFound = false;
    $scope.objectSearch = "search object";
    $scope.objectIcon = 'pnd-icon-search'; //'pnd-icon-times'
    $scope.objectLiteral = false;

    // reference to the items used inside this statement
    var triple = {
        subject: null,
        predicate: null,
        object: null
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
        return angular.copy(triple);
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
            $scope.objectLabel = triple.object.label;
            $scope.objectTypeLabel = TypesHelper.getLabel(triple.object.type[0]);
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
        ResourcePanel.showItemsForSubject($event.pageX, $event.pageY, [], $event.target).then(function(item){
            $scope.subjectLabel = item.label;
            $scope.subjectTypeLabel = TypesHelper.getLabel(item.type[0]);
            $scope.subjectFound = true;
            triple.subject = item;
        });
    };

    $scope.onClickPredicate = function($event){
        ResourcePanel.showProperties($event.pageX, $event.pageY, [], $event.target).then(function(item){
            $scope.predicateLabel = item.label;
            $scope.predicateFound = true;
            triple.predicate = item;
        });
    };

    $scope.onClickObject = function($event){
        ResourcePanel.showItemsForObject($event.pageX, $event.pageY, [], $event.target).then(function(item){
            $scope.objectLabel = item.label;
            $scope.objectTypeLabel = TypesHelper.getLabel(item.type[0]);
            $scope.objectFound = true;
            triple.object = item;
        });
    };

    $scope.onClickObjectCalendar = function($event){
        ResourcePanel.showPopoverCalendar($event.pageX, $event.pageY, undefined, $event.target).then(function(date){
            // TODO need to convert date, new Item(date)
        });
    };

    $scope.onClickObjectLiteral = function($event){
        ResourcePanel.showPopoverLiteral($event.pageX, $event.pageY, '', $event.target).then(function(text){
            $scope.objectFound = true;
            $scope.objectLabel = text;
            $scope.objectTypeLabel = TypesHelper.getLabel(NameSpace.rdfs.literal);
            $scope.objectLiteral = true;
            // TODO need to convert literal, new Item(text)
        });
    };


});