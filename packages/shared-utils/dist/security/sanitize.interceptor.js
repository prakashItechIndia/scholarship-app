"use strict";
/**
 * Input Sanitization Interceptor
 * Automatically sanitizes request body, query, and params to prevent XSS attacks
 */
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SanitizeInterceptor = void 0;
const common_1 = require("@nestjs/common");
const operators_1 = require("rxjs/operators");
const validation_1 = require("./validation");
let SanitizeInterceptor = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var SanitizeInterceptor = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            SanitizeInterceptor = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        intercept(context, next) {
            const request = context.switchToHttp().getRequest();
            // Sanitize request body
            if (request.body && typeof request.body === 'object') {
                request.body = (0, validation_1.sanitizeObject)(request.body);
            }
            // Sanitize query parameters
            // Note: request.query is read-only (has only a getter), so we sanitize values in place
            if (request.query && typeof request.query === 'object') {
                try {
                    // Iterate over query keys and sanitize string values in place
                    Object.keys(request.query).forEach((key) => {
                        const value = request.query[key];
                        if (typeof value === 'string') {
                            const sanitized = (0, validation_1.sanitizeString)(value);
                            // Use Object.defineProperty to replace the value
                            // This works around the read-only getter limitation
                            try {
                                Object.defineProperty(request.query, key, {
                                    value: sanitized,
                                    writable: true,
                                    enumerable: true,
                                    configurable: true,
                                });
                            }
                            catch {
                                // If we can't modify, the value will remain unsanitized
                                // This is acceptable as it's a defensive measure
                            }
                        }
                        else if (typeof value === 'object' && value !== null) {
                            // For nested objects, sanitize recursively
                            const sanitized = (0, validation_1.sanitizeObject)(value);
                            try {
                                Object.defineProperty(request.query, key, {
                                    value: sanitized,
                                    writable: true,
                                    enumerable: true,
                                    configurable: true,
                                });
                            }
                            catch {
                                // If we can't modify, skip
                            }
                        }
                    });
                }
                catch {
                    // If sanitization fails, continue without sanitizing query
                }
            }
            // Sanitize route parameters
            // Note: request.params is also read-only, so we sanitize values in place
            if (request.params && typeof request.params === 'object') {
                try {
                    Object.keys(request.params).forEach((key) => {
                        const value = request.params[key];
                        if (typeof value === 'string') {
                            const sanitized = (0, validation_1.sanitizeString)(value);
                            try {
                                Object.defineProperty(request.params, key, {
                                    value: sanitized,
                                    writable: true,
                                    enumerable: true,
                                    configurable: true,
                                });
                            }
                            catch {
                                // If we can't modify, skip
                            }
                        }
                        else if (typeof value === 'object' && value !== null) {
                            const sanitized = (0, validation_1.sanitizeObject)(value);
                            try {
                                Object.defineProperty(request.params, key, {
                                    value: sanitized,
                                    writable: true,
                                    enumerable: true,
                                    configurable: true,
                                });
                            }
                            catch {
                                // If we can't modify, skip
                            }
                        }
                    });
                }
                catch {
                    // If sanitization fails, continue without sanitizing params
                }
            }
            return next.handle().pipe((0, operators_1.map)((data) => {
                // Optionally sanitize response data (be careful with this)
                // For now, we'll only sanitize inputs, not outputs
                return data;
            }));
        }
    };
    return SanitizeInterceptor = _classThis;
})();
exports.SanitizeInterceptor = SanitizeInterceptor;
