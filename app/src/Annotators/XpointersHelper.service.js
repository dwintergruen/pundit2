angular.module('Pundit2.Annotators')
.service('XpointersHelper', function(NameSpace, BaseComponent, $document) {

    var xp = new BaseComponent('XpointersHelper');

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
                // TODO ?
                xp.log("Invalid xpointer :(");
            }
        } // for i

        return {
            xpaths: xpaths,
            xpointers: xpointers
        };

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
        xp. getNodeFromXpath = function(xpath) {
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


        // Will return an array of sorted xpaths, using a custom structure
        // xpaths object
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

                console.log('Haz startsonde?!', node, xpaths[xpointer]);

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

            // Erase doubled entries

            ret[0] = x[0];
            for (var i=1, j=0, len=x.length; i<len; i++)
                if (x[i].xpath != ret[j].xpath || x[i].offset != ret[j].offset)
                    ret[++j] = x[i];

            return ret;

        }; // splitAndSortXPaths()



        xp.log("Component up and running");
    return xp;
});