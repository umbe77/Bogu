describe("Bogu $cache module", function(){
	it ("test function", function(){
		bogu.module(["$cache"], function($cache){
			var c = $cache();
			console.log(c);
			expect(true).toEqual(true);
		});
	});
});