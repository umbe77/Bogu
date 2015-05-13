describe("bogu", function() {

	beforeEach(function() {
		bogu.module("ModuleA", function() {
			return {
				name: "ModuleA"
			};
		});
		bogu.module("ModuleB", function() {
			return {
				name: "ModuleB"
			};
		});
	});

	it("should be Dependency Injection", function(){
		var c = bogu.module(["ModuleA", "ModuleB"], function(moduleA, moduleB){

			expect(moduleA.name).toEqual("ModuleA");
			expect(moduleB.name).toEqual("ModuleB");

			return {
				name: "ModuleC"
			};
		});
	});
});