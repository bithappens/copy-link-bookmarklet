/*jshint esversion: 9 */

const gulp = require("gulp");
const ejs = require("gulp-ejs");
const rename = require("gulp-rename");
const htmlmin = require("gulp-htmlmin");
const concatCss = require("gulp-concat-css");
const cleanCSS = require("gulp-clean-css");
const purgecss = require("gulp-purgecss");
const connect = require("gulp-connect");
const ts = require("gulp-typescript");
const uglify = require("gulp-uglify");

buildpipe = ["html", "ts", "css"];

// TODO: Better output about progress?

gulp.task("html", function () {
  // Enforce a reloading of the bookmarks
  delete require.cache[require.resolve("./src/bookmarklets.js")];
  const bookmarklets = require("./src/bookmarklets.js");

  return gulp
    .src("src/*.ejs")
    .pipe(ejs(bookmarklets))
    .pipe(rename({ extname: ".html" }))
    .pipe(gulp.src("src/*.html", { passthrough: true }))
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest("dist"))
    .pipe(connect.reload());
});

gulp.task("css", function () {
  return (
    gulp
      .src("src/*.css")
      .pipe(
        concatCss("style.css", { includePaths: ["node_modules/simpledotcss"] })
      )
      // dist/* is available if the other tasks were executed before
      .pipe(purgecss({ content: ["dist/*.html", "dist/*.js"] }))
      .pipe(cleanCSS())
      .pipe(gulp.dest("dist/"))
      .pipe(connect.reload())
  );
});

var tsProject = ts.createProject({
  declaration: false,
  outFile: "main.js",
});

gulp.task("ts", function () {
  return gulp
    .src("src/*.ts")
    .pipe(tsProject())
    .pipe(uglify())
    .pipe(gulp.dest("dist/"))
    .pipe(connect.reload());
});

gulp.task("connect", function () {
  connect.server({
    root: "dist",
    livereload: true,
    port: 8008,
  });
});

gulp.task("watch", function () {
  gulp.watch(["./src/**/*"], gulp.series(buildpipe));
});

exports.default = gulp.series(buildpipe);
exports.dev = gulp.series(buildpipe, gulp.parallel(["connect", "watch"]));
