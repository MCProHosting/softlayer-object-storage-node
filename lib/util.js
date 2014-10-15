var http = require("http");
var https = require("https");

module.exports = {
	getHTTPRequestorForURL: function(url) {
		switch(url.protocol) {
			case "http:":
				return http;
				break;
			case "https:":
				return https;
				break;
			default:
				throw new Error("Invalid protocol: " + options.protocol);
		}	
	}
};