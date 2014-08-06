/*global testNotebooks*/

describe('Notebook Communication service', function() {

    var NotebookCommunication,
        $rootScope,
        $httpBackend,
        NameSpace,
        $compile,
        Notebook,
        NotebookExchange,
        MyPundit,
        $log;

    var userLoggedIn = {
        loginStatus: 1
    };

    // var userNotLoggedIn = {
    //     loginStatus: 0
    // };

    beforeEach(module('Pundit2'));

    beforeEach(inject(function($injector, _$rootScope_, _$httpBackend_, _$compile_, _Notebook_, _NotebookExchange_, _MyPundit_, _$log_){
        NotebookCommunication = $injector.get('NotebookCommunication');
        NameSpace = $injector.get('NameSpace');
        $rootScope = _$rootScope_;
        $httpBackend = _$httpBackend_;
        $compile = _$compile_;
        Notebook = _Notebook_;
        NotebookExchange = _NotebookExchange_;
        MyPundit = _MyPundit_;
        $log = _$log_;

    }));

    it("should create a new notebook", function() {

        var name = 'myNotebook';


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

        // catch http request for get notebook metadata, called by Notebook.factory when a notebook is created
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

    it("should get my notebook", function() {

        // http mock for login
        $httpBackend.whenGET(NameSpace.get('asUsersCurrent')).respond(userLoggedIn);

        var data = {
                NotebookIDs: []
            };

        // get info about mocked public notebook
        var nbPublic = Object.keys(testNotebooks.notebookPublic)[0];
        var nbPublicVisibility = Object.keys(testNotebooks.notebookPublic[nbPublic])[0];
        var nbPublicID = Object.keys(testNotebooks.notebookPublic[nbPublic])[2];
        var nbPublicType = Object.keys(testNotebooks.notebookPublic[nbPublic])[4];
        var nbPublicLabel = Object.keys(testNotebooks.notebookPublic[nbPublic])[5];

        // get info about mocked private notebook
        var nbPrivate = Object.keys(testNotebooks.notebookPrivate)[0];
        var nbPrivateVisibility = Object.keys(testNotebooks.notebookPrivate[nbPrivate])[0];
        var nbPrivateID = Object.keys(testNotebooks.notebookPrivate[nbPrivate])[2];
        var nbPrivateType = Object.keys(testNotebooks.notebookPrivate[nbPrivate])[4];
        var nbPrivateLabel = Object.keys(testNotebooks.notebookPrivate[nbPrivate])[5];


        data.NotebookIDs.push(testNotebooks.notebookPrivate[nbPrivate][nbPrivateID][0].value);
        data.NotebookIDs.push(testNotebooks.notebookPublic[nbPublic][nbPublicID][0].value);

        $httpBackend.whenGET(NameSpace.get('asNBOwned')).respond(data);

        $httpBackend
            .whenGET(NameSpace.get('asNBMeta', {id: "88e4c1e8"}))
            .respond(testNotebooks.notebookPrivate);

        $httpBackend
            .whenGET(NameSpace.get('asNBMeta', {id: "123456789"}))
            .respond(testNotebooks.notebookPublic);

        // var promiseValue;

        // get login
        var promise = MyPundit.login();

        promise.then(function(value){
            expect(value).toBe(true);
            // when user is logged in, get my notebooks
            var p = NotebookCommunication.getMyNotebooks();

            p.then(function(nb) {
                expect(nb.length).toBe(2);

                expect(nb[0].id).toBe(testNotebooks.notebookPrivate[nbPrivate][nbPrivateID][0].value);
                expect(nb[0].visibility).toBe(testNotebooks.notebookPrivate[nbPrivate][nbPrivateVisibility][0].value);
                expect(nb[0].label).toBe(testNotebooks.notebookPrivate[nbPrivate][nbPrivateLabel][0].value);
                expect(nb[0].type[0]).toBe(testNotebooks.notebookPrivate[nbPrivate][nbPrivateType][0].value);

                expect(nb[1].id).toBe(testNotebooks.notebookPublic[nbPublic][nbPublicID][0].value);
                expect(nb[1].visibility).toBe(testNotebooks.notebookPublic[nbPublic][nbPublicVisibility][0].value);
                expect(nb[1].label).toBe(testNotebooks.notebookPublic[nbPublic][nbPublicLabel][0].value);
                expect(nb[1].type[0]).toBe(testNotebooks.notebookPublic[nbPublic][nbPublicType][0].value);


            });

        });
        $httpBackend.flush();


    });

    it("should get current notebook", function() {

        var currentNotebook = {
            NotebookID: "123456"
        };

        // http mock for login
        $httpBackend.whenGET(NameSpace.get('asUsersCurrent')).respond(userLoggedIn);
        $httpBackend.whenGET(NameSpace.get('asNBCurrent')).respond(currentNotebook);

        MyPundit.login().then(function(){
            var p = NotebookCommunication.getCurrent();

            p.then(function(currID){
                expect(currID).toBe(currentNotebook.NotebookID);
            });
        });

        $httpBackend.flush();

    });

    it("should set a notebook as private and as public", function() {

        var testId = 'simple1ID';

        // mock for get metadata new a notebook is created by new notebook
        $httpBackend
            .when('GET', NameSpace.get('asNBMeta', {id: testId}))
            .respond(testNotebooks.simple1);

        // http mock for login
        $httpBackend.whenGET(NameSpace.get('asUsersCurrent')).respond(userLoggedIn);
        $httpBackend.whenPUT(NameSpace.get('asNBPrivate'), {id: testId}).respond();
        $httpBackend.whenPUT(NameSpace.get('asNBPublic'), {id: testId}).respond();

        MyPundit.login().then(function(){
            // create notebook and add to notebook exchange
            new Notebook(testId, true).then(function(){

                // set new notebook as private
                NotebookCommunication.setPrivate(testId).then(function(){

                    // get notebook from notebook exchange...
                    var npr = NotebookExchange.getNotebookById(testId);

                    // ...and check if is visibility is set to private
                    expect(npr.visibility).toBe("private");

                    // set notebook to public
                    NotebookCommunication.setPublic(npr.id).then(function(){

                        // get notebook from notebook exchange...
                        var npb = NotebookExchange.getNotebookById(testId);

                        // ...and check if is visibility is set to public
                        expect(npb.visibility).toBe("public");
                    });
                });

            });

        });

        $httpBackend.flush();

    });

    it("should set a notebook as current", function() {

        var testId = 'simple1ID';

        var currentNotebook = {
            NotebookID: testId
        };

        // mock for get metadata new a notebook is created by new notebook
        $httpBackend
            .when('GET', NameSpace.get('asNBMeta', {id: testId}))
            .respond(testNotebooks.simple1);

        // http mock for login
        $httpBackend.whenGET(NameSpace.get('asUsersCurrent')).respond(userLoggedIn);
        $httpBackend.whenPUT(NameSpace.get('asNBCurrent'+"/"+testId)).respond();
        $httpBackend.whenGET(NameSpace.get('asNBCurrent')).respond(currentNotebook);

        MyPundit.login().then(function(){
            new Notebook(testId, true).then(function(){

                // get notebook from notebook exchange...
                var n = NotebookExchange.getNotebookById(testId);

                // ... and set that notebook as current
                NotebookCommunication.setCurrent(n.id).then(function(){

                    // check if notebook is set as current by http calling...
                    NotebookCommunication.getCurrent().then(function(currNbID){
                        expect(currNbID).toBe(testId);
                    });

                    // ... and in notebook exchange
                    var currentNotebook = NotebookExchange.getCurrentNotebooks();
                    expect(currentNotebook.id).toBe(testId);
                });

            });
        });

        $httpBackend.flush();

    });

    it("should edit label of a notebook", function() {

        var testId = 'simple1ID';

        var data = {"NotebookName": 'edited name'};

        // mock for get metadata new a notebook is created by new notebook
        $httpBackend
            .when('GET', NameSpace.get('asNBMeta', {id: testId}))
            .respond(testNotebooks.simple1);

        // http mock for login
        $httpBackend.whenGET(NameSpace.get('asUsersCurrent')).respond(userLoggedIn);
        $httpBackend.whenPUT(NameSpace.get('asNBEditMeta',{id: testId}), data).respond();

        // get login
        MyPundit.login().then(function(){
            // create a new notebook
            new Notebook(testId, true).then(function(){

                // get the notebook from notebook exchange and check that his label is not modified yet
                var n = NotebookExchange.getNotebookById(testId);
                expect(n.label).not.toBe(data.NotebookName);

                // edit notebook label
                NotebookCommunication.setName(n.id, data.NotebookName).then(function(){

                    // and check if notebook label is updated
                    n = NotebookExchange.getNotebookById(testId);
                    expect(n.label).toBe(data.NotebookName);
                });
            });

        });

        $httpBackend.flush();

    });

    it("should delete a notebook", function() {

        var testId = 'simple1ID';

        // mock for get metadata new a notebook is created by new notebook
        $httpBackend
            .when('GET', NameSpace.get('asNBMeta', {id: testId}))
            .respond(testNotebooks.simple1);

        // http mock for login
        $httpBackend.whenGET(NameSpace.get('asUsersCurrent')).respond(userLoggedIn);
        $httpBackend.whenDELETE(NameSpace.get('asNB'+"/"+testId)).respond();

        // get login
        MyPundit.login().then(function(){
            // create a new notebook
            new Notebook(testId, true).then(function(){

                // get the notebook from notebook exchange and check that exist
                var n = NotebookExchange.getNotebookById(testId);
                expect(n).toBeDefined();

                // delete the notebook
                NotebookCommunication.deleteNotebook(n.id).then(function(){

                    // and check that notebook doesn't exist anymore!
                    n = NotebookExchange.getNotebookById(testId);
                    expect(n).toBeUndefined();
                });
            });

        });

        $httpBackend.flush();

    });

    it("should reject promise if user is not logged in", function() {

        // if an user not logged get any kind of operation is notebook communication service,
        // promise should be rejected with a User not logged error
        NotebookCommunication.setCurrent("myID").then(function(){
            }, function(msg){
                // check if user not logged message is returned
                expect(msg.indexOf("User not logged")).toBeGreaterThan(-1);
            });

        NotebookCommunication.setPrivate("myID").then(function(){
        }, function(msg){
            // check if user not logged message is returned
            expect(msg.indexOf("User not logged")).toBeGreaterThan(-1);
        });

        NotebookCommunication.setPublic("myID").then(function(){
        }, function(msg){
            // check if user not logged message is returned
            expect(msg.indexOf("User not logged")).toBeGreaterThan(-1);
        });

        NotebookCommunication.getMyNotebooks().then(function(){
        }, function(msg){
            // check if user not logged message is returned
            expect(msg.indexOf("User not logged")).toBeGreaterThan(-1);
        });

        NotebookCommunication.getCurrent().then(function(){
        }, function(msg){
            // check if user not logged message is returned
            expect(msg.indexOf("User not logged")).toBeGreaterThan(-1);
        });

        NotebookCommunication.deleteNotebook().then(function(){
        }, function(msg){
            // check if user not logged message is returned
            expect(msg.indexOf("User not logged")).toBeGreaterThan(-1);
        });

        NotebookCommunication.setName("id", "name").then(function(){
        }, function(msg){
            // check if user not logged message is returned
            expect(msg.indexOf("User not logged")).toBeGreaterThan(-1);
        });

        $rootScope.$digest();

    });

    it("should reject delete notebook promise", function() {

        var testId = 'simple1ID';
        var errorMessage = "server get error";

        // http mock for login
        $httpBackend.whenGET(NameSpace.get('asUsersCurrent')).respond(userLoggedIn);
        $httpBackend.whenDELETE(NameSpace.get('asNB'+"/"+testId)).respond(500, errorMessage);

        // get login
        MyPundit.login().then(function(){
            // delete the notebook
            NotebookCommunication.deleteNotebook(testId).then(function(){

            }, function(msg){
                // promise should be resolved with error message
                expect(msg).toBe(errorMessage);
            });

        });

        $httpBackend.flush();

    });

    it("should reject edit notebook promise", function() {

        var testId = 'simple1ID';
        var errorMessage = "server get error";
        var data = {"NotebookName": 'edited name'};

        // http mock for login
        $httpBackend.whenGET(NameSpace.get('asUsersCurrent')).respond(userLoggedIn);
        //$httpBackend.whenDELETE(NameSpace.get('asNB'+"/"+testId)).respond(500, errorMessage);
        $httpBackend.whenPUT(NameSpace.get('asNBEditMeta',{id: testId}), data).respond(500, errorMessage);

        // get login
        MyPundit.login().then(function(){
            // delete the notebook
            NotebookCommunication.setName(testId, data.NotebookName).then(function(){

            }, function(msg){
                // promise should be resolved with error message
                expect(msg).toBe(errorMessage);
            });

        });

        $httpBackend.flush();

    });

    it("should reject set private notebook promise", function() {

        var testId = 'simple1ID';
        var errorMessage = "server get error";

        // http mock for login
        $httpBackend.whenGET(NameSpace.get('asUsersCurrent')).respond(userLoggedIn);
        $httpBackend.whenPUT(NameSpace.get('asNBPrivate'), {id: testId}).respond(500, errorMessage);

        // get login
        MyPundit.login().then(function(){
            // delete the notebook
            NotebookCommunication.setPrivate(testId).then(function(){

            }, function(msg){
                // promise should be resolved with error message
                expect(msg).toBe(errorMessage);
            });

        });

        $httpBackend.flush();

    });

    it("should reject set public notebook promise", function() {

        var testId = 'simple1ID';
        var errorMessage = "server get error";

        // http mock for login
        $httpBackend.whenGET(NameSpace.get('asUsersCurrent')).respond(userLoggedIn);
        $httpBackend.whenPUT(NameSpace.get('asNBPublic'), {id: testId}).respond(500, errorMessage);

        // get login
        MyPundit.login().then(function(){
            // delete the notebook
            NotebookCommunication.setPublic(testId).then(function(){

            }, function(msg){
                // promise should be resolved with error message
                expect(msg).toBe(errorMessage);
            });

        });

        $httpBackend.flush();

    });

    it("should reject get current notebook promise", function() {

        var errorMessage = "server get error";
        $log.reset();

        // http mock for login
        $httpBackend.whenGET(NameSpace.get('asUsersCurrent')).respond(userLoggedIn);
        $httpBackend.whenGET(NameSpace.get('asNBCurrent')).respond(500, errorMessage);

        // get login
        MyPundit.login().then(function(){
            // delete the notebook
            NotebookCommunication.getCurrent().then(function(){

            }, function(msg){
                // promise should be resolved with error message
                expect(msg).toBe(errorMessage);
            });

        });

        $httpBackend.flush();

    });

    it("should reject set current notebook promise", function() {

        var testId = 'simple1ID';
        var errorMessage = "server get error";
        $log.reset();

        // http mock for login
        $httpBackend.whenGET(NameSpace.get('asUsersCurrent')).respond(userLoggedIn);
        $httpBackend.whenPUT(NameSpace.get('asNBCurrent'+"/"+testId)).respond(500, errorMessage);

        // get login
        MyPundit.login().then(function(){
            // delete the notebook
            NotebookCommunication.setCurrent(testId).then(function(){

            }, function(msg){
                // promise should be resolved with error message
                expect(msg).toBe(errorMessage);
            });

        });

        $httpBackend.flush();

    });

    it("should reject create notebook promise", function() {

        var errorMessage = "server get error";

        var name = 'myNotebook';

        var header = {"Accept":"application/json","Content-Type":"application/json;charset=UTF-8;"};
        var data = {"NotebookName": 'myNotebook'};

        // http mock for login
        $httpBackend.whenGET(NameSpace.get('asUsersCurrent')).respond(userLoggedIn);
        // catch http request for notebook creation
        $httpBackend
            .expectPOST(NameSpace.get('asNB'), data, header)
            .respond(500, errorMessage);

        // get login
        MyPundit.login().then(function(){
            // delete the notebook
            NotebookCommunication.createNotebook(name).then(function(){

            }, function(msg){
                // promise should be resolved with error message
                expect(msg).toBe("Error from server while retrieving list of my notebooks: "+500);

            });

        });

        $httpBackend.flush();
    });

    it("should reject create notebook promise when create method return an empty notebook", function() {

        var name = 'myNotebook';

        var header = {"Accept":"application/json","Content-Type":"application/json;charset=UTF-8;"};
        var data = {"NotebookName": 'myNotebook'};

        // http mock for login
        $httpBackend.whenGET(NameSpace.get('asUsersCurrent')).respond(userLoggedIn);
        // catch http request for notebook creation
        $httpBackend
            .expectPOST(NameSpace.get('asNB'), data, header)
            .respond({});

        // get login
        MyPundit.login().then(function(){
            // delete the notebook
            NotebookCommunication.createNotebook(name).then(function(){

            }, function(msg){
                // promise should be resolved with error message
                expect(msg).toBe('some sort of error?');

            });

        });

        $httpBackend.flush();
    });

    it("should reject get my notebook promise", function() {

        // var errorMessage = "server get error";

        // http mock for login
        $httpBackend.whenGET(NameSpace.get('asUsersCurrent')).respond(userLoggedIn);
        $httpBackend.whenGET(NameSpace.get('asNBOwned')).respond(500);

        // get login
        MyPundit.login().then(function(){
            // delete the notebook
            NotebookCommunication.getMyNotebooks().then(function(){

            }, function(msg){
                // promise should be resolved with error message
                expect(msg).toBe("Error from server while retrieving list of my notebooks: "+500);

            });

        });

        $httpBackend.flush();
    });

    it("should reject get my notebook promise when get my notebooks return empty response", function() {

        // var errorMessage = "server get error";

        // http mock for login
        $httpBackend.whenGET(NameSpace.get('asUsersCurrent')).respond(userLoggedIn);
        $httpBackend.whenGET(NameSpace.get('asNBOwned')).respond('');

        // get login
        MyPundit.login().then(function(){
            // delete the notebook
            NotebookCommunication.getMyNotebooks().then(function(){

            }, function(msg){
                // promise should be resolved with error message
                expect(msg).toBe("some sort of error?");

            });

        });

        $httpBackend.flush();
    });

    it("should reject get my notebook promise when return empty notebooks response", function() {

        // var errorMessage = "server get error";

        // http mock for login
        $httpBackend.whenGET(NameSpace.get('asUsersCurrent')).respond(userLoggedIn);
        $httpBackend.whenGET(NameSpace.get('asNBOwned')).respond({});

        // get login
        MyPundit.login().then(function(){
            // delete the notebook
            NotebookCommunication.getMyNotebooks().then(function(){

            }, function(msg){
                // promise should be resolved with error message
                expect(msg).toBe("some sort of error?");

            });

        });

        $httpBackend.flush();
    });

    it("should reject get my notebook promise when new notebook call is rejected", function() {

        var data = {
            NotebookIDs: ["myTestId"]
        };

        // http mock for login
        $httpBackend.whenGET(NameSpace.get('asUsersCurrent')).respond(userLoggedIn);
        $httpBackend.whenGET(NameSpace.get('asNBOwned')).respond(data);
        $httpBackend
            .whenGET(NameSpace.get('asNBMeta', {id: "myTestId"}))
            .respond(500);

        // get login
        MyPundit.login().then(function(){
            // delete the notebook
            NotebookCommunication.getMyNotebooks().then(function(){

            }, function(msg){
                // promise should be resolved with error message
                expect(msg).toBe("some other error?");

            });

        });

        $httpBackend.flush();
    });

});