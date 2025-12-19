/**
 * Shared Database Service
 * Provides optimized database connection pooling and query utilities for SQL Server
 */
import { OnModuleDestroy } from '@nestjs/common';
import sql, { type IResult } from 'mssql';
export interface DatabaseConfig {
    DB_HOST?: string;
    DB_PORT?: string;
    DB_DATABASE?: string;
    DB_USERNAME?: string;
    DB_PASSWORD?: string;
    DB_ENCRYPT?: boolean;
    DB_TRUST_CERT?: boolean;
    DB_POOL_MAX?: number;
    DB_POOL_MIN?: number;
    DB_POOL_IDLE_TIMEOUT_MS?: number;
    DB_POOL_CONNECTION_TIMEOUT_MS?: number;
    DB_REQUEST_TIMEOUT_MS?: number;
}
/**
 * Build SQL Server connection config from config object
 */
export declare function buildSqlServerConfig(config: DatabaseConfig): sql.config;
/**
 * Shared Database Service with optimized connection pooling for SQL Server
 */
export declare class SharedDatabaseService implements OnModuleDestroy {
    private readonly pool;
    private readonly logger;
    constructor(config: DatabaseConfig);
    /**
     * Execute a raw SQL query
     * @param query SQL query string
     * @param params Optional parameters object for parameterized queries
     * @returns Query result
     */
    query<T = unknown>(query: string, params?: Record<string, unknown>): Promise<IResult<T>>;
    /**
     * Execute a stored procedure
     * @param procedureName Name of the stored procedure
     * @param params Optional parameters object
     * @returns Procedure result
     */
    execute<T = unknown>(procedureName: string, params?: Record<string, unknown>): Promise<IResult<T>>;
    /**
     * Get a request object for building complex queries
     */
    getRequest(): sql.Request;
    /**
     * Get pool statistics for monitoring
     * Note: mssql ConnectionPool doesn't expose these stats directly
     */
    getPoolStats(): {
        connected: boolean;
        connecting: boolean;
    };
    /**
     * Health check - verify database connection
     */
    healthCheck(): Promise<boolean>;
    onModuleDestroy(): Promise<void>;
}
