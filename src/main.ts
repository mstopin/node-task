import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { FilmsModule } from 'modules/films/films.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), FilmsModule],
})
class AppModule {}

(async function main() {
  const app = await NestFactory.create(AppModule);

  await app.listen(3000);
})().catch(console.error);
