'use strict';

// include dependencies
var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var del = require('del');
var sass = require('gulp-ruby-sass');
var runSequence = require('run-sequence');
var browserSync = require('browser-sync');
var reload = browserSync.reload;

// remove temp directories
gulp.task('clear', function () {
    return del('dist', '.tmp');
});

// copy & optimize images
gulp.task('images', function () {
    return gulp.src('app/images/**/*')
        .pipe($.cache($.imagemin({
            progressive: true,
            interlaced: true
        })))
        .pipe(gulp.dest('dist/images'))
        .pipe(reload({stream: true, once: true}))
        .pipe($.size({title: 'images'}));
});

// serve styles
gulp.task('styles:serve', function () {
    return $.rubySass('app/styles/*.scss', {
            style: 'expanded',
            precision: 10,
            loadPath: ['app/styles']
        })
        .pipe($.autoprefixer('last 1 version'))
        .pipe(gulp.dest('.tmp/styles'))
        .pipe($.size({title: 'styles'}))
});

// compile styles
gulp.task('styles:dist', function () {
    return $.rubySass('app/styles/*.scss', {
            style: 'expanded',
            precision: 10,
            loadPath: ['app/styles']
        })
        .pipe($.autoprefixer('last 1 version'))
        .pipe(gulp.dest('dist/styles'))
        .pipe($.size({title: 'styles'}))
});

// copy js
gulp.task('js', function () {
    return gulp.src('app/scripts/**/*.js')
        .pipe(gulp.dest('dist/scripts'))
});

// Lint JS
gulp.task('jshint', function () {
    return gulp.src('app/scripts/**/*.js')
        .pipe($.jshint())
        .pipe($.jshint.reporter('jshint-stylish'))
        .pipe($.jshint.reporter('fail'))
        .pipe(reload({stream: true, once: true}));
});

// Server files for browser sync
gulp.task('serve', function () {
    browserSync.init(null, {
        server: {
            baseDir: ['app', '.tmp']
        },
        notify: false
    });

    gulp.watch(['app/**/*.html'], reload);
    gulp.watch(['app/styles/**/*.{css,scss}'], ['styles:serve']);
    gulp.watch(['.tmp/styles/**/*.css'], reload);
    gulp.watch(['app/scripts/**/*.js'], reload);
    gulp.watch(['app/images/**/*'], ['images']);
});

// Copy html files
gulp.task('html', function () {
    return gulp.src('app/**/*.html')
        .pipe(gulp.dest('dist'))
        .pipe($.size({title: 'html'}));
});

// Build production files
gulp.task('build', function (cb) {
    runSequence('styles:dist', ['jshint', 'html', 'images'], cb);
});

// Default task
gulp.task('default', ['clear'], function (cb) {
    gulp.start('build', cb);
});