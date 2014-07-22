describe('TripleComposer service', function() {

    var TripleComposer,
        TRIPLECOMPOSERDEFAULTS,
        Item,
        Template,
        TemplatesExchange,
        NameSpace,
        $rootScope,
        $compile;

    var item = {
        uri: "http://rdf.freebase.com/ns/m/05qmj",
        label: "Plato",
        type: ["http://www.freebase.com/schema/common/topic", "http://www.freebase.com/schema/people/person"]
    };

    var predicateItem = {
        uri: "http://purl.org/pundit/vocab#similarTo", 
        label: "is similar to",
        type: ["http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"]
    };

    beforeEach(module('Pundit2'));

    beforeEach(inject(function(_TRIPLECOMPOSERDEFAULTS_, _TripleComposer_, _Item_, _Template_, _TemplatesExchange_, _NameSpace_,
        _$rootScope_, _$compile_){

        TRIPLECOMPOSERDEFAULTS = _TRIPLECOMPOSERDEFAULTS_;
        TripleComposer = _TripleComposer_;
        Item = _Item_;
        Template = _Template_;
        TemplatesExchange = _TemplatesExchange_;
        NameSpace = _NameSpace_;
        $rootScope = _$rootScope_;
        $compile = _$compile_;
    }));

    afterEach(function(){
        TripleComposer.reset();
    });

    var compileDirective = function(){
        var elem = $compile('<triple-composer></triple-composer>')($rootScope);
        angular.element('body').append(elem);
        $rootScope.$digest();
        return elem;
    };

    it('should correctly initialize', function(){
        var s = TripleComposer.getStatements();
        expect(s.length).toBe(1);
        expect(s[0].id).toBe(1);
    });

    it('should correctly add and remove statement', function(){
        var s = TripleComposer.getStatements();
        
        TripleComposer.addStatement();
        expect(s.length).toBe(2);
        expect(s[1].id).toBe(2);

        TripleComposer.removeStatement(2);
        expect(s.length).toBe(1);
        expect(s[0].id).toBe(1);

        // at least one statement must be present
        s[0].scope = { wipe: function(){ return; } };
        TripleComposer.removeStatement(1);
        expect(s.length).toBe(1);

    });

    it('should correctly reset statements array', function(){
        TripleComposer.addStatement();
        TripleComposer.addStatement();
        TripleComposer.addStatement();

        TripleComposer.reset();
        var s = TripleComposer.getStatements();

        expect(s.length).toBe(1);
        expect(s[0].id).toBe(1);
    });

    it('should correctly add statement scope', function(){
        var s = TripleComposer.getStatements();
        
        TripleComposer.addStatementScope(s[0].id, {});
        expect(s[0].scope).toBeDefined();
        expect(typeof(s[0].scope)).toEqual('object');
    });

    it('should correctly build object', function(){
        var o = TripleComposer.buildObject(item);
        expect(o.type).toEqual('uri');
        expect(o.value).toEqual(item.uri);

        var l = TripleComposer.buildObject('literalText');
        expect(l.type).toEqual('literal');
        expect(l.value).toEqual('literalText');
    });

    it('should correctly build items object', function(){
        var s = TripleComposer.getStatements();
        
        TripleComposer.addStatementScope(s[0].id, {
            get: function(){
                return {
                    subject: new Item(item.uri, item),
                    predicate: new Item(predicateItem.uri, predicateItem),
                    object: new Item(item.uri, item)
                }
            }
        });
        
        var items = TripleComposer.buildItems(),
            t0 = item.type[0],
            t1 = item.type[1],
            t2 = predicateItem.type[0],
            label = NameSpace.rdfs.label;

        // first level properties
        expect(items[item.uri]).toBeDefined();
        expect(items[predicateItem.uri]).toBeDefined();
        expect(typeof(items[item.uri])).toEqual('object');
        expect(typeof(items[predicateItem.uri])).toEqual('object');

        expect(typeof(items[t0])).toEqual('object');
        expect(typeof(items[t1])).toEqual('object');
        expect(typeof(items[t2])).toEqual('object');

        // second level properties
        expect(items[t0][label] instanceof Array).toBe(true);
        expect(items[t1][label] instanceof Array).toBe(true);
        
        // third level properties
        expect(items[t0][label][0].value).toBeDefined();
        expect(items[t0][label][0].type).toBeDefined();

    });

    it('should correctly build target object', function(){
        var s = TripleComposer.getStatements();
        
        TripleComposer.addStatementScope(s[0].id, {
            get: function(){
                return {
                    subject: {uri: 'testUri1', isTextFragment: function(){ return true;}},
                    predicate: {uri: 'testUri2', isTextFragment: function(){ return true;}},
                    object: {uri: 'testUri3', isTextFragment: function(){ return true;}}
                }
            }
        });
        
        var target = TripleComposer.buildTargets();

        expect(target.length).toBe(3);
        expect(target.indexOf('testUri1')).toBeGreaterThan(-1);
        expect(target.indexOf('testUri2')).toBeGreaterThan(-1);
        expect(target.indexOf('testUri3')).toBeGreaterThan(-1);

    });

    it('should correctly build simple graph object', function(){
        var s = TripleComposer.getStatements();
        
        TripleComposer.addStatementScope(s[0].id, {
            get: function(){
                return {
                    subject: {uri: 'subUri'},
                    predicate: {uri: 'predUri'},
                    object: {uri: 'objUri'}
                }
            }
        });

        var graph = TripleComposer.buildGraph();

        expect(typeof(graph)).toEqual('object');
        expect(typeof(graph.subUri)).toEqual('object');
        expect(graph.subUri.predUri instanceof Array).toBe(true);
        expect(typeof(graph.subUri.predUri[0])).toEqual('object');

    });

    it('should correctly build graph object with the subject in common', function(){
        var s = TripleComposer.getStatements();
        
        TripleComposer.addStatementScope(s[0].id, {
            get: function(){
                return {
                    subject: {uri: 'subUri'},
                    predicate: {uri: 'predUri'},
                    object: {uri: 'objUri'}
                }
            }
        });

        TripleComposer.addStatement();
        TripleComposer.addStatementScope(s[1].id, {
            get: function(){
                return {
                    subject: {uri: 'subUri'},
                    predicate: {uri: 'predUri2'},
                    object: {uri: 'objUri'}
                }
            }
        });
        
        var graph = TripleComposer.buildGraph();

        expect(typeof(graph)).toEqual('object');
        expect(typeof(graph.subUri)).toEqual('object');
        expect(graph.subUri.predUri instanceof Array).toBe(true);
        expect(graph.subUri.predUri2 instanceof Array).toBe(true);
        expect(typeof(graph.subUri.predUri[0])).toEqual('object');
        expect(typeof(graph.subUri.predUri2[0])).toEqual('object');

    });

    it('should correctly build graph object with subject and predicate in common', function(){
        var s = TripleComposer.getStatements();
        
        TripleComposer.addStatementScope(s[0].id, {
            get: function(){
                return {
                    subject: {uri: 'subUri'},
                    predicate: {uri: 'predUri'},
                    object: {uri: 'objUri1'}
                }
            }
        });

        TripleComposer.addStatement();
        TripleComposer.addStatementScope(s[1].id, {
            get: function(){
                return {
                    subject: {uri: 'subUri'},
                    predicate: {uri: 'predUri'},
                    object: {uri: 'objUri2'}
                }
            }
        });
        
        var graph = TripleComposer.buildGraph();

        // first level property
        expect(typeof(graph)).toEqual('object');
        expect(typeof(graph.subUri)).toEqual('object');
        expect(Object.keys(graph.subUri).length).toBe(1);
        // second level property
        expect(Object.keys(graph.subUri)[0]).toEqual('predUri');
        // third level property
        expect(graph.subUri.predUri instanceof Array).toBe(true);
        expect(graph.subUri.predUri.length).toBe(2);
        

    });

    it('should correctly compile statement directive', function(){
        compileDirective();
        var s = TripleComposer.getStatements();
        
        var scope = s[0].scope;
        expect(scope).toBeDefined();
        expect(typeof(scope)).toEqual('object');
        // check some statement properties
        expect(typeof(scope.subjectLabel)).toEqual('string');
        expect(typeof(scope.predicateLabel)).toEqual('string');
        expect(typeof(scope.objectLabel)).toEqual('string');

        angular.element('triple-composer').remove();
    });

    it('should correctly compile duplicated statement directive', function(){
        compileDirective();
        var s = TripleComposer.getStatements();       
        
        var triple = s[0].scope.get();
        // extend triple object
        triple.subject = {label: 'testLabel', type: ["http://purl.org/pundit/ont/ao#fragment-text"]};

        // duplicate first statement
        TripleComposer.duplicateStatement(s[0].id);
        $rootScope.$digest();

        // check new statement
        var scope = s[1].scope;
        expect(scope).toBeDefined();
        expect(typeof(scope)).toEqual('object');
        expect(scope.subjectLabel).toEqual('testLabel');
        expect(scope.subjectFound).toBe(true);

        angular.element('triple-composer').remove();
    });

    it('should correctly set edit mode', function(){
        compileDirective();
        var s = TripleComposer.getStatements();
        TripleComposer.setEditMode(true);
        
        var scope = s[0].scope;
        expect(scope).toBeDefined();
        expect(scope.editMode).toBe(true);

        angular.element('triple-composer').remove();
    });

    it('should correctly show current template', function(){
        compileDirective();
        var currentTmpl = new Template('testID', {
            triples: [
                {
                    mandatory: true,
                    predicate: {
                        label: 'predicate label',
                        id: 'predicateTestID',
                        range: [],
                        domain: []
                    }
                }
            ]
        });
        TemplatesExchange.setCurrent(currentTmpl.id);
        TripleComposer.showCurrentTemplate();
        $rootScope.$digest();

        var s = TripleComposer.getStatements();        
        var scope = s[0].scope;
        expect(scope.predicateLabel).toBe('predicate label');
        expect(scope.predicateFound).toBe(true);
        expect(scope.predicateFixed).toBe(true);
        expect(scope.isMandatory).toBe(true);

        angular.element('triple-composer').remove();
    });

});