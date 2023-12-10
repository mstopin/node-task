import { Repository } from '../../common/repository';
import { Vehicle } from './vehicle';
import { VehiclesSearchCriteria } from './vehicles.search-criteria';

export const VEHICLES_REPOSITORY = Symbol.for('VehiclesRepository');

export interface VehiclesRepository
  extends Repository<Vehicle, VehiclesSearchCriteria> {}
