 /*
 * vscode-gulpfile.js
 *
 * Copyright (c) 2016, 2017 Jan T. Sott
 * Licensed under the MIT license.
 */

 // Dependencies
const gulp = require('gulp');
const debug = require('gulp-debug');
const tslint = require('gulp-tslint');
const jsonlint = require('gulp-jsonlint');

// Supported files
const tsFiles = [
  'src/*.ts',
];

const jsonFiles = [
  'package.json',
  'tsconfig.json',
  'tslint.json'
];

// Lint TypeScript
gulp.task('lint:ts', gulp.series( (done) => {
  gulp.src(tsFiles)
    .pipe(debug({title: 'tslint'}))
    .pipe(tslint({
        formatter: "prose"
    }))
    .pipe(tslint.report())
  done();
}));

// Lint JSON
gulp.task('lint:json', gulp.series( (done) => { 
  gulp.src(jsonFiles)
    .pipe(debug({title: 'json-lint'}))
    .pipe(jsonlint())
    .pipe(jsonlint.failAfterError())
    .pipe(jsonlint.reporter());
  done();
}));

// Available tasks
gulp.task('lint', gulp.parallel('lint:ts', 'lint:json', (done) => {
  done();
}));
