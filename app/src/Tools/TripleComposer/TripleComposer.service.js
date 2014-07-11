angular.module('Pundit2.TripleComposer')
.constant('TRIPLECOMPOSERDEFAULTS', {

    /**
     * @module punditConfig
     * @ngdoc property
     * @name modules#TripleComposer
     *
     * @description
     * `object`
     *
     * Configuration for TripleComposer module. This module allows you to create annotations
     * consist of one or more triple and save on server.
     * By default the TripleComposer directive is contained in the central panel (tools) of the dashboard.
     */

     /**
     * @module punditConfig
     * @ngdoc property
     * @name modules#TripleComposer.clientDashboardTemplate
     *
     * @description
     * `string`
     *
     * Path of template containing tripleComposer directive, client will append the content of this template 
     * to the DOM (inside dashboard directive) to bootstrap this component.
     *
     * Default value:
     * <pre> clientDashboardTemplate: "src/Tools/TripleComposer/ClientTripleComposer.tmpl.html" </pre>
     */
    clientDashboardTemplate: "src/Tools/TripleComposer/ClientTripleComposer.tmpl.html",

    /**
     * @module punditConfig
     * @ngdoc property
     * @name modules#TripleComposer.clientDashboardPanel
     *
     * @description
     * `string`
     *
     * Name of the panel where append the directive (legal value to default are: 'lists', 'tools' and 'details').
     *
     * Default value:
     * <pre> clientDashboardPanel: "tools" </pre>
     */
    clientDashboardPanel: "tools",

    /**
     * @module punditConfig
     * @ngdoc property
     * @name modules#TripleComposer.clientDashboardTabTitle
     *
     * @description
     * `string`
     *
     * Tab title inside panel dashboard tabs.
     *
     * Default value:
     * <pre> clientDashboardTabTitle: "Statements Composer" </pre>
     */
    clientDashboardTabTitle: "Statements Composer",

    /**
     * @module punditConfig
     * @ngdoc property
     * @name modules#TripleComposer.savingMsg
     *
     * @description
     * `string`
     *
     * Message shown at the beginning of the process of saving the annotation.
     *
     * Default value:
     * <pre> savingMsg: "We are saving your annotation" </pre>
     */
    savingMsg: "We are saving your annotation",

    /**
     * @module punditConfig
     * @ngdoc property
     * @name modules#TripleComposer.savingMsgTime
     *
     * @description
     * `string`
     *
     * Time for which the saving message is displayed (in milliseconds).
     *
     * Default value:
     * <pre> savingMsgTime: 500 </pre>
     */
    savingMsgTime: 1250,

    /**
     * @module punditConfig
     * @ngdoc property
     * @name modules#TripleComposer.notificationSuccessMsg
     *
     * @description
     * `string`
     *
     * Message shown after an annotation has been saved successfully.
     *
     * Default value:
     * <pre> notificationSuccessMsg: "Your annotation has been saved successfully" </pre>
     */
    notificationSuccessMsg: "Your annotation has been saved successfully",
    /**
     * @module punditConfig
     * @ngdoc property
     * @name modules#TripleComposer.notificationErrorMsg
     *
     * @description
     * `string`
     *
     * Message shown after an annotation was not saved properly.
     *
     * Default value:
     * <pre> notificationErrorMsg: "We were unable to save your annotation" </pre>
     */
    notificationErrorMsg: "We were unable to save your annotation",

    /**
     * @module punditConfig
     * @ngdoc property
     * @name modules#TripleComposer.notificationMsgTime
     *
     * @description
     * `string`
     *
     * Time for which the notification message is displayed (in milliseconds).
     *
     * Default value:
     * <pre> notificationMsgTime: 1000 </pre>
     */
    notificationMsgTime: 1500,

    /**
     * @module punditConfig
     * @ngdoc property
     * @name modules#TripleComposer.inputIconSearch
     *
     * @description
     * `string`
     *
     * Icon shown in the search input when it's empty
     *
     * Default value:
     * <pre> inputIconSearch: 'pnd-icon-search' </pre>
     */
    inputIconSearch: 'pnd-icon-search',

    /**
     * @module punditConfig
     * @ngdoc property
     * @name modules#TripleComposer.inputIconClear
     *
     * @description
     * `string`
     *
     * Icon shown in the search input when it has some content
     *
     * Default value:
     * <pre> inputIconClear: 'pnd-icon-times' </pre>
     */
    inputIconClear: 'pnd-icon-times',

    /**
     * @module punditConfig
     * @ngdoc property
     * @name modules#TripleComposer.debug
     *
     * @description
     * `boolean`
     *
     * Active debug log
     *
     * Default value:
     * <pre> debug: false </pre>
     */
    debug: false
    
})
.service('TripleComposer', function($rootScope, BaseComponent, TRIPLECOMPOSERDEFAULTS, TypesHelper, NameSpace,
    AnnotationsExchange, ItemsExchange, Dashboard, TemplatesExchange) {

    var tripleComposer = new BaseComponent('TripleComposer', TRIPLECOMPOSERDEFAULTS);

    var nextId = 1;
    var statements = [{
        id: nextId
    }];

    var editMode = false,
        editAnnID;

    tripleComposer.getStatements = function(){
        return statements;
    };

    tripleComposer.isEditMode = function(){
        return editMode;
    };

    tripleComposer.getEditAnnID = function(){
        return editAnnID;
    };

    tripleComposer.setEditMode = function(bool) {
        editMode = bool;
        for (var i in statements) {
            if (typeof(statements[i].scope) !== 'undefined') {
                statements[i].scope.editMode = bool;
            }
        }
    };

    tripleComposer.addStatement = function(){
        nextId = nextId + 1;
        var l = statements.push({id: nextId});
        return statements[l-1];
    };

    tripleComposer.removeStatement = function(id){
        // at least one statetement must be present
        if (statements.length === 1) {
            statements[0].scope.wipe();
            return;
        }

        var index = -1;
        statements.some(function(s, i){
            if (s.id === id) {
                index = i;
                return true;
            }
        });        
        if (index > -1) {
            statements.splice(index, 1);
        }
        tripleComposer.log('Try to remove statement at index', index);
    };

    tripleComposer.reset = function(){
        nextId = 1;
        statements.splice(0, statements.length);
        statements.push({id: nextId});
        tripleComposer.log('statements reset', statements);
    };

    tripleComposer.wipeNotFixedItems = function(){
        for(var i in statements) {
            if (!statements[i].scope.subjectFixed) {
                statements[i].scope.wipeSubject();
            }
            if (!statements[i].scope.predicateFixed) {
                statements[i].scope.wipePredicate();
            }
            if (!statements[i].scope.objectFixed) {
                statements[i].scope.wipeObject();
            }
        }
        tripleComposer.log('Wiped not fixed items.');
    };

    // extend arr object with scope property
    tripleComposer.addStatementScope = function(id, scope){
        var index = -1;
        statements.some(function(s, i){
            if (s.id === id) {
                index = i;
                return true;
            }
        });
        
        if (index > -1) {
            // extend scope with actual mode
            scope.editMode = editMode;
            statements[index].scope = scope;
        }
        tripleComposer.log('statement extended with scope', statements[index]);
    };

    // duplicate a statement and add it to the statements array
    // this produce the view update and a new <statement> directive
    // is added to the triple composer directive
    tripleComposer.duplicateStatement = function(id){
        var index = -1;
        statements.some(function(s, i){
            if (s.id === id) {
                index = i;
                return true;
            }
        });
        
        if (index > -1) {
            nextId = nextId + 1;
            statements.push({
                id: nextId,
                scope: {
                    duplicated: statements[index].scope.copy()
                }
            });
        }

    };

    tripleComposer.canAddItemAsSubject = function(){
        if (statements.length === 1 && !statements[0].scope.subjectFound && !editMode) {
            return true;
        } else {
            return false;
        }
    };

    tripleComposer.openTripleComposer = function() {
        if(!Dashboard.isDashboardVisible()){
            Dashboard.toggle();
        }
        $rootScope.$$phase || $rootScope.$digest();
        $rootScope.$emit('pnd-dashboard-show-tab', tripleComposer.options.clientDashboardTabTitle);
    };

    // Used to add a subject from outside of triple composer
    tripleComposer.addToSubject = function(item) {
        tripleComposer.openTripleComposer();
        if (tripleComposer.canAddItemAsSubject()) {
            statements[0].scope.setSubject(item);
            $rootScope.$$phase || $rootScope.$digest();
            tripleComposer.log('Add item as subject');
        } else {
            tripleComposer.log('Impossible to add this item as subject, subject already present or more than one triple');
        }
    };

    tripleComposer.addToAllSubject = function(item) {
        // template have always a free subject ?
        for (var i in statements) {
            statements[i].scope.setSubject(item);
        }        
        $rootScope.$$phase || $rootScope.$digest();
        tripleComposer.log('Add item: '+item.uri+ 'as subject of all triples');
    };

    tripleComposer.isAnnotationComplete = function(isTemplateMode){
        var complete = true;
        statements.some(function(s){
            if (s.scope.isMandatory && !s.scope.isStatementComplete()) {
                complete = false;
                return true;
            }
        });
        return complete;
    };

    tripleComposer.showCurrentTemplate = function() {
        tripleComposer.reset();
        var i, tmpl = TemplatesExchange.getCurrent();

        if (typeof(tmpl) === 'undefined') {
            return;
        }

        // at least one statement is present
        for (i=1; i<tmpl.triples.length; i++) {
            tripleComposer.addStatement();
        }

        var removeWatcher = $rootScope.$watch(function() {
            return statements[tmpl.triples.length-1].scope;
        }, function(newScope) {
            if (typeof(newScope) !== 'undefined'){
                tripleComposer.log('Now the last statement is populated with relative scope');
                // read triples from template and fix items
                for (i=0; i<statements.length; i++) {
                    var triple = tmpl.triples[i];
                    if (typeof(triple.predicate)!== 'undefined') {
                        statements[i].scope.setPredicate(triple.predicate, true);
                    }
                    if (typeof(triple.subject)!== 'undefined') {
                        statements[i].scope.setSubject(triple.subject.value, true);
                    }
                    if (typeof(triple.object)!== 'undefined') {
                        statements[i].scope.setObject(triple.object.value, true);
                    }
                    // check if the triple is mandatory (if must be completed or if can be skipped when save annotation)
                    if (typeof(triple.predicate.mandatory) !== 'undefined') {
                        statements[i].scope.isMandatory = triple.predicate.mandatory;
                    }
                    tripleComposer.log('New statement populated with', triple);
                }
                removeWatcher();
            }
        });
        
        tripleComposer.log('Showed template: '+tmpl.label);
    };

    // build all statement relative to the passed annotation
    tripleComposer.editAnnotation = function(annID) {
        // wipe all statements
        tripleComposer.reset();
        editAnnID = annID;

        var ann = AnnotationsExchange.getAnnotationById(annID),
            i;

        var triples = [];
        for (var s in ann.graph) {
            for (var p in ann.graph[s]) {
                for (var o in ann.graph[s][p]) {
                    triples.push({
                        subject: s,
                        predicate: p,
                        object: ann.graph[s][p][o]
                    });
                }
            }
        }

        var l = triples.length;
        // one triple is added by the reset function (defulat is one empty triple)
        for (i=0; i<l-1; i++) {
            tripleComposer.addStatement();
        }

        var removeWatcher = $rootScope.$watch(function() {
            return statements[l-1].scope;
        }, function(newScope) {
            if (typeof(newScope) !== 'undefined'){
                tripleComposer.log('Now the last statement is populated with relative scope');
                for (i=0; i<statements.length; i++) {
                    statements[i].scope.setSubject(ItemsExchange.getItemByUri(triples[i].subject));
                    statements[i].scope.setPredicate(ItemsExchange.getItemByUri(triples[i].predicate));
                    if (triples[i].object.type === 'uri') {
                        statements[i].scope.setObject(ItemsExchange.getItemByUri(triples[i].object.value));
                    } else if (triples[i].object.type === 'literal') {
                        statements[i].scope.setObject(triples[i].object.value);
                    } else {
                        tripleComposer.log('Try to add incompatible type of object', triples[i].object);
                    }
                    tripleComposer.setEditMode(true);
                    tripleComposer.log('New statement populated with', triples[i]);
                }
                removeWatcher();
            }
        });
    };

    // build the items object used inside http call
    tripleComposer.buildItems = function(){
        var res = {};
        
        statements.forEach(function(el){
            var triple = el.scope.get();

            // skip incomplete triple
            if (triple.subject===null || triple.predicate===null || triple.object===null) {
                return;
            }

            // add item and its rdf properties
            res[triple.subject.uri] = triple.subject.toRdf();

            res[triple.predicate.uri] = triple.predicate.toRdf();

            // discard literals
            if (typeof(triple.object.uri) !== 'undefined') {
                res[triple.object.uri] = triple.object.toRdf();
                // add object types and its label
                triple.object.type.forEach(function(e, i){
                    var type = triple.object.type[i];
                    res[type] = { };
                    res[type][NameSpace.rdfs.label] = [{type: 'literal', value: TypesHelper.getLabel(e)}];
                });
            }                                

            // add subject types and its label
            triple.subject.type.forEach(function(e, i){
                var type = triple.subject.type[i];
                res[type] = { };
                res[type][NameSpace.rdfs.label] = [{type: 'literal', value: TypesHelper.getLabel(e)}];
            });

            // add predicate types and its label
            triple.predicate.type.forEach(function(e, i){
                var type = triple.predicate.type[i];
                res[type] = { };
                res[type][NameSpace.rdfs.label] = [{type: 'literal', value: TypesHelper.getLabel(e)}];
            });

        });

        return res;
    };

    tripleComposer.buildObject = function(item){
        if (typeof(item) === 'string') {
            // date or literal
            return {type: 'literal', value: item};
        } else {
            return {type: 'uri', value: item.uri};
        }
    };

    tripleComposer.buildTargets = function(){
        var res = [];

        statements.forEach(function(el){
            var triple = el.scope.get();

            // skip incomplete triple
            if (triple.subject===null || triple.predicate===null || triple.object===null) {
                return;
            }

            if (triple.subject.isTextFragment() || triple.subject.isImage() || triple.subject.isImageFragment() ){
                if (res.indexOf(triple.subject.uri) === -1) {
                    res.push(triple.subject.uri);
                }
            }
            if (triple.predicate.isTextFragment() || triple.predicate.isImage() || triple.predicate.isImageFragment() ){
                if (res.indexOf(triple.predicate.uri) === -1) {
                    res.push(triple.predicate.uri);
                }
            }

            if (typeof(triple.object) !== 'string') {
                if (triple.object.isTextFragment() || triple.object.isImage() || triple.object.isImageFragment() ){
                    if (res.indexOf(triple.object.uri) === -1) {
                        res.push(triple.object.uri);
                    }
                }
            }
        });

        return res;
    };

    tripleComposer.buildGraph = function(){
        var res = {};

        statements.forEach(function(el){
            var triple = el.scope.get();

            // skip incomplete triple
            if (triple.subject===null || triple.predicate===null || triple.object===null) {
                return;
            }
            
            if (typeof(res[triple.subject.uri]) === 'undefined' ) {
                // subject uri not exist (happy it's easy)
                res[triple.subject.uri] = {};
                // predicate uri not exist
                res[triple.subject.uri][triple.predicate.uri] = [tripleComposer.buildObject(triple.object)];
            } else {
                // subject uri already exists

                if (typeof(res[triple.subject.uri][triple.predicate.uri]) === 'undefined') {
                    // predicate uri not exist (happy it's easy)
                    res[triple.subject.uri][triple.predicate.uri] = [tripleComposer.buildObject(triple.object)];
                } else {

                    // predicate uri already exists
                    var u = triple.object.uri,
                        arr = res[triple.subject.uri][triple.predicate.uri];
                    // search object
                    var found = arr.some(function(o){
                        return angular.equals(o.value, u);
                    });
                    // object not eqaul (happy it's easy)
                    if (!found) {
                        arr.push(tripleComposer.buildObject(triple.object));
                    }

                }
                
            }

        });

        return res;
    };

    return tripleComposer;

});