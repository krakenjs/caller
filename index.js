'use strict';


/**
 * Module wrapper of @substack's `caller.js`
 * @original: https://github.com/substack/node-resolve/blob/master/lib/caller.js
 * @blessings: https://twitter.com/eriktoth/statuses/413719312273125377
 * @see https://code.google.com/p/v8/wiki/JavaScriptStackTraceApi
 */
module.exports = function (depth) {
    var pst, stack, file, frame;

    pst = Error.prepareStackTrace;
    Error.prepareStackTrace = function (e, frames) {
        var stack = frames.map((frame) => {
            return frame.getFileName();
        });
        Error.prepareStackTrace = pst;
        return stack;
    };

    stack = (new Error()).stack;


    // depth = !depth || isNaN(depth) ? 1 : (depth > stack.length - 5 ? stack.length - 5 : depth);
    // stack = stack.slice(depth + 1);
    stack = stack.slice(2);

    do {
        file = stack.shift();
    } while (stack.length && file.match(/module\.js?/));

    return file;
};
