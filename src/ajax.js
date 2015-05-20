/*
 *
 *   Gestione delle Chiamate REST al server.. Implementato con le promesse
 *
 *
 *
 */

bogu.module("$ajax", ["$common", "$d"], function($common, $d) {

	//This Module return a function that return a promise
	function Ajax(config) {

		var defOptions = {
			url: "",
			type: "json",
			data: {},
			async: true,
			method: "GET",
			headers: {
				"Content-Type": "application/json"
			},
			success: function(data, headers, xhr) {},
			error: function(error, headers, xhr) {},
			complete: function(data, headers, xhr) {}
		};
		//Creare una function in commmon per estendere/clonare gli oggetti.
		var options = $common.extend(defOptions, config);

		/*Private Functions*/

		function formatUrlParams() {
			var re = /{[a-zA-Z0-9]+}/g;
			var matches;
			while ((matches = re.exec(options.url)) !== null) {
				var placeholder = matches[0];
				var placeholderKey = placeholder.replace("{", "").replace("}", "");
				if (options.data[placeholderKey]) {
					var val = options.data[placeholderKey];
					if (typeof val === "object") {
						val = JSON.stringify(val);
					}
					options.url = options.url.replace(placeholder, encodeURIComponent(val));
					delete options.data[placeholderKey];
				}
			}
		}

		function formatBody() {

			if (options.method.toUpperCase() === "GET") {
				return null;
			}

			if (options.type.toLowerCase() === "json") {
				return JSON.stringify(options.data);
			}
			return options.data;
		}

		function formatResponse(isError) {
			var _headers = {};
			xhr.getAllResponseHeaders().split("\n").forEach(function(header) {
				var breakIndex = header.indexOf(":");
				if (breakIndex >= 0) {
					var headerName = header.substring(0, breakIndex).trim();
					var headerValue = header.substring(breakIndex + 1).trim();

					_headers[headerName] = headerValue;
				}
			});

			var _data = null,
				_error = null;

			var response = xhr.response;
			if (options.type.toLowerCase() === "json") {
				try {
					response = JSON.parse(xhr.response);
				} catch (err) {
					console.log(err);
					throw err;
				}
			}

			if (isError) {
				_error = response;
			} else {
				_data = response;
			}

			var response = {
				data: _data,
				error: _error,
				headers: _headers,
				xhr: xhr
			};

			return response;
		}

		function onLoad(event) {
			if (xhr.status >= 400) {
				defer.reject(formatResponse(true));
			} else {
				defer.resolve(formatResponse(false));
			}
		}

		function onError(event) {
			defer.reject(formatResponse(true));
		}

		function onAbort(event) {
			defer.reject(formatResponse(true));
		}

		/*END Private Functions*/
		var xhr = new XMLHttpRequest();
		xhr.addEventListener("load", onLoad, false);
		xhr.addEventListener("error", onError, false);
		xhr.addEventListener("abort", onAbort, false);

		var defer = $d.deferred();
		var promise = defer.promise;
		promise.then(function(response) {
				options.success(response.data, response.headers, xhr)
				options.complete(response.data, response.headers, xhr)
			},
			function(response) {
				options.error(response.error, response.headers, xhr)
				options.complete(response.data, response.headers, xhr)
			});

		formatUrlParams();

		xhr.open(options.method, options.url, options.async);

		for (var header in options.headers) {
			xhr.setRequestHeader(header, options.headers[header]);
		}

		xhr.send(formatBody());

		return promise;
	};

	["get", "post", "put", "patch", "delete", "head", "options"].forEach(function(verb) {
		Ajax[verb] = function(url, data, successCallback) {

			var config = {
				url: url,
				data: data || {},
				method: verb.toUpperCase()
			};

			if (successCallback) {
				config.success = successCallback;
			}

			return Ajax(config);
		}
	});

	return Ajax;

});