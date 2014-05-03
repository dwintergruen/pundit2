angular.module('Pundit2.Core')
.constant('ANALYTICSDEFAULTS', {
    account: 'UA-50437894-1',
    globalTracker: '__gaPndtTracker',
    bufferDelay: 1000,
    doTracking: true,
    debug: true
})
.service('Analytics', function(BaseComponent, $window, $document, $interval, $timeout, ANALYTICSDEFAULTS) {
    
    var analytics = new BaseComponent('Analytics', ANALYTICSDEFAULTS);
    var utils = {};

    utils.cache = {
        events: []
    };
    utils.check = true;
    utils.hits = 20;

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

    utils.updatehits = function() {
        if (utils.hits < 20){
            utils.hits++;
            analytics.log('hits: '+utils.hits);
        } else {
            utils.updatehitsStop();
            analytics.log('Stop! hits: '+utils.hits);
        }
    };
    utils.updatehitsStart = function() {
        if (!angular.isDefined(utils.update)) {
            utils.update = $interval(function() {
                utils.updatehits();
            }, analytics.options.bufferDelay);
        }
    };
    utils.updatehitsStop = function() {
        if (angular.isDefined(utils.update)) {
            $interval.cancel(utils.update);
            utils.update = undefined;
        }
    };
    utils.send = function() {
        if (analytics.options.doTracking){
            if (utils.cache.events.length === 0){
                utils.check = true;
                return;
            }

            var currentEvent = utils.cache.events.shift();
            if(utils.hits > 0){
                $timeout(function() {
                    $window[analytics.options.globalTracker]('send', {
                        'hitType': 'event',
                        'eventCategory': currentEvent.eventCategory,
                        'eventAction': currentEvent.eventAction,
                        'eventLabel': currentEvent.eventLabel,
                        'eventValue': currentEvent.eventValue
                    });
                    utils.hits--;
                    utils.send();
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
                    utils.send();
                }, analytics.options.bufferDelay);
            }

            analytics.log('Tracked event '+currentEvent.eventCategory+' ('+ currentEvent.eventAction +': '+ currentEvent.eventLabel +')');
            return;
        }
    };

    analytics.track = function(category, action, label, value) {
        if (analytics.options.doTracking){

            utils.cache.events.push({
              'eventCategory': category,
              'eventAction': action,
              'eventLabel': label,
              'eventValue': value
            });

            if (utils.check){
                utils.send();
                utils.updatehitsStart();
                utils.check = false;
            }
        }
    };

    analytics.log('Component running');
    return analytics;
});