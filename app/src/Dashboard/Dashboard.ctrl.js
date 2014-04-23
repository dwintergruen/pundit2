angular.module('Pundit2.Dashboard')
.controller('DashboardCtrl', function(DashboardModel) {

    console.log('dashboard controller constructor invoked');

    // initialize the panels
    var init = function(){

        var totalWidth = 0,
            width = 0,
            containerWidth = $(window).width() - (DashboardModel.widths.separator*2),
            containerHeight = $(window).height() * DashboardModel.defaultContainerHeight,
            panelHeight = containerHeight - DashboardModel.height.footer;

        if ( !DashboardModel.visible ) {
            $('.pnd-dashboard-container').hide();
        }

        // container
        $('.pnd-dashboard-container').css({
            'height' : containerHeight,
            'width' : $(window).width()
        });

        // panel lists and separator
        width = containerWidth * DashboardModel.widths.lists
        $('.pnd-dashboard-panel-lists').css({
            'left' : 0,
            'width' : width,
            'height' : panelHeight
        });
        $('.pnd-dashboard-separator').eq(0).css({
            'width' : DashboardModel.widths.separator,
            'left' : width,
            'height' : panelHeight
        });
        totalWidth = totalWidth + width + DashboardModel.widths.separator;

        // panel tools and separator
        width = containerWidth * DashboardModel.widths.tools;
        $('.pnd-dashboard-panel-tools').css({
            'left' : totalWidth,
            'width' : width,
            'height' : panelHeight
        });
        $('.pnd-dashboard-separator').eq(1).css({
            'width' : DashboardModel.widths.separator,
            'left' : totalWidth + width,
            'height' : panelHeight
        });
        totalWidth = totalWidth + width + DashboardModel.widths.separator;

        // panel details
        width = containerWidth * DashboardModel.widths.details;
        $('.pnd-dashboard-panel-details').css({
            'left' : totalWidth,
            'width' : width,
            'height' : panelHeight
        });

        // footer
        $('.pnd-dashboard-footer').css({
            'height' : DashboardModel.height.footer,
            'top' : panelHeight
        });

    };
    init();

});