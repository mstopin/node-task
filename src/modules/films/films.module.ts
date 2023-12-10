import { Module } from '@nestjs/common';
import { FilmsService } from './films.service';
import { FilmsRepository } from './films.repository';
import { SwapiFilmsRepository } from './impl/swapi.films.repository';
import { FilmsController } from './films.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [FilmsController],
  providers: [
    FilmsService,
    {
      provide: FilmsRepository,
      useClass: SwapiFilmsRepository,
    },
  ],
})
export class FilmsModule {}
