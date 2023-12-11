import { Inject, Injectable } from '@nestjs/common';
import { Film } from './film';
import { FILMS_REPOSITORY, FilmsRepository } from './films.repository';
import { FilmsSearchCriteria } from './films.search-criteria';
import { Collection } from '../../common/collection';
import { FilmOpening } from './film-opening';
import { PeopleService } from 'modules/people/people.service';

@Injectable()
export class FilmsService {
  constructor(
    @Inject(FILMS_REPOSITORY) private readonly filmsRepository: FilmsRepository,
    private readonly peopleService: PeopleService,
  ) {}

  private async findAllNormalizedOpenings(): Promise<FilmOpening[]> {
    const films = await this.filmsRepository.findAll();

    return films
      .map((film) => film.opening)
      .map((opening) => opening.replace(/\r\n/g, ' '));
  }

  async find(searchCriteria: FilmsSearchCriteria): Promise<Collection<Film>> {
    return await this.filmsRepository.find(searchCriteria);
  }

  async findOneById(id: number): Promise<Film | null> {
    return await this.filmsRepository.findOneById(id);
  }

  async findOpeningsUniqueWordsWithOccurences(): Promise<Map<string, number>> {
    const openings = await this.findAllNormalizedOpenings();
    const openingsUniqueWords = new Map<string, number>();

    for (const opening of openings) {
      const words = opening.split(' ');

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

  async findMostPopularOpeningsCharacter(): Promise<[string, number][]> {
    const people = await this.peopleService.findAll();
    const openings = await this.findAllNormalizedOpenings();
    const peopleOpeningsOccurences = new Map<string, number>();

    for (const opening of openings) {
      for (const person of people) {
        if (!opening.includes(person.name)) continue;

        const count = peopleOpeningsOccurences.get(person.name) ?? 0;
        peopleOpeningsOccurences.set(person.name, count + 1);
      }
    }

    return Array.from(peopleOpeningsOccurences.entries())
      .sort(([_, occurencesA], [__, occurencesB]) => occurencesB - occurencesA)
      .reduce<[string, number][]>((result, person) => {
        if (!result.length) {
          return [...result, person];
        }

        if (result[result.length - 1][1] === person[1]) {
          return [...result, person];
        }

        return result;
      }, []);
  }
}
