import { Module } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { FilmsModule } from 'modules/films/films.module';
import { ConfigurationModule } from 'configuration.module';
import { VehiclesModule } from 'modules/vehicles/vehicles.module';
import { PlanetsModule } from 'modules/planets/planets.module';
@Module({
  imports: [ConfigurationModule, FilmsModule, VehiclesModule, PlanetsModule],
})
class AppModule {}

(async function main() {
  const app = await NestFactory.create(AppModule);

  await app.listen(3000);
})().catch(console.error);
