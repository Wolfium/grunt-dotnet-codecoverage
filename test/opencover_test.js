'use strict';

var grunt = require('grunt');

/*
  ======== A Handy Little Nodeunit Reference ========
  https://github.com/caolan/nodeunit

  Test methods:
    test.expect(numAssertions)
    test.done()
  Test assertions:
    test.ok(value, [message])
    test.equal(actual, expected, [message])
    test.notEqual(actual, expected, [message])
    test.deepEqual(actual, expected, [message])
    test.notDeepEqual(actual, expected, [message])
    test.strictEqual(actual, expected, [message])
    test.notStrictEqual(actual, expected, [message])
    test.throws(block, [error], [message])
    test.doesNotThrow(block, [error], [message])
    test.ifError(value)
*/

exports.codecoverage = {
    setUp: function(done) {
        // setup here if necessary
        done();
    },
    opencover: function(test) {
        test.expect(1);

        var coverage_output_xml_exists = grunt.file.exists('reports/codecoverage/coverage-output.xml');
        test.ok(coverage_output_xml_exists, 'reports/codecoverage/coverage-output.xml should exist');

        test.done();
    },
    reportgenerator: function(test) {
        test.expect(5);

        var index_html_exists = grunt.file.exists('reports/codecoverage/index.htm');
        var report_css_exists = grunt.file.exists('reports/codecoverage/report.css');
        var combined_js_exists = grunt.file.exists('reports/codecoverage/combined.js');
        var mycode_calculator_html_exists = grunt.file.exists('reports/codecoverage/MyCode_Calculator.htm');
        var summary_xml_exists = grunt.file.exists('reports/codecoverage/summary.xml');

        test.ok(index_html_exists, 'reports/codecoverage/index.xml should exist');
        test.ok(report_css_exists, 'reports/codecoverage/report.css should exist');
        test.ok(combined_js_exists, 'reports/codecoverage/combined.js should exist');
        test.ok(mycode_calculator_html_exists, 'reports/codecoverage/MyCode_Calculator.htm should exist');
        test.ok(summary_xml_exists, 'reports/codecoverage/summary.xml should exist');

        test.done();
    },
    opencover_with_spaces: function (test) {
        test.expect(4);

        var coverage_output_xml_exists = grunt.file.exists('reports space included path/codecoverage/coverage-output.xml');
        test.ok(coverage_output_xml_exists, 'reports space included path/codecoverage/coverage-output.xml should exist');

        var target_output_xml_exists = grunt.file.exists('reports space included path/index.xml');
        test.ok(target_output_xml_exists, 'reports space included path/index.xml should exist');

        var target_output_html_exists = grunt.file.exists('reports space included path/index.html');
        test.ok(target_output_html_exists, 'reports space included path/index.html should exist');

        var asm_output_html_exists = grunt.file.exists('reports space included path/MySpecs.html');
        test.ok(asm_output_html_exists, 'reports space included path/MySpecs should exist');

        test.done();
    },
    reportgenerator_with_spaces: function (test) {
        test.expect(5);

        var index_html_exists = grunt.file.exists('reports space included path/codecoverage/index.htm');
        var report_css_exists = grunt.file.exists('reports space included path/codecoverage/report.css');
        var combined_js_exists = grunt.file.exists('reports space included path/codecoverage/combined.js');
        var mycode_calculator_html_exists = grunt.file.exists('reports space included path/codecoverage/MyCode_Calculator.htm');
        var summary_xml_exists = grunt.file.exists('reports space included path/codecoverage/summary.xml');

        test.ok(index_html_exists, 'reports space included path/codecoverage/index.xml should exist');
        test.ok(report_css_exists, 'reports space included path/codecoverage/report.css should exist');
        test.ok(combined_js_exists, 'reports space included path/codecoverage/combined.js should exist');
        test.ok(mycode_calculator_html_exists, 'reports space included path/codecoverage/MyCode_Calculator.htm should exist');
        test.ok(summary_xml_exists, 'reports space included path/codecoverage/summary.xml should exist');

        test.done();
    },
};