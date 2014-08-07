angular.module('Pundit2.Communication')
.constant('NOTEBOOKDEFAULTS', {
    iconDefault: 'pnd-icon pnd-icon-book',
    classDefault: 'pnd-item-default'

})
.factory('Notebook', function(BaseComponent, NameSpace, MyPundit, Analytics, NotebookExchange, NOTEBOOKDEFAULTS,
                                $http, $q) {

    var notebookComponent = new BaseComponent("Notebook", NOTEBOOKDEFAULTS);

    // Creates a new Notebook instance. If an id is passed in
    // then the notebook metadata are loaded, otherwise a new
    // notebook is created on the server
    function Notebook(id, isMyNotebook) {
        this._q = $q.defer();
        
        if (typeof(id) !== "undefined") {
            this.id = id;
            this.load();
        } else {
            // TODO: move create here? add a save? to edit the stuff .. ?
            // Isnt current a notebook attribute?
            // TODO: use NotebookExchange.createNotebook ?
            this.create();
        }

        NotebookExchange.addNotebook(this, isMyNotebook);
    }

    Notebook.prototype.addAnnotation = function(annID) {
        if (typeof(this.includes) === 'undefined') {
            this.includes = [];
        }
        this.includes.push(annID);
    };

    Notebook.prototype.removeAnnotation = function(annID) {
        if (typeof(this.includes) === 'undefined') {
            return false;
        }
        var index = this.includes.indexOf(annID);
        if (index > -1) {
            this.includes.splice(index, 1);
            return true;
        }
    };

    Notebook.prototype.getIcon = function() {
        return notebookComponent.options.iconDefault;
    };

    Notebook.prototype.getClass = function() {
        return notebookComponent.options.classDefault;
    };

    Notebook.prototype.setPrivate = function() {
        this.visibility = "private";
    };

    Notebook.prototype.isPublic = function() {
        return this.visibility === "public";
    };

    Notebook.prototype.setPublic = function() {
        this.visibility = "public";
    };

    Notebook.prototype.setLabel = function(name) {
        this.label = name;
    };

    Notebook.prototype.isCurrent = function() {
        var current = NotebookExchange.getCurrentNotebooks();
        if (typeof(current) === 'undefined') {
            return false;
        }
        return this.id === current.id;
    };

    // TODO: after login
    Notebook.prototype.create = function() {
        notebookComponent.log('Creating a new Notebook on the server');
        this._q.resolve('New notebook created: TODO, after LOGIN');
    };

    Notebook.prototype.save = function() {
        // TODO: modify some property (name, ispublic, etc) then save
    };

    Notebook.prototype.load = function(useCache) {
        var self = this;

        if (typeof(useCache) === "undefined") {
            useCache = true;
        }
        
        notebookComponent.log("Loading notebook "+self.id+" metadata with cache "+useCache);

        var httpPromise,
            nsKey = MyPundit.isUserLogged() ? 'asNBMeta' : 'asOpenNBMeta';

        httpPromise = $http({
            headers: { 'Accept': 'application/json' },
            method: 'GET',
            cache: useCache,
            url: NameSpace.get(nsKey, {id: self.id}),
            withCredentials: true
        }).success(function(data) {
            readData(self, data);
            self._q.resolve(self);
            Analytics.track('api', 'get', 'notebook meta');
            notebookComponent.log("Retrieved notebook "+self.id+" metadata");

        }).error(function(data, statusCode) {
            // TODO: 404 not found, nothing to do about it, but 403 forbidden might be
            //       recoverable by loggin in
            self._q.reject("Error from server while retrieving notebook "+self.id+": "+ statusCode);
            Analytics.track('api', 'error', 'get notebook meta', statusCode);
            notebookComponent.err("Error getting notebook "+self.id+" metadata. Server answered with status code "+statusCode);

        });
        
    }; // Notebook.load()
    
    var readData = function(nb, data) {
        // For some weird reason, the first level of the object
        // is the notebook's URI
        for (var nbUri in data) {
            nb.uri = nbUri;
        }
        
        var ns = NameSpace.notebook,
            nbData = data[nb.uri];

        if (typeof(nbData) === 'undefined') {
            notebookComponent.err('Malformed notebook uri='+nb.uri+', wrong metadata: ', data);
            return false;
        }

        // Treat properties as single values inside an array, read them
        // one by one by using the correct URI taken from the NameSpace,
        // doing some sanity checks
        for (var property in ns) {
            var propertyURI = ns[property];
                
            if (propertyURI in nbData) {
                if(property === 'type'){
                    nb[property] = [nbData[propertyURI][0].value];
                } else {
                    nb[property] = nbData[propertyURI][0].value;
                }
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
    function NotebookFactory(id, isMyNotebook) {
        var nb = new Notebook(id, isMyNotebook);
        return nb._q.promise;
    }

    notebookComponent.log('Component up and running');

    return NotebookFactory;
});