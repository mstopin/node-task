import { Module } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { FilmsModule } from 'modules/films/films.module';
import { ConfigurationModule } from 'configuration.module';
import { VehiclesModule } from 'modules/vehicles/vehicles.module';
import { PlanetsModule } from 'modules/planets/planets.module';
import { SpeciesModule } from 'modules/species/species.module';
import { StarshipsModule } from 'modules/starships/starships.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
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

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Node task')
    .setVersion('1.0')
    .build();

  const docs = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('/swagger', app, docs);

  await app.listen(3000);
})().catch(console.error);
