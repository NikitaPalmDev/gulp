'use strict';

var gulp = require('gulp'),
    watch = require('gulp-watch'),
    prefixer = require('gulp-autoprefixer'),
    sass = require('gulp-sass'),
    rigger = require('gulp-rigger'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    rimraf = require('rimraf'),
    browserSync = require("browser-sync"),
    reload = browserSync.reload;

var path = {
    build: { //Тут мы укажем куда складывать готовые после сборки файлы
        html: 'build/',
        js: 'build/js/',
        jsVendor: 'build/js/vendor',
        style: 'build/style/',
        styleVendor: 'build/style/vendor',
        img: 'build/img/',
        fonts: 'build/fonts/'
    },
    src: { //Пути откуда брать исходники
        html: 'src/*.html', //Синтаксис src/*.html говорит gulp что мы хотим взять все файлы с расширением .html
        js: 'src/js/*.js', //В стилях и скриптах нам понадобятся только main файлы
        jsVendor: 'src/js/vendor/*.js',
        style: 'src/style/*.*',
        styleVendor: 'src/style/vendor/*.*',
        img: 'src/img/**/*.*', //Синтаксис img/**/*.* означает - взять все файлы всех расширений из папки и из вложенных каталогов
        fonts: 'src/fonts/**/*.*'
    },
    watch: { //Тут мы укажем, за изменением каких файлов мы хотим наблюдать
        html: 'src/**/*.html',
        js: 'src/js/*.js',
        jsVendor: 'src/js/vendor/*.js',
        style: 'src/style/*.*',
        styleVendor: 'src/style/vendor/*.*',
        img: 'src/img/**/*.*',
        fonts: 'src/fonts/**/*.*'
    },
    clean: './build'
};

gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: "./build"
        },
        // tunnel: true,
        host: 'localhost',
        port: 8081,
        logPrefix: "PalmDev"
    });
});

gulp.task('html:build', function() {
    return gulp.src(path.src.html) //Выберем файлы по нужному пути
        .pipe(rigger()) //Прогоним через rigger
        .pipe(gulp.dest(path.build.html)) //Выплюнем их в папку build
        .pipe(reload({ stream: true })); //И перезагрузим наш сервер для обновлений
});

gulp.task('js:build', function() {
    return gulp.src(path.src.js) //Выберем файлы по нужному пути
        .pipe(rigger()) //Прогоним через rigger
        .pipe(gulp.dest(path.build.js)) //Выплюнем их в папку build
        .pipe(reload({ stream: true })); //И перезагрузим наш сервер для обновлений
});

gulp.task('jsVendor:build', function() {
    return gulp.src(path.src.jsVendor) //Выберем файлы по нужному пути
        .pipe(rigger()) //Прогоним через rigger
        .pipe(gulp.dest(path.build.jsVendor)) //Выплюнем их в папку build
        .pipe(reload({ stream: true })); //И перезагрузим наш сервер для обновлений
});

gulp.task('style:build', function() {
    return gulp.src(path.src.style) //Выберем файлы по нужному пути
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest(path.build.style)) //Выплюнем их в папку build
        .pipe(reload({ stream: true })); //И перезагрузим наш сервер для обновлений
});

gulp.task('styleVendor:build', function() {
    return gulp.src(path.src.styleVendor) //Выберем файлы по нужному пути
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest(path.build.styleVendor)) //Выплюнем их в папку build
        .pipe(reload({ stream: true })); //И перезагрузим наш сервер для обновлений
});

gulp.task('image:build', function() {
    return gulp.src(path.src.img) //Выберем файлы по нужному пути
        .pipe(imagemin({ //Сожмем их
            progressive: true,
            svgoPlugins: [{ removeViewBox: false }],
            use: [pngquant()],
            interlaced: true
        }))
        .pipe(gulp.dest(path.build.img)) //Выплюнем их в папку build
        .pipe(reload({ stream: true })); //И перезагрузим наш сервер для обновлений
});

gulp.task('fonts:build', function() {
    return gulp.src(path.src.fonts) //Выберем файлы по нужному пути
        .pipe(gulp.dest(path.build.fonts))
        .pipe(reload({ stream: true })); //И перезагрузим наш сервер для обновлений
});

gulp.task('build', gulp.parallel(
    'html:build',
    'js:build',
    'jsVendor:build',
    'style:build',
    'styleVendor:build',
    'fonts:build',
    'image:build'
));

gulp.task('watch', function() {
    gulp.watch(path.watch.style, gulp.series('style:build'));
    gulp.watch(path.watch.styleVendor, gulp.series('styleVendor:build'));
    gulp.watch(path.watch.js, gulp.series('js:build'));
    gulp.watch(path.watch.jsVendor, gulp.series('jsVendor:build'));
    gulp.watch(path.watch.img, gulp.series('image:build'));
    gulp.watch(path.watch.html, gulp.series('html:build'));
    gulp.watch(path.watch.fonts, gulp.series('fonts:build'));
});

gulp.task('clean', function(cb) {
    rimraf('./build', cb);
});

gulp.task('default', gulp.series(gulp.parallel('build', 'watch', 'browser-sync')));