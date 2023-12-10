import { CacheModule } from '@nestjs/cache-manager';
import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { redisStore } from 'cache-manager-ioredis-yet';
import { RedisOptions } from 'ioredis';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    CacheModule.registerAsync<RedisOptions>({
      inject: [ConfigService],
      isGlobal: true,
      useFactory: async (configService: ConfigService) => {
        return {
          store: redisStore,
          host: configService.getOrThrow('REDIS_HOST'),
          port: Number(configService.getOrThrow('REDIS_PORT')),
          ttl:
            Number(configService.getOrThrow('REDIS_DEFAULT_TTL_SECONDS')) *
            1000,
        };
      },
    }),
  ],
})
export class ConfigurationModule {}
