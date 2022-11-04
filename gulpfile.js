/*jshint esversion: 9 */

const gulp = require("gulp");
const ejs = require("gulp-ejs");
const rename = require("gulp-rename");
const htmlmin = require("gulp-htmlmin");
const concatCss = require("gulp-concat-css");
const cleanCSS = require("gulp-clean-css");
const purgecss = require("gulp-purgecss");
const connect = require("gulp-connect");
const bookmarklets = require("./src/bookmarklets.js");

buildpipe = ["html", "css"];

// TODO: Better output about progress?

gulp.task("html", function () {
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
      // dist/*.html is available if the html task was executed before
      .pipe(purgecss({ content: ["dist/*.html"] }))
      .pipe(cleanCSS())
      .pipe(gulp.dest("dist/"))
      .pipe(connect.reload())
  );
});

gulp.task("connect", function () {
  connect.server({
    root: "dist",
    livereload: true,
    port: 8008,
  });
});

gulp.task("watch", function () {
  gulp.watch(["./src/**/*.*"], gulp.series(buildpipe));
});

exports.default = gulp.series(buildpipe);
exports.dev = gulp.series(buildpipe, gulp.parallel(["connect", "watch"]));
