/*jshint strict: false*/

angular.module('Pundit2.Core')
.constant('ANALYTICSDEFAULTS', {
    account: 'UA-50437894-1',
    globalTracker: '__gaPndtTracker',
    hits: 20, //Each web property starts with 20 hits that are replenished at a rate of 2 hit per second.
    bufferDelay: 500,
    doTracking: true,
    debug: true
})
.service('Analytics', function(BaseComponent, $window, $document, $interval, $timeout, ANALYTICSDEFAULTS) {
    
    var analytics = new BaseComponent('Analytics', ANALYTICSDEFAULTS);

    var cache = {
        events: []
    };
    var numSent = 0;
    var isSendRunning = false;
    var updateHitsTimer;
    var currentHits = analytics.options.hits;

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
        a.onload = function() {
            analytics.log('GA async script loaded');
            ga = $window[analytics.options.globalTracker];
        };
        m.parentNode.insertBefore(a, m);
    })($window, $document[0], 'script', 'http://www.google-analytics.com/analytics.js', analytics.options.globalTracker);

    var ga = $window[analytics.options.globalTracker];
    ga('create', analytics.options.account, {
        'storage': 'none', // no cookies
        'cookieDomain': 'none' // no domain
        // 'clientId' : getClientID() // custom id
    });
    ga('set', 'checkProtocolTask', function() {}); //HACK

    var updateHits = function() {
        if (currentHits >= analytics.options.hits){
            if (angular.isDefined(updateHitsTimer)){
                $timeout.cancel( updateHitsTimer );

                // TODO RAF: meglio non assegnare direttamente undefined, possiamo usare un flag
                // invece? Magari lo stesso di sotto?
                // updateHitsTimer = undefined;
            }
            analytics.log('Stop! Hits: '+currentHits);
            return;
        }

        /*
        currentHits++;
        analytics.log('Hits: '+currentHits);
        updateHitsTimer = $timeout(updateHits, analytics.options.bufferDelay);
        */
        updateHitsTimer = $timeout(function() {
            currentHits++;
            analytics.log('Hits: '+currentHits);
            updateHits();
            sendHits();
        }, analytics.options.bufferDelay);


    };

    var sendHits = function() {
        if (!analytics.options.doTracking){
            return;
        }
        if (cache.events.length === 0){
            isSendRunning = false;
            return;
        }

        var sendNext = function(info) {

            // Spostati dentro a sendNext()
            numSent++;
            var currentEvent = cache.events.shift();

            var logInfo = (info === 'delay' ? 'Tracked delayed' : 'Tracked');
            analytics.log(logInfo+' ('+numSent+'/'+currentHits+') event '+currentEvent.eventCategory+' ('+ currentEvent.eventAction +': '+ currentEvent.eventLabel +')');

            ga('send', {
                'hitType': 'event',
                'eventCategory': currentEvent.eventCategory,
                'eventAction': currentEvent.eventAction,
                'eventLabel': currentEvent.eventLabel,
                'eventValue': currentEvent.eventValue
            });
            currentHits--;
            if (!angular.isDefined(updateHitsTimer)){
                updateHits();
            }
            sendHits();
        };

        if (currentHits > 0){
            sendNext();
        } else {

            // TODO RAF: si puo' usare un timer solo: appena mandiamo una hit (sincrona) facciamo
            // partire il timer (~2s). Al termine del timer: aggiungi 1 a currentHits e vedi se
            // c'e' qualcosa in coda da mandare. In questi 2 secondi possono essere successe 2 cose:
            // - nulla :D
            // - son stati consumati tutti i currentHit -> appena ne ricarichiamo uno, spediamo
            //   qualcosa dalla coda
            // - non sono stati consumati tutti: non c'e' roba in coda

            // PS: sendNext e sendHits, ne basta una sola delle due?

            // Inoltre possiamo usare un solo flag per sapere se il timer per spedire e' attivo o meno?
            // isSendRunning ci dice la stessa cosa di updateHitsTimer?

            /*
            $timeout(function() {
                sendNext('delay');
            }, analytics.options.bufferDelay);
            */
        }
    };

    analytics.track = function(category, action, label, value) {
        if (!analytics.options.doTracking){
            analytics.err('Tracking off'); //TODO: Da notificare: si o no?
            return;
        }
        if (!angular.isDefined(category) || !angular.isDefined(action)){

            // TODO: Puo' essere utile conoscere il file che genera l'errore?
            // E nel caso, sarebbe il caso di trovare una posizione generica?
            var err = function() {
                try { throw Error(''); } catch(err) { return err; }
            };
            var currentErr = err();
            var callerLine = currentErr.stack.split('\n')[4];

            analytics.err('Category and Action are required ' + callerLine);
            return;
        }

        cache.events.push({
          'eventCategory': category,
          'eventAction': action,
          'eventLabel': label,
          'eventValue': value
        });

        if (!isSendRunning){
            isSendRunning = true;
            sendHits();
        }
    };

    analytics.log('Component running');
    return analytics;
});