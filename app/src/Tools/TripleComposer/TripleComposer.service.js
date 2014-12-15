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
     * @ngdoc property
     * @name modules#TripleComposer.active
     *
     * @description
     * `boolean`
     *
     * Default state of the TripleComposer module, if it is set to true
     * the client adds to the DOM (inside dashboard) the TripleComposer directive in the boot phase.
     *
     * Default value:
     * <pre> active: true </pre>
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
     * <pre> clientDashboardTabTitle: "Annotation Composer" </pre>
     */
    clientDashboardTabTitle: "Annotation composer",

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
     * @name modules#TripleComposer.cMenuType
     *
     * @description
     * `string`
     *
     * Contextual menu type showed by statement
     *
     * Default value:
     * <pre> cMenuType: 'tripleComposer' </pre>
     */
    cMenuType: 'tripleComposer',

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

.service('TripleComposer', function($rootScope, BaseComponent, EventDispatcher, TRIPLECOMPOSERDEFAULTS, TypesHelper, NameSpace, Config,
    AnnotationsExchange, ItemsExchange, Dashboard, ContextualMenu, TemplatesExchange, Status, Utils) {

    var tripleComposer = new BaseComponent('TripleComposer', TRIPLECOMPOSERDEFAULTS);

    var nextId = 1;
    var statements = [{
        id: nextId
    }];

    var editMode = false,
        editAnnID;

    var closeAfterOp = false;

    var statementChangeStatus = function() {
        EventDispatcher.sendEvent('TripleComposer.statementChange');
    };

    // Contextual Menu actions for my items and page items
    var initContextualMenu = function() {
        ContextualMenu.addAction({
            type: [
                Config.modules.PageItemsContainer.cMenuType,
                Config.modules.MyItemsContainer.cMenuType,
                Config.modules.SelectorsManager.cMenuType,
                Config.modules.TextFragmentHandler.cMenuType,
                Config.modules.TextFragmentAnnotator.cMenuType,
                Config.modules.ImageHandler.cMenuType
            ],
            name: 'useAsSubject',
            label: 'Use as subject',
            showIf: function(item) {
                return /*!Toolbar.isActiveTemplateMode() &&*/ tripleComposer.canAddItemAsSubject(item);
            },
            priority: 101,
            action: function(item) {
                if (Status.getTemplateModeStatus()) {
                    tripleComposer.addToAllSubject(item);
                } else {
                    tripleComposer.addToSubject(item);
                }
            }
        });

        ContextualMenu.addAction({
            type: [
                Config.modules.PageItemsContainer.cMenuType,
                Config.modules.MyItemsContainer.cMenuType,
                Config.modules.SelectorsManager.cMenuType,
                Config.modules.TextFragmentHandler.cMenuType,
                Config.modules.TextFragmentAnnotator.cMenuType,
                Config.modules.ImageHandler.cMenuType
            ],
            name: 'useAsObject',
            label: 'Use as object',
            showIf: function(item) {
                return /*!Toolbar.isActiveTemplateMode() &&*/ tripleComposer.canAddItemAsObject(item);
            },
            priority: 100,
            action: function(item) {
                tripleComposer.addToObject(item);
            }
        });

        ContextualMenu.addAction({
            type: [
                Config.modules.PredicatesContainer.cMenuType
            ],
            name: 'useAsPredicate',
            label: 'Use as predicate',
            showIf: function(item) {
                if (tripleComposer.canBeUseAsPredicate(item)) {
                    ContextualMenu.modifyHeaderActionByName('useAsPredicate', false);
                } else {
                    ContextualMenu.modifyHeaderActionByName('useAsPredicate', true);
                }
                return true;
            },
            priority: 100,
            action: function(item) {
                tripleComposer.addToPredicate(item);
            }
        });

        ContextualMenu.addAction({
            name: 'newTriple',
            type: tripleComposer.options.cMenuType,
            label: 'New triple',
            priority: 3,
            showIf: function() {
                return true;
            },
            action: function() {
                angular.element('.pnd-triplecomposer-save').addClass('disabled');
                tripleComposer.addStatement();
                statementChangeStatus();
            }
        });

        ContextualMenu.addAction({
            name: 'duplicateTriple',
            type: tripleComposer.options.cMenuType,
            label: 'Duplicate triple',
            priority: 3,
            showIf: function() {
                return true;
            },
            action: function(statement) {
                var id = parseInt(statement.id, 10);
                tripleComposer.duplicateStatement(id);
                statementChangeStatus();
            }
        });

        ContextualMenu.addAction({
            name: 'removeTriple',
            type: tripleComposer.options.cMenuType,
            label: 'Remove triple',
            priority: 3,
            showIf: function() {
                return true;
            },
            action: function(statement) {
                var id = parseInt(statement.id, 10);
                tripleComposer.removeStatement(id);
                if (tripleComposer.isAnnotationComplete()) {
                    angular.element('.pnd-triplecomposer-save').removeClass('disabled');
                }
                statementChangeStatus();
            }
        });

    }; // initContextualMenu()

    // When all modules have been initialized, services are up, Config are setup etc..
    EventDispatcher.addListener('Client.boot', function() {
        initContextualMenu();
    });

    tripleComposer.getStatements = function() {
        return statements;
    };

    tripleComposer.isEditMode = function() {
        return editMode;
    };

    tripleComposer.closeAfterOp = function() {
        closeAfterOp = true;
    };

    tripleComposer.closeAfterOpOff = function() {
        closeAfterOp = false;
    };

    tripleComposer.updateVisibility = function() {
        if (closeAfterOp && Dashboard.isDashboardVisible()) {
            Dashboard.toggle();
        }
        closeAfterOp = false;
    };

    tripleComposer.getEditAnnID = function() {
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

    tripleComposer.addStatement = function() {
        nextId = nextId + 1;
        var l = statements.push({
            id: nextId
        });
        return statements[l - 1];
    };

    tripleComposer.removeStatement = function(id) {
        // at least one statetement must be present
        if (statements.length === 1) {
            statements[0].scope.wipe();
            return;
        }

        var index = -1;
        statements.some(function(s, i) {
            if (s.id === id) {
                index = i;
                return true;
            }
        });
        if (index > -1) {
            statements.splice(index, 1);
        }

        if (statements.length === 1) {
            if (statements[0].scope.isStatementEmpty()) {
                ContextualMenu.modifyHeaderActionByName('removeTriple', true);
            }
        }
        tripleComposer.log('Try to remove statement at index', index);
    };

    tripleComposer.reset = function() {
        nextId = 1;
        statements.splice(0, statements.length);
        statements.push({
            id: nextId
        });
        EventDispatcher.sendEvent('TripleComposer.reset');
        tripleComposer.log('statements reset', statements);
    };

    tripleComposer.wipeNotFixedItems = function() {
        for (var i in statements) {
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
    tripleComposer.addStatementScope = function(id, scope) {
        var index = -1;
        statements.some(function(s, i) {
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

        if (statements.length > 1) {
            ContextualMenu.modifyHeaderActionByName('removeTriple', false);
        }

        tripleComposer.log('statement extended with scope', statements[index]);
    };

    // duplicate a statement and add it to the statements array
    // this produce the view update and a new <statement> directive
    // is added to the triple composer directive
    tripleComposer.duplicateStatement = function(id) {
        var index = -1;
        statements.some(function(s, i) {
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

        if (statements.length > 1) {
            ContextualMenu.modifyHeaderActionByName('removeTriple', false);
        }

    };

    tripleComposer.canAddItemAsSubject = function(item) {

        // search first empty subject
        var index = -1;
        statements.some(function(s, i) {
            if (!s.scope.subjectFound) {
                index = i;
                return true;
            }
        });
        // all subject are full
        if (index === -1) {
            return false;
        }

        var domainFound = false,
            predicate = statements[index].scope.get().predicate;

        if (predicate === null || predicate.domain.length === 0) {
            return true;
        }
        // check if subject type match predicate domain
        item.type.some(function(type) {
            if (predicate.domain.indexOf(type) > -1) {
                domainFound = true;
                return domainFound;
            }
        });

        if (!domainFound) {
            tripleComposer.log('Impossible to add item as Subject: predicate domain not match');
        } else {
            tripleComposer.log('Predicate domain match.');
        }

        return domainFound;
    };

    tripleComposer.canBeUseAsPredicate = function(item) {
        var domainCheck = false;
        var rangeCheck = false;

        // search first empty prendicate
        var index = -1;
        statements.some(function(s, i) {
            if (!s.scope.predicateFound) {
                index = i;
                return true;
            }
        });
        // all predicate are full
        if (index === -1) {
            return false;
        }

        var subject = statements[index].scope.get().subject;
        var object = statements[index].scope.get().object;
        if (subject === null && object === null) {
            return true;
        }

        if (subject !== null && item.domain.length !== 0) {
            // check if subject type match predicate domain
            item.domain.some(function(type) {
                if (subject.type.indexOf(type) > -1) {
                    domainCheck = true;
                    return domainCheck;
                }
            });
        } else {
            domainCheck = true;
        }

        if (object !== null && item.range.length !== 0) {
            // check if object type match predicate range
            item.range.some(function(type) {
                if (object.type.indexOf(type) > -1) {
                    rangeCheck = true;
                    return rangeCheck;
                }
            });
        } else {
            rangeCheck = true;
        }

        return domainCheck && rangeCheck;
    };

    tripleComposer.canAddItemAsObject = function(item) {

        // search first empty subject
        var index = -1;
        statements.some(function(s, i) {
            if (!s.scope.objectFound) {
                index = i;
                return true;
            }
        });
        // all object are full
        if (index === -1) {
            return false;
        }

        var rangeFound = false,
            predicate = statements[index].scope.get().predicate;

        if (predicate === null || predicate.range.length === 0) {
            return true;
        }
        // check if object type match predicate range
        item.type.some(function(type) {
            if (predicate.range.indexOf(type) > -1) {
                rangeFound = true;
                return rangeFound;
            }
        });

        if (!rangeFound) {
            tripleComposer.log('Impossible to add item as Object: predicate range not match');
        } else {
            tripleComposer.log('Predicate range match.');
        }

        return rangeFound;
    };

    tripleComposer.openTripleComposer = function() {
        if (!Dashboard.isDashboardVisible()) {
            Dashboard.toggle();
        }
        $rootScope.$$phase || $rootScope.$digest();
        //EventDispatcher.sendEvent('Dashboard.showTab', tripleComposer.options.clientDashboardTabTitle);
        EventDispatcher.sendEvent('TripleComposer.openTripleComposer', tripleComposer.options.clientDashboardTabTitle);
    };

    // Used to add a object from outside of triple composer
    tripleComposer.addToObject = function(item) {
        tripleComposer.closeAfterOp();
        tripleComposer.openTripleComposer();

        for (var i in statements) {
            // find the first empty subject
            if (!statements[i].scope.objectFound) {
                // set it
                statements[i].scope.setObject(item);
                $rootScope.$$phase || $rootScope.$digest();
                tripleComposer.log('Add item as object: ' + item.label);
                return;
            }
        }
        tripleComposer.log('Error: impossible to add object (all full)');
    };

    // Used to add a predicate from outside of triple composer
    tripleComposer.addToPredicate = function(item) {
        tripleComposer.closeAfterOp();
        tripleComposer.openTripleComposer();

        for (var i in statements) {
            // find the first empty subject
            if (!statements[i].scope.predicateFound) {
                // set it
                statements[i].scope.setPredicate(item);
                $rootScope.$$phase || $rootScope.$digest();
                tripleComposer.log('Add item as predicate: ' + item.label);
                return;
            }
        }
        tripleComposer.log('Error: impossible to add predicate (all full)');
    };

    // Used to add a subject from outside of triple composer
    tripleComposer.addToSubject = function(item) {
        tripleComposer.closeAfterOp();
        tripleComposer.openTripleComposer();

        for (var i in statements) {
            // find the first empty subject
            if (!statements[i].scope.subjectFound) {
                // set it
                statements[i].scope.setSubject(item);
                $rootScope.$$phase || $rootScope.$digest();
                tripleComposer.log('Add item as subject: ' + item.label);
                return;
            }
        }
        tripleComposer.log('Error: impossible to add subject (all full)');
    };

    tripleComposer.addToAllSubject = function(item) {
        // template have always a free subject ?
        for (var i in statements) {
            statements[i].scope.setSubject(item);
        }
        $rootScope.$$phase || $rootScope.$digest();
        tripleComposer.log('Add item: ' + item.uri + 'as subject of all triples');
    };

    tripleComposer.isAnnotationComplete = function() {
        var complete = true;
        statements.some(function(s) {
            if (s.scope.isMandatory && !s.scope.isStatementComplete()) {
                complete = false;
                return true;
            }
        });
        return complete;
    };

    tripleComposer.isTripleEmpty = function() {
        if (statements.length > 1 && !statements[0].scope.templateMode) {
            return false;
        }

        var empty = true;

        statements.some(function(s) {
            if (!s.scope.isStatementEmpty()) {
                empty = false;
                return;
            }
        });
        return empty;
    };

    tripleComposer.isTripleErasable = function() {
        if (statements.length === 1) {
            if (!statements[0].scope.isStatementEmpty()) {
                ContextualMenu.modifyHeaderActionByName('removeTriple', false);
            } else {
                ContextualMenu.modifyHeaderActionByName('removeTriple', true);
            }
        }
    };

    tripleComposer.showCurrentTemplate = function() {
        tripleComposer.reset();
        var i, tmpl = TemplatesExchange.getCurrent();

        if (typeof(tmpl) === 'undefined') {
            return;
        }

        // at least one statement is present
        for (i = 1; i < tmpl.triples.length; i++) {
            tripleComposer.addStatement();
        }

        var removeWatcher = $rootScope.$watch(function() {
            return statements[tmpl.triples.length - 1].scope;
        }, function(newScope) {
            if (typeof(newScope) !== 'undefined') {
                tripleComposer.log('Now the last statement is populated with relative scope');

                // read triples from template and fix items
                for (i = 0; i < statements.length; i++) {
                    var triple = tmpl.triples[i];

                    if (typeof(triple.predicate) !== 'undefined') {
                        statements[i].scope.setPredicate(ItemsExchange.getItemByUri(triple.predicate.uri), true);
                    }
                    if (typeof(triple.subject) !== 'undefined') {
                        statements[i].scope.setSubject(triple.subject.value, true);
                    }
                    if (typeof(triple.object) !== 'undefined') {
                        statements[i].scope.setObject(triple.object.value, true);
                    }
                    // check if the triple is mandatory (if must be completed or if can be skipped when save annotation)
                    if (typeof(triple.mandatory) !== 'undefined') {
                        statements[i].scope.isMandatory = triple.mandatory;
                    }
                    tripleComposer.log('New statement populated with', triple);
                }
                removeWatcher();
            }
        });

        tripleComposer.log('Showed template: ' + tmpl.label);
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
        for (i = 0; i < l - 1; i++) {
            tripleComposer.addStatement();
        }

        var removeWatcher = $rootScope.$watch(function() {
            return statements[l - 1].scope;
        }, function(newScope) {
            if (typeof(newScope) !== 'undefined') {
                tripleComposer.log('Now the last statement is populated with relative scope');
                for (i = 0; i < statements.length; i++) {
                    statements[i].scope.setSubject(ItemsExchange.getItemByUri(triples[i].subject));
                    statements[i].scope.setPredicate(ItemsExchange.getItemByUri(triples[i].predicate));
                    if (triples[i].object.type === 'uri') {
                        statements[i].scope.setObject(ItemsExchange.getItemByUri(triples[i].object.value));
                    } else if (triples[i].object.type === 'literal') {
                        // TODO: add full support to date
                        if (Utils.isValidDate(triples[i].object.value)) {
                            statements[i].scope.setObject(new Date(triples[i].object.value));                            
                        } else {
                            statements[i].scope.setObject(triples[i].object.value);                            
                        }
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
    tripleComposer.buildItems = function() {
        var res = {};
        var val;

        statements.forEach(function(el) {
            var triple = el.scope.get();

            // skip incomplete triple
            if (triple.subject === null || triple.predicate === null || triple.object === null) {
                return;
            }

            // check if items are image fragment
            // in this case add the polygon to the items list
            if (typeof(triple.subject.polygon) !== 'undefined' && typeof(triple.subject.polygonUri) !== 'undefined') {
                // make a polygon rdf object
                res[triple.subject.polygonUri] = {};
                res[triple.subject.polygonUri][NameSpace.item.type] = [{
                    type: 'uri',
                    value: NameSpace.selectors.polygonType
                }];
                val = {
                    type: 'polygon',
                    points: triple.subject.polygon
                };
                res[triple.subject.polygonUri][NameSpace.rdf.value] = [{
                    type: 'literal',
                    value: angular.toJson(val)
                }];
            }
            if (typeof(triple.object.polygon) !== 'undefined' && typeof(triple.object.polygonUri) !== 'undefined') {
                // make a polygon rdf object
                res[triple.object.polygonUri] = {};
                res[triple.object.polygonUri][NameSpace.item.type] = [{
                    type: 'uri',
                    value: NameSpace.selectors.polygonType
                }];
                val = {
                    type: 'polygon',
                    points: triple.object.polygon
                };
                res[triple.object.polygonUri][NameSpace.rdf.value] = [{
                    type: 'literal',
                    value: angular.toJson(val)
                }];
            }

            // add item and its rdf properties
            res[triple.subject.uri] = triple.subject.toRdf();

            res[triple.predicate.uri] = triple.predicate.toRdf();

            // discard literals
            if (typeof(triple.object.uri) !== 'undefined') {
                res[triple.object.uri] = triple.object.toRdf();
                // add object types and its label
                triple.object.type.forEach(function(e, i) {
                    var type = triple.object.type[i];
                    res[type] = {};
                    res[type][NameSpace.rdfs.label] = [{
                        type: 'literal',
                        value: TypesHelper.getLabel(e)
                    }];
                });
            }

            // add subject types and its label
            triple.subject.type.forEach(function(e, i) {
                var type = triple.subject.type[i];
                res[type] = {};
                res[type][NameSpace.rdfs.label] = [{
                    type: 'literal',
                    value: TypesHelper.getLabel(e)
                }];
            });

            // add predicate types and its label
            triple.predicate.type.forEach(function(e, i) {
                var type = triple.predicate.type[i];
                res[type] = {};
                res[type][NameSpace.rdfs.label] = [{
                    type: 'literal',
                    value: TypesHelper.getLabel(e)
                }];
            });

        });

        return res;
    };

    tripleComposer.buildObject = function(item) {
        if (typeof(item) === 'string') {
            // date or literal
            return {
                type: 'literal',
                value: item
            };
        } else {
            return {
                type: 'uri',
                value: item.uri
            };
        }
    };

    tripleComposer.buildTargets = function() {
        var res = [];

        statements.forEach(function(el) {
            var triple = el.scope.get();

            // skip incomplete triple
            if (triple.subject === null || triple.predicate === null || triple.object === null) {
                return;
            }

            if (triple.subject.isTextFragment() || triple.subject.isImage() || triple.subject.isImageFragment()) {
                if (res.indexOf(triple.subject.uri) === -1) {
                    res.push(triple.subject.uri);
                }
            }
            if (triple.predicate.isTextFragment() || triple.predicate.isImage() || triple.predicate.isImageFragment()) {
                if (res.indexOf(triple.predicate.uri) === -1) {
                    res.push(triple.predicate.uri);
                }
            }

            if (typeof(triple.object) !== 'string') {
                if (triple.object.isTextFragment() || triple.object.isImage() || triple.object.isImageFragment()) {
                    if (res.indexOf(triple.object.uri) === -1) {
                        res.push(triple.object.uri);
                    }
                }
            }
        });

        return res;
    };

    tripleComposer.buildGraph = function() {
        var res = {};

        statements.forEach(function(el) {
            var triple = el.scope.get();

            // skip incomplete triple
            if (triple.subject === null || triple.predicate === null || triple.object === null) {
                return;
            }

            if (typeof(res[triple.subject.uri]) === 'undefined') {
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
                    var found = arr.some(function(o) {
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