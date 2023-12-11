import { Repository } from '../../common/repository';
import { Person } from './people';
import { PeopleSearchCriteria } from './people.search-criteria';

export const PEOPLE_REPOSITORY = Symbol.for('PeopleRepository');

export interface PeopleRepository
  extends Repository<Person, PeopleSearchCriteria> {
  findAll(): Promise<Person[]>;
}
