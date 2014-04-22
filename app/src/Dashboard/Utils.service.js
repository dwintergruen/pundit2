angular.module('Pundit2.Dashboard')
.service('Utils', function() {

    console.log('dashboard utils service invoked');

    var Utils = {};
    
    Utils.widths = {
        lists : 0.25,
        tools : 0.5,
        details : 0.25,

        // tipically is a constant
        separator : 20
    };

    Utils.defaultContainerHieght = 0.2;
    
    return Utils;
});