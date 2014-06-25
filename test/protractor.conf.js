exports.config = {

    // To launch the tests on your dev machine:
    seleniumServerJar: '../node_modules/protractor/selenium/selenium-server-standalone-2.42.2.jar',
    seleniumPort: null,
    chromeDriver: '../node_modules/protractor/selenium/chromedriver',
    seleniumArgs: [],
    
    // To launch on a remote selenium server:
    // seleniumAddress: 'http://172.20.0.17:4444/wd/hub',
    // seleniumAddress: 'http://localhost:4444/wd/hub',

    // Browser type, scripts timeout etc
    capabilities: { browserName: 'chrome', allScriptsTimeout: 120000 },
    // capabilities: { browserName: 'safari' },
    // capabilities: { browserName: 'firefox' },
    // capabilities: { browserName: 'ie', allScriptsTimeout: 120000 },


    specs: [
        './e2e/*.js'
    ],
    
    allScriptsTimeout: 120000,

    // SAUCELABS STEP 1: uncomment user and key
    // sauceUser: 'pundit',
    // sauceKey: '18057ba8-84b2-4797-86ff-5bca6161ecc7',

    // SAUCELABS STEP 2: uncomment one of these capabilities
    // capabilities: { name: 'ie8 on xp tests', browserName: 'internet explorer', platform: 'Windows XP', version: '8' },
    // capabilities: { name: 'ie9 tests', browserName: 'internet explorer', platform: 'Windows 7', version: '9' },
    // capabilities: { name: 'ie10 tests', browserName: 'internet explorer', version: '10' },
    // capabilities: { name: 'ipad 7', 'browserName': 'ipad', 'version': '7', 'device-orientation': 'landscape' },
    // capabilities: { 'browserName': 'ipad', 'version': '6.1', 'device-orientation': 'landscape' },
    // capabilities: { 'browserName': 'android', 'version': '4.0', 'device-type': 'tablet' },
    // capabilities: { name: 'chrome', browserName: 'chrome', platform: 'windows 8.1', version: '31'},
    // capabilities: { name: 'firefox', browserName: 'firefox', platform: 'windows 8.1', version: '26', },
    // capabilities: { name: 'safari', browserName: 'safari', platform: 'OS X 10.8', version: '6'},
    // capabilities: { name: 'safari', browserName: 'safari', platform: 'OS X 10.6', version: '5'},


    // Depending on where you're running the tests, you might need a different baseUrl
    // baseUrl: 'http://openpal.simone.local:9999/',
    baseUrl: 'http://localhost:9999/',
    rootElement: 'div',

    jasmineNodeOpts: {
        onComplete: null,
        isVerbose: true,
        showColors: true,
        includeStackTrace: false,
        defaultTimeoutInterval: 120000
    }
};