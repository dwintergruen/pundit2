angular.module('Pundit2.Dashboard')
.service('Dashboard', function() {

    console.log('dashboard utils service invoked');

    var Dashboard = {};
    
    Dashboard.widths = {
        // percentage of window.width
        lists : 0.25,
        tools : 0.5,
        details : 0.25,

        // tipically is a constant
        separator : 20
    };

    Dashboard.height = {
        // tipically is a constant
        footer : 20
    };

    // Dashboard total height
    Dashboard.defaultContainerHeight = 0.4;

    // Dashboard visibility flag
    Dashboard.visible = true;

    Dashboard.setVisible = function(bool){
        Dashboard.visible = bool;
        if ( bool ){
            $('.pnd-dashboard-container').show();
        } else {
            $('.pnd-dashboard-container').hide();
        }
    }
    
    return Dashboard;
});