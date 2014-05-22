angular.module('Pundit2.Annotators')
    .constant('TEXTFRAGMENTHANDLERDEFAULTS', {
        ignoreClasses: ['pnd-ignore']
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
                return;
            }


            var range = tfh.getSelectedRange();
            if (range === null) {
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
                    return;
                }
            }

            tfh.log('Selection ended on document. Dirty range: ', range);

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
            if  (range !== null
                && (range.startContainer === range.endContainer)
                && (range.startOffset === range.endOffset)) {
                tfh.log("Range is not null, but start/end containers and offsets match: no selected range.");
                return null;
            }

            tfh.log("GetSelectedRange returning a DIRTY range: "+
                range.startContainer.nodeName+"["+range.startOffset+"] > "+
                range.endContainer.nodeName+"["+range.endOffset+"]");

            return range;
        }; // getSelectedRange()

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



        tfh.log('Component up and running');
    });
