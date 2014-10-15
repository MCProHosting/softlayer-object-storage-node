var FileObject = require("./file-object.js");

function Container(connection, name) {
	this.__connection = connection;
	this.__name = name;
}

Container.prototype.getFile = function(name) {
	return new FileObject(this, name);
}

Container.prototype.listFiles = function(callback) {
	var req = this.__connection.__makeRequest({
		url: this.__name
	}, function(success, body, headers) {
		if(!success)
			return callback(false, body);
		var fileObjects = [];
		var names = body.trim().split("\n");
		for(var i = 0; i < names.length; i++)
			fileObjects.push(new FileObject(this, names[i]));
		callback(true, fileObjects);
	});
}

module.exports = Container;