describe('Preview service', function() {

    // TODO: configura l'editor per usare 4 spazi invece di un tab

	var Preview,
		$rootScope,
		$httpBackend,
		NameSpace;

	var itemToPreview = {
		label: "item label",
		description: "item description",
		uri: "http://item-uri",
		type: ["http://item-type"]
	};

	var itemSticky = {
		label: "sticky item label",
		description: "sticky item description",
		uri: "http://sticky-item-uri",
		type: ["http://sticky-item-type"]
	};

	beforeEach(module('Pundit2'));

	beforeEach(inject(function($injector, _$rootScope_, _$httpBackend_){
		Preview = $injector.get('Preview');
		NameSpace = $injector.get('NameSpace');
		$rootScope = _$rootScope_;
		$httpBackend = _$httpBackend_;
	}));

	it("should get an empty Item Dashboard Preview as default", function() {
		expect(Preview.getItemDashboardPreview()).toBe("");
	});

	it("should get an empty Sticky Item as default", function() {
		expect(Preview.getItemDashboardSticky()).toBe("");
	});

	it("should set an item to preview", function() {

		Preview.showDashboardPreview(itemToPreview);
		$rootScope.$digest();

		var item = Preview.getItemDashboardPreview();

		expect(item.label).toBe(itemToPreview.label);
		expect(item.description).toBe(itemToPreview.description);
		expect(item.uri).toBe(itemToPreview.uri);
		expect(item.type.length).toBe(itemToPreview.type.length);
	});

	it("should set an item as sticky", function() {

		Preview.setItemDashboardSticky(itemSticky);
		$rootScope.$digest();

		var item = Preview.getItemDashboardSticky();

		expect(item.label).toBe(itemSticky.label);
		expect(item.description).toBe(itemSticky.description);
		expect(item.uri).toBe(itemSticky.uri);
		expect(item.type.length).toBe(itemSticky.type.length);
	});

	it("should clear a sticky item", function() {

		// set an item as sticky
		Preview.setItemDashboardSticky(itemSticky);
		$rootScope.$digest();

		// at this time, item should be not empty
		var item = Preview.getItemDashboardSticky();
		expect(item).toNotBe("");
		expect(item.uri).toBe(itemSticky.uri);

		// clear the sticky item
		Preview.clearItemDashboardSticky();
		$rootScope.$digest();

		// at this time, item should be empty
		item = Preview.getItemDashboardSticky();
		expect(item).toBe("");
		expect(item.uri).toBeUndefined(true);
	});

	it("should show the sticky item if no item is in preview", function() {

		// at the beginning, no item is shown in preview
		var item = Preview.getItemDashboardPreview();
		expect(item).toBe("");
		expect(item.uri).toBeUndefined(true);

		// set an item as sticky
		Preview.setItemDashboardSticky(itemSticky);
		$rootScope.$digest();

		// getItemDashboardPreview should return the sticky item
		Preview.hideDashboardPreview();
		item = Preview.getItemDashboardPreview();
		$rootScope.$digest();

		expect(item).toNotBe("");
		expect(item.uri).toBe(itemSticky.uri);

	});
});