angular.module('Pundit2.Core')
.constant('ANALYTICSDEFAULTS', {
    account: 'UA-50437894-1',
    globalTracker: '__gaPndtTracker',
    doTracking: true,
    debug: true
})
.service('Analytics', function(BaseComponent, $window, $document, $interval, $timeout, ANALYTICSDEFAULTS) {
    
    var analytics = new BaseComponent('Analytics', ANALYTICSDEFAULTS);

    analytics.cache = {
        events: []
    };
    analytics.check = true;
    analytics.tokens = 10;

    (function(i, s, o, g, r, a, m) {
        i.GoogleAnalyticsObject = r;
        i[r] = i[r] || function() {
            (i[r].q = i[r].q || []).push(arguments);
        };
        i[r].l = 1 * new Date();
        a = s.createElement(o);
        m = s.getElementsByTagName(o)[0];
        a.async = 1;
        a.src = g;
        m.parentNode.insertBefore(a, m);
    })($window, $document[0], 'script', 'http://www.google-analytics.com/analytics.js', analytics.options.globalTracker);

    var ga = $window[analytics.options.globalTracker];

    ga('create', analytics.options.account, {
        'storage': 'none', // no cookies
        'cookieDomain': 'none' // no domain
        // 'clientId' : getClientID() // custom id
    });

    ga('set', 'checkProtocolTask', function() {}); //HACK

    analytics.updateTokens = function() {
        if (analytics.tokens < 10){ 
            analytics.tokens++;
            analytics.log("Tokens: "+analytics.tokens);
        } else {
            analytics.updateTokensStop();
            analytics.log("Stop! Tokens: "+analytics.tokens);
        }
    }
    analytics.updateTokensStart = function() {
        if (!angular.isDefined(analytics.update)) {
            analytics.update = $interval(function() {
                analytics.updateTokens();
            }, 5000);
        }
    }
    analytics.updateTokensStop = function() {
        if (angular.isDefined(analytics.update)) {
            $interval.cancel(analytics.update);
            analytics.update = undefined;
        }
    }

    analytics.track = function(category, action, label, value) {
        if (analytics.options.doTracking){

            analytics.cache.events.push({
              'eventCategory': category,   
              'eventAction': action,      
              'eventLabel': label,
              'eventValue': value
            });

            if (analytics.check){
                analytics.send();
                analytics.updateTokensStart();
                analytics.check = false;
            }
        }
    };

    analytics.send = function() {
        if (analytics.options.doTracking){
            if (analytics.cache.events.length === 0){
                analytics.check = true;
                return;
            }

            var currentEvent = analytics.cache.events.shift();  
            if(analytics.tokens > 0){
                $timeout(function() {
                    $window[analytics.options.globalTracker]('send', {
                        'hitType': 'event',
                        'eventCategory': currentEvent.eventCategory,  
                        'eventAction': currentEvent.eventAction,      
                        'eventLabel': currentEvent.eventLabel,
                        'eventValue': currentEvent.eventValue

                    });
                    analytics.tokens--;
                    analytics.send();
                }, 10);
            } else {
                $timeout(function() {
                    $window[analytics.options.globalTracker]('send', {
                        'hitType': 'event',
                        'eventCategory': currentEvent.eventCategory,  
                        'eventAction': currentEvent.eventAction,      
                        'eventLabel': currentEvent.eventLabel,
                        'eventValue': currentEvent.eventValue

                    });
                    analytics.send();
                }, 500);
            }

            analytics.log('Tracked event '+currentEvent.eventCategory+' ('+ currentEvent.eventAction +': '+ currentEvent.eventLabel +')');            
            return;
        }
    };

    analytics.log('Component running');
    return analytics;
});