angular.module('Pundit2.Core')
.factory('EventDispatcher', function ($q) {

    var EventDispatcher = {},
        events = {};

    EventDispatcher.sendEvent = function (name, args) {
        var promises = [],
            deferred = [],
            defIndex = 0;

        var eventArgs = {
            args: args,
            resolve: function (a) {
                if (defIndex >= 0) {
                    deferred[defIndex].resolve(a);
                    defIndex--;
                }
            },
            reject: function (a) {
                if (defIndex >= 0) {
                    deferred[defIndex].reject(a);
                    defIndex--;
                }
            }
        };
    
        events[name] && angular.forEach(events[name], function (callback) {
            if (typeof(callback) !== 'undefined') {
                deferred.push($q.defer());
                callback.apply(null, [eventArgs]);
            }
        });

        defIndex = deferred.length-1;

        promises = deferred.map(function (p) {
            return p.promise;
        });

        return $q.all(promises);
    };

    EventDispatcher.addListener = function (name, callback) {
        if (!events[name]) {
            events[name] = [];
        }
        events[name].push(callback);
        return [name, callback]; 
    };

    EventDispatcher.removeListener = function (handle) {
        var name = handle[0],
            callback = handle[1];

        events[name] && angular.forEach(events[name], 
            function (f, index) {
                if (f == callback) {
                    events[name].splice(index, 1);
                }
            }
        );      
    };

    EventDispatcher.getListeners = function () {
        var results = [];
        for (var e in events){
            results.push(e);
        }
        return results;
    };

    return EventDispatcher;
});