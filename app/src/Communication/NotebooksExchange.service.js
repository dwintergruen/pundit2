angular.module('Pundit2.Communication')
    .service('NotebookExchange', function(BaseComponent) {

        var notebookExchange = new BaseComponent("NotebookExchange");

        var nsList = [],
            nsListById = {},
            myNsList = [],
            myNsListById = {},
            currentNotebook;

        notebookExchange.wipe = function() {
            annotationExchange.log('Wiping every loaded notebooks.');
            nsList = [];
            nsListById = {};
        };

        notebookExchange.addNotebook = function(ns, isMyNotebook) {
            // TODO: sanity checks?
            if (ns.id in nsListById) {
                notebookExchange.log('Not adding notebook '+ns.id+': already present.');
            } else {
                ns._q.promise.then(function(n) {
                    nsListById[ns.id] = n;
                    nsList.push(n);
                    // add to my notebooks list
                    if (typeof(isMyNotebook)!=='undefined' && isMyNotebook) {
                        myNsListById[ns.id] = n;
                        myNsList.push(n);
                    }
                });
            }
        };

        notebookExchange.getNotebookById = function(id) {
            if (id in nsListById) {
                return nsListById[id];
            }
            // If the notebook is not found, it will return undefined
        };

        notebookExchange.getNotebooks = function() {
            return nsList;
        };

        notebookExchange.getMyNotebooks = function() {
            return myNsList;
        };

        notebookExchange.getCurrentNotebooks = function() {
            return currentNotebook;
        };

        notebookExchange.setCurrentNotebooks = function(notebookID) {
            console.log("sto settando come current il seguente notebook: ", notebookID);
            currentNotebook = notebookID;
        };

        notebookExchange.log('Component up and running');

        return notebookExchange;
    });