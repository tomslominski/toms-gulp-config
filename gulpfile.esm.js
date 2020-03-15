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
import fiber from 'fibers';
import path from 'path';
import fs from 'fs';
import merge from '@ianwalter/merge';

sass.compiler = require('sass');

const PRODUCTION = yargs.argv.prod;
const ROOT = process.env.INIT_CWD;
const configFile = path.join(ROOT, 'gulp-config.json');
const configDirs = fs.existsSync(configFile) ? JSON.parse(fs.readFileSync(configFile)) : {};
const defaultDirs = {
	input: {
		styles: ['src/sass/style.scss', 'src/sass/admin.scss'],
		images: 'src/images/**/*.{jpg,jpeg,png,svg,gif}',
		copy: ['src/**/*', '!src/{images,js,sass}', '!src/{images,js,sass}/**/*'],
		scripts: ['src/js/app.js', 'src/js/admin.js'],
		icons: 'src/icons/**/*.svg',
	},
	output: {
		styles: 'assets/css',
		images: 'assets/images',
		copy: 'assets',
		scripts: 'assets/js',
		icons: 'assets/icons',
	},
	watch: {
		styles: 'src/sass/**/*.scss',
		images: 'src/images/**/*.{jpg,jpeg,png,svg,gif}',
		copy: ['src/**/*','!src/{images,js,scss}', '!src/{images,js,sass}/**/*'],
		scripts: 'src/js/**/*.js',
		icons: 'src/icons/**/*.svg'
	}
};
let dirs = merge(defaultDirs, configDirs);

const generateDirectories = (object) => {
	for (let key in object) {
		if (typeof object[key] === 'object') {
			generateDirectories(object[key]);
		} else {
			if( object[key].charAt(0) === '!' ) {
				object[key] = '!' + path.join(ROOT, object[key].slice(1));
			} else {
				object[key] = path.join(ROOT, object[key]);
			}
			
		}
	}
}

generateDirectories(dirs);

export const clean = () => del(['assets']);

export const styles = () => {
	return src(dirs.input.styles, {allowEmpty: true})
	.pipe(gulpif(!PRODUCTION, sourcemaps.init()))
	.pipe(sass({fiber: fiber}).on('error', sass.logError))
	.pipe(postcss([ autoprefixer ]))
	.pipe(gulpif(PRODUCTION, cleanCss()))
	.pipe(gulpif(!PRODUCTION, sourcemaps.write('.')))
	.pipe(dest(dirs.output.styles));
}

export const images = () => {
	return src(dirs.input.images, {allowEmpty: true})
	.pipe(gulpif(PRODUCTION, imagemin()))
	.pipe(dest(dirs.output.images));
}

export const copy = () => {
	return src(dirs.input.copy, {allowEmpty: true})
	.pipe(dest(dirs.output.copy));
}

export const scripts = () => {
	return src(dirs.input.scripts, {allowEmpty: true})
	.pipe(gulpif(!PRODUCTION, sourcemaps.init()))
	.pipe(babel({presets: ['@babel/env']}))
	.pipe(uglify())
	.pipe(gulpif(!PRODUCTION, sourcemaps.write('.')))
	.pipe(dest(dirs.output.scripts));
}

export const icons = () => {
	return src(dirs.input.icons, {allowEmpty: true})
	.pipe(gulpif(PRODUCTION, imagemin()))
	.pipe(dest(dirs.output.icons));
}

export const watchChanges = () => {
	watch(dirs.watch.styles, styles);
	watch(dirs.watch.images, images);
	watch(dirs.watch.copy, copy);
	watch(dirs.watch.scripts, scripts);
	watch(dirs.watch.icons, icons);
}

export const dev = series(clean, parallel(styles, images, copy, scripts, icons), watchChanges);
export const build = series(clean, parallel(styles, images, copy, scripts, icons));
export default dev;