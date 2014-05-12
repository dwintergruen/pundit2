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
                                ItemsExchange, Annotation, $q) {

        var client = new BaseComponent('Client'),
            // Node which will contain every other component
            root;

        // Verifies that the root node has the wrap class
        // TODO: if there is no node.. add it? Is Pundit2 bootstrapped if there's
        // no node? :P
        client.fixRootNode = function() {
            root = angular.element("[data-ng-app='Pundit2']");
            if (!root.hasClass('pnd-wrp')) {
                root.addClass('pnd-wrp');
            }
        };

        // Reads the conf and initializes the active components, bootstrap what needs to be
        // boostrapped (gets annotations, check if the user is logged in, etc)
        client.boot = function() {

            client.fixRootNode();

            // Check if we're logged in, other components should $watch MyPundit
            // and get notified automatically when logged in
            MyPundit.checkLoggedIn().then(function(value) {
                // TODO: check if we're logged in and set something up?
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

            if (Config.isModuleActive('AnnotationSidebar')) {
                root.append("<annotation-sidebar></annotation-sidebar>");
            }

            // TODO: some if, some option?
            var uris = AnnotatorsOrchestrator.getAvailableTargets();
            client.log('Available targets', uris);

            var annPromise = AnnotationsExchange.searchByUri(uris);
            annPromise.then(function(ids) {
                client.log('Found '+ids.length+' annotations on the current page.');

                ids.push('wrong-id');

                var annPromises = [],
                    settled = 0;
                for (var i=0; i<ids.length; i++) {

                    var a = new Annotation(ids[i]);
                    a.then(function(){
                        // The annotation got loaded, it is already available
                        // in the AnnotationsExchange
                    }, function(error) {
                        client.log("Could not retrieve annotation: "+ error);
                        // TODO: can we try again? Let the user try again with an error on
                        // the toolbar?
                    }).finally().then(function() {
                        settled++;
                        client.log('Received annotation '+settled+'/'+annPromises.length);
                        if (settled === annPromises.length) {
                            client.log('All promises settled, consolidating');
                            Consolidation.consolidate(ItemsExchange.getItems());
                        }
                    });
                    annPromises.push(a);
                }

            }, function() {
                // TODO: cant search for annotations? OUCH
            });

            // TODO:
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