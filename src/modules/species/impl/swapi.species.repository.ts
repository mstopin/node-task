import { HttpService } from '@nestjs/axios';

import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Collection } from '../../../common/collection';
import { SwapiRepository } from 'common/infra/swapi.repository';
import { SpeciesRepository } from '../species.repository';
import {
  SwapiMultipleSpeciesResponse,
  SwapiSpeciesResponse,
} from './swapi.species.response';
import { Species } from '../species';
import { SpeciesSearchCriteria } from '../species.search-criteria';

@Injectable()
export class SwapiSpeciesRepository
  extends SwapiRepository<Species>
  implements SpeciesRepository
{
  constructor(
    private readonly httpService: HttpService,
    @Inject(CACHE_MANAGER) private readonly cache: Cache,
    configService: ConfigService,
  ) {
    super(configService, 'species');
  }

  private mapResponseToDomain(response: SwapiSpeciesResponse): Species {
    return {
      name: response.name,
      classification: response.classification,
      designation: response.designation,
      averageHeight: Number(response.average_height),
      averageLifespan: Number(response.average_lifespan),
      language: response.language,
      homeworldId: this.extractIdFromUrl(response.homeworld),
      filmsIds: this.extractIdsFromUrls(response.films),
      createdAt: response.created,
      editedAt: response.edited,
    };
  }

  async find(criteria: SpeciesSearchCriteria): Promise<Collection<Species>> {
    const cacheKey = `species:page=${criteria.page}${
      criteria.name ? `:name=${criteria.name}` : ''
    }`;

    try {
      const cachedSpeciesJson = await this.cache.get<string | null>(cacheKey);
      if (cachedSpeciesJson) {
        return Object.assign(Collection.empty(), JSON.parse(cachedSpeciesJson));
      }

      const response = await firstValueFrom(
        this.httpService.get<SwapiMultipleSpeciesResponse>(
          this.buildUrlForSearchCriteria(criteria),
        ),
      );

      const { count, results } = response.data;
      const species = results.map(this.mapResponseToDomain.bind(this));
      const collection = new Collection(count, criteria.page, species);
      await this.cache.set(cacheKey, JSON.stringify(collection));

      return collection;
    } catch {
      return Collection.empty();
    }
  }

  async findOneById(id: number): Promise<Species | null> {
    const cacheKey = `species:id=${id}`;

    try {
      const cachedSpeciesJson = await this.cache.get<string | null>(cacheKey);
      if (cachedSpeciesJson) {
        return JSON.parse(cachedSpeciesJson);
      }

      const response = await firstValueFrom(
        this.httpService.get<SwapiSpeciesResponse>(this.URL + id),
      );

      const species = this.mapResponseToDomain(response.data);
      await this.cache.set(cacheKey, JSON.stringify(species));

      return species;
    } catch {
      return null;
    }
  }
}
