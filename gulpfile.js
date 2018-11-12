var gulp        	= require('gulp'),
    browserSync 	= require('browser-sync').create(),
    autoprefixer  	= require('gulp-autoprefixer'),
    sourcemaps      = require('gulp-sourcemaps'),
    sass            = require('gulp-sass'),
    uglify          = require('gulp-uglify'),
    rigger          = require('gulp-rigger'),
    imagemin        = require('gulp-imagemin'),
    pngquant        = require('imagemin-pngquant'),
    rimraf          = require('rimraf'),
    chokidar        = require('gulp-chokidar')(gulp),
    runSequence     = require('run-sequence');

var path = {
    build: {
        html    : 'build/',
        js      : 'build/js/',
        style   : 'build/css/',
        img     : 'build/img/',
        fonts   : 'build/fonts/'
    },
    src: {
        html    : 'src/*.html', 
        js      : 'src/js/main.js',
        style   : 'src/scss/main.scss',
        img     : 'src/img/**/*.*',
        favicon : 'src/favicon.*',
        fonts   : 'src/fonts/**/*.*'
    },
    watch: {
        html    : 'src/*.html',
        js      : 'src/js/**/*.js',
        style   : 'src/scss/**/*.scss',
        img     : 'src/img/**/*.*',
        fonts   : 'src/fonts/**/*.*'
    },
    clean: './build'
};

gulp.task('html', function () {
    gulp.src(path.src.html)
        .pipe(gulp.dest(path.build.html))
        .pipe(browserSync.stream());
});

gulp.task('js', function () {
    gulp.src(path.src.js) 
        .pipe(rigger())
        // .pipe(sourcemaps.init())
        .pipe(uglify())
        // .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.build.js))
        .pipe(browserSync.stream());
});

gulp.task('style', function () {
    gulp.src(path.src.style)
        .pipe(sourcemaps.init())
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: [
                "last 5 versions",
                "opera 12-13",
                "ie >= 9",
                "ff ESR"
            ],
            cascade: false
        }))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.build.style))
        .pipe(browserSync.stream());
});

gulp.task('favicon', function () {
    gulp.src(path.src.favicon)
        .pipe(gulp.dest(path.build.html));
});

gulp.task('image', function () {
    gulp.src(path.src.img)
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()],
            interlaced: true
        }))
        .pipe(gulp.dest(path.build.img))
        .pipe(browserSync.stream());
});

gulp.task('font', function() {
    gulp.src(path.src.fonts)
        .pipe(gulp.dest(path.build.fonts))
        .pipe(browserSync.stream());
});

gulp.task('clean', function(cb) {
    rimraf(path.clean, cb);
}); 

// Static Server + watching scss/html files
gulp.task('serve', ['style','html','js','image','font', 'favicon'], function() {

    browserSync.init({
        server: "./build"
    });

    chokidar(path.watch.style, 'style');
    chokidar(path.watch.js, 'js');
    chokidar(path.watch.fonts, 'font');
    chokidar(path.watch.img, 'image');
    chokidar(path.watch.html, 'html');
});

gulp.task('default', function() {
    runSequence('clean','serve');
});