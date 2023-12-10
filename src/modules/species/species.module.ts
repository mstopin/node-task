import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { SwapiSpeciesRepository } from './impl/swapi.species.repository';
import { SPECIES_REPOSITORY } from './species.repository';
import { SpeciesService } from './species.service';
import { SpeciesController } from './rest/species.controller';

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
