angular.module('Pundit2.Core')
    .service('Consolidation', function(BaseComponent, Utils) {
        var cc = new BaseComponent('Consolidation');

        var annotations = [],
            loadingAnnotations = 0;

        cc.addAnnotations = function(annPromise) {
            console.log('add ann ', annPromise);
            loadingAnnotations++;
            if (angular.isArray(annPromise)) {

            } else {
                annPromise.then(function(ann) {
                    loadingAnnotations--;
                    cc.log('Added annotation ', ann.id);
                    annotations.push(ann);
                }, function() {
                    loadingAnnotations--;
                });
            }
        };


        return cc;
    });