var url = require("url");
var util = require("./util.js");
var Connection = require("./connection.js");

module.exports = {
	login: function(endpoint, username, apiKey, callback) {
		var options = url.parse(endpoint);
		options.headers = {
			"x-auth-user": username,
			"x-auth-key": apiKey
		};
		util.getHTTPRequestorForURL(options).get(options, function(resp) {
			callback(new Connection(url.parse(resp.headers["x-storage-url"]), resp.headers["x-auth-token"]));
		}).on("error", function() {
			callback(null);
		});
	},
	create: function(storageURL, authToken) {
		return new Connection(storageURL, authToken);
	}
};