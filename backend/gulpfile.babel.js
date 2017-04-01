const gulp = require("gulp");
const ts = require("gulp-typescript");
const merge = require("merge2");
const babel = require("gulp-babel");
const sourcemaps = require("gulp-sourcemaps");
const path = require("path");
const mocha = require("gulp-mocha");

// pull in the project TypeScript config
const tsProject = ts.createProject("tsconfig.json");

// dev script to compile backend
gulp.task("scripts", () => {
    const tsResult = gulp.src("src/**/*.ts")
        .pipe(sourcemaps.init())
        .pipe(tsProject())
        .pipe(babel())
        .pipe(sourcemaps.write(".", { sourceRoot: path.join(__dirname, "src") }))
        .pipe(gulp.dest("dist"));
});

gulp.task("tests", () => {
    gulp.src("test/**/*.ts")
    .pipe(mocha());
});

gulp.task("watchSource", ["scripts"], () => {
    gulp.watch("src/**/*.ts", ["scripts"]);
});

gulp.task("watchTests", ["tests"], () => {
    gulp.watch(["test/**/*.ts", "src/**/*.ts"], ["tests"]);
});

gulp.task("default", ["watchSource", "watchTests"]);
