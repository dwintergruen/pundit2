angular.module('Pundit2.Annotators')
.service('ImageAnnotator', function(NameSpace, BaseComponent, $location, $compile, $rootScope, $timeout,
    Consolidation, XpointersHelper) {

    // Create the component and declare what we deal with: text
    var ia = new BaseComponent('ImageAnnotator');
    ia.label = "image";
    ia.type = NameSpace.types[ia.label];

    var imgConsClass = "pnd-cons-img";

    Consolidation.addAnnotator(ia);

    // This function must be executed before than pundit is appended to DOM
    var timeoutPromise = null, exist = false, el = null, dir = null;
    angular.element('img').hover(function(evt){
        ia.clearTimeout();
        if (el !== null && evt.target.src !== el[0].src) {
            clear();
        }
        if (!exist) {
            // store a target (img) reference
            el = angular.element(evt.target)
                .addClass('pnd-pointed-img')
                .after('<img-menu ref="pnd-pointed-img"></img-menu>');
            // store a directive reference
            dir = $compile(angular.element('img-menu'))($rootScope);
            exist = true;
        }
    }, function(evt){
        // remove directive after 250ms
        ia.removeDirective(evt);
    });

    ia.clearTimeout = function() {
        if(timeoutPromise !== null) {
            $timeout.cancel(timeoutPromise);
            timeoutPromise = null;
        }
    };

    ia.removeDirective = function(evt) {
        timeoutPromise =  $timeout(function(){
            clear();
        }, 100);
    };

    var clear = function() {
        // remove css class from img
        el.removeClass('pnd-pointed-img');
        // remove directive
        dir.remove();
        // update state var
        exist = false;
        el = null;
    };
    
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