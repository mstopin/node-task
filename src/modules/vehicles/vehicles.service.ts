import { Inject, Injectable } from '@nestjs/common';
import { Vehicle } from './vehicle';
import { VEHICLES_REPOSITORY, VehiclesRepository } from './vehicles.repository';
import { Collection } from '../../common/collection';
import { VehiclesSearchCriteria } from './vehicles.search-criteria';

@Injectable()
export class VehiclesService {
  constructor(
    @Inject(VEHICLES_REPOSITORY)
    private readonly vehiclesRepository: VehiclesRepository,
  ) {}

  async find(
    searchCriteria: VehiclesSearchCriteria,
  ): Promise<Collection<Vehicle>> {
    return await this.vehiclesRepository.find(searchCriteria);
  }

  async findOneById(id: number): Promise<Vehicle | null> {
    return await this.vehiclesRepository.findOneById(id);
  }
}
