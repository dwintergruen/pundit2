angular.module('Pundit2.Dashboard')
.service('DashboardModel', function() {

    console.log('dashboard utils service invoked');

    var DashboardModel = {};
    
    DashboardModel.widths = {
        // percentage of window.width
        lists : 0.25,
        tools : 0.5,
        details : 0.25,

        // tipically is a constant
        separator : 20
    };

    DashboardModel.height = {
        // tipically is a constant
        footer : 20
    };

    // Dashboard total height
    DashboardModel.defaultContainerHeight = 0.4;

    // Dashboard visibility flag
    DashboardModel.visible = true;

    DashboardModel.setVisible = function(bool){
        DashboardModel.visible = bool;
        if ( bool ){
            $('.pnd-dashboard-container').show();
        } else {
            $('.pnd-dashboard-container').hide();
        }
    }
    
    return DashboardModel;
});