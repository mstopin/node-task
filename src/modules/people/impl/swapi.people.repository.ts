import { HttpService } from '@nestjs/axios';

import { Person } from '../people';
import { PeopleRepository } from '../people.repository';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Collection } from '../../../common/collection';
import { SwapiRepository } from 'common/infra/swapi.repository';
import {
  SwapiPeopleReponse,
  SwapiPersonResponse,
} from './swapi.person.response';
import { PeopleSearchCriteria } from '../people.search-criteria';

@Injectable()
export class SwapiPeopleRepository
  extends SwapiRepository<Person>
  implements PeopleRepository
{
  constructor(
    private readonly httpService: HttpService,
    @Inject(CACHE_MANAGER) private readonly cache: Cache,
    configService: ConfigService,
  ) {
    super(configService, 'people');
  }

  private mapResponseToDomain(response: SwapiPersonResponse): Person {
    return {
      name: response.name,
    };
  }

  async find(criteria: PeopleSearchCriteria): Promise<Collection<Person>> {
    const cacheKey = `people:page=${criteria.page}`;

    try {
      const cachedPeopleJson = await this.cache.get<string | null>(cacheKey);
      if (cachedPeopleJson) {
        return Object.assign(Collection.empty(), JSON.parse(cachedPeopleJson));
      }

      const response = await firstValueFrom(
        this.httpService.get<SwapiPeopleReponse>(
          this.buildUrlForSearchCriteria(criteria),
        ),
      );

      const { count, results } = response.data;
      const people = results.map(this.mapResponseToDomain.bind(this));
      const collection = new Collection(count, criteria.page, people);
      await this.cache.set(cacheKey, JSON.stringify(collection));

      return collection;
    } catch {
      return Collection.empty();
    }
  }

  async findOneById(): Promise<Person | null> {
    throw new Error('Method not implemented.');
  }
}
