import { Module } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { FilmsModule } from 'modules/films/films.module';
import { ConfigurationModule } from 'configuration.module';
@Module({
  imports: [ConfigurationModule, FilmsModule],
})
class AppModule {}

(async function main() {
  const app = await NestFactory.create(AppModule);

  await app.listen(3000);
})().catch(console.error);
