angular.module('KorboEE')
    .service('KorboEEBaseComponent', function($log) {

        var b = function(name) {
            this.name = name;
        };

        /*// TODO: doc
        b.prototype.err = function() {
            var fileErr = function() {
                try { throw Error(''); } catch(err) { return err; }
            };
            var currentErr = fileErr();
            var callerLine = currentErr.stack.split('\n')[5];

            var args = Array.prototype.slice.call(arguments);
            args.unshift("#KorboEE " + this.name + "#");
            args.push(callerLine);
            $log.error.apply(null, args);
        };*/

        // TODO: doc
        // We log if debugAllModules is true or this component's options
        // says so
        /*BaseComponent.prototype.log = function() {
            if (debug) {
                var args = Array.prototype.slice.call(arguments);
                args.unshift("#" + this.name + "#");
                $log.log.apply(null, args);
            }
        };*/

        return b;
    });
