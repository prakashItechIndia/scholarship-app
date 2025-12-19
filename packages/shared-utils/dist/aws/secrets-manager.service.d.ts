/**
 * AWS Secrets Manager Service
 * Provides secure access to secrets stored in AWS Secrets Manager
 */
export interface SecretConfig {
    region?: string;
    secretName: string;
}
export interface SecretValue {
    [key: string]: string | number | boolean;
}
export declare class SecretsManagerService {
    private readonly config;
    private readonly client;
    private readonly logger;
    private readonly cache;
    private readonly cacheTTL;
    constructor(config: SecretConfig);
    /**
     * Get secret value from AWS Secrets Manager
     * Results are cached for 5 minutes to reduce API calls
     */
    getSecret(secretName?: string): Promise<SecretValue>;
    /**
     * Get a specific key from a secret
     */
    getSecretValue(key: string, secretName?: string): Promise<string>;
    /**
     * Create a new secret in AWS Secrets Manager
     */
    createSecret(secretName: string, secretValue: SecretValue, description?: string): Promise<void>;
    /**
     * Update an existing secret in AWS Secrets Manager
     */
    updateSecret(secretName: string, secretValue: SecretValue): Promise<void>;
    /**
     * Check if a secret exists
     */
    secretExists(secretName: string): Promise<boolean>;
    /**
     * Clear the cache for a specific secret
     */
    clearCache(secretName?: string): void;
    /**
     * Clear all cached secrets
     */
    clearAllCache(): void;
}
