import { Module } from '@nestjs/common';
import { FilmsService } from './films.service';
import { FilmsRepository } from './films.repository';
import { SwapiFilmsRepository } from './impl/swapi.films.repository';
import { FilmsController } from './films.controller';

@Module({
  providers: [
    FilmsService,
    {
      provide: FilmsRepository,
      useClass: SwapiFilmsRepository,
    },
  ],
  controllers: [FilmsController],
})
export class FilmsModule {}
