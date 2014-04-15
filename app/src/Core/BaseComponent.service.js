angular.module('Pundit2.Core')
.constant("BASECOMPONENTDEFAULTS", {
    debug: false
})
.service('BaseComponent', function($log, Utils, BASECOMPONENTDEFAULTS) {

    var BaseComponent = function(name, options) {
        this.name = name;
        this.options = angular.copy(BASECOMPONENTDEFAULTS);

        // Extend the very basic defaults with given options
        if (typeof(options) !== "undefined") {
            Utils.deepExtend(this.options, options);
        }

        // The first one extending BaseComponent will create the
        // global PUNDIT object
        if (typeof(PUNDIT) === 'undefined') {
            PUNDIT = {};
        }

        // If there is a PUNDIT.config, try to see if there's a provided
        // configuration for this module, and use it to extend our options
        if (typeof(PUNDIT) !== 'undefined' && typeof(PUNDIT.config) !== 'undefined' &&
            typeof(PUNDIT.config.modules[this.name]) !== 'undefined') {
            Utils.deepExtend(this.options, PUNDIT.config.modules[this.name]);
            this.log('BaseComponent extending with PUNDIT.config.modules conf');
        }

    };
    
    // TODO: doc
    BaseComponent.prototype.log = function() {
        
        // If there's the debugAllModules in the config or this module debug is
        // true, then log something
        if (typeof(PUNDIT) !== "undefined" && 'config' in PUNDIT &&
            PUNDIT.config.debugAllModules === true || this.options.debug === true) {
            var args = Array.prototype.slice.call(arguments);
            args.unshift("#" + this.name + "#");
            $log.log.apply(null, args);
        }
    };
    
    return BaseComponent;
});