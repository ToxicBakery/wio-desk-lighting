var gulp = require('gulp');
var lambda = require('gulp-awslambda');
var zip = require('gulp-zip');

var lambda_params = {
  FunctionName: 'setLights',
  Environment: { 
    "Variables": { 
      // Access token can be retrieved from the Wio Link app by viewing the API (Menu -> View API)
      // for your device and copying the access_token from the sample URLs.
      "ACCESS_TOKEN" : "your-token-here" 
    }
  },
  MemorySize: 128,
  Runtime: "nodejs4.3",
  Timeout: 5
};

var opts = {
  region: 'us-west-2'
};

gulp.task('default', function() {
  return gulp.src('dest/**/*')
            .pipe(zip('archive.zip'))
            .pipe(lambda(lambda_params, opts))
            .pipe(gulp.dest('.'));
});

