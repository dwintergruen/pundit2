angular.module('Pundit2.Core')
.factory('EventDispatcher', function($q, $rootScope) {

    var EventDispatcher = {};

    EventDispatcher.sendEvent = function (name, args) {

        var done = $q.defer();

        // there aren't active listeners
        if (!$rootScope.$$listeners[name]) {
            return;
        }

        // setup a deferred promise for each active listener
        var deferred = [];
        for (var i = 0; i < $rootScope.$$listeners[name].length; i++) {
            deferred.push($q.defer());
        }

        var eventArgs = {
            args: args,
            resolve: function (a) {
                deferred.pop().resolve(a);
            },
            reject: function (a) {
                deferred.pop().reject(a);
            }
        };
        
        //send the event
        $rootScope.$broadcast(name, eventArgs);
        
        var promises = [];
        for(var p in deferred){
            promises.push(deferred[p].promise);
        }

        $q.all(promises).then(function(){
            done.resolve();
        },
        function(){
            done.reject();
        });

        return done.promise;
    };

    EventDispatcher.addListener = function(name, callback) {
        return $rootScope.$on(name, callback);
    };

    EventDispatcher.removeListener = function(handle) {
        if (angular.isFunction(handle)) {
            handle();
        }           
    };

    return EventDispatcher;
});