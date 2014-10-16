var FileObject = require("./file-object.js");

function Container(connection, name) {
	this.connection = connection;
	this.name = name;
}

Container.prototype.getFile = function(name) {
	return new FileObject(this, name);
}

Container.prototype.listFiles = function(callback) {
	this.connection.makeRequest({
		url: this.name
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