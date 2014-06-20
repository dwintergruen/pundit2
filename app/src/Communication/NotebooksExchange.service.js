angular.module('Pundit2.Communication')
    .service('NotebookExchange', function(BaseComponent) {

        var notebookExchange = new BaseComponent("NotebookExchange");

        var nsList = [],
            nsListById = {};

        notebookExchange.wipe = function() {
            annotationExchange.log('Wiping every loaded notebooks.');
            nsList = [];
            nsListById = {};
        };

        notebookExchange.addNotebook = function(ns) {
            // TODO: sanity checks?
            if (ns.id in nsListById) {
                notebookExchange.log('Not adding notebook '+ns.id+': already present.');
            } else {
                ns._q.promise.then(function(n) {
                    nsListById[ns.id] = n;
                    nsList.push(n);
                });
            }
        };

        notebookExchange.getNotebooks = function() {
            return nsList;
        };

        notebookExchange.log('Component up and running');

        return notebookExchange;
    });