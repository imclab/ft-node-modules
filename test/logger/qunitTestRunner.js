var testrunner	= require("qunit");

//var helpers		= require('../../node/helpers.js'),

var finsihedTestRun = function () {
	console.log('Finsihed?');
};

testrunner.run({
    code: "./test/logger/stub.js",
    tests: "./test/logger/logConsole.test.js"
});