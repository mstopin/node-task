import { Module } from '@nestjs/common';
import { PEOPLE_REPOSITORY } from './people.repository';
import { HttpModule } from '@nestjs/axios';
import { PeopleService } from './people.service';
import { SwapiPeopleRepository } from './impl/swapi.people.repository';

@Module({
  imports: [HttpModule],
  providers: [
    PeopleService,
    {
      provide: PEOPLE_REPOSITORY,
      useClass: SwapiPeopleRepository,
    },
  ],
  exports: [PeopleService],
})
export class PeopleModule {}
