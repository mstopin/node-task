import { HttpService } from '@nestjs/axios';

import { Vehicle } from '../vehicle';
import { VehiclesRepository } from '../vehicles.repository';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { VehiclesSearchCriteria } from '../vehicles.search-criteria';
import { Collection } from '../../../common/collection';
import {
  SwapiVehicleResponse,
  SwapiVehiclesReponse,
} from './swapi.vehicle.response';
import { SwapiRepository } from 'common/infra/swapi.repository';

@Injectable()
export class SwapiVehiclesRepository
  extends SwapiRepository
  implements VehiclesRepository
{
  constructor(
    private readonly httpService: HttpService,
    @Inject(CACHE_MANAGER) private readonly cache: Cache,
    configService: ConfigService,
  ) {
    super(configService, 'vehicles');
  }

  private mapResponseToDomain(response: SwapiVehicleResponse): Vehicle {
    return {
      name: response.name,
      model: response.model,
      class: response.class,
      manufacturer: response.manufacturer,
      length: Number(response.length),
      cost: Number(response.cost_in_credits),
      crew: Number(response.crew),
      passengers: Number(response.passengers),
      cargoCapacity: Number(response.cargo_capacity),
      consumables: response.consumables,
      filmsIds: this.extractIdsFromUrls(response.films),
      createdAt: response.createdAt,
      editedAt: response.editedAt,
    };
  }

  async find(criteria: VehiclesSearchCriteria): Promise<Collection<Vehicle>> {
    const cacheKey = `vehicles:page=${criteria.page}${
      criteria.name ? `:name=${criteria.name}` : ''
    }${criteria.model ? `:model=${criteria.model}` : ''}`;

    try {
      const cachedVehiclesJson = await this.cache.get<string | null>(cacheKey);
      if (cachedVehiclesJson) {
        return Object.assign(
          Collection.empty(),
          JSON.parse(cachedVehiclesJson),
        );
      }

      const response = await firstValueFrom(
        this.httpService.get<SwapiVehiclesReponse>(
          this.buildUrlForSearchCriteria(criteria),
        ),
      );

      const { count, results } = response.data;
      const vehicles = results.map(this.mapResponseToDomain.bind(this));
      const collection = new Collection(count, criteria.page, vehicles);
      await this.cache.set(cacheKey, JSON.stringify(collection));

      return collection;
    } catch {
      return Collection.empty();
    }
  }

  async findOneById(id: number): Promise<Vehicle | null> {
    const cacheKey = `vehicles:id=${id}`;

    try {
      const cachedVehicleJson = await this.cache.get<string | null>(cacheKey);
      if (cachedVehicleJson) {
        return JSON.parse(cachedVehicleJson);
      }

      console.log(this.URL + id);

      const response = await firstValueFrom(
        this.httpService.get<SwapiVehicleResponse>(this.URL + id),
      );

      const vehicle = this.mapResponseToDomain(response.data);
      await this.cache.set(cacheKey, JSON.stringify(vehicle));

      return vehicle;
    } catch {
      return null;
    }
  }
}
