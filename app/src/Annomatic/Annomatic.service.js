angular.module('Pundit2.Annomatic')
.factory('Annomatic', function(BaseComponent, DataTXTResource,
                               $compile, $rootScope, $timeout) {

    var service = new BaseComponent('Annomatic');

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
    };
    
    service.annotationNumber = 0;

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
        'removed' : 'ann-removed',
        'hidden'  : 'ann-hidden'
    };
    
    // Creates various utility indexes and counts stuff around to
    // show various informations to the user
    var analyze = function() {

        var byId = service.ann.byId,
            byType = service.ann.byType;

        service.ann.typesOptions = [];
        
        for (var s in stateClassMap) {
            service.ann.byState[s] = [];
        }
        
        for (var l=service.annotationNumber; l--;) {
            var ann = service.ann.byNum[l],
                id = ann.id,
                types = ann.types || [];

            // index by id
            if (id in byId) {
                byId[id].push(l);
            } else {
                byId[id] = [l];
            }
            
            // index by type
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

            service.ann.byState[ann.state].push(l);
        } // for l
        
        for (l=service.ann.typesOptions.length; l--;) {
            var op = service.ann.typesOptions[l],
                uri = op.value;
                
            op.label = op.label + "("+ byType[uri].length+")";
        }
        
    };
    
    var updateStates = function(num, from, to) {
        var byState = service.ann.byState,
            idx = byState[from].indexOf(num);
        byState[to].push(num);
        byState[from].splice(idx, 1);
    };

    service.setState = function(num, state) {
        var ann = service.ann.byNum[num],
            scope = service.ann.autoAnnScopes[num];

        // Update counters and indexes for states
        updateStates(num, ann.state, state);
        
        // Save the lastState for hover effects
        ann.lastState = ann.state;

        ann.state = state;
        scope.stateClass = stateClassMap[state];
        if (ann.hidden) {
            scope.stateClass += ' '+stateClassMap.hidden;
        }
    };
    
    service.setLastState = function(num) {
        var ann = service.ann.byNum[num],
            scope = service.ann.autoAnnScopes[num];
            
        updateStates(num, ann.state, ann.lastState);
        ann.state = ann.lastState;
        scope.stateClass = stateClassMap[ann.state];
        if (ann.hidden) {
            scope.stateClass += ' '+stateClassMap.hidden;
        }
    };

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
                // console.log('error', arguments);
            }
        );

    };
    
    service.hideAnn = function(num) {
        service.ann.byNum[num].hidden = true;
        service.ann.autoAnnScopes[num].stateClass = stateClassMap.hidden;
    };
    service.showAnn = function(num) {
        var ann = service.ann.byNum[num];
        ann.hidden = false;
        service.ann.autoAnnScopes[num].stateClass = stateClassMap[ann.state];
    };
    
    // Given an array of types, shows only the annotations with that
    // type.
    service.setTypeFilter = function(types) {
    
        var byType = service.ann.byType,
            byNum = service.ann.byNum,
            toShow = {};
        
        // No filters: just show all
        if (types.length === 0) {
            for (var i=byNum.length; i--;) {
                service.showAnn(i);
            }
        } else {
            // Get a unique list of ids to show
            for (var t in types) {
                var type = types[t];
                for (var j=byType[type].length; j--;) {
                    toShow[byType[type][j]] = true;
                }
            }
        
            // Cycle over all annotations and show/hide when needed
            for (var k=byNum.length; k--;) {
                if (k in toShow) {
                    service.showAnn(k);
                } else {
                    service.hideAnn(k);
                }
            }
        }

        // Force an apply after modifying the classes
        var phase = $rootScope.$$phase;
        if (phase === '$apply' || phase === '$digest') {
            $timeout(function() {
                $rootScope.$apply();
            }, 1);
        } else {
            $rootScope.$apply();
        }

    };
    
    service.closeAll = function() {
        for (var l=service.ann.byState.active.length; l--;){
            var num = service.ann.byState.active[l];
            service.ann.autoAnnScopes[num].hide();
        }
    };
    
    // If called with no parameter continues from last annotation
    service.currAnn = 0;
    service.reviewNext = function(from) {

        if (service.ann.byState.waiting.length === 0) {
            // console.log('All reviewed!');
            return;
        }
        
        service.closeAll();

        // No from, start from last currentAnn
        if (typeof(from) === "undefined") {
            from = service.currAnn;
        } else {
            from = parseInt(from, 10);
        }
        
        // Start from 0 if we reach the ends
        if (from >= service.annotationNumber) {
            service.currAnn = 0;
        } else {
            service.currAnn = from;
        }
        
        // Look for the next 'waiting' state starting from the current one
        while (service.ann.byNum[service.currAnn].hidden === true || service.ann.byNum[service.currAnn].state !== "waiting") {
            service.currAnn++;
            if (service.currAnn === service.annotationNumber) { break; }
        }

        if (service.currAnn < service.annotationNumber) {
            service.ann.autoAnnScopes[service.currAnn].show();
        } else {
            // TODO: notify review is done for the current filters?
            // console.log('All reviewed, for the current filters!');
        }

    };

    return service;
});