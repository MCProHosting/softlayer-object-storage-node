function Container(connection, name) {
	this.connection = connection;
	this.name = name;
}

Container.prototype.put = function(options, callback) {
	var req = this.connection.makeRequest({
		url: this.name + "/" + options.filename,
		method: "PUT",
		contents: options.contents,
		src: options.src
	}, callback);
}

Container.prototype.delete = function(options, callback) {
	var req = this.connection.makeRequest({
		url: this.name + "/" + options.filename,
		method: "DELETE"
	}, callback);
}

Container.prototype.get = function(options, callback) {
	var req = this.connection.makeRequest({
		url: this.name + "/" + options.filename,
		method: "GET"
	}, callback);
}

module.exports = Container;