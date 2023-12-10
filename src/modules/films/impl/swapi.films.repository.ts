import { HttpService } from '@nestjs/axios';

import { Film } from '../film';
import { FilmsRepository } from '../films.repository';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { Injectable } from '@nestjs/common';

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
export class SwapiFilmsRepository extends FilmsRepository {
  private readonly URL: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {
    super();
    this.URL = `${this.configService.getOrThrow('SWAPI_URL')}/films/`;
  }

  async findOneById(id: number): Promise<Film | null> {
    try {
      const response = await firstValueFrom(
        this.httpService.get<SwapiFilmResponse>(this.URL + id),
      );

      return this.responseToDomain(id, response.data);
    } catch {
      return null;
    }
  }

  async find(): Promise<Film[]> {
    try {
      const response = await firstValueFrom(
        this.httpService.get<SwapiFilmsReponse>(this.URL),
      );

      return response.data.results.map((r, i) => {
        return this.responseToDomain(i + 1, r);
      });
    } catch {
      return [];
    }
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

  private extractIdsFromUrls(urls: string[]): number[] {
    return urls.map((u) => {
      const match = u.match(/(\d+)\/$/);

      return match && match[1] ? Number(match[1]) : 0;
    });
  }
}
