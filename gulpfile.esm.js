import { src, dest, watch, series, parallel } from 'gulp';
import yargs from 'yargs';
import sass from 'gulp-sass';
import cleanCss from 'gulp-clean-css';
import gulpif from 'gulp-if';
import postcss from 'gulp-postcss';
import sourcemaps from 'gulp-sourcemaps';
import autoprefixer from 'autoprefixer';
import imagemin from 'gulp-imagemin';
import del from 'del';
import babel from 'gulp-babel';
import uglify from 'gulp-uglify';

const PRODUCTION = yargs.argv.prod;

export const clean = () => del(['assets']);

export const styles = () => {
	return src(['src/sass/style.scss', 'src/sass/admin.scss'], {allowEmpty: true})
	.pipe(gulpif(!PRODUCTION, sourcemaps.init()))
	.pipe(sass().on('error', sass.logError))
	.pipe(postcss([ autoprefixer ]))
	.pipe(gulpif(PRODUCTION, cleanCss()))
	.pipe(gulpif(!PRODUCTION, sourcemaps.write('.')))
	.pipe(dest('assets/css'));
}

export const images = () => {
	return src('src/images/**/*.{jpg,jpeg,png,svg,gif}', {allowEmpty: true})
	.pipe(gulpif(PRODUCTION, imagemin()))
	.pipe(dest('assets/images'));
}

export const copy = () => {
	return src(['src/**/*','!src/{images,js,sass}','!src/{images,js,sass}/**/*'], {allowEmpty: true})
	.pipe(dest('assets'));
}

export const scripts = () => {
	return src(['src/js/app.js','src/js/admin.js'], {allowEmpty: true})
	.pipe(gulpif(!PRODUCTION, sourcemaps.init()))
	.pipe(babel({presets: ['@babel/env']}))
	.pipe(uglify())
	.pipe(gulpif(!PRODUCTION, sourcemaps.write('.')))
	.pipe(dest('assets/js'));
}

export const watchChanges = () => {
	watch('src/sass/**/*.scss', styles);
	watch('src/images/**/*.{jpg,jpeg,png,svg,gif}', images);
	watch(['src/**/*','!src/{images,js,scss}','!src/{images,js,sass}/**/*'], copy);
	watch('src/js/**/*.js', scripts);
}

export const dev = series(clean, parallel(styles, images, copy, scripts), watchChanges);
export const build = series(clean, parallel(styles, images, copy, scripts));
export default dev;