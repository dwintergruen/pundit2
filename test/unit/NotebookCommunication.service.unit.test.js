describe('Notebook Communication service', function() {

    var NotebookCommunication,
        $rootScope,
        $httpBackend,
        NameSpace,
        $compile,
        Notebook,
        NotebookExchange;

    beforeEach(module('Pundit2'));

    beforeEach(inject(function($injector, _$rootScope_, _$httpBackend_, _$compile_, _Notebook_, _NotebookExchange_){
        NotebookCommunication = $injector.get('NotebookCommunication');
        NameSpace = $injector.get('NameSpace');
        $rootScope = _$rootScope_;
        $httpBackend = _$httpBackend_;
        $compile = _$compile_;
        Notebook = _Notebook_;
        NotebookExchange = _NotebookExchange_;

    }));

    xit("should create a new notebook", function() {

        var name = 'myNotebook';
        var userLoggedIn = {
            loginStatus: 1
        };


        $httpBackend.whenGET(NameSpace.get('asUsersCurrent')).respond(userLoggedIn);
        var p = NotebookCommunication.createNotebook(name);

        $httpBackend
            .when('POST', NameSpace.get('asNB', {NotebookName: name}))
            .respond(testNotebooks.simple1);

        p.then(function(nbID) {
            console.log("aaa");
            expect(nbID).toBe(testNotebooks.simple1.id);
            var notebook = NotebookExchange.getNotebookById(nbID);
            expect(notebook.label).toBe(testNotebooks.simple1.label);
            expect(notebook.id).toBe(testNotebooks.simple1.id);
            expect(notebook.visibility).toBe('public');
            var currentNotebook = NotebookExchange.getCurrentNotebooks();
            expect(currentNotebook).toBeNull();
        });

        $httpBackend.flush();


    });



});