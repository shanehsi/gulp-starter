if (!GULP_CONFIG.tasks.html) return

var browserSync  = require("browser-sync")
var data         = require("gulp-data")
var gulp         = require("gulp")
var gulpif       = require("gulp-if")
var handleErrors = require("../lib/handleErrors")
var htmlmin      = require("gulp-htmlmin")
var path         = require("path")
var render       = require("gulp-jade")
var jade         = require("jade")
var fs           = require("fs")

var htmlTask = function() {
  
  var exclude = path.normalize("!**/{" + GULP_CONFIG.tasks.html.excludeFolders.join(",") + "}/**");
  
  var paths = {
    src: [path.resolve(process.env.PWD, GULP_CONFIG.root.src, GULP_CONFIG.tasks.html.src, "**/*.{" + GULP_CONFIG.tasks.html.extensions + "}"), exclude],
    dest: path.resolve(process.env.PWD, GULP_CONFIG.root.dest, GULP_CONFIG.tasks.html.dest),
  };
  
  var getData = function(file) {
    var dataPath = path.resolve(process.env.PWD, GULP_CONFIG.root.src, GULP_CONFIG.tasks.html.src, GULP_CONFIG.tasks.html.dataFile)
    return JSON.parse(fs.readFileSync(dataPath, "utf8"))
  }
  
  return gulp.src(paths.src)
    .pipe(data(getData))
    .on("error", handleErrors)
    .pipe(render({
      pug: jade
    }))
    .on("error", handleErrors)
    .pipe(gulpif(global.production, htmlmin(GULP_CONFIG.tasks.html.htmlmin)))
    .pipe(gulp.dest(paths.dest))
    .pipe(browserSync.stream())
  
}

gulp.task("html", htmlTask)
module.exports = htmlTask
