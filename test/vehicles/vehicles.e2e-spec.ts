import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import {
  InMemoryVehiclesRepository,
  VEHICLE_1,
  VEHICLE_2,
} from './in-memory.vehicles.repository';
import { VehiclesModule } from '../../src/modules/vehicles/vehicles.module';
import { VEHICLES_REPOSITORY } from '../../src/modules/vehicles/vehicles.repository';
import supertest from 'supertest';
import { ConfigurationModule } from '../configuration.module';
import { Vehicle } from 'modules/vehicles/vehicle';

const mapVehicleToExpectedResponse = (vehicle: Vehicle) => ({
  name: vehicle.name,
  model: vehicle.model,
  class: vehicle.class,
  manufacturer: vehicle.manufacturer,
  length: vehicle.length,
  cost: vehicle.cost,
  crew: vehicle.crew,
  passengers: vehicle.passengers,
  cargoCapacity: vehicle.cargoCapacity,
  consumables: vehicle.consumables,
  films: vehicle.filmsIds.map((id) => `http://localhost:3000/films/${id}`),
  createdAt: vehicle.createdAt,
  editedAt: vehicle.editedAt,
});

describe('Vehicles', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [ConfigurationModule, VehiclesModule],
    })
      .overrideProvider(VEHICLES_REPOSITORY)
      .useClass(InMemoryVehiclesRepository)
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  describe('GET /vehicles', () => {
    it('should return collection of vehicles', async () => {
      const response = await supertest(app.getHttpServer()).get('/vehicles');

      expect(response.status).toBe(200);
      expect(response.body).toStrictEqual({
        page: 1,
        numberPages: 1,
        count: 2,
        data: [
          mapVehicleToExpectedResponse(VEHICLE_1),
          mapVehicleToExpectedResponse(VEHICLE_2),
        ],
      });
    });
  });

  describe('GET /vehicles/:id', () => {
    it('should return one vehicle', async () => {
      const response = await supertest(app.getHttpServer()).get('/vehicles/1');

      expect(response.status).toBe(200);
      expect(response.body).toStrictEqual(
        mapVehicleToExpectedResponse(VEHICLE_1),
      );
    });

    it('should throw 404 if vehicle not found', async () => {
      const response = await supertest(app.getHttpServer()).get('/vehicles/3');

      expect(response.status).toBe(404);
      expect(response.body).toStrictEqual({
        message: 'Not Found',
        statusCode: 404,
      });
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
