import { Collection } from '../../src/common/collection';
import { Vehicle } from 'modules/vehicles/vehicle';
import { VehiclesRepository } from 'modules/vehicles/vehicles.repository';

export const VEHICLE_1: Vehicle = {
  name: 'Sand Crawler',
  model: 'Digger Crawler',
  class: 'wheeled',
  manufacturer: 'Corellia Mining Corporation',
  length: 36.8,
  cost: 150000,
  crew: 46,
  passengers: 30,
  cargoCapacity: 50000,
  consumables: '2 months',
  filmsIds: [1, 5],
  createdAt: '2023-01-01T12:00:00',
  editedAt: '2023-01-01T12:00:00',
};

export const VEHICLE_2: Vehicle = {
  name: 'T-16 skyhopper',
  model: 'T-16 skyhopper',
  class: 'repulsorcraft',
  manufacturer: 'Incom Corporation',
  length: 10.4,
  cost: 14500,
  crew: 1,
  passengers: 1,
  cargoCapacity: 50,
  consumables: '0',
  filmsIds: [1],
  createdAt: '2023-01-01T12:00:00',
  editedAt: '2023-01-01T12:00:00',
};

export class InMemoryVehiclesRepository implements VehiclesRepository {
  private readonly vehicles: Vehicle[] = [VEHICLE_1, VEHICLE_2];

  find(): Promise<Collection<Vehicle>> {
    return Promise.resolve(
      new Collection(this.vehicles.length, 1, this.vehicles),
    );
  }

  findAll(): Promise<Vehicle[]> {
    return Promise.resolve(this.vehicles);
  }

  findOneById(id: number): Promise<Vehicle | null> {
    return Promise.resolve(this.vehicles[id - 1] ?? null);
  }
}
