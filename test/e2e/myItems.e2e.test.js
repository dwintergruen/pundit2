describe("My Items interaction", function() {

    var httpMock = function() {
        angular.module('httpBackendMock', ['ngMockE2E'])
            .run(function($httpBackend, NameSpace) {

                var userLoggedIn = {
                    loginStatus: 1
                };

                var myItems = {
                    value: [
                        {
                            description: "world",
                            isPartOf: "http://fake-url.it/release_bot/build/examples/dante-1.html",
                            label: "world",
                            pageContext: "http://localhost:9000/app/examples/client.html",
                            type: ["http://purl.org/pundit/ont/ao#fragment-text"],
                            uri: "http://fake-url.it/xpointerUriVeryLong"
                        }
                    ]
                };

                var anyItem = {
                    value: []
                };

                $httpBackend.whenGET(NameSpace.get('asUsersCurrent')).respond(userLoggedIn);
                $httpBackend.whenGET(NameSpace.get('asPref', { key:'favorites'})).respond(anyItem);
            });
    };

    var p = protractor.getInstance();

    beforeEach(function(){
        p.addMockModule('httpBackendMock', httpMock);
        p.get('/app/examples/myItemsContainer.html');
    });

    afterEach(function() {
        p.removeMockModule('httpBackendMock');
    });

    it('should correctly load default template', function() {
        // check tab content (welcome messagge)
        p.findElements(protractor.By.css('.pnd-tab-content .active .pnd-dashboard-welcome')).then(function(items){
            expect(items.length).toBe(1);
            expect(items[0].getText()).toEqual("No my items found.");
        });
    });

});