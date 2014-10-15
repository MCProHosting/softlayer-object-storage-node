var storage = require("./lib/main.js");
var config = require("./config.js");

storage.login(config.endpoint, config.username, config.api_key,  function(connection) {
	connection.listContainers(function(success, containers) {
		console.log("LC", success, containers.length);
	});
	var container = connection.getContainer(config.container);
	container.listFiles(function(success, files) {
		console.log("LF", success, files);
	});
	container.putFile({
		filename: "test/test.txt",
		contents: "Test"
	}, function(success, body) {
		console.log("P", success, body);
		container.getFile({
			filename: "test/test.txt"
		}, function(success, body) {
			console.log("G", success, body);
		});
	});
});