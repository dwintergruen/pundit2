angular.module('Pundit2.Communication')
.factory('Annotation', function(BaseComponent, NameSpace, Item, TypesHelper, $http, $q) {
    var annotationComponent = new BaseComponent("Annotation");

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
        annotationComponent.log('Creating a new Annotation on the server');
        this._q.resolve('New annotation created: TODO, after LOGIN');
    };
    
    Annotation.prototype.load = function(useCache) {
        var self = this;

        if (typeof(useCache) === "undefined") {
            useCache = true;
        }
        
        annotationComponent.log("Loading annotation "+self.id+" with cache "+useCache);
        
        var httpPromise = $http({
            headers: { 'Accept': 'application/json' },
            method: 'GET',
            cache: useCache,
            url: NameSpace.get('asOpenAnn', {id: self.id})

        }).success(function(data) {

            readAnnotationData(self, data);
            self._q.resolve(self);
            annotationComponent.log("Retrieved annotation "+self.id+" metadata");
            
        }).error(function(data, statusCode) {

            // TODO: 404 not found, nothing to do about it, but 403 forbidden might be
            // recoverable by loggin in??
            self._q.reject("Error from server while retrieving annotation "+self.id+": "+ statusCode);
            annotationComponent.err("Error getting annotation "+self.id+". Server answered with status code "+statusCode);
        });
        
    };

    var readAnnotationData = function(ann, data) {
        ann.items = {};
        ann.graph = angular.copy(data.graph);

        // For some weird reason, the first level of the object is
        // is the annotation's URI
        for (var i in data.metadata) {
            ann.uri = i;
        }

        var ns = NameSpace.annotation,
            annData = data.metadata[ann.uri];

        // Those properties are a single value inside an array, read them
        // one by one by using the correct URI taken from the NameSpace,
        // doing some sanity checks
        for (var property in ns) {
            var propertyURI = ns[property];

            if (propertyURI in annData) {
                ann[property] = annData[propertyURI][0].value;
            } else {
                ann[property] = '';
            }
        }

        // .isIncludedIn is an URI, get out the id too
        ann.isIncludedInUri = annData[ns.isIncludedIn][0].value;
        var isIncludedIn = ann.isIncludedInUri.match(/[a-z0-9]*$/);
        if (isIncludedIn !== null) {
            ann.isIncludedIn = isIncludedIn[0];
        }

        // .target is always an array
        ann.target = [ann.target];
        if (annData[ns.target].length > 1) {
            for (var t=1; t<annData[ns.target].length; t++) {
                ann.target.push(annData[ns.target][t].value);
            }
        }

        // Extract all of the entities and items involved in this annotation:
        // subjects and objects which are NOT literals
        ann.entities = [];
        for (var s in data.graph) {

            if (ann.entities.indexOf(s) === -1) {
                ann.entities.push(s);
                ann.items[s] = {};
            }

            for (var p in data.graph[s]) {

                for (var o in data.graph[s][p]) {
                    var object = data.graph[s][p][o];
                    if (object.type === "uri" && ann.entities.indexOf(object.value) === -1) {
                        ann.entities.push(object.value);
                        ann.items[object.value] = {};
                    }
                }
            }
        }

        // Create a real Item for each previously identified item
        for (var k in ann.items) {
            var item = new Item(k);

            item.fromAnnotationRdf(data.items);

            for (var t in item.type) {
                TypesHelper.addFromAnnotationRdf(item.type[t], data.items);
            }

            ann.items[k] = item;

        }

    }; // readAnnotationData()

    // Returns a promise associated with an annotation. The user will
    // get the annotation using .then(success, error). The annotation
    // will load its content as soon as possible and resolve the
    // promise.
    function AnnotationFactory(id) {
        var nb = new Annotation(id);
        return nb._q.promise;
    };

    annotationComponent.log('Component up and running');

    return AnnotationFactory;
});