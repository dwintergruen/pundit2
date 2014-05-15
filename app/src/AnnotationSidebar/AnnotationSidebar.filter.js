/*jshint strict: false*/

angular.module('Pundit2.AnnotationSidebar')
.filter('author', function() {
  return function(input, search) {
    var results = [];
    var currentAuthor;
    if (search){
        angular.forEach(input,function (e) {
            currentAuthor = e.creatorName.toLowerCase();
            if (currentAuthor.indexOf(search.toLowerCase()) >= 0) {
                results.push(e);
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