describe("Vocabularies interaction", function() {
    var p = protractor.getInstance();

    var fs = require('fs'),
        myHttpMock;

    // TODO mock as module that read from default config of vocabularies service
    var freebaseItemUri = "http://www.freebase.com/m/02qtppz",
        murucaItemsUri = ["http://purl.org/galassiariosto/resources/azione_illustrazione/7", "http://purl.org/galassiariosto/resources/azione_illustrazione/1149"],
        menuType = "vocabItems";

    fs.readFile('test/e2e/VocabHttpMock.e2e.js', 'utf8', function(err, data) {
        if (err) {
            console.log('You need an VocabHttpMock.e2e.js in test/e2e/');
            return console.log(err);
        }
        /* jshint -W061 */
        eval(data);
        /* jshint +W061 */
        myHttpMock = VocabHttpMock;
    });

    beforeEach(function(){
        p.addMockModule('httpBackendMock', myHttpMock);
        p.get('/app/examples/vocabularies.html');
    });
 
    afterEach(function() {
        p.removeMockModule('httpBackendMock');
    });

    it('should correctly load default template', function() {

        // check tabs number (vocab + hidden vocab)
        p.findElements(protractor.By.css('.pnd-tab-header > li')).then(function(tabs) {
            expect(tabs.length).toBe(4);
        });

        // check tab content (welcome messagge)
        p.findElements(protractor.By.css('.pnd-tab-content .pnd-dashboard-welcome')).then(function(items){
            expect(items.length).toBe(1);
            expect(items[0].getText()).toEqual("I'm a welcome message");
        });

    });

    it('should correctly show item', function() {

        p.findElement(protractor.By.css('.pnd-panel-tab-content-header input')).sendKeys('pippo');

        p.findElements(protractor.By.css('.pnd-tab-content item')).then(function(items){
            expect(items.length).toBe(1);
            expect(items[0].getAttribute('uri')).toEqual(freebaseItemUri);
            expect(items[0].getAttribute('menu-type')).toEqual(menuType);
        });

    });

    it('should correctly show items in different tabs', function() {

        p.findElement(protractor.By.css('.pnd-panel-tab-content-header input')).sendKeys('pippo');

        p.findElements(protractor.By.css('.pnd-tab-header li')).then(function(tabs){
            // switch to muruca item list (click muruca tab header)
            tabs[1].click();
        });

        p.findElements(protractor.By.css('.pnd-tab-content item')).then(function(items){
            expect(items.length).toBe(2);
            expect(items[0].getAttribute('uri')).toEqual(murucaItemsUri[1]);
            expect(items[1].getAttribute('uri')).toEqual(murucaItemsUri[0]);
            expect(items[0].getAttribute('menu-type')).toEqual(menuType);
            expect(items[1].getAttribute('menu-type')).toEqual(menuType);
        });

    });

    it('should correctly show no found messagge after a failed search', function() {

        p.findElement(protractor.By.css('.pnd-panel-tab-content-header input')).sendKeys('anything');

        p.findElements(protractor.By.css('.pnd-tab-header li')).then(function(tabs){
            // switch to korbo item list (click korbo tab header)
            tabs[2].click();
        });

        // check tab content (no found messagge)
        p.findElements(protractor.By.css('.pnd-tab-content .pnd-dashboard-welcome')).then(function(items){
            expect(items.length).toBe(1);
            expect(items[0].getText()).toEqual("No item found to: anything");
        });

    });

});