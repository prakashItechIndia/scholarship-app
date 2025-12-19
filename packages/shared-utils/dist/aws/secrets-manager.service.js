"use strict";
/**
 * AWS Secrets Manager Service
 * Provides secure access to secrets stored in AWS Secrets Manager
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
exports.SecretsManagerService = void 0;
const common_1 = require("@nestjs/common");
const client_secrets_manager_1 = require("@aws-sdk/client-secrets-manager");
let SecretsManagerService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var SecretsManagerService = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            SecretsManagerService = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        config;
        client;
        logger = new common_1.Logger(SecretsManagerService.name);
        cache = new Map();
        cacheTTL = 5 * 60 * 1000; // 5 minutes
        constructor(config) {
            this.config = config;
            this.client = new client_secrets_manager_1.SecretsManagerClient({
                region: config.region || process.env.AWS_REGION || 'us-east-1',
            });
        }
        /**
         * Get secret value from AWS Secrets Manager
         * Results are cached for 5 minutes to reduce API calls
         */
        async getSecret(secretName) {
            const name = secretName || this.config.secretName;
            // Check cache first
            const cached = this.cache.get(name);
            if (cached && Date.now() < cached.expiresAt) {
                this.logger.debug(`Using cached secret for ${name}`);
                return cached.value;
            }
            try {
                const command = new client_secrets_manager_1.GetSecretValueCommand({
                    SecretId: name,
                });
                const response = await this.client.send(command);
                if (!response.SecretString) {
                    throw new Error(`Secret ${name} has no string value`);
                }
                const secretValue = JSON.parse(response.SecretString);
                // Cache the result
                this.cache.set(name, {
                    value: secretValue,
                    expiresAt: Date.now() + this.cacheTTL,
                });
                this.logger.log(`Successfully retrieved secret: ${name}`);
                return secretValue;
            }
            catch (error) {
                this.logger.error(`Failed to retrieve secret ${name}:`, error);
                throw new Error(`Failed to retrieve secret ${name}: ${error instanceof Error ? error.message : 'Unknown error'}`);
            }
        }
        /**
         * Get a specific key from a secret
         */
        async getSecretValue(key, secretName) {
            const secret = await this.getSecret(secretName);
            const value = secret[key];
            if (value === undefined) {
                throw new Error(`Key ${key} not found in secret ${secretName || this.config.secretName}`);
            }
            return String(value);
        }
        /**
         * Create a new secret in AWS Secrets Manager
         */
        async createSecret(secretName, secretValue, description) {
            try {
                const command = new client_secrets_manager_1.CreateSecretCommand({
                    Name: secretName,
                    SecretString: JSON.stringify(secretValue),
                    Description: description,
                });
                await this.client.send(command);
                this.logger.log(`Successfully created secret: ${secretName}`);
            }
            catch (error) {
                this.logger.error(`Failed to create secret ${secretName}:`, error);
                throw new Error(`Failed to create secret ${secretName}: ${error instanceof Error ? error.message : 'Unknown error'}`);
            }
        }
        /**
         * Update an existing secret in AWS Secrets Manager
         */
        async updateSecret(secretName, secretValue) {
            try {
                const command = new client_secrets_manager_1.UpdateSecretCommand({
                    SecretId: secretName,
                    SecretString: JSON.stringify(secretValue),
                });
                await this.client.send(command);
                // Invalidate cache
                this.cache.delete(secretName);
                this.logger.log(`Successfully updated secret: ${secretName}`);
            }
            catch (error) {
                this.logger.error(`Failed to update secret ${secretName}:`, error);
                throw new Error(`Failed to update secret ${secretName}: ${error instanceof Error ? error.message : 'Unknown error'}`);
            }
        }
        /**
         * Check if a secret exists
         */
        async secretExists(secretName) {
            try {
                const command = new client_secrets_manager_1.DescribeSecretCommand({
                    SecretId: secretName,
                });
                await this.client.send(command);
                return true;
            }
            catch {
                return false;
            }
        }
        /**
         * Clear the cache for a specific secret
         */
        clearCache(secretName) {
            const name = secretName || this.config.secretName;
            this.cache.delete(name);
            this.logger.debug(`Cleared cache for secret: ${name}`);
        }
        /**
         * Clear all cached secrets
         */
        clearAllCache() {
            this.cache.clear();
            this.logger.debug('Cleared all secret caches');
        }
    };
    return SecretsManagerService = _classThis;
})();
exports.SecretsManagerService = SecretsManagerService;
