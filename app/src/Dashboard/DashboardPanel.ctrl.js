angular.module('Pundit2.Dashboard')
.controller('DashboardPanelCtrl', function($document, $window, $scope, Dashboard) {

    // readed from default (not change)
    $scope.collapsedWidth = Dashboard.options.panelCollapseWidth;
    $scope.bottom = Dashboard.options.footerHeight;

    // overrided in Dashbpoard.addPanel()
    $scope.minWidth = 100;
    $scope.ratio = 1;
    
    $scope.isCollapsed = false;

    // set by Dashboard.resizeAll()
    $scope.left = 0;
    $scope.width = 200;

    // tabs mock
    $scope.tabs = [
        {
        "title": "Home",
        "content": "Raw denim you probably haven't heard of them jean shorts Austin. Nesciunt tofu stumptown aliqua, retro synth master cleanse. Mustache cliche tempor, williamsburg carles vegan helvetica.Raw denim you probably haven't heard of them jean shorts Austin. Nesciunt tofu stumptown aliqua, retro synth master cleanse. Mustache cliche tempor, williamsburg carles vegan helvetica.Raw denim you probably haven't heard of them jean shorts Austin. Nesciunt tofu stumptown aliqua, retro synth master cleanse. Mustache cliche tempor, williamsburg carles vegan helvetica.Raw denim you probably haven't heard of them jean shorts Austin. Nesciunt tofu stumptown aliqua, retro synth master cleanse. Mustache cliche tempor, williamsburg carles vegan helvetica.Raw denim you probably haven't heard of them jean shorts Austin. Nesciunt tofu stumptown aliqua, retro synth master cleanse. Mustache cliche tempor, williamsburg carles vegan helvetica.Raw denim you probably haven't heard of them jean shorts Austin. Nesciunt tofu stumptown aliqua, retro synth master cleanse. Mustache cliche tempor, williamsburg carles vegan helvetica."
        },
        {
        "title": "Profile",
        "content": "Food truck fixie locavore, accusamus mcsweeney's marfa nulla single-origin coffee squid. Exercitation +1 labore velit, blog sartorial PBR leggings next level wes anderson artisan four loko farm-to-table craft beer twee."
        },
        {
        "title": "About",
        "content": "Etsy mixtape wayfarers, ethical wes anderson tofu before they sold out mcsweeney's organic lomo retro fanny pack lo-fi farm-to-table readymade."
        },
        {
        "title": "MyContent",
        "content": "<h3>{{title}}</h3> width: {{width | number: 3}}<br> ratio {{ratio | number: 3}}"
        }
    ];

    $scope.toggleCollapse = function() {

        if( $scope.isCollapsed ) {
            $scope.isCollapsed = !$scope.isCollapsed;
            var foo = {};
            foo[$scope.index] = $scope.minWidth;
            Dashboard.resizeAll(foo);
            
        } else if ( Dashboard.canCollapsePanel() ) {
            $scope.isCollapsed = !$scope.isCollapsed;
            Dashboard.resizeAll();
        }
    };

    $scope.addContent = function(tabName, tabContent){
        $scope.tabs.push({
            title: tabName,
            content: tabContent
        });
    };

    var lastPageX;
    var moveHandler = function(evt) {
        var resized,
            deltaX = evt.pageX - lastPageX;
        if (deltaX === 0) { return; }
        resized = Dashboard.tryToResizeCouples($scope.index, deltaX);        
        if (resized) {
            lastPageX = evt.pageX;
        }
    };
    var upHandler = function(evt) {
        $document.off('mousemove', moveHandler);
        $document.off('mouseup', upHandler);
    };

    $scope.mouseDownHandler = function(e) {
        e.preventDefault();
        lastPageX = e.pageX;
        $document.on('mousemove', moveHandler);
        $document.on('mouseup', upHandler);  
        
    };

    Dashboard.addPanel($scope);

    Dashboard.log('Panel Controller Run');

});