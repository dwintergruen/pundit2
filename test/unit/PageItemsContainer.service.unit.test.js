describe("PageItemsContainer", function(){

    var PageItemsContainer,
        $rootScope,
        $compile;

    beforeEach(module('Pundit2'));

    beforeEach(module(
        'src/PageItemsContainer/PageItemsContainer.dir.tmpl.html',
        'src/PageItemsContainer/items.tmpl.html'
    ));

    beforeEach(inject(function(_$rootScope_, _$compile_, _PageItemsContainer_){
        $rootScope = _$rootScope_;
        $compile = _$compile_;
        PageItemsContainer = _PageItemsContainer_;
    }));

    var compileDirective = function(){
        var elem = $compile('<page-item-container></page-item-container>')($rootScope);
        angular.element('body').append(elem);
        $rootScope.$digest();
        return elem;
    };

    afterEach(function(){
        angular.element('page-item-container').remove();
    });

});