var http = require("http");
var https = require("https");
var url = require("url");

function _getHTTPRequestorForURL(url) {
	switch(url.protocol) {
		case "http:":
			return http;
			break;
		case "https:":
			return https;
			break;
		default:
			throw new Error("Invalid protocol: " + options.protocol);
	}	
}

function SLObjectStorageConnection(storageURL, authToken) {
	this.storageURL = storageURL;
	this.requestor = _getHTTPRequestorForURL(storageURL);
	this.authToken = authToken;
}

SLObjectStorageConnection.prototype._makeRequest = function(options, callback) {
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

SLObjectStorageConnection.prototype.getContaioner = function(name) {
	return new SLObjectStorageContainer(this, name);
}

function SLObjectStorageContainer(connection, name) {
	this.connection = connection;
	this.name = name;
}

SLObjectStorageContainer.prototype.put = function(options, callback) {
	var req = this.connection._makeRequest({
		url: this.name + "/" + options.filename,
		method: "PUT",
		contents: options.contents
	}, callback);
}

SLObjectStorageContainer.prototype.delete = function(options, callback) {
	var req = this.connection._makeRequest({
		url: this.name + "/" + options.filename,
		method: "DELETE"
	}, callback);
}

SLObjectStorageContainer.prototype.get = function(options, callback) {
	var req = this.connection._makeRequest({
		url: this.name + "/" + options.filename,
		method: "GET"
	}, callback);
}

module.exports = {
	login: function(endpoint, username, APIKey, callback) {
		var options = url.parse(endpoint);
		options.headers = {
			"x-auth-user": username,
			"x-auth-key": APIKey
		};
		var requestor = _getHTTPRequestorForURL(options);
		requestor.get(options, function(resp) {
			callback(new SLObjectStorageConnection(url.parse(resp.headers["x-storage-url"]), resp.headers["x-auth-token"]));
		}).on("error", function() {
			callback(null);
		});
	},
	create: function(storageURL, authToken) {
		return new SLObjectStorageConnection(storageURL, authToken);
	}
};