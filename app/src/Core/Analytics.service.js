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
    var update = undefined;
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
        }
        m.parentNode.insertBefore(a, m);
    })($window, $document[0], 'script', 'http://www.google-analytics.com/analytics.js', analytics.options.globalTracker);

    var ga = $window[analytics.options.globalTracker];
    ga('create', analytics.options.account, {
        'storage': 'none', // no cookies
        'cookieDomain': 'none' // no domain
        // 'clientId' : getClientID() // custom id
    });
    ga('set', 'checkProtocolTask', function() {}); //HACK

    // TODO RAF: updateHits con la h maiuscola? ;)
    // REPLY: stavo già dormendo quando ho rinominato queste funzioni ^^
    var updateHits = function() {
        if (currentHits < analytics.options.hits){
            currentHits++;
            analytics.log('Hits: '+currentHits);
        } else {
            updateHitsStop();
            analytics.log('Stop! Hits: '+currentHits);
        }
    };

    // TODO RAF: perche' li aggiorni con un interval invece di un timeout?
    // forse sarebbe meglio se ci fosse un unico timeout che:
    // - se ci sono elementi in coda, ne spedisce uno (come ora, con e senza timer),
    //   fa partire un timer per aumentare hits tot ms dopo la chiamata (ricarica)
    // - se non ci sono, fa solo partire un timer
    // - se ci sono el in coda e/o hits < max, richiama se stesso (e rifara' una send e/o
    //   aggiornera' hits)

    var updateHitsStart = function() {
        if (!angular.isDefined(update)) {
            update = $interval(function() {
                updateHits();
            }, analytics.options.bufferDelay);
        }
    };
    var updateHitsStop = function() {
        if (angular.isDefined(update)) {
            $interval.cancel(update);
            update = undefined;
        }
    };

    var send = function() {

        // TODO RAF: invece di avere un (o piu') if lungo come tutto il metodo, ribaltalo e
        // copri tutti i casi di errore in cima, con dei return:
        // if (!analytics.options... ) { return; }
        // REPLY: devo adattarmi a questo stile

        if (analytics.options.doTracking){
            if (cache.events.length === 0){
                isSendRunning = false;
                return;
            }

            numSent++;

            var currentEvent = cache.events.shift();
            if (currentHits > 0){

                // TODO RAF: perche' un timer di 10ms qui??
                // REPLY: la chiamata ricorsiva send() non funziona all'esterno
                // di $timeout, non so perche' 

                $timeout(function() {
                    ga('send', {
                        'hitType': 'event',
                        'eventCategory': currentEvent.eventCategory,
                        'eventAction': currentEvent.eventAction,
                        'eventLabel': currentEvent.eventLabel,
                        'eventValue': currentEvent.eventValue
                    });
                    analytics.log('Tracked ('+numSent+') event '+currentEvent.eventCategory+' ('+ currentEvent.eventAction +': '+ currentEvent.eventLabel +')');
                    currentHits--;
                    updateHitsStart();
                    send();
                }, 0);
            } else {
                $timeout(function() {
                    ga('send', {
                        'hitType': 'event',
                        'eventCategory': currentEvent.eventCategory,
                        'eventAction': currentEvent.eventAction,
                        'eventLabel': currentEvent.eventLabel,
                        'eventValue': currentEvent.eventValue
                    });
                    analytics.log('Tracked delayed ('+numSent+') event '+currentEvent.eventCategory+' ('+ currentEvent.eventAction +': '+ currentEvent.eventLabel +')');
                    currentHits--;
                    updateHitsStart();
                    send();
                }, analytics.options.bufferDelay);
            }
        }
    };

    analytics.track = function(category, action, label, value) {

        // TODO: Puo' essere utile conoscere il file che genera l'errore?

        function getErrorObject(){
            try { throw Error('') } catch(err) { return err; }
        }
        var err = getErrorObject();
        var caller_line = err.stack.split("\n")[4];
        var index = caller_line.indexOf("at ");
        var clean = caller_line.slice(index+2, caller_line.length);

        if (!analytics.options.doTracking){
            analytics.err("Tracking off"); //TODO: Da notificare: si o no?
            return;
        }
        if (!angular.isDefined(category) || !angular.isDefined(action)){
            analytics.err("Category and Action are required " + caller_line);
            return;
        }

        cache.events.push({
          'eventCategory': category,
          'eventAction': action,
          'eventLabel': label,
          'eventValue': value
        });

        if (!isSendRunning){
            send();
            isSendRunning = true;
        }
    };

    analytics.log('Component running');
    return analytics;
});