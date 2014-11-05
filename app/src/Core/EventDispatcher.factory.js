angular.module('Pundit2.Core')
.factory('EventDispatcher', function ($q) {

    var EventDispatcher = {
        cache: {}
    };

    EventDispatcher.sendEvent = function (name, args) {
        // there aren't active listeners
        // if (!$rootScope.$$listeners[name]) {
        //     return;
        // }
        var deferred = [];

        // TODO: reject don't work with q.all, why?!
        var eventArgs = {
            args: args,
            resolve: function (a) {
                deferred.pop().resolve(a);
            }
        };

        EventDispatcher.cache[name] && angular.forEach(EventDispatcher.cache[name], function(callback) {       
            deferred.push($q.defer());
            callback.apply(null, [eventArgs]);
        });

        var promises = deferred.map(function(p) {
            return p.promise;
        });

        return $q.all(promises);
    };

    EventDispatcher.addListener = function (name, callback) {
        if(!EventDispatcher.cache[name]) {
            EventDispatcher.cache[name] = [];
        }
        EventDispatcher.cache[name].push(callback);
        return [name, callback]; 
    };

    EventDispatcher.removeListener = function (handle) {
        var f = handle[0];
        EventDispatcher.cache[t] && d.each(EventDispatcher.cache[f], function(index){
            if(this == handle[1]){
                EventDispatcher.cache[f].splice(index, 1);
            }
        });      
    };

    return EventDispatcher;
});