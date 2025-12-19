/**
 * Shared Database Service
 * Provides optimized database connection pooling and query utilities for SQL Server
 */

import { Injectable, OnModuleDestroy, Logger } from '@nestjs/common';
import sql, { type ConnectionPool, type IResult } from 'mssql';
import { DB_POOL_DEFAULTS } from '../constants';

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
export function buildSqlServerConfig(config: DatabaseConfig): sql.config {
  const host = config.DB_HOST;
  const port = config.DB_PORT ?? '1433';
  const database = config.DB_DATABASE;
  const username = config.DB_USERNAME;
  const password = config.DB_PASSWORD ?? '';

  if (!host || !database || !username) {
    throw new Error(
      'Database config missing. Provide DB_HOST, DB_PORT, DB_DATABASE, DB_USERNAME (DB_PASSWORD optional)',
    );
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
      connectTimeout:
        config.DB_POOL_CONNECTION_TIMEOUT_MS ??
        DB_POOL_DEFAULTS.CONNECTION_TIMEOUT_MS,
    },
    pool: {
      max: config.DB_POOL_MAX ?? DB_POOL_DEFAULTS.MAX,
      min: config.DB_POOL_MIN ?? DB_POOL_DEFAULTS.MIN,
      idleTimeoutMillis:
        config.DB_POOL_IDLE_TIMEOUT_MS ?? DB_POOL_DEFAULTS.IDLE_TIMEOUT_MS,
    },
  };
}

/**
 * Shared Database Service with optimized connection pooling for SQL Server
 */
@Injectable()
export class SharedDatabaseService implements OnModuleDestroy {
  private readonly pool: ConnectionPool;
  private readonly logger = new Logger(SharedDatabaseService.name);

  constructor(config: DatabaseConfig) {
    const poolConfig = buildSqlServerConfig(config);
    this.pool = new sql.ConnectionPool(poolConfig);

    // Log pool events for monitoring
    this.pool.on('error', (err: Error) => {
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
  async query<T = unknown>(
    query: string,
    params?: Record<string, unknown>,
  ): Promise<IResult<T>> {
    try {
      const request = this.pool.request();

      // Add parameters if provided
      if (params) {
        for (const [key, value] of Object.entries(params)) {
          request.input(key, value);
        }
      }

      return await request.query<T>(query);
    } catch (error) {
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
  async execute<T = unknown>(
    procedureName: string,
    params?: Record<string, unknown>,
  ): Promise<IResult<T>> {
    try {
      const request = this.pool.request();

      // Add parameters if provided
      if (params) {
        for (const [key, value] of Object.entries(params)) {
          request.input(key, value);
        }
      }

      return await request.execute<T>(procedureName);
    } catch (error) {
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
  async healthCheck(): Promise<boolean> {
    try {
      await this.query('SELECT 1 AS health');
      return true;
    } catch (error) {
      this.logger.error('Database health check failed', error);
      return false;
    }
  }

  async onModuleDestroy(): Promise<void> {
    try {
      await this.pool.close();
      this.logger.log('Database pool closed');
    } catch (error) {
      this.logger.error('Error closing database pool', error);
    }
  }
}
