const { execSync } = require('child_process');
const fs = require('fs');

const package = JSON.parse(fs.readFileSync('package.json'));
if (package?.globalDependencies instanceof Array) {
    for (let globaldep of package.globalDependencies) {
        console.info("install", globaldep);
        execSync('npm i -g ' + globaldep);
    }
}
