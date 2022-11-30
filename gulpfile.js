/*jshint esversion: 9 */

const gulp = require("gulp");
const ejs = require("gulp-ejs");
const rename = require("gulp-rename");
const htmlmin = require("gulp-htmlmin");
const concatCss = require("gulp-concat-css");
const cleanCSS = require("gulp-clean-css");
const purgecss = require("gulp-purgecss");
const connect = require("gulp-connect");
const imagemin = require("gulp-imagemin");
const ts = require("gulp-typescript");
const terser = require("gulp-terser");
const realFavicon = require("gulp-real-favicon");
const fs = require("fs");

buildpipe = ["html", "ts", "css", "img"];

//
// From: https://realfavicongenerator.net/
//
// // Moved to the global imports
// var realFavicon = require("gulp-real-favicon");
// var fs = require("fs");

// File where the favicon markups are stored
var FAVICON_DATA_FILE = "./src/faviconData.json";

// Generate the icons. This task takes a few seconds to complete.
// You should run it at least once to create the icons. Then,
// you should run it whenever RealFaviconGenerator updates its
// package (see the check-for-favicon-update task below).
gulp.task("generate-favicon", function (done) {
  if (!fs.existsSync("./dist/icon/favicon.ico")) {
    realFavicon.generateFavicon(
      {
        masterPicture: "./node_modules/@tabler/icons/icons/copy.svg",
        dest: "./dist/icon",
        iconsPath: "./icon",
        design: {
          ios: {
            pictureAspect: "backgroundAndMargin",
            backgroundColor: "#f5f7ff",
            margin: "0%",
            assets: {
              ios6AndPriorIcons: false,
              ios7AndLaterIcons: false,
              precomposedIcons: false,
              declareOnlyDefaultIcon: true,
            },
          },
          desktopBrowser: {
            design: "raw",
          },
          windows: {
            pictureAspect: "whiteSilhouette",
            backgroundColor: "#da532c",
            onConflict: "override",
            assets: {
              windows80Ie10Tile: false,
              windows10Ie11EdgeTiles: {
                small: true,
                medium: true,
                big: true,
                rectangle: true,
              },
            },
          },
          androidChrome: {
            pictureAspect: "noChange",
            themeColor: "#ffffff",
            manifest: {
              name: "Copy Link Bookmarklet",
              display: "standalone",
              orientation: "notSet",
              onConflict: "override",
              declared: true,
            },
            assets: {
              legacyIcon: false,
              lowResolutionIcons: false,
            },
          },
          safariPinnedTab: {
            pictureAspect: "silhouette",
            themeColor: "#5bbad5",
          },
        },
        settings: {
          scalingAlgorithm: "Mitchell",
          errorOnImageTooSmall: false,
          readmeFile: false,
          htmlCodeFile: false,
          usePathAsIs: false,
        },
        markupFile: FAVICON_DATA_FILE,
      },
      function () {
        done();
      }
    );
  } else {
    done();
  }
});

// Inject the favicon markups in your HTML pages. You should run
// this task whenever you modify a page. You can keep this task
// as is or refactor your existing HTML pipeline.
/*
gulp.task("inject-favicon-markups", function () {
  return (
    gulp
      .src(["TODO: List of the HTML files where to inject favicon markups"])
      // This pipe segment is included in the ejs task above. Never executed here
      .pipe(
        realFavicon.injectFaviconMarkups(
          JSON.parse(fs.readFileSync(FAVICON_DATA_FILE)).favicon.html_code
        )
      )
      .pipe(
        gulp.dest("TODO: Path to the directory where to store the HTML files")
      )
  );
});
*/

// Check for updates on RealFaviconGenerator (think: Apple has just
// released a new Touch icon along with the latest version of iOS).
// Run this task from time to time. Ideally, make it part of your
// continuous integration system.
gulp.task("check-for-favicon-update", function (done) {
  var currentVersion = JSON.parse(fs.readFileSync(FAVICON_DATA_FILE)).version;
  realFavicon.checkForUpdates(currentVersion, function (err) {
    if (err) {
      throw err;
    }
  });
});

//
// End of realfavicongenerator
//

gulp.task("html", function () {
  // Enforce a reloading of the bookmarks
  delete require.cache[require.resolve("./src/bookmarklets.js")];
  const bookmarklets = require("./src/bookmarklets.js");
  const favicon = fs.readFileSync("./dist/icon/favicon-32x32.png", "base64");

  return gulp
    .src("src/*.ejs")
    .pipe(ejs({ bookmarklets: bookmarklets.bookmarklets, favicon: favicon }))
    .pipe(rename({ extname: ".html" }))
    .pipe(gulp.src("src/*.html", { passthrough: true }))
    .pipe(
      realFavicon.injectFaviconMarkups(
        JSON.parse(fs.readFileSync(FAVICON_DATA_FILE)).favicon.html_code
      )
    )
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

gulp.task("img", function () {
  return gulp
    .src(["img/*.png", "img/*.jpg", "img/*.gif"])
    .pipe(imagemin())
    .pipe(gulp.dest("dist/img"));
});

var tsProject = ts.createProject({
  declaration: false,
  target: "ES6",
  outFile: "main.js",
});

gulp.task("ts", function () {
  return gulp
    .src("src/*.ts")
    .pipe(tsProject())
    .pipe(terser())
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

exports.default = gulp.series("generate-favicon", buildpipe);
exports.dev = gulp.series(
  "generate-favicon",
  buildpipe,
  gulp.parallel(["connect", "watch"])
);
