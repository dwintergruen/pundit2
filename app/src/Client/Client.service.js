/**
 * @ngdoc module
 * @name Pundit2
 * @module Pundit2.Client
 * @description Something ..
**/
angular.module('Pundit2.Client')
    .run(function(Config, Client) {
        if (Config.isModuleActive('Client')) {
            Client.boot();
        }
    })
    .service('Client', function(BaseComponent, Config, MyPundit, AnnotatorsOrchestrator,
                                TextFragmentAnnotator, AnnotationsExchange, Consolidation,
                                ItemsExchange) {

        var client = new BaseComponent('Client'),
            root;

        client.fixRootNode = function() {
            root = angular.element("[data-ng-app='Pundit2']");
            if (!root.hasClass('pnd-wrp')) {
                root.addClass('pnd-wrp');
            }
        };

        client.boot = function() {

            client.fixRootNode();

            // Check if we're logged in, other components should $watch MyPundit
            // and get notified automatically when logged in
            MyPundit.checkLoggedIn().then(function(value) {
                // TODO: check if we're logged in and set it up?
            });

            // TODO: how to short down this? [].forEach? From conf?
            // From BaseComponent registered names?? Modules can subscribe themselves
            // an init function? Or just need to know IF and markup?

            if (Config.isModuleActive('Dashboard')) {
                root.append("<dashboard></dashboard>");
                // TODO: more dashboard init? panels
            }

            if (Config.isModuleActive('Toolbar')) {
                root.append("<toolbar></toolbar>");
            }

            // TODO: some if, some option?
            var uris = AnnotatorsOrchestrator.getAvailableTargets();
            client.log('Available targets', uris);

            var annPromise = AnnotationsExchange.searchByUri(uris);
            annPromise.then(function(resp) {
                client.log('Found '+resp.length+' annotations on the current page.');
                Consolidation.consolidate(ItemsExchange.getItems());

            }, function() {
                // TODO: cant search for annotations? OUCH
            });


            // TODO:
            //       get annotations
            //       consolidate
            //       update sidebar (automatic?)
            //       update items (automatic?)

            // TODO:
            // * annotation sidebar
            // * previewer
            // * Lists (My, page?, vocabs?, selectors?)
            // * TextFragmentHandler (TextAnnotator?)
            // * Selectors
            // * MyItems
            // ? Annotators
            // ? cmenu?
            // LATERS: image annotator handler, named content handler, page handler
            //         entity editor helper
            //         Notebook Manager
            //         Tool: comment tag, triple composer
            //

        };

        client.log("Component up and running");
        return client;
    });