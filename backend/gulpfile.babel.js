const gulp = require("gulp");
const ts = require("gulp-typescript");
const merge = require("merge2");
const sourcemaps = require("gulp-sourcemaps");
const path = require("path");
const mocha = require("gulp-mocha");

// pull in the project TypeScript config
const tsSrcProject = ts.createProject("tsconfig.json");
const tsMigrationsProject = ts.createProject("tsconfig.json");

// dev script to compile backend
gulp.task("scripts", () => {
    const tsResult = gulp.src("src/**/*.ts")
        .pipe(sourcemaps.init())
        .pipe(tsSrcProject())
        .pipe(sourcemaps.write(".", { sourceRoot: path.join(__dirname, "src") }))
        .pipe(gulp.dest("dist/src"));
    return tsResult;
});

gulp.task("migrations", () => {
    const tsResult = gulp.src("migration/**/*.ts")
        .pipe(tsMigrationsProject())
        .pipe(gulp.dest("dist/migration"));
    return tsResult;
});

gulp.task("tests", () => {
    gulp.src("test/**/*.ts")
        .pipe(mocha());
});

gulp.task("watch-source", ["scripts", "migrations"], () => {
    gulp.watch("src/**/*.ts", ["scripts"]);
    gulp.watch("migration/**/*.ts", ["migrations"]);
});

gulp.task("watch-tests", ["tests"], () => {
    gulp.watch(["test/**/*.ts", "src/**/*.ts"], ["tests"]);
});

gulp.task("build", ["scripts", "migrations"]);

gulp.task("default", ["watch-source", "watch-tests"]);
