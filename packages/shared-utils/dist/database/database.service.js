"use strict";
/**
 * Shared Database Service
 * Provides optimized database connection pooling and query utilities for SQL Server
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SharedDatabaseService = void 0;
exports.buildSqlServerConfig = buildSqlServerConfig;
const common_1 = require("@nestjs/common");
const mssql_1 = __importDefault(require("mssql"));
const constants_1 = require("../constants");
/**
 * Build SQL Server connection config from config object
 */
function buildSqlServerConfig(config) {
    const host = config.DB_HOST;
    const port = config.DB_PORT ?? '1433';
    const database = config.DB_DATABASE;
    const username = config.DB_USERNAME;
    const password = config.DB_PASSWORD ?? '';
    if (!host || !database || !username) {
        throw new Error('Database config missing. Provide DB_HOST, DB_PORT, DB_DATABASE, DB_USERNAME (DB_PASSWORD optional)');
    }
    // For this environment, always disable encryption and trust the server certificate
    // This avoids self-signed certificate errors when connecting over IP.
    // If you later switch to a trusted certificate/hostname, you can re-enable encryption.
    return {
        server: host,
        port: Number.parseInt(port, 10),
        database,
        user: username,
        password,
        options: {
            encrypt: false,
            trustServerCertificate: true,
            enableArithAbort: true,
            requestTimeout: config.DB_REQUEST_TIMEOUT_MS ?? 30000,
            connectTimeout: config.DB_POOL_CONNECTION_TIMEOUT_MS ??
                constants_1.DB_POOL_DEFAULTS.CONNECTION_TIMEOUT_MS,
        },
        pool: {
            max: config.DB_POOL_MAX ?? constants_1.DB_POOL_DEFAULTS.MAX,
            min: config.DB_POOL_MIN ?? constants_1.DB_POOL_DEFAULTS.MIN,
            idleTimeoutMillis: config.DB_POOL_IDLE_TIMEOUT_MS ?? constants_1.DB_POOL_DEFAULTS.IDLE_TIMEOUT_MS,
        },
    };
}
/**
 * Shared Database Service with optimized connection pooling for SQL Server
 */
let SharedDatabaseService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var SharedDatabaseService = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            SharedDatabaseService = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        pool;
        logger = new common_1.Logger(SharedDatabaseService.name);
        constructor(config) {
            const poolConfig = buildSqlServerConfig(config);
            this.pool = new mssql_1.default.ConnectionPool(poolConfig);
            // Log pool events for monitoring
            this.pool.on('error', (err) => {
                this.logger.error('Unexpected database pool error', err);
            });
            // Connect to the database
            this.pool
                .connect()
                .then(() => {
                this.logger.log('Connected to SQL Server database');
            })
                .catch((err) => {
                this.logger.error('Failed to connect to SQL Server database', err);
                throw err;
            });
        }
        /**
         * Execute a raw SQL query
         * @param query SQL query string
         * @param params Optional parameters object for parameterized queries
         * @returns Query result
         */
        async query(query, params) {
            try {
                const request = this.pool.request();
                // Add parameters if provided
                if (params) {
                    for (const [key, value] of Object.entries(params)) {
                        request.input(key, value);
                    }
                }
                return await request.query(query);
            }
            catch (error) {
                this.logger.error('Query execution failed', error);
                throw error;
            }
        }
        /**
         * Execute a stored procedure
         * @param procedureName Name of the stored procedure
         * @param params Optional parameters object
         * @returns Procedure result
         */
        async execute(procedureName, params) {
            try {
                const request = this.pool.request();
                // Add parameters if provided
                if (params) {
                    for (const [key, value] of Object.entries(params)) {
                        request.input(key, value);
                    }
                }
                return await request.execute(procedureName);
            }
            catch (error) {
                this.logger.error('Stored procedure execution failed', error);
                throw error;
            }
        }
        /**
         * Get a request object for building complex queries
         */
        getRequest() {
            return this.pool.request();
        }
        /**
         * Get pool statistics for monitoring
         * Note: mssql ConnectionPool doesn't expose these stats directly
         */
        getPoolStats() {
            return {
                connected: this.pool.connected,
                connecting: this.pool.connecting,
            };
        }
        /**
         * Health check - verify database connection
         */
        async healthCheck() {
            try {
                await this.query('SELECT 1 AS health');
                return true;
            }
            catch (error) {
                this.logger.error('Database health check failed', error);
                return false;
            }
        }
        async onModuleDestroy() {
            try {
                await this.pool.close();
                this.logger.log('Database pool closed');
            }
            catch (error) {
                this.logger.error('Error closing database pool', error);
            }
        }
    };
    return SharedDatabaseService = _classThis;
})();
exports.SharedDatabaseService = SharedDatabaseService;
