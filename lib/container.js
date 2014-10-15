function Container(connection, name) {
	this.__connection = connection;
	this.__name = name;
}

Container.prototype.putFile = function(options, callback) {
	var req = this.__connection.__makeRequest({
		url: this.__name + "/" + options.filename,
		method: "PUT",
		contents: options.contents,
		src: options.src
	}, callback);
}

Container.prototype.deleteFile = function(options, callback) {
	var req = this.__connection.__makeRequest({
		url: this.__name + "/" + options.filename,
		method: "DELETE"
	}, callback);
}

Container.prototype.getFile = function(options, callback) {
	var req = this.__connection.__makeRequest({
		url: this.__name + "/" + options.filename
	}, callback);
}

Container.prototype.listFiles = function(options, callback) {
	var req = this.__connection.__makeRequest({
		url: this.__name
	}, function(success, body, headers) {
		if(!success)
			return callback(false, body);
		callback(true, body.trim().split("\n"));
	});
}

module.exports = Container;