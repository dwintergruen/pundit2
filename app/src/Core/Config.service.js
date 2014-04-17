angular.module('Pundit2.Core')
.factory('Config', function(PUNDITDEFAULTCONF, $window, BaseComponent, Utils) {
    var Config = new BaseComponent('Config');
    
    Utils.deepExtend(Config, PUNDITDEFAULTCONF);

    // Read 'punditConf' from the global scope and use those settings
    if (typeof($window.punditConfig) === "undefined" || $window.punditConfig === '') {
        // DEBUG: switch the control the other way around? put a message here?
        // How to log a message if there's no conf yet? :D
    } else {
        Utils.deepExtend(Config, $window.punditConfig);
        Config.log('Extended config with provided punditConfig');
    }
    
    // TODO: doc
    Config.isModuleActive = function(moduleName) {
        return angular.isObject(Config.modules[moduleName]) && Config.modules[moduleName].active === true;
    };
    
    $window.PUNDIT.config = Config;
    return Config;
});