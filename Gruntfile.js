module.exports = function (grunt) {
    'use strict';

    // Project configuration.
    grunt.initConfig({
        jasmine: {
            src: 'Source/core/CarbonFootprintCore.js',
            options: {
                specs: 'Spec/**/*Spec.js'
            }
        },
        jshint: {
            options: {
                reporter: require('jshint-stylish'),
                ignores: ['**/*.min.*']
            },
            grunt: ['Gruntfile.js'],
            core: ['Source/core/**/*.js'],
            background: ['Source/background/background.js'],
            pages: ['Source/pages/**/*.js']
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jasmine');

    grunt.loadNpmTasks('grunt-contrib-jshint');

    grunt.registerTask('test', ['jshint', 'jasmine']);
};