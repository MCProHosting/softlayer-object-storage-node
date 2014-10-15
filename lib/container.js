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
		url: this.__name + "/" + options.filename,
		method: "GET"
	}, callback);
}

module.exports = Container;