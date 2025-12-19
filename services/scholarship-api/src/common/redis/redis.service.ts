import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, type RedisClientType } from 'redis';

import type { EnvVars } from '../../config/env.validation';

@Injectable()
export class RedisService implements OnModuleDestroy {
  private readonly logger = new Logger(RedisService.name);
  private client: RedisClientType | null = null;

  constructor(private readonly configService: ConfigService<EnvVars, true>) {}

  private async ensureClient(): Promise<RedisClientType | null> {
    if (this.client) {
      return this.client;
    }

    const url = this.configService.get('REDIS_URL', { infer: true });
    if (!url) {
      this.logger.warn('REDIS_URL not configured; Redis publisher disabled');
      return null;
    }

    const client = createClient({ url }) as RedisClientType;
    client.on('error', (err: unknown) =>
      this.logger.warn(`Redis client error: ${String(err)}`),
    );

    try {
      await client.connect();
      this.client = client;
      this.logger.log('Connected to Redis for pub/sub');
      return client;
    } catch (error: unknown) {
      this.logger.warn(
        `Failed to connect to Redis: ${
          error instanceof Error ? error.message : String(error)
        }`,
      );
      return null;
    }
  }

  async publish(
    channel: string,
    message: Record<string, unknown>,
  ): Promise<void> {
    const client = await this.ensureClient();
    if (!client) return;
    try {
      await client.publish(channel, JSON.stringify(message));
    } catch (error: unknown) {
      this.logger.warn(
        `Failed to publish to ${channel}: ${
          error instanceof Error ? error.message : String(error)
        }`,
      );
    }
  }

  async onModuleDestroy(): Promise<void> {
    if (this.client) {
      await this.client.disconnect();
      this.client = null;
    }
  }
}
