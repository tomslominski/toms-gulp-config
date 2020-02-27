# Gulp Config

Default gulp config for projects.

## Usage

Run `npm run watch` to watch files as they are edited.

Run `npm run prod` to build file ready for upload into production.

## Included tools

SASS files are generated from `src/sass/style.scss` and `src/sass/admin.scss` into `assets/css/style.css` and `assets/css/admin.css`. Autoprefixer is always used, CleanCSS is used in production, and sourcemaps are generated when not in production.

JS files are generated from `src/js/app.js` and `src/js/admin.js` into `assets/js/app.js` and `assets/js/admin.js`. Babel and Uglify are always used, and sourcemaps are generated when not in production.

JPG, JPEG, PNG, SVG, and GIF images from `src/images/` are optimized into `assets/images/`.

Other files not mentioned above are copied from `src/` into `assets/`.
