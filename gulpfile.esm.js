import { src, dest, watch, series, parallel } from 'gulp';
import yargs from 'yargs';
import sass from 'gulp-dart-sass';
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

const PRODUCTION = yargs.argv.prod;
const ROOT = process.env.INIT_CWD;
const configFile = path.join(ROOT, 'gulp-config.json');
const configDirs = fs.existsSync(configFile) ? JSON.parse(fs.readFileSync(configFile)) : {};
const defaultDirs = JSON.parse(fs.readFileSync('gulp-config.json'));
let dirs = merge(defaultDirs, configDirs);

const generateDirectories = (object) => {
	for (let key in object) {
		if (typeof object[key] === 'object') {
			generateDirectories(object[key]);
		} else if (typeof object[key] === 'string') {
			if( object[key].charAt(0) === '!' ) {
				object[key] = '!' + path.join(ROOT, object[key].slice(1));
			} else {
				object[key] = path.join(ROOT, object[key]);
			}
		}
	}
}

generateDirectories(dirs);

const imageminConfig = [
	imagemin.svgo({
		plugins: [
			{
				removeViewBox: false
			}
		]
	}),
	imagemin.gifsicle(),
	imagemin.mozjpeg(),
	imagemin.optipng(),
];

export const clean = () => {
	let cleanDirs = [];

	for (let assetType in dirs) {
		if (typeof dirs[assetType].delete !== 'undefined' && dirs[assetType].delete) {
			cleanDirs = cleanDirs.concat([
				path.join(dirs[assetType].output, '**'),
				path.join('!', dirs[assetType].output)
			]);
		}
	}

	return del(cleanDirs, {force: true});
};

export const styles = () => {
	if (!dirs.styles) {
		return Promise.resolve(false);
	}

	return src(dirs.styles.input, {allowEmpty: true})
	.pipe(gulpif(!PRODUCTION, sourcemaps.init()))
	.pipe(sass({fiber: fiber}).on('error', sass.logError))
	.pipe(postcss([ autoprefixer ]))
	.pipe(gulpif(PRODUCTION, cleanCss()))
	.pipe(gulpif(!PRODUCTION, sourcemaps.write('.')))
	.pipe(dest(dirs.styles.output));
}

export const images = () => {
	if (!dirs.images) {
		return Promise.resolve(false);
	}

	return src(dirs.images.input, {allowEmpty: true})
	.pipe(gulpif(PRODUCTION, imagemin(imageminConfig)))
	.pipe(dest(dirs.images.output));
}

export const copy = () => {
	if (!dirs.copy) {
		return Promise.resolve(false);
	}

	return src(dirs.copy.input, {allowEmpty: true})
	.pipe(dest(dirs.copy.output));
}

export const scripts = () => {
	if (!dirs.scripts) {
		return Promise.resolve(false);
	}

	return src(dirs.scripts.input, {allowEmpty: true})
	.pipe(gulpif(!PRODUCTION, sourcemaps.init()))
	.pipe(babel({presets: ['@babel/env']}))
	.pipe(uglify())
	.pipe(gulpif(!PRODUCTION, sourcemaps.write('.')))
	.pipe(dest(dirs.scripts.output));
}

export const icons = () => {
	if (!dirs.icons) {
		return Promise.resolve(false);
	}

	return src(dirs.icons.input, {allowEmpty: true})
	.pipe(gulpif(PRODUCTION, imagemin(imageminConfig)))
	.pipe(dest(dirs.icons.output));
}

export const watchChanges = () => {
	[styles, images, copy, scripts, icons].forEach(task => {
		if (!dirs[task.name]) {
			return;
		}

		watch(dirs[task.name].watch, task);
	});

	return Promise.resolve(false);
}

export const dev = series(clean, parallel(styles, images, copy, scripts, icons), watchChanges);
export const build = series(clean, parallel(styles, images, copy, scripts, icons));
export default dev;
