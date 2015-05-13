describe("Bogu $common module", function() {

	describe("StartsWith", function() {
		it("$common.startsWith('Hello Folks', 'Hel') => true", function() {
			bogu.module(["$common"], function($common) {
				var result = $common.startsWith('Hello Folks', 'Hel');
				expect(result).toEqual(true);
			})
		});

		it("$common.startsWith('Hello Folks', 'hel', true) => true", function() {
			bogu.module(["$common"], function($common) {
				var result = $common.startsWith('Hello Folks', 'hel', true);
				expect(result).toEqual(true);
			})
		});

		it("$common.startsWith('Hello Folks', 'hel') => false", function() {
			bogu.module(["$common"], function($common) {
				var result = $common.startsWith('Hello Folks', 'hel');
				expect(result).toEqual(false);
			})
		});
	});

	describe("unique", function() {
		it("$common.unique([1,2,3,5,1,5,6,3]) => [1,2,3,5,6]", function() {
			bogu.module(["$common"], function($common) {
				var orignialArray = [1, 2, 3, 5, 1, 5, 6, 3];
				var result = $common.unique(orignialArray);
				expect(result).toEqual([1, 2, 3, 5, 6]);
			});
		});
	});

	describe("isUndefOrNull", function() {
		it("$common.isUndefOrNull({}) / $common.isUndefOrNull({a: 'Hello'}) => false", function() {
			bogu.module(["$common"], function($common) {
				var result1 = $common.isUndefOrNull({});
				var result2 = $common.isUndefOrNull({
					a: 'Hello'
				});
				expect(result1).toEqual(false);
				expect(result2).toEqual(false);
			});
		});

		it("$common.isUndefOrNull(undefined) / $common.isUndefOrNull(null) => true", function() {
			bogu.module(["$common"], function($common) {
				var result1 = $common.isUndefOrNull(undefined);
				var result2 = $common.isUndefOrNull(null);
				expect(result1).toEqual(true);
				expect(result2).toEqual(true);
			});
		});
	});

	describe("extend", function() {
		it("$common.extend(source, dest) source merged on dest", function() {
			bogu.module(["$common"], function($common) {
				var dest = {
					a: 19,
					b: "Hello",
					c: 23
				};
				var source = {
					c: 10,
					d: 28
				};
				$common.extend(dest, source);
				expect(dest).toEqual({
					a: 19,
					b: "Hello",
					c: 10,
					d: 28
				});
			});
		});
		it("$common.extend complex object", function() {
			bogu.module(["$common"], function($common) {
				var dest = {
					a: 19,
					b: {
						b1: 10
					},
					c: 23
				};
				var source = {
					c: 10,
					b: {
						b1: 20,
						c1: "Hello"
					},
					d: 28
				};
				$common.extend(dest, source);
				expect(dest).toEqual({
					a: 19,
					b: {
						b1: 20,
						c1: "Hello"
					},
					c: 10,
					d: 28
				});
			});
		});
	});
});