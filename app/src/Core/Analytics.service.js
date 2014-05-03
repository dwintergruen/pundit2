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

    // TODO RAF: a che ti serve sto oggetto utils??! Non si puo' fare a meno?
    var utils = {};

    utils.cache = {
        events: []
    };
    utils.check = true;

    // TODO RAF: spostiamo questo numerino magico tra i parametri di conf
    utils.hits = 30;

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

    // TODO: non si puo' salvarsi una reference alla funzione qui, perche' lo script non e' stato
    // ancora caricato. Appena lo e', questa ga sara' un puntatore ad una funzione che e' stata
    // sovrascritta. C'e' un onload() di ga?
    var ga = $window[analytics.options.globalTracker];
    ga('create', analytics.options.account, {
        'storage': 'none', // no cookies
        'cookieDomain': 'none' // no domain
        // 'clientId' : getClientID() // custom id
    });
    ga('set', 'checkProtocolTask', function() {}); //HACK

    // TODO RAF: updateHits con la h maiuscola? ;)
    // Pure tutti gli altri!! :P
    utils.updatehits = function() {

        // TODO RAF: spostiamo questo numerino magico tra i parametri di conf
        if (utils.hits < 30){
            utils.hits++;
            analytics.log('hits: '+utils.hits);
        } else {
            utils.updatehitsStop();
            analytics.log('Stop! hits: '+utils.hits);
        }
    };

    // TODO RAF: perche' li aggiorni con un interval invece di un timeout?
    // forse sarebbe meglio se ci fosse un unico timeout che:
    // - se ci sono elementi in coda, ne spedisce uno (come ora, con e senza timer),
    //   fa partire un timer per aumentare hits tot ms dopo la chiamata (ricarica)
    // - se non ci sono, fa solo partire un timer
    // - se ci sono el in coda e/o hits < max, richiama se stesso (e rifara' una send e/o
    //   aggiornera' hits)

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

    // TODO RAF: giusto per vedere quanti ne manda prima di far entrare il meccanismo
    // della coda
    var numSent = 0;
    utils.send = function() {

        // TODO RAF: invece di avere un (o piu') if lungo come tutto il metodo, ribaltalo e
        // copri tutti i casi di errore in cima, con dei return:
        // if (!analytics.options... ) { return; }

        if (analytics.options.doTracking){
            if (utils.cache.events.length === 0){
                utils.check = true;
                return;
            }

            numSent++;

            var currentEvent = utils.cache.events.shift();
            if (utils.hits > 0){

                // TODO RAF: perche' un timer di 10ms qui??

                $timeout(function() {
                    ga('send', {
                        'hitType': 'event',
                        'eventCategory': currentEvent.eventCategory,
                        'eventAction': currentEvent.eventAction,
                        'eventLabel': currentEvent.eventLabel,
                        'eventValue': currentEvent.eventValue
                    });
                    analytics.log('Tracked ('+numSent+') event '+currentEvent.eventCategory+' ('+ currentEvent.eventAction +': '+ currentEvent.eventLabel +')');
                    utils.hits--;
                    utils.send();
                }, 10);
            } else {

                // TODO RAF: perche' non diminuisci hits qui?

                $timeout(function() {
                    ga('send', {
                        'hitType': 'event',
                        'eventCategory': currentEvent.eventCategory,
                        'eventAction': currentEvent.eventAction,
                        'eventLabel': currentEvent.eventLabel,
                        'eventValue': currentEvent.eventValue
                    });
                    analytics.log('Tracked delayed ('+numSent+') event '+currentEvent.eventCategory+' ('+ currentEvent.eventAction +': '+ currentEvent.eventLabel +')');
                    utils.send();
                }, analytics.options.bufferDelay);
            }

            // TODO RAF: non che serva a molto questo return? :D
            return;
        }
    };

    analytics.track = function(category, action, label, value) {

        // TODO RAF: parametri obbligatori? almeno category/action?
        // se non vengono passati: analytics.err()


        // TODO RAF: invece di avere un (o piu') if lungo come tutto il metodo, ribaltalo e
        // copri tutti i casi di errore in cima, con dei return:
        // if (!analytics.options... ) { return; }

        if (analytics.options.doTracking){

            utils.cache.events.push({
              'eventCategory': category,
              'eventAction': action,
              'eventLabel': label,
              'eventValue': value
            });

            // TODO RAF: se .check serve a sapere se il timer sta andando o meno, troviamogli un
            // nome un pelo piu' significativo, isTimerRunning, isCheckActive.. quello che ti pare
            if (utils.check){
                utils.send();
                // TODO RAF: forse update hits va chiamato dopo averli consumati gli hit e non
                // prima?
                utils.updatehitsStart();
                utils.check = false;
            }
        }
    };

    analytics.log('Component running');
    return analytics;
});