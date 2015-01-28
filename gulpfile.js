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
  platforms: ['linux64', 'win64', 'osx64'],
  buildDir: './nwdist'
  //version: 'v0.11.4'
});

nw.on('log',  console.log);

gulp.task('package.json', function() {
  var stream = gulp.src('./package.json')
    .pipe(gulp.dest('./dist'));
  return stream;
});

gulp.task('move-node-modules', function() {
  var stream = gulp.src('./node_modules/always-tail/**/*')
    .pipe(gulp.dest('./dist/node_modules/always-tail'));
  return stream;
});


gulp.task('package', ['package.json', 'move-node-modules'], function () {

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

// Compile project
//gulp.task('build-osx', shell.task([
//<% if(isWin) { %> 'node node_modules/node-webkit-builder/bin/nwbuild -v 0.10.5 -p osx ./' <% } %><% if(!isWin) { %> 'node node_modules/node-webkit-builder/bin/nwbuild -v 0.10.5 -p osx ./' <% } %>
//]));

// Compile project
//gulp.task('build-win', shell.task([
//<% if(isWin) { %> 'node node_modules/node-webkit-builder/bin/nwbuild -v 0.10.5 -p win ./' <% } %><% if(!isWin) { %> 'node node_modules/node-webkit-builder/bin/nwbuild -v 0.10.5 -p win ./' <% } %>
//]));

// Compile project
//gulp.task('build-linux', shell.task([
//<% if(isWin) { %> 'node node_modules/node-webkit-builder/bin/nwbuild -v 0.10.5 -p linux32,linux64 ./' <% } %><% if(!isWin) { %> 'node node_modules/node-webkit-builder/bin/nwbuild -v 0.10.5 -p linux32,linux64 ./' <% } %>
//]));
