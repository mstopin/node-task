import { Repository } from '../../common/repository';
import { Planet } from './planet';
import { PlanetsSearchCriteria } from './planets.search-criteria';

export const PLANETS_REPOSITORY = Symbol.for('PlanetsRepository');

export interface PlanetsRepository
  extends Repository<Planet, PlanetsSearchCriteria> {}
