// Require the logger module
var ftLogger,
    config,
    sinon = require('sinon');

var shouldShow =  ' is OK when set to ',
    shouldNotShow = ' message not shown when set to ';


function setupLogging (options) {
    // Define your logging options
    ftLogger = null;
    ftLogger = require('../../logger.js');

    config = {
        console: {
            logLevel: options.level // log|info|warn|error
        },
        logAsJson: options.logAsJson
    };

    // Initialise the logger
    ftLogger.init(config);
}

QUnit.module("Testing all logging levels to stdout and stderr");
// The logger takes a few ms to setup so we need to introduce a small delay before we start logging and testing
setTimeout(testLogLevelLogging, 100);

// We should see a message for .log, .info, .warn and .error
function testLogLevelLogging () {
    var level = 'log';

    setupLogging({
        level: 'log',
        logAsJson: false
    });

    test("Test LOG Level", 4, function (assert) {
        // Spy on the stdout write method so we can monitor for the correct logging messages
        var spy = sinon.spy(process.stdout, 'write');

        ok(logMessage(true, spy, 'log'), "LOG" + shouldShow + level.toUpperCase());
        ok(logMessage(true, spy, 'info'), "INFO" + shouldShow + level.toUpperCase());
        ok(logMessage(true, spy, 'warn'), "WARN" + shouldShow + level.toUpperCase());

        // Restore the write method
        process.stdout.write.restore();

        // Error message write to stderr not stdout
        spy = sinon.spy(process.stderr, 'write');
        ok(logMessage(true, spy, 'error'), "ERROR is OK when set to LOG");
        process.stderr.write.restore();
    });

    //Change the logging  level, add a delay then proceed with the next tests
    process.stderr.write('\n\n\n');
    setupLogging({
        level: 'info',
        logAsJson: false
    });
    process.stderr.write('\n\n\n');

    setTimeout(function () {
        testInfoLevelLogging();
    }, 100);
}


function logMessage (shouldBeCalled, spy, type) {
    var typeMessage = type.toUpperCase(),
        message = typeMessage + ': A console ' + typeMessage + ' message\n',
        result;

    console[type]('A console ' + typeMessage + ' message');

    if (shouldBeCalled) {
        result = spy.calledWith(message);
    } else {
        result = spy.neverCalledWithMatch(message);
    }
    return result;
}


function testInfoLevelLogging () {
    var level = 'info';
    test("Test INFO Level", 4, function (assert) {
        // Spy on the stdout write method so we can monitor for the correct logging messages
        var spy = sinon.spy(process.stdout, 'write');
        ok(logMessage(false, spy, 'log'), "LOG" + shouldNotShow + level.toUpperCase());
        ok(logMessage(true, spy, 'info'), "INFO" + shouldShow + level.toUpperCase());
        ok(logMessage(true, spy, 'warn'), "WARN" + shouldShow + level.toUpperCase());

        // Restore the write method
        process.stdout.write.restore();

        // Error message write to stderr not stdout
        spy = sinon.spy(process.stderr, 'write');
        ok(logMessage(true, spy, 'error'), "ERROR is OK when set to INFO");
        process.stderr.write.restore();
    });

    process.stderr.write('\n\n\n');
    setupLogging({
        level: 'warn',
        logAsJson: false
    });
    process.stderr.write('\n\n\n');

    setTimeout(function () {
        testWarnLevelLogging();
    }, 100);
}

function testWarnLevelLogging () {
    var level = 'warn';
    test("Test WARN Level", 4, function (assert) {
        // Spy on the stdout write method so we can monitor for the correct logging messages
        var spy = sinon.spy(process.stdout, 'write');
        ok(logMessage(false, spy, 'log'), "LOG" + shouldNotShow + level.toUpperCase());
        ok(logMessage(false, spy, 'info'), "INFO" + shouldNotShow + level.toUpperCase());
        ok(logMessage(true, spy, 'warn'), "WARN" + shouldShow + level.toUpperCase());

        // Restore the write method
        process.stdout.write.restore();

        // Error message write to stderr not stdout
        spy = sinon.spy(process.stderr, 'write');
        ok(logMessage(true, spy, 'error'), "ERROR is OK when set to WARN");
        process.stderr.write.restore();
    });

    process.stderr.write('\n\n\n');
    setupLogging({
        level: 'error',
        logAsJson: false
    });
    process.stderr.write('\n\n\n');

    setTimeout(function () {
        testErrorLevelLogging();
    }, 100);
}

function testErrorLevelLogging () {
    var level = 'error';
    test("Test ERROR Level", 4, function (assert) {
        // Spy on the stdout write method so we can monitor for the correct logging messages
        var spy = sinon.spy(process.stdout, 'write');
        ok(logMessage(false, spy, 'log'), "LOG" + shouldNotShow + level.toUpperCase());
        ok(logMessage(false, spy, 'info'), "INFO" + shouldNotShow + level.toUpperCase());
        ok(logMessage(false, spy, 'warn'), "WARN" + shouldNotShow + level.toUpperCase());

        // Restore the write method
        process.stdout.write.restore();

        // Error message write to stderr not stdout
        spy = sinon.spy(process.stderr, 'write');
        ok(logMessage(true, spy, 'error'), "ERROR is OK when set to ERROR");
        process.stderr.write.restore();
    });

}
