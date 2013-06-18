ft-node-modules
============

A collection of modules to speed up and standardise node development at the ft

Usage
-----
In your application's package.json

        "dependencies": {
            "ft-node-modules":"git+https://github.com/Financial-Times/ft-node-modules.git"
        }

(Optionally add `#[branch or tag name]`)

    npm install


logger
----
Easy logging for local (file), loggly and logentries. Splunk integration coming soon. Overrides Node's console method so you only need to include the module anywhere in yout application and use 'console' as per normal:

You can however set the logging level of 'console' 

    // Require the logger module
    var ftLogger = require('ft-node-modules/logger');
    
    // Define your logging options
    var config = {
        console: {
            logLevel: 'log' // log|info|warn|error
        },
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
	    logentries: {
			token: 'yyyyy-yyyyyy-yyyyy-yyyyy',
			logLevel: 'error'
	    },
        logAsJson: false
    };
    
    // Initialise the logger
    ftLogger.init(config);
    
    console.log('Blah blah blah'); // Just logs to stdout
    console.info('More blah blah blah'); // Logs to all outputs
    console.warn('This is a warning, don\'t make me tell you twice'); // Logs to all outputs
    console.error('Now you\'ve gone and messed it all up'); // Logs to all outputs

wrapper
-------
Fetch an FT wrapper page and populate it with your content

     // Require wrapper
    var wrapper = require('ft-node-modules/wrapper');

    // Initialise the wrapper if you need to override
    wrapper.init({
        wrapperRoot: "http://www.ft.com/thirdpartywrapper/",
        wrapperUpdateMs: 3600000 // 1 hr
    });

    // Create a model of your HTML content
    var model = {
        headWrapperCss: "", // what's this?
        footWrapperJs: "", // what's this?

        code: {
            metaTitle:"<title>Wrapper page title BLAH BLAH</title>",
            metaDescription:"<meta name='description' content='A wrapper page blah blah' />",
            metaKeywords:"<meta name='keywords' content='keyword1 keyword2' />",
            css:"<style type='text/css'>.mystyle {background-color:pink;}</style>",
            js:"<script>console.log('My head script')</script>",
            head:"", //??

            meta:"meta", //?

            foot:"<script>console.log('My foot script')</script>",
            dfpSiteName:"dfpSiteName",
            dfpZoneName:"dfpSiteName"
        },
        content: {
            contentWell:"<div><p class='mystyle'>Main content well</p></div>",
            rightRailContentWell: "<div><p>Right hand content well</p></div>",
            secondColumn: "<div><p>Second column content well</p></div>",
            header: "<header>This is the header</header>",
            wide: "wide",
            navigation: "<nav>This is the navigation</nav>"

        }
     }

     // Fetch and process the wrapper
     wrapper.fetch("ftalphaville", function (err, html) {
         if (!err) {
             result = wrapper.process(html, model);
             console.log(result);
         }
     });

