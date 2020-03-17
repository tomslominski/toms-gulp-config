const path = require('path');
const fs = require('fs');
const colors = require('colors');

const packagePath = path.join(process.env.INIT_CWD, 'package.json');
let packageFile = fs.existsSync(packagePath) ? JSON.parse(fs.readFileSync(packagePath)) : {};
const scripts = {
	watch: 'gulp --gulpfile=node_modules/toms-gulp-config/gulpfile.esm.js',
	dev: 'gulp build --gulpfile=node_modules/toms-gulp-config/gulpfile.esm.js',
	prod: 'gulp build --prod --gulpfile=node_modules/toms-gulp-config/gulpfile.esm.js',
};

Object.keys(scripts).forEach((command) => {
	if (typeof packageFile.scripts[command] !== 'undefined' && packageFile.scripts[command] === scripts[command]) {
		delete packageFile.scripts[command];
		delete scripts[command];
	} else {
		console.warn('Script "%s" seems to have been modified since this package was installed, so it was not removed.'.red, command);
	}
});

packageFile = JSON.stringify(packageFile);

fs.writeFileSync(packagePath, packageFile);

if (Object.keys(scripts).length === 0) {
	console.info('Scripts removed from package.json file successfully.'.green);
}
