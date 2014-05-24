angular.module('Pundit2.Annotators')
.constant('XPOINTERSHELPERDEFAULTS', {
    // The helper will use these node name and node classes to
    // wrap the consolidated DOM fragments. TextFragmentAnnotator and Handler
    // use these values too.
    wrapNodeName: 'span',
    wrapNodeClass: 'pnd-cons',

    // Added by TextFragmentIcon directive, ignored when building xpointers
    textFragmentIconClass: "pnd-text-fragment-icon",

    // Nodes with these classes will be ignored when building xpointers
    // and consolidating annotations. Add here any other UI element class which
    // is not considered in the isConsolidationNode() method. wrapNodeClass and
    // textFragmentIconClass are already considered.
    consolidationClasses: [],

    // Classes to assign to named content elements to have them recognized by Pundit
    namedContentClasses: ['pundit-content']

})
.config(function($locationProvider) {
    $locationProvider.html5Mode(true);
})
.service('XpointersHelper', function(XPOINTERSHELPERDEFAULTS, NameSpace, BaseComponent,
                                     $document, $location, $window) {

    var xp = new BaseComponent('XpointersHelper', XPOINTERSHELPERDEFAULTS);

    xp.getXPathsFromXPointers = function(xpArray) {
        var xpointers = [],
            xpaths = {};

        for (var i=xpArray.length-1; i>=0; i--) {
            var xpointer = xpArray[i],
                obj = xp.xPointerToXPath(xpointer);

            if (xp.isValidXpointer(xpointer)) {
                xpaths[xpointer] = obj;
                xpointers.push(xpointer);
            } else {
                // TODO: here we could pass back the list of invalid xpointers, but they
                // should have been checked already by consolidation .. BEFORE the consolidation
                // process actually starts .... !
                xp.err("Invalid xpointer passed to getXPathsFromXPointers: THIS SHOULD NOT HAPPEN!", xpointer);
            }
        } // for i

        return xpaths;

    }; // getXPathsFromXPointers()

    xp.isValidXpointerURI = function(xpointer) {
        if (xpointer.match(/#xpointer\(start-point\(string-range\(/) === null || xpointer.match(/range-to\(string-range\(/) === null) {
            return false;
        }
        // TODO: a better regexp? :)
        return true;
    };

    // Returns true if the xpointer is consolidable on the document, now
    xp.isValidXpointer = function(xpointer) {
        if (!xp.isValidXpointerURI(xpointer)) {
            return false;
        }

        var xpaths = xp.xPointerToXPath(xpointer);
        return xp.isValidRange(xpaths.startNode, xpaths.startOffset, xpaths.endNode, xpaths.endOffset);
    };

    xp.xPointerToXPath = function(xpointer) {
        var splittedString,
            ret = {},
            foo;

        if (!xp.isValidXpointerURI(xpointer)) {
            xp.log("xPointerToXPath() Invalid xpointer! ", xpointer);
            return {
                startNode: null,
                startOffset: null,
                endNode: null,
                endOffset: null,
                valid: false
            };
        }

        // Split the xpointer two times, to extract a string
        // like //xpath1[n1],'',o1,//xpath2[n2],'',o2
        // where o1 and o2 are the offsets
        splittedString = xpointer.split("#xpointer(start-point(string-range(")[1].split("))/range-to(string-range(");

        // Then extract xpath and offset of the starting point
        foo = splittedString[0].split(",'',");
        ret.startXpath = foo[0];
        ret.startOffset = foo[1];

        // .. and of the ending point of the xpointer
        foo = splittedString[1].substr(0, splittedString[1].length - 3).split(",'',");
        ret.endXpath = foo[0];
        ret.endOffset = foo[1];

        ret.startNode = xp.getNodeFromXpath(ret.startXpath);
        ret.endNode = xp.getNodeFromXpath(ret.endXpath);

        return ret;
    };


    // Returns the DOM Node pointed by the xpath. Quite confident we can always get the
    // first result of this iteration, the second should give null since we dont use general
    // purpose xpaths
    xp.getNodeFromXpath = function(xpath) {
        var self = this,
            iterator;
        iterator = $document[0].evaluate(xpath, $document[0], null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);

        return iterator.singleNodeValue;
    };

    // TODO: Works only on non-consolidated dom .. ?
    xp.isValidRange = function(startNode, startOffset, endNode, endOffset) {
        try {
            var r = $document[0].createRange();
            r.setStart(startNode, startOffset);
            r.setEnd(endNode, endOffset);
            return true;
        } catch (e) {
            return false;
        }
    };


    // Will return an array of sorted and unique xpaths, using objects with
    // properties: xpointer, xpath, offset, range
    xp.splitAndSortXPaths = function(xpaths) {
        // We just need a starting point to sort the xpaths, taking the first node and use
        // an end_by_end comparison will do the job
        var startNode = xp.getNodeFromXpath('//body'),
            x = [], ret = [];

        // For every xpointer we create 2 entries in the array: one for starting xpath
        // and one for the ending one
        for (var xpointer in xpaths) {

            // Push an element for the starting xpath+offset
            var rangeStart = $document[0].createRange(),
                node = xp.getNodeFromXpath(xpaths[xpointer].startXpath);
            rangeStart.setStart(startNode, 0);
            rangeStart.setEnd(node, xpaths[xpointer].startOffset);

            x.push({
                xpointer: xpointer,
                xpath: xpaths[xpointer].startXpath,
                offset: xpaths[xpointer].startOffset,
                range: rangeStart
            });

            // Another time for the ending xpath+offset
            var rangeEnd = $document[0].createRange();
            node = xp.getNodeFromXpath(xpaths[xpointer].endXpath);
            rangeEnd.setStart(startNode, 0);
            rangeEnd.setEnd(node, xpaths[xpointer].endOffset);

            x.push({
                xpointer: xpointer,
                xpath: xpaths[xpointer].endXpath,
                offset: xpaths[xpointer].endOffset,
                range: rangeEnd
            });

        } // for xpointer in self.xpaths

        // Sort this array, using a custom function which compares the end
        // points of the ranges in the passed object
        x.sort(function (a, b) {
            return a.range.compareBoundaryPoints(Range.END_TO_END, b.range);
        });

        // Erase doubled entries: they are sorted, just avoid copying the next
        // element if it's equal to the current one
        ret[0] = x[0];
        for (var i=1, j=0, len=x.length; i<len; i++)
            if (x[i].xpath != ret[j].xpath || x[i].offset != ret[j].offset)
                ret[++j] = x[i];

        return ret;
    }; // splitAndSortXPaths()


    xp.getClassesForXpaths = function(xpointers, sortedXpaths, xpaths, xpointersClasses) {
        var realXps = [],
            htmlClasses = [];

        // Iterate through the sortedXpaths from 1st to Nth and accumulate
        // the active classes, looking at what xpointers are starting and
        // ending in the current xpath position
        for (var i=0; i<sortedXpaths.length-1; i++) {
            
            var start = sortedXpaths[i],
                end = sortedXpaths[i+1],
                addXps = xp.getStartingXPs(xpointers, xpaths, start.xpath, start.offset),
                remXps = xp.getEndingXPs(xpointers, xpaths, start.xpath, start.offset);
                
            realXps = addToArray(realXps, addXps);
            realXps = removeFromArray(realXps, remXps);

            var classes = [];
            for (var j=realXps.length - 1; j>=0; j--) {
                var x = realXps[j];
                for (var k = xpointersClasses[x].length - 1; k >= 0; k--){
                    classes.push(xpointersClasses[x][k]);
                }
            }
            htmlClasses[i+1] = classes;

        } // for i

        return htmlClasses;
    }; // getClassesForNewXpointers()

    var addToArray = function(arr, add) {
        return arr.concat(add);
    };

    // Removes the rem[] elements from arr[]
    var removeFromArray = function(arr, rem) {
        var ret = [];
        for (var i = arr.length - 1; i >= 0; i--) 
            if (rem.indexOf(arr[i]) === -1)
                ret.push(arr[i]);
        return ret;
    };

    // Given an xpath/offset couple, returns all of the xpointers
    // which starts there
    xp.getStartingXPs = function(xpointers, xpaths, xpath, offset) {
        var ret = [];
            
        for (var i=xpointers.length-1; i>=0; i--) {
            var x = xpointers[i];
            if (xpaths[x].startXpath === xpath && xpaths[x].startOffset === offset)
                ret.push(x);
        }
        return ret;
    };

    // Given an xpath/offset couple, returns all of the xpointers
    // which ends there
    xp.getEndingXPs = function(xpointers, xpaths, xpath, offset) {
        var ret = [];
            
        for (var i=xpointers.length-1; i>=0; i--) {
            var x = xpointers[i];
            if (xpaths[x].endXpath === xpath && xpaths[x].endOffset === offset) 
                ret.push(x);
        }
        return ret;
    };

    // Wraps all of the calculated xpaths with some htmltag and the computed
    // classes
    xp.updateDOM = function(sortedXpaths, htmlClass, xpathsFragmentIds) {

        for (var i=sortedXpaths.length-1; i>0; i--) {
            var start = sortedXpaths[i-1],
                end = sortedXpaths[i];
                
            if (xpathsFragmentIds[i].length > 0) {
                xp.log("## Updating DOM, xpath "+i+": "+xpathsFragmentIds[i].join(" "));
                xp.wrapXPaths(start, end, xp.options.wrapNodeName, htmlClass, xpathsFragmentIds[i]);
            }
        }
        xp.log("Dom successfully updated!");
    }; // updateDOM()


    // Wrap the range from startXp to endXp (two xpaths custom objects) with
    // the given tag _tag and html class _class. Will build a range for those
    // 2 xpaths, and starting from the range's commonAncestorContainer, will
    // wrap all of the contained elements
    xp.wrapXPaths = function(startXp, endXp, _tag, _class, _parents) {
        var htmlTag = _tag || xp.options.wrapNodeName,
            htmlClass = _class || xp.options.wrapNodeClass,
            parents = _parents || [],
            range = $document[0].createRange(),
            startNode = xp.getNodeFromXpath(startXp.xpath),
            endNode = xp.getNodeFromXpath(endXp.xpath);

        // If start and end xpaths dont have a node number [N], we
        // are wrapping the Mth=offset child of the given node
        if (!startXp.xpath.match(/\[[0-9]+\]$/) && !endXp.xpath.match(/\[[0-9]+\]$/)) {
            range.selectNode(startNode.childNodes[startXp.offset]);
        } else {

            // If it's not a textnode, set the start (or end) before (or after) it
            if (!xp.isElementNode(startNode))
                range.setStart(startNode, startXp.offset);
            else
                range.setStart(startNode, startXp.offset);

            if (!xp.isElementNode(endNode))
                range.setEnd(endNode, endXp.offset);
            else
                range.setEndAfter(endNode);
        }

        // Wrap the nearest element which contains the entire range
        xp.wrapElement(range.commonAncestorContainer, range, htmlTag, htmlClass, parents);

    }; // wrapXPath

    // Wraps childNodes of element, only those which stay inside
    // the given range
    xp.wrapElement = function(element, range, htmlTag, htmlClass, parents) {
        // If there's childNodes, wrap them all
        if (element.childNodes && element.childNodes.length > 0) {
            for (var i = (element.childNodes.length - 1); i >= 0 && element.childNodes[i]; i--)
                xp.wrapElement(element.childNodes[i], range, htmlTag, htmlClass, parents);

            // Else it's a leaf: if it's a valid text node, wrap it!
        } else if (xp.isTextNodeInsideRange(element, range)) {
            xp.wrapNode(element, range, htmlTag, htmlClass, parents);
            // MORE Else: it's an image node.. wrap it up
        } else if (xp.isImageNodeInsideRange(element, range)) {
            xp.wrapNode(element, range, htmlTag, htmlClass, parents);
        }

    }; // wrapElement()

        // Triple node check: will pass if it's a text node, if it's not
        // empty and if it is inside the given range
    xp.isTextNodeInsideRange = function(node, range) {
        var content;

        // Check: it must be a text node
        if (node.nodeType !== Node.TEXT_NODE)
            return false;

        // Check: the content must not be empty
        content = node.textContent.replace(/ /g, "").replace(/\n/, "");
        if (!node.data || content === "" || content === " ")
            return false;

        // Finally check if it's in the range
        return xp.isNodeInsideRange(node, range)
    };
    xp.isImageNodeInsideRange = function(node, range) {
        // Check: it must be an element node
        if (node.nodeType !== Node.ELEMENT_NODE)
            return false;

        // Check: it must be an img
        if (node.tagName.toLowerCase() !== 'img')
            return false;

        return xp.isNodeInsideRange(node, range)
    };

    // Will check if the given node interesecates the given range somehow
    xp.isNodeInsideRange = function(node, range) {
        var nodeRange = $document[0].createRange();
        try {
            nodeRange.selectNode(node);
        } catch (e) {
            nodeRange.selectNodeContents(node);
        }
        if (range.compareBoundaryPoints(Range.END_TO_START || 3, nodeRange) != -1 ||
            range.compareBoundaryPoints(Range.START_TO_END || 1, nodeRange) != 1) {
            return false;
        }
        return true;
    };

    // Will wrap a node (or part of it) with the given htmlTag. Just part of it when it's
    // on the edge of the given range and the range starts (or ends) somewhere inside it
    xp.wrapNode = function(element, range, htmlTag, htmlClass, parents) {
        var r2 = $document[0].createRange();

        // Select correct sub-range: if the element is the start or end container of the range
        // set the boundaries accordingly: if it's startContainer use it's start offset and set
        // the end offset to element length. If it's endContainer set the start offset to 0
        // and the endOffset from the range.
        if (element === range.startContainer || element === range.endContainer) {
            r2.setStart(element, (element === range.startContainer) ? range.startOffset : 0);
            r2.setEnd(element, (element === range.endContainer) ? range.endOffset : element.length);

            // Otherwise just select the entire node, and wrap it up
        } else
            r2.selectNode(element);

        // Finally surround the range contents with an ad-hoc crafted html element
        r2.surroundContents(xp.createWrapNode(htmlTag, htmlClass, parents));
    }; // wrapNode()

    // Creates an HTML element to be used to wrap (usually a span?) adding the given
    // classes to it
    xp.createWrapNode = function(htmlTag, htmlClass, parents) {
        var element = $document[0].createElement(htmlTag);
        angular.element(element).addClass(htmlClass);

        // TODO: make this directive name configurable??
        angular.element(element).attr('text-fragment-bit', '');
        // Parent fragment ids both in fragments attribute and in classes. First used to
        // pass them back to the TextFragmentAnnotator service, the second to being able
        // to retrieve the last of them with a css selector to place the icon
        angular.element(element).attr('fragments', parents.join(','));
        angular.element(element).addClass(parents.join(' '));
        return element;
    };

    // Merges text nodes: when unwrapping consolidated fragments we are splitting the original
    // text nodes in multiple nodes. Merging them together should get us the very same DOM we
    // started with before the consolidation.
    xp.mergeTextNodes = function(node) {

        if (!node) {
            return;
        }

        if ((typeof(node.childNodes) !== "undefined") && (node.childNodes.length > 0)) {
            var i = node.childNodes.length - 1;

            var child, sibling;
            while (child = node.childNodes[i--]) {
                if (xp.isTextNode(child) && (sibling = node.childNodes[i]) && xp.isTextNode(sibling)) {
                    sibling.nodeValue = sibling.nodeValue + child.nodeValue;
                    node.removeChild(child);
                } else if (xp.isElementNode(child)) {
                    xp.mergeTextNodes(child);
                }
            }
        }

    }; // mergeTextNodes()


    xp.isTextNode = function(node) {
        return node.nodeType === Node.TEXT_NODE;
    };

    xp.isElementNode = function(node) {
        return node.nodeType === Node.ELEMENT_NODE;
    };

    // Returns true if the node is a wrap node, added by the consolidation
    xp.isWrapNode = function(node) {

        // Not an element node.. return false
        if (!xp.isElementNode(node)) {
            return false;
        }

        // If the node name is wrong.. return false
        if (node.nodeName.toUpperCase() !== xp.options.wrapNodeName.toUpperCase()) {
            return false;
        }

        // It is an element, with the right name: if it has the wrap class, it is a wrap node!
        if (angular.element(node).hasClass(xp.options.wrapNodeClass)) {
            return true;
        }

        return false;
    }; // isWrapNode()

    // Returns true if the given node is a tag which should be ignored while building xpointers,
    // like an UI icon (my items? more?), or a wrapped node class
    xp.isConsolidationNode = function(node) {

        if (!xp.isElementNode(node)) {
            return false;
        }

        var toIgnore = [xp.options.textFragmentIconClass, xp.options.wrapNodeClass];
        toIgnore = toIgnore.concat(xp.options.consolidationClasses);

        for (var i = toIgnore.length; i--;) {
            if (angular.element(node).hasClass(toIgnore[i])) {
                return true;
            }
        }

        return false;
    }; // isConsolidationNode()

    xp.isWrappedTextNode = function(node) {
        if (!xp.isWrapNode(node)) {
            return false;
        }

        if (!xp.isTextNode(node.firstChild)) {
            return false;
        }

        return true;
    };

    xp.isWrappedElementNode = function(node) {

        if (!xp.isWrapNode(node)) {
            return false;
        }

        if (!xp.isElementNode(node.firstChild)) {
            return false;
        }

        return true;
    };

    xp.isNamedContentNode = function (node) {

        if (!xp.isElementNode(node)) {
            return false;
        }

        var c = xp.options.namedContentClasses;
        for (var i = c.length; i--;) {
            if (angular.element(node).hasClass(c[i])) {
                return true;
            }
        }

        return false;
    };

    xp.isUIButton = function(node) {

        if (!xp.isElementNode(node)) {
            return false;
        }

        if (angular.element(node).hasClass(xp.options.textFragmentIconClass)) {
            return true;
        }

        return false;
    };


    // TODO: Maybe this belongs somewhere else .. need to refactor a bit of
    //       TextFragmentHandler service ....
    // Gets a safe page context, stripping out pundit-related query parameters
    xp.getSafePageContext = function() {
        var uri = $window.location.href,
            fragment, query, queryObject;

        // If there's a fragment, save it and remove it from the uri
        if (uri.indexOf("#") !== -1) {
            fragment = uri.substring(uri.indexOf("#") + 1, uri.length);
            uri = uri.substring(0, uri.indexOf("#"));
        }

        // If there's a query, decode it and remove it from the uri. Look for the
        // pundit-show parameter and strips it out
        // TODO: "pundit-show" should be configurable ... ?
        if (uri.indexOf("?") !== -1) {
            query = uri.substring(uri.indexOf("?") + 1, uri.length);
            uri = uri.substring(0, uri.indexOf("?"));

            queryObject = $location.search();
            delete queryObject['pundit-show'];

            var queryArray = [];
            for (var p in queryObject) {
                queryArray.push(p + "=" + queryObject[p]);
            }
            query = queryArray.join("&");
        }

        // Build back the URI
        if (query) uri += '?' + query;
        if (fragment) uri += '#' + fragment;

        return uri;
    };



    xp.log("Component up and running");
    return xp;
});