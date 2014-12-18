describe("My Notebooks interaction", function() {

    var httpMock = function() {
        angular.module('httpBackendMock', ['ngMockE2E'])
            .run(function($httpBackend, NameSpace) {

                var userLoggedIn = {
                    loginStatus: 1
                };

                var myNotebooks = {
                    NotebookIDs: ["ntfkid123"]
                };

                var notebookMedatada = {
                    "http://sever.url/notebook/ntfkid123": {
                        // notebook medatada here if necessary
                        "http://open.vocab.org/terms/visibility":
                            [{type: "literal", value: "public"}],
                        "http://www.w3.org/2000/01/rdf-schema#label":
                            [{type: "literal", value: "Notebook Name"}],
                        "http://www.w3.org/1999/02/22-rdf-syntax-ns#type":
                            [{type: "uri", value: "http://purl.org/pundit/ont/ao#Notebook"}],
                        "http://purl.org/pundit/ont/ao#id":
                            [{type: "literal", value: "ntfkid123"}]
                    }
                };

                var notebookCurrent = {
                    NotebookID: "ntfkid123"
                };

                $httpBackend.whenGET(NameSpace.get('asUsersCurrent')).respond(userLoggedIn);

                $httpBackend.whenGET(NameSpace.get('asNBOwned')).respond(myNotebooks);
                $httpBackend.whenGET(NameSpace.get('asNBMeta', {id: "ntfkid123"})).respond(notebookMedatada);
                $httpBackend.whenGET(NameSpace.get('asNBCurrent')).respond(notebookCurrent);

                // $httpBackend.whenPOST(NameSpace.get('asPref', { key:'favorites'})).respond({});
            });
    };

    var p = protractor.getInstance();

    beforeEach(function(){
        p.addMockModule('httpBackendMock', httpMock);
        p.get('/app/examples/myNotebooksContainer.html');
    });

    afterEach(function() {
        p.removeMockModule('httpBackendMock');
    });

    it('should correctly load default template', function() {
        // check tab content (welcome messagge)
        p.findElements(protractor.By.css('.pnd-panel-tab-content-content .pnd-dashboard-welcome')).then(function(welcome){
            expect(welcome.length).toBe(1);
            expect(welcome[0].getText()).toEqual("No notebook found.");
        });
    });

    it('should correctly show my notebooks', function() {
        p.findElement(protractor.By.css('.pnd-test-get-my-notebooks')).click();
        // check notebook
        p.findElements(protractor.By.css('.pnd-panel-tab-content-content item-notebook')).then(function(notebooks) {
            expect(notebooks.length).toBe(1);
            expect(notebooks[0].getAttribute('nid')).toEqual('ntfkid123');
        });
    });

});