'use strict';

const gulp = require('gulp'),
    babel = require('gulp-babel');

gulp.task('default', () => {
    console.error('Not yet set up');

    return gulp.src('src/index.js')
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(gulp.dest('index.js'));
});
