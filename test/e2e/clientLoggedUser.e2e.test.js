describe("Client interaction when user is logged in", function() {

    var httpMock = function() {
        angular.module('httpBackendMock', ['ngMockE2E'])
            .run(function($httpBackend, NameSpace) {

                // This objects are a mock of the server response
                // To test a functionality that made an http call add here the necessarry
                // server response and add an $httpBackend.whenGET('yourUrl').respond(yourResponse);

                var annResponse = {
                    graph: {
                        "http://fake-url.it/empty.html#xpointer(start-point(string-range(//DIV[@about='http://fake-url.it/empty.html']/DIV[1]/P[2]/B[2]/text()[1],'',0))/range-to(string-range(//DIV[@about='http://fake-url.it/empty.html']/DIV[1]/P[2]/B[2]/text()[1],'',5)))": {
                            "http://schema.org/comment": [{ value: "poeta italiano del 1300", type: "literal"}]
                        }
                    },
                    items: {
                        "http://fake-url.it/empty.html#xpointer(start-point(string-range(//DIV[@about='http://fake-url.it/empty.html']/DIV[1]/P[2]/B[2]/text()[1],'',0))/range-to(string-range(//DIV[@about='http://fake-url.it/empty.html']/DIV[1]/P[2]/B[2]/text()[1],'',5)))": {
                            "http://purl.org/dc/terms/isPartOf":
                                [{type: "uri", value: "http://fake-url.it/empty.html"}],
                            "http://purl.org/pundit/ont/ao#hasPageContext":
                                [{type: "uri", value: "http://localhost:9000/app/examples/client-TEST.html"}],
                            "http://www.w3.org/1999/02/22-rdf-syntax-ns#type":
                                [{type: "uri", value: "http://purl.org/pundit/ont/ao#fragment-text"}],
                            "http://www.w3.org/2000/01/rdf-schema#label":
                                [{type: "literal", value: "Dante"}],
                        },
                        "http://schema.org/comment": {
                            "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": [{type: "uri", value: NameSpace.rdf.property}],
                            "http://www.w3.org/2000/01/rdf-schema#label": [{type: "literal", value: "has comment (free text)"}]

                        },
                        "http://purl.org/pundit/ont/ao#fragment-text": {
                            "http://www.w3.org/2000/01/rdf-schema#label": 
                                [{type: "literal", value: "Text fragment"}]
                        },
                        "http://www.w3.org/1999/02/22-rdf-syntax-ns#Property": {
                            "http://www.w3.org/2000/01/rdf-schema#label": 
                                [{type: "literal", value: "Property"}]
                        }
                    },
                    metadata: {
                        "http://purl.org/pundit/demo-cloud-server/annotation/annid123": {
                            // TODO others property if necessary
                            "http://purl.org/pundit/ont/ao#hasPageContext":
                                [{type: "uri", value: "http://localhost:9000/app/examples/client-TEST.html"}],
                            "http://purl.org/pundit/ont/ao#isIncludedIn":
                                [{type: "uri", value: "http://purl.org/pundit/demo-cloud-server/notebook/ntid123"}],
                            "http://purl.org/dc/terms/creator":
                                [{type: "uri", value: "http://purl.org/pundit/demo-cloud-server/user/userid123"}],
                            "http://purl.org/dc/elements/1.1/creator":
                                [{type: "literal", value: "Creator User Name"}]
                        }

                    }
                };

                var userLoggedIn = {
                    loginStatus: 1,
                    id: "userid123",
                    uri: "http://purl.org/pundit/demo-cloud-server/user/userid123",
                    openid: "http://myOpenId.fake",
                    firstName: "Mario",
                    lastName: "Rossi",
                    fullName: "Mario Rossi",
                    email: "mario@rossi.it",
                    loginServer: "http:\/\/demo-cloud.as.thepund.it:8080\/annotationserver\/login.jsp"
                };

                var logoutOk = { logout: 1 };

                var annMedatadaSearch = {
                    "http://sever.url/annotation/annid123": {
                        // annotation medatada here if necessary
                    }
                };

                var notebookMedatada = {
                    "http://sever.url/notebook/ntid123": {
                        // notebook medatada here if necessary
                        "http://open.vocab.org/terms/visibility":
                            [{type: "literal", value: "public"}],
                        "http://www.w3.org/2000/01/rdf-schema#label":
                            [{type: "literal", value: "Notebook Name"}],
                        "http://www.w3.org/1999/02/22-rdf-syntax-ns#type":
                            [{type: "uri", value: "http://purl.org/pundit/ont/ao#Notebook"}],
                        "http://purl.org/pundit/ont/ao#id":
                            [{type: "literal", value: "ntid123"}]
                    }
                };

                var notebookCurrent = {
                    NotebookID: "ntid123"
                };

                var notebooksOwned = {
                    NotebookIDs: ["ntid123"]
                };

                var templates = {
                    label: 'Template Name',
                    triples : [
                        {
                            predicate: {
                                "label": "talks about",
                                "domain": ["http://purl.org/pundit/ont/ao#fragment-text"],
                                "range": [],
                                "uri": "http://purl.org/pundit/ont/oa#talksAbout"
                            }
                        }
                    ]
                };

                // extend here if you nedd to catch an unexpected http call
                // if user is logged do this http call

                // get user status (user logged)
                $httpBackend.whenGET(NameSpace.get('asUsersCurrent')).respond(userLoggedIn);
                // get my items
                $httpBackend.whenGET(new RegExp("http://test.config.url/api/services/preferences/favorites")).respond(undefined);
                // get my notebooks
                $httpBackend.whenGET(NameSpace.get('asNBOwned')).respond(notebooksOwned);
                // get annotations on annotations API
                $httpBackend.whenGET(new RegExp("http://test.config.url/api/annotations/metadata/search")).respond(annMedatadaSearch);
                $httpBackend.whenGET(new RegExp("http://test.config.url/api/annotations/annid123")).respond(annResponse);
                // get notebooks metadata
                $httpBackend.whenGET(NameSpace.get('asNBMeta', {id: "ntid123"})).respond(notebookMedatada);
                // get current notebook
                $httpBackend.whenGET(NameSpace.get('asNBCurrent')).respond(notebookCurrent);
                // get configured templates
                $httpBackend.whenJSONP(new RegExp("http://template-test-url.com/t1")).respond(templates);

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

    it("should correctly open triple composer from annotation sidebar when edit annotation", function(){
        // open sidebar by click on annotation icon
        p.findElement(protractor.By.css('annotation-sidebar annotation-details[id=annid123]')).click();
        // open triple composer by click on edit button
        p.findElement(protractor.By.css('annotation-sidebar annotation-details[id=annid123] .pnd-annotation-details-footer button.btn-success')).click();
        
        // now triple composer show annotation and allow to modify it

        // dashboard should be visible
        p.findElements(protractor.By.css('.pnd-dashboard-container.ng-hide')).then(function(elements) {
            expect(elements.length).toBe(0);
        });
        // dashboard (tools) panel should be visible
        p.findElements(protractor.By.css('dashboard-panel[paneltitle=tools] .pnd-dashboard-panel-expanded.ng-hide')).then(function(elements) {
            expect(elements.length).toBe(0);
        });
        // triple composer should be have one triple
        p.findElements(protractor.By.css(".pnd-triplecomposer-statements-container statement")).then(function(s) {
            expect(s.length).toBe(1);
        });
        // the triple should be have the expected subject
        p.findElements(protractor.By.css("statement .pnd-statement-subject .pnd-statement-label")).then(function(sub) {
            expect(sub.length).toBe(1);
            expect(sub[0].getText()).toEqual("Dante");
        });
        // the triple should be have the expected predicate
        p.findElements(protractor.By.css("statement .pnd-statement-predicate .pnd-statement-label")).then(function(pred) {
            expect(pred.length).toBe(1);
            expect(pred[0].getText()).toEqual("has comment (free text)");
        });
        // the triple should be have the expected object
        p.findElements(protractor.By.css("statement .pnd-statement-object .pnd-statement-label")).then(function(obj) {
            expect(obj.length).toBe(1);
            expect(obj[0].getText()).toEqual("poeta italiano del 1300");
        });
    });

    it("should show confirm modal when try to delete annotation", function(){
        // open sidebar by click on annotation icon
        p.findElement(protractor.By.css('annotation-sidebar annotation-details[id=annid123]')).click();
        // should show confirm modal when click delete
        p.findElement(protractor.By.css('annotation-sidebar annotation-details[id=annid123] .pnd-annotation-details-footer button.btn-danger')).click();
        // check if info modal exist
        p.findElements(protractor.By.css('.pnd-confirm-modal-container')).then(function(m){
            expect(m.length).toBe(1);
        });
    });

    it("should correctly show template inside triple composer", function(){
        //enable template mode
        p.findElement(protractor.By.css('toolbar .pnd-toolbar-template-mode-button')).click();
        // open dashboard (triple composer is showed by default)
        p.findElement(protractor.By.css('toolbar .pnd-toolbar-dashboard-button')).click();

        // check triple composer header
        p.findElement(protractor.By.css('triple-composer .pnd-panel-tab-content-header')).then(function(h){
            expect(h.getText()).toBe('Complete your Annotation and Save!');
        });
        // check triple composer statement subject text
        p.findElement(protractor.By.css('triple-composer statement .pnd-statement-subject .pnd-statement-subject-text')).then(function(t){
            expect(t.getText()).toBe('Select some text on the page');
            // it must be visible
            t.getAttribute('class').then(function(classes){
                expect(classes.indexOf('ng-hide')).toBe(-1);
            });
        });
        // check triple composer object
        p.findElement(protractor.By.css('triple-composer statement .pnd-statement-object .pnd-statement-mandatory-object')).then(function(o){
            // it must have solid red border
            o.getCssValue('border').then(function(border){
                expect(border).toBeDefined();
                expect(border.indexOf('1px solid')).toBeGreaterThan(-1);
            });
        });
    });

    it("should correctly show a text selection inside triple composer during template mode", function(){
        //enable template mode
        p.findElement(protractor.By.css('toolbar .pnd-toolbar-template-mode-button')).click();
        // open dashboard (triple composer is showed by default)
        p.findElement(protractor.By.css('toolbar .pnd-toolbar-dashboard-button')).click();

        var el = p.findElement(protractor.By.css('.pnd-test-init-selection'));
        // dbclick (simulate a selection) on text populate the triple composer subject
        p.actions().doubleClick(el).perform();

        // check triple composer statement subject text
        p.findElement(protractor.By.css('triple-composer statement .pnd-statement-subject .pnd-statement-label')).then(function(t){
            expect(t.getText()).toBe('Boccaccio');
            // it must be visible
            t.getAttribute('class').then(function(classes){
                expect(classes.indexOf('ng-hide')).toBe(-1);
            });
        });
        
    });

});