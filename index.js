var https = require("https");
var http = require("http");
var queryString = require("querystring");
var headers = {"Content-Type":"application/json","Accept":"application/json"};

String.prototype.lpad = function(padString, length) {
	var str = this;
	while (str.length < length)
		str = padString + str;
	return str;
};

var NimbowClient = function(apiKey, protocol, testMode, debugMode){
	var useHttps = protocol && protocol === "https";
	var baseParams = {key: apiKey};
	if(testMode && testMode == true) {
		baseParams.test = true;
	}
	var sendSmsPath = "/sms/?" + queryString.stringify(baseParams);
	
	function log(logMessage) {
		if (logMessage instanceof Error) console.log(logMessage.stack);
		if (debugMode) {
			if (typeof logMessage === "object") {
				console.dir(logMessage);
			} else {
				console.log(logMessage);
			}
		}
	}
	
	function sendRequest(path, method, callback) {
		var options= {
			host: "api.nimbow.com",
    		port: useHttps ? 443 : 80,
    		path: path,
    		method: method,
    		headers: headers
		};
		
		var responseCallback = function(response) {
			var responseReturn = "";
			response.setEncoding("utf8"); 
			response.on("data", function(chunk) {
        		responseReturn += chunk;
			});			
			response.on("end", function() { 
				log("response ended");
				if (callback) {
					var jsonResponse = responseReturn;
					var error = null;
					try {
					jsonResponse = JSON.parse(responseReturn);
					} catch (parseException) {
						log(parseException);
						log("Response wasn't proper JSON, returning raw response to client");
						error = parseException;
					}
					callback(error, jsonResponse);
				}
			})
			response.on("close", function(e) {
				log("server closed API request; detailed stacktrace below ");
				log(e);
				callback(e);
			});
		};
		
		log("executing " + options.method + " request to " + options.host + ":" + options.port + options.path);
		
		var request;
		if(useHttps) {
			request = https.request(options, responseCallback);
		} else {
			request = http.request(options, responseCallback);
		}
		request.end();		
		
		request.on("error", function(e) {
			log("error on API request; detailed stacktrace below ");
			log(e);
			callback(e);
		});
	}
	
	function sendMessage(message, returnOptions, callback) {
		var path = sendSmsPath + "&" + queryString.stringify(message);
		if (returnOptions) {
			path = path +  "&" + queryString.stringify(returnOptions);
		}
		
		sendRequest(path, "GET", function(error, apiResponse) {
			if (!error && apiResponse.StatusCode && apiResponse.StatusCode > 0) {
				tryHandleError(callback, new Error("Nimbow returned StatusCode " + apiResponse.StatusCode), apiResponse);
			} else if (callback) {
				callback(error, apiResponse);
			}
		});
	}
	
	function tryHandleError(callback, error, returnData) {
		if (callback) {
			callback(error, returnData);
		} else {
			throw error;
		}
	}
	
	function sendTextMessage(from, to, text, returnOptions, callback) {
		sendMessage({from: from, to: to, text: text}, returnOptions, callback)
	}
	
	function sendUnicodeTextMessage(from, to, text, returnOptions, callback) {
		var unicodeDigits = stringToUnicodeCodePoints(text);
		sendMessage({from: from, to: to, text: unicodeDigits, type: "unicode"}, returnOptions, callback)
	}
	
	function stringToUnicodeCodePoints(text) {
		var codePoints = "";
		for (var i = 0, length = text.length; i < length; i++) {
  			codePoints = codePoints + text.codePointAt(i).toString(16).lpad("0", 4);
		}
		return codePoints.toUpperCase();
	}
	
	return {
		sendTextMessage: sendTextMessage,
		sendUnicodeTextMessage: sendUnicodeTextMessage
	};
};

exports.create = NimbowClient;