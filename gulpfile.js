const { src, dest, watch, series, parallel } = require('gulp');

const gulp = require('gulp');
const sass = require('gulp-sass');
const cleanCSS = require("gulp-clean-css"); // 圧縮
const rename = require("gulp-rename");      // ファイル名変
var autoprefixer = require('gulp-autoprefixer');
var notify = require('gulp-notify');

//画像圧縮
const imagemin = require("gulp-imagemin");
const imageminMozjpeg = require("imagemin-mozjpeg");
const imageminPngquant = require("imagemin-pngquant");
const imageminSvgo = require("imagemin-svgo");


//参照元パス
const srcPath = {
    css: 'src/css/**.scss',
    js: 'src/js/*.js',
    img: 'src/img/**/*',
   }
   
//出力先パス
const destPath = {
css: 'dist/css/',
js: 'dist/js/',
img: 'dist/img/'
}
   

   
// function scss() {
//     return gulp.src('html/scss/*.scss')
//         .pipe(sass())
//         .pipe(autoprefixer())
//         .pipe(gulp.dest('html/css'))
//         // .pipe(minifyCss())
//         .pipe(gulp.dest('html/css'))
// }
// プラグインの処理をまとめる
const scss = () => {
  return src(srcPath.css) //コンパイル元
    .pipe(sass({ outputStyle: 'expanded' }))
    .pipe(autoprefixer())
    .pipe(dest(destPath.css))     //コンパイル先
    .pipe(cleanCSS()) // CSS圧縮
    .pipe(
      rename({
        extname: '.min.css' //.min.cssの拡張子に
      })
  )
  .pipe(dest(destPath.css))
 }

//画像圧縮（デフォルトの設定）
const imgImagemin = () => {
    return src(srcPath.img)
      .pipe(
        imagemin(
          [
            imageminMozjpeg({
              quality: 80
            }),
            imageminPngquant({ quality: [0.6, 0.8] }),
            imageminSvgo({
              plugins: [
                {
                  removeViewbox: false
                }
              ]
            })
          ],
          {
            verbose: true
          }
        )
      )
      .pipe(dest(destPath.img))
}
    
//ファイル監視
const watchFiles = () => {
  watch(srcPath.css, series(scss))
  // watch(srcPath.js, series(jsBabel, browserSyncReload))
  watch(srcPath.img, series(imgImagemin))
 }

exports.default = series(series(scss, imgImagemin), parallel(watchFiles));


