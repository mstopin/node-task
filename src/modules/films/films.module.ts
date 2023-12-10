import { Module } from '@nestjs/common';
import { FilmsService } from './films.service';
import { FILMS_REPOSITORY } from './films.repository';
import { SwapiFilmsRepository } from './impl/swapi.films.repository';
import { FilmsController } from './rest/films.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
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
