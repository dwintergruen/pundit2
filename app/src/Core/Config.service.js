angular.module('Pundit2.Core')
.factory('Config', function(PUNDITDEFAULTCONF, $window, Utils) {
    var Config = {};
    
    Utils.deepExtend(Config, PUNDITDEFAULTCONF);

    // Read 'punditConfig' from the global scope and use those settings
    if (typeof($window.punditConfig) !== "undefined" && angular.isObject($window.punditConfig)) {
        Utils.deepExtend(Config, $window.punditConfig);
    }
    
    // TODO: doc
    Config.isModuleActive = function(moduleName) {
        return angular.isObject(Config.modules[moduleName]) && Config.modules[moduleName].active === true;
    };

    // Might happen that someone is getting a Config before any
    // BaseComponent is built, so there's no global PUNDIT object..
    // In this case, just create it and append the conf to it
    if (typeof($window.PUNDIT) === 'undefined') {
        $window.PUNDIT = {
            config: Config
        };
    }

    return Config;
});