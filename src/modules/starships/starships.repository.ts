import { Repository } from '../../common/repository';
import { Starship } from './starship';
import { StarshipsSearchCriteria } from './starships.search-criteria';

export const STARSHIPS_REPOSITORY = Symbol.for('StarshipsRepository');

export interface StarshipsRepository
  extends Repository<Starship, StarshipsSearchCriteria> {}
