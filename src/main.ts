import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { FilmsModule } from 'modules/films/films.module';
import { redisStore } from 'cache-manager-ioredis-yet';
import { RedisOptions } from 'ioredis';
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
          lazyConnect: false,
        };
      },
    }),
    FilmsModule,
  ],
})
class AppModule {}

(async function main() {
  const app = await NestFactory.create(AppModule);

  await app.listen(3000);
})().catch(console.error);
