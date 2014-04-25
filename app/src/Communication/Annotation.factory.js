angular.module('Pundit2.Communication')
.factory('Annotation', function(BaseComponent, NameSpace, $http, $q) {
    var nc = new BaseComponent("Annotation", {debug: true});

    // Creates a new Annotation instance. If an id is passed in
    // then the annotation is loaded, otherwise a new annotation
    // is created on the server
    function Annotation(id) {
        this._q = $q.defer();
        
        if (typeof(id) !== "undefined") {
            this.id = id;
            this.load();
        } else {
            this.create();
        }

    };

    Annotation.prototype.create = function() {
        nc.log('Creating a new Annotation on the server');
        this._q.resolve('New annotation created: TODO, after LOGIN');
    };
    
    Annotation.prototype.load = function(useCache) {
        var self = this;

        if (typeof(useCache) === "undefined") {
            useCache = true;
        }
        
        nc.log("Loading annotation "+self.id+" with cache "+useCache);
        
        var httpPromise = $http({
            headers: { 'Accept': 'application/json' },
            method: 'GET',
            cache: useCache,
            url: NameSpace.get('asOpenAnn', {id: self.id})

        }).success(function(data) {

            readAnnotationData(self, data);
            self._q.resolve(self);
            nc.log("Retrieved annotation "+self.id+" metadata");
            
        }).error(function(data, statusCode) {

            // TODO: 404 not found, nothing to do about it, but 403 forbidden might be
            //       recoverable by loggin in
            self._q.reject("Error from server while retrieving annotation "+self.id+": "+ statusCode);
            nc.err("Error getting annotation "+self.id+". Server answered with status code "+statusCode);
        });
        
    };
    
    var readAnnotationData = function(ann, data) {
        ann.items = {};
        ann.graph = angular.copy(data.graph);

        console.log('Annot data ', data);

        // For some weird reason, the first level of the object is
        // is the annotation's URI
        for (var i in data.metadata) {
            ann.uri = i;
        }

        var ns = NameSpace.annotation,
            annData = data.metadata[ann.uri],
            properties = ['creator', 'creatorName', 'created', 'modified', 'hasPageContext', 'isIncludedIn'];
        
        // Those properties are a single value inside an array, read them
        // one by one by using the correct URI taken from the NameSpace,
        // doing some sanity checks
        for (var j in properties) {
            var property = properties[j],
                propertyURI = ns[property];
                
            if (propertyURI in annData) {
                ann[property] = annData[propertyURI][0].value;
            } else {
                ann[property] = '';
            }
        }

        // isIncludedIn is an URI, get out the id too
        ann.isIncludedInUri = annData[ns.isIncludedIn][0].value;
        var isIncludedIn = ann.isIncludedInUri.match(/[a-z0-9]*$/);
        if (isIncludedIn !== null) {
            ann.isIncludedIn = isIncludedIn[0];
        }
        
        // TODO: read out items
        // TODO: read out graph or just copy it over? :|
        
        
    }; // readAnnotationData()

    // Returns a promise associated with an annotation. The user will
    // get the annotation using .then(success, error). The annotation
    // will load its content as soon as possible and resolve the 
    // promise.
    function AnnotationFactory(id) {
        var nb = new Annotation(id);
        return nb._q.promise;
    };

    nc.log('Component up and running');

    return AnnotationFactory;
});