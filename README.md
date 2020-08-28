# Tom's Gulp Config

Gulp config package which compiles JavaScript using Babel and Uglify, SASS using Dart Sass and CleanCSS, and optimises images.

## Installation

Install using `npm install toms-gulp-config --save-dev`. Installation should automatically add 3 scripts to your package.json file. In case this fails, you can add them manually as follows:

```
scripts: {
  watch: 'gulp --gulpfile=node_modules/toms-gulp-config/gulpfile.esm.js',
  dev: 'gulp build --gulpfile=node_modules/toms-gulp-config/gulpfile.esm.js',
  prod: 'gulp build --prod --gulpfile=node_modules/toms-gulp-config/gulpfile.esm.js',
}
```

Unlike most Gulp config packages, you don't need to copy the Gulpfile into your project. This is abstracted away via the commands above to reduce clutter and allow the config to be easily updated in the future.

## Usage

Run `npm run watch` to watch files as they are edited.

Run `npm run build` to run a single development build.

Run `npm run prod` to build file ready for upload into production.

## Included tools

SASS files are generated from `src/sass/style.scss` and `src/sass/admin.scss` into `assets/css/style.css` and `assets/css/admin.css`. Autoprefixer is always used, CleanCSS is used in production, and sourcemaps are generated when not in production.

JS files are generated from `src/js/app.js` and `src/js/admin.js` into `assets/js/app.js` and `assets/js/admin.js`. Babel and Uglify are always used, and sourcemaps are generated when not in production.

JPG, JPEG, PNG, SVG, and GIF images from `src/images/` are optimized into `assets/images/`.

Other files not mentioned above are copied from `src/` into `assets/`.

## Config

Alternatively, if these default directories do not suit your project, you can copy the [gulp-config.json](gulp-config.json) file to your project's root directory to override the defaults. Change any directory name, or set it to `false` to disable that module.
