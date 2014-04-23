angular.module('Pundit2.Dashboard')
.controller('DashboardCtrl', function(Dashboard) {

    console.log('dashboard controller constructor invoked');

    // initialize the panels
    var init = function(){

        var totalWidth = 0,
            width = 0,
            containerWidth = $(window).width() - (Dashboard.widths.separator*2),
            containerHeight = $(window).height() * Dashboard.defaultContainerHeight,
            panelHeight = containerHeight - Dashboard.height.footer;

        if ( !Dashboard.visible ) {
            $('.pnd-dashboard-container').hide();
        }

        // container
        $('.pnd-dashboard-container').css({
            'height' : containerHeight,
            'width' : $(window).width()
        });

        // panel lists and separator
        width = containerWidth * Dashboard.widths.lists
        $('.pnd-dashboard-panel-lists').css({
            'left' : 0,
            'width' : width,
            'height' : panelHeight
        });
        $('.pnd-dashboard-separator').eq(0).css({
            'width' : Dashboard.widths.separator,
            'left' : width,
            'height' : panelHeight
        });
        totalWidth = totalWidth + width + Dashboard.widths.separator;

        // panel tools and separator
        width = containerWidth * Dashboard.widths.tools;
        $('.pnd-dashboard-panel-tools').css({
            'left' : totalWidth,
            'width' : width,
            'height' : panelHeight
        });
        $('.pnd-dashboard-separator').eq(1).css({
            'width' : Dashboard.widths.separator,
            'left' : totalWidth + width,
            'height' : panelHeight
        });
        totalWidth = totalWidth + width + Dashboard.widths.separator;

        // panel details
        width = containerWidth * Dashboard.widths.details;
        $('.pnd-dashboard-panel-details').css({
            'left' : totalWidth,
            'width' : width,
            'height' : panelHeight
        });

        // footer
        $('.pnd-dashboard-footer').css({
            'height' : Dashboard.height.footer,
            'top' : panelHeight
        });

    };
    init();

});