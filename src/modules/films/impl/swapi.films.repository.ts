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

interface SwapiFilmResponse {
  title: string;
  episode_id: number;
  opening_crawl: string;
  director: string;
  producer: string;
  release_date: string;
  species: string[];
  starships: string[];
  vehicles: string[];
  characters: string[];
  planets: string[];
  created: string;
  edited: string;
}

interface SwapiFilmsReponse {
  count: number;
  next: string;
  previous: string;
  results: SwapiFilmResponse[];
}

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

  private responseToDomain(id: number, response: SwapiFilmResponse): Film {
    return {
      id,
      title: response.title,
      episodeId: response.episode_id,
      openingCrawl: response.opening_crawl,
      director: response.director,
      producer: response.producer,
      releasedAt: response.release_date,
      charactersIds: this.extractIdsFromUrls(response.characters),
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

  async find(criteria: FilmsSearchCriteria): Promise<Film[]> {
    try {
      const response = await firstValueFrom(
        this.httpService.get<SwapiFilmsReponse>(
          this.buildUrlForSearchCriteria(criteria),
        ),
      );

      return response.data.results.map((r, i) => {
        return this.responseToDomain(i + 1, r);
      });
    } catch {
      return [];
    }
  }

  async findOneById(id: number): Promise<Film | null> {
    const cacheKey = `films:${id}`;

    try {
      const cachedFilmJson = await this.cache.get<string | null>(cacheKey);
      if (cachedFilmJson) {
        return JSON.parse(cachedFilmJson);
      }

      const response = await firstValueFrom(
        this.httpService.get<SwapiFilmResponse>(this.URL + id),
      );

      const film = this.responseToDomain(id, response.data);
      await this.cache.set(cacheKey, JSON.stringify(film));

      return film;
    } catch {
      return null;
    }
  }
}
