angular.module('Pundit2.AnnotationSidebar')

.filter('orderObjectBy', function() {
    return function(input, attribute, order) {
        var results = [];

        if (!angular.isObject(input)) {
            return input;
        }
        for (var key in input) {
            results.push(input[key]);
        }
        results.sort(function(a, b) {
            // parseInt for textual attribute
            a = parseInt(a[attribute], 10);
            b = parseInt(b[attribute], 10);
            return order === 'asc' ? a - b : b - a;
        });

        return results;
    };
})

.filter('freeText', function() {
    return function(input, search) {
        var results = [];

        if (search.length > 0) {
            angular.forEach(input, function(annotation) {
                for (var i in annotation.items) {
                    var label = annotation.items[i].label;
                    var str = search.toLowerCase().replace(/\s+/g, ' '),
                        strParts = str.split(' '),
                        reg = new RegExp(strParts.join('.*'));

                    if (label.toLowerCase().match(reg) !== null) {
                        results.push(annotation);
                        return;
                    }
                }
                for (var subject in annotation.graph) {
                    for (var predicate in annotation.graph[subject]) {
                        for (var object in annotation.graph[subject][predicate]) {
                            var currentObject = annotation.graph[subject][predicate][object];
                            if (currentObject.type === 'literal') {
                                var literal = currentObject.value;
                                var str = search.toLowerCase().replace(/\s+/g, ' '),
                                    strParts = str.split(' '),
                                    reg = new RegExp(strParts.join('.*'));

                                if (literal.toLowerCase().match(reg) !== null) {
                                    results.push(annotation);
                                    return;
                                }
                            }
                        }
                    }
                }
            });
        } else {
            results = input;
        }
        return results;
    };
})

.filter('broken', function() {
    return function(input, search) {
        var results = [];

        if (search.length > 0) {
            for (var annotation in input) {
                if (!input[annotation].broken) {
                    results.push(input[annotation]);
                }
            }
        } else {
            results = input;
        }
        return results;
    };
})

.filter('authors', function() {
    return function(input, search) {
        var results = [];
        var currentAuthor;

        if (search.length > 0) {
            angular.forEach(input, function(annotation) {
                currentAuthor = annotation.creator;
                if (search.indexOf(currentAuthor) !== -1) {
                    results.push(annotation);
                }
            });
        } else {
            results = input;
        }
        return results;
    };
})

.filter('notebooks', function() {
    return function(input, search) {
        var results = [];
        var currentNotebook;

        if (search.length > 0) {
            angular.forEach(input, function(annotation) {
                currentNotebook = annotation.isIncludedInUri;
                if (search.indexOf(currentNotebook) !== -1) {
                    results.push(annotation);
                }
            });
        } else {
            results = input;
        }
        return results;
    };
})

.filter('predicates', function() {
    return function(input, search) {
        var results = [];
        var currentPredicate;

        if (search.length > 0) {
            angular.forEach(input, function(annotation) {
                for (var p in annotation.predicates) {
                    currentPredicate = annotation.predicates[p];
                    if (search.indexOf(currentPredicate) !== -1) {
                        results.push(annotation);
                        return;
                    }
                }
            });
        } else {
            results = input;
        }
        return results;
    };
})

.filter('entities', function() {
    return function(input, search) {
        var results = [];
        var currentEnt;

        if (search.length > 0) {
            angular.forEach(input, function(annotation) {
                for (var e in annotation.entities) {
                    currentEnt = annotation.entities[e];
                    if (search.indexOf(currentEnt) !== -1) {
                        results.push(annotation);
                        return;
                    }
                }
            });
        } else {
            results = input;
        }
        return results;
    };
})

.filter('types', function() {
    return function(input, search) {
        var results = [];
        var currentTyp;

        if (search.length > 0) {
            angular.forEach(input, function(annotation) {
                for (var i in annotation.items) {
                    var item = annotation.items[i];
                    for (var t in item.type) {
                        currentTyp = item.type[t];
                        if (search.indexOf(currentTyp) !== -1) {
                            results.push(annotation);
                            return;
                        }
                    }
                }

            });
        } else {
            results = input;
        }
        return results;
    };
})

.filter('fromDate', function() {
    return function(input, fromValue) {
        var results = [];
        var fromDateParsed;

        if (fromValue) {
            fromDateParsed = new Date((fromValue && !isNaN(Date.parse(fromValue))) ? Date.parse(fromValue) : 0);
            fromDateParsed.setHours(0, 0, 0);

            angular.forEach(input, function(annotation) {
                var currentAnnotationData = Date.parse(annotation.created);
                if (currentAnnotationData >= fromDateParsed) {
                    results.push(annotation);
                }
            });
        } else {
            results = input;
        }
        return results;
    };
})

.filter('toDate', function() {
    return function(input, toValue) {
        var results = [];
        var toDateParsed;

        if (toValue) {
            toDateParsed = new Date((toValue && !isNaN(Date.parse(toValue))) ? Date.parse(toValue) : new Date().getTime());
            toDateParsed.setHours(23, 59, 59);

            angular.forEach(input, function(annotation) {
                var currentAnnotationData = Date.parse(annotation.created);
                if (currentAnnotationData <= toDateParsed) {
                    results.push(annotation);
                }
            });
        } else {
            results = input;
        }
        return results;
    };
});