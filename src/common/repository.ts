import { SearchCriteria } from './search-criteria';

export interface Repository<T, SC extends SearchCriteria> {
  find(criteria: SC): Promise<T[]>;
  findOneById(id: number): Promise<T | null>;
}
