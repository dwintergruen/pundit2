describe("Client interaction", function() {

    var httpMock = function() {
        angular.module('httpBackendMock', ['ngMockE2E'])
            .run(function($httpBackend) {

                $httpBackend.whenGET(/.*/).passThrough();
                $httpBackend.whenJSONP(/.*/).passThrough();

            });
    };

    var p = protractor.getInstance();

    beforeEach(function(){
        p.addMockModule('httpBackendMock', httpMock);
        p.get('/app/examples/client-TEST.html');
    });

    afterEach(function() {
        p.removeMockModule('httpBackendMock');
    });

    it("should correctly show item", function(){

        p.findElement(protractor.By.css("[data-ng-app='Pundit2']")).then(function(item) {
            console.log("compleate loading ????");
            p.sleep(30000);
        });

    });

});