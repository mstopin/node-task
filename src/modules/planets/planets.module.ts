import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { PLANETS_REPOSITORY } from './planets.repository';
import { SwapiPlanetsRepository } from './impl/swapi.planets.repository';
import { PlanetsController } from './rest/planets.controller';
import { PlanetsService } from './planets.service';

@Module({
  imports: [HttpModule],
  controllers: [PlanetsController],
  providers: [
    PlanetsService,
    {
      provide: PLANETS_REPOSITORY,
      useClass: SwapiPlanetsRepository,
    },
  ],
})
export class PlanetsModule {}
