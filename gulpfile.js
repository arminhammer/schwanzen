'use strict';

var gulp = require('gulp');
var shell = require('gulp-shell');
var NwBuilder = require('node-webkit-builder');

require('require-dir')('./gulp');

gulp.task('default', ['clean'], function () {
    gulp.start('build');
});

var nw = new NwBuilder({
  files: './dist/**/**', // use the glob format
  platforms: ['linux', 'win', 'osx'],
  buildDir: './nwdist'
  //version: 'v0.11.4'
});

nw.on('log',  console.log);

gulp.task('package.json', function() {
  return gulp.src('./package.json')
    .pipe(gulp.dest('./dist'));
});

gulp.task('fonts:custom', function() {
  return gulp.src('./src/fonts/**/*')
    .pipe(gulp.dest('./dist/fonts'));
});

gulp.task('move-node-modules', function() {
  return gulp.src('./node_modules/file-tail/**/*')
    .pipe(gulp.dest('./dist/node_modules/file-tail'));
});

gulp.task('package', ['package.json', 'move-node-modules', 'fonts:custom'], function () {

  // Build returns a promise
  nw.build().then(function () {
    console.log('all done!');
  }).catch(function (error) {
    console.error(error);
  });

});

// Run project
gulp.task('nwrun', shell.task([
'node node_modules/node-webkit-builder/bin/nwbuild --run ./'
]));
