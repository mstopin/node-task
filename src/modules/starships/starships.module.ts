import { Module } from '@nestjs/common';
import { SwapiStarshipsRepository } from './impl/swapi.vehicles.repository';
import { HttpModule } from '@nestjs/axios';
import { StarshipsController } from './rest/vehicles.controller';
import { StarshipsService } from './starships.service';
import { STARSHIPS_REPOSITORY } from './starships.repository';

@Module({
  imports: [HttpModule],
  controllers: [StarshipsController],
  providers: [
    StarshipsService,
    {
      provide: STARSHIPS_REPOSITORY,
      useClass: SwapiStarshipsRepository,
    },
  ],
})
export class StarshipsModule {}
