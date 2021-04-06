// @ts-nocheck

// config
const packageFile = './package.json';
const tsConfigFile = './tsconfig.json';

const sourceDir = "./src/main/";
const targetDir = "./target/";

const typesriptDirName = 'ts';
const javascriptDirName = 'js';
const scssDirName = 'scss';
const cssDirName = 'scss';
const localesDirName = 'locales';
const resourcesDirName = 'resources';

// script
const tsConfig  = require(tsConfigFile);
const package = require(packageFile);

const gulp = require("gulp");
const gulpPlugins = require('gulp-load-plugins')();
const gulpTypescript = require('gulp-typescript');

let clean = () => {
        return gulp.src(targetDir + '/*', { read: false })
                .pipe(gulpPlugins.clean());
}

let typescript = () => {
        var tsProject = gulpTypescript.createProject(tsConfigFile);
        return gulp
                .src(sourceDir + typesriptDirName + "/**/*.ts")
                .pipe(tsProject())
                .pipe(gulpPlugins.regexReplace({ regex: 'import .*? from (?:"|\')([^\'"]+)(?:"|\');', replace: (s) => { return s.endsWith(".js") || !s.startsWith(".") ? s : s + ".js"; } }))
                .pipe(gulp.dest(targetDir + javascriptDirName));
}

let javascript = () => {
        return gulp
                .src(sourceDir + javascriptDirName + "/**/*.js")
                // .pipe(plugins.regexReplace({ regex: 'import .*? from (?:"|\')([^\'"]+)(?:"|\');', replace: (s) => { return s.endsWith(".js") || !s.startsWith(".") ? s : s + ".js"; } }))
                .pipe(gulp.dest(targetDir + javascriptDirName));
}

let translation = () => {
        return gulp
                .src(sourceDir + localesDirName + "/**")
                .pipe(gulp.dest(targetDir + "_locales"));
}

let npm = () => {
        return gulp
                .src(gulpPlugins.npmDist(), { base: './node_modules' })
                .pipe(gulpPlugins.filter(['**/esm/*']))
                .pipe(gulpPlugins.rename(function (path) {
                        path.dirname = path.dirname.replace(/\/dist/, '').replace(/\\dist/, '');
                        path.dirname = path.dirname.replace(/\/esm/, '').replace(/\\esm/, '');
                }))
                .pipe(gulpPlugins.debug({ title: 'npm:' }))
                .pipe(gulp.dest(targetDir + "libs"));
}

// Compile Our Sass
let sass = () => {
        return gulp.src(sourceDir + scssDirName + "/**.scss")
                .pipe(gulpPlugins.sass())
                .pipe(gulp.dest(targetDir + cssDirName));
}

let copyResources = () => {
        return gulp.src(sourceDir + resourcesDirName + "/**")
                .pipe(gulp.dest(targetDir));
}

exports.clean = clean;
exports.typescript = typescript;
exports.javascript = javascript;
exports.npm = npm;
exports.sass = sass;
exports.translation = translation;
exports.copyResources = copyResources;
exports.build = gulp.series(gulp.parallel(exports.typescript, exports.javascript, exports.copyResources, exports.sass));
