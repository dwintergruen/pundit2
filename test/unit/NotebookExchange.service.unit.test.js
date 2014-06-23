describe('NotebooksExchange factory', function() {
    
    var NotebookExchange, Notebook, NameSpace, $httpBackend;
    
    beforeEach(module('Pundit2'));

    beforeEach(inject(function(_NotebookExchange_, _Notebook_, _NameSpace_, _$httpBackend_){
        NotebookExchange = _NotebookExchange_;
        Notebook = _Notebook_;
        $httpBackend = _$httpBackend_;
        NameSpace = _NameSpace_;
    }));

    it("should correctly add notebook by (new Notebook(id))", function(){
        var testId = 'simple1ID';
        $httpBackend
            .when('GET', NameSpace.get('asOpenNBMeta', {id: testId}))
            .respond(testNotebooks.simple1);
        var nt = new Notebook(testId);
        $httpBackend.flush();

        var notebooks = NotebookExchange.getNotebooks();
        expect(notebooks.length).toBe(1);
        // TODO read from fixtures file
        expect(notebooks[0].id).toBe("simple1ID");
        expect(NotebookExchange.getNotebookById("simple1ID")).toBeDefined();
    });

    it("should not duplicate existing notebook", function(){
        var testId = 'simple1ID';
        $httpBackend
            .when('GET', NameSpace.get('asOpenNBMeta', {id: testId}))
            .respond(testNotebooks.simple1);
        var nt = new Notebook(testId);
        $httpBackend.flush();

        // try to duplicate notebook
        NotebookExchange.addNotebook({id: testId});

        var notebooks = NotebookExchange.getNotebooks();
        expect(notebooks.length).toBe(1);
    });

    it("should correctly add my notebook by (new Notebook(id, true))", function(){
        var testId = 'simple1ID';
        $httpBackend
            .when('GET', NameSpace.get('asOpenNBMeta', {id: testId}))
            .respond(testNotebooks.simple1);
        var nt = new Notebook(testId, true);
        $httpBackend.flush();

        // default list
        var notebooks = NotebookExchange.getNotebooks();
        expect(notebooks.length).toBe(1);
        expect(notebooks[0].id).toBe("simple1ID");
        expect(NotebookExchange.getNotebookById("simple1ID")).toBeDefined();

        // my notebooks list
        var myNotebooks = NotebookExchange.getMyNotebooks();
        expect(myNotebooks.length).toBe(1);
        expect(myNotebooks[0].id).toBe("simple1ID");
    });

    it("should correctly get and set current notebook", function(){
        var testId = 'simple1ID';
        $httpBackend
            .when('GET', NameSpace.get('asOpenNBMeta', {id: testId}))
            .respond(testNotebooks.simple1);
        var nt = new Notebook(testId, true);
        $httpBackend.flush();

        NotebookExchange.setCurrentNotebooks(testId);
        var current = NotebookExchange.getCurrentNotebooks();

        expect(current.id).toBe(testId);
        expect(current.isCurrent()).toBe(true);
    });

    it("should correctly wipe notebook", function(){
        var testId = 'simple1ID';
        $httpBackend
            .when('GET', NameSpace.get('asOpenNBMeta', {id: testId}))
            .respond(testNotebooks.simple1);
        var nt = new Notebook(testId);
        $httpBackend.flush();
        NotebookExchange.setCurrentNotebooks(testId);

        NotebookExchange.wipe();

        expect(NotebookExchange.getNotebooks().length).toBe(0);
        expect(NotebookExchange.getNotebookById("simple1ID")).toBeUndefined();
        expect(NotebookExchange.getMyNotebooks().length).toBe(0);
        expect(NotebookExchange.getCurrentNotebooks()).toBeUndefined();
    });

    it("should correctly remove notebook", function(){
        var testId = 'simple1ID';
        $httpBackend
            .when('GET', NameSpace.get('asOpenNBMeta', {id: testId}))
            .respond(testNotebooks.simple1);
        var nt = new Notebook(testId, true);
        $httpBackend.flush();
        NotebookExchange.setCurrentNotebooks(testId);

        NotebookExchange.removeNotebook(testId);

        expect(NotebookExchange.getNotebooks().length).toBe(0);
        expect(NotebookExchange.getNotebookById("simple1ID")).toBeUndefined();
        expect(NotebookExchange.getMyNotebooks().length).toBe(0);
        expect(NotebookExchange.getCurrentNotebooks()).toBeUndefined();
    });

});