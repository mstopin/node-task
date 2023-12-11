import { Module } from '@nestjs/common';
import { FilmsService } from './films.service';
import { FILMS_REPOSITORY } from './films.repository';
import { SwapiFilmsRepository } from './impl/swapi.films.repository';
import { FilmsController } from './rest/films.controller';
import { HttpModule } from '@nestjs/axios';
import { PeopleModule } from 'modules/people/vehicles.module';

@Module({
  imports: [HttpModule, PeopleModule],
  controllers: [FilmsController],
  providers: [
    FilmsService,
    {
      provide: FILMS_REPOSITORY,
      useClass: SwapiFilmsRepository,
    },
  ],
})
export class FilmsModule {}
