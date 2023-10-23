"use strict"

// 出力するWPテーマ名を記入
const themeName = 'test'

// gulp関連のモジュールを読み込む
const bs = require("browser-sync")
const { src, dest, series, parallel, watch } = require("gulp")
const sass = require("gulp-dart-sass")
const ejs = require("gulp-ejs")
const htmlbeautify = require("gulp-html-beautify")
const rename = require("gulp-rename")
const plumber = require("gulp-plumber")
const imageMin = require('gulp-imagemin')
const mozjpeg = require('imagemin-mozjpeg')
const pngquant = require('imagemin-pngquant')
const changed = require('gulp-changed')
const del = require("del")

// BrowserSyncの初期化とサーバーの設定
function bsInit(done) {
  bs.init({
    server: {
      baseDir: "app/product/"
    },
    notify: false,
  })

  done()
}

// scssをコンパイルして出力
function scssCompile(done) {
  src("app/src/sass/**/*.scss")
  .pipe(
    sass({
      outputStyle: "expanded"
    })
    .on("error", sass.logError)
  )
  .pipe(dest("app/product/assets/css"))
  .pipe(dest(`themes/${themeName}/assets/css`))

  done()
}

// ejsをコンパイルしてhtmlに変換
function ejsCompile(done) {
  src(["app/src/ejs/**/*.ejs", "!" + "app/src/ejs/**/_*.ejs"])
    .pipe(plumber())
    .pipe(ejs())
    .pipe(rename({ extname: ".html" }))
    .pipe(htmlbeautify({
      // インデント幅２文字
      indent_size: 2
    }))
    .pipe(dest("app/product"))

    done()
}

// 画像を圧縮して出力
function imageCompile(done) {
  src('app/product/assets/image/**/*')
  .pipe(changed(`themes/${themeName}/assets/image`))
  .pipe(
    imageMin([
      pngquant({
        quality: [.80, .90],
        speed: 1
      }),
      mozjpeg({ quality: 80 }),
      imageMin.svgo(),
      imageMin.optipng(),
      imageMin.gifsicle({ optimizationLevel: 3 }),
    ])
  )
  .pipe(dest(`themes/${themeName}/assets/image`))

  done()
}

// jsファイルをテーマへコピー
function jsPipe(done) {
  src('app/product/assets/js/**/*.js')
  .pipe(plumber())
  .pipe(dest(`themes/${themeName}/assets/js`))

  done()
}

// アセットフォルダをテーマへコピー（画像は非圧縮）
function assetsPipe(done) {
  src('app/product/assets/**')
  .pipe(plumber())
  .pipe(dest(`themes/${themeName}/assets`))

  done()
}

// BrowserSyncでリロード
function bsReload(done) {
  bs.reload()

  done()
}

// アセットフォルダを削除
function assetsDel(done) {
  del(`themes/${themeName}/assets`)

  done()
}

// ファイルの変更を監視してタスクを実行
function watchTask(done) {
  watch(["app/src/sass/**/*.scss"], series(scssCompile))
  watch(["app/src/ejs/**/*.ejs"], series(ejsCompile))
  watch(["app/product/assets/image/**/*.+(jpg|jpeg|png|gif|svg)"], series(imageCompile))
  watch(["app/product/assets/js/**/*.js"], series(jsPipe))
  watch(["app/product/**"], series(bsReload))
}

// gulpのデフォルトタスク
exports.default = series(bsInit, bsReload, watchTask)
// 個別のタスク
exports.sass = series(scssCompile)
exports.ejs = series(ejsCompile)
exports.imagemin = series(imageCompile)
exports.js = series(jsPipe)
exports.assets = series(assetsPipe)
exports.assetsDel = series(assetsDel)