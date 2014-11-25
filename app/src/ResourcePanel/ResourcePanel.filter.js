angular.module('Pundit2.ResourcePanel')

.filter('filterByLabel', function() {
    return function(input, search) {
        var results = [];
        if (typeof(search) !== 'undefined' && search !== '') {
            angular.forEach(input, function(item) {
                var label = item.label;
                var str = search.toLowerCase().replace(/\s+/g, ' '),
                    strParts = str.split(' '),
                    reg = new RegExp(strParts.join('.*'));

                if (label.toLowerCase().match(reg) !== null) {
                    results.push(item);
                    return;
                }

            });
        } else {
            results = input;
        }

        return results;
    };
})

.filter('filterByTypes', function() {
    return function(input, property, types) {
        var results = [];
        if (typeof(types) !== 'undefined' && types.length > 0) {
            angular.forEach(input, function(item) {
                if (typeof(item[property]) !== 'undefined' && item[property].length > 0) {
                    for (var i = 0; i < types.length; i++) {
                        for (var j = 0; j < item[property].length; j++) {
                            if (types[i] === item[property][j]) {
                                results.push(item);
                                return;
                            }
                        }
                    }
                } else {
                    // predicates with range or domain empty accept any items
                    results.push(item);
                }
            });
        } else {
            results = input;
        }

        return results;
    };
});