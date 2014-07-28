angular.module('Pundit2.Annotators')
.service('ImageAnnotator', function(NameSpace, BaseComponent, $location,
    Consolidation, XpointersHelper) {

    // Create the component and declare what we deal with: text
    var ia = new BaseComponent('ImageAnnotator');
    ia.label = "image";
    ia.type = NameSpace.types[ia.label];

    var imgConsClass = "pnd-cons-img";

    // var imgContainerClass = "pnd-img-wrp";

    Consolidation.addAnnotator(ia);

    /*ia.wrapImages = function() {

        angular.element('img')
            .filter(function(index, el){
                // Traverse every parent and check if it has one of the classes we
                // need to ignore. As soon as we find one, return true: must ignore.
                var node = el;
                while (node.nodeName.toLowerCase() !== 'body') {
                    
                    if (angular.element(node).hasClass('pnd-ignore')) {
                        return false;
                    }            

                    // If there's no parent node .. even better, we didnt find anything wrong!
                    if (node.parentNode === null) {
                        return true;
                    }
                    node = node.parentNode;
                }
                return true;
            })
            .wrap('<div class="'+imgContainerClass+'"></div>')
            .each(function(index){
                var className = 'pnd-image-ref-'+index;
                angular.element(this)
                    .addClass(className)
                    .after('<img-menu ref="'+ className +'"></img-menu>');
            });
        $compile(angular.element('img-menu'))($rootScope);
    };*/
    //$rootScope.$on('consolidation-completed', ia.wrapImages);
    
    ia.isConsolidable = function(item) {

        if (!angular.isArray(item.type)) {
            ia.log("Item not valid: malformed type"+ item.uri);
            return false;
        } else if (item.type.length === 0) {
            ia.log("Item not valid: types len 0"+ item.uri);
            return false;
        } else if (item.type.indexOf(ia.type) === -1) {
            ia.log("Item not valid: not have type image"+ item.uri);
            return false;
        } else if (!XpointersHelper.isValidXpointerURI(item.uri)) {
            ia.log("Item not valid: not a valid xpointer uri: "+ item.uri);
            return false;
        } else if (!XpointersHelper.isValidXpointer(item.uri)) {
            ia.log("Item not valid: not consolidable on this page: "+ item.uri);
            return false;
        }
        
        // TODO: it's a valid image fragment if:
        // - one of its types is the fragment-image type
        // - has a part of
        // - .selector contains something
        // ... etc etc

        ia.log("Item valid: "+ item.label);
        return true;
    };

    ia.consolidate = function(items) {
        ia.log('Consolidating!');

        var uri, xpointers = [];
        for (uri in items) {
            xpointers.push(uri);
        }
        var xpaths = XpointersHelper.getXPathsFromXPointers(xpointers);
        for (uri in xpaths) {
            angular.element(xpaths[uri].startNode.firstChild).addClass(imgConsClass);
        }
    };

    ia.wipe = function() {
        /*angular.element('img')
            .filter(function(index, el){
                // Traverse every parent and check if it has one of the classes we
                // need to ignore. As soon as we find one, return true: must ignore.
                var node = el;
                while (node.nodeName.toLowerCase() !== 'body') {
                    
                    if (angular.element(node).hasClass('pnd-ignore')) {
                        return false;
                    }            

                    // If there's no parent node .. even better, we didnt find anything wrong!
                    if (node.parentNode === null) {
                        return true;
                    }
                    node = node.parentNode;
                }
                return true;
            })
            .unwrap()
            .each(function(index){
                angular.element(this)
                    .removeClass(function(index, classes){
                        return (classes.match('pnd-image-ref-') || []).join(' ');
                    });
            });

        angular.element('.pnd-image-icon').remove();*/
        angular.element('.'+imgConsClass).removeClass(imgConsClass);
    };

    ia.highlightById = function() {
        // TODO
    };

    ia.clearHighlightById = function() {
        // TODO
    };

    ia.highlightByUri = function() {
        // TODO
    };

    ia.clearHighlightByUri = function() {
        // TODO
    };

    ia.log("Component up and running");
    return ia;
});