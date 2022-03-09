function copyConstructorProperties(target, source) {
    const keys = Object.getOwnPropertyNames(source);
    for (let i = 0; i < keys.length; i++) {
        var key = keys[i];
        if (!target.hasOwnProperty(key)) {
            Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        }
    }
}
// inspired from https://github.com/zloirock/core-js/blob/master/packages/core-js/internals/wrap-error-constructor-with-cause.js
function wrapErrorConstructor(ERROR_NAME, wrapper) {
    const clearErrorStack = (function () {
        const TEST = (function (arg) { return String(Error(arg).stack); })('zxcasd');
        const V8_OR_CHAKRA_STACK_ENTRY = /\n\s*at [^:]*:[^\n]*/;
        const IS_V8_OR_CHAKRA_STACK = V8_OR_CHAKRA_STACK_ENTRY.test(TEST);
        return function clearErrorStackInner(stack, dropEntries) {
            if (IS_V8_OR_CHAKRA_STACK && typeof stack == 'string') {
                while (dropEntries--) stack = stack.replace(V8_OR_CHAKRA_STACK_ENTRY, '');
            } return stack;
        };
    })();

    const OriginalError = globalThis[ERROR_NAME];

    const OriginalErrorPrototype = OriginalError.prototype;

    const WrappedError = wrapper(function (a) {
        const message = String(a);
        const result = new OriginalError();
        if (message !== undefined) Object.defineProperty(result, 'message', { value: message, enumerable: false, configurable: true, writable: true });
        Object.defineProperty(result, 'stack', { value: clearErrorStack(result.stack, 2), enumerable: false, configurable: true, writable: true });
        // if (this && OriginalErrorPrototype.isPrototypeOf(this)) {
        //     // inheritIfRequired(result, this, WrappedError);
        //     Object.setPrototypeOf(result, this.constructor); //??
        // }
        return result;
    });

    WrappedError.prototype = OriginalErrorPrototype;

    // Copy ownKeys from OriginalError to WrappedError
    copyConstructorProperties(WrappedError, OriginalError);

    globalThis[ERROR_NAME] = WrappedError;
};

module.exports = function wrapError() {
    const ErrorClassName = 'Error';
    const OriginalError = globalThis[ErrorClassName];
    wrapErrorConstructor(ErrorClassName, function (init) {
        return function Error(message) { return init.apply(this, arguments); };
    });

    return function restore() {
        globalThis[ErrorClassName] = OriginalError;
    };
};
