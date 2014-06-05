describe("The contextualMenu module", function() {
    var p = protractor.getInstance();

    it('should correctly show and hide menu by click', function() {

        p.get('app/examples/contextualMenu.html');

        p.findElement(protractor.By.css('.pnd-contexMenu-addAll-btn')).click();

        p.findElement(protractor.By.css('.contexMenu-example-div')).then(function(element){
            p.actions().mouseMove(element, {x:100, y:20}).click().perform();
        });

        p.findElements(protractor.By.css('.dropdown-menu')).then(function(elements) {
            expect(elements.length).toBe(1);
        });

        p.findElements(protractor.By.css('.dropdown-menu > li')).then(function(elements) {
            expect(elements.length).toBe(4);
        });

        p.actions().mouseMove({x:-50, y:0}).click().perform();

        p.findElements(protractor.By.css('.dropdown-menu')).then(function(elements) {
            expect(elements.length).toBe(1);
        });

    });

    it('should correctly position menu', function() {

        p.get('app/examples/contextualMenu.html');

        p.findElement(protractor.By.css('.pnd-contexMenu-addAll-btn')).click();

        p.findElement(protractor.By.css('.pnd-contexMenu-show2-btn')).click();

        p.findElement(protractor.By.css('.dropdown-menu')).then(function(element) {
            expect(element.getCssValue('left')).toBe('400px');
            expect(element.getCssValue('top')).toBe('200px');
        });

    });
    
    it('should correctly show menu with only type1 actions', function() {

        p.get('app/examples/contextualMenu.html');

        p.findElement(protractor.By.css('.pnd-contexMenu-addAll-btn')).click();

        p.findElement(protractor.By.css('.pnd-contexMenu-show1-btn')).click();

        p.findElements(protractor.By.css('.dropdown-menu')).then(function(elements) {
            expect(elements.length).toBe(1);
        });

        p.findElements(protractor.By.css('.dropdown-menu > li > a')).then(function(elements) {
            expect(elements.length).toBe(4);
            elements[0].getInnerHtml().then(function(innerHtml){
                expect(innerHtml.indexOf('type1')).toBeGreaterThan(-1);
            });
            elements[1].getInnerHtml().then(function(innerHtml){
                expect(innerHtml.indexOf('type1')).toBeGreaterThan(-1);
            });
        });

    });

    it('should correctly show and hide submenu by mouse hover/leave on menu', function() {

        p.get('app/examples/contextualMenu.html');

        p.findElement(protractor.By.css('.pnd-contexMenu-addAll-btn')).click();

        p.findElement(protractor.By.css('.pnd-contexMenu-show2-btn')).click();

        var submenu = p.findElement(protractor.By.css('.dropdown-submenu'));

        p.actions().mouseMove(submenu).perform();

        p.findElements(protractor.By.css('.dropdown-menu')).then(function(elements) {
            expect(elements.length).toBe(2);
        });

        p.actions().mouseMove({x:0, y:100}).perform();

        p.findElements(protractor.By.css('.dropdown-menu')).then(function(elements) {
            expect(elements.length).toBe(1);
        });

    });

    it('should correctly show and hide submenu by mouse hover on menu and leave on submenu', function() {

        p.get('app/examples/contextualMenu.html');

        p.findElement(protractor.By.css('.pnd-contexMenu-addAll-btn')).click();

        p.findElement(protractor.By.css('.pnd-contexMenu-show2-btn')).click();

        var submenu = p.findElement(protractor.By.css('.dropdown-submenu'));

        p.actions().mouseMove(submenu).perform();

        p.findElements(protractor.By.css('.dropdown-menu')).then(function(elements) {
            expect(elements.length).toBe(2);
        });

        p.actions().mouseMove({x:500, y:5}).perform();

        p.findElements(protractor.By.css('.dropdown-menu')).then(function(elements) {
            expect(elements.length).toBe(1);
        });

    });

    it('should correctly execute action by click on menu item', function() {

        p.get('app/examples/contextualMenu.html');

        p.findElement(protractor.By.css('.pnd-contexMenu-addAll-btn')).click();

        p.findElement(protractor.By.css('.pnd-contexMenu-show1-btn')).click();

        p.findElement(protractor.By.css('.dropdown-menu > li')).click();

        // action produce output inside a div element
        p.findElement(protractor.By.css('.pnd-contexMenu-output')).then(function(element) {
            element.getInnerHtml().then(function(innerHtml){
                expect(innerHtml.indexOf('exe action')).toBeGreaterThan(-1);
            });
        });

    });

});