const gulp = require('gulp');
const lambda = require('gulp-awslambda');
const zip = require('gulp-zip');
const clean = require('gulp-clean');
const install = require("gulp-install");

const lambda_params = {
    FunctionName: 'setLights',
    Environment: {
        "Variables": {
            // Access token can be retrieved from the Wio Link app by viewing the API (Menu -> View API)
            // for your device and copying the access_token from the sample URLs.
            "ACCESS_TOKEN": "your-token-here"
        }
    },
    MemorySize: 128,
    Runtime: "nodejs4.3",
    Timeout: 5
};

const opts = {
    region: 'us-west-2'
};

gulp.task('clean', function () {
    return gulp.src('dest/', {read: false})
        .pipe(clean());
});

gulp.task('copy', ['clean'], function () {
    return gulp.src('src/**/*')
        .pipe(gulp.dest('dest/'));
});

gulp.task('npmInstall', ['copy'], function () {
    return gulp.src('dest/')
        .pipe(gulp.dest('./'))
        .pipe(install({production: true}));
});

gulp.task('default', ['npmInstall'], function () {
    return gulp.src('dest/**/*')
        .pipe(zip('archive.zip'))
        .pipe(lambda(lambda_params, opts))
        .pipe(gulp.dest('.'));
});

