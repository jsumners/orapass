'use strict';

const gulp = require('gulp');
const $ = require('gulp-load-plugins')();

gulp.task('lint', function lintTask() {
  return gulp
    .src([
      '**/*.js',
      '!node_modules/**',
      '!test/**' // tests can be wonky
    ])
    .pipe($.eslint())
    .pipe($.eslint.formatEach())
    .pipe($.eslint.failAfterError());
});

gulp.task('test', ['lint'], function testTask() {
  return gulp
    .src(['test/*.js'])
    .pipe($.mocha({ui: 'qunit', reporter: 'min'}));
});

gulp.task('default', ['test']);
