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

        var range2xpointer = function(dirtyRange) {
            var cleanRange = dirtyRange2cleanRange(dirtyRange);


            var cleanStartXPath = correctXPathFinalNumber(calculateCleanXPath(cleanRange.startContainer), cleanRange.cleanStartNumber),
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

        var calculateCleanOffset = function(dirtyContainer, dirtyOffset) {
            var currentNode,
                node = dirtyContainer,
                parentNode = node.parentNode,
                offset = dirtyOffset;

            if (XpointersHelper.isElementNode(dirtyContainer) && !XpointersHelper.isIgnoreNode(dirtyContainer)) {
                return {
                    cleanContainer: node,
                    cleanOffset: offset
                };
            }

            if (XpointersHelper.isTextNode(dirtyContainer) && XpointersHelper.isWrapNode(parentNode)) {
                node = parentNode;
            }

            while (currentNode = node.previousSibling) {
                if (!XpointersHelper.isIgnoreNode(currentNode) && XpointersHelper.isElementNode(currentNode) && !XpointersHelper.isWrapNode(currentNode)) {
                    if (XpointersHelper.isTextNode(dirtyContainer) && XpointersHelper.isWrapNode(parentNode)) {
                        return {
                            cleanContainer: dirtyContainer,
                            cleanOffset: offset
                        };
                    } else {
                        return {
                            cleanContainer: node,
                            cleanOffset: offset
                        };
                    }
                }

                if (XpointersHelper.isTextNode(currentNode)) {
                    offset += currentNode.length;
                } else if (XpointersHelper.isWrapNode(currentNode)) {
                    offset += currentNode.firstChild.length;
                }

                node = currentNode;
            } // while currentNode

            if (XpointersHelper.isTextNode(dirtyContainer) && XpointersHelper.isWrapNode(parentNode)) {
                return {
                    cleanContainer: dirtyContainer,
                    cleanOffset: offset
                };
            } else {
                return {
                    cleanContainer: node,
                    cleanOffset: offset
                };
            }
        }; // calculateCleanOffset()


        var calculateCleanNodeNumber = function(node) {
            var cleanN,
                nodeName = getXPathNodeName(node),
                parentNode = node.parentNode,
                currentNode,
                lastNode = (XpointersHelper.isWrapNode(parentNode)) ? parentNode : node;

            if (XpointersHelper.isTextNode(node)) {

                // If it's a text node: skip ignore nodes, count text/element nodes
                cleanN = 1;
                while (currentNode = lastNode.previousSibling) {
                    // TODO: this if is the ugliest if on earth :|
                    if (
                        (
                            XpointersHelper.isTextNode(currentNode) ||
                            XpointersHelper.isWrappedTextNode(currentNode) ||
                            XpointersHelper.isUIButton(currentNode)
                        ) &&
                        (
                            (
                                XpointersHelper.isElementNode(lastNode) &&
                                !XpointersHelper.isUIButton(lastNode) &&
                                !XpointersHelper.isWrappedTextNode(lastNode)
                            )
                            || XpointersHelper.isWrappedElementNode(lastNode)
                        )
                    ) {
                        cleanN++;
                    }

                    lastNode = currentNode;
                } // while current_node
            } else {
                // If it's an element node, count the siblings skipping ignore nodes
                cleanN = 1;
                while (currentNode = lastNode.previousSibling) {
                    if (getXPathNodeName(currentNode) === nodeName && !XpointersHelper.isIgnoreNode(currentNode)) {
                        cleanN++;
                    }
                    lastNode = currentNode;
                }
            }

            return cleanN;
        }; // calculateCleanNodeNumber()

        var getXPathNodeName = function(node) {
            if (XpointersHelper.isTextNode(node)) {
                return "text()";
            } else {
                return node.nodeName.toUpperCase();
            }
        };

        var correctXPathFinalNumber = function(xpath, clean_number) {
            return xpath.replace(/\[[0-9]+\]$/, '['+clean_number+']');
        };

        var calculateCleanXPath = function(node, partialXpath) {

            // No node given? We recurred here with a null parent:
            // the xpath is ready!
            var parentNode = node.parentNode;
            if (!node) {
                return partialXpath;
            }

            var nodeName = getXPathNodeName(node);

            if (XpointersHelper.isNamedContentNode(node)) {
                if (typeof(partialXpath) !== 'undefined') {
                    return "//DIV[@about='" + angular.element(node).attr('about') + "']/" + partialXpath;
                } else {
                    return "//DIV[@about='" + angular.element(node).attr('about') + "']";
                }
            }

            if (nodeName === 'BODY' || nodeName === 'HTML') {
                if (typeof(partialXpath) !== 'undefined') {
                    return "//BODY/" + partialXpath;
                } else {
                    return "//BODY";
                }
            }


            // Skip wrap nodes into the final XPath!
            if (XpointersHelper.isWrapNode(node)) {
                return calculateCleanXPath(node.parentNode, partialXpath);
            }

            var num = 1,
                current_node = node;
            if (!XpointersHelper.isTextNode(current_node)) {
                while (sibling = current_node.previousSibling) {
                    if (getXPathNodeName(sibling) === nodeName && !XpointersHelper.isIgnoreNode(sibling)) {
                        num++;
                    }
                    current_node = sibling;
                }
            }

            if (typeof(partialXpath) !== 'undefined') {
                partialXpath = nodeName + "[" + num + "]/" + partialXpath;
            } else {
                partialXpath = nodeName + "[" + num + "]";
            }

            // And recur up to the parent
            return calculateCleanXPath(parentNode, partialXpath);
        }; // calculateCleanXPath


        // Extracts the URL of the thc content node used in the xpath, or
        // gives window location
        var getContentURLFromXPath = function(xpath) {
            var contentUrl = XpointersHelper.getSafePageContext(),
                index = xpath.indexOf('DIV[@about=\''),
                tagName = "about";

            // The given xpath points to a node outside of any
            // @about described node, a thc content node:
            // return window location without anchor part
            if (index === -1)
                return (contentUrl.indexOf('#') !== -1) ? contentUrl.split('#')[0] : contentUrl;

            // It is a content tag: get the URL contained in the @about attribute
            if (index < 3) {
                var urlstart = index + 7 + tagName.length,
                    pos = xpath.indexOf('_text\']'),
                    urllength = ((pos !== -1) ? xpath.indexOf('_text\']') : xpath.indexOf('\']')) - urlstart;

                return xpath.substr(urlstart, urllength);
            }

            tfh.log('ERROR: getContentURLFromXPath returning something weird? xpath = '+xpath);
            return '';
        }; // getContentURLFromXPath()



        tfh.log('Component up and running');
    });
