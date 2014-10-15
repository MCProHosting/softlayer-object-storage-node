var stream = require("stream");
var fs = require("fs");
var util = require("./util.js");
var Container = require("./container.js");

function Connection(storageURL, authToken) {
	this.__storageURL = storageURL;
	this.__requestor = util.getHTTPRequestorForURL(storageURL);
	this.__authToken = authToken;
}

Connection.prototype.__makeRequest = function(options, callback) {
	var self = this;
	
	options = options || {};
	
	var headers = options.headers || {};
	headers["x-auth-token"] = this.__authToken;
	
	function makeActualRequest() {
		var req = self.__requestor.request({
			hostname: self.__storageURL.hostname,
			port: self.__storageURL.port,
			protocol: self.__storageURL.protocol,
			path: self.__storageURL.path + "/" + (options.url || ""),
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

Connection.prototype.listContainers = function(callback) {
	this.__makeRequest(null, function(success, body, headers) {
		if(!success)
			return callback(false, body);
		var containers = [];
		var names = body.trim().split("\n");
		for(var i = 0; i < names.length; i++)
			containers.push(new Container(this, names[i]));
		callback(true, containers);
	});
}

module.exports = Connection;