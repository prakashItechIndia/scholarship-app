/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access */
import {
  Injectable,
  OnModuleDestroy,
  OnModuleInit,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import sql, { type ConnectionPool, type IResult } from 'mssql';

import { EnvVars } from '../config/env.validation';

interface SqlServerConfig {
  server: string;
  port: number;
  database: string;
  user: string;
  password: string;
  options: {
    encrypt: boolean;
    trustServerCertificate: boolean;
    enableArithAbort: boolean;
    requestTimeout: number;
    connectTimeout: number;
  };
  pool: {
    max: number;
    min: number;
    idleTimeoutMillis: number;
  };
}

const buildSqlServerConfig = (
  configService: ConfigService<EnvVars, true>,
): SqlServerConfig => {
  const host = configService.get('DB_HOST', { infer: true });
  const port = configService.get('DB_PORT', { infer: true }) ?? '1433';
  const database = configService.get('DB_DATABASE', { infer: true });
  const username = configService.get('DB_USERNAME', { infer: true });
  const password = configService.get('DB_PASSWORD', { infer: true }) ?? '';

  if (!host || !database || !username) {
    throw new Error(
      'Database config missing. Provide DB_HOST, DB_PORT, DB_DATABASE, DB_USERNAME (DB_PASSWORD optional)',
    );
  }

  // For this environment, always disable encryption and trust the server certificate
  // to avoid self-signed certificate TLS errors when connecting over IP.
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
      requestTimeout:
        configService.get('DB_REQUEST_TIMEOUT_MS', {
          infer: true,
        }) ?? 30000,
      connectTimeout:
        configService.get('DB_POOL_CONNECTION_TIMEOUT_MS', {
          infer: true,
        }) ?? 5000,
    },
    pool: {
      max: configService.get('DB_POOL_MAX', { infer: true }) ?? 20,
      min: configService.get('DB_POOL_MIN', { infer: true }) ?? 2,
      idleTimeoutMillis:
        configService.get('DB_POOL_IDLE_TIMEOUT_MS', { infer: true }) ?? 30000,
    },
  };
};

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
  private readonly pool: ConnectionPool;
  private readonly logger = new Logger(DatabaseService.name);

  constructor(private readonly configService: ConfigService<EnvVars, true>) {
    const config = buildSqlServerConfig(this.configService);

    // Log connection config (without password)
    this.logger.log(
      `Database config: server=${config.server}, database=${config.database}, encrypt=${config.options.encrypt}, trustServerCertificate=${config.options.trustServerCertificate}`,
    );

    this.pool = new sql.ConnectionPool(config);

    // Handle pool events
    this.pool.on('error', (err: Error) => {
      this.logger.error('Database pool error', err);
    });
  }

  async onModuleInit(): Promise<void> {
    try {
      await this.pool.connect();
      this.logger.log('Connected to SQL Server database');
    } catch (err) {
      this.logger.error(
        'Failed to connect to SQL Server database',
        err as Error,
      );
      throw err;
    }
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
  getRequest(): sql.Request {
    return this.pool.request();
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

  /**
   * Get pool statistics
   * Note: mssql ConnectionPool doesn't expose detailed stats directly
   */
  getPoolStats(): { connected: boolean; connecting: boolean } {
    return {
      connected: this.pool.connected,
      connecting: this.pool.connecting,
    };
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
/* eslint-enable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access */
