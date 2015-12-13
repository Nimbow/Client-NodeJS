var assert = require("assert");
var sinon = require("sinon");
var PassThrough = require("stream").PassThrough;
var http = require("http");

var NimbowClient = require("../index.js");

describe("nimbow-client sendTextMessage", function(){
	beforeEach(function(){
		this.httpMock = sinon.mock(http);
	});
	
	afterEach(function(){
		this.httpMock.restore();
	});
	
	it("should execute get request in test mode", function(done){
		var expected = { StatusCode: 0 };
		var response = new PassThrough();
		response.write(JSON.stringify(expected));
		response.end();
		
		var request = new PassThrough();		
		this.httpMock
			.expects("request")
			.once()
			.withArgs(sinon.match.has("path", sinon.match(/&test=true/)))
			.callsArgWith(1, response)
			.returns(request);
		
		var sut = NimbowClient.create("test-api-key", "http", 1);
		sut.sendTextMessage("me", "49177229839", "hello world!", null, function(error, apiResponse){
			assert.deepEqual(apiResponse, expected);
			done();
		});
	});
	
	it("should execute get request and pass paramters", function(done){
		var expected = { StatusCode: 0 };
		var response = new PassThrough();
		response.write(JSON.stringify(expected));
		response.end();
		
		var request = new PassThrough();		
		this.httpMock
			.expects("request")
			.once()
			.withArgs(
				sinon.match.has("path", sinon.match(/\?key=test-api-key/))
				.and(sinon.match.has("path", sinon.match(/&test=true/)))
				.and(sinon.match.has("path", sinon.match(/&from=me/)))
				.and(sinon.match.has("path", sinon.match(/&to=49177229839/)))
				.and(sinon.match.has("path", sinon.match(/&text=hello%20world!/)))
			)
			.callsArgWith(1, response)
			.returns(request);
		
		var sut = NimbowClient.create("test-api-key", "http", 1);
		sut.sendTextMessage("me", "49177229839", "hello world!", null, function(error, apiResponse){
			assert.deepEqual(apiResponse, expected);
			done();
		});
	});
	
	it("should execute get request and pass additional paramters", function(done){
		var expected = { StatusCode: 0 };
		var response = new PassThrough();
		response.write(JSON.stringify(expected));
		response.end();
		
		var request = new PassThrough();		
		this.httpMock
			.expects("request")
			.once()
			.withArgs(
				sinon.match.has("path", sinon.match(/&GetMessageId=true/))
				.and(sinon.match.has("path", sinon.match(/&GetMessageParts=true/)))
				.and(sinon.match.has("path", sinon.match(/&GetFrom=true/)))
				.and(sinon.match.has("path", sinon.match(/&GetTo=true/)))
				.and(sinon.match.has("path", sinon.match(/&GetCost=true/)))
			)
			.callsArgWith(1, response)
			.returns(request);
		
		var sut = NimbowClient.create("test-api-key", "http", 1);
		sut.sendTextMessage("me", "49177229839", "hello world!", {GetMessageId: true, GetMessageParts: true, GetFrom: true, GetTo: true, GetCost: true}, function(error, apiResponse){
			assert.deepEqual(apiResponse, expected);
			done();
		});
	});
	
	it("should execute get request and pass additional paramters when false", function(done){
		var expected = { StatusCode: 0 };
		var response = new PassThrough();
		response.write(JSON.stringify(expected));
		response.end();
		
		var request = new PassThrough();		
		this.httpMock
			.expects("request")
			.once()
			.withArgs(
				sinon.match.has("path", sinon.match(/&GetMessageId=false/))
				.and(sinon.match.has("path", sinon.match(/&GetMessageParts=false/)))
				.and(sinon.match.has("path", sinon.match(/&GetFrom=false/)))
				.and(sinon.match.has("path", sinon.match(/&GetTo=false/)))
				.and(sinon.match.has("path", sinon.match(/&GetCost=false/)))
			)
			.callsArgWith(1, response)
			.returns(request);
		
		var sut = NimbowClient.create("test-api-key", "http", 1);
		sut.sendTextMessage("me", "49177229839", "hello world!", {GetMessageId: false, GetMessageParts: false, GetFrom: false, GetTo: false, GetCost: false}, function(error, apiResponse){
			assert.deepEqual(apiResponse, expected);
			done();
		});
	});
	
	it("should execute get request and only pass additional paramters which are defined", function(done){
		var expected = { StatusCode: 0 };
		var response = new PassThrough();
		response.write(JSON.stringify(expected));
		response.end();
		
		var request = new PassThrough();		
		this.httpMock
			.expects("request")
			.once()
			.withArgs(
				sinon.match.has("path", sinon.match(/&GetMessageId=true/))
				.and(sinon.match.has("path", sinon.match(/&GetMessageParts=false/)))
				.and(sinon.match.has("path", sinon.match(/^((?!&GetFrom=).)*$/)))
				.and(sinon.match.has("path", sinon.match(/^((?!&GetTo=).)*$/)))
				.and(sinon.match.has("path", sinon.match(/&GetCost=false/)))
			)
			.callsArgWith(1, response)
			.returns(request);
		
		var sut = NimbowClient.create("test-api-key", "http", 1);
		sut.sendTextMessage("me", "49177229839", "hello world!", {GetMessageId: true, GetMessageParts: false, GetCost: false}, function(error, apiResponse){
			assert.deepEqual(apiResponse, expected);
			done();
		});
	});
	
	it("should execute get request and not pass additional parameters if null", function(done){
		var expected = { StatusCode: 0 };
		var response = new PassThrough();
		response.write(JSON.stringify(expected));
		response.end();
		
		var request = new PassThrough();		
		this.httpMock
			.expects("request")
			.once()
			.withArgs(
				sinon.match.has("path", sinon.match(/^((?!&GetMessageId=).)*$/))
				.and(sinon.match.has("path", sinon.match(/^((?!&GetMessageParts=).)*$/)))
				.and(sinon.match.has("path", sinon.match(/^((?!&GetFrom=).)*$/)))
				.and(sinon.match.has("path", sinon.match(/^((?!&GetTo=).)*$/)))
				.and(sinon.match.has("path", sinon.match(/^((?!&GetCost=).)*$/)))
			)
			.callsArgWith(1, response)
			.returns(request);
		
		var sut = NimbowClient.create("test-api-key", "http", 1);
		sut.sendTextMessage("me", "49177229839", "hello world!", null, function(error, apiResponse){
			assert.deepEqual(apiResponse, expected);
			done();
		});
	});
});

describe("nimbow-client sendUnicodeTextMessage", function(){
	beforeEach(function(){
		this.httpMock = sinon.mock(http);
	});
	
	afterEach(function(){
		this.httpMock.restore();
	});
	
	it("should execute get request and convert text to unicode code points", function(done){
		var expected = { StatusCode: 0 };
		var response = new PassThrough();
		response.write(JSON.stringify(expected));
		response.end();
		
		var request = new PassThrough();		
		this.httpMock
			.expects("request")
			.once()
			.withArgs(
				sinon.match.has("path", sinon.match(/\?key=test-api-key/))
				.and(sinon.match.has("path", sinon.match(/&test=true/)))
				.and(sinon.match.has("path", sinon.match(/&from=me/)))
				.and(sinon.match.has("path", sinon.match(/&to=49177229839/)))
				.and(sinon.match.has("path", sinon.match(/&type=unicode/)))
				.and(sinon.match.has("path", sinon.match(/&text=043F04400438043204350442/)))
			)
			.callsArgWith(1, response)
			.returns(request);
		
		var sut = NimbowClient.create("test-api-key", "http", 1);
		sut.sendUnicodeTextMessage("me", "49177229839", "привет", null, function(error, apiResponse){
			assert.deepEqual(apiResponse, expected);
			done();
		});
	});
});