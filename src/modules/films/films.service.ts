import { Inject, Injectable } from '@nestjs/common';
import { Film } from './film';
import { FILMS_REPOSITORY, FilmsRepository } from './films.repository';
import { FilmsSearchCriteria } from './films.search-criteria';
import { Collection } from '../../common/collection';

@Injectable()
export class FilmsService {
  constructor(
    @Inject(FILMS_REPOSITORY) private readonly filmsRepository: FilmsRepository,
  ) {}

  async find(searchCriteria: FilmsSearchCriteria): Promise<Collection<Film>> {
    return await this.filmsRepository.find(searchCriteria);
  }

  async findOneById(id: number): Promise<Film | null> {
    return await this.filmsRepository.findOneById(id);
  }

  async findOpeningsUniqueWordsWithOccurences(): Promise<Map<string, number>> {
    const films = await this.filmsRepository.findAll();
    const openings = films.map((film) => film.openingCrawl);

    const openingsUniqueWords: Map<string, number> = new Map();

    for (const opening of openings) {
      const words = opening
        .replace(/\r\n/g, ' ')
        .split(' ')
        .filter((s) => s.length > 0);

      for (const word of words) {
        if (openingsUniqueWords.get(word)) {
          openingsUniqueWords.set(word, openingsUniqueWords.get(word)! + 1);
        } else {
          openingsUniqueWords.set(word, 1);
        }
      }
    }

    return openingsUniqueWords;
  }
}
