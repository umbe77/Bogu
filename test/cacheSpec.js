describe("Bogu $cache module", function() {
	it("Craete new Cache With Name 'Test'", function() {
		bogu.module(["$cache"], function($cache) {
			var c = $cache("Test");
			expect(c.cacheId).toEqual("Test");
			$cache.destroy("Test");
		});
	});

	it("Get Cache 'Test' with one value", function() {
		bogu.module(["$cache"], function($cache) {
			var c = $cache("Test");
			c.add("key1", "test");
			expect(c.size).toEqual(1);
			expect(c["key1"]).toEqual("test");
			$cache.destroy("Test");
		});
	});

	it("Destroy Cache", function() {
		bogu.module(["$cache"], function($cache) {
			var c = $cache("Test");
			c.add("key1", "test");
			$cache.destroy("Test");
			var d = $cache("Test");
			expect(d.size).toEqual(0);
		});
	});
});