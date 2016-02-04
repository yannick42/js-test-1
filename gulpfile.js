
'use strict';

// inclusion de gulp
var gulp = require('gulp');

// inclusion des plugins
var jshint = require('gulp-jshint');
var htmlmin = require('gulp-htmlmin');
var sass = require('gulp-sass');
var browserify = require('browserify');
var source = require('vinyl-source-stream')
var rename = require('gulp-rename');
var concat = require('gulp-concat');
var vinylPaths = require('vinyl-paths');
var del = require('del');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');

// JS hint task
gulp.task('jshint', function() {
    gulp.src('./src/scripts/*.js')
          .pipe(jshint())
            .pipe(jshint.reporter('default'));
});

// minifier le html
gulp.task('minify_html', function() {
  return gulp.src('src/*.html')
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('build'))
});

// convertir SASS en CSS
gulp.task('sass', function () {
  return gulp.src('./src/sass/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./build/css'));
});

// pour utiliser du nodejs dans le navigateur
gulp.task('browserify', function() {
    var b = browserify(
        './src/scripts/index.js', {
            standalone: 'test_yannick'
        }
    );

    return b.bundle()
                .pipe(source('index.js'))
                .pipe(rename('compiled.js'))
                //.pipe(sourcemaps.init())
                //.pipe(sourcemaps.write('./build/'))
                .pipe(gulp.dest('./build/'));
});

gulp.task('uglify', function() {
    gulp.src('./build/compiled.js')
            .pipe(uglify())
            .pipe(rename('compiled-uglified.js'))
            .pipe(gulp.dest('./build/'));
});

gulp.task('pre-cleanup', function() {
    return deleteFiles('./build/css/all.css');
});

// dépend de "sass"
gulp.task('concat_css', ['sass', 'pre-cleanup'], function() {
    return gulp.src('./build/css/*.css')
        .pipe(concat('all.css'))
        .pipe(gulp.dest('./build/css'));
});

gulp.task('clean', function(list) {
    return deleteFiles(['./build/css/*.css', '!./build/css/all.css', './build/compiled.js']);
});

function deleteFiles(list) {
    return gulp.src(list)
                .pipe(vinylPaths(del));
};

gulp.task('build', ['jshint', 'sass', 'concat_css', 'browserify', 'minify_html'], function() {
    
});

// pour pouvoir lancer juste un "gulp" (sans paramètres)
gulp.task('default', ['build'], function() {
    // vérifie s'il y a du code modifié
    gulp.watch('./src/scripts/*.js', function() {
        gulp.run('jshint');
    });
});


