describe("Bog $deferred module", function(){
	it("resolve promise", function(done){
		bogu.module(["$d", "$common"], function($d, $common){
			function testPromise(){
				var defer = $d.deferred();

				$common.delay(500, function(){
					defer.resolve("DONE");
				});

				return defer.promise;
			};

			var p = testPromise();
			var dataAsync = "NONE";
			p.then(function(data){
				dataAsync = data;
				expect(dataAsync).toEqual("DONE")
				done();
			});
			expect(dataAsync).toEqual("NONE");
		});
	});

	it("reject promise", function(done){
		bogu.module(["$d", "$common"], function($d, $common){
			function testPromise(){
				var defer = $d.deferred();

				$common.delay(500, function(){
					defer.reject("REJECT");
				});

				return defer.promise;
			};

			var p = testPromise();
			var dataAsync = "NONE";
			p.then(function(data){
				dataAsync = data;
				expect(dataAsync).toEqual("DONE")
				done();
			}, function(data){
				dataAsync = data;
				expect(dataAsync).toEqual("REJECT")
				done();
			});
			expect(dataAsync).toEqual("NONE");
		});
	});

});