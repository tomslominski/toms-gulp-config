const path = require('path');
const fs = require('fs');
const merge = require('@ianwalter/merge');
const colors = require('colors');

const packagePath = path.join(process.env.INIT_CWD, 'package.json');
let packageFile = fs.existsSync(packagePath) ? JSON.parse(fs.readFileSync(packagePath)) : {};
const scripts = {
	scripts: {
		watch: 'gulp --gulpfile=node_modules/toms-gulp-config/gulpfile.esm.js',
		dev: 'gulp build --gulpfile=node_modules/toms-gulp-config/gulpfile.esm.js',
		prod: 'gulp build --prod --gulpfile=node_modules/toms-gulp-config/gulpfile.esm.js',
	},
};

if (typeof packageFile.name === 'undefined') {
	console.warn('Package file doesn\'t exist or is not formatted correctly. Please add scripts to the package.json file manually.'.red);
	return;
}

if (typeof packageFile.scripts.watch !== 'undefined' || typeof packageFile.scripts.dev !== 'undefined' || typeof packageFile.scripts.prod !== 'undefined') {
	console.warn('The scripts this package requires have already been defined in your package.json file. Please override them manually if you wish.'.red);
	return;
}

packageFile = merge(packageFile, scripts);
packageFile = JSON.stringify(packageFile);

fs.writeFileSync(packagePath, packageFile);

console.info('Scripts added to package.json file successfully.'.green);
