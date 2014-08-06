describe("TripleComposer interaction", function() {
    var p = protractor.getInstance();

    beforeEach(function(){
        p.get('/app/examples/tripleComposer.html');
    });

    it("should correctly load triple composer", function(){
        // triple composer born with one empty statement
        
        // statement directive
        p.findElements(protractor.By.css(".pnd-triplecomposer-statements-container statement")).then(function(s) {
            expect(s.length).toBe(1);
        });
        // statement containers div
        p.findElements(protractor.By.css("statement .pnd-statement-subject")).then(function(sub) {
            expect(sub.length).toBe(1);
        });
        p.findElements(protractor.By.css("statement .pnd-statement-predicate")).then(function(pred) {
            expect(pred.length).toBe(1);
        });
        p.findElements(protractor.By.css("statement .pnd-statement-object")).then(function(obj) {
            expect(obj.length).toBe(1);
        });
        // clear and copy buttons
        p.findElements(protractor.By.css("statement .pnd-statement-buttons button")).then(function(btn) {
            expect(btn.length).toBe(2);
        });
    });

    it("should correctly add item", function(){

        p.driver.manage().window().setSize(1200, 960);

        // open resource panel
        p.findElement(protractor.By.css(".pnd-statement-object input")).click();

        p.findElements(protractor.By.css(".pnd-resource-panel-popover")).then(function(popover) {
            expect(popover.length).toBe(1);
        });

        // add item by click on resource panel item and use btn
        p.findElement(protractor.By.css(".pnd-resource-panel-popover .pnd-item")).click();
        p.findElement(protractor.By.css(".pnd-resource-panel-popover .pnd-vertical-tab-footer-content .pnd-resource-panel-use-button")).click();

        // label
        p.findElement(protractor.By.css(".pnd-statement-object .pnd-statement-label")).then(function(label) {
            expect(label.getText()).toEqual("item1Label");
        });
        // delete button
        p.findElement(protractor.By.css(".pnd-statement-object .pnd-row-button-object button")).then(function(btn) {
            expect(btn.getAttribute('title')).toEqual("delete");
        });
        // type label
        p.findElement(protractor.By.css(".pnd-statement-object .pnd-row-button-object")).then(function(div) {
            expect(div.getText()).toEqual("Text fragment");
        });
    });

    it("should correctly show predicate when object is already present", function(){

        p.driver.manage().window().setSize(1200, 960);

        // open resource panel on object
        p.findElement(protractor.By.css(".pnd-statement-object input")).click();
        // check if is opened
        p.findElements(protractor.By.css(".pnd-resource-panel-popover")).then(function(popover) {
            expect(popover.length).toBe(1);
        });
        // add item (image) by click on resource panel item and use btn
        p.findElements(protractor.By.css(".pnd-resource-panel-popover .pnd-item")).then(function(items){
            items[2].click();
        });
        p.findElement(protractor.By.css(".pnd-resource-panel-popover .pnd-vertical-tab-footer-content .pnd-resource-panel-use-button")).click();

        // open resource panel on predicate
        p.findElement(protractor.By.css(".pnd-statement-predicate input")).click();
        // check if is opened
        p.findElements(protractor.By.css(".pnd-resource-panel-popover")).then(function(popover) {
            expect(popover.length).toBe(1);
        });
        // check propeties number
        p.findElements(protractor.By.css(".pnd-resource-panel-popover .pnd-vertical-tabs > li > a span")).then(function(spans) {
            expect(spans[0].getText()).toBe('0');
        });
        p.findElements(protractor.By.css(".pnd-resource-panel-popover .pnd-vertical-tab-content item")).then(function(items) {
            expect(items.length).toBe(0);
        });

    });

    it("should correctly add literal item", function(){

        // open literal resource panel
        p.findElement(protractor.By.css(".pnd-statement-object .pnd-row-button-object [title='text']")).click();
        // check if popover exist
        p.findElements(protractor.By.css(".pnd-popover-literal")).then(function(popover) {
            expect(popover.length).toBe(1);        });

        // add text to popover
        p.findElement(protractor.By.css(".pnd-popover-literal .popover-content textarea")).sendKeys('testo');

        // click save TODO add class to save btn
        p.findElement(protractor.By.css(".pnd-popover-literal .popover-content button")).click();

        // item label
        p.findElement(protractor.By.css(".pnd-statement-object .pnd-statement-label")).then(function(label) {
            expect(label.getText()).toEqual("testo");
        });
        // delete button
        p.findElements(protractor.By.css(".pnd-statement-object .pnd-row-button-object button")).then(function(btn) {
            expect(btn.length).toBe(2);
            expect(btn[0].getAttribute('title')).toEqual("delete");
            expect(btn[1].getAttribute('title')).toEqual("text");
        });
        // type label
        p.findElement(protractor.By.css(".pnd-statement-object .pnd-row-button-object")).then(function(div) {
            expect(div.getText()).toEqual("Literal");
        });
    });

    it("should correctly edit literal item", function(){

        // open literal resource panel
        p.findElement(protractor.By.css(".pnd-statement-object .pnd-row-button-object [title='text']")).click();
        // check if popover exist
        p.findElements(protractor.By.css(".pnd-popover-literal")).then(function(popover) {
            expect(popover.length).toBe(1);
        });
        // add text to popover
        p.findElement(protractor.By.css(".pnd-popover-literal .popover-content textarea")).sendKeys('testo');

        // click save TODO add class to save btn
        p.findElement(protractor.By.css(".pnd-popover-literal .popover-content button")).click();
        // first item label
        p.findElement(protractor.By.css(".pnd-statement-object .pnd-statement-label")).then(function(label) {
            expect(label.getText()).toEqual("testo");
        });

        // open literal resource panel (second times)
        p.findElement(protractor.By.css(".pnd-statement-object .pnd-row-button-object [title='text']")).click();
        // add second text to popover
        p.findElement(protractor.By.css(".pnd-popover-literal .popover-content textarea")).then(function(textarea){
            expect(textarea.getAttribute('value')).toBe('testo');
            textarea.sendKeys(' altro testo...');
        });
            

        // click save TODO add class to save btn
        p.findElement(protractor.By.css(".pnd-popover-literal .popover-content button")).click();
        // second item label
        p.findElement(protractor.By.css(".pnd-statement-object .pnd-statement-label")).then(function(label) {
            expect(label.getText()).toEqual("testo altro testo...");
        });
    });

    it("should correctly remove item", function(){

        p.driver.manage().window().setSize(1200, 960);

        // open resource panel
        p.findElement(protractor.By.css(".pnd-statement-object input")).click();

        // add item by click on resource panel item and use btn
        p.findElement(protractor.By.css(".pnd-resource-panel-popover .pnd-item")).click();
        p.findElement(protractor.By.css(".pnd-resource-panel-popover .pnd-vertical-tab-footer-content .pnd-resource-panel-use-button")).click();

        // check label
        p.findElement(protractor.By.css(".pnd-statement-object .pnd-statement-label")).then(function(label) {
            expect(label.getText()).toEqual("item1Label");
        });

        // click delete button
        p.findElement(protractor.By.css(".pnd-statement-object .pnd-row-button-object button")).click();
        // check input
        p.findElements(protractor.By.css(".pnd-statement-object input")).then(function(input) {
            expect(input.length).toBe(1);
            expect(input[0].getAttribute('placeholder')).toEqual("search an object");
        });
                  
    });

    it("should correctly duplicate statement", function(){

        // open resource panel
        p.findElement(protractor.By.css(".pnd-statement-object input")).click();

        // add item by click on resource panel item and use btn
        p.findElement(protractor.By.css(".pnd-resource-panel-popover .pnd-item")).click();
        p.findElement(protractor.By.css(".pnd-resource-panel-popover .pnd-vertical-tab-footer-content .pnd-resource-panel-use-button")).click();
     
        // duplicate statement
        p.findElement(protractor.By.css("statement[id='1'] .pnd-statement-buttons [title='copy']")).click();
        

        // check if have the same label
        p.findElement(protractor.By.css("statement[id='2'] .pnd-statement-object .pnd-statement-label")).then(function(label) {
            expect(label.getText()).toEqual("item1Label");
        });
        // che if have the delete button
        p.findElement(protractor.By.css("statement[id='2'] .pnd-statement-object .pnd-row-button-object button")).then(function(btn) {
            expect(btn.getAttribute('title')).toEqual("delete");
        });
        // che if have the same type label
        p.findElement(protractor.By.css("statement[id='2'] .pnd-statement-object .pnd-row-button-object")).then(function(div) {
            expect(div.getText()).toEqual("Text fragment");
        });
    });

    it("should correctly remove statement", function(){

        // add blank statement
        p.findElement(protractor.By.css("triple-composer .pnd-panel-tab-content-footer .pnd-triplecomposer-add-blank")).click();
        // chek new statement number
        p.findElements(protractor.By.css(".pnd-triplecomposer-statements-container statement")).then(function(s) {
            expect(s.length).toBe(2);
        });

        // remove statement
        p.findElement(protractor.By.css("statement[id='1'] .pnd-statement-buttons [title='delete']")).click();
        // chek new statement number
        p.findElements(protractor.By.css(".pnd-triplecomposer-statements-container statement")).then(function(s) {
            expect(s.length).toBe(1);
        });
           
    });

});