describe("Bogu $observer module", function() {

	describe("Objects", function() {
		it("make observable simple object", function() {
			bogu.module(["$observer"], function($observer) {
				var obj = $observer.makeObservable({
					a: 10,
					message: "Hello world!"
				});
				var settedVal = "NONE";
				obj.on("message", function(newVal, oldVal) {
					settedVal = "message setted";
				});
				obj.message = "Hello!";
				expect(obj.message).toEqual("Hello!");
				expect(settedVal).toEqual("message setted");

			});
		});

		it("make observable with inner objects", function() {
			bogu.module(["$observer"], function($observer) {
				var obj = $observer.makeObservable({
					age: 38,
					name: "Roberto",
					address: {
						city: "Livorno",
						street: "V.le del Risorgimento"
					}
				});
				var nameChanged = "NONE";
				obj.on("name", function() {
					nameChanged = "name changed";
				});
				var streetChanged = "NONE";
				obj.address.on("street", function() {
					streetChanged = "street changed";
				});
				obj.name = "Robert";
				obj.address.street = "V.le del Risorgimento, 132";
				expect(nameChanged).toEqual("name changed");
				expect(streetChanged).toEqual("street changed");
			});
		});

		it("observable check new / old Values", function(){
			bogu.module(["$observer"], function($observer){
				var obj = $observer.makeObservable({
					name: "Robert"
				});
				var _oldVal = "NONE";
				var _newVal = "NONE";
				obj.on("name", function(newVal, oldVal){
					_newVal = newVal;
					_oldVal = oldVal;
				});
				obj.name = "Bob";
				expect(_oldVal).toEqual("Robert");
				expect(_newVal).toEqual("Bob");
			});
		});
		
		it("make observable adding property", function() {
			bogu.module(["$observer"], function($observer) {
				var obj = $observer.makeObservable({
					age: 38,
					name: "Roberto",
				});
				var newProperty = "NONE";
				obj.on("lastName", function(newVal) {
					newProperty = "lastName Setted: " + newVal;
				});

				obj.addObservableProperty("lastName", "");
				obj.lastName = "Ughi";

				expect(obj.lastName).toEqual("Ughi");
				expect(newProperty).toEqual("lastName Setted: Ughi");
			});
		});
		
	});
	describe("Arrays", function() {
		it("make observable array push function", function() {
			bogu.module(["$observer"], function($observer) {
				var ary = $observer.makeObservable([1, 2, 3, 4]);
				var arrayLengthChanged = "NONE";
				ary.on("change", function(newVal, oldVal) {
					arrayLengthChanged = "Array Changed";
				});
				ary.push(5);
				expect(ary.length).toEqual(5);
				expect(arrayLengthChanged).toEqual("Array Changed");
			});
		});
	});

});