describe("My Items interaction", function() {

    var httpMock = function() {
        angular.module('httpBackendMock', ['ngMockE2E'])
            .run(function($httpBackend, NameSpace) {

                var userLoggedIn = {
                    loginStatus: 1
                };

                $httpBackend.whenGET(NameSpace.get('asUsersCurrent')).respond(userLoggedIn);

                var myItems = {
                    value: [
                        {
                            description: "Text fragment description",
                            isPartOf: "http://fake-url.it/release_bot/build/examples/dante-1.html",
                            label: "Text fragment label",
                            pageContext: "http://localhost:9000/app/examples/client.html",
                            type: ["http://purl.org/pundit/ont/ao#fragment-text"],
                            uri: "http://fake-url.it/xpointerUriVeryLong"
                        }
                    ]
                };

                $httpBackend.whenGET(NameSpace.get('asPref', { key:'favorites'})).respond(myItems);
                $httpBackend.whenPOST(NameSpace.get('asPref', { key:'favorites'})).respond({});
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
            expect(items[0].getText()).toEqual("Please login to see your items.");
        });
    });

    it('should correctly show my items', function() {
        p.findElement(protractor.By.css('.pnd-test-get-my-items')).click();
        // check active tab content
        p.findElements(protractor.By.css('.pnd-tab-content .active item')).then(function(items) {
            expect(items.length).toBe(1);
            expect(items[0].getAttribute('uri')).toEqual('http://fake-url.it/xpointerUriVeryLong');
        });
    });

    it('should correctly open confirm modal when try to delete all my items', function() {
        p.findElement(protractor.By.css('.pnd-test-get-my-items')).click();
        // check active tab content
        p.findElements(protractor.By.css('.pnd-tab-content .active item')).then(function(items) {
            expect(items.length).toBe(1);
            expect(items[0].getAttribute('uri')).toEqual('http://fake-url.it/xpointerUriVeryLong');
        });

        // click delete btn (this open a confirm modal)
        p.findElement(protractor.By.css('.pnd-panel-tab-content-footer .my-items-btn-delete')).click();
        p.findElements(protractor.By.css('.pnd-confirm-modal-container')).then(function(m) {
            expect(m.length).toBe(1);
        });

        // click cancel btn (this close the confirm modal)
        p.findElement(protractor.By.css('.pnd-confirm-modal-cancel')).click();
        p.findElements(protractor.By.css('.pnd-confirm-modal-container')).then(function(m) {
            expect(m.length).toBe(0);
        });
        // the numbers of items not change
        p.findElements(protractor.By.css('.pnd-tab-content .active item')).then(function(items) {
            expect(items.length).toBe(1);
            expect(items[0].getAttribute('uri')).toEqual('http://fake-url.it/xpointerUriVeryLong');
        });

    });

    it('should correctly open confirm modal and delete all my items', function() {
        p.findElement(protractor.By.css('.pnd-test-login')).click();
        p.findElement(protractor.By.css('.pnd-test-get-my-items')).click();
        // check active tab content
        p.findElements(protractor.By.css('.pnd-tab-content .active item')).then(function(items) {
            expect(items.length).toBe(1);
            expect(items[0].getAttribute('uri')).toEqual('http://fake-url.it/xpointerUriVeryLong');
        });

        // click delete btn (this open a confirm modal)
        p.findElement(protractor.By.css('.pnd-panel-tab-content-footer .my-items-btn-delete')).click();
        p.findElements(protractor.By.css('.pnd-confirm-modal-container')).then(function(m) {
            expect(m.length).toBe(1);
        });

        // click confirm btn (this close the confirm modal)
        p.findElement(protractor.By.css('.pnd-confirm-modal-confirm')).click();
        // the number of items now is zero
        p.findElements(protractor.By.css('.pnd-tab-content .active item')).then(function(items) {
            expect(items.length).toBe(0);
        });

    });

});