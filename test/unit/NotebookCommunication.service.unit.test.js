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

    it("should create a new notebook", function() {

        var name = 'myNotebook';
        var userLoggedIn = {
            loginStatus: 1,
            id: "myFakeId",
            uri: "http://myUri.fake",
            openid: "http://myOpenId.fake",
            firstName: "Mario",
            lastName: "Rossi",
            fullName: "Mario Rossi",
            email: "mario@rossi.it",
            loginServer: "http:\/\/demo-cloud.as.thepund.it:8080\/annotationserver\/login.jsp"
        };

        var header = {"Accept":"application/json","Content-Type":"application/json;charset=UTF-8;"};
        var data = {"NotebookName": 'myNotebook'};
        var testId = 'myNbID';

        // catch http request for user logged in
        $httpBackend.whenGET(NameSpace.get('asUsersCurrent')).respond(userLoggedIn);

        // create a notebook
        var p = NotebookCommunication.createNotebook(name);

        // catch http request for notebook creation
        $httpBackend
            .expectPOST(NameSpace.get('asNB'), data, header)
            .respond({"NotebookID": testId});

        // catch http request for get notebook metadata, called when bu Notebook.factory when a notebook is created
        $httpBackend
            .whenGET(NameSpace.get('asNBMeta', {id: testId}))
            .respond(testNotebooks.myNotebook);

        // when notebook is created correctly, the promise will be resolved
        p.then(function(nbID) {
            expect(nbID).toBe(testId);
            var notebook = NotebookExchange.getNotebookById(nbID);
            // new notebook should have the given label...
            expect(notebook.label).toBe(name);
            expect(notebook.id).toBe(testId);
            // ...should be set as public...
            expect(notebook.visibility).toBe("public");
            // ... and should not be the current notebook
            var currentNotebook = NotebookExchange.getCurrentNotebooks();
            expect(currentNotebook).toBeUndefined();
        });

        $httpBackend.flush();
        $rootScope.$digest();

    });



});