describe("Client interaction when user is logged in", function() {

    var pageItemsNumber = 1;

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
                                [{type: "literal", value: "Dante"}]
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

                // var logoutOk = { logout: 1 };

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
                $httpBackend.whenGET(NameSpace.get('asPref', {key: 'favorites'})).respond(undefined);
                // post my items
                $httpBackend.whenPOST(NameSpace.get('asPref', {key: 'favorites'})).respond({});
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

    it("should correctly show ctx menu voice when triple composer is empty", function(){
        // dbclick (simulate a selection) on text
        var el = p.findElement(protractor.By.css('.pnd-test-init-selection'));
        p.actions().doubleClick(el).perform();

        // check triple composer statement subject text
        p.findElements(protractor.By.css('.dropdown-menu li a')).then(function(a){
            expect(a.length).toBe(3);
            expect(a[0].getText()).toBe('Use as Subject');
            expect(a[1].getText()).toBe('Use as Object');
            expect(a[2].getText()).toBe('Add to My Items');
        });
    });

    it("should correctly add as subject by ctx menu voice when triple composer is empty", function(){
        // dbclick (simulate a selection) on text
        var el = p.findElement(protractor.By.css('.pnd-test-init-selection'));
        p.actions().doubleClick(el).perform();

        // check triple composer statement subject text
        p.findElements(protractor.By.css('.dropdown-menu li a')).then(function(a){
            expect(a.length).toBe(3);
            expect(a[0].getText()).toBe('Use as Subject');
            a[0].click();
        });

        // check triple composer statement subject text
        p.findElement(protractor.By.css('triple-composer statement .pnd-statement-subject .pnd-statement-label')).then(function(t){
            expect(t.getText()).toBe('Boccaccio');
            // it must be visible
            t.getAttribute('class').then(function(classes){
                expect(classes.indexOf('ng-hide')).toBe(-1);
            });
        });
    });

    it("should correctly add as subject by ctx menu voice when triple composer is empty", function(){
        // dbclick (simulate a selection) on text
        var el = p.findElement(protractor.By.css('.pnd-test-init-selection'));
        p.actions().doubleClick(el).perform();

        // check triple composer statement subject text
        p.findElements(protractor.By.css('.dropdown-menu li a')).then(function(a){
            expect(a.length).toBe(3);
            expect(a[1].getText()).toBe('Use as Object');
            a[1].click();
        });

        // check triple composer statement object text
        p.findElement(protractor.By.css('triple-composer statement .pnd-statement-object .pnd-statement-label')).then(function(t){
            expect(t.getText()).toBe('Boccaccio');
            // it must be visible
            t.getAttribute('class').then(function(classes){
                expect(classes.indexOf('ng-hide')).toBe(-1);
            });
        });
    });

    it("should correctly show ctx menu voice when triple composer is empty", function(){

        // open dashboard
        p.findElement(protractor.By.css('toolbar .pnd-toolbar-dashboard-button')).click();
        // collapse tools panel
        p.findElement(protractor.By.css('dashboard-panel[paneltitle=tools] .btn.btn-default')).click();
        // open page items tab
        p.findElement(protractor.By.css("dashboard dashboard-panel .pnd-tab-header li [data-index='1']")).click();
        // mouseover on item
        var item = p.findElement(protractor.By.css("dashboard dashboard-panel .pnd-tab-content item")),
            menuBtn = p.findElement(protractor.By.css("dashboard dashboard-panel .pnd-tab-content item .pnd-icon-bars"));
        p.actions().mouseMove(item).perform();
        // wait animation
        p.sleep(500);
        // open ctx menu
        menuBtn.click();

        // check triple composer statement subject text
        p.findElements(protractor.By.css('.dropdown-menu li a')).then(function(a){
            expect(a.length).toBe(3);
            expect(a[0].getText()).toBe('Use as Subject');
            expect(a[1].getText()).toBe('Use as Object');
            expect(a[2].getText()).toBe('Add to My Items');
        });
    });

    it("should add my items by ctx menu showed on text selection", function(){

        // dbclick (simulate a selection) on text
        var el = p.findElement(protractor.By.css('.pnd-test-init-selection'));
        p.actions().doubleClick(el).perform();
        // click add my items
        p.findElements(protractor.By.css('.dropdown-menu li')).then(function(voices){
           voices[2].click();
        });

        // open dashboard
        p.findElement(protractor.By.css('toolbar .pnd-toolbar-dashboard-button')).click();
        // collapse tools panel
        p.findElement(protractor.By.css('dashboard-panel[paneltitle=tools] .btn.btn-default')).click();
        // open my items tab
        p.findElement(protractor.By.css("dashboard dashboard-panel .pnd-tab-header li [data-index='0']")).click();
        
        // chek item content
        p.findElements(protractor.By.css("dashboard my-items-container .pnd-panel-tab-content-content .pnd-tab-content > .active li .pnd-item-text")).then(function(items){
            expect(items.length).toBe(1);
            expect(items[0].getText()).toBe("Text fragment Boccaccio");
        });
    });

    it("should open resource panel on subject", function(){

        p.driver.manage().window().setSize(1200, 960);

        // open dashboard
        p.findElement(protractor.By.css('toolbar .pnd-toolbar-dashboard-button')).click();
        // open resource panel on subject
        p.findElement(protractor.By.css(".pnd-statement-object input")).click();
        // check if popover is showed
        p.findElements(protractor.By.css(".pnd-resource-panel-popover")).then(function(popover) {
            expect(popover.length).toBe(1);
        });
        // check popover vertical tabs number and names
        p.findElements(protractor.By.css(".pnd-resource-panel-popover .pnd-vertical-tabs li")).then(function(tabs) {
            expect(tabs.length).toBe(8);
        });
        // check popover vertical tabs showed items number
        p.findElements(protractor.By.css(".pnd-resource-panel-popover .pnd-vertical-tabs li a span")).then(function(spans) {
            expect(spans.length).toBe(16);
            expect(spans[0].getText()).toEqual(pageItemsNumber.toString());
            expect(spans[2].getText()).toEqual("0");
        });
    });

    it("should open resource panel on predicate", function(){

        p.driver.manage().window().setSize(1200, 960);

        // open dashboard
        p.findElement(protractor.By.css('toolbar .pnd-toolbar-dashboard-button')).click();
        // open resource panel on predicate
        p.findElement(protractor.By.css(".pnd-statement-predicate input")).click();
        // check if popover is showed
        p.findElements(protractor.By.css(".pnd-resource-panel-popover")).then(function(popover) {
            expect(popover.length).toBe(1);
        });
        // check popover vertical tabs number and names
        p.findElements(protractor.By.css(".pnd-resource-panel-popover .pnd-vertical-tabs li")).then(function(tabs) {
            expect(tabs.length).toBe(1);
        });
        // check popover vertical tabs showed items number
        p.findElements(protractor.By.css(".pnd-resource-panel-popover .pnd-vertical-tabs li a span")).then(function(spans) {
            expect(spans.length).toBe(2);
            expect(spans[0].getText()).toEqual("15");
        });
    });

    it("should correctly use resource panel item", function(){

        p.driver.manage().window().setSize(1200, 960);

        // open dashboard
        p.findElement(protractor.By.css('toolbar .pnd-toolbar-dashboard-button')).click();
        // open resource panel on subject
        p.findElement(protractor.By.css(".pnd-statement-subject input")).click();
        // check if popover is showed
        p.findElements(protractor.By.css(".pnd-resource-panel-popover")).then(function(popover) {
            expect(popover.length).toBe(1);
        });
        // click item
        p.findElement(protractor.By.css(".pnd-resource-panel-popover .pnd-vertical-tab-content > .active li .pnd-item")).click();
        // check if item have check icon
        p.findElements(protractor.By.css(".pnd-resource-panel-popover .pnd-vertical-tab-content > .active li .pnd-item .pnd-item-buttons span.pnd-icon-check")).then(function(check) {
            expect(check.length).toBe(1);
        });
        // check if use button is enabled
        p.findElement(protractor.By.css(".pnd-resource-panel-popover .pnd-vertical-tab-footer-content .pnd-resource-panel-use-button")).then(function(useBtn) {
            useBtn.getAttribute('class').then(function(classes){
                expect(classes.indexOf('disabled')).toBe(-1);
            });
            useBtn.click();
        });
        // check if popover is closed
        p.findElements(protractor.By.css(".pnd-resource-panel-popover")).then(function(popover) {
            expect(popover.length).toBe(0);
        });
    });

    it("should filter resource panel items", function(){

        p.driver.manage().window().setSize(1200, 960);

        // open dashboard
        p.findElement(protractor.By.css('toolbar .pnd-toolbar-dashboard-button')).click();
        // open resource panel on predicate
        p.findElement(protractor.By.css(".pnd-statement-predicate input")).click();
        // add text inside input to filter predicates
        // add text to popover
        p.findElement(protractor.By.css(".pnd-statement-predicate input")).sendKeys('has');
        
        // check popover vertical tabs showed number
        p.findElements(protractor.By.css(".pnd-resource-panel-popover .pnd-vertical-tabs li a span")).then(function(spans) {
            expect(spans[0].getText()).toEqual("2");
        });
        // check popover vertical tabs showed items
        p.findElements(protractor.By.css(".pnd-resource-panel-popover .pnd-vertical-tab-content > .active item")).then(function(items) {
            expect(items.length).toBe(2);
        });
    });

    it("should correctly show item preview when mouseover on triple composer items", function(){

        p.driver.manage().window().setSize(1200, 960);

        // open dashboard
        p.findElement(protractor.By.css('toolbar .pnd-toolbar-dashboard-button')).click();
        // open resource panel
        p.findElement(protractor.By.css(".pnd-statement-object input")).click();

        // add item by click on resource panel item and use btn
        p.findElement(protractor.By.css(".pnd-resource-panel-popover .pnd-item")).click();
        p.findElement(protractor.By.css(".pnd-resource-panel-popover .pnd-vertical-tab-footer-content .pnd-resource-panel-use-button")).click();

        // mouseover on item
        var item = p.findElement(protractor.By.css(".pnd-statement-object .pnd-statement-label"));
        p.actions().mouseMove(item).perform();

        // check title
        p.findElement(protractor.By.css("preview .pnd-dashboard-preview-panel-label")).getText().then(function(text) {
            expect(text).toBe("Dante");
        });
        // check type
        p.findElement(protractor.By.css("item-preview .pnd-preview-single-type")).getText().then(function(text) {
            expect(text).toBe("Text fragment");
        });

    });

    it("should correctly show notebook composer by edit notebook voice in ctx menu", function(){

        p.driver.manage().window().setSize(1600, 960);

        // open dashboard
        p.findElement(protractor.By.css('toolbar .pnd-toolbar-dashboard-button')).click();
        // collapse right panel
        p.findElement(protractor.By.css('dashboard-panel[paneltitle=details] .btn.btn-default')).click();
        // open my notebooks tab
        p.findElements(protractor.By.css("dashboard-panel[paneltitle=lists] .pnd-tab-header > li > a")).then(function(tabs) {
            tabs[4].click();
            expect(tabs[4].getText()).toBe("My Notebooks");
        });
        // move on notebook item
        var item = p.findElement(protractor.By.css("dashboard-panel[paneltitle=lists] .pnd-tab-content > div.active my-notebooks-container notebook .pnd-item"));
        p.actions().mouseMove(item).perform();
        // wait animation
        p.sleep(500);
        // open ctx menu
        p.findElements(protractor.By.css("dashboard-panel[paneltitle=lists] .pnd-tab-content > div.active my-notebooks-container notebook .pnd-item-buttons")).then(function(btns){
            btns[0].click();
        });
        // edit notebook
        p.findElements(protractor.By.css(".pnd-dropdown-contextual-menu > li > a")).then(function(options){
            expect(options[0].getText()).toBe("Edit Notebook");
            options[0].click();
        });

        // check if tools panel show notebook composer interface
        // check active tab title
        p.findElements(protractor.By.css("dashboard-panel[paneltitle=tools] .pnd-tab-header > li.active > a")).then(function(tabs) {
            expect(tabs.length).toBe(1);
            expect(tabs[0].getText()).toBe("Notebooks Composer");
        });
        
        // TODO write notebook composer dedicated e2e tests

    });

});