var util = require("./util.js");
var Container = require("./container.js");

function Connection(storageURL, authToken) {
	this.storageURL = storageURL;
	this.requestor = util.getHTTPRequestorForURL(storageURL);
	this.authToken = authToken;
}

Connection.prototype.makeRequest = function(options, callback) {
	var headers = options.headers || {};
	headers["x-auth-token"] = this.authToken;
	if(options.contents)
		headers["content-length"] = options.contents.length;
	var req = this.requestor.request({
		hostname: this.storageURL.hostname,
		port: this.storageURL.port,
		protocol: this.storageURL.protocol,
		path: this.storageURL.path + "/" + options.url,
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
		callback(false, {}, e);
	});
	req.end(options.contents);
	return req;
}

Connection.prototype.getContaioner = function(name) {
	return new Container(this, name);
}

module.exports = Connection;