"use strict";

module.exports = function (grunt) {
  // load all grunt tasks
  require("matchdep")
    .filterDev("grunt-*")
    .forEach(grunt.loadNpmTasks);

  grunt.initConfig({
    config: {
      docs: "src/docs",
      shared: "src/shared",
      npm: "node_modules",
      stage: ".tmp",
      dist: "build"
    },
    env: {
      prod: {
        ENV: "prod"
      },
      dev: {
        ENV: "dev"
      },
      local: {
        ENV: "local"
      }
    },
    preprocess: {
      app: {
        src: "<%= config.docs %>/index.template.html",
        dest: "<%= config.docs %>/index.html"
      }
    },
    watch: {
      app_styles: {
        files: ["<%= config.docs %>/styles/**/*.{scss,sass}"],
        tasks: ["sass:app"]
      },
      app_index: {
        files: ["<%= config.docs %>/index.html.template"],
        tasks: ["preprocess:app"]
      },
      app_views: {
        files: [
          "<%= config.docs %>/core/**/*.html",
          "<%= config.docs %>/states/**/*.html"
        ],
        tasks: ["ngtemplates:app_views"]
      },
      app_sprites: {
        files: ["<%= config.docs %>/assets/sprites/**/*"],
        tasks: ["sprite:all"]
      },
      app_svg: {
        files: ["<%= config.docs %>/assets/svg/**/*"],
        tasks: ["svgstore:all"]
      },
      shared_styles: {
        files: [
          "<%= config.shared %>/styles/**/*.{scss,sass}",
          "<%= config.shared %>/directives/**/*.{scss,sass}"
        ],
        tasks: ["sass:shared"]
      },
      shared_svg: {
        files: ["<%= config.shared %>/assets/**/*.svg"],
        tasks: ["ngtemplates:app_svg"]
      },
      shared_views: {
        files: [
          "<%= config.shared %>/views/**/*.html",
          "<%= config.shared %>/directives/**/*.html"
        ],
        tasks: ["ngtemplates:shared_views"]
      }
    },
    concurrent: {
      options: {
        logConcurrentOutput: true,
        limit: 50
      },
      app: {
        tasks: [
          "watch:app_styles",
          "watch:app_index",
          "watch:app_views",
          "watch:app_sprites",
          "watch:app_svg",
          "watch:shared_styles",
          "watch:shared_svg",
          "watch:shared_views"
        ]
      }
    },
    clean: {
      options: {
        dot: true
      },
      dist: {
        files: [
          {
            src: ["<%= config.dist%>"]
          }
        ]
      },
      stage: {
        files: [
          {
            src: ["<%= config.stage%>"]
          }
        ]
      }
    },
    sass: {
      options: {
        sourceMap: true,
        outputStyle: "compressed",
        debugInfo: false
      },
      app: {
        files: {
          "<%= config.docs %>/styles/main.css":
            "<%= config.docs %>/styles/main.scss"
        }
      },
      shared: {
        files: {
          "<%= config.shared %>/shared.css": "<%= config.shared %>/shared.scss"
        }
      }
    },
    copy: {
      app: {
        files: [
          {
            expand: true,
            dot: true,
            dest: "<%= config.dist %>",
            cwd: "<%= config.docs %>",
            src: ["index.html", "assets/**/*"]
          },
          {
            expand: true,
            dot: true,
            dest: "<%= config.dist %>",
            src: ["<%= config.npm %>/**/*.{html,otf,eot,svg,ttf,woff,woff2}"]
          }
        ]
      },
      paths_local: {
        files: [
          {
            expand: true,
            dot: true,
            dest: "<%= config.docs %>/styles/environments/",
            cwd: "<%= config.docs %>/styles/environments/",
            src: ["_environments.local.scss"],
            rename: function(dest, src) {
              return dest + src.replace(".local", "");
            }
          }
        ]
      },
      paths_remote: {
        files: [
          {
            expand: true,
            dot: true,
            dest: "<%= config.docs %>/styles/environments/",
            cwd: "<%= config.docs %>/styles/environments/",
            src: ["_environments.remote.scss"],
            rename: function(dest, src) {
              return dest + src.replace(".remote", "");
            }
          }
        ]
      },
      stage: {
        files: [
          {
            expand: true,
            dot: true,
            cwd: "<%= config.stage %>",
            dest: "<%= config.dist %>",
            src: ["assets/**/*"]
            // src: ["**/*"]
          }
        ]
      }
    },
    express: {
      app: {
        options: {
          port: 9001,
          bases: "",
          server: "server.docs.js"
        }
      }
    },
    uglify: {
      options: {
        mangle: true,
        beautify: false,
        collapse_vars: false
      }
    },
    useminPrepare: {
      html: "<%= config.docs %>/index.html",
      options: {
        dest: "<%= config.stage %>",
        staging: "<%= config.stage %>"
      }
    },
    usemin: {
      html: "<%= config.dist %>/index.html",
      options: {
        dest: "<%= config.stage %>",
        assetsDirs: ["<%= config.stage %>"]
      }
    },
    ngAnnotate: {
      buildjs: {
        files: [
          {
            expand: true,
            cwd: "<%= config.stage%>/concat/assets/js/",
            src: "build.js",
            dest: "<%= config.stage%>/concat/assets/js/"
          }
        ]
      }
    },
    filerev: {
      options: {
        algorithm: "md5",
        length: 8
      },
      assets: {
        src: "<%= config.stage %>/assets/**/*.{js,css}"
      }
    },
    ngtemplates: {
      app_views: {
        src: [
          "<%= config.docs %>/states/**/*.html",
          "<%= config.docs %>/core/**/*.html",
          "<%= config.shared %>/views/**/*.html"
        ],
        dest: "<%= config.docs %>/docs.templates.js",
        options: {
          prefix: "/",
          module: "ba.docs",
          htmlmin: {
            collapseBooleanAttributes: true,
            collapseWhitespace: true,
            removeAttributeQuotes: true,
            removeComments: true,
            removeEmptyAttributes: true,
            removeRedundantAttributes: true,
            removeScriptTypeAttributes: true,
            removeStyleLinkTypeAttributes: true
          }
        }
      },
      app_svg: {
        src: [
          "<%= config.docs %>/assets/**/*.svg",
          "<%= config.shared %>/assets/**/*.svg"
        ],
        dest: "<%= config.docs %>/docs.templates.svg.js",
        options: {
          prefix: "/",
          module: "ba.docs",
          htmlmin: {
            collapseBooleanAttributes: true,
            collapseWhitespace: true,
            removeAttributeQuotes: true,
            removeComments: true, // Only if you don't use comment directives!
            removeEmptyAttributes: true,
            removeRedundantAttributes: true,
            removeScriptTypeAttributes: true,
            removeStyleLinkTypeAttributes: true,
            keepClosingSlash: true
          }
        }
      },
      shared_views: {
        src: [
          "<%= config.shared %>/views/**/*.html",
          "<%= config.shared %>/directives/**/*.html"
        ],
        dest: "<%= config.shared %>/shared.templates.js",
        options: {
          prefix: "/",
          module: "ba.shared",
          htmlmin: {
            collapseBooleanAttributes: true,
            collapseWhitespace: true,
            removeAttributeQuotes: true,
            removeComments: true,
            removeEmptyAttributes: true,
            removeRedundantAttributes: true,
            removeScriptTypeAttributes: true,
            removeStyleLinkTypeAttributes: true
          }
        }
      }
    },
    sprite: {
      all: {
        src: "<%= config.docs %>/assets/icons/**/*",
        dest: "<%= config.docs %>/assets/imgs/sprites.png",
        destCss: "<%= config.docs %>/styles/core/_sprites.scss"
      },
      retina: {
        src: "<%= config.docs %>/assets/icons-2x/**/*",
        dest: "<%= config.docs %>/assets/imgs/sprites-2x.png",
        destCss: "<%= config.docs %>/styles/core/_sprites-2x.scss"
      }
    },
    svgstore: {
      options: {
        prefix: "svg-",
        symbol: {
          viewBox: "0 0 250 250"
        }
      },
      all: {
        files: {
          "<%= config.docs %>/assets/imgs/defs.svg":
            "<%= config.docs %>/assets/svg/*.svg"
        }
      }
    }
  });

  grunt.registerTask("images", ["sprite:all", "sprite:retina", "svgstore:all"]);


  grunt.registerTask("local", [
    "ngtemplates:app_views",
    "ngtemplates:app_svg",
    "ngtemplates:shared_views",

    // 'images',
    "env:local",
    "copy:paths_local",

    "sass:shared",
    "sass:app",

    "preprocess:app",

    "express:app",
    "concurrent:app"
  ]);

  grunt.registerTask("build", [
    "preprocess:app",
    "clean:dist",
    "copy:paths_remote",

    "images",

    "sass:shared",
    "sass:app",

    "ngtemplates:app_views",
    "ngtemplates:app_svg",
    "ngtemplates:shared_views",

    "copy:app",

    "useminPrepare",
    "concat:generated",
    "ngAnnotate",
    "uglify:generated",
    "cssmin:generated",
    "filerev",
    "usemin",
    
    "copy:stage"
  ]);

  grunt.registerTask("build.dev", [
    "env:dev",
    "build",
    "clean:stage"
  ]);

  grunt.registerTask("build.prod", [
    "env:prod",
    "build",
    "clean:stage"
  ]);
};