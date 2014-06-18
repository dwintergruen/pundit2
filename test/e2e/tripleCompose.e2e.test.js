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

        // open resource panel
        p.findElement(protractor.By.css(".pnd-statement-subject input")).click();

        p.findElements(protractor.By.css(".pnd-resource-panel-popover")).then(function(popover) {
            expect(popover.length).toBe(1);
        });

        // open page items list
        // p.findElement(protractor.By.css(".pnd-resource-panel-popover .pnd-page-items-header .pnd-icon-caret-right")).click();

        // add item by click on resource panel item
        p.findElement(protractor.By.css(".pnd-resource-panel-popover .pnd-page-items-header item")).click();
        // label
        p.findElement(protractor.By.css(".pnd-statement-subject .pnd-statement-label")).then(function(label) {
            expect(label.getText()).toEqual("item1Label");
        });
        // delete button
        p.findElement(protractor.By.css(".pnd-statement-subject .pnd-row-button-subject button")).then(function(btn) {
            expect(btn.getAttribute('title')).toEqual("delete");
        });
        // type label
        p.findElement(protractor.By.css(".pnd-statement-subject .pnd-row-button-subject")).then(function(div) {
            expect(div.getText()).toEqual("Text fragment");
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
        p.findElements(protractor.By.css(".pnd-statement-object .pnd-row-button-object [ng-if='objectLiteral']")).then(function(btn) {
            expect(btn.length).toBe(1);
            expect(btn[0].getAttribute('title')).toEqual("text");
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
        p.findElement(protractor.By.css(".pnd-popover-literal .popover-content textarea")).sendKeys('testo modificato');

        // click save TODO add class to save btn
        p.findElement(protractor.By.css(".pnd-popover-literal .popover-content button")).click();
        // second item label
        p.findElement(protractor.By.css(".pnd-statement-object .pnd-statement-label")).then(function(label) {
            expect(label.getText()).toEqual("testo modificato");
        });
    });

    it("should correctly remove item", function(){

        // open resource panel
        p.findElement(protractor.By.css(".pnd-statement-subject input")).click();
        // open page items list
        //p.findElement(protractor.By.css(".pnd-resource-panel-popover .pnd-page-items-header .pnd-icon-caret-right")).click();

        // add item by click on resource panel item
        p.findElement(protractor.By.css(".pnd-resource-panel-popover .pnd-page-items-header item")).click();
        // check label
        p.findElement(protractor.By.css(".pnd-statement-subject .pnd-statement-label")).then(function(label) {
            expect(label.getText()).toEqual("item1Label");
        });

        // click delete button
        p.findElement(protractor.By.css(".pnd-statement-subject .pnd-row-button-subject button")).click();
        // check input
        p.findElements(protractor.By.css(".pnd-statement-subject input")).then(function(input) {
            expect(input.length).toBe(1);
            expect(input[0].getAttribute('placeholder')).toEqual("search a subject");
        });
        // check korbo button
        p.findElements(protractor.By.css(".pnd-statement-subject .pnd-row-button-subject button")).then(function(btn) {
            expect(btn.length).toBe(1);
            expect(btn[0].getAttribute('title')).toEqual("add");
        });          
    });

    it("should correctly duplicate statement", function(){

        // open resource panel
        p.findElement(protractor.By.css(".pnd-statement-subject input")).click();
        // open page items list
        //p.findElement(protractor.By.css(".pnd-resource-panel-popover .pnd-page-items-header .pnd-icon-caret-right")).click();
        // add item by click on item inside list
        p.findElement(protractor.By.css(".pnd-resource-panel-popover .pnd-page-items-header item")).click();
        // duplicate statement
        p.findElement(protractor.By.css("statement[id='1'] .pnd-statement-buttons [title='copy']")).click();
        

        // check if have the same label
        p.findElement(protractor.By.css("statement[id='2'] .pnd-statement-subject .pnd-statement-label")).then(function(label) {
            expect(label.getText()).toEqual("item1Label");
        });
        // che if have the delete button
        p.findElement(protractor.By.css("statement[id='2'] .pnd-statement-subject .pnd-row-button-subject button")).then(function(btn) {
            expect(btn.getAttribute('title')).toEqual("delete");
        });
        // che if have the same type label
        p.findElement(protractor.By.css("statement[id='2'] .pnd-statement-subject .pnd-row-button-subject")).then(function(div) {
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