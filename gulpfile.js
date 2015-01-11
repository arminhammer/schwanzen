'use strict';

var gulp = require('gulp');
var NwBuilder = require('node-webkit-builder');

require('require-dir')('./gulp');

gulp.task('default', ['clean'], function () {
    gulp.start('build');
});

var nw = new NwBuilder({
  files: './dist/**/**', // use the glob format
  platforms: ['linux64'],
  buildDir: './nwdist'
});

nw.on('log',  console.log);

gulp.task('package.json', function() {
  gulp.src('./src/package.json')
    .pipe(gulp.dest('./dist'));
});

gulp.task('nwbuild', ['build', 'package.json'], function () {

  // Build returns a promise
  nw.build().then(function () {
    console.log('all done!');
  }).catch(function (error) {
    console.error(error);
  });

});
