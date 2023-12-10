import { Collection } from './collection';
import { SearchCriteria } from './search-criteria';

export interface Repository<T, SC extends SearchCriteria> {
  find(criteria: SC): Promise<Collection<T>>;
  findOneById(id: number): Promise<T | null>;
}
