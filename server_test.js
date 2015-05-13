var http = require("http"),
	url = require("url"),
	path = require("path"),
	fs = require("fs");

var mimes = {
	"html": "text/html",
	"js": "text/javascript",
	"png": "image/png",
	"css": "text/css"
};

http.createServer(function(req, res) {
	var uri = url.parse(req.url).pathname;
	//console.log(uri);
	if (uri === "/test/ajax" || uri === "/test/ajax/error") {

		var responseData = {
			headers: req.headers,
			url: req.url,
			method: req.method
		};

		var body = "";

		req.on("data", function(chunk) {
			body += chunk.toString();
		});

		req.on("end", function() {
			responseData.body = body;
			var httpResponseStatus = 200;
			if (uri === "/test/ajax/error") {
				httpResponseStatus = 500;
			}
			var responseDataString = JSON.stringify(responseData);
			console.log(responseDataString);
			res.writeHead(httpResponseStatus, {
				"Content-Length": responseDataString.length,
				"Content-Type": "application/json",
				"X-CustomHeader": "CustomValue"
			});
			res.end(responseDataString);
		});
	} else {
		var basePath = __dirname.replace("testserver", "");
		var fileName = path.join(basePath, uri);
		fs.exists(fileName, function(exists) {
			if (!exists) {
				res.writeHead(404, {
					'Content-Type': 'text/plain'
				});
				res.write('404 Not Found\n');
				res.end();
				return;
			}
			var mimeType = mimes[path.extname(fileName).split(".")[1]];
			res.writeHead(200, {
				"Content-Type": mimeType
			});
			var fileStream = fs.createReadStream(fileName);
			fileStream.pipe(res);
		});
	}

}).listen(8181, 'localhost');
console.log("Server Started!");