/*jshint strict: false*/

angular.module('Pundit2.AnnotationSidebar')
.filter('orderObjectBy', function(){
    return function(input, attribute, order) {
        var results = [];
        
        if (!angular.isObject(input)){
            return input;
        }
        for(var key in input) {
            results.push(input[key]);
        }
        results.sort( function(a, b) {
            // parseInt for textual attribute
            a = parseInt(a[attribute]);
            b = parseInt(b[attribute]);
            return order == 'asc' ? a - b : b - a;
        });

        return results;
    }                                           
})
.filter('freeText', function() {
    return function(input, search) {
        // TODO: freeText work-in-progress
        var results = [];
        results = input;
        return results;
    };
})
.filter('author', function() {
    return function(input, search) {
        var results = [];
        var currentAuthor;

        if (search.length > 0) {
            angular.forEach(input, function (e) {
                currentAuthor = e.creatorName;
                if (search.indexOf(currentAuthor) !== -1) {
                    results.push(e);
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
            angular.forEach(input, function (e) {
                angular.forEach(e.predicates, function(predicate) {
                    currentPredicate = predicate;
                    if (search.indexOf(currentPredicate) !== -1) {
                        results.push(e);
                    }
                });
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
            angular.forEach(input, function (e) {
                angular.forEach(e.entities, function(ent) {
                    currentEnt = ent;
                    if (search.indexOf(currentEnt) !== -1) {
                        results.push(e);
                    }
                });
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
            angular.forEach(input, function (e) {
                angular.forEach(e.items, function(item) {
                    angular.forEach(item.type, function(typeUri) {
                        currentTyp = typeUri;
                        if (search.indexOf(currentTyp) !== -1) {
                            results.push(e);
                        }
                    });
                });
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
            var fromDateParsed = new Date( (fromValue && !isNaN(Date.parse(fromValue))) ? Date.parse(fromValue) : 0 );
            fromDateParsed.setHours(0, 0, 0);
        
            angular.forEach(input,function (e) {
                var currentAnnotationData = Date.parse(e.created);
                if (currentAnnotationData >= fromDateParsed){
                    results.push(e);
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
            var toDateParsed = new Date( (toValue && !isNaN(Date.parse(toValue))) ? Date.parse(toValue) : new Date().getTime() );
            toDateParsed.setHours(23, 59, 59);
        
            angular.forEach(input,function (e) {
                var currentAnnotationData = Date.parse(e.created);
                if (currentAnnotationData <= toDateParsed){
                    results.push(e);
                }
            });
        } else {
            results = input;
        }
        return results;
    };
});