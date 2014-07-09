/*
 * grunt-dotnet-codecoverage
 * https://github.com/marcofranssen/grunt-dotnet-codecoverage
 *
 * Copyright (c) 2014 Marco Franssen
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        jshint: {
            all: [
                'Gruntfile.js',
                'tasks/*.js',
                '<%= nodeunit.tests %>',
            ],
            options: {
                jshintrc: '.jshintrc',
            },
        },

        // Before generating any new files, remove any previously-created files.
        clean: {
            tests: ['test/space included path', 'reports'],
        },

        // copy source tests files to path space included
        copy: {
            packageTool: {
                expand: true,
                flatten: false,
                src: ['test/src/packages/**/*'],
                dest: 'test space included path/'
            },
            testAssemblies: {
                expand: true,
                flatten: true,
                src: ['test/src/MySpecs/bin/Debug/*'],
                dest: 'test/space included path/src/MySpecs/bin/Debug/'
            }
        },

        // Configuration to be run (and then tested).
        codecoverage: {
            options: {
                opencoverExe: 'test/src/packages/OpenCover.4.5.2316/OpenCover.Console.exe',
                reportGeneratorExe: 'test/src/packages/ReportGenerator.1.9.1.0/ReportGenerator.exe',
                target: 'test/src/packages/Machine.Specifications.0.6.2/tools/mspec-clr4.exe',
                output: 'reports/codecoverage',
                registerUser: true,
                reportTypes: ['html', 'xml']
            },
            specs: {
                src: ['test/src/**/bin/Debug/*Specs.dll']
            },
            specs_space_path_included: {
                options: {
                    opencoverExe: 'test space included path/test/src/packages/OpenCover.4.5.2316/OpenCover.Console.exe',
                    reportGeneratorExe: 'test space included path/test/src/packages/ReportGenerator.1.9.1.0/ReportGenerator.exe',
                    target: 'test space included path/test/src/packages/Machine.Specifications.0.6.2/tools/mspec-clr4.exe',
                    targetArgs: [
                        '--xml', 'C:/GIT/grunt-dotnet-codecoverage/trunk/reports space included path/index.xml',
                        '--html', 'C:/GIT/grunt-dotnet-codecoverage/trunk/reports space included path'
                    ],
                    output: 'reports space included path/codecoverage',
                },
                src: ['test/space included path/src/MySpecs/bin/**/Debug/*Specs.dll']
            }

        },

        // Unit tests.
        nodeunit: {
            tests: ['test/*_test.js'],
        },

        // restore nuget package for test project
        shell: {
            nuget: {
                options: {
                    stdout: true,
                    execOptions: {
                        cwd: 'test/src'
                    }
                },
                command: 'nuget restore'
            }
        },

        // msbuild to build the test project
        msbuild: {
            src: ['test/**/*.csproj'],
            options: {
                projectConfiguration: 'Debug',
                targets: ['Clean', 'Rebuild'],
                stdout: true,
                maxCpuCount: 4,
                buildParameters: {
                    WarningLevel: 4
                },
                verbosity: 'quiet'
            }
        }
    });

    // Actually load this plugin's task(s).
    grunt.loadTasks('tasks');

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-nodeunit');
    grunt.loadNpmTasks('grunt-shell');
    grunt.loadNpmTasks('grunt-msbuild');
    grunt.loadNpmTasks('grunt-contrib-copy');

    // Whenever the "test" task is run, first clean the "tmp" dir, then run this
    // plugin's task(s), then test the result.
    grunt.registerTask('test', ['clean', 'shell:nuget', 'msbuild', 'copy', 'codecoverage', 'nodeunit']);

    // By default, lint and run all tests.
    grunt.registerTask('default', ['jshint', 'test']);

};