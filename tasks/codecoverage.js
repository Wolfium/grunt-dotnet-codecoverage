/*
 * grunt-dotnet-codecoverage
 * https://github.com/marcofranssen/grunt-dotnet-codecoverage
 *
 * Copyright (c) 2014 Marco Franssen
 * Licensed under the MIT license.
 */

'use strict';

var path = require('path'),
    buildOpenCoverCommand = function(grunt, files, options) {
        var opencover = options.opencoverExe,
            args = [];
        if (opencover) {
            if (!grunt.file.isPathAbsolute(opencover)) {
                options.opencoverExe = path.join(process.cwd(), options.opencoverExe);
            }
            opencover = options.opencoverExe;
        }
        opencover = opencover.replace(/\\/g, path.sep);
        var assemblies = files.map(function(file) {
            return '\"' + path.normalize(file.src) + '\"';
        });

        // Change default behaviour of OpenCover to always return target's return code instead itself return code
        // Hack to minimize false positives when target fails with a return code was not passing outside OpenCover
        if (!options.returntargetcode) {
          options.returntargetcode = 2222;
        }
        args.push('-returntargetcode:' + options.returntargetcode);
 
        if (options.registerUser) {
            args.push('-register:user');
        }
        if (options.target) {
            var target = options.target;
            if (!grunt.file.isPathAbsolute(target)) {
                options.target = path.join(process.cwd(), options.target);
            }
            target = options.target;
            args.push('-target:' + target);
        }
        var targetArgs = '';
        if (options.targetArgs) {
            targetArgs = targetArgs + ' \"' + options.targetArgs.join('\" \"') + '\"';
        }
        if (assemblies) {
            targetArgs = targetArgs + ' ' + assemblies.join(' ');
        }
        args.push('-targetargs:' + targetArgs);
        if (options.output) {
            var filePath = path.join(process.cwd(), options.output);
            grunt.file.mkdir(filePath);
            args.push('-output:' + path.join(options.output, 'coverage-output.xml'));
        }

        return {
            path: path.normalize(opencover),
            args: args
        };
    },
    buildReportGeneratorCommand = function(grunt, files, options) {
        var reportGenerator = options.reportGeneratorExe,
            opencoverOutput = path.join(process.cwd(), options.output, 'coverage-output.xml'),
            args = [];
        if (reportGenerator) {
            if (!grunt.file.isPathAbsolute(reportGenerator)) {
                options.reportGeneratorExe = path.join(process.cwd(), options.reportGeneratorExe);
            }
            reportGenerator = options.reportGeneratorExe;
        }

        if (options.output) {
            args.push('-reports:' + opencoverOutput);
            args.push('-targetDir:' + options.output);
        }
        if (options.reportTypes) {
            args.push('-reporttypes:' + options.reportTypes.join(';'));
        }

        return {
            path: path.normalize(reportGenerator),
            args: args
        };
    },
    executeCommand = function(grunt, command, processCallback, errorCallback) {
        var log = function(message) {
            console.log(message.toString('utf8'));
        };
        var childProcess = grunt.util.spawn({
            cmd: command.path,
            args: command.args
        }, processCallback);

        childProcess.stdout.on('data', log);
        childProcess.stderr.on('data', log);
        childProcess.on('error', errorCallback);
    };

module.exports = function(grunt) {

    grunt.registerMultiTask('codecoverage', 'Grunt plugin to generate code coverage report using opencover and reportgenerator', function() {

        var options = this.options({
            output: 'reports/opencover'
        }),
            files = this.files,
            taskComplete = this.async();
        var openCoverCommand = buildOpenCoverCommand(grunt, files, options),
            reportGeneratorCommand = buildReportGeneratorCommand(grunt, files, options);

        console.log();
        console.log('code coverage runner');
        console.log();
        console.log(openCoverCommand.path + ' ' + openCoverCommand.args.join(' '));
        console.log();
        executeCommand(grunt, openCoverCommand, function(err, result, code) {
            if (code > 0) {
                grunt.fail.fatal('OpenCover failed');
            }
            String(result);
            console.log();
            console.log(reportGeneratorCommand.path + ' ' + reportGeneratorCommand.args.join(' '));
            executeCommand(grunt, reportGeneratorCommand, function(err, result, code) {
                if (code > 0) {
                    grunt.fail.fatal('ReportGenerator failed');
                }
                String(result);
                taskComplete(code === 0);
            }, function(err) {
                grunt.fail.fatal(err.code === 'ENOENT' ? 'Unable to find the reportgenerator executable located at "' + openCoverCommand.path + '".' : err.message);
            });
        }, function(err) {
            grunt.fail.fatal(err.code === 'ENOENT' ? 'Unable to find the opencover executable located at "' + openCoverCommand.path + '".' : err.message);
        });
    });

};