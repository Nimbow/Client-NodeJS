# Nimbow node.js Client

This is the official node.js client for the Nimbow API (http://www.nimbow.com).

You find the complete API documentation here: https://www.nimbow.com/sms-api/nimbow-api/

NPM-Package: https://www.npmjs.com/package/nimbow-client


## Install

```Console
npm install nimbow-client
```


## Usage

### Simple SMS sending

```javascript
var apiKey = "YOUR-API-KEY";
var protocol = "https"; // or http
var testMode = false; // optional; set to true if you want to send a test messages (no delivery, no cost, but visible in your portal)

require("nimbow-client")
	.create(apiKey, protocol, testMode)
	.sendTextMessage("Sender", "491771234567", "Hello World!");
```

### Send flash SMS

```javascript
var apiKey = "YOUR-API-KEY";
var protocol = "https"; // or http

require("nimbow-client")
	.create(apiKey, protocol)
	.sendTextMessage("Sender", "491771234567", "Hello World!", {Flash: true});
```

### Set a client reference

```javascript
var apiKey = "YOUR-API-KEY";
var protocol = "https"; // or http

require("nimbow-client")
	.create(apiKey, protocol)
	.sendTextMessage("Sender", "491771234567", "Hello World!", {ClientRef: "My Campaign"});
	
// in your Nimbow portal you can configure a DeliveryReport Callback URL; this will receive the ClientRef from above...
```

### Unicode SMS sending

```javascript
var apiKey = "YOUR-API-KEY";
var protocol = "https"; // or http

require("nimbow-client")
	.create(apiKey, protocol)
	.sendUnicodeTextMessage("Sender", "491771234567", "привет");
```

### Inspect response

```javascript
var apiKey = "YOUR-API-KEY";
var protocol = "https"; // or http

require("nimbow-client")
	.create(apiKey, protocol)
	.sendTextMessage(
		"Sender",
		"491771234567", 
		"Hello World!",
		{GetMessageId: true},
		function(error, apiResponse) {
			console.log("StatusCode: " + apiResponse.StatusCode + " MessageId: " + apiResponse.MessageId)
		}
	);
```