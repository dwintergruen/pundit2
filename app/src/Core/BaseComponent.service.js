angular.module('Pundit2.Core')
.constant("BASECOMPONENTDEFAULTS", {
    debug: false
})
.service('BaseComponent', function($log, Utils, BASECOMPONENTDEFAULTS, $window) {

    var BaseComponent = function(name, options) {
        this.name = name;
        this.options = angular.copy(BASECOMPONENTDEFAULTS);

        // Extend the very basic defaults with given options
        if (typeof(options) !== "undefined") {
            Utils.deepExtend(this.options, options);
        }

        // The first one extending BaseComponent will create the
        // global PUNDIT object
        if (typeof($window.PUNDIT) === 'undefined') {
            $window.PUNDIT = {};
            this.log('Created PUNDIT global object');
        }

        // If there is a PUNDIT.config, try to see if there's a provided
        // configuration for this module, and use it to extend our options
        if (typeof($window.PUNDIT) !== 'undefined' && typeof($window.PUNDIT.config) !== 'undefined' &&
            typeof($window.PUNDIT.config.modules[this.name]) !== 'undefined') {
            Utils.deepExtend(this.options, $window.PUNDIT.config.modules[this.name]);
            this.log('BaseComponent extending with PUNDIT.config.modules conf');
        }

    };

    // TODO: doc
    BaseComponent.prototype.err = function() {
        var args = Array.prototype.slice.call(arguments);
        args.unshift("#PUNDIT " + this.name + "#");
        $log.error.apply(null, args);
    };
    
    // We log if one of the two:
    // - debugAllModules is true
    // - this.options.debug is true
    var haveToLog = function(self) {
        if ('PUNDIT' in $window && 
            'config' in $window.PUNDIT &&
            'debugAllModules' in $window.PUNDIT.config &&
            $window.PUNDIT.config.debugAllModules === true) {
            return true;
        }
        
        if (self.options.debug === true) {
            return true;
        }
        
        return false;
    };
    
    // TODO: doc
    BaseComponent.prototype.log = function() {
        if (haveToLog(this)) {
            var args = Array.prototype.slice.call(arguments);
            args.unshift("#" + this.name + "#");
            $log.log.apply(null, args);
        }
    };
    
    return BaseComponent;
});