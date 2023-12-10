import { HttpService } from '@nestjs/axios';

import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Collection } from '../../../common/collection';
import { SwapiRepository } from 'common/infra/swapi.repository';
import { Planet } from '../planet';
import { PlanetsRepository } from '../planets.repository';
import {
  SwapiPlanetResponse,
  SwapiPlanetsResponse,
} from './swapi.planet.response';
import { PlanetsSearchCriteria } from '../planets.search-criteria';

@Injectable()
export class SwapiPlanetsRepository
  extends SwapiRepository
  implements PlanetsRepository
{
  constructor(
    private readonly httpService: HttpService,
    @Inject(CACHE_MANAGER) private readonly cache: Cache,
    configService: ConfigService,
  ) {
    super(configService, 'planets');
  }

  private mapResponseToDomain(response: SwapiPlanetResponse): Planet {
    return {
      name: response.name,
      diameter: Number(response.diameter),
      rotationPeriod: Number(response.rotation_period),
      orbitalPeriod: Number(response.orbiatal_period),
      gravity: Number(response.gravity),
      population: Number(response.population),
      filmsIds: this.extractIdsFromUrls(response.films),
      createdAt: response.createdAt,
      editedAt: response.editedAt,
    };
  }

  async find(criteria: PlanetsSearchCriteria): Promise<Collection<Planet>> {
    const cacheKey = `planets:page=${criteria.page}${
      criteria.name ? `:name=${criteria.name}` : ''
    }`;

    try {
      const cachedPlanetJson = await this.cache.get<string | null>(cacheKey);
      if (cachedPlanetJson) {
        return Object.assign(Collection.empty(), JSON.parse(cachedPlanetJson));
      }

      const response = await firstValueFrom(
        this.httpService.get<SwapiPlanetsResponse>(
          this.buildUrlForSearchCriteria(criteria),
        ),
      );

      const { count, results } = response.data;
      const planets = results.map(this.mapResponseToDomain.bind(this));
      const collection = new Collection(count, criteria.page, planets);
      await this.cache.set(cacheKey, JSON.stringify(collection));

      return collection;
    } catch {
      return Collection.empty();
    }
  }

  async findOneById(id: number): Promise<Planet | null> {
    const cacheKey = `planets:id=${id}`;

    try {
      const cachedPlanetJson = await this.cache.get<string | null>(cacheKey);
      if (cachedPlanetJson) {
        return JSON.parse(cachedPlanetJson);
      }

      const response = await firstValueFrom(
        this.httpService.get<SwapiPlanetResponse>(this.URL + id),
      );

      const planet = this.mapResponseToDomain(response.data);
      await this.cache.set(cacheKey, JSON.stringify(planet));

      return planet;
    } catch {
      return null;
    }
  }
}
