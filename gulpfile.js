'use strict';

let gulp = require('gulp');
let args = require('yargs').argv;
let $ = require('gulp-load-plugins')({lazy: true});
let config = require('./gulp.config')();
let browserSync = require('browser-sync');
let del = require('del');
let port = process.env.PORT || config.defaultPort;

/**
 * List the available gulp tasks
 */
gulp.task('help', $.taskListing);
gulp.task('default', ['help']);

gulp.task('serve-dev', () => {
    serve(true /*isDev*/);
});

gulp.task('serve-build', ['build'], () => {
    serve(false /*isDev*/);
});

gulp.task('build', () => {

});

//=====================================

function serve(isDev) {
	let nodeOptions = getNodeOptions(isDev);

    if (args.verbose) {
        console.log(nodeOptions);
    }

	return $.nodemon(nodeOptions)
	   .on('restart', ev => {
	       log('*** nodemon restarted');
	       log('files changed:\n' + ev);

	       setTimeout(function() {
	           browserSync.notify('reloading now ...');
	           browserSync.reload({stream: false});
	       }, config.browserReloadDelay);
	   })
	   .on('start', function () {
	       log('*** nodemon started');
	       startBrowserSync(isDev);
	   })
	   .on('crash', function () {
	       log('*** nodemon crashed: script crashed for some reason');
	   })
	   .on('exit', function () {
	       log('*** nodemon exited cleanly');
	   });
}	

function getNodeOptions(isDev) {
    return {
        script: config.nodeServer,
        delayTime: 1,
        env: {
            'PORT': port,
            'NODE_ENV': isDev ? 'dev' : 'build'
        },
        watch: [config.server]
    };
}

function startBrowserSync(isDev) {
    if (args.nosync || browserSync.active) {
        return;
    }

    log('Starting BrowserSync on port ' + port);

	let options = {
        proxy: 'localhost:' + port,
        port: config.browserSyncPort,
        ghostMode: { // these are the defaults t,f,t,t
            clicks: true,
            location: false,
            forms: true,
            scroll: true
        },
        injectChanges: true,
        logFileChanges: true,
        logPrefix: 'browser-sync',
        notify: true,
        reloadDelay: 0 //1000
    };

    browserSync(options);
}

/**
 * Log a message or series of messages using chalk's blue color.
 * Can pass in a string, object or array.
 */
function log(msg) {
    if (typeof(msg) === 'object') {
        for (var item in msg) {
            if (msg.hasOwnProperty(item)) {
                $.util.log($.util.colors.blue(msg[item]));
            }
        }
    } else {
        $.util.log($.util.colors.blue(msg));
    }
}
