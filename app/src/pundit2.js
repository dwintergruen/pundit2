/**
 * @ngdoc module
 * @name Pundit2
 * @module Pundit2
 * @description Something ..
**/
angular.module('Pundit2', [
    'ngResource', 'ngSanitize', 'ngAnimate', 'mgcrea.ngStrap', 'templates-main',
    'Pundit2.Core', 'Pundit2.Annomatic', 'Pundit2.AnnotationSidebar', 'Pundit2.Dashboard',
    'Pundit2.Toolbar', 'Pundit2.Communication', 'Pundit2.Annotators', 'Pundit2.ContextualMenu',
    'Pundit2.ItemPreview'
    ])
    .run(function(Config, $document) {

        var root = angular.element("[data-ng-app='Pundit2']");
        if (!root.hasClass('pnd-wrp')) {
            root.addClass('pnd-wrp');
        }

        // TODO: Move this to its own module? An Init module?
        if (Config.autoInit === true) {

            // TODO: how to short up this? [].forEach? From conf?
            // From BaseComponent registered names?? Modules can subscribe themselves
            // an init function? Or just need to know IF and markup?

            if (Config.isModuleActive('Dashboard')) {
                root.append("<dashboard></dashboard>");
                // TODO: more dashboard init? panels
            }

            if (Config.isModuleActive('Toolbar')) {
                root.append("<toolbar></toolbar>");
            }

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

        } else {
            console.log('NOT .. starting up!');
        }
    });