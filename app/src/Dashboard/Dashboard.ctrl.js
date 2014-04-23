angular.module('Pundit2.Dashboard')
.controller('DashboardCtrl', function($document, $window, Dashboard) {

    var jqElement = {

        // dashboard container
        container : angular.element('.pnd-dashboard-container'),

        // dashboard footer
        footer : angular.element('.pnd-dashboard-footer'),

        //dashboard separtors (two elements)
        separators : angular.element('.pnd-dashboard-separator'),

        // panels
        panelLists : angular.element('.pnd-dashboard-panel-lists'),
        panelTools : angular.element('.pnd-dashboard-panel-tools'),
        panelDetails : angular.element('.pnd-dashboard-panel-details')

    };

    // initialize dashboard dimensions
    var init = function(){

        var totalWidth = 0,
            width = 0,
            containerWidth = angular.element($window).width(),
            containerHeight = Dashboard.height.container,
            panelHeight = containerHeight - Dashboard.height.footer;

        if ( containerWidth < 960 ) {
            containerWidth = 960;
        }
        var containerUtilsWidth = containerWidth - (2 * Dashboard.widths.separator);

        // container
        jqElement.container.css({
            'height' : containerHeight,
            'width' : containerWidth
        });

        // panel lists
        width = containerUtilsWidth * Dashboard.widths.lists
        jqElement.panelLists.css({
            'left' : 0,
            'width' : width,
            'height' : panelHeight
        });
        // first separator
        jqElement.separators.eq(0).css({
            'width' : Dashboard.widths.separator,
            'left' : width,
            'height' : panelHeight
        });
        totalWidth = totalWidth + width + Dashboard.widths.separator;

        // panel tools
        width = containerUtilsWidth * Dashboard.widths.tools;
        jqElement.panelTools.css({
            'left' : totalWidth,
            'width' : width,
            'height' : panelHeight
        });
        // second separator
        jqElement.separators.eq(1).css({
            'width' : Dashboard.widths.separator,
            'left' : totalWidth + width,
            'height' : panelHeight
        });
        totalWidth = totalWidth + width + Dashboard.widths.separator;

        // panel details
        width = containerUtilsWidth * Dashboard.widths.details;
        jqElement.panelDetails.css({
            'left' : totalWidth,
            'width' : width,
            'height' : panelHeight
        });

        // footer
        jqElement.footer.css({
            'height' : Dashboard.height.footer,
            'top' : panelHeight
        });

        Dashboard.log('Dashboard init');
    };
    init();

    var update = function(event){
        init();
    };
    //attach event listeners
    angular.element($window).resize(update);


    var resizeHeight = function(event){
        Dashboard.height.container =  event.pageY - jqElement.container.offset().top;
        init();
    };

    var mouseUpHandler = function(){
        // remove mousemove handler
        $document.off('mousemove', resizeHeight);
        $document.off('mouseup', mouseUpHandler);
    };

    jqElement.footer.mousedown(function(event){
        event.preventDefault();        
        $document.on('mouseup', mouseUpHandler);
        $document.on('mousemove', resizeHeight);
    });
    

});