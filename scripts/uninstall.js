const path = require('path');
const fs = require('fs');

const packagePath = path.join(process.env.INIT_CWD, 'package.json');
let packageFile = fs.existsSync(packagePath) ? JSON.parse(fs.readFileSync(packagePath)) : {};
const scripts = {
	watch: 'gulp',
	dev: 'gulp build',
	prod: 'gulp build --prod',
};

for (let command in scripts) {
	if (typeof packageFile.scripts[command] !== 'undefined' && packageFile.scripts[command] === scripts[command]) {
		delete packageFile.scripts[command];
		delete scripts[command];
	} else {
		console.warn('Script "%s" seems to have been modified since this package was installed, so it was not removed.', command);
	}
}

packageFile = JSON.stringify(packageFile);

fs.writeFileSync(packagePath, packageFile);

if( Object.keys(scripts).length === 0 ) {
	console.info('Scripts removed from package.json file successfully.');
}
