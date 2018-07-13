const fs =require("fs"),
    path = require("path");
const browserify = require("browserify"),
    ts = require("typescript"),
    tsify = require("tsify"),
    source = require("vinyl-source-stream");
const gulp = require("gulp"),
    connect = require("gulp-connect"),
    flatten = require("gulp-flatten"),
    gulpif = require("gulp-if"),
    postcss = require("gulp-postcss"),
    pug = require("gulp-pug"),
    streamify = require("gulp-streamify"),
    uglify = require("gulp-uglify");
const autoprefixer = require("autoprefixer"),
    cssnano = require("cssnano"),
    precss = require("precss"),
    postcssImport = require("postcss-import");
const config = require("./config.json"),
    package = require("./package.json");

// file urls relative to dist index.html
var jsFiles = config.js.src.map((srcFile) => {
    return path.relative(config.html.outDir,
        path.join(config.js.outDir, path.basename(srcFile, ".ts") + ".js"));
});
var cssFiles = config.css.src.map((srcFile) => {
    return path.relative(config.html.outDir,
        path.join(config.css.outDir, path.basename(srcFile)));
});

var reload = false;

/**
 * merge default options with config.json
 */

var serverRoots = [path.join(__dirname, config.html.outDir)];
var assetRoot = path.join(__dirname, config.css.outDir, "..");
if (serverRoots.indexOf(assetRoot) == -1) serverRoots.push(assetRoot);
assetRoot = path.join(__dirname, config.js.outDir, "..");
if (serverRoots.indexOf(assetRoot) == -1) serverRoots.push(assetRoot);

var serverOptions = mergeOptions({
    port: 3000,
    livereload: true,
    root: serverRoots
}, "serverOptions", "html");

var browserifyOptions = mergeOptions({
    basedir: ".",
    debug: true,
    cache: {},
    packageCache: {}
}, "browserifyOptions", "js");

var tsOptions = mergeOptions({
    lib: ["es5", "es6", "dom"]
}, "typescriptOptions", "js");

var uglifyOptions = mergeOptions({
    output: {
        comments: /@author/
    }
}, "uglifyOptions", "js");

var pugOptions = mergeOptions({
    pretty: !config.html.minify,
    data: {
        title: package.name,
        cssFiles: cssFiles,
        jsFiles: jsFiles
    }
}, "pugOptions", "html");

var postcssOptions = mergeOptions({}, "postcssOptions", "css");
var cssnanoOptions = mergeOptions({}, "cssnanoOptions", "css");

// use css plugins listed in config.json
var activeCssPlugins = [];
var cssPlugins = {
    "autoprefixer": autoprefixer(),
    "precss": precss(),
    "postcss-import": postcssImport()
};
for (let plugin of config.css.plugins) {
    if (cssPlugins.hasOwnProperty(plugin)) {
        activeCssPlugins.push(cssPlugins[plugin]);
    }
}
if (config.css.minify) {
    activeCssPlugins.push(cssnano(cssnanoOptions));
}

/**
 * bundle pug -> html
 */
gulp.task("html", function () {
    // get ClickAction enum as dictionary
    pugOptions.data.clickActions = requireTs("src/js/constants/actions.ts").ClickAction;
    pugOptions.data.groups = requireTs("src/js/constants/groups.ts");
    for (let srcFile of config.html.src) {
        gulp.src(config.html.src)
            .pipe(pug(pugOptions))
            .pipe(gulp.dest(config.html.outDir))
            .pipe(gulpif(reload, connect.reload()));
    }
});

/**
 * bundle postcss -> css
 */
gulp.task("css", function () {
    for (let srcFile of config.css.src) {
        gulp.src(srcFile)
            .pipe(postcss(activeCssPlugins, postcssOptions))
            .pipe(gulp.dest(config.css.outDir))
            .pipe(gulpif(reload, connect.reload()));
    }
});

/**
 * bundle ts -> js
 */
gulp.task("js", function () {
    for (let srcFile of config.js.src) {
        browserify(browserifyOptions)
            .add(srcFile)
            .plugin(tsify, tsOptions)
            .bundle()
            .pipe(source(path.basename( srcFile, ".ts") + ".js"))
            .pipe(gulpif(!reload && config.js.minify,
                streamify(uglify(uglifyOptions))))
            .pipe(gulp.dest(config.js.outDir))
            .pipe(gulpif(reload, connect.reload()));
    }
});

/**
 * serve on localhost:8000
 */
gulp.task("connect", function () {
    connect.server(serverOptions);
});

/**
 * watch for changes in ./src, bundle and livereload
 */
gulp.task("watch", ["build"], function () {
    gulp.watch(["./src/js/*.ts", "./src/js/**/*.ts"], ["js"]);
    gulp.watch(["./src/css/*.css"], ["css"]);
    gulp.watch(["./src/html/*.pug", "./src/html/**/*.pug"], ["html"]);
});

/**
 * bundle html, css, and js files. minify if config.minify
 */
gulp.task("build", ["html", "css", "js"]);

/**
 * bundle files, watch for changes, and serve on localhost:8000
 */
gulp.task("default", ["watch", "connect"], function () {
    reload = serverOptions.livereload;
});

/**
 * merge default options dictionary with options set in config
 * @param {object} base - default options
 * @param {string} label - name of options in config.json
 * @param {string} parent - where to look for options first (e.g. 'js' looks in config.js)
 * @return {object} merged object
 */
function mergeOptions (base, label, parent) {
    if (config[parent].hasOwnProperty(label))
        return mergeObjs(base, config[parent][label]);
    if (config.hasOwnProperty(label))
        return mergeObjs(base, config[label]);
    return base;
}

/**
 * merge objects
 * values from b merged into a, replacing non-object values
 * object values are recursively merged
 * e.g. a = { x: 0, y: { foo: 0 } }, b = { x: 1, y: { bar: 1 } }
 *      merged = { x: 1,  y: { foo: 0, bar: 1 } }
 */
function mergeObjs (a, b) {
    for (let k of Object.keys(b)) {
        if (a.hasOwnProperty(k) &&
            typeof a[k] == "object" &&
            typeof b[k] == "object") {
            // if both arrays, concat
            if (Array.isArray(a[k])) {
                if (Array.isArray(b[k])) {
                    a[k] = a[k].concat(b[k]);
                    continue;
                }
            }
            // if both objects, merge
            a[k] = mergeObjs(a[k], b[k]);
            continue;
        }
        a[k] = b[k];
    }
    return a;
}

/**
 * get exports from typescript file
 * @param {string} filepath .ts file path
 * @param {object} [opts] ts compiler options
 * @return {object} module.exports of transpiled file
 */
function requireTs (filepath, opts) {
    var options = opts ? opts : {
        module: ts.ModuleKind.CommonJS,
        preserveConstEnums: true
    };
    var str = fs.readFileSync(path.join(__dirname, filepath), "utf8");
    var res = ts.transpileModule(str, options);
    var m = new module.constructor();
    m._compile(res.outputText, "");
    return m.exports;
}