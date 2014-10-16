function FileObject(container, name) {
	this.container = container;
	this.name = name;
}

FileObject.prototype.put = function(options, callback) {
	this.container.connection.makeRequest({
		url: this.container.name + "/" + this.name,
		method: "PUT",
		contents: options.contents,
		src: options.src
	}, callback);
}

FileObject.prototype.delete = function(callback) {
	this.container.connection.makeRequest({
		url: this.container.name + "/" + this.name,
		method: "DELETE"
	}, callback);
}

FileObject.prototype.get = function(callback) {
	this.container.connection.makeRequest({
		url: this.container.name + "/" + this.name
	}, callback);
}

module.exports = FileObject;