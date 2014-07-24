xdescribe("OpenID Login", function() {

    var p = protractor.getInstance();

    it('should show popup login modal', function() {

        // google account credentials
        var myPassword = "netseven";
        var myEmail = "netsevenopenid@gmail.com";
        var username = "Mario Bros";

        p.get('/app/examples/mypundit.testPage.html');

        // open login modal
        p.findElement(protractor.By.css('.btn-example-login')).click();

        // open login popup
        p.findElement(protractor.By.css('.pnd-login-modal-openPopUp')).click();

        // needed to prevent 'Error while waiting for Protractor to sync with the page: {}'
        p.ignoreSynchronization = true;
        var mainWindow, popUpLogin;

        // get all windows open
        p.getAllWindowHandles().then(function(windows) {

            // at this time windows should be 2
            expect(windows.length).toBe(2);

            mainWindow = windows[0];
            popUpLogin = windows[1];

            // get handle to popup login modal
            var handle = browser.switchTo().window(popUpLogin);
            handle = browser.getWindowHandle();
            expect(handle).toEqual(popUpLogin);
            browser.driver.executeScript('window.focus();');

            // get google button and click it
            p.findElement(protractor.By.css('.google.openid_large_btn')).then(function(openIdButton) {

                openIdButton.click();

                // fill form with my google account credentials
                p.findElement(protractor.By.id('Email')).sendKeys(myEmail);
                p.findElement(protractor.By.id('Passwd')).sendKeys(myPassword);

                // submit form
                p.findElement(protractor.By.id('signIn')).click().then(function() {

                    // get handle to main window
                    handle = browser.switchTo().window(mainWindow);
                    handle = browser.getWindowHandle();
                    expect(handle).toEqual(mainWindow);
                    browser.driver.executeScript('window.focus();');

                    // at this time user should be logged in
                    // user button should be visible and should show user full name
                    p.findElements(protractor.By.css('.pnd-toolbar-user-button')).then(function(userButton) {
                        //TODO: TROVARE UNA SOLUZIONE PER QUESTO SLEEP. SENZA NON VIENE AGGIORNATA LA PAGINA
                        p.sleep(1000);
                        expect(userButton.length).toBe(1);
                        expect(userButton[0].getText()).toBe(username);

                    }); // end find .pnd-toolbar-user-button

                    // get logout
                    p.sleep(1000);
                    p.findElement(protractor.By.css('.btn-example-logout')).then(function(logoutButton) {
                        logoutButton.click().then(function() {
                            p.sleep(1000);
                            p.findElements(protractor.By.css('.pnd-toolbar-user-button.ng-hide')).then(function(userButton) {
                                expect(userButton.length).toBe(1);
                                p.waitForAngular();
                                p.sleep(1000);
                                p.ignoreSynchronization = false;
                            });
                        });
                    });

                }); //  end fine signIn

            }); // end find .google.openid_large_btn
        }); // end getAllWindowHandles

    }); // end test

});