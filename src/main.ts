import { Module } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { FilmsModule } from 'modules/films/films.module';
import { ConfigurationModule } from 'configuration.module';
import { VehiclesModule } from 'modules/vehicles/vehicles.module';
import { PlanetsModule } from 'modules/planets/planets.module';
import { SpeciesModule } from 'modules/species/species.module';
import { StarshipsModule } from 'modules/starships/starships.module';
@Module({
  imports: [
    ConfigurationModule,
    FilmsModule,
    VehiclesModule,
    PlanetsModule,
    SpeciesModule,
    StarshipsModule,
  ],
})
class AppModule {}

(async function main() {
  const app = await NestFactory.create(AppModule);

  await app.listen(3000);
})().catch(console.error);
