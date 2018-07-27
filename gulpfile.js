"use strict";
var gulp = require("gulp"),
    sass = require("gulp-sass"),
    autoprefixer = require("gulp-autoprefixer"),
    cssnano = require("gulp-cssnano"),
    sourcemaps = require("gulp-sourcemaps"),
    concat = require("gulp-concat"),
    rename = require("gulp-rename"),
    browsersync = require("browser-sync").create(),
    del = require("del"),
    gulpif = require("gulp-if"),
    htmlmin = require("gulp-htmlmin"),
    md5 = require("gulp-md5-plus"),
    sequence = require("gulp-sequence"),
    minimist = require("minimist"),
    browserify = require("browserify"),
    babelify = require("babelify"),
    uglify = require("gulp-uglify"),
    source = require("vinyl-source-stream"),
    buffer = require("vinyl-buffer"),
    tsify = require("tsify"),
    es = require("event-stream"),
    header = require("gulp-header"),
    clone = require("gulp-clone");

var knownOptions = {
    string: "env",
    default: {
        env: process.env.NODE_ENV || "development"
    }
};
var options = minimist(process.argv.slice(2), knownOptions);

const config = {
    html: {
        src: ["index.html", "views/**/*.html"],
        dest: "dist/",
        watch: ["index.html", "views/**/*.html"],
        minify: true,
        htmlMinOptions: {
            removeComments: true,
            collapseWhitespace: true,
            collapseBooleanAttributes: true,
            removeEmptyAttributes: true,
            removeScriptTypeAttributes: true,
            removeStyleLinkTypeAttributes: true,
            minifyJS: true,
            minifyCSS: true
        },
        srcOptions: {
            base: "."
        }
    },
    styles: {
        src: "src/scss/*.scss",
        dest: "dist/styles",
        watch: "src/scss/**/*.scss",
        sourcemap: options.env !== "production",
        concat: {
            enabled: false,
            fileName: "styles.css"
        },
        minify: {
            enabled: true || options.env === "production",
        },
        suffix: {
            enabled: true,
            text: ".min"
        },
        md5: {
            enabled: options.env === "production",
            html: "./dist/**/*.html"
        }
    },
    gallery: {
        dest: "dist/scripts",
        watch: ["src/scripts/**/*.js", "src/scripts/**/*.ts"],
        sourcemap: options.env !== "production",
        bundle: "bundle.js",
        minify: {
            enabled: false || options.env === "production",
        },
        suffix: {
            enabled: true,
            text: ".min"
        },
        md5: {
            enabled: options.env === "production",
            html: "./dist/**/*.html"
        },
        browserify: {
            entries: "src/scripts/GalleryEntry.ts",
            debug: options.env !== "production",
            transform: [
                [babelify, {
                    "presets": ["env"]
                }]
            ]
        }
    },
    static: {
        src: "static/**/",
        dest: "dist/static",
        watch: "static/"
    },
    chore: {
        src: ["README.md", "_config.yml", "LICENSE"],
        dest: "dist/"
    },
    clean: {
        path: "dist/"
    },
    release: {
        dest: "release/",
        suffix: ".min",
        bundle: "general-engine.js",
        browserify: {
            entries: "src/scripts/Engine/_General.js",
            transform: [
                [babelify, {
                    "presets": ["env"]
                }]
            ]
        }
    },
    npm: {
        dest: "lib/",
        suffix: ".min",
        bundle: "index.js",
        browserify: {
            entries: "src/scripts/Engine/_General.js",
            standalone: "General",
            transform: [
                [babelify, {
                    "presets": ["env"]
                }]
            ]
        }
    },
    server: {
        baseDir: "./dist",
        host: "0.0.0.0",
        index: "README.md"
    },
    task: {
        default: "default",
        watch: "watch",
        server: "server",
        html: "html",
        styles: "styles",
        gallery: "scripts:gallery",
        static: "static",
        chore: "chore",
        clean: "clean",
        npm: "scripts:npm",
        release: "scripts:release"
    }
};

const banner = [
    "/**",
    "* <%= context.name %> <%= context.version %> by <%= context.author %> <%= context.date %>",
    "* <%= context.homepage %>",
    "* License <%= context.license %>",
    "*/",
    ""
].join("\n");

// Watch
gulp.task(config.task.watch, [config.task.default, config.task.server], function () {
    gulp.watch(config.html.watch, [config.task.html]).on("change", browsersync.reload);
    gulp.watch(config.styles.watch, [config.task.styles]);
    gulp.watch(config.gallery.watch, [config.task.gallery]);
});

// Default
gulp.task(config.task.default, sequence(config.task.clean, [config.task.html, config.task.static, config.task.chore], [config.task.styles, config.task.gallery]));

// Server
gulp.task(config.task.server, function () {
    browsersync.init({
        server: {
            baseDir: config.server.baseDir,
            index: config.server.index
        },
        host: config.server.host
    });
});

// Clean
gulp.task(config.task.clean, function () {
    return del(config.clean.path);
});

// Chore
gulp.task(config.task.chore, function () {
    return gulp.src(config.chore.src)
        .pipe(gulp.dest(config.chore.dest))
        .pipe(gulpif(options.env !== "production", browsersync.stream()));
});

// Static
gulp.task(config.task.static, function () {
    return gulp.src(config.static.src)
        .pipe(gulp.dest(config.static.dest))
        .pipe(gulpif(options.env !== "production", browsersync.stream()));
});

// Html
gulp.task(config.task.html, function () {
    return gulp.src(config.html.src, config.html.srcOptions)
        .pipe(htmlmin(config.html.htmlMinOptions))
        .pipe(gulp.dest(config.html.dest))
        .pipe(gulpif(options.env !== "production", browsersync.stream()));
});

// Styles
gulp.task(config.task.styles, function () {
    return gulp.src(config.styles.src)
        .pipe(gulpif(config.styles.sourcemap, sourcemaps.init()))
        .pipe(sass().on("error", sass.logError))
        .on("error", sass.logError)
        .pipe(autoprefixer("last 2 version"))
        .pipe(gulpif(config.styles.concat.enabled, concat(config.styles.concat.fileName)))
        .pipe(gulpif(config.styles.minify.enabled, cssnano()))
        .pipe(gulpif(config.styles.suffix.enabled, rename({
            suffix: config.styles.suffix.text
        })))
        .pipe(gulpif(config.styles.sourcemap, sourcemaps.write(".")))
        .pipe(gulpif(config.styles.md5.enabled, md5(10, config.styles.md5.html)))
        .pipe(gulp.dest(config.styles.dest))
        .pipe(gulpif(options.env != "production", browsersync.stream()));
});

// Scripts
gulp.task(config.task.gallery, function () {
    return buildGalleryScripts(compile(config.gallery), config.gallery)
        .pipe(gulpif(options.env !== "production", browsersync.stream()));
});

// NPM
gulp.task(config.task.npm, function () {
    return buildNPMScripts(compile(config.npm), config.npm);
});

// Release
gulp.task(config.task.release, function () {
    return buildReleaseScripts(compile(config.release), config.release);
});


function buildNPMScripts(stream, args) {
    return stream.pipe(gulp.dest(args.dest));
}

function buildReleaseScripts(stream, args) {
    let script_normal = stream
        .pipe(clone())
        .pipe(header(banner, {
            context: options
        }))
        .pipe(gulp.dest(args.dest));
    let script_minify = stream
        .pipe(clone())
        .pipe(uglify())
        .pipe(header(banner, {
            context: options
        }))
        .pipe(rename({
            suffix: args.suffix
        })).pipe(gulp.dest(args.dest));

    return es.merge(script_normal, script_minify);
}

function buildGalleryScripts(stream, args) {
    return stream
        .pipe(gulpif(args.sourcemap, sourcemaps.init({
            loadMaps: true
        })))
        .pipe(gulpif(args.minify.enabled, uglify()))
        .pipe(gulpif(args.suffix.enabled, rename({
            suffix: args.suffix.text
        })))
        .pipe(gulpif(args.sourcemap, sourcemaps.write(".")))
        .pipe(gulpif(args.md5.enabled, md5(10, args.md5.html)))
        .pipe(gulp.dest(args.dest));
}

function compile(args) {
    return browserify(args.browserify)
        .plugin(tsify)
        .bundle()
        .on("error", function (err) {
            // eslint-disable-next-line
            console.error(err);
            if (options.env !== "production") {
                this.emit("end");
            }
        })
        .pipe(source(args.bundle))
        .pipe(buffer());
}