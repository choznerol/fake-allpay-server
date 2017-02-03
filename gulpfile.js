var gulp = require('gulp'),
    nodemon = require('gulp-nodemon');


gulp.task('watch', function() {
    nodemon({
        script: 'server.js',
        ext: 'js',
    });
});

gulp.task('default', [
    'watch'
]);
