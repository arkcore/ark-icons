var gulp = require('gulp');
var imagemin = require('gulp-imagemin');

gulp.task('default', function () {
    return gulp.src('src/*.png')
        .pipe(imagemin({
            optimizationLevel: 7
        }))
        .pipe(gulp.dest('lib'));
});

gulp.task('ico', function () {
    return gulp.src('src/*.icon')
        .pipe(gulp.dest('lib'));
});
