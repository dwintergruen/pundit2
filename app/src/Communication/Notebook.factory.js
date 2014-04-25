angular.module('Pundit2.Communication')
.factory('Notebook', function(BaseComponent, NameSpace, $http, $q) {
    var notebookComponent = new BaseComponent("Notebook", {debug: true});

    // Creates a new Notebook instance. If an id is passed in
    // then the notebook metadata are loaded, otherwise a new
    // notebook is created on the server
    function Notebook(id) {
        this._q = $q.defer();
        
        if (typeof(id) !== "undefined") {
            this.id = id;
            this.load();
        } else {
            this.create();
        }

    };
    
    Notebook.prototype.create = function() {
        notebookComponent.log('Creating a new Notebook on the server');
        this._q.resolve('New notebook created: TODO, after LOGIN');
    };
    
    Notebook.prototype.setPublic = function() {
        var self = this;
        notebookComponent.log('Setting notebook public '+useCache);
    };
    
    Notebook.prototype.load = function(useCache) {
        var self = this;

        if (typeof(useCache) === "undefined") {
            useCache = true;
        }
        
        notebookComponent.log("Loading notebook "+self.id+" metadata with cache "+useCache);
        
        var httpPromise = $http({
            headers: { 'Accept': 'application/json' },
            method: 'GET',
            cache: useCache,
            url: NameSpace.get('asOpenNBMeta', {id: self.id})

        }).success(function(data) {

            readData(self, data);
            self._q.resolve(self);
            notebookComponent.log("Retrieved notebook "+self.id+" metadata");
            
        }).error(function(data, statusCode) {

            // TODO: 404 not found, nothing to do about it, but 403 forbidden might be
            //       recoverable by loggin in
            self._q.reject("Error from server while retrieving notebook "+self.id+": "+ statusCode);
            notebookComponent.err("Error getting notebook "+self.id+" metadata. Server answered with status code "+statusCode);
        });
        
    };
    
    var readData = function(nb, data) {
        // For some weird reason, the first level of the object is
        // is the notebook's URI
        for (var nbUri in data) {
            nb.uri = nbUri;
        }
        
        var ns = NameSpace.notebook,
            nbData = data[nb.uri];

        // Treat properties as single values inside an array, read them
        // one by one by using the correct URI taken from the NameSpace,
        // doing some sanity checks
        for (var property in ns) {
            var propertyURI = ns[property];
                
            if (propertyURI in nbData) {
                nb[property] = nbData[propertyURI][0].value;
            } else {
                nb[property] = '';
            }
        }
        
        // .includes is an array of annotation URIs. Parse out the ID
        // and put it in an array
        var includes = nbData[ns.includes];
        nb.includes = [];
        for (var k in includes) {
            var annId = includes[k].value.match(/[a-z0-9]*$/);
            if (annId !== null) {
                nb.includes.push(annId[0]);
            }
        }
        
    }; // readData()

    // Returns a promise associated with a notebook. The user will
    // get the notebook using .then(success, error). The notebook 
    // will load its metadata as soon as possible and resolve the 
    // promise.
    function NotebookFactory(id) {
        var nb = new Notebook(id);
        return nb._q.promise;
    };

    notebookComponent.log('Component up and running');

    return NotebookFactory;
});