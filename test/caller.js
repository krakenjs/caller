'use strict';


var test = require('tape'),
    caller = require('../');


test('caller', function (t) {

    t.test('determine caller', function (t) {
        var actual, expected;

        actual = caller();
        expected = require.resolve('tape/lib/test');
        t.equal(actual, expected);
        t.end();
    });

    t.test('determine caller at runtime', function (t) {
        var callee, actual, expected;

        callee = require('./fixtures/callee');
        actual = callee(caller);
        expected = __filename;

        t.equal(actual, expected);
        t.end();
    });

    t.test('determine caller with depth', function (t) {
        var callee, actual, expected;

        callee = require('./fixtures/callee');
        actual = callee(caller.bind(null, 2));
        expected = require.resolve('tape/lib/test');

        t.equal(actual, expected);
        t.end();
    });

    t.test('determine caller with depth cap', function (t) {
        var callee, actual, expected;

        callee = require('./fixtures/callee');
        actual = callee(caller.bind(null, 99));
        expected = require.resolve('tape/lib/test');

        t.equal(actual, expected);
        t.end();
    });

    t.test('determine caller at initialization time', function (t) {
        var actual, expected;

        actual = require('./fixtures/init');
        expected = __filename;

        t.equal(actual, expected);
        t.end();
    });

});
