describe('AnnotationsCommunication service', function() {
    
    var AnnotationsCommunication,
        MyPundit,
        NameSpace,
        AnnotationsExchange,
        NotebookExchange,
        $httpBackend,
        $q,
        $rootScope;

    var userLoggedIn = {
        loginStatus: 1
    };
    var userNotLoggedIn = {
        loginStatus: 0
    };

    beforeEach(module('Pundit2'));

    beforeEach(inject(function(_AnnotationsCommunication_, _MyPundit_, _NameSpace_, _AnnotationsExchange_, _NotebookExchange_,
        _$httpBackend_, _$q_, _$rootScope_){

        AnnotationsCommunication = _AnnotationsCommunication_;
        MyPundit = _MyPundit_;
        NameSpace = _NameSpace_;
        AnnotationsExchange = _AnnotationsExchange_;
        NotebookExchange = _NotebookExchange_;
        $httpBackend = _$httpBackend_;
        $q = _$q_;
        $rootScope = _$rootScope_;
    }));

    it("should correctly delete an annotation", function(){
        var ann = {
            id : "testid123",
            isIncludedIn: "testNotebookID",
            _q: $q.defer() 
        };
        var nt = {
            id : "testNotebookID",
            includes: ["testid123"],
            _q: $q.defer(),
            removeAnnotation: function(id){
                if (this.includes[0] === id){
                    this.includes = [];
                }
            }
        };
        // http mock for login
        $httpBackend.whenGET(NameSpace.get('asUsersCurrent')).respond(userLoggedIn);
        // http mock for delete annotation
        $httpBackend.whenDELETE(NameSpace.get('asAnn', {id: ann.id})).respond();
        // mock annotation locally
        AnnotationsExchange.addAnnotation(ann);
        ann._q.resolve(ann);
        // mock notebooks locally
        NotebookExchange.addNotebook(nt);
        nt._q.resolve(nt);
        $rootScope.$digest();

        // get login
        var resolved;
        MyPundit.login().then(function(){
            $httpBackend.expectGET(new RegExp(NameSpace.get('asAnnMetaSearch'))).respond();
            AnnotationsCommunication.deleteAnnotation(ann.id).then(function(){
                resolved = true;
            }, function(){
                resolved = true;
            });
        });

        // wait until delete annotation is completed
        waitsFor(function() { return resolved; }, 2000);
        runs(function() {
            expect(AnnotationsExchange.getAnnotations().length).toBe(0);
            expect(AnnotationsExchange.getAnnotationById(ann.id)).toBeUndefined();
            expect(NotebookExchange.getNotebookById(nt.id).includes.length).toBe(0);
        });

        $httpBackend.flush();
    });

    it("should reject if user is not logged", function(){
        var rejected = false;
        AnnotationsCommunication.deleteAnnotation("ID").then(function(){
            // if resolve the test fail
            expect(rejected).toBe(true);
        }, function(){
            // if reject the rejectedtest pass
            rejected = true;
            expect(rejected).toBe(true);
        });
        $rootScope.$digest();
    });

    it("should reject if server responde with error", function(){
        var rejected;
        // http mock for login
        $httpBackend.expectGET(NameSpace.get('asUsersCurrent')).respond(userLoggedIn);
        MyPundit.login().then(function(){
            $httpBackend.expectDELETE(NameSpace.get('asAnn', {id: "ID"})).respond(500, "Error msg");
            AnnotationsCommunication.deleteAnnotation("ID").then(function(){ }, function(){
                rejected = true;
            });
            waitsFor(function() { return rejected; }, 500);
            runs(function() {
                expect(rejected).toBe(true);
            });
        });
        $httpBackend.flush();
    });

});