angular.module('Pundit2.Communication')
.factory('Notebook', function(BaseComponent, NameSpace, $http, $q) {
    var nc = new BaseComponent("Notebook", {debug: true});

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
        nc.log('Creating a new Notebook on the server');
        this._q.resolve('New notebook created: TODO, after LOGIN');
    };
    
    Notebook.prototype.setPublic = function() {
        var self = this;
        nc.log('Setting notebook public '+useCache);
    };
    
    Notebook.prototype.load = function(useCache) {
        var self = this;

        if (typeof(useCache) === "undefined") {
            useCache = true;
        }
        
        nc.log("Loading notebook "+self.id+" metadata with cache "+useCache);
        
        var httpPromise = $http({
            headers: { 'Accept': 'application/json' },
            method: 'GET',
            cache: useCache,
            url: NameSpace.get('asOpenNBMeta', {id: self.id})

        }).success(function(data) {

            readData(self, data);
            self._q.resolve(self);
            nc.log("Retrieved notebook "+self.id+" metadata");
            
        }).error(function(data, statusCode) {

            // TODO: 404 not found, nothing to do about it, but 403 forbidden might be
            //       recoverable by loggin in
            self._q.reject("Error from server while retrieving notebook "+self.id+": "+ statusCode);
            nc.err("Error getting notebook "+self.id+" metadata. Server answered with status code "+statusCode);
        });
        
    };
    
    var readData = function(nb, data) {
        // For some weird reason, the first level of the object is
        // is the notebook's URI
        for (var i in data) {
            nb.uri = i;
        }
        
        var ns = NameSpace.notebook,
            nbData = data[nb.uri],
            properties = ['visibility', 'creator', 'creatorName', 'created', 'id', 'type', 'label'];
        
        // Those properties are a single value inside an array, read them
        // one by one by using the correct URI taken from the NameSpace,
        // doing some sanity checks
        for (var j in properties) {
            var property = properties[j],
                propertyURI = ns[property];
                
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

    nc.log('Component up and running');

    return NotebookFactory;
});