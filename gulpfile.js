'use strict';

const gulp = require('gulp');
const args = require('yargs').argv;
const $ = require('gulp-load-plugins')({lazy: true});
const config = require('./gulp.config')();
const browserSync = require('browser-sync');
const runSequence = require('run-sequence');
const del = require('del');
const path = require('path');
const _ = require('lodash');
const ts = $.typescript;
const port = process.env.PORT || config.defaultPort;

/**
 * List the available gulp tasks
 */
gulp.task('help', $.taskListing);
gulp.task('default', ['node-dev']);

gulp.task('clean', () => {
    let delConfig = [].concat(config.dist, config.temp);
    log('Cleaning: ' + $.util.colors.blue(delConfig));
    return del(delConfig);
});

gulp.task('build',  (cb) => {
    runSequence('clean', 
        ['files-copy', 'scripts-server', 'scripts-client'], cb);
});

gulp.task('files-copy', () => {
    return gulp.src([
        config.src + '**/*',
        '!' + config.src + '**/*.ts'
        ])
        .pipe(gulp.dest(config.dist));
});

gulp.task('scripts-server',  () => {
    const tsprj = ts.createProject(config.tsconfig);
    
    return gulp.src([
        config.srcServer + '**/*.ts',
        config.typings,
        ])
        .pipe(ts(tsprj))
        .js.pipe(gulp.dest(config.distServer));
});

gulp.task('scripts-client',  () => {
    const tsprj = ts.createProject(config.tsconfig);

    return gulp.src([
        config.srcClient + '**/*.ts',
        config.typings,
        ])
        .pipe(ts(tsprj))
        .js.pipe(gulp.dest(config.distClient));
});

gulp.task('node-dev', ['build'], () => {
    serve(true /*isDev*/);
});

gulp.task('node-dist', ['build'], () => {
    serve(false /*isDev*/);
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
            'NODE_ENV': isDev ? 'dev' : 'dist'
        },
        watch: [config.distServer]
    };
}

function startBrowserSync(isDev) {
    if (args.nosync || browserSync.active) {
        return;
    }

    log('Starting BrowserSync on port ' + port);

    watch();

	let options = {
        proxy: 'localhost:' + port,
        port: config.browserSyncPort,
        files: [
            config.distClient + '**/*.*'
        ],
        ghostMode: {
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

function watch(){
    gulp.watch([config.srcClient + "**/*.ts"], ['scripts-client']);
    gulp.watch([config.srcServer + "**/*.ts"], ['scripts-server']);
    
    $.watch([
        config.src + '**/*',
        '!' + config.src + '**/*.ts'
     ], {
        base: config.src, 
        verbose: true,
        ignoreInitial: true
    })
    .pipe(gulp.dest(config.dist));
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

/**
 * Show OS level notification using node-notifier
 */
function notify(options) {
    var notifier = require('node-notifier');
    var notifyOptions = {
        sound: 'Bottle',
        contentImage: path.join(__dirname, 'gulp.png'),
        icon: path.join(__dirname, 'gulp.png')
    };

    _.assign(notifyOptions, options);
    notifier.notify(notifyOptions);
}
