describe("BVogu $ajax module", function() {
	describe("ajax internal callback", function() {
		it("GET Methd, success", function(done) {
			bogu.module(["$ajax"], function($ajax) {
				$ajax({
					url: "/test/ajax",
					method: "GET",
					success: function(data) {
						expect(data.method).toEqual("GET");
						expect(data.body).toEqual("");
						done();
					}
				});
			});
		});
		it("POST Methd, success", function(done) {
			bogu.module(["$ajax"], function($ajax) {
				$ajax({
					url: "/test/ajax",
					method: "POST",
					data: {
						message: "Hello"
					},
					success: function(data) {
						expect(data.method).toEqual("POST");
						expect(data.body).toEqual(JSON.stringify({
							message: "Hello"
						}));
						done();
					}
				});
			});
		});
		it("PUT Methd, success", function(done) {
			bogu.module(["$ajax"], function($ajax) {
				$ajax({
					url: "/test/ajax",
					method: "PUT",
					data: {
						message: "Hello"
					},
					success: function(data) {
						expect(data.method).toEqual("PUT");
						expect(data.body).toEqual(JSON.stringify({
							message: "Hello"
						}));
						done();
					}
				});
			});
		});
		it("DELETE Methd, success", function(done) {
			bogu.module(["$ajax"], function($ajax) {
				$ajax({
					url: "/test/ajax",
					method: "DELETE",
					data: {
						message: "Hello"
					},
					success: function(data) {
						expect(data.method).toEqual("DELETE");
						expect(data.body).toEqual(JSON.stringify({
							message: "Hello"
						}));
						done();
					}
				});
			});
		});
	});
	describe("ajax using shortcut methods", function() {
		it("GET short method, success", function(done) {
			bogu.module(["$ajax"], function($ajax) {
				$ajax.get("/test/ajax", null, function(data) {
					expect(data.method).toEqual("GET");
					expect(data.body).toEqual("");
					done();
				});
			});
		});
		it("POST short method, success", function(done) {
			bogu.module(["$ajax"], function($ajax) {
				$ajax.post("/test/ajax", {
					message: "Hello"
				}, function(data) {
					expect(data.method).toEqual("POST");
					expect(data.body).toEqual(JSON.stringify({
						message: "Hello"
					}));
					done();
				});
			});
		});
		it("PUT short method, success", function(done) {
			bogu.module(["$ajax"], function($ajax) {
				$ajax.put("/test/ajax", {
					message: "Hello"
				}, function(data) {
					expect(data.method).toEqual("PUT");
					expect(data.body).toEqual(JSON.stringify({
						message: "Hello"
					}));
					done();
				});
			});
		});
		it("DELETE short method, success", function(done) {
			bogu.module(["$ajax"], function($ajax) {
				$ajax.delete("/test/ajax", {
					message: "Hello"
				}, function(data) {
					expect(data.method).toEqual("DELETE");
					expect(data.body).toEqual(JSON.stringify({
						message: "Hello"
					}));
					done();
				});
			});
		});
	});
	describe("ajax returns as promises", function() {
		it("GET Method, success", function(done) {
			bogu.module(["$ajax"], function($ajax) {
				$ajax({
					url: "/test/ajax",
					method: "GET"
				}).then(function(response) {
					expect(response.data.method).toEqual("GET");
					expect(response.data.body).toEqual("");
					done();
				});
			});
		});
		it("POST Method, success", function(done) {
			bogu.module(["$ajax"], function($ajax) {
				$ajax({
					url: "/test/ajax",
					method: "POST",
					data: {
						message: "Hello"
					}
				}).then(function(response) {
					expect(response.data.method).toEqual("POST");
					expect(response.data.body).toEqual(JSON.stringify({
						message: "Hello"
					}));
					done();
				});
			});
		});
		it("PUT Method, success", function(done) {
			bogu.module(["$ajax"], function($ajax) {
				$ajax({
					url: "/test/ajax",
					method: "PUT",
					data: {
						message: "Hello"
					}
				}).then(function(response) {
					expect(response.data.method).toEqual("PUT");
					expect(response.data.body).toEqual(JSON.stringify({
						message: "Hello"
					}));
					done();
				});
			});
		});
		it("DELETE Method, success", function(done) {
			bogu.module(["$ajax"], function($ajax) {
				$ajax({
					url: "/test/ajax",
					method: "DELETE",
					data: {
						message: "Hello"
					}
				}).then(function(response) {
					expect(response.data.method).toEqual("DELETE");
					expect(response.data.body).toEqual(JSON.stringify({
						message: "Hello"
					}));
					done();
				});
			});
		});
	});
});