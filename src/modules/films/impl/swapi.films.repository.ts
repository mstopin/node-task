import { HttpService } from '@nestjs/axios';

import { Film } from '../film';
import { FilmsRepository } from '../films.repository';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { FilmsSearchCriteria } from '../films.search-criteria';
import { Collection } from '../../../common/collection';
import { SwapiFilmResponse, SwapiFilmsReponse } from './swapi.film.response';
import { SwapiRepository } from 'common/infra/swapi.repository';

@Injectable()
export class SwapiFilmsRepository
  extends SwapiRepository
  implements FilmsRepository
{
  constructor(
    private readonly httpService: HttpService,
    @Inject(CACHE_MANAGER) private readonly cache: Cache,
    configService: ConfigService,
  ) {
    super(configService, 'films');
  }

  private mapResponseToDomain(response: SwapiFilmResponse): Film {
    return {
      title: response.title,
      episodeId: response.episode_id,
      openingCrawl: response.opening_crawl,
      director: response.director,
      producer: response.producer,
      releasedAt: response.release_date,
      planetsIds: this.extractIdsFromUrls(response.planets),
      starshipsIds: this.extractIdsFromUrls(response.starships),
      vehiclesIds: this.extractIdsFromUrls(response.vehicles),
      speciesIds: this.extractIdsFromUrls(response.species),
      createdAt: response.created,
      editedAt: response.edited,
    };
  }

  async findAll(): Promise<Film[]> {
    const films: Film[] = [];

    let page = 1;
    let numberPages = Number.MAX_VALUE;

    while (page <= numberPages) {
      const collection = await this.find({ page });

      films.push(...collection.data);

      page++;
      numberPages = collection.numberPages;
    }

    return films;
  }

  async find(criteria: FilmsSearchCriteria): Promise<Collection<Film>> {
    const cacheKey = `films:page=${criteria.page}${
      criteria.title ? `:title=${criteria.title}` : ''
    }`;

    try {
      const cachedFilmsJson = await this.cache.get<string | null>(cacheKey);
      if (cachedFilmsJson) {
        return Object.assign(Collection.empty(), JSON.parse(cachedFilmsJson));
      }

      const response = await firstValueFrom(
        this.httpService.get<SwapiFilmsReponse>(
          this.buildUrlForSearchCriteria(criteria),
        ),
      );

      const { count, results } = response.data;
      const films = results.map(this.mapResponseToDomain.bind(this));
      const collection = new Collection(count, criteria.page, films);
      await this.cache.set(cacheKey, JSON.stringify(collection));

      return collection;
    } catch {
      return Collection.empty();
    }
  }

  async findOneById(id: number): Promise<Film | null> {
    const cacheKey = `films:id=${id}`;

    try {
      const cachedFilmJson = await this.cache.get<string | null>(cacheKey);
      if (cachedFilmJson) {
        return JSON.parse(cachedFilmJson);
      }

      const response = await firstValueFrom(
        this.httpService.get<SwapiFilmResponse>(this.URL + id),
      );

      const film = this.mapResponseToDomain(response.data);
      await this.cache.set(cacheKey, JSON.stringify(film));

      return film;
    } catch {
      return null;
    }
  }
}
