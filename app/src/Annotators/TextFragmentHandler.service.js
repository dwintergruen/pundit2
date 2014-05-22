angular.module('Pundit2.Annotators')
    .constant('TEXTFRAGMENTHANDLERDEFAULTS', {
        ignoreClasses: []
    })
    .service('TextFragmentHandler', function(TEXTFRAGMENTHANDLERDEFAULTS, NameSpace, BaseComponent, $document) {

        var tfh = new BaseComponent('TextFragmentHandler', TEXTFRAGMENTHANDLERDEFAULTS);


        tfh.log('Component up and running');
    });
