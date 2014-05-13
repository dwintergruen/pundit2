describe('Preview service', function() {

    // TODO: configura l'editor per usare 4 spazi invece di un tab

	var Preview,
		$rootScope,
		$httpBackend,
		NameSpace,
        $compile,
        PREVIEWDEFAULTS;

	var item1 = {
		label: "item label",
		description: "item description",
		uri: "http://item-uri",
		type: ["http://item-type"]
	};

    var imageItem = {
        label: "image item label",
        description: "image item description",
        uri: "http://image-item-uri",
        type: ["http://image-item-type", "http://xmlns.com/foaf/0.1/Image"] // or http://purl.org/pundit/ont/ao#fragment-image
    };

    var fragmentImageItem = {
        label: "image item label",
        description: "image item description",
        uri: "http://image-item-uri",
        type: ["http://image-item-type", "http://purl.org/pundit/ont/ao#fragment-image"]
    };

	var item2 = {
		label: "sticky item label",
		description: "sticky item description",
		uri: "http://sticky-item-uri",
		type: ["http://sticky-item-type"]
	};

	beforeEach(module('Pundit2'));

    beforeEach(module(
        'src/Preview/DashboardPreview.dir.tmpl.html'
    ));

	beforeEach(inject(function($injector, _$rootScope_, _$httpBackend_, _$compile_, _PREVIEWDEFAULTS_){
		Preview = $injector.get('Preview');
		NameSpace = $injector.get('NameSpace');
		$rootScope = _$rootScope_;
		$httpBackend = _$httpBackend_;
        $compile = _$compile_;
        PREVIEWDEFAULTS = _PREVIEWDEFAULTS_;
	}));

    var compilePreviewDirective = function(){
        var elem = $compile('<preview></preview>')($rootScope);
        $rootScope.$digest();
        return elem;
    };


	it("should get an empty Item Dashboard Preview as default", function() {
		expect(Preview.getItemDashboardPreview()).toBeNull();
	});

	it("should get an empty Sticky Item as default", function() {
		expect(Preview.getItemDashboardSticky()).toBeNull();
	});

	it("should set an item to preview", function() {

        // show item1 preview
		Preview.showDashboardPreview(item1);

		var item = Preview.getItemDashboardPreview();

        // item set in preview should be item1
        // getItemDashboardPreview() should be return item1
		expect(item.label).toBe(item1.label);
		expect(item.description).toBe(item1.description);
		expect(item.uri).toBe(item1.uri);
		expect(item.type.length).toBe(item1.type.length);
	});

	it("should set an item as sticky", function() {

        // set item2 as sticky
		Preview.setItemDashboardSticky(item2);

        // item set as sticky should be item2
        // getItemDashboardSticky() should be return item2
		var item = Preview.getItemDashboardSticky();
		expect(item.label).toBe(item2.label);
		expect(item.description).toBe(item2.description);
		expect(item.uri).toBe(item2.uri);
		expect(item.type.length).toBe(item2.type.length);
	});

	it("should clear a sticky item", function() {

		// set item2 as sticky
		Preview.setItemDashboardSticky(item2);

		// at this time, sticky item should be not empty but should be item2
		var item = Preview.getItemDashboardSticky();
		expect(item).not.toBeNull();
		expect(item.uri).toBe(item2.uri);

		// clear the sticky item
		Preview.clearItemDashboardSticky();

		// at this time, item should be empty
		item = Preview.getItemDashboardSticky();
		expect(item).toBeNull();
	});

	it("should show the sticky item if no item is in preview", function() {

		// at the beginning, no item is shown in preview
		var item = Preview.getItemDashboardPreview();
		expect(item).toBeNull();

		// set item2 as sticky
		Preview.setItemDashboardSticky(item2);

		// when hide the preview and an item is set as sticky
        // should be shown the sticky item
		Preview.hideDashboardPreview();

        // getItemDashboardPreview should return the sticky item
        item = Preview.getItemDashboardPreview();

		expect(item).toNotBe("");
		expect(item.uri).toBe(item2.uri);

	})

    it('should show welcome message set in default when no item is shown in preview', function() {

        var elem = compilePreviewDirective();

        // if no item is shown in preview panel should be shown a welcome message

        var item = Preview.getItemDashboardPreview();
        // no item is shown in preview panel
        expect(item).toBeNull();

        // welcome header message should be the same set as default
        var previewPanelHeader = angular.element(elem).find('.pnd-dashboard-preview-panel-heading');
        expect(angular.element(previewPanelHeader).text().trim()).toBe(PREVIEWDEFAULTS.welcomeHeaderMessage);

        // welcome body message should be the same set as default
        var previewPanelBody = angular.element(elem).find('.pnd-dashboard-preview-welcome');
        expect(angular.element(previewPanelBody).text().trim()).toBe(PREVIEWDEFAULTS.welcomeBodyMessage);

    });

    it('should not show welcome message when an item is shown in preview', function() {

        var elem = compilePreviewDirective();
        $rootScope.$digest();

        // show item1 in preview
        Preview.showDashboardPreview(item1);
        $rootScope.$digest();

        // an item should be set as visible in preview
        var item = Preview.getItemDashboardPreview();
        expect(item).not.toBeNull();

        // preview panel header message should not be the welcome header message
        var previewPanelHeader = angular.element(elem).find('.pnd-dashboard-preview-panel-heading');
        expect(angular.element(previewPanelHeader).text().trim()).not.toBe(PREVIEWDEFAULTS.welcomeHeaderMessage);

        // preview panel body message should not be the welcome body message
        var previewPanelBody = angular.element(elem).find('.pnd-dashboard-preview-welcome');
        expect(angular.element(previewPanelBody).text().trim()).not.toBe(PREVIEWDEFAULTS.welcomeBodyMessage);

    });

    it('should check if an item is an image or not', function() {

        // show item1 in preview
        Preview.showDashboardPreview(item1);

        // item1 is not an image item
        expect(Preview.isItemDashboardAnImage()).toBe(false);

        // show image item in preview
        Preview.showDashboardPreview(imageItem);
        expect(Preview.isItemDashboardAnImage()).toBe(true);

        // show item2 in preview
        Preview.showDashboardPreview(item2);
        // item 2 is not an image item
        expect(Preview.isItemDashboardAnImage()).toBe(false);

        // show fragment image item preview
        Preview.showDashboardPreview(fragmentImageItem);
        expect(Preview.isItemDashboardAnImage()).toBe(true);

        // show null item preview
        Preview.showDashboardPreview(null);
        expect(Preview.isItemDashboardAnImage()).toBe(false);

    });

    it('should check if a given item is the sticky item', function() {

        // no item is set as sticky
        // at this time item1 should be not the sticky item
        expect(Preview.isStickyItem(item1)).toBe(false);

        // set item2 as sticky
        Preview.setItemDashboardSticky(item2);

        // at this time item1 should not be the sticky item
        expect(Preview.isStickyItem(item1)).toBe(false);

        // item2 should be the itemSticky
        expect(Preview.isStickyItem(item2)).toBe(true);


    });

    it('should check if the  current item is the sticky item', function() {

        // set item2 as sticky
        Preview.setItemDashboardSticky(item2);

        // show a preview of item1
        Preview.showDashboardPreview(item1);

        // at this time the current item is item1
        // and should be not the sticky item
        expect(Preview.isStickyItem()).toBe(false);

        // show a preview of item2
        Preview.showDashboardPreview(item2);

        // at this time the current item is item2
        // that should be the sticky item
        expect(Preview.isStickyItem()).toBe(true);
    });

    it('should show empty preview if hideDashboardPreview is executed and no sticky item is set', function() {
        // set item2 as sticky
        Preview.showDashboardPreview(item2);

        expect(Preview.getItemDashboardPreview()).not.toBe(null);
        // show a preview of item1
        Preview.hideDashboardPreview(item1);
        expect(Preview.getItemDashboardPreview()).toBe(null);


    });


});