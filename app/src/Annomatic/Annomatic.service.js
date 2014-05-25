angular.module('Pundit2.Annomatic')
.factory('Annomatic', function(BaseComponent, DataTXTResource, XpointersHelper,
                               $compile, $rootScope, $timeout) {

    var annomatic = new BaseComponent('Annomatic');

    annomatic.ann = {
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
    
    annomatic.annotationNumber = 0;

    // Wraps an annotation with a certain span, with a certain controller
    // to handle clicks etc. 
    // TODO: use a directive instead of a span?
    var wrap = function(el, annotations) {
        var node = el[0],
            text = el.html();

        /*
        var before = text.substring(0, annotation.start),
            after = text.substring(annotation.end, text.length),
            annotated = text.substring(annotation.start, annotation.end),
            title = '',
            content = '';
        */

        annomatic.log('##### Wrapping annotations ', annotations.length, annotations);

        // .replace(/(?:(?:^|\n)\s+|\s+(?:$|\n))/g,'').replace(/\s+/g,' ')


        var stack = [node],
            currentNode = node,
            // Offset in our HTML string
            realOffset = 0,
            // Offset in the Annotations coordinates
            currentOffset = 0,
            currentAnnotationNum = 0,
            currentAnnotation = annotations[currentAnnotationNum],
            sub, start, end, addedSpaces;

        while ((currentNode = stack.pop()) && currentAnnotationNum < annotations.length) {
            addedSpaces = 0;

            console.log('## POPPED ', currentNode, currentAnnotation);

            if (XpointersHelper.isTextNode(currentNode)) {

                var trimmedContent = currentNode.textContent.replace(/[\r\n]/g, " ").replace(/(?:(?:^|\n)\s+|\s+(?:$|\n))/g,'').replace(/\s+/g,' ');

                // Super empty text node, skip it
                if (trimmedContent.length === 0) {
                    console.log('Skipping empty text node. Current offset is still '+ currentOffset);
                } else {

                    // if (trimmedContent.length !== currentNode.textContent.length) {
                        console.log('Text node got content CLEANED: ', trimmedContent.length, currentNode.textContent.length, currentNode.textContent);

                        // While the current annotation should belong to this text node
                        while (currentAnnotation.end <= currentOffset + trimmedContent.length +1) {
                            found = false;

                            console.log('(( Looking for '+currentAnnotation.start, currentAnnotation.end,' vs ', currentOffset + trimmedContent.length, 'Added spaces'+ addedSpaces);

                            var spacesLen = multipleSpacesLengthInContent(currentNode.textContent),
                                found = false;

                            spacesLen.push(0);

                            // There is spaces in the content   like     these
                            // if (spacesLen.length > 0){

                                console.log('[[ Content got spaces '+spacesLen+' ]]');

                                for (var l=spacesLen.length; l--;) {

                                    start = spacesLen[l] + currentAnnotation.start - currentOffset + addedSpaces;
                                    end = spacesLen[l] + currentAnnotation.end - currentOffset + addedSpaces;
                                    sub = currentNode.textContent.substring(start, end);
                                    console.log('Trying to add spaces ', spacesLen[l], '--'+ sub +'--', currentAnnotation.spot, start, end);
                                    if (currentAnnotation.spot === sub) {
                                        addedSpaces += spacesLen[l];
                                        found = true;
                                        console.log('@@@111@@@ FOUND ANNOTATION!!1!', currentAnnotation.spot, realOffset, realOffset+currentAnnotation.end);
                                        currentAnnotationNum++;
                                        currentAnnotation = annotations[currentAnnotationNum];
                                        break;
                                    }
                                }

                            /*
                            } else {
                                sub = currentNode.textContent.substring(currentAnnotation.start - currentOffset, currentAnnotation.end - currentOffset);
                                var sub = trimmedContent.substring(currentAnnotation.start - currentOffset, currentAnnotation.end - currentOffset),
                                    sub2 = trimmedContent.substring(currentAnnotation.start - currentOffset-2, currentAnnotation.end - currentOffset-2);

                                if (currentAnnotation.spot === sub) {
                                    console.log('@@@222@@@ FOUND ANNOTATION!!1!', currentAnnotation.spot, realOffset, realOffset+currentAnnotation.end);
                                    currentAnnotationNum++;
                                    currentAnnotation = annotations[currentAnnotationNum];
                                } else if (currentAnnotation.spot === sub2) {
                                    realOffset += 1;
                                    currentOffset += 1;
                                    console.log('@@@333@@@ FOUND ANNOTATION!!1!', currentAnnotation.spot, realOffset, realOffset + currentAnnotation.end);
                                    currentAnnotationNum++;
                                    currentAnnotation = annotations[currentAnnotationNum];
                                } else {
                                    console.log('Not found? --'+sub+'-- vs '+currentAnnotation.spot, currentOffset,  currentAnnotation.start);
                                }

                            }*/

                            if (!found) {
                                currentAnnotationNum++;
                                currentAnnotation = annotations[currentAnnotationNum];
                                console.log(':(((( next annotation?', currentAnnotation);
                            }

                            if (currentAnnotationNum >= annotations.length) {
                                console.log('Annotations are over!!1!');
                                break;
                            }

                            console.log('WHILE IS OVER ', currentAnnotation.end, currentOffset, trimmedContent.length, currentAnnotation.end <= currentOffset + trimmedContent.length)
                            if (currentAnnotation.end > currentOffset + trimmedContent.length) {
                                console.log('FUCKING TIRMMED COMMENENENTET ', trimmedContent, currentNode.textContent);
                            }

                        } // while currentAnnotation.end .. annotation should be in this text node

                        // Let's move on to the next node, update current offset +1, since DataTXT
                        // inserts a \n at the end of tags.. just because why not ..... :|
                        currentOffset += trimmedContent.length +1;
                        realOffset += currentNode.textContent.length;
                        console.log('Next annotation, offsets annotation/real: ', currentOffset, realOffset);


/*
                    } else {

                        console.log('Text node got already clean content: ', trimmedContent.length, currentNode.textContent.length, currentNode.textContent);

                        // Try to add 2, \n does get counted in the final string
                        var sub = trimmedContent.substring(currentAnnotation.start - currentOffset, currentAnnotation.end - currentOffset),
                            sub2 = trimmedContent.substring(currentAnnotation.start - currentOffset-2, currentAnnotation.end - currentOffset-2);

                        if (currentAnnotation.spot === sub) {
                            console.log('@@@222@@@ FOUND ANNOTATION!!1!', currentAnnotation.spot, realOffset, realOffset+currentAnnotation.end);
                            currentAnnotationNum++;
                            currentAnnotation = annotations[currentAnnotationNum];
                        } else if (currentAnnotation.spot === sub2) {
                            realOffset += 1;
                            currentOffset += 1;
                            console.log('@@@333@@@ FOUND ANNOTATION!!1!', currentAnnotation.spot, realOffset, realOffset + currentAnnotation.end);
                            currentAnnotationNum++;
                            currentAnnotation = annotations[currentAnnotationNum];
                        } else {
                            console.log('Not found? --'+sub+'-- vs '+currentAnnotation.spot, currentOffset,  currentAnnotation.start);
                        }

                        realOffset += currentNode.textContent.length;
                        currentOffset += trimmedContent.length;
                        console.log('Offsets annotation/real: ', currentOffset, realOffset);

                    }
                    */

                    // if (annotation.start === currentOffset && annotation.)

                }

            } else {
                if (currentNode.hasChildNodes()) {
                    var childNodes = currentNode.childNodes;
                    for (var len=childNodes.length; len--;) {
                        stack.push(childNodes[len]);
                        console.log('Pushing ', childNodes[len]);
                    }
                }
            }

        } // while currentNode

        /*
        title = annotation.label;
        content += annotation.abstract.replace("'", "\'");

        var wrapped = "<span ng-controller=\"AutomaticAnnotationCtrl\" ng-init=\"num="+num+"\" ng-click=\"handleSuggestionClick()\" class='{{stateClass}} ann-auto ann-"+num+"'>"+ annotated +"</span>";
        // el.html(before + wrapped + after);
        */

    };

    var spacesUntilContent = function(string) {
        return string.match(/^(\s*)/)[1].length;
    };
    var multipleSpacesInContent = function(string) {
        var ret = string.match(/(\s\s+)/g);

        if (ret === null) {
            return [];
        }

        // New lines? Replace them with a space ...
        for (var len=ret.length; len--;) {
            if (ret[len].match(/\n/)) {
                ret[len] = ret[len].replace(/[\r\n]/g, " ");
            }
        }

        return ret;
    };

    var multipleSpacesLengthInContent = function(string) {
        var doubleSpaces = multipleSpacesInContent(string),
            len = doubleSpaces.length;

        if (len === 0) {
            return [];
        }

        var ret = [],
            seen = {};
        for (var i=0; i<len; i++) {
            var current = doubleSpaces[i].length -1;
            if (typeof(seen[current]) === "undefined") {
                seen[current] = true;
                ret.push(current);
            }
        }

        // Return them sorted numerically
        return ret.sort(function(a, b) { return a-b; });
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
    // show various information to the user
    var analyze = function() {

        var byId = annomatic.ann.byId,
            byType = annomatic.ann.byType;

        annomatic.ann.typesOptions = [];
        
        for (var s in stateClassMap) {
            annomatic.ann.byState[s] = [];
        }
        
        for (var l=annomatic.annotationNumber; l--;) {
            var ann = annomatic.ann.byNum[l],
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
                    annomatic.ann.typesOptions.push({value: t, label: t.substr(-10) });
                    byType[t] = [l];
                }
            }

            // Init all annotations to waiting
            ann.state = "waiting";
            ann.lastState = "waiting";

            annomatic.ann.byState[ann.state].push(l);
        } // for l
        
        for (l=annomatic.ann.typesOptions.length; l--;) {
            var op = annomatic.ann.typesOptions[l],
                uri = op.value;
                
            op.label = op.label + "("+ byType[uri].length+")";
        }
        
    };
    
    var updateStates = function(num, from, to) {
        var byState = annomatic.ann.byState,
            idx = byState[from].indexOf(num);
        byState[to].push(num);
        byState[from].splice(idx, 1);
    };

    annomatic.setState = function(num, state) {
        var ann = annomatic.ann.byNum[num],
            scope = annomatic.ann.autoAnnScopes[num];

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
    
    annomatic.setLastState = function(num) {
        var ann = annomatic.ann.byNum[num],
            scope = annomatic.ann.autoAnnScopes[num];
            
        updateStates(num, ann.state, ann.lastState);
        ann.state = ann.lastState;
        scope.stateClass = stateClassMap[ann.state];
        if (ann.hidden) {
            scope.stateClass += ' '+stateClassMap.hidden;
        }
    };

    annomatic.getDataTXTAnnotations = function(node) {
        var element = angular.element(node),
            content = element.html();

        annomatic.log('Querying DataTXT for annotations on content: ', content);

        /*
        var mock = '{"time":10,"annotations":[{"start":0,"end":4,"spot":"Pisa","confidence":0.8537,"id":9164,"title":"Provincia di Pisa","uri":"http://it.wikipedia.org/wiki/Provincia_di_Pisa","abstract":"La provincia di Pisa è una provincia italiana della Toscana di oltre 415 000 abitanti. È la seconda Provincia toscana per popolazione.","label":"Provincia di Pisa","categories":["Provincia di Pisa"],"types":["http://dbpedia.org/ontology/Place","http://dbpedia.org/ontology/PopulatedPlace","http://dbpedia.org/ontology/Settlement"],"image":{"full":"https://upload.wikimedia.org/wikipedia/commons/b/bf/Toscana_Pisa1_tango7174.jpg","thumbnail":"https://upload.wikimedia.org/wikipedia/commons/thumb/b/bf/Toscana_Pisa1_tango7174.jpg/200px-Toscana_Pisa1_tango7174.jpg"},"lod":{"wikipedia":"http://it.wikipedia.org/wiki/Provincia_di_Pisa","dbpedia":"http://it.dbpedia.org/resource/Provincia_di_Pisa"}},{"start":10,"end":25,"spot":"comune italiano","confidence":0.9169,"id":1217,"title":"Comuni d\u0027Italia","uri":"http://it.wikipedia.org/wiki/Comuni_d%27Italia","abstract":"Il comune, in Italia, è l\u0027ente locale fondamentale, autonomo ed indipendente secondo i princìpi consolidatisi nel Medioevo, e ripresi, in modo relativamente limitato, dalla rivoluzione francese, previsto dall\u0027 della Costituzione. Può essere suddiviso in frazioni, le quali possono a loro volta avere un limitato potere consultivo grazie alle consulte di frazione.","label":"Comune italiano","categories":["Comuni d\u0027Italia","Diritto amministrativo italiano","Diritto costituzionale italiano"],"types":["http://dbpedia.org/ontology/Place","http://dbpedia.org/ontology/PopulatedPlace","http://dbpedia.org/ontology/Settlement"],"image":{"full":"https://upload.wikimedia.org/wikipedia/commons/c/c3/Corona_di_comune.svg","thumbnail":"https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Corona_di_comune.svg/200px-Corona_di_comune.svg.png"},"lod":{"wikipedia":"http://it.wikipedia.org/wiki/Comuni_d%27Italia","dbpedia":"http://it.dbpedia.org/resource/Comuni_d\u0027Italia"}},{"start":95,"end":100,"spot":"Sesto","confidence":0.6072,"id":35303,"title":"Sesto (Italia)","uri":"http://it.wikipedia.org/wiki/Sesto_%28Italia%29","abstract":"Sesto (Sexten in tedesco, talvolta in italiano Sesto Pusteria) è un comune italiano di 1.945 abitanti della provincia autonoma di Bolzano.","label":"Sesto","categories":["Comuni d\u0027Italia confinanti con l\u0027Austria","Comuni della provincia di Bolzano","Stazioni e comprensori sciistici del Trentino-Alto Adige"],"types":["http://dbpedia.org/ontology/Place","http://dbpedia.org/ontology/PopulatedPlace","http://dbpedia.org/ontology/Settlement","http://dbpedia.org/ontology/City"],"image":{"full":"https://upload.wikimedia.org/wikipedia/commons/1/19/Sexten-Sesto2.JPG","thumbnail":"https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Sexten-Sesto2.JPG/200px-Sexten-Sesto2.JPG"},"lod":{"wikipedia":"http://it.wikipedia.org/wiki/Sesto_%28Italia%29","dbpedia":"http://it.dbpedia.org/resource/Sesto_(Italia)"}},{"start":432,"end":439,"spot":"vertice","confidence":0.0356,"id":596510,"title":"Vertice (geometria)","uri":"http://it.wikipedia.org/wiki/Vertice_%28geometria%29","abstract":"Il vertice, nella geometria piana è: il punto di incontro di due lati di un poligono (triangolo, quadrilatero, ecc).","label":"Vertici","categories":["Angolo","Poligoni","Poliedri"],"image":{"full":"https://upload.wikimedia.org/wikipedia/commons/8/81/V%C3%A9rtiz.jpg","thumbnail":"https://upload.wikimedia.org/wikipedia/commons/thumb/8/81/V%C3%A9rtiz.jpg/200px-V%C3%A9rtiz.jpg"},"lod":{"wikipedia":"http://it.wikipedia.org/wiki/Vertice_%28geometria%29","dbpedia":"http://it.dbpedia.org/resource/Vertice_(geometria)"}}]}';
        var data = JSON.parse(mock);

        console.log('mock? ', data);
        wrap(element, data.annotations);

        return;
        */

        annomatic.annotations = DataTXTResource.getAnnotations({
                "$app_id": "cc85cdd8",
                "$app_key": "668e4ac4f00f64c43ab4fefd5c8899fa",
                html: content
            },
            function(data) {

                annomatic.log('Received '+data.annotations.length+' annotations from DataTXT');
                console.log('Received text is ', data.text);
                /*
                var stop = 2;
                for (var l=data.annotations.length, i=0; i<l; i++) {
                    wrap(element, data.annotations[i], i);
                    if (stop-- === 0) {
                        break;
                    }
                }*/
                wrap(element, data.annotations);

                annomatic.ann.byNum = data.annotations;
                annomatic.currAnn = 0;
                annomatic.annotationNumber = data.annotations.length;
                analyze();
                $compile(element.contents())($rootScope);
            },
            function() {
                annomatic.err('Error loading annotations from DataTXT');
            }
        );

    };
    
    annomatic.hideAnn = function(num) {
        annomatic.ann.byNum[num].hidden = true;
        annomatic.ann.autoAnnScopes[num].stateClass = stateClassMap.hidden;
    };
    annomatic.showAnn = function(num) {
        var ann = annomatic.ann.byNum[num];
        ann.hidden = false;
        annomatic.ann.autoAnnScopes[num].stateClass = stateClassMap[ann.state];
    };
    
    // Given an array of types, shows only the annotations with that
    // type.
    annomatic.setTypeFilter = function(types) {
    
        var byType = annomatic.ann.byType,
            byNum = annomatic.ann.byNum,
            toShow = {};
        
        // No filters: just show all
        if (types.length === 0) {
            for (var i=byNum.length; i--;) {
                annomatic.showAnn(i);
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
                    annomatic.showAnn(k);
                } else {
                    annomatic.hideAnn(k);
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
    
    annomatic.closeAll = function() {
        for (var l=annomatic.ann.byState.active.length; l--;){
            var num = annomatic.ann.byState.active[l];
            annomatic.ann.autoAnnScopes[num].hide();
        }
    };
    
    // If called with no parameter continues from last annotation
    annomatic.currAnn = 0;
    annomatic.reviewNext = function(from) {

        if (annomatic.ann.byState.waiting.length === 0) {
            // console.log('All reviewed!');
            return;
        }
        
        annomatic.closeAll();

        // No from, start from last currentAnn
        if (typeof(from) === "undefined") {
            from = annomatic.currAnn;
        } else {
            from = parseInt(from, 10);
        }
        
        // Start from 0 if we reach the ends
        if (from >= annomatic.annotationNumber) {
            annomatic.currAnn = 0;
        } else {
            annomatic.currAnn = from;
        }
        
        // Look for the next 'waiting' state starting from the current one
        while (annomatic.ann.byNum[annomatic.currAnn].hidden === true || annomatic.ann.byNum[annomatic.currAnn].state !== "waiting") {
            annomatic.currAnn++;
            if (annomatic.currAnn === annomatic.annotationNumber) { break; }
        }

        if (annomatic.currAnn < annomatic.annotationNumber) {
            annomatic.ann.autoAnnScopes[annomatic.currAnn].show();
        } else {
            // TODO: notify review is done for the current filters?
            // console.log('All reviewed, for the current filters!');
        }

    };

    annomatic.log('Component up and running');

    return annomatic;
});