describe('TripleComposer service', function() {

    var TripleComposer,
        TRIPLECOMPOSERDEFAULTS,
        $rootScope,
        $compile;

    beforeEach(module('Pundit2'));

    beforeEach(inject(function(_TRIPLECOMPOSERDEFAULTS_, _TripleComposer_, _$rootScope_, _$compile_){
        TRIPLECOMPOSERDEFAULTS = _TRIPLECOMPOSERDEFAULTS_;
        TripleComposer = _TripleComposer_;
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

    it('should correctly compile statement directive', function(){
        var tripleComposerScope = compileDirective().isolateScope();
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
        var tripleComposerScope = compileDirective().isolateScope();
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

});