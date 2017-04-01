const gulp = require('gulp');
const ts = require('gulp-typescript');
const merge = require('merge2');
const babel = require('gulp-babel');
const sourcemaps = require('gulp-sourcemaps');
const path = require('path');

// pull in the project TypeScript config
const tsProject = ts.createProject('tsconfig.json');

gulp.task('scripts', () => {
    const tsResult = gulp.src("src/**/*.ts")
        .pipe(sourcemaps.init())
        .pipe(tsProject())
        .pipe(babel())
        .pipe(sourcemaps.write(".", { sourceRoot: path.join(__dirname, "src") }))
        .pipe(gulp.dest('dist'));

    // return tsResult.js.pipe(gulp.dest('dist'));
    // return merge([ // Merge the two output streams, so this task is finished when the IO of both operations is done.
    //     tsResult.dts.pipe(gulp.dest('definitions')),
    //     tsResult.js.pipe(gulp.dest('dist'))
    // ]);
});

gulp.task('watch', ['scripts'], () => {
    gulp.watch('src/**/*.ts', ['scripts']);
});

gulp.task('default', ['watch']);
