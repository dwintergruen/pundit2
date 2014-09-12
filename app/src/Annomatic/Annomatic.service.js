angular.module('Pundit2.Annomatic')
.constant('ANNOMATICDEFAULTS', {
    /**
     * @module punditConfig
     * @ngdoc property
     * @name modules#Annomatic
     *
     * @description
     * `object`
     *
     * Configuration for Annomatic module
     */

    /**
     * @module punditConfig
     * @ngdoc property
     * @name modules#Annomatic.container
     *
     * @description
     * `string`
     *
     * Container in which will be saved items created by automatic annotation
     *
     * Default value:
     * <pre> container: 'annomatic' </pre>
     */
    container: 'annomatic',

    /**
     * @module punditConfig
     * @ngdoc property
     * @name modules#Annomatic.cMenuType
     *
     * @description
     * `string`
     *
     * Contextual menu type showed by items contained inside directive
     *
     * Default value:
     * <pre> cMenuType: 'annomatic' </pre>
     */
    cMenuType: 'annomatic',

    /**
     * @module punditConfig
     * @ngdoc property
     * @name modules#Annomatic.source
     *
     * @description
     * `string`
     *
     * Set the service called by Annomatic to get annotation suggested: 'DataTXT' or 'gramsci' 
     *
     * Default value:
     * <pre> source: 'gramsci' </pre>
     */
    source: 'gramsci',

    /**
     * @module punditConfig
     * @ngdoc property
     * @name modules#Annomatic.property
     *
     * @description
     * `string` or `obj`
     *
     * Propety used to save the annotations on the server. You can pass the uri of the property (this must be available in pundit)
     * or the complete object as pundit property convention ({uri, type, label, range, domain ...}) 
     *
     * Default value:
     * <pre> property: 'http://purl.org/pundit/ont/oa#isRelatedTo' </pre>
     */
    property: 'http://purl.org/pundit/ont/oa#isRelatedTo'
})
.service('Annomatic', function(ANNOMATICDEFAULTS, BaseComponent, NameSpace, DataTXTResource, XpointersHelper,
                               ItemsExchange, TextFragmentHandler, ImageHandler, TypesHelper,
                               DBPediaSpotlightResource, Item, GramsciResource, AnnotationsCommunication,
                               $rootScope, $timeout, $document, $q) {

    var annomatic = new BaseComponent('Annomatic', ANNOMATICDEFAULTS);

    annomatic.ann = {
        // The annotations, by Item uri
        byUri: {},
        // The annotations, by number: we need it to go the next/prev
        byNum: [],

        // Maps to go back and forth from annotation number to URI.
        // numToUri has num as index, uri as value
        numToUriMap: {},
        uriToNumMap: {},

        // list of numbers for the given id (same entity for multiple fragments)
        byId: {},
        // scopes for the popovers, indexed by num
        autoAnnScopes: [],
        // list of numbers for the given state
        byState: {},
        // list of numbers for the given type
        byType: {},
        // Key-value pair for the types
        typesOptions: [],
        savedById: [],
        savedByNum: []
    };
    
    annomatic.annotationNumber = 0;

    // Tries to find the given array of DataTXT annotations in the child nodes of the
    // given node. Finding them might be a very delicate and fun dance!
    // Returns an array of objects with range and annotation in them
    var findAnnotations = function(el, annotations) {
        var node = el[0];
        // var text = el.html();

        annomatic.log('##### Wrapping annotations ', annotations.length, annotations);

        var stack = [node],
            currentOffset = 0,
            currentAnnotationNum = 0,
            currentAnnotation = annotations[currentAnnotationNum],
            sub, start, end, addedSpaces, currentNode, found,
            foundAnnotations = [],
            correctedEmtpyNode = false;

        // Cycle over the nodes in the stack: depth first. We start from the given node
        while ((currentNode = stack.pop()) && currentAnnotationNum < annotations.length) {

            annomatic.log("Popped node ", currentNode, ' current offset = '+currentOffset);

            // Spaces added to the current offsets to match the real content, it will
            // be used to create valid ranges
            addedSpaces = 0;

            // Not a text node, push every child in the stack starting from the last, so
            // the first popped will be the first child: depth first visit
            if (!XpointersHelper.isTextNode(currentNode)) {
                if (currentNode.hasChildNodes()) {
                    var childNodes = currentNode.childNodes;
                    for (var len=childNodes.length; len--;) {
                        stack.push(childNodes[len]);
                        annomatic.log('Pushing node ', childNodes[len]);
                    }
                }

            // If it's a text node.. let the dance begin!
            } else {

                // Trimmed content: DataTXT strips multiple spaces (more than allowed in HTML)
                // to return a nice looking text only string. We strip the content of the
                // current text node, hopefully to get the very same result as DataTXT
                var trimmedContent = trim(currentNode.textContent);

                // Empty text nodes: they just contain spaces and/or \r\n
                if (trimmedContent.length === 0) {

                    // All of the first multiple spaces will get fully trimmed, ignore them
                    if (currentOffset === 0) {
                        annomatic.log('Skipping FIRST empty text node.');
                    } else if (correctedEmtpyNode) {
                        annomatic.log('Skipping Consecutive empty text node, without correcting again.');
                    } else {
                        // If it's not the first text node, trim() will just collapse double spaces
                        // and \n into a single space. In that case we need to correct the
                        // currentOffset by 1
                        if (trimDoubleSpaces(currentNode.textContent).length === 1) {
                            annomatic.log('Skipping intermediate empty text node, correcting offset by 1');
                            currentOffset += 1;
                            correctedEmtpyNode = true;
                        } else {
                            annomatic.log('OUCH! trimDoubleSpaces fail?!!? --'+trimDoubleSpaces(currentNode.textContent)+'--');
                        }
                    }

                } else {

                    // Cycle over annotations, until the current annotation .end
                    // is out of this node's content length. In that case we found the first
                    // annotation belonging to the next node. We let the outer while pop the
                    // next node and cycle over and over and over again.
                    while (currentAnnotation.end <= currentOffset + trimmedContent.length + 1) {

                        // True if we found an annotation on this node
                        found = false;

                        // HTML allows multiple spaces pretty much everywhere, rendering them
                        // as a single one. New lines as well.
                        // Gather every multiple space in this node: DataTXT strips them
                        // off replacing them with single spaces, new lines included. We need
                        // to know how many spaces got skipped so to being able to match
                        // the annotated words even if after multiple spaces.
                        var spacesLen = multipleSpacesLengthInContent(currentNode.textContent);

                        // There might be no spaces at all .. check it out!
                        spacesLen.push(0);

                        // For each number of spaces found, try to match the content
                        for (var l = spacesLen.length; l--;) {

                            start = spacesLen[l] + currentAnnotation.start - currentOffset + addedSpaces;
                            end = spacesLen[l] + currentAnnotation.end - currentOffset + addedSpaces;
                            sub = currentNode.textContent.substring(start, end);

                            annomatic.log('Trying to add '+spacesLen[l]+' spaces: --' +
                                sub + '-- vs --'+ currentAnnotation.spot+'-- (' +
                                start+' to '+end+')');

                            // TODO: we are losing all those annotations which are multiple words AND
                            // in the DOM are splitted by spaces like "aa     bb" or "aa\n    bb".
                            // It might be possible to catch this by checking if sub contains a
                            // good number of spaces (with the regexp), add that number to the end
                            // offset et voilà... should work.

                            // Found the annotated fragment!
                            if (currentAnnotation.spot === sub) {
                                addedSpaces += spacesLen[l];
                                found = true;
                                annomatic.log('@@ Found annotation '+ currentAnnotation.spot);

                                var range = $document[0].createRange();
                                range.setStart(currentNode, start);
                                range.setEnd(currentNode, end);

                                if (range.toString() !== currentAnnotation.spot) {
                                    annomatic.err('Annotation and range content do not match!! :((');
                                } else {
                                    foundAnnotations.push({
                                        range: range,
                                        annotation: currentAnnotation
                                    });
                                }
                                break;
                            }
                        } // for l = spacesLen.length

                        if (!found) {
                            annomatic.log('Annotation NOT FOUND: ', currentAnnotation);
                        }

                        currentAnnotationNum++;
                        currentAnnotation = annotations[currentAnnotationNum];

                        if (currentAnnotationNum >= annotations.length) {
                            annomatic.log('Annotations are over!!! We are done!!');
                            break;
                        }

                    } // while currentAnnotation.end .. annotation should be in this text node


                    // Let's move on to the next node, update current offset with the length of
                    // the node we just finished with.
                    // If the current offset is still 0, we need to pay attention to any leading
                    // spaces and trim them off. They got trimmed by trim(), not by
                    // trimDoubleSpaces()
                    var doubleSpaceTrimmed = trimDoubleSpaces(currentNode.textContent);

                    if (doubleSpaceTrimmed.match(/^\s\s*/) && (correctedEmtpyNode || currentOffset === 0)) {
                        currentOffset += doubleSpaceTrimmed.length - 1;
                        annomatic.log('Moving to next node (corrected by leading space) with current offset = '+ currentOffset);
                    } else {
                        currentOffset += doubleSpaceTrimmed.length;
                        annomatic.log('Moving to next node with current offset = '+ currentOffset);
                    }
                    correctedEmtpyNode = false;

                } // if trimmedContentLength
            } // if isTextNode()

        } // while currentNode

        annomatic.log('Dance finished, found '+foundAnnotations.length+' annotations: ', foundAnnotations);
        return foundAnnotations;
    }; // findAnnotations()

    // Trims initial spaces, ending spaces, double spaces
    var trim = function(string) {
        return string
            .replace(/[\r\n]/g, " ")
            .replace(/(?:(?:^|\n)\s+|\s+(?:$|\n))/g, '')
            .replace(/\s+/g, ' ');
    };

    var trimDoubleSpaces = function(string) {
        return string
            .replace(/[\r\n]/g, " ")
            .replace(/\s+/g, ' ');
    };

    // Returns an array of every multiple space found in the string, like ["  ", "    "]
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

    // Given a string, returns an array of numbers of multiple spaces found, with no
    // repetitions, sorted. From ["   ", "  ", "     "] to [2, 3, 5]
    var multipleSpacesLengthInContent = function(string) {
        var doubleSpaces = multipleSpacesInContent(string),
            len = doubleSpaces.length;

        if (len === 0) {
            return [];
        }

        var ret = [],
            seen = {};
        for (var i=0; i<len; i++) {
            var current = doubleSpaces[i].length - 1;
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
    annomatic.stateClassMap = {
        'waiting' : 'ann-waiting',
        'active'  : 'ann-active',
        'accepted': 'ann-ok',
        'removed' : 'ann-removed',
        'hidden'  : 'ann-hidden'
    };


    // TODO: do we need to do more stuff to reset everything and start from scratch?
    annomatic.reset = function() {
        annomatic.ann.typesOptions = [];

        for (var s in annomatic.stateClassMap) {
            annomatic.ann.byState[s] = [];
        }
    };
    annomatic.reset();

    // Creates various utility indexes and counts stuff around to
    // show various information to the user
    var analyze = function(from, to) {

        var byId = annomatic.ann.byId,
            byType = annomatic.ann.byType;

        annomatic.log('Analyzing from '+from+' to '+to);

        for (var l=from; l<to; l++) {
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
                    annomatic.ann.typesOptions.push({value: t});
                    byType[t] = [l];
                }
            }

            // Init all annotations to waiting
            ann.state = "waiting";
            ann.lastState = "waiting";

            annomatic.ann.byState[ann.state].push(l);
        } // for l

        // Recalculate the number of annotations for each type and update the labels
        // for the select
        for (l=annomatic.ann.typesOptions.length; l--;) {
            var op = annomatic.ann.typesOptions[l],
                uri = op.value;

            op.label = TypesHelper.getLabel(uri) + " ("+ byType[uri].length+")";
        }

        // Sort them from most used to least used
        annomatic.ann.typesOptions = annomatic.ann.typesOptions.sort(function(a, b){
            return byType[b.value].length - byType[a.value].length;
        });
        
    }; // analyze()
    
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

        var stateClass = annomatic.stateClassMap[state];
        if (ann.hidden) {
            stateClass += ' '+annomatic.stateClassMap.hidden;
        }

        scope.setStateClass(annomatic.stateClassMap[ann.lastState], stateClass);

    };
    
    annomatic.setLastState = function(num) {
        var ann = annomatic.ann.byNum[num],
            scope = annomatic.ann.autoAnnScopes[num];
            
        updateStates(num, ann.state, ann.lastState);
        ann.state = ann.lastState;

        var stateClass = annomatic.stateClassMap[ann.state];
        if (ann.hidden) {
            stateClass += ' '+annomatic.stateClassMap.hidden;
        }

        scope.setStateClass(annomatic.stateClassMap[ann.lastState], stateClass);
    };

    // Given an HTML node, will query DataTXT for annotations on the contents of that node
    // solving the promise when done.
    annomatic.getDataTXTAnnotations = function(node) {
        var promise = $q.defer(),
            element = angular.element(node),
            content = element.text();

        // It is possible to pass to DataTXT the HTML form of the content, findAnnotations()
        // will to the magic rest ;)
        // content = element.html();

        // If we're not passing the HTML but just the text, we strip out extra spaces at beginning
        // and end, and multiple spaces in the middle of the text
        content = trim(content);

        annomatic.log('Querying DataTXT for annotations on content: ', content);


        annomatic.annotations = DataTXTResource.getAnnotations({
                "$app_id": "cc85cdd8",
                "$app_key": "668e4ac4f00f64c43ab4fefd5c8899fa",
                text: content
                // html: content
            },
            function(data) {

                annomatic.log('Received '+data.annotations.length+' annotations from DataTXT');
                var item,
                    validAnnotations = findAnnotations(element, data.annotations),
                    oldAnnotationNumber = annomatic.annotationNumber;

                annomatic.annotationNumber += validAnnotations.length;
                annomatic.currAnn = 0;

                for (var l=validAnnotations.length, i=0; i<l; i++) {
                    var currentIndex = oldAnnotationNumber + i;
                    item = TextFragmentHandler.createItemFromRange(validAnnotations[i].range);

                    annomatic.ann.byNum[currentIndex] = validAnnotations[i].annotation;
                    annomatic.ann.numToUriMap[currentIndex] = item.uri;
                    annomatic.ann.uriToNumMap[item.uri] = currentIndex;
                    annomatic.ann.byUri[item.uri] = validAnnotations[i].annotation;
                    ItemsExchange.addItemToContainer(item, annomatic.options.container);

                    item = createItemFromDataTXTAnnotation(validAnnotations[i].annotation);
                    ItemsExchange.addItemToContainer(item, annomatic.options.container);
                }

                analyze(oldAnnotationNumber, annomatic.annotationNumber);
                promise.resolve();

            },
            function(msg) {
                annomatic.err('Error loading annotations from DataTXT');
                promise.resolve(msg);
            }
        );

        return promise.promise;
    };

    var createItemFromDataTXTAnnotation = function(ann) {
        var values = {};

        values.uri = ann.uri;

        if (typeof(ann.types) === "undefined") {
            values.type = ['http://dbpedia.org/ontology/Thing'];
        } else if (ann.types.length === 0) {
            values.type = ['http://dbpedia.org/ontology/Thing'];
        } else {
            values.type = angular.copy(ann.types);
        }
        values.description = ann.abstract;

        values.label = ann.label;
        if (values.label.length > TextFragmentHandler.options.labelMaxLength) {
            values.label = values.label.substr(0, TextFragmentHandler.options.labelMaxLength) + ' ..';
        }

        if ('thumbnail' in ann.image) {
            values.image = ann.image.thumbnail;
        }

        return new Item(values.uri, values);
    };
    
    annomatic.hideAnn = function(num) {
        var ann = annomatic.ann.byNum[num],
            scope = annomatic.ann.autoAnnScopes[num];

        ann.hidden = true;
        scope.setStateClass(annomatic.stateClassMap[ann.state], annomatic.stateClassMap.hidden);
    };
    annomatic.showAnn = function(num) {
        var ann = annomatic.ann.byNum[num],
            scope = annomatic.ann.autoAnnScopes[num];

        ann.hidden = false;
        scope.setStateClass(annomatic.stateClassMap.hidden, annomatic.stateClassMap[ann.state]);
    };
    
    // Given an array of types, shows only the annotations with that
    // type.
    annomatic.setTypeFilter = function(types) {
    
        var byType = annomatic.ann.byType,
            byNum = annomatic.ann.byNum,
            toShow = {};

        annomatic.log('Setting type filter to ', types);

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

        if (annomatic.annotationNumber === 0) {
            annomatic.log('No annotation to review....');
            return;
        }

        if (annomatic.ann.byState.waiting.length === 0) {
            annomatic.log('All reviewed!');
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
        if (from >= annomatic.annotationNumber || from < 0) {
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

    // NEW ANNOMATIC SERVICE BASED ON GRAMSCI


    annomatic.hardReset = function() {
        annomatic.ann = {
            byUri: {},
            byNum: [],
            numToUriMap: {},
            uriToNumMap: {},
            byId: {},
            autoAnnScopes: [],
            byState: {},
            byType: {},
            typesOptions: [],
            savedByNum: [],
            savedById: []
        };
        annomatic.annotationNumber = 0;
        annomatic.reset();
    };

    annomatic.run = function() {
        state.isRunning = true;
        TextFragmentHandler.turnOff();
        ImageHandler.turnOff();
        $rootScope.$emit('annomatic-run');
    };

    annomatic.stop = function(){
        annomatic.hardReset();
        ItemsExchange.wipeContainer(annomatic.options.container);
        state.isRunning = false;
        TextFragmentHandler.turnOn();
        ImageHandler.turnOn();
        $rootScope.$emit('annomatic-stop');
    };

    var buildTargets = function(subUri, predUri, objUri){

        var sub = ItemsExchange.getItemByUri(subUri),
            pred = ItemsExchange.getItemByUri(predUri),
            obj = ItemsExchange.getItemByUri(objUri),
            res = [];

        if (typeof(sub) === 'undefined' || typeof(pred) === 'undefined' || typeof(obj) === 'undefined') {
            return;
        }        

        if (sub.isTextFragment() || sub.isImage() || sub.isImageFragment() ){
            if (res.indexOf(sub.uri) === -1) {
                res.push(sub.uri);
            }
        }
        if (pred.isTextFragment() || pred.isImage() || pred.isImageFragment() ){
            if (res.indexOf(pred.uri) === -1) {
                res.push(pred.uri);
            }
        }        
        if (obj.isTextFragment() || obj.isImage() || obj.isImageFragment() ){
            if (res.indexOf(obj.uri) === -1) {
                res.push(obj.uri);
            }
        }

        return res;
    };

    var buildGraph = function(subUri, predUri, objUri) {
        
        var sub = ItemsExchange.getItemByUri(subUri),
            pred = ItemsExchange.getItemByUri(predUri),
            obj = ItemsExchange.getItemByUri(objUri),
            res = {};

        if (typeof(sub) === 'undefined' || typeof(pred) === 'undefined' || typeof(obj) === 'undefined') {
            return;
        }
        
        res[sub.uri] = {};
        res[sub.uri][pred.uri] = [{type: 'uri', value: obj.uri}];

        return res;
    };

    var buildRDFItems = function(subUri, predUri, objUri) {

        var sub = ItemsExchange.getItemByUri(subUri),
            pred = ItemsExchange.getItemByUri(predUri),
            obj = ItemsExchange.getItemByUri(objUri),
            res = {};

        if (typeof(sub) === 'undefined' || typeof(pred) === 'undefined' || typeof(obj) === 'undefined') {
            return;
        }

        // add item and its rdf properties
        res[sub.uri] = sub.toRdf();
        res[pred.uri] = pred.toRdf();
        res[obj.uri] = obj.toRdf();

        // add object types and its label
        obj.type.forEach(function(e, i){
            var type = obj.type[i];
            res[type] = { };
            res[type][NameSpace.rdfs.label] = [{type: 'literal', value: TypesHelper.getLabel(e)}];
        });
        // add subject types and its label
        sub.type.forEach(function(e, i){
            var type = sub.type[i];
            res[type] = { };
            res[type][NameSpace.rdfs.label] = [{type: 'literal', value: TypesHelper.getLabel(e)}];
        });
        // add predicate types and its label
        pred.type.forEach(function(e, i){
            var type = pred.type[i];
            res[type] = { };
            res[type][NameSpace.rdfs.label] = [{type: 'literal', value: TypesHelper.getLabel(e)}];
        });

        return res;

    };

    annomatic.save = function(num){
        var uri = annomatic.ann.numToUriMap[num];
        var ann = annomatic.ann.byUri[uri];

        var items = buildRDFItems(uri, annomatic.options.property, ann.uri);
        var graph = buildGraph(uri, annomatic.options.property, ann.uri);
        var targets = buildTargets(uri, annomatic.options.property, ann.uri);

        AnnotationsCommunication.saveAnnotation(graph, items, targets, undefined, true).then(function(annId){
            annomatic.ann.savedById.push(annId);
            annomatic.ann.savedByNum.push(num);
            annomatic.setState(num, 'accepted');
            annomatic.reviewNext(num + 1);
        });
    };

    // annomatic.saveAll = function(){
    //     // save all accepted annotation
    //     for (var i=0; i<annomatic.ann.byState.accepted.length; i++) {
    //         var index = annomatic.ann.byState.accepted[i];
    //         annomatic.save(index);    
    //     }
    // };

    annomatic.isRunning = function() {
        return state.isRunning;
    };

    annomatic.getGrasciAnnotations = function(node){
        var promise = $q.defer();

        if(typeof(node) === 'undefined'){
            promise.resolve();
            return;
        }

        var element = angular.element(node);
        var about = element.attr('about');
        var content = element.parent().html();

        GramsciResource.getAnnotations({
                doc_id: about,
                html_fragment: content
            },
            function(data) {
                consolidateGramsciSpots(data);
                promise.resolve();               
            },
            function(msg) {
                annomatic.log('Error msg: ', msg);
                promise.resolve();
            }
        );

        return promise.promise;
    };

    annomatic.getAnnotations = function(node){
        if(annomatic.options.source === 'DataTXT'){
            return annomatic.getDataTXTAnnotations(node);
        } else if(annomatic.options.source === 'gramsci'){
            return annomatic.getGrasciAnnotations(node);
        }
    };

    var state = {
        isRunning: false
    };

    // get the html content to be sent to gramsci
    var getGramsciHtml = function () {
        return angular.element('.pundit-content').html();
    };

    var createItemFromGramsciAnnotation = function(ann) {
        var values = {};

        values.uri = ann.uri;

        values.label = ann.label;
        if (values.label.length > TextFragmentHandler.options.labelMaxLength) {
            values.label = values.label.substr(0, TextFragmentHandler.options.labelMaxLength) + ' ..';
        }        

        // TODO what types ?
        if (typeof(ann.types) === "undefined") {
            values.type = ['http://dbpedia.org/ontology/Thing'];
        } else {
            values.type = angular.copy(ann.types);
        }
        if (typeof(ann.abstract) === "undefined") {
            values.description = ann.label + " imported from Gramsci Dictionary";
        } else {
            values.description = ann.abstract;
        }

        return new Item(values.uri, values);
    };


    // consolidate all gramsci spots (wrap text inside span and add popover toggle icon)
    var consolidateGramsciSpots = function (data) {

        // var annotations = getGramsciAnnotations();
        var annotations = data.annotations;
        var validAnnotations = [];
        var i;
        
        // cycle on all annotations received from gramsci
        for (i=0; i<annotations.length; i++) {

            var ann = annotations[i];
            // get the current node from xpath
            var startCurrentNode = XpointersHelper.getNodeFromXpath(ann.startXpath.replace('/html[1]/body[1]', '/'));
            var endCurrentNode = XpointersHelper.getNodeFromXpath(ann.endXpath.replace('/html[1]/body[1]', '/'));

            annomatic.log('get node from xpath', startCurrentNode, endCurrentNode);

            if (!XpointersHelper.isTextNode(startCurrentNode) || !XpointersHelper.isTextNode(endCurrentNode)) {
                // TODO
                // we must continue the search in the next node ???
                // do somethings with child nodes (complex case)
                annomatic.err('node is not text', startCurrentNode, endCurrentNode);
            } else {
                // If it's a text node (simple case)

                var range = $document[0].createRange();
                range.setStart(startCurrentNode, ann.startOffset);
                range.setEnd(endCurrentNode, ann.endOffset);

                if (range.toString() !== ann.spot) {
                    annomatic.err('Annotation spot and range do not match!! :((');
                } else {
                    annomatic.log('Annotation spot and range match!! :))');

                    // create item from spot (text fragment)
                    var item = TextFragmentHandler.createItemFromRange(range);
                    ItemsExchange.addItemToContainer(item, annomatic.options.container);

                    validAnnotations.push({
                        ann: ann,
                        frUri: item.uri
                    });

                    // create item from resource 
                    ItemsExchange.addItemToContainer(createItemFromGramsciAnnotation(ann), annomatic.options.container);
                }

            }

        } // end for annotations

        var oldAnnotationNumber = annomatic.annotationNumber;
        annomatic.annotationNumber += validAnnotations.length;
        annomatic.currAnn = 0;

        // cycle over the valid annotations (range and spot match)
        // and update the state
        for (i=0; i<validAnnotations.length; i++) {

            var currentIndex = i + oldAnnotationNumber;
            var ann = validAnnotations[i].ann;

            annomatic.ann.byNum[currentIndex] = ann;
            annomatic.ann.numToUriMap[currentIndex] = validAnnotations[i].frUri;
            annomatic.ann.uriToNumMap[validAnnotations[i].frUri] = currentIndex;
            annomatic.ann.byUri[validAnnotations[i].frUri] = ann;
        }

        analyze(oldAnnotationNumber, annomatic.annotationNumber);

    };

    return annomatic;
});