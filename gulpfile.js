"use strict"

// 出力するWPテーマ名を記入
const themeName = 'test'

const bs = require("browser-sync")
const { src, dest, series, parallel, watch } = require("gulp")
const sass = require("gulp-sass")(require("sass"))
const ejs = require("gulp-ejs")
const htmlbeautify = require("gulp-html-beautify")
const rename = require("gulp-rename")
const plumber = require("gulp-plumber")
const imageMin = require('gulp-imagemin')
const mozjpeg = require('imagemin-mozjpeg')
const pngquant = require('imagemin-pngquant')
const changed = require('gulp-changed')
const del = require("del")


function bsInit(done) {
  bs.init({
    server: {
      baseDir: "app/product/"
    },
    notify: false,
  })

  done()
}

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

function jsPipe(done) {
  src('app/product/assets/js/**/*.js')
  .pipe(plumber())
  .pipe(dest(`themes/${themeName}/assets/js`))

  done()
}

function assetsPipe(done) {
  src('app/product/assets/**')
  .pipe(plumber())
  .pipe(dest(`themes/${themeName}/assets`))

  done()
}

function bsReload(done) {
  bs.reload()

  done()
}

function assetsDel(done) {
  del(`themes/${themeName}/assets`)

  done()
}

function watchTask(done) {
  watch(["app/src/sass/**/*.scss"], series(scssCompile))
  watch(["app/src/ejs/**/*.ejs"], series(ejsCompile))
  watch(["app/product/assets/image/**/*.+(jpg|jpeg|png|gif|svg)"], series(imageCompile))
  watch(["app/product/assets/js/**/*.js"], series(jsPipe))
  watch(["app/product/**"], series(bsReload))
}

exports.default = series(bsInit, bsReload, watchTask)
exports.sass = series(scssCompile)
exports.ejs = series(ejsCompile)
exports.imagemin = series(imageCompile)
exports.js = series(jsPipe)
exports.assets = series(assetsPipe)
exports.assetsDel = series(assetsDel)