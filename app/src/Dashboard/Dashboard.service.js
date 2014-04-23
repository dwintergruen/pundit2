angular.module('Pundit2.Dashboard')
.service('Dashboard', function(BaseComponent) {

    var Dashboard = new BaseComponent('Dashboard', {debug:true});
    
    Dashboard.widths = {
        // percentage of window.width
        lists : 0.25,
        tools : 0.5,
        details : 0.25,

        // tipically is a constant
        separator : 10
    };

    Dashboard.height = {
        container : 250,
        // tipically is a constant
        footer : 10
    };

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

    Dashboard.log('Dashboard servie run');
    
    return Dashboard;
});