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
            angular.forEach(input, function (annotation) {
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
.filter('predicates', function() {
    return function(input, search) {
        var results = [];
        var currentPredicate;

        if (search.length > 0) {
            angular.forEach(input, function (annotation) {
                for (var p in annotation.predicates){
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
            angular.forEach(input, function (annotation) {
                for (var e in annotation.entities){
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
        var boolCheck = false;

        if (search.length > 0) {
            angular.forEach(input, function (annotation) {
                for (var i in annotation.items){
                    var item = annotation.items[i];
                    for (var t in item.type){
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
            var fromDateParsed = new Date( (fromValue && !isNaN(Date.parse(fromValue))) ? Date.parse(fromValue) : 0 );
            fromDateParsed.setHours(0, 0, 0);
        
            angular.forEach(input,function (annotation) {
                var currentAnnotationData = Date.parse(annotation.created);
                if (currentAnnotationData >= fromDateParsed){
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
            var toDateParsed = new Date( (toValue && !isNaN(Date.parse(toValue))) ? Date.parse(toValue) : new Date().getTime() );
            toDateParsed.setHours(23, 59, 59);
        
            angular.forEach(input,function (annotation) {
                var currentAnnotationData = Date.parse(annotation.created);
                if (currentAnnotationData <= toDateParsed){
                    results.push(annotation);
                }
            });
        } else {
            results = input;
        }
        return results;
    };
});