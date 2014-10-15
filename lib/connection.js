var stream = require("stream");
var fs = require("fs");
var util = require("./util.js");
var Container = require("./container.js");

function Connection(storageURL, authToken) {
	this.storageURL = storageURL;
	this.requestor = util.getHTTPRequestorForURL(storageURL);
	this.authToken = authToken;
}

Connection.prototype.makeRequest = function(options, callback) {
	var self = this;
	
	var headers = options.headers || {};
	headers["x-auth-token"] = this.authToken;
	
	function makeActualRequest() {
		var req = self.requestor.request({
			hostname: self.storageURL.hostname,
			port: self.storageURL.port,
			protocol: self.storageURL.protocol,
			path: self.storageURL.path + "/" + options.url,
			method: options.method || "GET",
			headers: headers
		}, function(resp) {
			var body = "";
			resp.setEncoding("utf8");
			resp.on("data", function(chunk) {
				body += chunk;
			});
			resp.on("end", function() {
				var headers = resp.headers;
				headers.status = resp.statusCode;
				callback(resp.statusCode >= 200 && resp.statusCode < 300, body, headers);
			});
		});
		
		req.on("error", function(e) {
			callback(false, e);
		});
		
		return req;
	}
	
	if(options.src) {
		fs.stat(options.src, function(err, stats) {
			if(err)
				return callback(false, err);
			if(!stats.isFile())
				return callback(false, "Not a file");

			headers["content-length"] = stats.size;
			var req = makeActualRequest();
			var stream = fs.createReadStream(options.src);
			stream.on("data", function(chunk) {
				req.write(chunk);
			});
			stream.on("end", function() {
				req.end();
			});
			stream.resume();
		});
	} else if(options.contents) {
		headers["content-length"] = options.contents.length;
		makeActualRequest().end(options.contents);
	} else {
		makeActualRequest().end();
	}
}

Connection.prototype.getContainer = function(name) {
	return new Container(this, name);
}

module.exports = Connection;