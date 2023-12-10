import { Repository } from '../../common/repository';
import { Species } from './species';
import { SpeciesSearchCriteria } from './species.search-criteria';

export const SPECIES_REPOSITORY = Symbol.for('SpeciesRepository');

export interface SpeciesRepository
  extends Repository<Species, SpeciesSearchCriteria> {}
