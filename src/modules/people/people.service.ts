import { Inject, Injectable } from '@nestjs/common';
import { PEOPLE_REPOSITORY, PeopleRepository } from './people.repository';
import { Person } from './people';

@Injectable()
export class PeopleService {
  constructor(
    @Inject(PEOPLE_REPOSITORY)
    private readonly peopleRepository: PeopleRepository,
  ) {}

  async findAll(): Promise<Person[]> {
    return await this.peopleRepository.findAll();
  }
}
