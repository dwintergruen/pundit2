var LR = require('connect-livereload')({
    port: 31331
});
var mountFolder = function(connect, dir) {
    return connect.static(require('path').resolve(dir));
};

module.exports = function(grunt) {

    require('load-grunt-tasks')(grunt);

    var conf = {
        app: 'app',
        build: 'build',
        tests: 'test'
    };

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        conf: conf,

        // Bower can be run from grunt, will call it like this to avoid
        // extra install steps
        bower: {
            install: {
                options: {
                    cleanTargetDir: true,
                    cleanBowerDir: false,
                    install: true,
                    copy: false
                }
            }
        },
        
        shell: {
            options: {
                stdout: true
            },
            protractorInstall: {
                command: 'node ./node_modules/protractor/bin/webdriver-manager update'
            }
        },
        
        uglify: {
            bookmarklet: {
                files: {
                    '<%= conf.build %>/bm/scripts/pundit-bm.js': ['.tmp/concat/scripts/*.js']
                }
            }
        },
        cssmin: {
            bookmarklet: {
                files: {
                    '<%= conf.build %>/bm/css/pundit-bm.css': ['.tmp/concat/css/pundit.css']
                }
            }
        },
        

        // Instruct the .html page with custom directives to concat/uglify/cssmin
        // and replace the inclusion directives in the production html files
        useminPrepare: {
            html: '<%= conf.app %>/examples/index.html',
            options: {
                dest: '<%= conf.build %>'
            }
        },
        usemin: {
            html: ['<%= conf.build %>/{,*/}*.html'],
            css: ['<%= conf.build %>/css/{,*/}*.css'],
            options: {
                dirs: ['<%= conf.build %>']
            }
        },

        // Clean up, remove all the build, tmp, css files
        clean: {
            dist: {
                files: [{
                    dot: true,
                    src: [
                        '.tmp',
                        'coverage/*',
                        '<%= conf.app %>/css/*css',
                        '<%= conf.app %>/css/fonts',
                        '<%= conf.app %>/fonts',
                        '<%= conf.build %>/*',
                        '!<%= conf.build %>/.git*'
                    ]
                }]
            },
            docs:{
                files: [{
                    src: ['<%= conf.build %>/docs/*']
                }]
            }
        },

        // *min: reduce space
        imagemin: {
            dev: {
                files: [{
                    expand: true,
                    cwd: '<%= conf.app %>/styles/img',
                    src: '{,*/}*.{png,jpg,jpeg,gif}',
                    dest: '<%= conf.app %>/css/img'
                }]
            },
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= conf.app %>/styles/img',
                    src: '{,*/}*.{png,jpg,jpeg,gif}',
                    dest: '<%= conf.build %>/css/img'
                }]
            }
        },

        // Split in two the htlmin targets, the final step is after
        // usemin, to avoid deleting useful comments :P
        htmlmin: {
            final: {
                options: {
                    removeComments: true,
                    removeCommentsFromCDATA: true,
                    collapseWhitespace: true,
                    collapseBooleanAttributes: true,
                    removeAttributeQuotes: true,
                    removeRedundantAttributes: true,
                    useShortDoctype: true,
                    removeEmptyAttributes: true,
                    removeOptionalTags: true
                },
                files: [{
                    expand: true,
                    cwd: '<%= conf.build %>',
                    src: ['*.html'],
                    dest: '<%= conf.build %>'
                }]
            },
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= conf.app %>/examples/',
                    src: ['*.html'],
                    dest: '<%= conf.build %>'
                }]
            }
        },

        // Angular code does not go along with uglify's mangle option
        // ngmin make them friends! .. 
        // WARNING! Declare every time the angular.module('SomethingApp') and then
        // .controller(), without chaining .controller().controller() or it will
        // screw up... At least with grunt-ngmin 0.0.3
        ngmin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '.tmp/concat/scripts',
                    src: '*.js',
                    dest: '.tmp/concat/scripts'
                }]
            }
        },
        
        html2js: {
            options: {
                base: '<%= conf.app %>/'
            },
            main: {
                src: ['<%= conf.app %>/src/**/*.tmpl.html'],
                dest: '<%= conf.app %>/src/templates.js'
            }
        },


        concat: {
            docApp: {
                src: ["<%= conf.app %>/../docsAssets/app/*js"],
                dest: "<%= conf.build %>/docs/js/docs.js"
            }
        },

        // Whatever is not copied by other tasks.. get copied here
        copy: {
            docs: {
                files: [
                {
                    expand: true,
                    cwd: '<%= conf.app %>/../docsAssets/assets',
                    dest: '<%= conf.build %>/docs',
                    src: [
                        '*',
                        '**/*'
                    ]
                },
                {
                    expand: true,
                    cwd: '<%= conf.app %>/../node_modules/marked/lib/',
                    dest: '<%= conf.build %>/docs/js',
                    src: [
                        'marked.js'
                    ]
                },
                {
                    expand: true,
                    cwd: '<%= conf.app %>/../bower_components/',
                    dest: '<%= conf.build %>/docs/js',
                    src: [
                        'lunr.js/lunr.min.js',
                        'google-code-prettify/src/prettify.js',
                        'google-code-prettify/src/lang-css.js',
                        'angular/angular.min.js',
                        'angular-resource/angular-resource.js',
                        'angular-route/angular-route.js',
                        'angular-animate/angular-animate.js',
                        'angular-cookies/angular-cookies.js',
                        'angular-sanitize/angular-sanitize.js',
                        'angular-touch/angular-touch.js'
                    ]
                }]
            },
            dist: {
                files: [
                {
                    expand: true,
                    dot: true,
                    cwd: '<%= conf.app %>',
                    dest: '<%= conf.build %>',
                    src: [
                        '*.{ico,png,txt}',
                        '.htaccess',
                        'css/fonts/*'
                    ]
                },
                {
                    expand: true,
                    cwd: '.tmp/images',
                    dest: '<%= conf.build %>/css/img',
                    src: 'generated/*'
                }]
            },
            prod: {
                files: [
                    {
                        src: '<%= conf.build %>/css/*.pundit.css',
                        dest: '<%= customDir %>/pundit2.css'

                    },
                    {
                        src: '<%= conf.build %>/scripts/*.pundit2.js',
                        dest: '<%= customDir %>/pundit2.js'
                    },
                    {
                        src: '<%= conf.build %>/scripts/*.libs.js',
                        dest: '<%= customDir %>/libs.js'
                    },
                    {
                        expand: true,
                        cwd: '<%= conf.build %>/css/',
                        dest: '<%= customDir %>/',
                        src: 'fonts/*'
                    },
                    {
                        expand: true,
                        cwd: '<%= conf.build %>/css/',
                        dest: '<%= customDir %>/',
                        src: 'img/*'
                    }
                ]
            },
            bookmarklet: {
                files: [
                    {
                        expand: true,
                        cwd: '<%= conf.app %>/styles/pundit-font/',
                        dest: '<%= conf.build %>/bm/css/',
                        src: 'fonts/*'
                    },
                    {
                        expand: true,
                        cwd: '<%= conf.app %>/examples/',
                        dest: '<%= conf.build %>/bm',
                        src: 'InitBookmarklet.js'
                    }
                ]
            },
            css: {
                expand: true,
                cwd: '<%= conf.app %>/css',
                dest: '.tmp/css/',
                src: '{,*/}*.css'
            },
            fonts: {
                files: [
                    {
                        expand: true,
                        cwd: '<%= conf.app %>/styles/pundit-font/',
                        dest: '<%= conf.app %>/css/',
                        src: 'fonts/*'
                    },
                    {
                        expand: true,
                        cwd: '<%= conf.app %>/styles/pundit-font/',
                        dest: '<%= conf.app %>/css/',
                        src: 'style.css'
                    }
                ]
            }
        },

        // Bypassing your cache for fun and profit
        rev: {
            options: {
                algorithm: 'sha1',
                length: 8
            },
            dist: {
                files: {
                    src: [
                        '<%= conf.build %>/scripts/libs.js',
                        '<%= conf.build %>/scripts/pundit2.js',
                        '<%= conf.build %>/css/pundit.css',
                        '<%= conf.build %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
                    ]
                }
            }
        },

        less: {
            dev: {
                options: {
                    sourceMapAsFile: true,
                    sourceMap: true,
                    paths: ["<%= conf.app %>/css"]
                },
                files: {
                    "<%= conf.app %>/css/pundit2.css": "<%= conf.app %>/styles/pundit2.less"
                }
            },
            dist: {
                options: {
                    paths: ["<%= conf.app %>/css"],
                    cleancss: true
                },
                files: {
                    "<%= conf.app %>/css/pundit2.css": "<%= conf.app %>/styles/pundit2.less"
                }
            }
        },

        connect: {
            options: {
                port: 9000,
                hostname: 'localhost'
            },
            livereload: {
                options: {
                    middleware: function(connect) {
                        return [
                            LR,
                            mountFolder(connect, '.')
                        ];
                    }
                }
            },
            testserver: {
                options: {
                    port: 9999
                }
            }
        },

        watch: {
            less: {
                files: ['<%= conf.app %>/styles/*.less'],
                tasks: ['less:dev', 'copy:fonts']
            },
            unit: {
                files: [
                    '<%= conf.tests %>/*.js',
                    '<%= conf.tests %>/**/*.js'
                ],
                tasks: ['jshint', 'karma:unit']
            },
            buildhtml: {
                files: [
                    '<%= conf.app %>/examples/src/*'
                ],
                tasks: ['examples']
            },
            html: {
                files: [
                    '<%= conf.app %>/**/*.tmpl.html'
                ],
                tasks: ['html2js']
            },
            livereload: {
                options: {
                    livereload: 31331
                },
                files: [
                    '<%= conf.app %>/src/**/*.js',
                    '<%= conf.app %>/**/*.html',
                    '<%= conf.app %>/css/*.css',
                    '<%= conf.app %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
                ]
            }

        },

        open: {
            server: {
                url: 'http://localhost:<%= connect.options.port %>/app/examples/'
            },
            
            doc: {
                url: 'http://localhost:<%= connect.options.port %>/build/docs/'
            }
        },
        
        jshint: {
            options: {
                "reporter": require('jshint-stylish'),
                "loopfunc": true,
                "undef": true,
                "unused": true,
                "browser": true,
                "curly": true,
                "trailing": true,
                "camelcase": true,
                "eqeqeq": true,
                "multistr": true,
                "globals": {
                    angular: true
                }
            },
            tests: {
                options: {
                    "camelcase": false,
                    "node": true,
                    "sub": true,
                    "globals": {
                        describe: true,
                        // ddescribe: true,
                        it: true,
                        // iit: true,
                        expect: true,
                        beforeEach: true,
                        afterEach: true,
                        inject: true,
                        protractor: true,
                        jasmine: true,
                        angular: true
                    }
                },
                files: {
                    src: ['Gruntfile.js','test/*.js', 'test/**/*.js']
                }
            },
            app: {
                options: {
                    "globals": {
                        punditConfig: true,
                        angular: true
                    }
                },
                files: {
                    src: ['app/*.js', 'app/**/*.js']
                }
            }
        },

        karma: {
            options: {
                configFile: './test/karma.conf.js'
            },
            headless: {
                browsers:  ['PhantomJS']
            },
            unit: {
                autoWatch: false,
                singleRun: true
            },
            watch: {
                autoWatch: true,
                singleRun: false
            },
            unitCoverage: {
                autoWatch: false,
                singleRun: true,
                reporters: ['progress', 'coverage'],
                preprocessors: {
                    "app/**/*.tmpl.html": 'ng-html2js',
                    "app/**/*.js": 'coverage'
                },
                coverageReporter: {
                    type: 'html',
                    dir: '<%= conf.build %>/coverage/'
                }
            }
        },

        protractor: {
            options: {
                keepAlive: true,
                configFile: "./test/protractor.conf.js"
            },
            singlerun: {},
            auto: {
                keepAlive: true,
                options: {
                    args: {
                        seleniumPort: 4444
                    }
                }
            }
        },
        
        htmlbuild: {
            options: {
                parseTag: 'buildexamples'
            },
            pre: {
                src: "<%= conf.app %>/examples/src/*.pre.inc",
                dest: "<%= conf.app %>/examples/examples.list.html"
            },
            dev: {
                src: "<%= conf.app %>/examples/src/*.html",
                dest: "<%= conf.app %>/examples/",
                options: {
                    data: {
                        examples: '<%= conf.examples %>'
                    },
                    sections: {
                        header: [
                            '<%= conf.app %>/examples/src/_header.inc',
                            '<%= conf.app %>/examples/examples.list.html',
                            '<%= conf.app %>/examples/src/_libs.inc',
                            '<%= conf.app %>/examples/src/_pundit.inc'
                        ],
                        footer: [
                            '<%= conf.app %>/examples/src/_footer.inc'
                        ]
                    }
                }
            }
        }

    });
    
    
    grunt.registerTask('examples', 'creates examples', ['listExamples', 'htmlbuild:pre', 'htmlbuild:dev']);
    
    grunt.registerTask('listExamples', 'List examples', function() {
        var examples = grunt.file.expand('app/examples/src/*html'),
            examplesLinks = [];
        
        for (var i in examples) {
            var idx = examples[i].lastIndexOf('/'),
                name = examples[i].substr(idx+1),
                label = name.substr(0, name.length-5);
            examplesLinks[i] = "<a href='"+name+"'>"+label+"</a>";
        }
        
        conf.examples = examples;
        conf.examplesLinks = examplesLinks.join(" | ");
    });
    
    grunt.registerTask('dgeni', 'Generate docs via Dgeni.', function() {
        var dgeni = require('dgeni');
        var done = this.async();
        
        dgeni('docsAssets/dgeni.conf.js')
          .generateDocs()
          .then(done);
      });

    grunt.registerTask('doc', 'create documentation', ['clean:docs', 'dgeni', 'copy:docs', 'concat:docApp', 'open:doc']);

    grunt.registerTask('install', 'Installs js (non-node) dependencies like bower etc',
        ['bower', 'shell:protractorInstall']);

    grunt.registerTask('build', 'Builds a production-ready version of the application',
        ['clean:dist', 'copy:fonts', 'html2js', 'examples', 'useminPrepare', 'less:dist', 'copy:css', 'imagemin',
            'htmlmin', 'concat',  'copy:dist', 'ngmin', 'cssmin', 'uglify',
            'rev', 'usemin', 'htmlmin:final', 'copy:bookmarklet']);

    grunt.registerTask('dev', 'Live dev workflow: watches app files and reloads the browser automatically',
        ['less:dev', 'copy:fonts', 'imagemin:dev', 'html2js', 'examples', 'connect:livereload', 'open:server', 'watch']);
    grunt.registerTask('dev:unit', 'Live dev UNIT tests workflow: watches for test files and runs unit tests automatically',
        ['test:unit', 'watch:unit']);

    grunt.registerTask('test', 'Executes unit and e2e tests',
        ['jshint', 'karma:unit', 'connect:testserver', 'protractor:singlerun']);
    grunt.registerTask('test:unit', 'Executes unit tests',
        ['jshint', 'karma:unit']);
    grunt.registerTask('test:cov', 'Produces test coverage reports',
        ['karma:unitCoverage']);
    grunt.registerTask('test:e2e', 'Executes the e2e tests',
        [/*'jshint',*/ 'connect:testserver', 'protractor:singlerun']);
    grunt.registerTask('test:headless', ['jshint', 'karma:headless']);

    grunt.registerTask('default',
        ['clean']);

    grunt.registerTask('prod', 'Copy files ready to be included in the HTML page',
        function(){
            grunt.config.set('customDir', arguments[0]);
            grunt.task.run('copy:prod');

        });

};