'use strict';

const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const browserSync  = require('browser-sync').create();

function style() {
  return gulp.src('./sass/**/*.sass')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./css'))
    .pipe(browserSync.stream())
}

function watch() {
	browserSync.init({
		server: {
			baseDir: './'
		}
	})
	gulp.watch('./sass/**/*.sass', style);
	gulp.watch('./index.html').on('change', browserSync.reload);
}

const build = gulp.series(gulp.parallel(style), watch);

exports.style      	= style;
exports.watch 		= watch;
exports.build 		= build;
exports.default 	= build;