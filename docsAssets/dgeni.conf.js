// @dgeni developers: Why do we need canonical-path?
var path = require('canonical-path');

// What annotations do we want to use? Choose jsdoc for now.
var ngdocPackage = require('dgeni-packages/ngdoc');

module.exports = function(config) {
  // Use ngdocPackage
  config = ngdocPackage(config);

  // Set logging level
  config.set('logging.level', 'info');

  // Add your own templates to render docs
  config.prepend('rendering.templateFolders', [
    path.resolve(__dirname, '../docsAssets/templates')
  ]);

  // You can specifiy which tempate should be used based on a pattern.
  // Currently we just use one template and don't need a pattern
  /*config.prepend('rendering.templatePatterns', [
    'common.template.html'
  ]);*/

  // This tells dgeni where to look for stuff
  config.set('source.projectPath', '..');

  config.set('source.files', [
    {
      pattern: 'docsAssets/fakeSrc/*.js',
      basePath: path.resolve(__dirname, '..')
    },
    {
      pattern: 'app/src/**/*.js',
      basePath: path.resolve(__dirname, '..')
    }

  ]);

  // Our generated docs will be written here:
  // @dgeni developers: Why is both (outputFolder and contentsFolder) needed?
  config.set('rendering.outputFolder', '../build/docs/');
  config.set('rendering.contentsFolder', 'docs');

  config.append('processing.processors', [
    require('./processors/index-page'),
    require('./processors/pages-data')
  ]);

  config.merge('deployment', {
    environments: [{
      name: 'default',
      examples: {
        commonFiles: {
          // scripts: [ '../../../angular.js' ]
        }
        // dependencyPath: '../../../'
      },
      scripts: [
        'js/angular/angular.min.js',
        'js/angular-resource/angular-resource.js',
        'js/angular-route/angular-route.js',
        'js/angular-cookies/angular-cookies.js',
        'js/angular-sanitize/angular-sanitize.js',
        'js/angular-touch/angular-touch.js',
        'js/angular-animate/angular-animate.js',
        'js/angular-bootstrap/bootstrap.js',
        'js/angular-bootstrap/bootstrap-prettify.js',
        'js/angular-bootstrap/dropdown-toggle.js',
        'js/google-code-prettify/src/prettify.js',
        'js/google-code-prettify/src/lang-css.js',
        'js/lunr.js/lunr.min.js',
        'js/marked.js',
        'js/pages-data.js',
        'js/docs.js'
      ],
      stylesheets: [
        'css/prettify-theme.css',
        'css/docs.css',
        'css/animations.css'
      ]
    }]
  });

  return config;
};