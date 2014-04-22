angular.module('Pundit2.Dashboard')
.controller('DashboardCtrl', function(Utils) {

    console.log('dashboard controller constructor invoked');

    // initialize the panels
    var init = function(){

        var totalWidth = 0,
            width = 0,
            windowWidth = $(window).width() - (Utils.widths.separator*2);

        $('.pnd-dashboard-container').css({
            'height' : $(window).height() * Utils.defaultContainerHieght
        });

        width = windowWidth * Utils.widths.lists
        $('.pnd-dashboard-panel-lists').css({
            'left' : 0,
            'width' : width
        });
        $('.pnd-dashboard-separator').eq(0).css({
            'width' : Utils.widths.separator,
            'left' : width
        });
        totalWidth = totalWidth + width + Utils.widths.separator;

        width = windowWidth * Utils.widths.tools;
        $('.pnd-dashboard-panel-tools').css({
            'left' : totalWidth,
            'width' : width
        });
        $('.pnd-dashboard-separator').eq(1).css({
            'width' : Utils.widths.separator,
            'left' : totalWidth + width
        });
        totalWidth = totalWidth + width + Utils.widths.separator;

        width = windowWidth * Utils.widths.details;
        $('.pnd-dashboard-panel-details').css({
            'left' : totalWidth,
            'width' : width
        });

    };
    init();

});