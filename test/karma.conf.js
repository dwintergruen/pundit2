module.exports = function(config) {
    config.set({
        files: [
            'bower_components/jquery/dist/jquery.js',
            'bower_components/angular/angular.js',
            'bower_components/angular-route/angular-route.js',
            'bower_components/angular-mocks/angular-mocks.js',
            'bower_components/angular-resource/angular-resource.js',
            'bower_components/angular-sanitize/angular-sanitize.js',
            'bower_components/angular-animate/angular-animate.js',
            'bower_components/angular-strap/dist/angular-strap.js',
            'bower_components/angular-strap/dist/angular-strap.tpl.min.js',

            // Load the module declaration before the module utilization, or karma
            // will screw up :|
            'app/src/pundit2.js',
            'app/src/templates.js',
            'app/src/Core/Core.js',
            'app/src/AnnotationSidebar/AnnotationSidebar.js',
            'app/src/Annomatic/Annomatic.js',
            'app/src/Dashboard/Dashboard.js',
            'app/src/ContextualMenu/ContextualMenu.js',
            'app/src/Lists/PageItemsContainer/PageItemsContainer.js',
            'app/src/Lists/MyItemsContainer/MyItemsContainer.js',
            'app/src/Lists/Vocabularies/Vocabularies.js',
            'app/src/Tools/TripleComposer/TripleComposer.js',
            'app/src/Item/Item.js',
            'app/src/Toolbar/Toolbar.js',
            'app/src/Preview/Preview.js',
            'app/src/ResourcePanel/ResourcePanel.js',
            'app/src/Communication/Communication.js',
            'app/src/**/*.js',
            'test/unit/**/*.js'
        ],
        basePath: '../',
        frameworks: ['jasmine'],
        reporters: ['progress'],
        browsers:  ['Chrome'], // ['Firefox', 'Chrome', 'PhantomJS'],

        // logLevel: config.LOG_DEBUG,
        autoWatch: false,
        singleRun: true,
        colors: true
    });
};