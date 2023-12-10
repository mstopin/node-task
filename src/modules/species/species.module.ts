import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { SwapiSpeciesRepository } from './impl/swapi.planets.repository';
import { SPECIES_REPOSITORY } from './species.repository';
import { SpeciesController } from './rest/species.controller';
import { SpeciesService } from './species.service';

@Module({
  imports: [HttpModule],
  controllers: [SpeciesController],
  providers: [
    SpeciesService,
    {
      provide: SPECIES_REPOSITORY,
      useClass: SwapiSpeciesRepository,
    },
  ],
})
export class SpeciesModule {}
