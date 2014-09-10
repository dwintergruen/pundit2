angular.module('Pundit2.Annomatic')
.controller('SuggestionFragmentIconCtrl', function($scope, $popover, $element,
    TextFragmentAnnotator, XpointersHelper, Annomatic) {

    // Common for all icons
    $scope.textFragmentIconClass = XpointersHelper.options.textFragmentIconClass;

    // For suggestions fragments
    $scope.iconClass = TextFragmentAnnotator.options.suggestionIconClass;

    // Will use the icon to calculate this fragment height with respect to
    // the document
    $scope.element = $element;

    // Add this icon to the FragmentAnnotator, he will supply this $scope with
    // the .item we belong to
    TextFragmentAnnotator.addFragmentIcon($scope);

    // Let's initialize the popover, tell annomatic we exist etc..
    var init = function() {
        $scope.uri = $scope.item.uri;
        $scope.num = Annomatic.ann.uriToNumMap[$scope.uri];

        // Add this $scope to annomatic, so he can call our methods
        Annomatic.ann.autoAnnScopes[$scope.num] = $scope;

        // Add 'ann-auto' class to every bit belonging to this fragment
        // TODO: make 'ann-auto' configurable? .options?
        angular.element('.'+$scope.fragment).addClass('ann-auto');

        $scope.popover = $popover(
            $scope.element,
            {
                content: ""+$scope.num,
                placement: 'bottom',
                template: 'src/Annomatic/AnnomaticPopover.tmpl.html',
                trigger: 'manual',
                container: "[data-ng-app='Pundit2']"
            }// init()
        );

    };
    init();

    // TODO: move this to its own controller?
    $scope.mouseoverHandler = function() {
        TextFragmentAnnotator.highlightById($scope.fragment);
    };

    $scope.mouseoutHandler = function() {
        TextFragmentAnnotator.clearHighlightById($scope.fragment);
    };

    $scope.clickHandler = function() {
        if (Annomatic.ann.byNum[$scope.num].hidden) { return; }

        if (!$scope.popover.$isShown) {
            $scope.show();
        } else {
            $scope.hide();
        }
    };

    $scope.show = function() {
        if ($scope.popover.$isShown === true) {
            return;
        }
        Annomatic.closeAll();
        Annomatic.setState($scope.num, 'active');
        $scope.popover.show();
    };

    $scope.hide = function() {
        if ($scope.popover.$isShown === false) {
            return;
        }
        Annomatic.setLastState($scope.num);
        $scope.popover.hide();
    };

    $scope.setStateClass = function(from, to) {
        // TODO: removing ann-active too, since it's volatile, used on mouseover
        // .. better store it in the ann.state directly and have the setStateClass
        // remove it directly?

        // Set the state class on every bit belonging to this fragment
        angular.element('.'+$scope.fragment).removeClass(from + ' ann-active');
        angular.element('.'+$scope.fragment).addClass(to);

        if (from === Annomatic.stateClassMap.hidden) {
            element.removeClass('ann-hidden');
        } else if (to === Annomatic.stateClassMap.hidden) {
            element.addClass('ann-hidden');
        }

    };

    $scope.setStateClass('', Annomatic.stateClassMap.waiting);

});