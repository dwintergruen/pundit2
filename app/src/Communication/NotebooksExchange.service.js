angular.module('Pundit2.Communication')
    .service('NotebookExchange', function(BaseComponent) {

        var notebookExchange = new BaseComponent("NotebookExchange");

        var nsList = [],
            nsListById = {},
            myNsList = [],
            myNsListById = {},
            currentId;

        notebookExchange.wipe = function() {
            annotationExchange.log('Wiping every loaded notebooks.');
            nsList = [],
            nsListById = {},
            myNsList = [],
            myNsListById = {};
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

        notebookExchange.removeNotebook = function(notebookID) {

            var index = -1;
            // find notebook in notebook list
            for(var i = 0; i< nsList.length; i++){
                if(nsList[i].id === notebookID){
                    index = i;
                    break;
                }
            }

            // if no notebook is found in the notebook list, get error
            if (index === -1) {
                notebookExchange.err("Cannot remove notebook "+ns+" from notebook list: notebook is not in notebook list.");
                return;
            }

            // remove notebook from notebook list
            nsList.splice(index, 1);

            // reset index
            index = -1;

            // find notebook in my notebook list
            for(var i = 0; i< myNsList.length; i++){
                if(myNsList[i].id === notebookID){
                    index = i;
                    break;
                }
            }

            // if no notebook is found in the my notebook list, get error
            if (index === -1) {
                notebookExchange.err("Cannot remove notebook "+ns+" from my notebook list: notebook is not in my notebook list.");
                return;
            }

            // remove notebook from my notebook list
            myNsList.splice(index, 1);
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
            return nsListById[currentId];
        };

        notebookExchange.setCurrentNotebooks = function(notebookID) {
            console.log("set new current as: ", notebookID);
            currentId = notebookID;
        };

        notebookExchange.log('Component up and running');

        return notebookExchange;
    });