import { Module } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { FilmsModule } from 'modules/films/films.module';
import { ConfigurationModule } from 'configuration.module';
import { VehiclesModule } from 'modules/vehicles/vehicles.module';
@Module({
  imports: [ConfigurationModule, FilmsModule, VehiclesModule],
})
class AppModule {}

(async function main() {
  const app = await NestFactory.create(AppModule);

  await app.listen(3000);
})().catch(console.error);
