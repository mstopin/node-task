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
}
