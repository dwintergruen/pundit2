angular.module('Pundit2.AnnomaticModule')
.factory('Annotate', function(DataTXTResource, $compile, $rootScope) {

    var service = {};

    service.ann = {
        // The annotations, by number
        byNum: [],
        // list of numbers for the given id
        byId: {},
        // scopes for the popovers, indexed by num
        autoAnnScopes: [],
        // list of numbers for the given state
        byState: {},
        // list of numbers for the given type
        byType: {},
        // Key-value pair for the types
        typesOptions: []
    }

    // Wraps an annotation with a certain span, with a certain controller
    // to handle clicks etc. 
    // TODO: use a directive instead of a span?
    var wrap = function(node, annotation, num) {
        var el = angular.element(node),
            text = el.html();
        
        var before = text.substring(0, annotation.start),
            after = text.substring(annotation.end, text.length),
            annotated = text.substring(annotation.start, annotation.end),
            title = '', 
            content = '';
        
        title = annotation.label;
        content += annotation.abstract.replace("'", "\'");

        var wrapped = "<span ng-controller=\"AutomaticAnnotationCtrl\" ng-init=\"num="+num+"\" ng-click=\"handleSuggestionClick()\" class='{{stateClass}} ann-auto ann-"+num+"'>"+ annotated +"</span>";
        el.html(before + wrapped + after);
    };

    // TODO: move this to some kind of configured CONSTANTS, 
    // and use them instead of magic 'strings'
    var stateClassMap = {
        'waiting' : 'ann-waiting',
        'active'  : 'ann-active',
        'accepted': 'ann-ok',
        'removed' : 'ann-removed'
    };
    
    // Creates various utility indexes and counts stuff around to
    // who various informations to the user
    var analyze = function() {

        service.ann.byId = {};
        service.ann.typesOptions = [];
        
        for (var s in stateClassMap)
            service.ann.byState[s] = [];
        
        for (var l=service.annotationNumber; l--;) {
            var ann = service.ann.byNum[l],
                id = ann.id,
                types = ann.types || [];

            // index by id
            var byId = service.ann.byId; 
            if (id in byId) {
                byId[id].push(l);
            } else {
                byId[id] = [l];
            }
            
            console.log('ffs', types, ann);
            
            // index by type
            var byType = service.ann.byType;
            for (var typeLen=types.length; typeLen--;) {
                var t = types[typeLen];
                if (t in byType) {
                    byType[t].push(l);
                } else {
                    service.ann.typesOptions.push({value: t, label: t.substr(-10) });
                    byType[t] = [l];
                }
            }

            // Init all annotations to waiting
            ann.state = "waiting";
            ann.lastState = "waiting";
            
            service.ann.byState[ann.state].push(l)
        }
        
        console.log('type', service.ann.byType, service.ann.typesOptions);
        
    };
    
    var updateStates = function(num, from, to) {
        // console.log('tolgo a', from, service.ann.byState[from]);
        // console.log('aggiungo da', to, service.ann.byState[to]);
        
        byState = service.ann.byState;

        byState[to].push(num);
        var idx = byState[from].indexOf(num);
        byState[from].splice(idx, 1);
        
    }

    service.setState = function(num, state) {
        var ann = service.ann.byNum[num];

        // Update counters and indexes for states
        updateStates(num, ann.state, state);
        
        // Save the lastState for hover effects
        ann.lastState = ann.state;

        ann.state = state;
        service.ann.autoAnnScopes[num].stateClass = stateClassMap[state];
    }
    
    service.setLastState = function(num) {
        var ann = service.ann.byNum[num];
        updateStates(num, ann.state, ann.lastState);
        ann.state = ann.lastState;
        service.ann.autoAnnScopes[num].stateClass = stateClassMap[ann.state];
    }

    service.getDataTXTAnnotations = function(node) {
        var element = angular.element(node),
            content = element.html();

        service.annotations = DataTXTResource.getAnnotations({
                "$app_id": "cc85cdd8",
                "$app_key": "668e4ac4f00f64c43ab4fefd5c8899fa",
                text: content
            },
            function (data){
                for (var l=data.annotations.length; l--;) {
                    wrap(element, data.annotations[l], l);
                }
                service.ann.byNum = data.annotations;
                service.currAnn = 0;
                service.annotationNumber = data.annotations.length;
                analyze();
                $compile(element.contents())($rootScope);
            },
            function (){ 
                console.log('error', arguments);
            }
        );

    };

    service.closeAll = function() {
        for (var l=service.ann.byState['active'].length; l--;){
            var num = service.ann.byState['active'][l];
            service.ann.autoAnnScopes[num].hide();
        }
    };
    
    // If called with no parameter continues from last annotation
    service.currAnn = 0;
    service.reviewNext = function(from) {

        if (service.ann.byState['waiting'].length === 0) {
            console.log('All reviewed!');
            return;
        }
        
        service.closeAll();

        if (typeof(from) === "undefined") {
            from = service.currAnn;
        } else {
            from = parseInt(from, 10);
        }
        
        if (from >= service.annotationNumber) {
            service.currAnn = 0;
        } else {
            service.currAnn = from;
        }
        
        // Look for the next 'waiting' state starting from the current one
        if (service.currAnn < service.annotationNumber) {
            while (service.ann.byNum[service.currAnn] && service.ann.byNum[service.currAnn].state !== "waiting") {
                service.currAnn++;
                if (service.currAnn === service.annotationNumber) break;
            }
        }
        service.ann.autoAnnScopes[service.currAnn].show();
    };

    return service;
});