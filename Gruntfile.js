/*global module:false*/

module.exports = function (grunt) {

  'use strict';

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-connect-proxy');
  grunt.loadNpmTasks('grunt-hoodie');


  // Project configuration.
  grunt.initConfig({

    pkg: require('./package.json'),
    cfg: {},

    jshint: {
      files: [
        'Gruntfile.js',
        'www/assets/js/**/*.js'
      ],
      options: {
        jshintrc: '.jshintrc'
      }
    },

    watch: {
      files: [
        '<%= jshint.files %>',
        'www/**/*.html'
      ],
      tasks: ['jshint'],
      options: {
        livereload: true
      }
    },

    hoodie: {
      start: {
        options: {
          callback: function (config) {
            grunt.config.set('cfg', config);
          }
        }
      }
    },

    connect: {
      server: {
        options: {
          port: 9000,
          base: 'www',
          hostname: '0.0.0.0',
          open: true,
          middleware: function (connect, options) {
            var proxy = require('grunt-connect-proxy/lib/utils').proxyRequest;
            return [
              proxy,
              connect.static(options.base),
              connect.directory(options.base)
            ];
          }
        },
        proxies: [
          {
            context: '/_api',
            host: '<%= cfg.stack.www.host %>',
            port: '<%= cfg.stack.www.port %>'
          }

        ]
      }
    }
  });

  // Default task.
  grunt.registerTask('serve', [
    'hoodie',
    'connect:server',
    'configureProxies:server',
    'watch'
  ]);
  grunt.registerTask('default', ['serve']);
};

