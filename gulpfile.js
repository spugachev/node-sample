'use strict';

var gulp = require('gulp');
var args = require('yargs').argv;
var $ = require('gulp-load-plugins')({lazy: true});
var config = require('./gulp.config')();
var browserSync = require('browser-sync');
var del = require('del');

/**
 * List the available gulp tasks
 */
gulp.task('help', $.taskListing);
gulp.task('default', ['help']);