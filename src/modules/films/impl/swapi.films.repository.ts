import { HttpService } from '@nestjs/axios';
import { URL as Url } from 'node:url';

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

@Injectable()
export class SwapiFilmsRepository implements FilmsRepository {
  private readonly URL: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
    @Inject(CACHE_MANAGER) private readonly cache: Cache,
  ) {
    this.URL = `${this.configService.getOrThrow('SWAPI_URL')}/films/`;
  }

  private extractIdsFromUrls(urls: string[]): number[] {
    return urls.map((u) => {
      const match = u.match(/(\d+)\/$/);

      return match && match[1] ? Number(match[1]) : 0;
    });
  }

  private mapResponseToDomain(id: number, response: SwapiFilmResponse): Film {
    return {
      id,
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

  private buildUrlForSearchCriteria(criteria: FilmsSearchCriteria) {
    const url = new Url(`${this.URL}?page=${criteria.page}`);

    if (criteria.title) {
      url.searchParams.append('search', criteria.title);
    }

    return url.href;
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
      const films = results.map((r, i) => this.mapResponseToDomain(i + 1, r));
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

      const film = this.mapResponseToDomain(id, response.data);
      await this.cache.set(cacheKey, JSON.stringify(film));

      return film;
    } catch {
      return null;
    }
  }
}
