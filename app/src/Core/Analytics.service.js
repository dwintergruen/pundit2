angular.module('Pundit2.Core')
.constant('ANALITYCSDEFAULTS', {
    account: 'UA-50437894-1',
    doTracking: true,
    debug: true
})
.service('Analytics', function(BaseComponent, $window, $document, ANALITYCSDEFAULTS) {
    
    var analytics = new BaseComponent('Analytics', ANALITYCSDEFAULTS);

    (function(i, s, o, g, r, a, m) {
        i['GoogleAnalyticsObject'] = r;
        i[r] = i[r] || function() {
            (i[r].q = i[r].q || []).push(arguments)
        }, i[r].l = 1 * new Date();
        a = s.createElement(o),
        m = s.getElementsByTagName(o)[0];
        a.async = 1;
        a.src = g;
        m.parentNode.insertBefore(a, m)
    })($window, $document[0], 'script', 'http://www.google-analytics.com/analytics.js', '__gaPndtTracker');

    __gaPndtTracker('create', analytics.options.account, {
        'storage': 'none', // no cookies
        'cookieDomain': 'none' // no domain
        // 'clientId' : getClientID() // custom id
    })

    __gaPndtTracker('set', 'checkProtocolTask', function() {}); //HACK

    analytics.track = function(category, action, label, value) {
        if(analytics.options.doTracking){
            __gaPndtTracker('send', 'event', category, action, label, value);
            analytics.log('Usa track');
        }
    }

    analytics.log('Analytics run');
    return analytics;
});