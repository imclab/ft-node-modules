ft-node-modules
============

A collection of modules to speed up and standardise node development at the ft

logger
----
Easy logging for local, loggly and splunk. Overrides console:

    // Require the logger module
    var ftLogger = require('ft-node-modules/logger');
    
    // Define your logging options
    var config = {
        local: {
            logDir: 'logs/',
            logFile: 'aLogFile.log',
            logLevel: 'warn' // info|warn|error
        },
        loggly: {
            logglyKey: 'xxxxx-xxxxx-xxxxx-xxxxx',
            logglyDomain: 'myLogglyDomain',
            logLevel: 'warn' // info|warn|error
        },
        splunk: {
            splunkHostname: null
        },
	    logentries: {
			token: 'yyyyy-yyyyyy-yyyyy-yyyyy',
			logLevel: 'error'
	    }
    };
    
    // Initialise the logger
    ftLogger.init(config);
    
    console.log('Blah blah blah'); // Just logs to stdout
    console.info('More blah blah blah'); // Logs to all outputs
    console.warn('This is a warning, don\'t make me tell you twice'); // Logs to all outputs
    console.error('Now you've gone and messed it all up'); // Logs to all outputs