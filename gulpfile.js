/* package */
const { src, dest, watch, series, parallel } = require("gulp");
const plumber = require("gulp-plumber");
const notify = require("gulp-notify");
const sassGlob = require("gulp-sass-glob-use-forward");
const mmq = require("gulp-merge-media-queries");
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const cssdeclsort = require("css-declaration-sorter");
const cleanCSS = require("gulp-clean-css");
const cssnext = require("postcss-cssnext");
const rename = require("gulp-rename");
const sourcemaps = require("gulp-sourcemaps");


/* gulp-sassのみで DartSass使用 */
const sass = require('gulp-sass')(require('sass'));
const cached = require('gulp-cached');
const dependents = require('gulp-dependents');
const dependentsConfig = {
  ".scss": {
    parserSteps: [
    /(?:^|;|{|}|\*\/)\s*@(import|use|forward|include)\s+((?:"[^"]+"|'[^']+'|url\((?:"[^"]+"|'[^']+'|[^)]+)\)|meta\.load\-css\((?:"[^"]+"|'[^']+'|[^)]+)\))(?:\s*,\s*(?:"[^"]+"|'[^']+'|url\((?:"[^"]+"|'[^']+'|[^)]+)\)|meta\.load\-css\((?:"[^"]+"|'[^']+'|[^)]+)\)))*)(?=[^;]*;)/gm,
    /"([^"]+)"|'([^']+)'|url\((?:"([^"]+)"|'([^']+)'|([^)]+))\)|meta\.load\-css\((?:"([^"]+)"|'([^']+)'|([^)]+))\)/gm
    ],
    prefixes: ["_"],
    postfixes: [".scss", ".sass"],
    basePaths: []
  }
};

const babel = require("gulp-babel");
const uglify = require("gulp-uglify");
const imageminSvgo = require("imagemin-svgo");
const browserSync = require("browser-sync");
const imagemin = require("gulp-imagemin");
const imageminMozjpeg = require("imagemin-mozjpeg");
const imageminPngquant = require("imagemin-pngquant");


// 読み込み先
const srcPath = {
	css: './src/sass/**/*.scss',
	js: './src/js/**/*.js',
	img: './src/images/**/*',
}

// WordPress反映用
const themeName = "WordPressTheme"; // WordPress theme name
const destWpPath = {
	css: `./${themeName}/assets/css/`,
	js: `./${themeName}/assets/js/`,
	img: `./${themeName}/assets/images/`,
}

// 不要ファイルを削除
const del = require('del');
const delPath = {
	wpcss: `./${themeName}/assets/css/`,
	wpjs: `./${themeName}/assets/js/script.js`,
	wpjsMin: `./${themeName}/assets/js/script.min.js`,
	wpImg: `./${themeName}/assets/images/`,
}
const clean = (done) => {
	del(delPath.wpcss, { force: true, });
	del(delPath.wpjs, { force: true, });
	del(delPath.wpjsMin, { force: true, });
	del(delPath.wpImg, {force: true,});
	done();
};

const cssSass = () => {
	return src(srcPath.css)
		.pipe(sourcemaps.init())
		.pipe(
			plumber({
				errorHandler: notify.onError('Error:<%= error.message %>')
			}))
		.pipe(sassGlob())
		.pipe(cached('scss'))
		.pipe(dependents(dependentsConfig))
		.pipe(sassGlob())
		.pipe(sass.sync({
			includePaths: ['src/sass'],
			outputStyle: 'expanded'
		}))
		.pipe(postcss([autoprefixer({
			grid: true
		})]))
		.pipe(postcss([cssdeclsort({
			order: "alphabetical"
		})]))
		.pipe(mmq())
		.pipe(dest(destWpPath.css))
		.pipe(cleanCSS())
		.pipe(rename({ extname: '.min.css' }))
		.pipe(sourcemaps.write('./map'))
		.pipe(dest(destWpPath.css))
		.pipe(notify({
			message: 'Sassをコンパイルしました！',
			onLast: true
		}))
}

// 画像圧縮
const imgImagemin = () => {
	return src(srcPath.img)

		.pipe(
			imagemin(
				[
					imageminMozjpeg({
						quality: 80
					}),
					imageminPngquant(),
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
		.pipe(dest(destWpPath.img))
}

// js圧縮
const jsBabel = () => {
	return src(srcPath.js)
		.pipe(
			plumber(
				{
					errorHandler: notify.onError('Error: <%= error.message %>')
				}
			)
		)
		.pipe(babel({
			presets: ['@babel/preset-env']
		}))
		.pipe(dest(destWpPath.js))
		.pipe(uglify())
		.pipe(
			rename(
				{ extname: '.min.js' }
			)
		)
		.pipe(dest(destWpPath.js))
}

const browserSyncReload = (done) => {
	browserSync.reload();
	done();
}

const watchFiles = () => {
	watch(srcPath.css, series(cssSass, browserSyncReload))
	watch(srcPath.js, series(jsBabel, browserSyncReload))
	watch(srcPath.img, series(imgImagemin, browserSyncReload))
}
exports.default = series(series(clean, cssSass, jsBabel, imgImagemin), parallel(watchFiles));