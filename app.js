var storage = require("./lib/main.js");
var config = require("./config.js");

storage.login(config.endpoint, config.username, config.api_key,  function(connection) {
	var container = connection.getContaioner(config.container);
	container.put({
		filename: "test/test.txt",
		contents: "hai"
	}, function(success, body) {
		console.log("P", success, body);
		container.get({
			filename: "test/test.txt"
		}, function(success, body) {
			console.log("D", success, body);
		});
	});
});