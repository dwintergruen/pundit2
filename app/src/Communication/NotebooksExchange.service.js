angular.module('Pundit2.Communication')
    .service('NotebookExchange', function(BaseComponent) {

        // TODO what appens if i getCurrentNotebook to add an annotation
        // and the current notebook is undefined? need to add a promise?
        // or download all annotation and notebook after a new annotation ?

        var notebookExchange = new BaseComponent("NotebookExchange");

        var nsList = [],
            nsListById = {},
            myNsList = [],
            myNsListById = {},
            currentId = null;

        notebookExchange.wipe = function() {
            notebookExchange.log('Wiping every loaded notebooks.');
            nsList = [],
            nsListById = {},
            myNsList = [],
            myNsListById = {};
        };

        notebookExchange.addNotebook = function(ns, isMyNotebook) {
            // try to add to generic list
            if (ns.id in nsListById) {
                notebookExchange.log('Not adding notebook '+ns.id+': already present.');
            } else {
                ns._q.promise.then(function(n) {
                    nsListById[ns.id] = n;
                    nsList.push(n);
                });
            }

            if (typeof(isMyNotebook)!=='undefined' && isMyNotebook) {
                // try to add to my notebooks list
                if (ns.id in myNsListById) {
                    notebookExchange.log('Not adding notebook '+ns.id+' to my notebook, already present.');
                } else {
                    ns._q.promise.then(function(n) {
                        myNsListById[ns.id] = n;
                        myNsList.push(n);
                    });
                }
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
                notebookExchange.err("Cannot remove notebook "+notebookID+" from notebook list: notebook is not in notebook list.");
                return;
            }

            // remove notebook from notebook list
            nsList.splice(index, 1);
            delete nsListById[notebookID];

            // reset index
            index = -1;

            // find notebook in my notebook list
            for(var j = 0; j< myNsList.length; j++){
                if(myNsList[j].id === notebookID){
                    index = j;
                    break;
                }
            }

            // if no notebook is found in the my notebook list, get error
            if (index === -1) {
                notebookExchange.err("Cannot remove notebook "+notebookID+" from my notebook list: notebook is not in my notebook list.");
                return;
            }

            // remove notebook from my notebook list
            myNsList.splice(index, 1);
            delete myNsListById[notebookID];
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
            if (currentId !== null){
                return nsListById[currentId];
            }
        };

        notebookExchange.setCurrentNotebooks = function(notebookID) {
            notebookExchange.log("set new current as: ", notebookID);
            currentId = notebookID;
        };

        notebookExchange.log('Component up and running');

        return notebookExchange;
    });