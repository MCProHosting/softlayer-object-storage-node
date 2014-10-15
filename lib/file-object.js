function FileObject(container, name) {
	this.__container = container;
	this.__name = name;
}

FileObject.prototype.put = function(options, callback) {
	var req = this.__container.__connection.__makeRequest({
		url: this.__container.__name + "/" + this.__name,
		method: "PUT",
		contents: options.contents,
		src: options.src
	}, callback);
}

FileObject.prototype.delete = function(callback) {
	var req = this.__container.__connection.__makeRequest({
		url: this.__container.__name + "/" + this.__name,
		method: "DELETE"
	}, callback);
}

FileObject.prototype.get = function(callback) {
	var req = this.__container.__connection.__makeRequest({
		url: this.__container.__name + "/" + this.__name
	}, callback);
}

module.exports = FileObject;