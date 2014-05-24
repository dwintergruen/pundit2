angular.module('Pundit2.Annotators')
    .constant('TEXTFRAGMENTHANDLERDEFAULTS', {
        ignoreClasses: ['pnd-ignore'],
        removeSelectionOnAbort: true
    })
    .service('TextFragmentHandler', function(TEXTFRAGMENTHANDLERDEFAULTS, NameSpace, BaseComponent,
                                             ContextualMenu, XpointersHelper,
                                             $document) {

        var tfh = new BaseComponent('TextFragmentHandler', TEXTFRAGMENTHANDLERDEFAULTS);

        $document.on('mousedown', function(downEvt) {

            // In any case, hide the contextual menu on mouse down
            ContextualMenu.hide();

            var target = downEvt.target;
            if (isToBeIgnored(target)) {
                tfh.log('ABORT: ignoring mouse DOWN event on document: ignore class spotted.');
                if (tfh.options.removeSelectionOnAbort) {
                    downEvt.preventDefault();
                }
                return;
            }

            $document.on('mouseup', mouseUpHandler);
            tfh.log('Selection started on document, waiting for mouse up.');
        });

        var mouseUpHandler = function(upEvt) {

            $document.off('mouseup', mouseUpHandler);

            var target = upEvt.target;
            if (isToBeIgnored(target)) {
                tfh.log('ABORT: ignoring mouse UP event on document: ignore class spotted.');
                removeSelection();
                return;
            }

            var range = tfh.getSelectedRange();
            if (range === null) {
                removeSelection();
                return;
            }

            // Check every node contained in this range: if we select something inside the
            // same text node the length will be 0: everything is ok. Otherwise check that
            // every contained node must not be ignored
            var nodes = range.cloneContents().querySelectorAll("*"),
                nodesLen = nodes.length;
            while (nodesLen--) {
                if (isToBeIgnored(nodes[nodesLen])) {
                    tfh.log('ABORT: ignoring range: ignore class spotted inside it, somewhere.');
                    removeSelection();
                    return;
                }
            }

            tfh.log('Selection ended on document. DIRTY range: ', range);

            var xp = range2xpointer(range);
            console.log('### XPOINTER !!!!1!!!1! ', xp);

        };

        // Gets the user's selected range on the page, checking if it's valid.
        // Will return a DIRTY range: a valid range in the current DOM the user
        // is viewing and interacting with
        tfh.getSelectedRange = function() {
            var doc = $document[0],
                range;

            if (doc.getSelection().rangeCount === 0) {
                tfh.log("getSelection().rangeCount is 0: no selected range.");
                return null;
            }

            range = doc.getSelection().getRangeAt(0);

            // If the selected range is empty (this happens when the user clicks on something)...
            if  (range !== null &&
                range.startContainer === range.endContainer &&
                range.startOffset === range.endOffset) {

                tfh.log("Range is not null, but start/end containers and offsets match: no selected range.");
                return null;
            }

            tfh.log("GetSelectedRange returning a DIRTY range: "+
                range.startContainer.nodeName+"["+range.startOffset+"] > "+
                range.endContainer.nodeName+"["+range.endOffset+"]");

            return range;
        }; // getSelectedRange()

        // If configured to do so, removes the user's selection from the browser
        var removeSelection = function() {
            if (tfh.options.removeSelectionOnAbort) {
                $document[0].getSelection().removeAllRanges();
            }
        };

        // Checks if the node (or any parent) is a node which needs to be ignored
        var isToBeIgnored = function(node) {
            var classes = tfh.options.ignoreClasses,
                ignoreLen = classes.length;

            // Traverse every parent and check if it has one of the classes we
            // need to ignore. As soon as we find one, return true: must ignore.
            while (node.nodeName.toLowerCase() !== 'body') {
                for (var i=ignoreLen; i--;) {
                    if (angular.element(node).hasClass(classes[i])) {
                        return true;
                    }
                }

                // If there's no parent node .. even better, we didnt find anything wrong!
                if (node.parentNode === null) {
                    return false;
                }
                node = node.parentNode;
            }
            return false;
        };

        // Takes a (dirty) range and returns a clean xpointer:
        // - translate a dirty range into a clean one
        // - correct any wrong number inside xpaths (node number, offsets)
        // - build the xpointer starting from a named content, if present
        // - build the xpointer strings
        var range2xpointer = function(dirtyRange) {
            var cleanRange = dirtyRange2cleanRange(dirtyRange),
                cleanStartXPath = correctXPathFinalNumber(calculateCleanXPath(cleanRange.startContainer), cleanRange.cleanStartNumber),
                cleanEndXPath = correctXPathFinalNumber(calculateCleanXPath(cleanRange.endContainer), cleanRange.cleanEndNumber),
                xpointerURL = getContentURLFromXPath(cleanStartXPath),
                xpointer = getXPointerString(xpointerURL, cleanStartXPath, cleanRange.startOffset, cleanEndXPath, cleanRange.endOffset);

            tfh.log("range2xpointer returning an xpointer: "+xpointer);

            return xpointer;
        }; // range2xpointer

        var getXPointerString = function(startUrl, startXPath, startOffset, endXPath, endOffset) {
            return startUrl + "#xpointer(start-point(string-range(" + startXPath + ",''," + startOffset + "))"
                + "/range-to(string-range(" + endXPath + ",''," + endOffset + ")))";
        };

        // Will get a clean Range out of a dirty range: skipping nodes
        // added by the annotation library (ignore nodes) and recalculate
        // offsets if needed
        var dirtyRange2cleanRange = function(range) {

            var cleanRange = {};

            tfh.log("dirty2cleanRange DIRTY: "+
                range.startContainer.nodeName+"["+range.startOffset+"] > "+
                range.endContainer.nodeName+"["+range.endOffset+"]");

            var cleanStart = calculateCleanOffset(range.startContainer, range.startOffset),
                cleanEnd = calculateCleanOffset(range.endContainer, range.endOffset);

            cleanRange.startContainer = cleanStart.cleanContainer;
            cleanRange.startOffset = cleanStart.cleanOffset;

            cleanRange.endContainer = cleanEnd.cleanContainer;
            cleanRange.endOffset = cleanEnd.cleanOffset;

            cleanRange.cleanStartNumber = calculateCleanNodeNumber(cleanRange.startContainer);
            cleanRange.cleanEndNumber = calculateCleanNodeNumber(cleanRange.endContainer);

            tfh.log("dirty2cleanRange CLEAN: "+
                cleanRange.startContainer.nodeName+"["+cleanRange.startOffset+"] > "+
                cleanRange.endContainer.nodeName+"["+cleanRange.endOffset+"]");

            console.log('Clean range ', cleanRange);

            return cleanRange;
        }; // dirtyRange2cleanRange()

        // The offset is the node number or, more often, the character index inside a text node,
        // used in xpointers along with xpaths to point a specific dom position.
        // If the text nodes are split, we need to correct it. If consolidation added nodes,
        // we need to check if they must be skipped
        var calculateCleanOffset = function(dirtyContainer, dirtyOffset) {
            var xp = XpointersHelper,
                parentNode = dirtyContainer.parentNode,
                currentNode, node, offset;

            // It's an element and it's not added by consolidation, everything is good
            if (xp.isElementNode(dirtyContainer) && !xp.isConsolidationNode(dirtyContainer)) {
                return { cleanContainer: dirtyContainer, cleanOffset: dirtyOffset };
            }

            // The container is a text node and the parent is added by consolidation,
            // recur into parent and let's start the offset dance
            if (xp.isTextNode(dirtyContainer) && xp.isWrapNode(parentNode)) {
                node = parentNode;
            } else {
                node = dirtyContainer;
            }

            // Iterate over previous siblings (to the left of this current node) and calculate
            // the right offset. We start from the dirty one
            offset = dirtyOffset;
            while (currentNode = node.previousSibling) {

                // If the node is not added by consolidation but it's an element, we're done
                if (!xp.isConsolidationNode(currentNode) && xp.isElementNode(currentNode) && !xp.isWrapNode(currentNode)) {
                    if (xp.isTextNode(dirtyContainer) && xp.isWrapNode(parentNode)) {
                        return { cleanContainer: dirtyContainer, cleanOffset: offset };
                    } else {
                        return { cleanContainer: node, cleanOffset: offset };
                    }
                }

                // If not, keep going on the offset and go to next sibling
                if (xp.isTextNode(currentNode)) {
                    offset += currentNode.length;
                } else if (xp.isWrapNode(currentNode)) {
                    offset += currentNode.firstChild.length;
                }

                node = currentNode;
            } // while currentNode

            // We iterated over every sibling, we now have the correct offset
            if (XpointersHelper.isTextNode(dirtyContainer) && XpointersHelper.isWrapNode(parentNode)) {
                return { cleanContainer: dirtyContainer, cleanOffset: offset };
            } else {
                return { cleanContainer: node, cleanOffset: offset };
            }
        }; // calculateCleanOffset()


        // Ugly names but at least useful, complicate conditions to check if we need
        // to skip or count the current node
        var check1 = function(currentNode) {
            return XpointersHelper.isTextNode(currentNode) ||
                XpointersHelper.isWrappedTextNode(currentNode) ||
                XpointersHelper.isUIButton(currentNode);
        };

        var check2 = function(lastNode) {
            return XpointersHelper.isElementNode(lastNode) &&
            !XpointersHelper.isUIButton(lastNode) &&
            !XpointersHelper.isWrappedTextNode(lastNode);
        };

        // The node number in an xpath /DIV[1]/P[2]/text()[16] is the number in []. It just counts
        // the number of such nodes. If the DOM is consolidated (dirty) though, we need to skip
        // those nodes and recalculate such number. Especially for text nodes, which gets
        // very likely split into more nodes, we need to count them and come out with the number
        // it would be if the DOM was clean.
        var calculateCleanNodeNumber = function(node) {
            var currentNode,
                cleanN = 1,
                xp = XpointersHelper,
                nodeName = getXPathNodeName(node),
                parentNode = node.parentNode,
                lastNode = (xp.isWrapNode(parentNode)) ? parentNode : node;

            if (xp.isTextNode(node)) {

                // If it's a text node: skip ignore nodes, counting text/element nodes
                while (currentNode = lastNode.previousSibling) {
                    if (check1(currentNode) && (check2(lastNode) || xp.isWrappedElementNode(lastNode))) {
                        cleanN++;
                    }
                    lastNode = currentNode;
                } // while current_node
            } else {

                // If it's an element node, count the siblings skipping consolidation nodes
                while (currentNode = lastNode.previousSibling) {
                    if (getXPathNodeName(currentNode) === nodeName && !xp.isConsolidationNode(currentNode)) {
                        cleanN++;
                    }
                    lastNode = currentNode;
                }
            }

            return cleanN;
        }; // calculateCleanNodeNumber()

        // To build a correct xpath, text nodes must be called text()
        var getXPathNodeName = function(node) {
            if (XpointersHelper.isTextNode(node)) {
                return "text()";
            } else {
                return node.nodeName.toUpperCase();
            }
        };

        var correctXPathFinalNumber = function(xpath, cleanNumber) {
            return xpath.replace(/\[[0-9]+\]$/, '['+cleanNumber+']');
        };

        // Builds a clean xpath: given a node will traverse the DOM (parents and siblings)
        // skipping consolidation nodes to produce an xpath which is valid in a clean DOM.
        var calculateCleanXPath = function(node, partialXpath) {

            // No node given? We recurred here with a null parent:
            // the xpath is ready!
            var parentNode = node.parentNode;
            if (!node) {
                return partialXpath;
            }

            var xp = XpointersHelper,
                nodeName = getXPathNodeName(node);

            // We reached a named content, we can build the resulting xpath using it as
            // the starting point
            if (xp.isNamedContentNode(node)) {
                if (typeof(partialXpath) !== 'undefined') {
                    return "//DIV[@about='" + angular.element(node).attr('about') + "']/" + partialXpath;
                } else {
                    return "//DIV[@about='" + angular.element(node).attr('about') + "']";
                }
            }

            // .. or if we reach body or html (!!!), start building it from this node
            if (nodeName === 'BODY' || nodeName === 'HTML') {
                if (typeof(partialXpath) !== 'undefined') {
                    return "//BODY/" + partialXpath;
                } else {
                    return "//BODY";
                }
            }

            // Skip wrap nodes into the final XPath!
            if (xp.isWrapNode(node)) {
                return calculateCleanXPath(node.parentNode, partialXpath);
            }

            var sibling,
                num = 1,
                currentNode = node;
            // If it's not a text node, and there's a siblings with the same
            // nodeName, accumulate their number
            if (!xp.isTextNode(currentNode)) {
                while (sibling = currentNode.previousSibling) {
                    if (getXPathNodeName(sibling) === nodeName && !xp.isConsolidationNode(sibling)) {
                        num++;
                    }
                    currentNode = sibling;
                }
            }

            // Accumulate the xpath for this node
            if (typeof(partialXpath) !== 'undefined') {
                partialXpath = nodeName + "[" + num + "]/" + partialXpath;
            } else {
                partialXpath = nodeName + "[" + num + "]";
            }

            // .. and recur into its parent
            return calculateCleanXPath(parentNode, partialXpath);
        }; // calculateCleanXPath


        // Extracts the URL of the named content node used in the xpath, or
        // gives window location
        var getContentURLFromXPath = function(xpath) {
            var contentUrl = XpointersHelper.getSafePageContext(),
                // TODO: make this attribute configurable in XpointersHelper ?
                index = xpath.indexOf('DIV[@about=\''),
                tagName = "about";

            // The given xpath points to a node outside of any @about described node:
            // return window location without its anchor part
            if (index === -1) {
                return (contentUrl.indexOf('#') !== -1) ? contentUrl.split('#')[0] : contentUrl;
            }

            // It is a named content tag: get the URL contained in the @about attribute
            if (index < 3) {
                var urlStart = index + 7 + tagName.length,
                    pos = xpath.indexOf('_text\']'),
                    urlLength = ((pos !== -1) ? xpath.indexOf('_text\']') : xpath.indexOf('\']')) - urlStart;

                return xpath.substr(urlStart, urlLength);
            }

            // We found too many div[@about= ... whaaaaat?
            tfh.log('ERROR: getContentURLFromXPath returning something weird? xpath = '+xpath);
            return '';
        }; // getContentURLFromXPath()

        tfh.log('Component up and running');
    });
