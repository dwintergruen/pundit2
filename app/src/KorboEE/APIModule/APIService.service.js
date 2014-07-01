// APIService: a generic service able to expose a global object
// to interact with an angular js application.

// The global obj has on* methods which accept callbacks to get called
// in response to various events fired by the angular app through
// fireOn* methods. The app adds events by calling addEvent([names]).
// The external users add their callbacks using GLOB.on*(function(){})
// eg: (in app) var api = APIService.init(confObject);
//     (in app) api.addEvent(['Open', 'Close']);
//     (where appropriate) api.fireOnOpen('argument', true)
//     (outside) GLOBNAME.onOpen(function(arg1, arg2) { /* something */ })

// The global obj has call* methods which accept parameters to be passed
// to the angular app to run some internal feature/behavior. The app
// is able to add such features using addFeature([names]) and exposing the
// code to run with expose*(function(){}). The external users are able
// to call such exposed code with GLOB.call*().
// eg: (in app) var api = APIService.init(confObject);
//     (in app) api.addFeature(['Open', 'Close']);
//     (where appropriate) api.exposeOpen(function(arg) { /* something */ });
//     (outside) GLOBNAME.callOpen('value')

// This module is able to instantiate N different global objects which can be
// bound to different instances of a directive or whatever needed, just use
// different names by specifiying the globalObjectName in the conf object

/**
 * @ngdoc module
 * @name APIModule
 * @module APIModule
 * @description
 *
 * APIModule is a generic module that contain APIService a service able to expose a global object
 * to interact with an AngularJS application.
 *
 * This module is able to instantiate N different global objects which can be
 * bound to different instances of a directive or whatever needed, just use
 * different names by specifiying the `globalObjectName` in the conf object
 *
 * <div doc-module-components="APIModule"></div>
 */
angular.module('APIModule', [])

/**
 * @ngdoc service
 * @name APIService
 * @module APIModule
 * @description
 *
 * The APIService service provides a global object to communicate with the application
 * and some methods to add events and features to its.
 *
 * The global object has `on*` methods which accept callbacks to get called
 * in response to various events fired by the angular app through
 * `fireOn*` methods.
 * The app adds events by calling `addEvent([names])` and the external users add their callbacks
 * using `GLOB.on*(function(){;})`.
 *
 * Example:
 *
 * In app:
 * <pre>
 * var api = APIService.init(confObject);
 * api.addEvent(['Open', 'Close']);
 * </pre>
 * where appropriate:
 * <pre> api.fireOnOpen('argument', true) </pre>
 * and outside
 * <pre> GLOB.onOpen(function(arg1, arg2) {;}) </pre>
 *
 * The global object has `call*` methods which accept parameters to be passed
 * to the angular app to run some internal feature/behavior.
 *
 * The app is able to add such features using `addFeature([names])` and exposing the
 * code to run with `expose*(function(){})`.
 *
 * The external users are able to call such exposed code with `GLOB.call*()`.
 *
 * Example:
 *
 * In app
 * <pre>
 * var api = APIService.init(confObject);
 * api.addFeature(['Open', 'Close']);
 * </pre>
 * where appropriate
 * <pre> api.exposeOpen(function(arg) {  }); </pre>
 * and outside
 * <pre> GLOB.callOpen('value') </pre>
 */
    .service('APIService', function($window){

        // Will contain all of the instances of api
        var instances = [],
            ret = {};

        // New api object constructor
        function api(conf) {
            this.conf = conf;
            this.eventCallbacks = {};
            this.featureCallbacks = {};
            this.global = {};
            return this;
        }

        // Adds on* (to service) and fireOn* (to global) methods
        // @params args string array or string, names of the events
        // eg: addEvent(['Open', 'Close']); --> GLOB.onOpen(), GLOB.onClose()
        //                                      api.fireOnOpen(), api.fireOnClose()

        /**
         * @ngdoc method
         * @name APIService#addEvent
         * @function
         *
         * @param {array|string} args String array or string, names of the events.
         *
         * @description
         * Adds `on*` (to service) and `fireOn*` (to global) methods.
         */
        api.prototype.addEvent = function(args) {

            var self = this,
                eventCallbacks = self.eventCallbacks;

            // Accepting a string or an array of strings
            var namesList = args;
            if (typeof(args) === 'string'){
                namesList = [args];
            }

            for (var i in namesList){
                var name = namesList[i];

                // Will contain the callbacks for this event
                eventCallbacks[name] = [];

                // Add to global the "on" + name method (eg: onOpen) to subscribe callbacks
                self.global['on' + name] = (function(localName) {
                    return function(f) {
                        if (typeof f === 'function') {
                            eventCallbacks[localName].push(f);
                        }
                    };
                })(name);

                // aggiungo a APIService il metodo "fireOnName"
                // Add to service the "fireOn" + name method (eg: fireOnOpen) to fire the
                // subscribed callbacks
                self['fireOn' + name] = (function(localName) {
                    return function(){
                        var args = Array.prototype.splice.call(arguments, 0);
                        for (var i in eventCallbacks[localName]) {
                            eventCallbacks[localName][i].apply(this, args);
                        }
                    };
                })(name);

            } // for i in namesList
        }; // service.addEvent()


        // Adds expose* (to service) and call* (to global) methods
        // @params args string array or string, names of the events
        // eg: addFeature(['Open', 'Close']); --> GLOB.callOpen(), GLOB.callClose()
        //                                        APIService.exposeOpen(), APIService.exposeClose()

        /**
         * @ngdoc method
         * @name APIService#addFeature
         * @function
         *
         * @param {array|string} args String array or string, names of the features.
         *
         * @description
         * Adds `expose*` (to service) and `call*` (to global) methods.
         */
            // var featureCallbacks = {};
        api.prototype.addFeature = function(args) {

            var self = this,
                featureCallbacks = self.featureCallbacks;

            var namesList = args;
            if (typeof(args) === 'string'){
                namesList = [args];
            }

            for (var i in namesList) {
                var name = namesList[i];

                self['expose' + name] = (function(localName){
                    return function(f){
                        if (typeof f === 'function'){
                            featureCallbacks[localName] = f;
                        }

                    };
                })(name);

                self.global['call' + name] = (function(localName){
                    return function(){
                        // If the angular app called addFeature without exposing it
                        // we know it.. but.. signal it someway?? Exception?
                        if (localName in featureCallbacks) {
                            var args = Array.prototype.splice.call(arguments, 0);
                            return featureCallbacks[localName].apply(self, args);
                        }
                        return;
                    };
                })(name);

            } // for i in namesList
        }; // service.addFeature()


        // Initializes a new API service, exposing a global object on $window
        // with a name taken from the conf passed in

        /**
         * @ngdoc method
         * @name APIService#init
         * @function
         *
         * @param {object} conf Configuration object.
         * @return {object} API instance.
         *
         * @description
         * Initializes a new API service, exposing a global object on $window with a name taken from the configuration passed in.
         */
        ret.init = function(conf){
            if ('globalObjectName' in conf){

                // TODO: what if we initialize twice with the same name?
                var a = new api(conf);
                $window[conf.globalObjectName] = a.global;
                instances[conf.globalObjectName] =  a;

                return a;
            }
            // TODO: throw an error if no globalObjectName given?
            return;
        };

        // Gets the same instance returned by the init(), for later uses
        // by the angular app
        ret.get = function(name) {
            return instances[name];
        };

        return ret;

    });