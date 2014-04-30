angular.module('Pundit2.Core')
.constant('ANALITYCSDEFAULTS', {
    account: 'UA-50437894-1',
    globalTracker: '__gaPndtTracker',
    doTracking: true,
    debug: true
})
.service('Analytics', function(BaseComponent, $window, $document, ANALITYCSDEFAULTS) {
    
    var analytics = new BaseComponent('Analytics', ANALITYCSDEFAULTS);

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

    $window[analytics.options.globalTracker]('create', analytics.options.account, {
        'storage': 'none', // no cookies
        'cookieDomain': 'none' // no domain
        // 'clientId' : getClientID() // custom id
    });

    $window[analytics.options.globalTracker]('set', 'checkProtocolTask', function() {}); //HACK

    analytics.track = function(category, action, label, value) {
        if(analytics.options.doTracking){
            $window[analytics.options.globalTracker]('send', 'event', category, action, label, value);
            analytics.log('Usa track');
        }
    };

    analytics.log('Analytics run');
    return analytics;
});