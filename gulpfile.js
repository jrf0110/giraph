var fs        = require('fs');
var gulp      = require('gulp');
var pkg       = require('./package.json');
gulp.util     = require('gulp-util');

var config = {
  scripts: ['*.js', 'lib/*.js', 'test/*.js']
};

config.lint = config.scripts.concat(['test/*.js']);

gulp.task('clear-dist-dir', function(){
  fs.readdirSync('./dist').forEach( function( filename ){
    fs.unlinkSync( './dist/' + filename );
  });
});

gulp.task( 'build-dist', ['lint', 'clear-dist-dir'], function(){
  return require('browserify')({
      debug: true
    })
    .add('./index.js')
    .bundle()
    .pipe( fs.createWriteStream('./dist/:name.js'.replace(':name', pkg.name)) );
});

gulp.task( 'minify-dist', ['clear-dist-dir', 'build-dist'], function(){
  return gulp.src('./dist/:name.js'.replace(':name', pkg.name))
    .pipe( require('gulp-uglify')() )
    .pipe( require('gulp-concat')(':name.min.js'.replace(':name', pkg.name)) )
    .pipe( gulp.dest('./dist') );
});

gulp.task( 'scripts', function(){
  return require('browserify')({
      debug: true
    })
    .add('./test/public/js/app.js')
    .bundle()
    .pipe( fs.createWriteStream('./test/public/dist/app.js') );
});

gulp.task( 'lint', function(){
  return gulp.src( config.lint )
    .pipe( require('gulp-jshint')({
      "laxcomma": true,
      "sub": true,
      "globals": {
        "console": true,
        "module": true
      }
    }))
    .pipe( require('gulp-jshint').reporter('jshint-stylish') );
});

gulp.task( 'server', function(){
  require('gulp-connect').server({
    root: 'test/public'
  , port: 3040
  });
});

gulp.task( 'watch', function(){
  gulp.watch( config.lint, ['lint'] );
  gulp.watch( config.scripts, ['scripts'] );
  gulp.watch( ['less/*.less', 'less/**/*.less'], ['less'] );
});

gulp.task( 'dist', [ 'lint', 'clear-dist-dir', 'build-dist', 'minify-dist' ] );
gulp.task( 'build', [ 'lint', 'scripts' ] );
gulp.task( 'default', [ 'build', 'server', 'watch' ] );