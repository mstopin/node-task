import { HttpService } from '@nestjs/axios';

import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Collection } from '../../../common/collection';
import { SwapiRepository } from 'common/infra/swapi.repository';
import { StarshipsRepository } from '../starships.repository';
import {
  SwapiStarshipResponse,
  SwapiStarshipsReponse,
} from './swapi.starship.response';
import { Starship } from '../starship';
import { StarshipsSearchCriteria } from '../starships.search-criteria';

@Injectable()
export class SwapiStarshipsRepository
  extends SwapiRepository
  implements StarshipsRepository
{
  constructor(
    private readonly httpService: HttpService,
    @Inject(CACHE_MANAGER) private readonly cache: Cache,
    configService: ConfigService,
  ) {
    super(configService, 'vehicles');
  }

  private mapResponseToDomain(response: SwapiStarshipResponse): Starship {
    return {
      name: response.name,
      model: response.model,
      class: response.starship_class,
      manufacturer: response.manufacturer,
      cost: Number(response.cost_in_credits),
      length: Number(response.length),
      crew: Number(response.crew),
      passengers: Number(response.passengers),
      filmsIds: this.extractIdsFromUrls(response.films),
      createdAt: response.created,
      editedAt: response.edited,
    };
  }

  async find(criteria: StarshipsSearchCriteria): Promise<Collection<Starship>> {
    const cacheKey = `vehicles:page=${criteria.page}`;
    try {
      const cachedStarshipJson = await this.cache.get<string | null>(cacheKey);
      if (cachedStarshipJson) {
        return Object.assign(
          Collection.empty(),
          JSON.parse(cachedStarshipJson),
        );
      }

      const response = await firstValueFrom(
        this.httpService.get<SwapiStarshipsReponse>(
          this.buildUrlForSearchCriteria(criteria),
        ),
      );

      const { count, results } = response.data;
      const starships = results.map(this.mapResponseToDomain.bind(this));
      const collection = new Collection(count, criteria.page, starships);
      await this.cache.set(cacheKey, JSON.stringify(collection));

      return collection;
    } catch {
      return Collection.empty();
    }
  }

  async findOneById(id: number): Promise<Starship | null> {
    const cacheKey = `starships:id=${id}`;

    try {
      const cachedStarshipJson = await this.cache.get<string | null>(cacheKey);
      if (cachedStarshipJson) {
        return JSON.parse(cachedStarshipJson);
      }

      const response = await firstValueFrom(
        this.httpService.get<SwapiStarshipResponse>(this.URL + id),
      );

      const starship = this.mapResponseToDomain(response.data);
      await this.cache.set(cacheKey, JSON.stringify(starship));

      return starship;
    } catch {
      return null;
    }
  }
}
